"use client";

import Image from "next/image";
import { useState } from "react";
import type { PartnerProject } from "@/data/portfolio-content";
import type { Locale } from "@/i18n/messages";
import { EmblaCarousel } from "@/components/sections/embla-carousel";
import cardStyles from "./portfolio-home.module.scss";
import styles from "./projects-carousel.module.scss";

const projectLabels = {
  nav: "projects.carousel.label",
  prev: "projects.carousel.prev",
  next: "projects.carousel.next",
  hint: "projects.carousel.hint",
} as const;

type Props = {
  projects: PartnerProject[];
  locale: Locale;
  className?: string;
};

export function ProjectsCarousel({ projects, locale, className }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex];
  const activeDetails = activeProject?.details?.[locale];

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
        renderSlide={(project) => (
          <PartnerCardContent project={project} locale={locale} />
        )}
      />

      {activeDetails ? (
        <div className={styles.detailsPanel} key={activeProject.id}>
          <p className={styles.detailsBody}>{activeDetails}</p>
        </div>
      ) : null}
    </div>
  );
}

function PartnerCardContent({
  project,
  locale,
}: {
  project: PartnerProject;
  locale: Locale;
}) {
  return (
    <>
      <div className={styles.partnerLogo}>
        <Image
          src={project.logoSrc}
          alt={project.name}
          width={200}
          height={72}
          unoptimized
          className={`${styles.partnerLogoImage} ${
            project.logoVariant === "wide" ? styles.partnerLogoImageWide : ""
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
    </>
  );
}
