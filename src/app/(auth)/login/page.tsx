'use client';

import { useActionState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signInUser } from '@/lib/auth/actions';

function LoginForm() {
  const [state, formAction, isPending] = useActionState(signInUser, null);
  const searchParams = useSearchParams();
  const returnTo = searchParams?.get('returnTo') || '';
  const urlError = searchParams?.get('error') || null;
  const urlMessage = searchParams?.get('message') || null;

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-6 text-center">
        <span className="inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20 mb-3">
          CreatorProof AI
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-white">Sign In</h1>
        <p className="mt-1 text-sm text-slate-400">Welcome back to the marketplace</p>
      </div>

      {urlMessage && (
        <div className="mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-sm text-emerald-400">
          {urlMessage}
        </div>
      )}

      {(state?.error || urlError) && (
        <div className="mb-4 rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-rose-400">
          {state?.error || (urlError === 'auth_callback_failed' ? 'Authentication verification failed. Please try again.' : urlError)}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}

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
            placeholder="••••••••"
            className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 transition"
        >
          {isPending ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-400">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-indigo-400 hover:text-indigo-300 underline">
          Create an Account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-950 text-slate-100">
      <Suspense fallback={<div className="text-slate-400">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
