import { useState } from 'react';
import {ThermometerSun, Info } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps { onExit?: () => void; }

export default function LabS8MakingYogurt({ onExit }: LabProps) {
    const { t } = useTranslate();
 const [step, setStep] = useState(0);

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.s8makingyogurt_act_4_1_making_of_yogurt')} subtitle={t('lab.subtitle_observe_bacterial_fermentation')} />

  <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full">
  <div className="flex-1 bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col items-center justify-center">
   
   <div className="relative w-64 h-64 flex justify-center items-end border-b-4 border-slate-300 dark:border-[#1c1b1b] pb-2">
   
   {/* Stove/Heat */}
   {step === 1 && (
    <div className="absolute -bottom-4 w-40 flex justify-center gap-2 animate-pulse text-orange-500">
    <ThermometerSun className="w-8 h-8" />
    </div>
   )}

   {/* Pot */}
   <div className="w-48 h-32 border-4 border-slate-400 dark:border-[#1c1b1b] rounded-b-3xl rounded-t-sm relative overflow-hidden bg-slate-100 dark:bg-[#121212] flex flex-col justify-end z-10">
    
    {/* Liquid Level */}
    <div 
    className={`w-full transition-all duration-1000 ${step >= 4 ? 'bg-amber-50 h-[80%]' : 'bg-slate-50 dark:bg-[#121212] h-[80%]'}`}
    >
    {step === 1 && (
     <div className="w-full h-full flex items-center justify-center animate-pulse opacity-50">
     <span className="text-2xl">🫧🫧</span>
     </div>
    )}
    {step >= 3 && (
     <div className="absolute inset-0 bg-yellow-900/10 transition-opacity duration-[3000ms]" style={{ opacity: step === 4 ? 1 : 0 }} />
    )}
    </div>
   </div>

   {/* Spoon adding yogurt starter */}
   {step === 2 && (
    <div className="absolute top-10 right-10 animate-bounce text-slate-600 dark:text-[#a1a1aa] text-4xl">
    🥄
    </div>
   )}

   {/* Towel Cover */}
   {step >= 3 && (
    <div className="absolute top-28 w-56 h-8 bg-indigo-200 rounded-full z-20 opacity-80" />
   )}

   </div>

   <div className="mt-12 w-full max-w-md">
   <button 
    onClick={() => setStep(s => Math.min(4, s + 1))}
    disabled={step === 4}
    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
   >
    {step === 0 && "1. Boil Milk (Sterilize)"}
    {step === 1 && "2. Cool & Add Yogurt Starter"}
    {step === 2 && "3. Cover with Towel"}
    {step === 3 && "4. Incubate 5 Hours (Ferment)"}
    {step === 4 && "Yogurt Complete!"}
   </button>
   </div>

  </div>

  <div className="w-full md:w-80 flex flex-col gap-4">
   <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 dark:bg-teal-950/20 dark:border-teal-900">
   <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2 dark:text-[#ffffff]">
    <Info className="w-5 h-5" />  {t('lab.s8makingyogurt_the_biology')}
                            </h3>
   <p className="text-sm text-blue-800 mb-2 dark:text-[#ffffff]">
    <strong>{t('lab.s8makingyogurt_boiling')}</strong>  {t('lab.s8makingyogurt_kills_off_unwanted_naturally_o')}
                            </p>
   <p className="text-sm text-blue-800 mb-2 dark:text-[#ffffff]">
    <strong>{t('lab.s8makingyogurt_starter')}</strong>  {t('lab.s8makingyogurt_we_add_existing_yogurt_because')} <em>{t('lab.s8makingyogurt_lactobacillus')}</em>  {t('lab.s8makingyogurt_bacteria')}
                            </p>
   <p className="text-sm text-blue-800 dark:text-[#ffffff]">
    <strong>{t('lab.s8makingyogurt_fermentation')}</strong>  {t('lab.s8makingyogurt_the_bacteria_eat_the_milk_suga')}
                            </p>
   </div>
  </div>
  </div>
 </div>
 );
}
