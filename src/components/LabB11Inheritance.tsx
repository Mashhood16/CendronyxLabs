import { useState } from 'react';
import { Activity, HeartPulse, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

export default function LabB11Inheritance({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeTab, setActiveTab] = useState<'transfusion' | 'hdn'>('transfusion');

 // Transfusion State
 const [patientType, setPatientType] = useState('A');
 const [patientRh, setPatientRh] = useState('+');
 const [donorType, setDonorType] = useState('A');
 const [donorRh, setDonorRh] = useState('+');
 const [transfusionResult, setTransfusionResult] = useState<'idle' | 'simulating' | 'success' | 'agglutination'>('idle');

 // HDN State
 const [motherRh, setMotherRh] = useState('-');
 const [babyRh, setBabyRh] = useState('+');
 const [rhogamGiven, setRhogamGiven] = useState(false);
 const [hdnResult, setHdnResult] = useState<'idle' | 'simulating' | 'safe' | 'hdn'>('idle');

 // Assessment State
 const [q1Answer, setQ1Answer] = useState('');
 const [q2Answer, setQ2Answer] = useState('');
 const [q3Answer, setQ3Answer] = useState('');
 const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'checking' | 'passed' | 'failed'>('idle');

 // Helpers
 const checkCompatibility = (pType: string, pRh: string, dType: string, dRh: string) => {
 // Check ABO
 let aboCompatible = true;
 if (pType === 'O' && dType !== 'O') aboCompatible = false;
 if (pType === 'A' && (dType === 'B' || dType === 'AB')) aboCompatible = false;
 if (pType === 'B' && (dType === 'A' || dType === 'AB')) aboCompatible = false;
 
 // Check Rh
 let rhCompatible = true;
 if (pRh === '-' && dRh === '+') rhCompatible = false;

 return aboCompatible && rhCompatible;
 };

 const handleTransfuse = () => {
 setTransfusionResult('simulating');
 setTimeout(() => {
  const isCompatible = checkCompatibility(patientType, patientRh, donorType, donorRh);
  setTransfusionResult(isCompatible ? 'success' : 'agglutination');
 }, 1500);
 };

 const handlePregnancy = () => {
 setHdnResult('simulating');
 setTimeout(() => {
  if (motherRh === '-' && babyRh === '+' && !rhogamGiven) {
  setHdnResult('hdn');
  } else {
  setHdnResult('safe');
  }
 }, 1500);
 };

 const checkAnswers = () => {
 setAssessmentStatus('checking');
 setTimeout(() => {
  const q1 = q1Answer.trim().toUpperCase().replace(/\s/g, '');
  const isQ1Correct = q1 === 'O-,B-' || q1 === 'B-,O-';
  
  const q2 = q2Answer.trim().toLowerCase();
  const isQ2Correct = q2 === 'yes';

  const q3 = q3Answer.trim().toUpperCase().replace(/\s/g, '');
  const isQ3Correct = q3 === 'A,B,RH' || q3 === 'A,RH,B' || q3 === 'B,A,RH' || q3 === 'B,RH,A' || q3 === 'RH,A,B' || q3 === 'RH,B,A';

  if (isQ1Correct && isQ2Correct && isQ3Correct) {
  setAssessmentStatus('passed');
  } else {
  setAssessmentStatus('failed');
  }
 }, 800);
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.b11inheritance_genetics_inheritance_lab')} variant="dark" subtitle={t('lab.subtitle_blood_types_hemolytic')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.b11inheritance_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.b11inheritance_lab')}</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 lg:flex-1 lg: lg:overflow-visible">
  
  {/* Column 1: Theory */}
  <div className={`w-full bg-slate-50 dark:bg-[#121212] p-6 border-r lg:overflow-y-auto flex-col  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-2xl font-bold text-gray-800 dark:text-[#ffffff] mb-4">{t('lab.b11inheritance_background_theory')}</h2>
   
   <div className="space-y-6 text-gray-600">
   <section>
    <h3 className="text-lg font-semibold text-rose-700 flex items-center gap-2 mb-2">
    <HeartPulse size={18} />  {t('lab.b11inheritance_abo_rh_blood_groups')}
                                 </h3>
    <p className="mb-2">
    
                                 {t('lab.b11inheritance_human_blood_type_is_determined')}
                                 </p>
    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm mb-2">
    <li><strong>{t('lab.b11inheritance_type_a')}</strong>  {t('lab.b11inheritance_has_a_antigens_anti_b_antibodi')}</li>
    <li><strong>{t('lab.b11inheritance_type_b')}</strong>  {t('lab.b11inheritance_has_b_antigens_anti_a_antibodi')}</li>
    <li><strong>{t('lab.b11inheritance_type_ab')}</strong>  {t('lab.b11inheritance_has_a_b_antigens_no_antibodies')}</li>
    <li><strong>{t('lab.b11inheritance_type_o')}</strong>  {t('lab.b11inheritance_has_no_antigens_anti_a_anti_b_')}</li>
    </ul>
    <p className="text-sm">
    
                                 {t('lab.b11inheritance_the_rh_factor_is_another_antig')}
                                 </p>
   </section>

   <section>
    <h3 className="text-lg font-semibold text-rose-700 flex items-center gap-2 mb-2">
    <ShieldAlert size={18} />  {t('lab.b11inheritance_hemolytic_disease_of_the_newbo')}
                                 </h3>
    <p className="text-sm">
    
                                 {t('lab.b11inheritance_hdn_occurs_when_an_rh_mother_c')} 
                                 </p>
    <p className="mt-2 text-sm">
    
                                 {t('lab.b11inheritance_in_a_subsequent_pregnancy_with')} <strong>{t('lab.b11inheritance_rhogam')}</strong>  {t('lab.b11inheritance_is_an_injection_of_anti_rh_ant')}
                                 </p>
   </section>
   </div>
  </div>

  {/* Column 2: Simulator */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] p-6 flex flex-col lg:  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className={`flex bg-slate-50 dark:!bg-[#121212] rounded-lg p-1 shadow-sm mb-6 shrink-0 `}>
   <button 
    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'transfusion' ? 'bg-rose-100 text-rose-800' : 'text-gray-500 hover:bg-gray-50'}`}
    onClick={() => { setActiveTab('transfusion'); setTransfusionResult('idle'); }}
   >
    
                             {t('lab.b11inheritance_transfusion_simulator')}
                            </button>
   <button 
    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'hdn' ? 'bg-rose-100 text-rose-800' : 'text-gray-500 hover:bg-gray-50'}`}
    onClick={() => { setActiveTab('hdn'); setHdnResult('idle'); }}
   >
    
                             {t('lab.b11inheritance_hdn_simulator')}
                            </button>
   </div>

   {activeTab === 'transfusion' && (
   <div className="flex-1 flex flex-col">
    <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border p-6 flex-1 flex flex-col `}>
    <h3 className="font-bold text-gray-800 dark:text-[#ffffff] mb-4">{t('lab.b11inheritance_cross_match_simulator')}</h3>
    
    <div className="grid grid-cols-2 gap-4 mb-6">
     <div className={`p-4 bg-gray-50 rounded-lg border flex-col `}>
     <h4 className="text-sm font-bold text-gray-600 mb-2">{t('lab.b11inheritance_patient_recipient')}</h4>
     <div className="flex gap-2 mb-2">
      <select className="border rounded p-1 flex-1" value={patientType} onChange={(e) => {setPatientType(e.target.value); setTransfusionResult('idle');}}>
      <option value="A">{t('lab.b11inheritance_type_a_1')}</option>
      <option value="B">{t('lab.b11inheritance_type_b_1')}</option>
      <option value="AB">{t('lab.b11inheritance_type_ab_1')}</option>
      <option value="O">{t('lab.b11inheritance_type_o_1')}</option>
      </select>
      <select className="border rounded p-1 w-16" value={patientRh} onChange={(e) => {setPatientRh(e.target.value); setTransfusionResult('idle');}}>
      <option value="+">+</option>
      <option value="-">-</option>
      </select>
     </div>
     </div>
     <div className="p-4 bg-red-50 rounded-lg border border-red-100">
     <h4 className="text-sm font-bold text-red-800 mb-2">{t('lab.b11inheritance_donor_blood')}</h4>
     <div className="flex gap-2 mb-2">
      <select className="border rounded p-1 flex-1 border-red-200" value={donorType} onChange={(e) => {setDonorType(e.target.value); setTransfusionResult('idle');}}>
      <option value="A">{t('lab.b11inheritance_type_a_1')}</option>
      <option value="B">{t('lab.b11inheritance_type_b_1')}</option>
      <option value="AB">{t('lab.b11inheritance_type_ab_1')}</option>
      <option value="O">{t('lab.b11inheritance_type_o_1')}</option>
      </select>
      <select className="border rounded p-1 w-16 border-red-200" value={donorRh} onChange={(e) => {setDonorRh(e.target.value); setTransfusionResult('idle');}}>
      <option value="+">+</option>
      <option value="-">-</option>
      </select>
     </div>
     </div>
    </div>

    <div className="flex flex-col items-center justify-center flex-1 relative mb-6 min-h-[200px] bg-slate-50 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] overflow-hidden">
     {transfusionResult === 'idle' && (
     <div className="text-gray-400 text-sm flex flex-col items-center">
      <Activity size={32} className="mb-2 opacity-50" />
      
                                               {t('lab.b11inheritance_select_blood_types_and_click_t')}
                                              </div>
     )}
     {transfusionResult === 'simulating' && (
     <div className="flex items-center gap-2 text-rose-600 font-bold animate-pulse">
      <HeartPulse size={24} />  {t('lab.b11inheritance_transfusing')}
                                              </div>
     )}
     {transfusionResult === 'success' && (
     <div className="w-full h-full flex flex-col items-center justify-center bg-green-50 dark:bg-[#121212] dark:border-[#1c1b1b]">
      <svg width="100" height="100" viewBox="0 0 100 100">
      {/* Healthy flowing RBCs */}
      <circle cx="20" cy="50" r="12" fill="#ef4444" className="animate-bounce" />
      <circle cx="50" cy="50" r="12" fill="#ef4444" className="animate-bounce" style={{animationDelay: '0.1s'}} />
      <circle cx="80" cy="50" r="12" fill="#ef4444" className="animate-bounce" style={{animationDelay: '0.2s'}} />
      </svg>
      <span className="text-green-700 font-bold mt-2 flex items-center gap-1"><CheckCircle size={18}/>  {t('lab.b11inheritance_compatible')}</span>
      <p className="text-xs text-green-600 mt-1">{t('lab.b11inheritance_no_immune_reaction_occurred')}</p>
     </div>
     )}
     {transfusionResult === 'agglutination' && (
     <div className="w-full lg:h-full flex flex-col items-center justify-center bg-red-50 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
      <svg width="100" height="100" viewBox="0 0 100 100">
      {/* Clumped RBCs with antibodies */}
      <circle cx="50" cy="40" r="15" fill="#7f1d1d" />
      <circle cx="40" cy="55" r="15" fill="#991b1b" />
      <circle cx="60" cy="55" r="15" fill="#7f1d1d" />
      <path d="M45,40 L55,40 L50,30 Z" fill="#fbbf24" />
      <path d="M35,50 L45,50 L40,60 Z" fill="#fbbf24" />
      </svg>
      <span className="text-red-700 font-bold mt-2 flex items-center gap-1"><XCircle size={18}/>  {t('lab.b11inheritance_agglutination')}</span>
      <p className="text-xs text-red-600 mt-1">{t('lab.b11inheritance_patient_antibodies_attacked_do')}</p>
     </div>
     )}
    </div>

    <button 
     onClick={handleTransfuse}
     disabled={transfusionResult === 'simulating'}
     className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-lg font-bold shadow-md transition-colors disabled:opacity-50 dark:text-white dark:text-white dark:bg-rose-500 dark:hover:bg-rose-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-rose-500/40"
    >
     
                                      {t('lab.b11inheritance_initiate_transfusion')}
                                     </button>
    </div>
   </div>
   )}

   {activeTab === 'hdn' && (
   <div className="flex-1 flex flex-col">
    <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border p-6 flex-1 flex flex-col `}>
    <h3 className="font-bold text-gray-800 dark:text-[#ffffff] mb-4">{t('lab.b11inheritance_pregnancy_hdn_simulator')}</h3>
    
    <div className="grid grid-cols-2 gap-4 mb-6">
     <div>
     <label className="block text-sm font-bold text-gray-600 mb-1">{t('lab.b11inheritance_mother_rh_factor')}</label>
     <select className="w-full border rounded p-2" value={motherRh} onChange={(e) => {setMotherRh(e.target.value); setHdnResult('idle');}}>
      <option value="-">{t('lab.b11inheritance_rh_negative')}</option>
      <option value="+">{t('lab.b11inheritance_rh_positive')}</option>
     </select>
     </div>
     <div>
     <label className="block text-sm font-bold text-gray-600 mb-1">{t('lab.b11inheritance_fetus_rh_factor')}</label>
     <select className="w-full border rounded p-2" value={babyRh} onChange={(e) => {setBabyRh(e.target.value); setHdnResult('idle');}}>
      <option value="+">{t('lab.b11inheritance_rh_positive')}</option>
      <option value="-">{t('lab.b11inheritance_rh_negative')}</option>
     </select>
     </div>
    </div>

    <div className="mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center justify-between dark:bg-teal-950/20 dark:border-teal-900">
     <div>
     <h4 className="font-bold text-blue-900 text-sm dark:text-[#ffffff]">{t('lab.b11inheritance_administer_rhogam')}</h4>
     <p className="text-xs text-blue-700">{t('lab.b11inheritance_given_at_28_weeks_post_partum')}</p>
     </div>
     <label className="relative inline-flex items-center cursor-pointer">
     <input type="checkbox" className="sr-only peer" checked={rhogamGiven} onChange={(e) => {setRhogamGiven(e.target.checked); setHdnResult('idle');}} />
     <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-50 dark:bg-[#121212] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
     </label>
    </div>

    <div className={`flex-col items-center justify-center flex-1 relative mb-6 min-h-[150px] bg-slate-50 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] overflow- p-4 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
     {hdnResult === 'idle' && <p className="text-gray-400 text-sm text-center">{t('lab.b11inheritance_set_the_rh_factors_and_simulat')}</p>}
     {hdnResult === 'simulating' && <p className="text-rose-600 font-bold animate-pulse">{t('lab.b11inheritance_simulating_2nd_pregnancy')}</p>}
     {hdnResult === 'safe' && (
     <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-2">
      <CheckCircle size={32} />
      </div>
      <h4 className="font-bold text-green-800 dark:text-[#ffffff]">{t('lab.b11inheritance_healthy_baby')}</h4>
      <p className="text-xs text-green-600">{t('lab.b11inheritance_no_antibody_attack_occurred')}</p>
     </div>
     )}
     {hdnResult === 'hdn' && (
     <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-2">
      <ShieldAlert size={32} />
      </div>
      <h4 className="font-bold text-red-800">{t('lab.b11inheritance_hemolytic_disease_hdn')}</h4>
      <p className="text-xs text-red-600">{t('lab.b11inheritance_maternal_anti_d_antibodies_des')}</p>
     </div>
     )}
    </div>

    <button 
     onClick={handlePregnancy}
     disabled={hdnResult === 'simulating'}
     className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold shadow-md transition-colors disabled:opacity-50 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
     
                                      {t('lab.b11inheritance_simulate_pregnancy')}
                                     </button>
    </div>
   </div>
   )}
  </div>

  {/* Column 3: Assessment */}
  <div className="bg-slate-50 dark:bg-[#121212] p-6 border-l flex flex-col lg:overflow-y-auto">
   <h2 className="text-2xl font-bold text-gray-800 dark:text-[#ffffff] mb-4">{t('lab.b11inheritance_assessment')}</h2>
   
   <div className="bg-rose-50 rounded-xl p-5 border border-rose-100 flex-1 flex flex-col dark:bg-[#121212] dark:border-[#1c1b1b]">
   <h3 className="font-bold text-rose-900 mb-4">{t('lab.b11inheritance_clinical_scenarios')}</h3>
   
   <div className="space-y-6 flex-1">
    <div>
    <label className="block text-sm font-medium text-gray-800 dark:text-[#ffffff] mb-1">
     
                                      {t('lab.b11inheritance_1_a_patient_with_b_blood_needs')}
                                     </label>
    <input 
     type="text" 
     value={q1Answer}
     onChange={(e) => setQ1Answer(e.target.value)}
     placeholder={t('lab.b11inheritance_e_g_o_ab')}
     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none text-sm"
    />
    <p className="text-xs text-gray-500 mt-1">{t('lab.b11inheritance_format_comma_separated_no_spac')}</p>
    </div>

    <div>
    <label className="block text-sm font-medium text-gray-800 dark:text-[#ffffff] mb-1">
     
                                      {t('lab.b11inheritance_2_an_a_mother_gives_birth_to_a')}
                                     </label>
    <input 
     type="text" 
     value={q2Answer}
     onChange={(e) => setQ2Answer(e.target.value)}
     placeholder={t('lab.b11inheritance_yes_or_no')}
     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none text-sm"
    />
    </div>

    <div>
    <label className="block text-sm font-medium text-gray-800 dark:text-[#ffffff] mb-1">
     
                                      {t('lab.b11inheritance_3_what_surface_antigens_are_pr')}
                                     </label>
    <input 
     type="text" 
     value={q3Answer}
     onChange={(e) => setQ3Answer(e.target.value)}
     placeholder={t('lab.b11inheritance_e_g_a_b')}
     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none text-sm"
    />
    <p className="text-xs text-gray-500 mt-1">{t('lab.b11inheritance_list_them_separated_by_commas_')}</p>
    </div>
   </div>

   <div className="mt-6 pt-4 border-t border-rose-200">
    <button 
    onClick={checkAnswers}
    disabled={assessmentStatus === 'checking'}
    className="w-full bg-rose-700 hover:bg-rose-800 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 dark:text-white dark:text-white dark:bg-rose-600 dark:hover:bg-rose-500 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-rose-500/40"
    >
    {assessmentStatus === 'checking' ? 'Evaluating...' : 'Check Answers'}
    </button>

    {assessmentStatus === 'passed' && (
    <div className="mt-3 p-3 bg-green-100 text-green-800 rounded-lg flex items-center gap-2 text-sm font-medium dark:text-[#ffffff]">
     <CheckCircle size={18} />  {t('lab.b11inheritance_correct_b_receives_o_and_b_mot')}
                                     </div>
    )}
    {assessmentStatus === 'failed' && (
    <div className="mt-3 p-3 bg-red-100 text-red-800 rounded-lg flex items-center gap-2 text-sm font-medium">
     <XCircle size={18} />  {t('lab.b11inheritance_incorrect_review_compatibility')}
                                     </div>
    )}
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
