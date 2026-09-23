import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/locales";
import { QUESTION_COUNT } from "@/lib/quiz/answerKey";
import { ResultScreen } from "./ResultScreen";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <ResultScreen
      locale={locale}
      totalQuestions={QUESTION_COUNT}
      copy={{
        label: dict["result.common.label"],
        answersCaption: dict["result.common.answers_caption"],
        timeCaption: dict["result.common.time_caption"],
        noteTitle: dict["result.common.note_title"],
        noteDescription: dict["result.common.note_description"],
        brackets: {
          // Bracket 2/3 reuse bracket 1's cover photo as a placeholder: only
          // the Result-1 (low-score) frame's cover media was available —
          // Result-2/3 need their own distinct assets from Figma.
          1: {
            title: dict["result1.title"],
            description: dict["result1.description"],
            coverPhotoSrc: "/images/result/result-1-photo.webp",
          },
          2: {
            title: dict["result2.title"],
            description: dict["result2.description"],
            coverPhotoSrc: "/images/result/result-1-photo.webp",
          },
          3: {
            title: dict["result3.title"],
            description: dict["result3.description"],
            coverPhotoSrc: "/images/result/result-1-photo.webp",
          },
        },
      }}
    />
  );
}
