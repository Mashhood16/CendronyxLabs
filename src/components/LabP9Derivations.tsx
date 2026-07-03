import { useState, useEffect, useRef, type ReactElement } from 'react';
import {
  CheckCircle, XCircle, ChevronDown, ChevronRight,
  ArrowRight, Lightbulb, Sigma, Rocket, Target, Satellite,
  Waves, Flower2, Zap, Mountain, GraduationCap
} from 'lucide-react';

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
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Mass (kg)</label>
          <input type="range" min="1" max="10" step="0.5" value={mass} onChange={e => { setMass(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
          <span className="text-sm font-mono text-blue-600">{mass} kg</span>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Initial Velocity (m/s)</label>
          <input type="range" min="0" max="20" step="1" value={vi} onChange={e => { setVi(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
          <span className="text-sm font-mono text-blue-600">{vi} m/s</span>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Final Velocity (m/s)</label>
          <input type="range" min="0" max="30" step="1" value={vf} onChange={e => { setVf(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
          <span className="text-sm font-mono text-blue-600">{vf} m/s</span>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Time (s)</label>
          <input type="range" min="0.5" max="5" step="0.5" value={time} onChange={e => { setTime(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
          <span className="text-sm font-mono text-blue-600">{time} s</span>
        </div>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">Momentum Change: Δp = m(vf − vi) = {mass} × ({vf} − {vi}) = <strong>{deltaP} kg·m/s</strong></p>
        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mt-1">Net Force: F = Δp/Δt = {deltaP}/{time} = <strong>{force.toFixed(1)} N</strong></p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
          placeholder="Calculate the force..."
          className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-blue-500 outline-none" />
        <button onClick={handleCheck}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
          Check
        </button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Great! F = Δp/Δt = {force.toFixed(1)} N</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> Try again. Force = m(vf − vi) / t</p>}
    </div>
  );
}

function RecoilInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
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
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Bullet Mass (g)</label>
          <input type="range" min="2" max="50" step="1" value={bulletMass} onChange={e => { setBulletMass(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-amber-500" />
          <span className="text-sm font-mono text-amber-600">{bulletMass} g</span>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Bullet Velocity (m/s)</label>
          <input type="range" min="100" max="800" step="10" value={bulletVel} onChange={e => { setBulletVel(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-amber-500" />
          <span className="text-sm font-mono text-amber-600">{bulletVel} m/s</span>
        </div>
        <div className="col-span-2">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Gun Mass (kg)</label>
          <input type="range" min="1" max="10" step="0.5" value={gunMass} onChange={e => { setGunMass(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-amber-500" />
          <span className="text-sm font-mono text-amber-600">{gunMass} kg</span>
        </div>
      </div>

      {/* Visual */}
      <div className="relative h-24 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
        {/* Gun */}
        <div className={`absolute bottom-4 left-4 w-20 h-8 bg-slate-600 rounded-sm flex items-center justify-center text-white text-xs font-bold transition-all duration-200 ${fired ? 'translate-x-4' : ''}`}>
          GUN
        </div>
        {/* Bullet */}
        <div className={`absolute bottom-4 w-3 h-3 bg-amber-500 rounded-full transition-all duration-200 ${fired ? 'left-[70%]' : 'left-[25%]'}`} />
        {/* Recoil arrow */}
        {fired && <div className="absolute top-2 left-10 text-red-500 text-xs font-bold animate-pulse">← Recoil!</div>}
        <button onClick={handleFire}
          className="absolute top-2 right-2 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded transition-colors">
          {fired ? 'FIRE!' : 'FIRE!'}
        </button>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
        <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
          v_g = −(m_b × v_b) / m_g = −({bMassKg} × {bulletVel}) / {gunMass} = <strong>{recoilV.toFixed(2)} m/s</strong> (opposite direction)
        </p>
      </div>

      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
          placeholder="Recoil velocity (m/s)..."
          className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-amber-500 outline-none" />
        <button onClick={handleCheck}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors">
          Check
        </button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Correct! The gun recoils at {recoilV.toFixed(2)} m/s</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> Try v_g = m_b·v_b / m_g. Remember mass in kg!</p>}
    </div>
  );
}

function OrbitalSpeedInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
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
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Orbit Radius (km)</label>
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
        <div className="absolute bottom-2 left-2 text-[10px] text-slate-400 font-mono">{speed.toFixed(0)} m/s</div>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
        <p className="text-xs text-indigo-700 dark:text-indigo-300">
          <strong>Orbital Period:</strong> T = 2π√(r³/GM) = {period.toFixed(0)} s ≈ {(period/60).toFixed(1)} min<br />
          <strong>Orbital Speed:</strong> v = 2πr/T = {speed.toFixed(0)} m/s ≈ {(speed/1000).toFixed(1)} km/s
        </p>
      </div>

      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
          placeholder="Orbital speed (m/s)..."
          className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-indigo-500 outline-none" />
        <button onClick={handleCheck}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors">
          Check
        </button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Correct! v = {speed.toFixed(0)} m/s</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> Try v = 2πr/T</p>}
    </div>
  );
}

function LiquidPressureInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
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
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Depth (m)</label>
          <input type="range" min="1" max="50" step="1" value={depth} onChange={e => { setDepth(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-cyan-500" />
          <span className="text-sm font-mono text-cyan-600">{depth} m</span>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Density (kg/m³)</label>
          <input type="range" min="800" max="13600" step="100" value={density} onChange={e => { setDensity(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-cyan-500" />
          <span className="text-sm font-mono text-cyan-600">{density} kg/m³</span>
        </div>
      </div>

      {/* Visual Tank */}
      <div className="relative h-32 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
        {/* Water column */}
        <div className={`absolute bottom-0 left-4 right-4 bg-gradient-to-t ${density <= 1000 ? 'from-blue-400 to-blue-200' : density <= 5000 ? 'from-amber-400 to-amber-200' : 'from-red-400 to-red-200'} opacity-70`}
          style={{ height: `${(depth / 50) * 100}%` }}>
          <span className="absolute top-1 left-2 text-[10px] font-bold text-slate-800">{getLiquid()}</span>
        </div>
        {/* Pressure gauge */}
        <div className="absolute top-2 right-2 bg-white dark:bg-[#121212] rounded px-2 py-1 border border-slate-200 dark:border-[#2a2a2a]">
          <div className="text-[9px] text-slate-500">Pressure</div>
          <div className="text-xs font-bold text-cyan-600 font-mono">{(pressure / 1000).toFixed(1)} kPa</div>
        </div>
        {/* Depth marker */}
        <div className="absolute left-1 bottom-0 text-[9px] text-slate-500 font-mono">{depth}m</div>
      </div>

      <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-3 border border-cyan-200 dark:border-cyan-800">
        <p className="text-xs text-cyan-700 dark:text-cyan-300">
          P = ρgh = {density} × 9.8 × {depth} = <strong>{pressure.toLocaleString()} Pa</strong> = <strong>{(pressure/1000).toFixed(1)} kPa</strong>
        </p>
      </div>

      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
          placeholder="Pressure in Pa..."
          className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-cyan-500 outline-none" />
        <button onClick={handleCheck}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg transition-colors">
          Check
        </button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Correct! P = {pressure.toLocaleString()} Pa</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> Try P = ρgh. Use ρ = {density}, g = 9.8, h = {depth}</p>}
    </div>
  );
}

function HydraulicLiftInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
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
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Small Piston Area (m²)</label>
          <input type="range" min="0.001" max="0.1" step="0.001" value={area1} onChange={e => { setArea1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" />
          <span className="text-sm font-mono text-emerald-600">{area1.toFixed(3)} m²</span>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Large Piston Area (m²)</label>
          <input type="range" min="0.05" max="2" step="0.05" value={area2} onChange={e => { setArea2(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" />
          <span className="text-sm font-mono text-emerald-600">{area2.toFixed(2)} m²</span>
        </div>
        <div className="col-span-2">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Input Force F₁ (N)</label>
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
        <div className="absolute bottom-[55%] left-[15%] text-blue-600 text-[10px] animate-bounce">↓ F₁</div>
        {/* Arrow on large piston */}
        <div className="absolute bottom-[55%] right-[15%] text-emerald-600 text-[10px]">↑ F₂</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] text-slate-500">{mechAdv.toFixed(0)}× Mechanical Advantage</div>
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
        <p className="text-xs text-emerald-700 dark:text-emerald-300">
          F₂ = (A₂/A₁) × F₁ = ({area2.toFixed(2)}/{area1.toFixed(3)}) × {force1} = <strong>{force2.toFixed(0)} N</strong><br />
          <strong>Mechanical Advantage:</strong> {mechAdv.toFixed(0)}×
        </p>
      </div>

      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
          placeholder="Output force (N)..."
          className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-emerald-500 outline-none" />
        <button onClick={handleCheck}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors">
          Check
        </button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Correct! F₂ = {force2.toFixed(0)} N</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> Try F₂ = (A₂/A₁) × F₁</p>}
    </div>
  );
}

function KEInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
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
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Mass (kg)</label>
          <input type="range" min="0.5" max="10" step="0.5" value={mass} onChange={e => { setMass(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-yellow-500" />
          <span className="text-sm font-mono text-yellow-600">{mass} kg</span>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Velocity (m/s)</label>
          <input type="range" min="1" max="30" step="1" value={vel} onChange={e => { setVel(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-yellow-500" />
          <span className="text-sm font-mono text-yellow-600">{vel} m/s</span>
        </div>
      </div>

      {/* Energy Bar */}
      <div className="bg-slate-100 dark:bg-[#1c1b1b] rounded-lg p-3 border border-slate-200 dark:border-[#2a2a2a]">
        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
          <span>Kinetic Energy</span>
          <span className="font-mono font-bold text-yellow-600">{ke.toFixed(0)} J</span>
        </div>
        <div className="w-full h-6 bg-slate-200 dark:bg-[#121212] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
            style={{ width: `${Math.min((ke / maxKe) * 100, 100)}%` }}>
            <span className="text-[8px] text-white font-bold">{ke.toFixed(0)} J</span>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          Notice: Doubling velocity <strong>quadruples</strong> the energy! (KE ∝ v²)
        </p>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
        <p className="text-xs text-yellow-700 dark:text-yellow-300">
          E_k = ½mv² = ½ × {mass} × {vel}² = ½ × {mass} × {vel * vel} = <strong>{ke.toFixed(0)} J</strong>
        </p>
      </div>

      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
          placeholder="Kinetic energy (J)..."
          className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-yellow-500 outline-none" />
        <button onClick={handleCheck}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-colors">
          Check
        </button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Correct! E_k = {ke.toFixed(0)} J</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> Try E_k = ½mv²</p>}
    </div>
  );
}

function GPEInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
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
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Mass (kg)</label>
          <input type="range" min="1" max="20" step="1" value={mass} onChange={e => { setMass(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-purple-500" />
          <span className="text-sm font-mono text-purple-600">{mass} kg</span>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Height (m)</label>
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
          E_p = mgh = {mass} × 9.8 × {height} = <strong>{gpe.toFixed(0)} J</strong>
        </p>
      </div>

      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
          placeholder="Potential energy (J)..."
          className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-purple-500 outline-none" />
        <button onClick={handleCheck}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors">
          Check
        </button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Correct! E_p = {gpe.toFixed(0)} J</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> Try E_p = mgh. g = 9.8 m/s²</p>}
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
      { label: "Newton's Second Law", content: "Newton's 2nd law states: F = ma. This means force produces acceleration." },
      { label: 'Express Acceleration', content: 'Acceleration is the rate of change of velocity: a = (vf − vi) / Δt' },
      { label: 'Substitute into F = ma', content: 'F = m × (vf − vi) / Δt. Distributing the mass inside: F = (mvf − mvi) / Δt' },
      { label: 'Introduce Momentum', content: 'Since momentum p = mv, we can write: F = (pf − pi) / Δt = Δp / Δt. This proves that the net force equals the rate of change of momentum!' },
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
      { label: 'Conservation of Momentum', content: 'For an isolated system (gun + bullet), net external force is zero, so initial momentum = final momentum.' },
      { label: 'Initial Momentum', content: 'Before firing, both gun and bullet are at rest: p_initial = 0' },
      { label: 'Final Momentum', content: 'After firing: p_final = m_b·v_b + m_g·v_g. By conservation: m_b·v_b + m_g·v_g = 0' },
      { label: 'Solve for v_g', content: 'Rearranging: m_g·v_g = −m_b·v_b. Therefore v_g = −(m_b·v_b)/m_g. The negative sign means the gun moves opposite to the bullet.' },
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
      { label: 'Average Speed Formula', content: 'Average speed = distance traveled / time taken' },
      { label: 'Distance in One Orbit', content: 'In one complete orbit, the satellite travels the circumference of a circle: distance = 2πr' },
      { label: 'Time for One Orbit', content: 'The time to complete one orbit is the orbital period T.' },
      { label: 'Final Formula', content: 'Substituting: v_avg = 2πr / T. This is the average orbital speed. For a circular orbit, the speed is constant!' },
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
      { label: 'Force on Base Area', content: 'The force on the base of a container by a liquid column equals its weight: F = W = mg' },
      { label: 'Mass in Terms of Density', content: 'Mass = density × volume: m = ρV' },
      { label: 'Volume of Column', content: 'Volume of a cylindrical column = area × height: V = Ah' },
      { label: 'Substitute and Simplify', content: 'F = ρAhg. Pressure P = F/A = ρAhg/A. The area cancels: P = ρgh. Liquid pressure depends only on density, gravity, and depth!' },
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
      { label: 'Pressure on Small Piston', content: 'Pushing on the small piston creates pressure: P₁ = F₁/A₁' },
      { label: 'Pressure on Large Piston', content: 'The pressure lifting the vehicle is: P₂ = F₂/A₂' },
      { label: 'Pascal’s Principle', content: 'Pressure is transmitted equally: P₂ = P₁' },
      { label: 'Solve for Output Force', content: 'F₂/A₂ = F₁/A₁. Therefore F₂ = (A₂/A₁) × F₁. A small force on a small area creates a large force on a large area!' },
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
      { label: 'Work-Energy Theorem', content: 'The change in kinetic energy equals the work done: E_k = F × d' },
      { label: 'Substitute F = ma', content: 'E_k = (ma)(d). If the object starts from rest, d = v_avg × t. Average speed v_avg = v/2' },
      { label: 'Substitute Acceleration', content: 'Acceleration a = v/t. So E_k = m(v/t)(v/2 × t) = m × v × v/2' },
      { label: 'Final Formula', content: 'The time cancels out: E_k = ½mv². Notice that if you double the velocity, the energy quadruples! (since v is squared)' },
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
      { label: 'Work Done Lifting', content: 'The work done to lift an object is: W = E_p = F × S' },
      { label: 'Force Required', content: 'The force needed to lift the object equals its weight: F = mg' },
      { label: 'Distance Moved', content: 'The distance moved is the vertical height: S = h' },
      { label: 'Final Formula', content: 'Substituting: E_p = mg × h = mgh. The higher you lift and the heavier the object, the more potential energy it stores!' },
    ],
    interactive: GPEInteractive,
  },
];

// ========== Main Component ==========

export default function LabP9Derivations() {
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
          Class 9 Physics — Interactive Derivations
        </h1>
        <p className="text-sm text-white/80 mt-1">Master 7 essential derivations through step-by-step walkthroughs and hands-on interactive controls</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar: Derivation List */}
        <div className="lg:w-64 shrink-0 bg-white dark:bg-[#121212] border-r border-slate-200 dark:border-[#1c1b1b] overflow-y-auto">
          <div className="p-3 border-b border-slate-100 dark:border-[#1c1b1b]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress</span>
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
              <div className={`text-2xl font-bold font-mono ${cc.text}`}>{current.formula}</div>
            </div>

            {/* Step-by-step Walkthrough */}
            <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-[#1c1b1b] flex items-center gap-2">
                <Sigma className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Step-by-Step Derivation</span>
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
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Try It Yourself</span>
                {completed[current.id] && (
                  <span className="ml-auto text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Completed
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
