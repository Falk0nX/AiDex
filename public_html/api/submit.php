<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib.php';
require_method('POST');
require_csrf_for_post();
rate_limit_or_fail('submit', 10, 300);
$input = get_json_input(); $data = validate_submission($input);
$ua = substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255); $ipBin = get_client_ip_binary();
$stmt = $pdo->prepare('INSERT INTO tool_submissions (name, website_url, description, category, pricing, tags, is_open_source, submitted_ip, user_agent, status) VALUES (:name, :website_url, :description, :category, :pricing, :tags, :is_open_source, :submitted_ip, :user_agent, "pending")');
$stmt->execute([':name'=>$data['name'],':website_url'=>$data['website_url'],':description'=>$data['description'],':category'=>$data['category'],':pricing'=>$data['pricing'],':tags'=>$data['tags'],':is_open_source'=>$data['is_open_source'],':submitted_ip'=>$ipBin,':user_agent'=>$ua]);

// Optional Telegram alert (best-effort, non-blocking on failures)
$tgToken = trim((string)(getenv('AIDEX_TG_BOT_TOKEN') ?: ''));
$tgChatId = trim((string)(getenv('AIDEX_TG_CHAT_ID') ?: ''));

// Shared-hosting fallback: load from private config file if env vars are missing.
if ($tgToken === '' || $tgChatId === '') {
  $alertConfig = [];
  $candidates = [];
  $home = $_SERVER['HOME'] ?? getenv('HOME') ?: null;
  if ($home) {
    $candidates[] = rtrim($home, '/') . '/aidex-config/alerts.php';
  }
  $candidates[] = dirname(__DIR__, 3) . '/aidex-config/alerts.php';

  foreach ($candidates as $path) {
    if ($path && is_file($path)) {
      $loaded = @require $path;
      if (is_array($loaded)) {
        $alertConfig = $loaded;
      }
      break;
    }
  }

  if ($tgToken === '') $tgToken = trim((string)($alertConfig['telegram_bot_token'] ?? ''));
  if ($tgChatId === '') $tgChatId = trim((string)($alertConfig['telegram_chat_id'] ?? ''));
}

if ($tgToken !== '' && $tgChatId !== '') {
  try {
    $msg = "🆕 New AiDex submission\n"
      . "Name: {$data['name']}\n"
      . "Category: {$data['category']}\n"
      . "Pricing: {$data['pricing']}\n"
      . "URL: {$data['website_url']}\n"
      . "Tags: " . ($data['tags'] !== '' ? $data['tags'] : 'none');

    $apiUrl = "https://api.telegram.org/bot{$tgToken}/sendMessage";
    $payload = http_build_query([
      'chat_id' => $tgChatId,
      'text' => $msg,
      'disable_web_page_preview' => true,
    ]);

    $ctx = stream_context_create([
      'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
        'content' => $payload,
        'timeout' => 2,
      ],
      'ssl' => [
        'verify_peer' => true,
        'verify_peer_name' => true,
      ],
    ]);
    @file_get_contents($apiUrl, false, $ctx);
  } catch (Throwable $e) {
    // swallow notification failures so submission flow is never blocked
  }
}

json_ok(['message' => 'Submission received and pending review']);
