'use client';

import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { BlockRenderer } from '@/features/strapi-articles/BlockRenderer';
import { useArticleBySlug } from '@/features/strapi-articles/hooks';
import styles from './styles.module.scss';

/**
 * Article Detail Page
 *
 * Displays a single article fetched from Strapi CMS by slug
 */
export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { article, isLoading, error } = useArticleBySlug(slug);

  if (isLoading) {
    return <div className={styles.loading}>Loading article...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>Error loading article: {error.message}</div>
    );
  }

  if (!article) {
    notFound();
  }

  const {
    title,
    description,
    blocks,
    cover,
    author,
    category,
    publishedAt,
    createdAt,
  } = article;

  return (
    <article className={styles.container}>
      {cover && (
        <div className={styles.coverImage}>
          <Image
            src={cover.url}
            alt={cover.alternativeText || title}
            className={styles.cover}
          />
        </div>
      )}

      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>

        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.meta}>
          {author && <span className={styles.author}>By {author.name}</span>}

          {category && (
            <span className={styles.category}>in {category.name}</span>
          )}

          {publishedAt && (
            <time className={styles.date} dateTime={publishedAt}>
              Published:{' '}
              {new Date(publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
          {!publishedAt && createdAt && (
            <time className={styles.date} dateTime={createdAt}>
              Created:{' '}
              {new Date(createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
        </div>
      </header>

      <BlockRenderer blocks={blocks} />
    </article>
  );
}
