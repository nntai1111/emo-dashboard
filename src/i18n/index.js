import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import vi from "./locales/vi.json";
import en from "./locales/en.json";
import zh from "./locales/zh.json";
import ja from "./locales/ja.json";

i18n.use(initReactI18next).init({
  resources: {
    vi: { translation: vi },
    en: { translation: en },
    zh: { translation: zh },
    ja: { translation: ja },
  },
  lng: localStorage.getItem("emoSocial_language") || "vi",
  fallbackLng: "vi",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
