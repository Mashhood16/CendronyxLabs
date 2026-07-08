import { useMemo } from 'react';
import type { LabRecord } from '../services/dbService';

export interface SubjectStats {
  subject: string;
  total: number;
  passed: number;
  averageScore: number;
  totalTimeMinutes: number;
}

export interface ProgressStats {
  totalLabs: number;
  averageScore: number;
  passRate: number;
  totalTimeMinutes: number;
  currentStreak: number;
  subjectBreakdown: SubjectStats[];
  recentPerformance: { index: number; score: number; label: string }[];
  bestSubject: SubjectStats | null;
  weakestSubject: SubjectStats | null;
}

export function useProgressStats(history: LabRecord[]): ProgressStats {
  return useMemo(() => {
    const totalLabs = history.length;

    if (totalLabs === 0) {
      return {
        totalLabs: 0,
        averageScore: 0,
        passRate: 0,
        totalTimeMinutes: 0,
        currentStreak: 0,
        subjectBreakdown: [],
        recentPerformance: [],
        bestSubject: null,
        weakestSubject: null,
      };
    }

    // Compute aggregate score stats
    const scorePercentages = history.map((r) =>
      r.maxScore > 0 ? (r.score / r.maxScore) * 100 : 0
    );
    const averageScore = Math.round(
      scorePercentages.reduce((a, b) => a + b, 0) / totalLabs
    );
    const passedCount = scorePercentages.filter((s) => s >= 80).length;
    const passRate = Math.round((passedCount / totalLabs) * 100);

    // Total time
    const totalTimeSeconds = history.reduce(
      (sum, r) => sum + r.timeSpentSeconds,
      0
    );
    const totalTimeMinutes = Math.round(totalTimeSeconds / 60);

    // Current streak (consecutive days with at least one completion)
    const currentStreak = computeStreak(history);

    // Subject breakdown
    const subjectMap = new Map<string, LabRecord[]>();
    for (const record of history) {
      const subj = record.subject.toLowerCase();
      if (!subjectMap.has(subj)) subjectMap.set(subj, []);
      subjectMap.get(subj)!.push(record);
    }

    const subjectBreakdown: SubjectStats[] = [];
    for (const [subject, records] of subjectMap) {
      const total = records.length;
      const avgScore = Math.round(
        records.reduce((sum, r) => {
          return sum + (r.maxScore > 0 ? (r.score / r.maxScore) * 100 : 0);
        }, 0) / total
      );
      const passed = records.filter(
        (r) => r.maxScore > 0 && r.score / r.maxScore >= 0.8
      ).length;
      const totalTimeMinutes = Math.round(
        records.reduce((s, r) => s + r.timeSpentSeconds, 0) / 60
      );
      subjectBreakdown.push({
        subject,
        total,
        passed,
        averageScore: avgScore,
        totalTimeMinutes,
      });
    }
    subjectBreakdown.sort((a, b) => b.total - a.total);

    // Best and weakest subjects (by average score, only if at least 1 lab)
    const scored = subjectBreakdown.filter((s) => s.total > 0);
    const bestSubject = scored.length > 0 ? scored.reduce((a, b) => (a.averageScore >= b.averageScore ? a : b)) : null;
    const weakestSubject = scored.length > 0 ? scored.reduce((a, b) => (a.averageScore <= b.averageScore ? a : b)) : null;

    // Recent performance (last 10 scores for trend)
    const recentPerformance = history
      .slice()
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10)
      .reverse()
      .map((r, i) => ({
        index: i,
        score: r.maxScore > 0 ? Math.round((r.score / r.maxScore) * 100) : 0,
        label: r.title.length > 18 ? r.title.slice(0, 16) + '…' : r.title,
      }));

    return {
      totalLabs,
      averageScore,
      passRate,
      totalTimeMinutes,
      currentStreak,
      subjectBreakdown,
      recentPerformance,
      bestSubject,
      weakestSubject,
    };
  }, [history]);
}

function computeStreak(history: LabRecord[]): number {
  if (history.length === 0) return 0;

  // Get unique days with activity, sorted descending
  const daySet = new Set<string>();
  for (const r of history) {
    const d = new Date(r.timestamp);
    daySet.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  }

  const days = Array.from(daySet)
    .map((s) => {
      const [y, m, d] = s.split('-').map(Number);
      return new Date(y, m, d);
    })
    .sort((a, b) => b.getTime() - a.getTime());

  if (days.length === 0) return 0;

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const diffMs = days[i - 1].getTime() - days[i].getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
