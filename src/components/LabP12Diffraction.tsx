import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Activity, Settings2, Database, Calculator, GraduationCap } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from '../i18n';
import DeepDivePanel from './DeepDivePanel';
import ResearchPaperAnalysis, { RESEARCH_PAPERS } from './ResearchPaperAnalysis';
import { DIFFICULTY_CONFIGS, type DifficultyLevel } from '../utils/labScaffolding';
import { useLab } from '../store';

export default function LabP12Diffraction({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const { setLabScore } = useLab();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [difficulty, setDifficulty] = useState<DifficultyLevel>('understand');
 const config = DIFFICULTY_CONFIGS[difficulty];
 const [mode, setMode] = useState<'noise' | 'diffraction'>('diffraction');
 
 // Diffraction State
 const [wavelength, setWavelength] = useState<number>(550);
 const [linesPerMm, setLinesPerMm] = useState<number>(500);
 const [distanceL, setDistanceL] = useState<number>(2.0);
 
 // Noise State
 const [phaseShift, setPhaseShift] = useState<number>(0);
 
 // Data Logger
 const [logs, setLogs] = useState<Array<{wl: number, lpm: number, L: number, y1: number}>>([]);
 
 // Assessments
 const [ans1, setAns1] = useState('');
 const [ans2, setAns2] = useState('');
 const [feedback, setFeedback] = useState('');
 
 const [time, setTime] = useState(0);

 useEffect(() => {
 let rid: number;
 const loop = () => {
 setTime(t => t + 0.05);
 rid = requestAnimationFrame(loop);
 };
 rid = requestAnimationFrame(loop);
 return () => cancelAnimationFrame(rid);
 }, []);

 const d = 1 / (linesPerMm * 1000);
 const lambda = wavelength * 1e-9;
 const sinTheta1 = lambda / d;
 const hasM1 = sinTheta1 <= 1;
 const theta1 = hasM1 ? Math.asin(sinTheta1) : 0;
 const y1 = hasM1 ? distanceL * Math.tan(theta1) : 0;

 const handleRecord = () => {
 setLogs([...logs, { wl: wavelength, lpm: linesPerMm, L: distanceL, y1: Number(y1.toFixed(3)) }]);
 };

 const getWavelengthColor = (wl: number) => {
 let R, G, B;
 if (wl >= 380 && wl < 440) { R = -(wl - 440) / (440 - 380); G = 0; B = 1; }
 else if (wl >= 440 && wl < 490) { R = 0; G = (wl - 440) / (490 - 440); B = 1; }
 else if (wl >= 490 && wl < 510) { R = 0; G = 1; B = -(wl - 510) / (510 - 490); }
 else if (wl >= 510 && wl < 580) { R = (wl - 510) / (580 - 510); G = 1; B = 0; }
 else if (wl >= 580 && wl < 645) { R = 1; G = -(wl - 645) / (645 - 580); B = 0; }
 else if (wl >= 645 && wl <= 780) { R = 1; G = 0; B = 0; }
 else { R = 0; G = 0; B = 0; }
 
 let alpha = 1;
 if (wl > 700) alpha = 0.3 + 0.7 * (780 - wl) / (780 - 700);
 else if (wl < 420) alpha = 0.3 + 0.7 * (wl - 380) / (420 - 380);
 
 return `rgba(${Math.round(R * 255)}, ${Math.round(G * 255)}, ${Math.round(B * 255)}, ${alpha})`;
 };

 const laserColor = getWavelengthColor(wavelength);

 const checkAnswers = () => {
 let score = 0;
 if (ans1.trim() === '180') score++;
 if (ans2.trim() === '0.67') score++;
 if (score === 2) setFeedback('Perfect! You have mastered wave interference.');
 else setFeedback('Keep trying! Check your math (use two decimal places for Q2).');
 setLabScore(score, 2);
 };

 const renderNoiseSVG = () => {
 const points1 = [];
 const points2 = [];
 const pointsSum = [];
 for(let x = 0; x <= 400; x += 5) {
 const rad = (x / 400) * Math.PI * 4;
 const v1 = Math.sin(rad - time);
 const v2 = Math.sin(rad - time + (phaseShift * Math.PI) / 180);
 points1.push(`${x},${100 + 40 * v1}`);
 points2.push(`${x},${100 + 40 * v2}`);
 pointsSum.push(`${x},${250 + 40 * (v1 + v2)}`);
 }
 return (
 <svg viewBox="0 0 400 350" className="w-full h-full bg-[#000000] dark:bg-[#121212] rounded-lg shadow-inner">
 <text x="10" y="30" fill="white" fontSize="14" fontWeight="bold">{t('lab.p12diffraction_wave_1_2_original_canceling')}</text>
 <path d={`M ${points1.join(' L ')}`} stroke="#3b82f6" fill="none" strokeWidth="2" opacity="0.8" />
 <path d={`M ${points2.join(' L ')}`} stroke="#ef4444" fill="none" strokeWidth="2" opacity="0.8" />
 <line x1="0" y1="100" x2="400" y2="100" stroke="white" opacity="0.2" strokeDasharray="4" />
 
 <text x="10" y="180" fill="white" fontSize="14" fontWeight="bold">{t('lab.p12diffraction_resulting_sum_wave_your_ear')}</text>
 <path d={`M ${pointsSum.join(' L ')}`} stroke="#22c55e" fill="none" strokeWidth="3" />
 <line x1="0" y1="250" x2="400" y2="250" stroke="white" opacity="0.2" strokeDasharray="4" />
 </svg>
 );
 };

 const renderDiffractionSVG = () => {
 const gratingX = 60;
 const screenX = 60 + (distanceL / 5) * 280;
 const centerY = 175;
 const pixelsPerMeter = 60;
 const y1Svg = y1 * pixelsPerMeter;

 return (
 <svg viewBox="0 0 400 350" className="w-full h-full bg-[#000000] dark:bg-[#121212] rounded-lg shadow-inner">
 {/* Laser Source */}
 <rect x="10" y={centerY - 10} width="30" height="20" fill="#333" rx="2" />
 <rect x="40" y={centerY - 5} width="10" height="10" fill="#555" />
 
 {/* Grating */}
 <line x1={gratingX} y1="50" x2={gratingX} y2="300" stroke="#aaa" strokeWidth="4" strokeDasharray="2 4" />
 <text x={gratingX - 25} y="40" fill="white" fontSize="12">{t('lab.12diffraction_grating')}</text>

 {/* Screen */}
 <line x1={screenX} y1="50" x2={screenX} y2="300" stroke="#fff" strokeWidth="4" />
 <text x={screenX - 20} y="40" fill="white" fontSize="12">{t('lab.12diffraction_screen')}</text>

 {/* Rays */}
 <line x1="50" y1={centerY} x2={gratingX} y2={centerY} stroke={laserColor} strokeWidth="3" opacity="0.9" />
 <line x1={gratingX} y1={centerY} x2={screenX} y2={centerY} stroke={laserColor} strokeWidth="2" opacity="0.6" strokeDasharray="4" />
 
 <circle cx={screenX} cy={centerY} r="5" fill={laserColor} />
 <text x={screenX + 10} y={centerY + 4} fill="white" fontSize="12">{t('lab.12diffraction_m0')}</text>

 {hasM1 && (
 <>
 <line x1={gratingX} y1={centerY} x2={screenX} y2={centerY - y1Svg} stroke={laserColor} strokeWidth="2" opacity="0.6" strokeDasharray="4" />
 <line x1={gratingX} y1={centerY} x2={screenX} y2={centerY + y1Svg} stroke={laserColor} strokeWidth="2" opacity="0.6" strokeDasharray="4" />
 
<circle cx={screenX} cy={centerY - y1Svg} r="5" fill={laserColor} />
 <circle cx={screenX} cy={centerY + y1Svg} r="5" fill={laserColor} />
 <text x={screenX + 10} y={centerY - y1Svg + 4} fill="white" fontSize="12">{t('lab.12diffraction_m1')}</text>
 <text x={screenX + 10} y={centerY + y1Svg + 4} fill="white" fontSize="12">{t('lab.12diffraction_m1')}</text>
 
 {/* Dimension lines */}
 <line x1={screenX - 20} y1={centerY} x2={screenX - 20} y2={centerY - y1Svg} stroke="#aaa" strokeWidth="1" />
 <text x={screenX - 45} y={centerY - y1Svg/2} fill="#aaa" fontSize="10">{t('lab.12diffraction_y')}</text>
 </>
 )}
 
 {/* L dimension */}
 <line x1={gratingX} y1="320" x2={screenX} y2="320" stroke="#aaa" strokeWidth="1" />
 <text x={(gratingX + screenX)/2 - 10} y="335" fill="#aaa" fontSize="12">{t('lab.p12diffraction_l')} {distanceL.toFixed(1)}m</text>
 </svg>
 );
 };

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans select-none overflow-hidden min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.p12diffraction_lab_p12_1_optical_interference')} />

 <div className="px-4 pt-2">
 
 </div>

 {/* Difficulty Selector */}
 <div className="w-full px-4 py-2 md:px-6 bg-white dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b]">
 </div>
 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.p12diffraction_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.12diffraction_lab')}</button>
 </div>
 <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:overflow-visible">
 
 {/* Left Column: Theory */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center mb-4 text-blue-700">
 <Activity className="w-6 h-6 mr-2" />
 <h2 className="text-lg font-bold">{t('lab.p12diffraction_theory_context')} {config.showDerivations && <GraduationCap className="w-4 h-4 ml-2 text-indigo-500" />}</h2>
 </div>

 {config.showDerivations && (
 <DeepDivePanel
 derivation={{
 title: 'Wave-Particle Duality — Why d·sinθ = mλ for Matter Too',
 question: 'Light behaves as both a wave (interference pattern) AND a particle (photon). But de Broglie showed that particles ALSO have wave nature. How does the same diffraction equation apply to electrons?',
 steps: [
 {
 label: 'Light as an electromagnetic wave: Huygens\' Principle',
 latex: 'Each slit acts as a point source of spherical wavefronts.\nFor constructive interference: path difference = mλ\nPath diff = d × sin(θ)\n\nTherefore:\nd × sin(θ) = m × λ',
 explanation: 'When light passes through a double slit, each slit acts as a new wave source (Huygens\' Principle). Waves from the two slits travel different distances to reach a point on the screen. When the path difference equals an integer number of wavelengths, the waves arrive in phase, producing constructive interference — a bright fringe.'
 },
 {
 label: 'Einstein shows light is also a particle (photon)',
 latex: 'E_photon = hf = hc / λ\np_photon = h / λ\n\nPhotoelectric effect:\nK_max = hf - Φ\n\nWhere Φ = work function (minimum energy to eject an electron)',
 explanation: 'Einstein\'s photoelectric effect (Nobel Prize 1921) proved that light consists of discrete quanta — photons. Each photon carries energy E = hf and momentum p = h/λ. A single photon hits one atom and ejects one electron instantly, ruling out the classical wave picture of gradual energy absorption.'
 },
 {
 label: 'de Broglie: Particles are waves too! λ = h/p',
 latex: 'λ = h / p = h / (mv)\n\nWhere:\nh = Planck\'s constant = 6.63 × 10⁻³⁴ J·s\nm = mass of the particle\nv = velocity of the particle\np = mv = momentum\n\nFor an electron (m = 9.11×10⁻³¹ kg) at v = 10⁶ m/s:\nλ = 6.63×10⁻³⁴ / (9.11×10⁻³¹ × 10⁶)\nλ = 0.73 nm — comparable to X-ray wavelengths!',
 explanation: 'In 1924, Louis de Broglie proposed that every moving particle has an associated wavelength, inversely proportional to its momentum. This was revolutionary — it meant that electrons, neutrons, and even atoms should produce interference patterns just like light! The same d·sinθ = mλ equation applies to all of them, you just plug in the de Broglie wavelength.'
 },
 {
 label: 'Experimental confirmation: Davisson-Germer experiment',
 latex: 'Electron diffraction from a nickel crystal:\n\nBragg condition: nλ = 2d × sin(θ)\n\nFor electrons accelerated through V volts:\nλ = h / √(2meV)\nλ = 1.226 / √V nm\n\nAt V = 54V:\nλ = 1.226 / √54 = 0.167 nm\nThis matched the measured diffraction peak!',
 explanation: 'Davisson and Germer (Nobel Prize 1937) fired electrons at a nickel crystal and observed a diffraction pattern — exactly as de Broglie predicted. The same happened for neutrons, protons, and even C₆₀ buckyballs. This is why electron microscopes can achieve atomic resolution — electrons have much shorter wavelengths than visible light, giving λ ∼ 0.01 nm at 15 keV.'
 }
 ],
 conclusion: 'Wave-particle duality is not a paradox — it is the fundamental nature of quantum objects. Light and matter both exhibit wave properties (interference, diffraction) and particle properties (localized detection, momentum). The d·sinθ = mλ equation that you interact with in this lab is universal: it governs X-ray crystallography, electron microscopy, neutron scattering, and even the interference of large molecules like C₆₀. The wave nature determines where things CAN go; the particle nature determines where they DO go when measured.',
 realWorldApplication: 'Transmission Electron Microscopes (TEMs) use the wave nature of electrons to image individual atoms. By accelerating electrons to 200 keV, their de Broglie wavelength is λ = 0.0025 nm — 250,000x smaller than visible light. The same d·sinθ = mλ equation determines the diffraction pattern that the TEM uses to reconstruct atomic positions with sub-angstrom precision. This is how scientists recently imaged individual hydrogen atoms in a protein structure.'
 }}
 />
 )}

 <div className={`text-slate-700 dark:text-[#ffffff] space-y-4 text-sm leading-relaxed lg:overflow-y-auto flex-1 pr-2 ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block`}>
 <p>
 <strong>{t('lab.12diffraction_interference')}</strong> {t('lab.p12diffraction_occurs_when_two_or_more_waves_')} <em>{t('lab.12diffraction_constructiveinterference')}</em>{t('lab.12diffraction_thepeaksaligntoamplifythewavein')}<em>{t('lab.12diffraction_destructiveinterference')}</em>{t('lab.p12diffraction_a_peak_aligns_with_a_trough_ca')}
 </p>
 <div className={`bg-blue-50 p-3 rounded-lg border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900 flex-col `}>
 <strong>{t('lab.12diffraction_noisecancellation')}</strong><br />
 
 {t('lab.p12diffraction_target_wave_anti_noise_wave_18')}
 </div>
 <p>
 <strong>{t('lab.12diffraction_diffractiongratings')}</strong> {t('lab.p12diffraction_use_the_same_principle_for_lig')}
 </p>
 <p>
 
 {t('lab.p12diffraction_constructive_interference_crea')}
 </p>
 <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded-lg font-mono text-center flex-col `}>
 
 {t('lab.p12diffraction_d_sin_m')}
 </div>
 <ul className="list-disc pl-5 space-y-1">
 <li><strong>{t('lab.12diffraction_d')}</strong> {t('lab.p12diffraction_distance_between_slits_grating')}</li>
 <li><strong>{t('lab.12diffraction_label')}</strong>{t('lab.12diffraction_angletothemaximum')}</li>
 <li><strong>{t('lab.12diffraction_m')}</strong> {t('lab.p12diffraction_order_maximum_0_1_2')}</li>
 <li><strong>{t('lab.12diffraction_label')}</strong>{t('lab.12diffraction_wavelengthoflight')}</li>
 </ul>
 <p>
 
 {t('lab.p12diffraction_to_find_the_vertical_distance')} <strong>y</strong>{t('lab.12diffraction_onthescreenatadistance')}<strong>L</strong>:
 </p>
 <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded-lg font-mono text-center flex-col `}>
 
 {t('lab.p12diffraction_y_l_tan')}
 </div>
 </div>
 </div>

 {/* Middle Column: Simulation */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex justify-between items-center mb-4">
 <div className="flex items-center text-blue-700">
 <Settings2 className="w-6 h-6 mr-2" />
 <h2 className="text-lg font-bold">{t('lab.12diffraction_interactivesimulator')}</h2>
 </div>
 <div className={`flex overflow-x-auto hide-scrollbar bg-slate-100 dark:bg-[#121212] rounded-lg p-1 `}>
 <button 
 onClick={() => setMode('diffraction')}
 className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${mode === 'diffraction' ? 'bg-slate-50 dark:bg-[#121212] shadow text-blue-700' : 'text-slate-500 dark:text-[#a1a1aa]'}`}
 >
 
 {t('lab.p12diffraction_grating')}
 </button>
 <button 
 onClick={() => setMode('noise')}
 className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${mode === 'noise' ? 'bg-slate-50 dark:bg-[#121212] shadow text-blue-700' : 'text-slate-500 dark:text-[#a1a1aa]'}`}
 >
 
 {t('lab.p12diffraction_acoustic')}
 </button>
 </div>
 </div>

 <div className="h-64 mb-6 rounded-lg overflow-hidden border border-[#1c1b1b] dark:border-[#1c1b1b]">
 {mode === 'noise' ? renderNoiseSVG() : renderDiffractionSVG()}
 </div>

 <div className="flex-1 space-y-4">
 {mode === 'noise' ? (
 <div className={`space-y-4 bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div>
 <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 <span>{t('lab.p12diffraction_phase_shift_degrees')}</span>
 <span className="text-blue-600 font-bold">{phaseShift}°</span>
 </label>
 <input type="range" min="0" max="360" value={phaseShift} onChange={(e) => setPhaseShift(Number(e.target.value))} className="w-full accent-blue-600" />
 </div>
 </div>
 ) : (
 <div className={`space-y-4 bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div>
 <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 <span>{t('lab.p12diffraction_wavelength')}</span>
 <span className="font-bold" style={{ color: laserColor }}>{wavelength} nm</span>
 </label>
 <input type="range" min="400" max="700" step="10" value={wavelength} onChange={(e) => setWavelength(Number(e.target.value))} className="w-full" />
 </div>
 <div>
 <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 <span>{t('lab.12diffraction_gratinglinesmm')}</span>
 <span className="text-blue-600 font-bold">{linesPerMm}</span>
 </label>
 <input type="range" min="100" max="1000" step="100" value={linesPerMm} onChange={(e) => setLinesPerMm(Number(e.target.value))} className="w-full accent-blue-600" />
 </div>
 <div>
 <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 <span>{t('lab.p12diffraction_screen_distance_l')}</span>
 <span className="text-blue-600 font-bold">{distanceL.toFixed(1)} m</span>
 </label>
 <input type="range" min="1.0" max="5.0" step="0.5" value={distanceL} onChange={(e) => setDistanceL(Number(e.target.value))} className="w-full accent-blue-600" />
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Right Column: Assessment & Data */}
 <div className={`bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center justify-between mb-4 text-blue-700">
 <div className="flex items-center">
 <Database className="w-6 h-6 mr-2" />
 <h2 className="text-lg font-bold">{t('lab.12diffraction_data_andanalysis')}</h2>
 </div>
 {mode === 'diffraction' && (
 <button onClick={handleRecord} className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-semibold transition-colors">
 
 {t('lab.p12diffraction_record_data')}
 </button>
 )}
 </div>

 {mode === 'diffraction' && (
 <div className="max-h-40 lg:overflow-y-auto mb-6 border border-slate-200 dark:border-[#1c1b1b] rounded-lg">
 <table className="w-full text-sm text-left text-slate-600 dark:text-[#a1a1aa]">
 <thead className="text-xs text-slate-700 dark:text-[#ffffff] uppercase bg-slate-50 dark:bg-[#121212] sticky top-0">
 <tr>
 <th className="px-3 py-2">{t('lab.p12diffraction_nm')}</th>
 <th className="px-3 py-2">{t('lab.12diffraction_linesmm')}</th>
 <th className="px-3 py-2">{t('lab.p12diffraction_l_m')}</th>
 <th className="px-3 py-2 font-bold text-blue-700">{t('lab.p12diffraction_y_m')}</th>
 </tr>
 </thead>
 <tbody>
 {logs.length === 0 ? (
 <tr><td colSpan={4} className="px-3 py-4 text-center text-slate-400">{t('lab.12diffraction_nodatarecordedyet')}</td></tr>
 ) : (
 logs.map((log, i) => (
 <tr key={i} className="border-t border-slate-100">
 <td className="px-3 py-2">{log.wl}</td>
 <td className="px-3 py-2">{log.lpm}</td>
 <td className="px-3 py-2">{log.L.toFixed(1)}</td>
 <td className="px-3 py-2 font-bold">{log.y1}</td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 )}

 {config.showResearchConnections && (
 <div className="mb-4">
 <ResearchPaperAnalysis paper={RESEARCH_PAPERS['quantum-eraser']} />
 </div>
 )}

 <div className={`flex-1 flex-col bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center mb-3 text-slate-800 dark:text-[#ffffff]">
 <Calculator className="w-5 h-5 mr-2 text-blue-600" />
 <h3 className="font-bold">{t('lab.12diffraction_q_title')}</h3>
 </div>
 
 <div className="space-y-4 flex-1">
 <div>
 <label className="block text-sm text-slate-700 dark:text-[#ffffff] mb-1">
 
 {t('lab.p12diffraction_1_to_achieve_perfect_noise_can')}
 </label>
 <input 
 type="text" 
 value={ans1} 
 onChange={e => setAns1(e.target.value)} 
 placeholder={t('lab.p12diffraction_t_lab_12diffraction_eg90')} 
 className="w-full border border-slate-300 dark:border-[#1c1b1b] rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
 />
 </div>
 
 <div>
 <label className="block text-sm text-slate-700 dark:text-[#ffffff] mb-1">
 
 {t('lab.p12diffraction_2_calculate_the_expected_y_pos')} <em>{t('lab.p12diffraction_round_to_2_decimal_places')}</em>
 </label>
 <input 
 type="text" 
 value={ans2} 
 onChange={e => setAns2(e.target.value)} 
 placeholder={t('lab.p12diffraction_t_lab_12diffraction_eg055')} 
 className="w-full border border-slate-300 dark:border-[#1c1b1b] rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
 />
 </div>
 </div>

 {feedback && (
 <div className={`mt-4 p-3 rounded text-sm flex items-start ${feedback.includes('Perfect') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
 {feedback.includes('Perfect') ? <CheckCircle className="w-5 h-5 mr-2 shrink-0" /> : <XCircle className="w-5 h-5 mr-2 shrink-0" />}
 {feedback}
 </div>
 )}

 <button onClick={checkAnswers} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
 
 {t('lab.p12diffraction_check_answers')}
 </button>
 </div>

 </div>
 </div>
 </div>
 );
}
