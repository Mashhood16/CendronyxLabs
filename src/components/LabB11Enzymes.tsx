import { useState, useEffect, useRef } from 'react';
import { Beaker, Play, Pause, Activity, ClipboardList, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

export default function LabB11Enzymes({ onExit }: { onExit?: () => void }) {
 const { setLabScore } = useLab();
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [beadCount, setBeadCount] = useState(0);
 const [isPouringMilk, setIsPouringMilk] = useState(false);
 const [glucoseLevel, setGlucoseLevel] = useState(0);
 
 // Assessment
 const [diag1, setDiag1] = useState('');
 const [diag2, setDiag2] = useState('');
 const [rateCalc, setRateCalc] = useState('');
 const [feedback, setFeedback] = useState<string | null>(null);

 // Animation Refs
 const intervalRef = useRef<number | null>(null);

 const handleDropBead = () => {
 if (beadCount < 20) setBeadCount(prev => prev + 1);
 };

 const toggleMilkPour = () => {
 setIsPouringMilk(prev => !prev);
 };

 // Simulate Glucose production when milk flows over beads
 useEffect(() => {
 if (isPouringMilk) {
  intervalRef.current = setInterval(() => {
  setGlucoseLevel(prev => {
   const increment = beadCount * 0.5; // More beads = faster conversion
   if (prev + increment >= 100) {
   setIsPouringMilk(false);
   return 100;
   }
   return prev + increment;
  });
  }, 500);
 } else {
  if (intervalRef.current) clearInterval(intervalRef.current);
 }
 return () => {
  if (intervalRef.current) clearInterval(intervalRef.current);
 };
 }, [isPouringMilk, beadCount]);

 const handleReset = () => {
 setBeadCount(0);
 setIsPouringMilk(false);
 setGlucoseLevel(0);
 };

 const checkAnswers = () => {
 let score = 0;
 if (diag1.toLowerCase().includes('pancreatitis') || diag1.toLowerCase().includes('pancreas')) score++;
 if (diag2.toLowerCase().includes('liver') || diag2.toLowerCase().includes('hepatitis')) score++;
 if (rateCalc === '0.5' || rateCalc === '.5') score++;

 if (score === 3) setFeedback("Superb! You've mastered enzyme applications.");
 else setFeedback(`Score: ${score}/3. Check the medical indicators and math.`);
    setLabScore(score, 3);
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.b11enzymes_grade_11_enzyme_immobilization')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.b11enzymes_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.b11enzymes_lab')}</button>
  </div>
  <main className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg: lg:overflow-visible">
  
  {/* Column 1: Theory */}
  <section className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 lg:overflow-y-auto flex-col gap-4 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-2xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2">{t('lab.b11enzymes_theory_principles')}</h2>
   
   <div className="space-y-4 text-sm text-slate-700 dark:text-[#ffffff]">
   <div>
   
<h3 className="font-bold text-indigo-800 text-lg dark:text-[#ffffff]">{t('lab.b11enzymes_immobilized_enzymes')}</h3>
    <p className="mt-1">
    
                                 {t('lab.b11enzymes_enzymes_like_lactase_can_be_tr')} <strong>{t('lab.b11enzymes_reused')}</strong>.
    </p>
   </div>

   <div className={`bg-indigo-50 p-3 rounded-lg border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
    <p className="font-mono text-xs">{t('lab.b11enzymes_sodium_alginate_lactase_cacl_i')}</p>
   </div>

   <div>
    <h3 className="font-bold text-indigo-800 text-lg dark:text-[#ffffff]">{t('lab.b11enzymes_enzymes_in_diagnostics')}</h3>
    <p className="mt-1">{t('lab.b11enzymes_specific_enzymes_leak_into_the')}</p>
    <ul className="list-disc pl-5 mt-2 space-y-1">
    <li><strong>{t('lab.b11enzymes_amylase_lipase')}</strong>  {t('lab.b11enzymes_pancreas_pancreatitis')}</li>
    <li><strong>{t('lab.b11enzymes_alt_ast')}</strong>  {t('lab.b11enzymes_liver_hepatitis_cirrhosis')}</li>
    <li><strong>{t('lab.b11enzymes_creatine_kinase_ck_mb')}</strong>  {t('lab.b11enzymes_heart_myocardial_infarction')}</li>
    </ul>
   </div>
   </div>
  </section>

  {/* Column 2: Interactive Simulator */}
  <section className={`w-full bg-[#121212] dark:bg-[#121212] lg:dark:bg-[#121212] rounded-xl shadow-inner border border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col items-center relative overflow-  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
   <Activity className="text-indigo-400" />  {t('lab.b11enzymes_bioreactor_simulation')}
                        </h3>

   <div className="flex-1 flex flex-col items-center justify-end relative w-full mb-4">
   
   {/* Milk Pouring Animation */}
   {isPouringMilk && (
    <div className={`w-full absolute top-0 w-8 h-32 bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212]/80 animate-pulse rounded-b-full shadow-lg z-10 border-x border-slate-300 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}></div>
   )}

   {/* The Column / Beaker */}
   <div className={`w-40 h-64 border-x-4 border-b-4 border-white/40 rounded-b-xl relative flex flex-col-reverse items-center justify-start p-2 gap-1 overflow- bg-[#000000] dark:bg-[#121212]/50 `}>
    
    {/* Milk Liquid inside beaker */}
    <div 
    className="absolute bottom-0 w-full bg-slate-50 dark:bg-[#121212]/20 transition-all duration-500 ease-linear"
    style={{ height: `${glucoseLevel}%` }}
    ></div>

    {/* Render Beads */}
    <div className="flex flex-wrap-reverse justify-center gap-1 w-full z-10">
    {Array.from({ length: beadCount }).map((_, i) => (
     <div key={i} className={`w-6 h-6 rounded-full bg-teal-400 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center text-[8px] font-bold text-teal-900 flex-col `}>
     E
     </div>
    ))}
    </div>
   </div>

   {/* Glucose Output Graph / Meter */}
   <div className="absolute right-0 top-0 w-8 h-64 bg-slate-700 dark:bg-[#121212] rounded border border-slate-600 dark:border-[#1c1b1b] flex flex-col-reverse overflow-hidden">
    <div 
    className="w-full bg-gradient-to-t from-orange-400 to-yellow-300 transition-all duration-500"
    style={{ height: `${glucoseLevel}%` }}
    ></div>
    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white -rotate-90 whitespace-nowrap drop-shadow-md">
    
                                 {t('lab.b11enzymes_glucose')}
                                 </div>
   </div>
   </div>

   {/* Controls */}
   <div className="w-full flex flex-col gap-3">
   <button 
    onClick={handleDropBead}
    disabled={beadCount >= 20 || isPouringMilk}
    className="py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold rounded flex items-center justify-center gap-2 dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-teal-500/40"
   >
    <Beaker size={18} />  {t('lab.b11enzymes_drop_alginate_bead_1')}
                            </button>
   <div className="flex gap-2">
    <button 
    onClick={toggleMilkPour}
    disabled={beadCount === 0 || glucoseLevel >= 100}
    className={`flex-1 py-2 font-bold rounded flex items-center justify-center gap-2 transition-colors ${isPouringMilk ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-slate-50 dark:bg-[#121212] hover:bg-slate-200 dark:bg-[#121212] text-slate-800 dark:text-slate-100 disabled:opacity-50'}`}
    >
    {isPouringMilk ? <Pause size={18} /> : <Play size={18} />}
    {isPouringMilk ? 'Stop Milk Flow' : 'Pour Milk (Lactose)'}
    </button>
    <button 
    onClick={handleReset}
    className="px-4 py-2 bg-slate-600 dark:bg-[#121212] hover:bg-slate-50 dark:bg-[#000000]0 dark:bg-[#121212] text-white font-bold rounded dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent"
    >
    
                                 {t('lab.b11enzymes_reset')}
                                 </button>
   </div>
   </div>
  </section>

  {/* Column 3: Assessment */}
  <section className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 lg:overflow-y-auto flex-col gap-4 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-2xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
   <ClipboardList className="text-indigo-600" />  {t('lab.b11enzymes_clinical_assessment')}
                        </h2>
   
   <div className="space-y-6 mt-2">
   
   <div className={`p-4 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg space-y-3 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h4 className="font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2"><Activity size={16} className="text-red-500"/>  {t('lab.b11enzymes_patient_a')}</h4>
    <p className="text-xs text-slate-600 dark:text-[#a1a1aa]">{t('lab.b11enzymes_blood_panel_reveals_severely_e')} <strong>{t('lab.b11enzymes_amylase')}</strong>  {t('lab.b11enzymes_and')} <strong>{t('lab.b11enzymes_lipase')}</strong>{t('lab.b11enzymes_patient_complains_of_upper_abd')}</p>
    <input 
    type="text" 
    value={diag1}
    onChange={e => setDiag1(e.target.value)}
    placeholder={t('lab.b11enzymes_likely_diagnosis_organ_affecte')}
    className="w-full p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-indigo-400"
    />
   </div>

   <div className={`p-4 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg space-y-3 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h4 className="font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2"><Activity size={16} className="text-orange-500"/>  {t('lab.b11enzymes_patient_b')}</h4>
    <p className="text-xs text-slate-600 dark:text-[#a1a1aa]">{t('lab.b11enzymes_routine_physical_shows_elevate')} <strong>{t('lab.b11enzymes_alt')}</strong>  {t('lab.b11enzymes_alanine_transaminase_and')} <strong>{t('lab.b11enzymes_ast')}</strong>{t('lab.b11enzymes_patient_exhibits_mild_jaundice')}</p>
    <input 
    type="text" 
    value={diag2}
    onChange={e => setDiag2(e.target.value)}
    placeholder={t('lab.b11enzymes_likely_diagnosis_organ_affecte')}
    className="w-full p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-indigo-400"
    />
   </div>

   <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg space-y-3 dark:bg-[#121212] dark:border-[#1c1b1b]">
    <h4 className="font-bold text-indigo-800 dark:text-[#ffffff]">{t('lab.b11enzymes_bioreactor_analytics')}</h4>
    <p className="text-xs text-slate-700 dark:text-[#ffffff]">{t('lab.b11enzymes_if_your_column_of_10_lactase_b')} <strong>{t('lab.b11enzymes_mmol_s')}</strong>?</p>
    <div className="flex items-center gap-2">
    <input 
     type="text" 
     value={rateCalc}
     onChange={e => setRateCalc(e.target.value)}
     placeholder={t('lab.b11enzymes_e_g_1_5')}
     className="w-full p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-indigo-400"
    />
    <span className="text-sm font-bold text-slate-500 dark:text-[#71717a]">{t('lab.b11enzymes_mmol_s')}</span>
    </div>
   </div>

   <button 
    onClick={checkAnswers}
    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
   >
    <CheckCircle size={20} />  {t('lab.b11enzymes_submit_evaluation')}
                            </button>

   {feedback && (
    <div className={`p-4 rounded-lg font-medium text-sm text-center ${feedback.includes('Superb') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
    {feedback}
    </div>
   )}
   </div>
  </section>

  </main>
 </div>
 );
}
