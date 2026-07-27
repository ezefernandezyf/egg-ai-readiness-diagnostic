import { z } from 'zod';

// ── Dimension names ──────────────────────────────────────────────
export const DIMENSIONS = [
  'Estrategia',
  'Talento',
  'Procesos',
  'Tecnologia',
  'Cultura',
] as const;

export type Dimension = (typeof DIMENSIONS)[number];

// ── Likert scale (1–5) ──────────────────────────────────────────
export const LikertScore = z.number().int().min(1).max(5);

// ── A single question answer within a dimension ──────────────────
export const QuizAnswer = z.object({
  dimension: z.enum(DIMENSIONS),
  questionKey: z.string().min(1),
  score: LikertScore,
});
export type QuizAnswer = z.infer<typeof QuizAnswer>;

// ── One quiz step = one dimension, 3 questions ───────────────────
export const QuizStep = z.object({
  dimension: z.enum(DIMENSIONS),
  answers: z.array(QuizAnswer).length(3),
});
export type QuizStep = z.infer<typeof QuizStep>;

// ── Full quiz submission (5 steps → 15 answers) ──────────────────
export const QuizSubmission = z.object({
  steps: z.array(QuizStep).length(5),
});
export type QuizSubmission = z.infer<typeof QuizSubmission>;

// ── Aggregated answers per dimension (for scoring) ──────────────
export const DimensionAnswers = z.object({
  dimension: z.enum(DIMENSIONS),
  scores: z.array(LikertScore).length(3),
});
export type DimensionAnswers = z.infer<typeof DimensionAnswers>;
