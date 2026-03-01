<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib.php';
require_method('POST');
rate_limit_or_fail('vote', 120, 300);

$input = get_json_input();
$toolId = (int)($input['tool_id'] ?? 0);
$vote = (string)($input['vote'] ?? '');
if ($toolId <= 0) json_error('Invalid tool_id');
if (!in_array($vote, ['up', 'down'], true)) json_error('Invalid vote value');
$voteValue = $vote === 'up' ? 1 : -1;

$ip = $_SERVER['REMOTE_ADDR'] ?? '';
$ua = substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255);
$fingerprint = hash('sha256', $ip . '|' . $ua);

$pdo->beginTransaction();
try {
  $exists = $pdo->prepare('SELECT id FROM tools WHERE id = :id LIMIT 1');
  $exists->execute(['id' => $toolId]);
  if (!$exists->fetch()) {
    $pdo->rollBack();
    json_error('Tool not found', 404);
  }

  $sel = $pdo->prepare('SELECT vote_value FROM tool_votes WHERE tool_id = :tool_id AND voter_fingerprint = :fp LIMIT 1');
  $sel->execute(['tool_id' => $toolId, 'fp' => $fingerprint]);
  $prev = $sel->fetch();

  if ($prev) {
    $prevValue = (int)$prev['vote_value'];
    if ($prevValue !== $voteValue) {
      $upd = $pdo->prepare('UPDATE tool_votes SET vote_value = :vote_value WHERE tool_id = :tool_id AND voter_fingerprint = :fp');
      $upd->execute(['vote_value' => $voteValue, 'tool_id' => $toolId, 'fp' => $fingerprint]);

      if ($voteValue === 1) {
        $pdo->prepare('UPDATE tools SET upvotes = upvotes + 1, downvotes = GREATEST(downvotes - 1, 0) WHERE id = :id')->execute(['id' => $toolId]);
      } else {
        $pdo->prepare('UPDATE tools SET downvotes = downvotes + 1, upvotes = GREATEST(upvotes - 1, 0) WHERE id = :id')->execute(['id' => $toolId]);
      }
    }
  } else {
    $ins = $pdo->prepare('INSERT INTO tool_votes (tool_id, voter_fingerprint, vote_value) VALUES (:tool_id, :fp, :vote_value)');
    $ins->execute(['tool_id' => $toolId, 'fp' => $fingerprint, 'vote_value' => $voteValue]);

    if ($voteValue === 1) {
      $pdo->prepare('UPDATE tools SET upvotes = upvotes + 1 WHERE id = :id')->execute(['id' => $toolId]);
    } else {
      $pdo->prepare('UPDATE tools SET downvotes = downvotes + 1 WHERE id = :id')->execute(['id' => $toolId]);
    }
  }

  $count = $pdo->prepare('SELECT upvotes, downvotes FROM tools WHERE id = :id LIMIT 1');
  $count->execute(['id' => $toolId]);
  $row = $count->fetch();

  $pdo->commit();
  json_ok([
    'tool_id' => $toolId,
    'upvotes' => (int)($row['upvotes'] ?? 0),
    'downvotes' => (int)($row['downvotes'] ?? 0),
  ]);
} catch (Throwable $e) {
  if ($pdo->inTransaction()) $pdo->rollBack();
  json_error('Vote failed', 500);
}
