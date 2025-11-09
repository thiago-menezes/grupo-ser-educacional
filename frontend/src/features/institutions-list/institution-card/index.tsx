import Link from 'next/link';
import { Text } from 'reshaped';
import { Icon } from '@/components/icon';
import styles from './styles.module.scss';
import { InstitutionCardProps } from './types';

export const InstitutionCard = ({
  name,
  description,
  slug,
}: InstitutionCardProps) => {
  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <Text as="h3" variant="featured-2" weight="bold" color="neutral">
          {name}
        </Text>
        <Text as="p" variant="body-2" color="neutral-faded">
          {description}
        </Text>
      </header>

      <Link href={`/${slug}`} className={styles.cardCta}>
        Inscreva-se
        <Icon name="arrow-right" size={18} />
      </Link>
    </article>
  );
};
