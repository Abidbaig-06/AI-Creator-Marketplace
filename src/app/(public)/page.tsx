import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-100">
      <div className="max-w-2xl space-y-6">
        <span className="inline-block rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
          ByteXL HackXlarate 2026
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
          CreatorProof <span className="text-indigo-500">AI</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg">
          AI Content Creator Marketplace with Verified Proof of Work, Cryptographic Prompt Verification & Automated Brief Matching.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/signup"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition"
          >
            Sign In
          </Link>
          <Link
            href="/creators"
            className="rounded-xl border border-slate-800 bg-slate-900/50 px-6 py-3 text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            Explore Creators
          </Link>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex items-center justify-center gap-6 text-xs text-slate-500">
          <span>PostgreSQL 17-Table Schema</span>
          <span>•</span>
          <span>Row Level Security (RLS)</span>
          <span>•</span>
          <span>Verified Proof-of-Work</span>
        </div>
      </div>
    </main>
  );
}
