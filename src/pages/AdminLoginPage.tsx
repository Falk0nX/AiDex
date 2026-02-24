import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../lib/api';
export default function AdminLoginPage() {
  const nav = useNavigate(); const [username, setUsername] = useState(''); const [password, setPassword] = useState(''); const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null);
  const onSubmit = async (e: React.FormEvent) => { e.preventDefault(); setError(null); setLoading(true); try { await apiPost('/api/admin_login.php', { username, password }); nav('/admin'); } catch (err: any) { setError(err.message || 'Login failed'); } finally { setLoading(false); } };
  return <div className="min-h-screen bg-neutral-950 text-neutral-50 p-4"><div className="mx-auto max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-6"><h1 className="text-xl font-semibold">Admin Login</h1><form className="mt-4 grid gap-3" onSubmit={onSubmit}><input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm" required/><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm" required/><button disabled={loading} className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950 disabled:opacity-50">{loading?'Logging in…':'Login'}</button></form>{error&&<p className="mt-3 text-sm text-red-300">{error}</p>}</div></div>;
}
