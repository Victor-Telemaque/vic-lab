'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import type { PartnerProject } from '@/data/portfolio-content';
import type { Locale } from '@/i18n/messages';
import { EmblaCarousel } from '@/components/sections/embla-carousel';
import { ProjectDetailsModal } from '@/components/sections/project-details-modal';
import cardStyles from './portfolio-home.module.scss';
import styles from './projects-carousel.module.scss';

const projectLabels = {
  nav: 'projects.carousel.label',
  prev: 'projects.carousel.prev',
  next: 'projects.carousel.next',
  hint: 'projects.carousel.hint',
} as const;

type Props = {
  projects: PartnerProject[];
  locale: Locale;
  className?: string;
};

export function ProjectsCarousel({ projects, locale, className }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalProject, setModalProject] = useState<PartnerProject | null>(null);

  const openProject = useCallback((project: PartnerProject) => {
    setModalProject(project);
  }, []);

  const closeModal = useCallback(() => {
    setModalProject(null);
  }, []);

  return (
    <div className={`${styles.wrapper} ${className ?? ""}`.trim()}>
      <EmblaCarousel
        items={projects}
        getItemKey={(project) => project.id}
        getItemLabel={(project) => project.name}
        labels={projectLabels}
        className={styles.carousel}
        slideClassName={styles.projectSlide}
        onSlideChange={setActiveIndex}
        renderSlide={(project, index) => (
          <PartnerCardContent
            project={project}
            locale={locale}
            isActive={index === activeIndex}
            onOpen={() => openProject(project)}
          />
        )}
      />

      <ProjectDetailsModal
        project={modalProject}
        locale={locale}
        onClose={closeModal}
      />
    </div>
  );
}

function PartnerCardContent({
  project,
  locale,
  isActive,
  onOpen,
}: {
  project: PartnerProject;
  locale: Locale;
  isActive: boolean;
  onOpen: () => void;
}) {
  const intl = useIntl();
  const hasDetails = Boolean(project.details?.[locale]);

  return (
    <div
      role="button"
      tabIndex={isActive ? 0 : -1}
      className={`${styles.cardAction} ${isActive ? styles.cardActionActive : ''}`.trim()}
      onClick={() => {
        if (isActive) {
          onOpen();
        }
      }}
      onKeyDown={(event) => {
        if (!isActive) {
          return;
        }
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen();
        }
      }}
      aria-haspopup="dialog"
      aria-disabled={!isActive}
      aria-label={
        hasDetails
          ? `${project.name} — ${intl.formatMessage({ id: 'projects.readMore' })}`
          : `${project.name} — ${project.summary[locale]}`
      }
    >
      <div className={styles.partnerLogo}>
        <Image
          src={project.logoSrc}
          alt={project.name}
          width={200}
          height={72}
          unoptimized
          className={`${styles.partnerLogoImage} ${
            project.logoVariant === 'wide' ? styles.partnerLogoImageWide : ''
          }`.trim()}
        />
      </div>
      <p className={cardStyles.caseRole}>{project.role[locale]}</p>
      <h3>{project.name}</h3>
      <p className={styles.partnerSummary}>{project.summary[locale]}</p>
      <ul className={cardStyles.tagList}>
        {project.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      {hasDetails ? (
        <span className={styles.readMore}>
          {intl.formatMessage({ id: 'projects.readMore' })}
        </span>
      ) : null}
    </div>
  );
}
