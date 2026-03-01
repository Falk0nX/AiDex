<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib.php';
require_method('POST');
require_csrf_for_post();
$admin = ensure_admin();
rate_limit_or_fail('reject', 60, 300);
$input = get_json_input(); $id = (int)($input['id'] ?? 0); if ($id <= 0) json_error('Invalid submission id');
$upd = $pdo->prepare('UPDATE tool_submissions SET status = "rejected", reviewed_by_admin_id = :admin_id, reviewed_at = NOW() WHERE id = :id AND status = "pending"');
$upd->execute([':admin_id' => $admin['id'], ':id' => $id]);
if ($upd->rowCount() === 0) json_error('Submission not found or not pending', 404);
json_ok(['message' => 'Rejected']);
