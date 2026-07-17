import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import MathText from './MathText';
import { useTranslate } from "../i18n";

export default function LabM11BinomialInduction({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [mode] = useState<'induction' | 'pascal'>('induction');

 // Generate Pascal's Triangle rows
 const generatePascal = (numRows: number): number[][] => {
 const triangle: number[][] = [];
 for (let row = 0; row < numRows; row++) {
 const rowData: number[] = [];
 for (let k = 0; k <= row; k++) {
 rowData.push(nCr(row, k));
 }
 triangle.push(rowData);
 }
 return triangle;
 };

 // --- Induction State ---
 const NUM_DOMINOES = 15;
 const [dominoesState, setDominoesState] = useState<boolean[]>(new Array(NUM_DOMINOES).fill(false)); // true = fallen
 const [missingDomino, setMissingDomino] = useState<number | null>(null);
 const [isFalling, setIsFalling] = useState(false);
 const fallIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

 // --- Pascal State ---
 const [pascalRows, setPascalRows] = useState(7); // up to 10
 const [selectedCell, setSelectedCell] = useState<{n: number, k: number} | null>(null);

 // --- Assessment ---
 const [q1Ans, setQ1Ans] = useState('');
 const [q2Ans, setQ2Ans] = useState('');
 const [feedback, setFeedback] = useState<{q1?: boolean, q2?: boolean}>({});

 const resetDominoes = () => {
 if (fallIntervalRef.current) clearInterval(fallIntervalRef.current);
 setDominoesState(new Array(NUM_DOMINOES).fill(false));
 setIsFalling(false);
 };

 const startFall = () => {
 if (isFalling) return;
 setIsFalling(true);
 let currentIndex = 0;
 
 fallIntervalRef.current = setInterval(() => {
 setDominoesState(prev => {
 const newState = [...prev];
 // Check if current is missing
 if (currentIndex === missingDomino) {
 if (fallIntervalRef.current) clearInterval(fallIntervalRef.current);
 setIsFalling(false);
 return prev;
 }
 
 newState[currentIndex] = true;
 currentIndex++;
 
 if (currentIndex >= NUM_DOMINOES) {
 if (fallIntervalRef.current) clearInterval(fallIntervalRef.current);
 setIsFalling(false);
 }
 return newState;
 });
 }, 150);
 };

 useEffect(() => {
 return () => {
 if (fallIntervalRef.current) clearInterval(fallIntervalRef.current);
 };
 }, []);

 const factorial = (n: number): number => n <= 1 ? 1 : n * factorial(n - 1);
 const nCr = (n: number, r: number): number => factorial(n) / (factorial(r) * factorial(n - r));

 const checkAnswers = () => {
 const f = { ...feedback };
 if (mode === 'induction') {
 // Base step, Inductive step
 f.q1 = q1Ans.trim().toLowerCase().includes('base');
 f.q2 = q2Ans.trim().toLowerCase().includes('k+1') || q2Ans.trim().toLowerCase().includes('k + 1');
 } else {
 // Binomial expansion of (a+b)^4, coefficient of a^2b^2 is 4C2 = 6
 f.q1 = q1Ans.trim() === '6';
 // 7C3 = 35
 f.q2 = q2Ans.trim() === '35';
 }
 setFeedback(f);
 };

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 {/* Header */}
 <LabHeader onExit={onExit} title={t('lab.m11binomialinduction_grade_11_induction_binomial_th')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.m11binomialinduction_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.m11binomialinduction_lab')}</button>
 </div>
 <div className="flex flex-col lg:grid lg:grid-cols-3 lg:flex-1 lg:overflow-visible">
 {/* Left Column: Theory */}
 <div className={`w-full p-6 bg-slate-50 dark:bg-[#121212] border-r border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col gap-6 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 {mode === 'induction' ? (
 <>
 <div>
 <h2 className="text-2xl font-bold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.m11binomialinduction_mathematical_induction')}</h2>
 <p className="text-slate-600 dark:text-[#a1a1aa] mb-4">{t('lab.m11binomialinduction_a_method_of_mathematical_proof')}</p>
 
 <div className={`bg-amber-50 p-4 rounded-xl border border-amber-200 mb-4 dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
 <h3 className="font-semibold text-amber-900 mb-2 dark:text-[#ffffff]">{t('lab.m11binomialinduction_the_domino_effect')}</h3>
 <ol className="list-decimal list-inside text-sm text-amber-800 space-y-2 dark:text-[#ffffff]">
 <li><strong>{t('lab.m11binomialinduction_base_case')}</strong> <MathText>{t('lab.m11binomialinduction_prove_the_first_domino_falls_p')}</MathText></li>
 <li><strong>{t('lab.m11binomialinduction_inductive_hypothesis')}</strong> <MathText>{t('lab.m11binomialinduction_assume_some_domino_k_falls')}</MathText></li>
 <li><strong>{t('lab.m11binomialinduction_inductive_step')}</strong> <MathText>{t('lab.m11binomialinduction_show_that_if_domino_k_falls_it')}</MathText></li>
 </ol>
 </div>
 <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">{t('lab.m11binomialinduction_if_both_conditions_are_met_the')}</p>
 </div>
 </>
 ) : (
 <>
 <div>
 <h2 className="text-2xl font-bold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.m11binomialinduction_pascal_s_binomial_theorem')}</h2>
 <p className="text-slate-600 dark:text-[#a1a1aa] mb-4"><MathText>{t('lab.m11binomialinduction_pascal_s_triangle_gives_the_co')} {"$\\binom{n}{k}$"}.</MathText></p>
 
 <div className={`bg-indigo-50 p-4 rounded-xl border border-indigo-200 mb-4 dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
 <h3 className="font-semibold text-indigo-900 mb-2 dark:text-[#ffffff]">{t('lab.m11binomialinduction_binomial_theorem')}</h3>
 <p className="text-sm text-indigo-800 font-mono mb-2 dark:text-[#ffffff]">
 <MathText>{"$$ (x + y)^n = \\sum \\binom{n}{k} x^{n-k} y^k $$"}</MathText>
 </p>
 <p className="text-xs text-indigo-700"><MathText>{t('lab.m11binomialinduction_where_nck_or')} {"$\\binom{n}{k}$"}{t('lab.m11binomialinduction_is_the_number_in_the_n_th_row_')}</MathText></p>
 </div>
 <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.m11binomialinduction_formula_for_ncr')}</h3>
 <p className="text-sm font-mono text-slate-700 dark:text-[#ffffff]">
 <MathText>{"$$ nCr = \\frac{n!}{r! (n-r)!} $$"}</MathText>
 </p>
 </div>
 </div>
 </>
 )}
 </div>

 {/* Middle Column: Interactive Simulator */}
 <div className="bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] relative flex flex-col p-6 items-center justify-center ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
 <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-6 absolute top-6">{t('lab.m11binomialinduction_interactive_visualizer')}</h2>
 
 {mode === 'induction' && (
 <div className="w-full flex flex-col items-center gap-12 mt-10">
 {/* Domino Track */}
 <div className="w-full max-w-2xl bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-300 dark:bg-[#121212] lg:dark:bg-[#121212] h-4 rounded-full relative flex items-end justify-between px-4 pb-4 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
 {dominoesState.map((isFallen, idx) => (
 <div key={idx} className="relative w-8 flex justify-center">
 {idx !== missingDomino && (
 <div className={`w-3 h-16 rounded-sm bg-indigo-600 border border-indigo-800 shadow-md transform origin-bottom transition-transform duration-150 ease-in ${isFallen ? 'rotate-[65deg] translate-x-3' : 'rotate-0'}`}>
 <div className="w-full h-1/2 border-b border-indigo-400 opacity-50"></div>
 <div className="absolute -top-6 w-full text-center text-xs font-bold text-slate-500 dark:text-[#71717a]">{idx+1}</div>
 </div>
 )}
 {idx === missingDomino && (
 <div className="w-full absolute -top-6 text-center text-xs font-bold text-red-500">{t('lab.m11binomialinduction_gap')}</div>
 )}
 </div>
 ))}
 </div>

 <div className={`bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] w-full max-w-md flex-col gap-4 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <p className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.m11binomialinduction_experiment_controls')}</p>
 <div className="flex items-center justify-between">
 <label className="text-sm text-slate-600 dark:text-[#a1a1aa]">{t('lab.m11binomialinduction_remove_a_domino_create_a_gap')}</label>
 <select 
 className="border border-slate-300 dark:border-[#1c1b1b] rounded p-1"
 value={missingDomino === null ? 'none' : missingDomino}
 onChange={e => {
 const val = e.target.value;
 setMissingDomino(val === 'none' ? null : parseInt(val));
 resetDominoes();
 }}
 disabled={isFalling}
 >
 <option value="none">{t('lab.m11binomialinduction_none_perfect_induction')}</option>
 <option value="4">{t('lab.m11binomialinduction_domino_5')}</option>
 <option value="9">{t('lab.m11binomialinduction_domino_10')}</option>
 </select>
 </div>
 <div className="flex gap-4 mt-4">
 <button onClick={startFall} disabled={isFalling || dominoesState[0]} className={`flex-1 min-w-0 bg-amber-500 hover:bg-amber-600 text-indigo-950 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 dark:text-white dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40 `}>
 <Play size={18} /> {t('lab.m11binomialinduction_push_first_domino')}
 </button>
 <button onClick={resetDominoes} className={`flex-1 min-w-0 bg-slate-200 dark:bg-[#121212] hover:bg-slate-300 dark:bg-[#121212] text-slate-800 dark:text-[#ffffff] font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors `}>
 <RotateCcw size={18} /> {t('lab.m11binomialinduction_reset')}
 </button>
 </div>
 <div className="bg-indigo-50 p-3 rounded-lg text-sm text-indigo-800 border border-indigo-100 mt-2 dark:bg-[#121212] dark:border-[#1c1b1b] dark:text-[#ffffff]">
 {missingDomino === null ? 
 "If P(1) is true and P(k) -> P(k+1) is true for all k, all dominoes fall." : 
 `Gap at domino ${missingDomino + 1}. The inductive step P(k) -> P(k+1) fails at k=${missingDomino}!`}
 </div>
 </div>
 </div>
 )}

 {mode === 'pascal' && (
 <div className="w-full flex flex-col items-center gap-6 mt-10">
 <div className="flex flex-col items-center gap-1">
 {generatePascal(pascalRows).map((row, n) => (
 <div key={n} className="flex gap-1">
 {row.map((val, k) => (
 <button 
 key={k}
 onClick={() => setSelectedCell({n, k})}
 className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all shadow-sm border ${selectedCell?.n === n && selectedCell?.k === k ? 'bg-amber-500 text-white border-amber-600 scale-110 z-10' : 'bg-slate-50 dark:bg-[#121212] text-indigo-900 border-slate-200 dark:border-[#1c1b1b] hover:bg-indigo-50'}`}
 >
 {val}
 </button>
 ))}
 </div>
 ))}
 </div>

 <div className={`w-full max-w-md bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] mt-4 flex-col gap-4 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center justify-between">
 <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.m11binomialinduction_number_of_rows')}</label>
 <input type="range" min="3" max="10" value={pascalRows} onChange={e => {setPascalRows(parseInt(e.target.value)); setSelectedCell(null);}} className="w-1/2" />
 <span className="text-sm font-mono bg-slate-100 dark:bg-[#121212] px-2 rounded">{pascalRows}</span>
 </div>

 {selectedCell && (
 <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex flex-col items-center dark:bg-[#121212] dark:border-[#1c1b1b]">
 <div className="text-indigo-900 font-semibold mb-2 dark:text-[#ffffff]">{t('lab.m11binomialinduction_selected_coefficient')}</div>
 <div className="flex items-center gap-4 text-xl font-mono text-indigo-800 dark:text-[#ffffff]">
 <div className="flex flex-col items-center justify-center">
 <span>{selectedCell.n}</span>
 <span className="border-t-2 border-indigo-800 w-6"></span>
 <span>{selectedCell.k}</span>
 </div>
 <span>=</span>
 <span className="font-bold text-2xl">{nCr(selectedCell.n, selectedCell.k)}</span>
 </div>
 <div className="text-xs text-indigo-600 mt-3 text-center">
 
 {t('lab.m11binomialinduction_row')} {selectedCell.n}{t('lab.m11binomialinduction_item')} {selectedCell.k} {t('lab.m11binomialinduction_0_indexed')}<br/>
 <MathText>{t('lab.m11binomialinduction_appears_in_expansion_of')} {"$$ (x+y)^{" + selectedCell.n + "} $$"} {t('lab.m11binomialinduction_as_coefficient_of')} {"$$ x^{" + (selectedCell.n - selectedCell.k) + "}y^{" + selectedCell.k + "} $$"}</MathText>
 </div>
 </div>
 )}
 </div>
 </div>
 )}
 </div>

 {/* Right Column: Assessment */}
 <div className={`p-6 bg-slate-50 dark:bg-[#121212] border-l border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-6 flex items-center gap-2">
 
 {t('lab.m11binomialinduction_let_s_solve')}
 </h2>

 <div className="space-y-6">
 {mode === 'induction' && (
 <>
 <div className={`bg-slate-50 dark:bg-[#121212] p-5 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <p className="text-sm text-slate-700 dark:text-[#ffffff] mb-4 font-medium">{t('lab.m11binomialinduction_q1_what_is_the_name_of_the_fir')}</p>
 <div className="flex items-center gap-3">
 <input type="text" value={q1Ans} onChange={e => setQ1Ans(e.target.value)} placeholder={t('lab.m11binomialinduction_e_g_base_step')} className="flex-1 min-w-0 border border-slate-300 dark:border-[#1c1b1b] rounded-lg p-2 text-sm" />
 {feedback.q1 === true && <CheckCircle2 className="text-green-500" size={24} />}
 {feedback.q1 === false && <XCircle className="text-red-500" size={24} />}
 </div>
 </div>
 <div className={`bg-slate-50 dark:bg-[#121212] p-5 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <p className="text-sm text-slate-700 dark:text-[#ffffff] mb-4 font-medium">{t('lab.m11binomialinduction_q2_in_the_inductive_step_you_a')}</p>
 <div className="flex items-center gap-3">
 <input type="text" value={q2Ans} onChange={e => setQ2Ans(e.target.value)} placeholder={t('lab.m11binomialinduction_e_g_k_1')} className="flex-1 min-w-0 border border-slate-300 dark:border-[#1c1b1b] rounded-lg p-2 text-sm" />
 {feedback.q2 === true && <CheckCircle2 className="text-green-500" size={24} />}
 {feedback.q2 === false && <XCircle className="text-red-500" size={24} />}
 </div>
 </div>
 </>
 )}

 {mode === 'pascal' && (
 <>
 <div className={`bg-slate-50 dark:bg-[#121212] p-5 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <p className="text-sm text-slate-700 dark:text-[#ffffff] mb-4 font-medium"><MathText>{t('lab.m11binomialinduction_q1_what_is_the_coefficient_of_')}</MathText></p>
 <div className="flex items-center gap-3">
 <input type="text" value={q1Ans} onChange={e => setQ1Ans(e.target.value)} placeholder={t('lab.m11binomialinduction_enter_number')} className="flex-1 min-w-0 border border-slate-300 dark:border-[#1c1b1b] rounded-lg p-2 text-sm" />
 {feedback.q1 === true && <CheckCircle2 className="text-green-500" size={24} />}
 {feedback.q1 === false && <XCircle className="text-red-500" size={24} />}
 </div>
 <p className="text-xs text-slate-500 dark:text-[#71717a] mt-2">{t('lab.m11binomialinduction_hint_look_at_row_4_of_pascal_s')}</p>
 </div>
 <div className={`bg-slate-50 dark:bg-[#121212] p-5 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <p className="text-sm text-slate-700 dark:text-[#ffffff] mb-4 font-medium"><MathText>{t('lab.m11binomialinduction_q2_compute_the_value_of_binom')}{7}{3}{t('lab.m11binomialinduction_7_choose_3')}</MathText></p>
 <div className="flex items-center gap-3">
 <input type="text" value={q2Ans} onChange={e => setQ2Ans(e.target.value)} placeholder={t('lab.m11binomialinduction_enter_number')} className="flex-1 min-w-0 border border-slate-300 dark:border-[#1c1b1b] rounded-lg p-2 text-sm" />
 {feedback.q2 === true && <CheckCircle2 className="text-green-500" size={24} />}
 {feedback.q2 === false && <XCircle className="text-red-500" size={24} />}
 </div>
 </div>
 </>
 )}

 <button onClick={checkAnswers} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md mt-4 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
 
 {t('lab.m11binomialinduction_check_answers')}
 </button>
 </div>
 </div>
 </div>
 </div>
 );
}
