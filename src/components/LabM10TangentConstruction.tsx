import { useState, useEffect } from 'react';
import { Settings, Calculator, CheckCircle, XCircle} from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit?: () => void;
}

export default function LabM10TangentConstruction({ onExit }: LabProps) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [radius, setRadius] = useState<number>(5);
 const [distance, setDistance] = useState<number>(13);
 const [showTangents, setShowTangents] = useState<boolean>(false);

 const [ansLength, setAnsLength] = useState<string>('');
 const [ansAngle, setAnsAngle] = useState<string>('');
 const [feedback, setFeedback] = useState<{length: boolean | null, angle: boolean | null}>({length: null, angle: null});

 useEffect(() => {
 setShowTangents(false);
 setAnsLength('');
 setAnsAngle('');
 setFeedback({length: null, angle: null});
 }, [radius, distance]);

 const checkAnswers = () => {
 const trueLength = Math.sqrt(distance * distance - radius * radius);
 const alpha = Math.asin(radius / distance) * (180 / Math.PI);
 const trueAngle = 2 * alpha;

 const lengthCorrect = Math.abs(parseFloat(ansLength) - trueLength) < 0.1;
 const angleCorrect = Math.abs(parseFloat(ansAngle) - trueAngle) < 0.5;

 setFeedback({ length: lengthCorrect, angle: angleCorrect });
 };

 const scale = 15;
 const cx = 100;
 const cy = 200;
 const px = cx + distance * scale;
 const py = cy;
 const rScale = radius * scale;

 const alphaRad = Math.asin(radius / distance);
 const t1x = cx + rScale * Math.cos(alphaRad);
 const t1y = cy - rScale * Math.sin(alphaRad);
 const t2x = cx + rScale * Math.cos(-alphaRad);
 const t2y = cy - rScale * Math.sin(-alphaRad);

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.m10tangentconstruction_tangents_to_a_circle_from_an_e')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.m10tangentconstruction_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.m10tangentconstruction_lab')}</button>
 </div>
 <div className="lg:flex-1 min-w-0 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 max-w-7xl mx-auto w-full lg:overflow-visible">
 {/* Column 1: Setup */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex mb-4' : 'hidden'} lg:flex lg:order-none`}>
 <div className={`flex items-center gap-2 mb-4 text-blue-800 dark:text-[#ffffff] ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
 <Settings className="w-6 h-6" />
 <h2 className="text-lg font-semibold">{t('lab.m10tangentconstruction_construction_setup')}</h2>
 </div>
 
 <div className="space-y-6">
 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 
 {t('lab.m10tangentconstruction_circle_radius_r')} {radius} cm
 </label>
 <input 
 type="range" min="3" max="8" step="1" 
 value={radius} onChange={(e) => setRadius(Number(e.target.value))}
 className="w-full accent-blue-600"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 
 {t('lab.m10tangentconstruction_distance_to_p_d')} {distance} cm
 </label>
 <input 
 type="range" min={radius + 2} max="20" step="1" 
 value={distance} onChange={(e) => setDistance(Number(e.target.value))}
 className="w-full accent-blue-600"
 />
 </div>
 
 <button 
 onClick={() => setShowTangents(!showTangents)}
 className={`w-full py-2 px-4 bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:bg-[#121212] text-slate-800 dark:text-[#ffffff] font-medium rounded-lg transition-colors border border-slate-300 dark:border-[#1c1b1b] flex-col `}
 >
 {showTangents ? "Hide Tangents" : "Construct Tangents"}
 </button>
 
 <div className={`bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 mt-4 dark:bg-teal-950/20 dark:border-teal-900 dark:text-[#ffffff] flex-col `}>
 <p><strong>{t('lab.m10tangentconstruction_theory_1')}</strong></p>
 <ul className="list-disc ml-5 mt-2 space-y-1">
 <li>{t('lab.m10tangentconstruction_the_tangent_to_a_circle_is_per')}</li>
 <li>{t('lab.m10tangentconstruction_lengths_of_two_tangents_drawn_')}</li>
 <li>{t('lab.m10tangentconstruction_by_pythagoras_theorem_pt_op_ot')}</li>
 </ul>
 </div>
 </div>
 </div>

 {/* Column 2: Simulation */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col items-center justify-center lg:min-h-[35vh] lg:min-h-[400px] '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-4">{t('lab.m10tangentconstruction_interactive_canvas')}</h2>
 <svg width="450" height="400" className={`bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg shadow-inner flex-col `}>
 {/* Grid */}
 <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
 <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
 </pattern>
 <rect width="450" height="400" fill="url(#grid)" />

 {/* Base Lines */}
 <line x1={cx} y1={cy} x2={px} y2={cy} stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
 
 {/* Circle */}
 <circle cx={cx} cy={cy} r={rScale} fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
 <circle cx={cx} cy={cy} r="3" fill="#0369a1" />
 <text x={cx - 15} y={cy + 15} fill="#0369a1" fontSize="14" fontWeight="bold">O</text>

 {/* Point P */}
 <circle cx={px} cy={py} r="4" fill="#ef4444" />
 <text x={px + 10} y={py + 5} fill="#ef4444" fontSize="14" fontWeight="bold">P</text>

 {showTangents && (
 <>
 {/* Tangent Lines */}
 <line x1={px} y1={py} x2={t1x} y2={t1y} stroke="#f59e0b" strokeWidth="2" />
 <line x1={px} y1={py} x2={t2x} y2={t2y} stroke="#f59e0b" strokeWidth="2" />
 
 {/* Radii to tangents */}
 <line x1={cx} y1={cy} x2={t1x} y2={t1y} stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
 <line x1={cx} y1={cy} x2={t2x} y2={t2y} stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
 
 {/* Tangent Points */}
 <circle cx={t1x} cy={t1y} r="3" fill="#f59e0b" />
 <circle cx={t2x} cy={t2y} r="3" fill="#f59e0b" />
 
 <text x={t1x - 10} y={t1y - 10} fill="#f59e0b" fontSize="14" fontWeight="bold">T1</text>
 <text x={t2x - 10} y={t2y + 20} fill="#f59e0b" fontSize="14" fontWeight="bold">T2</text>
 </>
 )}
 </svg>
 </div>

 {/* Column 3: Assessment */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center gap-2 mb-4 text-emerald-700">
 <Calculator className="w-6 h-6" />
 <h2 className="text-lg font-semibold">{t('lab.m10tangentconstruction_calculations')}</h2>
 </div>
 
 <div className="space-y-6">
 <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">
 
 {t('lab.m10tangentconstruction_based_on_the_parameters_set_in')}
 </p>
 
 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-2">
 
 {t('lab.m10tangentconstruction_1_what_is_the_length_of_the_ta')}
 </label>
 <div className="flex items-center gap-2">
 <input 
 type="number" step="0.1"
 value={ansLength} onChange={(e) => setAnsLength(e.target.value)}
 className="w-full px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
 placeholder={t('lab.m10tangentconstruction_e_g_12_0')}
 />
 {feedback.length === true && <CheckCircle className="text-emerald-500 w-6 h-6" />}
 {feedback.length === false && <XCircle className="text-red-500 w-6 h-6" />}
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-2">
 
 {t('lab.m10tangentconstruction_2_what_is_the_angle_between_th')}
 </label>
 <div className="flex items-center gap-2">
 <input 
 type="number" step="0.1"
 value={ansAngle} onChange={(e) => setAnsAngle(e.target.value)}
 className="w-full px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
 placeholder={t('lab.m10tangentconstruction_e_g_45_0')}
 />
 {feedback.angle === true && <CheckCircle className="text-emerald-500 w-6 h-6" />}
 {feedback.angle === false && <XCircle className="text-red-500 w-6 h-6" />}
 </div>
 </div>

 <button 
 onClick={checkAnswers}
 className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
 >
 
 {t('lab.m10tangentconstruction_check_answers')}
 </button>
 </div>
 </div>
 </div>
 </div>
 );
}
