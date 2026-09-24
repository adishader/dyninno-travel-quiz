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
          1: {
            title: dict["result1.title"],
            description: dict["result1.description"],
            coverVideoSrc: "/images/result/result-video-1-rf29.mp4",
          },
          2: {
            title: dict["result2.title"],
            description: dict["result2.description"],
            coverVideoSrc: "/images/result/result-video-2-rf29.mp4",
          },
          3: {
            title: dict["result3.title"],
            description: dict["result3.description"],
            coverVideoSrc: "/images/result/result-video-3-rf29.mp4",
          },
        },
      }}
    />
  );
}
