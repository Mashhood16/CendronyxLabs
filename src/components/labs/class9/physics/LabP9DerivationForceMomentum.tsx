import { useState, useEffect } from 'react';
import { Target, CheckCircle, XCircle, Lightbulb, ArrowRight, BookOpen, BrainCircuit, HelpCircle, Trophy, EyeOff, Sparkles, RefreshCcw } from 'lucide-react';
import LabHeader from '../../class8/computer/LabHeader';
import MathFormula from '../../../widgets/MathFormula';
import EquationBuilder from '../../../widgets/EquationBuilder';
import { useTranslate } from '../../../../i18n';

// â”€â”€ Equation Comparison â”€â”€
function normalizeEquation(eq: string): string {
 return eq
 .toLowerCase()
 .replace(/\s+/g, '')
 .replace(/×/g, '*')
 .replace(/\*/g, '')
 .replace(/·/g, '')
 .replace(/÷/g, '/')
 .replace(/âˆ’/g, '-')
 .replace(/–/g, '-')
 .replace(/Î”/g, 'd')
 .replace(/Î´/g, 'd')
 .replace(/_/g, '')
 .replace(/²/g, '^2')
 .replace(/³/g, '^3')
 .replace(/½/g, '0.5')
 .replace(/Ï€/g, 'pi');
}
function checkEquation(userAnswer: string, expected: string): boolean {
 return normalizeEquation(userAnswer) === normalizeEquation(expected);
}

export default function LabP9DerivationForceMomentum({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [mass, setMass] = useState(2);
 const [vi, setVi] = useState(0);
 const [vf, setVf] = useState(10);
 const [time, setTime] = useState(2);
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

 // â”€â”€ Test Tab State â”€â”€
 const [activeTab, setActiveTab] = useState<'learn' | 'test'>('learn');
 // Progressive test state
 const [currentStep, setCurrentStep] = useState(0);
 const [testInput, setTestInput] = useState('');
 const [testStatus, setTestStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
 const [showTestHint, setShowTestHint] = useState(false);
 const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
 const [testFullyCompleted, setTestFullyCompleted] = useState(false);

 const testSteps = [
  { testEquation: 'F = ma', testHint: "Newton's Second Law relates force (F), mass (m), and acceleration (a)." },
  { testEquation: 'a = (vf - vi)/Î”t', testHint: 'Acceleration is the change in velocity divided by the time taken.' },
  { testEquation: 'F = m(vf - vi)/Î”t', testHint: 'Substitute the acceleration formula into F = ma.' },
  { testEquation: 'F = Î”p/Î”t', testHint: 'Force equals the rate of change of momentum.' },
 ];

 // Auto-scroll to active step
 useEffect(() => {
  const el = document.querySelector(`[data-step-idx="${currentStep}"]`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
 }, [currentStep]);

 const handleTestCheck = () => {
  const expected = testSteps[currentStep].testEquation;
  const isCorrect = checkEquation(testInput, expected);
  setTestStatus(isCorrect ? 'correct' : 'incorrect');
  if (isCorrect) {
   setCompletedSteps(prev => ({ ...prev, [currentStep]: true }));
   if (currentStep + 1 >= steps.length) {
    setTestFullyCompleted(true);
   } else {
    setCurrentStep(currentStep + 1);
    setTestInput('');
    setTestStatus('idle');
    setShowTestHint(false);
   }
  }
 };

 const resetTest = () => {
  setCurrentStep(0);
  setTestInput('');
  setTestStatus('idle');
  setShowTestHint(false);
  setCompletedSteps({});
  setTestFullyCompleted(false);
 };

 const deltaP = mass * (vf - vi);
 const force = deltaP / time;

 const checkAnswer = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 const expected = force;
 setCheckResult(Math.abs(val - expected) < expected * 0.1 ? 'correct' : 'incorrect');
 };

 const steps = [
 { label: t('lab.step1_label'), formula: 'F = m × a', detail: t('lab.step1_detail') },
 { label: t('lab.step2_label'), formula: 'a = (vf âˆ’ vi) / Î”t', detail: t('lab.step2_detail') },
 { label: t('lab.step3_label'), formula: 'F = m × (vf âˆ’ vi) / Î”t', detail: t('lab.step3_detail') },
 { label: t('lab.step4_label'), formula: 'F = (pf âˆ’ pi) / Î”t = Î”p / Î”t', detail: t('lab.step4_detail') },
 ];

 return (
 <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t("Derivation: Force & Change in Momentum")} />

 {/* Learn/Test Tabs */}
 <div className="w-full px-4 md:px-6 pt-4 pb-0 shrink-0">
 <div className="flex items-center gap-1 bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] p-1 max-w-md mx-auto">
 <button onClick={() => { setActiveTab('learn'); resetTest(); }}
 className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'learn' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-[#1c1b1b]'}`}>
 <BookOpen className="w-3.5 h-3.5" /> Learn
 </button>
 <button onClick={() => setActiveTab('test')}
 className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'test' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-[#1c1b1b]'}`}>
 <BrainCircuit className="w-3.5 h-3.5" /> Test
 </button>
 </div>
 </div>

 {activeTab === 'learn' ? (
 /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• LEARN TAB â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
 <>
 {/* Mobile Tabs */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
 <button onClick={() => setActiveMobileTab('theory')}
 className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>{t('lab.tab.derivation')}</button>
 <button onClick={() => setActiveMobileTab('lab')}
 className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>{t('lab.tab.simulation')}</button>
 </div>

 <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
 {/* Column 1: Derivation (primary focus - spans 3 columns) */}
 <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center gap-2 mb-3">
 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
 <Target className="w-5 h-5 text-white" />
 </div>
 <div>
 <h2 className="text-lg font-bold">{t('lab.step_by_step')}</h2>
 <p className="text-xs text-slate-500">{t('lab.derivation_subtitle')}</p>
 </div>
 </div>

 <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 text-center shadow-lg mb-3">
 <p className="text-xs text-blue-200 font-semibold uppercase tracking-wider">{t('lab.final_formula')}</p>
 <p className="text-2xl font-bold text-white mt-1"><MathFormula formula="F = Î”p / Î”t" /></p>
 <p className="text-xs text-blue-200 mt-1">{t('lab.final_formula_desc')}</p>
 </div>

 <div className="space-y-0">
 {steps.map((step, idx) => (
 <div key={idx} className="relative">
 <div className="flex gap-3">
 <div className="flex flex-col items-center">
 <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
 {idx < steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-blue-400 to-blue-200 dark:from-blue-600 dark:to-blue-800" />}
 </div>
 <div className="flex-1 pb-4">
 <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800 mb-1">
 <p className="font-bold text-base text-blue-800 dark:text-blue-300">{step.label}</p>
 </div>
 <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]">
 <MathFormula formula={step.formula} className="text-base font-bold text-yellow-400" />
 </div>
 <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>
 {idx < steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-blue-400" /></div>}
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Column 2: Interactive + Assessment (spans 2 columns) */}
 <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
 <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-amber-500" /><h2 className="text-lg font-bold">{t('lab.see_in_action')}</h2></div>
 <p className="text-sm text-slate-500 mb-4">{t('lab.adjust_sliders')}</p>
 <div className="space-y-3">
 <div>
 <div className="flex justify-between text-xs font-semibold"><span>{t('lab.mass_label')}</span><span className="text-blue-600 font-mono">{mass} kg</span></div>
 <input type="range" min="1" max="10" step="0.5" value={mass} onChange={e => { setMass(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
 </div>
 <div>
 <div className="flex justify-between text-xs font-semibold"><span>{t('lab.initial_velocity_label')}</span><span className="text-blue-600 font-mono">{vi} m/s</span></div>
 <input type="range" min="0" max="20" step="1" value={vi} onChange={e => { setVi(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
 </div>
 <div>
 <div className="flex justify-between text-xs font-semibold"><span>{t('lab.final_velocity_label')}</span><span className="text-blue-600 font-mono">{vf} m/s</span></div>
 <input type="range" min="0" max="30" step="1" value={vf} onChange={e => { setVf(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
 </div>
 <div>
 <div className="flex justify-between text-xs font-semibold"><span>{t('lab.time_interval_label')}</span><span className="text-blue-600 font-mono">{time} s</span></div>
 <input type="range" min="0.5" max="5" step="0.5" value={time} onChange={e => { setTime(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
 </div>
 <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-2">
 <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Derivation Trace</p>
 <div className="space-y-1.5">
 <div className="flex justify-between text-sm"><span className="text-slate-400">{t('lab.trace_step1')}</span><span className="text-slate-500">F = {mass} × a</span></div>
 <div className="flex justify-between text-sm"><span className="text-slate-400">{t('lab.trace_step2')}</span><span className="text-slate-500">a = ({vf} âˆ’ {vi}) / {time} = {((vf - vi) / time).toFixed(1)} m/s²</span></div>
 <div className="flex justify-between text-sm"><span className="text-slate-400">{t('lab.trace_step3')}</span><span className="text-slate-500">F = {mass} × {((vf - vi) / time).toFixed(1)}</span></div>
 <div className="border-t border-[#2a2a2a] pt-1.5 flex justify-between text-xs"><span className="text-green-400 font-bold">F = Î”p/Î”t</span><span className="text-yellow-400 font-mono font-bold">{force.toFixed(1)} N</span></div>
 </div>
 </div>
 <div className="relative h-10 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
 <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-300 dark:bg-[#2a2a2a]" />
 <div className="absolute transition-all duration-500 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-[8px] text-white font-bold shadow-lg" style={{ left: `${10 + (vf / 30) * 70}%` }}>m</div>
 </div>
 </div>
 </div>
 <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
 <div className="flex items-start gap-2">
 <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
 <div>
 <p className="font-bold text-base text-amber-700 dark:text-amber-300">{t('lab.real_life_application')}</p>
 <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{t('lab.real_life_airbags')}</p>
 </div>
 </div>
 </div>
 <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
 <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Target className="w-5 h-5 text-emerald-500" /> {t('lab.practice_apply')}</h2>
 <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
 <p className="text-base font-medium mb-2">{t('lab.practice_cricket_q')}</p>
 <p className="text-base font-medium">{t('lab.practice_force_q')}</p>
 <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2 mt-2">
 <p className="text-xs text-blue-700 dark:text-blue-300 font-mono">{t('lab.practice_hint')}</p>
 </div>
 </div>
 <div className="flex gap-2 mb-2">
 <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t('lab.force_placeholder')} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-blue-500 outline-none" />
 <button onClick={checkAnswer} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.check')}</button>
 </div>
 {checkResult === 'correct' && <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>{t('lab.correct')}</strong> {t('lab.practice_correct_feedback')}</p></div>}
 {checkResult === 'incorrect' && <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500 shrink-0" /><p className="text-xs text-red-700 dark:text-red-300"><strong>{t('lab.incorrect')}</strong> {t('lab.incorrect_feedback')}</p></div>}
 </div>
 <div className="text-center"><p className="text-[11px] text-slate-400 dark:text-[#71717a]">{t('lab.footer_prefix')}{' '}<span className="font-semibold text-indigo-500 dark:text-indigo-400">{t('lab.calculator')}</span>{' '}{t('lab.footer_suffix')}</p></div>
 </div>
 </div>
 </>
 ) : (
 /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TEST TAB â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
 <div className="flex-1 overflow-y-auto p-4 lg:p-6">
 <div className="h-full flex flex-col lg:flex-row gap-4 lg:gap-6">

 {/* â”€â”€ LEFT PANEL: Derivation Steps â”€â”€ */}
 <div className="flex-1 min-w-0">
 <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] p-4 mb-4">
 <div className="flex items-center gap-2">
 <Target className="w-5 h-5 text-blue-500" />
 <div>
 <h2 className="text-base font-bold text-slate-800 dark:text-white">Derivation Steps</h2>
 <p className="text-xs text-slate-500">Complete each step to unlock the next one</p>
 </div>
 {testFullyCompleted && <Trophy className="w-6 h-6 text-yellow-500 ml-auto" />}
 </div>
 {/* Progress dots */}
 <div className="flex gap-1 mt-3">
 {steps.map((_, idx) => (
 <div key={idx} className={`flex-1 h-1.5 rounded-full transition-all ${completedSteps[idx] ? 'bg-emerald-500' : idx === currentStep ? 'bg-blue-400 animate-pulse' : 'bg-slate-200 dark:bg-[#1c1b1b]'}`} />
 ))}
 </div>
 </div>

 {testFullyCompleted ? (
 <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 p-8 text-center">
 <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
 <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-1">Derivation Mastered! ðŸŽ‰</h3>
 <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-4">You completed all steps correctly.</p>
 <button onClick={resetTest} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 mx-auto"><RefreshCcw className="w-3.5 h-3.5" /> Retry</button>
 </div>
 ) : (
 <div className="space-y-2">
 {steps.map((step, idx) => {
  const isCompleted = completedSteps[idx];
  const isActive = idx === currentStep;
  const isLocked = idx > currentStep;
  return (
 <div
  key={idx}
  onClick={() => { if (!isLocked) { setCurrentStep(idx); if (completedSteps[idx]) { setTestInput(testSteps[idx].testEquation); setTestStatus('correct'); setShowTestHint(false); } else { setTestInput(''); setTestStatus('idle'); setShowTestHint(false); } } }}
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
    <p className={`text-sm font-bold ${isLocked ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>{step.label}</p>
   </div>
   {isCompleted && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
   {isActive && !isCompleted && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />}
  </div>

  {/* Equation box - empty placeholder */}
  <div className="px-4 pb-4">
   {isCompleted ? (
    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
     <MathFormula formula={testSteps[idx].testEquation} className="text-sm font-bold text-emerald-600" />
    </div>
   ) : isActive ? (
                            <div>
                              {/* Desktop: dashed placeholder */}
                              <div className="hidden lg:block bg-slate-50 dark:bg-[#000000] rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700 p-3 text-center cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                                {testInput ? (
                                  <MathFormula formula={testInput} className="text-sm font-bold text-blue-600" />
                                ) : (
                                  <p className="text-xs text-blue-400 flex items-center justify-center gap-1.5">
                                    <span className="text-lg">+</span> Tap to enter equation
                                  </p>
                                )}
                              </div>

                              {/* Mobile: Inline EquationBuilder & Controls right under active step */}
                              <div className="lg:hidden mt-2 space-y-3">
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-3 border border-slate-200 dark:border-[#2a2a2a]">
                                  {step.detail}
                                </p>
                                <div className="bg-slate-50 dark:bg-[#000000] rounded-lg border border-slate-200 dark:border-[#2a2a2a] p-3">
                                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 block">
                                    Equation for Step {idx + 1}
                                  </label>
                                  <EquationBuilder
                                    value={testInput}
                                    onChange={v => { setTestInput(v); if (testStatus !== 'idle') setTestStatus('idle'); }}
                                    placeholder="Build your equation..."
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={handleTestCheck}
                                    disabled={!testInput.trim() || testStatus === 'correct'}
                                    className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                      !testInput.trim() || testStatus === 'correct'
                                        ? 'bg-slate-200 dark:bg-[#1c1b1b] text-slate-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95'
                                    }`}
                                  >
                                    {testStatus === 'correct' ? <><CheckCircle className="w-3.5 h-3.5 inline mr-1.5" /> Correct âœ“</> : <><CheckCircle className="w-3.5 h-3.5 inline mr-1.5" /> Check Answer</>}
                                  </button>
                                  <button
                                    onClick={() => setShowTestHint(!showTestHint)}
                                    className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                      showTestHint ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700' : 'bg-slate-100 dark:bg-[#1c1b1b] text-slate-500 hover:bg-slate-200 dark:hover:bg-[#2a2a2a]'
                                    }`}
                                  >
                                    {showTestHint ? <EyeOff className="w-3.5 h-3.5" /> : <HelpCircle className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                                {showTestHint && (
                                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                                    <div className="flex items-start gap-2">
                                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                                      <div>
                                        <p className="text-xs font-bold text-amber-700 mb-0.5">Hint</p>
                                        <p className="text-xs text-amber-600">{testSteps[idx].testHint}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {testStatus === 'incorrect' && (
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
                                {testStatus === 'correct' && (
                                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                                    <div className="flex items-center gap-2">
                                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                                      <span className="text-xs font-bold text-emerald-700">âœ“ Correct! Moving to next step...</span>
                                    </div>
                                    <MathFormula formula={testSteps[idx].testEquation} className="text-sm font-bold text-emerald-600 block mt-1" />
                                  </div>
                                )}
                              </div>
                            </div>) : isLocked ? (
    <div className="bg-slate-50 dark:bg-[#000000] rounded-lg border border-slate-200 dark:border-[#1c1b1b] p-3">
     <p className="text-xs text-slate-400 text-center">ðŸ”’ Complete previous step</p>
    </div>
   ) : (
    <div className="bg-slate-50 dark:bg-[#000000] rounded-lg border border-slate-200 dark:border-[#2a2a2a] p-3 text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-[#1c1b1b] transition-colors">
     <p className="text-xs text-slate-500">Click to edit equation</p>
    </div>
   )}
  </div>

  {/* Connecting line between steps */}
  {idx < steps.length - 1 && (
   <div className={`absolute left-[22px] bottom-0 w-0.5 h-4 transition-all ${isCompleted ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-[#1c1b1b]'}`} />
  )}
 </div>
  );
 })}
 </div>
 )}
 </div>

 {/* â”€â”€ RIGHT PANEL: Equation Builder â”€â”€ */}
 {!testFullyCompleted && (
 <div className="hidden lg:block w-full lg:w-[380px] xl:w-[420px] shrink-0">
  <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] p-5 sticky top-4">
   {/* Active step info */}
   <div className="flex items-center gap-2 mb-4">
    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0">{currentStep + 1}</div>
    <div>
     <p className="text-sm font-bold text-slate-800 dark:text-white">{steps[currentStep].label}</p>
     <p className="text-[10px] text-slate-500">Step {currentStep + 1} of {steps.length}</p>
    </div>
   </div>

   {/* Detail description */}
   <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-3 border border-slate-200 dark:border-[#2a2a2a]">
    {steps[currentStep].detail}
   </p>

   {/* Equation Builder */}
   <div className="bg-slate-50 dark:bg-[#000000] rounded-lg border border-slate-200 dark:border-[#2a2a2a] p-4 mb-4">
    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 block">
     Equation for Step {currentStep + 1}
    </label>
    <EquationBuilder
     value={testInput}
     onChange={v => { setTestInput(v); if (testStatus !== 'idle') setTestStatus('idle'); }}
     placeholder="Build your equation..."
    />
   </div>

   {/* Action buttons */}
   <div className="flex items-center gap-2 mb-3">
    <button
     onClick={handleTestCheck}
     disabled={!testInput.trim() || testStatus === 'correct'}
     className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all
      ${!testInput.trim() || testStatus === 'correct'
       ? 'bg-slate-200 dark:bg-[#1c1b1b] text-slate-400 cursor-not-allowed'
       : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95'}`}
    >
     {testStatus === 'correct' ? (
      <><CheckCircle className="w-3.5 h-3.5 inline mr-1.5" /> Correct âœ“</>
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
       <p className="text-xs text-amber-600">{testSteps[currentStep].testHint}</p>
      </div>
     </div>
    </div>
   )}

   {/* Feedback */}
   {testStatus === 'incorrect' && (
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

   {testStatus === 'correct' && (
    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
     <div className="flex items-center gap-2">
      <CheckCircle className="w-4 h-4 text-emerald-500" />
      <span className="text-xs font-bold text-emerald-700">âœ“ Correct! Moving to next step...</span>
     </div>
     <MathFormula formula={testSteps[currentStep].testEquation} className="text-sm font-bold text-emerald-600 block mt-1" />
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

