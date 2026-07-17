import { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle, Activity, Zap, Lightbulb } from 'lucide-react';
import LabHeader from './LabHeader';
import { DIFFICULTY_CONFIGS } from '../utils/labScaffolding';
import { useTranslate } from "../i18n";

interface Props {
 onExit: () => void;
}

const ChemicalBottle = ({ label, color, onClick, selected }: { label: string, color: string, onClick: () => void, selected?: boolean }) => (
 <button onClick={onClick} className={`flex flex-col items-center p-2 bg-slate-50 dark:bg-[#121212] border-2 rounded shadow transition-colors ${selected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:bg-slate-50 dark:bg-[#121212]'}`}>
 <div className="relative w-10 h-16 border-2 border-gray-400 rounded-b-lg rounded-t-sm overflow-hidden flex items-end">
 <div className="w-full" style={{ height: '60%', backgroundColor: color }}></div>
 </div>
 <span className="text-xs font-bold mt-1 text-gray-700 dark:text-[#ffffff]">{label}</span>
 </button>
);

const EquationDisplay = ({ equation, t }: { equation: string[], t: any }) => (
 <div className="h-16 flex items-center justify-center bg-[#000000] dark:bg-[#121212] text-green-400 font-mono text-lg rounded px-4 shadow-inner mb-4 overflow-x-auto whitespace-nowrap">
 {equation.length === 0 ? <span className="text-gray-500">{t('lab.c9atomicstructure_awaiting_reaction')}</span> : 
 equation.map((part, i) => <span key={i} className="mx-1 animate-pulse">{part}</span>)
 }
 </div>
);

export default function LabC9AtomicStructure({ onExit }: Props) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const config = DIFFICULTY_CONFIGS['deep-dive'];

 const [activeTab] = useState<'alpha' | 'halogen'>('halogen');
 const [equation, setEquation] = useState<string[]>([]);
 
 // Halogen Displacement State
 const [selHalogen, setSelHalogen] = useState<string>(''); // F2, Cl2, Br2, I2
 const [selHalide, setSelHalide] = useState<string>(''); // NaCl, NaBr, NaI
 const [beakerColor, setBeakerColor] = useState<string>('rgba(200,200,200,0.1)');
 const [displacementData, setDisplacementData] = useState<Array<{id: number, halogen: string, halide: string, result: string}>>([]);

 // Alpha Decay State
 const [decaying, setDecaying] = useState<boolean>(false);
 const [u238Count, setU238Count] = useState<number>(100);
 const [th234Count, setTh234Count] = useState<number>(0);

 const [decayData, setDecayData] = useState<Array<{id: number, time: number, parent: number, daughter: number}>>([]);
 const [time, setTime] = useState<number>(0);

 // Assessment
 const [answer, setAnswer] = useState<string>('');
 const [feedback, setFeedback] = useState<string>('');

 // Halogen Logic
 const mixHalogens = () => {
 if (!selHalogen || !selHalide) return;
 const rank: Record<string, number> = { 'F': 4, 'Cl': 3, 'Br': 2, 'I': 1 };
 const h1 = selHalogen.replace('2', '');
 const h2 = selHalide.replace('Na', '');
 
 setEquation([`${selHalogen}(aq)`, '+', `2${selHalide}(aq)`]);
 
 setTimeout(() => {
 let resultStr = "No Reaction";
 if (rank[h1] > rank[h2]) {
 setEquation([`${selHalogen}(aq)`, '+', `2${selHalide}(aq)`, '→', `2Na${h1}(aq)`, '+', `${h2}2(aq)`]);
 const colors: Record<string, string> = { 'Cl': 'rgba(200,255,200,0.4)', 'Br': 'rgba(255,165,0,0.6)', 'I': 'rgba(139,69,19,0.8)' };
 setBeakerColor(colors[h2] || 'rgba(200,200,200,0.1)');
 resultStr = "Reaction Occurred";
 } else {
 setEquation([`${selHalogen}(aq)`, '+', `2${selHalide}(aq)`, '→', 'No Reaction']);
 setBeakerColor('rgba(200,200,200,0.1)');
 }
 setDisplacementData(prev => [...prev, { id: Date.now(), halogen: selHalogen, halide: selHalide, result: resultStr }]);
 }, 1500);
 };

 // Alpha Decay Logic
 useEffect(() => {
 if (activeTab !== 'alpha' || !decaying || u238Count === 0) return;
 const interval = setInterval(() => {
 setTime(t => t + 1);
 let decayedThisTick = 0;
 setU238Count(c => {
 for (let i = 0; i < c; i++) {
 if (Math.random() < 0.05) decayedThisTick++; // 5% chance per particle per tick
 }
 return Math.max(0, c - decayedThisTick);
 });
 if (decayedThisTick > 0) {
 setTh234Count(t => t + decayedThisTick);
 setEquation(['²³⁸U', '→', '²³⁴Th', '+', '⁴α']);
 }
 }, 500);
 return () => clearInterval(interval);
 }, [activeTab, decaying, u238Count]);

 useEffect(() => {
 if (activeTab === 'alpha' && decaying && time % 2 === 0) {
 setDecayData(prev => [...prev, { id: Date.now(), time, parent: u238Count, daughter: th234Count }]);
 }
 }, [time, activeTab, decaying, u238Count, th234Count]);

 const checkAnswer = () => {
 if (activeTab === 'halogen') {
 if (answer.trim().toUpperCase() === 'FLUORINE' || answer.trim().toUpperCase() === 'F' || answer.trim().toUpperCase() === 'F2') {
 setFeedback("Correct! Fluorine is the most reactive halogen and displaces the others.");
 } else {
 setFeedback("Incorrect. Look at the reactivity series for Group 7.");
 }
 } else {
 const val = parseInt(answer);
 if (val === 234) setFeedback("Correct! 238 - 4 = 234.");
 else setFeedback("Incorrect. Remember an alpha particle has a mass number of 4.");
 }
 };

 return (
 <div className="flex flex-col bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} variant="blue" title={t('lab.c9atomicstructure_grade_9_chemistry_atomic_struc')} />

 <div className="px-4 pt-2 lg:pt-0">
 
 </div>

 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.c9atomicstructure_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.c9atomicstructure_lab')}</button>
 </div>
 <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 flex-grow min-h-0 lg:overflow-hidden">
 {/* Theory Column */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-4 rounded-lg shadow-sm border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold mb-4 mt-2 flex items-center text-indigo-800 dark:text-[#ffffff]"><ClipboardList className="mr-2" /> {t('lab.c9atomicstructure_theory_setup')}</h2>
 {activeTab === 'halogen' ? (
 <div className="space-y-4 text-slate-700 dark:text-[#ffffff]">
 <p><strong>{t('lab.c9atomicstructure_halogen_displacement')}</strong> {t('lab.c9atomicstructure_group_7_elements_halogens_beco')}</p>
 <ul className={`list-disc pl-5 font-mono text-sm bg-slate-50 dark:bg-[#121212] p-2 rounded flex-col `}>
 <li>{t('lab.c9atomicstructure_f_pale_yellow')}</li>
 <li>{t('lab.c9atomicstructure_cl_pale_green')}</li>
 <li>{t('lab.c9atomicstructure_br_orange')}</li>
 <li>{t('lab.c9atomicstructure_i_brown')}</li>
 </ul>
 <p><strong>{t('lab.c9atomicstructure_experiment')}</strong> {t('lab.c9atomicstructure_select_a_halogen_water_and_a_h')}</p>
 </div>
 ) : (
 <div className="space-y-4 text-slate-700 dark:text-[#ffffff]">
 <p><strong>{t('lab.c9atomicstructure_alpha_decay')}</strong> {t('lab.c9atomicstructure_unstable_heavy_nuclei_can_achi')}</p>
 <p>{t('lab.c9atomicstructure_this_changes_the_atomic_number')}</p>
 <p><strong>{t('lab.c9atomicstructure_experiment')}</strong> {t('lab.c9atomicstructure_observe_a_sample_of_uranium_23')}</p>
 </div>
 )}
 </div>

 {/* Simulation Column */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] p-4 rounded-lg shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col items-center '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 {config.showHints && (
 <div className="w-full mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex gap-2 text-sm text-blue-700 dark:text-blue-300">
 <Lightbulb className="w-4 h-4 mt-0.5 shrink-0" />
 <span><strong>{t('lab.c9atomicstructure_hint')}</strong> {t('lab.c9atomicstructure_in_displacement_reactions_a_mo')}</span>
 </div>
 )}
 <h2 className="text-xl font-bold mb-4 flex items-center text-indigo-800 w-full dark:text-[#ffffff]"><Activity className="mr-2" /> {t('lab.c9atomicstructure_interactive_simulator')}</h2>
 
 <EquationDisplay equation={equation} t={t} />

 {activeTab === 'halogen' ? (
 <div className="flex flex-col w-full items-center">
 <div className="flex gap-8 mb-6">
 <div>
 <div className="text-sm font-bold text-gray-500 mb-2 text-center">{t('lab.c9atomicstructure_halogen_waters')}</div>
 <div className="flex gap-2">
 <ChemicalBottle label={t("F₂")} color="#ffffcc" selected={selHalogen === 'F2'} onClick={() => setSelHalogen('F2')} />
 <ChemicalBottle label={t('lab.c9atomicstructure_cl')} color="#ccffcc" selected={selHalogen === 'Cl2'} onClick={() => setSelHalogen('Cl2')} />
 <ChemicalBottle label={t('lab.c9atomicstructure_br')} color="#ffcc99" selected={selHalogen === 'Br2'} onClick={() => setSelHalogen('Br2')} />
 <ChemicalBottle label={t("I₂")} color="#e6ccff" selected={selHalogen === 'I2'} onClick={() => setSelHalogen('I2')} />
 </div>
 </div>
 <div>
 <div className="text-sm font-bold text-gray-500 mb-2 text-center">{t('lab.c9atomicstructure_halide_salts')}</div>
 <div className="flex gap-2">
 <ChemicalBottle label={t('lab.c9atomicstructure_nacl')} color="#f0f0f0" selected={selHalide === 'NaCl'} onClick={() => setSelHalide('NaCl')} />
 <ChemicalBottle label={t('lab.c9atomicstructure_nabr')} color="#f0f0f0" selected={selHalide === 'NaBr'} onClick={() => setSelHalide('NaBr')} />
 <ChemicalBottle label={t('lab.c9atomicstructure_nai')} color="#f0f0f0" selected={selHalide === 'NaI'} onClick={() => setSelHalide('NaI')} />
 </div>
 </div>
 </div>

 <div className="relative w-48 h-56 border-4 border-gray-300 rounded-b-3xl rounded-t-sm flex items-end justify-center bg-slate-50 dark:bg-[#121212] overflow-hidden shadow-inner mb-6">
 <div className="w-full transition-colors duration-1000" style={{ height: '70%', backgroundColor: beakerColor }}></div>
 </div>

 <button onClick={mixHalogens} disabled={!selHalogen || !selHalide} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700 disabled:opacity-50 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
 
 {t('lab.c9atomicstructure_mix_chemicals')}
 </button>
 </div>
 ) : (
 <div className="flex flex-col w-full items-center">
 <div className="relative w-64 h-64 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-slate-50 dark:bg-[#121212] overflow-hidden mb-6">
 {/* Nucleus visualizer */}
 <div className="text-center z-10 bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212]/80 p-2 rounded font-bold text-indigo-900 border border-indigo-200 dark:text-[#ffffff] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
 
 {t('lab.c9atomicstructure_parent')} {u238Count} <br/> {t('lab.c9atomicstructure_daughter')} {th234Count}
 </div>
 {/* Abstract representation of radiation */}
 {decaying && <Zap className="absolute text-yellow-400 opacity-50 animate-ping" size={100} />}
 </div>

 <div className="flex gap-4">
 <button onClick={() => setDecaying(true)} disabled={decaying || u238Count === 0} className="px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 disabled:opacity-50 dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">{t('lab.c9atomicstructure_start_decay')}</button>
 <button onClick={() => setDecaying(false)} disabled={!decaying} className="px-6 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40">{t('lab.c9atomicstructure_pause_decay')}</button>
 </div>
 </div>
 )}
 </div>

 {/* Data & Assessment Column */}
 <div className={`bg-slate-50 dark:!bg-[#121212] p-4 rounded-lg shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold mb-4 flex items-center text-indigo-800 dark:text-[#ffffff]"><CheckCircle className="mr-2" /> {t('lab.c9atomicstructure_data_analysis')}</h2>
 
 <div className="flex-grow lg:overflow-y-auto mb-4 border rounded overflow-x-auto">
 {activeTab === 'halogen' ? (
 <table className="w-full text-sm text-left">
 <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0">
 <tr><th className="p-2">{t('lab.c9atomicstructure_halogen')}</th><th className="p-2">{t('lab.c9atomicstructure_halide')}</th><th className="p-2">{t('lab.c9atomicstructure_result')}</th></tr>
 </thead>
 <tbody>
 {displacementData.map(d => (
 <tr key={d.id} className="border-t"><td className="p-2">{d.halogen}</td><td className="p-2">{d.halide}</td><td className={`p-2 font-bold ${d.result === 'No Reaction' ? 'text-gray-500' : 'text-green-600'}`}>{d.result}</td></tr>
 ))}
 </tbody>
 </table>
 ) : (
 <table className="w-full text-sm text-left">
 <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0">
 <tr><th className="p-2">{t('lab.c9atomicstructure_time_s')}</th><th className="p-2">{t('lab.c9atomicstructure_parent_u_238')}</th><th className="p-2">{t('lab.c9atomicstructure_daughter_th_234')}</th></tr>
 </thead>
 <tbody>
 {decayData.map(d => (
 <tr key={d.id} className="border-t"><td className="p-2">{d.time}</td><td className="p-2 text-red-600">{d.parent}</td><td className="p-2 text-blue-600">{d.daughter}</td></tr>
 ))}
 </tbody>
 </table>
 )}
 </div>

 <div className="bg-indigo-50 p-4 rounded border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b]">
 <h3 className="font-bold text-indigo-900 mb-2 dark:text-[#ffffff]">{t('lab.c9atomicstructure_assessment')}</h3>
 <p className="text-sm text-slate-700 dark:text-[#ffffff] mb-2">
 {activeTab === 'halogen' 
 ? "Based on your mixing data, which halogen is the most reactive and capable of displacing all others?" 
 : "What is the mass number of the resulting Thorium isotope after U-238 emits an alpha particle?"}
 </p>
 <div className="flex gap-2">
 <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder={t('lab.c9atomicstructure_enter_answer')} className="flex-grow p-2 border rounded" />
 <button onClick={checkAnswer} className="px-4 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">{t('lab.c9atomicstructure_check')}</button>
 </div>
 {feedback && <div className={`mt-2 text-sm font-bold ${feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'}`}>{feedback}</div>}
 </div>
 </div>
 </div>
 </div>
 );
}
