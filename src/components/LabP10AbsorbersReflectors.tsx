import { useState, useEffect } from 'react';
import {Thermometer, BookOpen, LineChart, Info } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from '../i18n';
import { useLab } from '../store';

interface LabProps { onExit?: () => void; }

export default function LabP10AbsorbersReflectors({ onExit }: LabProps) {

const { recordLabData, setLabScore } = useLab();
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [time, setTime] = useState(0);
 const [power, setPower] = useState(300);
 const [tBlack, setTBlack] = useState(20);
 const [tSilver, setTSilver] = useState(20);

 const [data, setData] = useState<{ time: number; power: number; tBlack: number; tSilver: number }[]>([]);
 const [assessmentAnswer, setAssessmentAnswer] = useState('');
 const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

 useEffect(() => {
 if (time === 0) {
 setTBlack(20);
 setTSilver(20);
 return;
 }
 
 const maxB = 20 + power * 0.2;
 const maxS = 20 + power * 0.05;
 
 const baseTB = 20 + (maxB - 20) * (1 - Math.exp(-0.1 * time));
 const baseTS = 20 + (maxS - 20) * (1 - Math.exp(-0.1 * time));
 
 const noiseB = Math.sin(time * 12.3) * 0.4;
 const noiseS = Math.cos(time * 8.7) * 0.2;
 
 setTBlack(baseTB + noiseB);
 setTSilver(baseTS + noiseS);
 }, [time, power]);

 const recordData = () => {
 setData(prev => [...prev, { time, power, tBlack, tSilver }]);
 recordLabData({ timestamp: Date.now(), time, power, tBlack, tSilver });
 };

 const checkAssessment = () => {
 const ans = parseInt(assessmentAnswer, 10);
 // Expected max temp for 300W = 20 + 300 * 0.2 = 80
 if (!isNaN(ans) && ans >= 78 && ans <= 82) {
 setAssessmentStatus('correct');
 } else {
 setAssessmentStatus('incorrect');
 }
 };

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.p10absorbersreflectors_unit_10_absorbers_and_reflecto')} subtitle={t('lab.subtitle_compare_heating_rates')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.p10absorbersreflectors_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.10absorbersreflectors_lab')}</button>
 </div>
 <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 max-w-7xl mx-auto w-full lg:overflow-visible">
 {/* Column 1: Theory */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col gap-6 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center gap-2 border-b pb-2">
 <BookOpen className="w-5 h-5 text-orange-600" />
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.10absorbersreflectors_theory_andsetup')}</h2>
 </div>
 <div className="space-y-4 text-slate-600 dark:text-[#a1a1aa] text-sm">
 <p>
 
 {t('lab.p10absorbersreflectors_different_surfaces_absorb_ther')} <strong>{t('lab.10absorbersreflectors_mattblack')}</strong>{t('lab.10absorbersreflectors_andone')}<strong>{t('lab.10absorbersreflectors_shinysilver')}</strong>.
 </p>
 <p>
 
 {t('lab.p10absorbersreflectors_both_cans_start_at_room_temper')}
 </p>
 <div className={`bg-orange-50 p-4 rounded-lg border border-orange-100 flex-col `}>
 <h3 className="font-bold text-orange-800 mb-2">{t('lab.10absorbersreflectors_heatingcurve')}</h3>
 <p className="font-mono text-xs">{t('lab.p10absorbersreflectors_t_t_t_max_t_max_t_0_e_kt')}</p>
 <p className="text-xs mt-2 text-orange-700">{t('lab.p10absorbersreflectors_the_rate_of_temperature_rise_d')}</p>
 </div>
 <div className={`flex items-start gap-2 bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] p-3 rounded-md flex-col `}>
 <Info className="w-5 h-5 shrink-0 mt-0.5" />
 <p className="text-xs">
 
 {t('lab.p10absorbersreflectors_set_the_heater_power_then_scru')}
 </p>
 </div>
 </div>
 </div>

 {/* Column 2: Simulation */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex-col gap-6 '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center gap-2 border-b pb-2">
 <Thermometer className="w-5 h-5 text-orange-600" />
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.10absorbersreflectors_simulation')}</h2>
 </div>

 <div className={`flex-1 relative bg-[#121212] dark:bg-[#121212] border-2 border-[#1c1b1b] dark:border-[#1c1b1b] rounded-xl flex items-center justify-between px-8 py-4 h-80 shadow-inner flex-col `}>
 
 {/* Matt Black Can */}
 <div className="flex flex-col items-center gap-3 z-10 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
 <div className="w-24 h-32 bg-zinc-900 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.8)] border border-zinc-800 relative flex items-center justify-center">
 <div className="absolute -top-10 text-2xl font-mono text-red-400 font-bold bg-black/50 px-2 rounded">{tBlack.toFixed(1)}°C</div>
 <div className="w-2 h-20 bg-slate-50 dark:bg-[#121212]/10 rounded-full flex items-end">
 <div className="w-full bg-red-500 rounded-full transition-all duration-300 dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40" style={{ height: `${Math.min(100, (tBlack / 120) * 100)}%` }} />
 </div>
 </div>
 <div className="text-white font-bold text-sm">{t('lab.10absorbersreflectors_mattblack')}</div>
 </div>

 {/* Heater */}
 <div className="relative flex justify-center items-center">
 <div className="w-8 h-40 bg-orange-600 rounded-full blur-[3px] flex items-center justify-center shadow-[0_0_40px_rgba(234,88,12,0.6)] z-10" style={{ opacity: power > 0 && time > 0 ? 1 : 0.2 }}>
 <div className="w-2 h-32 bg-yellow-400 rounded-full animate-pulse" />
 </div>
 {power > 0 && time > 0 && (
 <>
 <div className="absolute left-[-40px] text-orange-500 animate-pulse text-2xl tracking-widest">{t('lab.10absorbersreflectors_label')}</div>
 <div className="absolute right-[-40px] text-orange-500 animate-pulse text-2xl tracking-widest opacity-60">{t('lab.10absorbersreflectors_label')}</div>
 </>
 )}
 </div>

 {/* Shiny Silver Can */}
 <div className="flex flex-col items-center gap-3 z-10">
 <div className="w-24 h-32 bg-slate-200 dark:!bg-[#121212] rounded-lg shadow-xl border-l-4 border-white/70 relative flex items-center justify-center bg-gradient-to-r from-slate-300 via-white to-slate-400">
 <div className="absolute -top-10 text-2xl font-mono text-orange-400 font-bold bg-black/50 px-2 rounded">{tSilver.toFixed(1)}°C</div>
 <div className="w-2 h-20 bg-black/20 rounded-full flex items-end">
 <div className="w-full bg-red-500 rounded-full transition-all duration-300 dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40" style={{ height: `${Math.min(100, (tSilver / 120) * 100)}%` }} />
 </div>
 </div>
 <div className="text-white font-bold text-sm">{t('lab.10absorbersreflectors_shinysilver')}</div>
 </div>
 
 </div>

 <div className="space-y-4">
 <div>
 <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 <span>{t('lab.p10absorbersreflectors_heater_power_w')}</span>
 <span className="text-orange-600">{power} W</span>
 </label>
 <input 
 type="range" min="100" max="500" step="50" 
 value={power} onChange={(e) => setPower(Number(e.target.value))}
 disabled={time > 0}
 className="w-full accent-orange-600 disabled:opacity-50"
 />
 {time > 0 && <p className="text-[10px] text-orange-600 mt-1">{t('lab.10absorbersreflectors_resettimeto0tochangepower')}</p>}
 </div>

 <div>
 <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 <span>{t('lab.p10absorbersreflectors_time_minutes')}</span>
 <span className="text-slate-900 dark:text-[#ffffff] font-mono">{time} {t('lab.p10absorbersreflectors_min')}</span>
 </label>
 <input 
 type="range" min="0" max="30" step="1" 
 value={time} onChange={(e) => setTime(Number(e.target.value))}
 className="w-full accent-slate-600"
 />
 </div>
 </div>
 </div>

 {/* Column 3: Data & Analysis */}
 <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col gap-6 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center gap-2 border-b pb-2">
 <LineChart className="w-5 h-5 text-orange-600" />
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.10absorbersreflectors_data_andanalysis')}</h2>
 </div>

 <div className="flex justify-between items-center">
 <span className="text-sm text-slate-600 dark:text-[#a1a1aa]">{t('lab.10absorbersreflectors_scrubtime_andrecord')}</span>
 <button 
 onClick={recordData}
 className="bg-orange-100 text-orange-700 hover:bg-orange-200 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
 >
 
 {t('lab.p10absorbersreflectors_record_data')}
 </button>
 </div>

 <div className="max-h-32 lg:overflow-y-auto border border-slate-200 dark:border-[#1c1b1b] rounded-md">
 <table className="w-full text-sm text-left">
 <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0 shadow-sm z-10">
 <tr>
 <th className="px-3 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.p10absorbersreflectors_t_min')}</th>
 <th className="px-3 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.10absorbersreflectors_power')}</th>
 <th className="px-3 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.10absorbersreflectors_t_black')}</th>
 <th className="px-3 py-2 font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.10absorbersreflectors_t_silver')}</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {data.length === 0 && (
 <tr><td colSpan={4} className="px-3 py-4 text-center text-slate-400">{t('lab.10absorbersreflectors_nodatarecordedyet')}</td></tr>
 )}
 {data.map((d, i) => (
 <tr key={i} className="hover:bg-slate-50 dark:bg-[#121212]">
 <td className="px-3 py-1.5">{d.time}</td>
 <td className="px-3 py-1.5">{d.power}W</td>
 <td className="px-3 py-1.5 font-medium text-slate-900 dark:text-[#ffffff]">{d.tBlack.toFixed(1)}</td>
 <td className="px-3 py-1.5 font-medium text-slate-400">{d.tSilver.toFixed(1)}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Graph */}
 <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col items-center ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <span className="text-xs font-bold text-slate-600 dark:text-[#a1a1aa] mb-2">{t('lab.10absorbersreflectors_tempvstime')}</span>
 <svg width="250" height="150" className="bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded shadow-sm">
 <line x1="30" y1="130" x2="240" y2="130" stroke="#cbd5e1" strokeWidth="2" />
 <line x1="30" y1="10" x2="30" y2="130" stroke="#cbd5e1" strokeWidth="2" />
 <text x="110" y="145" fontSize="10" fill="#64748b">{t('lab.p10absorbersreflectors_time_min')}</text>
 <text x="10" y="80" fontSize="10" fill="#64748b" transform="rotate(-90 10 80)">{t('lab.p10absorbersreflectors_temp_c')}</text>
 
 {/* Legend inside graph */}
 <circle cx="160" cy="20" r="3" fill="#18181b" />
 <text x="165" y="23" fontSize="8" fill="#64748b">{t('lab.10absorbersreflectors_black')}</text>
 <circle cx="200" cy="20" r="3" fill="#94a3b8" />
 <text x="205" y="23" fontSize="8" fill="#64748b">{t('lab.10absorbersreflectors_silver')}</text>

 {data.map((d, i) => {
 const x = 30 + (d.time / 30) * 200;
 const yB = 130 - Math.min(((d.tBlack - 20) / 100) * 120, 120);
 const yS = 130 - Math.min(((d.tSilver - 20) / 100) * 120, 120);
 return (
 <g key={i}>
 <circle cx={x} cy={yB} r="3" fill="#18181b" />
 <circle cx={x} cy={yS} r="3" fill="#94a3b8" />
 </g>
 );
 })}
 </svg>
 </div>

 {/* Assessment */}
 <div className="bg-orange-50 rounded-lg p-4 border border-orange-100 mt-auto">
 <h3 className="font-bold text-orange-800 mb-2 text-sm">{t('lab.10absorbersreflectors_assessment')}</h3>
 <p className="text-xs text-orange-700 mb-3">
 
 {t('lab.p10absorbersreflectors_using_a_heater_power_of_300w_w')}
 </p>
 <div className="flex gap-2">
 <input 
 type="text" 
 value={assessmentAnswer}
 onChange={(e) => setAssessmentAnswer(e.target.value)}
 placeholder={t('lab.p10absorbersreflectors_t_lab_10absorbersreflectors_eg')}
 className="flex-1 px-3 py-1.5 rounded-md border border-orange-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
 />
 <button onClick={checkAssessment} className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-md text-sm font-bold transition-colors dark:text-white dark:text-white dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40">
 
 {t('lab.p10absorbersreflectors_check')}
 </button>
 </div>
 {assessmentStatus === 'correct' && <p className="text-xs text-green-600 mt-2 font-bold">{t('lab.10absorbersreflectors_correctmaxtemp80c')}</p>}
 {assessmentStatus === 'incorrect' && <p className="text-xs text-red-600 mt-2 font-bold">{t('lab.p10absorbersreflectors_incorrect_hint_base_is_20_c_an')}</p>}
 </div>
 </div>
 </div>
 </div>
 );
}
