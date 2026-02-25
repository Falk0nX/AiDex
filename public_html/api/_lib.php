<?php
declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';
const AIDEX_NAME_MAX = 120;
const AIDEX_DESC_MAX = 500;
const AIDEX_TAGS_MAX = 10;
const AIDEX_TAG_LEN_MAX = 30;
function json_ok(array $data = []): void { echo json_encode(array_merge(['ok' => true], $data)); exit; }
function json_error(string $message, int $status = 400): void { http_response_code($status); echo json_encode(['ok' => false, 'error' => $message]); exit; }
function require_method(string $method): void { if (strtoupper($_SERVER['REQUEST_METHOD'] ?? '') !== strtoupper($method)) json_error('Method not allowed', 405); }
function get_json_input(): array { $raw = file_get_contents('php://input'); if (!$raw) return []; $data = json_decode($raw, true); if (!is_array($data)) json_error('Invalid JSON payload'); return $data; }
function get_client_ip_binary(): ?string { $ip = $_SERVER['REMOTE_ADDR'] ?? null; if (!$ip) return null; $bin = @inet_pton($ip); return $bin !== false ? $bin : null; }
function get_client_ip_text(): string { return $_SERVER['REMOTE_ADDR'] ?? 'unknown'; }
function normalize_tags(string $tagsCsv): array {
  $parts = array_filter(array_map('trim', explode(',', $tagsCsv)), fn($x) => $x !== '');
  $parts = array_values(array_unique($parts));
  if (count($parts) > AIDEX_TAGS_MAX) json_error('Too many tags (max '.AIDEX_TAGS_MAX.')');
  foreach ($parts as $tag) if (mb_strlen($tag) > AIDEX_TAG_LEN_MAX) json_error('Tag too long (max '.AIDEX_TAG_LEN_MAX.' chars)');
  return $parts;
}
function canonicalize_url_for_match(string $url): string {
  $url = trim($url);
  if ($url === '') return '';
  $parts = @parse_url($url);
  if (!is_array($parts)) return strtolower($url);

  $host = strtolower((string)($parts['host'] ?? ''));
  $host = preg_replace('/^www\./', '', $host) ?? $host;
  $path = (string)($parts['path'] ?? '');
  $path = preg_replace('#/+#', '/', $path) ?? $path;
  $path = rtrim($path, '/');
  if ($path === '') $path = '/';

  return $host . $path;
}

function validate_submission(array $input): array {
  $name = trim((string)($input['name'] ?? ''));
  $websiteUrl = trim((string)($input['website_url'] ?? ''));
  $description = trim((string)($input['description'] ?? ''));
  $category = trim((string)($input['category'] ?? ''));
  $pricing = trim((string)($input['pricing'] ?? ''));
  $tags = trim((string)($input['tags'] ?? ''));
  if ($name === '' || mb_strlen($name) > AIDEX_NAME_MAX) json_error('Invalid name');
  if ($description === '' || mb_strlen($description) > AIDEX_DESC_MAX) json_error('Invalid description');
  $validUrl = filter_var($websiteUrl, FILTER_VALIDATE_URL); if (!$validUrl) json_error('Invalid website URL');
  $scheme = strtolower((string)parse_url($websiteUrl, PHP_URL_SCHEME)); if (!in_array($scheme, ['http', 'https'], true)) json_error('URL must be http or https');
  $allowedPricing = ['Free', 'Freemium', 'Paid', 'Open Source']; if (!in_array($pricing, $allowedPricing, true)) json_error('Invalid pricing');
  if ($category === '' || mb_strlen($category) > 100) json_error('Invalid category');
  $tagArr = normalize_tags($tags);
  return ['name'=>$name,'website_url'=>$websiteUrl,'description'=>$description,'category'=>$category,'pricing'=>$pricing,'tags'=>implode(',', $tagArr),'is_open_source'=>$pricing === 'Open Source' ? 1 : 0];
}
function ensure_admin(): array { if (empty($_SESSION['admin_id'])) json_error('Unauthorized', 401); return ['id'=>(int)$_SESSION['admin_id'],'username'=>(string)($_SESSION['admin_username'] ?? '')]; }
function require_csrf_for_post(): void { if (strtoupper($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') return; $sent = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? ''; $stored = $_SESSION['csrf_token'] ?? ''; if (!$sent || !$stored || !hash_equals((string)$stored, (string)$sent)) json_error('Invalid CSRF token', 403); }
function rate_limit_or_fail(string $key, int $maxHits, int $windowSec): void {
  $ip = get_client_ip_text(); $bucket = intdiv(time(), $windowSec); $safe = preg_replace('/[^a-zA-Z0-9_.-]/', '_', $key);
  $file = sys_get_temp_dir() . '/aidex_rate_' . sha1($safe.'|'.$ip.'|'.$bucket) . '.json';
  $fh = fopen($file, 'c+'); if (!$fh) return;
  try { flock($fh, LOCK_EX); $raw = stream_get_contents($fh); $data = $raw ? json_decode($raw, true) : null; if (!is_array($data)) $data = ['count' => 0, 'ts' => time()]; $data['count'] = ((int)$data['count']) + 1; ftruncate($fh, 0); rewind($fh); fwrite($fh, json_encode($data)); if ($data['count'] > $maxHits) json_error('Too many requests, please try again later', 429); }
  finally { flock($fh, LOCK_UN); fclose($fh); }
}
