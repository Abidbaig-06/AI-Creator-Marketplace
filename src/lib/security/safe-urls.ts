/**
 * Validates and sanitizes redirect URLs to prevent Open Redirect vulnerabilities.
 * Ensures the target is strictly an internal, relative path on the same origin.
 */
export function getSafeReturnUrl(
  target: string | null | undefined,
  fallback: string = '/'
): string {
  if (!target || typeof target !== 'string') {
    return fallback;
  }

  const trimmed = target.trim();

  // Must start with a single slash, not double slash (avoid protocol-relative //evil.com)
  // Must not contain backslashes (avoid Windows path confusion or \evil.com)
  // Must not contain scheme colon (avoid javascript:, https:, etc.)
  if (
    trimmed.startsWith('/') &&
    !trimmed.startsWith('//') &&
    !trimmed.includes('\\') &&
    !trimmed.includes('://') &&
    !trimmed.startsWith('/\\')
  ) {
    return trimmed;
  }

  return fallback;
}
