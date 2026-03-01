<?php
declare(strict_types=1);
ini_set('display_errors', '0');
error_reporting(E_ALL);
$cookieSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
session_set_cookie_params(['lifetime'=>0,'path'=>'/','domain'=>'','secure'=>$cookieSecure,'httponly'=>true,'samesite'=>'Lax']);
if (session_status() !== PHP_SESSION_ACTIVE) session_start();
header('Content-Type: application/json; charset=utf-8');

$configPaths = [
  '/var/www/aidex-config/db.php',           // Docker
  '/var/www/html/aidex-config/db.php',       // Docker alt
  dirname(__DIR__, 1).'/../aidex-config/db.php', // Local relative
  dirname(__DIR__, 2).'/aidex-config/db.php',    // AiDex root
  getenv('HOME').'/aidex-config/db.php',        // Home directory
];

foreach ($configPaths as $path) {
  if (file_exists($path)) {
    require_once $path;
    break;
  }
}

if (!function_exists('db_connect')) { http_response_code(500); echo json_encode(['ok'=>false,'error'=>'Database config not found']); exit; }
$pdo = db_connect();
if (!$pdo instanceof PDO) { http_response_code(500); echo json_encode(['ok'=>false,'error'=>'db_connect() must return PDO']); exit; }
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
