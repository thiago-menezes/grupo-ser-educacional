import { redirect } from 'next/navigation';
import { DEFAULT_INSTITUTION } from '@/config/institutions';

/**
 * Root page - Redirects to default institution
 *
 * This page exists only to redirect users from the root path (/)
 * to the default institution's themed page (e.g., /uninassau).
 *
 * Users should always access the app through institution-specific URLs:
 * - /uninassau
 * - /ung
 * - /uninorte
 * - etc.
 */
export default function RootPage() {
  // Redirect to default institution's page
  const defaultSlug = DEFAULT_INSTITUTION.toLowerCase();
  redirect(`/${defaultSlug}`);
}
