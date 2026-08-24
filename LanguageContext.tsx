"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Locale = "en" | "ar";

interface LanguageContextType {
  locale: Locale;
  changeLanguage: (lang: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") {
      return "en";
    }

    const savedLang = localStorage.getItem("locale");

    return savedLang === "ar" || savedLang === "en" ? savedLang : "en";
  });

  const changeLanguage = (lang: Locale) => {
    localStorage.setItem("locale", lang);
    setLocale(lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        changeLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
