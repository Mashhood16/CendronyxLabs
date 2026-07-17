import { useState } from 'react';
import {Droplets, Activity, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

export default function LabC12EquilibriumAcidBase({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [baseVol, setBaseVol] = useState<number>(0);
 const acidVol = 25; 
 const acidConc = 0.1; 
 const baseConc = 0.1; 
 const pKa = 4.76; 
 const Ka = Math.pow(10, -pKa);
 const Kw = 1e-14;

 const [graphData, setGraphData] = useState<{v: number, ph: number}[]>([]);
 const [ansPH, setAnsPH] = useState<string>('');
 const [feedback, setFeedback] = useState<string>('');

 const calculatePH = (v: number) => {
 const molesAcid = acidVol * acidConc;
 const molesBase = v * baseConc;
 const totalVol = acidVol + v;
 let ph = 0;
 
 if (v === 0) {
 ph = -Math.log10(Math.sqrt(Ka * acidConc));
 } else if (molesBase < molesAcid) {
 const remainingAcid = molesAcid - molesBase;
 ph = pKa + Math.log10(molesBase / remainingAcid);
 } else if (Math.abs(molesBase - molesAcid) < 1e-5) {
 const concA = molesAcid / totalVol;
 const Kb = Kw / Ka;
 const concOH = Math.sqrt(Kb * concA);
 ph = 14 - (-Math.log10(concOH));
 } else {
 const excessBase = molesBase - molesAcid;
 const concOH = excessBase / totalVol;
 ph = 14 - (-Math.log10(concOH));
 }
 
 if (ph < 0) ph = 0;
 if (ph > 14) ph = 14;
 return ph;
 };

 const handleAddDrop = (amount: number) => {
 let newVol = baseVol + amount;
 if (newVol > 50) newVol = 50;
 if (newVol < 0) newVol = 0;
 const noise = (Math.random() - 0.5) * 0.05;
 setBaseVol(newVol);
 setGraphData(prev => [...prev, { v: newVol, ph: calculatePH(newVol) + noise }]);
 };
 
 const resetTitration = () => {
 setBaseVol(0);
 setGraphData([]);
 setFeedback('');
 setAnsPH('');
 };

 const checkAnswer = () => {
 const val = parseFloat(ansPH);
 const expected = pKa; 
 if (!isNaN(val) && Math.abs(val - expected) < 0.15) {
 setFeedback('Correct! At half-equivalence point (12.5 mL base added), pH = pKa.');
 } else {
 setFeedback('Incorrect. Hint: Look at the pH exactly halfway to the equivalence point.');
 }
 };

 const currentPh = baseVol > 0 ? (graphData[graphData.length - 1]?.ph || calculatePH(0)) : calculatePH(0);
 const color = currentPh > 8.2 ? (currentPh > 10 ? '#f472b6' : '#fbcfe8') : '#f8fafc';

 return (
 <div className="flex flex-col bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.c12equilibriumacidbase_virtual_lab_equilibrium_acid_b')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.c12equilibriumacidbase_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.c12equilibriumacidbase_lab')}</button>
 </div>
 <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 min-h-0 lg:overflow-hidden">
 <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 lg:overflow-y-auto border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center dark:text-[#ffffff]">
 <Droplets className="mr-2" /> {t('lab.c12equilibriumacidbase_theory')}
 </h2>
 <div className="prose text-sm text-slate-700 dark:text-[#ffffff]">
 <p><strong>{t('lab.c12equilibriumacidbase_titrations')}</strong> {t('lab.c12equilibriumacidbase_determine_the_concentration_of')}</p>
 <h3 className="text-md font-semibold mt-4">{t('lab.c12equilibriumacidbase_henderson_hasselbalch_equation')}</h3>
 <p>{t('lab.c12equilibriumacidbase_used_for_buffer_regions_like_b')}</p>
 <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded text-center font-mono my-2 flex-col `}>
 
 {t('lab.c12equilibriumacidbase_ph_pka_log_a_ha')}
 </div>
 <p>{t('lab.c12equilibriumacidbase_at_the')} <strong>{t('lab.c12equilibriumacidbase_half_equivalence_point')}</strong>{t('lab.c12equilibriumacidbase_a_ha_so')} <strong>{t('lab.c12equilibriumacidbase_ph_pka')}</strong>.</p>
 
 <h3 className="text-md font-semibold mt-4">{t('lab.c12equilibriumacidbase_partition_coefficients')}</h3>
 <p>{t('lab.c12equilibriumacidbase_in_equilibrium_solutes_partiti')}</p>
 
 <h3 className="text-md font-semibold mt-4">{t('lab.c12equilibriumacidbase_current_experiment')}</h3>
 <ul className="list-disc pl-5">
 <li>{t('lab.c12equilibriumacidbase_flask_25_0_ml_of_0_1_m_weak_ac')}</li>
 <li>{t('lab.c12equilibriumacidbase_burette_0_1_m_strong_base_naoh')}</li>
 <li>{t('lab.c12equilibriumacidbase_indicator_phenolphthalein_colo')}</li>
 </ul>
 </div>
 </div>

 <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex-col items-center border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold text-indigo-900 mb-4 dark:text-[#ffffff]">{t('lab.c12equilibriumacidbase_titration_simulator')}</h2>
 
 <div className="flex flex-col items-center w-full max-w-sm mb-4">
 <div className={`bg-slate-100 dark:bg-[#121212] px-4 py-2 rounded-lg font-mono text-lg font-bold border border-slate-300 dark:border-[#1c1b1b] text-slate-800 dark:text-[#ffffff] mb-4 w-full text-center shadow-inner flex-col `}>
 
 {t('lab.c12equilibriumacidbase_ph_meter')} {currentPh.toFixed(2)}
 </div>

 <div className={`relative w-full aspect-square bg-slate-50 dark:bg-[#121212] border rounded-xl flex flex-col items-center justify-end pb-8 `}>
 {/* Burette tip */}
 <div className="w-4 h-16 bg-slate-200 dark:bg-[#121212] absolute top-0 border-x-2 border-b-2 border-slate-400 dark:border-[#1c1b1b] rounded-b-sm ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block"></div>
 {/* Drop animation (static representation) */}
 <div className={`w-full w-2 h-2 rounded-full bg-blue-300 absolute top-16 animate-bounce 'block' : 'hidden'} lg:block order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}></div>
 
 {/* Flask */}
 <svg width="120" height="140" viewBox="0 0 120 140" className="z-10">
 <path d="M 50 10 L 50 50 L 20 120 Q 15 130 30 130 L 90 130 Q 105 130 100 120 L 70 50 L 70 10" stroke="#94a3b8" strokeWidth="4" fill="rgba(255,255,255,0.5)" />
 {/* Liquid level */}
 <path d="M 32 90 L 88 90 L 96 110 Q 105 130 90 130 L 30 130 Q 15 130 24 110 Z" fill={color} opacity="0.8" />
 </svg>
 </div>
 </div>
 
 <div className="w-full flex flex-col space-y-3">
 <div className="flex justify-between items-center text-sm font-mono bg-slate-100 dark:bg-[#121212] p-2 rounded">
 <span>{t('lab.c12equilibriumacidbase_base_added')}</span>
 <span className="font-bold text-indigo-700">{baseVol.toFixed(1)} mL</span>
 </div>
 <div className="flex gap-2">
 <button onClick={() => handleAddDrop(1)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">{t('lab.c12equilibriumacidbase_1_ml')}</button>
 <button onClick={() => handleAddDrop(5)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">{t('lab.c12equilibriumacidbase_5_ml')}</button>
 <button onClick={resetTitration} className="flex-1 bg-slate-300 dark:bg-[#121212] hover:bg-slate-400 dark:bg-[#121212] text-slate-800 dark:text-[#ffffff] font-semibold py-2 rounded">{t('lab.c12equilibriumacidbase_reset')}</button>
 </div>
 </div>
 </div>

 <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col lg:overflow-y-auto ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center dark:text-[#ffffff]">
 <Activity className="mr-2" /> {t('lab.c12equilibriumacidbase_data_plot_analysis')}
 </h2>
 
 <div className="relative w-full flex-1 min-h-[200px] mb-4 bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded-lg p-2">
 <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
 {/* Gridlines */}
 <line x1="0" y1="50" x2="100" y2="50" stroke="#e2e8f0" strokeWidth="0.5" />
 <line x1="50" y1="0" x2="50" y2="100" stroke="#e2e8f0" strokeWidth="0.5" />
 <text x="50" y="98" fontSize="4" textAnchor="middle" fill="#64748b">{t('lab.c12equilibriumacidbase_25_ml')}</text>
 <text x="98" y="98" fontSize="4" textAnchor="end" fill="#64748b">{t('lab.c12equilibriumacidbase_50_ml')}</text>
 <text x="2" y="5" fontSize="4" fill="#64748b">{t('lab.c12equilibriumacidbase_ph_14')}</text>
 <text x="2" y="52" fontSize="4" fill="#64748b">{t('lab.c12equilibriumacidbase_ph_7')}</text>
 
 {/* Points */}
 {graphData.map((d, i) => {
 const cx = (d.v / 50) * 100;
 const cy = 100 - ((d.ph / 14) * 100);
 return <circle key={i} cx={cx} cy={cy} r="1.5" fill="#4158D1" />;
 })}
 </svg>
 </div>
 
 <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 dark:bg-[#121212] lg:dark:bg-[#121212] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
 <h3 className="font-semibold text-indigo-900 mb-2 dark:text-[#ffffff]">{t('lab.c12equilibriumacidbase_unknown_identification')}</h3>
 <p className="text-sm text-indigo-800 mb-3 dark:text-[#ffffff]">
 
 {t('lab.c12equilibriumacidbase_observe_the_ph_curve_estimate_')}
 </p>
 <input 
 type="text" 
 placeholder={t('lab.c12equilibriumacidbase_enter_pka_value')} 
 value={ansPH}
 onChange={e => setAnsPH(e.target.value)}
 className="w-full p-2 border border-indigo-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
 />
 <button 
 onClick={checkAnswer}
 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition-colors flex items-center justify-center dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
 >
 <CheckCircle className="mr-2" size={18} /> {t('lab.c12equilibriumacidbase_check_answer')}
 </button>
 {feedback && (
 <p className={`mt-3 text-sm font-semibold p-2 rounded ${feedback.includes('Correct') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
 {feedback}
 </p>
 )}
 </div>
 </div>
 </div>
 </div>
 );
}
