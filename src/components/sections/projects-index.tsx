import { partnerProjects } from "@/data/portfolio-content";
import type { SiteLocale } from "@/lib/site-config";
import styles from "./projects-index.module.scss";

type Props = {
  locale: SiteLocale;
};

const indexCopy = {
  fr: {
    ariaLabel: "Détail des missions et réalisations",
    heading: "Missions en détail",
  },
  en: {
    ariaLabel: "Project and mission details",
    heading: "Mission details",
  },
} as const;

export function ProjectsIndex({ locale }: Props) {
  const copy = indexCopy[locale];

  return (
    <section className={styles.index} aria-label={copy.ariaLabel}>
      <h3 className={styles.heading}>{copy.heading}</h3>
      <div className={styles.list}>
        {partnerProjects.map((project) => {
          const details = project.details?.[locale];
          const paragraphs = details
            ? details.split("\n\n").filter(Boolean)
            : [project.summary[locale]];

          return (
            <article key={project.id} className={styles.item} id={`project-${project.id}`}>
              <details className={styles.details}>
                <summary className={styles.summary}>
                  <span className={styles.name}>{project.name}</span>
                  <span className={styles.role}>{project.role[locale]}</span>
                </summary>
                <div className={styles.body}>
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                  ))}
                  <ul className={styles.tags}>
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
              </details>
            </article>
          );
        })}
      </div>
    </section>
  );
}
