import { useState, useMemo } from 'react';import { Globe, Activity, CheckCircle, XCircle, GraduationCap } from 'lucide-react';
import LabHeader from './LabHeader';
import DeepDivePanel from './DeepDivePanel';
import ResearchPaperAnalysis, { RESEARCH_PAPERS } from './ResearchPaperAnalysis';
import { DIFFICULTY_CONFIGS } from '../utils/labScaffolding';

export default function LabP12Gravitation({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const config = DIFFICULTY_CONFIGS['deep-dive'];
 const [velocity, setVelocity] = useState<number>(7.67); // km/s
 const [height, setHeight] = useState<number>(400); // km

 const [leoAnswer, setLeoAnswer] = useState<string>('');
 const [geoAnswer, setGeoAnswer] = useState<string>('');
 const [leoStatus, setLeoStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
 const [geoStatus, setGeoStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

 // Constants
 const Re = 6371; // Earth radius in km
 const mu = 3.986e5; // km^3/s^2 (G*M for Earth)

 const checkLeo = () => {
 const v = parseFloat(leoAnswer);
 if (!isNaN(v) && v >= 7.6 && v <= 7.7) setLeoStatus('correct');
 else setLeoStatus('incorrect');
 };

 const checkGeo = () => {
 const h = parseFloat(geoAnswer);
 if (!isNaN(h) && h >= 35700 && h <= 35850) setGeoStatus('correct');
 else setGeoStatus('incorrect');
 };

 // Trajectory calculation
 const trajectoryPoints = useMemo(() => {
 const pts = [];
 let x = 0;
 let y = Re + height;
 let vx = velocity;
 let vy = 0;
 let dt = 10; // seconds

 pts.push({ x, y });

 for (let i = 0; i < 15000; i++) {
  const r = Math.sqrt(x * x + y * y);
  if (r < Re) break; // Crash into Earth
  if (r > 100000) break; // Escaped far enough
  
  const ax = -mu * x / Math.pow(r, 3);
  const ay = -mu * y / Math.pow(r, 3);
  
  vx += ax * dt;
  vy += ay * dt;
  x += vx * dt;
  y += vy * dt;
  
  if (i % 50 === 0) {
  pts.push({ x, y });
  }
  
  // Check if complete orbit (crossed y axis)
  if (i > 100 && pts.length > 5 && Math.abs(x) < Math.abs(vx * dt) && y > 0) {
  pts.push({ x, y });
  break;
  }
 }
 return pts;
 }, [velocity, height]);

 // Determine scale
 const maxR = useMemo(() => {
 let max = Re + height;
 trajectoryPoints.forEach(p => {
  const r = Math.sqrt(p.x * p.x + p.y * p.y);
  if (r > max) max = r;
 });
 return Math.min(Math.max(max * 1.2, 10000), 50000); // cap to 50k km for view
 }, [trajectoryPoints, height]);

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title="Orbital Mechanics & Gravitation" />

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
  <div className="flex flex-col lg:grid lg:grid-cols-3 lg:flex-1 gap-0 lg:gap-6 p-6 lg:overflow-visible">
  {/* Left Column: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-2xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">Newton's Cannonball {config.showDerivations && <GraduationCap className="w-5 h-5 text-indigo-500" />}</h2>

   {config.showDerivations && (
    <DeepDivePanel
     derivation={{
      title: 'Kepler\'s Laws from Newton\'s Inverse-Square Law',
      question: 'Kepler discovered the elliptical orbits of planets empirically in 1609. But WHY are orbits elliptical? How did Newton derive Kepler\'s three laws from his universal law of gravitation?',
      steps: [
       {
        label: 'Newton\'s Universal Law of Gravitation (Center Force)',
        latex: 'F(r) = -GMm / r² × r̂\n\nWhere:\nG = 6.674×10⁻¹¹ N·m²/kg²\nM = mass of central body (Sun/Earth)\nm = mass of orbiting body (planet/satellite)\nr = distance between centers\nr̂ = unit vector pointing radially outward',
        explanation: 'Newton realized that the same force that makes an apple fall also holds the Moon in orbit. The gravitational force is always attractive, central (pointing along the line connecting the two bodies), and follows an inverse-square law with distance. The minus sign indicates attraction — the force points opposite to the radial direction.'
       },
       {
        label: 'Conservation of Angular Momentum → Constant Areal Velocity',
        latex: 'L = m × r × v_⟂ = constant\n\nTorque τ = r × F = 0 (central force → no torque)\nSo L is conserved!\n\nThis means:\ndA/dt = L/(2m) = constant\n(Ellipses sweep equal areas in equal times)',
        explanation: 'Since the gravitational force is purely radial (no tangential component), it exerts zero torque on the orbiting body. Therefore, angular momentum L is conserved. This directly implies Kepler\'s Second Law: a line from the Sun to a planet sweeps out equal areas in equal times. When the planet is closer to the Sun, it must move faster to sweep the same area.'
       },
       {
        label: 'Derive the Orbital Equation (the Ellipse)',
        latex: 'From F = ma and F = -GMm/r²:\n\nd²u/dθ² + u = GM / h²\n\nWhere u = 1/r and h = L/m = r² · dθ/dt\n\nSolution:\nr(θ) = h²/[GM × (1 + e × cos(θ))]\n\nThis is the equation of an ellipse with:\ne = sqrt(1 + 2Eh²/G²M²) = eccentricity\nE = total orbital energy per unit mass',
        explanation: 'The differential equation has a beautiful solution: the general orbit is a conic section. When e = 0, the orbit is a circle; when 0 < e < 1, it\'s an ellipse (Kepler\'s First Law!); when e = 1, it\'s a parabola; when e > 1, it\'s a hyperbola. The eccentricity e is determined by the total energy — bound orbits (E < 0) are ellipses, unbound (E ≥ 0) are parabolas or hyperbolas.'
       },
       {
        label: 'Kepler\'s Third Law: T² ∝ a³',
        latex: 'For a circular orbit: centripetal = gravitational\nmv²/r = GMm/r²\nv² = GM/r\n\nPeriod T = 2πr / v\nT² = 4π²r² / v²\nT² = 4π²r² / (GM/r)\nT² = (4π²/GM) × r³\n\nFor elliptical orbits (semi-major axis a):\nT² = (4π²/GM) × a³',
        explanation: 'Kepler\'s Third Law falls out directly from equating centripetal acceleration to gravitational acceleration. The key insight: T² is proportional to a³ with a constant of proportionality that depends ONLY on the central mass M — NOT on the orbiting body\'s mass. This is why all planets in our solar system follow the same T²/a³ = constant relationship, and why we can calculate the mass of any central body just by measuring a satellite\'s orbit!'
       }
      ],
      conclusion: 'Newton\'s inverse-square law of gravity elegantly explains ALL of Kepler\'s empirical laws. The elliptical orbits (Kepler I) emerge from solving the orbital differential equation. Equal areas in equal times (Kepler II) come from angular momentum conservation. The T² ∝ a³ relation (Kepler III) follows directly from equating centripetal and gravitational forces. This unification of celestial and terrestrial mechanics was humanity\'s first grand unification of physics — showing that the same laws govern the fall of an apple and the motion of the planets.',
      realWorldApplication: 'This lab\'s orbit simulator uses exactly these equations! The numerical integration uses ax = -GMx/r³ and ay = -GMy/r³ — the same inverse-square law. When you set the velocity to 7.67 km/s at 400 km altitude, the satellite follows an elliptical orbit (or circular, if perfectly tuned). NASA\'s Mission Control uses these same Newtonian equations to plan every satellite launch, ISS resupply trajectory, and Mars rover landing — corrected slightly by Einstein\'s general relativity for GPS satellites where the 38 μs/day relativistic drift would accumulate to 10 km of positioning error per day.'
     }}
    />
   )}

   <div className="text-slate-600 dark:text-[#a1a1aa] space-y-4">
   <p>
    Imagine a cannon on top of a very high mountain. If the cannonball is fired with low velocity, it falls back to Earth.
   </p>
   <p>
    As the firing velocity increases, the projectile travels further before hitting the ground. At a specific <strong>orbital velocity</strong>, the curve of the projectile's path matches the curvature of the Earth—it continuously falls but never hits the ground!
   </p>
   <div className={`bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900 flex-col `}>
    <h3 className="font-semibold text-blue-900 mb-2 dark:text-[#ffffff]">Orbital Velocity Formula</h3>
    <p className="text-center font-mono text-lg text-blue-800 dark:text-[#ffffff]">
    v = √(GM / r)
    </p>
    <ul className="text-sm mt-2 space-y-1 text-blue-700">
    <li><strong>G</strong> = 6.67 × 10⁻¹¹ N·m²/kg²</li>
    <li><strong>M</strong> = 5.97 × 10²⁴ kg (Earth's mass)</li>
    <li><strong>r</strong> = Re + h (Distance from Earth's center)</li>
    <li><strong>Re</strong> = 6371 km</li>
    </ul>
   </div>
   <p>
    <strong>Geostationary Orbit (GEO):</strong> An orbit where the satellite's orbital period matches Earth's rotation (~24 hours). It appears stationary in the sky.
   </p>
   </div>
  </div>

  {/* Middle Column: Simulation */}
  <div className={`w-full bg-white lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex-col items-center '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2 w-full">
   <Globe className="text-indigo-500" />
   Interactive Orbit Visualizer
   </h2>
   
   <div className={`w-full aspect-square max-w-md bg-[#000000] dark:bg-[#121212] rounded-xl relative overflow- flex items-center justify-center border-4 border-[#1c1b1b] dark:border-[#1c1b1b] shadow-inner flex-col `}>
   <svg viewBox={`-${maxR} -${maxR} ${maxR * 2} ${maxR * 2}`} className="w-full h-full">
    {/* Grid */}
    <circle cx="0" cy="0" r={35786 + Re} fill="none" stroke="#334155" strokeWidth="100" strokeDasharray="1000 1000" />
    
    {/* Earth */}
    <circle cx="0" cy="0" r={Re} fill="#3b82f6" />
    <defs>
    <radialGradient id="earth-grad" cx="30%" cy="30%" r="70%">
     <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
     <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
    </radialGradient>
    </defs>
    <circle cx="0" cy="0" r={Re} fill="url(#earth-grad)" />
    
    {/* Trajectory */}
    {trajectoryPoints.length > 1 && (
    <path
     d={`M ${trajectoryPoints.map(p => `${p.x},${-p.y}`).join(' L ')}`}
     fill="none"
     stroke="#22d3ee"
     strokeWidth={maxR * 0.005}
     strokeLinecap="round"
     strokeLinejoin="round"
    />
    )}
    
    {/* Projectile Start */}
    <circle cx="0" cy={-(Re + height)} r={maxR * 0.015} fill="#f43f5e" />
    
    {/* Projectile End/Current */}
    {trajectoryPoints.length > 0 && (
    <circle 
     cx={trajectoryPoints[trajectoryPoints.length - 1].x} 
     cy={-trajectoryPoints[trajectoryPoints.length - 1].y} 
     r={maxR * 0.02} 
     fill="#facc15" 
    />
    )}
   </svg>
   
   {/* Status Overlay */}
   <div className={`w-full absolute top-4 left-4 bg-[#121212] dark:bg-[#121212] lg:dark:bg-[#121212]/80 text-white text-xs p-2 rounded backdrop-blur border border-[#1c1b1b] dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
    {trajectoryPoints[trajectoryPoints.length - 1] && Math.sqrt(Math.pow(trajectoryPoints[trajectoryPoints.length - 1].x, 2) + Math.pow(trajectoryPoints[trajectoryPoints.length - 1].y, 2)) <= Re * 1.01 ? (
    <span className="text-red-400 font-bold">CRASHED</span>
    ) : trajectoryPoints.length >= 15000 / 50 || (trajectoryPoints[trajectoryPoints.length - 1]?.x ?? 0) < 0 ? (
    <span className="text-green-400 font-bold">STABLE ORBIT</span>
    ) : (
    <span className="text-orange-400 font-bold">ESCAPING</span>
    )}
   </div>
   </div>

   <div className="w-full mt-6 space-y-4">
   <div>
    <div className="flex justify-between mb-1">
    <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">Launch Velocity (v)</label>
    <span className="text-sm font-mono text-indigo-600">{velocity.toFixed(2)} km/s</span>
    </div>
    <input 
    type="range" 
    min="0" max="12" step="0.01" 
    value={velocity} 
    onChange={(e) => setVelocity(parseFloat(e.target.value))}
    className="w-full h-2 bg-slate-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer accent-indigo-600"
    />
   </div>
   <div>
    <div className="flex justify-between mb-1">
    <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">Launch Altitude (h)</label>
    <span className="text-sm font-mono text-indigo-600">{height} km</span>
    </div>
    <input 
    type="range" 
    min="0" max="40000" step="100" 
    value={height} 
    onChange={(e) => setHeight(parseFloat(e.target.value))}
    className="w-full h-2 bg-slate-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer accent-indigo-600"
    />
   </div>
   </div>
  </div>

  {/* Right Column: Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col gap-6 lg:overflow-y-auto ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   {/* Research Paper Analysis */}
   {config.showResearchConnections && (
    <div className="mb-4">
     <ResearchPaperAnalysis paper={RESEARCH_PAPERS['exoplanet-gravitational']} />
    </div>
   )}

   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
   <Activity className="text-emerald-500" />
   Engineering Tasks
   </h2>

   <div className="space-y-6">
   <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">Task 1: LEO Velocity</h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-3">
    Calculate the required orbital velocity for a Low Earth Orbit (LEO) satellite at an altitude of <strong>400 km</strong>.
    Use Re = 6371 km, GM = 3.986×10¹⁴ m³/s². (Convert to km/s).
    </p>
    <div className="flex gap-2">
    <input 
     type="text" 
     value={leoAnswer}
     onChange={(e) => setLeoAnswer(e.target.value)}
     placeholder="e.g. 7.67"
     className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
    />
    <button 
     onClick={checkLeo}
     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
     Check
    </button>
    </div>
    {leoStatus === 'correct' && <p className="text-emerald-600 text-sm mt-2 flex items-center gap-1"><CheckCircle size={16}/> Correct! v ≈ 7.67 km/s.</p>}
    {leoStatus === 'incorrect' && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><XCircle size={16}/> Try again. Check units (km vs m).</p>}
   </div>

   <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">Task 2: Geostationary Altitude</h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-3">
    A Geostationary satellite completes one orbit in 24 hours (86400 seconds). Calculate the required <strong>altitude (h)</strong> in km above Earth's surface. 
    Hint: Use Kepler's Third Law: T² = (4π²/GM)r³.
    </p>
    <div className="flex gap-2">
    <input 
     type="text" 
     value={geoAnswer}
     onChange={(e) => setGeoAnswer(e.target.value)}
     placeholder="e.g. 35786"
     className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
    />
    <button 
     onClick={checkGeo}
     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
     Check
    </button>
    </div>
    {geoStatus === 'correct' && <p className="text-emerald-600 text-sm mt-2 flex items-center gap-1"><CheckCircle size={16}/> Correct! GEO altitude is ~35,786 km.</p>}
    {geoStatus === 'incorrect' && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><XCircle size={16}/> Try again. Remember to subtract Earth's radius!</p>}
   </div>
   
   <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
    <h3 className="text-orange-800 font-semibold mb-1">Challenge</h3>
    <p className="text-sm text-orange-700">
    Set altitude to 35800 km and velocity to ~3.07 km/s on the simulator to visually confirm your Geostationary calculations!
    </p>
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
