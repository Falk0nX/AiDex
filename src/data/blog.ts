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
  // PUBLISHED
  {
    id: "1",
    title: "Best AI Coding Assistants in 2026: My Take After Using All of Them",
    slug: "best-ai-coding-assistants-2026",
    excerpt: "I have tried every major AI coding tool. Here is what actually works and what does not.",
    content: "I have been writing code for years, and honestly? These AI assistants have changed how I work. But not all of them are worth your time.\n\nThe Big Three Worth Knowing\n\nCursor - The Smooth Operator\nCursor is basically VS Code but smarter. The first time it refactored a messy function into something clean while I made coffee, I was sold.\n\nWhat I like:\n- It just works. No config needed\n- The chat feature understands your whole codebase\n- Great for quick bug fixes\n\nWhat frustrates me:\n- The free tier is limited\n- Sometimes suggests things that do not fit your style\n- Can be pricey if you want the full version\n\nContinue - For the Privacy Crowd\nIf you do not want your code going to the cloud, Continue is your friend. It is open source and runs locally.\n\nThe setup took me about 30 minutes. Worth it if you are working on anything sensitive.\n\nTabby - Team Player\nTabby is built for teams who want to self-host. Think of it like having your own GitHub Copilot that lives on your servers.\n\nI will not lie - there is some setup involved. But if your company needs everything internal, this is probably your best bet.\n\nThe Verdict\n\nHonestly? I use Cursor for personal projects and Continue when I am working on something I cannot share. Both are solid.\n\nThe best one depends entirely on what you need. Try them both - they are free to start.",
    publishedAt: "2026-02-15",
    author: "AiDex Team",
    tags: ["AI", "coding", "Cursor", "Continue", "productivity"],
    category: "Coding"
  },
  {
    id: "2", 
    title: "Running AI on Your Own Computer: Ollama vs LocalAI",
    slug: "run-ai-models-locally-ollama-vs-localai",
    excerpt: "Tried running AI locally so you do not pay per-request. Here is what worked for me.",
    content: "Here is the thing about AI APIs - they add up fast. After spending $50 in one month on ChatGPT calls, I decided to figure out local options.\n\nOllama - Start Here\n\nIf you have never run a local AI model, Ollama is the way to go.\n\nI installed it on my Mac Mini (M1, nothing fancy) and had it running in 5 minutes. No really - 5 minutes.\n\nThe coolest part? I can ask it code questions while on a plane. No WiFi needed.\n\nIs it as smart as GPT-4? Nah. But for quick coding tasks and summarization? More than good enough.\n\nMy favorite use: feeding it my messy meeting notes and getting a clean summary.\n\nLocalAI - The Power User Route\n\nLocalAI is... more. More options, more flexibility, more complexity.\n\nYou can make it behave exactly like the OpenAI API. That means if you have existing code calling OpenAI, you can swap the URL and it just works.\n\nIt is like the difference between a toaster and a full kitchen. Both make food, but one does a lot more.\n\nWhich Should You Pick?\n\nStart with Ollama. If you outgrow it, you will know - and that is when LocalAI makes sense.",
    publishedAt: "2026-02-10",
    author: "AiDex Team",
    tags: ["self-hosted", "AI", "ollama", "localAI", "tutorial"],
    category: "Self-hosted"
  },
  {
    id: "3",
    title: "Free AI Image Generators That Do Not Suck in 2026",
    slug: "free-ai-image-generation-tools-2026",
    excerpt: "You do not need to pay for Midjourney. Here is what actually works for free.",
    content: "I was skeptical too. For years I thought free AI image generation meant garbage results. Turns out I was wrong.\n\nComfyUI - The Real Deal\n\nThis is what the pros use. Yeah, the interface looks like a spaghetti of nodes, but once you get it, you get it.\n\nThe workflow system is killer. Save your favorite generation setup, tweak it slightly each time, and boom - consistent results.\n\nThe learning curve is real though. Expect a weekend of frustrated YouTube tutorials before it clicks.\n\nStable Diffusion Web UI - The Accessible Option\n\nMore user-friendly than ComfyUI. One-click install, browser interface, decent defaults.\n\nGreat for beginners. You will outgrow it eventually, but it is perfect when you are starting.\n\nThe Real Talk\n\nThese will not replace Midjourney best work. But for:\n- Blog post images\n- Mockups\n- Concept art\n- Personal projects\n\nThey are absolutely good enough. And free.\n\nMy workflow now: Generate with SD, upscale if needed, done.",
    publishedAt: "2026-02-05",
    author: "AiDex Team",
    tags: ["AI", "image generation", "free", "Stable Diffusion", "ComfyUI"],
    category: "Image Generation"
  },
  {
    id: "4",
    title: "How I Use AI Every Day for Work (Without Losing My Mind)",
    slug: "ai-tools-for-productivity-guide-2026",
    excerpt: "Not another AI will replace us article. Here is how I actually use these tools to get stuff done.",
    content: "Here is what nobody talks about: using AI effectively is boring. There is no magic. It is just... practical.\n\nMy Daily AI Stack\n\nNotion AI - For Meeting Notes\nEvery meeting ends, I paste notes into Notion, hit the AI button, get a summary. Share with team. Done.\n\nBefore: 20 minutes of formatting\nAfter: 30 seconds\n\nClaude - For the Hard Stuff\nWhen I have something complex - a strategy document, a tricky email, code architecture - I talk to Claude.\n\nIt is like having a smart colleague who is always available and never gets annoyed at stupid questions.\n\nn8n - For Things That Repeat\nI set up a workflow that:\n1. Grabs form submissions from my website\n2. Summarizes them with AI\n3. Creates a task in my project manager\n4. Slacks me the summary\n\nSet it up once, forget it forever. That is the dream, and n8n delivers.\n\nThe Secret Nobody Tells You\n\nThe real productivity win is not the AI itself. It is figuring out which of YOUR tasks are repetitive.\n\nStart there. What is the thing you do three times a week that bores you? That is your AI target.",
    publishedAt: "2026-02-01",
    author: "AiDex Team",
    tags: ["AI", "productivity", "tools", "workflow"],
    category: "Productivity"
  },
  // SCHEDULED
  {
    id: "5",
    title: "Why I Stopped Sending My Data to OpenAI",
    slug: "self-hosted-ai-why-run-your-own",
    excerpt: "Privacy is not paranoia. Here is what made me switch to running AI locally.",
    content: "This is not a Big Tech is evil thing. It is just... I got uncomfortable.\n\nThe Realization\n\nI was pasting client names, internal project details, even the occasional screenshot into ChatGPT. And one day it clicked - I have no idea what happens to this data.\n\nThat is not a trust issue. That is just bad hygiene.\n\nWhat Changed\n\nI set up Ollama on a spare machine. Here is the thing: it is not as good as GPT-4. But it is good enough for 80% of what I was using the cloud for.\n\nCode reviews? Local.\nSummarizing internal docs? Local.\nDrafting emails? Local.\n\nFor that other 20% - the genuinely complex stuff - I still use cloud AI. But I think twice now about what goes in.\n\nThe Setup\n\nI will not lie, it took some messing around. But honestly? Less than setting up my first home media server.\n\nIf you are curious, start small. You do not need a GPU farm. An old laptop can run surprisingly decent models.",
    publishedAt: "",
    scheduledAt: "2026-03-01",
    author: "AiDex Team",
    tags: ["self-hosted", "AI", "privacy", "tutorial"],
    category: "Self-hosted"
  },
  {
    id: "6",
    title: "ChatGPT vs Claude vs Perplexity: Which One Actually Helps?",
    slug: "best-ai-chatbots-compared",
    excerpt: "I use all three daily. Here is the honest breakdown of when to use what.",
    content: "Here is my unpopular opinion: there is no best AI chatbot. They are different tools.\n\nWhen I Use Each\n\nClaude - The Thinking Partner\nFor anything that requires actual reasoning. Writing a complex doc? Architecting a system? Claude feels like thinking out loud with someone smart.\n\nWhat makes it different: it questions your assumptions. Gently, but consistently.\n\nChatGPT - The Utility Player\nIt is the most normal AI. Good at most things, great at nothing specific.\n\nGreat for: quick questions, code snippets, what is the syntax for X\n\nPerplexity - The Researcher\nI use this when I would have used Google.\n\nIt cites sources. That single feature makes it invaluable for anything where you need to verify information.\n\nThe Honest Comparison\n\nClaude - Writing something important\nChatGPT - Quick code help\nPerplexity - Learning something new\nClaude - Brainstorming\nPerplexity - Looking up current info\n\nThe Takeaway\n\nHaving all three is not wasteful. It is like having a hammer, a screwdriver, and a knife - different tools for different jobs.",
    publishedAt: "",
    scheduledAt: "2026-03-05",
    author: "AiDex Team",
    tags: ["AI", "chatbots", "comparison", "ChatGPT", "Claude", "Perplexity"],
    category: "Chatbots"
  },
  {
    id: "7",
    title: "Are Paid AI Tools Worth It? A Practical Answer",
    slug: "open-source-vs-paid-ai-tools",
    excerpt: "I pay for several AI subscriptions. Here is when it makes sense and when it does not.",
    content: "I will be honest: I was the free only guy for a long time. Then I calculated what my time was worth.\n\nThe Math\n\nLet us say you spend 2 hours a week on something AI could do in 20 minutes.\nThat is 1h40m saved times 52 weeks = 86 hours/year.\nIf your time is worth $50/hour... that is $4,300 in value.\n\nSuddenly $20/month does not seem crazy.\n\nWhen Free Makes Sense\n- Learning / experimenting\n- Non-work use\n- Privacy-critical projects\n- One-off tasks\n\nWhen Paid Makes Sense\n- Regular work use\n- Time-sensitive projects  \n- Need the best quality\n- Better support/features\n\nMy Stack (Paid and Free)\n\nPaid:\n- ChatGPT Plus - quick stuff\n- Claude Pro - serious writing\n\nFree:\n- Perplexity - research\n- Ollama - privacy stuff\n\nThe Bottom Line\n\nDo not pay just because. But do not refuse to pay because you are cheap either. Calculate your time value. That is the real answer.",
    publishedAt: "",
    scheduledAt: "2026-03-10",
    author: "AiDex Team",
    tags: ["open source", "AI", "tools", "pricing"],
    category: "Education"
  },
  {
    id: "8",
    title: "AI for Beginners: What Actually Works",
    slug: "getting-started-ai-2026-beginners",
    excerpt: "Skip the hype. Here is how to actually use AI without getting overwhelmed.",
    content: "If you are new to AI, here is what I wish someone told me:\n\nStart Stupid Simple\n\nDo not try to revolutionize your workflow. Do not learn all the tools. Do not read every AI newsletter.\n\nJust... try one thing.\n\nMy Recommendation: ChatGPT\n\nSign up. Ask it to help with something small. An email. A summary. Some code.\n\nThat is it. That is how you start.\n\nThe One Thing That Matters\n\nPrompting is a skill. But not in the way the internet thinks.\n\nYou do not need fancy prompt engineering. You need to be clear about what you want.\n\nBad: Help me with code\nGood: Write a Python function that takes a list of numbers and returns the average\n\nSee the difference? That is it. That is the secret.\n\nWhat to Avoid\n\nDo not:\n- Pay for anything immediately\n- Try to understand how AI works before using it\n- Feel bad when AI gets things wrong\n- Share anything sensitive you would not post publicly\n\nDo:\n- Experiment\n- Iterate on your prompts\n- Use it for boring stuff first\n\nThe Truth\n\nAI is not magic. It is a tool. And like any tool, you get better at using it by... using it.",
    publishedAt: "",
    scheduledAt: "2026-03-15",
    author: "AiDex Team",
    tags: ["AI", "beginner", "tutorial", "getting started"],
    category: "Education"
  },
  {
    id: "9",
    title: "AI Voice Tools That Do Not Sound Like Robots",
    slug: "best-ai-voice-tools-tts-stt",
    excerpt: "Tested a bunch of text-to-speech and transcription tools. Here is what does not suck.",
    content: "AI voice stuff used to be a joke. Talk to me, HAL. Now it is actually useful.\n\nText-to-Speech\n\nElevenLabs\nThis is the one everyone talks about. And yeah, it is that good.\n\nI generated an audiobook for a blog post. My wife listened to it in the car. Did not realize it was not a real person until I told her.\n\nUse for: content creation, accessibility, any audio\n\nThe Free Options\nElevenLabs has a free tier. It is limited but works for testing.\n\nFor free permanent use? Honestly, the quality gap is still big enough that I just pay.\n\nSpeech-to-Text\n\nWhisper\nOpenAI Whisper is incredible. And free. And runs locally.\n\nI use it to transcribe meeting recordings. It is better than Zoom built-in transcription. By a lot.\n\nAssemblyAI\nIf you need something more serious - enterprise stuff, compliance, real-time - this is the play.\n\nWhat I Use Daily\n\n- Whisper for transcription (free, local)\n- ElevenLabs for TTS when needed (free tier)\n\nThat is it. Two tools. Cover 95% of voice needs.",
    publishedAt: "",
    scheduledAt: "2026-03-20",
    author: "AiDex Team",
    tags: ["AI", "voice", "TTS", "STT", "ElevenLabs", "Whisper"],
    category: "Voice"
  },
  {
    id: "10",
    title: "AI Tools I Actually Use as a Developer",
    slug: "ai-tools-for-developers-ultimate-guide",
    excerpt: "Not a list of 100 tools. Just the ones I open every day.",
    content: "Here is my problem with best AI tools articles: they are always 50 tools long. Who has time for that?\n\nHere is what I actually use. That is it.\n\nDaily Drivers\n\nCursor (or Continue)\nI write code differently now. I start with a comment: TODO: build something and let AI fill it in.\n\nCursor is my editor. It is VS Code under the hood but with AI that actually understands context.\n\nPerplexity\nMy new Google. When I need to know how do I do X in React - Perplexity, not Google.\n\nThe citations mean I can verify things.\n\nClaude\nFor the hard problems. When I am architecting something, I think out loud with Claude. It is the best at following complex logic.\n\nThe Occasionals\n\n- Whisper: Transcribing stuff\n- ComfyUI: Random image needs\n- Ollama: When I cannot send data to the cloud\n\nThe Point\n\nYou do not need 20 tools. You need 3-4 that you actually use.\n\nFind what works for you. Ignore the rest.",
    publishedAt: "",
    scheduledAt: "2026-03-25",
    author: "AiDex Team",
    tags: ["AI", "developers", "coding", "tools"],
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
