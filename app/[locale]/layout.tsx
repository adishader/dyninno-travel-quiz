import type { Metadata } from "next";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import "../globals.css";
import { locales, isLocale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { QuizProvider } from "@/lib/quizState/QuizProvider";

// Metropolis isn't in Google's font catalog (next/font/google can't resolve
// it) — self-hosted here from the public-domain (Unlicense) release used by
// the design team. See app/fonts/METROPOLIS-UNLICENSE.txt.
const metropolis = localFont({
  src: [
    { path: "../fonts/Metropolis-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/Metropolis-SemiBold.otf", weight: "600", style: "normal" },
  ],
  variable: "--font-metropolis-loaded",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict["home.title"],
    description: dict["home.description"],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} className={metropolis.variable}>
      <body className={metropolis.className}>
        <QuizProvider>{children}</QuizProvider>
      </body>
    </html>
  );
}
