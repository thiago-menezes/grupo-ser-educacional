import { useState, useEffect, useCallback, startTransition } from 'react';

const PLACEHOLDER_IMAGE_URL = 'https://cdn.grupo-ser.com/placeholder.png';

/**
 * Handle image fallback on error event
 */
export const handleImageFallback = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrl: string = PLACEHOLDER_IMAGE_URL,
) => {
  const target = event.target as HTMLImageElement;
  if (target.src !== fallbackUrl) {
    target.src = fallbackUrl;
  }
};

/**
 * Custom hook for managing image fallback
 * Returns the current src and an error handler
 */
export const useImageFallback = (initialSrc: string) => {
  const [src, setSrc] = useState(initialSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setSrc(initialSrc);
      setHasError(false);
    });
  }, [initialSrc]);

  const handleError = useCallback(
    (_event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (!hasError) {
        setSrc(PLACEHOLDER_IMAGE_URL);
        setHasError(true);
      }
    },
    [hasError],
  );

  return { src, handleError };
};
