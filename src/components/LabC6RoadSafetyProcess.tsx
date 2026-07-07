import { useState } from 'react';
import { CheckCircle, RefreshCcw } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabC6RoadSafetyProcess({ onExit }: LabProps) {
    const { t } = useTranslate();
 const steps = [
 { id: '1', title: 'Define the Problem', text: 'Need to cross the busy road safely.' },
 { id: '2', title: 'Analyze the Problem', text: 'Cars are moving fast. There is no traffic light here. It is dangerous.' },
 { id: '3', title: 'Identify Solutions', text: 'Wait for gap, run quickly, find zebra crossing, or use overhead bridge.' },
 { id: '4', title: 'Select Best Solution', text: 'Walk to the nearest overhead bridge because it guarantees 100% safety.' },
 { id: '5', title: 'Implement Solution', text: 'Walk 50 meters left, climb the stairs, walk across the bridge.' },
 { id: '6', title: 'Evaluate Results', text: 'Successfully and safely reached the other side without stopping traffic.' }
 ];

 const [currentStep, setCurrentStep] = useState(0);

 return (
 <div className="flex flex-col min- lg: font-sans bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.c6roadsafetyprocess_problem_solving_process')} />
  <div className="flex-1 px-8 pb-8 flex flex-col lg:overflow-y-auto">
  

  <p className="text-slate-600 dark:text-[#a1a1aa] mb-8">{t('lab.c6roadsafetyprocess_apply_the_6_step_problem_solvi')}</p>

  <div className="flex gap-8 flex-1">
   {/* Step List */}
   <div className="w-1/3 flex flex-col gap-3 relative">
   <div className="absolute left-6 top-8 bottom-8 w-1 bg-slate-200 dark:bg-[#121212] rounded"></div>
   {steps.map((step, idx) => {
    const isActive = currentStep === idx;
    const isCompleted = currentStep > idx;
    return (
    <button
     key={step.id}
     onClick={() => setCurrentStep(idx)}
     className={`relative p-4 rounded-xl border-2 text-left transition-all z-10 flex items-center gap-4 ${ isActive ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]' : isCompleted ? 'border-green-200 bg-slate-50 dark:bg-[#121212] hover:border-green-300' : 'border-slate-200 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] opacity-60 hover:opacity-100' }`}
    >
     <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${ isActive ? 'bg-blue-600' : isCompleted ? 'bg-green-500' : 'bg-slate-300 dark:bg-[#121212]' }`}>
     {isCompleted ? <CheckCircle className="w-6 h-6" /> : idx + 1}
     </div>
     <div>
     <div className={`font-bold ${isActive ? 'text-blue-800' : isCompleted ? 'text-green-800' : 'text-slate-600 dark:text-[#ffffff]'}`}>
      {step.title}
     </div>
     </div>
    </button>
    );
   })}
   </div>

   {/* Details Panel */}
   <div className="flex-1 bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg border border-slate-200 dark:border-[#1c1b1b] p-12 flex flex-col justify-center items-center text-center relative lg:overflow-hidden">
   {currentStep < steps.length ? (
    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-blue-600 shadow-inner">
     {currentStep + 1}
    </div>
    <h2 className="text-4xl font-bold mb-6 text-slate-800 dark:text-[#ffffff]">{steps[currentStep].title}</h2>
    <div className="text-2xl text-slate-600 dark:text-[#a1a1aa] max-w-lg mx-auto leading-relaxed p-8 bg-slate-50 dark:!bg-[#121212] border border-slate-100 rounded-2xl shadow-sm">
     "{steps[currentStep].text}"
    </div>
    
    <button 
     onClick={() => setCurrentStep(c => c + 1)}
     className="mt-12 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg shadow-blue-500/30 transition-transform active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
     {currentStep === steps.length - 1 ? 'Finish Model' : 'Next Step'}
    </button>
    </div>
   ) : (
    <div className="animate-in fade-in zoom-in duration-500">
    <CheckCircle className="w-32 h-32 text-green-500 mx-auto mb-6 drop-shadow-md" />
    <h2 className="text-4xl font-bold mb-4 text-slate-800 dark:text-[#ffffff]">{t('lab.c6roadsafetyprocess_process_complete')}</h2>
    <p className="text-xl text-slate-600 dark:text-[#a1a1aa] max-w-md mx-auto mb-8">
     
                                          {t('lab.c6roadsafetyprocess_you_successfully_applied_the_6')}
                                         </p>
    <button 
     onClick={() => setCurrentStep(0)}
     className="px-6 py-3 bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] font-bold rounded-lg transition-colors flex items-center gap-2 mx-auto"
    >
     <RefreshCcw className="w-5 h-5" />  {t('lab.c6roadsafetyprocess_start_over')}
                                         </button>
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
