import { useState } from 'react';
import {Activity, Table2, Info, BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from '../i18n';
import { useLab } from '../store';

interface LabProps { onExit?: () => void; }

interface DataPoint {
 bendRadius: number;
 measuredPower: number;
}

export default function LabP10OpticalFibers({ onExit }: LabProps) {

const { recordLabData, setLabScore } = useLab();
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [nCore, setNCore] = useState(1.50);
 const [nClad, setNClad] = useState(1.45);
 const [bendRadius, setBendRadius] = useState(50);
 const [laserPower, setLaserPower] = useState(5.0);
 const [isLaserOn, setIsLaserOn] = useState(false);
 const [loggedData, setLoggedData] = useState<DataPoint[]>([]);
 
 const [assessmentAns, setAssessmentAns] = useState('');
 const [assessmentStatus, setAssessmentStatus] = useState<null | 'correct' | 'incorrect'>(null);

 // Physics calculations
 const d = 2.0; // fiber thickness parameter for our model
 let T = 0;
 let criticalAngle = NaN;
 let R_leak = 0;
 
 if (nClad < nCore) {
 criticalAngle = Math.asin(nClad / nCore) * (180 / Math.PI);
 R_leak = d / (1 - nClad / nCore);
 if (bendRadius >= R_leak) {
 T = 1.0;
 } else {
 T = Math.exp(-(R_leak - bendRadius) / 20);
 }
 }

 // Add ±2% noise to measurement
 const noise = 1 + (Math.random() - 0.5) * 0.04;
 const measuredPower = isLaserOn ? (nClad < nCore ? laserPower * T * noise : 0) : 0;

 const recordData = () => {
 if (isLaserOn) {
 setLoggedData(prev => [...prev, { bendRadius, measuredPower: Number(measuredPower.toFixed(2)) }]);
 recordLabData({ timestamp: Date.now(), bendRadius, measuredPower: Number(measuredPower.toFixed(2)) });
 }
 };

 const checkAssessment = () => {
 const val = parseFloat(assessmentAns);
 // Question: nCore = 1.52, theta_c = 82 degrees. nClad = ?
 // nClad = 1.52 * sin(82) = 1.505
 if (!isNaN(val) && val >= 1.50 && val <= 1.51) {
 setAssessmentStatus('correct');
 } else {
 setAssessmentStatus('incorrect');
 }
 };

 // Escaping rays visual logic
 const escapingRays = [];
 if (isLaserOn) {
 if (nClad >= nCore) {
 // Complete leakage immediately
 for(let i=0; i<15; i++) {
 escapingRays.push(<line key={`l1-${i}`} x1={50 + i*15} y1={92} x2={40 + i*15} y2={40} stroke="red" strokeWidth="2" strokeOpacity={0.6}/>);
 escapingRays.push(<line key={`l2-${i}`} x1={50 + i*15} y1={108} x2={40 + i*15} y2={160} stroke="red" strokeWidth="2" strokeOpacity={0.6}/>);
 }
 } else if (T < 1) {
 // Leakage at the bend
 const numRays = Math.floor((1 - T) * 30);
 for(let i=0; i<numRays; i++) {
 const theta = -Math.PI/2 + (Math.PI * (i+1)/(numRays+1));
 const startX = 250 + bendRadius * Math.cos(theta);
 const startY = 100 + bendRadius + bendRadius * Math.sin(theta);
 const endX = startX + 60 * Math.cos(theta);
 const endY = startY + 60 * Math.sin(theta);
 escapingRays.push(<line key={`l3-${i}`} x1={startX} y1={startY} x2={endX} y2={endY} stroke="red" strokeWidth="2" strokeOpacity={1-T} />);
 }
 }
 }

 // Graph plotting
 const maxP = 10;
 const points = loggedData.map(d => {
 const x = ((d.bendRadius - 20) / 80) * 300;
 const y = 200 - (d.measuredPower / maxP) * 200;
 return `${x},${y}`;
 });

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.p10opticalfibers_unit_19_optical_fibers_total_i')} subtitle={t('lab.subtitle_quantitative_analysis_critical')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.p10opticalfibers_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.10opticalfibers_lab')}</button>
 </div>
 <div className="lg:flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:overflow-visible">
 
 {/* LEFT: Theory & Setup */}
 <div className="flex flex-col gap-6 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex">
 <div className={`bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600"/>{t('lab.10opticalfibers_theory')}</h2>
 <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
 
 {t('lab.p10opticalfibers_total_internal_reflection_tir_')} {'>'} {t('lab.p10opticalfibers_n_and_the_angle_of_incidence_e')} <strong>{t('lab.10opticalfibers_criticalangle')}</strong> {t('lab.p10opticalfibers_c')}
 </p>
 <div className={`bg-blue-50 p-3 rounded-lg text-center font-mono text-blue-900 mb-4 font-bold border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900 dark:text-[#ffffff] flex-col `}>
 
 {t('lab.p10opticalfibers_sin_c_n_n')}
 </div>
 <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">
 
 {t('lab.p10opticalfibers_if_an_optical_fiber_is_bent_to')}
 </p>
 </div>

 <div className={`bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-600"/>{t('lab.10opticalfibers_setup')}</h2>
 
 <div className="space-y-5">
 <div>
 <div className="flex justify-between text-sm font-medium mb-1">
 <span className="text-slate-700 dark:text-[#ffffff]">{t('lab.p10opticalfibers_core_index_n')}</span>
 <span className="text-indigo-600 font-mono">{nCore.toFixed(2)}</span>
 </div>
 <input type="range" min="1.40" max="1.60" step="0.01" value={nCore} onChange={(e) => setNCore(Number(e.target.value))} className="w-full accent-indigo-600" />
 </div>

 <div>
 <div className="flex justify-between text-sm font-medium mb-1">
 <span className="text-slate-700 dark:text-[#ffffff]">{t('lab.p10opticalfibers_cladding_index_n')}</span>
 <span className="text-indigo-600 font-mono">{nClad.toFixed(2)}</span>
 </div>
 <input type="range" min="1.30" max="1.55" step="0.01" value={nClad} onChange={(e) => setNClad(Number(e.target.value))} className="w-full accent-indigo-600" />
 </div>

 <div>
 <div className="flex justify-between text-sm font-medium mb-1">
 <span className="text-slate-700 dark:text-[#ffffff]">{t('lab.p10opticalfibers_bend_radius_mm')}</span>
 <span className="text-indigo-600 font-mono">{bendRadius}</span>
 </div>
 <input type="range" min="20" max="100" step="1" value={bendRadius} onChange={(e) => setBendRadius(Number(e.target.value))} className="w-full accent-indigo-600" />
 </div>

 <div>
 <div className="flex justify-between text-sm font-medium mb-1">
 <span className="text-slate-700 dark:text-[#ffffff]">{t('lab.p10opticalfibers_input_laser_power_mw')}</span>
 <span className="text-indigo-600 font-mono">{laserPower.toFixed(1)}</span>
 </div>
 <input type="range" min="1.0" max="10.0" step="0.5" value={laserPower} onChange={(e) => setLaserPower(Number(e.target.value))} className="w-full accent-indigo-600" />
 </div>
 </div>

 <div className={`mt-6 p-4 bg-slate-50 dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="text-sm text-slate-500 dark:text-[#71717a] mb-1">{t('lab.10opticalfibers_calculatedcriticalangle')}</div>
 <div className={`text-xl font-mono font-bold ${isNaN(criticalAngle) ? 'text-red-500' : 'text-slate-800 dark:text-slate-100'}`}>
 {isNaN(criticalAngle) ? 'No TIR (n₁ ≤ n₂)' : `${criticalAngle.toFixed(1)}°`}
 </div>
 </div>

 <button 
 onClick={() => setIsLaserOn(!isLaserOn)}
 className={`mt-4 w-full py-3 rounded-xl font-bold text-white transition-colors ${isLaserOn ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-700 dark:bg-[#121212] hover:bg-[#121212] dark:bg-[#121212]'}`}
 >
 {isLaserOn ? 'Turn Laser OFF' : 'Turn Laser ON'}
 </button>
 </div>
 </div>

 {/* MIDDLE: Simulation */}
 <div className={`w-full bg-[#000000] dark:!bg-[#121212] rounded-2xl shadow-sm border border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col relative lg:h-full lg:min-h-[35vh] 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
 <div className="absolute top-4 left-4 text-white font-medium text-sm flex items-center gap-2 z-10">
 <Info className="w-4 h-4 text-blue-400" /> {t('lab.p10opticalfibers_virtual_fiber_optic_bench')}
 </div>
 
 <div className="flex-1 relative w-full flex items-center justify-center p-8">
 <svg className="w-full h-full" viewBox="0 0 450 350" preserveAspectRatio="xMidYMid meet">
 <defs>
 <filter id="glow">
 <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
 <feMerge>
 <feMergeNode in="coloredBlur"/>
 <feMergeNode in="SourceGraphic"/>
 </feMerge>
 </filter>
 </defs>

 {/* Laser Source Box */}
 <rect x="5" y="80" width="40" height="40" fill="#27272a" rx="4" stroke="#52525b" strokeWidth="2" />
 <rect x="45" y="95" width="5" height="10" fill={isLaserOn ? "#ef4444" : "#7f1d1d"} />

 {/* The Fiber Path */}
 {/* Cladding */}
 <path 
 d={`M 50 100 L 250 100 A ${bendRadius} ${bendRadius} 0 0 1 250 ${100 + 2*bendRadius} L 50 ${100 + 2*bendRadius}`} 
 fill="none" stroke="#64748b" strokeWidth="24" strokeLinecap="round" strokeOpacity="0.4"
 />
 {/* Core */}
 <path 
 d={`M 50 100 L 250 100 A ${bendRadius} ${bendRadius} 0 0 1 250 ${100 + 2*bendRadius} L 50 ${100 + 2*bendRadius}`} 
 fill="none" stroke="#cbd5e1" strokeWidth="14" strokeLinecap="round" strokeOpacity="0.6"
 />

 {/* Escaping Rays */}
 {escapingRays}

 {/* Internal Laser Guided Path */}
 {isLaserOn && T > 0 && nClad < nCore && (
 <path 
 d={`M 50 100 L 250 100 A ${bendRadius} ${bendRadius} 0 0 1 250 ${100 + 2*bendRadius} L 50 ${100 + 2*bendRadius}`} 
 fill="none" stroke="#ef4444" strokeWidth="4" 
 strokeOpacity={0.4 + 0.6 * T}
 filter="url(#glow)"
 />
 )}

 {/* Receiver (Photodiode) */}
 <rect x="5" y={100 + 2*bendRadius - 20} width="40" height="40" fill="#1e293b" rx="20" stroke="#475569" strokeWidth="2" />
 <circle cx="25" cy={100 + 2*bendRadius} r="10" fill={isLaserOn && T > 0.1 ? "#ef4444" : "#000"} filter={isLaserOn && T > 0.1 ? "url(#glow)" : ""} />

 </svg>
 </div>

 <div className="bg-[#121212] dark:bg-[#121212] lg:dark:bg-[#121212] p-4 border-t border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex justify-between items-center text-white flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
 <div className="text-sm text-slate-400">{t('lab.10opticalfibers_powermeter')}</div>
 <div className="font-mono text-2xl font-bold text-emerald-400">
 {measuredPower.toFixed(2)} <span className="text-sm text-emerald-600">mW</span>
 </div>
 </div>
 </div>

 {/* RIGHT: Data & Assessment */}
 <div className="flex flex-col gap-6">
 <div className={`bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col h-[400px] ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex justify-between items-center mb-4">
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2"><Table2 className="w-5 h-5 text-emerald-600"/>{t('lab.10opticalfibers_datalog')}</h2>
 <button 
 onClick={recordData}
 disabled={!isLaserOn}
 className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-md text-sm font-bold hover:bg-emerald-200 disabled:opacity-50"
 >
 
 {t('lab.p10opticalfibers_record_data')}
 </button>
 </div>
 
 <div className="flex-1 lg:overflow-y-auto border border-slate-200 dark:border-[#1c1b1b] rounded-lg mb-4">
 <table className="w-full text-sm text-left">
 <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0">
 <tr>
 <th className="p-3 font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.p10opticalfibers_r_mm')}</th>
 <th className="p-3 font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.p10opticalfibers_power_mw')}</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {loggedData.length === 0 && <tr><td colSpan={2} className="p-4 text-center text-slate-400 italic">{t('lab.10opticalfibers_no_data')}</td></tr>}
 {loggedData.map((d, i) => (
 <tr key={i} className="hover:bg-slate-50 dark:bg-[#121212]">
 <td className="p-3 font-mono text-slate-600 dark:text-[#a1a1aa]">{d.bendRadius}</td>
 <td className="p-3 font-mono text-slate-600 dark:text-[#a1a1aa]">{d.measuredPower.toFixed(2)}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 <div className="h-32 border border-slate-200 dark:border-[#1c1b1b] rounded-lg p-2 relative bg-slate-50 dark:bg-[#121212]">
 <div className="absolute top-2 left-2 text-[10px] text-slate-400 font-bold">{t('lab.10opticalfibers_powervsradius')}</div>
 <svg className="w-full h-full" viewBox="0 0 300 200" preserveAspectRatio="none">
 {/* Axes */}
 <line x1="0" y1="200" x2="300" y2="200" stroke="#cbd5e1" strokeWidth="2" />
 <line x1="0" y1="0" x2="0" y2="200" stroke="#cbd5e1" strokeWidth="2" />
 {/* Points */}
 {points.length > 1 && (
 <polyline points={points.join(' ')} fill="none" stroke="#10b981" strokeWidth="2" opacity="0.3" />
 )}
 {points.map((p, i) => {
 const [x, y] = p.split(',');
 return <circle key={i} cx={x} cy={y} r="4" fill="#10b981" />;
 })}
 </svg>
 </div>
 </div>

 <div className="bg-[#121212] dark:!bg-[#121212] rounded-2xl shadow-sm border border-[#1c1b1b] dark:border-[#1c1b1b] p-6 text-white flex-1">
 <h2 className="text-lg font-bold mb-3 text-amber-400">{t('lab.10opticalfibers_analysisassessment')}</h2>
 <p className="text-sm text-slate-300 mb-4 leading-relaxed">
 
 {t('lab.p10opticalfibers_a_faulty_optical_fiber_starts_')} <strong>82.0°</strong>{t('lab.10opticalfibers_andyouknowthecoreindexis')}<strong>1.52</strong>{t('lab.p10opticalfibers_calculate_the_refractive_index')}
 </p>
 <div className="flex gap-2">
 <input 
 type="text" 
 placeholder={t('lab.p10opticalfibers_t_lab_10opticalfibers_eg145')}
 value={assessmentAns}
 onChange={e => setAssessmentAns(e.target.value)}
 className="flex-1 bg-slate-700 dark:bg-[#121212] border border-slate-600 dark:border-[#1c1b1b] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
 />
 <button onClick={checkAssessment} className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg font-bold text-sm dark:text-white dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40">
 
 {t('lab.p10opticalfibers_check')}
 </button>
 </div>
 {assessmentStatus === 'correct' && <div className="mt-3 text-emerald-400 text-sm font-bold">{t('lab.10opticalfibers_correctn_clad1505')}</div>}
 {assessmentStatus === 'incorrect' && <div className="mt-3 text-rose-400 text-sm font-bold">{t('lab.p10opticalfibers_incorrect_hint_sin_82_n_clad_1')}</div>}
 </div>
 </div>

 </div>
 </div>
 );
}
