<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib.php';
require_method('POST');
rate_limit_or_fail('vote', 120, 300);

// Auto-create tables if they don't exist
try {
  $pdo->exec('CREATE TABLE IF NOT EXISTS openclaw_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )');
  
  $pdo->exec('CREATE TABLE IF NOT EXISTS openclaw_votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    voter_fingerprint VARCHAR(64) NOT NULL,
    vote_value TINYINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_vote (item_id, voter_fingerprint),
    FOREIGN KEY (item_id) REFERENCES openclaw_items(id) ON DELETE CASCADE
  )');
} catch (Throwable $e) {
  // Tables might already exist or no permission - continue anyway
}

$input = get_json_input();
$itemName = trim((string)($input['item'] ?? ''));
$vote = (string)($input['vote'] ?? '');

if ($itemName === '') json_error('Invalid item name');
if (!in_array($vote, ['up', 'down'], true)) json_error('Invalid vote value');
$voteValue = $vote === 'up' ? 1 : -1;

$ip = $_SERVER['REMOTE_ADDR'] ?? '';
$ua = substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255);
$fingerprint = hash('sha256', $ip . '|' . $ua);

// Get or create item ID
$sel = $pdo->prepare('SELECT id FROM openclaw_items WHERE name = :name LIMIT 1');
$sel->execute(['name' => $itemName]);
$row = $sel->fetch();

if (!$row) {
  // Create the item first
  $ins = $pdo->prepare('INSERT INTO openclaw_items (name, upvotes, downvotes) VALUES (:name, 0, 0)');
  $ins->execute(['name' => $itemName]);
  $itemId = (int)$pdo->lastInsertId();
} else {
  $itemId = (int)$row['id'];
}

$pdo->beginTransaction();
try {
  $sel = $pdo->prepare('SELECT vote_value FROM openclaw_votes WHERE item_id = :item_id AND voter_fingerprint = :fp LIMIT 1');
  $sel->execute(['item_id' => $itemId, 'fp' => $fingerprint]);
  $prev = $sel->fetch();

  if ($prev) {
    $prevValue = (int)$prev['vote_value'];
    if ($prevValue !== $voteValue) {
      $upd = $pdo->prepare('UPDATE openclaw_votes SET vote_value = :vote_value WHERE item_id = :item_id AND voter_fingerprint = :fp');
      $upd->execute(['vote_value' => $voteValue, 'item_id' => $itemId, 'fp' => $fingerprint]);

      if ($voteValue === 1) {
        $pdo->prepare('UPDATE openclaw_items SET upvotes = upvotes + 1, downvotes = GREATEST(downvotes - 1, 0) WHERE id = :id')->execute(['id' => $itemId]);
      } else {
        $pdo->prepare('UPDATE openclaw_items SET downvotes = downvotes + 1, upvotes = GREATEST(upvotes - 1, 0) WHERE id = :id')->execute(['id' => $itemId]);
      }
    }
  } else {
    $ins = $pdo->prepare('INSERT INTO openclaw_votes (item_id, voter_fingerprint, vote_value) VALUES (:item_id, :fp, :vote_value)');
    $ins->execute(['item_id' => $itemId, 'fp' => $fingerprint, 'vote_value' => $voteValue]);

    if ($voteValue === 1) {
      $pdo->prepare('UPDATE openclaw_items SET upvotes = upvotes + 1 WHERE id = :id')->execute(['id' => $itemId]);
    } else {
      $pdo->prepare('UPDATE openclaw_items SET downvotes = downvotes + 1 WHERE id = :id')->execute(['id' => $itemId]);
    }
  }

  $count = $pdo->prepare('SELECT upvotes, downvotes FROM openclaw_items WHERE id = :id LIMIT 1');
  $count->execute(['id' => $itemId]);
  $result = $count->fetch();

  $pdo->commit();
  json_ok([
    'item' => $itemName,
    'upvotes' => (int)($result['upvotes'] ?? 0),
    'downvotes' => (int)($result['downvotes'] ?? 0),
  ]);
} catch (Throwable $e) {
  if ($pdo->inTransaction()) $pdo->rollBack();
  json_error('Vote failed', 500);
}
