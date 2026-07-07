import { useState, useEffect } from 'react';
import { Clock, Search } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabS7CleaningCoins({ onExit }: LabProps) {
    const { t } = useTranslate();
 const [hours, setHours] = useState(0);
 const [running, setRunning] = useState(false);

 useEffect(() => {
 let interval: number;
 if (running && hours < 24) {
  interval = window.setInterval(() => {
  setHours(h => Math.min(24, h + 2));
  }, 300);
 } else if (hours === 24) {
  setRunning(false);
 }
 return () => clearInterval(interval);
 }, [running, hours]);

 // Effectiveness: Ketchup (acidic, high), Cola (acidic, med), Lemon (acidic, high), Vinegar+Salt (acidic+chloride, highest)
 const getTarnishOpacity = (effectiveness: number) => {
 // Starts at 1, goes down based on hours and effectiveness
 return Math.max(0, 1 - (hours / 24) * effectiveness);
 };

 return (
 <div className="flex flex-col min- lg: bg-amber-50 font-sans dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.s7cleaningcoins_unit_7_cleaning_coins_with_sol')} />

  <div className="flex-1 p-8 flex flex-col items-center">
  <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-amber-100 max-w-2xl w-full text-center mb-8">
   <h2 className="text-2xl font-bold text-amber-800 mb-4 dark:text-[#ffffff]">{t('lab.s7cleaningcoins_removing_copper_oxide_tarnish')}</h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] mb-6">{t('lab.s7cleaningcoins_four_heavily_tarnished_copper_')}</p>
   
   <div className="flex justify-center gap-4">
   <button 
    onClick={() => setRunning(!running)}
    disabled={hours === 24}
    className="flex items-center px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 font-medium dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40"
   >
    <Clock className="w-5 h-5 mr-2" />
    {running ? 'Pause Time' : hours === 24 ? 'Soak Complete' : 'Soak 24 Hours'}
   </button>
   <button 
    onClick={() => { setHours(0); setRunning(false); }}
    className="flex items-center px-6 py-2 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg hover:bg-slate-300 dark:bg-[#121212] font-medium"
   >
    
                             {t('lab.s7cleaningcoins_reset')}
                            </button>
   </div>
   <div className="mt-4 font-bold text-lg text-slate-700 dark:text-[#ffffff]">{t('lab.s7cleaningcoins_time_elapsed')} {hours}  {t('lab.s7cleaningcoins_hours')}</div>
  </div>

  <div className="flex gap-8 justify-center mt-12 w-full flex-wrap max-w-6xl">
   
   {[
   { name: 'Ketchup', effect: 0.8, color: 'bg-red-600' },
   { name: 'Cola', effect: 0.5, color: 'bg-amber-900' },
   { name: 'Lemon Juice', effect: 0.9, color: 'bg-yellow-400' },
   { name: 'Vinegar + Salt', effect: 1.0, color: 'bg-slate-200 dark:bg-[#121212]' },
   ].map((sol, idx) => (
   <div key={idx} className="flex flex-col items-center">
    <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mb-4">{sol.name}</h3>
    
    <div className="relative w-40 h-40 border-4 border-slate-300 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] rounded-full flex justify-center items-center shadow-inner overflow-hidden">
     {/* Liquid */}
     <div className={`absolute bottom-0 w-full h-full opacity-60 ${sol.color}`}></div>
     
     {/* Coin */}
     <div className="relative w-24 h-24 rounded-full border-2 border-amber-700 bg-amber-500 flex justify-center items-center shadow-lg z-10 overflow-hidden dark:bg-[#121212] dark:border-[#1c1b1b]">
     {/* The shiny coin underneath */}
     <div className="absolute inset-0 bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-400"></div>
     <div className="absolute inset-2 border border-amber-600/30 rounded-full flex items-center justify-center font-bold text-amber-700/50">1¢</div>
     
     {/* The Tarnish Overlay */}
     <div 
      className="absolute inset-0 bg-[#4a3b32] mix-blend-multiply transition-opacity duration-300"
      style={{ opacity: getTarnishOpacity(sol.effect) }}
     >
      {/* Tarnish texture dots */}
      <div className="w-full h-full opacity-50 bg-[radial-gradient(circle_at_20%_30%,_#2a1b12_1px,_transparent_1px)] bg-[length:4px_4px]"></div>
     </div>
     </div>
    </div>
   </div>
   ))}

  </div>

  {hours === 24 && (
   <div className="mt-12 p-6 bg-slate-50 dark:!bg-[#121212] shadow-lg text-slate-800 dark:text-[#ffffff] rounded-xl border-t-4 border-amber-500 max-w-2xl text-center">
   <h4 className="font-bold text-lg mb-2 flex justify-center items-center"><Search className="w-5 h-5 mr-2 text-amber-500" />  {t('lab.s7cleaningcoins_conclusion')}</h4>
   <p>{t('lab.s7cleaningcoins_the')} <strong>{t('lab.s7cleaningcoins_vinegar_and_salt')}</strong>  {t('lab.s7cleaningcoins_solution_cleaned_the_coin_comp')}</p>
   </div>
  )}
  </div>
 </div>
 );
}
