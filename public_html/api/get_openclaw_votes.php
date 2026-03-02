<?php
require_once __DIR__ . '/_bootstrap.php';

header('Content-Type: application/json');

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
  // Tables might already exist - continue anyway
}

// Get all items with vote counts
$items = $pdo->query('SELECT id, name, upvotes, downvotes FROM openclaw_items ORDER BY name')->fetchAll();
echo json_encode(['ok' => true, 'items' => $items]);
