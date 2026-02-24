<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib.php';
require_method('POST');
require_csrf_for_post();
ensure_admin();
rate_limit_or_fail('update_tool_visibility', 120, 300);

$input = get_json_input();
$id = (int)($input['id'] ?? 0);
$hidden = !empty($input['hidden']) ? 1 : 0;
if ($id <= 0) json_error('Invalid tool id');

$upd = $pdo->prepare('UPDATE tools SET is_hidden = :hidden WHERE id = :id');
$upd->execute([':hidden' => $hidden, ':id' => $id]);
if ($upd->rowCount() === 0) {
  $chk = $pdo->prepare('SELECT id FROM tools WHERE id = :id');
  $chk->execute([':id' => $id]);
  if (!$chk->fetch()) json_error('Tool not found', 404);
}

json_ok(['message' => $hidden ? 'Tool hidden' : 'Tool visible']);
