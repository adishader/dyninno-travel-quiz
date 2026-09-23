import { getDictionary } from "@/lib/i18n/getDictionary";
import { getQuestions } from "@/lib/quiz/getQuestions";
import type { Locale } from "@/lib/i18n/locales";
import { QuizScreen } from "./QuizScreen";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const [dict, questions] = await Promise.all([getDictionary(locale), getQuestions(locale)]);

  return <QuizScreen locale={locale} questions={questions} dict={dict} />;
}
