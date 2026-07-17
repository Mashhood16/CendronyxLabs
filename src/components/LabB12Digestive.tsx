import { useState, useEffect } from 'react';
import { TestTube, Thermometer, Droplets, Play, CheckCircle2, RotateCcw, Activity, LineChart, Table2 } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

export default function LabB12Digestive({ onExit }: { onExit?: () => void }) {
 const { recordLabData } = useLab();
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeTab, setActiveTab] = useState<'starch' | 'protein'>('starch');
 
 // Starch Digestion State
 const [temperature, setTemperature] = useState(37);
 const [isDigesting, setIsDigesting] = useState(false);
 const [digestionLevel, setDigestionLevel] = useState(0); // 0 to 100
 const [timeElapsed, setTimeElapsed] = useState(0);
 const [iodineAdded, setIodineAdded] = useState(false);
 
 // Protein Detection State
 const [proteinSample, setProteinSample] = useState<'egg' | 'water'>('egg');
 const [naohAdded, setNaohAdded] = useState(false);
 const [cuso4Added, setCuso4Added] = useState(false);

 // Data Logging & Assessment
 const [dataPoints, setDataPoints] = useState<{ temp: number; time: number }[]>([]);
 const [studentRate, setStudentRate] = useState('');
 const [rateStatus, setRateStatus] = useState<boolean | null>(null);

 // Simulation Loop for Starch Digestion
 useEffect(() => {
 let timer: number;
 if (isDigesting && digestionLevel < 100) {
 timer = window.setInterval(() => {
 setDigestionLevel(prev => {
 // Enzyme kinetics: Optimal at 37C. Denatures above 60C. Inactive near 0C.
 const diff = Math.abs(temperature - 37);
 let rate = 0;
 
 // Introduce +/- 2% noise to simulate real-world inaccuracy
 const noise = 1 + (Math.random() * 0.04 - 0.02);
 
 if (temperature >= 60 || temperature <= 0) {
 rate = 0;
 } else {
 rate = Math.max(0.2, 5 - diff * 0.15) * noise;
 }
 
 const next = prev + rate;
 return Math.min(100, next);
 });
 setTimeElapsed(prev => prev + 0.5);
 }, 500);
 } else if (digestionLevel >= 100 && isDigesting) {
 setIsDigesting(false);
 }
 return () => clearInterval(timer);
 }, [isDigesting, digestionLevel, temperature]);

 const resetStarch = () => {
 setIsDigesting(false);
 setDigestionLevel(0);
 setTimeElapsed(0);
 setIodineAdded(false);
 };

 const resetProtein = () => {
 setNaohAdded(false);
 setCuso4Added(false);
 };

 const getStarchColor = () => {
 if (!iodineAdded) return '#f8fafc'; // Clear/cloudy suspension
 if (digestionLevel < 80) return '#1e3a8a'; // Blue-black complex (starch present)
 return '#ca8a04'; // Yellow-brown (starch completely digested to maltose)
 };

 const getProteinColor = () => {
 if (naohAdded && cuso4Added) {
 return proteinSample === 'egg' ? '#4158D1' : '#bae6fd'; // Purple (peptide bonds) vs Light blue (Cu2+ ions)
 }
 if (cuso4Added) return '#bae6fd';
 return '#f8fafc';
 };

 const recordData = () => {
 if (digestionLevel >= 100) {
 setDataPoints(prev => [...prev, { temp: temperature, time: timeElapsed }]);
 recordLabData({ timestamp: Date.now(), temp: temperature, time: timeElapsed });
 }
 };

 const checkRate = () => {
 if (dataPoints.length === 0) return;
 const latestTime = dataPoints[dataPoints.length - 1].time;
 // Arbitrary rate formula for standard assessment: Rate = 1000 / Time
 const expectedRate = 1000 / latestTime;
 const userRate = parseFloat(studentRate);
 if (!isNaN(userRate) && Math.abs(userRate - expectedRate) < 1.0) {
 setRateStatus(true);
 } else {
 setRateStatus(false);
 }
 };

 const maxTemp = 100;
 const maxTime = Math.max(50, ...dataPoints.map(d => d.time)) || 50;

 return (
 <div className="flex flex-col bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.b12digestive_lab_b12_1_biochemical_tests')} subtitle={t('lab.subtitle_enzyme_kinetics_macromolecule')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.b12digestive_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.b12digestive_lab')}</button>
 </div>
 <main className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:flex-1 min-h-0 lg:overflow-hidden">
 {/* Left Column: Theory */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-[#ffffff]">
 <Activity className="w-5 h-5 text-blue-600"/> {t('lab.b12digestive_theory_context')}
 </h2>
 <div className="prose text-slate-700 dark:text-[#ffffff] text-sm flex flex-col gap-3">
 <p><strong>{t('lab.b12digestive_salivary_amylase')}</strong> {t('lab.b12digestive_is_an_enzyme_that_catalyzes_th')}</p>
 <p><strong>{t('lab.b12digestive_iodine_test')}</strong> {t('lab.b12digestive_iodine_potassium_iodide_i_ki_f')}</p>
 <p><strong>{t('lab.b12digestive_biuret_test')}</strong> {t('lab.b12digestive_used_for_detecting_the_presenc')}</p>
 <div className={`bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2 dark:bg-teal-950/20 dark:border-teal-900 flex-col `}>
 <h3 className="font-semibold text-blue-800 text-sm mb-1 dark:text-[#ffffff]">{t('lab.b12digestive_key_objectives')}</h3>
 <ul className="list-disc pl-4 text-blue-900 text-xs flex flex-col gap-1 dark:text-[#ffffff]">
 <li>{t('lab.b12digestive_determine_the_optimal_temperat')}</li>
 <li>{t('lab.b12digestive_observe_the_colorimetric_chang')}</li>
 <li>{t('lab.b12digestive_identify_the_presence_of_prote')}</li>
 </ul>
 </div>
 </div>
 </div>

 {/* Middle Column: Simulator */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col items-center '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold flex items-center gap-2 w-full text-left mb-4 text-slate-800 dark:text-[#ffffff]">
 <TestTube className="w-5 h-5 text-blue-600"/> {t('lab.b12digestive_interactive_simulator')}
 </h2>
 
 <div className="flex gap-2 w-full mb-6">
 <button onClick={() => setActiveTab('starch')} className={`flex-1 py-2 rounded-lg font-medium transition-colors ${activeTab === 'starch' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}>{t('lab.b12digestive_starch_digestion')}</button>
 <button onClick={() => setActiveTab('protein')} className={`flex-1 py-2 rounded-lg font-medium transition-colors ${activeTab === 'protein' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}>{t('lab.b12digestive_protein_detection')}</button>
 </div>

 {activeTab === 'starch' ? (
 <div className="w-full flex flex-col items-center gap-6">
 <div className={`w-full bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-100 flex-col `}>
 <label className="flex justify-between text-sm font-semibold mb-2 text-slate-700 dark:text-[#ffffff]">
 <span className="flex items-center gap-1"><Thermometer className="w-4 h-4"/> {t('lab.b12digestive_temperature')}</span>
 <span className="text-blue-600">{temperature}°C</span>
 </label>
 <input type="range" min="0" max="100" value={temperature} onChange={e => setTemperature(Number(e.target.value))} disabled={isDigesting || digestionLevel > 0} className="w-full accent-blue-600 cursor-pointer" />
 </div>

 {/* Visualization */}
 <div className="relative w-32 h-56 mt-2 mb-4">
 <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-lg transition-all duration-500">
 <path d="M 30 10 L 30 160 A 20 20 0 0 0 70 160 L 70 10" fill="none" stroke="#cbd5e1" strokeWidth="6" />
 <path d="M 33 80 L 33 160 A 17 17 0 0 0 67 160 L 67 80 Z" fill={getStarchColor()} className="transition-colors duration-1000" />
 <path d="M 38 85 L 38 140" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
 </svg>
 {isDigesting && (
 <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2">
 <div className="flex gap-1">
 <div className="w-1.5 h-1.5 bg-slate-50 dark:bg-[#121212]/50 rounded-full animate-bounce"></div>
 <div className="w-1.5 h-1.5 bg-slate-50 dark:bg-[#121212]/50 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
 <div className="w-1.5 h-1.5 bg-slate-50 dark:bg-[#121212]/50 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
 </div>
 </div>
 )}
 </div>

 <div className="w-full grid grid-cols-2 gap-3 text-sm">
 <div className="flex flex-col bg-blue-50 p-2 rounded border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900">
 <span className="text-blue-700 font-semibold text-xs uppercase">{t('lab.b12digestive_digestion')}</span>
 <span className="font-mono font-bold text-lg text-blue-900 dark:text-[#ffffff]">{digestionLevel.toFixed(1)}%</span>
 </div>
 <div className="flex flex-col bg-slate-50 dark:bg-[#121212] p-2 rounded border border-slate-200 dark:border-[#1c1b1b]">
 <span className="text-slate-500 dark:text-[#71717a] font-semibold text-xs uppercase">{t('lab.b12digestive_time_elapsed')}</span>
 <span className="font-mono font-bold text-lg text-slate-800 dark:text-[#ffffff]">{timeElapsed.toFixed(1)} s</span>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-3 w-full mt-2">
 <button onClick={() => setIsDigesting(true)} disabled={isDigesting || digestionLevel >= 100} className="flex items-center justify-center gap-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"><Play className="w-4 h-4"/> {t('lab.b12digestive_add_amylase')}</button>
 <button onClick={() => setIodineAdded(true)} disabled={isDigesting} className="flex items-center justify-center gap-1 bg-yellow-600 text-white p-3 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-yellow-500/40"><Droplets className="w-4 h-4"/> {t('lab.b12digestive_add_iodine')}</button>
 <button onClick={resetStarch} className="col-span-2 flex items-center justify-center gap-1 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] p-3 rounded-lg hover:bg-slate-300 dark:bg-[#121212] font-medium transition-colors"><RotateCcw className="w-4 h-4"/> {t('lab.b12digestive_reset_tube')}</button>
 </div>
 </div>
 ) : (
 <div className="w-full flex flex-col items-center gap-6">
 <div className="w-full bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-100">
 <label className="flex flex-col text-sm font-semibold mb-2 text-slate-700 dark:text-[#ffffff] gap-2">
 <span>{t('lab.b12digestive_select_sample')}</span>
 <select value={proteinSample} onChange={e => setProteinSample(e.target.value as 'egg'|'water')} className="p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-indigo-600 outline-none" disabled={naohAdded || cuso4Added}>
 <option value="egg">{t('lab.b12digestive_egg_white_solution')}</option>
 <option value="water">{t('lab.b12digestive_distilled_water_control')}</option>
 </select>
 </label>
 </div>

 <div className="relative w-32 h-56 mt-2 mb-4">
 <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-lg transition-all duration-500">
 <path d="M 30 10 L 30 160 A 20 20 0 0 0 70 160 L 70 10" fill="none" stroke="#cbd5e1" strokeWidth="6" />
 <path d="M 33 80 L 33 160 A 17 17 0 0 0 67 160 L 67 80 Z" fill={getProteinColor()} className="transition-colors duration-1000" />
 <path d="M 38 85 L 38 140" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
 </svg>
 </div>

 <div className="grid grid-cols-2 gap-3 w-full mt-2">
 <button onClick={() => setNaohAdded(true)} disabled={naohAdded} className="flex items-center justify-center gap-1 bg-slate-600 dark:bg-[#121212] text-white p-3 rounded-lg hover:bg-slate-700 dark:bg-[#121212] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent"><Droplets className="w-4 h-4"/> {t('lab.b12digestive_add_naoh')}</button>
 <button onClick={() => setCuso4Added(true)} disabled={!naohAdded || cuso4Added} className="flex items-center justify-center gap-1 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"><Droplets className="w-4 h-4"/> {t('lab.b12digestive_add_cuso')}</button>
 <button onClick={resetProtein} className="col-span-2 flex items-center justify-center gap-1 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] p-3 rounded-lg hover:bg-slate-300 dark:bg-[#121212] font-medium transition-colors"><RotateCcw className="w-4 h-4"/> {t('lab.b12digestive_reset_tube')}</button>
 </div>
 </div>
 )}
 </div>

 {/* Right Column: Assessment */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col gap-4 '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-[#ffffff]">
 <LineChart className="w-5 h-5 text-blue-600"/> {t('lab.b12digestive_data_analysis')}
 </h2>
 
 <div className="flex justify-between items-center bg-slate-50 dark:bg-[#121212] p-3 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
 <span className="text-sm text-slate-600 dark:text-[#a1a1aa] font-medium flex items-center gap-2"><Table2 className="w-4 h-4"/> {t('lab.b12digestive_data_logger')}</span>
 <button onClick={recordData} disabled={activeTab !== 'starch' || digestionLevel < 100} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">
 
 {t('lab.b12digestive_record_measurement')}
 </button>
 </div>

 <div className="overflow-x-auto border border-slate-200 dark:border-[#1c1b1b] rounded-lg max-h-40">
 <table className="w-full text-sm text-left text-slate-600 dark:text-[#a1a1aa]">
 <thead className="text-xs text-slate-700 dark:text-[#ffffff] uppercase bg-slate-100 dark:bg-[#121212] sticky top-0">
 <tr>
 <th className="px-4 py-2 border-b">{t('lab.b12digestive_trial')}</th>
 <th className="px-4 py-2 border-b">{t('lab.b12digestive_temp_c')}</th>
 <th className="px-4 py-2 border-b">{t('lab.b12digestive_time_s')}</th>
 </tr>
 </thead>
 <tbody>
 {dataPoints.map((dp, i) => (
 <tr key={i} className="border-b last:border-0 hover:bg-slate-50 dark:bg-[#121212]">
 <td className="px-4 py-2 font-medium">{i + 1}</td>
 <td className="px-4 py-2">{dp.temp}</td>
 <td className="px-4 py-2">{dp.time.toFixed(1)}</td>
 </tr>
 ))}
 {dataPoints.length === 0 && (
 <tr>
 <td colSpan={3} className="px-4 py-4 text-center text-slate-400 italic">{t('lab.b12digestive_no_data_recorded_yet_wait_for_')}</td>
 </tr>
 )}
 </tbody>
 </table>
 </div>

 {/* SVG Graph */}
 <div className="w-full h-48 bg-slate-50 dark:bg-[#121212] rounded-lg relative border border-slate-200 dark:border-[#1c1b1b] mt-2">
 <h3 className="absolute top-2 left-2 text-xs font-semibold text-slate-500 dark:text-[#71717a]">{t('lab.b12digestive_reaction_time_vs_temperature')}</h3>
 <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible p-6">
 {/* axes */}
 <line x1="0" y1="100" x2="100" y2="100" stroke="#94a3b8" strokeWidth="1"/>
 <line x1="0" y1="100" x2="0" y2="0" stroke="#94a3b8" strokeWidth="1"/>
 
 {dataPoints.length > 1 && (
 <polyline 
 fill="none" 
 stroke="#3b82f6" 
 strokeWidth="1.5" 
 points={dataPoints.map(dp => `${(dp.temp / maxTemp) * 100},${100 - (dp.time / maxTime) * 100}`).join(' ')} 
 />
 )}
 
 {dataPoints.map((dp, i) => (
 <circle key={i} cx={(dp.temp / maxTemp) * 100} cy={100 - (dp.time / maxTime) * 100} r="2.5" fill="#ef4444" className="hover:r-4 transition-all cursor-pointer" />
 ))}
 </svg>
 <span className="absolute bottom-1 right-2 text-[10px] text-slate-400">{t('lab.b12digestive_temp_c')}</span>
 <span className="absolute top-2 left-1 text-[10px] text-slate-400 -rotate-90 origin-left">{t('lab.b12digestive_time_s')}</span>
 </div>

 {/* Assessment Section */}
 <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2 dark:bg-teal-950/20 dark:border-teal-900 `}>
 <h3 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-1 dark:text-[#ffffff]"><CheckCircle2 className="w-4 h-4"/> {t('lab.b12digestive_assessment')}</h3>
 <p className="text-xs text-blue-800 mb-3 leading-relaxed dark:text-[#ffffff]">
 
 {t('lab.b12digestive_based_on_your_latest_recorded_')} <strong>{t('lab.b12digestive_rate_of_reaction')}</strong>.
 <br/>
 <span className="font-mono bg-blue-100 px-1 rounded block mt-1">{t('lab.b12digestive_formula_rate_1000_time_s')}</span>
 </p>
 <div className="flex gap-2">
 <input 
 type="number" 
 placeholder={t('lab.b12digestive_enter_calculated_rate')} 
 value={studentRate} 
 onChange={e => { setStudentRate(e.target.value); setRateStatus(null); }}
 className="flex-1 px-3 py-2 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
 disabled={dataPoints.length === 0}
 />
 <button 
 onClick={checkRate} 
 disabled={dataPoints.length === 0}
 className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
 >
 
 {t('lab.b12digestive_verify')}
 </button>
 </div>
 {rateStatus !== null && (
 <div className={`mt-3 text-sm font-medium p-2 rounded ${rateStatus ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
 {rateStatus ? 'Correct! Excellent calculation.' : 'Incorrect. Check your formula and try again.'}
 </div>
 )}
 </div>

 </div>
 </main>
 </div>
 );
}
