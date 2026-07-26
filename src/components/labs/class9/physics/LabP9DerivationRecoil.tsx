import { useState, useEffect } from 'react';
import { Rocket, CheckCircle, XCircle, Lightbulb, ArrowRight, BookOpen, BrainCircuit, HelpCircle, Trophy, EyeOff, Sparkles, RefreshCcw } from 'lucide-react';
import LabHeader from '../../class8/computer/LabHeader';
import MathFormula from '../../../widgets/MathFormula';
import EquationBuilder from '../../../widgets/EquationBuilder';
import { useTranslate } from '../../../../i18n';
function n(eq:string):string{return eq.toLowerCase().replace(/\s+/g,'').replace(/Ã—/g,'').replace(/Â·/g,'').replace(/Ã·/g,'/').replace(/âˆ’/g,'-').replace(/â€“/g,'-').replace(/Î”/g,'d').replace(/Î´/g,'d').replace(/_/g,'').replace(/Â²/g,'^2').replace(/Â³/g,'^3').replace(/Â½/g,'0.5').replace(/Ï€/g,'pi');}
function ck(ua:string,ex:string):boolean{return n(ua)===n(ex);}

export default function LabP9DerivationRecoil({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [bulletMass, setBulletMass] = useState(10);
 const [bulletVel, setBulletVel] = useState(400);
 const [gunMass, setGunMass] = useState(5);
 const [fired, setFired] = useState(false);
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
          const [activeTab, setActiveTab] = useState<'learn'|'test'>('learn');
 const [currentStep, setCurrentStep] = useState(0);
 const [testInput, setTestInput] = useState('');
 const [testStatus, setTestStatus] = useState<'idle'|'correct'|'incorrect'>('idle');
 const [showTestHint, setShowTestHint] = useState(false);
 const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
 const [testFullyCompleted, setTestFullyCompleted] = useState(false);
 const testSteps=[{testEquation:'m_b v_b + m_g v_g = 0',testHint:'In an isolated system, total momentum before = total momentum after.'},{testEquation:'p_initial = 0',testHint:'Before firing, the gun and bullet are at rest so momentum is zero.'},{testEquation:'m_b v_b + m_g v_g = 0',testHint:'After firing, gun and bullet momenta must sum to zero.'},{testEquation:'v_g = -(m_b v_b)/m_g',testHint:'Solve the conservation equation for the gun velocity v_g.'}];
 useEffect(() => { const el = document.querySelector(`[data-step-idx="${currentStep}"]`); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, [currentStep]);
 const handleTestCheck = () => { const expected = testSteps[currentStep].testEquation; const isCorrect = ck(testInput, expected); setTestStatus(isCorrect ? 'correct' : 'incorrect'); if (isCorrect) { setCompletedSteps(prev => ({ ...prev, [currentStep]: true })); if (currentStep + 1 >= steps.length) { setTestFullyCompleted(true); } else { setCurrentStep(currentStep + 1); setTestInput(''); setTestStatus('idle'); setShowTestHint(false); } } };
 const resetTest = () => { setCurrentStep(0); setTestInput(''); setTestStatus('idle'); setShowTestHint(false); setCompletedSteps({}); setTestFullyCompleted(false); };
 const bMassKg = bulletMass / 1000;
 const recoilV = (bMassKg * bulletVel) / gunMass;

 const handleFire = () => {
 setFired(true);
 setTimeout(() => setFired(false), 600);
 };

 const checkAnswer = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 setCheckResult(Math.abs(val - recoilV) < 0.3 ? 'correct' : 'incorrect');
 };

 const steps = [
 { label: t('lab.recoil_step1_label'), formula: 'pi = pf', detail: t('lab.recoil_step1_detail') },
 { label: t('lab.recoil_step2_label'), formula: 'pi = 0', detail: t('lab.recoil_step2_detail') },
 { label: t('lab.recoil_step3_label'), formula: 'mbÃ—vb + mgÃ—vg = 0', detail: t('lab.recoil_step3_detail') },
 { label: t('lab.recoil_step4_label'), formula: 'vg = âˆ’(mbÃ—vb) / mg', detail: t('lab.recoil_step4_detail') },
 ];

 return (
 <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t("Derivation: Recoil Velocity of a Gun")} />
 <div className="w-full px-4 md:px-6 pt-4 pb-0 shrink-0">
 <div className="flex items-center gap-1 bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] p-1 max-w-md mx-auto">
 <button onClick={()=>{setActiveTab('learn');resetTest();}} className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab==='learn'?'bg-amber-500 text-white shadow-md':'text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-[#1c1b1b]'}`}><BookOpen className="w-3.5 h-3.5" /> Learn</button>
 <button onClick={()=>setActiveTab('test')} className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab==='test'?'bg-emerald-500 text-white shadow-md':'text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-[#1c1b1b]'}`}><BrainCircuit className="w-3.5 h-3.5" /> Test</button>
 </div>
 </div>
 {activeTab==='learn'?<>
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
 <button onClick={()=>setActiveMobileTab('theory')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab==='theory'?'bg-amber-600 text-white shadow-md':'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>{t('lab.tab.derivation')}</button>
 <button onClick={()=>setActiveMobileTab('lab')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab==='lab'?'bg-amber-600 text-white shadow-md':'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>{t('lab.tab.simulation')}</button>
 </div>
 <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
 <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab==='theory'?'flex':'hidden'} lg:flex`}>
 <div className="flex items-center gap-2 mb-3">
 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg"><Rocket className="w-5 h-5 text-white" /></div>
 <div><h2 className="text-lg font-bold">{t('lab.step_by_step')}</h2><p className="text-xs text-slate-500">{t('lab.recoil_subtitle')}</p></div>
 </div>
 <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-5 text-center shadow-lg mb-3">
 <p className="text-xs text-amber-200 font-semibold uppercase tracking-wider">{t('lab.final_formula')}</p>
 <p className="text-2xl font-bold text-white mt-1"><MathFormula formula="vg = âˆ’(mb Ã— vb) / mg" /></p>
 <p className="text-xs text-amber-200 mt-1">{t('lab.recoil_final_desc')}</p>
 </div>
 <div className="space-y-0">{steps.map((step,idx)=><div key={idx} className="relative"><div className="flex gap-3"><div className="flex flex-col items-center"><div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx+1}</div>{idx<steps.length-1&&<div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-amber-400 to-amber-200 dark:from-amber-600 dark:to-amber-800" />}</div><div className="flex-1 pb-4"><div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800 mb-1"><p className="font-bold text-base text-amber-800 dark:text-amber-300">{step.label}</p></div><div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]"><MathFormula formula={step.formula} className="text-base font-bold text-yellow-400" /></div><p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>{idx<steps.length-1&&<div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-amber-400" /></div>}</div></div></div>)}</div>
 </div>
 <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab==='lab'?'flex':'hidden'} lg:flex`}>
 <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
 <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-amber-500" /><h2 className="text-lg font-bold">{t('lab.see_in_action')}</h2></div>
 <p className="text-sm text-slate-500 mb-4">{t('lab.recoil_adjust_desc')}</p>
 <div className="space-y-3">
 <div><div className="flex justify-between text-xs font-semibold"><span>{t('lab.recoil_bullet_mass_label')}</span><span className="text-amber-600 font-mono">{bulletMass} g ({bMassKg} kg)</span></div><input type="range" min="2" max="50" step="1" value={bulletMass} onChange={e=>{setBulletMass(parseFloat(e.target.value));setCheckResult('idle');}} className="w-full accent-amber-500" /></div>
 <div><div className="flex justify-between text-xs font-semibold"><span>{t('lab.recoil_bullet_vel_label')}</span><span className="text-amber-600 font-mono">{bulletVel} m/s</span></div><input type="range" min="100" max="800" step="10" value={bulletVel} onChange={e=>{setBulletVel(parseFloat(e.target.value));setCheckResult('idle');}} className="w-full accent-amber-500" /></div>
 <div><div className="flex justify-between text-xs font-semibold"><span>{t('lab.recoil_gun_mass_label')}</span><span className="text-amber-600 font-mono">{gunMass} kg</span></div><input type="range" min="1" max="10" step="0.5" value={gunMass} onChange={e=>{setGunMass(parseFloat(e.target.value));setCheckResult('idle');}} className="w-full accent-amber-500" /></div>
 <button onClick={handleFire} className="w-full py-2.5 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold rounded-lg transition-all text-sm shadow-lg">{fired?'BOOM! ðŸ’¥':'FIRE! ðŸ”¥'}</button>
 <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1.5">
 <p className="text-xs text-slate-500 font-semibold uppercase">Derivation Trace</p>
 <p className="text-sm text-slate-400">{t('lab.recoil_trace1')}</p>
 <p className="text-sm text-slate-400">{t('lab.recoil_trace2',{mb:bMassKg,vb:bulletVel,mbvb:(bMassKg*bulletVel).toFixed(2)})}</p>
 <p className="text-sm text-slate-400">{t('lab.recoil_trace3',{mgvg:'-'+(bMassKg*bulletVel).toFixed(2)})}</p>
 <p className="border-t border-[#2a2a2a] pt-1.5 text-xs"><span className="text-amber-400 font-bold">{t('lab.recoil_trace4',{recoil:recoilV.toFixed(2)})}</span></p>
 </div>
 {fired&&<div className="h-16 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a] relative animate-pulse"><div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-500 rounded-full animate-ping" /></div>}
 </div></div>
 <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2"><div className="flex items-start gap-2"><Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /><div><p className="font-bold text-base text-amber-700 dark:text-amber-300">{t('lab.real_life_application')}</p><p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{t('lab.recoil_real_life')}</p></div></div></div>
 <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
 <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Rocket className="w-5 h-5 text-emerald-500" /> {t('lab.practice_apply')}</h2>
 <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
 <p className="text-base font-medium mb-2">{t('lab.recoil_practice_q')}</p><p className="text-base font-medium">{t('lab.recoil_practice_q2')}</p>
 <div className="bg-amber-50 dark:bg-amber-900/20 rounded p-2 mt-2"><p className="text-xs text-amber-700 dark:text-amber-300 font-mono">{t('lab.recoil_practice_hint')}</p></div></div>
 <div className="flex gap-2 mb-2"><input type="number" value={userAns} onChange={e=>setUserAns(e.target.value)} placeholder={t('lab.recoil_placeholder')} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-amber-500 outline-none" /><button onClick={checkAnswer} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.check')}</button></div>
 {checkResult==='correct'&&<div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>{t('lab.correct')}</strong> {t('lab.recoil_correct_feedback')}</p></div>}
 {checkResult==='incorrect'&&<div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500 shrink-0" /><p className="text-xs text-red-700 dark:text-red-300"><strong>{t('lab.incorrect')}</strong> {t('lab.recoil_incorrect_feedback')}</p></div>}
 </div>
 <div className="text-center"><p className="text-[11px] text-slate-400 dark:text-[#71717a]">{t('lab.footer_prefix')}{' '}<span className="font-semibold text-indigo-500 dark:text-indigo-400">{t('lab.calculator')}</span>{' '}{t('lab.footer_suffix')}</p></div>
 </div></div>
 </>:
<div className="flex-1 overflow-y-auto p-4 lg:p-6">
 <div className="h-full flex flex-col lg:flex-row gap-4 lg:gap-6">
 {/* â”€â”€ LEFT PANEL: Derivation Steps â”€â”€ */}
 <div className="flex-1 min-w-0">
 <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] p-4 mb-4">
 <div className="flex items-center gap-2">
 <Rocket className="w-5 h-5 text-amber-500" />
 <div>
 <h2 className="text-base font-bold text-slate-800 dark:text-white">Derivation Steps</h2>
 <p className="text-xs text-slate-500">Complete each step to unlock the next one</p>
 </div>
 {testFullyCompleted && <Trophy className="w-6 h-6 text-yellow-500 ml-auto" />}
 </div>
 {/* Progress dots */}
 <div className="flex gap-1 mt-3">
 {steps.map((_, idx) => (
 <div key={idx} className={`flex-1 h-1.5 rounded-full transition-all ${completedSteps[idx] ? 'bg-emerald-500' : idx === currentStep ? 'bg-amber-400 animate-pulse' : 'bg-slate-200 dark:bg-[#1c1b1b]'}`} />
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
   ${isActive ? 'border-amber-400 dark:border-amber-600 bg-white dark:bg-[#1c1b1b] shadow-md shadow-amber-500/10 ring-1 ring-amber-400/30' : ''}
   ${isLocked ? 'border-slate-100 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] opacity-50 cursor-not-allowed' : ''}
   ${!isCompleted && !isActive && !isLocked ? 'border-slate-200 dark:border-[#2a2a2a] bg-white dark:bg-[#121212]' : ''}`}
 >
  {/* Step Header */}
  <div className="px-4 py-3 flex items-center gap-3">
   <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all
    ${isCompleted ? 'bg-emerald-500 text-white' : ''}
    ${isActive ? 'bg-amber-500 text-white shadow-sm' : ''}
    ${isLocked ? 'bg-slate-200 dark:bg-[#1c1b1b] text-slate-400' : ''}
    ${!isCompleted && !isActive && !isLocked ? 'bg-slate-200 dark:bg-[#2a2a2a] text-slate-500' : ''}`}>
    {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
   </div>
   <div className="flex-1 min-w-0">
    <p className={`text-sm font-bold ${isLocked ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>{step.label}</p>
   </div>
   {isCompleted && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
   {isActive && !isCompleted && <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />}
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
    <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0">{currentStep + 1}</div>
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
       : 'bg-amber-600 hover:bg-amber-700 text-white shadow-md active:scale-95'}`}
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
}</div>);
}

