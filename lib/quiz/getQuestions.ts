import { getDictionary, t } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/locales";
import { answerKey, QUESTION_COUNT } from "./answerKey";
import type { OptionLetter, QuizQuestion } from "./types";

const OPTION_LETTERS: OptionLetter[] = ["a", "b", "c", "d"];

export async function getQuestions(locale: Locale): Promise<QuizQuestion[]> {
  const dict = await getDictionary(locale);

  return Array.from({ length: QUESTION_COUNT }, (_, i) => {
    const id = i + 1;
    const prefix = `q${id}`;
    const question: QuizQuestion = {
      id,
      question: t(dict, `${prefix}.question`),
      options: OPTION_LETTERS.map((letter) => ({
        letter,
        text: t(dict, `${prefix}.option_${letter}`),
      })),
      correct: answerKey[id],
    };
    return question;
  });
}
