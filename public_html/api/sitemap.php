<?php
declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';

header_remove('Content-Type');
header('Content-Type: application/xml; charset=utf-8');

$base = 'https://aidex.online';
$rows = $pdo->query('SELECT id, date_added FROM tools ORDER BY date_added DESC, id DESC')->fetchAll();

echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
echo '  <url><loc>' . $base . '/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>' . "\n";
echo '  <url><loc>' . $base . '/leaderboard</loc><changefreq>daily</changefreq><priority>0.9</priority></url>' . "\n";
echo '  <url><loc>' . $base . '/compare</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>' . "\n";

foreach ($rows as $r) {
  $id = (int)$r['id'];
  $lastmod = (string)($r['date_added'] ?? '');
  $lastmodIso = '';
  if ($lastmod !== '') {
    $ts = strtotime($lastmod);
    if ($ts !== false) $lastmodIso = gmdate('c', $ts);
  }

  echo '  <url><loc>' . $base . '/tool/' . $id . '</loc>';
  if ($lastmodIso !== '') echo '<lastmod>' . htmlspecialchars($lastmodIso, ENT_QUOTES | ENT_XML1, 'UTF-8') . '</lastmod>';
  echo '<changefreq>weekly</changefreq><priority>0.7</priority></url>' . "\n";
}

echo "</urlset>\n";
