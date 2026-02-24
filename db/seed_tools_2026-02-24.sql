-- Incremental seed for missing tools/categories requested on 2026-02-24
-- Safe to run multiple times (uses WHERE NOT EXISTS on website_url)

INSERT INTO tools (name, website_url, description, category, pricing, tags, is_open_source, date_added)
SELECT * FROM (
  SELECT 'Midjourney','https://www.midjourney.com/','Popular AI image generation platform via Discord and web.','Image Generation','Paid','art,design,generative-images',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'Leonardo AI','https://leonardo.ai/','AI image generation platform for creatives and teams.','Image Generation','Freemium','images,creative,design',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'Ideogram','https://ideogram.ai/','Image generation model known for strong text rendering in images.','Image Generation','Freemium','typography,images,text-in-image',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'Stable Diffusion','https://stability.ai/stable-image','Open image model family for generating and editing visuals.','Image Generation','Open Source','diffusion,images,open-models',1,'2026-02-24 00:00:00' UNION ALL
  SELECT 'DALL·E','https://openai.com/dall-e','Text-to-image model for creating images from prompts.','Image Generation','Paid','text-to-image,creative',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'Runway','https://runwayml.com/','Creative suite for AI video and image generation/editing.','Image Generation','Freemium','video,image,creative',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'OpenAI GPT-4.1','https://openai.com/','General-purpose multimodal model family for chat and automation.','Models','Paid','llm,multimodal,api',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'Claude 3.7 Sonnet','https://www.anthropic.com/claude','Anthropic model focused on strong coding and reasoning.','Models','Paid','llm,reasoning,coding',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'Gemini 2.0','https://deepmind.google/technologies/gemini/','Google multimodal model family for text, code, image, and more.','Models','Paid','llm,multimodal,google',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'Llama 3.1','https://www.llama.com/','Open-weight Meta model family widely used for self-hosted AI.','Models','Open Source','open-weights,self-hosted,llm',1,'2026-02-24 00:00:00' UNION ALL
  SELECT 'Mistral Large','https://mistral.ai/','Frontier language model from Mistral for enterprise and devs.','Models','Paid','llm,enterprise,api',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'Qwen 2.5','https://qwenlm.github.io/','Open model series with strong multilingual and coding capabilities.','Models','Open Source','open-models,multilingual,coding',1,'2026-02-24 00:00:00' UNION ALL
  SELECT 'DeepSeek-V3','https://www.deepseek.com/','High-performance language model for coding and reasoning workloads.','Models','Freemium','llm,coding,reasoning',0,'2026-02-24 00:00:00' UNION ALL
  SELECT 'FLUX.1','https://blackforestlabs.ai/','Modern image model family from Black Forest Labs.','Models','Freemium','image-models,generative,flux',0,'2026-02-24 00:00:00'
) AS v(name, website_url, description, category, pricing, tags, is_open_source, date_added)
WHERE NOT EXISTS (
  SELECT 1 FROM tools t WHERE t.website_url = v.website_url
);
