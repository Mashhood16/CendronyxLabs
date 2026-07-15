import { useState, useCallback } from 'react';
import { CheckCircle, XCircle, Lightbulb, ChevronRight, Trophy, RefreshCw, ArrowRight } from 'lucide-react';
import MathFormula from './MathFormula';
import EquationBuilder from './EquationBuilder';
import { checkFormulaMatch, getHintForAnswer } from '../utils/formulaValidation';
import { useTranslate } from '../i18n';
import { theme } from '../utils/labTheme';

export interface QuizStep {
  label: string;
  formula: string;
  detail: string;
}

interface DerivationQuizProps {
  steps: QuizStep[];
  accentGradient: string;
  accentColor: string;
}

export default function DerivationQuiz({
  steps,
  accentGradient,
  accentColor,
}: DerivationQuizProps) {
  const { t } = useTranslate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(steps.length).fill(''));
  const [stepStates, setStepStates] = useState<('idle' | 'correct' | 'incorrect' | 'skipped')[]>(
    Array(steps.length).fill('idle')
  );
  const [hint, setHint] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<number[]>(Array(steps.length).fill(0));
  const [completed, setCompleted] = useState(false);

  const currentAnswer = answers[currentStep];
  const currentState = stepStates[currentStep];

  const handleAnswerChange = useCallback(
    (val: string) => {
      const newAnswers = [...answers];
      newAnswers[currentStep] = val;
      setAnswers(newAnswers);
      if (stepStates[currentStep] !== 'correct') {
        const newStates = [...stepStates];
        newStates[currentStep] = 'idle';
        setStepStates(newStates);
      }
      setHint(null);
    },
    [currentStep, answers, stepStates]
  );

  const handleFinish = useCallback(() => {
    setCompleted(true);
  }, []);

  const checkAllDone = useCallback(
    (newStates: ('idle' | 'correct' | 'incorrect' | 'skipped')[]) => {
      return newStates.filter((s) => s === 'correct' || s === 'skipped').length === steps.length;
    },
    [steps.length]
  );

  const handleSubmit = useCallback(() => {
    if (!currentAnswer.trim()) return;
    const expected = steps[currentStep].formula;
    const score = checkFormulaMatch(currentAnswer, expected);
    const newAttempts = [...attempts];
    newAttempts[currentStep]++;
    setAttempts(newAttempts);

    if (score >= 0.7) {
      const newStates = [...stepStates];
      newStates[currentStep] = 'correct';
      setStepStates(newStates);
      setHint(null);

      // Check if all steps are now completed
      if (newStates.filter((s) => s === 'correct').length === steps.length) {
        handleFinish();
      }
    } else {
      const newStates = [...stepStates];
      newStates[currentStep] = 'incorrect';
      setStepStates(newStates);
      setHint(getHintForAnswer(currentAnswer, expected));
    }
  }, [currentAnswer, steps, currentStep, attempts, stepStates, handleFinish]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setHint(null);
    }
  }, [currentStep, steps.length]);

  const handleSkip = useCallback(() => {
    const newStates = [...stepStates];
    newStates[currentStep] = 'skipped';
    setStepStates(newStates);

    const newAnswers = [...answers];
    newAnswers[currentStep] = steps[currentStep].formula;
    setAnswers(newAnswers);
    setHint(null);

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else if (checkAllDone(newStates)) {
      handleFinish();
    }
  }, [currentStep, stepStates, answers, steps, checkAllDone, handleFinish]);

  const handleRestart = useCallback(() => {
    setCurrentStep(0);
    setAnswers(Array(steps.length).fill(''));
    setStepStates(Array(steps.length).fill('idle'));
    setHint(null);
    setAttempts(Array(steps.length).fill(0));
    setCompleted(false);
  }, [steps.length]);

  const progressPercent = (stepStates.filter((s) => s === 'correct').length / steps.length) * 100;
  const correctCount = stepStates.filter((s) => s === 'correct').length;
  const isLastStep = currentStep === steps.length - 1;

  // Completion screen
  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-xl mb-4 animate-bounce">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
          {t('lab.quiz_complete_title') || 'Derivation Complete! 🎉'}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {t('lab.quiz_complete_desc') || `You successfully completed ${correctCount}/${steps.length} steps!`}
        </p>
        <div className="w-full max-w-xs bg-slate-100 dark:bg-[#1c1b1b] rounded-full h-3 mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Summary of all steps */}
        <div className="w-full space-y-2 max-w-md">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
                stepStates[idx] === 'correct'
                  ? `${theme.accent.emerald.stepBg} text-emerald-700 dark:text-emerald-300`
                  : 'bg-slate-50 dark:bg-[#1c1b1b] text-slate-500 dark:text-slate-400'
              }`}
            >
              {stepStates[idx] === 'correct' ? (
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <span className="w-4 h-4 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                  {idx + 1}
                </span>
              )}
              <span className="truncate">{step.label}</span>
              <span className="ml-auto font-mono text-[10px] opacity-70">{step.formula}</span>
            </div>
          ))}
        </div>
        <button
          onClick={handleRestart}
          className={`mt-6 px-6 py-2.5 bg-gradient-to-br ${accentGradient} hover:opacity-90 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2 shadow-md`}
        >
          <RefreshCw className="w-4 h-4" />
          {t('lab.quiz_retry') || 'Try Again'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-slate-100 dark:bg-[#1c1b1b] rounded-full h-2 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${accentGradient} rounded-full transition-all duration-500`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
          {t('lab.quiz_step_of') || `Step ${Math.min(currentStep + 1, steps.length)} of ${steps.length}`}
        </span>
      </div>

      {/* Current step */}
      <div className="relative">
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${accentGradient} text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0 ${
                currentState === 'correct'
                  ? 'ring-2 ring-emerald-400 ring-offset-2 dark:ring-offset-[#121212]'
                  : ''
              } ${
                currentState === 'incorrect'
                  ? 'ring-2 ring-red-400 ring-offset-2 dark:ring-offset-[#121212] animate-shake'
                  : ''
              }`}
            >
              {currentState === 'correct' ? <CheckCircle className="w-4 h-4" /> : currentStep + 1}
            </div>
            {currentStep < steps.length - 1 && !completed && (
              <div className="w-0.5 h-full min-h-[16px] bg-gradient-to-b from-current to-current opacity-20" />
            )}
          </div>

          <div className="flex-1 pb-2">
            {/* Step label */}
            <div
              className={`rounded-lg p-3 border mb-2 ${
                currentState === 'correct'
                  ? `${theme.accent.emerald.stepBg} ${theme.accent.emerald.stepBorder}`
                  : currentState === 'incorrect'
                  ? `${theme.accent.red.stepBg} ${theme.accent.red.stepBorder}`
                  : `${theme.accent.blue.stepBg} ${theme.accent.blue.stepBorder}`
              }`}
            >
              <p
                className={`font-bold text-sm ${
                  currentState === 'correct'
                    ? theme.accent.emerald.stepText
                    : currentState === 'incorrect'
                    ? theme.accent.red.stepText
                    : theme.accent.blue.stepText
                }`}
              >
                {steps[currentStep].label}
              </p>
            </div>

            {/* Detail text */}
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1 mb-3">
              {steps[currentStep].detail}
            </p>

            {/* Answer area */}
            {currentState !== 'correct' && !completed ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {t('lab.quiz_enter_formula') || 'Enter the formula for this step:'}
                </p>
                <EquationBuilder
                  value={currentAnswer}
                  onChange={handleAnswerChange}
                  placeholder={t('lab.quiz_formula_placeholder') || 'Build or type the formula...'}
                  accentColor={accentColor}
                />

                {/* Action buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleSubmit}
                    disabled={!currentAnswer.trim()}
                    className={`flex-1 px-4 py-2.5 bg-gradient-to-br ${accentGradient} hover:opacity-90 disabled:opacity-40 text-white text-sm font-bold rounded-lg transition-all shadow-md`}
                  >
                    {t('lab.check') || 'Check'}
                  </button>
                  <button
                    onClick={handleSkip}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg transition-colors border border-slate-200 dark:border-[#2a2a2a]"
                  >
                    {t('lab.quiz_skip') || 'Skip'}
                  </button>
                </div>

                {/* Hint */}
                {hint && (
                  <div
                    className={`${theme.accent.amber.stepBg} rounded-lg p-3 border ${theme.accent.amber.stepBorder} flex items-start gap-2`}
                  >
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 dark:text-amber-300">{hint}</p>
                  </div>
                )}

                {/* Wrong feedback */}
                {currentState === 'incorrect' && !hint && (
                  <div
                    className={`${theme.accent.red.stepBg} rounded-lg p-3 border ${theme.accent.red.stepBorder} flex items-center gap-2`}
                  >
                    <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <p className="text-xs text-red-700 dark:text-red-300">
                      {t('lab.quiz_try_again') ||
                        'Not quite right. Try again or click Skip to see the answer.'}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Show correct answer locked in */
              <div className="space-y-2">
                <div
                  className={`${theme.accent.emerald.stepBg} rounded-lg p-3 border ${theme.accent.emerald.stepBorder} flex items-center gap-2`}
                >
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      {t('lab.correct') || 'Correct!'}
                    </p>
                    <div className="bg-[#000000] rounded-lg mt-1 px-3 py-1.5 text-center border border-[#1c1b1b]">
                      <MathFormula
                        formula={steps[currentStep].formula}
                        className="text-sm font-bold text-yellow-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Next button */}
                {!completed && (
                  <button
                    onClick={isLastStep ? handleFinish : handleNext}
                    className={`w-full px-4 py-2.5 bg-gradient-to-br ${accentGradient} hover:opacity-90 text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-md`}
                  >
                    {isLastStep
                      ? t('lab.quiz_finish') || 'Show Results'
                      : t('lab.quiz_next_step') || 'Next Step'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {/* Arrow to next step */}
                {currentStep < steps.length - 1 && !completed && (
                  <div className="flex justify-center mt-1">
                    <ArrowRight className="w-4 h-4 opacity-40" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mini step indicators */}
      <div className="flex gap-1.5 justify-center pt-2 border-t border-slate-200 dark:border-[#2a2a2a]">
        {steps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (idx <= currentStep || stepStates[idx] === 'correct') {
                setCurrentStep(idx);
                setHint(null);
              }
            }}
            className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
              stepStates[idx] === 'correct'
                ? 'bg-emerald-500 text-white shadow-sm'
                : stepStates[idx] === 'skipped'
                ? 'bg-amber-400 text-white'
                : idx === currentStep
                ? `bg-gradient-to-br ${accentGradient} text-white`
                : 'bg-slate-200 dark:bg-[#2a2a2a] text-slate-400 dark:text-slate-500'
            } ${
              idx <= currentStep || stepStates[idx] === 'correct'
                ? 'cursor-pointer'
                : 'cursor-not-allowed opacity-50'
            }`}
            title={step.label}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}