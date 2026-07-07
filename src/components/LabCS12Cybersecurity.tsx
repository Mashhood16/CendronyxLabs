import { useState, useEffect } from 'react';
import { Shield, Lock, Server, Activity, FileWarning, Key, Save } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

export default function LabCS12Cybersecurity({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [activeTab, setActiveTab] = useState<'network' | 'crypto'>('network');
 
 const [attack, setAttack] = useState<'none' | 'ddos' | 'ransomware'>('none');
 const [mitigation, setMitigation] = useState<'none' | 'waf' | 'backup'>('none');
 const [serverHealth, setServerHealth] = useState(100);
 
 const [cipherType, setCipherType] = useState<'caesar' | 'vigenere'>('caesar');
 const [cryptoInput, setCryptoInput] = useState('SECURITY');
 const [cryptoKey, setCryptoKey] = useState('3');
 const [cryptoOutput, setCryptoOutput] = useState('');
 
 const [q1Answer, setQ1Answer] = useState('');
 const [q2Answer, setQ2Answer] = useState('');
 const [assessmentStatus, setAssessmentStatus] = useState<string | null>(null);

 useEffect(() => {
 let interval: ReturnType<typeof setInterval>;
 if (attack === 'ddos' && mitigation !== 'waf') {
  interval = setInterval(() => setServerHealth(h => Math.max(0, h - 5)), 500);
 } else if (attack === 'ransomware' && mitigation !== 'backup') {
  interval = setInterval(() => setServerHealth(h => Math.max(0, h - 10)), 1000);
 } else {
  interval = setInterval(() => setServerHealth(h => Math.min(100, h + 2)), 1000);
 }
 return () => clearInterval(interval);
 }, [attack, mitigation]);

 useEffect(() => {
 if (cipherType === 'caesar') {
  const shift = parseInt(cryptoKey) || 0;
  const out = cryptoInput.toUpperCase().split('').map(c => {
  if (c >= 'A' && c <= 'Z') {
   return String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26 + 26) % 26 + 65);
  }
  return c;
  }).join('');
  setCryptoOutput(out);
 } else {
  const key = cryptoKey.toUpperCase().replace(/[^A-Z]/g, '') || 'A';
  const out = cryptoInput.toUpperCase().split('').map((c, i) => {
  if (c >= 'A' && c <= 'Z') {
   const shift = key.charCodeAt(i % key.length) - 65;
   return String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26 + 26) % 26 + 65);
  }
  return c;
  }).join('');
  setCryptoOutput(out);
 }
 }, [cipherType, cryptoInput, cryptoKey]);

 const checkAnswers = () => {
 const q1Correct = q1Answer.toLowerCase().trim() === 'waf';
 const q2Correct = q2Answer.toUpperCase().trim() === 'HELLO';
 
 if (q1Correct && q2Correct) {
  setAssessmentStatus('Success! You have secured the network and decrypted the message.');
 } else {
  setAssessmentStatus('Some answers are incorrect. Review the concepts and try again.');
 }
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none overflow-hidden min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} variant="dark" title={t('lab.cs12cybersecurity_grade_12_infosec_cyber_defense')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.cs12cybersecurity_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.cs12cybersecurity_lab')}</button>
  </div>
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg: lg:overflow-visible">
  
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col lg:overflow-y-auto `}>
   <div className={`p-4 border-b border-slate-100 bg-slate-50 dark:bg-[#121212]/50 flex-col `}>
   <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-[#ffffff]">
    <Activity size={18} className="text-blue-500" />
    
                             {t('lab.cs12cybersecurity_cyber_threat_landscape')}
                            </h2>
   </div>
   <div className="p-4 space-y-6 text-slate-600 dark:text-[#a1a1aa] text-sm">
   <section>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.cs12cybersecurity_network_attacks')}</h3>
    <ul className="list-disc pl-4 space-y-2">
    <li><strong>{t('lab.cs12cybersecurity_ddos_distributed_denial_of_ser')}</strong>  {t('lab.cs12cybersecurity_overwhelming_a_server_with_mas')}</li>
    <li><strong>{t('lab.cs12cybersecurity_ransomware')}</strong>  {t('lab.cs12cybersecurity_malware_that_encrypts_system_f')}</li>
    </ul>
   </section>
   
   <section>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.cs12cybersecurity_mitigation_strategies')}</h3>
    <ul className="list-disc pl-4 space-y-2">
    <li><strong>{t('lab.cs12cybersecurity_waf_web_application_firewall')}</strong>  {t('lab.cs12cybersecurity_filters_and_blocks_malicious_t')}</li>
    <li><strong>{t('lab.cs12cybersecurity_secure_backups')}</strong>  {t('lab.cs12cybersecurity_offline_immutable_backups_ensu')}</li>
    </ul>
   </section>
   
   <section>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.cs12cybersecurity_symmetric_cryptography')}</h3>
    <p className="mb-2">{t('lab.cs12cybersecurity_uses_the_same_key_for_encrypti')}</p>
    <ul className="list-disc pl-4 space-y-2">
    <li><strong>{t('lab.cs12cybersecurity_caesar_cipher')}</strong>  {t('lab.cs12cybersecurity_a_simple_substitution_cipher_t')}</li>
    <li><strong>{t('lab.cs12cybersecurity_vigen_re_cipher')}</strong>  {t('lab.cs12cybersecurity_uses_a_keyword_to_apply_varyin')}</li>
    </ul>
   </section>
   </div>
  </div>

  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col overflow- `}>
   <div className="flex border-b border-slate-200 dark:border-[#1c1b1b]">
   <button 
    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'network' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 dark:text-[#a1a1aa] hover:text-slate-700 dark:text-[#ffffff] hover:bg-slate-50 dark:bg-[#121212]'}`}
    onClick={() => setActiveTab('network')}
   >
    
                             {t('lab.cs12cybersecurity_network_monitor')}
                            </button>
   <button 
    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'crypto' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 dark:text-[#a1a1aa] hover:text-slate-700 dark:text-[#ffffff] hover:bg-slate-50 dark:bg-[#121212]'}`}
    onClick={() => setActiveTab('crypto')}
   >
    
                             {t('lab.cs12cybersecurity_cipher_machine')}
                            </button>
   </div>
   
   <div className="flex-1 p-4 flex flex-col bg-[#000000] dark:bg-[#121212] text-slate-200 relative lg:overflow-hidden">
   {activeTab === 'network' ? (
    <div className="flex flex-col h-full gap-4">
    <div className="flex justify-between flex-wrap gap-2">
     <div className="space-x-2">
     <button onClick={() => setAttack('ddos')} className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${attack === 'ddos' ? 'bg-red-600 text-white' : 'bg-slate-700 dark:bg-[#121212] hover:bg-slate-600 dark:bg-[#121212]'}`}>{t('lab.cs12cybersecurity_simulate_ddos')}</button>
     <button onClick={() => setAttack('ransomware')} className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${attack === 'ransomware' ? 'bg-orange-600 text-white' : 'bg-slate-700 dark:bg-[#121212] hover:bg-slate-600 dark:bg-[#121212]'}`}>{t('lab.cs12cybersecurity_simulate_ransomware')}</button>
     <button onClick={() => setAttack('none')} className="px-3 py-1.5 rounded text-xs font-bold bg-slate-700 dark:bg-[#121212] hover:bg-slate-600 dark:bg-[#121212] transition-colors">{t('lab.cs12cybersecurity_clear_threats')}</button>
     </div>
     <div className="space-x-2">
     <button onClick={() => setMitigation(mitigation === 'waf' ? 'none' : 'waf')} className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${mitigation === 'waf' ? 'bg-blue-600 text-white' : 'bg-slate-700 dark:bg-[#121212] hover:bg-slate-600 dark:bg-[#121212]'}`}>{t('lab.cs12cybersecurity_toggle_waf')}</button>
     <button onClick={() => setMitigation(mitigation === 'backup' ? 'none' : 'backup')} className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${mitigation === 'backup' ? 'bg-blue-600 text-white' : 'bg-slate-700 dark:bg-[#121212] hover:bg-slate-600 dark:bg-[#121212]'}`}>{t('lab.cs12cybersecurity_deploy_backup')}</button>
     </div>
    </div>
    
    <div className="flex-1 flex items-center justify-center relative border border-[#1c1b1b] dark:border-[#1c1b1b] rounded-lg overflow-hidden bg-slate-950">
     <div className="absolute inset-0 flex items-center justify-center z-10">
     <div className={`flex flex-col items-center transition-colors duration-500 ${serverHealth < 30 ? 'text-red-500' : 'text-emerald-500'}`}>
      {attack === 'ransomware' && mitigation !== 'backup' ? (
      <FileWarning size={72} className="animate-pulse" />
      ) : (
      <Server size={72} className={attack === 'ddos' && mitigation !== 'waf' ? 'animate-bounce' : ''} />
      )}
      <div className="mt-4 font-mono text-sm bg-[#000000] dark:bg-[#121212] px-3 py-1 rounded border border-[#1c1b1b] dark:border-[#1c1b1b]">
      
                                                   {t('lab.cs12cybersecurity_main_server')}{serverHealth}%)
      </div>
     </div>
     </div>
     
     {mitigation === 'waf' && (
     <div className="absolute left-1/4 top-1/2 -translate-y-1/2 text-blue-500 opacity-80 z-20">
      <Shield size={120} className="animate-pulse" />
     </div>
     )}

     <div className="absolute left-0 top-0 bottom-0 w-1/4 pointer-events-none z-0">
     {Array.from({ length: attack === 'ddos' ? 40 : 8 }).map((_, i) => (
      <div 
      key={i} 
      className={`absolute h-1.5 w-6 rounded-full ${attack === 'ddos' ? 'bg-red-500' : 'bg-emerald-500'}`}
      style={{
       top: `${Math.random() * 100}%`,
       left: `-${Math.random() * 20}%`,
       animation: `slideRight ${Math.random() * 1 + 0.5}s linear infinite`
      }}
      />
     ))}
     </div>
    </div>
    </div>
   ) : (
    <div className="flex flex-col h-full gap-6">
    <div className={`w-full flex gap-6 justify-center bg-[#121212] dark:bg-[#121212] p-3 rounded-lg flex-col  ? 'flex' : 'hidden'} lg:flex`}>
     <label className="flex items-center gap-2 cursor-pointer font-medium">
     <input type="radio" checked={cipherType === 'caesar'} onChange={() => setCipherType('caesar')} className="accent-blue-500 w-4 h-4" />  {t('lab.cs12cybersecurity_caesar_cipher_1')}
                                              </label>
     <label className="flex items-center gap-2 cursor-pointer font-medium">
     <input type="radio" checked={cipherType === 'vigenere'} onChange={() => setCipherType('vigenere')} className="accent-blue-500 w-4 h-4" />  {t('lab.cs12cybersecurity_vigen_re_cipher_1')}
                                              </label>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
     <div>
     <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">{t('lab.cs12cybersecurity_plaintext_input')}</label>
     <input 
      type="text" 
      value={cryptoInput} 
      onChange={e => setCryptoInput(e.target.value)} 
      className={`w-full bg-[#121212] dark:bg-[#121212] border border-[#1c1b1b] dark:border-[#1c1b1b] rounded-lg p-3 text-white font-mono uppercase focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all  'block' : 'hidden'} lg:block`}
     />
     </div>
     <div>
     <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">{t('lab.cs12cybersecurity_encryption_key')} {cipherType === 'caesar' ? '(Number)' : '(Word)'}</label>
     <input 
      type={cipherType === 'caesar' ? 'number' : 'text'} 
      value={cryptoKey} 
      onChange={e => setCryptoKey(e.target.value)} 
      className={`w-full bg-[#121212] dark:bg-[#121212] border border-[#1c1b1b] dark:border-[#1c1b1b] rounded-lg p-3 text-emerald-400 font-mono uppercase focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all  'block' : 'hidden'} lg:block`}
     />
     </div>
    </div>
    
    <div className="flex-1 flex flex-col items-center justify-center">
     <Lock size={32} className="text-slate-500 dark:text-[#71717a] mb-4" />
     <div className="bg-slate-950 p-6 rounded-xl border border-[#1c1b1b] dark:border-[#1c1b1b] w-full text-center shadow-inner">
     <label className="block text-xs font-bold text-slate-500 dark:text-[#71717a] mb-2 uppercase">{t('lab.cs12cybersecurity_ciphertext_output')}</label>
     <div className="font-mono text-2xl tracking-[0.25em] text-blue-400 break-all">
      {cryptoOutput || '...'}
     </div>
     </div>
    </div>
    </div>
   )}
   <style>{`
    @keyframes slideRight {
    to { transform: translateX(800px); }
    }
   `}</style>
   </div>
  </div>

  <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col lg:overflow-y-auto">
   <div className="p-4 border-b border-slate-100 bg-slate-50 dark:bg-[#121212]/50">
   <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-[#ffffff]">
    <Key size={18} className="text-amber-500" />
    
                             {t('lab.cs12cybersecurity_security_assessment')}
                            </h2>
   </div>
   <div className="p-4 space-y-6 flex-1">
   
   <div className="space-y-3">
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] leading-relaxed">
    
                                 {t('lab.cs12cybersecurity_1_your_server_is_flooded_with_')}
                                 </label>
    <input
    type="text"
    value={q1Answer}
    onChange={(e) => setQ1Answer(e.target.value)}
    placeholder={t('lab.cs12cybersecurity_enter_acronym')}
    className={`w-full border border-slate-300 dark:border-[#1c1b1b] rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono bg-slate-50 dark:bg-[#121212] `}
    />
   </div>

   <div className="space-y-3">
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] leading-relaxed">
    
                                 {t('lab.cs12cybersecurity_2_you_intercepted_a_message_en')} <code className="bg-slate-100 dark:bg-[#121212] px-1 py-0.5 rounded text-red-600">{t('lab.cs12cybersecurity_khoor')}</code>{t('lab.cs12cybersecurity_use_the_cipher_machine_backwar')}
                                 </label>
    <input
    type="text"
    value={q2Answer}
    onChange={(e) => setQ2Answer(e.target.value)}
    placeholder={t('lab.cs12cybersecurity_enter_plaintext')}
    className="w-full border border-slate-300 dark:border-[#1c1b1b] rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono bg-slate-50 dark:bg-[#121212]"
    />
   </div>

   <button
    onClick={checkAnswers}
    className="w-full bg-[#121212] dark:!bg-[#121212] text-white font-medium py-3 rounded-lg hover:bg-slate-700 dark:!bg-[#121212] transition-colors shadow-sm"
   >
    
                             {t('lab.cs12cybersecurity_verify_solutions')}
                            </button>

   {assessmentStatus && (
    <div className={`p-4 rounded-lg text-sm font-medium border ${assessmentStatus.includes('Success') ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
    {assessmentStatus}
    </div>
   )}

   <div className="pt-4 border-t border-slate-200 dark:border-[#1c1b1b] mt-6">
    <button 
    onClick={() => {
     if (onExit) onExit();
    }}
    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
    >
    <Save size={20} />
    
                                 {t('lab.cs12cybersecurity_submit_results_exit')}
                                 </button>
   </div>
   </div>
  </div>

  </div>
 </div>
 );
}
