"use client";

import Image from "next/image";
import type { BrandLogo } from "@/data/portfolio-content";
import styles from "./partners-showcase.module.scss";

type Props = {
  partners: BrandLogo[];
};

export function PartnersShowcase({ partners }: Props) {
  return (
    <ul className={styles.grid} aria-label="Partner companies">
      {partners.map((partner) => (
        <li key={partner.id} className={styles.card}>
          <div className={styles.logoWrap}>
            <Image
              src={partner.src}
              alt={partner.name}
              width={160}
              height={64}
              className={styles.logo}
            />
          </div>
          <span className={styles.name}>{partner.name}</span>
        </li>
      ))}
    </ul>
  );
}
