import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BASE_MAP } from "@/lib/i18n/strings";

export interface Language {
  code: string;
  name: string;
  native_name: string;
  flag_emoji: string | null;
  enabled: boolean;
  is_default: boolean;
  sort_order: number;
}

interface I18nValue {
  locale: string;
  setLocale: (code: string, persist?: boolean) => void;
  languages: Language[];
  ready: boolean;
  /** Translate a UI string key. Falls back to English, then to the key itself. */
  t: (key: string, fallback?: string) => string;
  /** Translate a database field value. */
  tc: (table: string, rowId: string | number, column: string, fallback: string | null | undefined) => string;
  /** Preload content translations for a table so `tc` can resolve them. */
  loadContent: (table: string) => Promise<void>;
  reloadStrings: () => Promise<void>;
}

const STORAGE_KEY = "cp.locale";

const I18nContext = createContext<I18nValue | null>(null);

function detectInitialLocale(): string {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  const nav = window.navigator.language?.slice(0, 2).toLowerCase();
  return nav || "en";
}

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<string>(detectInitialLocale);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [enOverrides, setEnOverrides] = useState<Record<string, string>>({});
  const [dict, setDict] = useState<Record<string, string>>({});
  const [content, setContent] = useState<Record<string, string>>({});
  const [loadedTables, setLoadedTables] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  // Languages list
  useEffect(() => {
    let active = true;
    void (async () => {
      const { data } = await supabase
        .from("languages")
        .select("code, name, native_name, flag_emoji, enabled, is_default, sort_order")
        .eq("enabled", true)
        .order("sort_order");
      if (active && data) setLanguages(data as Language[]);
    })();
    return () => {
      active = false;
    };
  }, []);

  // English overrides (admin-edited core texts)
  const loadEnglish = useCallback(async () => {
    const { data } = await supabase.from("ui_strings").select("key, en_value");
    const map: Record<string, string> = {};
    (data ?? []).forEach((r: { key: string; en_value: string }) => {
      map[r.key] = r.en_value;
    });
    setEnOverrides(map);
  }, []);

  useEffect(() => {
    void loadEnglish();
  }, [loadEnglish]);

  // Translations for the active locale
  const loadDict = useCallback(async (code: string) => {
    if (code === "en") {
      setDict({});
      setReady(true);
      return;
    }
    const { data } = await supabase
      .from("ui_translations")
      .select("string_key, value")
      .eq("locale", code);
    const map: Record<string, string> = {};
    (data ?? []).forEach((r: { string_key: string; value: string }) => {
      map[r.string_key] = r.value;
    });
    setDict(map);
    setReady(true);
  }, []);

  useEffect(() => {
    setReady(false);
    void loadDict(locale);
    if (typeof document !== "undefined") document.documentElement.lang = locale;
  }, [locale, loadDict]);

  // Content translations for the active locale, per requested table
  useEffect(() => {
    setContent({});
    setLoadedTables([]);
  }, [locale]);

  const loadContent = useCallback(
    async (table: string) => {
      if (locale === "en" || loadedTables.includes(table)) return;
      const { data } = await supabase
        .from("content_translations")
        .select("table_name, row_id, column_name, value")
        .eq("locale", locale)
        .eq("table_name", table);
      const map: Record<string, string> = {};
      (data ?? []).forEach((r: { table_name: string; row_id: string; column_name: string; value: string }) => {
        map[`${r.table_name}:${r.row_id}:${r.column_name}`] = r.value;
      });
      setContent((prev) => ({ ...prev, ...map }));
      setLoadedTables((prev) => [...prev, table]);
    },
    [locale, loadedTables],
  );

  const setLocale = useCallback((code: string, persist = true) => {
    setLocaleState(code);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, code);
    if (persist) {
      void (async () => {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          await supabase.from("profiles").update({ preferred_language: code }).eq("id", data.user.id);
        }
      })();
    }
  }, []);

  // Apply the signed-in user's preferred language
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" || !session?.user) return;
      setTimeout(() => {
        void (async () => {
          const { data } = await supabase
            .from("profiles")
            .select("preferred_language")
            .eq("id", session.user.id)
            .maybeSingle();
          const pref = (data as { preferred_language?: string } | null)?.preferred_language;
          if (pref) {
            setLocaleState(pref);
            if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, pref);
          }
        })();
      }, 0);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const t = useCallback(
    (key: string, fallback?: string) =>
      dict[key] ?? enOverrides[key] ?? BASE_MAP[key] ?? fallback ?? key,
    [dict, enOverrides],
  );

  const tc = useCallback(
    (table: string, rowId: string | number, column: string, fallback: string | null | undefined) =>
      content[`${table}:${rowId}:${column}`] ?? fallback ?? "",
    [content],
  );

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      setLocale,
      languages,
      ready,
      t,
      tc,
      loadContent,
      reloadStrings: async () => {
        await loadEnglish();
        await loadDict(locale);
      },
    }),
    [locale, setLocale, languages, ready, t, tc, loadContent, loadEnglish, loadDict],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};

/** Convenience hook for the common case. */
export const useT = () => useI18n().t;
