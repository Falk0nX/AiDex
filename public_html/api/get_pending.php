<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib.php';
require_method('GET');
ensure_admin();
rate_limit_or_fail('get_pending', 120, 300);
$stmt = $pdo->query('SELECT id, name, website_url, description, category, pricing, tags, is_open_source, status, created_at FROM tool_submissions WHERE status = "pending" ORDER BY created_at ASC');
json_ok(['items' => $stmt->fetchAll()]);
