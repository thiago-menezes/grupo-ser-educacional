/**
 * Get media URL through Next.js API proxy
 * This ensures media URLs go through the BFF layer
 */
export function getMediaUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;

  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/api/media/${cleanPath}`;
}


