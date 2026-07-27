import { describe, it, expect } from 'vitest';
import {
  calculateDimensionScore,
  calculateOverallScore,
  getMaturitySegment,
} from '../scoring';

describe('calculateDimensionScore', () => {
  it('returns 0 for all minimum answers [1,1,1]', () => {
    expect(calculateDimensionScore([1, 1, 1])).toBe(0);
  });

  it('returns 50 for all neutral answers [3,3,3]', () => {
    expect(calculateDimensionScore([3, 3, 3])).toBe(50);
  });

  it('returns 100 for all maximum answers [5,5,5]', () => {
    expect(calculateDimensionScore([5, 5, 5])).toBe(100);
  });

  it('returns 50 for [2,3,4] (avg=3, score=50)', () => {
    expect(calculateDimensionScore([2, 3, 4])).toBe(50);
  });

  it('returns 50 for mixed values [1,5,1,5] (avg=3, score=50)', () => {
    expect(calculateDimensionScore([1, 5, 1, 5])).toBe(50);
  });

  it('returns 0 for empty array', () => {
    expect(calculateDimensionScore([])).toBe(0);
  });
});

describe('calculateOverallScore', () => {
  it('returns 50 for scores [0,25,50,75,100]', () => {
    expect(calculateOverallScore([0, 25, 50, 75, 100])).toBe(50);
  });

  it('returns 0 for empty array', () => {
    expect(calculateOverallScore([])).toBe(0);
  });
});

describe('getMaturitySegment', () => {
  it('returns "low" for score 0', () => {
    expect(getMaturitySegment(0)).toBe('low');
  });

  it('returns "low" for score 33', () => {
    expect(getMaturitySegment(33)).toBe('low');
  });

  it('returns "medium" for score 34', () => {
    expect(getMaturitySegment(34)).toBe('medium');
  });

  it('returns "medium" for score 66', () => {
    expect(getMaturitySegment(66)).toBe('medium');
  });

  it('returns "high" for score 67', () => {
    expect(getMaturitySegment(67)).toBe('high');
  });

  it('returns "high" for score 100', () => {
    expect(getMaturitySegment(100)).toBe('high');
  });
});
