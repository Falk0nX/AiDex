<?php
declare(strict_types=1);
ini_set('display_errors', '0');
error_reporting(E_ALL);
$cookieSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
session_set_cookie_params(['lifetime'=>0,'path'=>'/','domain'=>'','secure'=>$cookieSecure,'httponly'=>true,'samesite'=>'Lax']);
if (session_status() !== PHP_SESSION_ACTIVE) session_start();
header('Content-Type: application/json; charset=utf-8');

require_once '/var/www/aidex-config/db.php';

if (!function_exists('db_connect')) { http_response_code(500); echo json_encode(['ok'=>false,'error'=>'db_connect() missing in config']); exit; }
$pdo = db_connect();
if (!$pdo instanceof PDO) { http_response_code(500); echo json_encode(['ok'=>false,'error'=>'db_connect() must return PDO']); exit; }
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
