import { useState, useEffect, useRef } from 'react';
import { Activity, AlertTriangle, Zap, ThermometerSun, Shield, GraduationCap } from 'lucide-react';
import LabHeader from './LabHeader';
import DeepDivePanel from './DeepDivePanel';
import FrontierApplicationsPanel from './FrontierApplicationsPanel';
import type { FrontierTopic } from './FrontierApplicationsPanel';
import { DIFFICULTY_CONFIGS, type DifficultyLevel } from '../utils/labScaffolding';
import ResearchPaperAnalysis, { RESEARCH_PAPERS } from './ResearchPaperAnalysis';

export default function LabP12QuantumNuclear({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [difficulty, setDifficulty] = useState<DifficultyLevel>('understand');
 const config = DIFFICULTY_CONFIGS[difficulty];
 const [controlRodDepth, setControlRodDepth] = useState(80);
 const [coolantFlow, setCoolantFlow] = useState(50);
 const [temperature, setTemperature] = useState(300);
 const [power, setPower] = useState(0);
 const [meltdown, setMeltdown] = useState(false);
 
 const [petAns, setPetAns] = useState('');
 const [reactorAns, setReactorAns] = useState('');
 const [petFeedback, setPetFeedback] = useState('');
 const [reactorFeedback, setReactorFeedback] = useState('');

 const tempRef = useRef(300);
 const powerRef = useRef(0);
 const meltdownRef = useRef(false);

 useEffect(() => {
 const interval = setInterval(() => {
  if (meltdownRef.current) return;
  
  const reactivity = 100 - controlRodDepth;
  const cooling = coolantFlow * 2;
  const heating = reactivity * 18;
  
  const targetTemp = 300 + Math.max(0, heating - cooling * 0.5);
  
  tempRef.current += (targetTemp - tempRef.current) * 0.02;
  
  if (tempRef.current > 2000) {
  meltdownRef.current = true;
  setMeltdown(true);
  }
  
  const pwr = Math.max(0, tempRef.current > 400 ? (tempRef.current - 400) * 3 : 0);
  powerRef.current += (pwr - powerRef.current) * 0.05;
  
  setTemperature(Math.round(tempRef.current));
  setPower(Math.round(powerRef.current));
 }, 50);
 return () => clearInterval(interval);
 }, [controlRodDepth, coolantFlow]);

 const checkPet = () => {
 const v = parseFloat(petAns);
 if (v >= 1.02 && v <= 1.03) setPetFeedback('Correct! 1.022 MeV');
 else setPetFeedback('Incorrect. Use E = 2mc², convert to MeV (1 eV = 1.6e-19 J).');
 };

 const checkReactor = () => {
 const v = parseFloat(reactorAns);
 // 1 GW = 1e9 J/s. m = E/c^2 = 1e9 / 9e16 = 1.11e-8 kg
 if (v >= 1.1 && v <= 1.12) setReactorFeedback('Correct! ~1.11e-8 kg/s');
 else setReactorFeedback('Incorrect. Use m = E/c².');
 };

 const frontierTopics: FrontierTopic[] = [
  {
   id: 'quantum-comp',
   icon: 'quantum',
   title: 'Quantum Computing & Nuclear Physics',
   summary: 'Quantum computers use principles from nuclear and quantum physics — superposition, entanglement, and tunneling — to perform calculations that are impossible for classical computers. The same E = hc/λ and E = mc² equations that govern nuclear reactions also set fundamental limits on quantum computing hardware.',
   connectionToLab: 'The PET scan detectors in this lab use scintillation crystals that convert gamma-ray photons into electrical signals — a process governed by the photoelectric effect (E = hc/λ). Quantum computing research is exploring similar scintillator materials for qubit readout.',
   currentResearch: 'Researchers at CERN are exploring how nuclear physics detectors can be adapted for quantum computing. In 2024, a team used a nuclear reactor\'s neutron flux to demonstrate the first nuclear-assisted quantum error correction protocol.',
   careerPath: 'Quantum Engineer, Nuclear MedTech Researcher, Particle Physics Data Scientist',
   keyConcept: 'Quantum tunneling in nuclear fusion — the sun runs on protons quantum-tunneling through the Coulomb barrier, a phenomenon that quantum computers may help us harness for clean energy.'
  },
  {
   id: 'nanotech',
   icon: 'nanotech',
   title: 'Nanomaterials for Radiation Detection',
   summary: 'Nanotechnology is revolutionizing radiation detection. Perovskite nanocrystals and quantum dots can detect individual gamma photons at room temperature, potentially replacing bulky traditional scintillators used in PET scans and nuclear reactors.',
   connectionToLab: 'The reactor control panel in this lab simulates real-time temperature and power monitoring. In real reactors, nano-scale thermocouples and radiation-hardened nanosensors provide distributed sensing that improves safety margins.',
   currentResearch: 'MIT and KAIST are developing graphene-based radiation sensors that are 100x more sensitive than traditional Geiger-Müller tubes. These could be deployed in swarms across nuclear facilities for real-time 3D radiation mapping.',
   careerPath: 'Nanomaterials Scientist, Radiation Detection Engineer, Nuclear Safety Technologist',
   keyConcept: 'Quantum dots — semiconductor nanoparticles that emit light at specific wavelengths when struck by radiation. By tuning their size (quantum confinement), they can be engineered to detect specific photon energies.'
  }
 ];

 const restart = () => {
 meltdownRef.current = false;
 setMeltdown(false);
 setControlRodDepth(80);
 setCoolantFlow(50);
 tempRef.current = 300;
 powerRef.current = 0;
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title="Lab 12.1: Quantum & Nuclear Engineering" />

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
    Theory
   </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >Lab</button>
  </div>
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg:min-h-0 lg:overflow-visible">
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 lg:overflow-y-auto flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-3 border-b pb-2 flex items-center gap-2">Theory & Context {config.showDerivations && <GraduationCap className="w-4 h-4 text-indigo-500" />}</h2>
   
   {config.showDerivations && (
    <DeepDivePanel 
     derivation={{
      title: 'Why ΔE = hc/λ? — Photon Energy from Quantum Mechanics',
      question: 'Why is the energy of a photon inversely proportional to its wavelength? Where does the formula E = hc/λ actually come from?',
      steps: [
       {
        label: 'Start with Planck\'s Quantum Hypothesis',
        latex: 'E = hf\n\nWhere:\nE = energy of a single quantum (photon)\nh = Planck\'s constant = 6.626 × 10⁻³⁴ J·s\nf = frequency of the electromagnetic radiation',
        explanation: 'In 1900, Max Planck proposed that energy is quantized — it can only be emitted or absorbed in discrete packets called "quanta." The energy of each quantum is proportional to the frequency of the radiation, with h as the fundamental constant of proportionality.'
       },
       {
        label: 'Use the wave equation: c = fλ',
        latex: 'c = f × λ\n\nRearranged: f = c / λ\n\nWhere:\nc = speed of light in vacuum = 3.0 × 10⁸ m/s\nλ = wavelength of the photon',
        explanation: 'All electromagnetic radiation travels at the speed of light c. The fundamental wave equation tells us that frequency and wavelength are inversely related — a shorter wavelength means a higher frequency, and vice versa.'
       },
       {
        label: 'Substitute f into E = hf',
        latex: 'E = h × f\nE = h × (c / λ)\n\nTherefore:\nE = hc / λ\n\nOr equivalently:\nE = hc × (1/λ)',
        explanation: 'By substituting f = c/λ into Planck\'s equation, we derive the classic formula. This shows that photon energy is inversely proportional to wavelength — blue light (short λ) carries more energy per photon than red light (long λ).'
       },
       {
        label: 'Express in electron-volts (eV) for atomic scales',
        latex: 'hc = (6.626 × 10⁻³⁴ J·s)(3.0 × 10⁸ m/s)\n   = 1.986 × 10⁻²⁵ J·m\n\nIn eV·nm:\nhc = 1240 eV·nm\n\nSo: E(eV) = 1240 / λ(nm)',
        explanation: 'At atomic and molecular scales, energies are more conveniently expressed in electron-volts (eV). The product hc is a fundamental constant that appears throughout quantum mechanics. When λ is in nanometers, E = 1240/λ gives energy directly in eV — a handy formula for spectroscopy.'
       }
      ],
      conclusion: 'The formula ΔE = hc/λ falls directly out of Planck\'s quantum hypothesis and the wave nature of light. It is the bridge between the wave picture (wavelength) and the particle picture (photon energy) of light — the essence of wave-particle duality. This equation governs everything from the colors of fireworks to the spectral lines used to identify elements in distant stars.',
      realWorldApplication: 'In PET scans (explored in this lab), the annihilation of an electron and positron produces two 511 keV gamma rays. Using E = hc/λ, we find λ = 1240 eV·nm / (511 × 10³ eV) = 0.00243 nm — this is a gamma-ray wavelength. Detectors are specifically designed to catch these photons and reconstruct the 3D location of the annihilation event, creating the PET scan image.'
     }}
    />
   )}

   <div className="space-y-4 text-slate-700 dark:text-[#ffffff] text-sm leading-relaxed">
   <section>
    <h3 className="font-semibold text-slate-900 dark:text-[#ffffff] flex items-center gap-2">
    <Shield size={16} className="text-emerald-600"/> Nuclear Fission & Reactors
    </h3>
    <p className="mt-1">
    Nuclear power harnesses the energy released from induced fission of U-235. Neutrons strike the nucleus, splitting it into daughter nuclei and releasing 2-3 fast neutrons plus energy (E=mc²).
    </p>
    <ul className="list-disc pl-5 mt-2 space-y-1">
    <li><b>Moderator:</b> Slows down fast neutrons to thermal speeds so they can induce fission.</li>
    <li><b>Control Rods:</b> (e.g., Boron, Cadmium) Absorb neutrons to control the chain reaction rate.</li>
    <li><b>Coolant:</b> Transfers heat to generate steam, producing electricity.</li>
    </ul>
   </section>

   <section>
    <h3 className="font-semibold text-slate-900 dark:text-[#ffffff] flex items-center gap-2 mt-4">
    <Zap size={16} className="text-amber-500"/> PET Scans & Antimatter
    </h3>
    <p className="mt-1">
    Positron Emission Tomography (PET) relies on antimatter. A tracer emits a positron (e⁺), which annihilates with an electron (e⁻). 
    The entire mass is converted into two gamma rays traveling in opposite directions: E = 2m_e c².
    </p>
   </section>
   </div>
  </div>

  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col relative overflow- '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2">Reactor Control Panel</h2>
   
   <div className={`w-full flex gap-4 mb-4 bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] p-3 rounded-lg flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="flex-1">
    <label className="text-xs font-semibold text-slate-600 dark:text-[#a1a1aa] uppercase tracking-wider block mb-1">
    Control Rod Depth: {controlRodDepth}%
    </label>
    <input 
    type="range" min="0" max="100" value={controlRodDepth} 
    onChange={(e) => setControlRodDepth(Number(e.target.value))}
    disabled={meltdown}
    className="w-full accent-slate-700"
    />
   </div>
   <div className="flex-1">
    <label className="text-xs font-semibold text-slate-600 dark:text-[#a1a1aa] uppercase tracking-wider block mb-1">
    Coolant Flow: {coolantFlow}%
    </label>
    <input 
    type="range" min="0" max="100" value={coolantFlow} 
    onChange={(e) => setCoolantFlow(Number(e.target.value))}
    disabled={meltdown}
    className="w-full accent-blue-500"
    />
   </div>
   </div>

   <div className="flex justify-around mb-4">
   <div className={`p-3 rounded-lg flex flex-col items-center ${meltdown ? 'bg-red-100 text-red-700' : temperature > 1200 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff]'}`}>
    <ThermometerSun size={24} className="mb-1" />
    <span className="text-xl font-bold">{temperature}°C</span>
    <span className="text-xs">Core Temp</span>
   </div>
   <div className={`p-3 rounded-lg flex flex-col items-center bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] `}>
    <Activity size={24} className="mb-1 text-emerald-600" />
    <span className="text-xl font-bold">{power} MW</span>
    <span className="text-xs">Power Output</span>
   </div>
   </div>

   <div className={`flex-1 border-2 border-slate-200 dark:border-[#1c1b1b] rounded-lg bg-[#000000] dark:bg-[#121212] relative overflow- flex items-center justify-center flex-col `}>
   {meltdown ? (
    <div className="text-center text-red-500 animate-pulse flex flex-col items-center">
    <AlertTriangle size={64} className="mb-4" />
    <h3 className="text-2xl font-bold uppercase tracking-widest">Meltdown</h3>
    <p className="text-sm mt-2 text-slate-300">Core temperature exceeded 2000°C</p>
    <button onClick={restart} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:text-white dark:text-white dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40">
     Reset System
    </button>
    </div>
   ) : (
    <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
    <rect x="50" y="40" width="100" height="140" fill="#3b82f6" opacity={0.2 + (coolantFlow/200)} />
    <rect x="45" y="30" width="110" height="160" rx="10" fill="none" stroke="#64748b" strokeWidth="4" />
    
    <rect x="60" y="60" width="15" height="110" fill="#ef4444" opacity={temperature > 500 ? 1 : 0.6} />
    <rect x="92.5" y="60" width="15" height="110" fill="#ef4444" opacity={temperature > 500 ? 1 : 0.6} />
    <rect x="125" y="60" width="15" height="110" fill="#ef4444" opacity={temperature > 500 ? 1 : 0.6} />
    
    <g fill="#334155" transform={`translate(0, ${(100 - controlRodDepth) * -1.2})`}>
     <rect x="78" y="40" width="10" height="130" />
     <rect x="111" y="40" width="10" height="130" />
    </g>
    
    <rect x="50" y="40" width="100" height="140" fill="#ef4444" opacity={Math.max(0, (temperature - 500)/2000)} style={{ mixBlendMode: 'screen' }} />
    </svg>
   )}
   </div>
  </div>

  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 lg:overflow-y-auto flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   {/* Research Paper Analysis */}
   {config.showResearchConnections && (
    <div className="mt-2">
     <ResearchPaperAnalysis paper={RESEARCH_PAPERS['pet-imaging']} />
    </div>
   )}

   {/* Frontier Applications */}
   {config.showDerivations && (
    <div className="mt-2">
     <FrontierApplicationsPanel 
      topics={frontierTopics}
     />
    </div>
   )}

   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-3 border-b pb-2">Analysis & Computing</h2>
   
   <div className="space-y-6">
   <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">Q1: PET Scan Annihilation</h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-3">
    In a PET scan, a positron and electron annihilate. Calculate the total energy of the two gamma rays produced in <strong>MeV</strong>.
    <br/><span className="text-xs italic">(m_e = 9.11×10⁻³¹ kg, c = 3×10⁸ m/s, 1 eV = 1.6×10⁻¹⁹ J)</span>
    </p>
    <div className="flex gap-2">
    <input 
     type="number" value={petAns} onChange={e => setPetAns(e.target.value)}
     placeholder="e.g. 1.022" 
     className="flex-1 border rounded px-3 py-1.5 text-sm"
    />
    <button onClick={checkPet} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
     Check
    </button>
    </div>
    {petFeedback && <p className={`mt-2 text-sm font-medium ${petFeedback.includes('Correct') ? 'text-emerald-600' : 'text-red-600'}`}>{petFeedback}</p>}
   </div>

   <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">Q2: Mass Defect</h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-3">
    If your reactor operates continuously at 1.0 GW (10⁹ W), how much mass is converted to pure energy every second? (Provide answer in <strong>×10⁻⁸ kg</strong>).
    <br/><span className="text-xs italic">Use E = mc²</span>
    </p>
    <div className="flex gap-2 items-center">
    <input 
     type="number" value={reactorAns} onChange={e => setReactorAns(e.target.value)}
     placeholder="e.g. 1.11" 
     className="flex-1 border rounded px-3 py-1.5 text-sm"
    />
    <span className="text-sm text-slate-600 dark:text-[#a1a1aa]">× 10⁻⁸ kg</span>
    <button onClick={checkReactor} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
     Check
    </button>
    </div>
    {reactorFeedback && <p className={`mt-2 text-sm font-medium ${reactorFeedback.includes('Correct') ? 'text-emerald-600' : 'text-red-600'}`}>{reactorFeedback}</p>}
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
