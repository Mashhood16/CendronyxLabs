import { useState, useEffect } from 'react';
import {Plus, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from '../i18n';
import { useLab } from '../store';

interface LabProps {
 onExit?: () => void;
}

export default function LabP10SeriesCircuit({ onExit }: LabProps) {

const { recordLabData, setLabScore } = useLab();
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [numResistors, setNumResistors] = useState<number>(3); // 1 to 3
 const [voltage, setVoltage] = useState<number>(12); // Volts
 const [r1, setR1] = useState<number>(50); // Ohms
 const [r2, setR2] = useState<number>(50);
 const [r3, setR3] = useState<number>(50);
 const [rInt, setRInt] = useState<number>(1); // Internal resistance (Ohms)
 
 const [noise, setNoise] = useState<number>(0);

 // Periodic noise for realistic ammeter readings
 useEffect(() => {
 const interval = setInterval(() => {
 setNoise((Math.random() - 0.5) * 0.02); // +/- 1% noise
 }, 1000);
 return () => clearInterval(interval);
 }, []);

 // Circuit calculations
 const rTotal = (numResistors >= 1 ? r1 : 0) + 
 (numResistors >= 2 ? r2 : 0) + 
 (numResistors >= 3 ? r3 : 0) + rInt;
 const currentExact = voltage / rTotal; // Amperes
 const currentMeasured = currentExact * (1 + noise);
 const currentMA = currentMeasured * 1000;

 // Power for brightness (P = I^2 * R)
 // Assuming a reference power of 1W is "max brightness"
 const getBrightness = (r: number) => Math.min(1, Math.max(0.05, (currentExact * currentExact * r) / 1.0));

 // Assessment
 const [assessmentAnswer, setAssessmentAnswer] = useState<string>('');
 const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
 
 const checkAnswer = () => {
 const val = parseFloat(assessmentAnswer);
 // R_eq = 20+20+R3, I = 12/R_eq = 0.2 => R_eq = 60 => R3 = 20
 if (!isNaN(val) && Math.abs(val - 20) < 2) {
 setAssessmentStatus('correct');
 } else {
 setAssessmentStatus('incorrect');
 setLabScore(assessmentStatus === 'correct' ? 100 : 0, 100);
 }
 };

 // Data Logging
 const [dataPoints, setDataPoints] = useState<Array<{ id: number; n: number; v: number; req: number; i: number }>>([]);
 const recordData = () => {
 setDataPoints((prev) => [
 ...prev,
 { 
 id: Date.now(), 
 n: numResistors, 
 v: voltage, 
 req: rTotal - rInt, // R external
 i: currentMA 
 }
 ]);
 
 recordLabData({ timestamp: Date.now() });
};

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 {/* Header */}
 <LabHeader onExit={onExit} title={t('lab.p10seriescircuit_unit_16_resistors_in_series')} subtitle={t('lab.subtitle_analyze_current_equivalent')} />

 {/* Main Grid */}
 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.p10seriescircuit_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.10seriescircuit_lab')}</button>
 </div>
 <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 max-w-7xl mx-auto w-full lg:overflow-visible">
 
 {/* Column 1: Theory & Setup */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col gap-6 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex mb-4' : 'hidden'} lg:flex lg:order-none`}>
 <div className={`${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.10seriescircuit_theory')}</h2>
 <p className="text-slate-600 dark:text-[#a1a1aa] text-sm mb-3">
 
 {t('lab.p10seriescircuit_in_a_series_circuit_there_is_o')}
 </p>
 <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded-lg text-center font-serif text-slate-800 dark:text-[#ffffff] mb-2 flex-col `}>
 <div className="mb-1">{t('lab.10seriescircuit_r_eqrrr_int')}</div>
 <div>{t('lab.10seriescircuit_ivr_eq')}</div>
 </div>
 <p className="text-xs text-slate-500 dark:text-[#71717a]">
 
 {t('lab.p10seriescircuit_adding_more_resistors_increase')}
 </p>
 </div>

 <div className="h-px bg-slate-200 dark:bg-[#121212]" />

 <div>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4">{t('lab.10seriescircuit_experimentsetup')}</h2>
 
 <div className="mb-4">
 <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff] block mb-2">{t('lab.10seriescircuit_numberofresistors')}</label>
 <div className={`flex bg-slate-100 dark:bg-[#121212] p-1 rounded-lg flex-col `}>
 {[1, 2, 3].map((n) => (
 <button 
 key={n}
 onClick={() => setNumResistors(n)}
 className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${numResistors === n ? 'bg-slate-50 dark:bg-[#121212] shadow-sm text-blue-700' : 'text-slate-500 dark:text-[#a1a1aa] hover:text-slate-700 dark:text-[#ffffff]'}`}
 >
 {n} {t('lab.p10seriescircuit_bulb')}{n > 1 ? 's' : ''}
 </button>
 ))}
 </div>
 </div>

 <div className="mb-5">
 <div className="flex justify-between mb-1">
 <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff]">{t('lab.p10seriescircuit_battery_voltage_v')}</label>
 <span className="text-sm font-mono text-emerald-600">{voltage} V</span>
 </div>
 <input 
 type="range" min="1" max="24" step="1" value={voltage}
 onChange={(e) => setVoltage(parseFloat(e.target.value))}
 className="w-full accent-emerald-600"
 />
 </div>

 <div className="mb-4">
 <div className="flex justify-between mb-1">
 <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff]">{t('lab.p10seriescircuit_internal_resistance_r_int')}</label>
 <span className="text-sm font-mono text-slate-500 dark:text-[#71717a]">{rInt} Ω</span>
 </div>
 <input 
 type="range" min="0" max="10" step="1" value={rInt}
 onChange={(e) => setRInt(parseFloat(e.target.value))}
 className="w-full accent-slate-500"
 />
 </div>

 <div className="space-y-4">
 {[ { r: r1, setR: setR1, id: 1 }, { r: r2, setR: setR2, id: 2 }, { r: r3, setR: setR3, id: 3 } ].map((item, idx) => (
 <div key={item.id} className={idx < numResistors ? 'opacity-100' : 'opacity-40 pointer-events-none'}>
 <div className="flex justify-between mb-1">
 <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff]">{t('lab.p10seriescircuit_bulb')} {item.id} {t('lab.p10seriescircuit_resistance')}</label>
 <span className="text-sm font-mono text-amber-600">{item.r} Ω</span>
 </div>
 <input 
 type="range" min="10" max="100" step="5" value={item.r}
 onChange={(e) => item.setR(parseFloat(e.target.value))}
 className="w-full accent-amber-600"
 />
 </div>
 ))}
 </div>

 </div>
 </div>

 {/* Column 2: Simulation */}
 <div className={`w-full bg-[#000000] dark:!bg-[#121212] rounded-2xl shadow-sm border border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col relative 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
 <h2 className="text-lg font-bold text-white mb-4 absolute top-6 left-6 z-10">{t('lab.10seriescircuit_circuitsimulation')}</h2>
 
 <div className={`flex-1 flex flex-col items-center justify-center relative pt-10 ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block`}>
 
 {/* The Circuit Loop */}
 <div className="w-[300px] sm:w-[400px] lg:h-[250px] border-4 border-amber-600 rounded-xl relative flex justify-center shadow-[0_0_15px_#d97706_inset] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
 
 {/* Electrons moving */}
 <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
 {currentExact > 0 && (
 <>
 <div className={`absolute -top-1 w-4 h-2 bg-yellow-300 shadow-[0_0_10px_#fde047] rounded-full animate-[flowRight_2s_linear_infinite] flex-col `} style={{ animationDuration: `${Math.max(0.2, 1 / (currentExact * 10))}s` }} />
 <div className="absolute -bottom-1 w-4 h-2 bg-yellow-300 shadow-[0_0_10px_#fde047] rounded-full animate-[flowLeft_2s_linear_infinite]" style={{ animationDuration: `${Math.max(0.2, 1 / (currentExact * 10))}s` }} />
 </>
 )}
 </div>

 {/* Battery (Bottom) */}
 <div className="absolute -bottom-6 w-24 h-12 bg-zinc-800 rounded-md border-2 border-zinc-600 flex items-center justify-between px-2 shadow-lg z-20">
 <div className="text-red-500 font-bold">+</div>
 <div className="text-white font-mono font-bold text-sm">{voltage}V</div>
 <div className="text-blue-500 font-bold">-</div>
 <div className="absolute -top-2 left-2 w-4 h-2 bg-zinc-400" />
 <div className="absolute -top-2 right-2 w-4 h-2 bg-zinc-400" />
 </div>

 {/* Bulbs (Top) */}
 <div className="absolute -top-8 w-full flex justify-evenly px-4 sm:px-10">
 {[r1, r2, r3].slice(0, numResistors).map((rVal, i) => {
 const brightness = getBrightness(rVal);
 return (
 <div key={i} className="relative flex flex-col items-center">
 {/* The Bulb Glow */}
 <div className="absolute top-0 w-16 h-16 rounded-full bg-yellow-400 pointer-events-none transition-opacity duration-500 mix-blend-screen dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-yellow-500/40" style={{ 
 opacity: currentExact > 0 ? brightness : 0,
 boxShadow: currentExact > 0 ? `0 0 ${40 * brightness}px ${20 * brightness}px #facc15` : 'none'
 }} />
 {/* The Bulb Physical */}
 <div className="w-10 h-10 bg-slate-50 dark:bg-[#121212]/10 border-2 border-white/30 rounded-full z-10 flex flex-col items-center justify-end pb-1 backdrop-blur-sm">
 <div className={`w-2 h-4 border rounded-t-full ${currentExact > 0 ? 'border-yellow-300' : 'border-zinc-500'}`} />
 </div>
 {/* Base */}
 <div className="w-6 h-6 bg-zinc-400 rounded-b-md z-10" />
 <div className="text-[10px] text-slate-400 font-mono mt-1 bg-black/50 px-1.5 rounded">{rVal}Ω</div>
 </div>
 );
 })}
 </div>

 <style>{`
 @keyframes flowRight { 0% { left: 0; } 100% { left: 100%; } }
 @keyframes flowLeft { 0% { right: 0; } 100% { right: 100%; } }
 `}</style>
 </div>

 {/* Ammeter display */}
 <div className="mt-12 bg-black p-4 rounded-xl border border-[#1c1b1b] dark:border-[#1c1b1b] flex flex-col items-center w-48 shadow-lg">
 <span className="text-slate-400 text-[10px] uppercase tracking-widest mb-1 font-bold">{t('lab.10seriescircuit_ammeter')}</span>
 <div className="font-mono text-2xl font-bold text-red-500 tracking-wider">
 {currentMA.toFixed(0)} <span className="text-sm">mA</span>
 </div>
 <span className="text-slate-600 dark:text-[#a1a1aa] text-[10px] mt-1">{t('lab.10seriescircuit_1_percentprecision')}</span>
 </div>

 </div>
 </div>

 {/* Column 3: Data & Analysis */}
 <div className={`bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col h-full ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex justify-between items-center mb-4">
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.10seriescircuit_datalogging')}</h2>
 <button 
 onClick={recordData}
 className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 text-sm font-medium transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
 >
 <Plus className="w-4 h-4" /> {t('lab.p10seriescircuit_record')}
 </button>
 </div>

 <div className="flex-1 lg:overflow-y-auto mb-6 border border-slate-200 dark:border-[#1c1b1b] rounded-lg max-h-[200px]">
 <table className="w-full text-sm text-left">
 <thead className="text-xs text-slate-600 dark:text-[#a1a1aa] uppercase bg-slate-50 dark:bg-[#121212] sticky top-0">
 <tr>
 <th className="px-4 py-2">{t('lab.10seriescircuit_bulbs')}</th>
 <th className="px-4 py-2">{t('lab.p10seriescircuit_v_bat_v')}</th>
 <th className="px-4 py-2">{t('lab.p10seriescircuit_r_ext')}</th>
 <th className="px-4 py-2">{t('lab.p10seriescircuit_i_ma')}</th>
 </tr>
 </thead>
 <tbody>
 {dataPoints.length === 0 ? (
 <tr>
 <td colSpan={4} className="px-4 py-4 text-center text-slate-500 dark:text-[#71717a] italic">{t('lab.10seriescircuit_nodatarecordedyet')}</td>
 </tr>
 ) : (
 dataPoints.map((dp) => (
 <tr key={dp.id} className="border-b last:border-0 hover:bg-slate-50 dark:bg-[#121212]">
 <td className="px-4 py-2 font-mono">{dp.n}</td>
 <td className="px-4 py-2 font-mono">{dp.v}</td>
 <td className="px-4 py-2 font-mono">{dp.req}</td>
 <td className="px-4 py-2 font-mono">{dp.i.toFixed(0)}</td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>

 <div className="h-px bg-slate-200 dark:bg-[#121212] mb-6" />

 {/* Assessment Section */}
 <div>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.10seriescircuit_analysischeck')}</h2>
 <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg dark:bg-teal-950/20 dark:border-teal-900">
 <p className="text-sm text-slate-700 dark:text-[#ffffff] mb-3">
 <strong>{t('lab.10seriescircuit_problem')}</strong> {t('lab.p10seriescircuit_in_a_perfect_series_circuit_r_')}
 </p>
 <div className="flex gap-2 items-center">
 <input 
 type="number" 
 placeholder={t('lab.p10seriescircuit_t_lab_10seriescircuit_eg50')}
 value={assessmentAnswer}
 onChange={(e) => { setAssessmentAnswer(e.target.value); setAssessmentStatus('idle'); }}
 className="border border-slate-300 dark:border-[#1c1b1b] rounded px-3 py-2 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
 />
 <span className="text-sm font-medium text-slate-600 dark:text-[#a1a1aa] mr-2">Ω</span>
 <button 
 onClick={checkAnswer}
 className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
 >
 
 {t('lab.p10seriescircuit_check_answer')}
 </button>
 </div>
 {assessmentStatus === 'correct' && (
 <div className="mt-3 flex items-start gap-1 text-emerald-700 text-sm font-medium bg-emerald-100 p-2 rounded">
 <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" /> 
 
 {t('lab.p10seriescircuit_correct_r_eq_12v_0_2a_60_so_r_')}
 </div>
 )}
 {assessmentStatus === 'incorrect' && (
 <div className="mt-3 flex items-center gap-1 text-rose-600 text-sm font-medium">
 <XCircle className="w-4 h-4" /> {t('lab.p10seriescircuit_incorrect_try_calculating_tota')}
 </div>
 )}
 </div>
 </div>
 </div>

 </div>
 </div>
 );
}
