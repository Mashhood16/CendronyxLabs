import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabS7MineralsPlantGrowth({ onExit }: LabProps) {
 const { t } = useTranslate();
 const [weeks, setWeeks] = useState(0);
 const [running, setRunning] = useState(false);

 useEffect(() => {
 let interval: number;
 if (running && weeks < 4) {
 interval = window.setInterval(() => {
 setWeeks(w => Math.min(4, w + 1));
 }, 1000);
 } else if (weeks === 4) {
 setRunning(false);
 }
 return () => clearInterval(interval);
 }, [running, weeks]);

 // Scale calculations
 const baseScale = 1;
 const compostScale = baseScale + weeks * 0.4; // Grows fast
 const sandScale = baseScale + weeks * 0.1; // Stunted growth

 return (
 <div className="flex flex-col min- bg-orange-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.s7mineralsplantgrowth_unit_1_minerals_and_plant_grow')} />

 <div className="flex-1 p-8 flex flex-col items-center">
 <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-orange-100 max-w-2xl w-full text-center mb-8">
 <h2 className="text-2xl font-bold text-orange-800 mb-4">{t('lab.s7mineralsplantgrowth_testing_soil_nutrients')}</h2>
 <p className="text-slate-600 dark:text-[#a1a1aa] mb-6">{t('lab.s7mineralsplantgrowth_observe_two_identical_seedling')}</p>
 
 <div className="flex justify-center gap-4">
 <button 
 onClick={() => setRunning(!running)}
 disabled={weeks === 4}
 className="flex items-center px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 font-medium dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40"
 >
 <Clock className="w-5 h-5 mr-2" />
 {running ? 'Pause' : weeks === 4 ? 'Experiment Complete' : 'Run 4-Week Trial'}
 </button>
 <button 
 onClick={() => { setWeeks(0); setRunning(false); }}
 className="flex items-center px-6 py-2 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg hover:bg-slate-300 dark:bg-[#121212] font-medium"
 >
 
 {t('lab.s7mineralsplantgrowth_reset')}
 </button>
 </div>
 <div className="mt-4 font-bold text-lg text-slate-700 dark:text-[#ffffff]">{t('lab.s7mineralsplantgrowth_time_elapsed')} {weeks} {t('lab.s7mineralsplantgrowth_weeks')}</div>
 </div>

 <div className="flex gap-20 items-end justify-center mt-12">
 
 {/* Bottle A (Sand) */}
 <div className="flex flex-col items-center">
 <div className="relative w-32 h-64 flex flex-col items-center">
 
 {/* Plant (Stunted) */}
 <div 
 className="absolute bottom-40 transform-origin-bottom transition-transform duration-1000 ease-in-out z-20 flex flex-col items-center"
 style={{ transform: `scale(${sandScale})`, transformOrigin: 'bottom center' }}
 >
 <div className="w-2 h-16 bg-green-500 relative dark:bg-[#121212] dark:border-[#1c1b1b]">
 <div className="absolute top-2 -left-4 w-6 h-3 bg-yellow-300 rounded-full rotate-[-30deg]"></div>
 <div className="absolute top-8 -right-4 w-6 h-3 bg-green-400 rounded-full rotate-[30deg] dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"></div>
 </div>
 </div>

 {/* Top Half (Inverted) */}
 <div className="absolute bottom-16 w-32 h-24 border-t border-l border-r border-slate-300 dark:border-[#1c1b1b]/50 bg-slate-50 dark:bg-[#121212]/20 backdrop-blur-sm z-10 flex justify-center">
 {/* Sand */}
 <div className="absolute bottom-0 w-24 h-20 bg-amber-200 border-t-8 border-amber-300/50 rounded-b-xl" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }}></div>
 {/* Wick */}
 <div className="absolute -bottom-4 w-2 h-8 bg-slate-100 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b]"></div>
 </div>

 {/* Bottom Half (Reservoir) */}
 <div className="absolute bottom-0 w-32 h-20 border-b-2 border-l-2 border-r-2 border-slate-300 dark:border-[#1c1b1b]/80 bg-blue-50/50 rounded-b-xl dark:bg-teal-950/20 dark:border-teal-900">
 <div className="absolute bottom-0 w-full h-12 bg-blue-300/50 rounded-b-lg"></div>
 </div>
 </div>
 <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mt-4 text-center">{t('lab.s7mineralsplantgrowth_bottle_a')}<br/><span className="text-sm font-medium text-amber-600 dark:text-amber-400">{t('lab.s7mineralsplantgrowth_pure_sand')}</span></h3>
 </div>

 {/* Bottle B (Compost Mix) */}
 <div className="flex flex-col items-center">
 <div className="relative w-32 h-64 flex flex-col items-center">
 
 {/* Plant (Healthy) */}
 <div 
 className="absolute bottom-40 transform-origin-bottom transition-transform duration-1000 ease-in-out z-20 flex flex-col items-center"
 style={{ transform: `scale(${compostScale})`, transformOrigin: 'bottom center' }}
 >
 <div className="w-2 h-16 bg-green-700 relative">
 <div className="absolute top-2 -left-6 w-8 h-4 bg-green-600 rounded-full rotate-[-30deg] dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"></div>
 <div className="absolute top-6 -right-6 w-8 h-4 bg-green-600 rounded-full rotate-[30deg] dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"></div>
 <div className="absolute top-10 -left-5 w-6 h-3 bg-green-500 rounded-full rotate-[-20deg] dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"></div>
 <div className="absolute top-12 -right-5 w-6 h-3 bg-green-500 rounded-full rotate-[20deg] dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"></div>
 </div>
 </div>

 {/* Top Half (Inverted) */}
 <div className="absolute bottom-16 w-32 h-24 border-t border-l border-r border-slate-300 dark:border-[#1c1b1b]/50 bg-slate-50 dark:bg-[#121212]/20 backdrop-blur-sm z-10 flex justify-center">
 {/* Compost */}
 <div className="absolute bottom-0 w-24 h-20 bg-stone-800 border-t-8 border-stone-900 rounded-b-xl" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }}></div>
 {/* Wick */}
 <div className="absolute -bottom-4 w-2 h-8 bg-slate-100 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b]"></div>
 </div>

 {/* Bottom Half (Reservoir) */}
 <div className="absolute bottom-0 w-32 h-20 border-b-2 border-l-2 border-r-2 border-slate-300 dark:border-[#1c1b1b]/80 bg-blue-50/50 rounded-b-xl dark:bg-teal-950/20 dark:border-teal-900">
 <div className="absolute bottom-0 w-full h-12 bg-blue-300/50 rounded-b-lg"></div>
 </div>
 </div>
 <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mt-4 text-center">{t('lab.s7mineralsplantgrowth_bottle_b')}<br/><span className="text-sm font-medium text-stone-600 dark:text-stone-400">{t('lab.s7mineralsplantgrowth_compost_soil_mix')}</span></h3>
 </div>

 </div>

 {weeks === 4 && (
 <div className="mt-12 p-6 bg-slate-50 dark:!bg-[#121212] shadow-lg text-slate-800 dark:text-[#ffffff] rounded-xl border-t-4 border-orange-500 max-w-xl">
 <h4 className="font-bold text-lg mb-2">{t('lab.s7mineralsplantgrowth_conclusion')}</h4>
 <p>{t('lab.s7mineralsplantgrowth_the_plant_in_the')} <strong>{t('lab.s7mineralsplantgrowth_compost_soil_mix_1')}</strong> {t('lab.s7mineralsplantgrowth_grew_significantly_larger_and_')}</p>
 </div>
 )}
 </div>
 </div>
 );
}
