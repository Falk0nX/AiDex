<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib.php';
require_method('POST');
require_csrf_for_post();
rate_limit_or_fail('submit', 10, 300);
$input = get_json_input(); $data = validate_submission($input);
$ua = substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255); $ipBin = get_client_ip_binary();
$stmt = $pdo->prepare('INSERT INTO tool_submissions (name, website_url, description, category, pricing, tags, is_open_source, submitted_ip, user_agent, status) VALUES (:name, :website_url, :description, :category, :pricing, :tags, :is_open_source, :submitted_ip, :user_agent, "pending")');
$stmt->execute([':name'=>$data['name'],':website_url'=>$data['website_url'],':description'=>$data['description'],':category'=>$data['category'],':pricing'=>$data['pricing'],':tags'=>$data['tags'],':is_open_source'=>$data['is_open_source'],':submitted_ip'=>$ipBin,':user_agent'=>$ua]);
json_ok(['message' => 'Submission received and pending review']);
