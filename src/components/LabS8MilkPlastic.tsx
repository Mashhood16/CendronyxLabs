import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps { onExit?: () => void; }

export default function LabS8MilkPlastic({ onExit }: LabProps) {
 const { t } = useTranslate();
 const [vinegarDrops, setVinegarDrops] = useState(0);

 // Separation happens after 4 drops (cups) of vinegar
 const isSeparated = vinegarDrops >= 4;

 const handleReset = () => setVinegarDrops(0);

 return (
 <div className="lg:overflow-y-auto flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.s8milkplastic_act_11_3_plastic_from_milk')} subtitle={t('lab.subtitle_casein_polymer_extraction')} rightContent={<button onClick={handleReset} className="flex items-center gap-2 bg-slate-200 dark:bg-[#121212] px-4 py-2 rounded-md font-medium hover:bg-slate-300 dark:bg-slate-700"><RefreshCw className="w-4 h-4" /> {t('lab.s8milkplastic_reset')}</button>} />

 <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
 
 <div className="bg-slate-50 dark:!bg-[#121212] p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-[#1c1b1b] flex flex-col items-center w-full max-w-lg">
 
 <div className="relative w-48 h-48 mb-8">
 {/* Beaker */}
 <div className="absolute inset-0 bg-slate-100 dark:bg-[#121212]/50 rounded-b-[40px] border-4 border-t-0 border-slate-300 dark:border-[#1c1b1b] flex flex-col justify-end overflow-hidden z-10">
 {/* Milk / Liquid */}
 <div className={`w-full transition-all duration-1000 flex items-center justify-center ${isSeparated ? 'h-3/4 bg-yellow-100/80 backdrop-blur-sm' : 'h-3/4 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.05)]'}`} style={!isSeparated ? {backgroundColor: '#f8fafc'} : undefined}>
 
 {/* Curds (Casein) */}
 {isSeparated && (
 <div className="w-24 h-16 bg-slate-50 dark:!bg-[#121212] border border-slate-100 rounded-3xl animate-bounce shadow-md flex items-center justify-center flex-wrap gap-1 p-2">
 <div className="w-4 h-4 bg-slate-50 dark:bg-[#121212] rounded-full" />
 <div className="w-6 h-5 bg-slate-50 dark:bg-[#121212] rounded-full" />
 <div className="w-5 h-5 bg-slate-50 dark:bg-[#121212] rounded-full" />
 <div className="w-7 h-6 bg-slate-50 dark:bg-[#121212] rounded-full" />
 </div>
 )}
 </div>
 </div>

 {/* Vinegar Drop Animation (only while adding) */}
 {vinegarDrops > 0 && !isSeparated && (
 <div key={vinegarDrops} className="absolute left-1/2 -translate-x-1/2 top-[-20px] w-3 h-4 bg-amber-200/60 rounded-full animate-[drop_0.5s_ease-in]" />
 )}
 </div>

 <div className="flex flex-col items-center gap-4 w-full">
 <button 
 onClick={() => setVinegarDrops(v => v + 1)}
 disabled={isSeparated}
 className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-transform active:scale-95 ${isSeparated ? 'bg-slate-200 dark:bg-[#121212] text-slate-400' : 'bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300'}`}
 >
 
 {t('lab.s8milkplastic_add_vinegar')}{vinegarDrops}{t('lab.s8milkplastic_4_cups')}
 </button>

 {isSeparated && (
 <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl w-full">
 <h3 className="font-bold text-emerald-800 mb-2">{t('lab.s8milkplastic_reaction_complete')}</h3>
 <p className="text-sm text-emerald-700">{t('lab.s8milkplastic_the_acid_in_the_vinegar_separa')}</p>
 </div>
 )}
 </div>

 </div>

 </div>
 <style dangerouslySetInnerHTML={{__html: `
 @keyframes drop {
 0% { top: -40px; opacity: 1; }
 100% { top: 60px; opacity: 0; }
 }
 `}} />
 </div>
 );
}
