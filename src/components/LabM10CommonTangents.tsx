import { useState, useEffect } from 'react';
import { Settings, Calculator, CheckCircle, XCircle} from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit?: () => void;
}

export default function LabM10CommonTangents({ onExit }: LabProps) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [r1, setR1] = useState<number>(6);
 const [r2, setR2] = useState<number>(3);
 const [dist, setDist] = useState<number>(15);
 const [tangentType, setTangentType] = useState<'DCT' | 'TCT'>('DCT');
 const [step, setStep] = useState<number>(0);

 const [ansDCT, setAnsDCT] = useState<string>('');
 const [ansTCT, setAnsTCT] = useState<string>('');
 const [feedback, setFeedback] = useState<{dct: boolean | null, tct: boolean | null}>({dct: null, tct: null});

 useEffect(() => {
 setStep(0);
 setAnsDCT('');
 setAnsTCT('');
 setFeedback({dct: null, tct: null});
 }, [r1, r2, dist, tangentType]);

 const checkAnswers = () => {
 const trueDCT = Math.sqrt(dist * dist - Math.pow(r1 - r2, 2));
 const trueTCT = dist > r1 + r2 ? Math.sqrt(dist * dist - Math.pow(r1 + r2, 2)) : 0;

 const dctCorrect = Math.abs(parseFloat(ansDCT) - trueDCT) < 0.1;
 const tctCorrect = dist > r1 + r2 ? Math.abs(parseFloat(ansTCT) - trueTCT) < 0.1 : true;

 setFeedback({ dct: dctCorrect, tct: tctCorrect });
 };

 const scale = 12;
 const cx1 = 100;
 const cy = 200;
 const cx2 = cx1 + dist * scale;
 
 const R1 = r1 * scale;
 const R2 = r2 * scale;
 const D = dist * scale;
 const mx = (cx1 + cx2) / 2;
 const rM = D / 2;

 const Raux = tangentType === 'DCT' ? (r1 - r2) * scale : (r1 + r2) * scale;
 
 const alpha = Math.acos(Raux / D);
 const ax1 = cx1 + Raux * Math.cos(alpha);
 const ay1 = cy - Raux * Math.sin(alpha);
 const ax2 = cx1 + Raux * Math.cos(-alpha);
 const ay2 = cy - Raux * Math.sin(-alpha);

 const t1x_A = cx1 + R1 * Math.cos(alpha);
 const t1y_A = cy - R1 * Math.sin(alpha);
 const t1x_B = cx1 + R1 * Math.cos(-alpha);
 const t1y_B = cy - R1 * Math.sin(-alpha);

 const angleC2 = tangentType === 'DCT' ? alpha : Math.PI + alpha;
 const angleC2_B = tangentType === 'DCT' ? -alpha : Math.PI - alpha;
 
 const t2x_A = cx2 + R2 * Math.cos(angleC2);
 const t2y_A = cy - R2 * Math.sin(angleC2);
 const t2x_B = cx2 + R2 * Math.cos(angleC2_B);
 const t2y_B = cy - R2 * Math.sin(angleC2_B);

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.m10commontangents_common_tangents_construction')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.m10commontangents_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.m10commontangents_lab')}</button>
 </div>
 <div className="lg:flex-1 min-w-0 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 max-w-7xl mx-auto w-full lg:overflow-visible">
 {/* Column 1: Setup */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex mb-4' : 'hidden'} lg:flex lg:order-none`}>
 <div className={`flex items-center gap-2 mb-4 text-indigo-800 dark:text-[#ffffff] ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
 <Settings className="w-6 h-6" />
 <h2 className="text-lg font-semibold">{t('lab.m10commontangents_parameters')}</h2>
 </div>
 
 <div className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 
 {t('lab.m10commontangents_circle_1_radius_r1')} {r1} cm
 </label>
 <input 
 type="range" min="4" max="8" step="1" 
 value={r1} onChange={(e) => setR1(Number(e.target.value))}
 className="w-full accent-indigo-600"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 
 {t('lab.m10commontangents_circle_2_radius_r2')} {r2} cm
 </label>
 <input 
 type="range" min="1" max={r1 - 1} step="1" 
 value={r2} onChange={(e) => setR2(Number(e.target.value))}
 className="w-full accent-indigo-600"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 
 {t('lab.m10commontangents_distance_d')} {dist} cm
 </label>
 <input 
 type="range" min={r1 + r2 + 2} max="22" step="1" 
 value={dist} onChange={(e) => setDist(Number(e.target.value))}
 className="w-full accent-indigo-600"
 />
 </div>

 <div className="flex gap-2 mt-4">
 <button 
 onClick={() => { setTangentType('DCT'); setStep(0); }}
 className={`flex-1 py-2 rounded-lg font-medium transition-colors ${tangentType === 'DCT' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
 >
 
 {t('lab.m10commontangents_dct')}
 </button>
 <button 
 onClick={() => { setTangentType('TCT'); setStep(0); }}
 className={`flex-1 py-2 rounded-lg font-medium transition-colors ${tangentType === 'TCT' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
 >
 
 {t('lab.m10commontangents_tct')}
 </button>
 </div>

 <div className={`bg-indigo-50 p-4 rounded-lg border border-indigo-100 text-sm text-indigo-800 mt-4 dark:bg-[#121212] dark:border-[#1c1b1b] dark:text-[#ffffff] flex-col `}>
 <p className="font-semibold mb-2">{t('lab.m10commontangents_construction_steps')}</p>
 <input 
 type="range" min="0" max="6" step="1" 
 value={step} onChange={(e) => setStep(Number(e.target.value))}
 className="w-full accent-indigo-600 mb-2"
 />
 <p>{t('lab.m10commontangents_step')} {step}: {
 step === 0 ? "Draw both circles and join centers." :
 step === 1 ? "Find midpoint of C1-C2." :
 step === 2 ? "Draw circle with diameter C1-C2." :
 step === 3 ? `Draw auxiliary circle of radius ${tangentType === 'DCT' ? 'R1-R2' : 'R1+R2'}.` :
 step === 4 ? "Mark intersections with diametral circle." :
 step === 5 ? "Draw radii to find tangent points." :
 "Draw the common tangents."
 }</p>
 </div>
 </div>
 </div>

 {/* Column 2: Simulation */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col items-center justify-center lg:min-h-[35vh] lg:min-h-[400px] '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-4">{t('lab.m10commontangents_construction_board')}</h2>
 <svg width="450" height="400" className={`bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg shadow-inner flex-col `}>
 {/* Grid */}
 <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
 <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
 </pattern>
 <rect width="450" height="400" fill="url(#grid2)" />

 {/* Step 0: Circles and centers line */}
 <circle cx={cx1} cy={cy} r={R1} fill="transparent" stroke="#0284c7" strokeWidth="2" />
 <circle cx={cx2} cy={cy} r={R2} fill="transparent" stroke="#0284c7" strokeWidth="2" />
 <circle cx={cx1} cy={cy} r="3" fill="#0369a1" />
 <circle cx={cx2} cy={cy} r="3" fill="#0369a1" />
 <text x={cx1 - 15} y={cy + 15} fill="#0369a1" fontSize="12" fontWeight="bold">C1</text>
 <text x={cx2 + 5} y={cy + 15} fill="#0369a1" fontSize="12" fontWeight="bold">C2</text>
 <line x1={cx1} y1={cy} x2={cx2} y2={cy} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />

 {/* Step 1: Midpoint */}
 {step >= 1 && (
 <>
 <circle cx={mx} cy={cy} r="3" fill="#ef4444" />
 <text x={mx - 5} y={cy + 15} fill="#ef4444" fontSize="12" fontWeight="bold">M</text>
 </>
 )}

 {/* Step 2: Diametral Circle */}
 {step >= 2 && (
 <circle cx={mx} cy={cy} r={rM} fill="transparent" stroke="#ef4444" strokeWidth="1" strokeDasharray="5 5" />
 )}

 {/* Step 3: Auxiliary Circle */}
 {step >= 3 && (
 <circle cx={cx1} cy={cy} r={Raux} fill="transparent" stroke="#5560F1" strokeWidth="2" strokeDasharray="4 4" />
 )}

 {/* Step 4: Intersections */}
 {step >= 4 && (
 <>
 <circle cx={ax1} cy={ay1} r="4" fill="#5560F1" />
 <circle cx={ax2} cy={ay2} r="4" fill="#5560F1" />
 <line x1={cx1} y1={cy} x2={ax1} y2={ay1} stroke="#5560F1" strokeWidth="1" />
 <line x1={cx1} y1={cy} x2={ax2} y2={ay2} stroke="#5560F1" strokeWidth="1" />
 </>
 )}

 {/* Step 5: Radii and tangent points */}
 {step >= 5 && (
 <>
 <line x1={cx1} y1={cy} x2={t1x_A} y2={t1y_A} stroke="#10b981" strokeWidth="2" />
 <line x1={cx1} y1={cy} x2={t1x_B} y2={t1y_B} stroke="#10b981" strokeWidth="2" />
 
 <line x1={cx2} y1={cy} x2={t2x_A} y2={t2y_A} stroke="#10b981" strokeWidth="2" />
 <line x1={cx2} y1={cy} x2={t2x_B} y2={t2y_B} stroke="#10b981" strokeWidth="2" />

 <circle cx={t1x_A} cy={t1y_A} r="3" fill="#10b981" />
 <circle cx={t2x_A} cy={t2y_A} r="3" fill="#10b981" />
 <circle cx={t1x_B} cy={t1y_B} r="3" fill="#10b981" />
 <circle cx={t2x_B} cy={t2y_B} r="3" fill="#10b981" />
 </>
 )}

 {/* Step 6: Tangents */}
 {step >= 6 && (
 <>
 <line x1={t1x_A - (t2x_A - t1x_A)*0.2} y1={t1y_A - (t2y_A - t1y_A)*0.2} 
 x2={t2x_A + (t2x_A - t1x_A)*0.2} y2={t2y_A + (t2y_A - t1y_A)*0.2} 
 stroke="#f59e0b" strokeWidth="2" />
 <line x1={t1x_B - (t2x_B - t1x_B)*0.2} y1={t1y_B - (t2y_B - t1y_B)*0.2} 
 x2={t2x_B + (t2x_B - t1x_B)*0.2} y2={t2y_B + (t2y_B - t1y_B)*0.2} 
 stroke="#f59e0b" strokeWidth="2" />
 </>
 )}
 </svg>
 </div>

 {/* Column 3: Assessment */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center gap-2 mb-4 text-indigo-700">
 <Calculator className="w-6 h-6" />
 <h2 className="text-lg font-semibold">{t('lab.m10commontangents_length_calculations')}</h2>
 </div>
 
 <div className="space-y-6">
 <div className={`bg-indigo-50 p-3 rounded-lg text-sm text-indigo-800 dark:bg-[#121212] dark:border-[#1c1b1b] dark:text-[#ffffff] flex-col `}>
 
 {t('lab.m10commontangents_formulas')}<br/>
 
 {t('lab.m10commontangents_dct_length_d_r1_r2')}<br/>
 
 {t('lab.m10commontangents_tct_length_d_r1_r2')}
 </div>
 
 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-2">
 
 {t('lab.m10commontangents_1_calculate_the_direct_common_')}
 </label>
 <div className="flex items-center gap-2">
 <input 
 type="number" step="0.1"
 value={ansDCT} onChange={(e) => setAnsDCT(e.target.value)}
 className="w-full px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
 placeholder={t('lab.m10commontangents_e_g_14_5')}
 />
 {feedback.dct === true && <CheckCircle className="text-emerald-500 w-6 h-6" />}
 {feedback.dct === false && <XCircle className="text-red-500 w-6 h-6" />}
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-2">
 
 {t('lab.m10commontangents_2_calculate_the_transverse_com')}
 </label>
 <div className="flex items-center gap-2">
 <input 
 type="number" step="0.1"
 value={ansTCT} onChange={(e) => setAnsTCT(e.target.value)}
 disabled={dist <= r1 + r2}
 className="w-full px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 dark:bg-[#121212]"
 placeholder={dist <= r1 + r2 ? "Not possible" : "e.g. 10.2"}
 />
 {feedback.tct === true && <CheckCircle className="text-emerald-500 w-6 h-6" />}
 {feedback.tct === false && <XCircle className="text-red-500 w-6 h-6" />}
 </div>
 {dist <= r1 + r2 && (
 <p className="text-xs text-red-500 mt-1">{t('lab.m10commontangents_circles_intersect_or_are_too_c')}</p>
 )}
 </div>

 <button 
 onClick={checkAnswers}
 className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
 >
 
 {t('lab.m10commontangents_check_answers')}
 </button>
 </div>
 </div>
 </div>
 </div>
 );
}
