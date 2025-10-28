'use client';

import { useArticles } from './hooks';
import styles from './styles.module.scss';

/**
 * ArticlesList Component
 *
 * Displays a list of articles fetched from Strapi CMS
 */
export const ArticlesList = () => {
  const { articles, isLoading, error, pagination } = useArticles();

  if (isLoading) {
    return <div className={styles.loading}>Loading articles...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        Error loading articles: {error.message}
      </div>
    );
  }

  if (articles.length === 0) {
    return <div className={styles.empty}>No articles found</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Articles</h1>

      <div className={styles.list}>
        {articles.map((article) => (
          <article key={article.id} className={styles.article}>
            <h2 className={styles.articleTitle}>{article.title}</h2>
            <p className={styles.description}>{article.description}</p>
            {article.publishedAt && (
              <time className={styles.date}>
                {new Date(article.publishedAt).toLocaleDateString()}
              </time>
            )}
          </article>
        ))}
      </div>

      {pagination && (
        <div className={styles.pagination}>
          <p>
            Page {pagination.page} of {pagination.pageCount} ({pagination.total}{' '}
            total articles)
          </p>
        </div>
      )}
    </div>
  );
};

export default ArticlesList;
