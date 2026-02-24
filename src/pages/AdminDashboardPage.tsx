import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../lib/api';

type Submission = {
  id: number;
  name: string;
  website_url: string;
  description: string;
  category: string;
  pricing: string;
  tags: string;
  created_at: string;
};

type ReviewTool = {
  id: number;
  name: string;
  website_url: string;
  description: string;
  category: string;
  pricing: string;
  tags: string;
  needs_copy_review: number;
  copy_review_notes?: string | null;
  date_added: string;
};

export default function AdminDashboardPage() {
  const nav = useNavigate();
  const [pending, setPending] = useState<Submission[]>([]);
  const [reviewQueue, setReviewQueue] = useState<ReviewTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);

  const load = async () => {
    setError(null);
    try {
      const [p, r] = await Promise.all([
        apiGet<{ ok: true; items: Submission[] }>('/api/get_pending.php'),
        apiGet<{ ok: true; items: ReviewTool[] }>('/api/get_copy_review_queue.php'),
      ]);
      setPending(p.items || []);
      setReviewQueue(r.items || []);
    } catch (e: any) {
      if ((e.message || '').toLowerCase().includes('unauthorized')) {
        nav('/admin/login');
        return;
      }
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const actPending = async (path: string, id: number) => {
    try {
      await apiPost(path, { id });
      await load();
    } catch (e: any) {
      setError(e.message || 'Action failed');
    }
  };

  const updateLocalTool = (id: number, patch: Partial<ReviewTool>) => {
    setReviewQueue((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const saveCopy = async (t: ReviewTool) => {
    setSavingId(t.id);
    setError(null);
    try {
      await apiPost('/api/update_tool_copy.php', {
        id: t.id,
        name: t.name,
        description: t.description,
        category: t.category,
        pricing: t.pricing,
        tags: t.tags,
        copy_review_notes: t.copy_review_notes || '',
      });
      await load();
    } catch (e: any) {
      setError(e.message || 'Save failed');
    } finally {
      setSavingId(null);
    }
  };

  const markReviewed = async (id: number) => {
    setSavingId(id);
    setError(null);
    try {
      await apiPost('/api/mark_copy_reviewed.php', { id });
      await load();
    } catch (e: any) {
      setError(e.message || 'Action failed');
    } finally {
      setSavingId(null);
    }
  };

  const logout = async () => {
    await apiPost('/api/admin_logout.php', {});
    nav('/admin/login');
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-4 text-neutral-50">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <button onClick={logout} className="rounded-lg border border-neutral-700 px-3 py-2 text-sm">
            Logout
          </button>
        </div>

        {loading && <p className="text-sm text-neutral-400">Loading…</p>}
        {error && <p className="mb-3 text-sm text-red-300">{error}</p>}

        <section className="mb-6 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <h2 className="text-lg font-semibold">Pending submissions</h2>
          <div className="mt-3 grid gap-3">
            {pending.map((it) => (
              <article key={it.id} className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                <h3 className="text-lg font-semibold">{it.name}</h3>
                <p className="mt-1 text-sm text-neutral-300">{it.description}</p>
                <div className="mt-2 text-xs text-neutral-400">
                  {it.category} · {it.pricing} · {it.tags}
                </div>
                <a href={it.website_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm underline">
                  {it.website_url}
                </a>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => actPending('/api/approve.php', it.id)} className="rounded-lg bg-emerald-500 px-3 py-2 text-sm text-black">
                    Approve
                  </button>
                  <button onClick={() => actPending('/api/reject.php', it.id)} className="rounded-lg bg-red-500 px-3 py-2 text-sm text-black">
                    Reject
                  </button>
                </div>
              </article>
            ))}
            {!loading && pending.length === 0 && <p className="text-sm text-neutral-400">No pending submissions.</p>}
          </div>
        </section>

        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <h2 className="text-lg font-semibold">Copy review queue (already published)</h2>
          <p className="mt-1 text-xs text-neutral-400">Edit and polish descriptions/tags/categories, then mark reviewed.</p>
          <div className="mt-3 grid gap-3">
            {reviewQueue.map((t) => (
              <article key={t.id} className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                <div className="grid gap-2 md:grid-cols-2">
                  <input
                    value={t.name}
                    onChange={(e) => updateLocalTool(t.id, { name: e.target.value })}
                    className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm"
                  />
                  <input
                    value={t.website_url}
                    readOnly
                    className="rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-400"
                  />
                  <input
                    value={t.category}
                    onChange={(e) => updateLocalTool(t.id, { category: e.target.value })}
                    className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm"
                  />
                  <select
                    value={t.pricing}
                    onChange={(e) => updateLocalTool(t.id, { pricing: e.target.value })}
                    className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm"
                  >
                    <option>Free</option>
                    <option>Freemium</option>
                    <option>Paid</option>
                    <option>Open Source</option>
                  </select>
                </div>

                <textarea
                  value={t.description}
                  onChange={(e) => updateLocalTool(t.id, { description: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm"
                  rows={3}
                />
                <input
                  value={t.tags}
                  onChange={(e) => updateLocalTool(t.id, { tags: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm"
                  placeholder="tags,comma,separated"
                />
                <input
                  value={t.copy_review_notes || ''}
                  onChange={(e) => updateLocalTool(t.id, { copy_review_notes: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm"
                  placeholder="Internal notes"
                />

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => saveCopy(t)}
                    disabled={savingId === t.id}
                    className="rounded-lg bg-sky-500 px-3 py-2 text-sm text-black disabled:opacity-50"
                  >
                    Save edits
                  </button>
                  <button
                    onClick={() => markReviewed(t.id)}
                    disabled={savingId === t.id}
                    className="rounded-lg bg-emerald-500 px-3 py-2 text-sm text-black disabled:opacity-50"
                  >
                    Mark reviewed
                  </button>
                </div>
              </article>
            ))}
            {!loading && reviewQueue.length === 0 && <p className="text-sm text-neutral-400">No tools waiting for copy review.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
