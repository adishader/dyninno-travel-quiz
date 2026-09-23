"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/lib/quizState/QuizProvider";
import { companyOfficeOptions, type CompanyOfficeOption } from "@/lib/quiz/companyOptions";
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
    <main>
      <p>{copy.titleEmoji}</p>
      <h1>{copy.title}</h1>
      <p>{copy.subtitle}</p>
      <h2>{copy.formSubheading}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          {copy.nameLabel}
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </label>
        {nameError && <p role="alert">{copy.nameLabel} is required</p>}

        <label>
          {copy.companyPlaceholder}
          <select
            value={companyOffice}
            onChange={(e) => setCompanyOffice(e.target.value as CompanyOfficeOption)}
          >
            <option value="" disabled>
              {copy.companyPlaceholder}
            </option>
            {companyOfficeOptions.map((option) => (
              <option key={option} value={option}>
                {copy.companyLabels[option]}
              </option>
            ))}
          </select>
        </label>
        {companyError && <p role="alert">{copy.companyPlaceholder} is required</p>}

        <button type="submit">{copy.button}</button>
      </form>
      <p>{copy.policy}</p>
    </main>
  );
}
