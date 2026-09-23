import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { locales, isLocale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { QuizProvider } from "@/lib/quizState/QuizProvider";

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
    <html lang={locale}>
      <body>
        <QuizProvider>{children}</QuizProvider>
      </body>
    </html>
  );
}
