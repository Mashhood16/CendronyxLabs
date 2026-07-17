import { useState } from 'react';
import { ArrowUpDown, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';
import MathFormula from './MathFormula';
import { useTranslate } from '../i18n';

export default function LabP9DerivationHydraulic({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [areaSmall, setAreaSmall] = useState(0.01);
 const [areaLarge, setAreaLarge] = useState(0.5);
 const [inputForce, setInputForce] = useState(100);
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

 const outputForce = (areaLarge / areaSmall) * inputForce;
 const mechanicalAdvantage = areaLarge / areaSmall;

 const checkAnswer = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 setCheckResult(Math.abs(val - outputForce) < outputForce * 0.1 ? 'correct' : 'incorrect');
 };

 const steps = [
 { label: t('lab.hydraulic_step1_label'), formula: 'P₁ = P₂', detail: t('lab.hydraulic_step1_detail') },
 { label: t('lab.hydraulic_step2_label'), formula: 'P₁ = F₁ / A₁', detail: t('lab.hydraulic_step2_detail') },
 { label: t('lab.hydraulic_step3_label'), formula: 'F₂ / A₂ = F₁ / A₁', detail: t('lab.hydraulic_step3_detail') },
 { label: t('lab.hydraulic_step4_label'), formula: 'F₂ = (A₂ / A₁) × F₁', detail: t('lab.hydraulic_step4_detail') },
 ];

 return (
 <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t("Derivation: Hydraulic Lift (Pascal's Principle)")} /> <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
 <button onClick={() => setActiveMobileTab('theory')}
 className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-rose-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>{t('lab.tab.derivation')}</button>
 <button onClick={() => setActiveMobileTab('lab')}
 className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-rose-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>{t('lab.tab.simulation')}</button>
 </div>
 <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
 {/* Column 1: Derivation (primary - spans 3) */}
 <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center gap-2 mb-3">
 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg">
 <ArrowUpDown className="w-5 h-5 text-white" />
 </div>
 <div>
 <h2 className="text-lg font-bold">{t('lab.step_by_step')}</h2>
 <p className="text-xs text-slate-500">{t('lab.hydraulic_subtitle')}</p>
 </div>
 </div>

 <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-xl p-5 text-center shadow-lg mb-3">
 <p className="text-xs text-rose-200 font-semibold uppercase tracking-wider">{t('lab.final_formula')}</p>
 <p className="text-2xl font-bold text-white mt-1"><MathFormula formula="F₂ = (A₂/A₁) × F₁" /></p>
 <p className="text-xs text-rose-200 mt-1">{t('lab.hydraulic_final_desc')}</p>
 </div>

 <div className="space-y-0">
 {steps.map((step, idx) => (
 <div key={idx} className="relative">
 <div className="flex gap-3">
 <div className="flex flex-col items-center">
 <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
 {idx < steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-rose-400 to-rose-200 dark:from-rose-600 dark:to-rose-800" />}
 </div>
 <div className="flex-1 pb-4">
 <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-3 border border-rose-200 dark:border-rose-800 mb-1">
 <p className="font-bold text-base text-rose-800 dark:text-rose-300">{step.label}</p>
 </div>
 <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]">
 <MathFormula formula={step.formula} className="text-base font-bold text-yellow-400" />
 </div>
 <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>
 {idx < steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-rose-400" /></div>}
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Column 2: Interactive + Assessment */}
 <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
 <div className="flex items-center gap-2 mb-3"> <Lightbulb className="w-5 h-5 text-rose-500" /><h2 className="text-lg font-bold">{t('lab.see_in_action')}</h2></div>
 <p className="text-sm text-slate-500 mb-4">{t('lab.hydraulic_adjust_desc')}</p>
 <div className="space-y-3">
 <div>
 <div className="flex justify-between text-xs font-semibold"><span>{t('lab.hydraulic_small_area_label')}</span><span className="text-rose-600 font-mono">{areaSmall} m²</span></div>
 <input type="range" min="0.002" max="0.05" step="0.001" value={areaSmall} onChange={e => { setAreaSmall(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" />
 </div>
 <div>
 <div className="flex justify-between text-xs font-semibold"><span>{t('lab.hydraulic_large_area_label')}</span><span className="text-rose-600 font-mono">{areaLarge} m²</span></div>
 <input type="range" min="0.05" max="2" step="0.01" value={areaLarge} onChange={e => { setAreaLarge(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" />
 </div>
 <div>
 <div className="flex justify-between text-xs font-semibold"><span>{t('lab.hydraulic_input_force_label')}</span><span className="text-rose-600 font-mono">{inputForce} N</span></div>
 <input type="range" min="10" max="500" step="10" value={inputForce} onChange={e => { setInputForce(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" />
 </div>

 <div className="relative h-32 bg-white dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-300 dark:border-[#2a2a2a]">
 <div className="absolute bottom-2 left-[15%] right-[15%] h-[55%] bg-rose-400/20 rounded-b-lg border border-rose-400/30" />
 <div className="absolute bottom-[calc(2px+55%)] left-[15%] translate-x-[-50%]" style={{ width: `${12 + areaSmall * 400}px`, height: '18px' }}>
 <div className="w-full h-full bg-rose-500 rounded-t-lg flex items-center justify-center text-[7px] text-white font-bold">{t('lab.p9derivationhydraulic_f')}{inputForce}N</div>
 </div>
 <div className="absolute bottom-[calc(2px+55%)] right-[15%] translate-x-[50%]" style={{ width: `${12 + areaLarge * 18}px`, height: `${18 + inputForce / 25}px`, minHeight: '28px' }}>
 <div className="w-full h-full bg-rose-600 rounded-t-lg flex items-center justify-center text-[7px] text-white font-bold text-center leading-tight">{t('lab.p9derivationhydraulic_f_1')}{outputForce.toFixed(0)}N</div>
 </div>
 <div className="absolute bottom-1 left-1 text-[7px] text-slate-500">{t('lab.p9derivationhydraulic_a')}{areaSmall}m²</div>
 <div className="absolute bottom-1 right-1 text-[7px] text-slate-500">{t('lab.p9derivationhydraulic_a_1')}{areaLarge}m²</div>
 </div>

 <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
 <p className="text-xs text-slate-500 font-semibold uppercase">{t('lab.derivation_trace')}</p>
 <p className="text-sm text-slate-400">{t('lab.hydraulic_trace1', { p1: (inputForce/areaSmall).toFixed(0) })}</p>
 <p className="text-sm text-slate-400">{t('lab.hydraulic_trace2')}</p>
 <p className="text-sm text-slate-400">{t('lab.hydraulic_trace3', { f2: outputForce.toFixed(0) })}</p>
 <p className="border-t border-[#2a2a2a] pt-1 text-xs"><span className="text-green-400 font-bold">{t('lab.hydraulic_trace4', { ma: mechanicalAdvantage.toFixed(1) })}</span> <span className="text-green-400 font-bold"> {t('lab.p9derivationhydraulic_f_2')} </span><span className="text-yellow-400 font-mono font-bold">{outputForce.toFixed(0)} N</span></p>
 {outputForce > 1000 && <p className="text-xs text-amber-400">{t('lab.p9derivationhydraulic_lifts')} {(outputForce/9.81).toFixed(0)} {t('lab.p9derivationhydraulic_kg')}</p>}
 </div>
 </div>
 </div>

 <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
 <div className="flex items-start gap-2">
 <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
 <div>
 <p className="font-bold text-base text-amber-700 dark:text-amber-300">{t('lab.real_life_application')}</p>
 <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{t('lab.hydraulic_real_life')}</p>
 </div>
 </div>
 </div>

 {/* Assessment */}
 <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
 <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><ArrowUpDown className="w-5 h-5 text-emerald-500" /> {t('lab.practice_apply')}</h2>
 <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
 <p className="text-base font-medium mb-2">{t('lab.hydraulic_practice_q')}</p>
 <p className="text-base font-medium">{t('lab.hydraulic_practice_q2')}</p>
 <div className="bg-rose-50 dark:bg-rose-900/20 rounded p-2 mt-2">
 <p className="text-xs text-rose-700 dark:text-rose-300 font-mono">{t('lab.hydraulic_practice_hint')}</p>
 </div>
 </div>
 <div className="flex gap-2 mb-2">
 <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
 placeholder={t('lab.hydraulic_placeholder')}
 className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-rose-500 outline-none" />
 <button onClick={checkAnswer} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.check')}</button>
 </div>
 {checkResult === 'correct' && (
 <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
 <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
 <p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>{t('lab.correct')}</strong> {t('lab.hydraulic_correct_feedback')}</p>
 </div>
 )}
 {checkResult === 'incorrect' && (
 <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2">
 <XCircle className="w-5 h-5 text-red-500 shrink-0" />
 <p className="text-xs text-red-700 dark:text-red-300"><strong>{t('lab.incorrect')}</strong> {t('lab.hydraulic_incorrect_feedback')}</p>
 </div>
 )}
 </div>
 <div className="text-center">
 <p className="text-[11px] text-slate-400 dark:text-[#71717a]">
 {t('lab.footer_prefix')}{' '}
 <span className="font-semibold text-indigo-500 dark:text-indigo-400">
 {t('lab.calculator')}
 </span>
 {' '}{t('lab.footer_suffix')}
 </p>
 </div>
 </div>
 </div>
 </div>
 );
}
