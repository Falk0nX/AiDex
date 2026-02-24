<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib.php';
require_method('GET');
rate_limit_or_fail('get_tools', 300, 300);
$stmt = $pdo->query('SELECT id, name, website_url, description, category, pricing, tags, is_open_source, date_added FROM tools ORDER BY date_added DESC, id DESC');
$rows = $stmt->fetchAll(); foreach ($rows as &$r) $r['is_open_source'] = (int)$r['is_open_source'] === 1; unset($r);
json_ok(['items' => $rows]);
