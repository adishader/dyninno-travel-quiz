"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQuiz } from "@/lib/quizState/QuizProvider";
import { getScore } from "@/lib/quizState/reducer";
import { formatElapsed } from "@/lib/quiz/formatTime";
import { getResultBracket, type ResultBracket } from "@/lib/quiz/getResultBracket";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { BackgroundLines } from "@/components/layout/BackgroundLines";
import { BackgroundMap } from "@/components/layout/BackgroundMap";
import { ResultCover } from "@/components/result/ResultCover";
import { fadeUp } from "@/lib/animation/fadeUp";
import type { Locale } from "@/lib/i18n/locales";

interface ResultCopy {
  label: string;
  answersCaption: string;
  timeCaption: string;
  noteTitle: string;
  noteDescription: string;
  brackets: Record<ResultBracket, { title: string; description: string; coverPhotoSrc: string }>;
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
  const { title, description, coverPhotoSrc } = copy.brackets[bracket];
  const time = formatElapsed(state.finalElapsedSeconds ?? state.elapsedSeconds);

  return (
    <main className="relative isolate flex min-h-screen flex-col items-center overflow-hidden bg-fill-white">
      <div className="relative z-[4] w-full">
        <PageHeader />
      </div>
      <BackgroundMap zIndexClassName="z-[1] desktop:z-[2]" />
      <BackgroundLines zIndexClassName="z-[2] desktop:z-[1]" />
      <section className="relative z-[3] flex w-full flex-1 flex-col items-center">
        <Container className="flex flex-col items-center py-[32px] desktop:py-[42px]">
          <motion.div
            initial="hidden"
            animate="visible"
            className="flex w-full max-w-[542px] flex-col items-center gap-[42px] desktop:gap-[56px]"
          >
            <motion.div custom={0} variants={fadeUp} className="w-full">
              <ResultCover photoSrc={coverPhotoSrc} />
            </motion.div>

            <div className="flex w-full flex-col items-center gap-[24px] desktop:gap-[32px]">
              <motion.div custom={0.1} variants={fadeUp} className="flex w-full flex-col items-center gap-[10px]">
                <div className="flex h-[32px] items-center justify-center rounded-[10px] bg-[linear-gradient(90deg,#00b2a9_0%,#0060b2_100%)] px-[13px] text-mobile-body-regular-bold text-text-white desktop:h-[42px] desktop:rounded-[13px] desktop:px-[18px] desktop:text-desktop-body-regular-bold">
                  {copy.label}
                </div>
                <h1 className="w-full text-center text-mobile-heading-h2 text-text-primary desktop:text-desktop-heading-h2">
                  {title}
                </h1>
              </motion.div>

              <motion.div
                custom={0.2}
                variants={fadeUp}
                className="flex w-full items-center justify-center gap-[18px] text-center text-text-primary desktop:gap-[32px]"
              >
                <div className="flex flex-1 flex-col items-center gap-[8px] rounded-[32px] bg-fill-grey-pale px-[18px] pb-[24px] pt-[18px] desktop:gap-[13px] desktop:pb-[32px] desktop:pt-[24px]">
                  <p className="text-mobile-body-large-bold desktop:text-desktop-body-large-bold">✅</p>
                  <div className="flex w-full flex-col items-start">
                    <p className="w-full text-mobile-body-large-bold desktop:text-desktop-body-large-bold">
                      {score}/{totalQuestions}
                    </p>
                    <p className="w-full text-mobile-body-small desktop:text-desktop-body-small">
                      {copy.answersCaption}
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-center gap-[8px] rounded-[32px] bg-fill-grey-pale px-[18px] pb-[24px] pt-[18px] desktop:gap-[13px] desktop:pb-[32px] desktop:pt-[24px]">
                  <p className="text-mobile-body-large-bold desktop:text-desktop-body-large-bold">⏱️</p>
                  <div className="flex w-full flex-col items-start">
                    <p className="w-full text-mobile-body-large-bold desktop:text-desktop-body-large-bold">{time}</p>
                    <p className="w-full text-mobile-body-small desktop:text-desktop-body-small">
                      {copy.timeCaption}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.p
                custom={0.3}
                variants={fadeUp}
                className="w-full text-center text-mobile-body-regular-bold text-text-primary desktop:text-desktop-body-regular-bold"
              >
                {description}
              </motion.p>
            </div>

            <motion.div
              custom={0.4}
              variants={fadeUp}
              className="flex w-full flex-col items-center gap-[6px] rounded-[24px] border-2 border-border-light bg-fill-white px-[24px] py-[32px] text-center text-text-primary desktop:gap-[10px] desktop:rounded-[32px] desktop:py-[42px]"
            >
              <p className="w-full text-mobile-body-regular-bold desktop:text-desktop-body-medium-bold">
                {copy.noteTitle}
              </p>
              <p className="w-full text-mobile-body-regular desktop:text-desktop-body-regular">
                {copy.noteDescription}
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </section>
    </main>
  );
}
