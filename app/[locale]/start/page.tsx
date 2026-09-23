import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/locales";
import { StartScreen } from "./StartScreen";

export default async function StartPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <StartScreen
      locale={locale}
      title={dict["start.title"]}
      description={dict["start.description"]}
      buttonLabel={dict["start.button"]}
    />
  );
}
