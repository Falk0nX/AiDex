import { useState } from "react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import BackToTopButton from "./BackToTopButton";

export default function SiteShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Directory" },
    { to: "/leaderboard", label: "Leaderboard" },
    { to: "/compare", label: "Compare" },
    { to: "/blog", label: "Blog" },
    { to: "/#submit", label: "Submit", external: true },
  ];

  return (
    <div className="gradient-dot-hero min-h-screen text-neutral-50">
      <header className="site-base border-b border-cyan-900/40 shadow-[0_20px_60px_rgba(2,6,23,0.65)] backdrop-blur sticky top-0 z-50">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-3 px-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 shrink-0">
            <img src="/aidex-logo-square.jpg" alt="AiDex logo" className="h-10 w-10 rounded-md border border-neutral-800 object-cover" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
              {subtitle ? <p className="text-xs text-neutral-400">{subtitle}</p> : null}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-wrap gap-2 text-sm">
            {navLinks.map((link) => (
              link.external ? (
                <a key={link.label} href={link.to} className="gradient-btn px-3 py-1.5 whitespace-nowrap">
                  <span>{link.label}</span>
                </a>
              ) : (
                <Link key={link.to} to={link.to} className="gradient-btn px-3 py-1.5 whitespace-nowrap">
                  <span>{link.label}</span>
                </Link>
              )
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-cyan-900/40 bg-neutral-900/95 backdrop-blur">
            <nav className="flex flex-col px-4 py-3 gap-2">
              {navLinks.map((link) => (
                link.external ? (
                  <a
                    key={link.label}
                    href={link.to}
                    className="px-4 py-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700 text-center font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="px-4 py-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700 text-center font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

      <footer className="mt-10 border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-neutral-500">
          © {new Date().getFullYear()} AiDex · Open-source curated AI tools directory ·
          <a href="https://github.com/Falk0nX/AiDex" target="_blank" rel="noopener noreferrer" className="ml-1 text-neutral-300 underline decoration-neutral-700 hover:decoration-neutral-300">github.com/Falk0nX/AiDex</a>
        </div>
      </footer>

      <BackToTopButton />
    </div>
  );
}
