import { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';
import MathFormula from './MathFormula';
import { useTranslate } from '../i18n';

export interface TheoremStep {
  label: string;
  labelKey?: string;
  formula: string;
  detail: string;
  detailKey?: string;
}

export interface PracticeConfig {
  question: string;
  questionKey?: string;
  hint: string;
  hintKey?: string;
  answer: number;
  tolerance: number;
  explanation: string;
  explanationKey?: string;
  errorHint: string;
  errorHintKey?: string;
}

export interface TheoremConfig {
  /** Unique key for auto-translation: e.g. "class9.product_log" generates keys like "theorem.class9.product_log.title" */
  theoremKey?: string;
  title: string;
  titleKey?: string;
  icon: React.ReactNode;
  accentGradient: string;
  accentColor: string;
  finalFormula: string;
  finalFormulaDesc: string;
  finalFormulaDescKey?: string;
  steps: TheoremStep[];
  keyInsight: string;
  keyInsightKey?: string;
  practice: PracticeConfig;
  interactive: (props: { onAnswer: (correct: boolean) => void }) => React.ReactElement;
}

/** Auto-translate using theoremKey pattern: "theorem.{theoremKey}.{field}" */
function useTheoremT(config: TheoremConfig) {
  const { t } = useTranslate();
  return (field: string, fallback: string): string => {
    if (config.theoremKey) {
      const fullKey = `theorem.${config.theoremKey}.${field}`;
      const translated = t(fullKey);
      if (translated !== fullKey) return translated;
    }
    return fallback;
  };
}

export function GenericTheoremLab({ onExit, config }: { onExit?: () => void; config: TheoremConfig }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const { t } = useTranslate();
  const tt = useTheoremT(config);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - config.practice.answer) < config.practice.tolerance ? 'correct' : 'incorrect');
  };

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title={config.title} titleKey={config.titleKey} />
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? `${config.accentColor} text-white shadow-md` : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>{t('lab.theorem_proof')}</button>
        <button onClick={() => setActiveMobileTab('lab')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? `${config.accentColor} text-white shadow-md` : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>{t('lab.theorem_interactive')}</button>
      </div>
      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        {/* Left Column: Steps */}
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.accentGradient} flex items-center justify-center shadow-lg`}>{config.icon}</div>
            <div><h2 className="text-lg font-bold">{t('lab.proof_step_by_step')}</h2><p className="text-xs text-slate-500">{t('lab.proof_step_desc')}</p></div>
          </div>
          <div className={`bg-gradient-to-br ${config.accentGradient} rounded-xl p-5 text-center shadow-lg mb-3`}>
            <p className={`text-xs text-white/70 font-semibold uppercase tracking-wider`}>{t('lab.theorem_statement')}</p>
            <div className="text-2xl font-bold text-white mt-1"><MathFormula formula={config.finalFormula} className="text-2xl font-bold" /></div>
            <p className="text-xs text-white/70 mt-1">{config.finalFormulaDescKey ? t(config.finalFormulaDescKey) : tt('finalFormulaDesc', config.finalFormulaDesc)}</p>
          </div>
          <div className="space-y-0">
            {config.steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${config.accentGradient} text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0`}>{idx + 1}</div>
                    {idx < config.steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-current to-current opacity-20" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className={`bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800 mb-1`}><p className="font-bold text-sm text-blue-800 dark:text-blue-300">{step.labelKey ? t(step.labelKey) : tt(`step${idx+1}_label`, step.label)}</p></div>
                    {step.formula && (
                      <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-3 text-center border border-[#1c1b1b]">
                        <MathFormula formula={step.formula} className="text-lg font-bold text-yellow-400" />
                      </div>
                    )}
                    <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detailKey ? t(step.detailKey) : tt(`step${idx+1}_detail`, step.detail)}</p>
                    {idx < config.steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 opacity-40" /></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive */}
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 opacity-60" /><h2 className="text-lg font-bold">{t('lab.try_it_yourself')}</h2></div>
            <p className="text-sm text-slate-500 mb-4">{t('lab.theorem_interactive_desc')}</p>
            <config.interactive onAnswer={() => {}} />
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div><p className="font-bold text-sm text-amber-700 dark:text-amber-300">{t('lab.real_life_application')}</p><p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{config.keyInsightKey ? t(config.keyInsightKey) : tt('keyInsight', config.keyInsight)}</p></div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">{t('lab.practice_apply_theorem')}</h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-sm font-medium mb-2">{config.practice.questionKey ? t(config.practice.questionKey) : tt('practice_question', config.practice.question)}</p>
              <p className="text-sm font-medium">{t('lab.practice_solve_theorem')}</p>
              <div className={`bg-blue-50 dark:bg-blue-900/20 rounded p-2 mt-2`}><p className="text-xs text-blue-700 dark:text-blue-300 font-mono">{config.practice.hintKey ? t(config.practice.hintKey) : tt('practice_hint', config.practice.hint)}</p></div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t('lab.practice_placeholder')} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-blue-500 outline-none" />
              <button onClick={checkAnswer} className={`px-4 py-2 bg-gradient-to-br ${config.accentGradient} hover:opacity-90 text-white text-sm font-semibold rounded-lg transition-all`}>{t('lab.check')}</button>
            </div>
            {checkResult === 'correct' && <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>{t('lab.correct')}</strong> {config.practice.explanationKey ? t(config.practice.explanationKey) : tt('practice_explanation', config.practice.explanation)}</p></div>}
            {checkResult === 'incorrect' && <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500 shrink-0" /><p className="text-xs text-red-700 dark:text-red-300"><strong>{t('lab.not_quite')}</strong> {config.practice.errorHintKey ? t(config.practice.errorHintKey) : tt('practice_errorHint', config.practice.errorHint)}</p></div>}
          </div>
          <div className="text-center">
            <p className="text-[11px] text-slate-400 dark:text-[#71717a]">
              {t('lab.calculator_hint_prefix')}{' '}
              <span className="font-semibold text-indigo-500 dark:text-indigo-400">
                {t('lab.calculator')}
              </span>
              {' '}{t('lab.calculator_hint_suffix')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenericTheoremLab;
