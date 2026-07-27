import { z } from 'zod';
import { DIMENSIONS } from './quiz.schema.js';

// ── Per-dimension score (0–100) ──────────────────────────────────
export const DimensionScore = z.object({
  dimension: z.enum(DIMENSIONS),
  score: z.number().min(0).max(100),
});
export type DimensionScore = z.infer<typeof DimensionScore>;

// ── Maturity segment ─────────────────────────────────────────────
export const MaturitySegment = z.enum(['low', 'medium', 'high']);
export type MaturitySegment = z.infer<typeof MaturitySegment>;

// ── Recommendation from Groq ─────────────────────────────────────
export const Recommendation = z.object({
  dimension: z.enum(DIMENSIONS),
  action: z.string().min(1),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  expectedImpact: z.string(),
});
export type Recommendation = z.infer<typeof Recommendation>;

// ── Raw Groq API response ────────────────────────────────────────
export const GroqResponse = z.object({
  dimensionScores: z.array(DimensionScore).length(5),
  overallScore: z.number().min(0).max(100),
  narrative: z.string().min(1),
  recommendations: z.array(Recommendation).min(3),
});
export type GroqResponse = z.infer<typeof GroqResponse>;

// ── Final report sent to client ─────────────────────────────────
export const Report = z.object({
  id: z.string().uuid(),
  overallScore: z.number().min(0).max(100),
  maturitySegment: MaturitySegment,
  dimensionScores: z.array(DimensionScore).length(5),
  narrative: z.string().nullable(),
  recommendations: z.array(Recommendation).nullable(),
  partial: z.boolean(),
  pdfUrl: z.string().url().nullable(),
  createdAt: z.string().datetime(),
});
export type Report = z.infer<typeof Report>;
