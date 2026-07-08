import { useState, useEffect } from 'react';
import { Wind, Calculator, Database } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

export default function LabC11PhasesOfMatter({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [liquidType, setLiquidType] = useState<'water'|'ethanol'>('water');
 const [extPressure, setExtPressure] = useState(1.0); // atm
 const [temperature, setTemperature] = useState(298); // K
 
 const getVaporPressure = (T: number, type: string) => {
 const Tc = T - 273.15;
 let A, B, C;
 if (type === 'water') {
  A = 8.07131; B = 1730.63; C = 233.426;
 } else {
  A = 8.20417; B = 1642.89; C = 230.300;
 }
 const p_mmHg = Math.pow(10, A - B / (C + Tc));
 return p_mmHg / 760; 
 };

 const vp = getVaporPressure(temperature, liquidType);
 const isBoiling = vp >= extPressure;

 const [logs, setLogs] = useState<{liquid: string, T: number, Pext: number, vp: number, boiling: boolean}[]>([]);
 const logData = () => {
 setLogs([...logs, {liquid: liquidType, T: temperature, Pext: extPressure, vp, boiling: isBoiling}]);
 };

 // Assessment
 const [randomPext, setRandomPext] = useState<number>(1.0);
 useEffect(() => {
 setRandomPext(Number((0.3 + Math.random() * 1.5).toFixed(2)));
 }, []);

 const [answerTemp, setAnswerTemp] = useState('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
 
 const checkAnswer = () => {
 const parsed = parseFloat(answerTemp);
 if (!isNaN(parsed)) {
  const expectedVP = getVaporPressure(parsed, liquidType);
  if (Math.abs(expectedVP - randomPext) < 0.1) {
  setIsCorrect(true);
  } else {
  setIsCorrect(false);
    setLabScore(isCorrect ? 100 : 0, 100);
  }
 }
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.c11phasesofmatter_phases_of_matter_vapor_pressur')} subtitle={t('lab.subtitle_vacuum_distillation_boiling')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.c11phasesofmatter_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.c11phasesofmatter_lab')}</button>
  </div>
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:overflow-visible">
  
  {/* Column 1 */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex-col gap-6 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <div>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2 flex items-center gap-2">
    <Wind className="w-5 h-5 text-orange-500" />
    
                             {t('lab.c11phasesofmatter_vacuum_distillation_setup')}
                            </h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] text-sm leading-relaxed mb-4">
    
                             {t('lab.c11phasesofmatter_a_liquid_boils_when_its')} <strong>{t('lab.c11phasesofmatter_vapor_pressure')}</strong>  {t('lab.c11phasesofmatter_equals_the')} <strong>{t('lab.c11phasesofmatter_external_ambient_pressure')}</strong>{t('lab.c11phasesofmatter_by_lowering_the_external_press')}
                            </p>
   </div>

   <div className={`flex-1 bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.c11phasesofmatter_select_liquid_phase')}</label>
   <select 
    value={liquidType} onChange={(e) => setLiquidType(e.target.value as 'water'|'ethanol')}
    className={`w-full mb-4 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50 dark:bg-[#121212] flex-col `}
   >
    <option value="water">{t('lab.c11phasesofmatter_water_h_o')}</option>
    <option value="ethanol">{t('lab.c11phasesofmatter_ethanol_c_h_oh')}</option>
   </select>

   <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.c11phasesofmatter_external_pressure')} {extPressure.toFixed(2)}  {t('lab.c11phasesofmatter_atm')}</label>
   <input 
    type="range" min="0.1" max="2.0" step="0.05" 
    value={extPressure} onChange={(e) => setExtPressure(parseFloat(e.target.value))}
    className="w-full mb-4 accent-blue-500"
   />

   <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.c11phasesofmatter_temperature')} {temperature} K</label>
   <input 
    type="range" min="273" max="400" step="1" 
    value={temperature} onChange={(e) => setTemperature(parseInt(e.target.value))}
    className="w-full mb-6 accent-red-500"
   />

   <div className={`p-3 bg-slate-50 dark:!bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg shadow-sm text-center flex-col `}>
    <span className="text-xs text-slate-500 dark:text-[#71717a] font-bold uppercase tracking-wider block mb-1">{t('lab.c11phasesofmatter_current_vapor_pressure')}</span>
    <span className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">{vp.toFixed(3)}  {t('lab.c11phasesofmatter_atm')}</span>
   </div>
   </div>
  </div>

  {/* Column 2 */}
  <div className={`bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col items-center justify-center ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] w-full mb-4 text-center">{t('lab.c11phasesofmatter_boiling_simulator')}</h2>
   
   <svg viewBox="0 0 200 300" className="w-full h-80 bg-slate-100 dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-[#1c1b1b] overflow-hidden relative">
   <rect x="50" y={isBoiling ? "20" : "80"} width="100" height="10" fill="#64748b" className="transition-all duration-1000" />
   <rect x="95" y="0" width="10" height={isBoiling ? "20" : "80"} fill="#94a3b8" className="transition-all duration-1000" />
   <text x="100" y="15" textAnchor="middle" className="text-[10px] font-bold fill-slate-700">{t('lab.c11phasesofmatter_p_ext')} {extPressure.toFixed(2)}</text>
   
   <path d="M 50 0 L 50 250 A 20 20 0 0 0 70 270 L 130 270 A 20 20 0 0 0 150 250 L 150 0" fill="none" stroke="#475569" strokeWidth="4" />
   
   <path d="M 52 150 L 148 150 L 148 250 A 18 18 0 0 1 130 268 L 70 268 A 18 18 0 0 1 52 250 Z" fill={liquidType === 'water' ? "#38bdf8" : "#a78bfa"} opacity="0.6" className="transition-colors duration-500" />
   
   {isBoiling && (
    <g className="animate-bounce">
    <circle cx="80" cy="200" r="4" fill="white" opacity="0.8" />
    <circle cx="120" cy="180" r="6" fill="white" opacity="0.8" />
    <circle cx="100" cy="220" r="5" fill="white" opacity="0.8" />
    <circle cx="90" cy="160" r="3" fill="white" opacity="0.8" />
    </g>
   )}
   
   {isBoiling && (
    <g>
    <circle cx="100" cy="100" r="20" fill="white" opacity="0.6" filter="blur(4px)" />
    <circle cx="70" cy="120" r="15" fill="white" opacity="0.6" filter="blur(4px)" />
    <circle cx="130" cy="90" r="25" fill="white" opacity="0.6" filter="blur(4px)" />
    </g>
   )}

   <text x="100" y="290" textAnchor="middle" className="text-xs font-bold fill-slate-500">{t('lab.c11phasesofmatter_t')} {temperature} K</text>
   </svg>

   <button onClick={logData} className={`mt-6 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg font-semibold flex items-center gap-2 `}>
   <Database className="w-4 h-4" />  {t('lab.c11phasesofmatter_log_t_p_data_point')}
                        </button>
  </div>

  {/* Column 3 */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col gap-6 '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex-1">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
    <Database className="w-5 h-5 text-emerald-500" />
    
                             {t('lab.c11phasesofmatter_phase_data')}
                            </h2>
   <div className="lg:overflow-y-auto max-h-48 border border-slate-200 dark:border-[#1c1b1b] rounded-lg">
    <table className="w-full text-sm text-left">
    <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b] text-slate-700 dark:text-[#ffffff] sticky top-0">
     <tr>
     <th className="px-3 py-2">{t('lab.c11phasesofmatter_liquid')}</th>
     <th className="px-3 py-2">{t('lab.c11phasesofmatter_t_k')}</th>
     <th className="px-3 py-2">{t('lab.c11phasesofmatter_p_atm')}</th>
     <th className="px-3 py-2">{t('lab.c11phasesofmatter_boiling')}</th>
     </tr>
    </thead>
    <tbody>
     {logs.length === 0 ? (
     <tr><td colSpan={4} className="px-3 py-4 text-center text-slate-500 dark:text-[#71717a] italic">{t('lab.c11phasesofmatter_no_points_logged')}</td></tr>
     ) : (
     logs.map((l, i) => (
      <tr key={i} className="border-b border-slate-100">
      <td className="px-3 py-2 capitalize">{l.liquid}</td>
      <td className="px-3 py-2">{l.T}</td>
      <td className="px-3 py-2">{l.vp.toFixed(3)}</td>
      <td className="px-3 py-2">
       <span className={`px-2 py-1 text-xs rounded-full ${l.boiling ? 'bg-red-100 text-red-700' : 'bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff]'}`}>
       {l.boiling ? 'Yes' : 'No'}
       </span>
      </td>
      </tr>
     ))
     )}
    </tbody>
    </table>
   </div>
   </div>

   <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2 flex items-center gap-2">
    <Calculator className="w-5 h-5 text-indigo-500" />
    
                             {t('lab.c11phasesofmatter_clausius_clapeyron_challenge')}
                            </h2>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
    
                             {t('lab.c11phasesofmatter_if_the_pressure_is_drastically')} <strong>{randomPext.toFixed(2)}  {t('lab.c11phasesofmatter_atm')}</strong>{t('lab.c11phasesofmatter_at_what')} <strong>{t('lab.c11phasesofmatter_temperature_k')}</strong>  {t('lab.c11phasesofmatter_would_the')} {liquidType}  {t('lab.c11phasesofmatter_begin_to_boil_use_the_simulato')}
                            </p>
   <div className="flex gap-2">
    <input 
    type="number" step="1" placeholder={t('lab.c11phasesofmatter_temperature_k')} 
    value={answerTemp} onChange={(e) => setAnswerTemp(e.target.value)}
    className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <button 
    onClick={checkAnswer} 
    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
     
                                  {t('lab.c11phasesofmatter_verify')}
                                 </button>
   </div>
   {isCorrect === true && <p className="text-emerald-600 text-sm font-bold mt-2">{t('lab.c11phasesofmatter_correct_you_found_the_new_boil')}</p>}
   {isCorrect === false && <p className="text-red-500 text-sm font-bold mt-2">{t('lab.c11phasesofmatter_incorrect_keep_adjusting_the_t')}</p>}
   </div>
  </div>

  </div>
 </div>
 );
}
