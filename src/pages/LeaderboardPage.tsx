import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../lib/api";
import { getAiDexScore } from "../lib/scoring";

type Pricing = "Free" | "Paid" | "Freemium" | "Open Source";
type Tool = {
  id: number;
  name: string;
  description: string;
  website_url: string;
  category: string;
  pricing: Pricing;
  is_open_source: boolean;
  upvotes?: number;
  downvotes?: number;
  date_added: string;
};

export default function LeaderboardPage() {
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    (async () => {
      const res = await apiGet<{ ok: true; items: Tool[] }>("/api/get_tools.php");
      setTools(res.items || []);
    })();
  }, []);

  const trending = useMemo(
    () => [...tools].sort((a, b) => getAiDexScore(b) - getAiDexScore(a)).slice(0, 20),
    [tools]
  );

  const newest = useMemo(
    () => [...tools].sort((a, b) => +new Date(b.date_added) - +new Date(a.date_added)).slice(0, 20),
    [tools]
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">AiDex Leaderboard</h1>
          <Link to="/" className="text-sm text-neutral-300 hover:text-white">← Directory</Link>
        </div>
        <p className="mt-2 text-sm text-neutral-300">Trending by AiDex Score and newest additions.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
            <h2 className="text-lg font-semibold">🔥 Trending</h2>
            <div className="mt-3 space-y-2">
              {trending.map((t, i) => (
                <Link key={t.id} to={`/tool/${t.id}`} className="flex items-center justify-between rounded-lg border border-neutral-800 px-3 py-2 hover:border-neutral-600">
                  <span className="text-sm">#{i + 1} {t.name}</span>
                  <span className="text-xs text-cyan-300">Score {getAiDexScore(t)}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
            <h2 className="text-lg font-semibold">🆕 New This Week</h2>
            <div className="mt-3 space-y-2">
              {newest.map((t, i) => (
                <Link key={t.id} to={`/tool/${t.id}`} className="flex items-center justify-between rounded-lg border border-neutral-800 px-3 py-2 hover:border-neutral-600">
                  <span className="text-sm">#{i + 1} {t.name}</span>
                  <span className="text-xs text-neutral-400">{new Date(t.date_added).toLocaleDateString()}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
