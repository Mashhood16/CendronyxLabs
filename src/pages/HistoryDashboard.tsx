import { useEffect, useState, useCallback } from 'react';
import { useHistory } from '../store';
import { useTranslate } from '../i18n';
import { useProgressStats } from '../hooks/useProgressStats';
import { historyDB, initDB } from '../services/dbService';
import { getAnonymousId } from '../utils/sessionId';
import { useAuth } from '../store';
import Layout from '../components/Layout';
import {
  Clock,
  Trophy,
  Timer,
  Beaker,
  BookOpen,
  TrendingUp,
  Zap,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Flame,
} from 'lucide-react';

const SUBJECT_COLORS: Record<string, string> = {
  physics: 'from-blue-500 to-indigo-600',
  chemistry: 'from-emerald-500 to-teal-600',
  biology: 'from-rose-500 to-pink-600',
  math: 'from-violet-500 to-indigo-600',
  computer: 'from-sky-500 to-cyan-600',
  science: 'from-amber-500 to-orange-600',
  english: 'from-fuchsia-500 to-pink-600',
};

const SUBJECT_BG: Record<string, string> = {
  physics: 'bg-blue-500',
  chemistry: 'bg-emerald-500',
  biology: 'bg-rose-500',
  math: 'bg-violet-500',
  computer: 'bg-sky-500',
  science: 'bg-amber-500',
  english: 'bg-fuchsia-500',
};

const SUBJECT_LABELS: Record<string, string> = {
  physics: 'Physics',
  chemistry: 'Chemistry',
  biology: 'Biology',
  math: 'Math',
  computer: 'Computer',
  science: 'Science',
  english: 'English',
};

export default function HistoryDashboard() {
  const { history, refreshHistory } = useHistory();
  const { t } = useTranslate();
  const { user } = useAuth();
  const stats = useProgressStats(history);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [runningDiagnostic, setRunningDiagnostic] = useState(false);

  // Always fetch fresh history from IndexedDB when this page mounts
  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const runDiagnostic = useCallback(async () => {
    setRunningDiagnostic(true);
    setDebugInfo(null);
    const lines: string[] = [];
    try {
      lines.push(`User authed: ${!!user}`);
      lines.push(`User ID: ${user?.id || getAnonymousId()}`);
      lines.push(`History in state: ${history.length} records`);

      // Test IndexedDB directly
      const db = await initDB();
      lines.push('IndexedDB: connected');
      
      const storeNames = Array.from(db.objectStoreNames);
      lines.push(`Stores: ${storeNames.join(', ') || 'none'}`);
      
      const userId = user?.id || getAnonymousId();
      lines.push(`Querying for userId: ${userId}`);
      
      const directRecords = await historyDB.getRecords(userId);
      lines.push(`Direct DB query: ${directRecords.length} records`);
      
      if (directRecords.length > 0) {
        lines.push(`Latest: ${directRecords[0].title} (${directRecords[0].subject})`);
      }

      // Also check ALL records in history store (ignoring user filter)
      const allHistory = await db.getAll('history');
      lines.push(`Total in history store: ${allHistory.length} records`);
      if (allHistory.length > 0) {
        const userIds = [...new Set(allHistory.map(r => r.userId))];
        lines.push(`User IDs in store: ${userIds.join(', ')}`);
      }

      // If we have history records but they weren't loaded, refresh
      if (allHistory.length > 0 && directRecords.length === 0) {
        lines.push('WARNING: Records exist but userId mismatch!');
      }
    } catch (err) {
      lines.push(`ERROR: ${err instanceof Error ? err.message : String(err)}`);
    }
    setDebugInfo(lines.join('\n'));
    setRunningDiagnostic(false);
  }, [user, history.length]);

  const scoreColor =
    stats.averageScore >= 80
      ? 'text-emerald-500'
      : stats.averageScore >= 60
        ? 'text-amber-500'
        : 'text-rose-500';

  const passColor =
    stats.passRate >= 80
      ? 'text-emerald-500'
      : stats.passRate >= 60
        ? 'text-amber-500'
        : 'text-rose-500';

  return (
    <Layout>
      <div className="flex flex-col min-h-[70vh] bg-white rounded-3xl border border-slate-200 shadow-sm mt-4 md:mt-8 p-4 sm:p-8 md:p-12 dark:bg-[#000000]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 md:mb-10 border-b border-slate-100 pb-6 dark:border-zinc-800">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
            <BarChart3 className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 font-outfit tracking-tight dark:text-white">
              {t('history.title') || 'My Progress'}
            </h2>
            <p className="text-slate-500 text-sm md:text-base dark:text-zinc-400">
              {t('history.subtitle') || 'Track your lab performance and learning journey'}
            </p>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4 dark:from-zinc-800 dark:to-zinc-700">
              <Beaker className="w-10 h-10 text-slate-300 dark:text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2 dark:text-zinc-300">
              {t('history.empty_title') || 'No labs completed yet'}
            </h3>
            <p className="text-slate-500 max-w-sm text-center dark:text-zinc-400">
              {t('history.empty_desc') ||
                'Complete your first interactive lab to see your progress analytics here.'}
            </p>

            {/* Diagnostic button */}
            <div className="mt-8">
              <button
                onClick={runDiagnostic}
                disabled={runningDiagnostic}
                className="px-5 py-2.5 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              >
                {runningDiagnostic ? 'Running diagnostic...' : 'Run Diagnostic'}
              </button>
              {debugInfo && (
                <pre className="mt-4 p-4 bg-slate-900 text-green-300 text-xs rounded-xl max-w-md mx-auto text-left whitespace-pre-wrap font-mono leading-relaxed">
                  {debugInfo}
                </pre>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* === Stats Cards Row === */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Total Labs */}
              <div className="bg-indigo-50 rounded-2xl p-4 md:p-5 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider dark:text-indigo-400">
                    {t('Completed') || 'Completed'}
                  </span>
                </div>
                <span className="text-3xl md:text-4xl font-bold text-indigo-700 dark:text-indigo-300">
                  {stats.totalLabs}
                </span>
                <span className="text-xs text-indigo-500 ml-1 dark:text-indigo-400">
                  labs
                </span>
              </div>

              {/* Average Score */}
              <div className="bg-emerald-50 rounded-2xl p-4 md:p-5 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider dark:text-emerald-400">
                    {t('Avg Score') || 'Avg Score'}
                  </span>
                </div>
                <span className={`text-3xl md:text-4xl font-bold ${scoreColor}`}>
                  {stats.averageScore}%
                </span>
              </div>

              {/* Pass Rate */}
              <div className="bg-amber-50 rounded-2xl p-4 md:p-5 border border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider dark:text-amber-400">
                    {t('Pass Rate') || 'Pass Rate'}
                  </span>
                </div>
                <span className={`text-3xl md:text-4xl font-bold ${passColor}`}>
                  {stats.passRate}%
                </span>
              </div>

              {/* Streak */}
              <div className="bg-rose-50 rounded-2xl p-4 md:p-5 border border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider dark:text-rose-400">
                    {t('Streak') || 'Streak'}
                  </span>
                </div>
                <span className="text-3xl md:text-4xl font-bold text-rose-600 dark:text-rose-300">
                  {stats.currentStreak}
                </span>
                <span className="text-xs text-rose-500 ml-1 dark:text-rose-400">
                  {t('days') || 'days'}
                </span>
              </div>
            </div>

            {/* === Subject Breakdown + Performance Trend === */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subject Breakdown */}
              <div className="bg-slate-50 rounded-2xl p-5 md:p-6 border border-slate-200 dark:bg-zinc-900/50 dark:border-zinc-800">
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2 dark:text-zinc-200">
                  <BarChart3 className="w-4 h-4 text-indigo-500" />
                  {t('Subject Breakdown') || 'Subject Breakdown'}
                </h3>
                <div className="space-y-3">
                  {stats.subjectBreakdown.length > 0 ? (
                    stats.subjectBreakdown.map((s) => {
                      const pct =
                        stats.totalLabs > 0
                          ? Math.round((s.total / stats.totalLabs) * 100)
                          : 0;
                      const subjectLabel =
                        SUBJECT_LABELS[s.subject] ||
                        s.subject.charAt(0).toUpperCase() + s.subject.slice(1);
                      const barColor =
                        SUBJECT_BG[s.subject] || 'bg-indigo-500';
                      return (
                        <div key={s.subject}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2.5 h-2.5 rounded-full ${barColor}`}
                              />
                              <span className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                                {subjectLabel}
                              </span>
                              <span className="text-xs text-slate-400 dark:text-zinc-500">
                                {s.total} labs
                              </span>
                            </div>
                            <span className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                              {s.averageScore}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 dark:bg-zinc-700">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-0.5">
                            <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                              {s.passed}/{s.total} passed
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                              {s.totalTimeMinutes}m
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-slate-400 dark:text-zinc-500">
                      No data yet
                    </p>
                  )}
                </div>

                {/* Best & Weakest */}
                {(stats.bestSubject || stats.weakestSubject) && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-700 grid grid-cols-2 gap-4">
                    {stats.bestSubject && (
                      <div>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider dark:text-emerald-400">
                          Best
                        </span>
                        <p className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                          {SUBJECT_LABELS[stats.bestSubject.subject] ||
                            stats.bestSubject.subject.charAt(0).toUpperCase() +
                              stats.bestSubject.subject.slice(1)}
                          <span className="text-emerald-500 ml-1">
                            {stats.bestSubject.averageScore}%
                          </span>
                        </p>
                      </div>
                    )}
                    {stats.weakestSubject && (
                      <div>
                        <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider dark:text-rose-400">
                          Needs Work
                        </span>
                        <p className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                          {SUBJECT_LABELS[stats.weakestSubject.subject] ||
                            stats.weakestSubject.subject.charAt(0).toUpperCase() +
                              stats.weakestSubject.subject.slice(1)}
                          <span className="text-rose-500 ml-1">
                            {stats.weakestSubject.averageScore}%
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Performance Trend Chart */}
              <div className="bg-slate-50 rounded-2xl p-5 md:p-6 border border-slate-200 dark:bg-zinc-900/50 dark:border-zinc-800">
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2 dark:text-zinc-200">
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                  {t('Performance Trend') || 'Performance Trend'}
                </h3>
                {stats.recentPerformance.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {/* Bar chart */}
                    <div className="flex items-end gap-1.5 h-32 md:h-40">
                      {stats.recentPerformance.map((p) => {
                        const barColor =
                          p.score >= 80
                            ? 'bg-emerald-400'
                            : p.score >= 60
                              ? 'bg-amber-400'
                              : 'bg-rose-400';
                        return (
                          <div
                            key={p.index}
                            className="flex-1 flex flex-col items-center gap-1"
                          >
                            <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400">
                              {p.score}%
                            </span>
                            <div className="w-full flex justify-center">
                              <div
                                className={`w-full max-w-[32px] rounded-t-md transition-all duration-300 ${barColor}`}
                                style={{
                                  height: `${Math.max(p.score, 4)}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Labels */}
                    <div className="flex gap-1.5">
                      {stats.recentPerformance.map((p) => (
                        <div
                          key={p.index}
                          className="flex-1 text-center"
                        >
                          <span className="text-[8px] text-slate-400 dark:text-zinc-500 leading-tight block truncate">
                            {p.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 dark:text-zinc-500">
                      Last {stats.recentPerformance.length} labs (newest →
                      oldest)
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-sm text-slate-400 dark:text-zinc-500">
                    Complete labs to see your trend
                  </div>
                )}

                {/* Quick stats row */}
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-700 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-zinc-500">
                        Total Time
                      </span>
                      <p className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                        {stats.totalTimeMinutes}m
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-zinc-500">
                        Avg per Lab
                      </span>
                      <p className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                        {stats.totalLabs > 0
                          ? Math.round(stats.totalTimeMinutes / stats.totalLabs)
                          : 0}
                        m
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* === Recent Activity + Full History Toggle === */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden dark:bg-zinc-900/50 dark:border-zinc-800">
              {/* Section header */}
              <div className="px-5 md:px-6 pt-5 md:pt-6 pb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 dark:text-zinc-200">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  {showFullHistory
                    ? t('Full History') || 'Full History'
                    : t('Recent Activity') || 'Recent Activity'}
                </h3>
                <button
                  onClick={() => setShowFullHistory(!showFullHistory)}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  {showFullHistory
                    ? t('Show Less') || 'Show Less'
                    : t('Show All') || 'Show All'}
                  {showFullHistory ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Cards grid */}
              <div className="px-5 md:px-6 pb-5 md:pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(showFullHistory
                    ? history
                    : history.slice(0, 6)
                  ).map((record, i) => {
                    const subjectGradient =
                      SUBJECT_COLORS[record.subject.toLowerCase()] ||
                      'from-slate-500 to-slate-600';
                    const passed =
                      record.maxScore > 0
                        ? record.score >= record.maxScore * 0.8
                        : false;
                    return (
                      <div
                        key={i}
                        className="bg-white border-2 border-slate-100 rounded-xl p-4 hover:border-slate-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group dark:bg-black dark:border-zinc-800 dark:hover:border-zinc-700"
                      >
                        {/* Subject badge + date */}
                        <div className="flex justify-between items-start mb-3">
                          <span
                            className={`bg-gradient-to-r ${subjectGradient} text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm`}
                          >
                            {record.subject}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                            {new Date(record.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 mb-3 line-clamp-2 leading-tight font-outfit dark:text-zinc-200">
                          {record.title}
                        </h3>

                        {record.experimentData &&
                          Object.keys(record.experimentData).length > 0 && (
                            <div className="mb-3 bg-slate-50 rounded-xl p-2.5 border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800">
                              <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 dark:text-zinc-500">
                                Data
                              </h4>
                              <div className="grid grid-cols-2 gap-1.5">
                                {Object.entries(record.experimentData).map(
                                  ([key, value]) => (
                                    <div key={key} className="flex flex-col">
                                      <span className="text-[9px] text-slate-400 font-medium truncate dark:text-zinc-500">
                                        {key}
                                      </span>
                                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                                        {value}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between dark:border-zinc-800">
                          <div className="flex items-center gap-2">
                            <Trophy
                              className={`w-4 h-4 ${passed ? 'text-emerald-500' : 'text-amber-500'}`}
                            />
                            <div className="flex flex-col">
                              <span
                                className={`text-base font-bold font-outfit ${passed ? 'text-emerald-500' : 'text-amber-500'}`}
                              >
                                {record.score}
                                <span className="text-xs text-slate-400 font-medium dark:text-zinc-500">
                                  {' '}
                                  / {record.maxScore}
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Timer className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">
                              {Math.floor(record.timeSpentSeconds / 60)}m{' '}
                              {record.timeSpentSeconds % 60}s
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!showFullHistory && history.length > 6 && (
                  <button
                    onClick={() => setShowFullHistory(true)}
                    className="w-full mt-4 py-3 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
                  >
                    {t('Show all') || 'Show all'}{' '}
                    {history.length - 6} {t('more labs') || 'more labs'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
