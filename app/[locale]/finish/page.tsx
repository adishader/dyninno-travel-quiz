import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/locales";
import { companyOfficeOptions } from "@/lib/quiz/companyOptions";
import { FinishScreen } from "./FinishScreen";

export default async function FinishPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const companyLabels = Object.fromEntries(
    companyOfficeOptions.map((option) => [option, dict[`finish.company_option.${option}`]]),
  ) as Record<(typeof companyOfficeOptions)[number], string>;

  return (
    <FinishScreen
      locale={locale}
      copy={{
        titleEmoji: dict["finish.title_emoji"],
        title: dict["finish.title"],
        subtitle: dict["finish.subtitle"],
        formSubheading: dict["finish.form_subheading"],
        nameLabel: dict["finish.name_input_label"],
        companyPlaceholder: dict["finish.company_dropdown_placeholder"],
        companyLabels,
        button: dict["finish.button"],
        policy: dict["finish.policy"],
      }}
    />
  );
}
