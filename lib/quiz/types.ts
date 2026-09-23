export type OptionLetter = "a" | "b" | "c" | "d";

export interface QuizOption {
  letter: OptionLetter;
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  correct: OptionLetter;
}
