import { useState } from 'react';
import { Cpu, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';
import MathFormula from './MathFormula';
import { useTranslate } from '../i18n';

export default function LabP10DerivationTransistorGain({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [ib, setIb] = useState(0.1);
 const [ic, setIc] = useState(10);
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

 const beta = ic / ib;
 const ie = ib + ic;
 const alpha = ic / ie;

 const checkAnswer = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 setCheckResult(Math.abs(val - beta) < beta * 0.1 ? 'correct' : 'incorrect');
 };

 const steps = [
 { label: t('lab.p10_transGain_step1_label'), formula: 'I_E = I_B + I_C', detail: t('lab.p10_transGain_step1_detail') },
 { label: t('lab.p10_transGain_step2_label'), formula: 'β = I_C / I_B', detail: t('lab.p10_transGain_step2_detail') },
 { label: t('lab.p10_transGain_step3_label'), formula: 'α = I_C / I_E', detail: t('lab.p10_transGain_step3_detail') },
 { label: t('lab.p10_transGain_step4_label'), formula: 'I_C = β × I_B', detail: t('lab.p10_transGain_step4_detail') }
 ];

 return (
 <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t("Derivation: Transistor Current Gain")} />
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
 <button onClick={() => setActiveMobileTab('theory')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-stone-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>{t('lab.tab.derivation')}</button>
 <button onClick={() => setActiveMobileTab('lab')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-stone-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>{t('lab.tab.lab')}</button>
 </div>
 <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
 <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center gap-2 mb-3">
 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-stone-500 to-zinc-600 flex items-center justify-center shadow-lg"><Cpu className="w-5 h-5 text-white" /></div>
 <div><h2 className="text-lg font-bold">{t('lab.step_by_step')}</h2><p className="text-xs text-slate-500">{t('lab.p10_transGain_subtitle')}</p></div>
 </div>
 <div className="bg-gradient-to-br from-stone-500 to-zinc-600 rounded-xl p-5 text-center shadow-lg mb-3">
 <p className="text-xs text-stone-200 font-semibold uppercase tracking-wider">{t('lab.final_formula')}</p>
 <div className="text-lg font-bold text-white mt-1"><MathFormula formula="β = I_C/I_B, α = I_C/I_E, I_E = I_B + I_C" className="text-base font-bold" /></div>
 <p className="text-xs text-stone-200 mt-1">{t('lab.p10_transGain_final_desc')}</p>
 </div>
 <div className="space-y-0">
 {steps.map((step, idx) => (
 <div key={idx} className="relative">
 <div className="flex gap-3">
 <div className="flex flex-col items-center">
 <div className="w-8 h-8 rounded-full bg-stone-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
 {idx < steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-stone-400 to-stone-200" />}
 </div>
 <div className="flex-1 pb-4">
 <div className="bg-stone-50 dark:bg-stone-900/20 rounded-lg p-3 border border-stone-200 dark:border-stone-800 mb-1"><p className="font-bold text-base text-stone-800 dark:text-stone-300">{step.label}</p></div>
 <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-3 text-center border border-[#1c1b1b]"><MathFormula formula={step.formula} className="text-lg font-bold text-yellow-400" /></div>
 <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>
 {idx < steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-stone-400" /></div>}
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
 <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-stone-500" /><h2 className="text-lg font-bold">{t('lab.see_in_action')}</h2></div>
 <p className="text-sm text-slate-500 mb-4">{t('lab.p10_transGain_adjust_desc')}</p>
 <div className="space-y-3">
 <div><div className="flex justify-between text-xs font-semibold"><span>{t('lab.p10_transGain_ib_label')}</span><span className="text-stone-600 font-mono">{ib} mA</span></div><input type="range" min="0.01" max="1" step="0.01" value={ib} onChange={e => { setIb(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-stone-500" /></div>
 <div><div className="flex justify-between text-xs font-semibold"><span>{t('lab.p10_transGain_ic_label')}</span><span className="text-stone-600 font-mono">{ic} mA</span></div><input type="range" min="1" max="50" step="0.5" value={ic} onChange={e => { setIc(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-stone-500" /></div>
 <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
 <p className="text-xs text-slate-500 font-semibold uppercase">{t('lab.derivation_trace')}</p>
 <p className="text-sm text-slate-400">{t('lab.p10_transGain_trace1', { beta: beta.toFixed(0), alpha: alpha.toFixed(4) })}</p>
 </div>
 </div>
 </div>
 <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
 <div className="flex items-start gap-2">
 <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
 <div><p className="font-bold text-base text-amber-700 dark:text-amber-300">{t('lab.real_life_application')}</p><p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{t('lab.p10_transGain_real_life')}</p></div>
 </div>
 </div>
 <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
 <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Cpu className="w-5 h-5 text-emerald-500" /> {t('lab.practice_apply')}</h2>
 <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
 <p className="text-base font-medium mb-2">{t('lab.p10_transGain_practice_q')}</p>
 <div className="bg-stone-50 dark:bg-stone-900/20 rounded p-2 mt-2"><p className="text-xs text-stone-700 dark:text-stone-300 font-mono">{t('lab.p10_transGain_practice_hint')}</p></div>
 </div>
 <div className="flex gap-2 mb-2">
 <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t('lab.p10_transGain_placeholder')} className="flex-1 px-3 py-3 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-stone-500 outline-none" />
 <button onClick={checkAnswer} className="px-4 py-2 bg-stone-600 hover:bg-stone-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.check')}</button>
 </div>
 {checkResult === 'correct' && <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>{t('lab.correct')}</strong> {t('lab.p10_transGain_correct_fb')}</p></div>}
 {checkResult === 'incorrect' && <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500 shrink-0" /><p className="text-xs text-red-700 dark:text-red-300"><strong>{t('lab.incorrect')}</strong> {t('lab.p10_transGain_incorrect_fb')}</p></div>}
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
