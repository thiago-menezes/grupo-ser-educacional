import Image from 'next/image';
import Link from 'next/link';
import styles from './styles.module.scss';
import type { EmecBadgeProps } from './types';

export type { EmecBadgeProps } from './types';

const QR_CODE_PLACEHOLDER = 'https://placehold.co/320x320.png';

export function EmecBadge({ href = '#', title }: EmecBadgeProps) {
  return (
    <Link href={href} className={styles.container} aria-label={title}>
      <div className={styles.header}>
        <Image
          src="/logos/emec.png"
          alt="Logo e-MEC"
          width={130}
          height={40}
          className={styles.logo}
        />
      </div>

      <div className={styles.qrCodeWrapper}>
        <Image
          src={QR_CODE_PLACEHOLDER}
          alt="QR Code e-MEC"
          width={320}
          height={320}
          className={styles.qrCode}
        />
      </div>

      <div className={styles.cta}>
        <span className={styles.ctaText}>Acesse já!</span>
      </div>
    </Link>
  );
}
