import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiGet } from "../lib/api";
import { getAiDexScore } from "../lib/scoring";
import SiteShell from "../components/SiteShell";

type Pricing = "Free" | "Paid" | "Freemium" | "Open Source";
type Tool = {
  id: number;
  name: string;
  description: string;
  website_url: string;
  category: string;
  tags?: string;
  pricing: Pricing;
  is_open_source: boolean;
  upvotes?: number;
  downvotes?: number;
  date_added: string;
};

function faviconFromUrl(url: string) {
  try {
    const host = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=128`;
  } catch {
    return "";
  }
}

function pricingSummary(p: Pricing) {
  if (p === "Free") return "Free to use";
  if (p === "Freemium") return "Free plan + paid upgrades";
  if (p === "Paid") return "Paid-only product";
  return "Open-source (self-host possible)";
}

function normalizeTags(raw?: string) {
  return (raw || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function winner(a: number, b: number, preferHigher = true) {
  if (a === b) return "tie";
  if (preferHigher) return a > b ? "a" : "b";
  return a < b ? "a" : "b";
}

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    (async () => {
      const res = await apiGet<{ ok: true; items: Tool[] }>("/api/get_tools.php");
      setTools(res.items || []);
    })();
  }, []);

  const aId = Number(searchParams.get("a") || 0);
  const bId = Number(searchParams.get("b") || 0);
  const a = tools.find((t) => t.id === aId);
  const b = tools.find((t) => t.id === bId);
  const top = useMemo(() => [...tools].slice(0, 150), [tools]);

  const scoreA = a ? getAiDexScore(a) : 0;
  const scoreB = b ? getAiDexScore(b) : 0;
  const upA = a?.upvotes ?? 0;
  const upB = b?.upvotes ?? 0;

  return (
    <SiteShell title="Compare AI Tools" subtitle="Detailed side-by-side comparison with stronger visual cards.">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/85 p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <select
            className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2"
            value={aId || ""}
            onChange={(e) => {
              const p = new URLSearchParams(searchParams);
              if (e.target.value) p.set("a", e.target.value);
              else p.delete("a");
              setSearchParams(p);
            }}
          >
            <option value="">Select Tool A</option>
            {top.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <select
            className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2"
            value={bId || ""}
            onChange={(e) => {
              const p = new URLSearchParams(searchParams);
              if (e.target.value) p.set("b", e.target.value);
              else p.delete("b");
              setSearchParams(p);
            }}
          >
            <option value="">Select Tool B</option>
            {top.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {a && b ? (
        <>
          <section className="mt-6 grid gap-4 md:grid-cols-2">
            {[a, b].map((tool, idx) => {
              const isA = idx === 0;
              const toolScore = isA ? scoreA : scoreB;
              const toolUp = isA ? upA : upB;
              const toolDown = tool.downvotes ?? 0;
              const tags = normalizeTags(tool.tags);

              return (
                <article key={tool.id} className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={faviconFromUrl(tool.website_url)} alt="" className="h-12 w-12 rounded-xl border border-neutral-700 bg-neutral-950 p-2" />
                      <div>
                        <h3 className="text-xl font-semibold tracking-tight">{tool.name}</h3>
                        <p className="text-xs text-neutral-400">{tool.category}</p>
                      </div>
                    </div>
                    <span className="rounded-[9px] border border-cyan-900/70 bg-cyan-950/40 px-2 py-1 text-xs text-cyan-300">Score {toolScore}</span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-neutral-200">{tool.description}</p>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-[9px] border border-neutral-800 bg-neutral-950/70 px-3 py-2">
                      <p className="text-neutral-400">Pricing</p>
                      <p className="mt-0.5 font-medium text-neutral-100">{tool.pricing}</p>
                      <p className="text-neutral-400">{pricingSummary(tool.pricing)}</p>
                    </div>
                    <div className="rounded-[9px] border border-neutral-800 bg-neutral-950/70 px-3 py-2">
                      <p className="text-neutral-400">Community</p>
                      <p className="mt-0.5 font-medium text-neutral-100">👍 {toolUp} · 👎 {toolDown}</p>
                      <p className="text-neutral-400">{tool.is_open_source ? "Open source" : "Closed source"}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.length ? (
                      tags.map((tag) => (
                        <span key={tag} className="rounded-[9px] border border-neutral-800 bg-neutral-950 px-2 py-1 text-xs text-neutral-300">
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-[9px] border border-neutral-800 bg-neutral-950 px-2 py-1 text-xs text-neutral-400">
                        No tags yet
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <a href={tool.website_url} target="_blank" rel="noreferrer" className="gradient-btn">
                      <span>Visit {tool.name}</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/85 p-5">
            <h4 className="text-base font-semibold">Comparison breakdown</h4>
            <div className="mt-4 grid gap-3">
              {[
                {
                  label: "AiDex Score",
                  a: scoreA,
                  b: scoreB,
                  w: winner(scoreA, scoreB),
                },
                {
                  label: "Upvotes",
                  a: upA,
                  b: upB,
                  w: winner(upA, upB),
                },
                {
                  label: "Freshness (newer date)",
                  a: new Date(a.date_added).getTime(),
                  b: new Date(b.date_added).getTime(),
                  w: winner(new Date(a.date_added).getTime(), new Date(b.date_added).getTime()),
                  renderA: new Date(a.date_added).toLocaleDateString(),
                  renderB: new Date(b.date_added).toLocaleDateString(),
                },
              ].map((row) => (
                <div key={row.label} className="grid items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950/60 p-3 md:grid-cols-[170px_1fr_1fr]">
                  <p className="text-xs text-neutral-400">{row.label}</p>
                  <p className={`rounded-[9px] px-2 py-1 text-sm ${row.w === "a" ? "bg-emerald-950/50 text-emerald-300" : "text-neutral-200"}`}>
                    {row.renderA ?? row.a}
                  </p>
                  <p className={`rounded-[9px] px-2 py-1 text-sm ${row.w === "b" ? "bg-emerald-950/50 text-emerald-300" : "text-neutral-200"}`}>
                    {row.renderB ?? row.b}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-neutral-700 bg-neutral-900/50 p-6 text-sm text-neutral-400">
          Select both tools to generate a full comparison.
        </div>
      )}
    </SiteShell>
  );
}
