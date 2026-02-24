<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib.php';
require_method('GET');
if (empty($_SESSION['csrf_token'])) $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
json_ok(['csrf_token' => $_SESSION['csrf_token']]);
