import { useState, useEffect } from 'react';
import { Play, Activity, Target, Calculator, Database } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

export default function LabC11AtomicStructure({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [bField, setBField] = useState<number>(1.0);
 const [voltage, setVoltage] = useState<number>(1000);
 const [massData, setMassData] = useState<{mass: number, radius: number, yPos: number}[]>([]);
 const [logs, setLogs] = useState<{bField: number, voltage: number, r20: string, r21: string, r22: string}[]>([]);

 const handleRunMassSpec = () => {
 const k = 5; 
 const r20 = (k * Math.sqrt(20 * voltage)) / (bField * 100);
 const r21 = (k * Math.sqrt(21 * voltage)) / (bField * 100);
 const r22 = (k * Math.sqrt(22 * voltage)) / (bField * 100);
 setMassData([
  { mass: 20, radius: r20, yPos: 150 + r20 },
  { mass: 21, radius: r21, yPos: 150 + r21 },
  { mass: 22, radius: r22, yPos: 150 + r22 },
 ]);
 };

 const handleLog = () => {
 if (massData.length === 0) return;
 setLogs([...logs, {
  bField, voltage,
  r20: massData[0].radius.toFixed(2),
  r21: massData[1].radius.toFixed(2),
  r22: massData[2].radius.toFixed(2)
 }]);
 };

 // Assessment
 const [unknownIsotopeMass, setUnknownIsotopeMass] = useState<number>(0);
 const [answerRadius, setAnswerRadius] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 useEffect(() => {
 setUnknownIsotopeMass(Math.floor(Math.random() * 10) + 30);
 }, []);

 const checkAnswer = () => {
 const k = 5;
 const expected = (k * Math.sqrt(unknownIsotopeMass * voltage)) / (bField * 100);
 const parsed = parseFloat(answerRadius);
 if (!isNaN(parsed) && Math.abs(parsed - expected) < 0.5) {
  setIsCorrect(true);
 } else {
  setIsCorrect(false);
 }
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  {/* Header */}
  <LabHeader onExit={onExit} title={t('lab.c11atomicstructure_atomic_structure_mass_spectrom')} />

  {/* Main Content Grid */}
  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.c11atomicstructure_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.c11atomicstructure_lab')}</button>
  </div>
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:overflow-visible">
  
  {/* Column 1: Theory & Setup */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex-col gap-6 ${activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex mb-4' : 'hidden'} lg:flex lg:order-none`}>
   <div className={`${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2 flex items-center gap-2">
    <Activity className="w-5 h-5 text-indigo-500" />
    
                             {t('lab.c11atomicstructure_theory')}
                            </h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] text-sm leading-relaxed mb-4">
    
                             {t('lab.c11atomicstructure_a_mass_spectrometer_separates_')}
                            </p>
   <div className={`bg-indigo-50 p-4 rounded-lg text-center font-mono text-indigo-800 text-sm mb-4 dark:bg-[#121212] dark:border-[#1c1b1b] dark:text-[#ffffff] flex-col `}>
    
                             {t('lab.c11atomicstructure_r_m_v_b')}
                            </div>
   <p className="text-slate-600 dark:text-[#a1a1aa] text-sm leading-relaxed">
    
                             {t('lab.c11atomicstructure_adjust_the')} <strong>{t('lab.c11atomicstructure_accelerating_voltage_v')}</strong>  {t('lab.c11atomicstructure_and')} <strong>{t('lab.c11atomicstructure_magnetic_field_b')}</strong>  {t('lab.c11atomicstructure_to_see_how_neon_isotopes_ne_20')}
                            </p>
   </div>

   <div className={`flex-1 ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block`}>
   <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] mb-4">{t('lab.c11atomicstructure_instrument_controls')}</h3>
   
   <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.c11atomicstructure_magnetic_field')} {bField.toFixed(2)} T</label>
   <input 
    type="range" min="0.5" max="2.0" step="0.1" 
    value={bField} onChange={(e) => setBField(parseFloat(e.target.value))}
    className="w-full mb-4 accent-indigo-600"
   />

   <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.c11atomicstructure_accelerating_voltage')} {voltage} V</label>
   <input 
    type="range" min="500" max="2000" step="100" 
    value={voltage} onChange={(e) => setVoltage(parseFloat(e.target.value))}
    className="w-full mb-6 accent-indigo-600"
   />

   <button 
    onClick={handleRunMassSpec}
    className={`w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40 `}
   >
    <Play className="w-4 h-4" />  {t('lab.c11atomicstructure_fire_ion_gun')}
                            </button>
   </div>
  </div>

  {/* Column 2: Simulation Visualizer */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col items-center justify-center '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] w-full mb-4">{t('lab.c11atomicstructure_mass_spectrometer_tube')}</h2>
   
   <svg viewBox="0 0 400 300" className={`w-full h-80 bg-slate-100 dark:bg-[#121212] rounded-lg shadow-inner overflow- flex-col `}>
   <rect x="100" y="0" width="250" height="300" fill="#e2e8f0" opacity="0.5" />
   <text x="225" y="20" className="text-xs fill-slate-500 text-center font-semibold" textAnchor="middle">{t('lab.c11atomicstructure_magnetic_field_b_region')}</text>

   {massData.map((d, i) => (
    <g key={i}>
    <path
     d={`M 0 150 L 100 150 A ${d.radius} ${d.radius} 0 0 0 ${100 + d.radius} ${d.yPos}`}
     fill="none"
     stroke={i === 0 ? "#ef4444" : i === 1 ? "#3b82f6" : "#10b981"}
     strokeWidth="2"
     strokeDasharray="4"
     className="animate-[dash_2s_linear_forwards]"
    />
    <circle cx={100 + d.radius} cy={d.yPos} r="4" fill={i === 0 ? "#ef4444" : i === 1 ? "#3b82f6" : "#10b981"} />
    <text x={100 + d.radius} y={d.yPos + 15} className="text-[10px] font-bold" textAnchor="middle">{t('lab.c11atomicstructure_ne')}{d.mass}</text>
    </g>
   ))}
   
   <rect x="100" y="290" width="250" height="10" fill="#334155" />
   <text x="225" y="285" className="text-xs fill-slate-600 font-bold" textAnchor="middle">{t('lab.c11atomicstructure_detector_array')}</text>
   
   <rect x="0" y="130" width="30" height="40" fill="#94a3b8" />
   <text x="15" y="145" className="text-[10px] font-bold fill-white" textAnchor="middle">{t('lab.c11atomicstructure_ion')}</text>
   <text x="15" y="155" className="text-[10px] font-bold fill-white" textAnchor="middle">{t('lab.c11atomicstructure_gun')}</text>
   </svg>

   {massData.length > 0 && (
   <button onClick={handleLog} className={`mt-6 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-semibold flex items-center gap-2 transition-colors `}>
    <Database className="w-4 h-4" />  {t('lab.c11atomicstructure_record_data')}
                            </button>
   )}
  </div>

  {/* Column 3: Data Logging & Assessment */}
  <div className={`bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col gap-6 rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex-1">
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
    <Database className="w-5 h-5 text-emerald-500" />
    
                             {t('lab.c11atomicstructure_data_log')}
                            </h2>
   <div className="overflow-x-auto border border-slate-200 dark:border-[#1c1b1b] rounded-lg">
    <table className="w-full text-sm text-left">
    <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b] text-slate-700 dark:text-[#ffffff]">
     <tr>
     <th className="px-3 py-2">{t('lab.c11atomicstructure_b_t')}</th>
     <th className="px-3 py-2">{t('lab.c11atomicstructure_v_v')}</th>
     <th className="px-3 py-2">{t('lab.c11atomicstructure_r_20')}</th>
     <th className="px-3 py-2">{t('lab.c11atomicstructure_r_22')}</th>
     </tr>
    </thead>
    <tbody>
     {logs.length === 0 ? (
     <tr><td colSpan={4} className="px-3 py-4 text-center text-slate-500 dark:text-[#71717a] italic">{t('lab.c11atomicstructure_no_data_recorded')}</td></tr>
     ) : (
     logs.map((l, i) => (
      <tr key={i} className="border-b border-slate-100">
      <td className="px-3 py-2">{l.bField}</td>
      <td className="px-3 py-2">{l.voltage}</td>
      <td className="px-3 py-2">{l.r20}</td>
      <td className="px-3 py-2">{l.r22}</td>
      </tr>
     ))
     )}
    </tbody>
    </table>
   </div>
   </div>

   <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2 flex items-center gap-2">
    <Calculator className="w-5 h-5 text-amber-500" />
    
                             {t('lab.c11atomicstructure_analysis')}
                            </h2>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
    
                             {t('lab.c11atomicstructure_an_unknown_isotope_of_element_')} <strong>{unknownIsotopeMass}  {t('lab.c11atomicstructure_amu')}</strong>{t('lab.c11atomicstructure_based_on_the_instrument_settin')}{voltage}  {t('lab.c11atomicstructure_v_b')}{bField}  {t('lab.c11atomicstructure_t_calculate_its_expected')} <strong>{t('lab.c11atomicstructure_radius_of_curvature')}</strong>  {t('lab.c11atomicstructure_on_the_detector')}
                            </p>
   <div className="flex gap-2">
    <input 
    type="number" step="0.1" placeholder={t('lab.c11atomicstructure_radius')} 
    value={answerRadius} onChange={(e) => setAnswerRadius(e.target.value)}
    className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
    />
    <button onClick={checkAnswer} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors dark:text-white dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40">
    <Target className="w-4 h-4" />  {t('lab.c11atomicstructure_check')}
                                 </button>
   </div>
   {isCorrect === true && <p className="text-emerald-600 text-sm font-bold mt-2">{t('lab.c11atomicstructure_correct_excellent_job')}</p>}
   {isCorrect === false && <p className="text-red-500 text-sm font-bold mt-2">{t('lab.c11atomicstructure_incorrect_check_your_formula_a')}</p>}
   </div>
  </div>

  </div>
 </div>
 );
}
