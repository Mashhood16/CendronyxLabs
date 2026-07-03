import { useState } from 'react';
import { Rocket, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP9DerivationRecoil({ onExit }: { onExit?: () => void }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [bulletMass, setBulletMass] = useState(10);
  const [bulletVel, setBulletVel] = useState(400);
  const [gunMass, setGunMass] = useState(5);
  const [fired, setFired] = useState(false);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const bMassKg = bulletMass / 1000;
  const recoilV = (bMassKg * bulletVel) / gunMass;

  const handleFire = () => {
    setFired(true);
    setTimeout(() => setFired(false), 600);
  };

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - recoilV) < 0.3 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: 'Conservation of Momentum', formula: 'pi = pf', detail: 'In an isolated system (no external forces), total momentum before = total momentum after. This is one of the most fundamental laws in physics.' },
    { label: 'Before Firing: Everything at Rest', formula: 'pi = 0', detail: 'Before firing, both gun and bullet are at rest. Their velocities are zero, so total initial momentum is zero.' },
    { label: 'After Firing: Bullet + Gun Move', formula: 'mb×vb + mg×vg = 0', detail: 'After firing, bullet goes forward (mb×vb), gun recoils backward (mg×vg). By conservation: mb×vb + mg×vg = 0.' },
    { label: 'Solve for Recoil Velocity', formula: 'vg = −(mb×vb) / mg', detail: 'Rearranging: mg×vg = −mb×vb. Dividing by mg: vg = −(mb×vb)/mg. The negative sign means opposite direction. Heavier gun = less recoil!' },
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title="Derivation: Recoil Velocity of a Gun" />
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')}
          className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-amber-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Derivation</button>
        <button onClick={() => setActiveMobileTab('lab')}
          className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-amber-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Simulation</button>
      </div>
      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        {/* Column 1: Derivation (primary focus - spans 3 columns) */}
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Step-by-Step Derivation</h2>
              <p className="text-xs text-slate-500">Follow how conservation of momentum gives the recoil formula</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-amber-200 font-semibold uppercase tracking-wider">Final Formula</p>
            <p className="text-2xl font-bold font-mono text-white mt-1">vg = −(mb × vb) / mg</p>
            <p className="text-xs text-amber-200 mt-1">The gun recoils opposite to the bullet’s direction</p>
          </div>

          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
                    {idx < steps.length - 1 && (
                      <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-amber-400 to-amber-200 dark:from-amber-600 dark:to-amber-800" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800 mb-1">
                      <p className="font-bold text-base text-amber-800 dark:text-amber-300">{step.label}</p>
                    </div>
                    <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]">
                      <span className="text-sm font-mono font-bold text-yellow-400">{step.formula}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>
                    {idx < steps.length - 1 && (
                      <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-amber-400" /></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-base text-amber-700 dark:text-amber-300">{'💡'} Key Insight</p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">The negative sign shows the gun moves opposite to the bullet. A heavier gun recoils less — which is why cannons are so massive! Rockets work the same way: exhaust goes down, rocket goes up.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Interactive + Assessment */}
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold">See the Derivation in Action</h2>
            </div>
            <p className="text-sm text-slate-500 mb-4">Adjust sliders, then press FIRE! to see conservation of momentum at work.</p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold"><span>Bullet Mass</span><span className="text-amber-600 font-mono">{bulletMass} g ({bMassKg} kg)</span></div>
                <input type="range" min="2" max="50" step="1" value={bulletMass} onChange={e => { setBulletMass(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-amber-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold"><span>Bullet Velocity</span><span className="text-amber-600 font-mono">{bulletVel} m/s</span></div>
                <input type="range" min="100" max="800" step="10" value={bulletVel} onChange={e => { setBulletVel(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-amber-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold"><span>Gun Mass</span><span className="text-amber-600 font-mono">{gunMass} kg</span></div>
                <input type="range" min="1" max="10" step="0.5" value={gunMass} onChange={e => { setGunMass(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-amber-500" />
              </div>

              <button onClick={handleFire}
                className="w-full py-2.5 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold rounded-lg transition-all text-sm shadow-lg">
                {fired ? 'BOOM! 💥' : 'FIRE! 🔥'}
              </button>

              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1.5">
                <p className="text-xs text-slate-500 font-semibold uppercase">Momentum Conservation</p>
                <p className="text-sm text-slate-400">Before: pi = 0 (both at rest)</p>
                <p className="text-sm text-slate-400">After: mb×vb = {bMassKg} × {bulletVel} = <span className="text-green-400">{(bMassKg * bulletVel).toFixed(2)}</span></p>
                <p className="text-sm text-slate-400">mg×vg must be: <span className="text-green-400">-{(bMassKg * bulletVel).toFixed(2)}</span></p>
                <p className="border-t border-[#2a2a2a] pt-1.5 text-xs"><span className="text-amber-400 font-bold">Recoil velocity: </span><span className="text-yellow-400 font-mono font-bold">{recoilV.toFixed(2)} m/s</span></p>
              </div>

              {fired && (
                <div className="h-16 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a] relative animate-pulse">
                  <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-500 rounded-full animate-ping" />
                </div>
              )}
            </div>
          </div>

          {/* Assessment */}
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Rocket className="w-5 h-5 text-emerald-500" /> Practice: Apply the Derivation</h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">A <strong>4 kg</strong> rifle fires a <strong>12 g</strong> bullet at <strong>500 m/s</strong>.</p>
              <p className="text-base font-medium">What is the recoil velocity of the rifle?</p>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded p-2 mt-2">
                <p className="text-xs text-amber-700 dark:text-amber-300 font-mono">mb = 12g = 0.012 kg, vb = 500 m/s, mg = 4 kg. vg = −(mb×vb)/mg = −(0.012×500)/4</p>
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
                placeholder="Velocity (m/s)..."
                className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-amber-500 outline-none" />
              <button onClick={checkAnswer}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors">Check</button>
            </div>
            {checkResult === 'correct' && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>Correct! vg = 1.5 m/s.</strong> The rifle kicks back at just 1.5 m/s because it’s much heavier than the bullet.</p>
              </div>
            )}
            {checkResult === 'incorrect' && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-xs text-red-700 dark:text-red-300"><strong>Not quite.</strong> Use vg = (mb × vb) / mg = (0.012 × 500) / 4</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
