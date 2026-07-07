import { useState, useEffect } from 'react';
import { FastForward } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabS6PlantGrowth({ onExit }: LabProps) {
    const { t } = useTranslate();
 const [day, setDay] = useState(0);
 const [running, setRunning] = useState(false);

 useEffect(() => {
 let interval: any;
 if (running && day < 28) {
  interval = setInterval(() => {
  setDay(d => d + 1);
  }, 300);
 } else if (day >= 28) {
  setRunning(false);
 }
 return () => clearInterval(interval);
 }, [running, day]);

 const getGrowth = (pot: 'A' | 'B' | 'C', currentDay: number) => {
 // Pot A: No fertilizer (Control). Normal growth. Max height 10.
 // Pot B: 5mg fertilizer. Good growth. Max height 25.
 // Pot C: 10mg fertilizer. Excellent growth. Max height 35.
 
 if (currentDay < 3) return 0; // Germination
 
 let multiplier = 1;
 if (pot === 'B') multiplier = 2.5;
 if (pot === 'C') multiplier = 3.5;

 const baseGrowth = (currentDay - 3) * 0.4;
 return Math.min(baseGrowth * multiplier, 10 * multiplier);
 };

 const getLeaves = (height: number) => {
 return Math.floor(height / 2);
 };

 const handleStart = () => {
 if (day >= 28) setDay(0);
 setRunning(true);
 };

 return (
 <div className="lg:overflow-y-auto flex flex-col min- lg: bg-green-50 font-sans dark:!bg-[#000000] dark:border-[#1c1b1b] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.s6plantgrowth_unit_11_effect_of_fertilizers_')} />

  <div className="flex-1 flex flex-col p-8 items-center">
  
  <div className="w-full max-w-4xl bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] mb-8 flex items-center justify-between">
   <div>
    <h2 className="text-2xl font-bold text-green-800 dark:text-[#ffffff]">{t('lab.s6plantgrowth_time_lapse_simulator')}</h2>
    <p className="text-slate-600 dark:text-[#a1a1aa]">{t('lab.s6plantgrowth_observe_growth_over_4_weeks_28')}</p>
   </div>
   <div className="flex items-center gap-6">
   <div className="text-center">
    <div className="text-4xl font-black text-green-600">{day}</div>
    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('lab.s6plantgrowth_days')}</div>
   </div>
   <button 
    onClick={handleStart}
    disabled={running}
    className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl shadow-sm flex items-center gap-2 hover:bg-green-700 disabled:opacity-50 dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"
   >
    <FastForward className="w-5 h-5" /> {day >= 28 ? 'Restart Simulation' : 'Start Simulation'}
   </button>
   </div>
  </div>

  <div className="flex gap-12 items-end justify-center h-96 w-full max-w-4xl border-b-4 border-slate-300 dark:border-[#1c1b1b] pb-2 relative">
   
   {/* Pot A */}
   <div className="flex flex-col items-center">
   <div className="w-24 h-64 relative flex items-end justify-center mb-2">
    <div className="w-2 bg-green-500 rounded-t-full transition-all duration-300 relative flex flex-col-reverse items-center dark:bg-[#121212] dark:border-[#1c1b1b]" style={{ height: `${getGrowth('A', day)}%` }}>
     {/* Generate leaves based on height */}
     {[...Array(getLeaves(getGrowth('A', day)))].map((_, i) => (
     <div key={i} className={`absolute w-6 h-3 bg-green-500 rounded-full ${i % 2 === 0 ? 'left-2 rotate-12 origin-left' : 'right-2 -rotate-12 origin-right'}`} style={{ bottom: `${i * 10 + 5}px` }}></div>
     ))}
    </div>
   </div>
   <div className="w-32 h-24 bg-orange-800 rounded-b-xl border-t-8 border-orange-900 relative flex items-center justify-center">
    <div className="absolute -top-1 w-full text-center font-bold text-orange-200 bg-orange-950/50 text-xs py-1">{t('lab.s6plantgrowth_pot_a')}</div>
    <div className="text-center text-white/80 mt-2">
    <span className="font-bold block text-lg">{t('lab.s6plantgrowth_0_mg')}</span>
    <span className="text-xs">{t('lab.s6plantgrowth_control')}</span>
    </div>
   </div>
   </div>

   {/* Pot B */}
   <div className="flex flex-col items-center">
   <div className="w-24 h-64 relative flex items-end justify-center mb-2">
    <div className="w-2 bg-green-600 rounded-t-full transition-all duration-300 relative flex flex-col-reverse items-center" style={{ height: `${getGrowth('B', day)}%` }}>
     {[...Array(getLeaves(getGrowth('B', day)))].map((_, i) => (
     <div key={i} className={`absolute w-8 h-4 bg-green-600 rounded-full ${i % 2 === 0 ? 'left-2 rotate-12 origin-left' : 'right-2 -rotate-12 origin-right'}`} style={{ bottom: `${i * 12 + 5}px` }}></div>
     ))}
    </div>
   </div>
   <div className="w-32 h-24 bg-orange-800 rounded-b-xl border-t-8 border-orange-900 relative flex items-center justify-center">
    <div className="absolute -top-1 w-full text-center font-bold text-orange-200 bg-orange-950/50 text-xs py-1">{t('lab.s6plantgrowth_pot_b')}</div>
    <div className="text-center text-white/80 mt-2">
    <span className="font-bold block text-lg">{t('lab.s6plantgrowth_5_mg')}</span>
    <span className="text-xs">{t('lab.s6plantgrowth_fertilizer_day')}</span>
    </div>
   </div>
   </div>

   {/* Pot C */}
   <div className="flex flex-col items-center">
   <div className="w-24 h-64 relative flex items-end justify-center mb-2">
    <div className="w-3 bg-green-700 rounded-t-full transition-all duration-300 relative flex flex-col-reverse items-center" style={{ height: `${getGrowth('C', day)}%` }}>
     {[...Array(getLeaves(getGrowth('C', day)))].map((_, i) => (
     <div key={i} className={`absolute w-10 h-5 bg-green-700 rounded-full ${i % 2 === 0 ? 'left-2 rotate-12 origin-left' : 'right-2 -rotate-12 origin-right'}`} style={{ bottom: `${i * 15 + 5}px` }}></div>
     ))}
    </div>
   </div>
   <div className="w-32 h-24 bg-orange-800 rounded-b-xl border-t-8 border-orange-900 relative flex items-center justify-center">
    <div className="absolute -top-1 w-full text-center font-bold text-orange-200 bg-orange-950/50 text-xs py-1">{t('lab.s6plantgrowth_pot_c')}</div>
    <div className="text-center text-white/80 mt-2">
    <span className="font-bold block text-lg">{t('lab.s6plantgrowth_10_mg')}</span>
    <span className="text-xs">{t('lab.s6plantgrowth_fertilizer_day')}</span>
    </div>
   </div>
   </div>

  </div>

  {day >= 28 && (
   <div className="mt-8 p-6 bg-slate-50 dark:!bg-[#121212] border border-green-200 shadow-sm rounded-xl max-w-2xl w-full">
   <h3 className="font-bold text-lg text-green-800 mb-2 dark:text-[#ffffff]">{t('lab.s6plantgrowth_experiment_conclusion')}</h3>
   <p className="text-slate-600 dark:text-[#a1a1aa]">{t('lab.s6plantgrowth_the_plants_in_pot_c_10mg_ferti')}</p>
   </div>
  )}

  </div>
 </div>
 );
}
