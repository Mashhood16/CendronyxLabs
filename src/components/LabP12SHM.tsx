import { useState, useRef, useEffect, useMemo } from 'react';
import { Car, Waves, Activity, CheckCircle, XCircle, Volume2, GraduationCap } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from '../i18n';
import DeepDivePanel from './DeepDivePanel';
import ResearchPaperAnalysis, { RESEARCH_PAPERS } from './ResearchPaperAnalysis';
import { DIFFICULTY_CONFIGS, type DifficultyLevel } from '../utils/labScaffolding';

export default function LabP12SHM({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [difficulty, setDifficulty] = useState<DifficultyLevel>('understand');
 const config = DIFFICULTY_CONFIGS[difficulty];
 const [scenario] = useState<'damping' | 'waves'>('damping');

 // Damping State
 const [mass, setMass] = useState<number>(1000); // kg
 const [springK, setSpringK] = useState<number>(40000); // N/m
 const [dampingC, setDampingC] = useState<number>(2000); // Ns/m
 const [bumpTrigger, setBumpTrigger] = useState<number>(0);
 const [dampingAns, setDampingAns] = useState('');
 const [dampingStatus, setDampingStatus] = useState<'idle'|'correct'|'incorrect'>('idle');

 // Waves State
 const [frequency, setFrequency] = useState<number>(100); // Hz
 const L = 1.0; // m
 const v_sound = 340; // m/s
 const [waveAns, setWaveAns] = useState('');
 const [waveStatus, setWaveStatus] = useState<'idle'|'correct'|'incorrect'>('idle');

 const checkDamping = () => {
 const val = parseFloat(dampingAns);
 // critical damping c = 2 * sqrt(m*k)
 // for m=1000, k=40000 -> c = 2*sqrt(4e7) = 2*6324.5 = 12649
 if (!isNaN(val) && val >= 12600 && val <= 12700) setDampingStatus('correct');
 else setDampingStatus('incorrect');
 };

 const checkWave = () => {
 const val = parseFloat(waveAns);
 // f3 = 3 * 340 / (2 * 1.0) = 510 Hz
 if (!isNaN(val) && val === 510) setWaveStatus('correct');
 else setWaveStatus('incorrect');
 };

 // Damping Simulation Animation Loop
 const [displacement, setDisplacement] = useState<number>(0);
 const simRef = useRef({ y: 0, v: 0, lastTime: 0 });
 const reqRef = useRef<number>(0);

 useEffect(() => {
 if (scenario !== 'damping') return;
 
 // trigger bump
 simRef.current.v = -2; // initial velocity kick upward
 simRef.current.y = 0;
 simRef.current.lastTime = performance.now();

 const animate = (time: number) => {
 const dt = Math.min((time - simRef.current.lastTime) / 1000, 0.05);
 simRef.current.lastTime = time;

 // m * a + c * v + k * y = 0
 // a = -(c * v + k * y) / m
 const a = -(dampingC * simRef.current.v + springK * simRef.current.y) / mass;
 
 simRef.current.v += a * dt;
 simRef.current.y += simRef.current.v * dt;

 setDisplacement(simRef.current.y);
 reqRef.current = requestAnimationFrame(animate);
 };
 
 reqRef.current = requestAnimationFrame(animate);
 return () => cancelAnimationFrame(reqRef.current);
 }, [bumpTrigger, mass, springK, dampingC, scenario]);

 // Flames Simulation
 const numHoles = 50;
 const [timeState, setTimeState] = useState(0);
 
 useEffect(() => {
 if (scenario !== 'waves') return;
 const interval = setInterval(() => {
 setTimeState(t => t + 0.05);
 }, 50);
 return () => clearInterval(interval);
 }, [scenario]);

 const flames = useMemo(() => {
 // Check resonance
 // n = f * 2L / v
 const nExact = (frequency * 2 * L) / v_sound;
 const nearestN = Math.round(nExact);
 const detuning = Math.abs(nExact - nearestN); // 0 at resonance
 
 // Resonance amplification
 const amplitude = detuning < 0.1 ? 40 : (detuning < 0.2 ? 20 : 5);
 const k = (2 * Math.PI * frequency) / v_sound;

 return Array.from({length: numHoles}).map((_, i) => {
 const x = (i / (numHoles - 1)) * L;
 // Standing wave equation: y = A * sin(kx) * cos(wt) + noise
 const standing = amplitude * Math.abs(Math.sin(k * x) * Math.cos(frequency * timeState * 0.1));
 const noise = Math.random() * 5 + 2;
 return Math.max(standing + noise, 5); // min flame height 5
 });
 }, [frequency, timeState]);

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.p12shm_oscillations_waves')} />

 <div className="px-4 pt-2 lg:pt-0">
 
 </div>

 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.p12shm_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.12shm_lab')}</button>
 </div>
 <div className="flex flex-col lg:grid lg:grid-cols-3 lg:flex-1 gap-0 lg:gap-6 p-6 lg:overflow-visible">
 
 {/* Left Column: Theory */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 {scenario === 'damping' ? (
 <>
 <h2 className="text-2xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
 <Car className="text-blue-600"/> {t('lab.p12shm_damped_harmonic_motion')} {config.showDerivations && <GraduationCap className="w-4 h-4 text-indigo-500" />}
 </h2>
 <div className="text-slate-600 dark:text-[#a1a1aa] space-y-4">
 <p>
 
 {t('lab.p12shm_a_car_suspension_system_uses_s')}
 </p>
 <p>
 
 {t('lab.p12shm_without_dampers_the_car_would_')}
 </p>
 <div className={`bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900 flex-col `}>
 <h3 className="font-semibold text-blue-900 mb-2 dark:text-[#ffffff]">{t('lab.12shm_criticaldamping')}</h3>
 <p className="font-mono text-center text-blue-800 dark:text-[#ffffff]">{t('lab.p12shm_c_c_2_mk')}</p>
 <ul className="text-sm text-blue-800 mt-2 list-disc pl-5 dark:text-[#ffffff]">
 <li><strong>{t('lab.p12shm_underdamped_c_lt_c_c')}</strong>{t('lab.12shm_systemoscillateswithdecreasingampli')}</li>
 <li><strong>{t('lab.p12shm_critically_damped_c_c_c')}</strong> {t('lab.p12shm_system_returns_to_equilibrium_')}</li>
 <li><strong>{t('lab.p12shm_overdamped_c_gt_c_c')}</strong>{t('lab.12shm_systemreturnstoequilibriumslowlywit')}</li>
 </ul>
 </div>
 </div>
 </>
 ) : (
 <>
 <h2 className="text-2xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
 <Waves className="text-red-500"/> {t('lab.p12shm_standing_waves')}
 </h2>
 <div className="text-slate-600 dark:text-[#a1a1aa] space-y-4">
 <p>
 
 {t('lab.p12shm_when_two_identical_waves_trave')} <strong>{t('lab.12shm_standingwave')}</strong>.
 </p>
 <p>
 A <strong>{t('lab.12shm_rubenstube')}</strong> {t('lab.p12shm_is_a_pipe_filled_with_flammabl')}
 </p>
 <div className={`bg-red-50 p-4 rounded-lg border border-red-100 flex-col `}>
 <h3 className="font-semibold text-red-900 mb-2">{t('lab.p12shm_resonance_condition_closed_tub')}</h3>
 <p className="font-mono text-center text-red-800">{t('lab.p12shm_f_n_n_v_2l')}</p>
 <p className="text-sm text-red-800 mt-2">
 
 {t('lab.p12shm_where')} <em>n</em> {t('lab.p12shm_is_an_integer_1_2_3')} <em>v</em> {t('lab.p12shm_is_the_speed_of_sound_340_m_s_')} <em>L</em> {t('lab.p12shm_is_the_tube_length_at_resonanc')}
 </p>
 </div>
 </div>
 
 {config.showDerivations && (
 <DeepDivePanel
 derivation={{
 title: "SHM from Hooke's Law",
 question: "Why does a mass on a spring oscillate with frequency ω = √(k/m)? Let's derive SHM from first principles.",
 steps: [
 {
 label: "Hooke's Law & Newton's 2nd",
 latex: "F = -kx\nm·a = -kx\nm·d²x/dt² = -kx",
 explanation: "For an ideal spring, the restoring force is proportional to displacement (Hooke's Law). Apply Newton's 2nd Law: m·d²x/dt² = -kx. Rearranging: d²x/dt² + (k/m)·x = 0. This is the fundamental equation of SHM."
 },
 {
 label: "Guess the Solution",
 latex: "x(t) = A·cos(ωt + φ)\ndx/dt = -A·ω·sin(ωt + φ)\nd²x/dt² = -A·ω²·cos(ωt + φ) = -ω²·x",
 explanation: "We try x(t) = A·cos(ωt + φ), where A is amplitude, ω is angular frequency, and φ is phase. Differentiate twice: first derivative gives velocity, second gives acceleration. Notice d²x/dt² = -ω²·x."
 },
 {
 label: "Substitute to Find ω",
 latex: "d²x/dt² = -(k/m)·x (from Newton)\nd²x/dt² = -ω²·x (from solution)\n∴ -ω²·x = -(k/m)·x\nω² = k/m\nω = √(k/m)",
 explanation: "Equating the two expressions for acceleration: -ω²·x = -(k/m)·x. Cancel -x (assuming x ≠ 0): ω² = k/m. Therefore the angular frequency is ω = √(k/m). The period T = 2π/ω = 2π√(m/k)."
 },
 {
 label: "Energy in SHM",
 latex: "PE = ½kx² = ½k[A·cos(ωt + φ)]²\nKE = ½mv² = ½m[ωA·sin(ωt + φ)]² = ½kA²·sin²(ωt + φ)\nE_total = PE + KE = ½kA²[cos² + sin²] = ½kA²",
 explanation: "Total mechanical energy is constant! PE is maximum at amplitude (x = ±A), KE is maximum at equilibrium (x = 0). Using sin² + cos² = 1, total energy E = ½kA². This energy conservation is why undamped SHM oscillates forever."
 }
 ],
 conclusion: "Simple Harmonic Motion emerges naturally from Hooke's law (F = -kx) combined with Newton's 2nd law. The frequency depends only on spring constant k and mass m: ω = √(k/m). This exact equation governs everything from car suspensions to MEMS oscillators.",
 realWorldApplication: "Car suspension tuning directly uses ω = √(k/m) and critical damping c_c = 2√(mk) — the same formulas in this lab. MEMS accelerometers in smartphones use tiny proof masses on springs oscillating at their resonant frequency, and by measuring the frequency shift from acceleration, they track your phone's orientation!"
 }}
 defaultExpanded={difficulty === 'deep-dive'}
 />
 )}
 </>
 )}
 </div>

 {/* Middle Column: Simulation */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex-col items-center '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2 w-full">
 {scenario === 'damping' ? <Car className="text-indigo-500"/> : <Volume2 className="text-indigo-500"/>}
 
 {t('lab.p12shm_interactive_visualizer')}
 </h2>
 
 <div className={`w-full aspect-square max-w-md bg-[#000000] dark:bg-[#121212] rounded-xl relative flex flex-col items-center justify-end border-4 border-[#1c1b1b] dark:border-[#1c1b1b] shadow-inner pb-10 `}>
 {scenario === 'damping' ? (
 <div className="relative w-full h-full flex justify-center items-center">
 {/* Reference line */}
 <div className="absolute top-1/2 w-full border-t border-dashed border-slate-600 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t"></div>
 
 {/* Mass (Car Chassis) */}
 <div 
 className="w-32 h-16 bg-blue-500 rounded-t-xl absolute flex items-center justify-center shadow-lg border-2 border-blue-400 dark:bg-teal-950/20 dark:border-teal-900"
 style={{ transform: `translateY(${displacement * 50}px)` }} // Scale displacement
 >
 <span className="text-white font-bold">{mass} kg</span>
 </div>

 {/* Spring/Damper */}
 <div 
 className="w-4 bg-slate-400 dark:bg-[#121212] absolute left-[calc(50%-2rem)]"
 style={{ 
 bottom: '20%', 
 height: `${50 - displacement * 50}px`,
 transition: 'none'
 }}
 />
 <div 
 className="w-4 bg-orange-400 absolute left-[calc(50%+1rem)]"
 style={{ 
 bottom: '20%', 
 height: `${50 - displacement * 50}px`,
 transition: 'none'
 }}
 />
 
 {/* Ground Wheel */}
 <div className="absolute bottom-[10%] w-64 h-2 bg-slate-700 dark:bg-[#121212] rounded"></div>
 
 {/* Control Panel overlay */}
 <div className="absolute top-4 right-4 flex flex-col gap-2">
 <button 
 onClick={() => setBumpTrigger(t => t + 1)}
 className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40"
 >
 
 {t('lab.p12shm_hit_bump')}
 </button>
 </div>
 </div>
 ) : (
 <div className="relative w-full h-full flex flex-col justify-end items-center px-4 pb-12">
 {/* Flames */}
 <div className="flex w-full items-end justify-between px-2 h-40">
 {flames.map((h, i) => (
 <div 
 key={i} 
 className="w-1 bg-gradient-to-t from-blue-500 via-orange-500 to-yellow-300 rounded-t"
 style={{ height: `${h}px`, opacity: 0.9 }}
 />
 ))}
 </div>
 {/* Tube */}
 <div className="w-full h-6 bg-slate-400 dark:bg-[#121212] rounded-sm border-2 border-slate-500 dark:border-[#1c1b1b] relative flex items-center">
 <div className="absolute left-[-10px] w-4 h-8 bg-[#121212] dark:bg-[#121212] rounded-l" /> {/* Speaker */}
 <div className="absolute right-[-10px] w-2 h-8 bg-slate-600 dark:bg-[#121212]" /> {/* Closed end */}
 <span className="text-xs font-bold text-slate-800 dark:text-[#ffffff] w-full text-center">{t('lab.12shm_l10m')}</span>
 </div>
 </div>
 )}
 </div>

 <div className="w-full mt-6 space-y-4">
 {scenario === 'damping' ? (
 <>
 <div>
 <div className="flex justify-between mb-1">
 <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.p12shm_mass_m')}</label>
 <span className="text-sm font-mono text-indigo-600">{mass} kg</span>
 </div>
 <input 
 type="range" min="500" max="2000" step="50" 
 value={mass} onChange={(e) => setMass(parseFloat(e.target.value))}
 className="w-full h-2 bg-slate-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer accent-indigo-600"
 />
 </div>
 <div>
 <div className="flex justify-between mb-1">
 <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.p12shm_spring_constant_k')}</label>
 <span className="text-sm font-mono text-indigo-600">{springK} {t('lab.p12shm_n_m')}</span>
 </div>
 <input 
 type="range" min="10000" max="100000" step="1000" 
 value={springK} onChange={(e) => setSpringK(parseFloat(e.target.value))}
 className="w-full h-2 bg-slate-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer accent-indigo-600"
 />
 </div>
 <div>
 <div className="flex justify-between mb-1">
 <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.p12shm_damping_c')}</label>
 <span className="text-sm font-mono text-indigo-600">{dampingC} {t('lab.p12shm_ns_m')}</span>
 </div>
 <input 
 type="range" min="0" max="30000" step="100" 
 value={dampingC} onChange={(e) => setDampingC(parseFloat(e.target.value))}
 className="w-full h-2 bg-slate-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer accent-indigo-600"
 />
 </div>
 </>
 ) : (
 <>
 <div>
 <div className="flex justify-between mb-1">
 <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.p12shm_speaker_frequency_f')}</label>
 <span className="text-sm font-mono text-red-600">{frequency} Hz</span>
 </div>
 <input 
 type="range" 
 min="50" max="1000" step="1" 
 value={frequency} 
 onChange={(e) => setFrequency(parseFloat(e.target.value))}
 className="w-full h-2 bg-slate-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer accent-red-600"
 />
 </div>
 </>
 )}
 </div>
 </div>

 {/* Right Column: Assessment */}
 <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col gap-6 lg:overflow-y-auto ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
 <Activity className="text-emerald-500" />
 
 {t('lab.p12shm_engineering_tasks')}
 </h2>

 <div className="space-y-6">
 {scenario === 'damping' ? (
 <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.12shm_tunethesuspension')}</h3>
 <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-3">
 
 {t('lab.p12shm_a_car_has_a_mass_of')} <strong>{t('lab.p12shm_1000_kg')}</strong>{t('lab.12shm_andacombinedspringconstantof')}<strong>{t('lab.p12shm_40_000_n_m')}</strong>{t('lab.p12shm_calculate_the_exact_damping_co')} <em>c</em>{t('lab.12shm_requiredfor')}<strong>{t('lab.12shm_criticaldamping')}</strong>.
 </p>
 <div className="flex gap-2">
 <input 
 type="text" 
 value={dampingAns}
 onChange={(e) => setDampingAns(e.target.value)}
 placeholder={t('lab.p12shm_t_lab_12shm_eg12000')}
 className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
 />
 <button 
 onClick={checkDamping}
 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
 >
 
 {t('lab.p12shm_check')}
 </button>
 </div>
 {dampingStatus === 'correct' && (
 <p className="text-emerald-600 text-sm mt-2 flex items-center gap-1">
 <CheckCircle size={16}/> {t('lab.p12shm_correct_c_12_649_ns_m_try_sett')}
 </p>
 )}
 {dampingStatus === 'incorrect' && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><XCircle size={16}/> {t('lab.p12shm_try_again_use_c_2_mk')}</p>}
 </div>
 ) : (
 <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.12shm_findtheharmonic')}</h3>
 <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-3">
 
 {t('lab.p12shm_for_a_closed_tube_of_length_l_')} <strong>{t('lab.p12shm_3rd_harmonic_n_3')}</strong> {t('lab.p12shm_standing_wave_assume_the_speed')}
 </p>
 <div className="flex gap-2">
 <input 
 type="text" 
 value={waveAns}
 onChange={(e) => setWaveAns(e.target.value)}
 placeholder={t('lab.p12shm_t_lab_12shm_eg400')}
 className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
 />
 <button 
 onClick={checkWave}
 className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium dark:text-white dark:text-white dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40"
 >
 
 {t('lab.p12shm_check')}
 </button>
 </div>
 {waveStatus === 'correct' && (
 <p className="text-emerald-600 text-sm mt-2 flex items-center gap-1">
 <CheckCircle size={16}/> {t('lab.p12shm_correct_f_510_hz_set_the_simul')}
 </p>
 )}
 {waveStatus === 'incorrect' && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><XCircle size={16}/> {t('lab.p12shm_try_again_f_n_n_v_2l')}</p>}
 </div>
 )}
 </div>

 {config.showResearchConnections && (
 <ResearchPaperAnalysis paper={RESEARCH_PAPERS['mems-oscillator']} />
 )}
 </div>
 </div>
 </div>
 );
}
