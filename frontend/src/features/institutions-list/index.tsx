import Image from 'next/image';
import { Text } from 'reshaped';
import { INSTITUTIONS } from './const';
import { InstitutionCard } from './institution-card';
import styles from './styles.module.scss';

export const InstitutionsList = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <div className={styles.heroLogo}>
            <Image
              src="/logos/grupo-ser.png"
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
            <InstitutionCard key={institution.slug} {...institution} />
          ))}
        </div>
      </div>
    </section>
  );
};
