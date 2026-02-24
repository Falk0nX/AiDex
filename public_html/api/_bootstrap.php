<?php
declare(strict_types=1);
ini_set('display_errors', '0');
error_reporting(E_ALL);
$cookieSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
session_set_cookie_params(['lifetime'=>0,'path'=>'/','domain'=>'','secure'=>$cookieSecure,'httponly'=>true,'samesite'=>'Lax']);
if (session_status() !== PHP_SESSION_ACTIVE) session_start();
header('Content-Type: application/json; charset=utf-8');
function aidex_load_db_config(): void {
  $candidates = [];
  $envPath = getenv('AIDEX_DB_CONFIG'); if ($envPath) $candidates[] = $envPath;
  $home = $_SERVER['HOME'] ?? getenv('HOME') ?: null; if ($home) $candidates[] = rtrim($home, '/').'/aidex-config/db.php';
  $candidates[] = dirname(__DIR__, 3).'/aidex-config/db.php';
  foreach ($candidates as $path) { if ($path && is_file($path)) { require_once $path; return; } }
  http_response_code(500); echo json_encode(['ok'=>false,'error'=>'Database config not found']); exit;
}
aidex_load_db_config();
if (!function_exists('db_connect')) { http_response_code(500); echo json_encode(['ok'=>false,'error'=>'db_connect() missing in config']); exit; }
$pdo = db_connect();
if (!$pdo instanceof PDO) { http_response_code(500); echo json_encode(['ok'=>false,'error'=>'db_connect() must return PDO']); exit; }
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
