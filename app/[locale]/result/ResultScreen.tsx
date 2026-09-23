"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/lib/quizState/QuizProvider";
import { getScore } from "@/lib/quizState/reducer";
import { formatElapsed } from "@/lib/quiz/formatTime";
import { getResultBracket, type ResultBracket } from "@/lib/quiz/getResultBracket";
import type { Locale } from "@/lib/i18n/locales";

interface ResultCopy {
  label: string;
  answersCaption: string;
  timeCaption: string;
  noteTitle: string;
  noteDescription: string;
  brackets: Record<ResultBracket, { title: string; description: string }>;
}

export function ResultScreen({
  locale,
  copy,
  totalQuestions,
}: {
  locale: Locale;
  copy: ResultCopy;
  totalQuestions: number;
}) {
  const router = useRouter();
  const { state } = useQuiz();

  useEffect(() => {
    if (state.status !== "finished") {
      router.replace(`/${locale}`);
    }
  }, [state.status, locale, router]);

  if (state.status !== "finished") return null;

  const score = getScore(state);
  const bracket = getResultBracket(score);
  const { title, description } = copy.brackets[bracket];
  const time = formatElapsed(state.finalElapsedSeconds ?? state.elapsedSeconds);

  return (
    <main>
      <p>{copy.label}</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <p>
        {copy.answersCaption}: {score} / {totalQuestions}
      </p>
      <p>
        {copy.timeCaption}: {time}
      </p>
      <h2>{copy.noteTitle}</h2>
      <p>{copy.noteDescription}</p>
    </main>
  );
}
