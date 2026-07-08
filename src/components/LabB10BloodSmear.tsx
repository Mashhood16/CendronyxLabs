import { useState } from 'react';
import { BookOpen, Activity, Edit3, Droplet, Microscope, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

export default function LabB10BloodSmear({ onExit }: { onExit: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [step, setStep] = useState(1);
 const [smearProgress, setSmearProgress] = useState(0);
 const [stained, setStained] = useState(false);
 const [focus, setFocus] = useState(0); // For microscope view
 
 const [q1, setQ1] = useState("");
 const [q2, setQ2] = useState("");
 const [score, setScore] = useState<number | null>(null);

 const checkAnswers = () => {
 let s = 0;
 const ans1 = q1.toLowerCase();
 const ans2 = q2.toLowerCase();
 if (ans1.includes("single layer") || ans1.includes("monolayer") || ans1.includes("overlap") || ans1.includes("thin")) s += 50;
 if (ans2.includes("white") || ans2.includes("wbc") || ans2.includes("leukocyte") || ans2.includes("nucle")) s += 50;
 setScore(s);
 };

 const advanceStep = () => {
 if (step < 4) setStep(prev => prev + 1);
 };

 // derived blur for microscope
 const blurAmount = Math.abs(50 - focus) / 5;

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  {/* Top Header */}
  <LabHeader onExit={onExit} title={t('lab.b10bloodsmear_lab_b10_2_blood_smear_microsco')} subtitle={t('lab.subtitle_preparation_cell_identification')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.b10bloodsmear_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.b10bloodsmear_lab')}</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 flex-grow lg:overflow-visible">
  
  {/* Left Column: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-3 mb-4">
   <div className={`p-2 bg-red-100 text-red-600 rounded-lg flex-col `}><BookOpen className="w-6 h-6" /></div>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.b10bloodsmear_theory_context')}</h2>
   </div>
   <div className="prose prose-slate text-sm flex-grow lg:overflow-y-auto pr-2">
   <h3 className="font-semibold text-slate-800 dark:text-[#ffffff]">{t('lab.b10bloodsmear_the_peripheral_blood_smear')}</h3>
   <p>
    
                             {t('lab.b10bloodsmear_a_blood_smear_is_a_technique_u')} <strong>{t('lab.b10bloodsmear_feathered_edge')}</strong>  {t('lab.b10bloodsmear_where_cells_are_spread_into_a_')}
                            </p>
   <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">{t('lab.b10bloodsmear_wright_s_stain')}</h3>
   <p>
    
                             {t('lab.b10bloodsmear_unstained_blood_cells_are_most')} <strong>{t('lab.b10bloodsmear_wright_s_stain')}</strong>{t('lab.b10bloodsmear_it_contains_eosin_red_and_meth')} <strong>{t('lab.b10bloodsmear_nuclei')}</strong>  {t('lab.b10bloodsmear_of_wbcs_a_deep_indigo_blue_all')}
                            </p>
   </div>
  </div>

  {/* Middle Column: Simulator */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col relative overflow- '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center justify-between mb-4">
   <div className="flex items-center gap-3">
    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Activity className="w-6 h-6" /></div>
    <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.b10bloodsmear_interactive_bench')}</h2>
   </div>
   <div className="text-sm font-semibold text-slate-500 dark:text-[#71717a]">{t('lab.b10bloodsmear_step')} {step}  {t('lab.b10bloodsmear_of_4')}</div>
   </div>
   
   <div className={`flex-col flex-grow items-center justify-center bg-slate-50 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] p-6 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   
   {/* Step 1: Draw Blood */}
   {step === 1 && (
    <div className="flex flex-col items-center gap-6 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    <p className="text-center text-slate-700 dark:text-[#ffffff] font-medium">{t('lab.b10bloodsmear_step_1_lance_the_finger_to_dra')}</p>
    <div className="relative w-48 h-32 flex justify-center items-end pb-4">
     <div className="w-16 h-24 bg-rose-200 rounded-t-full border-2 border-rose-300 shadow-sm relative">
      {/* Blood drop */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full rounded-tr-none rotate-45 shadow-sm animate-pulse dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40" />
     </div>
    </div>
    <button onClick={advanceStep} className={`px-6 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition flex items-center gap-2 dark:text-white dark:text-white dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40 `}>
     <Droplet className="w-4 h-4" />  {t('lab.b10bloodsmear_deposit_blood')}
                                     </button>
    </div>
   )}

   {/* Step 2: Smear */}
   {step === 2 && (
    <div className="flex flex-col items-center gap-6 w-full">
    <p className="text-center text-slate-700 dark:text-[#ffffff] font-medium">{t('lab.b10bloodsmear_step_2_drag_the_spreader_slide')}</p>
    <div className="relative w-72 h-32 flex items-center justify-center">
     {/* Primary Slide */}
     <div className="absolute w-64 h-20 bg-blue-50/50 border border-slate-300 dark:border-[#1c1b1b] shadow-sm rounded-sm dark:bg-teal-950/20 dark:border-teal-900" />
     
     {/* Blood smear */}
     <div 
     className="absolute h-10 bg-red-600/80 rounded-full left-[2rem]" 
     style={{ 
      width: `${Math.max(10, smearProgress * 2)}px`,
      opacity: Math.max(0.3, 1 - (smearProgress/150))
     }} 
     />

     {/* Range input acting as spreader slide */}
     <input 
     type="range" min="0" max="100" 
     value={smearProgress}
     onChange={(e) => setSmearProgress(Number(e.target.value))}
     className="absolute w-56 z-20 cursor-ew-resize opacity-0"
     style={{ left: '2rem' }}
     />
     {/* Visual Spreader slide */}
     <div 
     className="absolute w-4 h-24 bg-blue-100/80 border border-slate-400 dark:border-[#1c1b1b] rotate-12 z-10 pointer-events-none shadow-md"
     style={{ left: `calc(2rem + ${smearProgress * 2}px)` }}
     />
    </div>
    <button 
     onClick={advanceStep} 
     disabled={smearProgress < 80} 
     className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
     
                                      {t('lab.b10bloodsmear_next_step')}
                                     </button>
    </div>
   )}

   {/* Step 3: Stain */}
   {step === 3 && (
    <div className="flex flex-col items-center gap-6 w-full">
    <p className="text-center text-slate-700 dark:text-[#ffffff] font-medium">{t('lab.b10bloodsmear_step_3_apply_wright_s_stain')}</p>
    <div className="relative w-72 h-32 flex items-center justify-center">
     <div className="absolute w-64 h-20 bg-blue-50/50 border border-slate-300 dark:border-[#1c1b1b] shadow-sm rounded-sm dark:bg-teal-950/20 dark:border-teal-900" />
     <div 
     className="absolute h-10 rounded-full left-[2rem] w-48 transition-colors duration-1000" 
     style={{ 
      backgroundColor: stained ? 'rgba(126, 34, 206, 0.6)' : 'rgba(220, 38, 38, 0.4)'
     }} 
     />
    </div>
    <div className="flex gap-4">
     <button onClick={() => setStained(true)} disabled={stained} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
     
                                          {t('lab.b10bloodsmear_apply_stain')}
                                          </button>
     {stained && (
     <button onClick={advanceStep} className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">
      
                                               {t('lab.b10bloodsmear_view_under_microscope')}
                                              </button>
     )}
    </div>
    </div>
   )}

   {/* Step 4: Microscope */}
   {step === 4 && (
    <div className="flex flex-col items-center gap-4 w-full">
    <p className="text-center text-slate-700 dark:text-[#ffffff] font-medium flex items-center gap-2">
     <Microscope className="w-5 h-5" />  {t('lab.b10bloodsmear_step_4_focus_microscope')}
                                     </p>
    
    {/* Microscope Viewport */}
    <div className="w-64 h-64 rounded-full bg-pink-50 border-8 border-[#1c1b1b] dark:border-[#1c1b1b] relative overflow-hidden shadow-inner">
     <div className="absolute inset-0 transition-all duration-200" style={{ filter: `blur(${blurAmount}px)` }}>
     {/* RBCs */}
     {Array.from({length: 40}).map((_, i) => (
      <div key={`rbc-${i}`} className="absolute w-8 h-8 rounded-full bg-pink-300/80 border border-pink-400 flex items-center justify-center"
       style={{ top: `${Math.random() * 85 + 5}%`, left: `${Math.random() * 85 + 5}%` }}>
      <div className="w-4 h-4 bg-pink-200/60 rounded-full" />
      </div>
     ))}
     {/* WBCs */}
     {Array.from({length: 3}).map((_, i) => (
      <div key={`wbc-${i}`} className="absolute w-10 h-10 rounded-full bg-indigo-100 border border-indigo-300 flex items-center justify-center"
       style={{ top: `${Math.random() * 70 + 15}%`, left: `${Math.random() * 70 + 15}%` }}>
      <div className="w-6 h-6 bg-indigo-700/90" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }} />
      </div>
     ))}
     {/* Platelets */}
     {Array.from({length: 15}).map((_, i) => (
      <div key={`plat-${i}`} className="absolute w-2 h-2 rounded-full bg-indigo-400/80"
       style={{ top: `${Math.random() * 90 + 5}%`, left: `${Math.random() * 90 + 5}%` }} />
     ))}
     </div>
    </div>

    {/* Focus Knobs */}
    <div className="flex flex-col w-full px-8 gap-2">
     <label className="text-xs font-semibold text-slate-500 dark:text-[#71717a] text-center">{t('lab.b10bloodsmear_coarse_focus_dial')}</label>
     <input 
     type="range" min="0" max="100" 
     value={focus}
     onChange={(e) => setFocus(Number(e.target.value))}
     className="w-full accent-slate-700"
     />
    </div>
    
    <button onClick={() => { setStep(1); setSmearProgress(0); setStained(false); setFocus(0); }} className="text-sm text-slate-500 dark:text-[#71717a] hover:text-slate-700 dark:text-[#ffffff] underline mt-2">
     
                                      {t('lab.b10bloodsmear_restart_preparation')}
                                     </button>
    </div>
   )}
   </div>
  </div>

  {/* Right Column: Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-3 mb-4">
   <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Edit3 className="w-6 h-6" /></div>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.b10bloodsmear_assessment')}</h2>
   </div>
   
   <div className="flex-grow flex flex-col gap-6 lg:overflow-y-auto pr-2">
   <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">
    
                                 {t('lab.b10bloodsmear_1_why_is_it_critical_to_create')}
                                 </label>
    <textarea 
    value={q1}
    onChange={e => setQ1(e.target.value)}
    placeholder={t('lab.b10bloodsmear_discuss_cell_layers')}
    className="w-full p-3 rounded-lg border border-slate-300 dark:border-[#1c1b1b] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-sm"
    rows={4}
    />
   </div>
   
   <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">
    
                                 {t('lab.b10bloodsmear_2_which_specific_blood_cells_a')}
                                 </label>
    <textarea 
    value={q2}
    onChange={e => setQ2(e.target.value)}
    placeholder={t('lab.b10bloodsmear_identify_the_cell_type_and_str')}
    className="w-full p-3 rounded-lg border border-slate-300 dark:border-[#1c1b1b] focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none text-sm"
    rows={4}
    />
   </div>

   <button 
    onClick={checkAnswers}
    className={`w-full py-3 bg-[#121212] dark:bg-[#121212] text-white rounded-xl font-semibold hover:bg-slate-700 dark:bg-[#121212] transition-colors flex items-center justify-center gap-2 `}
   >
    <CheckCircle className="w-5 h-5" />  {t('lab.b10bloodsmear_check_answers')}
                            </button>

   {score !== null && (
    <div className={`p-4 rounded-xl border ${score === 100 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
    <h3 className="font-bold mb-1">{t('lab.b10bloodsmear_score')} {score}%</h3>
    {score < 100 && (
     <p className="text-sm">{t('lab.b10bloodsmear_review_the_theory_ensure_you_m')}</p>
    )}
    {score === 100 && (
     <p className="text-sm">{t('lab.b10bloodsmear_great_job_you_successfully_pre')}</p>
    )}
    </div>
   )}
   </div>
  </div>

  </div>
 </div>
 );
}
