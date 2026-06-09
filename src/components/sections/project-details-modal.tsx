'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useIntl } from 'react-intl';
import type { PartnerProject } from '@/data/portfolio-content';
import type { Locale } from '@/i18n/messages';
import cardStyles from './portfolio-home.module.scss';
import carouselStyles from './projects-carousel.module.scss';
import styles from './project-details-modal.module.scss';

type Props = {
  project: PartnerProject | null;
  locale: Locale;
  onClose: () => void;
};

export function ProjectDetailsModal({ project, locale, onClose }: Props) {
  const intl = useIntl();
  const shouldReduceMotion = useReducedMotion();
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isOpen = project !== null;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (typeof document === 'undefined') {
    return null;
  }

  const details = project?.details?.[locale];

  return createPortal(
    <AnimatePresence>
      {project ? (
        <motion.div
          className={styles.root}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
        >
          <motion.button
            type="button"
            className={styles.backdrop}
            aria-label={intl.formatMessage({ id: 'projects.modal.close' })}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={styles.dialog}
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: 28, scale: 0.94, rotateX: 8 }
            }
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 16, scale: 0.97, rotateX: 4 }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0.15 }
                : { type: 'spring', stiffness: 420, damping: 30, mass: 0.85 }
            }
          >
            <div className={styles.dialogGlow} aria-hidden />

            <button
              ref={closeButtonRef}
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label={intl.formatMessage({ id: 'projects.modal.close' })}
            >
              <span aria-hidden>×</span>
            </button>

            <header className={styles.header}>
              <div className={carouselStyles.partnerLogo}>
                <Image
                  src={project.logoSrc}
                  alt=""
                  width={200}
                  height={72}
                  unoptimized
                  className={`${carouselStyles.partnerLogoImage} ${
                    project.logoVariant === 'wide'
                      ? carouselStyles.partnerLogoImageWide
                      : ''
                  }`.trim()}
                />
              </div>
              <div className={styles.headerCopy}>
                <p className={cardStyles.caseRole}>{project.role[locale]}</p>
                <h2 id={titleId} className={styles.title}>
                  {project.name}
                </h2>
              </div>
            </header>

            <p className={styles.summary}>{project.summary[locale]}</p>

            {details ? (
              <div className={styles.body}>
                {details.split('\n\n').map((paragraph, index) => (
                  <p key={`${project.id}-detail-${index}`}>{paragraph}</p>
                ))}
              </div>
            ) : null}

            <ul className={cardStyles.tagList}>
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
