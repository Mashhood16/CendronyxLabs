import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, GraduationCap, Award, ArrowRight, RefreshCw } from 'lucide-react';
import { useTheme } from '../store';

export interface AssessmentQuestion {
  id: string;
  question: string;
  answer: number;
  tolerance: number;
  hint: string;
  unit: string;
}

interface AssessmentPanelProps {
  title?: string;
  questions: AssessmentQuestion[];
  onScoreUpdate?: (score: number, total: number) => void;
}

export default function AssessmentPanel({
  title = 'Assessment',
  questions,
  variables,
  onScoreUpdate,
}: AssessmentPanelProps) {
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, 'idle' | 'correct' | 'incorrect'>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});

  const handleCheck = (q: AssessmentQuestion) => {
    const userAnswer = parseFloat(answers[q.id] || '');
    if (isNaN(userAnswer)) {
      setStatuses(prev => ({ ...prev, [q.id]: 'incorrect' }));
      return;
    }
    const status = Math.abs(userAnswer - q.answer) <= q.tolerance ? 'correct' : 'incorrect';

    const newStatuses = { ...statuses, [q.id]: status };
    setStatuses(newStatuses);

    // Calculate score
    const total = questions.length;
    const correct = Object.values(newStatuses).filter(s => s === 'correct').length;
    onScoreUpdate?.(correct, total);
  };

  const handleClear = (qId: string) => {
    setAnswers(prev => ({ ...prev, [qId]: '' }));
    setStatuses(prev => ({ ...prev, [qId]: 'idle' }));
    setShowHints(prev => ({ ...prev, [qId]: false }));
  };

  const handleCheckAll = () => {
    questions.forEach(q => handleCheck(q));
  };

  const handleClearAll = () => {
    questions.forEach(q => handleClear(q.id));
  };

  const correctCount = Object.values(statuses).filter(s => s === 'correct').length;
  const incorrectCount = Object.values(statuses).filter(s => s === 'incorrect').length;
  const totalAnswered = correctCount + incorrectCount;

  return (
    <div className={`rounded-xl border p-4 space-y-4 ${isDark ? 'bg-[#121215] border-slate-800' : 'bg-white border-slate-200'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h3 className={`text-sm font-extrabold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {totalAnswered > 0 && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              correctCount === questions.length
                ? 'bg-emerald-500/20 text-emerald-400'
                : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
            }`}>
              {correctCount}/{questions.length}
            </span>
          )}
          {totalAnswered > 0 && (
            <button
              onClick={handleClearAll}
              className={`p-1 rounded transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
              title="Clear all answers"
            >
              <RefreshCw size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {questions.map((q, idx) => {
          const status = statuses[q.id] || 'idle';
          const showHint = showHints[q.id] || false;
          const unit = q.unit || '';

          return (
            <div
              key={q.id}
              className={`p-3 rounded-xl border transition-all ${
                status === 'correct'
                  ? isDark ? 'bg-emerald-950/20 border-emerald-800/40' : 'bg-emerald-50 border-emerald-200'
                  : status === 'incorrect'
                    ? isDark ? 'bg-red-950/20 border-red-800/40' : 'bg-red-50 border-red-200'
                    : isDark ? 'bg-[#0a0a0c] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 ${
                  isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-500'
                }`}>
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    {q.question}
                  </p>

                  {/* Answer input */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={answers[q.id] || ''}
                        onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleCheck(q); }}
                        placeholder="Enter your answer..."
                        className={`w-full px-3 py-1.5 rounded-lg border text-xs font-mono outline-none transition-all ${
                          isDark
                            ? 'bg-[#0a0a0c] border-slate-700 text-white placeholder:text-slate-600'
                            : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-300'
                        } ${status !== 'idle' ? 'opacity-60' : ''}`}
                        disabled={status !== 'idle'}
                      />
                      {unit && (
                        <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {unit}
                        </span>
                      )}
                    </div>

                    {status === 'idle' ? (
                      <>
                        <button
                          onClick={() => handleCheck(q)}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold transition-all"
                        >
                          <CheckCircle size={12} />
                        </button>
                        <button
                          onClick={() => setShowHints(prev => ({ ...prev, [q.id]: !showHint }))}
                          className={`p-1.5 rounded-lg transition-all ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}
                          title="Show hint"
                        >
                          <Lightbulb size={12} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleClear(q.id)}
                        className={`p-1.5 rounded-lg text-[10px] font-bold transition-all ${
                          isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                        }`}
                        title="Try again"
                      >
                        <RefreshCw size={12} />
                      </button>
                    )}
                  </div>

                  {/* Status feedback */}
                  {status === 'correct' && (
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-emerald-500">
                      <CheckCircle size={10} />
                      Correct! ✓
                    </div>
                  )}
                  {status === 'incorrect' && (
                    <div className="mt-1.5 text-[10px] font-semibold text-rose-500">
                      Incorrect. Try using the hint below!
                    </div>
                  )}

                  {/* Hint */}
                  {showHint && status !== 'correct' && (
                    <div className={`mt-1.5 p-2 rounded-lg border text-[10px] ${
                      isDark ? 'bg-amber-950/20 border-amber-800/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}>
                      <span className="flex items-center gap-1">
                        <Lightbulb size={10} /> <strong>Hint:</strong> {q.hint}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Score bar */}
      {totalAnswered > 0 && (
        <div className={`pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <Award size={14} className={correctCount === questions.length ? 'text-amber-400' : 'text-slate-400'} />
              Score
            </span>
            <span className={`text-xs font-bold ${
              correctCount === questions.length
                ? 'text-emerald-400'
                : isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {Math.round((correctCount / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${(correctCount / questions.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Check all button */}
      {totalAnswered < questions.length && (
        <button
          onClick={handleCheckAll}
          className="w-full py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center justify-center gap-1.5"
        >
          <CheckCircle size={13} /> Check All Answers
        </button>
      )}
    </div>
  );
}
