<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib.php';
require_method('POST');
require_csrf_for_post();
ensure_admin();
rate_limit_or_fail('delete_tool', 60, 300);

$input = get_json_input();
$id = (int)($input['id'] ?? 0);
if ($id <= 0) json_error('Invalid tool id');

$del = $pdo->prepare('DELETE FROM tools WHERE id = :id');
$del->execute([':id' => $id]);
if ($del->rowCount() === 0) json_error('Tool not found', 404);

json_ok(['message' => 'Tool deleted']);
