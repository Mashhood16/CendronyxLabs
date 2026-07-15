import { describe, it, expect } from 'vitest';
import {
  addMeasurementNoise,
  addRandomizedNoise,
  measurementWithUncertainty,
  isWithinTolerance,
  getMeasurementFeedback,
} from '../../utils/measurementNoise';

describe('addMeasurementNoise', () => {
  it('returns deterministic noise for same inputs', () => {
    const v1 = addMeasurementNoise(100, 42, 2);
    const v2 = addMeasurementNoise(100, 42, 2);
    expect(v1).toBe(v2);
  });

  it('returns different noise for different seeds', () => {
    const v1 = addMeasurementNoise(100, 42, 2);
    const v2 = addMeasurementNoise(100, 99, 2);
    expect(v1).not.toBe(v2);
  });

  it('returns 0 when trueValue is 0', () => {
    expect(addMeasurementNoise(0, 42)).toBe(0);
  });

  it('stays within 5% of true value for default noise', () => {
    const result = addMeasurementNoise(100, 123, 5);
    expect(result).toBeGreaterThan(95);
    expect(result).toBeLessThan(105);
  });

  it('never returns negative for positive input', () => {
    for (let seed = 0; seed < 100; seed++) {
      const result = addMeasurementNoise(50, seed, 10);
      expect(result).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('addRandomizedNoise', () => {
  it('returns different values for different measurement indices', () => {
    const v1 = addRandomizedNoise(100, 0, 42, 3);
    const v2 = addRandomizedNoise(100, 1, 42, 3);
    expect(v1).not.toBe(v2);
  });

  it('returns 0 when trueValue is 0', () => {
    expect(addRandomizedNoise(0, 0, 42)).toBe(0);
  });
});

describe('measurementWithUncertainty', () => {
  it('computes correct bounds for 5% uncertainty', () => {
    const result = measurementWithUncertainty(100, 5);
    expect(result.value).toBe(100);
    expect(result.uncertainty).toBe(5);
    expect(result.lowBound).toBe(95);
    expect(result.highBound).toBe(105);
  });

  it('uses default 5% uncertainty when not specified', () => {
    const result = measurementWithUncertainty(200);
    expect(result.uncertainty).toBe(10);
    expect(result.lowBound).toBe(190);
    expect(result.highBound).toBe(210);
  });

  it('handles zero value gracefully', () => {
    const result = measurementWithUncertainty(0, 5);
    expect(result.value).toBe(0);
    expect(result.uncertainty).toBe(0);
    expect(result.lowBound).toBe(0);
    expect(result.highBound).toBe(0);
  });
});

describe('isWithinTolerance', () => {
  it('returns true when error is within tolerance', () => {
    expect(isWithinTolerance(102, 100, 5)).toBe(true);
    expect(isWithinTolerance(98, 100, 5)).toBe(true);
  });

  it('returns false when error exceeds tolerance', () => {
    expect(isWithinTolerance(110, 100, 5)).toBe(false);
    expect(isWithinTolerance(93, 100, 5)).toBe(false);
  });

  it('uses default 5% tolerance', () => {
    expect(isWithinTolerance(105, 100)).toBe(true);
    expect(isWithinTolerance(106, 100)).toBe(false);
  });

  it('handles zero true value', () => {
    expect(isWithinTolerance(0, 0, 5)).toBe(true);
    expect(isWithinTolerance(1, 0, 5)).toBe(false);
  });
});

describe('getMeasurementFeedback', () => {
  it('returns correct for perfect measurement', () => {
    const result = getMeasurementFeedback(100, 100, 5);
    expect(result.isCorrect).toBe(true);
    expect(result.errorPercent).toBeLessThan(0.01);
    expect(result.message).toContain('Excellent');
  });

  it('returns correct within tolerance', () => {
    const result = getMeasurementFeedback(103, 100, 5);
    expect(result.isCorrect).toBe(true);
    expect(result.errorPercent).toBeCloseTo(3, 0);
    expect(result.message).toContain('Good');
  });

  it('returns incorrect when beyond tolerance', () => {
    const result = getMeasurementFeedback(120, 100, 5);
    expect(result.isCorrect).toBe(false);
    expect(result.errorPercent).toBe(20);
    expect(result.message).toContain('High error');
  });

  it('grades messages by error severity', () => {
    const excellent = getMeasurementFeedback(100.5, 100, 5);
    const good = getMeasurementFeedback(103, 100, 5);
    const moderate = getMeasurementFeedback(108, 100, 5);
    const high = getMeasurementFeedback(115, 100, 5);

    expect(excellent.message).toContain('Excellent');
    expect(good.message).toContain('Good');
    expect(moderate.message).toContain('Reasonable');
    expect(high.message).toContain('High error');
  });
});
