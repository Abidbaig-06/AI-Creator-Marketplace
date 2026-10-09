import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ensureUserProfile } from '@/lib/auth/session';
import { getSafeReturnUrl } from '@/lib/security/safe-urls';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // Authenticate the user and ensure an application profile exists
        const { data: { user } } = await supabase.auth.getUser();

        let target = '/creator';
        if (user) {
          await ensureUserProfile(supabase, user);
          const role = (user.user_metadata?.role as string) || 'creator';
          target = (role === 'brand' || role === 'agency') ? '/brand' : '/creator';
        }

        // If next is a safe specific URL other than root, honor it
        if (next && next !== '/') {
          const safeNext = getSafeReturnUrl(next, '');
          if (safeNext) {
            target = safeNext;
          }
        }

        const forwardedHost = request.headers.get('x-forwarded-host');
        const isLocalEnv = process.env.NODE_ENV === 'development';

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${target}`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${target}`);
        } else {
          return NextResponse.redirect(`${origin}${target}`);
        }
      }
    } catch (err) {
      console.error('Auth callback exchange error:', err);
    }
  }

  // Redirect to auth error page on failure
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
