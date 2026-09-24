import type { Metadata } from "next";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import "../globals.css";
import { locales, isLocale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { QuizProvider } from "@/lib/quizState/QuizProvider";
import { Analytics } from "@vercel/analytics/next";

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

// No custom domain connected yet (CLAUDE.md: "to be connected in Vercel once
// build is stable") — VERCEL_URL is auto-injected on every Vercel deploy
// (including previews), so this stays correct without further changes once
// a custom domain is added there.
const SITE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const title = dict["home.title"];
  const description = dict["home.description"];

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US",
      images: [{ url: `/images/other/travel-day-quiz-og-${locale}.webp`, width: 1200, height: 630 }],
    },
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
        <Analytics />
      </body>
    </html>
  );
}
