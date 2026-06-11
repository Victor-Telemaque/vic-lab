"use client";

import { useIntl } from "react-intl";
import { sectionNavItems, type SectionNavId } from "@/data/section-nav";
import { useSiteNavigation } from "./site-navigation-context";

type Props = {
  sectionId: SectionNavId;
  labelKey?: string;
  className?: string;
  onNavigate?: () => void;
};

export function SectionNavLink({
  sectionId,
  labelKey,
  className,
  onNavigate,
}: Props) {
  const intl = useIntl();
  const { navigateToSection } = useSiteNavigation();
  const item = sectionNavItems.find((entry) => entry.id === sectionId);

  if (!item) {
    return null;
  }

  return (
    <a
      href={`#${sectionId}`}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        navigateToSection(sectionId);
        onNavigate?.();
      }}
    >
      {intl.formatMessage({ id: labelKey ?? item.labelKey })}
    </a>
  );
}
