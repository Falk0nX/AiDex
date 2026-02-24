<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib.php';
require_method('GET');
ensure_admin();
rate_limit_or_fail('get_tools_admin', 120, 300);

$limit = (int)($_GET['limit'] ?? 300);
if ($limit < 1) $limit = 300;
if ($limit > 1000) $limit = 1000;

$stmt = $pdo->prepare('SELECT id, name, website_url, description, category, pricing, tags, is_open_source, is_hidden, needs_copy_review, copy_review_notes, date_added FROM tools ORDER BY date_added DESC, id DESC LIMIT :lim');
$stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
$stmt->execute();
$rows = $stmt->fetchAll();
foreach ($rows as &$r) {
  $r['is_open_source'] = (int)$r['is_open_source'] === 1;
  $r['is_hidden'] = (int)$r['is_hidden'] === 1;
  $r['needs_copy_review'] = (int)$r['needs_copy_review'] === 1;
}
unset($r);

json_ok(['items' => $rows]);
