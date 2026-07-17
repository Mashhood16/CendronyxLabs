import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, Settings2, BookOpen, Calculator, RotateCcw, Play, Pause } from 'lucide-react';
import LabHeader from './LabHeader';
import MathText from './MathText';
import { useTranslate } from "../i18n";

export default function LabM12Kinematics({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [mode] = useState<'1d' | '3d'>('1d');

 // 1D state
 const [acceleration, setAcceleration] = useState(2);
 const [isPlaying, setIsPlaying] = useState(false);
 
 const [history, setHistory] = useState<{t: number, a: number, v: number, s: number}[]>([]);
 
 // 3D state
 const [v, setV] = useState(1);
 const [R, setR] = useState(2);
 
 const reqRef = useRef<number>(0);
 const lastTimeRef = useRef<number>(0);
 const stateRef = useRef({ t: 0, v: 0, s: 0, a: 2 });

 useEffect(() => {
 stateRef.current.a = acceleration;
 }, [acceleration]);

 useEffect(() => {
 if (isPlaying && mode === '1d') {
 lastTimeRef.current = performance.now();
 const loop = (now: number) => {
 const dt = (now - lastTimeRef.current) / 1000;
 lastTimeRef.current = now;
 
 if (stateRef.current.t < 10) {
 stateRef.current.t += dt;
 stateRef.current.v += stateRef.current.a * dt;
 stateRef.current.s += stateRef.current.v * dt;
 
 setHistory(prev => [...prev, {
 t: stateRef.current.t,
 a: stateRef.current.a,
 v: stateRef.current.v,
 s: stateRef.current.s
 }]);
 reqRef.current = requestAnimationFrame(loop);
 } else {
 setIsPlaying(false);
 }
 };
 reqRef.current = requestAnimationFrame(loop);
 }
 return () => cancelAnimationFrame(reqRef.current);
 }, [isPlaying, mode]);

 const resetSim = () => {
 setIsPlaying(false);
 setHistory([]);
 stateRef.current = { t: 0, v: 0, s: 0, a: acceleration };
 };

 const [userAnswer, setUserAnswer] = useState("");
 const [feedback, setFeedback] = useState<"none" | "correct" | "incorrect">("none");
 const [problemData, setProblemData] = useState<{ t: number } | null>(null);

 const generateProblem = () => {
 setUserAnswer("");
 setFeedback("none");
 if (mode === '1d') {
 setProblemData({ t: Math.floor(Math.random() * 4 + 3) });
 } else {
 setProblemData({ t: Math.floor(Math.random() * 5 + 2) });
 }
 };

 useEffect(() => {
 generateProblem();
 if (mode === '3d') resetSim();
 }, [mode]);

 const problemText = mode === '1d' 
 ? `Set the acceleration slider to your chosen value and run the simulation. Based on the kinematics equations, what should the displacement be exactly at t = ${problemData?.t || 5}s?`
 : `For a particle tracking a helical trajectory r(t) = ⟨${R}cos(t), ${R}sin(t), ${v}t⟩, find the magnitude of its velocity vector (speed) at t = ${problemData?.t || 5}s. (Round to 2 decimal places)`;

 const checkAnswer = () => {
 if (!problemData) return;
 const val = parseFloat(userAnswer);
 let correctAns = 0;
 if (mode === '1d') {
 correctAns = 0.5 * acceleration * Math.pow(problemData.t, 2);
 } else {
 correctAns = Math.sqrt(R*R + v*v);
 }
 
 if (Math.abs(val - correctAns) < 0.1) {
 setFeedback("correct");
 } else {
 setFeedback("incorrect");
 }
 };

 const generateHelix = () => {
 let d = "";
 for (let t = 0; t <= 20; t += 0.1) {
 const x3 = R * Math.cos(t) * 10;
 const y3 = R * Math.sin(t) * 10;
 const z3 = v * t * 8;
 
 const px = (x3 - y3) * Math.cos(Math.PI/6);
 const py = -z3 + (x3 + y3) * Math.sin(Math.PI/6);
 d += `${t === 0 ? 'M' : 'L'} ${px} ${py} `;
 }
 return d;
 };

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.m12kinematics_lab_m12_3_advanced_kinematics')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.m12kinematics_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.m12kinematics_lab')}</button>
 </div>
 <main className="lg:flex-1 min-w-0 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg:min-h-0 lg:overflow-visible">
 {/* Theory Column */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center gap-2 text-indigo-700 mb-2">
 <BookOpen className="w-5 h-5" />
 <h2 className="text-lg font-bold">{t('lab.m12kinematics_theoretical_context')}</h2>
 </div>
 
 {mode === '1d' && (
 <div className="text-sm text-slate-700 dark:text-[#ffffff] space-y-3">
 <p><strong>{t('lab.m12kinematics_rectilinear_motion')}</strong> {t('lab.m12kinematics_involves_particles_moving_alon')}</p>
 <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded text-center font-mono space-y-2 flex-col `}>
 <div><MathText>{"$$v = u + at$$"}</MathText></div>
 <div><MathText>{"$$s = ut + \\frac{1}{2}at^2$$"}</MathText></div>
 </div>
 <p><strong>{t('lab.m12kinematics_graphical_analysis')}</strong> {t('lab.m12kinematics_the_slope_of_the_s_t_graph_giv')}</p>
 </div>
 )}

 {mode === '3d' && (
 <div className="text-sm text-slate-700 dark:text-[#ffffff] space-y-3">
 <p><strong>{t('lab.m12kinematics_vector_valued_functions')}</strong> {t('lab.m12kinematics_describe_trajectories_in_3d_sp')} <MathText>{"$$r(t) = \\langle x(t), y(t), z(t) \\rangle$$"}</MathText> {t('lab.m12kinematics_tracks_a_particle_over_time')}</p>
 <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded text-center font-mono text-xs overflow-x-auto space-y-2 flex-col `}>
 <div><MathText>{"$$v(t) = r'(t) = \\langle x'(t), y'(t), z'(t) \\rangle$$"}</MathText></div>
 <div><MathText>{"$$Speed = |v(t)| = \\sqrt{x'(t)^2 + y'(t)^2 + z'(t)^2}$$"}</MathText></div>
 </div>
 <p><strong>{t('lab.m12kinematics_helical_trajectories')}</strong> {t('lab.m12kinematics_combine_circular_motion_in_the')}</p>
 </div>
 )}
 </div>

 {/* Visualizer Column */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 items-center justify-center relative '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] self-start absolute top-5 left-5 z-10">{t('lab.m12kinematics_live_simulation')}</h2>
 
 {mode === '1d' ? (
 <div className="w-full flex flex-col gap-4 mt-8">
 <div className={`w-full h-24 bg-slate-200 dark:bg-[#121212] border-b-4 border-slate-400 dark:border-[#1c1b1b] relative flex items-end rounded-t-lg flex-col `}>
 {/* Train body */}
 <div className="absolute w-16 h-10 bg-indigo-600 rounded-t-md flex items-end justify-around pb-1 transition-all duration-75 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex" 
 style={{ left: `calc(${Math.min((history.length > 0 ? history[history.length-1].s : 0) / 2.5, 90)}% - 2rem)` }}>
 <div className="w-4 h-4 bg-[#121212] dark:bg-[#121212] rounded-full" />
 <div className="w-4 h-4 bg-[#121212] dark:bg-[#121212] rounded-full" />
 </div>
 </div>
 <div className="grid grid-cols-2 gap-4 w-full h-40">
 <div className="flex flex-col items-center">
 <span className="text-xs font-semibold text-slate-500 dark:text-[#71717a] mb-1">{t('lab.m12kinematics_velocity_v_vs_time_t')}</span>
 <svg viewBox="0 -10 100 110" className="w-full h-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded">
 <polyline fill="none" stroke="#2563eb" strokeWidth="2"
 points={history.map(h => `${(h.t/10)*100},${100 - (h.v/50)*100}`).join(' ')} />
 </svg>
 </div>
 <div className="flex flex-col items-center">
 <span className="text-xs font-semibold text-slate-500 dark:text-[#71717a] mb-1">{t('lab.m12kinematics_displacement_s_vs_time_t')}</span>
 <svg viewBox="0 -10 100 110" className="w-full h-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded">
 <polyline fill="none" stroke="#10b981" strokeWidth="2"
 points={history.map(h => `${(h.t/10)*100},${100 - (h.s/250)*100}`).join(' ')} />
 </svg>
 </div>
 </div>
 <div className="flex justify-center gap-4 mt-2">
 <button onClick={() => setIsPlaying(!isPlaying)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
 {isPlaying ? <Pause size={18} /> : <Play size={18} />} {isPlaying ? 'Pause' : 'Start'}
 </button>
 <button onClick={resetSim} className="flex items-center gap-2 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] px-4 py-2 rounded shadow hover:bg-slate-300 dark:bg-[#121212]">
 <RotateCcw size={18} /> {t('lab.m12kinematics_reset')}
 </button>
 </div>
 </div>
 ) : (
 <svg viewBox="-100 -200 200 250" className="w-full max-w-md aspect-square bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg shadow-inner mt-8">
 {/* Isometric axes */}
 <line x1="0" y1="0" x2="86.6" y2="50" stroke="#cbd5e1" strokeWidth="1" /> {/* x-axis */}
 <line x1="0" y1="0" x2="-86.6" y2="50" stroke="#cbd5e1" strokeWidth="1" /> {/* y-axis */}
 <line x1="0" y1="0" x2="0" y2="-150" stroke="#cbd5e1" strokeWidth="1" /> {/* z-axis */}
 
 <path d={generateHelix()} fill="none" stroke="#5560F1" strokeWidth="2" />
 <circle r="4" fill="#ec4899">
 <animateMotion dur="5s" repeatCount="indefinite" path={generateHelix()} />
 </circle>
 </svg>
 )}
 </div>

 {/* Assessment Column */}
 <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center gap-2 text-indigo-700 mb-2 shrink-0">
 <Settings2 className="w-5 h-5" />
 <h2 className="text-lg font-bold">{t('lab.m12kinematics_parameters_assessment')}</h2>
 </div>

 <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] space-y-4 shrink-0 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h3 className="font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.m12kinematics_interactive_variables')}</h3>
 {mode === '1d' && (
 <div>
 <label className="block text-sm text-slate-600 dark:text-[#a1a1aa] mb-1">{t('lab.m12kinematics_acceleration_a_t')} {acceleration} {t('lab.m12kinematics_m_s')}</label>
 <input type="range" min="1" max="5" step="0.5" value={acceleration} onChange={e => setAcceleration(Number(e.target.value))} className="w-full accent-indigo-600" />
 </div>
 )}
 {mode === '3d' && (
 <>
 <div>
 <label className="block text-sm text-slate-600 dark:text-[#a1a1aa] mb-1">{t('lab.m12kinematics_radius_r')} {R}</label>
 <input type="range" min="1" max="5" step="0.5" value={R} onChange={e => setR(Number(e.target.value))} className="w-full accent-indigo-600" />
 </div>
 <div>
 <label className="block text-sm text-slate-600 dark:text-[#a1a1aa] mb-1">{t('lab.m12kinematics_vertical_velocity_v')} {v}</label>
 <input type="range" min="1" max="5" step="0.5" value={v} onChange={e => setV(Number(e.target.value))} className="w-full accent-indigo-600" />
 </div>
 </>
 )}
 </div>

 <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex-1 flex flex-col dark:bg-[#121212] dark:border-[#1c1b1b]">
 <div className="flex items-center gap-2 text-indigo-800 mb-3 shrink-0 dark:text-[#ffffff]">
 <Calculator className="w-5 h-5" />
 <h3 className="font-semibold">{t('lab.m12kinematics_lab_computation_task')}</h3>
 </div>
 
 <p className="text-sm text-slate-700 dark:text-[#ffffff] mb-4 flex-1">
 {problemText}
 </p>

 <div className="space-y-3 shrink-0">
 <div className="flex flex-wrap gap-2">
 <input 
 type="number" 
 value={userAnswer}
 onChange={e => setUserAnswer(e.target.value)}
 placeholder={t('lab.m12kinematics_enter_answer')} 
 className="flex-1 min-w-0 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
 />
 <button 
 onClick={checkAnswer}
 className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
 >
 
 {t('lab.m12kinematics_verify')}
 </button>
 </div>

 {feedback === "correct" && (
 <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded border border-green-200 dark:bg-[#121212] dark:border-[#1c1b1b]">
 <CheckCircle2 className="w-5 h-5 shrink-0" />
 <span className="font-medium text-sm">{t('lab.m12kinematics_excellent_computation_is_accur')}</span>
 </div>
 )}

 {feedback === "incorrect" && (
 <div className="flex items-center gap-2 text-red-700 bg-red-50 p-2 rounded border border-red-200">
 <XCircle className="w-5 h-5 shrink-0" />
 <span className="font-medium text-sm">{t('lab.m12kinematics_incorrect_double_check_your_ca')}</span>
 </div>
 )}

 <button 
 onClick={generateProblem}
 className="flex items-center justify-center gap-2 w-full text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-md transition-colors text-sm font-medium border border-transparent mt-2"
 >
 <RotateCcw className="w-4 h-4" />
 
 {t('lab.m12kinematics_generate_new_scenario')}
 </button>
 </div>
 </div>
 </div>
 </main>
 </div>
 );
}
