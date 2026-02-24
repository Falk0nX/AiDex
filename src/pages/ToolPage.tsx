import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../lib/api";

type Pricing = "Free" | "Paid" | "Freemium" | "Open Source";

type Tool = {
  id: number;
  name: string;
  description: string;
  website_url: string;
  category: string;
  tags: string;
  pricing: Pricing;
  is_open_source: boolean;
  upvotes?: number;
  downvotes?: number;
  date_added: string;
};

export default function ToolPage() {
  const { id } = useParams();
  const numericId = Number(id);
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet<{ ok: true; items: Tool[] }>("/api/get_tools.php");
        const found = (res.items || []).find((t) => t.id === numericId) || null;
        setTool(found);
        if (!found) setError("Tool not found");
      } catch (e: any) {
        setError(e.message || "Failed to load tool");
      } finally {
        setLoading(false);
      }
    })();
  }, [numericId]);

  useEffect(() => {
    if (!tool) return;
    document.title = `${tool.name} — AiDex`;
    const desc = `Explore ${tool.name} on AiDex. ${tool.description}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", desc);
  }, [tool]);

  const tagsList = useMemo(
    () => (tool?.tags || "").split(",").map((x) => x.trim()).filter(Boolean),
    [tool]
  );

  if (loading) return <div className="min-h-screen bg-neutral-950 text-neutral-50 p-6">Loading…</div>;
  if (error || !tool) return <div className="min-h-screen bg-neutral-950 text-red-300 p-6">{error || "Not found"}</div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <main className="mx-auto max-w-4xl px-4 py-10">
        <Link to="/" className="text-sm text-neutral-300 hover:text-white">← Back to directory</Link>
        <article className="mt-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h1 className="text-3xl font-semibold">{tool.name}</h1>
          <p className="mt-3 text-neutral-300">{tool.description}</p>

          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border border-neutral-700 px-3 py-1">{tool.category}</span>
            <span className="rounded-full border border-neutral-700 px-3 py-1">{tool.pricing}</span>
            {tagsList.map((tag) => (
              <span key={tag} className="rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 text-neutral-400">#{tag}</span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <a
              href={tool.website_url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
            >
              Visit Website →
            </a>
            <span className="text-sm text-neutral-400">
              👍 {tool.upvotes ?? 0} · 👎 {tool.downvotes ?? 0}
            </span>
          </div>
        </article>
      </main>
    </div>
  );
}
