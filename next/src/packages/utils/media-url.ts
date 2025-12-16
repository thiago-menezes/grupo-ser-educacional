export function getMediaUrl(path: string | null): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/api/media/${cleanPath}`;
}
