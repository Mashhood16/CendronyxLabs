import { useState } from 'react';
import { Play, CheckCircle, Search, Scissors, Link } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

export default function LabB12Biotechnology({ onExit }: { onExit?: () => void }) {
 const { setLabScore } = useLab();
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [plasmidState, setPlasmidState] = useState<'intact' | 'cut' | 'inserted' | 'ligated'>('intact');
 const [pcrCycles, setPcrCycles] = useState(0);
 const [pcrTemp, setPcrTemp] = useState(25);
 const [isCycling, setIsCycling] = useState(false);
 const [ans1, setAns1] = useState('');
 const [ans2, setAns2] = useState('');
 const [feedback, setFeedback] = useState('');

 const runPcrCycle = () => {
 if (plasmidState !== 'ligated') return;
 if (isCycling) return;
 setIsCycling(true);
 
 // Simulate temp changes
 setTimeout(() => setPcrTemp(95), 500);
 setTimeout(() => setPcrTemp(55), 1500);
 setTimeout(() => setPcrTemp(72), 2500);
 setTimeout(() => {
 setPcrTemp(25);
 setPcrCycles(c => c + 1);
 setIsCycling(false);
 }, 3500);
 };

 const checkAnswers = () => {
 let score = 0;
 if (ans1.trim() === '1024') score++;
 if (ans2.trim().toLowerCase() === 'sticky') score++;
 
 if (score === 2) setFeedback('Excellent! Both answers are correct.');
 else setFeedback(`You got ${score}/2 correct. Keep trying!`);
 setLabScore(score, 2);
 };

 return (
 <div className="flex flex-col bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.b12biotechnology_genetic_engineering_pcr')} subtitle={t('lab.subtitle_recombinant_thermocycling')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.b12biotechnology_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.b12biotechnology_lab')}</button>
 </div>
 <main className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:min-h-0 lg:overflow-hidden">
 {/* Theory */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4">{t('lab.b12biotechnology_theory_context')}</h2>
 <div className="space-y-4 text-sm text-slate-600 dark:text-[#a1a1aa]">
 <p>
 <strong>{t('lab.b12biotechnology_recombinant_dna_technology')}</strong> {t('lab.b12biotechnology_this_process_involves_isolatin')}
 </p>
 <p>
 <strong>{t('lab.b12biotechnology_restriction_endonucleases')}</strong> {t('lab.b12biotechnology_enzymes_like')} <em>{t('lab.b12biotechnology_ecori')}</em> {t('lab.b12biotechnology_cut_dna_at_specific_recognitio')} <code>{t('lab.b12biotechnology_5_gaattc_3')}</code>{t('lab.b12biotechnology_often_leaving_overhanging_stic')}
 </p>
 <p>
 <strong>{t('lab.b12biotechnology_dna_ligase')}</strong> {t('lab.b12biotechnology_forms_phosphodiester_bonds_bet')}
 </p>
 <p>
 <strong>{t('lab.b12biotechnology_polymerase_chain_reaction_pcr')}</strong> {t('lab.b12biotechnology_amplifies_dna_exponentially')}
 <ul className="list-disc pl-5 mt-2 space-y-1">
 <li><strong>{t('lab.b12biotechnology_denaturation_94_96_c')}</strong> {t('lab.b12biotechnology_hydrogen_bonds_break_separatin')}</li>
 <li><strong>{t('lab.b12biotechnology_annealing_50_65_c')}</strong> {t('lab.b12biotechnology_primers_bind_to_complementary_')}</li>
 <li><strong>{t('lab.b12biotechnology_extension_72_c')}</strong> <em>{t('lab.b12biotechnology_taq')}</em> {t('lab.b12biotechnology_polymerase_synthesizes_the_new')}</li>
 </ul>
 </p>
 </div>
 </div>

 {/* Interactive */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4">{t('lab.b12biotechnology_simulation_workspace')}</h2>
 
 <div className="flex-1 flex flex-col items-center justify-center space-y-8">
 <div className={`relative w-64 h-64 bg-slate-100 dark:bg-[#121212] rounded-full flex items-center justify-center shadow-inner border border-slate-300 dark:border-[#1c1b1b] flex-col `}>
 {/* Plasmid SVG */}
 <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
 <circle cx="100" cy="100" r="70" fill="none" stroke="#cbd5e1" strokeWidth="16" />
 
 {/* Bacterial DNA */}
 <circle cx="100" cy="100" r="70" fill="none" stroke="#3b82f6" strokeWidth="16" 
 strokeDasharray={plasmidState === 'intact' ? "440" : "340 100"}
 strokeDashoffset="110"
 className="transition-all duration-700" />
 
 {plasmidState === 'inserted' && (
 <path d="M 125 35 A 70 70 0 0 1 170 100" fill="none" stroke="#ef4444" strokeWidth="16" className="animate-pulse" />
 )}
 {plasmidState === 'ligated' && (
 <path d="M 125 35 A 70 70 0 0 1 170 100" fill="none" stroke="#ef4444" strokeWidth="16" />
 )}
 </svg>
 
 <div className="absolute inset-0 flex items-center justify-center flex-col">
 <span className="text-xs font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-wider">{t('lab.b12biotechnology_plasmid_vector')}</span>
 </div>
 </div>

 <div className="flex gap-2">
 <button 
 onClick={() => setPlasmidState('cut')}
 disabled={plasmidState !== 'intact'}
 className={`flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 disabled:opacity-50 text-sm font-medium flex-col `}>
 <Scissors className="w-4 h-4" /> {t('lab.b12biotechnology_ecori')}
 </button>
 <button 
 onClick={() => setPlasmidState('inserted')}
 disabled={plasmidState !== 'cut'}
 className={`flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 text-sm font-medium flex-col `}>
 <Search className="w-4 h-4" /> {t('lab.b12biotechnology_insulin_gene')}
 </button>
 <button 
 onClick={() => setPlasmidState('ligated')}
 disabled={plasmidState !== 'inserted'}
 className="flex items-center gap-2 px-3 py-2 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 disabled:opacity-50 text-sm font-medium">
 <Link className="w-4 h-4" /> {t('lab.b12biotechnology_ligase')}
 </button>
 </div>

 {/* PCR Section */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] rounded-lg p-4 border border-slate-300 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] transition-opacity ${plasmidState === 'ligated' ? 'opacity-100' : 'opacity-40 pointer-events-none'} 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
 <div className="flex justify-between items-center mb-2">
 <h3 className="font-bold text-slate-700 dark:text-[#ffffff]">{t('lab.b12biotechnology_pcr_thermocycler')}</h3>
 <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded dark:text-[#ffffff]">{t('lab.b12biotechnology_temp')} {pcrTemp}°C</span>
 </div>
 <div className="flex items-center gap-4">
 <button 
 onClick={runPcrCycle}
 disabled={isCycling}
 className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
 <Play className="w-4 h-4" /> {t('lab.b12biotechnology_run_cycle')}
 </button>
 <div className="flex-1 bg-slate-200 dark:bg-[#121212] h-2 rounded-full lg:overflow-hidden">
 <div className="bg-blue-500 h-full transition-all duration-300 dark:bg-teal-950/20 dark:border-teal-900" style={{ width: `${(pcrTemp / 100) * 100}%` }}></div>
 </div>
 <div className="text-right">
 <div className="text-xs text-slate-500 dark:text-[#71717a]">{t('lab.b12biotechnology_cycles')}</div>
 <div className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">{pcrCycles}</div>
 </div>
 </div>
 <div className="mt-3 text-center text-xs font-medium text-slate-500 dark:text-[#71717a]">
 
 {t('lab.b12biotechnology_copies')} {Math.pow(2, pcrCycles)}
 </div>
 </div>
 </div>
 </div>

 {/* Assessment */}
 <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col lg:overflow-y-auto ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4">{t('lab.b12biotechnology_data_log_assessment')}</h2>
 
 <div className="space-y-6">
 <div className="space-y-2">
 <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff]">
 
 {t('lab.b12biotechnology_1_if_you_run_10_full_pcr_cycle')}
 </label>
 <input 
 type="number" 
 className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-blue-500 outline-none font-mono"
 value={ans1}
 onChange={e => setAns1(e.target.value)}
 placeholder={t('lab.b12biotechnology_e_g_1024')}
 />
 </div>

 <div className="space-y-2">
 <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff]">
 
 {t('lab.b12biotechnology_2_ecori_recognizes_the_sequenc')}
 </label>
 <input 
 type="text" 
 className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-blue-500 outline-none"
 value={ans2}
 onChange={e => setAns2(e.target.value)}
 placeholder={t('lab.b12biotechnology_type_here')}
 />
 </div>

 <button 
 onClick={checkAnswers}
 className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
 <CheckCircle className="w-5 h-5" /> {t('lab.b12biotechnology_check_answers')}
 </button>

 {feedback && (
 <div className={`p-3 rounded text-sm font-medium ${feedback.includes('Excellent') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
 {feedback}
 </div>
 )}
 </div>
 </div>
 </main>
 </div>
 );
}
