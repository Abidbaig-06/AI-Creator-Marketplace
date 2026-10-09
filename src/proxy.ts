import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSafeReturnUrl } from '@/lib/security/safe-urls';

/**
 * Route Proxy & Session Refresh handler.
 * Enforces role-based route protection and refreshes Supabase auth cookies.
 */
export async function proxyAuth(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Authenticate user identity using auth.getUser() — never trust getSession() alone
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;
  const currentPath = pathname + search;

  // 1. Protect /creator and /creator/*
  if (pathname.startsWith('/creator')) {
    if (!user) {
      const safeReturn = getSafeReturnUrl(currentPath, '/creator');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnTo', safeReturn);
      return NextResponse.redirect(loginUrl);
    }

    const role = (user.user_metadata?.role as string) || 'creator';
    if (role !== 'creator' && role !== 'admin') {
      // Wrong role: redirect to their own dashboard
      return NextResponse.redirect(new URL('/brand', request.url));
    }
  }

  // 2. Protect /brand and /brand/*
  if (pathname.startsWith('/brand')) {
    if (!user) {
      const safeReturn = getSafeReturnUrl(currentPath, '/brand');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnTo', safeReturn);
      return NextResponse.redirect(loginUrl);
    }

    const role = (user.user_metadata?.role as string) || 'creator';
    if (role !== 'brand' && role !== 'agency' && role !== 'admin') {
      // Wrong role: redirect to their own dashboard
      return NextResponse.redirect(new URL('/creator', request.url));
    }
  }

  // 3. Prevent already-authenticated users from revisiting /login or /signup
  if (pathname === '/login' || pathname === '/signup') {
    if (user) {
      const returnTo = request.nextUrl.searchParams.get('returnTo');
      const safeReturn = returnTo ? getSafeReturnUrl(returnTo, null as unknown as string) : null;
      if (safeReturn) {
        return NextResponse.redirect(new URL(safeReturn, request.url));
      }

      const role = (user.user_metadata?.role as string) || 'creator';
      const target = (role === 'brand' || role === 'agency') ? '/brand' : '/creator';
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  return response;
}
