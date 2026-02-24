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
  pricing: Pricing;
  is_open_source: boolean;
  upvotes?: number;
  downvotes?: number;
  date_added: string;
};

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
  const top = useMemo(() => [...tools].slice(0, 100), [tools]);

  return (
    <SiteShell title="Compare AI Tools" subtitle="Put two tools side-by-side and decide faster.">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/85 p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <select
            className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2"
            value={aId || ""}
            onChange={(e) => {
              const p = new URLSearchParams(searchParams);
              if (e.target.value) p.set("a", e.target.value); else p.delete("a");
              setSearchParams(p);
            }}
          >
            <option value="">Select Tool A</option>
            {top.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>

          <select
            className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2"
            value={bId || ""}
            onChange={(e) => {
              const p = new URLSearchParams(searchParams);
              if (e.target.value) p.set("b", e.target.value); else p.delete("b");
              setSearchParams(p);
            }}
          >
            <option value="">Select Tool B</option>
            {top.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      {a && b ? (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/85">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/60">
                <th className="px-4 py-3 text-left text-neutral-400">Metric</th>
                <th className="px-4 py-3 text-left">{a.name}</th>
                <th className="px-4 py-3 text-left">{b.name}</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Category", a.category, b.category],
                ["Pricing", a.pricing, b.pricing],
                ["Open Source", a.is_open_source ? "Yes" : "No", b.is_open_source ? "Yes" : "No"],
                ["Upvotes", String(a.upvotes ?? 0), String(b.upvotes ?? 0)],
                ["Downvotes", String(a.downvotes ?? 0), String(b.downvotes ?? 0)],
                ["AiDex Score", String(getAiDexScore(a)), String(getAiDexScore(b))],
              ].map(([label, av, bv]) => (
                <tr key={label} className="border-t border-neutral-800">
                  <th className="px-4 py-3 text-left text-neutral-400">{label}</th>
                  <td className="px-4 py-3">{av}</td>
                  <td className="px-4 py-3">{bv}</td>
                </tr>
              ))}
              <tr className="border-t border-neutral-800">
                <th className="px-4 py-3 text-left text-neutral-400">Website</th>
                <td className="px-4 py-3"><a className="underline" href={a.website_url} target="_blank" rel="noreferrer">Visit</a></td>
                <td className="px-4 py-3"><a className="underline" href={b.website_url} target="_blank" rel="noreferrer">Visit</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-neutral-700 bg-neutral-900/50 p-6 text-sm text-neutral-400">
          Select both tools to generate a full comparison.
        </div>
      )}
    </SiteShell>
  );
}
