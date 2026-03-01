<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib.php';
require_method('POST');
require_csrf_for_post();
rate_limit_or_fail('admin_login', 10, 300);
$input = get_json_input(); $username = trim((string)($input['username'] ?? '')); $password = (string)($input['password'] ?? '');
if ($username === '' || $password === '') json_error('Username and password are required');
$stmt = $pdo->prepare('SELECT id, username, password_hash FROM admins WHERE username = :username LIMIT 1');
$stmt->execute([':username' => $username]); $admin = $stmt->fetch();
if (!$admin || !password_verify($password, (string)$admin['password_hash'])) json_error('Invalid credentials', 401);
session_regenerate_id(true); $_SESSION['admin_id'] = (int)$admin['id']; $_SESSION['admin_username'] = (string)$admin['username'];
json_ok(['admin' => ['id' => (int)$admin['id'], 'username' => (string)$admin['username']]]);
