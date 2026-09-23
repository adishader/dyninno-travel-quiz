import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/locales";
import { HomeHero } from "@/components/home/HomeHero";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <HomeHero
      locale={locale}
      logoSrc="/images/home/home-logo.svg"
      mapBgSrc="/images/home/home-map-bg.svg"
      heroImageSrc="/images/home/home-hero-desk.webp"
      label={dict["home.label"]}
      title={dict["home.title"]}
      description={dict["home.description"]}
      buttonLabel={dict["home.button"]}
    />
  );
}
