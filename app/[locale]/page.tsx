import Link from "next/link";
import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/locales";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <main>
      <p>{dict["home.label"]}</p>
      <h1>{dict["home.title"]}</h1>
      <p>{dict["home.description"]}</p>
      <Link href={`/${locale}/start`}>{dict["home.button"]}</Link>
    </main>
  );
}
