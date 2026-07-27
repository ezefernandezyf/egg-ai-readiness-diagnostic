import { create } from 'zustand';
import { QUIZ_DIMENSIONS } from '../types';

// ── Types ────────────────────────────────────────────────────────
export interface QuizAnswers {
  [dimensionId: string]: {
    [questionKey: string]: number;
  };
}

interface QuizState {
  currentStep: number; // 0 = intro, 1-5 = dimensions, 6 = lead form
  answers: QuizAnswers;
  goNext: () => void;
  goBack: () => void;
  setAnswer: (dimensionId: string, questionKey: string, score: number) => void;
  getAnswersForDimension: (dimensionId: string) => number[];
  isStepComplete: (dimensionId: string) => boolean;
  reset: () => void;
  hasStarted: boolean;
}

const TOTAL_STEPS = 6; // intro(0) + 5 dimensions + lead form

// ── Store ─────────────────────────────────────────────────────────
export const useQuizStore = create<QuizState>((set, get) => ({
  currentStep: 0,
  answers: {},
  hasStarted: false,

  goNext: () => {
    const { currentStep, answers } = get();

    // If we're on a dimension step (1-5), validate all 3 questions answered
    if (currentStep >= 1 && currentStep <= 5) {
      const dimension = QUIZ_DIMENSIONS[currentStep - 1];
      if (!dimension) return;

      const dimAnswers = answers[dimension.id];
      if (!dimAnswers || dimension.questions.some((q) => !dimAnswers[q.key])) {
        return; // Step not complete, don't advance
      }
    }

    if (currentStep < TOTAL_STEPS) {
      set({ currentStep: currentStep + 1, hasStarted: true });
    }
  },

  goBack: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  setAnswer: (dimensionId: string, questionKey: string, score: number) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [dimensionId]: {
          ...state.answers[dimensionId],
          [questionKey]: score,
        },
      },
    }));
  },

  getAnswersForDimension: (dimensionId: string): number[] => {
    const { answers } = get();
    const dimAnswers = answers[dimensionId];
    if (!dimAnswers) return [];
    return Object.values(dimAnswers);
  },

  isStepComplete: (dimensionId: string): boolean => {
    const { answers } = get();
    const dimAnswers = answers[dimensionId];
    if (!dimAnswers) return false;
    const dimension = QUIZ_DIMENSIONS.find((d) => d.id === dimensionId);
    if (!dimension) return false;
    return dimension.questions.every((q) => typeof dimAnswers[q.key] === 'number');
  },

  reset: () => {
    set({ currentStep: 0, answers: {}, hasStarted: false });
  },
}));
