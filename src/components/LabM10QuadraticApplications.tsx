import { useState, useEffect, useRef } from 'react';
import { Target, CheckCircle2, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface Props {
 onExit?: () => void;
}

export default function LabM10QuadraticApplications({ onExit }: Props) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 // Simulator State
 const [velocity, setVelocity] = useState<number>(20);
 const [angle, setAngle] = useState<number>(45);
 const [height, setHeight] = useState<number>(10);
 
 // Animation state
 const [time, setTime] = useState<number>(0);
 const [isFiring, setIsFiring] = useState<boolean>(false);
 const animationRef = useRef<number>(0);

 // Assessment State
 const [ansMaxHeight, setAnsMaxHeight] = useState<string>('');
 const [feedback, setFeedback] = useState<string | null>(null);

 const g = 9.81;

 // Derived physics values
 const angleRad = (angle * Math.PI) / 180;
 const v0y = velocity * Math.sin(angleRad);
 const v0x = velocity * Math.cos(angleRad);
 
 // y(t) = h0 + v0y*t - 0.5*g*t^2
 // Maximum height occurs at t = v0y / g
 // max_y = h0 + v0y*(v0y/g) - 0.5*g*(v0y/g)^2 = h0 + v0y^2 / (2g)
 const actualMaxHeight = height + (v0y * v0y) / (2 * g);
 
 // Time of flight (when y = 0)
 // -0.5*g*t^2 + v0y*t + h0 = 0
 const timeOfFlight = (v0y + Math.sqrt(v0y*v0y - 4*(-0.5*g)*height)) / g;

 useEffect(() => {
 if (isFiring) {
  const startTime = performance.now();
  const animate = (currentTime: number) => {
  const elapsed = (currentTime - startTime) / 1000; // in seconds
  const simTime = elapsed * 2; // speed up simulation
  
  if (simTime >= timeOfFlight) {
   setTime(timeOfFlight);
   setIsFiring(false);
  } else {
   setTime(simTime);
   animationRef.current = requestAnimationFrame(animate);
  }
  };
  animationRef.current = requestAnimationFrame(animate);
 }
 
 return () => cancelAnimationFrame(animationRef.current);
 }, [isFiring, timeOfFlight]);

 const fireCannon = () => {
 if (isFiring) return;
 setTime(0);
 setIsFiring(true);
 };

 const resetCannon = () => {
 setIsFiring(false);
 setTime(0);
 cancelAnimationFrame(animationRef.current);
 };

 const checkAnswer = () => {
 const userAns = parseFloat(ansMaxHeight);
 if (Math.abs(userAns - actualMaxHeight) < 0.5) {
  setFeedback('Correct! You found the vertex of the parabola correctly.');
 } else {
  setFeedback(`Incorrect. Hint: Vertex t = -b/(2a). Max height is ~${actualMaxHeight.toFixed(1)}m`);
 }
 };

 // Generate trajectory path for background
 const generateTrajectory = () => {
 let path = `M 0,${300 - height*5}`;
 for (let t = 0; t <= timeOfFlight; t += 0.1) {
  const x = v0x * t * 5;
  const y = 300 - (height + v0y * t - 0.5 * g * t * t) * 5;
  path += ` L ${x},${y}`;
 }
 return path;
 };

 const currentX = v0x * time * 5;
 const currentY = 300 - (height + v0y * time - 0.5 * g * time * time) * 5;

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.m10quadraticapplications_quadratic_applications_project')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.m10quadraticapplications_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.m10quadraticapplications_lab')}</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 flex-grow lg:overflow-visible">
  {/* LEFT: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
   <Target />  {t('lab.m10quadraticapplications_theory_context')}
                        </h2>
   <div className="prose text-slate-700 dark:text-[#ffffff]">
   <p>
    
                             {t('lab.m10quadraticapplications_projectile_motion_traces_a')} <strong>{t('lab.m10quadraticapplications_parabola')}</strong>{t('lab.m10quadraticapplications_which_is_the_graph_of_a_quadra')}
                            </p>
   <div className={`bg-emerald-50 p-3 rounded-lg text-center font-mono my-4 border border-emerald-100 flex-col `}>
    
                             {t('lab.m10quadraticapplications_h_t_gt_v_yt_h')}
                            </div>
   <ul className="list-disc pl-5 space-y-2">
    <li><strong>{t('lab.m10quadraticapplications_h_t')}</strong>  {t('lab.m10quadraticapplications_height_at_time_t')}</li>
    <li><strong>g:</strong>  {t('lab.m10quadraticapplications_gravity_9_81_m_s')}</li>
    <li><strong>{t('lab.m10quadraticapplications_v_y')}</strong>  {t('lab.m10quadraticapplications_initial_vertical_velocity_v_si')}</li>
    <li><strong>{t('lab.m10quadraticapplications_h')}</strong>  {t('lab.m10quadraticapplications_initial_height')}</li>
   </ul>
   <h3 className="font-semibold text-emerald-800 mt-4">{t('lab.m10quadraticapplications_finding_maximum_height')}</h3>
   <p>
    
                             {t('lab.m10quadraticapplications_the_maximum_height_occurs_at_t')} <code>{t('lab.m10quadraticapplications_t_b_2a')}</code>{t('lab.m10quadraticapplications_where')} <code>{t('lab.m10quadraticapplications_a_g')}</code>  {t('lab.m10quadraticapplications_and')} <code>{t('lab.m10quadraticapplications_b_v_y')}</code>.
   </p>
   </div>
  </div>

  {/* MIDDLE: Simulation */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col items-center '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-emerald-800 mb-4">{t('lab.m10quadraticapplications_physics_cannon_simulator')}</h2>
   
   <div className={`w-full max-w-md grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div>
    <label className="block text-xs font-semibold mb-1">{t('lab.m10quadraticapplications_velocity')} {velocity}  {t('lab.m10quadraticapplications_m_s')}</label>
    <input type="range" min="10" max="40" value={velocity} onChange={e => {setVelocity(Number(e.target.value)); resetCannon();}} className="w-full accent-emerald-600" disabled={isFiring} />
   </div>
   <div>
    <label className="block text-xs font-semibold mb-1">{t('lab.m10quadraticapplications_angle')} {angle}°</label>
    <input type="range" min="10" max="85" value={angle} onChange={e => {setAngle(Number(e.target.value)); resetCannon();}} className="w-full accent-emerald-600" disabled={isFiring} />
   </div>
   <div>
    <label className="block text-xs font-semibold mb-1">{t('lab.m10quadraticapplications_height')} {height} m</label>
    <input type="range" min="0" max="30" value={height} onChange={e => {setHeight(Number(e.target.value)); resetCannon();}} className="w-full accent-emerald-600" disabled={isFiring} />
   </div>
   </div>

   <div className={`relative w-full h-80 bg-sky-100 rounded-lg overflow- border-2 border-slate-300 dark:border-[#1c1b1b] shadow-inner flex-col `}>
   <svg viewBox="0 0 600 300" className="w-full h-full" preserveAspectRatio="xMinYMax meet">
    {/* Ground */}
    <rect x="0" y="300" width="600" height="20" fill="#22c55e" />
    
    {/* Trajectory Guide */}
    <path d={generateTrajectory()} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
    
    {/* Cannon Tower */}
    <rect x="0" y={300 - height*5} width="20" height={height*5} fill="#64748b" />
    
    {/* Projectile */}
    <circle cx={currentX} cy={currentY} r="6" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2" />
   </svg>

   {/* Telemetry overlay */}
   <div className="absolute top-2 left-2 bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212]/80 p-2 rounded text-xs font-mono border border-slate-300 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    <div>{t('lab.m10quadraticapplications_time')} {time.toFixed(2)} s</div>
    <div>{t('lab.m10quadraticapplications_height')} {Math.max(0, height + v0y * time - 0.5 * g * time * time).toFixed(1)} m</div>
    <div>{t('lab.m10quadraticapplications_distance')} {(v0x * time).toFixed(1)} m</div>
   </div>
   </div>
   
   <div className="flex gap-4 mt-4 w-full max-w-md">
    <button onClick={fireCannon} disabled={isFiring} className="flex-1 min-w-0 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-colors dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">
    
                             {t('lab.m10quadraticapplications_fire_cannon')}
                             </button>
    <button onClick={resetCannon} className="flex-1 min-w-0 bg-slate-200 dark:bg-[#121212] hover:bg-slate-300 dark:bg-[#121212] text-slate-800 dark:text-[#ffffff] font-bold py-2 px-4 rounded transition-colors">
    
                             {t('lab.m10quadraticapplications_reset')}
                             </button>
   </div>
  </div>

  {/* RIGHT: Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-emerald-800 mb-4">{t('lab.m10quadraticapplications_laboratory_assessment')}</h2>
   
   <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 mb-6">
   <h3 className="font-semibold text-emerald-900 mb-2">{t('lab.m10quadraticapplications_calculate_maximum_height')}</h3>
   <p className="text-slate-700 dark:text-[#ffffff] mb-4 text-sm">
    
                             {t('lab.m10quadraticapplications_using_the_current_simulator_pa')}
                            </p>
   <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded border border-slate-200 dark:border-[#1c1b1b] mb-4 font-mono text-xs">
    <p>{t('lab.m10quadraticapplications_v')} {velocity}  {t('lab.m10quadraticapplications_m_s_1')} {angle}°</p>
    <p>{t('lab.m10quadraticapplications_v_y_1')} {velocity}  {t('lab.m10quadraticapplications_sin')}{angle}°) ≈ {v0y.toFixed(2)}  {t('lab.m10quadraticapplications_m_s')}</p>
    <p>{t('lab.m10quadraticapplications_h_1')} {height} m</p>
    <p className="mt-2 text-emerald-700">{t('lab.m10quadraticapplications_h_t_4_905t')} {v0y.toFixed(2)}{t('lab.m10quadraticapplications_t')} {height}</p>
   </div>
   
   <div className="mb-4">
    <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.m10quadraticapplications_max_height_m')}</label>
    <input 
    type="number" 
    value={ansMaxHeight} 
    onChange={e => setAnsMaxHeight(e.target.value)}
    className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-emerald-500 outline-none"
    placeholder={t('lab.m10quadraticapplications_e_g_25_5')}
    />
   </div>

   <button 
    onClick={checkAnswer}
    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition-colors dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
   >
    
                             {t('lab.m10quadraticapplications_verify_calculation')}
                            </button>

   {feedback && (
    <div className={`mt-4 p-3 rounded text-sm flex items-start gap-2 ${feedback.includes('Correct') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
    {feedback.includes('Correct') ? <CheckCircle2 className="shrink-0 mt-0.5" size={16} /> : <XCircle className="shrink-0 mt-0.5" size={16} />}
    <span>{feedback}</span>
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
