'use client';

import Image from 'next/image';
import { useIntl } from 'react-intl';
import { useAppLocale } from '@/components/i18n/intl-provider';
import type { PartnerProject } from '@/data/portfolio-content';
import { socialLinks } from '@/lib/site-config';
import styles from './site-footer.module.scss';

type Props = {
  partners: PartnerProject[];
};

const socialAssets = {
  github: '/assets/picto/partners/GitHub_Logo.png',
  linkedin: '/assets/picto/partners/Linkedin-logo.png',
} as const;

const socialLabels = {
  fr: {
    nav: 'Profils et contact',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    email: 'foure.v@live.fr',
  },
  en: {
    nav: 'Profiles and contact',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    email: 'foure.v@live.fr',
  },
} as const;

export function SiteFooter({ partners }: Props) {
  const intl = useIntl();
  const { locale } = useAppLocale();
  const labels = socialLabels[locale];
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.partnersLabel}>
          {intl.formatMessage({ id: 'footer.partnersLabel' })}
        </p>

        <ul
          className={styles.partnerList}
          aria-label={intl.formatMessage({ id: 'footer.partnersAria' })}
        >
          {partners.map((partner) => (
            <li key={partner.id} className={styles.partnerItem}>
              <div className={styles.partnerLogo}>
                <Image
                  src={partner.logoSrc}
                  alt={partner.name}
                  width={160}
                  height={64}
                  unoptimized
                  className={`${styles.partnerLogoImage} ${
                    partner.logoVariant === 'wide'
                      ? styles.partnerLogoImageWide
                      : ''
                  }`.trim()}
                />
              </div>
            </li>
          ))}
        </ul>

        <nav className={styles.socialNav} aria-label={labels.nav}>
          <a
            href={socialLinks.github}
            className={`${styles.socialLink} ${styles.socialLinkIcon}`}
            target="_blank"
            rel="me noreferrer"
          >
            <Image
              src={socialAssets.github}
              alt=""
              width={120}
              height={32}
              unoptimized
              className={`${styles.socialLogo} ${styles.socialLogoWide}`}
            />
            <span className={styles.srOnly}>{labels.github}</span>
          </a>
          <a
            href={socialLinks.linkedin}
            className={`${styles.socialLink} ${styles.socialLinkIcon}`}
            target="_blank"
            rel="me noreferrer"
          >
            <Image
              src={socialAssets.linkedin}
              alt=""
              width={220}
              height={62}
              unoptimized
              className={`${styles.socialLogo} ${styles.socialLogoLinkedin}`}
            />
            <span className={styles.srOnly}>{labels.linkedin}</span>
          </a>
          <a href={socialLinks.email} className={styles.socialLink}>
            {labels.email}
          </a>
        </nav>

        <p className={styles.copyright}>
          {intl.formatMessage({ id: 'footer.copyright' }, { year })}
        </p>
      </div>
    </footer>
  );
}
