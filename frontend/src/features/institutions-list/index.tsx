import Image from 'next/image';
import Link from 'next/link';
import { Text } from 'reshaped';
import { Icon } from '@/components/icon';
import { INSTITUTIONS } from './const';
import styles from './styles.module.scss';

export const InstitutionsList = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <div className={styles.heroLogo}>
            <Image
              src="/logos/grupo-ser.svg"
              alt="Ser Educacional"
              width={180}
              height={88}
              priority
            />
          </div>

          <div className={styles.heroCopy}>
            <Text as="h1" variant="title-5" color="primary">
              Conheça Nossas Instituições de Ensino
            </Text>
            <Text as="p" variant="body-1" color="neutral-faded">
              Descubra a instituição ideal para o seu futuro.
            </Text>
          </div>
        </header>

        <div className={styles.grid}>
          {INSTITUTIONS.map((institution) => (
            <article key={institution.name} className={styles.card}>
              <header className={styles.cardHeader}>
                <Text
                  as="h3"
                  variant="featured-2"
                  weight="bold"
                  color="primary"
                >
                  {institution.name}
                </Text>
                <Text as="p" variant="body-2" color="neutral-faded">
                  {institution.description}
                </Text>
              </header>

              <Link href={`/${institution.slug}`} className={styles.cardCta}>
                Inscreva-se
                <Icon name="arrow-right" size={18} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
