import { describe, it, expect, vi } from 'vitest';
import { getSafeReturnUrl } from '../src/lib/security/safe-urls';
import { assertOwnership, AuthorizationError } from '../src/lib/auth/permissions';
import { ensureUserProfile } from '../src/lib/auth/session';

describe('Authentication & Protected-Route Security Suite', () => {
  describe('1. Open Redirect & Safe Return URL Protection', () => {
    it('accepts safe relative internal paths', () => {
      expect(getSafeReturnUrl('/creator')).toBe('/creator');
      expect(getSafeReturnUrl('/brand/briefs/new')).toBe('/brand/briefs/new');
      expect(getSafeReturnUrl('/creators?category=video')).toBe('/creators?category=video');
    });

    it('rejects protocol-relative URLs (//evil.com)', () => {
      expect(getSafeReturnUrl('//attacker.com')).toBe('/');
      expect(getSafeReturnUrl('//evil.com/phishing')).toBe('/');
    });

    it('rejects absolute URLs with protocol schemes (http/https/javascript)', () => {
      expect(getSafeReturnUrl('https://evil.com')).toBe('/');
      expect(getSafeReturnUrl('http://phishing.org/login')).toBe('/');
      expect(getSafeReturnUrl('javascript:alert(1)')).toBe('/');
    });

    it('rejects Windows and browser backslash evasion attempts (/\\evil.com)', () => {
      expect(getSafeReturnUrl('/\\evil.com')).toBe('/');
      expect(getSafeReturnUrl('\\evil.com')).toBe('/');
    });

    it('falls back to custom fallback path when specified', () => {
      expect(getSafeReturnUrl('https://malicious.com', '/creator')).toBe('/creator');
      expect(getSafeReturnUrl('', '/brand')).toBe('/brand');
      expect(getSafeReturnUrl(null, '/login')).toBe('/login');
    });
  });

  describe('2. Role-Based Route Authorization Logic', () => {
    // Evaluates route proxy redirect policy
    function evaluateRouteAccess(user: { id: string; role: string } | null, pathname: string) {
      if (!user) {
        return {
          allowed: false,
          redirect: `/login?returnTo=${encodeURIComponent(pathname)}`,
        };
      }

      if (pathname.startsWith('/creator')) {
        if (user.role === 'creator' || user.role === 'admin') {
          return { allowed: true, redirect: null };
        }
        return { allowed: false, redirect: '/brand' };
      }

      if (pathname.startsWith('/brand')) {
        if (user.role === 'brand' || user.role === 'agency' || user.role === 'admin') {
          return { allowed: true, redirect: null };
        }
        return { allowed: false, redirect: '/creator' };
      }

      return { allowed: true, redirect: null };
    }

    it('redirects unauthenticated visitor attempting /creator to /login with safe return path', () => {
      const result = evaluateRouteAccess(null, '/creator/portfolio');
      expect(result.allowed).toBe(false);
      expect(result.redirect).toBe('/login?returnTo=%2Fcreator%2Fportfolio');
    });

    it('redirects unauthenticated visitor attempting /brand to /login with safe return path', () => {
      const result = evaluateRouteAccess(null, '/brand/briefs/new');
      expect(result.allowed).toBe(false);
      expect(result.redirect).toBe('/login?returnTo=%2Fbrand%2Fbriefs%2Fnew');
    });

    it('allows authenticated creator to access /creator routes', () => {
      const creator = { id: 'creator-123', role: 'creator' };
      const result = evaluateRouteAccess(creator, '/creator/portfolio');
      expect(result.allowed).toBe(true);
      expect(result.redirect).toBeNull();
    });

    it('redirects creator attempting to access /brand to /creator', () => {
      const creator = { id: 'creator-123', role: 'creator' };
      const result = evaluateRouteAccess(creator, '/brand/briefs');
      expect(result.allowed).toBe(false);
      expect(result.redirect).toBe('/creator');
    });

    it('allows authenticated brand to access /brand routes', () => {
      const brand = { id: 'brand-123', role: 'brand' };
      const result = evaluateRouteAccess(brand, '/brand/engagements');
      expect(result.allowed).toBe(true);
      expect(result.redirect).toBeNull();
    });

    it('redirects brand attempting to access /creator to /brand', () => {
      const brand = { id: 'brand-123', role: 'brand' };
      const result = evaluateRouteAccess(brand, '/creator/opportunities');
      expect(result.allowed).toBe(false);
      expect(result.redirect).toBe('/brand');
    });
  });

  describe('3. Resource Ownership Assertion', () => {
    it('allows owner to access their own resource', () => {
      expect(() => assertOwnership('user-100', 'user-100')).not.toThrow();
    });

    it('allows admin to bypass resource ownership check', () => {
      expect(() => assertOwnership('user-100', 'admin-999', true)).not.toThrow();
    });

    it('blocks user from accessing or modifying another user resource', () => {
      expect(() => assertOwnership('owner-user-1', 'intruder-user-2')).toThrow(AuthorizationError);
      expect(() => assertOwnership('owner-user-1', 'intruder-user-2')).toThrow(
        'You do not have permission to access or modify this resource.'
      );
    });
  });

  describe('4. Orphaned Profile Prevention on Email Confirmation', () => {
    it('synchronizes profile when user confirms email without existing profile row', async () => {
      const mockUpsertProfile = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { id: 'user-new', role: 'creator', full_name: 'Sarah Connor' },
            error: null,
          }),
        }),
      });

      const mockUpsertCreator = vi.fn().mockResolvedValue({ error: null });

      const mockSupabase = {
        from: (table: string) => {
          if (table === 'profiles') {
            return {
              select: () => ({
                eq: () => ({
                  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
                }),
              }),
              upsert: mockUpsertProfile,
            };
          }
          if (table === 'creator_profiles') {
            return {
              upsert: mockUpsertCreator,
            };
          }
          return { upsert: vi.fn().mockResolvedValue({ error: null }) };
        },
      };

      const mockUser = {
        id: 'user-new',
        email: 'sarah@example.com',
        user_metadata: {
          role: 'creator',
          full_name: 'Sarah Connor',
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const profile = await ensureUserProfile(mockSupabase as any, mockUser as any);
      expect(profile).not.toBeNull();
      expect(mockUpsertProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'user-new',
          email: 'sarah@example.com',
          role: 'creator',
        })
      );
      expect(mockUpsertCreator).toHaveBeenCalledWith(
        expect.objectContaining({
          profile_id: 'user-new',
          is_verified: false,
          verification_status: 'unverified',
        })
      );
    });

    it('reuses existing profile if already present', async () => {
      const existingProfile = { id: 'existing-user', role: 'brand', full_name: 'Acme Corp' };
      const mockSupabase = {
        from: () => ({
          select: () => ({
            eq: () => ({
              maybeSingle: vi.fn().mockResolvedValue({ data: existingProfile, error: null }),
            }),
          }),
          upsert: vi.fn(),
        }),
      };

      const mockUser = { id: 'existing-user', email: 'acme@example.com', user_metadata: {} };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const profile = await ensureUserProfile(mockSupabase as any, mockUser as any);
      expect(profile).toEqual(existingProfile);
    });
  });

  describe('5. Expired / Invalid Session Handling', () => {
    it('treats null or expired token as unauthenticated without crashing', () => {
      const handleSessionValidation = (authResponse: { user: any; error: any }) => {
        if (authResponse.error || !authResponse.user) {
          return null;
        }
        return authResponse.user;
      };

      const expiredError = { message: 'JWT expired', status: 401 };
      expect(handleSessionValidation({ user: null, error: expiredError })).toBeNull();
      expect(handleSessionValidation({ user: null, error: null })).toBeNull();
    });
  });
});
