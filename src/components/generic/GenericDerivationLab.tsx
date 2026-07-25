import { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, ArrowRight, BookOpen, BrainCircuit, HelpCircle, Trophy, EyeOff, Sparkles, RefreshCcw, Target } from 'lucide-react';
import LabHeader from '../labs/class8/computer/LabHeader';
import MathFormula from '../widgets/MathFormula';
import EquationBuilder from '../widgets/EquationBuilder';
import { useTranslate } from '../../i18n';

// ── Equation Normalization ──
function normalizeEquation(eq: string): string {
  return eq
    .toLowerCase()
    .replace(/\\(text|frac|sqrt|left|right|cdot|Rightarrow|cap|cup|in|cot|tan|sin|cos|log|ln|alpha|beta|theta|delta)\b/gi, '')
    .replace(/[{}]/g, '')
    .replace(/\\/g, '')
    .replace(/∪/g, 'u')
    .replace(/∩/g, 'intersect')
    .replace(/∈/g, 'in')
    .replace(/\s+/g, '')
    .replace(/×/g, '')
    .replace(/\*/g, '')
    .replace(/·/g, '')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/–/g, '-')
    .replace(/Δ/g, 'd')
    .replace(/δ/g, 'd')
    .replace(/_/g, '')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/½/g, '0.5')
    .replace(/π/g, 'pi');
}

function checkEquation(userAnswer: string, expected: string): boolean {
  return normalizeEquation(userAnswer) === normalizeEquation(expected);
}

export interface DerivationStep {
  label: string;
  labelKey?: string;
  formula: string;
  detail: string;
  detailKey?: string;
  testEquation?: string;
  testHint?: string;
}

export interface SliderConfig {
  label: string;
  key: string;
  min: number;
  max: number;
  step: number;
  default: number;
  unit: string;
}

export interface PracticeConfig {
  question: string;
  hint: string;
  answer: number;
  tolerance: number;
  explanation: string;
  errorHint: string;
}

export interface DerivationConfig {
  id?: string;
  derivationKey?: string;
  title: string;
  titleKey?: string;
  icon: React.ReactNode;
  accentGradient: string;
  accentColor: string;
  finalFormula: string;
  finalFormulaDesc: string;
  finalFormulaDescKey?: string;
  steps: DerivationStep[];
  sliders: SliderConfig[];
  compute: (values: Record<string, number>) => { traces: { label: string; value: string }[]; result: string };
  practice: PracticeConfig;
  keyInsight?: string;
  keyInsightKey?: string;
}

export function GenericDerivationLab({ onExit, config }: { onExit?: () => void; config: DerivationConfig }) {
  const [activeTab, setActiveTab] = useState<'learn' | 'test'>('learn');
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const { t, language } = useTranslate();

  // Multi-candidate Translation Helper
  const derivKey = config.derivationKey || config.id || (config.titleKey ? config.titleKey.replace('lab.title.', '') : '');
  const tt = (field: string, fallback: string): string => {
    if (language === 'en') return fallback;
    if (!derivKey && !config.titleKey) return fallback;
    const candidates: string[] = [];

    if (field === 'title' && config.titleKey) {
      candidates.push(config.titleKey);
    }
    if (derivKey) {
      candidates.push(`derivations.${derivKey}.${field}`);
      candidates.push(`derivations.p12_deriv_${derivKey}.${field}`);
      candidates.push(`derivations.p11_deriv_${derivKey}.${field}`);
      candidates.push(`derivations.p10_deriv_${derivKey}.${field}`);
      candidates.push(`derivations.p9_deriv_${derivKey}.${field}`);
      if (field === 'title') {
        candidates.push(`lab.title.${derivKey}`);
        candidates.push(`lab.title.p12_deriv_${derivKey}`);
        candidates.push(`lab.title.p11_deriv_${derivKey}`);
        candidates.push(`lab.title.p10_deriv_${derivKey}`);
        candidates.push(`lab.title.p9_deriv_${derivKey}`);
      }
    }

    for (const key of candidates) {
      const res = t(key);
      if (res && typeof res === 'string' && res.trim() !== '' && res !== key) {
        return res;
      }
    }
    return fallback;
  };

  const initialVals: Record<string, number> = {};
  config.sliders.forEach(s => { initialVals[s.key] = s.default; });
  const [vals, setVals] = useState<Record<string, number>>(initialVals);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const computed = config.compute(vals);

  // ── TEST TAB STATE ──
  const testSteps = config.steps.map((s, idx) => ({
    testEquation: s.testEquation || s.formula || `Step ${idx + 1}`,
    testHint: s.testHint || tt(`step${idx + 1}_detail`, s.detail) || `Recall step ${idx + 1} of the derivation.`
  }));

  const [currentTestStep, setCurrentTestStep] = useState(0);
  const [testEquationInput, setTestEquationInput] = useState('');
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(new Array(config.steps.length).fill(false));
  const [testStepStatus, setTestStepStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showTestHint, setShowTestHint] = useState(false);
  const [testFullyCompleted, setTestFullyCompleted] = useState(false);

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - config.practice.answer) < config.practice.tolerance ? 'correct' : 'incorrect');
  };

  const updateVal = (key: string, val: number) => {
    setVals(prev => ({ ...prev, [key]: val }));
    setCheckResult('idle');
  };

  const handleTestCheck = () => {
    const expected = testSteps[currentTestStep].testEquation;
    const isRight = checkEquation(testEquationInput, expected);

    if (isRight) {
      setTestStepStatus('correct');
      const nextCompleted = [...completedSteps];
      nextCompleted[currentTestStep] = true;
      setCompletedSteps(nextCompleted);

      setTimeout(() => {
        if (currentTestStep + 1 < config.steps.length) {
          setCurrentTestStep(prev => prev + 1);
          setTestEquationInput('');
          setTestStepStatus('idle');
          setShowTestHint(false);
        } else {
          setTestFullyCompleted(true);
        }
      }, 1200);
    } else {
      setTestStepStatus('incorrect');
    }
  };

  const resetTest = () => {
    setCurrentTestStep(0);
    setTestEquationInput('');
    setCompletedSteps(new Array(config.steps.length).fill(false));
    setTestStepStatus('idle');
    setShowTestHint(false);
    setTestFullyCompleted(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white w-full">
      <LabHeader onExit={onExit} title={config.titleKey ? t(config.titleKey) : tt('title', config.title)} />

      {/* Learn/Test Tabs */}
      <div className="w-full px-4 md:px-6 pt-4 pb-0 shrink-0">
        <div className="flex items-center gap-1 bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] p-1 max-w-md mx-auto">
          <button
            onClick={() => { setActiveTab('learn'); resetTest(); }}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'learn' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-[#1c1b1b]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Learn
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'test' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-[#1c1b1b]'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" /> Test
          </button>
        </div>
      </div>

      {activeTab === 'learn' ? (
        /* ═══════════════════ LEARN TAB ═══════════════════ */
        <>
          <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
            <button onClick={() => setActiveMobileTab('theory')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? `${config.accentColor} text-white shadow-md` : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>{t('lab.derivation')}</button>
            <button onClick={() => setActiveMobileTab('lab')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? `${config.accentColor} text-white shadow-md` : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>{t('lab.simulation')}</button>
          </div>
          <div className="max-w-6xl mx-auto w-full lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
            <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.accentGradient} flex items-center justify-center shadow-lg`}>{config.icon}</div>
                <div><h2 className="text-lg font-bold">{t('lab.derivation_step_by_step')}</h2><p className="text-xs text-slate-500">{t('lab.derivation_step_desc')}</p></div>
              </div>
              <div className={`bg-gradient-to-br ${config.accentGradient} rounded-xl p-5 text-center shadow-lg mb-3`}>
                <p className={`text-xs text-white/70 font-semibold uppercase tracking-wider`}>{t('lab.final_formula')}</p>
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
                        <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-3 text-center border border-[#1c1b1b]"><MathFormula formula={step.formula} className="text-lg font-bold text-yellow-400" /></div>
                        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detailKey ? t(step.detailKey) : tt(`step${idx+1}_detail`, step.detail)}</p>
                        {idx < config.steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 opacity-40" /></div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
              <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
                <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 opacity-60" /><h2 className="text-lg font-bold">{t('lab.derivation_in_action')}</h2></div>
                <p className="text-sm text-slate-500 mb-4">{t('lab.derivation_adjust_desc')}</p>
                <div className="space-y-3">
                  {config.sliders.map(slider => (
                    <div key={slider.key}>
                      <div className="flex justify-between text-xs font-semibold"><span>{slider.label}</span><span className={`font-mono`}>{vals[slider.key]}{slider.unit}</span></div>
                      <input type="range" min={slider.min} max={slider.max} step={slider.step} value={vals[slider.key]} onChange={e => updateVal(slider.key, parseFloat(e.target.value))} className="w-full accent-blue-500" />
                    </div>
                  ))}
                  <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{t('lab.derivation_trace')}</p>
                    {computed.traces.map((t, i) => (
                      <p key={i} className="text-sm text-slate-400">{t.label}<span className="text-slate-500">{t.value}</span></p>
                    ))}
                    <p className="border-t border-[#2a2a2a] pt-1 text-sm"><span className="text-green-400 font-bold">{t('lab.result')}: </span><span className="text-yellow-400 font-mono font-bold">{computed.result}</span></p>
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div><p className="font-bold text-sm text-amber-700 dark:text-amber-300">{t('lab.real_life_application')}</p><p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{config.keyInsightKey ? t(config.keyInsightKey) : tt('keyInsight', config.keyInsight || t('lab.derivation_default_insight'))}</p></div>
                </div>
              </div>
              <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">{t('lab.practice_apply_derivation')}</h2>
                <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
                  <p className="text-sm font-medium mb-2">{tt('practice_question', config.practice.question)}</p>
                  <p className="text-sm font-medium">{t('lab.practice_find_answer')}</p>
                  <div className={`bg-blue-50 dark:bg-blue-900/20 rounded p-2 mt-2`}><p className="text-xs text-blue-700 dark:text-blue-300 font-mono">{tt('practice_hint', config.practice.hint)}</p></div>
                </div>
                <div className="flex gap-2 mb-2">
                  <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t('lab.practice_placeholder')} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-blue-500 outline-none" />
                  <button onClick={checkAnswer} className={`px-4 py-2 bg-gradient-to-br ${config.accentGradient} hover:opacity-90 text-white text-sm font-semibold rounded-lg transition-all`}>{t('lab.check')}</button>
                </div>
                {checkResult === 'correct' && <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>{t('lab.correct')}</strong> {tt('practice_explanation', config.practice.explanation)}</p></div>}
                {checkResult === 'incorrect' && <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500 shrink-0" /><p className="text-xs text-red-700 dark:text-red-300"><strong>{t('lab.not_quite')}</strong> {tt('practice_errorHint', config.practice.errorHint)}</p></div>}
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
        </>
      ) : (
        /* ═══════════════════ TEST TAB ═══════════════════ */
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 w-full">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full">

            {/* ── LEFT PANEL: Derivation Steps ── */}
            <div className="flex-1 min-w-0">
              <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] p-4 mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  <div>
                    <h2 className="text-base font-bold text-slate-800 dark:text-white">{t('lab.derivation_steps_title')}</h2>
                    <p className="text-xs text-slate-500">{t('lab.derivation_steps_subtitle')}</p>
                  </div>
                  {testFullyCompleted && <Trophy className="w-6 h-6 text-yellow-500 ml-auto" />}
                </div>
                {/* Progress dots */}
                <div className="flex gap-1 mt-3">
                  {config.steps.map((_, idx) => (
                    <div key={idx} className={`flex-1 h-1.5 rounded-full transition-all ${completedSteps[idx] ? 'bg-emerald-500' : idx === currentTestStep ? 'bg-blue-400 animate-pulse' : 'bg-slate-200 dark:bg-[#1c1b1b]'}`} />
                  ))}
                </div>
              </div>

              {testFullyCompleted ? (
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 p-8 text-center">
                  <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-1">{t('lab.derivation_mastered')} 🎉</h3>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-4">{t('lab.derivation_mastered_desc')}</p>
                  <button onClick={resetTest} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 mx-auto"><RefreshCcw className="w-3.5 h-3.5" /> {t('lab.retry')}</button>
                </div>
              ) : (
                <div className="space-y-2">
                  {config.steps.map((step, idx) => {
                    const isCompleted = completedSteps[idx];
                    const isActive = idx === currentTestStep;
                    const isLocked = idx > currentTestStep;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (!isLocked) {
                            setCurrentTestStep(idx);
                            if (completedSteps[idx]) {
                              setTestEquationInput(testSteps[idx].testEquation);
                              setTestStepStatus('correct');
                              setShowTestHint(false);
                            } else {
                              setTestEquationInput('');
                              setTestStepStatus('idle');
                              setShowTestHint(false);
                            }
                          }
                        }}
                        data-step-idx={idx}
                        className={`relative rounded-xl border transition-all cursor-pointer overflow-hidden
                          ${isCompleted ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10' : ''}
                          ${isActive ? 'border-blue-400 dark:border-blue-600 bg-white dark:bg-[#1c1b1b] shadow-md shadow-blue-500/10 ring-1 ring-blue-400/30' : ''}
                          ${isLocked ? 'border-slate-100 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] opacity-50 cursor-not-allowed' : ''}
                          ${!isCompleted && !isActive && !isLocked ? 'border-slate-200 dark:border-[#2a2a2a] bg-white dark:bg-[#121212]' : ''}`}
                      >
                        {/* Step Header */}
                        <div className="px-4 py-3 flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all
                            ${isCompleted ? 'bg-emerald-500 text-white' : ''}
                            ${isActive ? 'bg-blue-500 text-white shadow-sm' : ''}
                            ${isLocked ? 'bg-slate-200 dark:bg-[#1c1b1b] text-slate-400' : ''}
                            ${!isCompleted && !isActive && !isLocked ? 'bg-slate-200 dark:bg-[#2a2a2a] text-slate-500' : ''}`}>
                            {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold ${isLocked ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>{step.labelKey ? t(step.labelKey) : tt(`step${idx+1}_label`, step.label)}</p>
                          </div>
                          {isCompleted && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                          {isActive && !isCompleted && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />}
                        </div>

                        {/* Equation box - empty placeholder or equation */}
                        <div className="px-4 pb-4">
                          {isCompleted ? (
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                              <MathFormula formula={testSteps[idx].testEquation} className="text-sm font-bold text-emerald-600" />
                            </div>
                          ) : isActive ? (
                            <div>
                              {/* Desktop: dashed placeholder */}
                              <div className="hidden lg:block bg-slate-50 dark:bg-[#000000] rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700 p-3 text-center cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                                {testEquationInput ? (
                                  <MathFormula formula={testEquationInput} className="text-sm font-bold text-blue-600" />
                                ) : (
                                  <p className="text-xs text-blue-400 flex items-center justify-center gap-1.5">
                                    <span className="text-lg">+</span> {t('lab.tap_to_enter_equation')}
                                  </p>
                                )}
                              </div>

                              {/* Mobile: Inline EquationBuilder & Controls right under active step */}
                              <div className="lg:hidden mt-2 space-y-3">
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-3 border border-slate-200 dark:border-[#2a2a2a]">
                                  {step.detailKey ? t(step.detailKey) : tt(`step${idx+1}_detail`, step.detail)}
                                </p>
                                <div className="bg-slate-50 dark:bg-[#000000] rounded-lg border border-slate-200 dark:border-[#2a2a2a] p-3">
                                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 block">
                                    {t('lab.equation_for_step', { step: idx + 1 })}
                                  </label>
                                  <EquationBuilder
                                    value={testEquationInput}
                                    onChange={v => { setTestEquationInput(v); if (testStepStatus !== 'idle') setTestStepStatus('idle'); }}
                                    placeholder={t('lab.build_your_equation')}
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={handleTestCheck}
                                    disabled={!testEquationInput.trim()}
                                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" /> {t('lab.check_step')}
                                  </button>
                                  <button
                                    onClick={() => setShowTestHint(!showTestHint)}
                                    className="px-3 py-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1"
                                  >
                                    <HelpCircle className="w-3.5 h-3.5" /> {t('lab.hint')}
                                  </button>
                                </div>

                                {showTestHint && (
                                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                                    <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                                      💡 {t('lab.hint')}: {t('lab.target_equation')} <code className="font-bold font-mono bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded">{testSteps[idx].testEquation}</code>
                                    </p>
                                  </div>
                                )}

                                {testStepStatus === 'incorrect' && (
                                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
                                    <div className="flex items-start gap-2">
                                      <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                                      <div>
                                        <p className="text-xs font-bold text-red-700 mb-0.5">{t('lab.not_quite')}</p>
                                        <p className="text-xs text-red-600">{t('lab.try_different_equation')}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {testStepStatus === 'correct' && (
                                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                                    <div className="flex items-center gap-2">
                                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                                      <span className="text-xs font-bold text-emerald-700">{t('lab.correct_moving_next')}</span>
                                    </div>
                                    <MathFormula formula={testSteps[idx].testEquation} className="text-sm font-bold text-emerald-600 block mt-1" />
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : isLocked ? (
                            <div className="bg-slate-50 dark:bg-[#000000] rounded-lg border border-slate-200 dark:border-[#1c1b1b] p-3">
                              <p className="text-xs text-slate-400 text-center">🔒 {t('lab.complete_previous_step')}</p>
                            </div>
                          ) : (
                            <div className="bg-slate-50 dark:bg-[#000000] rounded-lg border border-slate-200 dark:border-[#2a2a2a] p-3 text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-[#1c1b1b] transition-colors">
                              <p className="text-xs text-slate-500">{t('lab.click_to_edit_equation')}</p>
                            </div>
                          )}
                        </div>

                        {/* Connecting line between steps */}
                        {idx < config.steps.length - 1 && (
                          <div className={`absolute left-[22px] bottom-0 w-0.5 h-4 transition-all ${isCompleted ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-[#1c1b1b]'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── RIGHT PANEL: Equation Builder (Desktop Only) ── */}
            {!testFullyCompleted && (
              <div className="hidden lg:block w-full lg:w-[380px] xl:w-[420px] shrink-0">
                <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] p-5 sticky top-4">
                  {/* Active step info */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0">{currentTestStep + 1}</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{config.steps[currentTestStep].labelKey ? t(config.steps[currentTestStep].labelKey) : tt(`step${currentTestStep+1}_label`, config.steps[currentTestStep].label)}</p>
                      <p className="text-[10px] text-slate-500">{t('lab.step_n_of_m', { current: currentTestStep + 1, total: config.steps.length })}</p>
                    </div>
                  </div>

                  {/* Detail description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-3 border border-slate-200 dark:border-[#2a2a2a]">
                    {config.steps[currentTestStep].detailKey ? t(config.steps[currentTestStep].detailKey) : tt(`step${currentTestStep+1}_detail`, config.steps[currentTestStep].detail)}
                  </p>

                  {/* Equation Builder Input */}
                  <div className="bg-slate-50 dark:bg-[#000000] rounded-lg border border-slate-200 dark:border-[#2a2a2a] p-4 mb-4">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 block">
                      {t('lab.equation_for_step', { step: currentTestStep + 1 })}
                    </label>
                    <EquationBuilder
                      value={testEquationInput}
                      onChange={v => { setTestEquationInput(v); if (testStepStatus !== 'idle') setTestStepStatus('idle'); }}
                      placeholder={t('lab.build_your_equation')}
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      onClick={handleTestCheck}
                      disabled={!testEquationInput.trim() || testStepStatus === 'correct'}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all
                        ${!testEquationInput.trim() || testStepStatus === 'correct'
                          ? 'bg-slate-200 dark:bg-[#1c1b1b] text-slate-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95'}`}
                    >
                      {testStepStatus === 'correct' ? (
                        <><CheckCircle className="w-3.5 h-3.5 inline mr-1.5" /> Correct ✓</>
                      ) : (
                        <><CheckCircle className="w-3.5 h-3.5 inline mr-1.5" /> Check Answer</>
                      )}
                    </button>
                    <button
                      onClick={() => setShowTestHint(!showTestHint)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all
                        ${showTestHint ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700' : 'bg-slate-100 dark:bg-[#1c1b1b] text-slate-500 hover:bg-slate-200 dark:hover:bg-[#2a2a2a]'}`}
                    >
                      {showTestHint ? <EyeOff className="w-3.5 h-3.5" /> : <HelpCircle className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Hint */}
                  {showTestHint && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800 mb-3">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-amber-700 mb-0.5">Hint</p>
                          <p className="text-xs text-amber-600">{testSteps[currentTestStep].testHint}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Feedback */}
                  {testStepStatus === 'incorrect' && (
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-red-700 mb-0.5">Not quite right</p>
                          <p className="text-xs text-red-600">Try a different equation. Use standard math notation (+, -, *, /, ^).</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {testStepStatus === 'correct' && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-700">✓ Correct! Moving to next step...</span>
                      </div>
                      <MathFormula formula={testSteps[currentTestStep].testEquation} className="text-sm font-bold text-emerald-600 block mt-1" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GenericDerivationLab;
