import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../lib/api";
import { getAiDexScore } from "../lib/scoring";
import SiteShell from "../components/SiteShell";

type Pricing = "Free" | "Paid" | "Freemium" | "Open Source";
type Tool = {
  id: number;
  name: string;
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

  const trending = useMemo(() => [...tools].sort((a, b) => getAiDexScore(b) - getAiDexScore(a)).slice(0, 20), [tools]);
  const newest = useMemo(() => [...tools].sort((a, b) => +new Date(b.date_added) - +new Date(a.date_added)).slice(0, 20), [tools]);

  return (
    <SiteShell title="AiDex Leaderboard" subtitle="Trending tools, fresh launches, and momentum at a glance.">
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/85 p-5">
          <h2 className="text-lg font-semibold">🔥 Trending by AiDex Score</h2>
          <div className="mt-4 space-y-2">
            {trending.map((t, i) => (
              <Link key={t.id} to={`/tool/${t.id}`} className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950/60 px-3 py-2 hover:border-cyan-700/70">
                <div className="min-w-0">
                  <p className="truncate text-sm">#{i + 1} {t.name}</p>
                  <p className="text-xs text-neutral-400">{t.category} · {t.pricing}</p>
                </div>
                <span className="ml-2 rounded-full border border-cyan-900/70 bg-cyan-950/40 px-2 py-1 text-[11px] text-cyan-300">{getAiDexScore(t)}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/85 p-5">
          <h2 className="text-lg font-semibold">🆕 New this week</h2>
          <div className="mt-4 space-y-2">
            {newest.map((t, i) => (
              <Link key={t.id} to={`/tool/${t.id}`} className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950/60 px-3 py-2 hover:border-violet-700/70">
                <div className="min-w-0">
                  <p className="truncate text-sm">#{i + 1} {t.name}</p>
                  <p className="text-xs text-neutral-400">{t.category}</p>
                </div>
                <span className="ml-2 text-xs text-neutral-400">{new Date(t.date_added).toLocaleDateString()}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
