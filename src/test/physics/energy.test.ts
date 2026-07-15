import { describe, it, expect } from 'vitest';
import {
  calculateEnergyStep,
  getCurveY,
  type EnergyState,
} from '../../physics/energy';

describe('getCurveY', () => {
  it('returns 0 at x=0', () => {
    expect(getCurveY(0)).toBe(0);
  });

  it('returns positive values for |x| > 0 (parabola)', () => {
    expect(getCurveY(5)).toBeGreaterThan(0);
    expect(getCurveY(-5)).toBeGreaterThan(0);
  });

  it('is symmetric', () => {
    expect(getCurveY(3)).toBe(getCurveY(-3));
  });
});

describe('calculateEnergyStep', () => {
  const defaultState: EnergyState = {
    x: -4.9,
    y: 4.802,
    velocity: 0.01,
    time: 0,
    pe: 0,
    ke: 0,
    thermal: 0,
    totalE: 100,
  };

  it('updates position and velocity', () => {
    const result = calculateEnergyStep(defaultState, 0.016, 1, 1, 0); // 60fps, no friction
    expect(result.time).toBe(0.016);
    expect(typeof result.x).toBe('number');
    expect(typeof result.velocity).toBe('number');
  });

  it('conserves total energy in frictionless simulation', () => {
    const result = calculateEnergyStep(defaultState, 0.016, 1, 1, 0);
    const total = result.pe + result.ke + result.thermal;
    expect(total).toBeCloseTo(defaultState.totalE, 0);
  });

  it('converts mechanical energy to thermal with friction', () => {
    const noFriction = calculateEnergyStep(defaultState, 1, 1, 1, 0);
    const withFriction = calculateEnergyStep(defaultState, 1, 1, 1, 0.3);
    expect(withFriction.thermal).toBeGreaterThan(noFriction.thermal);
    expect(withFriction.ke).toBeLessThan(noFriction.ke);
  });

  it('stops at track boundaries', () => {
    const atEdge: EnergyState = { x: 5, y: 5, velocity: 5, time: 0, pe: 0, ke: 0, thermal: 0, totalE: 100 };
    const result = calculateEnergyStep(atEdge, 1, 1, 1, 0);
    expect(result.x).toBeLessThanOrEqual(5);
    expect(result.x).toBeGreaterThanOrEqual(-5);
  });
});
