"use client";

import { useRouter } from "next/navigation";
import { useQuiz } from "@/lib/quizState/QuizProvider";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { BackgroundLines } from "@/components/layout/BackgroundLines";
import { BackgroundMap } from "@/components/layout/BackgroundMap";
import { Button } from "@/components/ui/Button";
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
    <main className="relative isolate flex min-h-screen flex-col items-center overflow-hidden bg-fill-white">
      <BackgroundMap zIndexClassName="z-[1]" />
      <BackgroundLines zIndexClassName="z-[2]" />
      <div className="relative z-[4] w-full">
        <PageHeader />
      </div>
      <section className="relative z-[3] flex w-full flex-1 flex-col items-center justify-center">
        <Container className="flex flex-col items-center justify-center py-[56px]">
          <div className="flex w-full max-w-[407px] flex-col items-center gap-[32px] desktop:gap-[56px]">
            <div className="flex w-full flex-col items-center gap-[6px] text-center text-text-primary desktop:gap-[10px]">
              <p className="w-full text-mobile-body-medium-bold desktop:text-desktop-body-medium-bold">{title}</p>
              <p className="w-full text-mobile-body-regular desktop:text-desktop-body-regular">{description}</p>
            </div>
            <Button
              onClick={handleStart}
              className="h-[56px] w-full gap-[6px] rounded-[18px] px-[18px] text-desktop-body-small-bold desktop:h-[74px] desktop:gap-[10px] desktop:rounded-[24px] desktop:px-[24px] desktop:text-desktop-body-regular-bold"
            >
              {buttonLabel}
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
