import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { strings } from "../i18n/strings";
import { merged as hiStrings } from "../i18n/strings.hi";
import { merged as bnStrings } from "../i18n/strings.bn";
import { merged as neStrings } from "../i18n/strings.ne";
import { merged as siStrings } from "../i18n/strings.si";
import { merged as arStrings } from "../i18n/strings.ar";
import { merged as esStrings } from "../i18n/strings.es";
import { merged as frStrings } from "../i18n/strings.fr";
import { merged as swStrings } from "../i18n/strings.sw";
import { merged as ptStrings } from "../i18n/strings.pt";
import { merged as idStrings } from "../i18n/strings.id";
import { merged as msStrings } from "../i18n/strings.ms";
import { merged as filStrings } from "../i18n/strings.fil";
import { merged as itStrings } from "../i18n/strings.it";
import { merged as tsStrings } from "../i18n/strings.tn";
import { merged as lgStrings } from "../i18n/strings.lg";
import { merged as yoStrings } from "../i18n/strings.yo";
import { merged as zuStrings } from "../i18n/strings.zu";
import { merged as mgStrings } from "../i18n/strings.mg";
import { merged as nyStrings } from "../i18n/strings.ny";

const LANGUAGE_KEY = "hopebox-language";

export const LANGUAGE_OPTIONS = [
  { key: "en", label: "English" },
  { key: "hi", label: "हिन्दी (Hindi)" },
  { key: "bn", label: "বাংলা (Bangla)" },
  { key: "ne", label: "नेपाली (Nepali)" },
  { key: "si", label: "සිංහල (Sinhala)" },
  { key: "ar", label: "العربية (Arabic)" },
  { key: "es", label: "Español (Spanish)" },
  { key: "fr", label: "Français (French)" },
  { key: "sw", label: "Kiswahili (Swahili)" },
  { key: "pt", label: "Português (Portuguese)" },
  { key: "id", label: "Bahasa Indonesia" },
  { key: "ms", label: "Bahasa Melayu" },
  { key: "fil", label: "Filipino (Tagalog)" },
  { key: "it", label: "Italiano (Italian)" },
  { key: "ts", label: "Setswana" },
  { key: "lg", label: "Luganda" },
  { key: "yo", label: "Yoruba" },
  { key: "zu", label: "IsiZulu" },
  { key: "mg", label: "Malagasy" },
  { key: "ny", label: "Chichewa" },
] as const;

export type Language = (typeof LANGUAGE_OPTIONS)[number]["key"];

// Single source of truth for all user-facing copy in the app.
const loaders: Record<Language, () => unknown> = {
  en: () => strings,
  hi: () => hiStrings,
  bn: () => bnStrings,
  ne: () => neStrings,
  si: () => siStrings,
  ar: () => arStrings,
  es: () => esStrings,
  fr: () => frStrings,
  sw: () => swStrings,
  pt: () => ptStrings,
  id: () => idStrings,
  ms: () => msStrings,
  fil: () => filStrings,
  it: () => itStrings,
  ts: () => tsStrings,
  lg: () => lgStrings,
  yo: () => yoStrings,
  zu: () => zuStrings,
  mg: () => mgStrings,
  ny: () => nyStrings,
};

type LanguageValue = {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (path: string) => any;
  tf: (path: string, params?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageValue>({
  language: "en",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setLanguage: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: ((key: string) => key) as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tf: (key: string) => key as any,
} as LanguageValue);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const loadLanguage = async () => {
      const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (stored && stored in loaders) {
        setLanguageState(stored as Language);
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    if (!(lang in loaders)) return;
    setLanguageState(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  };

  const catalog = (loaders[language] ? loaders[language]() : strings) as Record<string, unknown>;

  const t = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (scopeOrPath: string): any => {
      const segments = String(scopeOrPath).split(".");
      let cursor: unknown = catalog;
      for (const seg of segments) {
        if (cursor && typeof cursor === "object" && seg in (cursor as Record<string, unknown>)) {
          cursor = (cursor as Record<string, unknown>)[seg];
        } else {
          return scopeOrPath;
        }
      }
      return cursor;
    },
    [catalog]
  );

  const tf = useCallback(
    (path: string, params?: Record<string, string | number>) => {
      const raw = t(path) as unknown;
      if (typeof raw !== "string") return "";
      if (!params) return raw;
      return raw.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, name) =>
        Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : m
      );
    },
    [t]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t, tf }),
    [language, t, tf]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
