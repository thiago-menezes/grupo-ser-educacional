import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFoundPage() {
  return (
    <main className={styles.container}>
      <div>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.description}>
          The page you’re looking for doesn’t exist.
        </p>
        <Link href="/" className={styles.link}>
          Go back home
        </Link>
      </div>
    </main>
  );
}
