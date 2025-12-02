import Image from 'next/image';
import Link from 'next/link';
import { MOCK_PROMOTIONAL_BANNERS } from './mocks';
import styles from './styles.module.scss';
import type { PromotionalBannersProps } from './types';

export function PromotionalBanners({
  banners = MOCK_PROMOTIONAL_BANNERS,
}: PromotionalBannersProps) {
  if (!banners.length) {
    return null;
  }

  return (
    <section className={styles.section} aria-label="Banners promocionais">
      <div className={styles.container}>
        <div className={styles.scroller} role="list">
          {banners.map((banner) => {
            const imageElement = (
              <Image
                src={banner.imageUrl}
                alt={banner.imageAlt || 'Banner promocional'}
                className={styles.bannerImage}
                priority
                width={200}
                height={190}
              />
            );

            return (
              <article
                key={banner.id}
                className={styles.bannerCard}
                role="listitem"
              >
                {banner.link ? (
                  <Link href={banner.link} className={styles.bannerLink}>
                    {imageElement}
                  </Link>
                ) : (
                  imageElement
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
