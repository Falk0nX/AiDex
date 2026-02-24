import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "../lib/api";

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
  date_added: string;
};

function classNames(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function faviconFromUrl(url: string) {
  try {
    const host = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
  } catch {
    return "";
  }
}

export default function DirectoryPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [pricing, setPricing] = useState<"All" | Pricing>("All");
  const [openSourceOnly, setOpenSourceOnly] = useState(false);
  const [sort, setSort] = useState<"newest" | "name">("newest");

  const [page, setPage] = useState(1);
  const pageSize = 24;

  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [submitPricing, setSubmitPricing] = useState<Pricing>("Free");
  const [submitCategory, setSubmitCategory] = useState("AI Education");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "sending">("idle");
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet<{ ok: true; items: Tool[] }>("/api/get_tools.php");
        setTools(res.items || []);
      } catch (e: any) {
        setError(e.message || "Failed to load tools");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    tools.forEach((t) => set.add(t.category));
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [tools]);

  useEffect(() => {
    setPage(1);
  }, [query, category, pricing, openSourceOnly, sort]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = tools.filter((t) => {
      const tagsList = (t.tags || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

      const matchesQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        tagsList.some((tag) => tag.toLowerCase().includes(q));

      const matchesCategory = category === "All" || t.category === category;
      const matchesPricing = pricing === "All" || t.pricing === pricing;
      const matchesOpenSource = !openSourceOnly || t.is_open_source;

      return matchesQuery && matchesCategory && matchesPricing && matchesOpenSource;
    });

    list.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      return new Date(b.date_added).getTime() - new Date(a.date_added).getTime();
    });

    return list;
  }, [tools, query, category, pricing, openSourceOnly, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);
    setSubmitState("sending");

    try {
      await apiPost("/api/submit.php", {
        name,
        website_url: websiteUrl,
        description,
        category: submitCategory,
        pricing: submitPricing,
        tags,
      });
      setSubmitMessage("Submission received and pending review.");
      setName("");
      setWebsiteUrl("");
      setDescription("");
      setTags("");
    } catch (err: any) {
      setSubmitMessage(err.message || "Submission failed");
    } finally {
      setSubmitState("idle");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.12),transparent_30%)]">
      <header className="border-b border-neutral-800/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 px-3 py-1 text-xs text-neutral-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Curated AI Tools Directory
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight">AiDex</h1>
              <p className="mt-2 max-w-2xl text-sm text-neutral-300">
                Discover AI tools, filter by category/pricing, and submit new tools for review.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-300">
                <span className="rounded-full border border-neutral-700 bg-neutral-900/80 px-3 py-1">{tools.length} tools</span>
                <span className="rounded-full border border-neutral-700 bg-neutral-900/80 px-3 py-1">{categories.length - 1} categories</span>
                <span className="rounded-full border border-neutral-700 bg-neutral-900/80 px-3 py-1">Community curated</span>
              </div>
            </div>

            <a
              href="#submit"
              className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
            >
              Submit a tool
            </a>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-12">
            <div className="md:col-span-5">
              <label className="text-xs text-neutral-400">Search</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools, tags, keywords…"
                className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none placeholder:text-neutral-500 focus:border-neutral-600"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-xs text-neutral-400">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-neutral-400">Pricing</label>
              <select
                value={pricing}
                onChange={(e) => setPricing(e.target.value as any)}
                className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600"
              >
                <option value="All">All</option>
                <option value="Free">Free</option>
                <option value="Freemium">Freemium</option>
                <option value="Paid">Paid</option>
                <option value="Open Source">Open Source</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-neutral-400">Sort</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600"
              >
                <option value="newest">Newest</option>
                <option value="name">Name</option>
              </select>
            </div>

            <div className="md:col-span-12 flex items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-neutral-300">
                <input
                  type="checkbox"
                  checked={openSourceOnly}
                  onChange={(e) => setOpenSourceOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-700 bg-neutral-900"
                />
                Open-source only
              </label>

              <div className="text-xs text-neutral-400">
                Showing <span className="text-neutral-200">{Math.min(page * pageSize, filtered.length)}</span>{" "}
                of <span className="text-neutral-200">{filtered.length}</span> tool
                {filtered.length === 1 ? "" : "s"}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {loading && <p className="text-sm text-neutral-400">Loading tools…</p>}
        {error && <p className="mb-4 text-sm text-red-300">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paged.map((t) => {
            const tagsList = (t.tags || "")
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean);

            return (
              <article
                key={t.id}
                className="rounded-2xl border border-neutral-800/80 bg-neutral-900/80 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-all hover:-translate-y-0.5 hover:border-neutral-600"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={faviconFromUrl(t.website_url)}
                      alt=""
                      className="mt-0.5 h-9 w-9 rounded-md border border-neutral-700 bg-neutral-800 p-1"
                      loading="lazy"
                    />
                    <div>
                      <h2 className="text-base font-semibold">{t.name}</h2>
                      <p className="mt-1 text-sm text-neutral-300 line-clamp-3">{t.description}</p>
                    </div>
                  </div>
                  <span
                    className={classNames(
                      "shrink-0 rounded-full border px-2 py-1 text-xs",
                      t.pricing === "Free" && "border-emerald-700/50 text-emerald-300",
                      t.pricing === "Paid" && "border-amber-700/50 text-amber-300",
                      t.pricing === "Freemium" && "border-sky-700/50 text-sky-300",
                      t.pricing === "Open Source" && "border-fuchsia-700/50 text-fuchsia-300"
                    )}
                  >
                    {t.pricing}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-neutral-800 bg-neutral-950 px-2 py-1 text-xs text-neutral-300">
                    {t.category}
                  </span>
                  {tagsList.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-neutral-800 bg-neutral-950 px-2 py-1 text-xs text-neutral-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-neutral-500">
                    Added {new Date(t.date_added).toLocaleDateString()}
                  </span>
                  <a
                    href={t.website_url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-sm font-medium text-white underline decoration-neutral-700 hover:decoration-neutral-300"
                  >
                    Visit →
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Prev
          </button>

          <div className="text-sm text-neutral-300">
            Page <span className="font-semibold text-white">{page}</span> of{" "}
            <span className="font-semibold text-white">{totalPages}</span>
          </div>

          <button
            className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next →
          </button>
        </div>

        <section id="submit" className="mt-12 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h3 className="text-lg font-semibold">Submit a tool</h3>
          <p className="mt-1 text-sm text-neutral-300">
            Submissions go into a review queue (admin approval).
          </p>

          <form className="mt-4 grid gap-3 md:grid-cols-3" onSubmit={onSubmit}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-600"
              placeholder="Tool name"
              required
            />
            <input
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-600"
              placeholder="Website URL"
              required
            />
            <select
              value={submitPricing}
              onChange={(e) => setSubmitPricing(e.target.value as Pricing)}
              className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-600"
            >
              <option>Free</option>
              <option>Freemium</option>
              <option>Paid</option>
              <option>Open Source</option>
            </select>
            <input
              value={submitCategory}
              onChange={(e) => setSubmitCategory(e.target.value)}
              className="md:col-span-3 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-600"
              placeholder="Category"
              required
            />
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="md:col-span-3 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-600"
              placeholder="Tags (comma-separated)"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="md:col-span-3 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-600"
              placeholder="Short description"
              rows={3}
              required
            />
            <button
              disabled={submitState === "sending"}
              className="md:col-span-3 rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-200 disabled:opacity-50"
            >
              {submitState === "sending" ? "Submitting…" : "Submit for review"}
            </button>
          </form>

          {submitMessage && <p className="mt-3 text-sm text-neutral-300">{submitMessage}</p>}
        </section>
      </main>

      <footer className="border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-neutral-500">
          © {new Date().getFullYear()} AiDex · v0.0.2
        </div>
      </footer>
    </div>
  );
}
