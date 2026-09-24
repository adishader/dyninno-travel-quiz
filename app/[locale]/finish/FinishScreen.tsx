"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQuiz } from "@/lib/quizState/QuizProvider";
import { getScore } from "@/lib/quizState/reducer";
import { formatElapsed } from "@/lib/quiz/formatTime";
import { submitQuizResult } from "@/lib/submit";
import { companyOfficeOptions, type CompanyOfficeOption } from "@/lib/quiz/companyOptions";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { BackgroundLines } from "@/components/layout/BackgroundLines";
import { BackgroundMap } from "@/components/layout/BackgroundMap";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import { fadeUp } from "@/lib/animation/fadeUp";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    if (state.status !== "finished") {
      router.replace(`/${locale}/start`);
    }
  }, [state.status, locale, router]);

  if (state.status !== "finished") return null;

  const nameError = submitted && fullName.trim() === "";
  const companyError = submitted && companyOffice === "";

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (fullName.trim() === "" || companyOffice === "" || isSubmitting) return;

    setSubmitError(false);
    setIsSubmitting(true);
    try {
      await submitQuizResult({
        fullName: fullName.trim(),
        companyOffice: copy.companyLabels[companyOffice],
        score: getScore(state),
        completionTime: formatElapsed(state.finalElapsedSeconds ?? state.elapsedSeconds),
        completionTimeSeconds: state.finalElapsedSeconds ?? state.elapsedSeconds,
        timestamp: new Date().toISOString(),
        language: locale.toUpperCase() as "EN" | "ES",
      });
      router.push(`/${locale}/result`);
    } catch {
      setIsSubmitting(false);
      setSubmitError(true);
    }
  };

  return (
    <main className="relative isolate flex min-h-screen flex-col items-center overflow-hidden bg-fill-white">
      <BackgroundMap zIndexClassName="z-[1]" />
      <BackgroundLines zIndexClassName="z-[2]" />
      <div className="relative z-[4] w-full">
        <PageHeader />
      </div>
      <section className="relative z-[3] flex w-full flex-1 flex-col items-center desktop:justify-center">
        <Container className="flex flex-col items-center py-[56px]">
          <motion.div
            initial="hidden"
            animate="visible"
            className="flex w-full max-w-[407px] flex-col items-center gap-[24px]"
          >
            <motion.p
              custom={0}
              variants={fadeUp}
              className="w-full text-center text-mobile-body-medium-bold text-text-primary desktop:text-desktop-body-medium-bold"
            >
              <span className="block">{copy.titleEmoji}</span>
              <span className="block">{copy.title}</span>
              <span className="block">{copy.subtitle}</span>
            </motion.p>

            <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col items-start gap-[10px] desktop:gap-[13px]">
              <motion.p
                custom={0.1}
                variants={fadeUp}
                className="w-full text-center text-mobile-body-regular text-text-primary desktop:text-desktop-body-regular"
              >
                {copy.formSubheading}
              </motion.p>

              <motion.div custom={0.2} variants={fadeUp} className="w-full">
                <FormInput
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={copy.nameLabel}
                  error={nameError}
                  aria-label={copy.nameLabel}
                />
              </motion.div>

              <motion.div custom={0.3} variants={fadeUp} className="w-full">
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
              </motion.div>

              <motion.div custom={0.4} variants={fadeUp} className="w-full">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-[56px] w-full gap-[6px] rounded-[18px] px-[18px] text-desktop-body-small-bold disabled:cursor-not-allowed disabled:opacity-60 desktop:h-[74px] desktop:gap-[10px] desktop:rounded-[24px] desktop:px-[24px] desktop:text-desktop-body-regular-bold"
                >
                  {copy.button}
                </Button>
              </motion.div>
              {submitError && (
                <p role="alert" className="w-full text-center text-desktop-body-small text-[#fa3737]">
                  Something went wrong submitting your result — please try again.
                </p>
              )}
            </form>

            <motion.p
              custom={0.5}
              variants={fadeUp}
              className="w-full text-center text-desktop-body-tiny-bold text-text-secondary"
            >
              {copy.policy}
            </motion.p>
          </motion.div>
        </Container>
      </section>
    </main>
  );
}
