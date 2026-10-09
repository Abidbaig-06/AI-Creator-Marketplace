import { redirect } from 'next/navigation';
import { getCurrentUser, getCurrentProfile } from '@/lib/auth/session';
import type { UserRole } from '@/types/database';

export class AuthorizationError extends Error {
  constructor(message: string, public statusCode: number = 403) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

/**
 * Enforces that the caller is authenticated via Supabase auth.getUser().
 * If unauthenticated in a Server Component / Action, redirects to /login with a safe return path.
 */
export async function requireAuth(returnTo?: string) {
  const user = await getCurrentUser();
  if (!user) {
    const query = returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : '';
    redirect(`/login${query}`);
  }
  return user;
}

/**
 * Enforces that the authenticated user possesses one of the allowed roles.
 * If the user has a different role, redirects them to their respective dashboard.
 */
export async function requireRole(allowedRoles: UserRole[], returnTo?: string) {
  const user = await requireAuth(returnTo);
  const profile = await getCurrentProfile();

  const userRole: UserRole = profile?.role || (user.user_metadata?.role as UserRole) || 'creator';

  if (!allowedRoles.includes(userRole)) {
    // Redirect signed-in users with the wrong role to their own dashboard
    if (userRole === 'brand') {
      redirect('/brand');
    } else if (userRole === 'creator') {
      redirect('/creator');
    } else {
      redirect('/');
    }
  }

  return { user, profile, role: userRole };
}

/**
 * Enforces creator role on protected routes and actions.
 */
export async function requireCreator(returnTo?: string) {
  return requireRole(['creator', 'admin'], returnTo);
}

/**
 * Enforces brand or agency role on protected routes and actions.
 */
export async function requireBrand(returnTo?: string) {
  return requireRole(['brand', 'agency' as UserRole, 'admin'], returnTo);
}

/**
 * Enforces resource ownership. Throws AuthorizationError if caller is neither
 * the resource owner nor an admin.
 */
export function assertOwnership(
  resourceOwnerId: string,
  currentUserId: string,
  isAdmin: boolean = false
) {
  if (isAdmin) return;
  if (!resourceOwnerId || resourceOwnerId !== currentUserId) {
    throw new AuthorizationError('You do not have permission to access or modify this resource.', 403);
  }
}
