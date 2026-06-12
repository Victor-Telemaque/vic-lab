export type BrandLogo = {
  id: string;
  name: string;
  src: string;
};

export type PartnerProject = {
  id: string;
  name: string;
  logoSrc: string;
  logoVariant?: "default" | "wide";
  role: { fr: string; en: string };
  summary: { fr: string; en: string };
  details?: { fr: string; en: string };
  tags: string[];
};

export const partnerProjects: PartnerProject[] = [
  {
    id: "telemaque",
    name: "Telemaque",
    logoSrc: "/assets/picto/partners/telemaque-logo.png",
    role: { fr: "Alternance Front-End", en: "Front-End Apprenticeship" },
    summary: {
      fr: "Bug fixes et CRM interne pour fluidifier les workflows de l'équipe.",
      en: "Bug fixes and internal CRM to streamline team workflows.",
    },
    details: {
      fr: "Formation en alternance, orientée maintenance corrective et évolution d'un CRM facilitant le workflow interne de l'entreprise.",
      en: "Apprenticeship focused on maintenance, bug fixes, and evolving an internal CRM to streamline company workflows.",
    },
    tags: ["Vue.js", "CRM", "Alternance"],
  },
  {
    id: "citihub",
    name: "Citihub",
    logoSrc: "/assets/picto/partners/citihub-logo.png",
    logoVariant: "wide",
    role: { fr: "Développeur Front-End", en: "Front-End Developer" },
    summary: {
      fr: "Consolidation monorepo, design system partagé et refonte du module cimetière.",
      en: "Monorepo consolidation, shared design system, and cemetery module overhaul.",
    },
    details: {
      fr: "Revue de l'architecture monorepo : séparation modules métier, design system et assets partagés — onboarding et maintenance facilités.\n\nSocle frontend scalable : mutualisation des composants, conventions cohérentes, moins de duplication.\n\nRefonte du module cimetière (layouts, cards, modales) et data tables multi-vues (tri, recherche, pagination, mobile).\n\nOptimisation des flux défunts, tombes, secteurs et inhumations.",
      en: "Monorepo architecture review: domain modules, design system, and shared assets — easier onboarding and maintenance.\n\nScalable front-end foundation: shared components, consistent conventions, less duplication.\n\nCemetery module overhaul (layouts, cards, modals) and multi-view data tables (sort, search, pagination, mobile).\n\nOptimized workflows for deceased records, graves, sectors, and burials.",
    },
    tags: ["Angular", "Monorepo", "Design System"],
  },
  {
    id: "thermorezo",
    name: "Thermorezo",
    logoSrc: "/assets/picto/partners/thermorezo-logo.png",
    logoVariant: "wide",
    role: { fr: "Développeur Front-End", en: "Front-End Developer" },
    summary: {
      fr: "Consolidation frontend ERP : responsive, TypeScript, design system et modules métier.",
      en: "ERP front-end consolidation: responsive, TypeScript, design system, and business modules.",
    },
    details: {
      fr: "Responsive & mobile : vues affaires, listes, sidebar, navigation et onglets stabilisés.\n\nDesign system @thermorezo/ui : migration cartovision-ui, nouveaux inputs (ColorPicker, Date, Radio), modales harmonisées.\n\nQualité TypeScript : réduction massive des any, typage client $api, code mort retiré.\n\nRefactor ERP : affaires, SharePoint, facturation, easements/workflow et settings découpés en composables.",
      en: "Responsive & mobile: business views, lists, sidebar, navigation, and tabs stabilized.\n\nDesign system @thermorezo/ui: cartovision-ui migration, new inputs (ColorPicker, Date, Radio), harmonized modals.\n\nTypeScript quality: major reduction of any types, $api client typing, dead code removed.\n\nERP refactor: business, SharePoint, billing, easements/workflow, and settings split into composables.",
    },
    tags: ["Vue.js", "TypeScript", "ERP"],
  },
  {
    id: "horoscope",
    name: "Horoscope.fr",
    logoSrc: "/assets/picto/partners/logo-horoscope.png",
    role: { fr: "Développeuse Front-End", en: "Front-End Developer" },
    summary: {
      fr: "Campagnes horoscope interactives sur une plateforme Next.js à fort trafic.",
      en: "Interactive horoscope campaigns on a high-traffic Next.js platform.",
    },
    details: {
      fr: "Contribution front-end sur horoscope.fr (Télémaque) : Next.js, React, TypeScript, Redux.\n\nCampagnes interactives (amour, automne, Nouvel An chinois, printemps) : landing pages animées, sélection de signe, formulaires d'acquisition, i18n (4 langues).\n\nCorrectifs SEO (meta titles, URLs canoniques) et API jeux (typage TS, robustesse des endpoints).",
      en: "Front-end contribution on horoscope.fr (Télémaque): Next.js, React, TypeScript, Redux.\n\nInteractive campaigns (love, autumn, Chinese New Year, spring): animated landings, sign selection, acquisition forms, i18n (4 languages).\n\nSEO fixes (meta titles, canonical URLs) and games API (TS typing, endpoint robustness).",
    },
    tags: ["Next.js", "React", "Redux"],
  },
  {
    id: "arcgis",
    name: "ArcGIS",
    logoSrc: "/assets/picto/partners/ArcGIS-logo.png",
    logoVariant: "wide",
    role: { fr: "Intégrateur Front-End", en: "Front-End Integrator" },
    summary: {
      fr: "Cartes interactives et widgets géographiques intégrés dans des applications web.",
      en: "Interactive maps and geographic widgets embedded in web applications.",
    },
    details: {
      fr: "Intégration de cartes interactives et widgets géographiques ArcGIS dans des applications métier : visualisation de données territoriales, couches cartographiques et composants embarqués.",
      en: "Integration of interactive ArcGIS maps and geographic widgets in business applications: territorial data visualization, map layers, and embedded components.",
    },
    tags: ["ArcGIS API", "Maps", "Integration"],
  },
];

export const stackLogos: BrandLogo[] = [
  { id: "vue", name: "Vue.js", src: "/assets/picto/stacks/logo-vue.webp" },
  { id: "react", name: "React", src: "/assets/picto/stacks/logo-react.webp" },
  { id: "typescript", name: "TypeScript", src: "/assets/picto/stacks/typescript-logo.png" },
  { id: "next", name: "Next.js", src: "/assets/picto/stacks/logo-next.webp" },
  { id: "angular", name: "Angular", src: "/assets/picto/stacks/logo-angular.png" },
  { id: "tailwind", name: "Tailwind CSS", src: "/assets/picto/stacks/tailwind-css-logo-vector.png" },
  { id: "sass", name: "Sass", src: "/assets/picto/stacks/sass-logo.png" },
  { id: "redux", name: "Redux", src: "/assets/picto/stacks/Redux-logo.png" },
  { id: "zustand", name: "Zustand", src: "/assets/picto/stacks/zustand-logo.png" },
  { id: "react-query", name: "TanStack Query", src: "/assets/picto/stacks/react-query-logo.png" },
];

export const skillHighlights = {
  fr: [
    "Architecture & design systems",
    "Vue, React, TypeScript",
    "Produit, perf, delivery",
  ],
  en: [
    "Architecture & design systems",
    "Vue, React, TypeScript",
    "Product, performance, delivery",
  ],
} as const;

export const narrativeMedia = {
  posterSrc: "/assets/story/tokyo-signal-poster.svg",
  videoSrc: "/assets/story/tokyo-signal-loop.mp4",
  alt: "Atmosphere visuelle Tokyo Signal, entre nature, lumiere et urban signal.",
};

export const heroVisual = {
  logoSrc: "/assets/story/vic-labs-logo.png",
  alt: "Vic Lab",
};

export const heroBackground = {
  videoSrc: "/assets/vidéo/7504970-uhd_3840_2160_30fps (1).mp4",
  posterSrc: "/assets/story/peaceful-train.jpg",
};

export const stackBackground = {
  videoSrc: "/assets/vidéo/14482700_3840_2160_25fps.mp4",
  posterSrc: "/assets/story/peaceful-train.jpg",
};

export const aboutBackground = {
  imageSrc: "/assets/story/peaceful-train.jpg",
};

export const storyBackground = {
  imageSrc: "/assets/vidéo/vic-video.gif",
};

export type InspirationalPatch = {
  id: string;
  src: string;
  alt: string;
  placement: {
    top: string;
    left?: string;
    right?: string;
  };
  rotate: number;
  /** Stagger order after hero exit (0 = first stamp) */
  appearOrder: number;
};

export const inspirationalPatches: InspirationalPatch[] = [
  {
    id: "creativity",
    src: "/assets/story/patch-creativity.png",
    alt: "Creativity patch",
    placement: { top: "16%", left: "5%" },
    rotate: -12,
    appearOrder: 0,
  },
  {
    id: "crafty",
    src: "/assets/story/patch-crafty.png",
    alt: "Crafty patch",
    placement: { top: "30%", right: "4%" },
    rotate: 9,
    appearOrder: 1,
  },
  {
    id: "secure",
    src: "/assets/story/patch-secure.png",
    alt: "Secure patch",
    placement: { top: "50%", left: "6%" },
    rotate: -6,
    appearOrder: 2,
  },
  {
    id: "seo",
    src: "/assets/story/patch-seo.png",
    alt: "SEO patch",
    placement: { top: "64%", right: "8%" },
    rotate: 11,
    appearOrder: 3,
  },
  {
    id: "bullshite",
    src: "/assets/story/patch-bullshite.png",
    alt: "No bullshit patch",
    placement: { top: "78%", left: "24%" },
    rotate: -8,
    appearOrder: 4,
  },
  {
    id: "ww",
    src: "/assets/story/patch-ww.png",
    alt: "Worldwide patch",
    placement: { top: "38%", left: "38%" },
    rotate: 5,
    appearOrder: 5,
  },
];
