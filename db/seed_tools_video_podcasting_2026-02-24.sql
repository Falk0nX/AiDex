-- Add video + podcasting tools
-- Safe to run multiple times (dedupes by website_url)

INSERT INTO tools (name, website_url, description, category, pricing, tags, is_open_source, date_added)
SELECT * FROM (
  SELECT 'Descript','https://www.descript.com/','Edit video and podcasts like docs with AI transcription and voice tools.','Podcasting','Freemium','podcasting,editing,transcription,video',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'Riverside','https://riverside.fm/','Record studio-quality remote podcasts and video interviews with AI tools.','Podcasting','Freemium','podcasting,recording,remote-interviews,video',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'Podcastle','https://podcastle.ai/','AI-powered podcast recording, editing, and enhancement platform.','Podcasting','Freemium','podcasting,audio-editing,voice-enhancement',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'Adobe Podcast','https://podcast.adobe.com/','Enhance speech quality and clean up podcast audio with AI.','Podcasting','Freemium','podcasting,audio-cleanup,speech-enhance',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'OpusClip','https://www.opus.pro/','Turn long-form videos into short viral clips with AI reframing/captions.','Video','Freemium','video,shorts,repurposing,clips',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'VEED','https://www.veed.io/','Online AI video editor with subtitles, translation, and social formats.','Video','Freemium','video,editing,subtitles,social',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'Synthesia','https://www.synthesia.io/','Create AI avatar videos for training, marketing, and explainers.','Video','Paid','video,avatars,training,marketing',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'Pika','https://pika.art/','Generate and edit videos from prompts with an AI-native workflow.','Video','Freemium','video,generation,text-to-video',0,'2026-02-24 00:00:00'
) AS v(name, website_url, description, category, pricing, tags, is_open_source, date_added)
WHERE NOT EXISTS (
  SELECT 1 FROM tools t WHERE t.website_url = v.website_url
);
