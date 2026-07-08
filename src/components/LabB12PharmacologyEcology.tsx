import { useState } from 'react';
import { Shield, Waves, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

export default function LabB12PharmacologyEcology({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeTab, setActiveTab] = useState<'pharma' | 'ecology'>('pharma');
 
 // Pharma state
 const [penicillinDose, setPenicillinDose] = useState(0);
 
 // Ecology state
 const [pCO2, setPCO2] = useState(280);
 
 // Assessment state
 const [ans1, setAns1] = useState('');
 const [ans2, setAns2] = useState('');
 const [ans3, setAns3] = useState('');
 const [feedback, setFeedback] = useState('');

 const currentPH = (8.2 - ((pCO2 - 280) * 0.0007)).toFixed(2);
 const isBleached = parseFloat(currentPH) < 7.9;
 const isBurst = penicillinDose > 70;

 const checkAnswers = () => {
 let score = 0;
 if (ans1.trim().toLowerCase() === 'transpeptidase') score++;
 if (ans2.trim() === '3') score++;
 if (ans3.trim() === '8.1') score++;
 
 if (score === 3) setFeedback('Excellent! All systems analyzed correctly.');
 else setFeedback(`You scored ${score}/3. Review the theory sections and try again.`);
    setLabScore(score, 3);
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.b12pharmacologyecology_pharmacology_ecosystems')} subtitle={t('lab.subtitle_antibiotic_mechanisms_ocean')} />
  <div className="flex gap-2 px-6 py-2 bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b]">
  <button 
   onClick={() => setActiveTab('pharma')}
   className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${activeTab === 'pharma' ? 'bg-slate-50 dark:bg-[#121212] text-teal-800' : 'bg-teal-700 text-white hover:bg-teal-600'}`}>
   <Shield className="w-4 h-4" />  {t('lab.b12pharmacologyecology_pharma')}
                   </button>
  <button 
   onClick={() => setActiveTab('ecology')}
   className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${activeTab === 'ecology' ? 'bg-slate-50 dark:bg-[#121212] text-teal-800' : 
'bg-teal-700 text-white hover:bg-teal-600'}`}>
   <Waves className="w-4 h-4" />  {t('lab.b12pharmacologyecology_ecology')}
                   </button>
  </div>

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.b12pharmacologyecology_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.b12pharmacologyecology_lab')}</button>
  </div>
  <main className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:min-h-0 lg:overflow-visible">
  {/* Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4">
   {activeTab === 'pharma' ? 'Pharmacology Theory' : 'Ecology Theory'}
   </h2>
   
   {activeTab === 'pharma' ? (
   <div className="space-y-4 text-sm text-slate-600 dark:text-[#a1a1aa]">
    <p><strong>{t('lab.b12pharmacologyecology_penicillin_mechanism')}</strong>  {t('lab.b12pharmacologyecology_beta_lactam_antibiotics_irreve')} <em>{t('lab.b12pharmacologyecology_transpeptidase')}</em>{t('lab.b12pharmacologyecology_which_forms_cross_links_in_the')}</p>
    <p>{t('lab.b12pharmacologyecology_without_cross_links_the_cell_w')}</p>
    <p><strong>{t('lab.b12pharmacologyecology_clinical_trials')}</strong></p>
    <ul className="list-disc pl-5 space-y-1">
    <li><strong>{t('lab.b12pharmacologyecology_phase_1')}</strong>  {t('lab.b12pharmacologyecology_safety_dosage_and_pharmacokine')}</li>
    <li><strong>{t('lab.b12pharmacologyecology_phase_2')}</strong>  {t('lab.b12pharmacologyecology_efficacy_and_side_effects_in_p')}</li>
    <li><strong>{t('lab.b12pharmacologyecology_phase_3')}</strong>  {t('lab.b12pharmacologyecology_large_scale_comparison_with_st')}</li>
    <li><strong>{t('lab.b12pharmacologyecology_phase_4')}</strong>  {t('lab.b12pharmacologyecology_post_marketing_surveillance')}</li>
    </ul>
   </div>
   ) : (
   <div className="space-y-4 text-sm text-slate-600 dark:text-[#a1a1aa]">
    <p><strong>{t('lab.b12pharmacologyecology_ocean_acidification')}</strong>  {t('lab.b12pharmacologyecology_increased_atmospheric_carbon_d')}</p>
    <p className={`font-mono bg-slate-100 dark:bg-[#121212] p-2 rounded text-center text-xs border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
    
                                     {t('lab.b12pharmacologyecology_co_h_o_h_co_hco_h')}
                                     </p>
    <p>{t('lab.b12pharmacologyecology_this_increases_the_concentrati')}</p>
    <p><strong>{t('lab.b12pharmacologyecology_coral_bleaching')}</strong>  {t('lab.b12pharmacologyecology_corals_live_in_symbiosis_with_')}</p>
   </div>
   )}
  </div>

  {/* Interactive */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4">
   {activeTab === 'pharma' ? 'Bacterial Lysis Simulator' : 'Coral Reef Simulator'}
   </h2>
   
   {activeTab === 'pharma' ? (
   <div className="flex-1 flex flex-col items-center">
    <div className="w-full mb-6">
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
     <span>{t('lab.b12pharmacologyecology_penicillin_concentration_mg_l')}</span>
     <span className="font-bold text-teal-600">{penicillinDose}</span>
    </label>
    <input 
     type="range" min="0" max="100" value={penicillinDose}
     onChange={(e) => setPenicillinDose(Number(e.target.value))}
     className="w-full accent-teal-600"
    />
    </div>
    
    <div className={`relative w-64 h-64 bg-slate-100 dark:bg-[#121212] rounded-full flex items-center justify-center border border-slate-300 dark:border-[#1c1b1b] overflow- shadow-inner flex-col `}>
    <svg viewBox="0 0 200 200" className={`w-full h-full transition-all duration-500 ${isBurst ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`}>
     {/* Cell interior */}
     <ellipse cx="100" cy="100" rx={60 + (penicillinDose * 0.2)} ry={40 + (penicillinDose * 0.1)} fill="#fecaca" />
     {/* DNA */}
     <path d="M 90 90 Q 100 80 110 90 T 100 110 T 80 100" fill="none" stroke="#dc2626" strokeWidth="2" />
     {/* Cell Wall (peptidoglycan) */}
     <ellipse cx="100" cy="100" rx={64 + (penicillinDose * 0.2)} ry={44 + (penicillinDose * 0.1)} fill="none" stroke="#059669" strokeWidth="6" 
     strokeDasharray={penicillinDose > 20 ? (penicillinDose > 50 ? "10 20" : "20 5") : "none"} 
     />
     {/* Water rushing in */}
     {penicillinDose > 30 && (
     <g className="animate-pulse">
      <circle cx="20" cy="100" r="3" fill="#3b82f6" />
      <circle cx="30" cy="110" r="3" fill="#3b82f6" />
      <circle cx="180" cy="90" r="3" fill="#3b82f6" />
      <circle cx="170" cy="80" r="3" fill="#3b82f6" />
      <path d="M 30 100 L 50 100 M 170 100 L 150 100" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow)" />
     </g>
     )}
    </svg>
    {isBurst && (
     <div className="absolute inset-0 flex items-center justify-center font-bold text-red-600 text-xl tracking-widest bg-red-50/80 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
     
                                          {t('lab.b12pharmacologyecology_cell_lysed')}
                                          </div>
    )}
    </div>
   </div>
   ) : (
   <div className="flex-1 flex flex-col items-center">
    <div className="w-full mb-6">
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
     <span>{t('lab.b12pharmacologyecology_atmospheric_pco_ppm')}</span>
     <span className="font-bold text-blue-600">{pCO2}</span>
    </label>
    <input 
     type="range" min="280" max="1000" value={pCO2}
     onChange={(e) => setPCO2(Number(e.target.value))}
     className="w-full accent-blue-600"
    />
    <div className={`text-center text-xs mt-2 font-mono bg-blue-50 p-1 rounded border border-blue-200 dark:bg-teal-950/20 dark:border-teal-900 flex-col `}>{t('lab.b12pharmacologyecology_ocean_ph')} {currentPH}</div>
    </div>

    <div className="relative w-64 h-64 bg-cyan-900 rounded-lg flex items-center justify-center border-4 border-cyan-800 overflow-hidden shadow-inner">
    <svg viewBox="0 0 200 200" className="w-full h-full">
     {/* Water background */}
     <rect width="200" height="200" fill={isBleached ? "#083344" : "#164e63"} className="transition-colors duration-1000" />
     
     {/* Coral Skeleton */}
     <path d="M 50 200 Q 60 140 40 100 Q 80 120 100 160 Q 120 80 160 110 Q 140 160 150 200 Z" fill={isBleached ? "#f8fafc" : "#fdba74"} className="transition-colors duration-1000" />
     
     {/* Zooxanthellae */}
     {!isBleached && (
     <g className="opacity-80 transition-opacity duration-1000">
      <circle cx="60" cy="130" r="3" fill="#166534" />
      <circle cx="70" cy="150" r="2" fill="#166534" />
      <circle cx="110" cy="140" r="3" fill="#166534" />
      <circle cx="130" cy="120" r="2" fill="#166534" />
      <circle cx="140" cy="170" r="3" fill="#166534" />
      <circle cx="50" cy="170" r="2" fill="#166534" />
     </g>
     )}
     {/* Escaping Zooxanthellae */}
     {isBleached && (
     <g className="animate-[bounce_3s_ease-in-out_infinite] opacity-50">
      <circle cx="80" cy="50" r="3" fill="#166534" />
      <circle cx="120" cy="30" r="2" fill="#166534" />
      <circle cx="160" cy="60" r="3" fill="#166534" />
     </g>
     )}
    </svg>
    {isBleached && (
     <div className="absolute top-4 bg-slate-50 dark:bg-[#121212]/90 px-2 py-1 rounded text-xs font-bold text-red-600 shadow">
     
                                              {t('lab.b12pharmacologyecology_bleaching_event')}
                                              </div>
    )}
    </div>
   </div>
   )}
  </div>

  {/* Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col lg:overflow-y-auto ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4">{t('lab.b12pharmacologyecology_comprehensive_assessment')}</h2>
   
   <div className="space-y-4 text-sm">
   <div className="space-y-1">
    <label className="block font-medium text-slate-700 dark:text-[#ffffff]">
    
                                 {t('lab.b12pharmacologyecology_1_which_specific_bacterial_enz')}
                                 </label>
    <input 
    type="text" 
    className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-teal-500 outline-none"
    value={ans1}
    onChange={e => setAns1(e.target.value)}
    placeholder={t('lab.b12pharmacologyecology_e_g_amylase')}
    />
   </div>

   <div className="space-y-1">
    <label className="block font-medium text-slate-700 dark:text-[#ffffff]">
    
                                 {t('lab.b12pharmacologyecology_2_which_phase_of_a_clinical_tr')}
                                 </label>
    <input 
    type="number" min="1" max="4"
    className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-teal-500 outline-none"
    value={ans2}
    onChange={e => setAns2(e.target.value)}
    />
   </div>

   <div className="space-y-1">
    <label className="block font-medium text-slate-700 dark:text-[#ffffff]">
    
                                 {t('lab.b12pharmacologyecology_3_if_the_concentration_of_h_io')}
                                 </label>
    <input 
    type="number" step="0.1"
    className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-teal-500 outline-none"
    value={ans3}
    onChange={e => setAns3(e.target.value)}
    placeholder={t('lab.b12pharmacologyecology_e_g_7_5')}
    />
   </div>

   <button 
    onClick={checkAnswers}
    className="w-full bg-[#121212] dark:bg-[#121212] text-white font-semibold py-2 mt-4 rounded hover:bg-[#000000] dark:bg-[#121212] transition-colors flex items-center justify-center gap-2">
    <CheckCircle className="w-5 h-5" />  {t('lab.b12pharmacologyecology_submit_assessment')}
                            </button>

   {feedback && (
    <div className={`p-3 mt-2 rounded text-sm font-medium ${feedback.includes('Excellent') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
    {feedback}
    </div>
   )}
   </div>
  </div>
  </main>
 </div>
 );
}
