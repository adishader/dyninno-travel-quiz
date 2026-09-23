import type { OptionLetter } from "@/lib/quiz/types";

export interface AnswerRecord {
  questionId: number;
  selected: OptionLetter;
  correct: boolean;
}

export interface QuizState {
  status: "idle" | "in-progress" | "finished";
  startedAt: number | null;
  elapsedSeconds: number;
  finalElapsedSeconds: number | null;
  currentQuestionIndex: number;
  answers: AnswerRecord[];
}

export const initialState: QuizState = {
  status: "idle",
  startedAt: null,
  elapsedSeconds: 0,
  finalElapsedSeconds: null,
  currentQuestionIndex: 0,
  answers: [],
};

export type QuizAction =
  | { type: "START" }
  | { type: "TICK" }
  | { type: "ANSWER"; questionId: number; selected: OptionLetter; correct: boolean }
  | { type: "NEXT_QUESTION" }
  | { type: "FINISH" }
  | { type: "RESET" };

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "START":
      return { ...initialState, status: "in-progress", startedAt: Date.now() };

    case "TICK": {
      if (state.status !== "in-progress" || state.startedAt === null) return state;
      const elapsedSeconds = Math.floor((Date.now() - state.startedAt) / 1000);
      if (elapsedSeconds === state.elapsedSeconds) return state;
      return { ...state, elapsedSeconds };
    }

    case "ANSWER": {
      if (state.status !== "in-progress") return state;
      if (state.answers.some((a) => a.questionId === action.questionId)) return state;
      return {
        ...state,
        answers: [
          ...state.answers,
          { questionId: action.questionId, selected: action.selected, correct: action.correct },
        ],
      };
    }

    case "NEXT_QUESTION":
      if (state.status !== "in-progress") return state;
      return { ...state, currentQuestionIndex: state.currentQuestionIndex + 1 };

    case "FINISH": {
      if (state.status !== "in-progress") return state;
      const finalElapsedSeconds =
        state.startedAt !== null
          ? Math.floor((Date.now() - state.startedAt) / 1000)
          : state.elapsedSeconds;
      return { ...state, status: "finished", finalElapsedSeconds };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

export function getScore(state: QuizState): number {
  return state.answers.filter((a) => a.correct).length;
}
