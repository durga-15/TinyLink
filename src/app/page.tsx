import Link from 'next/link';

import { LinkManager } from '@/components/LinkManager';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-indigo-600">TinyLink</p>
            <h1 className="text-xl font-semibold text-slate-900">Instant URL shortener</h1>
          </div>
          <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <Link href="/healthz" prefetch={false} className="hover:text-slate-900">
              Health
            </Link>
            <a
              href="https://github.com/yourname/tinylink"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <section className="rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-sky-500 p-6 text-white shadow-lg">
          <h2 className="text-3xl font-semibold">Shorten, manage, and monitor every link</h2>
          <p className="mt-2 max-w-2xl text-sm text-indigo-100">
            Create branded short codes, track click-through performance in real time, and keep your links
            healthy with inline validation and analytics.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-indigo-50">
            <div className="rounded-full bg-white/20 px-3 py-1">Custom codes</div>
            <div className="rounded-full bg-white/20 px-3 py-1">Realtime stats</div>
            <div className="rounded-full bg-white/20 px-3 py-1">Health monitoring</div>
          </div>
        </section>

        <LinkManager />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} TinyLink. Built with Next.js.</p>
          <a href="https://vercel.com" className="hover:text-slate-900" target="_blank" rel="noreferrer">
            Hosted on Vercel
          </a>
        </div>
      </footer>
    </div>
  );
}
