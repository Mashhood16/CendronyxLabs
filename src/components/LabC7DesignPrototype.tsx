import { useState } from 'react';
import { CheckCircle, Droplets } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabC7DesignPrototype({ onExit }: LabProps) {
    const { t } = useTranslate();
 const [prototypeActive, setPrototypeActive] = useState(false);
 const [usedMaterials, setUsedMaterials] = useState<string[]>([]);
 const [result, setResult] = useState<'none' | 'success' | 'fail'>('none');

 const materials = [
 { id: 'dough', name: 'Play-Dough', valid: true },
 { id: 'bag', name: 'Trash Bag', valid: true },
 { id: 'blocks', name: 'Lego Blocks', valid: true },
 { id: 'cup', name: 'Kitchen Cup', valid: false },
 { id: 'spoon', name: 'Soup Spoon', valid: false }
 ];

 const handleToggleMaterial = (id: string) => {
 if (usedMaterials.includes(id)) {
  setUsedMaterials(usedMaterials.filter(m => m !== id));
 } else {
  setUsedMaterials([...usedMaterials, id]);
 }
 setResult('none');
 };

 const testPrototype = () => {
 setPrototypeActive(true);
 
 setTimeout(() => {
  setPrototypeActive(false);
  // Fails if any invalid (kitchen) tool is used, or if no valid container structure is made
  const hasInvalid = usedMaterials.some(m => materials.find(mat => mat.id === m)?.valid === false);
  const hasValid = usedMaterials.some(m => materials.find(mat => mat.id === m)?.valid === true);
  
  if (hasInvalid || !hasValid) {
  setResult('fail');
  } else {
  setResult('success');
  }
 }, 2000);
 };

 return (
 <div className="flex flex-col min- lg: font-sans bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.c7designprototype_design_thinking_prototype')} />
  <div className="flex-1 px-8 pb-8 flex flex-col lg:overflow-y-auto">

  <p className="text-slate-600 dark:text-[#a1a1aa] mb-8">{t('lab.c7designprototype_design_a_prototype_to_carry_wa')}</p>

  <div className="flex gap-8 max-w-5xl mx-auto w-full">
   {/* Materials */}
   <div className="w-80 bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col">
   <h2 className="font-bold text-slate-700 dark:text-[#ffffff] mb-4 uppercase tracking-wider text-sm">{t('lab.c7designprototype_available_materials')}</h2>
   <div className="flex flex-col gap-3 mb-8">
    {materials.map(mat => (
    <button
     key={mat.id}
     onClick={() => handleToggleMaterial(mat.id)}
     className={`p-3 rounded-lg border-2 text-left transition-all font-medium flex justify-between items-center ${usedMaterials.includes(mat.id) ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-sm' : 'bg-slate-50 dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:border-slate-300 dark:border-[#1c1b1b]'}`}
    >
     {mat.name}
     {usedMaterials.includes(mat.id) && <CheckCircle className="w-4 h-4 text-blue-500" />}
    </button>
    ))}
   </div>

   <div className="mt-auto">
    <button 
    onClick={testPrototype}
    disabled={usedMaterials.length === 0 || prototypeActive}
    className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-50 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
    >
    {prototypeActive ? 'Testing Prototype...' : 'Test Prototype'}
    </button>
   </div>
   </div>

   {/* Testing Area */}
   <div className="flex-1 bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-xl border-4 border-slate-200 dark:border-[#1c1b1b] relative overflow-hidden flex flex-col">
   <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50 dark:bg-[#121212]">
    <div className="text-center font-black text-2xl text-slate-400">{t('lab.c7designprototype_point_a')}</div>
    <div className="w-full max-w-[200px] h-2 bg-slate-200 dark:bg-[#121212] mx-4 relative overflow-hidden rounded-full">
    {prototypeActive && <div className="absolute inset-y-0 left-0 bg-blue-400 w-full animate-in slide-in-from-left-full duration-2000 linear" />}
    </div>
    <div className="text-center font-black text-2xl text-slate-400">{t('lab.c7designprototype_point_b')}</div>
   </div>

   <div className="flex-1 bg-slate-100 dark:bg-[#121212] relative flex items-center justify-center">
    {prototypeActive && (
    <Droplets className="w-16 h-16 text-blue-400 animate-bounce absolute z-10" style={{ left: '50%', top: '40%', transform: 'translate(-50%, -50%)' }} />
    )}
    
    <div className="flex gap-2 relative z-0 mt-20">
    {usedMaterials.length === 0 && <span className="text-slate-400 italic">{t('lab.c7designprototype_no_materials_selected_for_prot')}</span>}
    {usedMaterials.map(m => (
     <div key={m} className="px-4 py-8 bg-slate-300 dark:bg-[#121212] rounded border-4 border-slate-400 dark:border-[#1c1b1b] font-bold text-slate-600 dark:text-[#a1a1aa] shadow-lg transform -rotate-6">
     {materials.find(x=>x.id===m)?.name}
     </div>
    ))}
    </div>

    {result === 'success' && (
    <div className="absolute inset-0 bg-emerald-500/90 flex flex-col items-center justify-center text-white z-20 animate-in fade-in">
     <CheckCircle className="w-20 h-20 mb-4" />
     <h2 className="text-4xl font-black mb-2">{t('lab.c7designprototype_success')}</h2>
     <p className="text-xl font-medium text-emerald-100">{t('lab.c7designprototype_your_prototype_successfully_tr')}</p>
    </div>
    )}

    {result === 'fail' && (
    <div className="absolute inset-0 bg-rose-500/90 flex flex-col items-center justify-center text-white z-20 animate-in fade-in dark:bg-[#121212] dark:border-[#1c1b1b]">
     <div className="text-6xl mb-4">💥</div>
     <h2 className="text-4xl font-black mb-2">{t('lab.c7designprototype_prototype_failed')}</h2>
     <p className="text-xl font-medium text-rose-100 max-w-md text-center">
     
                                          {t('lab.c7designprototype_remember_you_cannot_use_standa')}
                                          </p>
     <button onClick={() => setResult('none')} className="mt-8 bg-slate-50 dark:bg-[#121212] text-rose-600 px-6 py-2 rounded-lg font-bold">{t('lab.c7designprototype_try_again')}</button>
    </div>
    )}
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
