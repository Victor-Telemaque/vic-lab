'use client';

import Image from 'next/image';
import { useIntl } from 'react-intl';
import type { PartnerProject } from '@/data/portfolio-content';
import styles from './site-footer.module.scss';

type Props = {
  partners: PartnerProject[];
};

export function SiteFooter({ partners }: Props) {
  const intl = useIntl();
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
                    partner.logoVariant === 'wide' ? styles.partnerLogoImageWide : ''
                  }`.trim()}
                />
              </div>
            </li>
          ))}
        </ul>

        <p className={styles.copyright}>
          {intl.formatMessage({ id: 'footer.copyright' }, { year })}
        </p>
      </div>
    </footer>
  );
}
