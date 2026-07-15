import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { LabRecord } from '../../services/dbService';
import { useProgressStats } from '../../hooks/useProgressStats';

describe('useProgressStats', () => {
  const makeRecord = (overrides: Partial<LabRecord>): LabRecord => ({
    labId: 'test',
    title: 'Test Lab',
    subject: 'physics',
    score: 80,
    maxScore: 100,
    timeSpentSeconds: 600,
    timestamp: Date.now(),
    ...overrides,
  });

  it('returns zeros for empty history', () => {
    const { result } = renderHook(() => useProgressStats([]));
    expect(result.current.totalLabs).toBe(0);
    expect(result.current.averageScore).toBe(0);
    expect(result.current.passRate).toBe(0);
    expect(result.current.totalTimeMinutes).toBe(0);
    expect(result.current.currentStreak).toBe(0);
    expect(result.current.subjectBreakdown).toEqual([]);
    expect(result.current.bestSubject).toBeNull();
    expect(result.current.weakestSubject).toBeNull();
  });

  it('computes correct aggregate stats for single record', () => {
    const { result } = renderHook(() => useProgressStats([makeRecord({})]));
    expect(result.current.totalLabs).toBe(1);
    expect(result.current.averageScore).toBe(80);
    expect(result.current.passRate).toBe(100); // 80 >= 80
  });

  it('computes pass/fail correctly', () => {
    const records = [
      makeRecord({ score: 90, maxScore: 100 }),
      makeRecord({ score: 70, maxScore: 100 }),
      makeRecord({ score: 85, maxScore: 100 }),
      makeRecord({ score: 50, maxScore: 100 }),
    ];
    const { result } = renderHook(() => useProgressStats(records));
    expect(result.current.totalLabs).toBe(4);
    expect(result.current.averageScore).toBe(74); // (90+70+85+50)/4
    expect(result.current.passRate).toBe(50); // 2 out of 4 passed (90, 85)
  });

  it('computes total time correctly', () => {
    const records = [
      makeRecord({ timeSpentSeconds: 600 }),
      makeRecord({ timeSpentSeconds: 1200 }),
    ];
    const { result } = renderHook(() => useProgressStats(records));
    expect(result.current.totalTimeMinutes).toBe(30); // 1800s / 60
  });

  it('groups by subject', () => {
    const records = [
      makeRecord({ subject: 'physics', score: 90, maxScore: 100 }),
      makeRecord({ subject: 'physics', score: 80, maxScore: 100 }),
      makeRecord({ subject: 'chemistry', score: 70, maxScore: 100 }),
    ];
    const { result } = renderHook(() => useProgressStats(records));
    expect(result.current.subjectBreakdown).toHaveLength(2);

    const physics = result.current.subjectBreakdown.find(s => s.subject === 'physics')!;
    expect(physics.total).toBe(2);
    expect(physics.averageScore).toBe(85);
    expect(physics.passed).toBe(2);

    const chemistry = result.current.subjectBreakdown.find(s => s.subject === 'chemistry')!;
    expect(chemistry.total).toBe(1);
    expect(chemistry.averageScore).toBe(70);
  });

  it('identifies best and weakest subjects', () => {
    const records = [
      makeRecord({ subject: 'physics', score: 95, maxScore: 100 }),
      makeRecord({ subject: 'chemistry', score: 60, maxScore: 100 }),
    ];
    const { result } = renderHook(() => useProgressStats(records));
    expect(result.current.bestSubject?.subject).toBe('physics');
    expect(result.current.weakestSubject?.subject).toBe('chemistry');
  });

  it('generates recent performance for last 10 records', () => {
    const records = Array.from({ length: 15 }, (_, i) =>
      makeRecord({ score: 80 + i, maxScore: 100 })
    );
    const { result } = renderHook(() => useProgressStats(records));
    expect(result.current.recentPerformance).toHaveLength(10);
    // All scores are >= 80 since we started at 80
    expect(result.current.recentPerformance[0].score).toBeGreaterThanOrEqual(80);
  });
});
