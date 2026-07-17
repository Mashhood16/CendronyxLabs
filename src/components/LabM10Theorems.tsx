import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
 CheckCircle, XCircle, ChevronDown, ChevronRight,
 ArrowRight, Lightbulb, Sigma, BookOpen,
 Target, Hash, Infinity, PieChart, Move3d,
 Ruler, GraduationCap, Triangle, Circle, Square,
 Activity, Layers, Combine, Shuffle, RotateCcw,
 Compass, Minus, Plus, Divide, Equal, GitBranch
} from 'lucide-react';
import MathFormula from './MathFormula';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

// ========== Types ==========
interface TheoremModule {
 id: string;
 icon: typeof Target;
 title: string;
 formula: string;
 formulaDesc: string;
 color: string;
 steps: { label: string; content: string; }[];
 interactive: (props: { onAnswer: (correct: boolean) => void }) => React.ReactElement;
}

// ========== Reusable Interactive Components ==========

// --- Quadratic Formula ---
function QuadraticFormulaInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
 const { t } = useTranslate();
 const [a, setA] = useState(2);
 const [b, setB] = useState(7);
 const [cVal, setCVal] = useState(3);
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

 const discriminant = b*b - 4*a*cVal;
 const root1 = (-b + Math.sqrt(discriminant)) / (2*a);
 const root2 = (-b - Math.sqrt(discriminant)) / (2*a);

 const handleCheck = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 const correct = Math.abs(val - root1) < 0.01 || Math.abs(val - root2) < 0.01;
 setCheckResult(correct ? 'correct' : 'incorrect');
 if (correct) onAnswer(true);
 };

 return (
 <div className="space-y-4">
 <div className="grid grid-cols-3 gap-3">
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.m10theorems_a_x_coeff')}</label>
 <input type="range" min="-10" max="10" step="1" value={a} onChange={e => { setA(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
 <span className="text-sm font-mono text-blue-600">{t('lab.m10theorems_a')} {a}</span>
 </div>
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.m10theorems_b_x_coeff')}</label>
 <input type="range" min="-10" max="10" step="1" value={b} onChange={e => { setB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
 <span className="text-sm font-mono text-blue-600">{t('lab.m10theorems_b')} {b}</span>
 </div>
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.m10theorems_c_constant')}</label>
 <input type="range" min="-10" max="10" step="1" value={cVal} onChange={e => { setCVal(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
 <span className="text-sm font-mono text-blue-600">{t('lab.m10theorems_c')} {cVal}</span>
 </div>
 </div>
 <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
 <p className="text-xs text-blue-700 dark:text-blue-300 font-mono">
 
 {t('lab.m10theorems_equation')} {a}{t('lab.m10theorems_x')} {b}{t('lab.m10theorems_x_1')} {cVal} = 0<br />
 
 {t('lab.m10theorems_discriminant_b_4ac')} {b}² − 4({a})({cVal}) = {b*b} − {4*a*cVal} = <strong>{discriminant}</strong><br />
 {discriminant >= 0 ? (
 <>{t('lab.m10theorems_roots_x')}{root1.toFixed(2)}, {root2.toFixed(2)}]</>
 ) : (
 <span className="text-red-500">{t('lab.m10theorems_no_real_roots_discriminant_neg')}</span>
 )}
 </p>
 </div>
 <div className="flex gap-2">
 <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
 placeholder={t('lab.m10theorems_enter_a_root_value')} step="0.01" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-blue-500 outline-none" />
 <button onClick={handleCheck} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m10theorems_check')}</button>
 </div>
 {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {t('lab.m10theorems_correct_x')} {-b/(2*a)} ± √{discriminant}/({2*a})</p>}
 {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> {t('lab.m10theorems_try_x_b_b_4ac_2a')}</p>}
 </div>
 );
}

// --- Vector Difference ---
function VectorDiffInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
 const { t } = useTranslate();
 const [ax, setAx] = useState(2);
 const [ay, setAy] = useState(3);
 const [bx, setBx] = useState(7);
 const [by, setBy] = useState(5);
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

 const compX = bx - ax;
 const compY = by - ay;
 const mag = Math.sqrt(compX*compX + compY*compY);

 const handleCheck = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 setCheckResult(Math.abs(val - compX) < 0.1 ? 'correct' : 'incorrect');
 if (Math.abs(val - compX) < 0.1) onAnswer(true);
 };

 return (
 <div className="space-y-4">
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.m10theorems_a_x_y')}</label>
 <div className="grid grid-cols-2 gap-2">
 <div><span className="text-[10px]">x₁</span><input type="range" min="-5" max="5" step="1" value={ax} onChange={e => { setAx(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" /><span className="text-xs">{ax}</span></div>
 <div><span className="text-[10px]">y₁</span><input type="range" min="-5" max="5" step="1" value={ay} onChange={e => { setAy(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" /><span className="text-xs">{ay}</span></div>
 </div>
 </div>
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.m10theorems_b_x_y')}</label>
 <div className="grid grid-cols-2 gap-2">
 <div><span className="text-[10px]">x₂</span><input type="range" min="-5" max="5" step="1" value={bx} onChange={e => { setBx(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-violet-500" /><span className="text-xs">{bx}</span></div>
 <div><span className="text-[10px]">y₂</span><input type="range" min="-5" max="5" step="1" value={by} onChange={e => { setBy(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-violet-500" /><span className="text-xs">{by}</span></div>
 </div>
 </div>
 </div>
 <div className="relative h-32 bg-white dark:bg-[#121212] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
 <svg viewBox="0 0 240 120" className="w-full h-full">
 <line x1="120" y1="0" x2="120" y2="120" stroke="#cbd5e1" strokeWidth="0.5" />
 <line x1="0" y1="60" x2="240" y2="60" stroke="#cbd5e1" strokeWidth="0.5" />
 <circle cx={120 + ax*15} cy={60 - ay*15} r="4" fill="#10b981" />
 <text x={120 + ax*15 + 5} y={60 - ay*15 + 3} className="text-[8px] fill-emerald-600">A</text>
 <circle cx={120 + bx*15} cy={60 - by*15} r="4" fill="#8b5cf6" />
 <text x={120 + bx*15 + 5} y={60 - by*15 + 3} className="text-[8px] fill-violet-600">B</text>
 {/* Vector AB */}
 <defs><marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto"><polygon points="0,0 6,2 0,4" fill="#f59e0b" /></marker></defs>
 <line x1={120 + ax*15} y1={60 - ay*15} x2={120 + bx*15} y2={60 - by*15} stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowhead)" />
 <text x={120 + (ax+bx)*7.5} y={60 - (ay+by)*7.5 - 8} className="text-[8px] fill-amber-600">{t('lab.m10theorems_ab_b_a')}</text>
 </svg>
 </div>
 <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
 <p className="text-xs text-amber-700 dark:text-amber-300 font-mono">
 
 {t('lab.m10theorems_oa')}{ax}, {ay}{t('lab.m10theorems_b_ob')}{bx}, {by})<br />
 
 {t('lab.m10theorems_ab_b')}{bx}−{ax}, {by}−{ay}) = <strong>({compX}, {compY})</strong><br />
 
 {t('lab.m10theorems_ab')}{compX}² + {compY}²) = √{compX*compX + compY*compY} = <strong>{mag.toFixed(2)}</strong>
 </p>
 </div>
 <div className="flex gap-2">
 <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
 placeholder={t('lab.m10theorems_x_component_of_ab')} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-amber-500 outline-none" />
 <button onClick={handleCheck} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m10theorems_check')}</button>
 </div>
 {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t('lab.m10theorems_correct_ab_b_a')}</p>}
 {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t('lab.m10theorems_try_ab_x_x_y_y')}</p>}
 </div>
 );
}

// --- Law of Cosines Interactive ---
function LawCosinesInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
 const { t } = useTranslate();
 const [b, setB] = useState(5);
 const [c, setC] = useState(6);
 const [alpha, setAlpha] = useState(60);
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

 const rad = alpha * Math.PI / 180;
 const aCalc = Math.sqrt(b*b + c*c - 2*b*c*Math.cos(rad));

 const handleCheck = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 setCheckResult(Math.abs(val - aCalc) < 0.1 ? 'correct' : 'incorrect');
 if (Math.abs(val - aCalc) < 0.1) onAnswer(true);
 };

 return (
 <div className="space-y-4">
 <div className="grid grid-cols-3 gap-3">
 <div><label className="text-xs font-semibold">{t('lab.m10theorems_side_b')}</label>
 <input type="range" min="1" max="10" step="0.5" value={b} onChange={e => { setB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" /><span className="text-xs">{b}</span></div>
 <div><label className="text-xs font-semibold">{t('lab.m10theorems_side_c')}</label>
 <input type="range" min="1" max="10" step="0.5" value={c} onChange={e => { setC(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" /><span className="text-xs">{c}</span></div>
 <div><label className="text-xs font-semibold">{t('lab.m10theorems_angle')}</label>
 <input type="range" min="1" max="179" step="1" value={alpha} onChange={e => { setAlpha(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" /><span className="text-xs">{alpha}°</span></div>
 </div>
 <div className="relative h-28 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
 <svg viewBox="0 0 200 100" className="w-full h-full">
 <polygon points="20,85 180,85 60,10" fill="none" stroke="#e11d48" strokeWidth="1.5" />
 <text x="90" y="98" className="text-[8px] fill-rose-600">{t('lab.m10theorems_a_1')}</text>
 <text x="100" y="30" className="text-[8px] fill-rose-600">b={b}</text>
 <text x="20" y="55" className="text-[8px] fill-rose-600">c={c}</text>
 <text x="35" y="82" className="text-[10px] fill-rose-600">α={alpha}°</text>
 </svg>
 </div>
 <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-3 border border-rose-200 dark:border-rose-800">
 <p className="text-xs text-rose-700 dark:text-rose-300 font-mono">
 
 {t('lab.m10theorems_a_b_c_2bc_cos')}<br />
 
 {t('lab.m10theorems_a_2')} {b}² + {c}² − 2({b})({c}{t('lab.m10theorems_cos')}{alpha}°)<br />
 
 {t('lab.m10theorems_a_2')} {b*b} + {c*c} − {2*b*c} × {Math.cos(rad).toFixed(4)}<br />
 
 {t('lab.m10theorems_a')} <strong>{aCalc.toFixed(2)}</strong>
 </p>
 </div>
 <div className="flex gap-2">
 <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
 placeholder={t('lab.m10theorems_side_a_1')} step="0.01" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-rose-500 outline-none" />
 <button onClick={handleCheck} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m10theorems_check')}</button>
 </div>
 {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t('lab.m10theorems_correct_a')} {aCalc.toFixed(2)}</p>}
 {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t('lab.m10theorems_try_a_b_c_2bc_cos')}</p>}
 </div>
 );
}

// --- Law of Sines Interactive ---
function LawSinesInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
 const { t } = useTranslate();
 const [a, setA] = useState(7);
 const [alpha, setAlpha] = useState(50);
 const [beta, setBeta] = useState(70);
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

 const gamma = 180 - alpha - beta;
 const b = a * Math.sin(beta * Math.PI/180) / Math.sin(alpha * Math.PI/180);

 const handleCheck = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 setCheckResult(Math.abs(val - b) < 0.1 ? 'correct' : 'incorrect');
 if (Math.abs(val - b) < 0.1) onAnswer(true);
 };

 return (
 <div className="space-y-4">
 <div className="grid grid-cols-3 gap-3">
 <div><label className="text-xs font-semibold">{t('lab.m10theorems_side_a')}</label>
 <input type="range" min="1" max="10" step="0.5" value={a} onChange={e => { setA(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-sky-500" /><span className="text-xs">{a}</span></div>
 <div><label className="text-xs font-semibold">∠α</label>
 <input type="range" min="1" max="178" step="1" value={alpha} onChange={e => { setAlpha(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-sky-500" /><span className="text-xs">{alpha}°</span></div>
 <div><label className="text-xs font-semibold">∠β</label>
 <input type="range" min="1" max={178-alpha} step="1" value={beta} onChange={e => { setBeta(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-sky-500" /><span className="text-xs">{beta}°</span></div>
 </div>
 <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-3 border border-sky-200 dark:border-sky-800">
 <p className="text-xs text-sky-700 dark:text-sky-300 font-mono">
 ∠γ = 180° − {alpha}° − {beta}° = {gamma}°<br />
 
 {t('lab.m10theorems_a_sin_b_sin_b_a_sin_sin')}<br />
 
 {t('lab.m10theorems_b')} {a} {t('lab.m10theorems_sin')}{beta}{t('lab.m10theorems_sin_1')}{alpha}°)<br />
 
 {t('lab.m10theorems_b')} {a} × {Math.sin(beta*Math.PI/180).toFixed(4)} / {Math.sin(alpha*Math.PI/180).toFixed(4)}<br />
 
 {t('lab.m10theorems_b')} <strong>{b.toFixed(2)}</strong>
 </p>
 </div>
 <div className="flex gap-2">
 <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
 placeholder={t('lab.m10theorems_side_b_1')} step="0.01" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-sky-500 outline-none" />
 <button onClick={handleCheck} className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m10theorems_check')}</button>
 </div>
 {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t('lab.m10theorems_correct_b')} {b.toFixed(2)}</p>}
 {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t('lab.m10theorems_try_a_sin_b_sin')}</p>}
 </div>
 );
}

// --- Hero's Formula Interactive ---
function HerosFormulaInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
 const { t } = useTranslate();
 const [a, setA] = useState(5);
 const [b, setB] = useState(6);
 const [c, setC] = useState(7);
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

 const S = (a + b + c) / 2;
 const area = Math.sqrt(S * (S-a) * (S-b) * (S-c));

 const handleCheck = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 setCheckResult(Math.abs(val - area) < 0.1 ? 'correct' : 'incorrect');
 if (Math.abs(val - area) < 0.1) onAnswer(true);
 };

 return (
 <div className="space-y-4">
 <div className="grid grid-cols-3 gap-3">
 <div><label className="text-xs font-semibold">{t('lab.m10theorems_side_a')}</label>
 <input type="range" min="1" max="10" step="0.5" value={a} onChange={e => { setA(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" /><span className="text-xs">{a}</span></div>
 <div><label className="text-xs font-semibold">{t('lab.m10theorems_side_b')}</label>
 <input type="range" min="1" max="10" step="0.5" value={b} onChange={e => { setB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" /><span className="text-xs">{b}</span></div>
 <div><label className="text-xs font-semibold">{t('lab.m10theorems_side_c')}</label>
 <input type="range" min="1" max="10" step="0.5" value={c} onChange={e => { setC(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" /><span className="text-xs">{c}</span></div>
 </div>
 <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
 <p className="text-xs text-emerald-700 dark:text-emerald-300 font-mono">
 
 {t('lab.m10theorems_s_a_b_c_2')}{a}+{b}+{c})/2 = <strong>{S.toFixed(1)}</strong><br />
 
 {t('lab.m10theorems_s_s_a_s_b_s_c')}<br />
 Δ = √[{S.toFixed(1)}×{S.toFixed(1)}−{a})×({S.toFixed(1)}−{b})×({S.toFixed(1)}−{c})]<br />
 Δ = √[{S.toFixed(1)}×{(S-a).toFixed(1)}×{(S-b).toFixed(1)}×{(S-c).toFixed(1)}]<br />
 Δ = √{(S*(S-a)*(S-b)*(S-c)).toFixed(2)} = <strong>{area.toFixed(2)}</strong>
 </p>
 </div>
 <div className="flex gap-2">
 <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
 placeholder={t('lab.m10theorems_area_1')} step="0.01" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-emerald-500 outline-none" />
 <button onClick={handleCheck} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m10theorems_check')}</button>
 </div>
 {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t('lab.m10theorems_correct')} {area.toFixed(2)}</p>}
 {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t('lab.m10theorems_try_hero_s_formula_s_s_a_s_b_s')}</p>}
 </div>
 );
}

// --- Circum-Radius Interactive ---
function CircumRadiusInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
 const { t } = useTranslate();
 const [a, setA] = useState(5);
 const [b, setB] = useState(6);
 const [c, setC] = useState(7);
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

 const S = (a + b + c) / 2;
 const area = Math.sqrt(S * (S-a) * (S-b) * (S-c));
 const R = (a * b * c) / (4 * area);

 const handleCheck = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 setCheckResult(Math.abs(val - R) < 0.1 ? 'correct' : 'incorrect');
 if (Math.abs(val - R) < 0.1) onAnswer(true);
 };

 return (
 <div className="space-y-4">
 <div className="grid grid-cols-3 gap-3">
 <div><label className="text-xs font-semibold">{t('lab.m10theorems_side_a')}</label>
 <input type="range" min="1" max="10" step="0.5" value={a} onChange={e => { setA(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-orange-500" /><span className="text-xs">{a}</span></div>
 <div><label className="text-xs font-semibold">{t('lab.m10theorems_side_b')}</label>
 <input type="range" min="1" max="10" step="0.5" value={b} onChange={e => { setB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-orange-500" /><span className="text-xs">{b}</span></div>
 <div><label className="text-xs font-semibold">{t('lab.m10theorems_side_c')}</label>
 <input type="range" min="1" max="10" step="0.5" value={c} onChange={e => { setC(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-orange-500" /><span className="text-xs">{c}</span></div>
 </div>
 <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
 <p className="text-xs text-orange-700 dark:text-orange-300 font-mono">
 
 {t('lab.m10theorems_area')} {area.toFixed(2)} {t('lab.m10theorems_using_hero_s_formula')}<br />
 
 {t('lab.m10theorems_r_abc_4')}{a}×{b}×{c}) / (4 × {area.toFixed(2)})<br />
 
 {t('lab.m10theorems_r')} {a*b*c} / {(4*area).toFixed(2)} = <strong>{R.toFixed(2)}</strong>
 </p>
 </div>
 <div className="flex gap-2">
 <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
 placeholder={t('lab.m10theorems_r_3')} step="0.01" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-orange-500 outline-none" />
 <button onClick={handleCheck} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m10theorems_check')}</button>
 </div>
 {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t('lab.m10theorems_correct_r')} {R.toFixed(2)}</p>}
 {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t('lab.m10theorems_try_r_abc_4')}</p>}
 </div>
 );
}

// --- In-Radius Interactive ---
function InRadiusInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
 const { t } = useTranslate();
 const [a, setA] = useState(5);
 const [b, setB] = useState(6);
 const [c, setC] = useState(7);
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

 const S = (a + b + c) / 2;
 const area = Math.sqrt(S * (S-a) * (S-b) * (S-c));
 const r = area / S;

 const handleCheck = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 setCheckResult(Math.abs(val - r) < 0.1 ? 'correct' : 'incorrect');
 if (Math.abs(val - r) < 0.1) onAnswer(true);
 };

 return (
 <div className="space-y-4">
 <div className="grid grid-cols-3 gap-3">
 <div><label className="text-xs font-semibold">{t('lab.m10theorems_side_a')}</label>
 <input type="range" min="1" max="10" step="0.5" value={a} onChange={e => { setA(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-teal-500" /><span className="text-xs">{a}</span></div>
 <div><label className="text-xs font-semibold">{t('lab.m10theorems_side_b')}</label>
 <input type="range" min="1" max="10" step="0.5" value={b} onChange={e => { setB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-teal-500" /><span className="text-xs">{b}</span></div>
 <div><label className="text-xs font-semibold">{t('lab.m10theorems_side_c')}</label>
 <input type="range" min="1" max="10" step="0.5" value={c} onChange={e => { setC(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-teal-500" /><span className="text-xs">{c}</span></div>
 </div>
 <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3 border border-teal-200 dark:border-teal-800">
 <p className="text-xs text-teal-700 dark:text-teal-300 font-mono">
 
 {t('lab.m10theorems_s')} {S.toFixed(1)}, Δ = {area.toFixed(2)}<br />
 
 {t('lab.m10theorems_r_s')} {area.toFixed(2)} / {S.toFixed(1)} = <strong>{r.toFixed(2)}</strong><br />
 
 {t('lab.m10theorems_check_r_s')} {r.toFixed(2)}×{S.toFixed(1)} = {(r*S).toFixed(2)} = Δ ✓
 </p>
 </div>
 <div className="flex gap-2">
 <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
 placeholder={t('lab.m10theorems_r_4')} step="0.01" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-teal-500 outline-none" />
 <button onClick={handleCheck} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m10theorems_check')}</button>
 </div>
 {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t('lab.m10theorems_correct_r_1')} {r.toFixed(2)}</p>}
 {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t('lab.m10theorems_try_r_s')}</p>}
 </div>
 );
}

// --- Circle Chords Interactive (for Unit 9) ---
function CircleChordInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
 const { t } = useTranslate();
 const [radius, setRadius] = useState(70);
 const [chordOffset, setChordOffset] = useState(20);
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

 const halfChord = Math.sqrt(radius*radius - chordOffset*chordOffset);

 const handleCheck = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 setCheckResult(Math.abs(val - halfChord*2) < 1 ? 'correct' : 'incorrect');
 if (Math.abs(val - halfChord*2) < 1) onAnswer(true);
 };

 return (
 <div className="space-y-4">
 <div className="grid grid-cols-2 gap-3">
 <div><label className="text-xs font-semibold">{t('lab.m10theorems_radius_r')}</label>
 <input type="range" min="30" max="90" step="1" value={radius} onChange={e => { setRadius(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-indigo-500" />
 <span className="text-xs">{radius}</span></div>
 <div><label className="text-xs font-semibold">{t('lab.m10theorems_distance_from_centre')}</label>
 <input type="range" min="0" max={radius-1} step="1" value={chordOffset} onChange={e => { setChordOffset(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-indigo-500" />
 <span className="text-xs">{chordOffset}</span></div>
 </div>
 <div className="relative h-36 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
 <svg viewBox="0 0 160 140" className="w-full h-full">
 <circle cx="80" cy="70" r={radius*0.9} fill="none" stroke="#6366f1" strokeWidth="1.5" />
 <line x1="80" y1={70 - chordOffset*0.9} x2="80" y2={70 + chordOffset*0.9} stroke="#ef4444" strokeWidth="1.5" />
 <circle cx="80" cy="70" r="3" fill="#6366f1" />
 <text x="82" y="68" className="text-[8px] fill-indigo-600">{t('lab.m10theorems_o_centre')}</text>
 <line x1="80" y1="70" x2={80 + Math.sqrt(radius*radius - chordOffset*chordOffset)*0.9} y2={70 - chordOffset*0.9} stroke="#10b981" strokeWidth="1" strokeDasharray="3,3" />
 <text x="130" y="40" className="text-[7px] fill-emerald-600">r</text>
 <text x="82" y={70 - chordOffset*0.9 - 5} className="text-[7px] fill-red-600">{t('lab.m10theorems_perp')}</text>
 </svg>
 </div>
 <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
 <p className="text-xs text-indigo-700 dark:text-indigo-300 font-mono">
 
 {t('lab.m10theorems_chord_half_length_r_d')}{radius}² − {chordOffset}²)<br />
 = √{radius*radius - chordOffset*chordOffset} = {halfChord.toFixed(1)}<br />
 
 {t('lab.m10theorems_full_chord_length_2')} {halfChord.toFixed(1)} = <strong>{(halfChord*2).toFixed(1)}</strong>
 </p>
 </div>
 <div className="flex gap-2">
 <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
 placeholder={t('lab.m10theorems_chord_length')} step="1" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-indigo-500 outline-none" />
 <button onClick={handleCheck} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m10theorems_check')}</button>
 </div>
 {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t('lab.m10theorems_correct_chord')} {(halfChord*2).toFixed(1)}</p>}
 {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t('lab.m10theorems_try_chord_2_r_d')}</p>}
 </div>
 );
}

// --- Tangent + Circle Interactive (for Unit 10) ---
function TangentCircleInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
 const { t } = useTranslate();
 const [r1, setR1] = useState(50);
 const [r2, setR2] = useState(30);
 const [mode, setMode] = useState<'external'|'internal'>('external');
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

 const distance = mode === 'external' ? r1 + r2 : Math.abs(r1 - r2);

 const handleCheck = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 setCheckResult(Math.abs(val - distance) < 1 ? 'correct' : 'incorrect');
 if (Math.abs(val - distance) < 1) onAnswer(true);
 };

 return (
 <div className="space-y-4">
 <div className="flex gap-2 mb-2">
 <button onClick={() => setMode('external')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${mode === 'external' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-[#1c1b1b] text-slate-600'}`}>{t('lab.m10theorems_external_touch')}</button>
 <button onClick={() => setMode('internal')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${mode === 'internal' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-[#1c1b1b] text-slate-600'}`}>{t('lab.m10theorems_internal_touch')}</button>
 </div>
 <div className="grid grid-cols-2 gap-3">
 <div><label className="text-xs font-semibold">{t('lab.m10theorems_radius_r_1')}</label>
 <input type="range" min="20" max="80" step="1" value={r1} onChange={e => { setR1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-purple-500" /><span className="text-xs">{r1}</span></div>
 <div><label className="text-xs font-semibold">{t('lab.m10theorems_radius_r_2')}</label>
 <input type="range" min="10" max="70" step="1" value={r2} onChange={e => { setR2(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-purple-500" /><span className="text-xs">{r2}</span></div>
 </div>
 <div className="relative h-32 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
 <svg viewBox="0 0 200 120" className="w-full h-full">
 {mode === 'external' ? (
 <>
 <circle cx="60" cy="60" r={r1*0.8} fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
 <circle cx={60 + r1*0.8 + r2*0.8 + 5} cy="60" r={r2*0.8} fill="none" stroke="#ec4899" strokeWidth="1.5" />
 <line x1="60" y1="60" x2={60 + r1*0.8 + r2*0.8 + 5} y2="60" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" />
 <text x={60 + (r1*0.8 + r2*0.8 + 5)/2 - 10} y="55" className="text-[8px] fill-amber-600">{t('lab.m10theorems_d_r_r')}</text>
 </>
 ) : (
 <>
 <circle cx="90" cy="60" r={r1*0.8} fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
 <circle cx="90" cy="60" r={r2*0.8} fill="none" stroke="#ec4899" strokeWidth="1.5" />
 <line x1="90" y1="60" x2="90" y2={60 - r1*0.8} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" />
 <text x="92" y={60 - r1*0.8 - 3} className="text-[8px] fill-amber-600">{t('lab.m10theorems_d_r_r_1')}</text>
 </>
 )}
 </svg>
 </div>
 <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
 <p className="text-xs text-purple-700 dark:text-purple-300 font-mono">
 
 {t('lab.m10theorems_r_1')} {r1}{t('lab.m10theorems_r_2')} {r2}<br />
 
 {t('lab.m10theorems_distance_between_centres_d')} {mode === 'external' ? 'r₁ + r₂' : 'r₁ − r₂'} = <strong>{distance}</strong>
 </p>
 </div>
 <div className="flex gap-2">
 <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
 placeholder={t('lab.m10theorems_distance_d')} step="1" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-purple-500 outline-none" />
 <button onClick={handleCheck} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m10theorems_check')}</button>
 </div>
 {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t('lab.m10theorems_correct_d')} {distance}</p>}
 {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t('lab.m10theorems_d')} {mode === 'external' ? 'r₁ + r₂' : 'r₁ − r₂'}</p>}
 </div>
 );
}

// --- Cyclic Quadrilateral Interactive ---
function CyclicQuadInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
 const { t } = useTranslate();
 const [angleA, setAngleA] = useState(70);
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

 const angleC = 180 - angleA;
 const angleB = 110; // fixed for display
 const angleD = 70;

 const handleCheck = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 setCheckResult(Math.abs(val - angleC) < 0.5 ? 'correct' : 'incorrect');
 if (Math.abs(val - angleC) < 0.5) onAnswer(true);
 };

 return (
 <div className="space-y-4">
 <div>
 <label className="text-xs font-semibold">∠A</label>
 <input type="range" min="1" max="179" step="1" value={angleA} onChange={e => { setAngleA(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-cyan-500" />
 <span className="text-xs">{t('lab.m10theorems_a_3')} {angleA}°</span>
 </div>
 <div className="relative h-32 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
 <svg viewBox="0 0 180 120" className="w-full h-full">
 <ellipse cx="90" cy="60" rx="75" ry="50" fill="none" stroke="#06b6d4" strokeWidth="1.5" />
 <polygon points="90,15 155,85 90,105 25,85" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
 <text x="80" y="12" className="text-[10px] fill-amber-600">A={angleA}°</text>
 <text x="150" y="80" className="text-[10px] fill-amber-600">B={angleB}°</text>
 <text x="80" y="112" className="text-[10px] fill-amber-600">C={angleC}°</text>
 <text x="12" y="80" className="text-[10px] fill-amber-600">D={angleD}°</text>
 </svg>
 </div>
 <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-3 border border-cyan-200 dark:border-cyan-800">
 <p className="text-xs text-cyan-700 dark:text-cyan-300 font-mono">
 
 {t('lab.m10theorems_a_c')} {angleA}° + {angleC}° = <strong>180°</strong> ✓<br />
 
 {t('lab.m10theorems_b_d')} {angleB}° + {angleD}° = <strong>180°</strong> ✓<br />
 
 {t('lab.m10theorems_opposite_angles_are_supplement')}
 </p>
 </div>
 <div className="flex gap-2">
 <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
 placeholder={t('lab.m10theorems_c_1')} step="1" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-cyan-500 outline-none" />
 <button onClick={handleCheck} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m10theorems_check')}</button>
 </div>
 {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t('lab.m10theorems_correct_a_c_180')}</p>}
 {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t('lab.m10theorems_try_c_180_a')}</p>}
 </div>
 );
}

// --- Alternate Segment Interactive ---
function AlternateSegmentInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
 const { t } = useTranslate();
 const [angle, setAngle] = useState(40);
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

 const handleCheck = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 setCheckResult(Math.abs(val - angle) < 0.5 ? 'correct' : 'incorrect');
 if (Math.abs(val - angle) < 0.5) onAnswer(true);
 };

 return (
 <div className="space-y-4">
 <div>
 <label className="text-xs font-semibold">{t('lab.m10theorems_apt_angle_between_tangent_and_')}</label>
 <input type="range" min="10" max="80" step="1" value={angle} onChange={e => { setAngle(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-pink-500" />
 <span className="text-xs">{t('lab.m10theorems_apt')} {angle}°</span>
 </div>
 <div className="relative h-32 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
 <svg viewBox="0 0 200 120" className="w-full h-full">
 <circle cx="100" cy="65" r="50" fill="none" stroke="#ec4899" strokeWidth="1.5" />
 <line x1="10" y1="65" x2="140" y2="65" stroke="#f59e0b" strokeWidth="1.5" />
 <circle cx="100" cy="65" r="3" fill="#f59e0b" />
 <text x="132" y="62" className="text-[8px] fill-amber-600">P</text>
 <text x="95" y="62" className="text-[8px] fill-amber-600">A</text>
 <line x1="100" y1="65" x2={100 + 50*Math.cos(angle*Math.PI/180)} y2={65 - 50*Math.sin(angle*Math.PI/180)} stroke="#8b5cf6" strokeWidth="1.5" />
 <text x={100 + 50*Math.cos(angle*Math.PI/180) + 3} y={65 - 50*Math.sin(angle*Math.PI/180) + 3} className="text-[8px] fill-violet-600">B</text>
 <text x="15" y="62" className="text-[8px] fill-slate-500">{t('lab.m10theorems_tangent')}</text>
 </svg>
 </div>
 <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-3 border border-pink-200 dark:border-pink-800">
 <p className="text-xs text-pink-700 dark:text-pink-300 font-mono">
 
 {t('lab.m10theorems_alternate_segment_theorem_apt_')}<br />
 
 {t('lab.m10theorems_apt')} {angle}{t('lab.m10theorems_therefore')} <strong>{t('lab.m10theorems_abp')} {angle}°</strong><br />
 
 {t('lab.m10theorems_the_angle_between_tangent_and_')}
 </p>
 </div>
 <div className="flex gap-2">
 <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
 placeholder={t('lab.m10theorems_abp_1')} step="1" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-pink-500 outline-none" />
 <button onClick={handleCheck} className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m10theorems_check')}</button>
 </div>
 {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t('lab.m10theorems_correct_abp')} {angle}°</p>}
 {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t('lab.m10theorems_abp_equals_apt_in_the_alternat')}</p>}
 </div>
 );
}

// --- Angle in a Semicircle Interactive ---
function SemicircleAngleInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
 const { t } = useTranslate();
 const [position, setPosition] = useState(40);
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

 const x = -40 + position * 0.8;
 const y = Math.sqrt(40*40 - x*x);

 const handleCheck = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 setCheckResult(Math.abs(val - 90) < 1 ? 'correct' : 'incorrect');
 if (Math.abs(val - 90) < 1) onAnswer(true);
 };

 return (
 <div className="space-y-4">
 <div>
 <label className="text-xs font-semibold">{t('lab.m10theorems_point_p_position_on_semicircle')}</label>
 <input type="range" min="0" max="100" step="1" value={position} onChange={e => { setPosition(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
 </div>
 <div className="relative h-36 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
 <svg viewBox="0 0 200 110" className="w-full h-full">
 <path d="M 20,90 A 80,80 0 0,1 180,90" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
 <line x1="20" y1="90" x2="180" y2="90" stroke="#3b82f6" strokeWidth="1" />
 <text x="95" y="105" className="text-[8px] fill-slate-500">{t('lab.m10theorems_diameter_ab')}</text>
 <circle cx={100 + x} cy={90 - y} r="4" fill="#f59e0b" />
 <text x={100 + x + 5} y={90 - y + 3} className="text-[8px] fill-amber-600">P</text>
 <line x1="20" y1="90" x2={100 + x} y2={90 - y} stroke="#8b5cf6" strokeWidth="1" />
 <line x1="180" y1="90" x2={100 + x} y2={90 - y} stroke="#8b5cf6" strokeWidth="1" />
 <text x="15" y="90" className="text-[8px] fill-blue-600">A</text>
 <text x="177" y="90" className="text-[8px] fill-blue-600">B</text>
 <text x={100 + x - 5} y={90 - y - 8} className="text-[8px] fill-amber-600">{t('lab.m10theorems_apb_90')}</text>
 </svg>
 </div>
 <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
 <p className="text-xs text-blue-700 dark:text-blue-300 font-mono">
 
 {t('lab.m10theorems_theorem_the_angle_in_a_semicir')}<br />
 
 {t('lab.m10theorems_no_matter_where_p_is_on_the_se')} <strong>90°</strong>
 </p>
 </div>
 <div className="flex gap-2">
 <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
 placeholder={t('lab.m10theorems_apb')} step="1" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-blue-500 outline-none" />
 <button onClick={handleCheck} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m10theorems_check')}</button>
 </div>
 {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t('lab.m10theorems_correct_angle_in_a_semicircle_')}</p>}
 {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t('lab.m10theorems_the_angle_in_a_semicircle_is_a')}</p>}
 </div>
 );
}

// ========== Theorem Module List ==========

const THEOREMS: TheoremModule[] = [
 // === Unit 2: Quadratic Equations ===
 {
 id: 'quadratic-formula',
 icon: Hash,
 title: 'Derivation of the Quadratic Formula',
 formula: 'x = [-b ± √(b² − 4ac)] / 2a',
 formulaDesc: 'A universal formula to solve any quadratic equation ax² + bx + c = 0.',
 color: 'blue',
 steps: [
 { label: 'Start with standard form', content: '🏗️ You\'re an architect designing a parabolic arch. The curve follows ax² + bx + c = 0. You need a formula that works for ANY arch shape. Start with the general equation: ax² + bx + c = 0.' },
 { label: 'Move constant term', content: 'First, shift the constant to the right: ax² + bx = −c. The arch\'s height (c) doesn\'t affect the shape — it just shifts it up or down.' },
 { label: 'Divide by a', content: 'Divide both sides by a: x² + (b/a)x = −c/a. Now the coefficient of x² is 1, making it easier to "complete the square."' },
 { label: 'Complete the square', content: 'Add (b/2a)² to both sides: x² + (b/a)x + (b/2a)² = (b/2a)² − c/a. The left simplifies to (x + b/2a)². The right becomes (b²−4ac)/(4a²).' },
 { label: 'Take square root and solve', content: 'x + b/2a = ±√(b²−4ac)/(2a). Isolate x: x = [−b ± √(b²−4ac)] / (2a). This is the Quadratic Formula! The discriminant D = b²−4ac tells you everything: D > 0 means 2 real roots (arch crosses ground twice), D = 0 means 1 root (arch just touches ground), D < 0 means no real roots (arch never meets ground).' },
 ],
 interactive: QuadraticFormulaInteractive,
 },

 // === Unit 7: Vectors in Plane ===
 {
 id: 'vector-difference',
 icon: Move3d,
 title: 'Finding a Vector from Position Vectors',
 formula: 'AB = b − a',
 formulaDesc: 'The vector AB equals the position vector of B minus the position vector of A.',
 color: 'amber',
 steps: [
 { label: 'Define position vectors', content: '🗺️ You\'re tracking two delivery drones. Drone A is at (2, 3) and drone B is at (7, 5). Their position vectors from the control tower (origin O) are ã = OA and b⃗ = OB.' },
 { label: 'Use triangle law of addition', content: 'To travel from O to B via A: OA + AB = OB. This is the triangle law of vector addition — the direct path OA plus AB equals the direct path OB.' },
 { label: 'Rearrange for AB', content: 'AB = OB − OA. The vector from A to B is the difference between the two position vectors.' },
 { label: 'Substitute position vectors', content: 'AB = b⃗ − ã = (x₂−x₁, y₂−y₁) = (7−2, 5−3) = (5, 2). The displacement between the drones is 5 units east and 2 units north. Its magnitude |AB| = √(5²+2²) = √29 ≈ 5.39 units. This formula is fundamental in physics: velocity = position_B − position_A / time!' },
 ],
 interactive: VectorDiffInteractive,
 },

 // === Unit 8: Application of Trigonometry ===
 {
 id: 'law-of-cosines',
 icon: Triangle,
 title: 'Law of Cosines',
 formula: 'a² = b² + c² − 2bc cos α',
 formulaDesc: 'Generalizes Pythagoras for ANY triangle, not just right-angled ones.',
 color: 'rose',
 steps: [
 { label: 'Draw altitude AD ⟂ BC', content: '🏔️ You\'re a surveyor measuring a sloped plot of land. Triangle ABC has no right angle, but you can create one! Drop a perpendicular AD from A to side BC, creating two right triangles.' },
 { label: 'Express AD and BD in terms of c', content: 'In right triangle ABD: BD = c cos β and AD = c sin β. The altitude splits side BC (length a) into two segments: BD and DC.' },
 { label: 'Find CD = a − BD', content: 'CD = a − c cos β. This is the remaining base segment of the triangle.' },
 { label: 'Apply Pythagoras in right triangle ADC', content: 'b² = AD² + CD² = (c sin β)² + (a − c cos β)² = c² sin²β + a² + c² cos²β − 2ac cos β.' },
 { label: 'Simplify using sin²+cos²=1', content: 'b² = a² + c²(sin²β + cos²β) − 2ac cos β = a² + c² − 2ac cos β. This is the Law of Cosines! When β = 90°, cos 90° = 0, so it becomes b² = a² + c² — the Pythagorean Theorem! The Law of Cosines is Pythagoras supercharged for ANY triangle.' },
 ],
 interactive: LawCosinesInteractive,
 },
 {
 id: 'law-of-sines',
 icon: Triangle,
 title: 'Law of Sines',
 formula: 'a/sin α = b/sin β = c/sin γ',
 formulaDesc: 'The ratio of a side to the sine of its opposite angle is constant.',
 color: 'sky',
 steps: [
 { label: 'Draw altitude h from B to AC', content: '🌄 A mountain expedition measures a triangular valley. Drop a perpendicular h from vertex B to base AC (extended if needed). This creates two right triangles.' },
 { label: 'Express h in two ways', content: 'In triangle ABD (right-angled at D): h = c sin α. In triangle CBD: h = a sin γ (since sin(π−γ) = sin γ). Both represent the same altitude!' },
 { label: 'Equate the expressions', content: 'c sin α = a sin γ → a/sin α = c/sin γ. The ratio of side a to sin α equals the ratio of side c to sin γ.' },
 { label: 'Repeat for other sides', content: 'By drawing altitudes to other sides, we get a/sin α = b/sin β. Combining all: a/sin α = b/sin β = c/sin γ. This is the Law of Sines. It\'s the foundation of triangulation — GPS satellites use this to pinpoint your location by measuring angles to multiple satellites!' },
 ],
 interactive: LawSinesInteractive,
 },
 {
 id: 'law-of-tangents',
 icon: Triangle,
 title: 'Law of Tangents',
 formula: '(a+b)/(a−b) = tan[(α+β)/2] / tan[(α−β)/2]',
 formulaDesc: 'Relates side lengths to tangent of half angle sums and differences.',
 color: 'indigo',
 steps: [
 { label: 'Start with Law of Sines', content: '📐 From the Law of Sines: a/sin α = b/sin β → a/b = sin α / sin β. This ratio connects side lengths to the sines of their opposite angles.' },
 { label: 'Apply componendo-dividendo', content: 'Using the algebraic property: (a+b)/(a−b) = (sin α + sin β)/(sin α − sin β). This transforms the ratio into a form we can simplify with trig identities.' },
 { label: 'Apply sum-to-product identities', content: 'sin α + sin β = 2 sin[(α+β)/2] cos[(α−β)/2] and sin α − sin β = 2 cos[(α+β)/2] sin[(α−β)/2]. The 2\'s cancel, giving: (a+b)/(a−b) = {sin[(α+β)/2] cos[(α−β)/2]} / {cos[(α+β)/2] sin[(α−β)/2]}.' },
 { label: 'Simplify to tangent ratio', content: 'This simplifies to: (a+b)/(a−b) = tan[(α+β)/2] / tan[(α−β)/2]. The Law of Tangents! It\'s especially useful in surveying and navigation when you know two sides and the included angle, or two angles and a side — it avoids needing a calculator for square roots!' },
 ],
 interactive: LawCosinesInteractive,
 },
 {
 id: 'half-angle-cosine',
 icon: Square,
 title: 'Half Angle Formula for Cosines',
 formula: 'cos(α/2) = √[S(S−a)/bc]',
 formulaDesc: 'Express half-angle cosines directly in terms of side lengths.',
 color: 'emerald',
 steps: [
 { label: 'Start with Law of Cosines', content: '📊 Start with cos α = (b²+c²−a²)/(2bc). This gives cos of the full angle α in terms of the three side lengths.' },
 { label: 'Use double-angle identity', content: 'The double-angle identity says cos α = 2cos²(α/2) − 1. Substitute the Law of Cosines: 2cos²(α/2) − 1 = (b²+c²−a²)/(2bc).' },
 { label: 'Solve for cos²(α/2)', content: '2cos²(α/2) = 1 + (b²+c²−a²)/(2bc) = (2bc + b² + c² − a²)/(2bc) = [(b+c)² − a²]/(2bc).' },
 { label: 'Factor and substitute S', content: '[(b+c)² − a²] = (b+c+a)(b+c−a). Since a+b+c = 2S (the semi-perimeter), and b+c−a = 2(S−a), we get: 2cos²(α/2) = [2S × 2(S−a)]/(2bc). Divide by 2 and take the square root: cos(α/2) = √[S(S−a)/(bc)]. This formula is elegant — it expresses a trigonometric ratio purely in terms of side lengths, no angles needed!' },
 ],
 interactive: HerosFormulaInteractive,
 },
 {
 id: 'half-angle-sine',
 icon: Square,
 title: 'Half Angle Formula for Sines',
 formula: 'sin(α/2) = √[(S−b)(S−c)/bc]',
 formulaDesc: 'Express half-angle sines directly in terms of side lengths.',
 color: 'emerald',
 steps: [
 { label: 'Use identity 1−2sin²(α/2) = cos α', content: '🔄 Starting with the identity cos α = 1 − 2sin²(α/2), substitute the Law of Cosines: 1 − 2sin²(α/2) = (b²+c²−a²)/(2bc).' },
 { label: 'Solve for sin²(α/2)', content: '2sin²(α/2) = 1 − (b²+c²−a²)/(2bc) = (2bc − b² − c² + a²)/(2bc) = [a² − (b−c)²]/(2bc).' },
 { label: 'Factor as difference of squares', content: 'a² − (b−c)² = (a−b+c)(a+b−c). Using semi-perimeter S: a−b+c = 2(S−b) and a+b−c = 2(S−c).' },
 { label: 'Substitute and simplify', content: '2sin²(α/2) = [2(S−b) × 2(S−c)]/(2bc). Divide by 2 and take square root: sin(α/2) = √[(S−b)(S−c)/(bc)]. Together with the cosine half-angle formula, these form the basis for Hero\'s formula and are used extensively in navigation and astronomy!' },
 ],
 interactive: HerosFormulaInteractive,
 },
 {
 id: 'area-sas',
 icon: Square,
 title: 'Area of a Triangle (SAS)',
 formula: 'Δ = ½ bc sin α',
 formulaDesc: 'The area of a triangle using two sides and the included angle.',
 color: 'violet',
 steps: [
 { label: 'Basic area formula', content: '🌳 A land surveyor measures a triangular plot. They know two sides (b and c) and the angle between them (α). The basic area formula is: Area = ½ × base × height.' },
 { label: 'Identify base and height', content: 'Take side c = AB as the base. The height is the perpendicular from C to AB, which is h = b sin α (from right triangle ACD).' },
 { label: 'Substitute into area formula', content: 'Area = ½ × AB × h = ½ × c × (b sin α) = ½ bc sin α. This is the SAS (Side-Angle-Side) area formula. If α = 90°, sin 90° = 1, so Area = ½ bc — the familiar right triangle area formula!' },
 ],
 interactive: LawCosinesInteractive,
 },
 {
 id: 'area-aas',
 icon: Square,
 title: 'Area of a Triangle (AAS)',
 formula: 'Δ = ½ a² sin β sin γ / sin α',
 formulaDesc: 'The area of a triangle using one side and two angles.',
 color: 'violet',
 steps: [
 { label: 'Start with SAS formula', content: '📋 When you know two angles (β, γ) and the included side a (AAS), you can still find area. Start from Area = ½ ab sin γ.' },
 { label: 'Use Law of Sines to find b', content: 'From Law of Sines: b/sin β = a/sin α → b = a sin β / sin α. This expresses side b in terms of known angles and side a.' },
 { label: 'Substitute into area formula', content: 'Area = ½ a × (a sin β / sin α) × sin γ = ½ a² (sin β sin γ) / sin α. This is the AAS area formula. It\'s perfect when you can\'t measure both adjacent sides but you can measure angles — like measuring a mountain\'s profile from a distance!' },
 ],
 interactive: LawSinesInteractive,
 },
 {
 id: 'heros-formula',
 icon: Square,
 title: "Hero's Formula (SSS)",
 formula: 'Δ = √[S(S−a)(S−b)(S−c)]',
 formulaDesc: 'The area of a triangle from its three side lengths alone.',
 color: 'emerald',
 steps: [
 { label: 'Start with area = ½ bc sin α', content: '📏 You\'ve measured all three sides of a triangular garden: a=5m, b=6m, c=7m. You need the area but don\'t know any angles. Start with Δ = ½ bc sin α.' },
 { label: 'Write sin α = 2 sin(α/2) cos(α/2)', content: 'Using the double-angle identity: sin α = 2 sin(α/2) cos(α/2). So Δ = bc × sin(α/2) × cos(α/2).' },
 { label: 'Substitute half-angle formulas', content: 'Substitute sin(α/2) = √[(S−b)(S−c)/(bc)] and cos(α/2) = √[S(S−a)/(bc)]. The bc factors outside the radicals multiply: bc × √[(S−b)(S−c)/(bc)] × √[S(S−a)/(bc)].' },
 { label: 'Simplify to Hero\'s formula', content: 'bc × 1/(bc) × √[S(S−a)(S−b)(S−c)] = √[S(S−a)(S−b)(S−c)]. This is Hero\'s (or Heron\'s) formula! For our garden: S = (5+6+7)/2 = 9, Area = √[9×4×3×2] = √216 ≈ 14.7m². This 2,000-year-old formula, discovered by Hero of Alexandria, requires ONLY side lengths — no angles, no trigonometry!' },
 ],
 interactive: HerosFormulaInteractive,
 },
 {
 id: 'circum-radius',
 icon: Circle,
 title: 'Circum-Radius of a Triangle',
 formula: 'R = abc / (4Δ)',
 formulaDesc: 'The radius of the circle passing through all three vertices of a triangle.',
 color: 'orange',
 steps: [
 { label: 'Draw circumscribed circle', content: '🌍 Imagine drawing a circle that passes through all three vertices of a triangle. This is the circumcircle, and its centre O is the circumcentre. Draw diameter BD.' },
 { label: 'Connect D to C', content: 'In the circumcircle, α (angle at A) and ∠BDC are angles in the same segment, so ∠BDC = α. Triangle BCD is right-angled at C (angle in a semicircle).' },
 { label: 'Apply sine in right triangle BCD', content: 'In right triangle BCD: BC/BD = sin(∠BDC) = sin α. Since BC = a and BD = 2R: a/(2R) = sin α → R = a/(2 sin α).' },
 { label: 'Express in terms of sides and area', content: 'From area formula: Δ = ½ bc sin α → sin α = 2Δ/(bc). Substituting: R = a/(2 × 2Δ/(bc)) = abc/(4Δ). The circumradius relates all three sides and the area! For an equilateral triangle, R = a/√3. The larger the triangle, the larger the circumcircle!' },
 ],
 interactive: CircumRadiusInteractive,
 },
 {
 id: 'in-radius',
 icon: Circle,
 title: 'In-Radius of a Triangle',
 formula: 'r = Δ / S',
 formulaDesc: 'The radius of the circle inscribed inside a triangle.',
 color: 'teal',
 steps: [
 { label: 'Draw the incircle', content: '🎯 The incircle touches all three sides of a triangle from the inside. Its centre I (the incentre) is the intersection of the angle bisectors. The perpendicular distances from I to each side are all equal to r.' },
 { label: 'Split triangle into three', content: 'The incentre I divides ΔABC into three smaller triangles: IAB, IBC, and IAC. Each has a height of r (the inradius).' },
 { label: 'Sum the areas', content: 'Total area Δ = Area(IBC) + Area(IAC) + Area(IAB) = ½ar + ½br + ½cr = r(a+b+c)/2.' },
 { label: 'Solve for r', content: 'Since S = (a+b+c)/2 (semi-perimeter), we get Δ = rS → r = Δ/S. The inradius is the ratio of the area to the semi-perimeter! For a right triangle with legs 3 and 4 (hypotenuse 5): Δ = 6, S = 6, so r = 1. The incircle has radius 1. This formula is used to find the radius of a pizza that fits exactly inside a triangular box!' },
 ],
 interactive: InRadiusInteractive,
 },
 {
 id: 'ex-radius',
 icon: Circle,
 title: 'E-Radius of a Triangle',
 formula: 'r₁ = Δ / (S−a)',
 formulaDesc: 'The radius of the excircle opposite vertex A.',
 color: 'teal',
 steps: [
 { label: 'Draw the excircle opposite A', content: '🔵 An excircle touches one side of the triangle and the extensions of the other two sides. The ex-centre I₁ is opposite vertex A. Draw it and connect to all three vertices.' },
 { label: 'Split into three regions', content: 'The ex-centre I₁ creates three regions: I₁AB, I₁AC (outside the triangle), and I₁BC (partially inside). The total area Δ = Area(I₁AB) + Area(I₁AC) − Area(I₁BC).' },
 { label: 'Substitute base×height/2', content: 'Δ = ½cr₁ + ½br₁ − ½ar₁ = ½r₁(b + c − a). Watch the minus sign — I₁BC is partially outside the original triangle!' },
 { label: 'Simplify using S', content: 'b + c − a = (a+b+c) − 2a = 2S − 2a = 2(S−a). So Δ = ½r₁ × 2(S−a) = r₁(S−a). Rearranging: r₁ = Δ/(S−a). Similarly, r₂ = Δ/(S−b) and r₃ = Δ/(S−c). Exradii are larger than the inradius and are used in advanced geometry proofs and triangle geometry problems!' },
 ],
 interactive: InRadiusInteractive,
 },

 // === Unit 9: Chords and Arcs of a Circle ===
 {
 id: 'three-point-circle',
 icon: Circle,
 title: 'Theorem 9.1: Three Non-Collinear Points Determine a Circle',
 formula: 'One and only one circle passes through three non-collinear points.',
 formulaDesc: 'Three points that are not on a line uniquely define a circle.',
 color: 'indigo',
 steps: [
 { label: 'Take three non-collinear points', content: '📍 Pick any three points A, B, C that don\'t lie on a straight line — like three trees in a park that aren\'t in a row. Connect them to form a triangle.' },
 { label: 'Draw perpendicular bisectors', content: 'Draw the perpendicular bisectors of any two sides. Where these bisectors meet is a single point O. This works because the bisectors of any triangle always intersect at exactly one point.' },
 { label: 'O is equidistant from all three', content: 'Since O lies on the perpendicular bisector of AB, it\'s equidistant from A and B. Since it also lies on the bisector of BC, it\'s equidistant from B and C. Therefore OA = OB = OC = R.' },
 { label: 'Draw the circle', content: 'With centre O and radius OA, draw the circle. It passes through A, B, and C perfectly. If the points were collinear (on a line), the perpendicular bisectors would be parallel and never meet — proving that three points on a line can never lie on a circle!' },
 ],
 interactive: CircleChordInteractive,
 },
 {
 id: 'centre-bisects-chord',
 icon: Circle,
 title: 'Theorem 9.2: Centre to Midpoint of Chord is Perpendicular',
 formula: 'If OC ⟂ AB then AC = BC where O is centre.',
 formulaDesc: 'A line from the centre to the midpoint of a chord is perpendicular to the chord.',
 color: 'indigo',
 steps: [
 { label: 'Draw chord AB with midpoint C', content: '⚽ Take a chord AB on a circle. Mark its midpoint C. Draw a line from the centre O to C.' },
 { label: 'Join OA and OB', content: 'OA and OB are radii, so OA = OB. Triangle OAB is isosceles with apex at O.' },
 { label: 'Use properties of isosceles triangle', content: 'In isosceles triangle OAB, the line from O to the midpoint C of the base AB is also the altitude (perpendicular). So OC ⟂ AB.' },
 { label: 'The perpendicular property', content: 'Therefore, the line from the centre to the midpoint of a chord is perpendicular to the chord. This is a key property used in circle geometry to find chord lengths and distances from the centre. It\'s why a spirit level works — the bubble\'s centre line is perpendicular to the surface!' },
 ],
 interactive: CircleChordInteractive,
 },
 {
 id: 'perp-bisects-chord',
 icon: Circle,
 title: 'Theorem 9.3: Perpendicular from Centre Bisects Chord',
 formula: 'If OC ⟂ AB then C is the midpoint of chord AB.',
 formulaDesc: 'The perpendicular from the centre to a chord bisects it.',
 color: 'indigo',
 steps: [
 { label: 'Draw chord AB and perpendicular from O', content: '🎯 Draw a chord AB and a perpendicular from centre O to meet AB at C (∠OCA = 90°).' },
 { label: 'Join OA and OB', content: 'OA and OB are radii, so OA = OB. Triangle OAB is isosceles.' },
 { label: 'Prove triangles OAC and OBC are congruent', content: 'OA = OB (radii), OC = OC (common side), and ∠OCA = ∠OCB = 90°. So triangle OAC ≅ OBC by RHS congruence. Therefore AC = BC.' },
 { label: 'C is the midpoint', content: 'Since AC = BC, C is the midpoint of chord AB. The perpendicular from the centre to a chord bisects it. This is the converse of Theorem 9.2. Together, these two theorems are the foundation of all chord calculations — used in designing arches, bridges, and circular structures!' },
 ],
 interactive: CircleChordInteractive,
 },
 {
 id: 'equal-chords-equal-distance',
 icon: Circle,
 title: 'Theorem 9.4: Equal Chords are Equidistant from Centre',
 formula: 'AB = CD ⇔ OE = OF (where E, F are midpoints)',
 formulaDesc: 'Equal chords are at the same distance from the centre.',
 color: 'indigo',
 steps: [
 { label: 'Draw two equal chords', content: '✏️ Draw two chords AB and CD of equal length. Draw perpendiculars OE and OF from the centre to each chord.' },
 { label: 'Apply perpendicular bisector property', content: 'By Theorem 9.3, E is the midpoint of AB and F is the midpoint of CD. So AE = AB/2 and CF = CD/2. Since AB = CD, we have AE = CF.' },
 { label: 'Use Pythagoras in triangles', content: 'In right triangles OAE and OCF: OE² = OA² − AE² and OF² = OC² − CF². Since OA = OC (radii) and AE = CF, we get OE² = OF², so OE = OF.' },
 { label: 'Equal chords are equidistant', content: 'Therefore, equal chords are equidistant from the centre. Imagine two guitar strings (chords) of the same length — they\'re the same distance from the centre of the circular sound hole. This is used in engineering to balance forces in circular structures!' },
 ],
 interactive: CircleChordInteractive,
 },
 {
 id: 'equidistant-chords-equal',
 icon: Circle,
 title: 'Theorem 9.5: Equidistant Chords are Congruent',
 formula: 'OE = OF ⇒ AB = CD',
 formulaDesc: 'Chords at equal distance from the centre are equal in length.',
 color: 'indigo',
 steps: [
 { label: 'Draw chords at equal distance', content: '🎪 Draw two chords AB and CD such that their perpendicular distances from the centre (OE and OF) are equal.' },
 { label: 'Use Pythagoras', content: 'In right triangles OAE and OCF: AE² = OA² − OE² and CF² = OC² − OF². Since OA = OC (radii) and OE = OF, we get AE² = CF², so AE = CF.' },
 { label: 'Double the half-lengths', content: 'Since E and F are midpoints (Theorem 9.3): AB = 2×AE and CD = 2×CF. Since AE = CF, we get AB = CD.' },
 { label: 'Converse is also true', content: 'This is the converse of Theorem 9.4. Together they form an \"if and only if\" relationship: chords are equal IF AND ONLY IF they are equidistant from the centre. This symmetry is fundamental in circle geometry and is used in designing circular grids and radial structures!' },
 ],
 interactive: CircleChordInteractive,
 },
 {
 id: 'congruent-arcs-equal-chords',
 icon: Circle,
 title: 'Theorem 9.6: Congruent Arcs → Equal Chords',
 formula: 'Arc AB ≅ Arc CD ⇒ AB = CD',
 formulaDesc: 'Congruent arcs subtend equal chords.',
 color: 'indigo',
 steps: [
 { label: 'Take two congruent arcs', content: '🎵 Imagine two identical arcs on a circle — like two equal-length curved sections of a circular railway track.' },
 { label: 'Fold one arc onto the other', content: 'Since the arcs are congruent, you can rotate the circle so that one arc exactly coincides with the other. The endpoints of the arcs match up.' },
 { label: 'Chords connect corresponding endpoints', content: 'The chords AB and CD are the straight-line distances between the arc endpoints. Since the arcs perfectly overlap, the endpoints coincide, and so the chords must be equal.' },
 { label: 'Equal chords', content: 'Therefore, congruent arcs have equal chords. This is used in gear design — equal gear teeth (arcs) must have equal chord lengths for smooth meshing. In map-making, equal arcs of latitude and longitude create equal chords on the globe!' },
 ],
 interactive: CircleChordInteractive,
 },
 {
 id: 'equal-chords-congruent-arcs',
 icon: Circle,
 title: 'Theorem 9.7: Equal Chords → Congruent Arcs',
 formula: 'AB = CD ⇒ Arc AB ≅ Arc CD',
 formulaDesc: 'Equal chords subtend congruent arcs.',
 color: 'indigo',
 steps: [
 { label: 'Draw two equal chords', content: '🔗 Draw two equal chords AB and CD on a circle. For example, two equal-length strings on a circular instrument.' },
 { label: 'Join centre to endpoints', content: 'Join OA, OB, OC, OD. Since OA = OB = OC = OD = r (radii) and AB = CD (given), triangles OAB and OCD are congruent by SSS.' },
 { label: 'Central angles are equal', content: 'From congruency: ∠AOB = ∠COD. The central angles subtended by the chords are equal.' },
 { label: 'Equal central angles mean equal arcs', content: 'The measure of an arc equals the measure of its central angle. Since ∠AOB = ∠COD, the arcs AB and CD are congruent. This completes the cycle: equal chords ↔ equal central angles ↔ congruent arcs!' },
 ],
 interactive: CircleChordInteractive,
 },
 {
 id: 'equal-chords-equal-angles',
 icon: Circle,
 title: 'Theorem 9.8: Equal Chords → Equal Angles at Centre',
 formula: 'AB = CD ⇒ ∠AOB = ∠COD',
 formulaDesc: 'Equal chords subtend equal angles at the centre.',
 color: 'indigo',
 steps: [
 { label: 'Draw two equal chords', content: '🎯 Draw two equal chords AB and CD in a circle. Connect their endpoints to the centre O.' },
 { label: 'Compare triangles', content: 'In triangles OAB and OCD: OA = OC (radii), OB = OD (radii), and AB = CD (given). So triangles OAB ≅ OCD by SSS congruence.' },
 { label: 'Corresponding angles are equal', content: 'From the congruence, ∠AOB (corresponding to ∠COD) = ∠COD.' },
 { label: 'Equal central angles', content: 'Therefore, equal chords subtend equal angles at the centre. Picture a pizza sliced into equal-width crust pieces — equal chords around the edge mean equal central angles, giving you equal-sized slices! This theorem is why equal spacing on a circle creates equal angles, fundamental in polygon construction.' },
 ],
 interactive: CircleChordInteractive,
 },
 {
 id: 'equal-angles-equal-chords',
 icon: Circle,
 title: 'Theorem 9.9: Equal Central Angles → Equal Chords',
 formula: '∠AOB = ∠COD ⇒ AB = CD',
 formulaDesc: 'Equal angles at the centre subtend equal chords.',
 color: 'indigo',
 steps: [
 { label: 'Draw chords with equal central angles', content: '📐 Draw two chords AB and CD such that the central angles ∠AOB = ∠COD are equal.' },
 { label: 'Compare triangles', content: 'In triangles OAB and OCD: OA = OC (radii), OB = OD (radii), and ∠AOB = ∠COD (given). So triangles OAB ≅ OCD by SAS congruence.' },
 { label: 'Corresponding sides are equal', content: 'From the congruence, AB (corresponding to CD) = CD.' },
 { label: 'Converse is proved', content: 'This completes the set: Theorems 9.8 and 9.9 together prove that chords and their central angles have a perfect one-to-one correspondence. Equal chords ↔ equal central angles. This is used in engineering to create evenly spaced holes on a circular flange!' },
 ],
 interactive: CircleChordInteractive,
 },

 // === Unit 10: Tangents and Angles of a Circle ===
 {
 id: 'perp-radius-tangent',
 icon: Circle,
 title: 'Theorem 10.1: Perpendicular to Radius = Tangent',
 formula: 'If line ⟂ radius at outer endpoint, then it is a tangent.',
 formulaDesc: 'A line perpendicular to a radius at its endpoint on the circle is a tangent.',
 color: 'purple',
 steps: [
 { label: 'Draw radius and perpendicular line', content: '🔄 Draw a radial segment OA from centre O to point A on the circle. Draw a line PQ perpendicular to OA at the outer end A.' },
 { label: 'Check distance from centre', content: 'Since PQ ⟂ OA, the distance from centre O to any point on PQ is at least OA (perpendicular distance is shortest). The distance from O to any other point on PQ is > OA = radius.' },
 { label: 'Only one intersection point', content: 'Since the distance from O to any point on PQ (other than A) is greater than the radius, no other point of PQ lies on the circle. So PQ touches the circle at exactly one point A.' },
 { label: 'PQ is a tangent', content: 'By definition, a line that touches a circle at exactly one point is a tangent. So PQ is tangent to the circle at A. This is the construction method for tangents — simply draw a perpendicular at the endpoint of a radius!' },
 ],
 interactive: TangentCircleInteractive,
 },
 {
 id: 'tangent-perp-radius',
 icon: Circle,
 title: 'Theorem 10.2: Tangent ⟂ Radius at Point of Contact',
 formula: 'Tangent at a point is perpendicular to the radius at that point.',
 formulaDesc: 'The tangent and the radius at the point of contact are perpendicular.',
 color: 'purple',
 steps: [
 { label: 'Draw tangent and radius', content: '⭕ Draw a circle with centre O. Draw a tangent PQ touching the circle at point B. Draw the radial segment OB.' },
 { label: 'Assume not perpendicular (proof by contradiction)', content: 'Suppose OB is NOT perpendicular to PQ. Then there exists another point on PQ that is closer to O than B (the shortest distance from O to PQ would be elsewhere, not at B).' },
 { label: 'This other point would be inside the circle', content: 'If another point C on PQ is closer to O than OB (the radius), then OC < OB = radius, meaning C lies INSIDE the circle. So PQ would intersect the circle at two points — B and some other point.' },
 { label: 'Contradiction — PQ must be a tangent', content: 'But PQ is a tangent, which by definition touches the circle at only ONE point. This contradiction proves that OB MUST be perpendicular to PQ. Therefore, the radius and tangent at the point of contact are always perpendicular. This is why a bicycle wheel\'s spokes (radii) are perpendicular to the ground (tangent) at the contact point!' },
 ],
 interactive: TangentCircleInteractive,
 },
 {
 id: 'equal-tangents',
 icon: Circle,
 title: 'Theorem 10.3: Two Tangents from External Point are Equal',
 formula: 'AB = AC (tangents from A to circle)',
 formulaDesc: 'The lengths of two tangents from an external point to a circle are equal.',
 color: 'purple',
 steps: [
 { label: 'Draw tangents from external point', content: '📍 Take a point A outside the circle. Draw two tangents AB and AC touching the circle at B and C.' },
 { label: 'Join centre O to points', content: 'Join OA, OB, and OC. Since tangents are perpendicular to radii (Theorem 10.2): OB ⟂ AB and OC ⟂ AC, so ∠OBA = ∠OCA = 90°.' },
 { label: 'Prove triangles congruent', content: 'In right triangles OBA and OCA: OB = OC (radii), OA = OA (common side), and ∠OBA = ∠OCA = 90°. So triangles OBA ≅ OCA by RHS congruence.' },
 { label: 'AB = AC', content: 'From the congruence, AB = AC. The two tangents from an external point are equal! This is why when you draw two tangents from a point to a circle, they\'re always the same length. This property is used in geometry problems involving tangent lengths and in designing V-belt drives around pulleys!' },
 ],
 interactive: TangentCircleInteractive,
 },
 {
 id: 'external-touching-circles',
 icon: Circle,
 title: 'Theorem 10.4: Externally Touching Circles',
 formula: 'd = r₁ + r₂ (distance between centres)',
 formulaDesc: 'If circles touch externally, the distance between centres equals the sum of radii.',
 color: 'purple',
 steps: [
 { label: 'Draw two circles touching externally', content: '🔵🔵 Draw two circles with centres A and B, radii r₁ = 2cm and r₂ = 1cm, that touch each other at exactly one point C.' },
 { label: 'Identify the point of contact', content: 'The circles touch at point C, which lies on the line connecting the centres A and B. This is because the shortest distance between A and B passes through the point of contact.' },
 { label: 'A to C = r₁, B to C = r₂', content: 'AC is the radius of circle A (r₁ = 2cm). BC is the radius of circle B (r₂ = 1cm). Since C lies on line AB: AB = AC + BC = r₁ + r₂.' },
 { label: 'Distance equals sum', content: 'AB = 2 + 1 = 3 cm. Therefore, if two circles touch externally, the distance between their centres equals the sum of their radii. This is why when two soap bubbles merge, their centres are separated by the sum of their radii!' },
 ],
 interactive: TangentCircleInteractive,
 },
 {
 id: 'internal-touching-circles',
 icon: Circle,
 title: 'Theorem 10.5: Internally Touching Circles',
 formula: 'd = |r₁ − r₂| (distance between centres)',
 formulaDesc: 'If circles touch internally, the distance equals the difference of radii.',
 color: 'purple',
 steps: [
 { label: 'Draw two circles touching internally', content: '⭕🔵 Draw two circles — one larger (radius r₁ = 3cm, centre A) and one smaller (radius r₂ = 1cm, centre B) inside it, touching at exactly one point C.' },
 { label: 'Point of contact on the line of centres', content: 'The circles touch at C, which lies on the line AB. The smaller circle is inside the larger one.' },
 { label: 'AC = r₁ (outer radius), BC = r₂ (inner radius)', content: 'For the outer circle: AC = r₁ = 3cm. For the inner circle: BC = r₂ = 1cm. Since B lies inside and C is on the boundary: AB = AC − BC = r₁ − r₂.' },
 { label: 'Distance equals difference', content: 'AB = 3 − 1 = 2 cm. If circles touch internally, the distance between centres equals the difference of their radii. This principle is used in ball bearings — the inner race (small circle) touches the outer race (large circle) internally!' },
 ],
 interactive: TangentCircleInteractive,
 },
 {
 id: 'alternate-segment',
 icon: Circle,
 title: 'Theorem 10.6: Alternate Segment Theorem',
 formula: '∠APT = ∠ABP (between tangent and chord)',
 formulaDesc: 'Angle between tangent and chord equals angle in the alternate segment.',
 color: 'pink',
 steps: [
 { label: 'Draw tangent and chord', content: '🎯 Draw a circle with tangent PT at point A. Draw chord AB through A, creating angle ∠APT between the tangent and chord.' },
 { label: 'Identify alternate segment', content: 'The chord AB divides the circle into two segments. The \"alternate segment\" is the one on the opposite side of the chord from the tangent. Pick any point P on that alternate arc.' },
 { label: 'Measure both angles', content: '∠APT is the angle between the tangent PT and chord PA. ∠ABP is the angle in the alternate segment (the angle subtended by the same chord AP at point B on the alternate arc). Measuring shows ∠APT = ∠ABP.' },
 { label: 'Equality holds', content: 'The angle between a tangent and a chord through the point of contact equals the angle in the alternate segment. This is one of the most beautiful theorems in circle geometry! It\'s used in navigation — sailors use the angle between a coastline (tangent) and a line to a lighthouse (chord) to determine their position!' },
 ],
 interactive: AlternateSegmentInteractive,
 },
 {
 id: 'central-angle-theorem',
 icon: Circle,
 title: 'Theorem 10.7: Central Angle = 2 × Inscribed Angle',
 formula: '∠COD = 2∠CED (on the major arc)',
 formulaDesc: 'The central angle is double any inscribed angle subtended by the same arc.',
 color: 'cyan',
 steps: [
 { label: 'Draw central and inscribed angles', content: '📐 Draw a circle with centre O and chord CD. Draw the central angle ∠COD. Pick point E on the major arc (opposite side of CD from O). Draw inscribed angle ∠CED.' },
 { label: 'Join OE and extend', content: 'Join O to E and extend to point F on the opposite side. Now ∠COD = ∠COF − ∠DOF. But ∠COF = 2∠CEO (exterior angle = sum of opposite interior angles of triangle COE, and OC = OE makes it isosceles).' },
 { label: 'Apply isosceles triangle properties', content: 'Since OC = OE (radii), triangle COE is isosceles. The exterior angle ∠COF = ∠CEO + ∠OCE = 2∠CEO. Similarly, ∠DOF = 2∠DEO.' },
 { label: 'Central = 2 × inscribed', content: '∠COD = 2∠CEO + 2∠DEO = 2(∠CEO + ∠DEO) = 2∠CED. The central angle ALWAYS equals twice the inscribed angle subtended by the same arc. This is why the angle in a semicircle is 90° — the central angle is 180° (a straight line), so the inscribed angle is 90°!' },
 ],
 interactive: SemicircleAngleInteractive,
 },
 {
 id: 'same-segment-angles',
 icon: Circle,
 title: 'Theorem 10.8: Angles in Same Segment are Equal',
 formula: '∠ACB = ∠ADB = ∠AEB (same segment)',
 formulaDesc: 'All angles subtended by a chord in the same segment are equal.',
 color: 'cyan',
 steps: [
 { label: 'Take chord AB and points on same segment', content: '🎯 Draw a chord AB. Take three points C, D, E on the SAME segment (major or minor) of the circle. For example, all on the major arc AB.' },
 { label: 'Measure inscribed angles', content: 'Measure angles ∠ACB, ∠ADB, and ∠AEB — all subtended by chord AB at points C, D, and E.' },
 { label: 'All angles are equal', content: 'Each of these angles equals HALF the central angle ∠AOB (by Theorem 10.7). Since they all equal half of the same central angle, they must be equal to each other!' },
 { label: 'Angles in same segment are equal', content: 'Therefore, ∠ACB = ∠ADB = ∠AEB. All angles in the same segment of a circle are equal. This is why any point on a circular arc \"sees\" a chord at the same angle — it\'s the principle behind the \"goal line\" in circular sports stadiums!' },
 ],
 interactive: SemicircleAngleInteractive,
 },
 {
 id: 'angle-in-semicircle',
 icon: Circle,
 title: 'Theorem 10.9: Angle in a Semicircle is a Right Angle',
 formula: '∠APB = 90° (where AB is diameter)',
 formulaDesc: 'An angle inscribed in a semicircle is always 90°.',
 color: 'blue',
 steps: [
 { label: 'Draw a semicircle with diameter AB', content: '🌓 Draw a circle with diameter AB (passing through centre O). Take any point P on the semicircle arc.' },
 { label: 'Apply central angle theorem', content: 'The central angle for chord AB is ∠AOB = 180° (a straight line through the diameter). By Theorem 10.7, the inscribed angle ∠APB = ½ × ∠AOB = ½ × 180° = 90°.' },
 { label: 'No matter where P is', content: 'This works for ANY point P on the semicircle! Move P anywhere along the arc, and ∠APB always equals 90°.' },
 { label: 'Thales\' theorem', content: 'This theorem is attributed to Thales of Miletus (c. 600 BCE), making it one of the oldest known mathematical theorems. It\'s the foundation for constructing right angles (used by Egyptian pyramid builders!) and is the basis for the \"circle of possibilities\" — any point P on the circle gives a right angle. This is used in GPS triangulation and even in finding the optimal location for a cell tower!' },
 ],
 interactive: SemicircleAngleInteractive,
 },
 {
 id: 'major-segment-acute',
 icon: Circle,
 title: 'Theorem 10.10: Angle in Major Segment < 90°',
 formula: '∠APB < 90° (major segment)',
 formulaDesc: 'An angle in a segment greater than a semicircle is acute.',
 color: 'cyan',
 steps: [
 { label: 'Draw a chord AB forming a major segment', content: '📐 Draw chord AB that creates a major segment (larger than a semicircle). Take points P, Q, R on the major arc.' },
 { label: 'Measure inscribed angles', content: 'Measure ∠APB, ∠AQB, and ∠ARB. Each of these angles is less than the angle in a semicircle (90°).' },
 { label: 'Central angle is less than 180°', content: 'The central angle ∠AOB subtended by the major segment is less than 180°. By Theorem 10.7: ∠APB = ½∠AOB < ½ × 180° = 90°.' },
 { label: 'All angles are acute', content: 'Therefore, all angles in a major segment (greater than a semicircle) are acute (< 90°). This helps determine the nature of angles in circular segments — useful in architectural design of arches and domes!' },
 ],
 interactive: SemicircleAngleInteractive,
 },
 {
 id: 'minor-segment-obtuse',
 icon: Circle,
 title: 'Theorem 10.11: Angle in Minor Segment > 90°',
 formula: '∠APB > 90° (minor segment)',
 formulaDesc: 'An angle in a segment less than a semicircle is obtuse.',
 color: 'cyan',
 steps: [
 { label: 'Draw a chord forming a minor segment', content: '📐 Draw chord AB that forms a minor segment (smaller than a semicircle). Take points on the minor arc.' },
 { label: 'Central angle is > 180°', content: 'The central angle ∠AOB subtended by the minor segment is GREATER than 180° (the major central angle). By Theorem 10.7: ∠APB = ½ × (major central angle) > ½ × 180° = 90°.' },
 { label: 'All angles are obtuse', content: 'Therefore, all angles inscribed in a minor segment (less than a semicircle) are obtuse (> 90°).' },
 { label: 'Complete classification', content: 'Combined with Theorem 10.10: angle in a major segment < 90° < angle in a minor segment. The semicircle at exactly 90° is the boundary between acute and obtuse. This complete classification is a beautiful geometric result and explains why right angles are so special in circle geometry!' },
 ],
 interactive: SemicircleAngleInteractive,
 },
 {
 id: 'cyclic-quadrilateral',
 icon: Circle,
 title: 'Theorem 10.12: Opposite Angles of Cyclic Quadrilateral are Supplementary',
 formula: '∠A + ∠C = 180°, ∠B + ∠D = 180°',
 formulaDesc: 'The sum of opposite angles in a cyclic quadrilateral is 180°.',
 color: 'cyan',
 steps: [
 { label: 'Draw a cyclic quadrilateral ABCD', content: '🔷 Draw a quadrilateral ABCD inscribed in a circle (all four vertices on the circle). This is called a cyclic quadrilateral.' },
 { label: 'Join centre O to vertices', content: 'Join O to A, B, C, D. The central angle subtended by arc BCD is ∠BOD (reflex or not). The inscribed angle at A is ∠BAD.' },
 { label: 'Apply central angle theorem', content: '∠BAD = ½∠BOD (reflex) and ∠BCD = ½∠BOD (the non-reflex part). The two central angles BOD (reflex) + BOD (non-reflex) = 360°.' },
 { label: 'Sum of opposite angles = 180°', content: '∠A + ∠C = ½(∠BOD reflex + ∠BOD) = ½ × 360° = 180°. Similarly, ∠B + ∠D = 180°. Opposite angles of a cyclic quadrilateral are supplementary! This is why a rectangular picture frame can always be inscribed in a circle — its opposite angles are 90° + 90° = 180°. This theorem is used in surveying to check if four points lie on a circle!' },
 ],
 interactive: CyclicQuadInteractive,
 },
];

// ========== Color Helper ==========
function getColorClasses(color: string) {
 const colors: Record<string, { bg: string; text: string; border: string; light: string; dark: string; btn: string; btnHover: string }> = {
 teal: { bg: 'bg-teal-500', text: 'text-teal-600', border: 'border-teal-200', light: 'bg-teal-50', dark: 'dark:bg-teal-900/20', btn: 'bg-teal-600', btnHover: 'hover:bg-teal-700' },
 purple: { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-200', light: 'bg-purple-50', dark: 'dark:bg-purple-900/20', btn: 'bg-purple-600', btnHover: 'hover:bg-purple-700' },
 rose: { bg: 'bg-rose-500', text: 'text-rose-600', border: 'border-rose-200', light: 'bg-rose-50', dark: 'dark:bg-rose-900/20', btn: 'bg-rose-600', btnHover: 'hover:bg-rose-700' },
 cyan: { bg: 'bg-cyan-500', text: 'text-cyan-600', border: 'border-cyan-200', light: 'bg-cyan-50', dark: 'dark:bg-cyan-900/20', btn: 'bg-cyan-600', btnHover: 'hover:bg-cyan-700' },
 indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-200', light: 'bg-indigo-50', dark: 'dark:bg-indigo-900/20', btn: 'bg-indigo-600', btnHover: 'hover:bg-indigo-700' },
 sky: { bg: 'bg-sky-500', text: 'text-sky-600', border: 'border-sky-200', light: 'bg-sky-50', dark: 'dark:bg-sky-900/20', btn: 'bg-sky-600', btnHover: 'hover:bg-sky-700' },
 yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-yellow-200', light: 'bg-yellow-50', dark: 'dark:bg-yellow-900/20', btn: 'bg-yellow-600', btnHover: 'hover:bg-yellow-700' },
 emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200', light: 'bg-emerald-50', dark: 'dark:bg-emerald-900/20', btn: 'bg-emerald-600', btnHover: 'hover:bg-emerald-700' },
 violet: { bg: 'bg-violet-500', text: 'text-violet-600', border: 'border-violet-200', light: 'bg-violet-50', dark: 'dark:bg-violet-900/20', btn: 'bg-violet-600', btnHover: 'hover:bg-violet-700' },
 amber: { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200', light: 'bg-amber-50', dark: 'dark:bg-amber-900/20', btn: 'bg-amber-600', btnHover: 'hover:bg-amber-700' },
 blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200', light: 'bg-blue-50', dark: 'dark:bg-blue-900/20', btn: 'bg-blue-600', btnHover: 'hover:bg-blue-700' },
 pink: { bg: 'bg-pink-500', text: 'text-pink-600', border: 'border-pink-200', light: 'bg-pink-50', dark: 'dark:bg-pink-900/20', btn: 'bg-pink-600', btnHover: 'hover:bg-pink-700' },
 orange: { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-200', light: 'bg-orange-50', dark: 'dark:bg-orange-900/20', btn: 'bg-orange-600', btnHover: 'hover:bg-orange-700' },
 };
 return colors[color] || colors.teal;
}

// ========== Main Component ==========
export default function LabM10Theorems({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const { moduleId } = useParams<{ moduleId: string }>();
 const moduleToTheorem: Record<string, string> = {
 'm10_theorem_quadratic_formula': 'quadratic-formula',
 'm10_theorem_vector_diff': 'vector-difference',
 'm10_theorem_law_cosines': 'law-of-cosines',
 'm10_theorem_law_sines': 'law-of-sines',
 'm10_theorem_law_tangents': 'law-of-tangents',
 'm10_theorem_half_angle_cos': 'half-angle-cosine',
 'm10_theorem_half_angle_sin': 'half-angle-sine',
 'm10_theorem_area_sas': 'area-sas',
 'm10_theorem_area_aas': 'area-aas',
 'm10_theorem_heros': 'heros-formula',
 'm10_theorem_circum_radius': 'circum-radius',
 'm10_theorem_in_radius': 'in-radius',
 'm10_theorem_ex_radius': 'ex-radius',
 'm10_theorem_three_point_circle': 'three-point-circle',
 'm10_theorem_centre_bisects': 'centre-bisects-chord',
 'm10_theorem_perp_bisects': 'perp-bisects-chord',
 'm10_theorem_equal_chords_equal_dist': 'equal-chords-equal-distance',
 'm10_theorem_equidistant_chords': 'equidistant-chords-equal',
 'm10_theorem_congruent_arcs': 'congruent-arcs-equal-chords',
 'm10_theorem_equal_chords_arcs': 'equal-chords-congruent-arcs',
 'm10_theorem_equal_chords_angles': 'equal-chords-equal-angles',
 'm10_theorem_equal_angles_chords': 'equal-angles-equal-chords',
 'm10_theorem_perp_radius_tangent': 'perp-radius-tangent',
 'm10_theorem_tangent_perp_radius': 'tangent-perp-radius',
 'm10_theorem_equal_tangents': 'equal-tangents',
 'm10_theorem_external_touching': 'external-touching-circles',
 'm10_theorem_internal_touching': 'internal-touching-circles',
 'm10_theorem_alternate_segment': 'alternate-segment',
 'm10_theorem_central_angle': 'central-angle-theorem',
 'm10_theorem_same_segment': 'same-segment-angles',
 'm10_theorem_semicircle': 'angle-in-semicircle',
 'm10_theorem_major_segment': 'major-segment-acute',
 'm10_theorem_minor_segment': 'minor-segment-obtuse',
 'm10_theorem_cyclic_quad': 'cyclic-quadrilateral',
 };
 const initialTheorem = moduleId && moduleToTheorem[moduleId] ? moduleToTheorem[moduleId] : THEOREMS[0].id;
 const [activeTheorem, setActiveTheorem] = useState(initialTheorem);
 const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
 const [score, setScore] = useState(0);
 const [completed, setCompleted] = useState<Record<string, boolean>>({});

 const current = THEOREMS.find(t => t.id === activeTheorem)!;
 const cc = getColorClasses(current.color);

 const toggleStep = (theoremId: string, stepIdx: number) => {
 setExpandedSteps(prev => ({ ...prev, [`${theoremId}-${stepIdx}`]: !prev[`${theoremId}-${stepIdx}`] }));
 };

 const handleAnswer = (correct: boolean) => {
 if (correct && !completed[activeTheorem]) {
 setCompleted(prev => ({ ...prev, [activeTheorem]: true }));
 setScore(s => s + 1);
 }
 };

 return (
 <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none overflow-hidden">
 {/* Header */}
 <div className="bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 text-white px-4 md:px-6 py-4 shrink-0">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-xl font-bold flex items-center gap-2">
 <GraduationCap className="w-6 h-6" />
 
 {t("Class 10 Math Interactive Theorems")}
 </h1>
 <p className="text-sm text-white/80 mt-1">{t('lab.m10theorems_master_34_essential_theorems_t')}</p>
 </div>
 {onExit && (
 <button onClick={onExit} className="px-3 py-1.5 bg-white dark:bg-[#121212] dark:border-[#1c1b1b]/20 hover:bg-white dark:bg-[#121212] dark:border-[#1c1b1b]/30 rounded-lg text-xs font-bold transition-colors">
 
 {t('lab.m10theorems_exit')}
 </button>
 )}
 </div>
 </div>

 <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
 {/* Sidebar */}
 <div className="lg:w-64 shrink-0 bg-white dark:bg-[#121212] border-r border-slate-200 dark:border-[#1c1b1b] overflow-y-auto">
 <div className="p-3 border-b border-slate-100 dark:border-[#1c1b1b]">
 <div className="flex items-center justify-between">
 <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('lab.m10theorems_progress')}</span>
 <span className="text-xs font-bold text-violet-600">{score}/{THEOREMS.length}</span>
 </div>
 <div className="w-full h-1.5 bg-slate-100 dark:bg-[#1c1b1b] rounded-full mt-1 overflow-hidden">
 <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300"
 style={{ width: `${(score / THEOREMS.length) * 100}%` }} />
 </div>
 </div>
 {/* Unit groupings */}
 {[
 { name: 'Unit 2: Quadratic Equations', ids: ['quadratic-formula'] },
 { name: 'Unit 7: Vectors in Plane', ids: ['vector-difference'] },
 { name: 'Unit 8: Trigonometry Apps', ids: ['law-of-cosines', 'law-of-sines', 'law-of-tangents', 'half-angle-cosine', 'half-angle-sine', 'area-sas', 'area-aas', 'heros-formula', 'circum-radius', 'in-radius', 'ex-radius'] },
 { name: 'Unit 9: Chords & Arcs', ids: ['three-point-circle', 'centre-bisects-chord', 'perp-bisects-chord', 'equal-chords-equal-distance', 'equidistant-chords-equal', 'congruent-arcs-equal-chords', 'equal-chords-congruent-arcs', 'equal-chords-equal-angles', 'equal-angles-equal-chords'] },
 { name: 'Unit 10: Tangents & Angles', ids: ['perp-radius-tangent', 'tangent-perp-radius', 'equal-tangents', 'external-touching-circles', 'internal-touching-circles', 'alternate-segment', 'central-angle-theorem', 'same-segment-angles', 'angle-in-semicircle', 'major-segment-acute', 'minor-segment-obtuse', 'cyclic-quadrilateral'] },
 ].map(group => (
 <div key={group.name}>
 <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-[#1c1b1b]">
 {group.name}
 </div>
 {group.ids.map(id => {
 const t = THEOREMS.find(ti => ti.id === id)!;
 const colors = getColorClasses(t.color);
 const isActive = t.id === activeTheorem;
 const isDone = completed[t.id];
 return (
 <button
 key={t.id}
 onClick={() => setActiveTheorem(t.id)}
 className={`w-full text-left px-3 py-2.5 border-b border-slate-100 dark:border-[#1c1b1b] transition-colors ${
 isActive ? `${colors.light} ${colors.dark} border-l-2 ${colors.border}` : 'hover:bg-slate-50 dark:hover:bg-[#1c1b1b]'
 }`}
 >
 <div className="flex items-center gap-2">
 <div className={`w-7 h-7 rounded-lg ${colors.bg} flex items-center justify-center shrink-0 ${isDone ? 'opacity-100' : 'opacity-60'}`}>
 {isDone ? <CheckCircle className="w-3.5 h-3.5 text-white" /> : <t.icon className="w-3.5 h-3.5 text-white" />}
 </div>
 <div className="min-w-0">
 <div className={`text-[11px] font-semibold truncate ${isActive ? colors.text : 'text-slate-700 dark:text-slate-300'}`}>
 {t.title}
 </div>
 <div className="text-[9px] font-mono text-slate-400 truncate">{t.formula}</div>
 </div>
 </div>
 </button>
 );
 })}
 </div>
 ))}
 </div>

 {/* Main Content */}
 <div className="flex-1 overflow-y-auto p-4 lg:p-6">
 <div className="max-w-3xl mx-auto space-y-5">
 {/* Title & Formula */}
 <div className="flex items-start gap-3">
 <div className={`w-10 h-10 rounded-xl ${cc.bg} flex items-center justify-center shrink-0`}>
 <current.icon className="w-5 h-5 text-white" />
 </div>
 <div className="min-w-0">
 <h2 className="text-lg font-bold text-slate-800 dark:text-white">{current.title}</h2>
 <p className="text-xs text-slate-500 dark:text-slate-400">{current.formulaDesc}</p>
 </div>
 </div>

 {/* Formula Card */}
 <div className={`${cc.light} ${cc.dark} rounded-xl p-4 border ${cc.border} text-center`}>
 <div className={`text-2xl font-bold ${cc.text}`}><MathFormula formula={current.formula} className="text-2xl font-bold" /></div>
 </div>

 {/* Step-by-step Proof */}
 <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] overflow-hidden">
 <div className="px-4 py-3 border-b border-slate-100 dark:border-[#1c1b1b] flex items-center gap-2">
 <Sigma className="w-4 h-4 text-violet-500" />
 <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{t('lab.m10theorems_step_by_step_proof')}</span>
 </div>
 <div className="p-4">
 {current.steps.map((step, idx) => {
 const key = `${current.id}-${idx}`;
 const isExpanded = expandedSteps[key] !== undefined ? expandedSteps[key] : idx === 0;
 const isLast = idx === current.steps.length - 1;
 return (
 <div key={idx} className="mb-3 last:mb-0">
 <button
 onClick={() => toggleStep(current.id, idx)}
 className="flex items-center gap-2 w-full text-left"
 >
 <div className={`w-6 h-6 rounded-full ${cc.bg} text-white flex items-center justify-center text-[10px] font-bold shrink-0`}>
 {idx + 1}
 </div>
 <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{step.label}</span>
 {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-auto" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-auto" />}
 </button>
 {isExpanded && (
 <div className="ml-9 mt-2">
 <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step.content}</p>
 {!isLast && <ArrowRight className="w-3.5 h-3.5 text-slate-300 ml-3 mt-2" />}
 </div>
 )}
 </div>
 );
 })}
 </div>
 </div>

 {/* Interactive Playground */}
 <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] overflow-hidden">
 <div className="px-4 py-3 border-b border-slate-100 dark:border-[#1c1b1b] flex items-center gap-2">
 <Lightbulb className="w-4 h-4 text-amber-500" />
 <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{t('lab.m10theorems_try_it_yourself')}</span>
 {completed[current.id] && (
 <span className="ml-auto text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
 <CheckCircle className="w-3 h-3" /> {t('lab.m10theorems_mastered')}
 </span>
 )}
 </div>
 <div className="p-4">
 <current.interactive onAnswer={handleAnswer} />
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
