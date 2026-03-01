<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib.php';
require_method('POST');
require_csrf_for_post();
ensure_admin();
rate_limit_or_fail('update_tool_copy', 120, 300);

$input = get_json_input();
$id = (int)($input['id'] ?? 0);
if ($id <= 0) json_error('Invalid tool id');

$name = trim((string)($input['name'] ?? ''));
$description = trim((string)($input['description'] ?? ''));
$category = trim((string)($input['category'] ?? ''));
$pricing = trim((string)($input['pricing'] ?? ''));
$tags = trim((string)($input['tags'] ?? ''));
$notes = trim((string)($input['copy_review_notes'] ?? ''));

if ($name === '' || mb_strlen($name) > AIDEX_NAME_MAX) json_error('Invalid name');
if ($description === '' || mb_strlen($description) > AIDEX_DESC_MAX) json_error('Invalid description');
if ($category === '' || mb_strlen($category) > 100) json_error('Invalid category');
$allowedPricing = ['Free', 'Freemium', 'Paid', 'Open Source'];
if (!in_array($pricing, $allowedPricing, true)) json_error('Invalid pricing');
$tagArr = normalize_tags($tags);
if (mb_strlen($notes) > 500) json_error('Review notes too long');

$upd = $pdo->prepare('UPDATE tools SET name = :name, description = :description, category = :category, pricing = :pricing, tags = :tags, is_open_source = :is_open_source, copy_review_notes = :copy_review_notes WHERE id = :id');
$upd->execute([
  ':name' => $name,
  ':description' => $description,
  ':category' => $category,
  ':pricing' => $pricing,
  ':tags' => implode(',', $tagArr),
  ':is_open_source' => $pricing === 'Open Source' ? 1 : 0,
  ':copy_review_notes' => $notes === '' ? null : $notes,
  ':id' => $id,
]);
if ($upd->rowCount() === 0) {
  // Could be same values; still verify tool exists.
  $chk = $pdo->prepare('SELECT id FROM tools WHERE id = :id');
  $chk->execute([':id' => $id]);
  if (!$chk->fetch()) json_error('Tool not found', 404);
}

json_ok(['message' => 'Tool copy updated']);
