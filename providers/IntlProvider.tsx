"use client";

import { NextIntlClientProvider } from "next-intl";

import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";
import { useLanguage } from "@/LanguageContext";

export default function IntlProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale } = useLanguage();
  console.log("locale:", locale);

  const messages = locale === "ar" ? arMessages : enMessages;
  console.log("messages:", messages);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
