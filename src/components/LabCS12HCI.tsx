import { useState } from 'react';
import { Monitor, Shield, Activity, Eye, CheckCircle, XCircle, Save } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

export default function LabCS12HCI({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [design, setDesign] = useState<'A' | 'B'>('A');
 const [contrast, setContrast] = useState<'Normal' | 'High'>('Normal');
 const [fontSize, setFontSize] = useState<'Normal' | 'Large'>('Normal');
 const [mfa, setMfa] = useState<'None' | 'SMS' | 'App'>('None');

 const accessibility = 40 + (contrast === 'High' ? 30 : 0) + (fontSize === 'Large' ? 30 : 0);
 const security = 20 + (mfa === 'None' ? 0 : mfa === 'SMS' ? 40 : 70);
 const usability = 80 - (mfa === 'SMS' ? 10 : mfa === 'App' ? 20 : 0) + (design === 'B' ? 10 : 0);
 const conversion = 50 + (design === 'B' ? 20 : 0) - (mfa === 'App' ? 15 : 0);

 const [q1Answer, setQ1Answer] = useState<boolean | null>(null);
 const [q2Answer, setQ2Answer] = useState<boolean | null>(null);

 const checkQ1 = () => {
 if (accessibility >= 90 && usability >= 70) {
  setQ1Answer(true);
 } else {
  setQ1Answer(false);
 }
 };

 const checkQ2 = () => {
 if (security >= 80 && conversion >= 50) {
  setQ2Answer(true);
 } else {
  setQ2Answer(false);
 }
 };

 const handleComplete = () => {
 if (onExit) onExit();
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} variant="dark" title={t('lab.cs12hci_interactive_software_engineeri')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.cs12hci_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.cs12hci_lab')}</button>
  </div>
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:overflow-visible">
  {/* Theory Column */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold mb-4 text-indigo-800 border-b pb-2 dark:text-[#ffffff]">{t('lab.cs12hci_theory_context')}</h2>
   <div className={`space-y-4 text-slate-700 dark:text-[#ffffff] lg:overflow-y-auto pr-2 flex-1 ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block`}>
   <p>
    <strong>{t('lab.cs12hci_human_computer_interaction_hci')}</strong>  {t('lab.cs12hci_is_the_study_of_how_people_int')}
                            </p>
   <h3 className="font-semibold text-indigo-700 mt-2">{t('lab.cs12hci_a_b_testing')}</h3>
   <p>
    
                             {t('lab.cs12hci_a_b_testing_compares_two_versi')}
                            </p>
   <h3 className="font-semibold text-indigo-700 mt-2">{t('lab.cs12hci_accessibility')}</h3>
   <p>
    
                             {t('lab.cs12hci_accessibility_ensures_that_sof')}
                            </p>
   <h3 className="font-semibold text-indigo-700 mt-2">{t('lab.cs12hci_usability_vs_security')}</h3>
   <p>
    
                             {t('lab.cs12hci_implementing_multi_factor_auth')}
                            </p>
   </div>
  </div>

  {/* Simulation Column */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold mb-4 text-indigo-800 border-b pb-2 dark:text-[#ffffff]">{t('lab.cs12hci_ui_configurator_simulator')}</h2>

   <div className="flex-1 flex flex-col gap-4">
   <div className={`flex-1 rounded-lg border-2 border-dashed p-4 flex flex-col items-center justify-center transition-all ${contrast === 'High' ? 'bg-black text-yellow-400 border-yellow-400' : 'bg-slate-100 dark:bg-[#121212] text-slate-800 dark:text-slate-100 border-slate-300 dark:border-[#1c1b1b]'} `}>
    <h3 className={`font-bold mb-2 ${fontSize === 'Large' ? 'text-3xl' : 'text-xl'}`}>
    {design === 'A' ? 'Standard Dashboard (Design A)' : 'Modern Workspace (Design B)'}
    </h3>
    <p className={`text-center mb-4 ${fontSize === 'Large' ? 'text-xl' : 'text-sm'}`}>
    
                                 {t('lab.cs12hci_welcome_back_please_authentica')}
                                 </p>
    {mfa === 'None' && <div className="px-4 py-2 bg-blue-500 text-white rounded /20 dark:border-teal-900 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">{t('lab.cs12hci_login_via_password')}</div>}
    {mfa === 'SMS' && <div className="px-4 py-2 bg-blue-600 text-white rounded dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">{t('lab.cs12hci_login_via_password_sms_otp')}</div>}
    {mfa === 'App' && <div className="px-4 py-2 bg-blue-700 text-white rounded dark:bg-blue-600 dark:hover:bg-blue-500 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">{t('lab.cs12hci_login_via_biometric_app_auth')}</div>}
   </div>

   <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
    <label className="block text-sm font-semibold text-slate-600 dark:text-[#a1a1aa]">{t('lab.cs12hci_layout_design')}</label>
    <select value={design} onChange={(e) => setDesign(e.target.value as 'A' | 'B')} className="w-full p-2 border rounded">
     <option value="A">{t('lab.cs12hci_design_a_standard')}</option>
     <option value="B">{t('lab.cs12hci_design_b_modern')}</option>
    </select>
    </div>
    <div className="space-y-2">
    <label className="block text-sm font-semibold text-slate-600 dark:text-[#a1a1aa]">{t('lab.cs12hci_contrast_mode')}</label>
    <select value={contrast} onChange={(e) => setContrast(e.target.value as 'Normal' | 'High')} className="w-full p-2 border rounded">
     <option value="Normal">{t('lab.cs12hci_normal_contrast')}</option>
     <option value="High">{t('lab.cs12hci_high_contrast')}</option>
    </select>
    </div>
    <div className="space-y-2">
    <label className="block text-sm font-semibold text-slate-600 dark:text-[#a1a1aa]">{t('lab.cs12hci_font_size')}</label>
    <select value={fontSize} onChange={(e) => setFontSize(e.target.value as 'Normal' | 'Large')} className="w-full p-2 border rounded">
     <option value="Normal">{t('lab.cs12hci_normal_text')}</option>
     <option value="Large">{t('lab.cs12hci_large_text')}</option>
    </select>
    </div>
    <div className="space-y-2">
    <label className="block text-sm font-semibold text-slate-600 dark:text-[#a1a1aa]">{t('lab.cs12hci_mfa_level')}</label>
    <select value={mfa} onChange={(e) => setMfa(e.target.value as 'None' | 'SMS' | 'App')} className="w-full p-2 border rounded">
     <option value="None">{t('lab.cs12hci_no_mfa')}</option>
     <option value="SMS">{t('lab.cs12hci_sms_otp')}</option>
     <option value="App">{t('lab.cs12hci_authenticator_app')}</option>
    </select>
    </div>
   </div>

   <div className="grid grid-cols-4 gap-2 mt-2">
    <div className={`bg-slate-50 dark:bg-[#121212] p-2 rounded text-center flex-col `}>
    <div className="text-xs text-slate-500 dark:text-[#71717a] font-bold flex items-center justify-center gap-1"><Eye size={12} />  {t('lab.cs12hci_a11y')}</div>
    <div className={`text-lg font-bold ${accessibility >= 90 ? 'text-green-600' : 'text-slate-700 dark:text-[#ffffff]'}`}>{accessibility}</div>
    </div>
    <div className={`bg-slate-50 dark:bg-[#121212] p-2 rounded text-center flex-col `}>
    <div className="text-xs text-slate-500 dark:text-[#71717a] font-bold flex items-center justify-center gap-1"><Shield size={12} />  {t('lab.cs12hci_sec')}</div>
    <div className={`text-lg font-bold ${security >= 80 ? 'text-green-600' : 'text-slate-700 dark:text-[#ffffff]'}`}>{security}</div>
    </div>
    <div className={`bg-slate-50 dark:bg-[#121212] p-2 rounded text-center flex-col `}>
    <div className="text-xs text-slate-500 dark:text-[#71717a] font-bold flex items-center justify-center gap-1"><Monitor size={12} />  {t('lab.cs12hci_usability')}</div>
    <div className="text-lg font-bold text-slate-700 dark:text-[#ffffff]">{usability}</div>
    </div>
    <div className="bg-slate-50 dark:bg-[#121212] p-2 rounded text-center">
    <div className="text-xs text-slate-500 dark:text-[#71717a] font-bold flex items-center justify-center gap-1"><Activity size={12} />  {t('lab.cs12hci_conv')}</div>
    <div className="text-lg font-bold text-slate-700 dark:text-[#ffffff]">{conversion}%</div>
    </div>
   </div>
   </div>
  </div>

  {/* Assessment Column */}
  <div className={`bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold mb-4 text-indigo-800 border-b pb-2 dark:text-[#ffffff]">{t('lab.cs12hci_analysis_assessment')}</h2>

   <div className="space-y-6 flex-1">
   <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h3 className="font-bold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.cs12hci_task_1_accessible_design')}</h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-3">
    
                                 {t('lab.cs12hci_configure_the_ui_to_achieve_an')} <strong>{t('lab.cs12hci_accessibility_score_of_90_or_h')}</strong>  {t('lab.cs12hci_while_keeping_the')} <strong>{t('lab.cs12hci_usability_score_at_70_or_highe')}</strong>.
    </p>
    <button
    onClick={checkQ1}
    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition-colors flex items-center justify-center gap-2 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
    
                                 {t('lab.cs12hci_check_configuration')}
                                 </button>
    {q1Answer === true && <p className="text-green-600 mt-2 text-sm font-bold flex items-center gap-1"><CheckCircle size={16} />  {t('lab.cs12hci_target_reached')}</p>}
    {q1Answer === false && <p className="text-red-500 mt-2 text-sm font-bold flex items-center gap-1"><XCircle size={16} />  {t('lab.cs12hci_criteria_not_met_yet')}</p>}
   </div>

   <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h3 className="font-bold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.cs12hci_task_2_secure_conversions')}</h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-3">
    
                                 {t('lab.cs12hci_configure_the_ui_to_achieve_a')} <strong>{t('lab.cs12hci_security_score_of_80_or_higher')}</strong>  {t('lab.cs12hci_while_maintaining_a')} <strong>{t('lab.cs12hci_conversion_rate_of_50_or_highe')}</strong>.
    </p>
    <button
    onClick={checkQ2}
    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition-colors flex items-center justify-center gap-2 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
    
                                 {t('lab.cs12hci_check_configuration')}
                                 </button>
    {q2Answer === true && <p className="text-green-600 mt-2 text-sm font-bold flex items-center gap-1"><CheckCircle size={16} />  {t('lab.cs12hci_target_reached')}</p>}
    {q2Answer === false && <p className="text-red-500 mt-2 text-sm font-bold flex items-center gap-1"><XCircle size={16} />  {t('lab.cs12hci_criteria_not_met_yet')}</p>}
   </div>

   <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-sm text-amber-800 dark:bg-[#121212] dark:border-[#1c1b1b] dark:text-[#ffffff]">
    <p className="font-bold mb-1">{t('lab.cs12hci_engineering_takeaway')}</p>
    <p>{t('lab.cs12hci_in_software_engineering_every_')}</p>
   </div>
   </div>

   <div className="pt-4 border-t border-slate-200 dark:border-[#1c1b1b] mt-auto">
   <button
    onClick={handleComplete}
    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
   >
    <Save size={20} />
    
                             {t('lab.cs12hci_submit_results_exit')}
                            </button>
   </div>
  </div>
  </div>
 </div>
 );
}
