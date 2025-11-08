'use client';

import { clsx } from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '@/components/icon';
import styles from './styles.module.scss';
import type { HeaderProps } from './types';

/**
 * Main Header Component
 *
 * Displays the institutional header with:
 * - Top utility bar (Whatsapp, Student portal, Track enrollment)
 * - Logo
 * - Main navigation menu
 * - CTA button
 *
 * Responsive design with mobile menu support
 */
export const Header = ({ institution }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const institutionName = institution.toUpperCase();

  return (
    <header className={styles.header}>
      {/* Top utility bar */}
      <div className={styles.topBar}>
        <div className={styles.container}>
          <div className={styles.topBarContent}>
            <nav className={styles.utilityNav}>
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

      {/* Main navigation */}
      <div className={styles.mainNav}>
        <div className={styles.container}>
          <div className={styles.mainNavContent}>
            {/* Logo */}
            <Link href={`/${institution}`} className={styles.logo}>
              <Image
                src={`/logos/${institution}.svg`}
                alt={`Logo ${institutionName}`}
                className={styles.logoImage}
                width={200}
                height={48}
                priority
                unoptimized
              />
            </Link>

            <div className={styles.rightContainer}>
              {/* Desktop Navigation */}
              <nav className={styles.desktopNav} aria-label="Main navigation">
                <Link
                  href={`/${institution}/graduacao`}
                  className={styles.navLink}
                >
                  Graduação
                </Link>

                <Link
                  href={`/${institution}/pos-graduacao`}
                  className={styles.navLink}
                >
                  Pós-Graduação
                </Link>
                <button className={styles.navDropdown} aria-haspopup="true">
                  Nossos cursos
                  <Icon name="chevron-down" size={16} />
                </button>
                <button className={styles.navDropdown} aria-haspopup="true">
                  A {institutionName}
                  <Icon name="chevron-down" size={16} />
                </button>
                <button className={styles.navDropdown} aria-haspopup="true">
                  Formas de ingresso
                  <Icon name="chevron-down" size={16} />
                </button>
              </nav>

              {/* CTA Button */}
              <Link
                href={`/${institution}/inscreva-se`}
                className={styles.ctaButton}
              >
                Inscreva-se
              </Link>

              {/* Mobile menu button */}
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

      {/* Mobile Navigation Menu */}
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
              <Link
                href={`/${institution}/inscreva-se`}
                className={styles.mobileCtaLink}
              >
                Inscreva-se
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
