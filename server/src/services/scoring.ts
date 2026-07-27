// ── Scoring Service ──────────────────────────────────────────────
// Pure functions for dimension scoring, overall scoring, and maturity segmentation.
// No side effects, no I/O.

/**
 * Calculate a dimension score from 3 Likert (1-5) answers.
 *
 * Formula: (avg(likert) - 1) / 4 * 100
 *
 * Examples:
 *   [1,1,1] → 0
 *   [3,3,3] → 50
 *   [5,5,5] → 100
 */
export function calculateDimensionScore(answers: number[]): number {
  if (answers.length === 0) return 0;

  const avg = answers.reduce((sum, val) => sum + val, 0) / answers.length;
  const clamped = Math.max(1, Math.min(5, avg));
  return ((clamped - 1) / 4) * 100;
}

/**
 * Calculate overall maturity score from 5 dimension scores (0-100 each).
 *
 * Formula: avg(all dimension_scores)
 */
export function calculateOverallScore(dimensions: number[]): number {
  if (dimensions.length === 0) return 0;

  const avg = dimensions.reduce((sum, val) => sum + val, 0) / dimensions.length;
  return Math.round(avg * 100) / 100; // round to 2 decimals
}

/**
 * Map a 0-100 score to maturity segment.
 *
 *   0–33  → low
 *  34–66  → medium
 *  67–100 → high
 */
export function getMaturitySegment(score: number): 'low' | 'medium' | 'high' {
  if (score <= 33) return 'low';
  if (score <= 66) return 'medium';
  return 'high';
}
