import { useState } from 'react';
import { Mountain, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP9DerivationGPE({ onExit }: { onExit?: () => void }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [mass, setMass] = useState(5);
  const [height, setHeight] = useState(10);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const g = 9.81;
  const potentialEnergy = mass * g * height;

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - potentialEnergy) < potentialEnergy * 0.1 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: 'Work Done Against Gravity', formula: 'E\u209A = Work = F \u00D7 S', detail: 'Gravitational potential energy is the work done to lift an object against gravity. Work = force \u00D7 distance.' },
    { label: 'Force = Weight of Object', formula: 'F = m \u00D7 g', detail: 'The force needed to lift an object equals its weight. From Newton\u2019s second law: F = m \u00D7 g, where g = 9.81 m/s\u00B2.' },
    { label: 'Distance = Height Lifted', formula: 'S = h', detail: 'The distance moved in the direction of the force is the height: S = h. Substituting: E\u209A = (m \u00D7 g) \u00D7 h = mgh.' },
    { label: 'Gravitational PE Formula', formula: 'E\u209A = m \u00D7 g \u00D7 h', detail: 'Potential energy depends on three things: mass (m), gravity (g \u2248 9.81 m/s\u00B2), and height (h). Double the height = double the energy. On the Moon (g = 1.62), the same lift stores much less!' },
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title="Derivation: Gravitational PE (E\u209A = mgh)" />
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')}
          className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Derivation</button>
        <button onClick={() => setActiveMobileTab('lab')}
          className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Simulation</button>
      </div>
      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        {/* Column 1: Derivation (primary - spans 3) */}
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Step-by-Step Derivation</h2>
              <p className="text-xs text-slate-500">How E\u209A = mgh comes from the definition of work</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-emerald-200 font-semibold uppercase tracking-wider">Final Formula</p>
            <p className="text-2xl font-bold font-mono text-white mt-1">E\u209A = m \u00D7 g \u00D7 h</p>
            <p className="text-xs text-emerald-200 mt-1">Potential energy = mass \u00D7 gravity \u00D7 height</p>
          </div>

          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
                    {idx < steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-emerald-400 to-emerald-200 dark:from-emerald-600 dark:to-emerald-800" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 mb-1">
                      <p className="font-bold text-base text-emerald-800 dark:text-emerald-300">{step.label}</p>
                    </div>
                    <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]">
                      <span className="text-sm font-mono font-bold text-yellow-400">{step.formula}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>
                    {idx < steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-emerald-400" /></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-base text-amber-700 dark:text-amber-300">{'\uD83D\uDCA1'} Key Insight</p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">PE depends on height above a reference point. Hydroelectric dams store enormous energy: water high up in a reservoir is released, converting E\u209A to kinetic energy, then to electricity. The Hoover Dam powers 1.3 million homes!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Interactive + Assessment */}
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-emerald-500" /><h2 className="text-lg font-bold">See the Derivation in Action</h2></div>
            <p className="text-sm text-slate-500 mb-4">Adjust mass and height to see how E\u209A = mgh scales.</p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold"><span>Mass (m)</span><span className="text-emerald-600 font-mono">{mass} kg</span></div>
                <input type="range" min="0.5" max="50" step="0.5" value={mass} onChange={e => { setMass(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold"><span>Height (h)</span><span className="text-emerald-600 font-mono">{height} m</span></div>
                <input type="range" min="1" max="30" step="0.5" value={height} onChange={e => { setHeight(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" />
              </div>

              <div className="relative h-40 bg-white dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-300 dark:border-[#2a2a2a]">
                <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-emerald-600 to-emerald-500 flex items-center justify-center">
                  <span className="text-[7px] text-white font-bold">GROUND</span>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg shadow-lg flex items-center justify-center text-[8px] font-bold text-white transition-all duration-300"
                  style={{ bottom: `${5 + (height / 30) * 62}%` }}>
                  {mass} kg
                </div>
                <div className="absolute left-2 bottom-5 w-2" style={{ height: `${(height / 30) * 62}%` }}>
                  <div className="w-0.5 h-full bg-emerald-400/40 mx-auto" />
                  <div className="absolute -top-2.5 left-1 text-[7px] text-emerald-500 font-mono">h={height}m</div>
                  <div className="absolute top-1/2 -translate-y-1/2 -left-0.5 text-emerald-400 text-[7px]">{'\u25B2'}</div>
                  <div className="absolute bottom-0 -left-0.5 text-emerald-400 text-[7px]">{'\u25BC'}</div>
                </div>
                {[5, 10, 15, 20, 25].filter(m => m <= height).map(m => {
                  const pct = (m / 30) * 62 + 5;
                  return (
                    <div key={m} className="absolute left-11 w-5 border-t border-dashed border-slate-300 dark:border-[#2a2a2a]" style={{ bottom: `${pct}%` }}>
                      <span className="text-[6px] text-slate-400">{m}m</span>
                    </div>
                  );
                })}
              </div>

              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase">Derivation Trace</p>
                <p className="text-sm text-slate-400">E\u209A = Work = F \u00D7 S</p>
                <p className="text-sm text-slate-400">F = m \u00D7 g = {mass} \u00D7 9.81 = {(mass * 9.81).toFixed(1)} N</p>
                <p className="text-sm text-slate-400">S = h = {height} m</p>
                <p className="border-t border-[#2a2a2a] pt-1 text-xs"><span className="text-green-400 font-bold">E\u209A = mgh = </span><span className="text-yellow-400 font-mono font-bold">{potentialEnergy.toFixed(0)} J</span></p>
                {potentialEnergy > 500 && <p className="text-xs text-amber-400">Could power a 60W bulb for {(potentialEnergy / 60).toFixed(0)}s!</p>}
              </div>
            </div>
          </div>

          {/* Assessment */}
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Mountain className="w-5 h-5 text-emerald-500" /> Practice: Apply the Derivation</h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">A <strong>5 kg</strong> backpack sits on a shelf <strong>1.5 m</strong> above the floor.</p>
              <p className="text-base font-medium">What is its gravitational potential energy? (g = 9.81)</p>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded p-2 mt-2">
                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-mono">E\u209A = mgh = 5 \u00D7 9.81 \u00D7 1.5 = ?</p>
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
                placeholder="Energy (J)..."
                className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-emerald-500 outline-none" />
              <button onClick={checkAnswer} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors">Check</button>
            </div>
            {checkResult === 'correct' && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>Correct! 73.6 J.</strong> A 2 kg book at the same height has only 29.4 J \u2014 less mass = less stored energy!</p>
              </div>
            )}
            {checkResult === 'incorrect' && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-xs text-red-700 dark:text-red-300"><strong>Not quite.</strong> E\u209A = m \u00D7 g \u00D7 h = 5 \u00D7 9.81 \u00D7 1.5</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
