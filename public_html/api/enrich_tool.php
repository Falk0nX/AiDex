<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib.php';

require_method('POST');
require_csrf_for_post();
rate_limit_or_fail('enrich_tool', 20, 300);

$input = get_json_input();
$url = trim((string)($input['website_url'] ?? ''));
if ($url === '') json_error('Website URL is required');

$validUrl = filter_var($url, FILTER_VALIDATE_URL);
if (!$validUrl) json_error('Invalid website URL');
$scheme = strtolower((string)parse_url($url, PHP_URL_SCHEME));
if (!in_array($scheme, ['http', 'https'], true)) json_error('URL must be http or https');

$host = (string)parse_url($url, PHP_URL_HOST);
if ($host === '' || strtolower($host) === 'localhost' || str_ends_with(strtolower($host), '.local')) {
  json_error('Local URLs are not allowed');
}

$resolvedIp = gethostbyname($host);
if ($resolvedIp !== $host) {
  if (!filter_var($resolvedIp, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
    json_error('Private network URLs are not allowed');
  }
}

$urlsToTry = [$url];
$hostNoWww = preg_replace('/^www\./i', '', $host) ?: $host;
if (!str_starts_with(strtolower($host), 'www.')) {
  $urlsToTry[] = preg_replace('#^https?://#i', $scheme . '://www.', $url);
}
$urlsToTry[] = $scheme . '://' . $hostNoWww;
$urlsToTry[] = $scheme . '://www.' . $hostNoWww;
$urlsToTry = array_values(array_unique(array_filter($urlsToTry)));

$html = false;
$lastErr = '';

foreach ($urlsToTry as $tryUrl) {
  if (function_exists('curl_init')) {
    $ch = curl_init($tryUrl);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_MAXREDIRS => 5,
      CURLOPT_CONNECTTIMEOUT => 4,
      CURLOPT_TIMEOUT => 8,
      CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36',
      CURLOPT_HTTPHEADER => [
        'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language: en-US,en;q=0.9',
      ],
      CURLOPT_SSL_VERIFYPEER => true,
      CURLOPT_SSL_VERIFYHOST => 2,
    ]);
    $res = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    if ($res !== false && $code >= 200 && $code < 400) {
      $html = $res;
      curl_close($ch);
      break;
    }
    $lastErr = 'curl ' . $code . ' ' . curl_error($ch);
    curl_close($ch);
  }

  if ($html === false) {
    $ctx = stream_context_create([
      'http' => [
        'timeout' => 8,
        'follow_location' => 1,
        'max_redirects' => 5,
        'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36',
        'header' => "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.9\r\n",
      ],
      'ssl' => [
        'verify_peer' => true,
        'verify_peer_name' => true,
      ],
    ]);
    $res = @file_get_contents($tryUrl, false, $ctx);
    if ($res !== false) {
      $html = $res;
      break;
    }
    $lastErr = 'file_get_contents failed';
  }
}

if ($html === false) {
  error_log('AiDex enrich_tool fetch failed for ' . $url . ' (' . $lastErr . ')');
  json_error('Could not read website metadata');
}

$html = mb_substr((string)$html, 0, 350000);

libxml_use_internal_errors(true);
$doc = new DOMDocument();
@$doc->loadHTML($html);
libxml_clear_errors();

function meta_content(DOMDocument $doc, string $attr, string $value): string {
  $xp = new DOMXPath($doc);
  $query = sprintf('//meta[translate(@%s,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="%s"]/@content', $attr, strtolower($value));
  $n = $xp->query($query);
  if ($n && $n->length > 0) return trim((string)$n->item(0)->nodeValue);
  return '';
}

$title = trim((string)($doc->getElementsByTagName('title')->item(0)?->textContent ?? ''));
$ogTitle = meta_content($doc, 'property', 'og:title');
$siteName = meta_content($doc, 'property', 'og:site_name');
$metaDesc = meta_content($doc, 'name', 'description');
$ogDesc = meta_content($doc, 'property', 'og:description');
$keywords = meta_content($doc, 'name', 'keywords');

$name = $siteName ?: ($ogTitle ?: $title);
$name = preg_replace('/\s*[\|\-–:].*$/u', '', (string)$name) ?? (string)$name;
$name = trim($name);
if ($name === '') $name = ucfirst((string)preg_replace('/^www\./', '', $host));
$name = mb_substr($name, 0, 120);

$description = $metaDesc ?: $ogDesc;
if ($description === '') {
  $bodyText = trim(preg_replace('/\s+/u', ' ', strip_tags($html)) ?? '');
  $description = mb_substr($bodyText, 0, 220);
}
$description = trim($description);
$description = mb_substr($description, 0, 500);

$textForGuess = strtolower($title . ' ' . $description . ' ' . $keywords . ' ' . $host);

$category = 'Education';
if (str_contains($textForGuess, 'video')) $category = 'Video';
if (str_contains($textForGuess, 'podcast') || str_contains($textForGuess, 'audio')) $category = 'Podcasting';
if (str_contains($textForGuess, 'image') || str_contains($textForGuess, 'photo')) $category = 'Image Generation';
if (str_contains($textForGuess, 'code') || str_contains($textForGuess, 'developer')) $category = 'Coding';
if (str_contains($textForGuess, 'voice') || str_contains($textForGuess, 'speech')) $category = 'Voice';
if (str_contains($textForGuess, 'model') || str_contains($textForGuess, 'llm')) $category = 'Models';
if (str_contains($textForGuess, 'music')) $category = 'Music';

$pricing = 'Freemium';
if (str_contains($textForGuess, 'open source') || str_contains($textForGuess, 'github.com')) $pricing = 'Open Source';
elseif (str_contains($textForGuess, 'free plan') || str_contains($textForGuess, 'freemium')) $pricing = 'Freemium';
elseif (str_contains($textForGuess, 'pricing') || str_contains($textForGuess, 'subscription') || str_contains($textForGuess, 'paid')) $pricing = 'Paid';
elseif (str_contains($textForGuess, 'free')) $pricing = 'Free';

$tagPool = [];
foreach (preg_split('/[,;|]/', strtolower($keywords)) ?: [] as $k) {
  $k = trim($k);
  if ($k !== '' && mb_strlen($k) <= 30) $tagPool[] = $k;
}

foreach (['ai','automation','productivity','video','podcasting','audio','editing','generator','chatbot','transcription','voice','coding','design'] as $hint) {
  if (str_contains($textForGuess, $hint)) $tagPool[] = $hint;
}

$tagPool = array_values(array_unique(array_filter($tagPool, fn($t) => $t !== '')));
$tagPool = array_slice($tagPool, 0, 8);
$tags = implode(',', $tagPool);

json_ok([
  'name' => $name,
  'description' => $description,
  'category' => $category,
  'pricing' => $pricing,
  'tags' => $tags,
]);
