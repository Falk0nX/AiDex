import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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

  const top = useMemo(() => [...tools].slice(0, 50), [tools]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Compare Tools</h1>
          <Link to="/" className="text-sm text-neutral-300 hover:text-white">← Directory</Link>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <select
            className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2"
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
            className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2"
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

        {a && b && (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900">
            <table className="min-w-full text-sm">
              <tbody>
                {[
                  ["Category", a.category, b.category],
                  ["Pricing", a.pricing, b.pricing],
                  ["Open Source", a.is_open_source ? "Yes" : "No", b.is_open_source ? "Yes" : "No"],
                  ["Upvotes", String(a.upvotes ?? 0), String(b.upvotes ?? 0)],
                  ["Downvotes", String(a.downvotes ?? 0), String(b.downvotes ?? 0)],
                  ["AiDex Score", String(getAiDexScore(a)), String(getAiDexScore(b))],
                ].map(([label, av, bv]) => (
                  <tr key={label} className="border-t border-neutral-800 first:border-t-0">
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
        )}
      </main>
    </div>
  );
}
