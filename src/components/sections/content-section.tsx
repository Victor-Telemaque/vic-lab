"use client";

import { motion } from "framer-motion";
import { useIntl } from "react-intl";
import { sectionRevealItem } from "@/components/motion/section-variants";
import { SectionReveal } from "@/components/motion/section-reveal";
import styles from "./portfolio-home.module.scss";

function splitPills(text: string): string[] {
  return text
    .split("·")
    .map((item) => item.trim())
    .filter(Boolean);
}

type Props = {
  id?: string;
  className: string;
  labelKey: string;
  titleKey: string;
  hookKey: string;
  bodyKey?: string;
  bodySecondaryKey?: string;
  pillsKey?: string;
  ariaLabel?: string;
  visualSlotClassName?: string;
  layout?: "stack" | "split";
  backdrop?: React.ReactNode;
  children?: React.ReactNode;
};

export function ContentSection({
  id,
  className,
  labelKey,
  titleKey,
  hookKey,
  bodyKey,
  bodySecondaryKey,
  pillsKey,
  ariaLabel,
  visualSlotClassName,
  layout = "stack",
  backdrop,
  children,
}: Props) {
  const intl = useIntl();
  const pills = pillsKey
    ? splitPills(intl.formatMessage({ id: pillsKey }))
    : [];

  const heading = (
    <motion.div className={styles.sectionHeading} variants={sectionRevealItem}>
      <span>{intl.formatMessage({ id: labelKey })}</span>
      <h2>{intl.formatMessage({ id: titleKey })}</h2>
    </motion.div>
  );

  const hook = (
    <motion.p className={styles.sectionHook} variants={sectionRevealItem}>
      {intl.formatMessage({ id: hookKey })}
    </motion.p>
  );

  const body = bodyKey ? (
    <motion.p className={styles.panelBody} variants={sectionRevealItem}>
      {intl.formatMessage({ id: bodyKey })}
    </motion.p>
  ) : null;

  const bodySecondary = bodySecondaryKey ? (
    <motion.p className={styles.panelBody} variants={sectionRevealItem}>
      {intl.formatMessage({ id: bodySecondaryKey })}
    </motion.p>
  ) : null;

  const visual = children ? (
    <motion.div
      className={`${styles.visualSlot} ${visualSlotClassName ?? ""}`.trim()}
      variants={sectionRevealItem}
    >
      {children}
    </motion.div>
  ) : null;

  const pillsList =
    pills.length > 0 ? (
      <motion.ul className={styles.contentPills} variants={sectionRevealItem}>
        {pills.map((pill) => (
          <li key={pill}>{pill}</li>
        ))}
      </motion.ul>
    ) : null;

  return (
    <SectionReveal
      as="section"
      id={id}
      className={`${styles.contentSection} ${className} ${layout === "split" ? styles.contentSectionSplit : ""} ${backdrop ? styles.mediaPanel : ""}`.trim()}
      ariaLabel={ariaLabel}
    >
      {backdrop}
      {layout === "split" ? (
        <div className={styles.splitLayout}>
          <div className={styles.splitCopy}>
            {heading}
            {hook}
            {body}
            {bodySecondary}
            {pillsList}
          </div>
          {visual}
        </div>
      ) : (
        <>
          {heading}
          {hook}
          {body}
          {bodySecondary}
          {visual}
          {pillsList}
        </>
      )}
    </SectionReveal>
  );
}
