'use client';

import { clsx } from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Button, DropdownMenu, useTheme } from 'reshaped';
import { Icon } from '@/components/icon';
import styles from './styles.module.scss';

export const Header = () => {
  const { institution } = useParams<{ institution: string }>();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { invertColorMode, colorMode } = useTheme();

  const institutionName = institution.toUpperCase();

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.container}>
          <div className={styles.topBarContent}>
            <nav className={styles.utilityNav}>
              <Link
                href=""
                onClick={invertColorMode}
                className={styles.utilityLink}
              >
                <Icon name={colorMode === 'dark' ? 'sun' : 'moon'} size={16} />
              </Link>

              <Link href="#whatsapp" className={styles.utilityLink}>
                <Icon name="brand-whatsapp" size={16} />
                Whatsapp
              </Link>

              <Link href="#portal" className={styles.utilityLink}>
                <Icon name="user" size={16} />
                Sou aluno
              </Link>

              <Link
                href="#track"
                className={clsx(styles.utilityLink, styles.trackEnrollment)}
              >
                Acompanhe sua inscrição
                <Icon name="arrow-right" size={16} />
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <div className={styles.mainNav}>
        <div className={styles.container}>
          <div className={styles.mainNavContent}>
            <Link href={`/${institution}`} className={styles.logo}>
              <Image
                src={`/logos/${institution}.png`}
                alt={`Logo ${institutionName}`}
                className={styles.logoImage}
                width={200}
                height={48}
                priority
                unoptimized
              />
            </Link>

            <div className={styles.rightContainer}>
              <nav className={styles.desktopNav} aria-label="Main navigation">
                <Link href={`/`}>
                  <Button size="large" variant="ghost">
                    Graduação
                  </Button>
                </Link>

                <Link href={`/${institution}/pos-graduacao`}>
                  <Button size="large" variant="ghost">
                    Pós-Graduação
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenu.Trigger>
                    {(attributes) => (
                      <Button
                        size="large"
                        variant="ghost"
                        attributes={attributes}
                        aria-haspopup="true"
                        endIcon={<Icon name="chevron-down" />}
                      >
                        Nossos cursos
                      </Button>
                    )}
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Content>
                    <DropdownMenu.Item>Mais acessados</DropdownMenu.Item>
                    <DropdownMenu.Item>Vestibular 2025</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenu.Trigger>
                    {(attributes) => (
                      <Button
                        size="large"
                        variant="ghost"
                        attributes={attributes}
                        aria-haspopup="true"
                        endIcon={<Icon name="chevron-down" />}
                      >
                        A {institutionName}
                      </Button>
                    )}
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Content>
                    <DropdownMenu.Item>Endereço</DropdownMenu.Item>
                    <DropdownMenu.Item>Contato</DropdownMenu.Item>
                    <DropdownMenu.Item>Sobre nós</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenu.Trigger>
                    {(attributes) => (
                      <Button
                        size="large"
                        variant="ghost"
                        attributes={attributes}
                        aria-haspopup="true"
                        endIcon={<Icon name="chevron-down" />}
                      >
                        Formas de ingresso
                      </Button>
                    )}
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Content>
                    <DropdownMenu.Item>FIES</DropdownMenu.Item>
                    <DropdownMenu.Item>Prouni</DropdownMenu.Item>
                    <DropdownMenu.Item>Vestibular</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu>
              </nav>

              <Link href={`/${institution}/inscreva-se`}>
                <Button size="large" color="primary">
                  Inscreva-se
                </Button>
              </Link>

              <button
                className={styles.mobileMenuButton}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                <Icon name={mobileMenuOpen ? 'x' : 'menu'} size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={styles.mobileNav}>
          <div className={styles.container}>
            <nav className={styles.mobileNavContent}>
              <Link
                href={`/${institution}/graduacao`}
                className={styles.mobileNavLink}
              >
                Graduação
              </Link>

              <Link
                href={`/${institution}/pos-graduacao`}
                className={styles.mobileNavLink}
              >
                Pós-Graduação
              </Link>

              <Link
                href={`/${institution}/cursos`}
                className={styles.mobileNavLink}
              >
                Nossos cursos
              </Link>

              <Link
                href={`/${institution}/sobre`}
                className={styles.mobileNavLink}
              >
                A {institutionName}
              </Link>

              <Link
                href={`/${institution}/ingresso`}
                className={styles.mobileNavLink}
              >
                Formas de ingresso
              </Link>

              <Button
                href={`/${institution}/inscreva-se`}
                color="primary"
                fullWidth
              >
                Inscreva-se
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
