import { useTranslate } from '../i18n';
import { useState } from 'react';
import { Lightbulb, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { PredictionChallenge as PredictionChallengeType } from '../utils/labScaffolding';

interface PredictionChallengeProps {
  challenge: PredictionChallengeType;
  onComplete: (correct: boolean) => void;
  showResult?: boolean;
}

export default function PredictionChallenge({
  challenge,
  onComplete,
  showResult = true,
}: PredictionChallengeProps) {
  const { t } = useTranslate();
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    onComplete(idx === challenge.correctOption);
  };

  const isCorrect = selected === challenge.correctOption;

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
          {t("Prediction Challenge")}
        </span>
      </div>

      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
        {challenge.question}
      </p>

      <div className="space-y-2">
        {challenge.options.map((opt, idx) => {
          const isSelected = selected === idx;
          let classes =
            'w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all border-2 ';

          if (!answered) {
            classes +=
              'border-slate-200 dark:border-[#2a2a2a] hover:border-amber-400 bg-white dark:bg-[#121212] text-slate-700 dark:text-slate-300 cursor-pointer';
          } else if (idx === challenge.correctOption) {
            classes +=
              'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
          } else if (isSelected) {
            classes +=
              'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300';
          } else {
            classes +=
              'border-slate-100 dark:border-[#1c1b1b] opacity-50 text-slate-400';
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={answered}
              className={classes}
            >
              <span className="flex items-center justify-between">
                {opt}
                {answered && idx === challenge.correctOption && (
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                )}
                {answered && isSelected && idx !== challenge.correctOption && (
                  <XCircle className="w-4 h-4 shrink-0 text-red-500" />
                )}
              </span>
            </button>
          );
        })}
      </div>

      {answered && showResult && (
        <div
          className={`mt-3 p-3 rounded-lg text-sm ${
            isCorrect
              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200'
              : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200'
          }`}
        >
          <div className="flex items-start gap-2">
            {isCorrect ? (
              <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
            )}
            <div>
              <p className="font-semibold mb-1">
                {isCorrect ? 'Correct prediction!' : 'Not quite...'}
              </p>
              <p className="text-xs opacity-80">{challenge.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
