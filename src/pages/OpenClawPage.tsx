import { useState, useEffect } from "react";
import SiteShell from "../components/SiteShell";

type Category = {
  name: string;
  icon: string;
  description: string;
  items: { name: string; description: string; tags: string[]; docUrl?: string; icon?: string }[];
};

const CATEGORIES: Category[] = [
  { name: "Messaging", icon: "💬", description: "Chat with your AI assistant across platforms", items: [
    { name: "Telegram", description: "Connect via Telegram bot", tags: ["core", "chat"], docUrl: "https://docs.openclaw.ai/channels/telegram", icon: "✈️" },
    { name: "Discord", description: "Server-based chat and voice", tags: ["chat", "voice"], docUrl: "https://docs.openclaw.ai/channels/discord", icon: "🎮" },
    { name: "Slack", description: "Team communication", tags: ["work", "chat"], docUrl: "https://docs.openclaw.ai/channels/slack", icon: "💼" },
    { name: "Signal", description: "Privacy-focused messaging", tags: ["privacy", "chat"], docUrl: "https://docs.openclaw.ai/channels/signal", icon: "🔔" },
    { name: "WhatsApp", description: "Popular messaging app", tags: ["chat", "mobile"], docUrl: "https://docs.openclaw.ai/channels/whatsapp", icon: "💬" },
    { name: "iMessage", description: "Apple's messaging platform", tags: ["apple", "chat"], docUrl: "https://docs.openclaw.ai/channels/imessage", icon: "🍎" },
  ]},
  { name: "Home Automation", icon: "🏠", description: "Control smart devices from chat", items: [
    { name: "Sonos", description: "Control your music speakers", tags: ["music", "smart-home"], docUrl: "https://docs.openclaw.ai", icon: "🔊" },
    { name: "Spotify", description: "Play music and control playback", tags: ["music", "streaming"], docUrl: "https://docs.openclaw.ai", icon: "🎵" },
    { name: "Philips Hue", description: "Smart lights control", tags: ["lights", "smart-home"], docUrl: "https://docs.openclaw.ai", icon: "💡" },
  ]},
  { name: "Notes & Productivity", icon: "📝", description: "Manage notes, tasks, and reminders", items: [
    { name: "Apple Notes", description: "Access Apple Notes", tags: ["apple", "notes"], docUrl: "https://docs.openclaw.ai", icon: "📒" },
    { name: "Obsidian", description: "Local-first knowledge base", tags: ["notes", "markdown"], docUrl: "https://docs.openclaw.ai", icon: "💎" },
    { name: "Notion", description: "Workspace for docs and tasks", tags: ["notes", "productivity"], docUrl: "https://docs.openclaw.ai", icon: "📋" },
    { name: "Bear", description: "Beautiful notes for Mac/iOS", tags: ["apple", "notes"], docUrl: "https://docs.openclaw.ai", icon: "🐻" },
    { name: "Apple Reminders", description: "Manage reminders", tags: ["apple", "tasks"], docUrl: "https://docs.openclaw.ai", icon: "⏰" },
    { name: "Things", description: "Mac/iOS task manager", tags: ["apple", "tasks"], docUrl: "https://docs.openclaw.ai", icon: "✓" },
    { name: "Trello", description: "Board-based task management", tags: ["tasks", "kanban"], docUrl: "https://docs.openclaw.ai", icon: "📌" },
  ]},
  { name: "Development", icon: "💻", description: "Developer tools and integrations", items: [
    { name: "GitHub", description: "Repository and issue management", tags: ["git", "code"], docUrl: "https://docs.openclaw.ai", icon: "🐙" },
    { name: "GitHub Issues", description: "Create and manage issues", tags: ["git", "issues"], docUrl: "https://docs.openclaw.ai", icon: "🐛" },
    { name: "Coding Agent", description: "Run code editing agents", tags: ["ai", "code"], docUrl: "https://docs.openclaw.ai", icon: "🤖" },
    { name: "Tmux", description: "Terminal session management", tags: ["terminal", "devops"], docUrl: "https://docs.openclaw.ai", icon: "🖥️" },
  ]},
  { name: "Voice & Audio", icon: "🎤", description: "Voice and audio processing", items: [
    { name: "Voice Call", description: "Make and receive voice calls", tags: ["voice", "telephony"], docUrl: "https://docs.openclaw.ai/cli/voicecall", icon: "📞" },
    { name: "ElevenLabs TTS", description: "High-quality text-to-speech", tags: ["tts", "voice"], docUrl: "https://docs.openclaw.ai", icon: "🗣️" },
    { name: "Whisper", description: "Speech-to-text transcription", tags: ["stt", "audio"], docUrl: "https://docs.openclaw.ai", icon: "👂" },
    { name: "Sherpa TTS", description: "Open-source text-to-speech", tags: ["tts", "open-source"], docUrl: "https://docs.openclaw.ai", icon: "🔊" },
  ]},
  { name: "Media & Images", icon: "🖼️", description: "Image and video processing", items: [
    { name: "Image Generation", description: "Generate images with AI", tags: ["ai", "images"], docUrl: "https://docs.openclaw.ai", icon: "🎨" },
    { name: "Video Frames", description: "Extract frames from video", tags: ["video", "media"], docUrl: "https://docs.openclaw.ai", icon: "🎬" },
    { name: "Camera Snap", description: "Capture photos from cameras", tags: ["camera", "media"], docUrl: "https://docs.openclaw.ai", icon: "📷" },
    { name: "GIF Grabber", description: "Find and process GIFs", tags: ["gif", "media"], docUrl: "https://docs.openclaw.ai", icon: "🎞️" },
  ]},
  { name: "AI Models", icon: "🤖", description: "AI model integrations", items: [
    { name: "OpenAI", description: "GPT and DALL-E models", tags: ["llm", "images"], docUrl: "https://docs.openclaw.ai/concepts/model-providers", icon: "🧠" },
    { name: "Google Gemini", description: "Google's AI models", tags: ["llm", "multimodal"], docUrl: "https://docs.openclaw.ai/concepts/model-providers", icon: "🔵" },
    { name: "Ollama", description: "Run local LLMs", tags: ["llm", "local"], docUrl: "https://docs.openclaw.ai/concepts/model-providers", icon: "🦙" },
  ]},
  { name: "Utilities", icon: "🔧", description: "Useful tools and integrations", items: [
    { name: "Weather", description: "Get weather forecasts", tags: ["utility", "weather"], docUrl: "https://docs.openclaw.ai", icon: "🌤️" },
    { name: "URL Shortener", description: "Shorten and manage URLs", tags: ["utility", "links"], docUrl: "https://docs.openclaw.ai", icon: "🔗" },
    { name: "1Password", description: "Password manager integration", tags: ["security", "passwords"], docUrl: "https://docs.openclaw.ai", icon: "🔐" },
    { name: "Health Check", description: "System health monitoring", tags: ["devops", "monitoring"], docUrl: "https://docs.openclaw.ai/cli/health", icon: "💚" },
    { name: "Summarize", description: "AI-powered summarization", tags: ["ai", "utility"], docUrl: "https://docs.openclaw.ai", icon: "📄" },
  ]},
];

export default function OpenClawPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [votes, setVotes] = useState<Record<string, { up: number; down: number }>>({});

  // Fetch votes from API on load
  useEffect(() => {
    fetch("/api/get_openclaw_votes.php")
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.items) {
          const voteMap: Record<string, { up: number; down: number }> = {};
          data.items.forEach((item: { name: string; upvotes: number; downvotes: number }) => {
            voteMap[item.name] = { up: item.upvotes, down: item.downvotes };
          });
          setVotes(voteMap);
        }
      })
      .catch(() => {});
  }, []);

  const handleVote = async (itemName: string, type: "up" | "down") => {
    // Optimistic update - update UI immediately
    setVotes(prev => ({
      ...prev,
      [itemName]: { 
        up: (prev[itemName]?.up || 0) + (type === "up" ? 1 : 0), 
        down: (prev[itemName]?.down || 0) + (type === "down" ? 1 : 0) 
      }
    }));
    
    try {
      await fetch("/api/vote_openclaw.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: itemName, vote: type }),
      });
    } catch {
      // Silent fail - vote already applied optimistically
    }
  };

  const totalItems = CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0);

  const filtered = CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) => {
      const matchesQuery = !query || item.name.toLowerCase().includes(query.toLowerCase()) || item.description.toLowerCase().includes(query.toLowerCase()) || item.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));
      const matchesCategory = category === "All" || cat.name === category;
      return matchesQuery && matchesCategory;
    }),
  })).filter((cat) => cat.items.length > 0);

  return (
    <SiteShell title="OpenClaw">
      {/* Page Title & Stats */}
      <div className="bg-slate-900/40 border-b border-neutral-800/50 -mx-4 px-4 -mt-8 mb-6">
        <div className="px-4 py-6 max-w-6xl mx-auto">
          <div className="text-sm text-neutral-300 mb-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-800 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />OpenClaw Directory
            </span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-semibold tracking-tight">OpenClaw</h1>
          </div>
          <p className="text-sm text-neutral-300 mb-3">Discover all OpenClaw skills, integrations, and capabilities.</p>
          <div className="flex flex-wrap gap-2 text-xs text-neutral-300 mb-4">
            <span className="rounded-full border border-neutral-700 bg-neutral-900/80 px-3 py-1">{totalItems} skills</span>
            <span className="rounded-full border border-neutral-700 bg-neutral-900/80 px-3 py-1">{CATEGORIES.length} categories</span>
          </div>
        </div>

        {/* Search & Filters */}
        <div id="submit-tool" className="px-4 pb-4 max-w-6xl mx-auto">
          <div className="rounded-xl border border-neutral-800 bg-slate-900/60 p-4">
            <div className="grid gap-3 md:grid-cols-12">
              <div className="md:col-span-5">
                <label className="text-xs text-neutral-200">Search</label>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search skills..." className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none" />
              </div>
              <div className="md:col-span-4">
                <label className="text-xs text-neutral-200">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none">
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((c) => (<option key={c.name} value={c.name}>{c.icon} {c.name}</option>))}
                </select>
              </div>
              <div className="md:col-span-3 flex items-end">
                <div className="text-xs text-neutral-200">Showing <span className="text-neutral-200">{filtered.reduce((acc, c) => acc + c.items.length, 0)}</span> of <span className="text-neutral-200">{totalItems}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        {filtered.map((cat) => (
          <section key={cat.name}>
            <div className="flex items-center gap-2 mb-4"><span className="text-2xl">{cat.icon}</span><h2 className="text-xl font-semibold">{cat.name}</h2><span className="text-sm text-neutral-500">({cat.items.length})</span></div>
            <p className="text-sm text-neutral-400 mb-4">{cat.description}</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cat.items.map((item) => {
                const itemVotes = votes[item.name] || { up: 0, down: 0 };
                return (
                item.docUrl ? (
                  <a 
                    key={item.name} 
                    href={item.docUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="glow-card cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 h-9 w-9 rounded-md border border-neutral-700 bg-neutral-800 p-1 flex items-center justify-center text-xl">
                          {item.icon || cat.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-100">{item.name}</h3>
                          <p className="mt-1 text-sm text-neutral-300 line-clamp-2">{item.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span key={tag} className="rounded-[9px] border border-neutral-800 bg-neutral-950 px-2 py-1 text-xs text-neutral-400">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); handleVote(item.name, "up"); }}
                          className="rounded-[9px] border border-neutral-700 px-2 py-1 text-xs text-neutral-200 hover:border-emerald-500"
                        >
                          👍 {itemVotes.up}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); handleVote(item.name, "down"); }}
                          className="rounded-[9px] border border-neutral-700 px-2 py-1 text-xs text-neutral-200 hover:border-rose-500"
                        >
                          👎 {itemVotes.down}
                        </button>
                      </div>
                    </div>
                  </a>
                ) : (
                  <div key={item.name} className="glow-card">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 h-9 w-9 rounded-md border border-neutral-700 bg-neutral-800 p-1 flex items-center justify-center text-xl">
                          {item.icon || cat.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-100">{item.name}</h3>
                          <p className="mt-1 text-sm text-neutral-400">{item.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span key={tag} className="rounded-[9px] border border-neutral-800 bg-neutral-950 px-2 py-1 text-xs text-neutral-400">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleVote(item.name, "up")}
                          className="rounded-[9px] border border-neutral-700 px-2 py-1 text-xs text-neutral-200 hover:border-emerald-500"
                        >
                          👍 {itemVotes.up}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVote(item.name, "down")}
                          className="rounded-[9px] border border-neutral-700 px-2 py-1 text-xs text-neutral-200 hover:border-rose-500"
                        >
                          👎 {itemVotes.down}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              );})}
            </div>
          </section>
        ))}
      </div>
      {filtered.length === 0 && <div className="text-center py-12 text-neutral-400">No skills found.</div>}
    </SiteShell>
  );
}
