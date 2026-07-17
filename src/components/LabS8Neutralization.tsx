import { useState } from 'react';
import {AlertTriangle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps { onExit?: () => void; }

export default function LabS8Neutralization({ onExit }: LabProps) {
 const { t } = useTranslate();
 const [drops, setDrops] = useState(0);
 const [isAdding, setIsAdding] = useState(false);
 
 // Endpoint is around 10 drops
 const ENDPOINT = 10;
 
 const addDrop = () => {
 setIsAdding(true);
 setTimeout(() => {
 setDrops(d => d + 1);
 setIsAdding(false);
 }, 500);
 };

 // Determine color based on drops
 let solutionColor = 'bg-pink-400/80'; // Alkaline with phenolphthalein is pink
 if (drops >= ENDPOINT) {
 solutionColor = 'bg-transparent'; // Colorless when neutralized/acidic
 }

 return (
 <div className="lg:overflow-y-auto flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.s8neutralization_act_7_3_neutralization_reactio')} subtitle={t('lab.subtitle_titration_naoh_with')} />

 <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 max-w-6xl mx-auto w-full">
 
 <div className="flex-1 bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border p-6 flex flex-col items-center justify-center relative ">
 
 <div className="absolute top-4 left-4 bg-amber-100 border border-amber-300 text-amber-800 px-4 py-2 rounded-lg flex gap-2 items-center text-sm font-bold shadow-sm dark:text-[#ffffff]">
 <AlertTriangle className="w-5 h-5 text-amber-500" />
 
 {t('lab.s8neutralization_teacher_demonstration_only_cor')}
 </div>

 <div className="relative w-64 h-96 flex flex-col items-center mt-12">
 
 {/* Burette (HCl) */}
 <div className="absolute top-0 w-8 h-48 border-x-2 border-t-2 border-slate-300 dark:border-[#1c1b1b] rounded-t-sm flex flex-col items-center bg-slate-50 dark:bg-[#121212]/50 backdrop-blur-sm z-20">
 {/* Markings */}
 {[1,2,3,4,5,6,7].map(m => <div key={m} className="w-full border-b border-slate-300 dark:border-[#1c1b1b]/50 flex-1" />)}
 {/* Fluid */}
 <div className="absolute bottom-0 w-full bg-slate-200 dark:bg-[#121212]/50 transition-all duration-300" style={{ height: `${100 - (drops * 5)}%` }} />
 {/* Stopcock */}
 <div className="absolute -bottom-4 w-12 h-4 bg-slate-400 dark:bg-[#121212] rounded-sm z-30" />
 {/* Droplet */}
 {isAdding && (
 <div className="absolute -bottom-16 w-3 h-3 bg-slate-200 dark:bg-[#121212] rounded-full animate-[fall_0.5s_linear_forwards]" />
 )}
 <div className="absolute -right-24 top-4 text-xs font-bold text-slate-500 dark:text-[#71717a]">{t('lab.s8neutralization_hcl_acid')}</div>
 </div>

 {/* Flask (NaOH + Indicator) */}
 <div className="absolute bottom-0 w-32 h-32 border-4 border-slate-300 dark:border-[#1c1b1b] rounded-b-[40px] rounded-t-sm bg-slate-50 dark:bg-[#121212]/50 shadow-inner z-10 flex flex-col justify-end overflow-hidden">
 <div className={`w-full h-full transition-colors duration-1000 ${solutionColor}`} />
 <div className="absolute -right-32 bottom-8 text-xs font-bold text-slate-500 dark:text-[#71717a] text-center">{t('lab.s8neutralization_naoh_base')}<br/>{t('lab.s8neutralization_phenolphthalein')}</div>
 </div>
 {/* Flask Neck */}
 <div className="absolute bottom-32 w-10 h-10 border-x-4 border-slate-300 dark:border-[#1c1b1b] z-10 bg-slate-50 dark:bg-[#121212]/50" />

 </div>

 <div className="mt-8 text-center">
 <button 
 onClick={addDrop}
 disabled={isAdding || drops >= ENDPOINT + 3}
 className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 text-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
 >
 
 {t('lab.s8neutralization_add_drop_of_acid')}
 </button>
 <p className="mt-2 font-bold font-mono" style={{color: 'rgb(var(--slate-500))'}}>{t('lab.s8neutralization_drops_added')} {drops}</p>
 {drops > 0 && (
 <button onClick={() => { setDrops(0); setIsAdding(false); }} className="mt-2 text-sm text-slate-400 hover:text-slate-600 dark:text-[#a1a1aa] underline">{t('lab.s8neutralization_reset')}</button>
 )}
 </div>

 {drops >= ENDPOINT && (
 <div className="mt-6 px-6 py-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-center animate-fade-in max-w-sm">
 <h3 className="font-bold text-lg mb-1">{t('lab.s8neutralization_end_point_reached')}</h3>
 <p className="text-sm">
 
 {t('lab.s8neutralization_the_pink_color_completely_disa')}
 </p>
 </div>
 )}

 </div>
 </div>
 <style dangerouslySetInnerHTML={{__html: `
 @keyframes fall { from { transform: translateY(0); opacity: 1; } to { transform: translateY(80px); opacity: 0; } }
 `}} />
 </div>
 );
}
