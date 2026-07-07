import { useState } from 'react';
import { Check} from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabS8HumanVariationsProps {
 onExit?: () => void;
}

interface Trait {
 id: string;
 name: string;
 type: 'continuous' | 'discontinuous';
}

const TRAITS: Trait[] = [
 { id: 't1', name: 'Blood Group (A, B, AB, O)', type: 'discontinuous' },
 { id: 't2', name: 'Height (cm)', type: 'continuous' },
 { id: 't3', name: 'Tongue Rolling (Yes/No)', type: 'discontinuous' },
 { id: 't4', name: 'Skin Color', type: 'continuous' },
 { id: 't5', name: 'Ear Lobes (Free/Attached)', type: 'discontinuous' },
 { id: 't6', name: 'Body Weight (kg)', type: 'continuous' },
];

export default function LabS8HumanVariations({ onExit }: LabS8HumanVariationsProps) {
    const { t } = useTranslate();
 const [items, setItems] = useState<Trait[]>(TRAITS);
 const [continuous, setContinuous] = useState<Trait[]>([]);
 const [discontinuous, setDiscontinuous] = useState<Trait[]>([]);
 const [errorMsg, setErrorMsg] = useState<string>('');

 const handleDrop = (trait: Trait, targetCategory: 'continuous' | 'discontinuous') => {
 if (trait.type !== targetCategory) {
  setErrorMsg(`Incorrect! ${trait.name} is a ${trait.type} variation.`);
  setTimeout(() => setErrorMsg(''), 2000);
  return;
 }

 setItems(prev => prev.filter(t => t.id !== trait.id));
 
 if (targetCategory === 'continuous') {
  setContinuous(prev => [...prev, trait]);
 } else {
  setDiscontinuous(prev => [...prev, trait]);
 }
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.s8humanvariations_act_3_2_human_variations')} subtitle={t('lab.subtitle_sort_traits_their')} />

  <div className="flex-1 p-6 max-w-5xl mx-auto w-full flex flex-col">
  
  {/* Unsorted Items */}
  <div className="mb-8">
   <h2 className="text-lg font-bold text-slate-700 dark:text-[#ffffff] mb-4 text-center">{t('lab.s8humanvariations_unsorted_traits_click_to_assig')}</h2>
   <div className="flex flex-wrap gap-3 justify-center">
   {items.map(trait => (
    <div 
    key={trait.id}
    className="bg-slate-50 dark:!bg-[#121212] border-2 border-slate-300 dark:border-[#1c1b1b] shadow-sm px-4 py-2 rounded-lg font-medium text-slate-700 dark:text-[#ffffff] flex flex-col gap-2 min-w-[200px]"
    >
    <span className="text-center">{trait.name}</span>
    <div className="flex gap-2">
     <button 
     onClick={() => handleDrop(trait, 'continuous')}
     className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-1 rounded text-xs font-bold transition-colors dark:bg-teal-950/20 dark:border-teal-900"
     >
     
                        {t('lab.s8humanvariations_continuous')}
                        </button>
     <button 
     onClick={() => handleDrop(trait, 'discontinuous')}
     className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 py-1 rounded text-xs font-bold transition-colors dark:bg-[#121212] dark:border-[#1c1b1b]"
     >
     
                        {t('lab.s8humanvariations_discontinuous')}
                        </button>
    </div>
    </div>
   ))}
   {items.length === 0 && (
    <div className="text-green-600 font-bold text-lg flex items-center gap-2 bg-green-50 px-6 py-3 rounded-full border border-green-200 dark:bg-[#121212] dark:border-[#1c1b1b]">
    <CheckCircle2 className="w-6 h-6" />  {t('lab.s8humanvariations_all_traits_sorted_correctly')}
                                 </div>
   )}
   </div>
  </div>

  {errorMsg && (
   <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold text-center mb-6 max-w-md mx-auto animate-bounce">
   {errorMsg}
   </div>
  )}

  {/* Categories */}
  <div className="flex flex-col md:flex-row gap-6 flex-1">
   
   {/* Continuous */}
   <div className="flex-1 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 flex flex-col shadow-inner dark:bg-teal-950/20 dark:border-teal-900">
   <h3 className="font-bold text-blue-900 text-xl mb-2 text-center border-b border-blue-200 pb-2 dark:text-[#ffffff]">{t('lab.s8humanvariations_continuous_variation')}</h3>
   <p className="text-sm text-blue-700 text-center mb-6">{t('lab.s8humanvariations_traits_that_change_gradually_o')}</p>
   
   <div className="flex-1 flex flex-col gap-3">
    {continuous.map(trait => (
    <div key={trait.id} className="bg-slate-50 dark:!bg-[#121212] px-4 py-3 rounded-lg border border-blue-300 shadow-sm text-blue-900 font-medium flex items-center justify-between dark:text-[#ffffff]">
     {trait.name} <Check className="w-4 h-4 text-green-500" />
    </div>
    ))}
   </div>
   </div>

   {/* Discontinuous */}
   <div className="flex-1 bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-6 flex flex-col shadow-inner dark:bg-[#121212] dark:border-[#1c1b1b]">
   <h3 className="font-bold text-indigo-900 text-xl mb-2 text-center border-b border-indigo-200 pb-2 dark:text-[#ffffff]">{t('lab.s8humanvariations_discontinuous_variation')}</h3>
   <p className="text-sm text-indigo-700 text-center mb-6">{t('lab.s8humanvariations_traits_that_fall_into_distinct')}</p>
   
   <div className="flex-1 flex flex-col gap-3">
    {discontinuous.map(trait => (
    <div key={trait.id} className="bg-slate-50 dark:!bg-[#121212] px-4 py-3 rounded-lg border border-indigo-300 shadow-sm text-indigo-900 font-medium flex items-center justify-between dark:text-[#ffffff]">
     {trait.name} <Check className="w-4 h-4 text-green-500" />
    </div>
    ))}
   </div>
   </div>

  </div>

  </div>
 </div>
 );
}

function CheckCircle2(props: any) {
 return <Check {...props} />;
}
