import { Skeleton } from 'reshaped';
import styles from './styles.module.scss';

export function BannerSkeleton() {
  return (
    <div className={styles.bannerSkeleton}>
      <Skeleton width="100%" height="100%" borderRadius="large" />
    </div>
  );
}
