'use client';

import { useEffect } from 'react';
import styles from './error.module.css';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className={styles.container}>
      <div>
        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.description}>Please try again.</p>
        <button type="button" onClick={() => reset()} className={styles.button}>
          Retry
        </button>
      </div>
    </main>
  );
}
