import { useState } from 'react';
import { Droplet } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabS7DiluteConcentratedSolutions({ onExit }: LabProps) {
 const { t } = useTranslate();
 const [syrupA, setSyrupA] = useState(1);
 const [syrupB, setSyrupB] = useState(3);

 // Colors based on concentration (more syrup = darker red)
 const getOpactiy = (syrup: number) => Math.min(1, syrup * 0.15 + 0.1);

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.s7diluteconcentratedsolutions_unit_7_dilute_and_concentrated')} />

 <div className="flex-1 p-8 flex flex-col items-center">
 <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] max-w-2xl w-full text-center mb-8">
 <h2 className="text-2xl font-bold text-red-800 mb-4">{t('lab.s7diluteconcentratedsolutions_making_sharbat_syrup_solutions')}</h2>
 <p className="text-slate-600 dark:text-[#a1a1aa] mb-6">{t('lab.s7diluteconcentratedsolutions_compare_two_solutions_you_can_')}</p>
 </div>

 <div className="flex gap-16 justify-center mt-12 w-full max-w-4xl">
 
 {/* Glass A */}
 <div className="flex flex-col items-center flex-1 bg-slate-50 dark:!bg-[#121212] p-8 rounded-3xl border border-slate-200 dark:border-[#1c1b1b] shadow-sm">
 <h3 className="text-xl font-bold text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.s7diluteconcentratedsolutions_glass_1')}</h3>
 <div className="text-sm font-bold px-3 py-1 bg-slate-100 dark:bg-[#121212] text-slate-500 dark:text-[#71717a] rounded-full mb-8 uppercase tracking-wider">
 {syrupA < 3 ? 'Dilute' : syrupA > 5 ? 'Highly Concentrated' : 'Concentrated'}
 </div>
 
 <div className="relative w-32 h-48 border-b-4 border-l-4 border-r-4 border-slate-300 dark:border-[#1c1b1b] rounded-b-xl flex items-end justify-center overflow-hidden mb-8 shadow-inner">
 <div 
 className="absolute bottom-0 w-full h-32 bg-red-600 transition-opacity duration-300 border-t-4 border-red-500/50"
 style={{ opacity: getOpactiy(syrupA) }}
 ></div>
 </div>

 <div className="flex items-center gap-4 w-full">
 <span className="text-slate-500 dark:text-[#71717a] font-bold whitespace-nowrap"><Droplet className="inline w-4 h-4 text-red-500" /> {t('lab.s7diluteconcentratedsolutions_syrup')}</span>
 <input 
 type="range" min="1" max="8" value={syrupA} onChange={e => setSyrupA(parseInt(e.target.value))}
 className="flex-1 accent-red-500"
 />
 <span className="font-bold text-slate-700 dark:text-[#ffffff] w-4">{syrupA}</span>
 </div>
 </div>

 {/* Glass B */}
 <div className="flex flex-col items-center flex-1 bg-slate-50 dark:!bg-[#121212] p-8 rounded-3xl border border-slate-200 dark:border-[#1c1b1b] shadow-sm">
 <h3 className="text-xl font-bold text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.s7diluteconcentratedsolutions_glass_2')}</h3>
 <div className="text-sm font-bold px-3 py-1 bg-slate-100 dark:bg-[#121212] text-slate-500 dark:text-[#71717a] rounded-full mb-8 uppercase tracking-wider">
 {syrupB < 3 ? 'Dilute' : syrupB > 5 ? 'Highly Concentrated' : 'Concentrated'}
 </div>
 
 <div className="relative w-32 h-48 border-b-4 border-l-4 border-r-4 border-slate-300 dark:border-[#1c1b1b] rounded-b-xl flex items-end justify-center overflow-hidden mb-8 shadow-inner">
 <div 
 className="absolute bottom-0 w-full h-32 bg-red-600 transition-opacity duration-300 border-t-4 border-red-500/50"
 style={{ opacity: getOpactiy(syrupB) }}
 ></div>
 </div>

 <div className="flex items-center gap-4 w-full">
 <span className="text-slate-500 dark:text-[#71717a] font-bold whitespace-nowrap"><Droplet className="inline w-4 h-4 text-red-500" /> {t('lab.s7diluteconcentratedsolutions_syrup')}</span>
 <input 
 type="range" min="1" max="8" value={syrupB} onChange={e => setSyrupB(parseInt(e.target.value))}
 className="flex-1 accent-red-500"
 />
 <span className="font-bold text-slate-700 dark:text-[#ffffff] w-4">{syrupB}</span>
 </div>
 </div>

 </div>

 <div className="mt-8 p-6 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 rounded-xl border border-red-200 dark:border-red-900/50 text-center font-medium max-w-2xl">
 
 {t('lab.s7diluteconcentratedsolutions_a_solution_with_a_small_amount')} <strong>{t('lab.s7diluteconcentratedsolutions_dilute_solution')}</strong> {t('lab.s7diluteconcentratedsolutions_lighter_color_less_sweet_a_sol')} <strong>{t('lab.s7diluteconcentratedsolutions_concentrated_solution')}</strong> {t('lab.s7diluteconcentratedsolutions_darker_color_very_sweet')}
 </div>
 </div>
 </div>
 );
}
