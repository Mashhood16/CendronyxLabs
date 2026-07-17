import { useState, useEffect, useCallback } from 'react';
import { Calculator, BookOpen, Ruler, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface TrigProblem {
 distance: number;
 angle: number;
 eyeHeight: number;
 correctHeight: number;
}

export default function LabM10TrigApplications({ onExit }: { onExit: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [distance, setDistance] = useState<number>(50); // meters
 const [angle, setAngle] = useState<number>(45); // degrees
 const eyeHeight = 1.6; // meters

 const [problem, setProblem] = useState<TrigProblem | null>(null);
 const [userAnswer, setUserAnswer] = useState<string>('');
 const [feedback, setFeedback] = useState<string | null>(null);

 const generateProblem = useCallback(() => {
 const d = Math.floor(Math.random() * 100) + 20;
 const a = Math.floor(Math.random() * 60) + 10;
 const h = eyeHeight + d * Math.tan((a * Math.PI) / 180);
 setProblem({ distance: d, angle: a, eyeHeight, correctHeight: Number(h.toFixed(1)) });
 setUserAnswer('');
 setFeedback(null);
 }, []);

 useEffect(() => {
 generateProblem();
 }, [generateProblem]);

 const checkAnswer = () => {
 if (!problem) return;
 const numAnswer = parseFloat(userAnswer);
 if (isNaN(numAnswer)) {
 setFeedback("Please enter a valid number.");
 return;
 }
 if (Math.abs(numAnswer - problem.correctHeight) <= 0.5) {
 setFeedback("Correct! Excellent work using trigonometry.");
 } else {
 setFeedback(`Incorrect. Try again. (Hint: use tan(${problem.angle}°) * ${problem.distance} + ${problem.eyeHeight})`);
 }
 };

 const calculatedHeight = eyeHeight + distance * Math.tan((angle * Math.PI) / 180);

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 {/* Header */}
 <LabHeader onExit={onExit} title={t('lab.m10trigapplications_trigonometry_applications')} />

 {/* Main Content Grid */}
 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.m10trigapplications_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.m10trigapplications_lab')}</button>
 </div>
 <div className="lg:flex-1 min-w-0 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:overflow-visible">
 {/* Column 1: Theory */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 flex flex-col lg:overflow-y-auto border-t-4 border-indigo-500 ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center mb-4 text-indigo-800 shrink-0 dark:text-[#ffffff]">
 <BookOpen className="mr-2" size={24} />
 <h2 className="text-xl font-semibold">{t('lab.m10trigapplications_theory_context')}</h2>
 </div>
 <div className="prose prose-indigo flex-1 text-slate-700 dark:text-[#ffffff]">
 <p>
 
 {t('lab.m10trigapplications_trigonometry_allows_us_to_calc')} <strong>{t('lab.m10trigapplications_burj_khalifa')}</strong> {t('lab.m10trigapplications_or_an_aviation_sightline')}
 </p>
 <h3 className="text-lg font-bold mt-4 text-slate-800 dark:text-[#ffffff]">{t('lab.m10trigapplications_angle_of_elevation')}</h3>
 <p>
 
 {t('lab.m10trigapplications_the_angle_of_elevation_is_the_')} <strong>{t('lab.m10trigapplications_theodolite')}</strong> {t('lab.m10trigapplications_or_a_clinometer')}
 </p>
 <h3 className="text-lg font-bold mt-4 text-slate-800 dark:text-[#ffffff]">{t('lab.m10trigapplications_using_tangent_soh_cah_toa')}</h3>
 <p>
 
 {t('lab.m10trigapplications_for_a_right_angled_triangle_th')}
 </p>
 <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded-lg text-center font-mono my-2 border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
 
 {t('lab.m10trigapplications_tan_opposite_adjacent')}
 </div>
 <p>
 
 {t('lab.m10trigapplications_to_find_the_total_height_of_a_')}
 </p>
 <div className={`bg-indigo-50 p-3 rounded-lg font-mono text-sm text-indigo-900 border border-indigo-200 dark:bg-[#121212] dark:border-[#1c1b1b] dark:text-[#ffffff] flex-col `}>
 
 {t('lab.m10trigapplications_height_distance_tan_observer_h')}
 </div>
 </div>
 </div>

 {/* Column 2: Simulator */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 flex flex-col border-t-4 border-sky-500 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
 <div className="flex items-center mb-4 text-sky-800 shrink-0">
 <Ruler className="mr-2" size={24} />
 <h2 className="text-xl font-semibold">{t('lab.m10trigapplications_interactive_visualizer')}</h2>
 </div>
 
 <div className={`flex-1 min-w-0 relative bg-sky-50 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex flex-col min-h-[300px] `}>
 <div className="flex-1 min-w-0 relative w-full h-full">
 <svg viewBox="0 0 400 300" className="w-full h-full absolute inset-0">
 {/* Sky & Ground */}
 <rect x="0" y="0" width="400" height="250" fill="#e0f2fe" />
 <rect x="0" y="250" width="400" height="50" fill="#84cc16" />
 
 {/* Building */}
 <rect x="300" y={250 - Math.min(220, calculatedHeight * 2)} width="60" height={Math.min(220, calculatedHeight * 2)} fill="#94a3b8" stroke="#475569" strokeWidth="2" />
 <rect x="310" y={250 - Math.min(220, calculatedHeight * 2) + 10} width="15" height="15" fill="#fef08a" />
 <rect x="335" y={250 - Math.min(220, calculatedHeight * 2) + 10} width="15" height="15" fill="#fef08a" />
 
 {/* Observer */}
 <circle cx={300 - distance * 2} cy={250 - eyeHeight * 2} r="4" fill="#3b82f6" />
 <line x1={300 - distance * 2} y1="250" x2={300 - distance * 2} y2={250 - eyeHeight * 2} stroke="#1e40af" strokeWidth="3" />
 
 {/* Horizontal Line */}
 <line x1={300 - distance * 2} y1={250 - eyeHeight * 2} x2="300" y2={250 - eyeHeight * 2} stroke="#94a3b8" strokeDasharray="5 5" strokeWidth="2" />
 
 {/* Line of Sight */}
 <line x1={300 - distance * 2} y1={250 - eyeHeight * 2} x2="300" y2={250 - Math.min(220, calculatedHeight * 2)} stroke="#ef4444" strokeWidth="2" />
 
 {/* Angle Arc */}
 <path 
 d={`M ${300 - distance * 2 + 40} ${250 - eyeHeight * 2} A 40 40 0 0 0 ${300 - distance * 2 + 40 * Math.cos((angle * Math.PI) / 180)} ${250 - eyeHeight * 2 - 40 * Math.sin((angle * Math.PI) / 180)}`} 
 fill="none" 
 stroke="#ef4444" 
 strokeWidth="2" 
 />
 <text x={300 - distance * 2 + 45} y={250 - eyeHeight * 2 - 10} fill="#dc2626" fontSize="14" fontWeight="bold">{angle}°</text>

 {/* Distance Label */}
 <text x={300 - distance} y="265" textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="bold">{t('lab.m10trigapplications_d')} {distance} m</text>
 </svg>
 </div>

 <div className={`p-4 bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] border-t border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] space-y-4 shrink-0 shadow-inner rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <div>
 <div className="flex justify-between text-sm font-medium mb-1 text-slate-700 dark:text-[#ffffff]">
 <span>{t('lab.m10trigapplications_distance_to_base_m')}</span>
 <span className="text-sky-600">{distance} m</span>
 </div>
 <input
 type="range"
 min="20"
 max="120"
 value={distance}
 onChange={(e) => setDistance(Number(e.target.value))}
 className="w-full accent-sky-500"
 />
 </div>
 <div>
 <div className="flex justify-between text-sm font-medium mb-1 text-slate-700 dark:text-[#ffffff]">
 <span>{t('lab.m10trigapplications_angle_of_elevation_1')}</span>
 <span className="text-red-600">{angle}°</span>
 </div>
 <input
 type="range"
 min="5"
 max="80"
 value={angle}
 onChange={(e) => setAngle(Number(e.target.value))}
 className="w-full accent-red-500"
 />
 </div>
 <div className="text-center text-sm font-bold text-slate-800 dark:text-[#ffffff] bg-slate-100 dark:bg-[#121212] py-2 rounded">
 
 {t('lab.m10trigapplications_simulated_height')} {calculatedHeight.toFixed(1)} m
 </div>
 </div>
 </div>
 </div>

 {/* Column 3: Assessment */}
 <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 flex flex-col border-t-4 border-emerald-500 `}>
 <div className="flex items-center mb-4 text-emerald-800 shrink-0">
 <Calculator className="mr-2" size={24} />
 <h2 className="text-xl font-semibold">{t('lab.m10trigapplications_math_assessment')}</h2>
 </div>
 
 {problem && (
 <div className="flex-1 min-w-0 flex flex-col space-y-5">
 <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-200">
 <p className="text-slate-800 dark:text-[#ffffff] mb-3 leading-relaxed">
 
 {t('lab.m10trigapplications_you_are_surveying_a_skyscraper')} <strong>{problem.distance} {t('lab.m10trigapplications_meters')}</strong> {t('lab.m10trigapplications_away_from_its_base_looking_up_')} <strong>{problem.angle}°</strong> {t('lab.m10trigapplications_to_the_very_top')}
 </p>
 <p className="text-slate-800 dark:text-[#ffffff] font-semibold">
 
 {t('lab.m10trigapplications_if_your_instrument_is_situated')} {problem.eyeHeight} {t('lab.m10trigapplications_m_above_the_ground_what_is_the')}
 </p>
 <p className="text-xs text-slate-500 dark:text-[#71717a] mt-2 font-mono">{t('lab.m10trigapplications_round_your_answer_to_1_decimal')}</p>
 </div>

 <div>
 <label className="block text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.m10trigapplications_calculated_height_m')}</label>
 <input
 type="number"
 step="0.1"
 value={userAnswer}
 onChange={(e) => setUserAnswer(e.target.value)}
 className="w-full p-3 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow text-lg font-mono"
 placeholder={t('lab.m10trigapplications_e_g_150_5')}
 />
 </div>

 <button
 onClick={checkAnswer}
 className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-sm dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
 >
 
 {t('lab.m10trigapplications_check_answer')}
 </button>

 {feedback && (
 <div className={`p-4 rounded-lg flex items-start space-x-3 shadow-inner ${feedback.includes('Correct') ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
 {feedback.includes('Correct') ? <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" /> : <XCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />}
 <p className="flex-1 min-w-0 font-medium">{feedback}</p>
 </div>
 )}

 <div className="mt-auto pt-4">
 <button
 onClick={generateProblem}
 className="w-full py-3 flex items-center justify-center space-x-2 bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] font-bold rounded-lg transition-colors border border-slate-300 dark:border-[#1c1b1b]"
 >
 <RotateCcw size={20} />
 <span>{t('lab.m10trigapplications_generate_new_problem')}</span>
 </button>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 );
}
