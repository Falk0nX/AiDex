import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export default function SiteShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.12),transparent_30%)]">
      <header className="border-b border-neutral-800/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5">
          <div className="flex items-center gap-3">
            <img src="/aidex-logo-square.jpg" alt="AiDex logo" className="h-10 w-10 rounded-md border border-neutral-800 object-cover" />
            <div>
              <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
              {subtitle ? <p className="text-xs text-neutral-400">{subtitle}</p> : null}
            </div>
          </div>

          <nav className="flex flex-wrap gap-2 text-sm">
            <Link to="/" className="rounded-lg border border-neutral-700 px-3 py-1.5 hover:border-neutral-500">Directory</Link>
            <Link to="/leaderboard" className="rounded-lg border border-neutral-700 px-3 py-1.5 hover:border-neutral-500">Leaderboard</Link>
            <Link to="/compare" className="rounded-lg border border-neutral-700 px-3 py-1.5 hover:border-neutral-500">Compare</Link>
            <a href="/#submit" className="rounded-lg bg-white px-3 py-1.5 font-medium text-neutral-950 hover:bg-neutral-200">Submit</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

      <footer className="mt-10 border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-neutral-500">
          © {new Date().getFullYear()} AiDex · Open-source curated AI tools directory ·
          <a href="https://github.com/Falk0nX/AiDex" target="_blank" rel="noopener noreferrer" className="ml-1 text-neutral-300 underline decoration-neutral-700 hover:decoration-neutral-300">github.com/Falk0nX/AiDex</a>
        </div>
      </footer>
    </div>
  );
}
