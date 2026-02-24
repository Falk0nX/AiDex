import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../lib/api";
import { getAiDexScore } from "../lib/scoring";
import BackToTopButton from "../components/BackToTopButton";

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
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [pricing, setPricing] = useState<"All" | Pricing>("All");
  const [openSourceOnly, setOpenSourceOnly] = useState(false);
  const [sort, setSort] = useState<"newest" | "name" | "score">("newest");

  const [page, setPage] = useState(1);
  const pageSize = 24;

  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [submitPricing, setSubmitPricing] = useState<Pricing>("Free");
  const [submitCategory, setSubmitCategory] = useState("AI Education");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "sending">("idle");
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [submitStep, setSubmitStep] = useState<1 | 2>(1);
  const [autofillState, setAutofillState] = useState<"idle" | "loading">("idle");

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

  const submitCategoryOptions = useMemo(() => {
    const options = categories.filter((c) => c !== "All");
    return options.length ? options : ["AI Education"];
  }, [categories]);

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
      if (sort === "score") return getAiDexScore(b) - getAiDexScore(a);
      return new Date(b.date_added).getTime() - new Date(a.date_added).getTime();
    });

    return list;
  }, [tools, query, category, pricing, openSourceOnly, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const onAutofillFromWebsite = async () => {
    if (!websiteUrl.trim()) {
      setSubmitMessage("Enter a website URL first.");
      return;
    }

    setSubmitMessage(null);
    setAutofillState("loading");
    try {
      const res = await apiPost<{
        ok: true;
        name?: string;
        description?: string;
        category?: string;
        pricing?: Pricing;
        tags?: string;
      }>("/api/enrich_tool.php", { website_url: websiteUrl.trim() });

      if (res.name) setName(res.name);
      if (res.description) setDescription(res.description);
      if (res.pricing) setSubmitPricing(res.pricing);
      if (res.tags) setTags(res.tags);

      if (res.category) {
        if (submitCategoryOptions.includes(res.category)) {
          setSubmitCategory(res.category);
          setCustomCategory("");
        } else {
          setSubmitCategory("Other");
          setCustomCategory(res.category);
        }
      }

      setSubmitStep(2);
    } catch (err: any) {
      setSubmitMessage(err.message || "Could not auto-fill from this website");
    } finally {
      setAutofillState("idle");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);
    setSubmitState("sending");

    const finalCategory = submitCategory === "Other" ? customCategory.trim() : submitCategory;
    if (!finalCategory) {
      setSubmitMessage("Please add a custom category.");
      setSubmitState("idle");
      return;
    }

    try {
      await apiPost("/api/submit.php", {
        name,
        website_url: websiteUrl,
        description,
        category: finalCategory,
        pricing: submitPricing,
        tags,
      });
      setSubmitMessage("Submission received and pending review.");
      setFlashMessage("✅ Thanks — your tool was submitted successfully and is pending review.");
      setName("");
      setWebsiteUrl("");
      setDescription("");
      setTags("");
      setSubmitCategory(submitCategoryOptions[0] ?? "AI Education");
      setCustomCategory("");
      setSubmitStep(1);
      setIsSubmitOpen(false);
    } catch (err: any) {
      setSubmitMessage(err.message || "Submission failed");
    } finally {
      setSubmitState("idle");
    }
  };

  const onVote = async (toolId: number, vote: "up" | "down") => {
    try {
      const res = await apiPost<{ ok: true; tool_id: number; upvotes: number; downvotes: number }>("/api/vote.php", {
        tool_id: toolId,
        vote,
      });

      setTools((prev) =>
        prev.map((t) =>
          t.id === toolId ? { ...t, upvotes: res.upvotes, downvotes: res.downvotes } : t
        )
      );
    } catch {
      // no-op for now
    }
  };

  return (
    <div className="gradient-dot-hero min-h-screen text-neutral-50">
      <header className="site-base border-b border-cyan-900/40 shadow-[0_20px_60px_rgba(2,6,23,0.65)] backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 px-3 py-1 text-xs text-neutral-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Curated AI Tools Directory
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Link to="/" className="flex items-center gap-3 hover:opacity-90">
                  <img
                    src="/aidex-logo-square.jpg"
                    alt="AiDex logo"
                    className="h-10 w-10 rounded-md border border-neutral-800 object-cover"
                    loading="eager"
                  />
                  <h1 className="text-3xl font-semibold tracking-tight">AiDex</h1>
                </Link>
              </div>
              <p className="mt-2 max-w-2xl text-sm text-neutral-300">
                Discover AI tools, filter by category/pricing, and submit new tools for review.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-300">
                <span className="rounded-full border border-neutral-700 bg-neutral-900/80 px-3 py-1">{tools.length} tools</span>
                <span className="rounded-full border border-neutral-700 bg-neutral-900/80 px-3 py-1">{categories.length - 1} categories</span>
                <span className="rounded-full border border-neutral-700 bg-neutral-900/80 px-3 py-1">Community curated</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link to="/leaderboard" className="gradient-btn"><span>Leaderboard</span></Link>
              <Link to="/compare" className="gradient-btn"><span>Compare</span></Link>
              <button
                type="button"
                onClick={() => {
                  setSubmitStep(1);
                  setSubmitMessage(null);
                  setIsSubmitOpen(true);
                }}
                className="gradient-btn"
              >
                <span>Submit a tool</span>
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-12">
            <div className="md:col-span-5">
              <label className="text-xs text-neutral-200">Search</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools, tags, keywords…"
                className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none placeholder:text-neutral-500 focus:border-neutral-600"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-xs text-neutral-200">Category</label>
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
              <label className="text-xs text-neutral-200">Pricing</label>
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
              <label className="text-xs text-neutral-200">Sort</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600"
              >
                <option value="newest">Newest</option>
                <option value="name">Name</option>
                <option value="score">AiDex Score</option>
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

              <div className="text-xs text-neutral-200">
                Showing <span className="text-neutral-200">{Math.min(page * pageSize, filtered.length)}</span>{" "}
                of <span className="text-neutral-200">{filtered.length}</span> tool
                {filtered.length === 1 ? "" : "s"}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {flashMessage && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-emerald-700/40 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-200">
            <span>{flashMessage}</span>
            <button type="button" onClick={() => setFlashMessage(null)} className="rounded-md border border-emerald-700/40 px-2 py-1 text-xs hover:bg-emerald-900/40">Dismiss</button>
          </div>
        )}
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
                onClick={() => navigate(`/tool/${t.id}`)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
                }}
                className="glow-card cursor-pointer"
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
                      "shrink-0 rounded-[9px] border px-2 py-1 text-xs",
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
                  <span className="rounded-[9px] border border-neutral-800 bg-neutral-950 px-2 py-1 text-xs text-neutral-300">
                    {t.category}
                  </span>
                  {tagsList.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-[9px] border border-neutral-800 bg-neutral-950 px-2 py-1 text-xs text-neutral-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-neutral-500">
                    Added {new Date(t.date_added).toLocaleDateString()}
                  </span>
                  <span className="rounded-[9px] border border-cyan-900/70 bg-cyan-950/40 px-2 py-1 text-[11px] text-cyan-300">
                    Score {getAiDexScore(t)}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onVote(t.id, "up")}
                    className="rounded-[9px] border border-neutral-700 px-2 py-1 text-xs text-neutral-200 hover:border-emerald-500"
                  >
                    👍 {t.upvotes ?? 0}
                  </button>
                  <button
                    type="button"
                    onClick={() => onVote(t.id, "down")}
                    className="rounded-[9px] border border-neutral-700 px-2 py-1 text-xs text-neutral-200 hover:border-rose-500"
                  >
                    👎 {t.downvotes ?? 0}
                  </button>
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

        <section className="mt-12 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h3 className="text-lg font-semibold">About AiDex</h3>
          <p className="mt-1 text-sm text-neutral-300">
            AiDex is a curated AI tools directory for discovering chat assistants, image generation platforms,
            voice AI, coding tools, and foundation models. Browse by category, pricing, and open-source status
            to quickly find the right tool for your workflow.
          </p>
        </section>

        {isSubmitOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">Submit a tool</h3>
                  <p className="mt-1 text-sm text-neutral-300">Submissions go into a review queue (admin approval).</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitStep(1);
                    setIsSubmitOpen(false);
                  }}
                  className="rounded-lg border border-neutral-700 px-2.5 py-1.5 text-sm text-neutral-200 hover:border-neutral-500"
                >
                  ✕
                </button>
              </div>

              <form className="grid gap-3 md:grid-cols-3" onSubmit={onSubmit}>
                <div className="md:col-span-3 mb-1 text-xs text-neutral-400">
                  Step {submitStep} of 2
                </div>

                {submitStep === 1 ? (
                  <>
                    <input
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="md:col-span-3 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600"
                      placeholder="https://tool-website.com"
                      required
                    />
                    <div className="md:col-span-3 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitStep(1);
                          setIsSubmitOpen(false);
                        }}
                        className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 hover:border-neutral-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={autofillState === "loading"}
                        onClick={onAutofillFromWebsite}
                        className="gradient-btn disabled:opacity-50"
                      >
                        <span>{autofillState === "loading" ? "Auto-filling…" : "Next: Auto-fill details"}</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600"
                      placeholder="Tool name"
                      required
                    />
                    <input
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600"
                      placeholder="Website URL"
                      required
                    />
                    <select
                      value={submitPricing}
                      onChange={(e) => setSubmitPricing(e.target.value as Pricing)}
                      className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600"
                    >
                      <option>Free</option>
                      <option>Freemium</option>
                      <option>Paid</option>
                      <option>Open Source</option>
                    </select>
                    <select
                      value={submitCategory}
                      onChange={(e) => setSubmitCategory(e.target.value)}
                      className="md:col-span-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600"
                    >
                      {submitCategoryOptions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                    <input
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="md:col-span-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600 disabled:opacity-50"
                      placeholder="New category"
                      disabled={submitCategory !== "Other"}
                      required={submitCategory === "Other"}
                    />
                    <input
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="md:col-span-3 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600"
                      placeholder="Tags (comma-separated)"
                    />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="md:col-span-3 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600"
                      placeholder="Short description"
                      rows={3}
                      required
                    />
                    <div className="md:col-span-3 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSubmitStep(1)}
                        className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 hover:border-neutral-500"
                      >
                        Back
                      </button>
                      <button
                        disabled={submitState === "sending"}
                        className="gradient-btn disabled:opacity-50"
                      >
                        <span>{submitState === "sending" ? "Submitting…" : "Submit for review"}</span>
                      </button>
                    </div>
                  </>
                )}
              </form>

              {submitMessage && <p className="mt-3 text-sm text-neutral-300">{submitMessage}</p>}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} AiDex · v0.1.2</p>
          <p className="mt-1">
            Open-source curated AI tools directory. Repo: 
            <a
              href="https://github.com/Falk0nX/AiDex"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-300 underline decoration-neutral-700 hover:decoration-neutral-300"
            >
              github.com/Falk0nX/AiDex
            </a>
          </p>
        </div>
      </footer>

      <BackToTopButton />
    </div>
  );
}
