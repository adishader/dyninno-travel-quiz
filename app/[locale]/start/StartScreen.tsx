"use client";

import { useRouter } from "next/navigation";
import { useQuiz } from "@/lib/quizState/QuizProvider";
import type { Locale } from "@/lib/i18n/locales";

export function StartScreen({
  locale,
  title,
  description,
  buttonLabel,
}: {
  locale: Locale;
  title: string;
  description: string;
  buttonLabel: string;
}) {
  const router = useRouter();
  const { dispatch } = useQuiz();

  const handleStart = () => {
    dispatch({ type: "START" });
    router.push(`/${locale}/quiz`);
  };

  return (
    <main>
      <h1>{title}</h1>
      <p>{description}</p>
      <button type="button" onClick={handleStart}>
        {buttonLabel}
      </button>
    </main>
  );
}
