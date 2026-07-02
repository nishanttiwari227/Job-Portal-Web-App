/**
 * Auth test placeholders — replace with a real test runner in a later step.
 *
 * Suggested coverage:
 * - register rejects admin role
 * - login returns access token payload shape
 * - refresh token rotation invalidates old token
 * - authenticate middleware rejects missing bearer token
 * - authorize middleware rejects wrong role
 */

export const authTestPlaceholders = [
  'register allows candidate and recruiter only',
  'login validates credentials',
  'refresh token reads HttpOnly cookie',
  'logout clears refresh token from database',
  'me returns authenticated user profile',
];

export default authTestPlaceholders;
