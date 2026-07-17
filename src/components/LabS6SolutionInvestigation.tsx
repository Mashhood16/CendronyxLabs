import { useState, useEffect } from 'react';
import { Flame, Snowflake } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabS6SolutionInvestigation({ onExit }: LabProps) {
 const { t } = useTranslate();
 const [temperature, setTemperature] = useState(25);
 const [running, setRunning] = useState(false);
 const [substance, setSubstance] = useState<'none' | 'NaOH' | 'NH4NO3'>('none');
 const [progress, setProgress] = useState(0);

 useEffect(() => {
 let interval: any;
 if (running && progress < 100) {
 interval = setInterval(() => {
 setProgress(p => p + 2);
 
 // Exothermic (NaOH) increases temp, Endothermic (NH4NO3) decreases temp
 if (substance === 'NaOH') {
 setTemperature(t => Math.min(t + 0.5, 45));
 } else if (substance === 'NH4NO3') {
 setTemperature(t => Math.max(t - 0.3, 10));
 }

 }, 100);
 } else if (progress >= 100) {
 setRunning(false);
 }
 return () => clearInterval(interval);
 }, [running, progress, substance]);

 const runExperiment = (type: 'NaOH' | 'NH4NO3') => {
 setSubstance(type);
 setTemperature(25);
 setProgress(0);
 setRunning(true);
 };

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.s6solutioninvestigation_unit_7_exothermic_endothermic_')} />

 <div className="flex-1 flex flex-col p-8 items-center lg:overflow-y-auto">
 <div className="w-full max-w-5xl bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-8 flex gap-8">
 
 {/* Controls */}
 <div className="w-1/2 flex flex-col justify-between">
 <div>
 <h2 className="text-2xl font-bold text-slate-800 dark:text-[#ffffff] mb-4">{t('lab.s6solutioninvestigation_temperature_changes_during_dis')}</h2>
 <p className="text-slate-600 dark:text-[#a1a1aa] mb-8 leading-relaxed">
 
 {t('lab.s6solutioninvestigation_some_substances_release_heat_w')}
 </p>

 <div className="space-y-4">
 <button 
 onClick={() => runExperiment('NaOH')}
 disabled={running}
 className="w-full p-4 border-2 border-slate-200 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#000000] hover:bg-slate-100 dark:bg-[#1c1b1b] rounded-xl flex items-center gap-4 text-left transition-colors disabled:opacity-50 dark:border-[#1c1b1b] dark:bg-[#121212] dark:hover:bg-slate-700"
 >
 <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shrink-0"><Flame className="w-6 h-6" /></div>
 <div>
 <h3 className="font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.s6solutioninvestigation_dissolve_sodium_hydroxide_naoh')}</h3>
 <p className="text-xs text-slate-600 dark:text-[#71717a]">{t('lab.s6solutioninvestigation_observe_what_happens_to_the_te')}</p>
 </div>
 </button>

 <button 
 onClick={() => runExperiment('NH4NO3')}
 disabled={running}
 className="w-full p-4 border-2 border-slate-200 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#000000] hover:bg-slate-100 dark:bg-[#1c1b1b] rounded-xl flex items-center gap-4 text-left transition-colors disabled:opacity-50 dark:border-[#1c1b1b] dark:bg-[#121212] dark:hover:bg-slate-700"
 >
 <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shrink-0 dark:bg-teal-950/20 dark:border-teal-900"><Snowflake className="w-6 h-6" /></div>
 <div>
 <h3 className="font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.s6solutioninvestigation_dissolve_ammonium_nitrate_nh_n')}</h3>
 <p className="text-xs text-slate-600 dark:text-[#71717a]">{t('lab.s6solutioninvestigation_observe_what_happens_to_the_te')}</p>
 </div>
 </button>
 </div>
 </div>

 {progress === 100 && (
 <div className="mt-8 p-6 bg-slate-100 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-xl">
 <h3 className="font-bold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.s6solutioninvestigation_conclusion')}</h3>
 {substance === 'NaOH' ? (
 <p className="text-sm text-slate-700 dark:text-[#ffffff]">{t('lab.s6solutioninvestigation_the_temperature_increased_this')} <strong>{t('lab.s6solutioninvestigation_exothermic')}</strong> {t('lab.s6solutioninvestigation_process_because_heat_energy_wa')}</p>
 ) : (
 <p className="text-sm text-slate-700 dark:text-[#ffffff]">{t('lab.s6solutioninvestigation_the_temperature_decreased_this')} <strong>{t('lab.s6solutioninvestigation_endothermic')}</strong> {t('lab.s6solutioninvestigation_process_because_heat_energy_wa_1')}</p>
 )}
 </div>
 )}
 </div>

 {/* Apparatus */}
 <div className="w-1/2 bg-slate-100 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] p-8 flex items-center justify-center relative">
 
 {/* Thermometer */}
 <div className="absolute right-12 top-12 h-64 w-12 bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded-full flex flex-col items-center py-2 shadow-sm z-20">
 <span className="text-xs font-bold text-slate-500 dark:text-[#71717a] mb-2">°C</span>
 <div className="flex-1 w-2 bg-slate-200 dark:bg-[#121212] rounded-full relative flex flex-col-reverse justify-start">
 {/* Thermometer Liquid */}
 <div 
 className="w-full rounded-full transition-all duration-300 bg-red-500 dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40" 
 style={{ height: `${(temperature / 50) * 100}%` }}
 ></div>
 </div>
 <div className="w-6 h-6 rounded-full bg-red-500 mt-1 shadow-inner"></div>
 </div>
 
 {/* Temperature Display */}
 <div className="absolute right-12 bottom-12 bg-slate-50 dark:bg-[#121212] px-4 py-2 rounded-lg font-black text-2xl text-slate-800 dark:text-[#ffffff] shadow border border-slate-200 dark:border-[#1c1b1b] min-w-[80px] text-center">
 {temperature.toFixed(1)}°
 </div>

 {/* Beaker */}
 <div className="relative mt-24">
 {/* Pouring animation */}
 {running && progress < 50 && (
 <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-4 bg-slate-300 dark:bg-[#121212]/80 animate-pulse" style={{ height: '96px' }}></div>
 )}

 <div className="w-48 h-48 border-b-4 border-l-4 border-r-4 border-slate-300 dark:border-[#1c1b1b] rounded-b-3xl relative flex items-end justify-center bg-slate-50 dark:!bg-[#121212] shadow-sm overflow-hidden z-10">
 {/* Water */}
 <div className={`w-full absolute bottom-0 transition-all duration-300 ${substance === 'NaOH' && progress > 0 ? 'bg-red-500/20' : substance === 'NH4NO3' && progress > 0 ? 'bg-blue-500/20' : 'bg-blue-300/30'}`} style={{ height: '70%' }}>
 
 {/* Dissolving particles */}
 {running && (
 <div className="absolute inset-0 flex flex-wrap content-center justify-center p-4 gap-2 opacity-50">
 {[...Array(20)].map((_, i) => (
 <div key={i} className={`w-2 h-2 rounded-full animate-ping ${substance === 'NaOH' ? 'bg-red-500' : 'bg-blue-500'}`} style={{ animationDelay: `${Math.random() * 2}s` }}></div>
 ))}
 </div>
 )}

 </div>
 </div>
 </div>

 </div>

 </div>
 </div>
 </div>
 );
}
