import { useState, useEffect, useRef } from 'react';
import { Zap, Camera, CheckCircle, XCircle, Activity, Settings2, Database, Calculator, GraduationCap } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from '../i18n';
import DeepDivePanel from './DeepDivePanel';
import ResearchPaperAnalysis, { RESEARCH_PAPERS } from './ResearchPaperAnalysis';
import { DIFFICULTY_CONFIGS, type DifficultyLevel } from '../utils/labScaffolding';
import { useLab } from '../store';

export default function LabP12ElectricPotential({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const { setLabScore } = useLab();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [difficulty, setDifficulty] = useState<DifficultyLevel>('understand');
 const config = DIFFICULTY_CONFIGS[difficulty];
 const [mode, setMode] = useState<'eel' | 'rc'>('eel');
 
 // Eel State
 const [electrocytes, setElectrocytes] = useState<number>(5000);
 const [voltPerCell, setVoltPerCell] = useState<number>(0.15);
 const [isShocking, setIsShocking] = useState(false);
 
 // RC State
 const [capacitance, setCapacitance] = useState<number>(100);
 const [resistance, setResistance] = useState<number>(500);
 const [supplyVoltage, setSupplyVoltage] = useState<number>(100);
 const [isCharging, setIsCharging] = useState(false);
 const [vCap, setVCap] = useState(0);
 
 const vCapRef = useRef(0);
 const lastTime = useRef(performance.now());
 const [vHistory, setVHistory] = useState<number[]>([]);

 // Logs and Assessments
 const [logs, setLogs] = useState<Array<any>>([]);
 const [ans1, setAns1] = useState('');
 const [ans2, setAns2] = useState('');
 const [feedback, setFeedback] = useState('');

 const totalEelVoltage = electrocytes * voltPerCell;

 useEffect(() => {
 let rid: number;
 const update = (timeNow: number) => {
  const dt = Math.min((timeNow - lastTime.current) / 1000, 0.1);
  lastTime.current = timeNow;
  
  const RC = resistance * (capacitance * 1e-6);
  let cv = vCapRef.current;
  
  if (isCharging) {
  cv += ((supplyVoltage - cv) / RC) * dt;
  } else {
  cv += (-cv / RC) * dt;
  }
  
  vCapRef.current = cv;
  setVCap(cv);
  rid = requestAnimationFrame(update);
 };
 rid = requestAnimationFrame(update);
 return () => cancelAnimationFrame(rid);
 }, [isCharging, resistance, capacitance, supplyVoltage]);

 useEffect(() => {
 const interval = setInterval(() => {
  setVHistory(prev => {
  const next = [...prev, vCapRef.current];
  return next.length > 60 ? next.slice(-60) : next;
  });
 }, 50);
 return () => clearInterval(interval);
 }, []);

 const handleRecord = () => {
 if (mode === 'eel') {
  setLogs([...logs, { type: 'Eel', info: `${electrocytes} cells`, val1: `${voltPerCell}V/cell`, val2: `${totalEelVoltage.toFixed(1)}V` }]);
 } else {
  const tau = (resistance * capacitance * 1e-6).toFixed(3);
  setLogs([...logs, { type: 'RC', info: `C=${capacitance}μF, R=${resistance}Ω`, val1: `Vs=${supplyVoltage}V`, val2: `τ=${tau}s` }]);
 }
 };

 const checkAnswers = () => {
 let score = 0;
 if (ans1.trim() === '750') score++;
 if (ans2.trim() === '0.1') score++;
 if (score === 2) setFeedback('Excellent work! Both calculations are correct.');
 else setFeedback('Please check your calculations and try again.');
    setLabScore(score, 2);
 };

 const handleShock = () => {
 setIsShocking(true);
 setTimeout(() => setIsShocking(false), 500);
 };

 const renderEelSVG = () => {
 const segments = Math.min(Math.floor(electrocytes / 200), 50);
 const activeColor = isShocking ? '#fde047' : '#3b82f6';
 const bodyParts = [];
 for(let i=0; i<segments; i++) {
  bodyParts.push(
   <rect key={i} x={50 + i * 6} y={150 + Math.sin(i*0.3)*10} width="5" height="20" rx="2" fill={activeColor} opacity={0.6 + 0.4*(voltPerCell/0.15)} />
  );
 }
 return (
  <svg viewBox="0 0 400 300" className="w-full h-full bg-[#000000] dark:bg-[#121212] rounded-lg shadow-inner">
  {isShocking && (
   <circle cx="200" cy="150" r="100" fill="#fef08a" opacity="0.2" className="animate-ping" />
  )}
  <text x="10" y="30" fill="white" fontSize="14" fontWeight="bold">{t('lab.12electricpotential_electrophoruselectricus')}</text>
  <path d={`M 30,160 Q 40,150 50,150`} stroke="#1e3a8a" fill="none" strokeWidth="20" strokeLinecap="round" />
  {bodyParts}
  {isShocking && (
   <>
    <path d="M 200,50 L 220,90 L 190,100 L 230,140" stroke="#fde047" fill="none" strokeWidth="4" />
    <path d="M 100,250 L 120,210 L 90,200 L 130,160" stroke="#fde047" fill="none" strokeWidth="4" />
    <path d="M 300,100 L 320,140 L 290,150 L 330,190" stroke="#fde047" fill="none" strokeWidth="4" />
    <text x="140" y="80" fill="#fde047" fontSize="24" fontWeight="bold" className="animate-pulse">{totalEelVoltage.toFixed(0)}  {t('lab.p12electricpotential_v_shock')}</text>
   </>
  )}
  <text x="10" y="280" fill="#aaa" fontSize="12">{t('lab.12electricpotential_internalbiocapacitorsseriesconnecti')}</text>
  </svg>
 );
 };

 const renderRCSVG = () => {
 // Generate graph line
 const points = vHistory.map((v, i) => `${i * (400 / 60)},${250 - (v / 300) * 200}`);
 const bulbBrightness = vCap / 300; // max brightness at 300V
 
 return (
  <svg viewBox="0 0 400 300" className="w-full h-full bg-[#000000] dark:bg-[#121212] rounded-lg shadow-inner">
  <text x="10" y="30" fill="white" fontSize="14" fontWeight="bold">{t('lab.p12electricpotential_voltage_across_capacitor_v_vs_')}</text>
  
  {/* Graph background/grid */}
  <line x1="0" y1="250" x2="400" y2="250" stroke="#555" />
  <line x1="0" y1="183.3" x2="400" y2="183.3" stroke="#333" strokeDasharray="4" />
  <text x="5" y="178" fill="#666" fontSize="10">{t('lab.p12electricpotential_100v')}</text>
  <line x1="0" y1="50" x2="400" y2="50" stroke="#333" strokeDasharray="4" />
  <text x="5" y="45" fill="#666" fontSize="10">{t('lab.p12electricpotential_300v')}</text>

  {/* Live Graph Line */}
  {points.length > 0 && (
   <path d={`M ${points.join(' L ')}`} stroke="#22c55e" fill="none" strokeWidth="3" />
  )}

  {/* Flash Bulb Visual */}
  <g transform="translate(320, 50)">
   <circle cx="0" cy="0" r="30" fill={!isCharging && vCap > 10 ? `rgba(255, 255, 255, ${bulbBrightness})` : '#111'} stroke="#555" strokeWidth="2" />
   <path d="M -10,15 L -10,35 L 10,35 L 10,15" fill="#333" />
   <text x="-45" y="55" fill="white" fontSize="10">{t('lab.12electricpotential_cameraflash')}</text>
   {!isCharging && vCap > 10 && (
    <circle cx="0" cy="0" r={30 + bulbBrightness * 20} fill="#fde047" opacity={bulbBrightness * 0.5} className="animate-ping" />
   )}
  </g>
  
  <text x="10" y="280" fill="#22c55e" fontSize="14" fontWeight="bold">{t('lab.p12electricpotential_current')} {vCap.toFixed(1)} V</text>
  </svg>
 );
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none overflow-hidden min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.p12electricpotential_lab_p12_2_capacitors_bioelectr')} />

  <div className="px-4 pt-2 lg:pt-0">
   
  </div>

  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.p12electricpotential_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.12electricpotential_lab')}</button>
  </div>
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg: lg:overflow-visible">
  
  {/* Left Column: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
      <div className="flex items-center mb-4 text-emerald-700">
   <Activity className="w-6 h-6 mr-2" />
   <h2 className="text-lg font-bold">{t('lab.p12electricpotential_theory_context')} {config.showDerivations && <GraduationCap className="w-4 h-4 text-indigo-500 ml-2" />}</h2>
   </div>
   <div className={`text-slate-700 dark:text-[#ffffff] space-y-4 text-sm leading-relaxed lg:overflow-y-auto flex-1 pr-2 ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block`}>
   <p>
    A <strong>{t('lab.12electricpotential_capacitor')}</strong>  {t('lab.p12electricpotential_is_a_device_that_stores_electr')} <em>Q</em>{t('lab.12electricpotential_itstoresdependsonitscapacitance')}<em>C</em>{t('lab.12electricpotential_andvoltage')}<em>V</em>:
   </p>
   <div className={`bg-emerald-50 p-3 rounded-lg font-mono text-center border border-emerald-100 flex-col `}>
    
                             {t('lab.p12electricpotential_q_c_v')}
                            </div>
   
   <h3 className="font-bold text-emerald-800 mt-4">{t('lab.p12electricpotential_bioelectricity_the_eel')}</h3>
   <p>
    
                             {t('lab.p12electricpotential_the_electric_eel_creates_shock')} <em>{t('lab.12electricpotential_electrocytes')}</em>{t('lab.p12electricpotential_each_cell_acts_like_a_tiny_bat')} <strong>{t('lab.12electricpotential_series')}</strong>{t('lab.p12electricpotential_the_voltages_add_up_generating')}
                            </p>
   
   <h3 className="font-bold text-emerald-800 mt-4">{t('lab.p12electricpotential_rc_circuits_camera_flash')}</h3>
   <p>
    
                             {t('lab.p12electricpotential_in_circuits_charging_or_discha')} <em>R</em>  {t('lab.p12electricpotential_takes_time_the_rate_is_determi')} <strong>{t('lab.p12electricpotential_tau')}</strong>:
   </p>
   <div className={`bg-emerald-50 p-3 rounded-lg font-mono text-center border border-emerald-100 flex-col `}>
    
                             {t('lab.p12electricpotential_r_c')}
                            </div>
   <p>
    
                             {t('lab.p12electricpotential_a_camera_flash_slowly_charges_')}
                            </p>
   </div>

   {config.showDerivations && (
   <DeepDivePanel
    derivation={{
    title: "Coulomb's Law to Gauss's Law",
    question: "How does a single point charge's field lead to a general law for any charge distribution? Let's derive Gauss's law from Coulomb's law.",
    steps: [
     {
     label: "Coulomb's Force Law",
     latex: "F = (1/4πε₀) · q₁q₂ / r²",
     explanation: "Coulomb's law gives the electrostatic force between two point charges. It is the fundamental experimental law of electrostatics, analogous to Newton's gravitational force law. The constant ε₀ = 8.85×10⁻¹² C²/N·m² is the permittivity of free space."
     },
     {
     label: "Electric Field from a Point Charge",
     latex: "E = F / q = (1/4πε₀) · Q / r²",
     explanation: "The electric field E is defined as force per unit test charge. For a point charge Q, the field radiates radially outward (positive) or inward (negative) with magnitude E = Q/(4πε₀r²). This is the foundation for all electrostatics."
     },
     {
     label: "Electric Flux through a Sphere",
     latex: "Φ = ∮ E · dA = ∮ E·dA·cos(0)\n  = E · 4πr²\n  = (Q / 4πε₀r²) · 4πr²\n  = Q / ε₀",
     explanation: "The electric flux Φ is the surface integral of E·dA. For a spherical surface centered on the charge, E is constant and perpendicular to the surface (cos 0 = 1). The surface area is 4πr². The r² cancels, giving Φ = Q/ε₀ — independent of radius!"
     },
     {
     label: "Gauss's Law & Capacitance",
     latex: "∮ E · dA = Qₑₙ𝒸 / ε₀  (Gauss's Law)\n\nFor a parallel plate capacitor:\nE = σ / ε₀ = Q / (ε₀A)\nV = E·d = Qd / (ε₀A)\n∴ C = Q/V = ε₀A / d",
     explanation: "Gauss's law generalizes: the net flux through ANY closed surface equals the enclosed charge divided by ε₀. Applying it to parallel plates: the field is uniform E = Q/(ε₀A), so voltage V = Ed = Qd/(ε₀A), giving capacitance C = ε₀A/d. This is why the camera flash capacitor's geometry determines its charge storage!"
     }
    ],
    conclusion: "Gauss's law is a profound generalization of Coulomb's law: while Coulomb's law describes the force between individual charges, Gauss's law relates the electric field over a surface to the charge enclosed. This is one of Maxwell's four equations and the foundation of all capacitor physics — from the eel's bio-capacitors to the camera flash circuit.",
    realWorldApplication: "Every capacitor in electronics follows C = ε₀A/d. The eel's electrocytes are biological capacitors — each cell maintains an ion gradient across a membrane (the dielectric), creating a potential difference of ~0.15V. Stacking 5000 of these 'capacitors' in series produces 600V+. In the camera flash, the capacitor stores charge slowly through a large resistor (seconds), then discharges rapidly through a low-resistance bulb (milliseconds) — the RC time constant τ = RC governs both processes."
    }}
    defaultExpanded={difficulty === 'deep-dive'}
   />
   )}
  </div>

  {/* Middle Column: Simulation */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex justify-between items-center mb-4">
   <div className="flex items-center text-emerald-700">
    <Settings2 className="w-6 h-6 mr-2" />
    <h2 className="text-lg font-bold">{t('lab.12electricpotential_interactivesimulator')}</h2>
   </div>
   <div className={`flex overflow-x-auto hide-scrollbar bg-slate-100 dark:bg-[#121212] rounded-lg p-1 `}>
    <button 
    onClick={() => setMode('eel')}
    className={`px-3 py-1 rounded-md text-sm font-medium flex items-center transition-colors ${mode === 'eel' ? 'bg-slate-50 dark:bg-[#121212] shadow text-emerald-700' : 'text-slate-500 dark:text-[#a1a1aa]'}`}
    >
    <Zap className="w-4 h-4 mr-1" />  {t('lab.p12electricpotential_eel')}
                                 </button>
    <button 
    onClick={() => setMode('rc')}
    className={`px-3 py-1 rounded-md text-sm font-medium flex items-center transition-colors ${mode === 'rc' ? 'bg-slate-50 dark:bg-[#121212] shadow text-emerald-700' : 'text-slate-500 dark:text-[#a1a1aa]'}`}
    >
    <Camera className="w-4 h-4 mr-1" />  {t('lab.p12electricpotential_rc_flash')}
                                 </button>
   </div>
   </div>

   <div className="h-64 mb-6 rounded-lg overflow-hidden border border-[#1c1b1b] dark:border-[#1c1b1b] relative">
   {mode === 'eel' ? renderEelSVG() : renderRCSVG()}
   </div>

   <div className="flex-1 space-y-4">
   {mode === 'eel' ? (
    <div className={`space-y-4 bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <div>
     <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
     <span>{t('lab.12electricpotential_numberofelectrocytes')}</span>
     <span className="text-emerald-600 font-bold">{electrocytes}</span>
     </label>
     <input type="range" min="1000" max="10000" step="100" value={electrocytes} onChange={(e) => setElectrocytes(Number(e.target.value))} className="w-full accent-emerald-600" />
    </div>
    <div>
     <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
     <span>{t('lab.12electricpotential_voltagepercell')}</span>
     <span className="text-emerald-600 font-bold">{voltPerCell.toFixed(2)} V</span>
     </label>
     <input type="range" min="0.10" max="0.20" step="0.01" value={voltPerCell} onChange={(e) => setVoltPerCell(Number(e.target.value))} className="w-full accent-emerald-600" />
    </div>
    <button onClick={handleShock} className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 rounded shadow-sm transition-colors flex justify-center items-center dark:text-white dark:text-white dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-yellow-500/40">
     <Zap className="w-5 h-5 mr-2" />  {t('lab.p12electricpotential_trigger_shock')}
                                     </button>
    </div>
   ) : (
    <div className={`space-y-4 bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <div>
     <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
     <span>{t('lab.p12electricpotential_capacitance_c')}</span>
     <span className="text-emerald-600 font-bold">{capacitance} μF</span>
     </label>
     <input type="range" min="10" max="1000" step="10" value={capacitance} onChange={(e) => setCapacitance(Number(e.target.value))} className="w-full accent-emerald-600" />
    </div>
    <div>
     <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
     <span>{t('lab.p12electricpotential_resistance_r')}</span>
     <span className="text-emerald-600 font-bold">{resistance} Ω</span>
     </label>
     <input type="range" min="10" max="2000" step="50" value={resistance} onChange={(e) => setResistance(Number(e.target.value))} className="w-full accent-emerald-600" />
    </div>
    <div>
     <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
     <span>{t('lab.12electricpotential_supplyvoltage')}</span>
     <span className="text-emerald-600 font-bold">{supplyVoltage} V</span>
     </label>
     <input type="range" min="10" max="300" step="10" value={supplyVoltage} onChange={(e) => setSupplyVoltage(Number(e.target.value))} className="w-full accent-emerald-600" />
    </div>
    <div className="flex gap-2 pt-2">
     <button 
     onMouseDown={() => setIsCharging(true)} 
     onMouseUp={() => setIsCharging(false)}
     onMouseLeave={() => setIsCharging(false)}
     className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded shadow-sm transition-colors select-none dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
     >
     
                                              {t('lab.p12electricpotential_hold_to_charge')}
                                              </button>
    </div>
    </div>
   )}
   </div>
  </div>

  {/* Right Column: Assessment & Data */}
  <div className={`bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center justify-between mb-4 text-emerald-700">
   <div className="flex items-center">
    <Database className="w-6 h-6 mr-2" />
    <h2 className="text-lg font-bold">{t('lab.12electricpotential_datalog_andanalysis')}</h2>
   </div>
   <button onClick={handleRecord} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded hover:bg-emerald-200 text-sm font-semibold transition-colors">
    
                             {t('lab.p12electricpotential_record_data')}
                            </button>
   </div>

   <div className="max-h-40 lg:overflow-y-auto mb-6 border border-slate-200 dark:border-[#1c1b1b] rounded-lg">
   <table className="w-full text-sm text-left text-slate-600 dark:text-[#a1a1aa]">
    <thead className="text-xs text-slate-700 dark:text-[#ffffff] uppercase bg-slate-50 dark:bg-[#121212] sticky top-0">
    <tr>
     <th className="px-3 py-2">{t('lab.12electricpotential_system')}</th>
     <th className="px-3 py-2">{t('lab.12electricpotential_parameters')}</th>
     <th className="px-3 py-2">{t('lab.12electricpotential_input')}</th>
     <th className="px-3 py-2 font-bold text-emerald-700">{t('lab.12electricpotential_output')}</th>
    </tr>
    </thead>
    <tbody>
    {logs.length === 0 ? (
     <tr><td colSpan={4} className="px-3 py-4 text-center text-slate-400">{t('lab.12electricpotential_nodatarecordedyet')}</td></tr>
    ) : (
     logs.map((log, i) => (
     <tr key={i} className="border-t border-slate-100">
      <td className="px-3 py-2 font-medium">{log.type}</td>
      <td className="px-3 py-2 text-xs">{log.info}</td>
      <td className="px-3 py-2 text-xs">{log.val1}</td>
      <td className="px-3 py-2 font-bold text-emerald-600">{log.val2}</td>
     </tr>
     ))
    )}
    </tbody>
   </table>
   </div>

   <div className={`flex-1 flex-col bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center mb-3 text-slate-800 dark:text-[#ffffff]">
    <Calculator className="w-5 h-5 mr-2 text-emerald-600" />
    <h3 className="font-bold">{t('lab.12electricpotential_q_title')}</h3>
   </div>
   
   <div className="space-y-4 flex-1">
    <div>
    <label className="block text-sm text-slate-700 dark:text-[#ffffff] mb-1">
     
                                      {t('lab.p12electricpotential_1_an_eel_has_exactly_5000_elec')}
                                     </label>
    <input 
     type="text" 
     value={ans1} 
     onChange={e => setAns1(e.target.value)} 
     placeholder={t('lab.p12electricpotential_t_lab_12electricpotential_eg50')} 
     className="w-full border border-slate-300 dark:border-[#1c1b1b] rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
    </div>
    
    <div>
    <label className="block text-sm text-slate-700 dark:text-[#ffffff] mb-1">
     
                                      {t('lab.p12electricpotential_2_in_an_rc_circuit_if_c_200_f_')}
                                     </label>
    <input 
     type="text" 
     value={ans2} 
     onChange={e => setAns2(e.target.value)} 
     placeholder={t('lab.p12electricpotential_t_lab_12electricpotential_eg05')} 
     className="w-full border border-slate-300 dark:border-[#1c1b1b] rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
    </div>
   </div>

   {feedback && (
    <div className={`mt-4 p-3 rounded text-sm flex items-start ${feedback.includes('Excellent') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
    {feedback.includes('Excellent') ? <CheckCircle className="w-5 h-5 mr-2 shrink-0" /> : <XCircle className="w-5 h-5 mr-2 shrink-0" />}
    {feedback}
    </div>
   )}

   <button onClick={checkAnswers} className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition-colors dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">
    
                             {t('lab.p12electricpotential_check_answers')}
                            </button>
   </div>

   {config.showResearchConnections && (
    <ResearchPaperAnalysis paper={RESEARCH_PAPERS['bioelectricity']} />
   )}
  </div>
  </div>
 </div>
 );
}
