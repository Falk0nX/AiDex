export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  scheduledAt?: string;
  author: string;
  tags: string[];
  category: string;
};

export const BLOG_POSTS: BlogPost[] = [
  // PUBLISHED - 4 posts
  {
    id: "1",
    title: "Best AI Coding Assistants in 2026: Complete Comparison",
    slug: "best-ai-coding-assistants-2026",
    excerpt: "Compare the top AI coding tools including Cursor, Continue, and Tabby. Find the perfect AI pair programmer for your workflow.",
    content: "# Best AI Coding Assistants in 2026\n\nAI coding assistants have revolutionized how developers write code. In this guide, we compare the top tools...",
    publishedAt: "2026-02-15",
    author: "AiDex Team",
    tags: ["AI", "coding", "productivity", "tools", "comparison"],
    category: "Coding"
  },
  {
    id: "2", 
    title: "How to Run AI Models Locally: Ollama vs LocalAI",
    slug: "run-ai-models-locally-ollama-vs-localai",
    excerpt: "Learn how to run powerful AI models on your own hardware. A practical guide to self-hosted AI with Ollama and LocalAI.",
    content: "# How to Run AI Models Locally\n\nRunning AI models locally gives you privacy, control, and no API costs...",
    publishedAt: "2026-02-10",
    author: "AiDex Team",
    tags: ["self-hosted", "AI", "ollama", "localAI", "tutorial"],
    category: "Self-hosted"
  },
  {
    id: "3",
    title: "Top Free AI Image Generation Tools in 2026",
    slug: "free-ai-image-generation-tools-2026",
    excerpt: "Discover the best free AI image generation tools. Create stunning visuals without spending a dime.",
    content: "# Top Free AI Image Generation Tools\n\nAI image generation has become accessible to everyone...",
    publishedAt: "2026-02-05",
    author: "AiDex Team",
    tags: ["AI", "image generation", "free", "design"],
    category: "Image Generation"
  },
  {
    id: "4",
    title: "AI Tools for Productivity: Complete Guide 2026",
    slug: "ai-tools-for-productivity-guide-2026",
    excerpt: "Boost your productivity with AI. From Notion to Obsidian, discover tools that help you work smarter.",
    content: "# AI Tools for Productivity\n\nProductivity tools powered by AI can transform your workflow...",
    publishedAt: "2026-02-01",
    author: "AiDex Team",
    tags: ["AI", "productivity", "tools", "workflow"],
    category: "Productivity"
  },
  // SCHEDULED - 6 posts
  {
    id: "5",
    title: "Self-Hosted AI: Why You Should Run Your Own",
    slug: "self-hosted-ai-why-run-your-own",
    excerpt: "Thinking about self-hosting AI? Learn the benefits of running AI locally and how to get started.",
    content: "# Self-Hosted AI: Why You Should Run Your Own\n\nPrivacy, control, and cost savings...",
    publishedAt: "",
    scheduledAt: "2026-03-01",
    author: "AiDex Team",
    tags: ["self-hosted", "AI", "privacy", "tutorial"],
    category: "Self-hosted"
  },
  {
    id: "6",
    title: "Best AI Chatbots Compared: Find Your Perfect AI Companion",
    slug: "best-ai-chatbots-compared",
    excerpt: "Compare top AI chatbots like Perplexity and more. Find which one fits your needs for research and conversation.",
    content: "# Best AI Chatbots Compared\n\nThe world of AI chatbots is diverse...",
    publishedAt: "",
    scheduledAt: "2026-03-05",
    author: "AiDex Team",
    tags: ["AI", "chatbots", "comparison", "research"],
    category: "Chatbots"
  },
  {
    id: "7",
    title: "Open Source vs Paid AI Tools: What's Worth Your Money?",
    slug: "open-source-vs-paid-ai-tools",
    excerpt: "Should you pay for AI tools or go open source? We break down the pros and cons of each approach.",
    content: "# Open Source vs Paid AI Tools\n\nThe age-old debate continues...",
    publishedAt: "",
    scheduledAt: "2026-03-10",
    author: "AiDex Team",
    tags: ["open source", "AI", "tools", "pricing"],
    category: "Education"
  },
  {
    id: "8",
    title: "Getting Started with AI in 2026: A Beginner's Guide",
    slug: "getting-started-ai-2026-beginners",
    excerpt: "New to AI? This beginner's guide walks you through the best tools and concepts to get started.",
    content: "# Getting Started with AI in 2026\n\nArtificial Intelligence doesn't have to be intimidating...",
    publishedAt: "",
    scheduledAt: "2026-03-15",
    author: "AiDex Team",
    tags: ["AI", "beginner", "tutorial", "guide"],
    category: "Education"
  },
  {
    id: "9",
    title: "Best AI Voice Tools: TTS and STT Solutions Compared",
    slug: "best-ai-voice-tools-tts-stt",
    excerpt: "Explore the best AI voice tools for text-to-speech and speech-to-text. From ElevenLabs to Whisper.",
    content: "# Best AI Voice Tools\n\nVoice AI has advanced dramatically...",
    publishedAt: "",
    scheduledAt: "2026-03-20",
    author: "AiDex Team",
    tags: ["AI", "voice", "TTS", "STT", "audio"],
    category: "Voice"
  },
  {
    id: "10",
    title: "AI Tools for Developers: The Ultimate Guide",
    slug: "ai-tools-for-developers-ultimate-guide",
    excerpt: "A comprehensive guide to AI tools every developer should know about in 2026.",
    content: "# AI Tools for Developers\n\nDevelopers have more AI-powered options than ever...",
    publishedAt: "",
    scheduledAt: "2026-03-25",
    author: "AiDex Team",
    tags: ["AI", "developers", "coding", "tools", "guide"],
    category: "Coding"
  }
];

export function getPublishedPosts(): BlogPost[] {
  return BLOG_POSTS.filter(post => post.publishedAt);
}

export function getScheduledPosts(): BlogPost[] {
  return BLOG_POSTS.filter(post => !post.publishedAt && post.scheduledAt);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.slug === slug);
}
