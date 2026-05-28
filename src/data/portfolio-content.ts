export type CaseStudy = {
  title: { fr: string; en: string };
  role: { fr: string; en: string };
  summary: { fr: string; en: string };
  impact: { fr: string; en: string };
  tags: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    title: { fr: "FlowPilot Platform", en: "FlowPilot Platform" },
    role: { fr: "Lead Front-End Architect", en: "Lead Front-End Architect" },
    summary: {
      fr: "Conception d'une plateforme modulaire multi-role pour orchestrer des workflows produit, analytics et operations.",
      en: "Designed a modular multi-role platform to orchestrate product workflows, analytics, and operations.",
    },
    impact: {
      fr: "+42% de vitesse de delivery produit en 6 mois",
      en: "+42% product delivery speed in 6 months",
    },
    tags: ["Next.js", "Design System", "Monorepo", "Role-based Modules"],
  },
  {
    title: { fr: "Nova Commerce Suite", en: "Nova Commerce Suite" },
    role: { fr: "Frontend Product Engineer", en: "Frontend Product Engineer" },
    summary: {
      fr: "Refonte d'un espace e-commerce B2B en experience orientee conversion avec architecture front composable.",
      en: "Rebuilt a B2B e-commerce workspace into a conversion-driven experience with composable front-end architecture.",
    },
    impact: {
      fr: "+28% d'activation utilisateur sur le funnel principal",
      en: "+28% user activation on the main funnel",
    },
    tags: ["React", "UX Strategy", "Motion", "Performance"],
  },
  {
    title: { fr: "Atlas Ops Console", en: "Atlas Ops Console" },
    role: { fr: "Freelance / Entrepreneur", en: "Freelance / Entrepreneur" },
    summary: {
      fr: "Creation d'une console metier temps reel pour equipes terrain avec visualisation de donnees et interactions avancees.",
      en: "Built a real-time operations console for field teams with advanced data visualization and interactions.",
    },
    impact: {
      fr: "-35% de temps de traitement des taches critiques",
      en: "-35% processing time on critical tasks",
    },
    tags: ["TypeScript", "Data Viz", "DX", "Scalable Frontend"],
  },
];

export const skillHighlights = {
  fr: [
    "Architecture Front-End scalable",
    "Motion Design oriente produit",
    "UI Engineering haute fidelite",
    "Performance et SEO technique",
  ],
  en: [
    "Scalable Front-End architecture",
    "Product-focused motion design",
    "High-fidelity UI engineering",
    "Performance and technical SEO",
  ],
} as const;

export const narrativeMedia = {
  posterSrc: "/assets/story/tokyo-signal-poster.svg",
  videoSrc: "/assets/story/tokyo-signal-loop.mp4",
  alt: "Atmosphere visuelle Tokyo Signal, entre nature, lumiere et urban signal.",
};
