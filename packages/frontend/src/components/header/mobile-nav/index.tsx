import { Button, Link } from 'reshaped';
import { useCurrentInstitution } from '../../../hooks/useInstitution';
import styles from '../styles.module.scss';

export const MobileNav = ({ mobileMenuOpen }: { mobileMenuOpen: boolean }) => {
  const { institutionId, institutionName } = useCurrentInstitution();

  return (
    mobileMenuOpen && (
      <div className={styles.mobileNav}>
        <div className={styles.container}>
          <nav className={styles.mobileNavContent}>
            <Link
              href={`/${institutionId}/graduacao`}
              className={styles.mobileNavLink}
            >
              Graduação
            </Link>

            <Link
              href={`/${institutionId}/pos-graduacao`}
              className={styles.mobileNavLink}
            >
              Pós-Graduação
            </Link>

            <Link
              href={`/${institutionId}/cursos`}
              className={styles.mobileNavLink}
            >
              Nossos cursos
            </Link>

            <Link
              href={`/${institutionId}/sobre`}
              className={styles.mobileNavLink}
            >
              A {institutionName}
            </Link>

            <Link
              href={`/${institutionId}/ingresso`}
              className={styles.mobileNavLink}
            >
              Formas de ingresso
            </Link>

            <Button
              href={`/${institutionId}/inscreva-se`}
              color="primary"
              fullWidth
            >
              Inscreva-se
            </Button>
          </nav>
        </div>
      </div>
    )
  );
};
