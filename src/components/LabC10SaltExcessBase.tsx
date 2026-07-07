import { useState } from 'react';
import { Beaker, Flame, Filter, Droplet, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface Props {
 onExit?: () => void;
}

export default function LabC10SaltExcessBase({ onExit }: Props) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [step, setStep] = useState(0); 
 const [h2so4Vol, setH2so4Vol] = useState(50);
 const [cuoMass, setCuoMass] = useState(5.0);
 const [equation, setEquation] = useState("Setup your experiment by selecting variables.");
 const [logs, setLogs] = useState<{vol: number, mass: number, yield: number}[]>([]);
 const [assessmentAnswer, setAssessmentAnswer] = useState("");
 const [assessmentResult, setAssessmentResult] = useState<string | null>(null);
 const [currentYield, setCurrentYield] = useState(0);

 const h2so4Conc = 1.0; 
 const mmCuO = 79.55;
 const mmCuSO4_5H2O = 249.68;
 
 const molesH2SO4 = (h2so4Vol / 1000) * h2so4Conc;
 const molesCuO = cuoMass / mmCuO;
 const limitingMoles = Math.min(molesH2SO4, molesCuO);
 const theorYield = limitingMoles * mmCuSO4_5H2O;

 const handleAction = (action: string) => {
 if (action === 'acid' && step === 0) {
  setStep(1);
  setEquation("H₂SO₄(aq)");
 } else if (action === 'cuo' && step === 1) {
  setStep(2);
  setEquation("H₂SO₄(aq) + CuO(s)");
 } else if (action === 'heat' && step === 2) {
  setStep(3);
  setEquation("H₂SO₄(aq) + CuO(s) → CuSO₄(aq) + H₂O(l) [Excess CuO remains]");
 } else if (action === 'filter' && step === 3) {
  setStep(4);
  setEquation("Filtrate: CuSO₄(aq) | Residue: CuO(s)");
 } else if (action === 'crystallize' && step === 4) {
  setStep(5);
  setEquation("CuSO₄(aq) → CuSO₄·5H₂O(s) + Heat");
  setCurrentYield(theorYield * (0.80 + Math.random() * 0.10));
 }
 };

 const handleLogData = () => {
 if (step === 5) {
  setLogs([...logs, { vol: h2so4Vol, mass: cuoMass, yield: parseFloat(currentYield.toFixed(2)) }]);
  setStep(0);
  setEquation("Experiment reset. Change variables and run again!");
 }
 };

 const checkAssessment = () => {
 const ans = parseFloat(assessmentAnswer);
 if (isNaN(ans)) {
  setAssessmentResult("Please enter a valid number.");
  return;
 }
 const diff = Math.abs(ans - theorYield);
 if (diff < 0.5) {
  setAssessmentResult("Correct! Well done calculating the theoretical yield.");
 } else {
  setAssessmentResult(`Incorrect. Check limiting reactant. Theoretical yield is ~${theorYield.toFixed(2)}g.`);
 }
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  {/* Header */}
  <LabHeader onExit={onExit} title={t('lab.c10saltexcessbase_preparation_of_soluble_salt_ex')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.c10saltexcessbase_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.c10saltexcessbase_lab')}</button>
  </div>
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg: lg:overflow-visible">
  
  {/* Left Column: Theory & Setup */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col overflow-  ? 'flex' : 'hidden'} lg:flex`}>
   <div className={`bg-slate-100 dark:bg-[#121212] p-4 border-b border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex mb-4' : 'hidden'} lg:flex lg:order-none`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
    <Beaker className="text-blue-600" />  {t('lab.c10saltexcessbase_theory_setup')}
                            </h2>
   </div>
   <div className={`p-6 flex-1 lg:overflow-y-auto space-y-6 ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
   <div>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.c10saltexcessbase_reaction_principle')}</h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-2">
    
                                 {t('lab.c10saltexcessbase_a_soluble_salt_can_be_prepared')}
                                 </p>
    <div className={`bg-[#121212] dark:bg-[#121212] text-green-400 p-3 rounded-lg font-mono text-sm shadow-inner flex-col `}>
    
                                 {t('lab.c10saltexcessbase_cuo_s_h_so_aq_cuso_aq_h_o_l')}
                                 </div>
   </div>

   <div>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-4">{t('lab.c10saltexcessbase_set_variables')}</h3>
    <div className="space-y-4">
    <div>
     <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
     
                                          {t('lab.c10saltexcessbase_volume_of_1_0m_h_so')} {h2so4Vol} mL
     </label>
     <input 
     type="range" min="20" max="100" step="10" value={h2so4Vol}
     onChange={(e) => setH2so4Vol(parseFloat(e.target.value))}
     disabled={step > 0}
     className="w-full accent-blue-600"
     />
    </div>
    <div>
     <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
     
                                          {t('lab.c10saltexcessbase_mass_of_cuo_powder')} {cuoMass.toFixed(1)} g
     </label>
     <input 
     type="range" min="1.0" max="10.0" step="0.5" value={cuoMass}
     onChange={(e) => setCuoMass(parseFloat(e.target.value))}
     disabled={step > 0}
     className="w-full accent-slate-800"
     />
    </div>
    </div>
   </div>

   <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900">
    <h4 className="font-semibold text-blue-800 text-sm mb-2 dark:text-[#ffffff]">{t('lab.c10saltexcessbase_procedure')}</h4>
    <ol className="text-sm text-blue-900 space-y-1 list-decimal list-inside dark:text-[#ffffff]">
    <li>{t('lab.c10saltexcessbase_add_acid_to_beaker')}</li>
    <li>{t('lab.c10saltexcessbase_add_base_until_in_excess')}</li>
    <li>{t('lab.c10saltexcessbase_heat_gently_to_speed_up_reacti')}</li>
    <li>{t('lab.c10saltexcessbase_filter_unreacted_base')}</li>
    <li>{t('lab.c10saltexcessbase_evaporate_filtrate_to_crystall')}</li>
    </ol>
   </div>
   </div>
  </div>

  {/* Middle Column: Simulation */}
  <div className="bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
   <div className={`bg-slate-100 dark:bg-[#121212] p-4 border-b border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.c10saltexcessbase_virtual_workbench')}</h2>
   </div>
   <div className="p-6 flex-1 flex flex-col items-center justify-between">
   
   {/* Interactive Bottles */}
   <div className="flex flex-wrap justify-center gap-4 w-full flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    <button onClick={() => handleAction('acid')} disabled={step !== 0} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all w-24 ${step === 0 ? 'border-blue-400 bg-blue-50 hover:bg-blue-100 cursor-pointer shadow-md' : 'border-slate-100 opacity-40 cursor-not-allowed'}`}>
    <Droplet size={28} className="text-blue-500 mb-2" />
    <span className="font-semibold text-xs text-center">{t('lab.c10saltexcessbase_h_so_bottle')}</span>
    </button>
    <button onClick={() => handleAction('cuo')} disabled={step !== 1} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all w-24 ${step === 1 ? 'border-[#1c1b1b] dark:border-slate-500 bg-slate-50 dark:bg-[#121212] hover:bg-slate-200 dark:bg-[#121212] cursor-pointer shadow-md' : 'border-slate-100 opacity-40 cursor-not-allowed'}`}>
    <Beaker size={28} className="text-slate-800 dark:text-[#ffffff] mb-2" />
    <span className="font-semibold text-xs text-center">{t('lab.c10saltexcessbase_cuo_bottle')}</span>
    </button>
    <button onClick={() => handleAction('heat')} disabled={step !== 2} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all w-24 ${step === 2 ? 'border-red-400 bg-red-50 hover:bg-red-100 cursor-pointer shadow-md' : 'border-slate-100 opacity-40 cursor-not-allowed'}`}>
    <Flame size={28} className="text-red-500 mb-2" />
    <span className="font-semibold text-xs text-center">{t('lab.c10saltexcessbase_heat_stir')}</span>
    </button>
    <button onClick={() => handleAction('filter')} disabled={step !== 3} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all w-24 ${step === 3 ? 'border-amber-400 bg-amber-50 hover:bg-amber-100 cursor-pointer shadow-md' : 'border-slate-100 opacity-40 cursor-not-allowed'}`}>
    <Filter size={28} className="text-amber-700 mb-2" />
    <span className="font-semibold text-xs text-center">{t('lab.c10saltexcessbase_filter')}</span>
    </button>
    <button onClick={() => handleAction('crystallize')} disabled={step !== 4} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all w-24 ${step === 4 ? 'border-cyan-400 bg-cyan-50 hover:bg-cyan-100 cursor-pointer shadow-md' : 'border-slate-100 opacity-40 cursor-not-allowed'}`}>
    <CheckCircle size={28} className="text-cyan-600 mb-2" />
    <span className="font-semibold text-xs text-center">{t('lab.c10saltexcessbase_crystallize')}</span>
    </button>
   </div>

   {/* Simulation Canvas */}
   <div className="w-full max-w-md my-8 relative">
    <svg viewBox="0 0 200 200" className="w-full h-auto drop-shadow-md">
    {/* Desk */}
    <rect x="20" y="180" width="160" height="8" fill="#cbd5e1" rx="2" />
    
    {step === 5 ? (
     <g transform="translate(0, 30)">
     {/* Evaporating Dish */}
     <path d="M 60 130 Q 100 160 140 130" fill="#f8fafc" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
     {/* Crystals */}
     <polygon points="90,140 100,125 110,140 100,150" fill="#2563eb" />
     <polygon points="105,135 115,120 125,135 115,145" fill="#3b82f6" />
     <polygon points="75,135 85,120 95,135 85,145" fill="#1d4ed8" />
     <polygon points="85,145 90,135 105,145 95,150" fill="#60a5fa" />
     </g>
    ) : step === 4 ? (
     <g>
     {/* Filtrate */}
     <path d="M 70 90 L 70 170 Q 70 180 80 180 L 120 180 Q 130 180 130 170 L 130 90" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="4" />
     <rect x="72" y="140" width="56" height="38" fill="#3b82f6" opacity="0.8" rx="2" />
     </g>
    ) : (
     <g>
     {/* Main Beaker */}
     <path d="M 70 90 L 70 170 Q 70 180 80 180 L 120 180 Q 130 180 130 170 L 130 90" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="4" />
     {step >= 1 && (
      <rect x="72" y={178 - h2so4Vol * 0.6} width="56" height={h2so4Vol * 0.6} fill={step >= 3 ? "#3b82f6" : "#e2e8f0"} opacity="0.8" rx="2" />
     )}
     {step >= 2 && step <= 3 && (
      <g>
      {Array.from({ length: Math.min(20, cuoMass * 3) }).map((_, i) => (
       <circle key={i} cx={80 + (i * 3.7) % 40} cy={175 - (i % 4)} r="2" fill="#0f172a" />
      ))}
      </g>
     )}
     {step === 3 && (
      <g>
       <path d="M 90 190 Q 100 170 110 190 Z" fill="#ef4444" />
       <path d="M 95 190 Q 100 180 105 190 Z" fill="#facc15" />
      </g>
     )}
     </g>
    )}
    </svg>
   </div>

   {/* Dynamic Equation */}
   <div className="w-full bg-[#121212] dark:bg-[#121212] text-green-400 p-4 rounded-xl font-mono text-center shadow-inner min-h-[4rem] flex flex-col justify-center items-center">
    <span className="text-xs text-slate-400 mb-1 uppercase tracking-wider">{t('lab.c10saltexcessbase_live_reaction')}</span>
    <span className="text-lg">{equation}</span>
   </div>
   </div>
  </div>

  {/* Right Column: Data & Analysis */}
  <div className="bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col">
   <div className={`bg-slate-100 dark:bg-[#121212] p-4 border-b border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.c10saltexcessbase_data_analysis')}</h2>
   </div>
   <div className="p-6 flex-1 flex flex-col">
   
   <div className="flex-1 lg:overflow-y-auto mb-6">
    <table className="w-full text-sm text-left border-collapse">
    <thead className="bg-slate-50 dark:bg-[#121212] border-y border-slate-200 dark:border-[#1c1b1b]">
     <tr>
     <th className="py-3 px-2 font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.c10saltexcessbase_h_so_ml')}</th>
     <th className="py-3 px-2 font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.c10saltexcessbase_cuo_g')}</th>
     <th className="py-3 px-2 font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.c10saltexcessbase_yield_g')}</th>
     </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
     {logs.length === 0 && (
     <tr><td colSpan={3} className="py-4 text-center text-slate-500 dark:text-[#71717a] italic">{t('lab.c10saltexcessbase_no_data_recorded_yet')}</td></tr>
     )}
     {logs.map((log, i) => (
     <tr key={i} className="hover:bg-slate-50 dark:bg-[#121212] transition-colors">
      <td className="py-3 px-2">{log.vol}</td>
      <td className="py-3 px-2">{log.mass.toFixed(1)}</td>
      <td className="py-3 px-2 font-semibold text-blue-600">{log.yield}</td>
     </tr>
     ))}
     {step === 5 && (
     <tr className="bg-blue-50 animate-pulse dark:bg-teal-950/20 dark:border-teal-900">
      <td className="py-3 px-2">{h2so4Vol}</td>
      <td className="py-3 px-2">{cuoMass.toFixed(1)}</td>
      <td className="py-3 px-2 font-semibold text-blue-600">{currentYield.toFixed(2)}</td>
     </tr>
     )}
    </tbody>
    </table>
   </div>

   <button 
    onClick={handleLogData}
    disabled={step !== 5}
    className="w-full py-3 bg-[#121212] dark:bg-[#121212] text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#000000] dark:bg-[#121212] transition-colors mb-6"
   >
    
                             {t('lab.c10saltexcessbase_record_data_reset')}
                            </button>

   <div className={`bg-slate-50 dark:bg-[#121212] p-5 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.c10saltexcessbase_assessment')}</h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
    
                                 {t('lab.c10saltexcessbase_calculate_the_theoretical_yiel')} 
                                 <br/><span className="text-xs text-slate-400">{t('lab.c10saltexcessbase_molar_masses_cuo_79_55_cuso_5h')}</span>
    </p>
    <div className="flex gap-2 mb-2">
    <input 
     type="text" 
     value={assessmentAnswer}
     onChange={e => setAssessmentAnswer(e.target.value)}
     placeholder={t('lab.c10saltexcessbase_e_g_15_5')}
     className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg text-sm outline-none focus:border-blue-500"
    />
    <button onClick={checkAssessment} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 text-sm dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
     
                                      {t('lab.c10saltexcessbase_check')}
                                     </button>
    </div>
    {assessmentResult && (
    <div className={`text-sm p-3 rounded-lg ${assessmentResult.startsWith('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
     {assessmentResult}
    </div>
    )}
   </div>

   </div>
  </div>

  </div>
 </div>
 );
}
