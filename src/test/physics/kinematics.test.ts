import { describe, it, expect } from 'vitest';
import {
  calculateKinematicsStep,
  extractKinematicsDataPoint,
  GRAVITY,
  type KinematicsState,
} from '../../physics/kinematics';

describe('GRAVITY constants', () => {
  it('has Earth, Mars, Moon', () => {
    expect(GRAVITY.Earth).toBeCloseTo(9.81, 2);
    expect(GRAVITY.Mars).toBeCloseTo(3.72, 2);
    expect(GRAVITY.Moon).toBeCloseTo(1.62, 2);
  });
});

describe('calculateKinematicsStep', () => {
  const defaultState: KinematicsState = {
    y: 100,
    v: 0,
    time: 0,
    hasHitGround: false,
  };

  it('accelerates object downward in vacuum', () => {
    const result = calculateKinematicsStep(defaultState, 0.1, 1, GRAVITY.Earth, true);
    expect(result.v).toBeGreaterThan(0); // velocity increases
    expect(result.y).toBeLessThan(100); // height decreases
    expect(result.time).toBe(0.1);
    expect(result.hasHitGround).toBe(false);
  });

  it('stops simulation when object hits ground', () => {
    const nearGround: KinematicsState = { y: 0.5, v: 10, time: 0, hasHitGround: false };
    const result = calculateKinematicsStep(nearGround, 1, 1, GRAVITY.Earth, true);
    expect(result.hasHitGround).toBe(true);
    expect(result.y).toBe(0);
    expect(result.v).toBe(0);
  });

  it('respects timeScale for slow-motion', () => {
    const normal = calculateKinematicsStep(defaultState, 0.1, 1, GRAVITY.Earth, true);
    const slow = calculateKinematicsStep(defaultState, 0.1, 0.5, GRAVITY.Earth, true);
    expect(slow.v).toBeLessThan(normal.v);
  });

  it('applies drag in non-vacuum mode', () => {
    const vacuum = calculateKinematicsStep(defaultState, 0.1, 1, GRAVITY.Earth, true, 1);
    const withDrag = calculateKinematicsStep(defaultState, 0.1, 1, GRAVITY.Earth, false, 1);
    // With drag, acceleration should be lower
    expect(withDrag.v).toBeLessThanOrEqual(vacuum.v);
  });

  it('does not continue after hitting ground', () => {
    const groundState: KinematicsState = { y: 0, v: 0, time: 5, hasHitGround: true };
    const result = calculateKinematicsStep(groundState, 0.1, 1, GRAVITY.Earth, true);
    expect(result).toEqual(groundState);
  });

  it('falls faster on Earth than Moon', () => {
    const earth = calculateKinematicsStep(defaultState, 1, 1, GRAVITY.Earth, true);
    const moon = calculateKinematicsStep(defaultState, 1, 1, GRAVITY.Moon, true);
    expect(earth.v).toBeGreaterThan(moon.v);
    expect(earth.y).toBeLessThan(moon.y);
  });
});

describe('extractKinematicsDataPoint', () => {
  it('formats state into a flat data point', () => {
    const state: KinematicsState = { y: 95.432, v: 4.876, time: 0.5, hasHitGround: false };
    const point = extractKinematicsDataPoint(state);
    expect(point.time).toBe(0.5);
    expect(point.height).toBe(95.43);
    expect(point.velocity).toBe(4.88);
  });
});
