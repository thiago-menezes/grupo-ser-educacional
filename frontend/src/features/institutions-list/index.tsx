import Image from 'next/image';
import { Text } from 'reshaped';
import { INSTITUTIONS } from './constants';
import { InstitutionCard } from './institution-card';
import styles from './styles.module.scss';

export const InstitutionsList = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imageSide}>
        <Image
          src="https://unsplash.it/1200/700?random"
          alt="Instituições de ensino"
          width={1200}
          height={700}
          className={styles.heroImage}
          priority
        />
      </div>

      <div className={styles.contentSide}>
        <div className={styles.header}>
          <div className={styles.logoWrapper}>
            <Image
              src="/logos/grupo-ser.png"
              alt="Ser Educacional"
              width={205}
              height={88}
              priority
            />
          </div>
          <Text
            as="h1"
            variant="title-5"
            color="neutral"
            className={styles.title}
          >
            Conheça Nossas Instituições de Ensino
          </Text>
          <Text
            as="p"
            variant="body-1"
            color="neutral-faded"
            className={styles.subtitle}
          >
            Descubra a instituição ideal para o seu futuro.
          </Text>
        </div>

        <div className={styles.grid}>
          {INSTITUTIONS.map((institution) => (
            <InstitutionCard key={institution.slug} {...institution} />
          ))}
        </div>
      </div>
    </div>
  );
};
