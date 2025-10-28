import Image from 'next/image';
import type { ArticleBlock } from './api/types';
import styles from './BlockRenderer.module.scss';

interface BlockRendererProps {
  blocks?: ArticleBlock[];
}

/**
 * BlockRenderer Component
 *
 * Renders dynamic zone blocks from Strapi v5 articles
 */
export const BlockRenderer = ({ blocks }: BlockRendererProps) => {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className={styles.blocks}>
      {blocks.map((block) => {
        switch (block.__component) {
          case 'shared.rich-text':
            return (
              <div
                key={block.id}
                className={styles.richText}
                dangerouslySetInnerHTML={{ __html: block.body }}
              />
            );

          case 'shared.media': {
            if (!block.file) return null;
            const media = block.file;
            return (
              <div key={block.id} className={styles.media}>
                <Image
                  src={media.url}
                  alt={media.alternativeText || ''}
                  width={media.width}
                  height={media.height}
                />
                {media.caption && (
                  <p className={styles.caption}>{media.caption}</p>
                )}
              </div>
            );
          }

          case 'shared.quote':
            return (
              <blockquote key={block.id} className={styles.quote}>
                {block.title && (
                  <h4 className={styles.quoteTitle}>{block.title}</h4>
                )}
                <p className={styles.quoteBody}>{block.body}</p>
              </blockquote>
            );

          case 'shared.slider':
            if (!block.files || block.files.length === 0) return null;
            return (
              <div key={block.id} className={styles.slider}>
                <div className={styles.sliderTrack}>
                  {block.files.map((file) => (
                    <Image
                      key={file.id}
                      src={file.url}
                      alt={file.alternativeText || ''}
                      className={styles.sliderImage}
                    />
                  ))}
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};
