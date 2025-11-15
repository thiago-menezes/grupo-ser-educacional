'use client';

export default function GlobalErrorPage({
  error: _error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
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
