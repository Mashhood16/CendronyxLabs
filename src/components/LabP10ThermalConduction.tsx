import { useState, useEffect } from 'react';
import {Play, Pause, Plus, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from '../i18n';

interface LabProps { onExit?: () => void; }

export default function LabP10ThermalConduction({ onExit }: LabProps) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [material, setMaterial] = useState('Cu');
 const [length, setLength] = useState(0.2);
 const [tempSource, setTempSource] = useState(200);

 const [time, setTime] = useState(0);
 const [isRunning, setIsRunning] = useState(false);
 const [meltedMass, setMeltedMass] = useState(0);

 const [data, setData] = useState<{ t: number; m: number }[]>([]);
 const [answer, setAnswer] = useState('');
 const [feedback, setFeedback] = useState('');

 const materials: Record<string, number> = {
 Cu: 385,
 Al: 205,
 Fe: 80,
 Mystery: 50
 };

 const A = 0.0001; // m^2
 const Lf = 334; // J/g
 const Tc = 0; // °C

 useEffect(() => {
 let timer: number;
 if (isRunning) {
 timer = window.setInterval(() => {
 setTime(prevTime => {
 const newTime = prevTime + 1;
 setMeltedMass(prevMass => {
 const P = (materials[material] * A * (tempSource - Tc)) / length;
 const rate = P / Lf;
 const noise = 1 + (Math.random() - 0.5) * 0.04; // +/- 2% noise
 return prevMass + rate * noise;
 });
 return newTime;
 });
 }, 1000); // 1 real second = 1 sim second
 }
 return () => clearInterval(timer);
 }, [isRunning, material, tempSource, length, Tc, A, Lf, materials]);

 const handleReset = () => {
 setIsRunning(false);
 setTime(0);
 setMeltedMass(0);
 setData([]);
 setFeedback('');
 setAnswer('');
 };

 const handleRecord = () => {
 setData(prev => [...prev, { t: time, m: Number(meltedMass.toFixed(2)) }]);
 };

 const checkAnswer = () => {
 const val = parseFloat(answer);
 if (isNaN(val)) {
 setFeedback('Please enter a valid number.');
 return;
 }
 if (val > 45 && val < 55) {
 setFeedback('Correct! The thermal conductivity is approximately 50 W/m·K.');
 } else {
 setFeedback('Incorrect. Check your slope and formula.');
 }
 };

 const renderGraph = () => {
 const pts = data.map(d => ({ x: d.t, y: d.m }));
 const maxX = Math.max(60, ...pts.map(p => p.x));
 const maxY = Math.max(10, ...pts.map(p => p.y));

 return (
 <svg viewBox="0 0 300 200" className="w-full h-48 bg-slate-50 dark:bg-[#121212] border rounded-md shadow-inner">
 {/* Axes */}
 <line x1="40" y1="160" x2="280" y2="160" stroke="#94a3b8" strokeWidth="2" />
 <line x1="40" y1="160" x2="40" y2="20" stroke="#94a3b8" strokeWidth="2" />
 {/* Labels */}
 <text x="140" y="190" fontSize="12" fill="#64748b" fontWeight="bold">{t('lab.p10thermalconduction_time_s')}</text>
 <text x="-120" y="20" fontSize="12" fill="#64748b" fontWeight="bold" transform="rotate(-90)">{t('lab.p10thermalconduction_mass_g')}</text>
 
 {/* Ticks */}
 <text x="35" y="165" fontSize="10" fill="#94a3b8" textAnchor="end">0</text>
 <text x="35" y="25" fontSize="10" fill="#94a3b8" textAnchor="end">{maxY.toFixed(1)}</text>
 <text x="280" y="175" fontSize="10" fill="#94a3b8" textAnchor="middle">{maxX.toFixed(0)}</text>

 {/* Data points */}
 {pts.map((p, i) => {
 const cx = 40 + (p.x / maxX) * 240;
 const cy = 160 - (p.y / maxY) * 140;
 return <circle key={i} cx={cx} cy={cy} r="4" fill="#ef4444" className="hover:r-6 transition-all" />;
 })}
 {pts.length > 1 && (
 <polyline
 points={pts.map(p => `${40 + (p.x / maxX) * 240},${160 - (p.y / maxY) * 140}`).join(' ')}
 fill="none"
 stroke="#ef4444"
 strokeWidth="2"
 strokeDasharray="4,4"
 opacity="0.5"
 />
 )}
 </svg>
 );
 };

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.p10thermalconduction_unit_10_thermal_conduction')} subtitle={t('lab.subtitle_determine_thermal_conductivity')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.p10thermalconduction_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.10thermalconduction_lab')}</button>
 </div>
 <div className="lg:flex-1 p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 max-w-7xl mx-auto w-full lg:overflow-visible">
 {/* Column 1: Setup */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col gap-6 ${activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex mb-4' : 'hidden'} lg:flex lg:order-none`}>
 <div className={`${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.10thermalconduction_theory_andsetup')}</h2>
 <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
 
 {t('lab.p10thermalconduction_heat_transfers_through_a_rod_a')} <strong>{t('lab.10thermalconduction_fourierslaw')}</strong>: <br/>
 <span className={`font-mono bg-slate-100 dark:bg-[#121212] p-1 rounded mt-1 inline-block `}>{t('lab.10thermalconduction_pkatl')}</span>
 </p>
 <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
 
 {t('lab.p10thermalconduction_the_heat_melts_an_ice_block_at')}
 <br/>
 <span className={`font-mono bg-slate-100 dark:bg-[#121212] p-1 rounded mt-1 inline-block `}>{t('lab.p10thermalconduction_p_m_t_l_f')}</span><br/>
 <span className="text-xs text-slate-500 dark:text-[#71717a]">{t('lab.p10thermalconduction_l_f_334_j_g_for_water')}</span>
 </p>
 </div>

 <div className="space-y-4">
 <div>
 <label className="block text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.10thermalconduction_material')}</label>
 <select
 value={material}
 onChange={(e) => { setMaterial(e.target.value); handleReset(); }}
 className={`w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md bg-slate-50 dark:bg-[#121212] focus:ring-2 focus:ring-blue-500 outline-none flex-col `}
 >
 <option value="Cu">{t('lab.10thermalconduction_copper')}</option>
 <option value="Al">{t('lab.10thermalconduction_aluminium')}</option>
 <option value="Fe">{t('lab.10thermalconduction_iron')}</option>
 <option value="Mystery">{t('lab.10thermalconduction_mysteryalloy')}</option>
 </select>
 </div>
 
 <div>
 <label className="block text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-1">
 
 {t('lab.p10thermalconduction_source_temperature')} {tempSource}°C
 </label>
 <input
 type="range" min="100" max="500" step="10"
 value={tempSource}
 onChange={(e) => { setTempSource(Number(e.target.value)); handleReset(); }}
 className="w-full accent-blue-600"
 />
 </div>

 <div>
 <label className="block text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-1">
 
 {t('lab.p10thermalconduction_rod_length')} {length.toFixed(2)} m
 </label>
 <input
 type="range" min="0.1" max="0.5" step="0.05"
 value={length}
 onChange={(e) => { setLength(Number(e.target.value)); handleReset(); }}
 className="w-full accent-blue-600"
 />
 </div>

 <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900">
 <span className="text-sm text-blue-800 dark:text-[#ffffff]">{t('lab.p10thermalconduction_fixed_cross_sectional_area_a_1')}</span>
 </div>
 </div>
 </div>

 {/* Column 2: Simulation */}
 <div className={`w-full bg-[#000000] dark:!bg-[#121212] rounded-2xl shadow-sm border border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-4 flex flex-col relative lg:h-[500px] lg:h-auto 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
 <div className="flex justify-center gap-4 mb-4 z-10 relative">
 <button
 onClick={() => setIsRunning(!isRunning)}
 className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-white transition-all ${ isRunning ? 'bg-amber-500 hover:bg-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-green-500 hover:bg-green-600 shadow-md' }`}
 >
 {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
 {isRunning ? 'Pause' : 'Start Burner'}
 </button>
 <div className={`bg-[#121212] dark:bg-[#121212] text-cyan-300 font-mono px-4 py-2 rounded-full border border-[#1c1b1b] dark:border-[#1c1b1b] shadow-inner flex gap-4 `}>
 <span>{t('lab.p10thermalconduction_time')} {time}s</span>
 <span>{t('lab.p10thermalconduction_mass')} {meltedMass.toFixed(2)}g</span>
 </div>
 </div>

 <div className={`flex-1 w-full relative ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block`}>
 <svg viewBox="0 0 500 300" className="w-full h-full absolute inset-0">
 <defs>
 <linearGradient id="rodGrad" x1="0" y1="0" x2="1" y2="0">
 <stop offset="0%" stopColor={tempSource > 300 ? "#fca5a5" : "#fde68a"} />
 <stop offset="100%" stopColor="#93c5fd" />
 </linearGradient>
 </defs>
 
 {/* Burner Stand */}
 <rect x="25" y="180" width="30" height="120" fill="#475569" />
 {/* Flame */}
 {isRunning && (
 <path d="M 30 180 Q 40 100 50 180 Z" fill="#ef4444" className="animate-pulse origin-bottom" style={{ transformOrigin: '40px 180px' }} />
 )}
 {/* Heat Source Block */}
 <rect x="20" y="140" width="40" height="40" fill={isRunning ? "#ea580c" : "#64748b"} rx="4" />
 <text x="25" y="165" fill="white" fontSize="12" fontWeight="bold">{isRunning ? tempSource : 20}°C</text>
 
 {/* Rod */}
 <rect x="60" y="150" width={length * 600} height="20" fill="url(#rodGrad)" stroke="#1e293b" strokeWidth="2" />
 
 {/* Ice Block */}
 <rect x={60 + length * 600} y="120" width="60" height="80" fill="#a5f3fc" opacity="0.8" rx="4" />
 <text x={65 + length * 600} y="165" fill="#0f172a" fontSize="12" fontWeight="bold">{t('lab.p10thermalconduction_0_c_ice')}</text>
 
 {/* Beaker */}
 <path d={`M ${70 + length*600} 220 L ${70 + length*600} 280 L ${110 + length*600} 280 L ${110 + length*600} 220`} fill="none" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
 
 {/* Water in beaker */}
 <rect x={73 + length*600} y={278 - Math.min(50, meltedMass*2)} width="34" height={Math.min(50, meltedMass*2)} fill="#3b82f6" opacity="0.8" />
 
 {/* Dripping water animation */}
 {isRunning && meltedMass > 0 && time % 2 === 0 && (
 <circle cx={90 + length*600} cy={205 + (time % 3)*20} r="3" fill="#3b82f6" opacity="0.8" />
 )}
 {isRunning && meltedMass > 0 && time % 2 !== 0 && (
 <circle cx={90 + length*600} cy={215 + (time % 3)*20} r="3" fill="#3b82f6" opacity="0.8" />
 )}
 </svg>
 </div>
 </div>

 {/* Column 3: Data & Analysis */}
 <div className={`bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex-col gap-6 rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4">{t('lab.10thermalconduction_datalogging')}</h2>
 <div className="flex gap-2 mb-4">
 <button
 onClick={handleRecord}
 className="flex-1 flex justify-center items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-md font-bold transition-colors"
 >
 <Plus className="w-4 h-4" /> {t('lab.p10thermalconduction_record_data_point')}
 </button>
 </div>
 
 <div className="max-h-32 lg:overflow-y-auto border border-slate-200 dark:border-[#1c1b1b] rounded-md mb-4">
 <table className="w-full text-sm text-left">
 <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0">
 <tr>
 <th className="px-4 py-2 font-bold text-slate-700 dark:text-[#ffffff]">{t('lab.p10thermalconduction_time_s')}</th>
 <th className="px-4 py-2 font-bold text-slate-700 dark:text-[#ffffff]">{t('lab.p10thermalconduction_mass_g')}</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {data.length === 0 ? (
 <tr><td colSpan={2} className="px-4 py-4 text-center text-slate-400 italic">{t('lab.10thermalconduction_no_data')}</td></tr>
 ) : (
 data.map((d, i) => (
 <tr key={i} className="hover:bg-slate-50 dark:bg-[#121212]">
 <td className="px-4 py-2 font-mono text-slate-600 dark:text-[#a1a1aa]">{d.t}</td>
 <td className="px-4 py-2 font-mono text-slate-600 dark:text-[#a1a1aa]">{d.m.toFixed(2)}</td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>

 {renderGraph()}
 </div>

 <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h3 className="font-bold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.10thermalconduction_analysismysterymaterial')}</h3>
 <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-3">
 
 {t('lab.p10thermalconduction_1_select_the')} <strong>{t('lab.10thermalconduction_mysteryalloy')}</strong>{t('lab.10thermalconduction_sett_sto300candlto02m')}<br/>
 
 {t('lab.p10thermalconduction_2_log_data_for_60_seconds_to_f')}<br/>
 
 {t('lab.p10thermalconduction_3_calculate_its_thermal_conduc')}
 </p>
 <div className="flex gap-2">
 <input
 type="text"
 placeholder={t('lab.p10thermalconduction_t_lab_10thermalconduction_calc')}
 value={answer}
 onChange={(e) => setAnswer(e.target.value)}
 className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md outline-none focus:ring-2 focus:ring-blue-500 font-mono"
 />
 <button
 onClick={checkAnswer}
 className="bg-[#121212] dark:bg-[#121212] hover:bg-slate-700 dark:bg-[#121212] text-white px-4 py-2 rounded-md font-bold transition-colors"
 >
 
 {t('lab.p10thermalconduction_check')}
 </button>
 </div>
 {feedback && (
 <div className={`mt-3 p-3 rounded-md text-sm flex items-center gap-2 ${feedback.includes('Correct') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
 {feedback.includes('Correct') && <CheckCircle className="w-4 h-4" />}
 {feedback}
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 );
}
