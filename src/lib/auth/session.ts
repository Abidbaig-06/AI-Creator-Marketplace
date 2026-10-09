import { createClient } from '@/lib/supabase/server';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Database, UserRole } from '@/types/database';

export interface UserSessionData {
  user: User;
  role: UserRole;
  profileId: string;
  fullName: string;
  email: string;
}

/**
 * Validates server-side user identity using Supabase auth.getUser().
 * Never trusts getSession() alone for authorization decisions.
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * Retrieves the full application profile for the authenticated user.
 */
export async function getCurrentProfile() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error: profileError } = await (supabase.from('profiles') as any)
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError || !profile) {
      // If user is authenticated but profile is missing (e.g. fresh email confirmation), ensure it
      return await ensureUserProfile(supabase, user);
    }
    return profile;
  } catch {
    return null;
  }
}

/**
 * Ensures an application profile exists for an authenticated auth.users record.
 * Prevents orphaned profiles after email confirmation or OAuth callbacks.
 */
export async function ensureUserProfile(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, any, any>,
  user: User
) {
  try {
    const role: UserRole = (user.user_metadata?.role as UserRole) || 'creator';
    const fullName: string = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    const email: string = user.email || '';

    // Check if profile already exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase.from('profiles') as any)
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (existing) {
      return existing;
    }

    // Insert baseline profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: newProfile, error: profileErr } = await (supabase.from('profiles') as any)
      .upsert({
        id: user.id,
        email,
        display_name: fullName,
        role: role === 'admin' ? 'creator' : role,
      })
      .select()
      .maybeSingle();

    if (profileErr) {
      console.warn('ensureUserProfile notice:', profileErr.message);
      return null;
    }

    // Ensure corresponding role profile exists
    if (role === 'creator') {
      const handle = (email.split('@')[0] || 'creator').toLowerCase().replace(/[^a-z0-9_]/g, '_');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('creator_profiles') as any).upsert({
        profile_id: user.id,
        handle: `${handle}_${user.id.slice(0, 4)}`,
        specialization: user.user_metadata?.specialization || 'AI Visual Production',
        availability: 'available',
        is_verified: false,
        verification_status: 'unverified',
      });
    } else if (role === 'brand') {
      const companyName = user.user_metadata?.company_name || fullName;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('brand_profiles') as any).upsert({
        profile_id: user.id,
        company_name: companyName,
        billing_email: email,
        is_verified: false,
      });
    }

    return newProfile;
  } catch (err) {
    console.error('Error ensuring user profile:', err);
    return null;
  }
}
