"use client";

import { useIntl } from "react-intl";
import { sectionNavItems } from "@/data/section-nav";
import { SectionNavLink } from "./section-nav-link";

type Props = {
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
};

export function SectionNav({ className, linkClassName, onNavigate }: Props) {
  const intl = useIntl();

  return (
    <nav className={className} aria-label={intl.formatMessage({ id: "nav.sections.ariaLabel" })}>
      {sectionNavItems.map((item) => (
        <SectionNavLink
          key={item.id}
          sectionId={item.id}
          className={linkClassName}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}
