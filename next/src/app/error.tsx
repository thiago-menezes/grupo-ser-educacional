'use client';

import { useEffect } from 'react';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <div>
        <h1>Something went wrong</h1>
        <p>Please try again.</p>
        <button type="button" onClick={() => reset()}>
          Retry
        </button>
      </div>
    </main>
  );
}
