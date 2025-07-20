export const rtlLanguages = [];

export const metricLanguages = ["en"];

export const messagesByLocale = {
  en: () => import("../../locales/en.json"),
  fr: () => import("../../locales/fr.json"),
};
