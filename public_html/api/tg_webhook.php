<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib.php';
require_method('POST');

$raw = file_get_contents('php://input');
$update = json_decode($raw ?: '', true);
if (!is_array($update)) json_ok(['ok' => true]);

$alertConfig = [];
$candidates = [];
$home = $_SERVER['HOME'] ?? getenv('HOME') ?: null;
if ($home) $candidates[] = rtrim($home, '/') . '/aidex-config/alerts.php';
$candidates[] = dirname(__DIR__, 3) . '/aidex-config/alerts.php';
foreach ($candidates as $path) {
  if ($path && is_file($path)) {
    $loaded = @require $path;
    if (is_array($loaded)) $alertConfig = $loaded;
    break;
  }
}

$tgToken = trim((string)(getenv('AIDEX_TG_BOT_TOKEN') ?: ($alertConfig['telegram_bot_token'] ?? '')));
$tgChatId = trim((string)(getenv('AIDEX_TG_CHAT_ID') ?: ($alertConfig['telegram_chat_id'] ?? '')));
$actionSecret = trim((string)(getenv('AIDEX_TG_ACTION_SECRET') ?: ($alertConfig['telegram_action_secret'] ?? '')));
$webhookSecret = trim((string)(getenv('AIDEX_TG_WEBHOOK_SECRET') ?: ($alertConfig['telegram_webhook_secret'] ?? '')));

if ($webhookSecret !== '') {
  $hdr = (string)($_SERVER['HTTP_X_TELEGRAM_BOT_API_SECRET_TOKEN'] ?? '');
  if ($hdr === '' || !hash_equals($webhookSecret, $hdr)) {
    json_error('Unauthorized', 401);
  }
}

if ($tgToken === '' || $tgChatId === '' || $actionSecret === '') {
  json_ok(['ok' => true]);
}

$cb = $update['callback_query'] ?? null;
if (!is_array($cb)) json_ok(['ok' => true]);

$data = (string)($cb['data'] ?? '');
$callbackId = (string)($cb['id'] ?? '');
$fromId = (string)($cb['from']['id'] ?? '');
if ($fromId !== $tgChatId) {
  tg_answer_callback($tgToken, $callbackId, 'Not authorized.');
  json_ok(['ok' => true]);
}

$parts = explode(':', $data);
if (count($parts) !== 3) {
  tg_answer_callback($tgToken, $callbackId, 'Invalid action.');
  json_ok(['ok' => true]);
}

[$action, $idRaw, $sig] = $parts;
$id = (int)$idRaw;
if ($id <= 0 || !in_array($action, ['approve', 'reject'], true)) {
  tg_answer_callback($tgToken, $callbackId, 'Invalid action payload.');
  json_ok(['ok' => true]);
}

$expectedSig = substr(hash_hmac('sha256', "{$action}:{$id}", $actionSecret), 0, 12);
if (!hash_equals($expectedSig, $sig)) {
  tg_answer_callback($tgToken, $callbackId, 'Signature mismatch.');
  json_ok(['ok' => true]);
}

try {
  if ($action === 'approve') {
    $pdo->beginTransaction();
    $sel = $pdo->prepare('SELECT * FROM tool_submissions WHERE id = :id FOR UPDATE');
    $sel->execute([':id' => $id]);
    $sub = $sel->fetch();

    if (!$sub || $sub['status'] !== 'pending') {
      if ($pdo->inTransaction()) $pdo->rollBack();
      tg_answer_callback($tgToken, $callbackId, 'Already reviewed or missing.');
      json_ok(['ok' => true]);
    }

    $ins = $pdo->prepare('INSERT INTO tools (name, website_url, description, category, pricing, tags, is_open_source, source_submission_id) VALUES (:name, :website_url, :description, :category, :pricing, :tags, :is_open_source, :source_submission_id)');
    $ins->execute([
      ':name' => $sub['name'],
      ':website_url' => $sub['website_url'],
      ':description' => $sub['description'],
      ':category' => $sub['category'],
      ':pricing' => $sub['pricing'],
      ':tags' => $sub['tags'],
      ':is_open_source' => (int)$sub['is_open_source'],
      ':source_submission_id' => $id,
    ]);
    $toolId = (int)$pdo->lastInsertId();

    $upd = $pdo->prepare('UPDATE tool_submissions SET status = "approved", reviewed_by_admin_id = NULL, reviewed_at = NOW(), approved_tool_id = :tool_id WHERE id = :id');
    $upd->execute([':tool_id' => $toolId, ':id' => $id]);
    $pdo->commit();

    tg_answer_callback($tgToken, $callbackId, "Approved #{$id}");
    tg_edit_action_done($tgToken, $cb, "✅ Approved submission #{$id}");
  } else {
    $upd = $pdo->prepare('UPDATE tool_submissions SET status = "rejected", reviewed_by_admin_id = NULL, reviewed_at = NOW() WHERE id = :id AND status = "pending"');
    $upd->execute([':id' => $id]);
    if ($upd->rowCount() === 0) {
      tg_answer_callback($tgToken, $callbackId, 'Already reviewed or missing.');
      json_ok(['ok' => true]);
    }

    tg_answer_callback($tgToken, $callbackId, "Rejected #{$id}");
    tg_edit_action_done($tgToken, $cb, "❌ Rejected submission #{$id}");
  }
} catch (Throwable $e) {
  if ($pdo->inTransaction()) $pdo->rollBack();
  tg_answer_callback($tgToken, $callbackId, 'Action failed.');
  error_log('AiDex TG action failure: ' . $e->getMessage());
}

json_ok(['ok' => true]);

function tg_post(string $token, string $method, array $payload): void {
  $apiUrl = "https://api.telegram.org/bot{$token}/{$method}";
  if (function_exists('curl_init')) {
    $ch = curl_init($apiUrl);
    curl_setopt_array($ch, [
      CURLOPT_POST => true,
      CURLOPT_POSTFIELDS => http_build_query($payload),
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_CONNECTTIMEOUT => 2,
      CURLOPT_TIMEOUT => 4,
      CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
    ]);
    @curl_exec($ch);
    curl_close($ch);
    return;
  }

  $ctx = stream_context_create([
    'http' => [
      'method' => 'POST',
      'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
      'content' => http_build_query($payload),
      'timeout' => 4,
    ],
  ]);
  @file_get_contents($apiUrl, false, $ctx);
}

function tg_answer_callback(string $token, string $callbackId, string $text): void {
  if ($callbackId === '') return;
  tg_post($token, 'answerCallbackQuery', ['callback_query_id' => $callbackId, 'text' => $text, 'show_alert' => false]);
}

function tg_edit_action_done(string $token, array $callbackQuery, string $actionText): void {
  $msg = $callbackQuery['message'] ?? null;
  if (!is_array($msg)) return;

  $chatId = $msg['chat']['id'] ?? null;
  $messageId = $msg['message_id'] ?? null;
  $baseText = trim((string)($msg['text'] ?? ''));
  if ($chatId === null || $messageId === null || $baseText === '') return;

  $newText = $baseText . "\n\n" . $actionText;
  tg_post($token, 'editMessageText', [
    'chat_id' => $chatId,
    'message_id' => $messageId,
    'text' => $newText,
    'disable_web_page_preview' => true,
  ]);
}
