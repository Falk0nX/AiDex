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
    excerpt: "I've tried every major AI coding tool. Here's what actually works and what doesn't.",
    content: `I've been writing code for years, and honestly? These AI assistants have changed how I work. But not all of them are worth your time.

## The Big Three Worth Knowing

### Cursor - The Smooth Operator
Cursor is basically VS Code but smarter. The first time it refactored a messy function into something clean while I made coffee, I was sold.

What I like:
- It just works. No config needed
- The chat feature understands your whole codebase
- Great for quick bug fixes

What frustrates me:
- The free tier is limited
- Sometimes suggests things that don't fit your style
- Can be pricey if you want the full version

### Continue - For the Privacy Crowd
If you don't want your code going to the cloud, Continue is your friend. It's open source and runs locally.

The setup took me about 30 minutes. Worth it if you're working on anything sensitive.

### Tabby - Team Player
Tabby is built for teams who want to self-host. Think of it like having your own GitHub Copilot that lives on your servers.

I won't lie - there's some setup involved. But if your company needs everything internal, this is probably your best bet.

## The Verdict

Honestly? I use Cursor for personal projects and Continue when I'm working on something I can't share. Both are solid.

The "best" one depends entirely on what you need. Try them both - they're free to start.`,
    publishedAt: "2026-02-15",
    author: "AiDex Team",
    tags: ["AI", "coding", "Cursor", "Continue", "productivity"],
    category: "Coding"
  },
  {
    id: "2", 
    title: "Running AI on Your Own Computer: Ollama vs LocalAI",
    slug: "run-ai-models-locally-ollama-vs-localai",
    excerpt: "Tried running AI locally so you don't pay per-request. Here's what worked for me.",
    content: `Here's the thing about AI APIs - they add up fast. After spending $50 in one month on ChatGPT calls, I decided to figure out local options.

## Ollama - Start Here

If you've never run a local AI model, Ollama is the way to go.

I installed it on my Mac Mini (M1, nothing fancy) and had it running in 5 minutes. No really - 5 minutes.

The coolest part? I can ask it code questions while on a plane. No WiFi needed.

Is it as smart as GPT-4? Nah. But for quick coding tasks and summarization? More than good enough.

My favorite use: feeding it my messy meeting notes and getting a clean summary.

## LocalAI - The Power User Route

LocalAI is... more. More options, more flexibility, more complexity.

You can make it behave exactly like the OpenAI API. That means if you have existing code calling OpenAI, you can swap the URL and it just works.

It's like the difference between a toaster and a full kitchen. Both make food, but one does a lot more.

## Which Should You Pick?

Start with Ollama. If you outgrow it, you'll know - and that's when LocalAI makes sense.`,
    publishedAt: "2026-02-10",
    author: "AiDex Team",
    tags: ["self-hosted", "AI", "ollama", "localAI", "tutorial"],
    category: "Self-hosted"
  },
  {
    id: "3",
    title: "Free AI Image Generators That Don't Suck in 2026",
    slug: "free-ai-image-generation-tools-2026",
    excerpt: "You don't need to pay for Midjourney. Here's what actually works for free.",
    content: `I was skeptical too. For years I thought "free AI image generation" meant garbage results. Turns out I was wrong.

## ComfyUI - The Real Deal

This is what the pros use. Yeah, the interface looks like a spaghetti of nodes, but once you get it, you get it.

The workflow system is killer. Save your favorite generation setup, tweak it slightly each time, and boom - consistent results.

The learning curve is real though. Expect a weekend of frustrated YouTube tutorials before it clicks.

## Stable Diffusion Web UI - The Accessible Option

More user-friendly than ComfyUI. One-click install, browser interface, decent defaults.

Great for beginners. You'll outgrow it eventually, but it's perfect when you're starting.

## The Real Talk

These won't replace Midjourney's best work. But for:
- Blog post images
- Mockups
- Concept art
- Personal projects

They're absolutely good enough. And free.

My workflow now: Generate with SD, upscale if needed, done.`,
    publishedAt: "2026-02-05",
    author: "AiDex Team",
    tags: ["AI", "image generation", "free", "Stable Diffusion", "ComfyUI"],
    category: "Image Generation"
  },
  {
    id: "4",
    title: "How I Use AI Every Day for Work (Without Losing My Mind)",
    slug: "ai-tools-for-productivity-guide-2026",
    excerpt: "Not another "AI will replace us" article. Here's how I actually use these tools to get stuff done.",
    content: `Here's what nobody talks about: using AI effectively is boring. There's no magic. It's just... practical.

## My Daily AI Stack

### Notion AI - For Meeting Notes
Every meeting ends, I paste notes into Notion, hit the AI button, get a summary. Share with team. Done.

Before: 20 minutes of formatting
After: 30 seconds

### Claude - For the Hard Stuff
When I have something complex - a strategy document, a tricky email, code architecture - I talk to Claude.

It's like having a smart colleague who's always available and never gets annoyed at stupid questions.

### n8n - For Things That Repeat
I set up a workflow that:
1. Grabs form submissions from my website
2. Summarizes them with AI
3. Creates a task in my project manager
4. Slacks me the summary

Set it up once, forget it forever. That's the dream, and n8n delivers.

## The Secret Nobody Tells You

The real productivity win isn't the AI itself. It's figuring out which of YOUR tasks are repetitive.

Start there. What's the thing you do three times a week that bores you? That's your AI target.`,
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
    excerpt: "Privacy isn't paranoia. Here's what made me switch to running AI locally.",
    content: `This isn't a "Big Tech is evil" thing. It's just... I got uncomfortable.

## The Realization

I was pasting client names, internal project details, even the occasional screenshot into ChatGPT. And one day it clicked - I have no idea what happens to this data.

That's not a trust issue. That's just bad hygiene.

## What Changed

I set up Ollama on a spare machine. Here's the thing: it's not as good as GPT-4. But it's good enough for 80% of what I was using the cloud for.

Code reviews? Local.
Summarizing internal docs? Local.
Drafting emails? Local.

For that other 20% - the genuinely complex stuff - I still use cloud AI. But I think twice now about what goes in.

## The Setup

I won't lie, it took some messing around. But honestly? Less than setting up my first home media server.

If you're curious, start small. You don't need a GPU farm. An old laptop can run surprisingly decent models.`,
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
    excerpt: "I use all three daily. Here's the honest breakdown of when to use what.",
    content: `Here's my unpopular opinion: there is no "best" AI chatbot. They're different tools.

## When I Use Each

### Claude - The Thinking Partner
For anything that requires actual reasoning. Writing a complex doc? Architecting a system? Claude feels like thinking out loud with someone smart.

What makes it different: it questions your assumptions. Gently, but consistently.

### ChatGPT - The Utility Player
It's the most "normal" AI. Good at most things, great at nothing specific.

Great for: quick questions, code snippets, "what's the syntax for X"

### Perplexity - The Researcher
I use this when I would have used Google.

It cites sources. That single feature makes it invaluable for anything where you need to verify information.

## The Honest Comparison

| Task | My Choice |
|------|-----------|
| Writing something important | Claude |
| Quick code help | ChatGPT |
| Learning something new | Perplexity |
| Brainstorming | Claude |
| Looking up current info | Perplexity |

## The Takeaway

Having all three isn't wasteful. It's like having a hammer, a screwdriver, and a knife - different tools for different jobs.`,
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
    excerpt: "I pay for several AI subscriptions. Here's when it makes sense and when it doesn't.",
    content: `I'll be honest: I was the "free only" guy for a long time. Then I calculated what my time was worth.

## The Math

Let's say you spend 2 hours a week on something AI could do in 20 minutes.
That's 1h40m saved × 52 weeks = 86 hours/year.
If your time is worth $50/hour... that's $4,300 in value.

Suddenly $20/month doesn't seem crazy.

## When Free Makes Sense
- Learning / experimenting
- Non-work use
- Privacy-critical projects
- One-off tasks

## When Paid Makes Sense
- Regular work use
- Time-sensitive projects  
- Need the best quality
- Better support/features

## My Stack (Paid and Free)

Paid:
- ChatGPT Plus - quick stuff
- Claude Pro - serious writing

Free:
- Perplexity - research
- Ollama - privacy stuff

## The Bottom Line

Don't pay just because. But don't refuse to pay because you're "cheap" either. Calculate your time value. That's the real answer.`,
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
    excerpt: "Skip the hype. Here's how to actually use AI without getting overwhelmed.",
    content: `If you're new to AI, here's what I wish someone told me:

## Start Stupid Simple

Don't try to revolutionize your workflow. Don't learn all the tools. Don't read every AI newsletter.

Just... try one thing.

## My Recommendation: ChatGPT

Sign up. Ask it to help with something small. Aemail. A summary. Some code.

That's it. That's how you start.

## The One Thing That Matters

Prompting is a skill. But not in the way the internet thinks.

You don't need fancy prompt engineering. You need to be clear about what you want.

Bad: "Help me with code"
Good: "Write a Python function that takes a list of numbers and returns the average"

See the difference? That's it. That's the secret.

## What to Avoid

Don't:
- Pay for anything immediately
- Try to understand how AI "works" before using it
- Feel bad when AI gets things wrong
- Share anything sensitive you wouldn't post publicly

Do:
- Experiment
- Iterate on your prompts
- Use it for boring stuff first

## The Truth

AI isn't magic. It's a tool. And like any tool, you get better at using it by... using it.`,
    publishedAt: "",
    scheduledAt: "2026-03-15",
    author: "AiDex Team",
    tags: ["AI", "beginner", "tutorial", "getting started"],
    category: "Education"
  },
  {
    id: "9",
    title: "AI Voice Tools That Don't Sound Like Robots",
    slug: "best-ai-voice-tools-tts-stt",
    excerpt: "Tested a bunch of text-to-speech and transcription tools. Here's what doesn't suck.",
    content: `AI voice stuff used to be a joke. "Talk to me, HAL." Now it's actually useful.

## Text-to-Speech

### ElevenLabs
This is the one everyone talks about. And yeah, it's that good.

I generated an audiobook for a blog post. My wife listened to it in the car. Didn't realize it wasn't a real person until I told her.

Use for: content creation, accessibility, any audio

### The Free Options
ElevenLabs has a free tier. It's limited but works for testing.

For free permanent use? Honestly, the quality gap is still big enough that I just pay.

## Speech-to-Text

### Whisper
OpenAI's Whisper is incredible. And free. And runs locally.

I use it to transcribe meeting recordings. It's better than Zoom's built-in transcription. By a lot.

### AssemblyAI
If you need something more serious - enterprise stuff, compliance, real-time - this is the play.

## What I Use Daily

- Whisper for transcription (free, local)
- ElevenLabs for TTS when needed (free tier)

That's it. Two tools. Cover 95% of voice needs.`,
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
    content: `Here's my problem with "best AI tools" articles: they're always 50 tools long. Who has time for that?

Here's what I actually use. That's it.

## Daily Drivers

### Cursor (or Continue)
I write code differently now. I start with a comment: "// TODO: build something" and let AI fill it in.

Cursor is my editor. It's VS Code under the hood but with AI that actually understands context.

### Perplexity
My new Google. When I need to know "how do I do X in React" - Perplexity, not Google.

The citations mean I can verify things.

### Claude
For the hard problems. When I'm architecting something, I think out loud with Claude. It's the best at following complex logic.

## The Occasionals

- **Whisper**: Transcribing stuff
- **ComfyUI**: Random image needs
- **Ollama**: When I can't send data to the cloud

## The Point

You don't need 20 tools. You need 3-4 that you actually use.

Find what works for you. Ignore the rest.`,
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
