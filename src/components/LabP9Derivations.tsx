import { useState, useEffect, useRef, type ReactElement } from 'react';
import {
 CheckCircle, XCircle, ChevronDown, ChevronRight,
 ArrowRight, Lightbulb, Sigma, Rocket, Target, Satellite,
 Waves, Flower2, Zap, Mountain, GraduationCap
} from 'lucide-react';
import MathFormula from './MathFormula';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

// ========== Types ==========
interface DerivationModule {
 id: string;
 icon: typeof Zap;
 title: string;
 formula: string;
 formulaDesc: string;
 color: string;
 steps: { label: string; content: string; }[];
 interactive: (props: { onAnswer: (correct: boolean) => void }) => ReactElement;
}

// ========== Interactive Components ==========

function ForceMomentumInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
 const { t } = useTranslate();
 const [mass, setMass] = useState(2);
 const [vi, setVi] = useState(0);
 const [vf, setVf] = useState(10);
 const [time, setTime] = useState(2);
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

 const deltaP = mass * (vf - vi);
 const force = deltaP / time;

 const handleCheck = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 const expected = force;
 setCheckResult(Math.abs(val - expected) < expected * 0.1 ? 'correct' : 'incorrect');
 if (Math.abs(val - expected) < expected * 0.1) onAnswer(true);
 };

 return (
 <div className="space-y-4">
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.p9derivations_mass_kg')}</label>
 <input type="range" min="1" max="10" step="0.5" value={mass} onChange={e => { setMass(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
 <span className="text-sm font-mono text-blue-600">{mass} kg</span>
 </div>
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.p9derivations_initial_velocity_m_s')}</label>
 <input type="range" min="0" max="20" step="1" value={vi} onChange={e => { setVi(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
 <span className="text-sm font-mono text-blue-600">{vi} {t('lab.p9derivations_m_s')}</span>
 </div>
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.p9derivations_final_velocity_m_s')}</label>
 <input type="range" min="0" max="30" step="1" value={vf} onChange={e => { setVf(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
 <span className="text-sm font-mono text-blue-600">{vf} {t('lab.p9derivations_m_s')}</span>
 </div>
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.p9derivations_time_s')}</label>
 <input type="range" min="0.5" max="5" step="0.5" value={time} onChange={e => { setTime(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
 <span className="text-sm font-mono text-blue-600">{time} s</span>
 </div>
 </div>
 <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
 <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">{t('lab.p9derivations_momentum_change_p_m_vf_vi')} {mass} × ({vf} − {vi}) = <strong>{deltaP} {t('lab.p9derivations_kg_m_s')}</strong></p>
 <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mt-1">{t('lab.p9derivations_net_force_f_p_t')} {deltaP}/{time} = <strong>{force.toFixed(1)} N</strong></p>
 </div>
 <div className="flex gap-2">
 <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
 placeholder={t('lab.p9derivations_calculate_the_force')}
 className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-blue-500 outline-none" />
 <button onClick={handleCheck}
 className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
 
 {t('lab.p9derivations_check')}
 </button>
 </div>
 {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {t('lab.p9derivations_great_f_p_t')} {force.toFixed(1)} N</p>}
 {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> {t('lab.p9derivations_try_again_force_m_vf_vi_t')}</p>}
 </div>
 );
}

function RecoilInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
 const { t } = useTranslate();
 const [bulletMass, setBulletMass] = useState(10);
 const [bulletVel, setBulletVel] = useState(400);
 const [gunMass, setGunMass] = useState(5);
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
 const [fired, setFired] = useState(false);

 const bMassKg = bulletMass / 1000;
 const recoilV = (bMassKg * bulletVel) / gunMass;

 const handleFire = () => {
 setFired(true);
 setTimeout(() => setFired(false), 600);
 };

 const handleCheck = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 setCheckResult(Math.abs(val - recoilV) < 0.3 ? 'correct' : 'incorrect');
 if (Math.abs(val - recoilV) < 0.3) onAnswer(true);
 };

 return (
 <div className="space-y-4">
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.p9derivations_bullet_mass_g')}</label>
 <input type="range" min="2" max="50" step="1" value={bulletMass} onChange={e => { setBulletMass(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-amber-500" />
 <span className="text-sm font-mono text-amber-600">{bulletMass} g</span>
 </div>
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.p9derivations_bullet_velocity_m_s')}</label>
 <input type="range" min="100" max="800" step="10" value={bulletVel} onChange={e => { setBulletVel(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-amber-500" />
 <span className="text-sm font-mono text-amber-600">{bulletVel} {t('lab.p9derivations_m_s')}</span>
 </div>
 <div className="col-span-2">
 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.p9derivations_gun_mass_kg')}</label>
 <input type="range" min="1" max="10" step="0.5" value={gunMass} onChange={e => { setGunMass(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-amber-500" />
 <span className="text-sm font-mono text-amber-600">{gunMass} kg</span>
 </div>
 </div>

 {/* Visual */}
 <div className="relative h-24 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
 {/* Gun */}
 <div className={`absolute bottom-4 left-4 w-20 h-8 bg-slate-600 rounded-sm flex items-center justify-center text-white text-xs font-bold transition-all duration-200 ${fired ? 'translate-x-4' : ''}`}>
 
 {t('lab.p9derivations_gun')}
 </div>
 {/* Bullet */}
 <div className={`absolute bottom-4 w-3 h-3 bg-amber-500 rounded-full transition-all duration-200 ${fired ? 'left-[70%]' : 'left-[25%]'}`} />
 {/* Recoil arrow */}
 {fired && <div className="absolute top-2 left-10 text-red-500 text-xs font-bold animate-pulse">{t('lab.p9derivations_recoil')}</div>}
 <button onClick={handleFire}
 className="absolute top-2 right-2 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded transition-colors">
 {fired ? 'FIRE!' : 'FIRE!'}
 </button>
 </div>

 <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
 <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
 
 {t('lab.p9derivations_v_g_m_b_v_b_m_g')}{bMassKg} × {bulletVel}) / {gunMass} = <strong>{recoilV.toFixed(2)} {t('lab.p9derivations_m_s')}</strong> {t('lab.p9derivations_opposite_direction')}
 </p>
 </div>

 <div className="flex gap-2">
 <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
 placeholder={t('lab.p9derivations_recoil_velocity_m_s')}
 className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-amber-500 outline-none" />
 <button onClick={handleCheck}
 className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors">
 
 {t('lab.p9derivations_check')}
 </button>
 </div>
 {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {t('lab.p9derivations_correct_the_gun_recoils_at')} {recoilV.toFixed(2)} {t('lab.p9derivations_m_s')}</p>}
 {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> {t('lab.p9derivations_try_v_g_m_b_v_b_m_g_remember_m')}</p>}
 </div>
 );
}

function OrbitalSpeedInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
 const { t } = useTranslate();
 const [radius, setRadius] = useState(7000);
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
 const [angle, setAngle] = useState(0);
 const animRef = useRef<number>(0);

 useEffect(() => {
 let start = performance.now();
 const animate = (now: number) => {
 setAngle(((now - start) / 2000) * 2 * Math.PI);
 animRef.current = requestAnimationFrame(animate);
 };
 animRef.current = requestAnimationFrame(animate);
 return () => cancelAnimationFrame(animRef.current);
 }, []);

 const rKm = radius;
 const rM = radius * 1000;
 const period = 2 * Math.PI * Math.sqrt(Math.pow(rM, 3) / (6.674e-11 * 5.97e24));
 const speed = (2 * Math.PI * rM) / period;

 const handleCheck = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 setCheckResult(Math.abs(val - speed) < 500 ? 'correct' : 'incorrect');
 if (Math.abs(val - speed) < 500) onAnswer(true);
 };

 return (
 <div className="space-y-4">
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.p9derivations_orbit_radius_km')}</label>
 <input type="range" min="6400" max="42000" step="100" value={radius} onChange={e => { setRadius(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-indigo-500" />
 <span className="text-sm font-mono text-indigo-600">{rKm.toLocaleString()} km</span>
 </div>

 {/* Visual */}
 <div className="relative h-32 bg-[#000000] rounded-lg overflow-hidden border border-[#1c1b1b]">
 {/* Earth */}
 <div className="absolute left-1/2 top-1/2 w-12 h-12 bg-blue-600 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-blue-500/50">
 <div className="absolute inset-2 bg-blue-400 rounded-full opacity-50" />
 </div>
 {/* Orbit path */}
 <div className="absolute left-1/2 top-1/2 w-28 h-28 border border-indigo-400/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
 {/* Satellite */}
 <div className="absolute w-3 h-3 bg-indigo-400 rounded-full shadow-lg shadow-indigo-500/50" style={{ top: '50%', left: '50%', transform: `translate(-50%, -50%) translate(${56 * Math.cos(angle)}px, ${56 * Math.sin(angle)}px)` }} />
 <div className="absolute bottom-2 left-2 text-[10px] text-slate-400 font-mono">{speed.toFixed(0)} {t('lab.p9derivations_m_s')}</div>
 </div>

 <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
 <p className="text-xs text-indigo-700 dark:text-indigo-300">
 <strong>{t('lab.p9derivations_orbital_period')}</strong> {t('lab.p9derivations_t_2_r_gm')} {period.toFixed(0)} {t('lab.p9derivations_s')} {(period/60).toFixed(1)} {t('lab.p9derivations_min')}<br />
 <strong>{t('lab.p9derivations_orbital_speed')}</strong> {t('lab.p9derivations_v_2_r_t')} {speed.toFixed(0)} {t('lab.p9derivations_m_s_1')} {(speed/1000).toFixed(1)} {t('lab.p9derivations_km_s')}
 </p>
 </div>

 <div className="flex gap-2">
 <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
 placeholder={t('lab.p9derivations_orbital_speed_m_s')}
 className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-indigo-500 outline-none" />
 <button onClick={handleCheck}
 className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors">
 
 {t('lab.p9derivations_check')}
 </button>
 </div>
 {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {t('lab.p9derivations_correct_v')} {speed.toFixed(0)} {t('lab.p9derivations_m_s')}</p>}
 {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> {t('lab.p9derivations_try_v_2_r_t')}</p>}
 </div>
 );
}

function LiquidPressureInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
 const { t } = useTranslate();
 const [depth, setDepth] = useState(5);
 const [density, setDensity] = useState(1000);
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

 const g = 9.8;
 const pressure = density * g * depth;

 const handleCheck = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 const expected = pressure;
 setCheckResult(Math.abs(val - expected) < expected * 0.05 ? 'correct' : 'incorrect');
 if (Math.abs(val - expected) < expected * 0.05) onAnswer(true);
 };

 const liquidColors: Record<string, string> = {
 '1000': 'from-blue-200 to-blue-400',
 '800': 'from-yellow-200 to-amber-400',
 '13500': 'from-red-200 to-red-400',
 '1200': 'from-green-200 to-green-400',
 };

 const getLiquid = () => {
 if (density <= 900) return 'Oil';
 if (density <= 1100) return 'Water';
 if (density <= 5000) return 'Sugar Syrup';
 return 'Mercury';
 };

 return (
 <div className="space-y-4">
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.p9derivations_depth_m')}</label>
 <input type="range" min="1" max="50" step="1" value={depth} onChange={e => { setDepth(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-cyan-500" />
 <span className="text-sm font-mono text-cyan-600">{depth} m</span>
 </div>
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.p9derivations_density_kg_m')}</label>
 <input type="range" min="800" max="13600" step="100" value={density} onChange={e => { setDensity(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-cyan-500" />
 <span className="text-sm font-mono text-cyan-600">{density} {t('lab.p9derivations_kg_m')}</span>
 </div>
 </div>

 {/* Visual Tank */}
 <div className="relative h-32 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
 {/* Water column */}
 <div className={`absolute bottom-0 left-4 right-4 bg-gradient-to-t ${density <= 1000 ? 'from-blue-400 to-blue-200' : density <= 5000 ? 'from-amber-400 to-amber-200' : 'from-red-400 to-red-200'} opacity-70`}
 style={{ height: `${(depth / 50) * 100}%` }}>
 <span className="absolute top-1 left-2 text-[10px] font-bold text-slate-800 dark:text-[#f8fafc]">{getLiquid()}</span>
 </div>
 {/* Pressure gauge */}
 <div className="absolute top-2 right-2 bg-white dark:bg-[#121212] rounded px-2 py-1 border border-slate-200 dark:border-[#2a2a2a]">
 <div className="text-[9px] text-slate-500">{t('lab.p9derivations_pressure')}</div>
 <div className="text-xs font-bold text-cyan-600 font-mono">{(pressure / 1000).toFixed(1)} {t('lab.p9derivations_kpa')}</div>
 </div>
 {/* Depth marker */}
 <div className="absolute left-1 bottom-0 text-[9px] text-slate-500 font-mono">{depth}m</div>
 </div>

 <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-3 border border-cyan-200 dark:border-cyan-800">
 <p className="text-xs text-cyan-700 dark:text-cyan-300">
 
 {t('lab.p9derivations_p_gh')} {density} × 9.8 × {depth} = <strong>{pressure.toLocaleString()} Pa</strong> = <strong>{(pressure/1000).toFixed(1)} {t('lab.p9derivations_kpa')}</strong>
 </p>
 </div>

 <div className="flex gap-2">
 <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
 placeholder={t('lab.p9derivations_pressure_in_pa')}
 className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-cyan-500 outline-none" />
 <button onClick={handleCheck}
 className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg transition-colors">
 
 {t('lab.p9derivations_check')}
 </button>
 </div>
 {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {t('lab.p9derivations_correct_p')} {pressure.toLocaleString()} Pa</p>}
 {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> {t('lab.p9derivations_try_p_gh_use')} {density}{t('lab.p9derivations_g_9_8_h')} {depth}</p>}
 </div>
 );
}

function HydraulicLiftInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
 const { t } = useTranslate();
 const [area1, setArea1] = useState(0.01);
 const [area2, setArea2] = useState(0.5);
 const [force1, setForce1] = useState(100);
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

 const force2 = (area2 / area1) * force1;
 const mechAdv = area2 / area1;

 const handleCheck = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 setCheckResult(Math.abs(val - force2) < force2 * 0.1 ? 'correct' : 'incorrect');
 if (Math.abs(val - force2) < force2 * 0.1) onAnswer(true);
 };

 return (
 <div className="space-y-4">
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.p9derivations_small_piston_area_m')}</label>
 <input type="range" min="0.001" max="0.1" step="0.001" value={area1} onChange={e => { setArea1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" />
 <span className="text-sm font-mono text-emerald-600">{area1.toFixed(3)} m²</span>
 </div>
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.p9derivations_large_piston_area_m')}</label>
 <input type="range" min="0.05" max="2" step="0.05" value={area2} onChange={e => { setArea2(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" />
 <span className="text-sm font-mono text-emerald-600">{area2.toFixed(2)} m²</span>
 </div>
 <div className="col-span-2">
 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.p9derivations_input_force_f_n')}</label>
 <input type="range" min="10" max="500" step="10" value={force1} onChange={e => { setForce1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" />
 <span className="text-sm font-mono text-emerald-600">{force1} N</span>
 </div>
 </div>

 {/* Visual */}
 <div className="relative h-32 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
 {/* Small piston */}
 <div className="absolute bottom-4 left-[15%]">
 <div className="w-8 h-16 bg-blue-400 rounded-t-lg flex items-center justify-center text-[8px] font-bold text-white">A₁</div>
 <div className="w-8 h-4 bg-blue-600 rounded-b-lg" />
 </div>
 {/* Fluid */}
 <div className="absolute bottom-2 left-[20%] right-[20%] h-4 bg-cyan-300/50 dark:bg-cyan-700/30 rounded" />
 {/* Large piston */}
 <div className="absolute bottom-4 right-[15%]">
 <div className="w-14 h-16 bg-emerald-400 rounded-t-lg flex items-center justify-center text-[8px] font-bold text-white">A₂</div>
 <div className="w-14 h-4 bg-emerald-600 rounded-b-lg" />
 </div>
 {/* Arrow on small piston */}
 <div className="absolute bottom-[55%] left-[15%] text-blue-600 text-[10px] animate-bounce">{t('lab.p9derivations_f')}</div>
 {/* Arrow on large piston */}
 <div className="absolute bottom-[55%] right-[15%] text-emerald-600 text-[10px]">{t('lab.p9derivations_f_1')}</div>
 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] text-slate-500">{mechAdv.toFixed(0)}{t('lab.p9derivations_mechanical_advantage')}</div>
 </div>

 <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
 <p className="text-xs text-emerald-700 dark:text-emerald-300">
 
 {t('lab.p9derivations_f_a_a_f')}{area2.toFixed(2)}/{area1.toFixed(3)}) × {force1} = <strong>{force2.toFixed(0)} N</strong><br />
 <strong>{t('lab.p9derivations_mechanical_advantage_1')}</strong> {mechAdv.toFixed(0)}×
 </p>
 </div>

 <div className="flex gap-2">
 <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
 placeholder={t('lab.p9derivations_output_force_n')}
 className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-emerald-500 outline-none" />
 <button onClick={handleCheck}
 className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors">
 
 {t('lab.p9derivations_check')}
 </button>
 </div>
 {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {t('lab.p9derivations_correct_f')} {force2.toFixed(0)} N</p>}
 {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> {t('lab.p9derivations_try_f_a_a_f')}</p>}
 </div>
 );
}

function KEInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
 const { t } = useTranslate();
 const [mass, setMass] = useState(2);
 const [vel, setVel] = useState(10);
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

 const ke = 0.5 * mass * vel * vel;

 const handleCheck = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 setCheckResult(Math.abs(val - ke) < ke * 0.05 ? 'correct' : 'incorrect');
 if (Math.abs(val - ke) < ke * 0.05) onAnswer(true);
 };

 const maxKe = 0.5 * 10 * 30 * 30; // 4500

 return (
 <div className="space-y-4">
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.p9derivations_mass_kg')}</label>
 <input type="range" min="0.5" max="10" step="0.5" value={mass} onChange={e => { setMass(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-yellow-500" />
 <span className="text-sm font-mono text-yellow-600">{mass} kg</span>
 </div>
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.p9derivations_velocity_m_s')}</label>
 <input type="range" min="1" max="30" step="1" value={vel} onChange={e => { setVel(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-yellow-500" />
 <span className="text-sm font-mono text-yellow-600">{vel} {t('lab.p9derivations_m_s')}</span>
 </div>
 </div>

 {/* Energy Bar */}
 <div className="bg-slate-100 dark:bg-[#1c1b1b] rounded-lg p-3 border border-slate-200 dark:border-[#2a2a2a]">
 <div className="flex justify-between text-[10px] text-slate-500 mb-1">
 <span>{t('lab.p9derivations_kinetic_energy')}</span>
 <span className="font-mono font-bold text-yellow-600">{ke.toFixed(0)} J</span>
 </div>
 <div className="w-full h-6 bg-slate-200 dark:bg-[#121212] rounded-full overflow-hidden">
 <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
 style={{ width: `${Math.min((ke / maxKe) * 100, 100)}%` }}>
 <span className="text-[8px] text-white font-bold">{ke.toFixed(0)} J</span>
 </div>
 </div>
 <p className="text-[10px] text-slate-400 mt-1">
 
 {t('lab.p9derivations_notice_doubling_velocity')} <strong>{t('lab.p9derivations_quadruples')}</strong> {t('lab.p9derivations_the_energy_ke_v')}
 </p>
 </div>

 <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
 <p className="text-xs text-yellow-700 dark:text-yellow-300">
 
 {t('lab.p9derivations_e_k_mv')} {mass} × {vel}² = ½ × {mass} × {vel * vel} = <strong>{ke.toFixed(0)} J</strong>
 </p>
 </div>

 <div className="flex gap-2">
 <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
 placeholder={t('lab.p9derivations_kinetic_energy_j')}
 className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-yellow-500 outline-none" />
 <button onClick={handleCheck}
 className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-colors">
 
 {t('lab.p9derivations_check')}
 </button>
 </div>
 {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {t('lab.p9derivations_correct_e_k')} {ke.toFixed(0)} J</p>}
 {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> {t('lab.p9derivations_try_e_k_mv')}</p>}
 </div>
 );
}

function GPEInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
 const { t } = useTranslate();
 const [mass, setMass] = useState(5);
 const [height, setHeight] = useState(10);
 const [userAns, setUserAns] = useState('');
 const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

 const gpe = mass * 9.8 * height;
 const maxGpe = 10 * 9.8 * 50; // 4900

 const handleCheck = () => {
 const val = parseFloat(userAns);
 if (isNaN(val)) return;
 setCheckResult(Math.abs(val - gpe) < gpe * 0.05 ? 'correct' : 'incorrect');
 if (Math.abs(val - gpe) < gpe * 0.05) onAnswer(true);
 };

 return (
 <div className="space-y-4">
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.p9derivations_mass_kg')}</label>
 <input type="range" min="1" max="20" step="1" value={mass} onChange={e => { setMass(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-purple-500" />
 <span className="text-sm font-mono text-purple-600">{mass} kg</span>
 </div>
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.p9derivations_height_m')}</label>
 <input type="range" min="1" max="50" step="1" value={height} onChange={e => { setHeight(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-purple-500" />
 <span className="text-sm font-mono text-purple-600">{height} m</span>
 </div>
 </div>

 {/* Visual */}
 <div className="relative h-32 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
 {/* Ground */}
 <div className="absolute bottom-0 left-0 right-0 h-4 bg-emerald-600" />
 {/* Object */}
 <div className="absolute left-1/2 w-8 h-8 bg-purple-500 rounded -translate-x-1/2 flex items-center justify-center text-white text-[8px] font-bold"
 style={{ bottom: `${4 + (height / 50) * 70}%` }}>
 {mass}kg
 </div>
 {/* Height arrow */}
 <div className="absolute left-[15%] bottom-4 top-8 w-0.5 bg-slate-400">
 <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] text-slate-500 font-mono">{height}m</div>
 <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[8px]">▲</div>
 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px]">▼</div>
 </div>
 {/* Energy bar */}
 <div className="absolute top-2 right-2 w-16 h-4 bg-slate-200 dark:bg-[#121212] rounded-full overflow-hidden">
 <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" style={{ width: `${Math.min((gpe / maxGpe) * 100, 100)}%` }} />
 </div>
 </div>

 <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
 <p className="text-xs text-purple-700 dark:text-purple-300">
 
 {t('lab.p9derivations_e_p_mgh')} {mass} × 9.8 × {height} = <strong>{gpe.toFixed(0)} J</strong>
 </p>
 </div>

 <div className="flex gap-2">
 <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
 placeholder={t('lab.p9derivations_potential_energy_j')}
 className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-purple-500 outline-none" />
 <button onClick={handleCheck}
 className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors">
 
 {t('lab.p9derivations_check')}
 </button>
 </div>
 {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {t('lab.p9derivations_correct_e_p')} {gpe.toFixed(0)} J</p>}
 {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> {t('lab.p9derivations_try_e_p_mgh_g_9_8_m_s')}</p>}
 </div>
 );
}

// ========== Step-by-step walkthrough steps ==========

const DERIVATIONS: DerivationModule[] = [
 {
 id: 'force-momentum',
 icon: Target,
 title: 'Force & Change in Momentum',
 formula: 'F = Δp / Δt',
 formulaDesc: 'The net force on an object equals the rate of change of its linear momentum.',
 color: 'blue',
 steps: [
 { label: "Newton's Second Law", content: "🚴 You're cycling at 10 m/s down a neighborhood street when a child suddenly runs out chasing a ball. You slam the brakes. Newton's 2nd law says F = ma — the brake pads squeeze the rim, applying a force that decelerates you. This is the force that will save the day." },
 { label: 'Express Acceleration', content: 'Your speed drops from 10 m/s to 0 in just 2 seconds. That rate of change is acceleration: a = (vf − vi)/Δt = (0 − 10)/2 = −5 m/s². Your body lurches forward — that\'s inertia fighting the change. The negative sign? You\'re slowing down, which means the force is backward.' },
 { label: 'Substitute into F = ma', content: 'You + your bike = 80 kg. F = m × (vf − vi)/Δt = 80 × (0 − 10)/2 = −400 N. Distribute the mass: F = (80×0 − 80×10)/2 = (0 − 800)/2. Your brakes are applying 400 N of force — about the weight of a small adult pushing against your motion!' },
 { label: 'Introduce Momentum', content: 'Momentum p = mv captures your "quantity of motion." You started with p = 80 × 10 = 800 kg·m/s. Over 2 seconds, that momentum drops to zero. So F = Δp/Δt = (0 − 800)/2 = −400 N. Force is simply how fast momentum changes. This is why airbags save lives — they increase impact time Δt, which reduces the force F!' },
 ],
 interactive: ForceMomentumInteractive,
 },
 {
 id: 'recoil',
 icon: Rocket,
 title: 'Recoil Velocity of a Gun',
 formula: 'v_g = −(m_b · v_b) / m_g',
 formulaDesc: 'Conservation of momentum gives the recoil velocity of a gun when a bullet is fired.',
 color: 'amber',
 steps: [
 { label: 'Conservation of Momentum', content: "🎯 You're at a shooting range, a 4 kg rifle resting on your shoulder. You breathe, aim at the target, and squeeze the trigger. The gun + bullet form an \"isolated system\" — all the momentum before firing must equal all the momentum after." },
 { label: 'Initial Momentum', content: 'Before firing, the rifle and the 10 g bullet are both completely still in your hands. Total initial momentum = 0. Everything is quiet, steady — zero motion, zero momentum. Then the firing pin strikes.' },
 { label: 'Final Momentum', content: 'BANG! The bullet rockets forward at 400 m/s. Its momentum: 0.01 × 400 = 4 kg·m/s forward. By conservation, the gun must have −4 kg·m/s momentum backward into your shoulder: m_b·v_b + m_g·v_g = 0.' },
 { label: 'Solve for v_g', content: 'Solving: v_g = −(m_b·v_b)/m_g = −(0.01 × 400)/4 = −1 m/s. The negative sign? The gun kicks backward into your shoulder at 1 m/s. A heavier gun recoils less — that\'s why competition shooters use massive rifles. Rockets work the same way: exhaust shoots down, the rocket goes up!' },
 ],
 interactive: RecoilInteractive,
 },
 {
 id: 'orbital-speed',
 icon: Satellite,
 title: 'Orbital Speed of a Satellite',
 formula: 'v = 2πr / T',
 formulaDesc: 'The average speed of a satellite in a circular orbit equals circumference divided by orbital period.',
 color: 'indigo',
 steps: [
 { label: 'Average Speed Formula', content: "🛰️ Imagine throwing a baseball horizontally from the top of a 100 km tall mountain. It arcs downward and lands far away. The further you want it to go, the faster you must throw. Average speed = distance / time — this simple idea is the seed of orbital mechanics." },
 { label: 'Distance in One Orbit', content: 'Now imagine throwing at 7.8 km/s — so fast that the Earth curves away beneath the ball at the same rate it falls! The ball never hits the ground — it orbits. In one full orbit, it travels the circumference of a circle: d = 2πr, where r is the distance from Earth\'s center.' },
 { label: 'Time for One Orbit', content: 'At 408 km above Earth (the ISS altitude), one complete orbit takes T = 92.7 minutes — that\'s the orbital period. The ISS crew sees 16 sunrises and sunsets every single day because they orbit so fast.' },
 { label: 'Final Formula', content: 'v = 2πr/T = 2π × 6,779,000 m / 5,562 s ≈ 7,660 m/s — over 27,000 km/h! Higher orbits are slower: the Moon at 384,000 km orbits at just 1 km/s. The higher you go, the more leisurely your journey around Earth.' },
 ],
 interactive: OrbitalSpeedInteractive,
 },
 {
 id: 'liquid-pressure',
 icon: Waves,
 title: 'Liquid Pressure (P = ρgh)',
 formula: 'P = ρgh',
 formulaDesc: 'Pressure in a liquid depends on its density, gravitational acceleration, and depth.',
 color: 'cyan',
 steps: [
 { label: 'Force on Base Area', content: "🏊 You jump off a boat into the ocean and dive down. Your ears feel an uncomfortable pressure building. Pressure = force / area — the column of water above you has weight, and that weight pushes on every square millimeter of your body." },
 { label: 'Mass in Terms of Density', content: 'The force is the weight of the water: F = mg. But m = ρV (density × volume). Seawater density is 1,025 kg/m³ — it\'s heavier than fresh water, which is why floating in the ocean is easier! F = ρ × V × g.' },
 { label: 'Volume of Column', content: 'The volume of water above you = area of your body × depth: V = A × h. So F = ρ × A × h × g. Notice the area A appears — a wider person has more water weight above them. But something magical happens next...' },
 { label: 'Substitute and Simplify', content: 'P = F/A = (ρ × A × h × g)/A = ρgh. The area CANCELS! Pressure at a given depth is the same for everyone regardless of body shape. At just 10 m deep, pressure doubles to 2 atmospheres. Free divers train for years to handle this — the pressure crushes air spaces like your lungs and sinuses.' },
 ],
 interactive: LiquidPressureInteractive,
 },
 {
 id: 'hydraulic-lift',
 icon: Flower2,
 title: 'Hydraulic Lift (Pascal’s Principle)',
 formula: 'F₂ = (A₂/A₁) × F₁',
 formulaDesc: 'Pascal’s principle: pressure applied to an enclosed fluid is transmitted equally throughout.',
 color: 'emerald',
 steps: [
 { label: 'Pressure on Small Piston', content: "🔧 You're a mechanic with a 1500 kg car that needs lifting. You place a hydraulic jack under the frame and pump the handle. Pushing the small piston (area = 0.005 m²) with just 240 N of force creates P₁ = 240/0.005 = 48,000 Pa — like pressing a pen tip into your palm." },
 { label: 'Pressure on Large Piston', content: 'Under the car, there\'s a large piston (area = 0.25 m²) that will do the heavy lifting. The pressure acting on it is P₂ = F₂/A₂. We don\'t know F₂ yet, but that\'s what we\'re solving for.' },
 { label: 'Pascal’s Principle', content: 'Blaise Pascal discovered something amazing: the 48,000 Pa you created at the pump handle is transmitted through the hydraulic fluid WITHOUT LOSING ANY STRENGTH. P₂ = P₁ = 48,000 Pa. The fluid carries your force invisibly to where it\'s needed.' },
 { label: 'Solve for Output Force', content: 'F₂/A₂ = F₁/A₁, so F₂ = (A₂/A₁) × F₁ = (0.25/0.005) × 240 = 12,000 N! Your puny 240 N push lifts a full car. Mechanical advantage = 50×. This same principle stops your car when you press the brake pedal, controls massive excavators, and even powers dentist chairs!' },
 ],
 interactive: HydraulicLiftInteractive,
 },
 {
 id: 'kinetic-energy',
 icon: Zap,
 title: 'Kinetic Energy (E_k = ½mv²)',
 formula: 'E_k = ½mv²',
 formulaDesc: 'The energy of a moving object depends on its mass and the square of its velocity.',
 color: 'yellow',
 steps: [
 { label: 'Work-Energy Theorem', content: "🛹 You're at the top of a massive half-pipe, heart pounding. You drop in, and gravity takes over. The work gravity does on you transforms into your kinetic energy: E_k = Work = F × d. The steeper the drop, the more work gravity does." },
 { label: 'Substitute F = ma', content: 'Gravity pulls you with force F = mg. The distance d you travel relates to your speed. Starting from rest, your average speed down the ramp is v_avg = v/2. So d = v_avg × t = (v/2) × t. E_k = (ma)(d) = m × a × (v/2 × t).' },
 { label: 'Substitute Acceleration', content: 'Your acceleration down the ramp is a = v/t (how quickly you reach speed v in time t). Plug it in: E_k = m × (v/t) × (v/2 × t). The t appears in the numerator AND denominator. Something beautiful is about to happen...' },
 { label: 'Final Formula', content: 'The time cancels! E_k = m × v × v/2 = ½mv². Doubling your speed means QUADRUPLING your energy. This is why car crashes at 100 km/h are 4× as destructive as at 50 km/h, and why dropping from twice the height on a skateboard doesn\'t just hurt twice as much — it hurts four times as much!' },
 ],
 interactive: KEInteractive,
 },
 {
 id: 'gravitational-pe',
 icon: Mountain,
 title: 'Gravitational Potential Energy (E_p = mgh)',
 formula: 'E_p = mgh',
 formulaDesc: 'The gravitational potential energy of an object depends on its mass, height, and gravity.',
 color: 'purple',
 steps: [
 { label: 'Work Done Lifting', content: "🎢 You're strapped into a roller coaster car, clicking up the first massive hill. The chain lift mechanism groans as it pulls you higher. Every meter you rise stores energy. E_p = Work = F × S — the motor does work against gravity to lift you." },
 { label: 'Force Required', content: 'The force needed to lift the 500 kg car (plus you!) at constant speed equals its weight: F = mg. With two passengers, total mass ≈ 700 kg, so F = 700 × 9.81 = 6,867 N — about the weight of a small car.' },
 { label: 'Distance Moved', content: 'The first hill towers 45 meters above the ground — that\'s the vertical height S = h. The motor\'s work: W = 6,867 × 45 = 309,015 J. Every joule is stored as gravitational potential energy, waiting to be released.' },
 { label: 'Final Formula', content: 'E_p = mgh = 700 × 9.81 × 45 = 309,015 J — enough energy to light a 60W bulb for 85 minutes! At the crest, you pause for a split second... then you plunge. That stored PE converts into kinetic energy as you race down, powering you through loops and corkscrews. The higher the first hill, the more energy for the entire ride!' },
 ],
 interactive: GPEInteractive,
 },
];

// ========== Main Component ==========

export default function LabP9Derivations() {
 const { t } = useTranslate();
 const [activeDerivation, setActiveDerivation] = useState(DERIVATIONS[0].id);
 const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
 const [score, setScore] = useState(0);
 const [completed, setCompleted] = useState<Record<string, boolean>>({});

 const current = DERIVATIONS.find(d => d.id === activeDerivation)!;

 const toggleStep = (derivId: string, stepIdx: number) => {
 setExpandedSteps(prev => ({ ...prev, [`${derivId}-${stepIdx}`]: !prev[`${derivId}-${stepIdx}`] }));
 };

 const handleAnswer = (correct: boolean) => {
 if (correct && !completed[activeDerivation]) {
 setCompleted(prev => ({ ...prev, [activeDerivation]: true }));
 setScore(s => s + 1);
 }
 };

 const getColorClasses = (color: string) => {
 const colors: Record<string, { bg: string; text: string; border: string; light: string; dark: string; btn: string; btnHover: string }> = {
 blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200', light: 'bg-blue-50', dark: 'dark:bg-blue-900/20', btn: 'bg-blue-600', btnHover: 'hover:bg-blue-700' },
 amber: { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200', light: 'bg-amber-50', dark: 'dark:bg-amber-900/20', btn: 'bg-amber-600', btnHover: 'hover:bg-amber-700' },
 indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-200', light: 'bg-indigo-50', dark: 'dark:bg-indigo-900/20', btn: 'bg-indigo-600', btnHover: 'hover:bg-indigo-700' },
 cyan: { bg: 'bg-cyan-500', text: 'text-cyan-600', border: 'border-cyan-200', light: 'bg-cyan-50', dark: 'dark:bg-cyan-900/20', btn: 'bg-cyan-600', btnHover: 'hover:bg-cyan-700' },
 emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200', light: 'bg-emerald-50', dark: 'dark:bg-emerald-900/20', btn: 'bg-emerald-600', btnHover: 'hover:bg-emerald-700' },
 yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-yellow-200', light: 'bg-yellow-50', dark: 'dark:bg-yellow-900/20', btn: 'bg-yellow-600', btnHover: 'hover:bg-yellow-700' },
 purple: { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-200', light: 'bg-purple-50', dark: 'dark:bg-purple-900/20', btn: 'bg-purple-600', btnHover: 'hover:bg-purple-700' },
 };
 return colors[color] || colors.blue;
 };

 const cc = getColorClasses(current.color);

 return (
 <div className="flex flex-col lg:h-screen bg-slate-50 dark:bg-[#000000] overflow-hidden">
 {/* Header */}
 <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 shrink-0">
 <h1 className="text-xl font-bold flex items-center gap-2">
 <GraduationCap className="w-6 h-6" />
 
 {t("Class 9 Physics Interactive Derivations")}
 </h1>
 <p className="text-sm text-white/80 mt-1">{t('lab.p9derivations_master_7_essential_derivations')}</p>
 </div>

 <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
 {/* Sidebar: Derivation List */}
 <div className="lg:w-64 shrink-0 bg-white dark:bg-[#121212] border-r border-slate-200 dark:border-[#1c1b1b] overflow-y-auto">
 <div className="p-3 border-b border-slate-100 dark:border-[#1c1b1b]">
 <div className="flex items-center justify-between">
 <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('lab.p9derivations_progress')}</span>
 <span className="text-xs font-bold text-indigo-600">{score}/{DERIVATIONS.length}</span>
 </div>
 <div className="w-full h-1.5 bg-slate-100 dark:bg-[#1c1b1b] rounded-full mt-1 overflow-hidden">
 <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
 style={{ width: `${(score / DERIVATIONS.length) * 100}%` }} />
 </div>
 </div>
 {DERIVATIONS.map(d => {
 const colors = getColorClasses(d.color);
 const isActive = d.id === activeDerivation;
 const isDone = completed[d.id];
 return (
 <button
 key={d.id}
 onClick={() => setActiveDerivation(d.id)}
 className={`w-full text-left px-3 py-3 border-b border-slate-100 dark:border-[#1c1b1b] transition-colors ${
 isActive ? `${colors.light} ${colors.dark} border-l-2 ${colors.border}` : 'hover:bg-slate-50 dark:hover:bg-[#1c1b1b]'
 }`}
 >
 <div className="flex items-center gap-2">
 <div className={`w-7 h-7 rounded-lg ${colors.bg} flex items-center justify-center shrink-0 ${isDone ? 'opacity-100' : 'opacity-60'}`}>
 {isDone ? <CheckCircle className="w-3.5 h-3.5 text-white" /> : <d.icon className="w-3.5 h-3.5 text-white" />}
 </div>
 <div className="min-w-0">
 <div className={`text-[11px] font-semibold truncate ${isActive ? colors.text : 'text-slate-700 dark:text-slate-300'}`}>
 {d.title}
 </div>
 <div className="text-[9px] font-mono text-slate-400">{d.formula}</div>
 </div>
 </div>
 </button>
 );
 })}
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

 {/* Step-by-step Walkthrough */}
 <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] overflow-hidden">
 <div className="px-4 py-3 border-b border-slate-100 dark:border-[#1c1b1b] flex items-center gap-2">
 <Sigma className="w-4 h-4 text-indigo-500" />
 <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{t('lab.p9derivations_step_by_step_derivation')}</span>
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
 <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{t('lab.p9derivations_try_it_yourself')}</span>
 {completed[current.id] && (
 <span className="ml-auto text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
 <CheckCircle className="w-3 h-3" /> {t('lab.p9derivations_completed')}
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
