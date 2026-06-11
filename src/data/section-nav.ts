export const sectionNavItems = [
  { id: "projects", labelKey: "nav.sections.projects" },
  { id: "about", labelKey: "nav.sections.about" },
  { id: "stack", labelKey: "nav.sections.stack" },
  { id: "contact", labelKey: "nav.sections.contact" },
] as const;

export type SectionNavId = (typeof sectionNavItems)[number]["id"];
