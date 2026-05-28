import enMessages from "@/locales/en.json";
import frMessages from "@/locales/fr.json";

export const messages = {
  fr: frMessages,
  en: enMessages,
} as const;

export type Locale = keyof typeof messages;
