import { useState } from 'react';
import { BookOpen, Activity, Edit3, Wind, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

export default function LabB10RespiratorySystem({ onExit }: { onExit: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [exhales, setExhales] = useState(0);
 const [diaphragmPull, setDiaphragmPull] = useState(0);

 const [q1, setQ1] = useState("");
 const [q2, setQ2] = useState("");
 const [score, setScore] = useState<number | null>(null);

 const volume = 100 + diaphragmPull;
 const pressure = (10000 / volume).toFixed(1);

 const checkAnswers = () => {
 let s = 0;
 const ans1 = q1.toLowerCase();
 const ans2 = q2.toLowerCase();
 if (ans1.includes("carbon dioxide") || ans1.includes("co2") || ans1.includes("precipitate") || ans1.includes("calcium carbonate")) s += 50;
 if (ans2.includes("volume") && (ans2.includes("pressure") || ans2.includes("decreas") || ans2.includes("invers"))) s += 50;
 setScore(s);
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  {/* Top Header */}
  <LabHeader onExit={onExit} title={t('lab.b10respiratorysystem_lab_b10_3_respiratory_mechanic')} subtitle={t('lab.subtitle_exchange_boyle_model')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.b10respiratorysystem_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.b10respiratorysystem_lab')}</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 flex-grow lg:overflow-visible">
  
  {/* Left Column: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-3 mb-4">
   <div className={`p-2 bg-sky-100 text-sky-600 rounded-lg flex-col `}><BookOpen className="w-6 h-6" /></div>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.b10respiratorysystem_theory_context')}</h2>
   </div>
   <div className="prose prose-slate text-sm flex-grow lg:overflow-y-auto pr-2">
   <h3 className="font-semibold text-slate-800 dark:text-[#ffffff]">{t('lab.b10respiratorysystem_1_testing_exhaled_air')}</h3>
   <p>
    
                             {t('lab.b10respiratorysystem_cellular_respiration_produces_')} <strong>{t('lab.b10respiratorysystem_limewater')}</strong>  {t('lab.b10respiratorysystem_calcium_hydroxide_solution_whe')}
                            </p>
   <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">{t('lab.b10respiratorysystem_2_mechanics_of_breathing')}</h3>
   <p>
    
                             {t('lab.b10respiratorysystem_breathing_relies_on')} <strong>{t('lab.b10respiratorysystem_boyle_s_law')}</strong>{t('lab.b10respiratorysystem_which_states_that_the_pressure')}
                            </p>
   </div>
  </div>

  {/* Middle Column: Simulator */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col relative overflow- '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-3 mb-4">
   <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Activity className="w-6 h-6" /></div>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.b10respiratorysystem_interactive_simulator')}</h2>
   </div>
   
   <div className="flex flex-col gap-6 flex-grow lg:overflow-y-auto pr-2 pb-8">
   
   {/* Station 1: Limewater */}
   <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-4 '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.b10respiratorysystem_station_1_co_indicator')}</h3>
    <p className="text-xs text-slate-500 dark:text-[#71717a] mb-4">{t('lab.b10respiratorysystem_exhale_into_the_tube_to_bubble')}</p>
    
    <div className="flex items-center justify-center gap-8">
    <div className="relative w-24 h-32 bg-slate-50 dark:bg-[#121212] border-b-4 border-x-4 border-slate-300 dark:border-[#1c1b1b] rounded-b-xl overflow-hidden flex flex-col justify-end">
     {/* Tube */}
     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-24 bg-slate-300 dark:bg-[#121212] rounded-b-full z-10" />
     
     {/* Limewater Liquid */}
     <div 
     className="w-full transition-all duration-700 ease-in-out relative"
     style={{ 
      height: '60%', 
      backgroundColor: `rgba(255, 255, 255, ${Math.min(exhales * 0.25, 0.95)})`,
      backdropFilter: 'blur(1px)',
      borderTop: '2px solid rgba(200,200,200,0.5)'
     }}
     >
     {/* Bubbles */}
     {exhales > 0 && (
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 animate-bounce">
       <div className="w-1.5 h-1.5 rounded-full bg-slate-50 dark:bg-[#121212] shadow-sm" />
       <div className="w-2 h-2 rounded-full bg-slate-50 dark:bg-[#121212] shadow-sm" />
      </div>
     )}
     </div>
    </div>
    
    <div className="flex flex-col gap-2">
     <button onClick={() => setExhales(prev => prev + 1)} className={`px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 text-sm font-medium transition-colors flex items-center justify-center gap-2 dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-sky-500/40 `}>
      <Wind className="w-4 h-4"/>  {t('lab.b10respiratorysystem_exhale_gas')}
                                          </button>
     <button onClick={() => setExhales(0)} className="px-4 py-2 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg hover:bg-slate-300 dark:bg-[#121212] text-sm font-medium transition-colors">
      
                                           {t('lab.b10respiratorysystem_replace_limewater')}
                                          </button>
    </div>
    </div>
   </div>

   {/* Station 2: Bell Jar Model */}
   <div className={`bg-slate-50 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] p-4 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.b10respiratorysystem_station_2_bell_jar_lung_model')}</h3>
    <p className="text-xs text-slate-500 dark:text-[#71717a] mb-4">{t('lab.b10respiratorysystem_pull_the_rubber_diaphragm_down')}</p>
    
    <div className="flex items-start justify-between px-2 gap-4">
    
    {/* Stats Panel */}
    <div className="flex flex-col gap-4 text-xs font-mono bg-[#121212] dark:bg-[#121212] text-emerald-400 p-3 rounded-lg shadow-inner w-32">
     <div>
     <span className="text-slate-400 block">{t('lab.b10respiratorysystem_thoracic_vol')}</span>
     <span className="text-lg">{volume} mL</span>
     </div>
     <div>
     <span className="text-slate-400 block">{t('lab.b10respiratorysystem_intrapulmonary_pressure')}</span>
     <span className="text-lg">{pressure}  {t('lab.b10respiratorysystem_mmhg')}</span>
     </div>
    </div>

    {/* Bell Jar Container */}
    <div className="relative w-32 h-48 mt-2 mx-auto">
     {/* Glass Jar */}
     <div className="absolute inset-0 bg-blue-50/40 border-4 border-slate-300 dark:border-[#1c1b1b] rounded-t-[3rem] border-b-0 overflow-hidden dark:bg-teal-950/20 dark:border-teal-900" />
     
     {/* Trachea & Bronchi */}
     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-12 bg-slate-600 dark:bg-[#121212] rounded-t-sm z-10" />
     <div className="absolute top-12 left-1/2 -translate-x-[6px] w-2 h-8 bg-slate-600 dark:bg-[#121212] -rotate-45 origin-top z-10" />
     <div className="absolute top-12 left-1/2 w-2 h-8 bg-slate-600 dark:bg-[#121212] rotate-45 origin-top z-10" />

     {/* Lungs (Balloons) */}
     <div 
     className="absolute top-16 left-[20%] bg-pink-400/90 rounded-full transition-all duration-100 ease-linear origin-top shadow-sm z-0 dark:bg-pink-500 dark:hover:bg-pink-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-pink-500/40"
     style={{ 
      width: `${16 + diaphragmPull * 0.15}px`,
      height: `${24 + diaphragmPull * 0.3}px`
     }}
     />
     <div 
     className="absolute top-16 right-[20%] bg-pink-400/90 rounded-full transition-all duration-100 ease-linear origin-top shadow-sm z-0 dark:bg-pink-500 dark:hover:bg-pink-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-pink-500/40"
     style={{ 
      width: `${16 + diaphragmPull * 0.15}px`,
      height: `${24 + diaphragmPull * 0.3}px`
     }}
     />

     {/* Diaphragm (Rubber Sheet) */}
     <div 
     className="absolute bottom-0 left-0 w-full h-8 bg-red-500 rounded-t-[50%] transition-all duration-100 ease-linear dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40"
     style={{ transform: `translateY(${diaphragmPull * 0.25}px)` }}
     />
     
     {/* Slider Control */}
     <input 
     type="range" min="0" max="100" 
     value={diaphragmPull} 
     onChange={(e) => setDiaphragmPull(Number(e.target.value))}
     className="absolute -bottom-8 w-full accent-red-600 cursor-ns-resize"
     />
    </div>
    </div>
    <p className="text-center text-[10px] text-slate-400 mt-10">{t('lab.b10respiratorysystem_slide_to_pull_diaphragm')}</p>
   </div>

   </div>
  </div>

  {/* Right Column: Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-3 mb-4">
   <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Edit3 className="w-6 h-6" /></div>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.b10respiratorysystem_assessment')}</h2>
   </div>
   
   <div className="flex-grow flex flex-col gap-6 lg:overflow-y-auto pr-2">
   <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">
    
                                 {t('lab.b10respiratorysystem_1_what_specific_chemical_produ')}
                                 </label>
    <textarea 
    value={q1}
    onChange={e => setQ1(e.target.value)}
    placeholder={t('lab.b10respiratorysystem_name_the_gas_and_the_resulting')}
    className="w-full p-3 rounded-lg border border-slate-300 dark:border-[#1c1b1b] focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-none text-sm"
    rows={4}
    />
   </div>
   
   <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">
    
                                 {t('lab.b10respiratorysystem_2_explain_how_pulling_the_diap')}
                                 </label>
    <textarea 
    value={q2}
    onChange={e => setQ2(e.target.value)}
    placeholder={t('lab.b10respiratorysystem_relate_volume_and_pressure')}
    className="w-full p-3 rounded-lg border border-slate-300 dark:border-[#1c1b1b] focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none text-sm"
    rows={4}
    />
   </div>

   <button 
    onClick={checkAnswers}
    className="w-full py-3 bg-[#121212] dark:bg-[#121212] text-white rounded-xl font-semibold hover:bg-slate-700 dark:bg-[#121212] transition-colors flex items-center justify-center gap-2"
   >
    <CheckCircle className="w-5 h-5" />  {t('lab.b10respiratorysystem_check_answers')}
                            </button>

   {score !== null && (
    <div className={`p-4 rounded-xl border ${score === 100 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
    <h3 className="font-bold mb-1">{t('lab.b10respiratorysystem_score')} {score}%</h3>
    {score < 100 && (
     <p className="text-sm">{t('lab.b10respiratorysystem_make_sure_you_identified_carbo')}</p>
    )}
    {score === 100 && (
     <p className="text-sm">{t('lab.b10respiratorysystem_excellent_you_accurately_linke')}</p>
    )}
    </div>
   )}
   </div>
  </div>

  </div>
 </div>
 );
}
