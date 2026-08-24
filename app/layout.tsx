import "./globals.css";

import {
  Plus_Jakarta_Sans,
  JetBrains_Mono,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";

import { LanguageProvider } from "@/LanguageContext";
import IntlProvider from "@/providers/IntlProvider";
import { AuthProvider } from "@/shared/context/AuthContext";
import { ThemeProvider } from "@/components/ui/theme-provider";

/* =========================================================
   FONTS
   --font-sans  → headings, labels, body
   --font-mono  → IPs, URLs, ports, timestamps, pagination
========================================================= */

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

/* Arabic glyph fallback: plate letters (ا ب خ), the ع locale, RTL copy.
   Plus Jakarta Sans has no Arabic coverage on its own. */
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakarta.variable} ${jetbrains.variable} ${plexArabic.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LanguageProvider>
            <IntlProvider>
              <AuthProvider>{children}</AuthProvider>
            </IntlProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
