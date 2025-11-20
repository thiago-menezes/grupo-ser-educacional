import Image from 'next/image';
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
          {banners.map((banner) => (
            <article
              key={banner.id}
              className={styles.bannerCard}
              role="listitem"
            >
              <Image
                src={banner.imageUrl}
                alt={banner.imageAlt || 'Banner promocional'}
                className={styles.bannerImage}
                priority
                width={200}
                height={190}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
