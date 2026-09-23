"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/lib/quizState/QuizProvider";
import { companyOfficeOptions, type CompanyOfficeOption } from "@/lib/quiz/companyOptions";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { BackgroundLines } from "@/components/layout/BackgroundLines";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import type { Locale } from "@/lib/i18n/locales";

interface FinishCopy {
  titleEmoji: string;
  title: string;
  subtitle: string;
  formSubheading: string;
  nameLabel: string;
  companyPlaceholder: string;
  companyLabels: Record<CompanyOfficeOption, string>;
  button: string;
  policy: string;
}

export function FinishScreen({ locale, copy }: { locale: Locale; copy: FinishCopy }) {
  const router = useRouter();
  const { state } = useQuiz();
  const [fullName, setFullName] = useState("");
  const [companyOffice, setCompanyOffice] = useState<CompanyOfficeOption | "">("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (state.status !== "finished") {
      router.replace(`/${locale}/start`);
    }
  }, [state.status, locale, router]);

  if (state.status !== "finished") return null;

  const nameError = submitted && fullName.trim() === "";
  const companyError = submitted && companyOffice === "";

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (fullName.trim() === "" || companyOffice === "") return;

    // Actual POST to /api/submit (Build Order step 9) is not wired up yet —
    // this only verifies the state machine transitions correctly.
    router.push(`/${locale}/result`);
  };

  return (
    <main className="relative isolate flex min-h-screen flex-col items-center overflow-hidden bg-fill-white">
      <BackgroundLines />
      <div className="relative z-[3] w-full">
        <PageHeader />
      </div>
      <section className="relative z-[2] flex w-full flex-1 flex-col items-center desktop:justify-center">
        <Container className="flex flex-col items-center py-[56px]">
          <div className="flex w-full max-w-[407px] flex-col items-center gap-[24px]">
            <p className="w-full text-center text-mobile-body-medium-bold text-text-primary desktop:text-desktop-body-medium-bold">
              <span className="block">{copy.titleEmoji}</span>
              <span className="block">{copy.title}</span>
              <span className="block">{copy.subtitle}</span>
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col items-start gap-[10px] desktop:gap-[13px]">
              <p className="w-full text-center text-mobile-body-regular text-text-primary desktop:text-desktop-body-regular">
                {copy.formSubheading}
              </p>

              <FormInput
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={copy.nameLabel}
                error={nameError}
                aria-label={copy.nameLabel}
              />

              <FormSelect
                value={companyOffice}
                onChange={(e) => setCompanyOffice(e.target.value as CompanyOfficeOption)}
                error={companyError}
                aria-label={copy.companyPlaceholder}
              >
                <option value="" disabled>
                  {copy.companyPlaceholder}
                </option>
                {companyOfficeOptions.map((option) => (
                  <option key={option} value={option}>
                    {copy.companyLabels[option]}
                  </option>
                ))}
              </FormSelect>

              <Button
                type="submit"
                className="h-[56px] w-full gap-[6px] rounded-[18px] px-[18px] text-desktop-body-small-bold desktop:h-[74px] desktop:gap-[10px] desktop:rounded-[24px] desktop:px-[24px] desktop:text-desktop-body-regular-bold"
              >
                {copy.button}
              </Button>
            </form>

            <p className="w-full text-center text-desktop-body-tiny-bold text-text-secondary">{copy.policy}</p>
          </div>
        </Container>
      </section>
    </main>
  );
}
