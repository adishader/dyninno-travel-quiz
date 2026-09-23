"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/lib/quizState/QuizProvider";
import { formatElapsed } from "@/lib/quiz/formatTime";
import { feedbackMessages, pickFeedbackMessage } from "@/lib/quiz/feedbackMessages";
import type { Locale } from "@/lib/i18n/locales";
import type { OptionLetter, QuizQuestion } from "@/lib/quiz/types";

const ADVANCE_DELAY_MS = 2000;

// Keyed by question.id from the parent, so a fresh question mounts a fresh
// QuestionCard instance instead of needing an effect to reset local state.
function QuestionCard({
  locale,
  question,
  isLastQuestion,
}: {
  locale: Locale;
  question: QuizQuestion;
  isLastQuestion: boolean;
}) {
  const router = useRouter();
  const { dispatch } = useQuiz();
  const [selected, setSelected] = useState<OptionLetter | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const handleSubmit = () => {
    if (!selected || feedback) return;

    const isCorrect = selected === question.correct;
    dispatch({ type: "ANSWER", questionId: question.id, selected, correct: isCorrect });

    const pool = isCorrect ? feedbackMessages[locale].correct : feedbackMessages[locale].wrong;
    setFeedback({ isCorrect, message: pickFeedbackMessage(pool) });

    advanceTimer.current = setTimeout(() => {
      if (isLastQuestion) {
        dispatch({ type: "FINISH" });
        router.push(`/${locale}/finish`);
      } else {
        dispatch({ type: "NEXT_QUESTION" });
      }
    }, ADVANCE_DELAY_MS);
  };

  return (
    <>
      <p>
        Question {question.id} / 15
      </p>
      <h1>{question.question}</h1>
      <ul>
        {question.options.map((option) => {
          const isSelected = selected === option.letter;
          const isCorrectOption = option.letter === question.correct;
          let suffix = "";
          if (feedback) {
            if (isCorrectOption) suffix = " (correct)";
            else if (isSelected) suffix = " (your answer)";
          }
          return (
            <li key={option.letter}>
              <button
                type="button"
                disabled={!!feedback}
                aria-pressed={isSelected}
                onClick={() => setSelected(option.letter)}
              >
                {option.text}
                {suffix}
              </button>
            </li>
          );
        })}
      </ul>
      <button type="button" onClick={handleSubmit} disabled={!selected || !!feedback}>
        {feedback ? feedback.message : "Submit"}
      </button>
    </>
  );
}

export function QuizScreen({ locale, questions }: { locale: Locale; questions: QuizQuestion[] }) {
  const router = useRouter();
  const { state } = useQuiz();

  useEffect(() => {
    if (state.status === "idle") {
      router.replace(`/${locale}/start`);
    } else if (state.status === "finished") {
      router.replace(`/${locale}/finish`);
    }
  }, [state.status, locale, router]);

  if (state.status !== "in-progress") {
    return null;
  }

  const question = questions[state.currentQuestionIndex];
  if (!question) return null;

  const isLastQuestion = state.currentQuestionIndex === questions.length - 1;

  return (
    <main>
      <p>Timer: {formatElapsed(state.elapsedSeconds)}</p>
      <QuestionCard key={question.id} locale={locale} question={question} isLastQuestion={isLastQuestion} />
    </main>
  );
}
