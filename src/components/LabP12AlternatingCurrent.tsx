import { useState } from 'react';
import { Power, CheckCircle, XCircle, Settings2, Database, Calculator } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from '../i18n';
import { useLab } from '../store';

export default function LabP12AlternatingCurrent({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const { setLabScore } = useLab();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [frequency, setFrequency] = useState<number>(50);
 const [peakVoltage, setPeakVoltage] = useState<number>(100);
 const [capacitance, setCapacitance] = useState<number>(100);
 const [loadResistance, setLoadResistance] = useState<number>(1000);
 const [filterEnabled, setFilterEnabled] = useState<boolean>(true);

 const [logs, setLogs] = useState<Array<any>>([]);
 const [ans1, setAns1] = useState('');
 const [ans2, setAns2] = useState('');
 const [feedback, setFeedback] = useState('');

 const handleRecord = () => {
 setLogs([...logs, { f: frequency, Vp: peakVoltage, C: capacitance, R: loadResistance, filter: filterEnabled ? 'On' : 'Off' }]);
 };

 const checkAnswers = () => {
 let score = 0;
 if (ans1.trim() === '120') score++;
 if (ans2.trim() === '10.0') score++;
 if (score === 2) setFeedback('Spot on! You understand AC to DC conversion.');
 else setFeedback('Not quite. Review the ripple formulas and try again.');
 setLabScore(score, 2);
 };

 const renderSimulationSVG = () => {
 const timeWindow = 0.1; // 100ms
 const points = 400;
 const dt = timeWindow / points;
 let currentV = 0;
 
 const rawPathPoints = [];
 const filterPathPoints = [];
 
 for(let i=0; i<=points; i++) {
 const t = i * dt;
 const vRaw = Math.abs(peakVoltage * Math.sin(2 * Math.PI * frequency * t));
 const vDischarge = currentV * Math.exp(-dt / (loadResistance * capacitance * 1e-6));
 
 if (filterEnabled) {
 currentV = Math.max(vRaw, vDischarge);
 } else {
 currentV = vRaw;
 }
 
 const xSvg = (t / timeWindow) * 400;
 const ySvgRaw = 250 - (vRaw / 250) * 200;
 const ySvgFilt = 250 - (currentV / 250) * 200;
 
 rawPathPoints.push(`${xSvg},${ySvgRaw}`);
 filterPathPoints.push(`${xSvg},${ySvgFilt}`);
 }
 
 return (
 <svg viewBox="0 0 400 300" className="w-full h-full bg-[#000000] dark:bg-[#121212] rounded-lg shadow-inner">
 {/* Grid lines */}
 <line x1="0" y1="50" x2="400" y2="50" stroke="#333" strokeDasharray="4" />
 <text x="5" y="45" fill="#666" fontSize="10">{t('lab.p12alternatingcurrent_250v')}</text>
 <line x1="0" y1="150" x2="400" y2="150" stroke
="#333" strokeDasharray="4" />
 <text x="5" y="145" fill="#666" fontSize="10">{t('lab.p12alternatingcurrent_125v')}</text>
 <line x1="0" y1="250" x2="400" y2="250" stroke="#555" />
 <text x="5" y="265" fill="#666" fontSize="10">0V</text>
 <text x="360" y="265" fill="#666" fontSize="10">{t('lab.p12alternatingcurrent_100ms')}</text>
 
 {/* Raw full wave rectified */}
 <path d={`M ${rawPathPoints.join(' L ')}`} stroke="#3b82f6" fill="none" strokeWidth="2" opacity="0.4" strokeDasharray="4" />
 
 {/* Filtered output */}
 <path d={`M ${filterPathPoints.join(' L ')}`} stroke="#22c55e" fill="none" strokeWidth="3" />
 
 {/* Legend */}
 <rect x="230" y="10" width="160" height="40" fill="#1e293b" rx="4" />
 <line x1="240" y1="20" x2="260" y2="20" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" />
 <text x="270" y="24" fill="#cbd5e1" fontSize="10">{t('lab.p12alternatingcurrent_rectified_unfiltered')}</text>
 <line x1="240" y1="35" x2="260" y2="35" stroke="#22c55e" strokeWidth="3" />
 <text x="270" y="39" fill="#cbd5e1" fontSize="10">{t('lab.12alternatingcurrent_smootheddcoutput')}</text>
 </svg>
 );
 };

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans select-none overflow-hidden min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.p12alternatingcurrent_lab_p12_3_circuit_engineering_')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.p12alternatingcurrent_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.12alternatingcurrent_lab')}</button>
 </div>
 <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:overflow-visible">
 
 {/* Left Column: Theory */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center mb-4 text-orange-600">
 <Power className="w-6 h-6 mr-2" />
 <h2 className="text-lg font-bold">{t('lab.12alternatingcurrent_theory_andcontext')}</h2>
 </div>
 <div className={`text-slate-700 dark:text-[#ffffff] space-y-4 text-sm leading-relaxed lg:overflow-y-auto flex-1 pr-2 ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block`}>
 <p>
 
 {t('lab.p12alternatingcurrent_electronic_devices_like_laptop')} <strong>{t('lab.p12alternatingcurrent_direct_current_dc')}</strong>{t('lab.p12alternatingcurrent_but_the_power_grid_delivers')} <strong>{t('lab.p12alternatingcurrent_alternating_current_ac')}</strong>{t('lab.p12alternatingcurrent_converting_ac_to_dc_requires_s')}
 </p>
 
 <h3 className="font-bold text-orange-800">{t('lab.p12alternatingcurrent_1_rectification')}</h3>
 <p>
 A <em>{t('lab.12alternatingcurrent_fullwavebridgerectifier')}</em> {t('lab.p12alternatingcurrent_uses_four_diodes_to_flip_the_n')}
 </p>
 
 <h3 className="font-bold text-orange-800 mt-4">{t('lab.p12alternatingcurrent_2_capacitive_filtering')}</h3>
 <p>
 
 {t('lab.p12alternatingcurrent_to_smooth_out_the_pulses_we_ad')}
 </p>
 <div className={`bg-orange-50 p-3 rounded-lg border border-orange-100 flex-col `}>
 
 {t('lab.p12alternatingcurrent_the_remaining_fluctuation_is_c')} <strong>{t('lab.p12alternatingcurrent_ripple_voltage_v_r')}</strong>:
 <br /><br />
 <div className="font-mono text-center font-bold">
 
 {t('lab.p12alternatingcurrent_v_r_i_2_f_c')}
 </div>
 <div className="text-xs text-center mt-2">{t('lab.p12alternatingcurrent_assuming_full_wave_where_rippl')}</div>
 </div>
 <ul className="list-disc pl-5 space-y-1">
 <li><strong>{t('lab.12alternatingcurrent_f')}</strong> {t('lab.p12alternatingcurrent_ac_source_frequency_hz')}</li>
 <li><strong>{t('lab.12alternatingcurrent_c')}</strong> {t('lab.p12alternatingcurrent_filter_capacitance_f')}</li>
 <li><strong>{t('lab.12alternatingcurrent_i')}</strong> {t('lab.p12alternatingcurrent_load_current_a_v_peak_r')}</li>
 </ul>
 </div>
 </div>

 {/* Middle Column: Simulation */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex justify-between items-center mb-4">
 <div className="flex items-center text-orange-600">
 <Settings2 className="w-6 h-6 mr-2" />
 <h2 className="text-lg font-bold">{t('lab.12alternatingcurrent_interactiveoscilloscope')}</h2>
 </div>
 </div>

 <div className="h-64 mb-6 rounded-lg overflow-hidden border border-[#1c1b1b] dark:border-[#1c1b1b] relative">
 {renderSimulationSVG()}
 </div>

 <div className="flex-1 space-y-4">
 <div className={`space-y-4 bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className={`flex items-center justify-between bg-slate-50 dark:bg-[#121212] p-2 rounded border border-slate-200 dark:border-[#1c1b1b] shadow-sm flex-col `}>
 <span className="text-sm font-bold text-slate-700 dark:text-[#ffffff]">{t('lab.12alternatingcurrent_filtercapacitor')}</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input type="checkbox" className="sr-only peer" checked={filterEnabled} onChange={(e) => setFilterEnabled(e.target.checked)} />
 <div className="w-11 h-6 bg-slate-200 dark:bg-[#121212] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-50 dark:bg-[#121212] after:border-slate-300 dark:border-[#1c1b1b] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
 </label>
 </div>

 <div>
 <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 <span>{t('lab.12alternatingcurrent_acfrequency')}</span>
 <span className="text-orange-600 font-bold">{frequency} Hz</span>
 </label>
 <input type="range" min="10" max="100" step="10" value={frequency} onChange={(e) => setFrequency(Number(e.target.value))} className="w-full accent-orange-600" />
 </div>
 <div>
 <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 <span>{t('lab.12alternatingcurrent_peakvoltage')}</span>
 <span className="text-orange-600 font-bold">{peakVoltage} V</span>
 </label>
 <input type="range" min="10" max="200" step="10" value={peakVoltage} onChange={(e) => setPeakVoltage(Number(e.target.value))} className="w-full accent-orange-600" />
 </div>
 <div>
 <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 <span>{t('lab.12alternatingcurrent_filtercapacitance')}</span>
 <span className="text-orange-600 font-bold">{capacitance} μF</span>
 </label>
 <input type="range" min="10" max="2000" step="50" value={capacitance} onChange={(e) => setCapacitance(Number(e.target.value))} className="w-full accent-orange-600" disabled={!filterEnabled} />
 </div>
 <div>
 <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 <span>{t('lab.12alternatingcurrent_loadresistance')}</span>
 <span className="text-orange-600 font-bold">{loadResistance} Ω</span>
 </label>
 <input type="range" min="50" max="5000" step="50" value={loadResistance} onChange={(e) => setLoadResistance(Number(e.target.value))} className="w-full accent-orange-600" />
 </div>
 </div>
 </div>
 </div>

 {/* Right Column: Assessment & Data */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center justify-between mb-4 text-orange-600">
 <div className="flex items-center">
 <Database className="w-6 h-6 mr-2" />
 <h2 className="text-lg font-bold">{t('lab.12alternatingcurrent_datalog_andanalysis')}</h2>
 </div>
 <button onClick={handleRecord} className="px-3 py-1 bg-orange-100 text-orange-800 rounded hover:bg-orange-200 text-sm font-semibold transition-colors">
 
 {t('lab.p12alternatingcurrent_record_data')}
 </button>
 </div>

 <div className="max-h-40 lg:overflow-y-auto mb-6 border border-slate-200 dark:border-[#1c1b1b] rounded-lg">
 <table className="w-full text-sm text-left text-slate-600 dark:text-[#a1a1aa]">
 <thead className="text-xs text-slate-700 dark:text-[#ffffff] uppercase bg-slate-50 dark:bg-[#121212] sticky top-0">
 <tr>
 <th className="px-3 py-2">{t('lab.p12alternatingcurrent_freq_hz')}</th>
 <th className="px-3 py-2">{t('lab.p12alternatingcurrent_vp_v')}</th>
 <th className="px-3 py-2">{t('lab.p12alternatingcurrent_c_f')}</th>
 <th className="px-3 py-2">{t('lab.p12alternatingcurrent_r')}</th>
 <th className="px-3 py-2">{t('lab.12alternatingcurrent_filter')}</th>
 </tr>
 </thead>
 <tbody>
 {logs.length === 0 ? (
 <tr><td colSpan={5} className="px-3 py-4 text-center text-slate-400">{t('lab.12alternatingcurrent_nodatarecordedyet')}</td></tr>
 ) : (
 logs.map((log, i) => (
 <tr key={i} className="border-t border-slate-100">
 <td className="px-3 py-2 font-medium">{log.f}</td>
 <td className="px-3 py-2">{log.Vp}</td>
 <td className="px-3 py-2">{log.C}</td>
 <td className="px-3 py-2">{log.R}</td>
 <td className="px-3 py-2 font-bold text-orange-600">{log.filter}</td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>

 <div className={`flex-1 flex-col bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center mb-3 text-slate-800 dark:text-[#ffffff]">
 <Calculator className="w-5 h-5 mr-2 text-orange-600" />
 <h3 className="font-bold">{t('lab.12alternatingcurrent_q_title')}</h3>
 </div>
 
 <div className="space-y-4 flex-1">
 <div>
 <label className="block text-sm text-slate-700 dark:text-[#ffffff] mb-1">
 
 {t('lab.p12alternatingcurrent_1_in_a_full_wave_rectifier_wha')}
 </label>
 <input 
 type="text" 
 value={ans1} 
 onChange={e => setAns1(e.target.value)} 
 placeholder={t('lab.p12alternatingcurrent_t_lab_12alternatingcurrent_eg6')} 
 className="w-full border border-slate-300 dark:border-[#1c1b1b] rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
 />
 </div>
 
 <div>
 <label className="block text-sm text-slate-700 dark:text-[#ffffff] mb-1">
 
 {t('lab.p12alternatingcurrent_2_calculate_the_approximate_ri')} <em>{t('lab.p12alternatingcurrent_hint_use_the_formula_provided_')}</em>
 </label>
 <input 
 type="text" 
 value={ans2} 
 onChange={e => setAns2(e.target.value)} 
 placeholder={t('lab.p12alternatingcurrent_t_lab_12alternatingcurrent_eg5')} 
 className="w-full border border-slate-300 dark:border-[#1c1b1b] rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
 />
 </div>
 </div>

 {feedback && (
 <div className={`mt-4 p-3 rounded text-sm flex items-start ${feedback.includes('Spot on') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
 {feedback.includes('Spot on') ? <CheckCircle className="w-5 h-5 mr-2 shrink-0" /> : <XCircle className="w-5 h-5 mr-2 shrink-0" />}
 {feedback}
 </div>
 )}

 <button onClick={checkAnswers} className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-colors dark:text-white dark:text-white dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40">
 
 {t('lab.p12alternatingcurrent_check_answers')}
 </button>
 </div>

 </div>
 </div>
 </div>
 );
}
