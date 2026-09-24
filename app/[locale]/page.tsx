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
      heroVideoDeskSrc="/images/home/hero-cover-1080-rf29.mp4"
      heroVideoMobSrc="/images/home/hero-cover-720-rf29.mp4"
      label={dict["home.label"]}
      title={dict["home.title"]}
      description={dict["home.description"]}
      buttonLabel={dict["home.button"]}
    />
  );
}
