import { useState, useMemo } from 'react';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from '../i18n';
import { useLab } from '../store';

interface LabProps { onExit?: () => void; }

export default function LabP10RadioTransmission({ onExit }: LabProps) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [fS, setFs] = useState<number>(2); // Signal Frequency (kHz)
 const [aS, setAs] = useState<number>(2); // Signal Amplitude (V)
 
 const fC = 50; // Fixed Carrier Frequency (kHz)
 const aC = 5; // Fixed Carrier Amplitude (V)
 
 const [data, setData] = useState<{ id: number; aS: number; vMax: number; vMin: number }[]>([]);
 const [answer, setAnswer] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const displayedVmax = useMemo(() => aC + aS + (Math.random() - 0.5) * 0.1, [aS, aC]);

 const handleRecord = () => {
 const noiseMax = (Math.random() - 0.5) * 0.2;
 const noiseMin = (Math.random() - 0.5) * 0.2;
 
 const vMax = aC + aS + noiseMax;
 const vMin = aC - aS + noiseMin;

 setData([...data, { 
 id: Date.now(), 
 aS: parseFloat(aS.toFixed(2)), 
 vMax: parseFloat(vMax.toFixed(2)), 
 vMin: parseFloat(vMin.toFixed(2))
 }]);
 };

 const handleCheck = () => {
 const val = parseFloat(answer);
 if (Math.abs(val - aC) < 0.2) setIsCorrect(true);
 else setIsCorrect(false);
 };

 const points = useMemo(() => {
 let str = "";
 for(let i=0; i<=500; i++) {
 const t = (i / 500) * 2; 
 const v = (aC + aS * Math.cos(2 * Math.PI * fS * t)) * Math.cos(2 * Math.PI * fC * t);
 const x = (i / 500) * 100;
 const y = 50 - (v / 15) * 40;
 str += `${x},${y} `;
 }
 return str;
 }, [fS, aS]);

 const envelopePoints1 = useMemo(() => {
 let str = "";
 for(let i=0; i<=100; i++) {
 const t = (i / 100) * 2; 
 const env = aC + aS * Math.cos(2 * Math.PI * fS * t);
 const x = (i / 100) * 100;
 const y = 50 - (env / 15) * 40;
 str += `${x},${y} `;
 }
 return str;
 }, [fS, aS]);

 const envelopePoints2 = useMemo(() => {
 let str = "";
 for(let i=0; i<=100; i++) {
 const t = (i / 100) * 2; 
 const env = -(aC + aS * Math.cos(2 * Math.PI * fS * t));
 const x = (i / 100) * 100;
 const y = 50 - (env / 15) * 40;
 str += `${x},${y} `;
 }
 return str;
 }, [fS, aS]);

 const n = data.length;
 const sumX = data.reduce((acc, d) => acc + d.aS, 0);
 const sumY = data.reduce((acc, d) => acc + d.vMax, 0);
 const sumXY = data.reduce((acc, d) => acc + d.aS * d.vMax, 0);
 const sumXX = data.reduce((acc, d) => acc + d.aS * d.aS, 0);
 const denom = n * sumXX - sumX * sumX;
 const slope = n > 1 && denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
 const intercept = n > 1 && denom !== 0 ? (sumY - slope * sumX) / n : 0;

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.p10radiotransmission_unit_19_amplitude_modulation')} subtitle={t('lab.subtitle_analyze_carrier_wave')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.p10radiotransmission_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.10radiotransmission_lab')}</button>
 </div>
 <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg:overflow-visible">
 {/* Left Column: Theory & Setup */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col gap-6 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex mb-4' : 'hidden'} lg:flex lg:order-none`}>
 <div className={`${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.10radiotransmission_theory')}</h2>
 <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">{t('lab.p10radiotransmission_in_amplitude_modulation_am_the')}</p>
 <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">{t('lab.10radiotransmission_themodulatedvoltageisgivenby')}</p>
 <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded-lg text-center font-mono text-sm mb-4 border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
 
 {t('lab.p10radiotransmission_v_t_a_c_a_s_cos_2_f_s_t_cos_2_')}
 </div>
 <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">{t('lab.10radiotransmission_themaximumpeakvoltageoftheresulting')}<strong>{t('lab.10radiotransmission_a_ca_s')}</strong>.</p>
 </div>

 <div>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.10radiotransmission_setup')}</h2>
 <div className="mb-4">
 <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.p10radiotransmission_signal_amplitude_a_s')} {aS.toFixed(1)} V</label>
 <input type="range" min="0" max="5" step="0.5" value={aS} onChange={(e) => setAs(parseFloat(e.target.value))} className="w-full accent-blue-600" />
 </div>
 <div className="mb-4">
 <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.p10radiotransmission_signal_frequency_f_s')} {fS.toFixed(1)} {t('lab.p10radiotransmission_khz')}</label>
 <input type="range" min="1" max="5" step="0.5" value={fS} onChange={(e) => setFs(parseFloat(e.target.value))} className="w-full accent-blue-600" />
 </div>
 <div className={`p-3 bg-slate-100 dark:bg-[#121212] rounded text-sm text-slate-600 dark:text-[#a1a1aa] border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
 <p>{t('lab.p10radiotransmission_carrier_frequency_f_c_is_fixed')}</p>
 <p>{t('lab.p10radiotransmission_carrier_amplitude_a_c_is_const')}</p>
 </div>
 </div>
 </div>

 {/* Center Column: Simulation */}
 <div className={`w-full bg-[#000000] dark:!bg-[#121212] rounded-xl shadow-sm border border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex flex-col items-center justify-center relative 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
 <div className={`w-full h-64 bg-[#121212] dark:bg-[#121212] border-4 border-[#1c1b1b] dark:border-[#1c1b1b] rounded-lg shadow-inner relative flex items-center justify-center flex-col `}>
 <div className="absolute top-2 left-2 text-green-500 font-mono text-xs">{t('lab.10radiotransmission_oscilloscope')}</div>
 
 <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
 {Array.from({length: 10}).map((_, i) => (
 <line key={`h${i}`} x1="0" y1={i*10} x2="100" y2={i*10} stroke="#22c55e" strokeWidth="0.5" />
 ))}
 {Array.from({length: 10}).map((_, i) => (
 <line key={`v${i}`} x1={i*10} y1="0" x2={i*10} y2="100" stroke="#22c55e" strokeWidth="0.5" />
 ))}
 <line x1="0" y1="50" x2="100" y2="50" stroke="#22c55e" strokeWidth="1" />
 </svg>

 <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
 <polyline points={envelopePoints1} fill="none" stroke="#6b7280" strokeWidth="0.5" strokeDasharray="2" />
 <polyline points={envelopePoints2} fill="none" stroke="#6b7280" strokeWidth="0.5" strokeDasharray="2" />
 <polyline points={points} fill="none" stroke="#22c55e" strokeWidth="0.5" />
 </svg>
 </div>
 
 <div className="mt-8 flex gap-8 w-full justify-between items-center">
 <div className={`flex-1 bg-[#121212] dark:bg-[#121212] rounded p-4 border border-[#1c1b1b] dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block`}>
 <div className="text-slate-400 text-xs mb-1">{t('lab.p10radiotransmission_v_max_peak_readout')}</div>
 <div className="text-green-400 font-mono text-xl">{displayedVmax.toFixed(2)} V</div>
 </div>
 <button onClick={handleRecord} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md font-sans font-bold shadow-lg active:scale-95 transition-all dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">{t('lab.10radiotransmission_record_btn')}</button>
 </div>
 </div>

 {/* Right Column: Analysis */}
 <div className="bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
 <div className="p-4 border-b bg-slate-50 dark:bg-[#121212]">
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.10radiotransmission_data_andanalysis')}</h2>
 </div>
 
 <div className="p-4 flex-1 lg:overflow-y-auto">
 <div className="mb-6">
 <div className="flex justify-between items-center mb-2">
 <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] text-sm">{t('lab.10radiotransmission_measurements')}</h3>
 <button onClick={() => setData([])} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
 </div>
 <div className="max-h-40 lg:overflow-y-auto border border-slate-200 dark:border-[#1c1b1b] rounded">
 <table className="w-full text-sm text-center">
 <thead className="bg-slate-100 dark:bg-[#121212] sticky top-0">
 <tr>
 <th className="py-2 border-b">{t('lab.p10radiotransmission_a_s_v')}</th>
 <th className="py-2 border-b">{t('lab.p10radiotransmission_v_max_v')}</th>
 <th className="py-2 border-b">{t('lab.p10radiotransmission_v_min_v')}</th>
 </tr>
 </thead>
 <tbody>
 {data.length === 0 ? (
 <tr><td colSpan={3} className="py-4 text-slate-400 italic">{t('lab.10radiotransmission_nodatarecorded')}</td></tr>
 ) : (
 data.map(d => (
 <tr key={d.id} className="border-b last:border-0 hover:bg-slate-50 dark:bg-[#121212]">
 <td className="py-1">{d.aS}</td>
 <td className="py-1">{d.vMax}</td>
 <td className="py-1">{d.vMin}</td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>

 <div className="mb-6">
 <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] text-sm mb-2">{t('lab.10radiotransmission_graphv_maxvsa_s')}</h3>
 <div className="w-full aspect-video bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded relative">
 <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible p-4">
 <line x1="10" y1="90" x2="90" y2="90" stroke="#94a3b8" strokeWidth="1" />
 <line x1="10" y1="90" x2="10" y2="10" stroke="#94a3b8" strokeWidth="1" />
 {data.map(d => {
 const cx = 10 + (d.aS / 5) * 80;
 const cy = 90 - (d.vMax / 15) * 80;
 return <circle key={d.id} cx={cx} cy={cy} r="1.5" fill="#2563eb" />;
 })}
 {n > 1 && (
 <line x1={10} y1={90 - (intercept / 15) * 80} x2={90} y2={90 - ((slope * 5 + intercept) / 15) * 80} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2" />
 )}
 </svg>
 <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 dark:text-[#71717a]">{t('lab.p10radiotransmission_a_s_v')}</div>
 <div className="absolute top-1/2 -left-2 -translate-y-1/2 -rotate-90 text-[10px] text-slate-500 dark:text-[#71717a]">{t('lab.p10radiotransmission_v_max_v')}</div>
 </div>
 {n > 1 && (
 <div className="text-xs text-slate-500 dark:text-[#71717a] mt-2 text-center">
 
 {t('lab.p10radiotransmission_y_intercept')} {intercept.toFixed(2)} V
 </div>
 )}
 </div>

 <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900">
 <h3 className="font-semibold text-blue-800 text-sm mb-2 dark:text-[#ffffff]">{t('lab.10radiotransmission_analysis')}</h3>
 <p className="text-xs text-blue-700 mb-3">
 
 {t('lab.p10radiotransmission_since_v_max_a_c_a_s_the_y_inte')}
 </p>
 <div className="flex gap-2 items-center">
 <input type="number" step="0.1" value={answer} onChange={(e) => { setAnswer(e.target.value); setIsCorrect(null); }} placeholder={t('lab.p10radiotransmission_t_lab_10radiotransmission_eg50')} className="w-24 px-2 py-1 border rounded text-sm" />
 <span className="text-xs text-slate-600 dark:text-[#a1a1aa] font-mono">V</span>
 <button onClick={handleCheck} className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">{t('lab.10radiotransmission_check')}</button>
 </div>
 {isCorrect === true && <div className="mt-2 text-green-600 text-xs font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4"/>{t('lab.10radiotransmission_correct')}</div>}
 {isCorrect === false && <div className="mt-2 text-red-600 text-xs font-bold flex items-center gap-1"><XCircle className="w-4 h-4"/>{t('lab.10radiotransmission_incorrectcheckyouryintercept')}</div>}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
