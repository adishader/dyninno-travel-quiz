"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/lib/quizState/QuizProvider";
import { formatElapsed } from "@/lib/quiz/formatTime";
import { getFeedbackPool, pickFeedbackMessage } from "@/lib/quiz/feedbackMessages";
import { t, type Dictionary } from "@/lib/i18n/getDictionary";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { BackgroundLines } from "@/components/layout/BackgroundLines";
import { AnswerOption, type AnswerOptionState } from "@/components/quiz/AnswerOption";
import { SubmitAnswerButton, type SubmitButtonVariant } from "@/components/quiz/SubmitAnswerButton";
import { TimerBadge } from "@/components/quiz/TimerBadge";
import type { Locale } from "@/lib/i18n/locales";
import type { OptionLetter, QuizQuestion } from "@/lib/quiz/types";

const ADVANCE_DELAY_MS = 2000;

function getOptionState(
  letter: OptionLetter,
  selected: OptionLetter | null,
  correct: OptionLetter,
  answered: boolean,
): AnswerOptionState {
  if (!answered) return letter === selected ? "selected" : "default";
  if (letter === correct) return "correct";
  if (letter === selected) return "wrong";
  return "default";
}

function getSubmitVariant(selected: OptionLetter | null, feedback: { isCorrect: boolean } | null): SubmitButtonVariant {
  if (feedback) return feedback.isCorrect ? "feedback-correct" : "feedback-wrong";
  return selected ? "enabled" : "disabled";
}

// Keyed by question.id from the parent, so a fresh question mounts a fresh
// QuestionCard instance instead of needing an effect to reset local state.
function QuestionCard({
  locale,
  question,
  questionCount,
  isLastQuestion,
  dict,
  elapsedLabel,
}: {
  locale: Locale;
  question: QuizQuestion;
  questionCount: number;
  isLastQuestion: boolean;
  dict: Dictionary;
  elapsedLabel: string;
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

    const pool = getFeedbackPool(dict, isCorrect ? "correct" : "wrong");
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

  const submitLabel = feedback
    ? feedback.message
    : `${t(dict, "quiz.submit_button_default")} ${question.id}/${questionCount}`;

  return (
    <div className="flex w-full max-w-[542px] flex-col items-center gap-[24px]">
      <p className="w-full text-center text-mobile-body-regular-bold text-[#242831] desktop:text-desktop-body-regular-bold">
        {question.question}
      </p>
      <div className="flex w-full flex-col items-start gap-[6px] desktop:gap-[8px]">
        {question.options.map((option) => (
          <AnswerOption
            key={option.letter}
            state={getOptionState(option.letter, selected, question.correct, !!feedback)}
            disabled={!!feedback}
            onClick={() => setSelected(option.letter)}
          >
            {option.text}
          </AnswerOption>
        ))}
      </div>
      <SubmitAnswerButton
        variant={getSubmitVariant(selected, feedback)}
        disabled={!selected || !!feedback}
        onClick={handleSubmit}
      >
        {submitLabel}
      </SubmitAnswerButton>
      <TimerBadge label={elapsedLabel} />
    </div>
  );
}

export function QuizScreen({
  locale,
  questions,
  dict,
}: {
  locale: Locale;
  questions: QuizQuestion[];
  dict: Dictionary;
}) {
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
    <main className="relative isolate flex min-h-screen flex-col items-center overflow-hidden bg-fill-white">
      <BackgroundLines />
      <div className="relative z-[3] w-full">
        <PageHeader />
      </div>
      <section className="relative z-[2] flex w-full flex-1 flex-col items-center desktop:justify-center">
        <Container className="flex flex-col items-center py-[56px]">
          <QuestionCard
            key={question.id}
            locale={locale}
            question={question}
            questionCount={questions.length}
            isLastQuestion={isLastQuestion}
            dict={dict}
            elapsedLabel={formatElapsed(state.elapsedSeconds)}
          />
        </Container>
      </section>
    </main>
  );
}
