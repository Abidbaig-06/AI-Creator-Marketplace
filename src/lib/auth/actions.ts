'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getSafeReturnUrl } from '@/lib/security/safe-urls';
import { ensureUserProfile } from '@/lib/auth/session';
import type { UserRole } from '@/types/database';

export interface AuthState {
  error?: string;
  success?: string;
}

export async function signUpUser(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString();
  const fullName = formData.get('fullName')?.toString().trim();
  const role = (formData.get('role')?.toString() || 'creator') as UserRole;

  if (!email || !password || !fullName) {
    return { error: 'All fields are required.' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' };
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  if (authData.user) {
    // If a session was returned immediately (autoconfirm enabled), ensure profile and redirect
    if (authData.session) {
      await ensureUserProfile(supabase, authData.user);
      redirect(role === 'brand' ? '/brand' : '/creator');
    }

    // If no session returned, email confirmation is enabled
    return {
      success: `Account created successfully! Please check your email (${email}) to confirm your account before signing in.`,
    };
  }

  return { error: 'Unable to complete registration. Please try again.' };
}

export async function signInUser(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString();
  const returnToRaw = formData.get('returnTo')?.toString();

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const supabase = await createClient();

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return { error: signInError.message };
  }

  const user = signInData.user;
  if (user) {
    // Ensure application profile is synced
    await ensureUserProfile(supabase, user);

    // If safe returnTo is present, prioritize it
    const safeReturn = returnToRaw ? getSafeReturnUrl(returnToRaw, '') : '';
    if (safeReturn && safeReturn !== '/login') {
      redirect(safeReturn);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase.from('profiles') as any)
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const userRole = (profile as { role?: UserRole } | null)?.role || (user.user_metadata?.role as UserRole);
    if (userRole === 'brand' || userRole === 'agency') {
      redirect('/brand');
    } else {
      redirect('/creator');
    }
  }

  redirect('/');
}

export async function signOutUser() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
