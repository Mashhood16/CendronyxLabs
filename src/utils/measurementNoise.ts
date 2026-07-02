/**
 * Measurement Noise Utilities
 * Adds realistic measurement uncertainty to experimental labs
 * Teaches students that real experiments have noise/error
 */

/**
 * Generates realistic measurement noise (2-5% error typical in student labs)
 * @param trueValue - The true/calculated value
 * @param seed - Deterministic seed for consistent noise at same conditions
 * @param noisePercent - Standard noise level (default 2%)
 * @returns Measured value with noise applied
 */
export function addMeasurementNoise(
  trueValue: number,
  seed: number,
  noisePercent: number = 2
): number {
  if (trueValue === 0) return 0;
  
  // Deterministic noise using sine (same input = same noise)
  const pseudoRandom = Math.sin(trueValue * 10 + seed) * 0.01 * noisePercent;
  const measuredValue = trueValue * (1 + pseudoRandom);
  
  // Don't return negative values for positive measurements
  return Math.max(0, measuredValue);
}

/**
 * For experiments with multiple measurements, add random variation
 * @param trueValue - The true value
 * @param measurementIndex - Which measurement this is (0, 1, 2, ...)
 * @param seed - Random seed for reproducibility
 * @param noisePercent - Noise level
 * @returns Measured value
 */
export function addRandomizedNoise(
  trueValue: number,
  measurementIndex: number,
  seed: number,
  noisePercent: number = 3
): number {
  if (trueValue === 0) return 0;
  
  // Mix deterministic + pseudo-random for variety
  const deterministicComponent = Math.sin(trueValue * 10 + seed) * 0.005;
  const randomComponent = Math.cos(measurementIndex * seed + trueValue) * 0.015;
  const totalNoise = (deterministicComponent + randomComponent) * noisePercent * 0.1;
  
  return Math.max(0, trueValue * (1 + totalNoise));
}

/**
 * Represents measurement with uncertainty range
 */
export interface MeasurementWithUncertainty {
  value: number;
  uncertainty: number; // ±value
  lowBound: number;
  highBound: number;
}

/**
 * Create a measurement with explicit uncertainty bounds
 * @param value - Measured value
 * @param uncertaintyPercent - Uncertainty as percentage (e.g., 5 for ±5%)
 */
export function measurementWithUncertainty(
  value: number,
  uncertaintyPercent: number = 5
): MeasurementWithUncertainty {
  const uncertainty = value * (uncertaintyPercent / 100);
  return {
    value,
    uncertainty,
    lowBound: value - uncertainty,
    highBound: value + uncertainty,
  };
}

/**
 * Evaluate if a student answer is within reasonable tolerance
 * @param studentAnswer - Student's measured/calculated value
 * @param trueValue - True value
 * @param tolerancePercent - Acceptable error margin (typically 5-10%)
 */
export function isWithinTolerance(
  studentAnswer: number,
  trueValue: number,
  tolerancePercent: number = 5
): boolean {
  const error = Math.abs((studentAnswer - trueValue) / trueValue) * 100;
  return error <= tolerancePercent;
}

/**
 * Get feedback on measurement accuracy
 */
export function getMeasurementFeedback(
  measured: number,
  true_: number,
  tolerancePercent: number = 5
): {
  isCorrect: boolean;
  errorPercent: number;
  message: string;
} {
  const error = Math.abs((measured - true_) / true_) * 100;
  const isCorrect = error <= tolerancePercent;
  
  let message = '';
  if (error < 2) {
    message = 'Excellent measurement! Very low error.';
  } else if (error < 5) {
    message = 'Good measurement! Within acceptable range.';
  } else if (error < 10) {
    message = 'Reasonable measurement. Check your technique.';
  } else {
    message = `High error (${error.toFixed(1)}%). Recheck your procedure.`;
  }
  
  return { isCorrect, errorPercent: error, message };
}
