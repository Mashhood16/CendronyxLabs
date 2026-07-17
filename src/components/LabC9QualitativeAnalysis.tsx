import { useState, useEffect } from 'react';
import { CheckCircle, BookOpen, RotateCcw } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

type BottleId = 'zn' | 'caco3' | 'h2o2' | 'mno2' | 'hcl' | 'cu' | 'na' | 'k';

interface Bottle {
 id: BottleId;
 label: string;
 formula: string;
 type: 'solid' | 'liquid';
 color: string;
}

const GAS_BOTTLES: Bottle[] = [
 { id: 'zn', label: 'Zinc Granules', formula: 'Zn(s)', type: 'solid', color: '#94a3b8' },
 { id: 'caco3', label: 'Marble Chips', formula: 'CaCO3(s)', type: 'solid', color: '#f8fafc' },
 { id: 'h2o2', label: 'Hydrogen Peroxide', formula: 'H2O2(aq)', type: 'liquid', color: '#e0f2fe' },
 { id: 'mno2', label: 'MnO2 Catalyst', formula: 'MnO2(s)', type: 'solid', color: '#1e293b' },
 { id: 'hcl', label: 'Hydrochloric Acid', formula: 'HCl(aq)', type: 'liquid', color: '#f1f5f9' },
];

const FLAME_BOTTLES: Bottle[] = [
 { id: 'cu', label: 'Copper(II) Ion', formula: 'Cu²⁺', type: 'solid', color: '#059669' },
 { id: 'na', label: 'Sodium Ion', formula: 'Na⁺', type: 'solid', color: '#ffffff' },
 { id: 'k', label: 'Potassium Ion', formula: 'K⁺', type: 'solid', color: '#f1f5f9' },
];

interface Props {
 onExit?: () => void;
}

export default function LabC9QualitativeAnalysis({ onExit }: Props) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [activeTab, setActiveTab] = useState<'gas' | 'flame'>('gas');

 // Gas Test State
 const [flaskContents, setFlaskContents] = useState<BottleId[]>([]);
 const [reactionGas, setReactionGas] = useState<'H2' | 'O2' | 'CO2' | null>(null);
 const [reactionEquation, setReactionEquation] = useState<string>('');
 const [testResult, setTestResult] = useState<string | null>(null);

 // Flame Test State
 const [wireLoop, setWireLoop] = useState<BottleId | null>(null);
 const [flameColor, setFlameColor] = useState<string>('#38bdf8'); // default blue bunsen flame

 // Real-time Equation & Reactions Logic
 useEffect(() => {
 if (flaskContents.includes('zn') && flaskContents.includes('hcl')) {
 setReactionGas('H2');
 setReactionEquation('Zn(s) + 2HCl(aq) ➔ ZnCl2(aq) + H2(g) ↑');
 } else if (flaskContents.includes('caco3') && flaskContents.includes('hcl')) {
 setReactionGas('CO2');
 setReactionEquation('CaCO3(s) + 2HCl(aq) ➔ CaCl2(aq) + H2O(l) + CO2(g) ↑');
 } else if (flaskContents.includes('h2o2') && flaskContents.includes('mno2')) {
 setReactionGas('O2');
 setReactionEquation('2H2O2(aq) ➔ 2H2O(l) + O2(g) ↑ [MnO2 catalyst]');
 } else {
 setReactionGas(null);
 // Dynamically build partial equation as user adds bottles
 const parts = flaskContents.map(id => GAS_BOTTLES.find(b => b.id === id)?.formula).filter(Boolean);
 if (parts.length > 0) {
 setReactionEquation(parts.join(' + ') + ' ➔ ...');
 } else {
 setReactionEquation('');
 }
 }
 setTestResult(null);
 }, [flaskContents]);

 // Gas Test Actions
 const addToFlask = (id: BottleId) => {
 if (!flaskContents.includes(id) && flaskContents.length < 3) {
 setFlaskContents([...flaskContents, id]);
 }
 };

 const performGasTest = (testType: 'lit_splint' | 'glowing_splint' | 'limewater') => {
 if (!reactionGas) {
 setTestResult('No reaction happening, or no gas produced.');
 return;
 }
 if (testType === 'lit_splint' && reactionGas === 'H2') {
 setTestResult('💥 POP! (Squeaky pop sound - Hydrogen gas confirmed)');
 } else if (testType === 'glowing_splint' && reactionGas === 'O2') {
 setTestResult('🔥 Splint relights! (Oxygen gas confirmed)');
 } else if (testType === 'limewater' && reactionGas === 'CO2') {
 setTestResult('☁️ Limewater turns milky/cloudy. (Carbon Dioxide confirmed)');
 } else {
 setTestResult('Negative result. Nothing happens.');
 }
 };

 const resetFlask = () => {
 setFlaskContents([]);
 };

 // Flame Test Actions
 const dipWire = (id: BottleId) => {
 setWireLoop(id);
 setFlameColor('#38bdf8'); // reset to blue until put in flame
 };

 const putInFlame = () => {
 if (!wireLoop) return;
 if (wireLoop === 'cu') setFlameColor('#10b981'); // blue-green
 else if (wireLoop === 'na') setFlameColor('#f59e0b'); // yellow-orange
 else if (wireLoop === 'k') setFlameColor('#d946ef'); // lilac
 else setFlameColor('#38bdf8');
 };

 const cleanWire = () => {
 setWireLoop(null);
 setFlameColor('#38bdf8');
 };

 // Assessment State
 const [gasAnswer, setGasAnswer] = useState('');
 const [flameAnswer, setFlameAnswer] = useState('');
 const [feedback, setFeedback] = useState('');

 const checkAnswers = () => {
 let msg = '';
 if (gasAnswer.trim().toLowerCase() === 'co2' || gasAnswer.trim().toLowerCase() === 'carbon dioxide') {
 msg += '✅ Gas identification is correct.\n';
 } else {
 msg += '❌ Gas identification is incorrect (Hint: Limewater test).\n';
 }
 if (flameAnswer.trim().toLowerCase() === 'cu' || flameAnswer.trim().toLowerCase() === 'copper') {
 msg += '✅ Metal identification is correct.';
 } else {
 msg += '❌ Metal identification is incorrect (Hint: Blue-green flame).';
 }
 setFeedback(msg);
 };

 return (
 <div className="flex flex-col bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.c9qualitativeanalysis_grade_9_chemistry_qualitative_')} subtitle={t('lab.subtitle_tests_flame_tests')} variant="emerald" />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.c9qualitativeanalysis_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.c9qualitativeanalysis_lab')}</button>
 </div>
 <main className="lg:flex-1 p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 min-h-0 lg:overflow-hidden">
 {/* Column 1: Theory */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center gap-2 mb-4 text-emerald-800">
 <BookOpen size={24} />
 <h2 className="text-xl font-semibold">{t('lab.c9qualitativeanalysis_theory_context')}</h2>
 </div>
 
 <div className="space-y-4 text-slate-700 dark:text-[#ffffff]">
 <p>
 
 {t('lab.c9qualitativeanalysis_qualitative_analysis_is_used_t')}
 </p>
 
 <div className={`bg-emerald-50 p-4 rounded-lg border border-emerald-100 flex-col `}>
 <h3 className="font-bold text-emerald-900 mb-2">{t('lab.c9qualitativeanalysis_1_testing_for_gases')}</h3>
 <ul className="list-disc pl-5 text-sm space-y-2">
 <li><strong>{t('lab.c9qualitativeanalysis_hydrogen_h')}</strong> {t('lab.c9qualitativeanalysis_ignites_with_a_squeaky_pop_sou')}</li>
 <li><strong>{t('lab.c9qualitativeanalysis_oxygen_o')}</strong> {t('lab.c9qualitativeanalysis_relights_a_glowing_splint_due_')}</li>
 <li><strong>{t('lab.c9qualitativeanalysis_carbon_dioxide_co')}</strong> {t('lab.c9qualitativeanalysis_reacts_with_limewater_calcium_')}</li>
 </ul>
 </div>

 <div className={`bg-orange-50 p-4 rounded-lg border border-orange-100 flex-col `}>
 <h3 className="font-bold text-orange-900 mb-2">{t('lab.c9qualitativeanalysis_2_flame_tests')}</h3>
 <p className="text-sm mb-2">
 
 {t('lab.c9qualitativeanalysis_metal_ions_emit_specific_wavel')}
 </p>
 <ul className="list-disc pl-5 text-sm space-y-1">
 <li><span className="font-semibold text-yellow-600">{t('lab.c9qualitativeanalysis_sodium_na')}</span> {t('lab.c9qualitativeanalysis_yellow_orange')}</li>
 <li><span className="font-semibold text-emerald-600">{t('lab.c9qualitativeanalysis_copper_cu')}</span> {t('lab.c9qualitativeanalysis_blue_green')}</li>
 <li><span className="font-semibold text-indigo-600">{t('lab.c9qualitativeanalysis_potassium_k')}</span> {t('lab.c9qualitativeanalysis_lilac_pale_purple')}</li>
 </ul>
 </div>
 </div>
 </div>

 {/* Column 2: Simulator */}
 <div className={`bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col lg:h-[600px] lg:h-auto rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex gap-4 mb-4 shrink-0">
 <button 
 className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'gas' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
 onClick={() => setActiveTab('gas')}
 >
 
 {t('lab.c9qualitativeanalysis_gas_tests')}
 </button>
 <button 
 className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'flame' ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
 onClick={() => setActiveTab('flame')}
 >
 
 {t('lab.c9qualitativeanalysis_flame_tests')}
 </button>
 </div>

 <div className={`flex-1 relative flex-col bg-slate-50 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] p-4 lg:overflow-y-auto ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 {activeTab === 'gas' && (
 <>
 <p className="text-center text-sm font-semibold text-slate-500 dark:text-[#71717a] mb-4 uppercase tracking-wider">{t('lab.c9qualitativeanalysis_chemical_shelf')}</p>
 <div className="flex flex-wrap justify-center gap-3 mb-6">
 {GAS_BOTTLES.map(b => (
 <button 
 key={b.id} 
 className={`flex flex-col items-center cursor-pointer transform transition-transform p-2 rounded-lg border-2 ${flaskContents.includes(b.id) ? 'border-emerald-500 bg-emerald-50 opacity-50 scale-95' : 'border-slate-200 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] hover:-translate-y-1 shadow-sm'}`}
 onClick={() => addToFlask(b.id)}
 disabled={flaskContents.includes(b.id) || flaskContents.length >= 3}
 >
 <div className={`w-10 h-12 rounded-t-lg rounded-b-sm border-2 border-slate-300 dark:border-[#1c1b1b] relative overflow-hidden ${b.type === 'liquid' ? 'bg-blue-50' : 'bg-slate-50 dark:bg-[#121212]'}`}>
 <div className="absolute top-0 w-full h-2 bg-slate-200 dark:bg-[#121212] border-b border-slate-300 dark:border-[#1c1b1b]"></div>
 {b.type === 'solid' && <div className="absolute bottom-0 w-full h-3" style={{ backgroundColor: b.color }}></div>}
 {b.type === 'liquid' && <div className="absolute bottom-0 w-full h-5" style={{ backgroundColor: b.color, opacity: 0.7 }}></div>}
 </div>
 <div className="mt-1 text-[10px] font-bold text-center w-16 leading-tight text-slate-700 dark:text-[#ffffff]">{b.label}</div>
 </button>
 ))}
 </div>

 {/* Real-time Equation Display */}
 <div className="bg-[#000000] dark:bg-[#121212] lg:dark:bg-[#121212] text-green-400 font-mono p-3 rounded-lg lg:min-h-[60px] flex items-center justify-center text-center mb-6 shadow-inner flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
 {reactionEquation ? (
 <span className="text-sm md:text-base font-bold tracking-wider">{reactionEquation}</span>
 ) : (
 <span className="text-slate-500 dark:text-[#71717a] italic text-sm">{t('lab.c9qualitativeanalysis_mix_chemicals_to_build_an_equa')}</span>
 )}
 </div>

 {/* Flask Area */}
 <div className="flex flex-col items-center justify-center flex-1">
 <div className="relative w-32 h-32">
 <svg viewBox="0 0 100 120" className="w-full h-full">
 {/* Flask Outline */}
 <path d="M40,10 L40,40 L10,100 A10,10 0 0,0 20,115 L80,115 A10,10 0 0,0 90,100 L60,40 L60,10 Z" fill="rgba(255,255,255,0.8)" stroke="#475569" strokeWidth="4" />
 <rect x="35" y="5" width="30" height="5" fill="#475569" />
 
 {/* Contents */}
 {flaskContents.some(id => GAS_BOTTLES.find(b => b.id === id)?.type === 'liquid') && (
 <path d="M15,90 L85,90 L80,110 A5,5 0 0,1 75,115 L25,115 A5,5 0 0,1 20,110 Z" fill="#bae6fd" opacity="0.6" />
 )}
 
 {flaskContents.some(id => GAS_BOTTLES.find(b => b.id === id)?.type === 'solid') && (
 <path d="M25,110 L75,110 L70,115 L30,115 Z" fill="#64748b" />
 )}
 
 {/* Bubbles if reaction is happening */}
 {reactionGas && (
 <g>
 <circle cx="40" cy="80" r="2" fill="#fff" className="animate-bounce" />
 <circle cx="50" cy="70" r="3" fill="#fff" className="animate-ping" />
 <circle cx="60" cy="85" r="2" fill="#fff" className="animate-bounce" style={{ animationDelay: '0.2s' }} />
 <circle cx="45" cy="50" r="2" fill="#fff" className="animate-ping" style={{ animationDelay: '0.1s' }} />
 </g>
 )}
 </svg>
 </div>
 
 {/* Test Tools */}
 <div className="flex flex-wrap justify-center gap-2 mt-4">
 <button onClick={() => performGasTest('lit_splint')} className="px-3 py-1.5 bg-red-100 text-red-800 text-xs font-semibold rounded-md border border-red-200 hover:bg-red-200 transition-colors">{t('lab.c9qualitativeanalysis_lit_splint')}</button>
 <button onClick={() => performGasTest('glowing_splint')} className="px-3 py-1.5 bg-orange-100 text-orange-800 text-xs font-semibold rounded-md border border-orange-200 hover:bg-orange-200 transition-colors">{t('lab.c9qualitativeanalysis_glowing_splint')}</button>
 <button onClick={() => performGasTest('limewater')} className="px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-md border border-blue-200 hover:bg-blue-200 transition-colors dark:text-[#ffffff]">{t('lab.c9qualitativeanalysis_limewater')}</button>
 </div>

 {testResult && (
 <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center text-yellow-800 text-sm font-semibold w-full">
 {testResult}
 </div>
 )}

 <button 
 className="flex items-center gap-2 px-4 py-2 mt-4 bg-slate-600 dark:bg-[#121212] text-white rounded-lg hover:bg-slate-700 dark:bg-[#121212] transition-colors text-sm dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent"
 onClick={resetFlask}
 >
 <RotateCcw size={16} /> {t('lab.c9qualitativeanalysis_empty_flask')}
 </button>
 </div>
 </>
 )}

 {activeTab === 'flame' && (
 <div className="w-full h-full flex flex-col items-center p-2">
 <p className="text-center text-sm font-semibold text-slate-500 dark:text-[#71717a] mb-4 uppercase tracking-wider">{t('lab.c9qualitativeanalysis_salt_samples')}</p>
 <div className="flex justify-center gap-6 mb-8">
 {FLAME_BOTTLES.map(b => (
 <button 
 key={b.id} 
 className={`flex flex-col items-center cursor-pointer p-2 rounded-lg border-2 transition-colors ${wireLoop === b.id ? 'border-orange-500 bg-orange-50' : 'border-slate-200 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] hover:border-slate-300 dark:border-[#1c1b1b]'}`} 
 onClick={() => dipWire(b.id)}
 >
 <div className="w-12 h-12 rounded-full border-2 border-slate-300 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] flex items-center justify-center mb-2 shadow-inner">
 <div className="w-8 h-8 rounded-full" style={{ backgroundColor: b.color, opacity: 0.8 }}></div>
 </div>
 <div className="text-xs font-bold text-slate-700 dark:text-[#ffffff] text-center w-20">{b.label}</div>
 <div className="text-[10px] text-slate-500 dark:text-[#71717a] font-mono">{b.formula}</div>
 </button>
 ))}
 </div>
 
 <div className="flex-1 flex flex-col items-center justify-center relative w-full">
 <p className="text-sm text-slate-500 dark:text-[#71717a] italic mb-4">{t('lab.c9qualitativeanalysis_click_the_flame_to_insert_the_')}</p>
 {/* Bunsen Burner SVG */}
 <svg viewBox="0 0 100 150" className="w-24 h-36 cursor-pointer hover:scale-105 transition-transform" onClick={putInFlame}>
 {/* burner base */}
 <path d="M40,150 L60,150 L60,80 L40,80 Z" fill="#94a3b8" />
 <rect x="30" y="140" width="40" height="10" fill="#475569" />
 {/* Air hole */}
 <circle cx="50" cy="130" r="4" fill="#334155" />
 {/* Flame */}
 <path d="M50,5 Q25,60 40,80 L60,80 Q75,60 50,5 Z" fill={flameColor} opacity="0.85" className="animate-pulse" />
 <path d="M50,30 Q35,60 45,80 L55,80 Q65,60 50,30 Z" fill="#bae6fd" opacity="0.5" />
 </svg>
 
 {/* Wire loop indicator */}
 {wireLoop && (
 <div className="absolute top-1/3 right-10 flex items-center pointer-events-none">
 <div className="w-16 h-1 bg-slate-400 dark:bg-[#121212]"></div>
 <div 
 className="w-5 h-5 rounded-full border-4 border-slate-400 dark:border-[#1c1b1b] bg-transparent" 
 style={{ borderColor: FLAME_BOTTLES.find(b=>b.id===wireLoop)?.color || '#94a3b8' }}
 ></div>
 </div>
 )}
 </div>
 
 <button 
 onClick={cleanWire} 
 className="mt-6 px-5 py-2 bg-slate-200 dark:bg-[#121212] text-slate-800 dark:text-[#ffffff] font-semibold rounded-lg hover:bg-slate-300 dark:bg-[#121212] transition-colors text-sm"
 >
 
 {t('lab.c9qualitativeanalysis_clean_wire')}
 </button>
 </div>
 )}
 </div>
 </div>

 {/* Column 3: Assessment */}
 <div className={`bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center gap-2 mb-4 text-emerald-800">
 <CheckCircle size={24} />
 <h2 className="text-xl font-semibold">{t('lab.c9qualitativeanalysis_assessment')}</h2>
 </div>

 <div className="space-y-6">
 <div className={`p-4 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.c9qualitativeanalysis_unknown_sample_analysis')}</h3>
 <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
 
 {t('lab.c9qualitativeanalysis_you_are_given_an_unknown_solid')}
 </p>
 
 <div className="space-y-4">
 <div>
 <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-1">
 
 {t('lab.c9qualitativeanalysis_1_what_gas_was_produced')}
 </label>
 <input 
 type="text"
 className="w-full px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
 placeholder={t('lab.c9qualitativeanalysis_enter_gas_name_or_formula')}
 value={gasAnswer}
 onChange={e => setGasAnswer(e.target.value)}
 />
 </div>
 <div>
 <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-1">
 
 {t('lab.c9qualitativeanalysis_2_what_metal_ion_is_present')}
 </label>
 <input 
 type="text"
 className="w-full px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
 placeholder={t('lab.c9qualitativeanalysis_enter_metal_name_or_formula')}
 value={flameAnswer}
 onChange={e => setFlameAnswer(e.target.value)}
 />
 </div>
 
 <button 
 onClick={checkAnswers}
 className="w-full py-2 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition-colors dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
 >
 
 {t('lab.c9qualitativeanalysis_verify_findings')}
 </button>
 </div>
 
 {feedback && (
 <div className="mt-4 p-3 rounded-md text-sm font-medium whitespace-pre-wrap bg-slate-100 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] text-slate-800 dark:text-[#ffffff]">
 {feedback}
 </div>
 )}
 </div>
 </div>
 </div>
 </main>
 </div>
 );
}
