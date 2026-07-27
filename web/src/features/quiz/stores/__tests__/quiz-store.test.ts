import { describe, it, expect, beforeEach } from 'vitest';
import { useQuizStore } from '../quiz-store';

describe('QuizStore', () => {
  // Reset store before each test by calling reset()
  beforeEach(() => {
    useQuizStore.getState().reset();
  });

  describe('initial state', () => {
    it('starts at step 0', () => {
      const state = useQuizStore.getState();
      expect(state.currentStep).toBe(0);
    });

    it('starts with empty answers', () => {
      const state = useQuizStore.getState();
      expect(state.answers).toEqual({});
    });

    it('starts with hasStarted = false', () => {
      const state = useQuizStore.getState();
      expect(state.hasStarted).toBe(false);
    });
  });

  describe('setAnswer', () => {
    it('stores values correctly for a dimension', () => {
      useQuizStore.getState().setAnswer('Estrategia', 'est_1', 4);
      const state = useQuizStore.getState();
      expect(state.answers.Estrategia?.est_1).toBe(4);
    });

    it('merges multiple answers for the same dimension', () => {
      useQuizStore.getState().setAnswer('Estrategia', 'est_1', 3);
      useQuizStore.getState().setAnswer('Estrategia', 'est_2', 5);
      const state = useQuizStore.getState();
      expect(state.answers.Estrategia).toEqual({ est_1: 3, est_2: 5 });
    });

    it('stores answers for different dimensions separately', () => {
      useQuizStore.getState().setAnswer('Estrategia', 'est_1', 2);
      useQuizStore.getState().setAnswer('Talento', 'tal_1', 4);
      const state = useQuizStore.getState();
      expect(state.answers.Estrategia?.est_1).toBe(2);
      expect(state.answers.Talento?.tal_1).toBe(4);
    });
  });

  describe('isStepComplete', () => {
    it('returns false when no answers given', () => {
      expect(useQuizStore.getState().isStepComplete('Estrategia')).toBe(false);
    });

    it('returns false when only some questions answered', () => {
      useQuizStore.getState().setAnswer('Estrategia', 'est_1', 3);
      useQuizStore.getState().setAnswer('Estrategia', 'est_2', 4);
      expect(useQuizStore.getState().isStepComplete('Estrategia')).toBe(false);
    });

    it('returns true when all 3 questions answered', () => {
      useQuizStore.getState().setAnswer('Estrategia', 'est_1', 3);
      useQuizStore.getState().setAnswer('Estrategia', 'est_2', 4);
      useQuizStore.getState().setAnswer('Estrategia', 'est_3', 5);
      expect(useQuizStore.getState().isStepComplete('Estrategia')).toBe(true);
    });
  });

  describe('goNext', () => {
    it('advances from intro (step 0) to first dimension (step 1)', () => {
      useQuizStore.getState().goNext();
      expect(useQuizStore.getState().currentStep).toBe(1);
    });

    it('sets hasStarted to true when advancing', () => {
      useQuizStore.getState().goNext();
      expect(useQuizStore.getState().hasStarted).toBe(true);
    });

    it('advances through all dimensions when each is complete', () => {
      const dimensions = ['Estrategia', 'Talento', 'Procesos', 'Tecnologia', 'Cultura'];
      const questionKeys = [
        ['est_1', 'est_2', 'est_3'],
        ['tal_1', 'tal_2', 'tal_3'],
        ['pro_1', 'pro_2', 'pro_3'],
        ['tec_1', 'tec_2', 'tec_3'],
        ['cul_1', 'cul_2', 'cul_3'],
      ];

      // Step 0 → 1 (intro, no validation)
      useQuizStore.getState().goNext();
      expect(useQuizStore.getState().currentStep).toBe(1);

      // Steps 1-5: fill dimension and advance
      for (let i = 1; i <= 5; i++) {
        const dim = dimensions[i - 1]!;
        const keys = questionKeys[i - 1]!;
        for (const key of keys) {
          useQuizStore.getState().setAnswer(dim, key, 3);
        }
        useQuizStore.getState().goNext();
        expect(useQuizStore.getState().currentStep).toBe(i + 1);
      }

      // After 5 dimensions, we should be at step 6 (lead form)
      expect(useQuizStore.getState().currentStep).toBe(6);
    });

    it('is blocked when step 1 dimension is not complete', () => {
      // Start at step 0, advance to step 1
      useQuizStore.getState().goNext();
      expect(useQuizStore.getState().currentStep).toBe(1);

      // Try to advance without answering Estrategia questions
      useQuizStore.getState().goNext();
      expect(useQuizStore.getState().currentStep).toBe(1);
    });

    it('is blocked at step 6 (lead form)', () => {
      // Force to step 6 by setting directly and testing goNext
      // First go through all steps normally
      const dimensions = ['Estrategia', 'Talento', 'Procesos', 'Tecnologia', 'Cultura'];
      const questionKeys = [
        ['est_1', 'est_2', 'est_3'],
        ['tal_1', 'tal_2', 'tal_3'],
        ['pro_1', 'pro_2', 'pro_3'],
        ['tec_1', 'tec_2', 'tec_3'],
        ['cul_1', 'cul_2', 'cul_3'],
      ];

      useQuizStore.getState().goNext(); // 0 → 1
      for (let i = 1; i <= 5; i++) {
        const dim = dimensions[i - 1]!;
        const keys = questionKeys[i - 1]!;
        for (const key of keys) {
          useQuizStore.getState().setAnswer(dim, key, 3);
        }
        useQuizStore.getState().goNext();
      }

      // Should be at step 6, goNext should do nothing
      expect(useQuizStore.getState().currentStep).toBe(6);
      useQuizStore.getState().goNext();
      expect(useQuizStore.getState().currentStep).toBe(6);
    });
  });

  describe('goBack', () => {
    it('goes back one step', () => {
      // Advance to step 1 first
      useQuizStore.getState().goNext();
      expect(useQuizStore.getState().currentStep).toBe(1);

      useQuizStore.getState().goBack();
      expect(useQuizStore.getState().currentStep).toBe(0);
    });

    it('is blocked at step 0', () => {
      useQuizStore.getState().goBack();
      expect(useQuizStore.getState().currentStep).toBe(0);
    });
  });

  describe('reset', () => {
    it('clears everything back to initial state', () => {
      // Set up some state
      useQuizStore.getState().goNext();
      useQuizStore.getState().setAnswer('Estrategia', 'est_1', 4);

      // Reset
      useQuizStore.getState().reset();

      const state = useQuizStore.getState();
      expect(state.currentStep).toBe(0);
      expect(state.answers).toEqual({});
      expect(state.hasStarted).toBe(false);
    });
  });
});
