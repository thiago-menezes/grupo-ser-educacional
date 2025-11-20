import Image from 'next/image';
import Link from 'next/link';
import { Text } from 'reshaped';
import { Icon } from '..';
import { DEFAULT_FOOTER_CONTENT } from './constants';
import styles from './styles.module.scss';
import type { FooterProps } from './types';

export type { FooterProps } from './types';

export function Footer({ content = DEFAULT_FOOTER_CONTENT }: FooterProps) {
  const { logo, socialLinks, sections, badge } = content;

  return (
    <footer className={styles.wrapper} role="contentinfo">
      <div className={styles.card}>
        <div className={styles.contentGrid}>
          <div className={styles.brandBlock}>
            <Image
              src={logo.src}
              alt={logo.alt}
              className={styles.logo}
              width={190}
              height={40}
            />

            <ul className={styles.socialList} aria-label="Redes sociais">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <Link
                    href={social.href}
                    aria-label={social.ariaLabel || social.label}
                    className={styles.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name={social.icon} size={20} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.sections}>
            {sections.map((section) => (
              <div key={section.title} className={styles.section}>
                <Text
                  as="h3"
                  variant="featured-2"
                  weight="bold"
                  className={styles.sectionTitle}
                >
                  {section.title}
                </Text>
                <ul className={styles.links}>
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className={styles.link}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={styles.badge}>
            <Text as="p" variant="body-3" className={styles.badgeTitle}>
              {badge.title}
            </Text>

            <Link href={badge.href || '#'} aria-label={badge.title}>
              <Image
                src={badge.imageUrl}
                alt={badge.imageAlt}
                className={styles.badgeImage}
                width={101}
                height={144}
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
