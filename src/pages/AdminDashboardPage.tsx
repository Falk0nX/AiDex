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

type ToolItem = {
  id: number;
  name: string;
  website_url: string;
  description: string;
  category: string;
  pricing: string;
  tags: string;
  is_hidden: boolean;
  needs_copy_review: boolean;
  copy_review_notes?: string | null;
  date_added: string;
  rewrite_input?: string;
};

export default function AdminDashboardPage() {
  const nav = useNavigate();
  const [pending, setPending] = useState<Submission[]>([]);
  const [reviewQueue, setReviewQueue] = useState<ToolItem[]>([]);
  const [published, setPublished] = useState<ToolItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [publishedQuery, setPublishedQuery] = useState('');

  const load = async () => {
    setError(null);
    try {
      const [p, r, all] = await Promise.all([
        apiGet<{ ok: true; items: Submission[] }>('/api/get_pending.php'),
        apiGet<{ ok: true; items: ToolItem[] }>('/api/get_copy_review_queue.php'),
        apiGet<{ ok: true; items: ToolItem[] }>('/api/get_tools_admin.php?limit=300'),
      ]);
      setPending(p.items || []);
      setReviewQueue((r.items || []).map((x) => ({ ...x, rewrite_input: '' })));
      setPublished((all.items || []).map((x) => ({ ...x, rewrite_input: '' })));
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

  const updateLocal = (setFn: any, id: number, patch: Partial<ToolItem>) => {
    setFn((prev: ToolItem[]) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const saveTool = async (t: ToolItem) => {
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
      setInfo(`Saved ${t.name}`);
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
      setInfo(`Marked #${id} reviewed`);
      await load();
    } catch (e: any) {
      setError(e.message || 'Action failed');
    } finally {
      setSavingId(null);
    }
  };

  const setHidden = async (id: number, hidden: boolean) => {
    setSavingId(id);
    setError(null);
    try {
      await apiPost('/api/update_tool_visibility.php', { id, hidden });
      setInfo(hidden ? `Tool #${id} hidden` : `Tool #${id} visible`);
      await load();
    } catch (e: any) {
      setError(e.message || 'Visibility update failed');
    } finally {
      setSavingId(null);
    }
  };

  const deleteTool = async (id: number, name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    setSavingId(id);
    setError(null);
    try {
      await apiPost('/api/delete_tool.php', { id });
      setInfo(`Deleted ${name}`);
      await load();
    } catch (e: any) {
      setError(e.message || 'Delete failed');
    } finally {
      setSavingId(null);
    }
  };

  const buildRewritePrompt = (t: ToolItem) => {
    return [
      `Rewrite AiDex tool copy for:`,
      `Tool: ${t.name}`,
      `Website: ${t.website_url}`,
      `Current category: ${t.category}`,
      `Current pricing: ${t.pricing}`,
      `Current tags: ${t.tags || '(none)'}`,
      `Current description: ${t.description}`,
      '',
      'Return exactly this format:',
      'Description: ...',
      'Category: ...',
      'Tags: tag1,tag2,tag3',
      'Pricing: Free|Freemium|Paid|Open Source',
      'Notes: ...',
    ].join('\n');
  };

  const sendToTrujilloClaw = async (t: ToolItem) => {
    try {
      await navigator.clipboard.writeText(buildRewritePrompt(t));
      setInfo(`Copied rewrite prompt for ${t.name}. Paste it in chat and I’ll rewrite it.`);
    } catch {
      setError('Could not copy prompt to clipboard.');
    }
  };

  const applyRewriteResult = (setFn: any, t: ToolItem) => {
    const txt = (t.rewrite_input || '').trim();
    if (!txt) return;
    const get = (label: string) => {
      const m = txt.match(new RegExp(`^${label}:\\s*(.+)$`, 'im'));
      return m ? m[1].trim() : '';
    };
    const patch: Partial<ToolItem> = {};
    const desc = get('Description');
    const cat = get('Category');
    const tags = get('Tags');
    const pricing = get('Pricing');
    const notes = get('Notes');
    if (desc) patch.description = desc;
    if (cat) patch.category = cat;
    if (tags) patch.tags = tags;
    if (pricing && ['Free', 'Freemium', 'Paid', 'Open Source'].includes(pricing)) patch.pricing = pricing;
    if (notes) patch.copy_review_notes = notes;
    patch.rewrite_input = '';
    updateLocal(setFn, t.id, patch);
    setInfo(`Applied parsed rewrite for ${t.name}`);
  };

  const logout = async () => {
    await apiPost('/api/admin_logout.php', {});
    nav('/admin/login');
  };

  const filteredPublished = published.filter((t) => {
    const q = publishedQuery.trim().toLowerCase();
    if (!q) return true;
    return [t.name, t.website_url, t.category, t.tags, t.description].join(' ').toLowerCase().includes(q);
  });

  const ToolEditor = ({ t, setFn, showReviewActions = false }: { t: ToolItem; setFn: any; showReviewActions?: boolean }) => (
    <article className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
      <div className="grid gap-2 md:grid-cols-2">
        <input value={t.name} onChange={(e) => updateLocal(setFn, t.id, { name: e.target.value })} className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm" />
        <input value={t.website_url} readOnly className="rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-400" />
        <input value={t.category} onChange={(e) => updateLocal(setFn, t.id, { category: e.target.value })} className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm" />
        <select value={t.pricing} onChange={(e) => updateLocal(setFn, t.id, { pricing: e.target.value })} className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm">
          <option>Free</option><option>Freemium</option><option>Paid</option><option>Open Source</option>
        </select>
      </div>

      <textarea value={t.description} onChange={(e) => updateLocal(setFn, t.id, { description: e.target.value })} className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm" rows={3} />
      <input value={t.tags} onChange={(e) => updateLocal(setFn, t.id, { tags: e.target.value })} className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm" placeholder="tags,comma,separated" />
      <input value={t.copy_review_notes || ''} onChange={(e) => updateLocal(setFn, t.id, { copy_review_notes: e.target.value })} className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm" placeholder="Internal notes" />

      <textarea
        value={t.rewrite_input || ''}
        onChange={(e) => updateLocal(setFn, t.id, { rewrite_input: e.target.value })}
        className="mt-2 w-full rounded-lg border border-fuchsia-800/70 bg-fuchsia-950/20 px-3 py-2 text-sm"
        rows={4}
        placeholder="Paste rewritten result here (Description:, Category:, Tags:, Pricing:, Notes:)"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={() => sendToTrujilloClaw(t)} className="rounded-lg border border-fuchsia-500/40 bg-fuchsia-900/30 px-3 py-2 text-sm text-fuchsia-200">Send to TrujilloClaw</button>
        <button onClick={() => applyRewriteResult(setFn, t)} className="rounded-lg border border-violet-500/40 bg-violet-900/30 px-3 py-2 text-sm text-violet-200">Apply rewritten result</button>
        <button onClick={() => saveTool(t)} disabled={savingId === t.id} className="rounded-lg bg-sky-500 px-3 py-2 text-sm text-black disabled:opacity-50">Save edits</button>
        {showReviewActions && (
          <button onClick={() => markReviewed(t.id)} disabled={savingId === t.id} className="rounded-lg bg-emerald-500 px-3 py-2 text-sm text-black disabled:opacity-50">Mark reviewed</button>
        )}
        <button onClick={() => setHidden(t.id, !t.is_hidden)} disabled={savingId === t.id} className="rounded-lg border border-amber-500/40 bg-amber-900/20 px-3 py-2 text-sm text-amber-200 disabled:opacity-50">{t.is_hidden ? 'Unhide' : 'Hide'}</button>
        <button onClick={() => deleteTool(t.id, t.name)} disabled={savingId === t.id} className="rounded-lg border border-red-500/40 bg-red-900/20 px-3 py-2 text-sm text-red-200 disabled:opacity-50">Delete</button>
      </div>
    </article>
  );

  return (
    <div className="min-h-screen bg-neutral-950 p-4 text-neutral-50">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <button onClick={logout} className="rounded-lg border border-neutral-700 px-3 py-2 text-sm">Logout</button>
        </div>

        {loading && <p className="text-sm text-neutral-400">Loading…</p>}
        {error && <p className="mb-3 text-sm text-red-300">{error}</p>}
        {info && <p className="mb-3 text-sm text-emerald-300">{info}</p>}

        <section className="mb-6 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <h2 className="text-lg font-semibold">Pending submissions</h2>
          <div className="mt-3 grid gap-3">
            {pending.map((it) => (
              <article key={it.id} className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                <h3 className="text-lg font-semibold">{it.name}</h3>
                <p className="mt-1 text-sm text-neutral-300">{it.description}</p>
                <div className="mt-2 text-xs text-neutral-400">{it.category} · {it.pricing} · {it.tags}</div>
                <a href={it.website_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm underline">{it.website_url}</a>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => actPending('/api/approve.php', it.id)} className="rounded-lg bg-emerald-500 px-3 py-2 text-sm text-black">Approve</button>
                  <button onClick={() => actPending('/api/reject.php', it.id)} className="rounded-lg bg-red-500 px-3 py-2 text-sm text-black">Reject</button>
                </div>
              </article>
            ))}
            {!loading && pending.length === 0 && <p className="text-sm text-neutral-400">No pending submissions.</p>}
          </div>
        </section>

        <section className="mb-6 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <h2 className="text-lg font-semibold">Copy review queue (already published)</h2>
          <p className="mt-1 text-xs text-neutral-400">Rewrite/upgrade content, save, then mark reviewed.</p>
          <div className="mt-3 grid gap-3">
            {reviewQueue.map((t) => <ToolEditor key={t.id} t={t} setFn={setReviewQueue} showReviewActions />)}
            {!loading && reviewQueue.length === 0 && <p className="text-sm text-neutral-400">No tools waiting for copy review.</p>}
          </div>
        </section>

        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <h2 className="text-lg font-semibold">Manage published tools</h2>
          <p className="mt-1 text-xs text-neutral-400">Edit, hide/unhide, or delete any published card.</p>
          <input
            value={publishedQuery}
            onChange={(e) => setPublishedQuery(e.target.value)}
            placeholder="Search published tools by name, URL, tags, category…"
            className="mt-3 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-600"
          />
          <div className="mt-3 grid gap-3">
            {filteredPublished.map((t) => <ToolEditor key={t.id} t={t} setFn={setPublished} />)}
            {!loading && published.length === 0 && <p className="text-sm text-neutral-400">No published tools found.</p>}
            {!loading && published.length > 0 && filteredPublished.length === 0 && (
              <p className="text-sm text-neutral-400">No tools match your search.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
