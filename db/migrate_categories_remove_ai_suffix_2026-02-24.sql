-- Normalize category names (remove redundant 'AI' suffix/prefix)

UPDATE tools SET category = 'Music' WHERE category = 'Music AI';
UPDATE tools SET category = 'Coding' WHERE category = 'Coding AI';
UPDATE tools SET category = 'Voice' WHERE category = 'Voice AI';
UPDATE tools SET category = 'Self-hosted' WHERE category = 'Self-hosted AI';
UPDATE tools SET category = 'Infrastructure' WHERE category = 'AI Infrastructure';
UPDATE tools SET category = 'Education' WHERE category = 'AI Education';
UPDATE tools SET category = 'Chatbots' WHERE category = 'AI Chatbots';

UPDATE tool_submissions SET category = 'Music' WHERE category = 'Music AI';
UPDATE tool_submissions SET category = 'Coding' WHERE category = 'Coding AI';
UPDATE tool_submissions SET category = 'Voice' WHERE category = 'Voice AI';
UPDATE tool_submissions SET category = 'Self-hosted' WHERE category = 'Self-hosted AI';
UPDATE tool_submissions SET category = 'Infrastructure' WHERE category = 'AI Infrastructure';
UPDATE tool_submissions SET category = 'Education' WHERE category = 'AI Education';
UPDATE tool_submissions SET category = 'Chatbots' WHERE category = 'AI Chatbots';
