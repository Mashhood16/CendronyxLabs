import { useState, useRef } from 'react';
import { Beaker, Sun, ThermometerSun, AlertCircle, CheckSquare, Zap, Moon } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

interface ComponentProps {
 onExit?: () => void;
}

type Reagent = 'Ethene' | 'Hydrogen' | 'Methane' | 'Chlorine' | null;

interface ReactorState {
 reagents: Reagent[];
 catalyst: 'None' | 'Nickel';
 temperature: number; // 20 to 300 C
 sunlight: 'Dark' | 'Diffused' | 'Direct';
}

export default function LabC9OrganicChem({ onExit }: ComponentProps) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [reactor, setReactor] = useState<ReactorState>({
 reagents: [],
 catalyst: 'None',
 temperature: 20,
 sunlight: 'Dark'
 });

 const [equation, setEquation] = useState<string>('Select reagents to begin...');
 const [reactionStatus, setReactionStatus] = useState<'idle' | 'success' | 'explosive' | 'failed'>('idle');
 
 // Data Logging
 const [logs, setLogs] = useState<{ id: number, time: string, eq: string, result: string }[]>([]);
 const logId = useRef<number>(0);

 // Assessment
 const [q1, setQ1] = useState('');
 const [q2, setQ2] = useState('');
 const [feedback, setFeedback] = useState('');

 const addReagent = (r: Reagent) => {
 if (reactor.reagents.length >= 2 || reactionStatus !== 'idle') {
  // reset if finished
  if (reactionStatus !== 'idle') {
  setReactor(prev => ({ ...prev, reagents: [r] }));
  setReactionStatus('idle');
  setEquation(getFormula(r) || '');
  }
  return;
 }
 
 if (r) {
  const newReagents = [...reactor.reagents, r];
  setReactor(prev => ({ ...prev, reagents: newReagents }));
  
  const parts = newReagents.map(getFormula);
  setEquation(parts.join(' + ') + ' → ?');
 }
 };

 const getFormula = (name: Reagent) => {
 switch(name) {
  case 'Ethene': return 'C₂H₄';
  case 'Hydrogen': return 'H₂';
  case 'Methane': return 'CH₄';
  case 'Chlorine': return 'Cl₂';
  default: return '';
 }
 };

 const runReaction = () => {
 const r = reactor.reagents;
 let newEq = equation;
 let status: 'success' | 'explosive' | 'failed' = 'failed';
 let resultLog = 'No reaction occurred.';

 if (r.includes('Ethene') && r.includes('Hydrogen')) {
  if (reactor.catalyst === 'Nickel' && reactor.temperature >= 150) {
  newEq = 'C₂H₄ + H₂ → C₂H₆ (Ethane)';
  status = 'success';
  resultLog = 'Hydrogenation successful (Alkene to Alkane).';
  } else {
  newEq = 'C₂H₄ + H₂ → No Reaction (Check Catalyst/Temp)';
  status = 'failed';
  resultLog = 'Failed: Requires Nickel catalyst and heat (≥150°C).';
  }
 } 
 else if (r.includes('Methane') && r.includes('Chlorine')) {
  if (reactor.sunlight === 'Direct') {
  newEq = 'CH₄ + 2Cl₂ → C + 4HCl (Explosive!)';
  status = 'explosive';
  resultLog = 'Explosive reaction in direct sunlight!';
  } else if (reactor.sunlight === 'Diffused') {
  newEq = 'CH₄ + Cl₂ → CH₃Cl + HCl';
  status = 'success';
  resultLog = 'Substitution reaction successful (Chloromethane formed).';
  } else {
  newEq = 'CH₄ + Cl₂ → No Reaction (Needs UV Light)';
  status = 'failed';
  resultLog = 'Failed: Substitution requires UV light (sunlight).';
  }
 } else if (r.length === 2) {
  newEq = r.map(getFormula).join(' + ') + ' → No Reaction';
  status = 'failed';
  resultLog = 'Invalid reagent combination.';
 }

 setEquation(newEq);
 setReactionStatus(status);

 // Log data
 const newLog = {
  id: logId.current++,
  time: new Date().toLocaleTimeString(),
  eq: newEq,
  result: resultLog
 };
 setLogs(prev => [newLog, ...prev]);
 };

 const clearReactor = () => {
 setReactor(prev => ({ ...prev, reagents: [] }));
 setEquation('Select reagents to begin...');
 setReactionStatus('idle');
 };

 const checkAssessment = () => {
 let score = 0;
 if (q1.toLowerCase().includes('addition') || q1.toLowerCase().includes('hydrogenation')) score++;
 if (q2.toLowerCase().includes('substitution')) score++;

 if (score === 2) setFeedback('Perfect! You identified both reaction types correctly.');
 else if (score === 1) setFeedback('Partial correct. Review the reaction types.');
 else setFeedback('Incorrect. Remember Alkene+H2 is addition, Alkane+Halogen is substitution.');
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.c9organicchem_grade_9_chemistry_organic_reac')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.c9organicchem_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.c9organicchem_lab')}</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:flex-1 lg:overflow-visible">
  
  {/* Column 1: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
   <Beaker className="w-5 h-5 text-indigo-600" />  {t('lab.c9organicchem_reaction_theory')}
                        </h2>
   
   <div className="space-y-4 text-sm text-slate-700 dark:text-[#ffffff]">
   <div className={`bg-indigo-50 p-4 rounded-lg dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
    <h3 className="font-bold text-indigo-800 mb-2 dark:text-[#ffffff]">{t('lab.c9organicchem_1_hydrogenation_of_alkenes')}</h3>
    <p className="mb-2">{t('lab.c9organicchem_alkenes_like_ethene_c_h_are_un')} <b>{t('lab.c9organicchem_addition_reactions')}</b>  {t('lab.c9organicchem_with_hydrogen_gas_to_form_satu')}</p>
    <ul className={`list-disc pl-5 font-mono text-xs text-indigo-900 bg-slate-50 dark:bg-[#121212] p-2 rounded dark:text-[#ffffff] flex-col `}>
    <li>{t('lab.c9organicchem_condition_1_nickel_ni_catalyst')}</li>
    <li>{t('lab.c9organicchem_condition_2_heat_around_150_c_')}</li>
    </ul>
   </div>

   <div className={`bg-orange-50 p-4 rounded-lg flex-col `}>
    <h3 className="font-bold text-orange-800 mb-2">{t('lab.c9organicchem_2_halogenation_of_alkanes')}</h3>
    <p className="mb-2">{t('lab.c9organicchem_alkanes_like_methane_ch_are_sa')} <b>{t('lab.c9organicchem_substitution_reactions')}</b>  {t('lab.c9organicchem_with_halogens_like_chlorine_cl')}</p>
    <ul className="list-disc pl-5 font-mono text-xs text-orange-900 bg-slate-50 dark:bg-[#121212] p-2 rounded">
    <li>{t('lab.c9organicchem_requires_uv_light_sunlight_to_')}</li>
    <li><b>{t('lab.c9organicchem_direct_sunlight')}</b>  {t('lab.c9organicchem_explosive_reaction_forms_carbo')}</li>
    <li><b>{t('lab.c9organicchem_diffused_sunlight')}</b>  {t('lab.c9organicchem_controlled_substitution_forms_')}</li>
    </ul>
   </div>
   </div>
  </div>

  {/* Column 2: Interactive Simulator */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4">{t('lab.c9organicchem_chemical_reactor')}</h2>
   
   <div className="flex-1 flex flex-col gap-6">
   
   {/* Reagent Bottles */}
   <div className="flex justify-between px-4">
    {['Ethene', 'Hydrogen', 'Methane', 'Chlorine'].map((r) => {
    const isSelected = reactor.reagents.includes(r as Reagent);
    const colors: Record<string, string> = {
     'Ethene': 'bg-blue-200', 'Hydrogen': 'bg-gray-100',
     'Methane': 'bg-green-100', 'Chlorine': 'bg-yellow-200'
    };
    return (
     <button
     key={r}
     onClick={() => addReagent(r as Reagent)}
     className={`flex flex-col items-center gap-2 transition-all ${isSelected ? 'opacity-50 scale-95' : 'hover:-translate-y-1'}`}
     >
     <div className={`w-14 h-20 rounded-t-xl rounded-b-md border-2 border-slate-300 dark:border-[#1c1b1b] relative overflow-hidden flex items-end ${colors[r]}`}>
      <div className="absolute top-0 w-full h-4 bg-slate-50 dark:bg-[#121212]/40 border-b border-slate-300 dark:border-[#1c1b1b]"></div>
      <div className="w-full h-2/3 bg-slate-50 dark:bg-[#121212]/20"></div>
     </div>
     <span className="text-xs font-bold">{r}</span>
     </button>
    )
    })}
   </div>

   {/* Reactor Vessel */}
   <div className={`relative w-full h-48 rounded-2xl border-4 flex items-center justify-center flex-col transition-colors ${reactionStatus === 'explosive' ? 'bg-orange-500 border-red-600 animate-pulse' : reactionStatus === 'success' ? 'bg-emerald-50 border-emerald-400' : 'bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] border-slate-300 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b]'}  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
    
    {/* Environment Indicators */}
    <div className="absolute top-2 right-2 flex gap-2">
    {reactor.sunlight === 'Direct' && <Sun className="text-orange-500" />}
    {reactor.sunlight === 'Diffused' && <Sun className="text-yellow-400 opacity-70" />}
    {reactor.sunlight === 'Dark' && <Moon className="text-slate-400" />}
    {reactor.temperature >= 150 && <ThermometerSun className="text-red-500" />}
    {reactor.catalyst === 'Nickel' && <span className="text-xs font-bold bg-[#121212] dark:bg-[#121212] text-white px-2 py-1 rounded">Ni</span>}
    </div>

    {reactionStatus === 'explosive' && <AlertCircle className="w-16 h-16 text-white mb-2" />}
    {reactionStatus === 'success' && <Zap className="w-16 h-16 text-emerald-500 mb-2" />}

    <div className={`text-xl font-mono font-bold text-center px-4 ${reactionStatus === 'explosive' ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
    {equation}
    </div>

   </div>

   {/* Controls */}
   <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-[#121212] p-4 rounded-xl">
    <div>
    <label className="text-xs font-bold text-slate-500 dark:text-[#71717a] uppercase">{t('lab.c9organicchem_catalyst')}</label>
    <select 
     value={reactor.catalyst} 
     onChange={(e) => setReactor(prev => ({ ...prev, catalyst: e.target.value as any }))}
     className="w-full mt-1 p-2 rounded border text-sm"
    >
     <option value="None">{t('lab.c9organicchem_none')}</option>
     <option value="Nickel">{t('lab.c9organicchem_nickel_ni')}</option>
    </select>
    </div>
    
    <div>
    <label className="text-xs font-bold text-slate-500 dark:text-[#71717a] uppercase">{t('lab.c9organicchem_light_condition')}</label>
    <select 
     value={reactor.sunlight} 
     onChange={(e) => setReactor(prev => ({ ...prev, sunlight: e.target.value as any }))}
     className="w-full mt-1 p-2 rounded border text-sm"
    >
     <option value="Dark">{t('lab.c9organicchem_dark')}</option>
     <option value="Diffused">{t('lab.c9organicchem_diffused_sunlight_1')}</option>
     <option value="Direct">{t('lab.c9organicchem_direct_sunlight_1')}</option>
    </select>
    </div>

    <div className="col-span-2">
    <label className="text-xs font-bold text-slate-500 dark:text-[#71717a] uppercase flex justify-between">
     <span>{t('lab.c9organicchem_temperature')}</span>
     <span>{reactor.temperature}°C</span>
    </label>
    <input 
     type="range" min="20" max="300" step="10" 
     value={reactor.temperature} 
     onChange={(e) => setReactor(prev => ({ ...prev, temperature: Number(e.target.value) }))}
     className="w-full mt-2"
    />
    </div>
   </div>

   <div className="flex gap-2">
    <button 
    onClick={runReaction}
    disabled={reactor.reagents.length < 2 || reactionStatus !== 'idle'}
    className="flex-1 py-3 bg-indigo-600 disabled:bg-slate-300 text-white font-bold rounded-lg transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
    
                                 {t('lab.c9organicchem_start_reaction')}
                                 </button>
    <button 
    onClick={clearReactor}
    className="px-4 py-3 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] font-bold rounded-lg hover:bg-slate-300 dark:bg-[#121212] transition-colors"
    >
    
                                 {t('lab.c9organicchem_clear')}
                                 </button>
   </div>

   </div>
  </div>

  {/* Column 3: Data Logging & Assessment */}
  <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col overflow-hidden">
   
   <div className="p-4 border-b bg-slate-50 dark:bg-[#121212]">
   <h2 className="text-sm font-bold text-slate-800 dark:text-[#ffffff] uppercase flex items-center gap-2">
    <CheckSquare className="w-4 h-4 text-indigo-600" /> 
     
                             {t('lab.c9organicchem_assessment_data')}
                            </h2>
   </div>

   <div className="flex-1 lg:overflow-y-auto p-4 space-y-6">
   
   <div className="space-y-4">
    <div className="space-y-1">
    <label className="text-sm font-bold text-slate-700 dark:text-[#ffffff]">
     
                                      {t('lab.c9organicchem_1_what_type_of_reaction_occurs')}
                                     </label>
    <input 
     type="text" 
     value={q1}
     onChange={(e) => setQ1(e.target.value)}
     placeholder={t('lab.c9organicchem_e_g_addition')}
     className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
    />
    </div>

    <div className="space-y-1">
    <label className="text-sm font-bold text-slate-700 dark:text-[#ffffff]">
     
                                      {t('lab.c9organicchem_2_what_type_of_reaction_occurs')}
                                     </label>
    <input 
     type="text" 
     value={q2}
     onChange={(e) => setQ2(e.target.value)}
     placeholder={t('lab.c9organicchem_e_g_substitution')}
     className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
    />
    </div>

    <button 
    onClick={checkAssessment}
    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
    
                                 {t('lab.c9organicchem_check_answers')}
                                 </button>

    {feedback && (
    <div className={`p-3 rounded-lg text-sm font-medium ${feedback.includes('Perfect') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
     {feedback}
    </div>
    )}
   </div>

   <div>
    <h3 className="text-xs font-bold text-slate-500 dark:text-[#71717a] uppercase mb-2">{t('lab.c9organicchem_reaction_log')}</h3>
    <div className="space-y-2">
    {logs.length === 0 ? (
     <div className="text-xs text-slate-400 italic">{t('lab.c9organicchem_no_reactions_logged_yet')}</div>
    ) : (
     logs.map(log => (
     <div key={log.id} className="bg-slate-50 dark:bg-[#121212] border p-2 rounded text-xs">
      <div className="flex justify-between text-slate-400 mb-1">
      <span>{t('lab.c9organicchem_log')}{log.id}</span>
      <span>{log.time}</span>
      </div>
      <div className="font-mono text-indigo-800 mb-1 dark:text-[#ffffff]">{log.eq}</div>
      <div className="text-slate-600 dark:text-[#a1a1aa]">{log.result}</div>
     </div>
     ))
    )}
    </div>
   </div>

   </div>
  </div>

  </div>
 </div>
 );
}
