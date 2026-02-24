-- Add Music category tools
-- Safe to run multiple times (dedupes by website_url)

INSERT INTO tools (name, website_url, description, category, pricing, tags, is_open_source, date_added)
SELECT * FROM (
  SELECT 'Suno','https://suno.com/','Generate full songs with vocals and instrumentals from text prompts.','Music','Freemium','music-generation,songwriting,vocals,text-to-music',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'Udio','https://www.udio.com/','AI music generator for producing high-quality tracks from prompts.','Music','Freemium','music-generation,audio,creative,text-to-music',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'AIVA','https://www.aiva.ai/','Compose soundtrack-style music for creators, games, and films.','Music','Freemium','composition,soundtrack,orchestral,creators',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'Soundraw','https://soundraw.io/','Create royalty-free music with customizable structure and mood.','Music','Paid','royalty-free,background-music,customization',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'Boomy','https://boomy.com/','Create and publish AI-generated songs quickly for streaming platforms.','Music','Freemium','music-creation,publishing,streaming',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'Mubert','https://mubert.com/','Generate AI music for content, apps, and live streams.','Music','Freemium','background-music,streaming,api,audio',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'Beatoven.ai','https://www.beatoven.ai/','AI-generated mood-based music for videos and podcasts.','Music','Freemium','music-for-video,podcasts,mood-based,royalty-free',0,'2026-02-24 00:00:00'
) AS v(name, website_url, description, category, pricing, tags, is_open_source, date_added)
WHERE NOT EXISTS (
  SELECT 1 FROM tools t WHERE t.website_url = v.website_url
);
