import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function CreatorsPage() {
  let creators: Array<{
    id: string;
    full_name: string;
    avatar_url: string | null;
    created_at: string;
  }> = [];
  let errorMsg: string | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('public_profiles')
      .select('*')
      .eq('role', 'creator')
      .limit(20);

    if (error) {
      errorMsg = error.message;
    } else if (data) {
      creators = data;
    }
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : 'Failed to query database';
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-8 border-b border-slate-800 gap-4">
          <div>
            <span className="inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20 mb-2">
              Verified Marketplace
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">AI Creator Directory</h1>
            <p className="mt-1 text-sm text-slate-400">
              Browse elite generative AI creators with verified proof-of-work
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              Join as Creator
            </Link>
          </div>
        </div>

        {errorMsg && (
          <div className="my-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-300">
            Database note: {errorMsg}
          </div>
        )}

        <div className="mt-8">
          {creators.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
                ✨
              </div>
              <h3 className="text-lg font-semibold text-white">No creators registered yet</h3>
              <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
                Be the first AI creator to register your profile and showcase verified AI generations!
              </p>
              <div className="mt-6">
                <Link
                  href="/signup"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition"
                >
                  Create Creator Profile
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creators.map((creator) => (
                <div
                  key={creator.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-lg font-bold text-indigo-400">
                      {creator.full_name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{creator.full_name}</h3>
                      <p className="text-xs text-indigo-400 font-medium">Verified AI Creator</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
