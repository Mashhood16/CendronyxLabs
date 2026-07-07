import { useState } from 'react';
import { Droplets, Beaker, RefreshCw } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps { onExit?: () => void; }

export default function LabS8Toothpaste({ onExit }: LabProps) {
    const { t } = useTranslate();
 const [ingredients, setIngredients] = useState({
 glycerin: 0,
 bakingSoda: 0,
 salt: 0,
 peppermint: 0
 });

 const totalAdded = ingredients.glycerin + ingredients.bakingSoda + ingredients.salt + (ingredients.peppermint * 0.1);
 const target = 2 + 3 + 1 + 0.5; // roughly 6.5 units
 
 const progress = Math.min(100, (totalAdded / target) * 100);
 
 // Perfect mix check
 const isPerfect = ingredients.glycerin === 2 && ingredients.bakingSoda === 3 && ingredients.salt === 1 && ingredients.peppermint === 5;
 const isMixed = progress >= 80;

 const handleReset = () => {
 setIngredients({ glycerin: 0, bakingSoda: 0, salt: 0, peppermint: 0 });
 };

 return (
 <div className="lg:overflow-y-auto flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.s8toothpaste_act_11_1_diy_toothpaste')} subtitle={t('lab.subtitle_household_ingredients_formulate')} rightContent={<button onClick={handleReset} className="flex items-center gap-2 bg-slate-200 dark:bg-[#121212] px-4 py-2 rounded-md font-medium hover:bg-slate-300 dark:bg-slate-700"><RefreshCw className="w-4 h-4" />  {t('lab.s8toothpaste_reset')}</button>} />

  <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 max-w-5xl mx-auto w-full">
  
  {/* Ingredients Panel */}
  <div className="w-full md:w-80 flex flex-col gap-4">
   <h3 className="font-bold text-slate-700 dark:text-[#ffffff]">{t('lab.s8toothpaste_add_ingredients')}</h3>
   
   <div className="bg-slate-50 dark:!bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] shadow-sm flex flex-col gap-2">
   <div className="flex justify-between font-bold text-sm">
    <span>{t('lab.s8toothpaste_glycerin_tsp')}</span>
    <span className="text-blue-600">{ingredients.glycerin} / 2</span>
   </div>
   <button 
    onClick={() => setIngredients({...ingredients, glycerin: Math.min(5, ingredients.glycerin + 1)})}
    className="w-full py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium flex justify-center items-center gap-2"
   >
    <Droplets className="w-4 h-4" />  {t('lab.s8toothpaste_add_1_tsp')}
                            </button>
   </div>

   <div className="bg-slate-50 dark:!bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] shadow-sm flex flex-col gap-2">
   <div className="flex justify-between font-bold text-sm">
    <span>{t('lab.s8toothpaste_baking_soda_tsp')}</span>
    <span className="text-zinc-600">{ingredients.bakingSoda} / 3</span>
   </div>
   <button 
    onClick={() => setIngredients({...ingredients, bakingSoda: Math.min(6, ingredients.bakingSoda + 1)})}
    className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg font-medium flex justify-center items-center gap-2"
   >
    <Beaker className="w-4 h-4" />  {t('lab.s8toothpaste_add_1_tsp')}
                            </button>
   </div>

   <div className="bg-slate-50 dark:!bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] shadow-sm flex flex-col gap-2">
   <div className="flex justify-between font-bold text-sm">
    <span>{t('lab.s8toothpaste_salt_pinches')}</span>
    <span className="text-slate-600 dark:text-[#a1a1aa]">{ingredients.salt} / 1</span>
   </div>
   <button 
    onClick={() => setIngredients({...ingredients, salt: Math.min(3, ingredients.salt + 1)})}
    className="w-full py-2 bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg font-medium flex justify-center items-center gap-2"
   >
    
                             {t('lab.s8toothpaste_add_pinch')}
                            </button>
   </div>

   <div className="bg-slate-50 dark:!bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] shadow-sm flex flex-col gap-2">
   <div className="flex justify-between font-bold text-sm">
    <span>{t('lab.s8toothpaste_peppermint_oil_drops')}</span>
    <span className="text-emerald-600">{ingredients.peppermint} / 5</span>
   </div>
   <button 
    onClick={() => setIngredients({...ingredients, peppermint: Math.min(10, ingredients.peppermint + 1)})}
    className="w-full py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg font-medium flex justify-center items-center gap-2"
   >
    <Droplets className="w-4 h-4" />  {t('lab.s8toothpaste_add_1_drop')}
                            </button>
   </div>
  </div>

  {/* Mixing Bowl Area */}
  <div className="flex-1 bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-8 flex flex-col items-center relative overflow-hidden h-[500px] justify-center">
   
   {/* Progress Bar */}
   <div className="absolute top-6 left-1/2 -translate-x-1/2 w-3/4 max-w-md h-4 bg-slate-100 dark:bg-[#121212] rounded-full border border-slate-200 dark:border-[#1c1b1b] overflow-hidden">
    <div className="h-full bg-blue-500 transition-all duration-500 dark:bg-teal-950/20 dark:border-teal-900" style={{ width: `${progress}%` }} />
   </div>

   {/* The Mortar/Bowl */}
   <div className="relative mt-12 w-64 h-48">
   <div className="absolute inset-0 bg-slate-200 dark:!bg-[#121212] rounded-[50%] shadow-[inset_0_-20px_30px_rgba(0,0,0,0.1)] border-b-8 border-slate-300 dark:border-[#1c1b1b]" />
   <div className="absolute top-2 left-2 right-2 bottom-6 bg-slate-300 dark:!bg-[#121212] rounded-[50%] shadow-[inset_0_20px_30px_rgba(0,0,0,0.1)] overflow-hidden flex items-end justify-center pb-4">
    {/* Paste visualization */}
    <div 
     className="w-32 bg-slate-50 dark:bg-[#121212] rounded-full transition-all duration-700 shadow-inner"
     style={{ 
     height: `${Math.max(10, progress * 0.8)}%`,
     backgroundColor: isMixed ? '#f8fafc' : '#e2e8f0'
     }}
    />
   </div>
   {/* Pestle */}
   <div className="absolute -top-12 left-1/2 w-6 h-32 bg-amber-700 rounded-full rotate-[15deg] shadow-lg origin-bottom transition-transform duration-300 hover:rotate-[-15deg] hover:-translate-x-4 z-10 dark:bg-amber-600 dark:hover:bg-amber-500 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40" />
   </div>

   <div className="mt-12 text-center max-w-sm">
   {isPerfect ? (
    <div className="bg-emerald-100 text-emerald-800 p-4 rounded-xl border border-emerald-200 font-bold animate-pulse">
     
                                  {t('lab.s8toothpaste_perfect_formula_you_have_creat')}
                                 </div>
   ) : progress > 100 ? (
    <div className="bg-red-100 text-red-800 p-4 rounded-xl border border-red-200 font-bold">
     
                                      {t('lab.s8toothpaste_too_much_stick_to_the_recipe_m')}
                                     </div>
   ) : isMixed ? (
    <div className="bg-blue-100 text-blue-800 p-4 rounded-xl border border-blue-200 font-bold dark:text-[#ffffff]">
     
                                          {t('lab.s8toothpaste_almost_there_check_your_measur')}
                                         </div>
   ) : (
    <div className="font-medium" style={{color: 'rgb(var(--slate-500))'}}>
     
                                              {t('lab.s8toothpaste_add_ingredients_to_the_mortar_')}
                                             </div>
    )}
   </div>

  </div>
  </div>
 </div>
 );
}
