<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib.php';
require_method('GET');

$action = (string)($_GET['action'] ?? '');
$id = (int)($_GET['id'] ?? 0);
$sig = (string)($_GET['sig'] ?? '');

if (!in_array($action, ['approve', 'reject'], true) || $id <= 0 || $sig === '') {
  tg_html('Invalid action request.', false);
}

$alertConfig = [];
$candidates = [];
$home = $_SERVER['HOME'] ?? getenv('HOME') ?: null;
if ($home) {
  $home = rtrim($home, '/');
  $candidates[] = $home . '/aidex-config/alerts.php';
  $candidates[] = $home . '/site/aidex-config/alerts.php';
}
$candidates[] = dirname(__DIR__, 3) . '/aidex-config/alerts.php';
$candidates[] = dirname(__DIR__, 2) . '/aidex-config/alerts.php';
foreach ($candidates as $path) {
  if ($path && is_file($path)) {
    $loaded = @require $path;
    if (is_array($loaded)) $alertConfig = $loaded;
    break;
  }
}

$actionSecret = trim((string)($alertConfig['telegram_action_secret'] ?? ''));
if ($actionSecret === '') $actionSecret = trim((string)(getenv('AIDEX_TG_ACTION_SECRET') ?: ''));
if ($actionSecret === '') tg_html('Action secret not configured.', false);

$expected = substr(hash_hmac('sha256', "{$action}:{$id}", $actionSecret), 0, 12);
if (!hash_equals($expected, $sig)) tg_html('Invalid signature.', false);

try {
  if ($action === 'approve') {
    $pdo->beginTransaction();
    $sel = $pdo->prepare('SELECT * FROM tool_submissions WHERE id = :id FOR UPDATE');
    $sel->execute([':id' => $id]);
    $sub = $sel->fetch();

    if (!$sub) {
      if ($pdo->inTransaction()) $pdo->rollBack();
      tg_html('Submission not found.', false);
    }
    if ($sub['status'] !== 'pending') {
      if ($pdo->inTransaction()) $pdo->rollBack();
      tg_html("Submission #{$id} was already reviewed.", true);
    }

    $ins = $pdo->prepare('INSERT INTO tools (name, website_url, description, category, pricing, tags, is_open_source, source_submission_id, needs_copy_review, copy_review_notes) VALUES (:name, :website_url, :description, :category, :pricing, :tags, :is_open_source, :source_submission_id, 1, :copy_review_notes)');
    $ins->execute([
      ':name' => $sub['name'],
      ':website_url' => $sub['website_url'],
      ':description' => $sub['description'],
      ':category' => $sub['category'],
      ':pricing' => $sub['pricing'],
      ':tags' => $sub['tags'],
      ':is_open_source' => (int)$sub['is_open_source'],
      ':source_submission_id' => $id,
      ':copy_review_notes' => 'Approved via Telegram: review copy quality',
    ]);
    $toolId = (int)$pdo->lastInsertId();

    $upd = $pdo->prepare('UPDATE tool_submissions SET status = "approved", reviewed_by_admin_id = NULL, reviewed_at = NOW(), approved_tool_id = :tool_id WHERE id = :id');
    $upd->execute([':tool_id' => $toolId, ':id' => $id]);
    $pdo->commit();
    tg_html("✅ Submission #{$id} approved and published.", true);
  }

  $upd = $pdo->prepare('UPDATE tool_submissions SET status = "rejected", reviewed_by_admin_id = NULL, reviewed_at = NOW() WHERE id = :id AND status = "pending"');
  $upd->execute([':id' => $id]);
  if ($upd->rowCount() === 0) {
    tg_html("Submission #{$id} was already reviewed.", true);
  }
  tg_html("❌ Submission #{$id} rejected.", true);
} catch (Throwable $e) {
  if ($pdo->inTransaction()) $pdo->rollBack();
  error_log('AiDex TG action endpoint failure: ' . $e->getMessage());
  tg_html('Action failed. Check logs.', false);
}

function tg_html(string $message, bool $ok): void {
  http_response_code($ok ? 200 : 400);
  header('Content-Type: text/html; charset=utf-8');
  echo '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">';
  echo '<title>AiDex Submission Action</title>';
  echo '<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#0b0b0f;color:#f5f5f5;padding:24px}';
  echo '.card{max-width:560px;margin:12vh auto;padding:20px;border:1px solid #2a2a34;border-radius:14px;background:#12121a}';
  echo '.ok{color:#86efac}.bad{color:#fda4af}</style></head><body>';
  echo '<div class="card"><h2>AiDex Moderation</h2><p class="' . ($ok ? 'ok' : 'bad') . '">' . htmlspecialchars($message, ENT_QUOTES, 'UTF-8') . '</p></div>';
  echo '</body></html>';
  exit;
}
