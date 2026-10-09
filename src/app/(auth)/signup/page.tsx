'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signUpUser } from '@/lib/auth/actions';

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signUpUser, null);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 text-center">
          <span className="inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20 mb-3">
            CreatorProof AI
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create an Account</h1>
          <p className="mt-1 text-sm text-slate-400">Join the AI Content Creator Marketplace</p>
        </div>

        {state?.error && (
          <div className="mb-4 rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-rose-400">
            {state.error}
          </div>
        )}

        {state?.success ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xl font-bold">
              ✓
            </div>
            <h3 className="font-semibold text-white">Confirmation Email Sent</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {state.success}
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-block rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                Full Name or Company Name
              </label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="Alex Rivers or Acme Studios"
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                I want to join as a
              </label>
              <select
                name="role"
                defaultValue="creator"
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="creator">AI Content Creator (Showcase & Earn)</option>
                <option value="brand">Brand / Agency (Post Briefs & Hire)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 transition"
            >
              {isPending ? 'Registering Account...' : 'Create Account'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300 underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
