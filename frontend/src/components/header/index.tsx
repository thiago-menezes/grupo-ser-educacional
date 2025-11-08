'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
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
export function Header({ institution }: HeaderProps) {
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
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"
                    fill="currentColor"
                  />
                </svg>
                <span>Whatsapp</span>
              </Link>
              <Link href="#portal" className={styles.utilityLink}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M13.333 14.667v-1.334A2.667 2.667 0 0 0 10.666 10.667H5.333a2.667 2.667 0 0 0-2.666 2.666v1.334M8 7.333A2.667 2.667 0 1 0 8 2a2.667 2.667 0 0 0 0 5.333z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <span>Sou aluno</span>
              </Link>
              <Link href="#track" className={styles.utilityLink}>
                <span className={styles.trackEnrollment}>
                  Acompanhe sua inscrição
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M6 12l4-4-4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
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
                <span>Nossos cursos</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </button>
              <button className={styles.navDropdown} aria-haspopup="true">
                <span>A {institutionName}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </button>
              <button className={styles.navDropdown} aria-haspopup="true">
                <span>Formas de ingresso</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
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
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {mobileMenuOpen ? (
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <path
                    d="M3 12h18M3 6h18M3 18h18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </button>
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
}
