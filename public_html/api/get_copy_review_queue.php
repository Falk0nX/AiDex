<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib.php';
require_method('GET');
ensure_admin();
rate_limit_or_fail('get_copy_review_queue', 120, 300);

$stmt = $pdo->query('SELECT id, name, website_url, description, category, pricing, tags, needs_copy_review, copy_review_notes, date_added FROM tools WHERE needs_copy_review = 1 ORDER BY date_added DESC, id DESC');
json_ok(['items' => $stmt->fetchAll()]);
