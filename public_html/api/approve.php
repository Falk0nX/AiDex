<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib.php';
require_method('POST');
require_csrf_for_post();
$admin = ensure_admin();
rate_limit_or_fail('approve', 60, 300);
$input = get_json_input(); $id = (int)($input['id'] ?? 0); if ($id <= 0) json_error('Invalid submission id');
$pdo->beginTransaction();
try {
  $sel = $pdo->prepare('SELECT * FROM tool_submissions WHERE id = :id FOR UPDATE'); $sel->execute([':id' => $id]); $sub = $sel->fetch();
  if (!$sub) { $pdo->rollBack(); json_error('Submission not found', 404); }
  if ($sub['status'] !== 'pending') { $pdo->rollBack(); json_error('Submission is not pending'); }
  $ins = $pdo->prepare('INSERT INTO tools (name, website_url, description, category, pricing, tags, is_open_source, source_submission_id, needs_copy_review, copy_review_notes) VALUES (:name, :website_url, :description, :category, :pricing, :tags, :is_open_source, :source_submission_id, 1, :copy_review_notes)');
  $ins->execute([':name'=>$sub['name'],':website_url'=>$sub['website_url'],':description'=>$sub['description'],':category'=>$sub['category'],':pricing'=>$sub['pricing'],':tags'=>$sub['tags'],':is_open_source'=>(int)$sub['is_open_source'],':source_submission_id'=>$id,':copy_review_notes'=>'Auto-approved: review description/tags quality']);
  $toolId = (int)$pdo->lastInsertId();
  $upd = $pdo->prepare('UPDATE tool_submissions SET status = "approved", reviewed_by_admin_id = :admin_id, reviewed_at = NOW(), approved_tool_id = :tool_id WHERE id = :id');
  $upd->execute([':admin_id' => $admin['id'], ':tool_id' => $toolId, ':id' => $id]);
  $pdo->commit();
} catch (Throwable $e) { if ($pdo->inTransaction()) $pdo->rollBack(); json_error('Failed to approve submission', 500); }
json_ok(['message' => 'Approved']);
