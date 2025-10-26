import Link from 'next/link';
import styles from './not-found.module.scss';

/**
 * Article Not Found Page
 *
 * Displayed when an article with the given slug is not found
 */
export default function ArticleNotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Article Not Found</h1>
      <p className={styles.message}>
        The article you are looking for does not exist or has been removed.
      </p>

      <Link href="/" className={styles.link}>
        Go back home
      </Link>
    </div>
  );
}
