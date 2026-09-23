"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from "react";
import { quizReducer, initialState, type QuizAction, type QuizState } from "./reducer";

interface QuizContextValue {
  state: QuizState;
  dispatch: Dispatch<QuizAction>;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  useEffect(() => {
    if (state.status !== "in-progress") return;
    const interval = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(interval);
  }, [state.status]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within a QuizProvider");
  return ctx;
}
