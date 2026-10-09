import { requireCreator } from '@/lib/auth/permissions';
import { signOutUser } from '@/lib/auth/actions';

export const dynamic = 'force-dynamic';

export default async function CreatorDashboardPage() {
  const { user, profile } = await requireCreator('/creator');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Creator Dashboard
            </span>
            <h1 className="text-2xl font-bold mt-2 text-white">
              Welcome, {profile?.full_name || user.email}
            </h1>
            <p className="text-xs text-slate-400">Authenticated as Creator ({user.email})</p>
          </div>
          <form action={signOutUser}>
            <button
              type="submit"
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              Sign Out
            </button>
          </form>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-sm font-semibold text-white">Proof-of-Work Verification</h2>
          <p className="text-xs text-slate-400 mt-1">
            Upload AI generation prompts, screen logs, and source assets to increase your Proof Score.
          </p>
        </div>
      </div>
    </div>
  );
}
