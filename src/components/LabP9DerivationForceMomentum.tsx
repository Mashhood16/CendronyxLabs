import { useState } from 'react';
import { Target, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP9DerivationForceMomentum({ onExit }: { onExit?: () => void }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [mass, setMass] = useState(2);
  const [vi, setVi] = useState(0);
  const [vf, setVf] = useState(10);
  const [time, setTime] = useState(2);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const deltaP = mass * (vf - vi);
  const force = deltaP / time;

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    const expected = force;
    setCheckResult(Math.abs(val - expected) < expected * 0.1 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: "Newton's Second Law", formula: 'F = m × a', detail: "Newton’s 2nd law states that net force equals mass times acceleration. Heavier objects need more force to accelerate." },
    { label: 'Acceleration = Rate of Velocity Change', formula: 'a = (vf − vi) / Δt', detail: 'Acceleration is how quickly velocity changes over time. From initial velocity vi to final velocity vf in time Δt.' },
    { label: 'Substitute a into F = ma', formula: 'F = m × (vf − vi) / Δt', detail: 'Replacing a with the velocity change formula. Distribute m: F = (mvf − mvi) / Δt.' },
    { label: 'Recognize Momentum p = mv', formula: 'F = (pf − pi) / Δt = Δp / Δt', detail: 'mv is momentum (p). The numerator is the change in momentum Δp. So: F = Δp/Δt. Force equals rate of change of momentum!' },
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title="Derivation: Force & Change in Momentum" />

      {/* Mobile Tabs */}
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')}
          className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Derivation</button>
        <button onClick={() => setActiveMobileTab('lab')}
          className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Simulation</button>
      </div>

      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        {/* Column 1: Derivation (primary focus - spans 3 columns) */}
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Step-by-Step Derivation</h2>
              <p className="text-xs text-slate-500">Follow the logical progression from Newton’s 2nd law to F = Δp/Δt</p>
            </div>
          </div>

          {/* Formula card - always visible */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-blue-200 font-semibold uppercase tracking-wider">Final Formula</p>
            <p className="text-2xl font-bold font-mono text-white mt-1">F = Δp / Δt</p>
            <p className="text-xs text-blue-200 mt-1">The net force equals the rate of change of momentum</p>
          </div>

          {/* Derivation chain - ALL steps always visible */}
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  {/* Step number vertical connector */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">
                      {idx + 1}
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-blue-400 to-blue-200 dark:from-blue-600 dark:to-blue-800" />
                    )}
                  </div>
                  {/* Step content */}
                  <div className="flex-1 pb-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800 mb-1">
                      <p className="font-bold text-base text-blue-800 dark:text-blue-300">{step.label}</p>
                    </div>
                    {/* Formula highlight */}
                    <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]">
                      <span className="text-sm font-mono font-bold text-yellow-400">{step.formula}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">
                      {step.detail}
                    </p>
                    {/* Arrow between steps */}
                    {idx < steps.length - 1 && (
                      <div className="flex justify-center mt-1">
                        <ArrowRight className="w-4 h-4 text-blue-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Key takeaway box */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-base text-amber-700 dark:text-amber-300">{'💡'} Key Insight</p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">Momentum p = mv measures motion. Force changes momentum over time. If no force acts, momentum stays constant — this is the law of conservation of momentum! Airbags increase impact time Δt, reducing force F.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Interactive + Assessment (spans 2 columns) */}
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          {/* Interactive Simulator */}
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold">See the Derivation in Action</h2>
            </div>
            <p className="text-sm text-slate-500 mb-4">Adjust the sliders to see how F = Δp/Δt works with real numbers.</p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold"><span>Mass (m)</span><span className="text-blue-600 font-mono">{mass} kg</span></div>
                <input type="range" min="1" max="10" step="0.5" value={mass} onChange={e => { setMass(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold"><span>Initial Velocity (vi)</span><span className="text-blue-600 font-mono">{vi} m/s</span></div>
                <input type="range" min="0" max="20" step="1" value={vi} onChange={e => { setVi(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold"><span>Final Velocity (vf)</span><span className="text-blue-600 font-mono">{vf} m/s</span></div>
                <input type="range" min="0" max="30" step="1" value={vf} onChange={e => { setVf(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold"><span>Time Interval (Δt)</span><span className="text-blue-600 font-mono">{time} s</span></div>
                <input type="range" min="0.5" max="5" step="0.5" value={time} onChange={e => { setTime(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
              </div>

              {/* Derivation trace showing each step with current values */}
              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-2">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Derivation Trace</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Step 1: F = ma</span><span className="text-slate-500">F = {mass} × a</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Step 2: a = Δv/Δt</span><span className="text-slate-500">a = ({vf} − {vi}) / {time} = {((vf - vi) / time).toFixed(1)} m/s²</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Step 3: F = m(Δv/Δt)</span><span className="text-slate-500">F = {mass} × {((vf - vi) / time).toFixed(1)}</span></div>
                  <div className="border-t border-[#2a2a2a] pt-1.5 flex justify-between text-xs"><span className="text-green-400 font-bold">Step 4: F = Δp/Δt</span><span className="text-yellow-400 font-mono font-bold">{force.toFixed(1)} N</span></div>
                </div>
              </div>

              {/* Motion visual */}
              <div className="relative h-10 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-300 dark:bg-[#2a2a2a]" />
                <div className="absolute transition-all duration-500 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-[8px] text-white font-bold shadow-lg"
                  style={{ left: `${10 + (vf / 30) * 70}%` }}>
                  m
                </div>
              </div>
            </div>
          </div>

          {/* Assessment */}
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-500" />
              Practice: Apply the Derivation
            </h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">A cricket ball (<strong>0.16 kg</strong>) is bowled at <strong>30 m/s</strong> and hit back at <strong>40 m/s</strong> in the opposite direction. Contact time: <strong>0.01 s</strong>.</p>
              <p className="text-base font-medium">What is the average force exerted by the bat?</p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2 mt-2">
                <p className="text-xs text-blue-700 dark:text-blue-300 font-mono">Δp = m(vf − vi) = 0.16 × (40 − (−30)) = 0.16 × 70 = 11.2 kg·m/s. F = Δp/Δt = 11.2 / 0.01 = ?</p>
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
                placeholder="Force in Newtons..."
                className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-blue-500 outline-none" />
              <button onClick={checkAnswer}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
                Check
              </button>
            </div>
            {checkResult === 'correct' && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>Correct! F = 1120 N.</strong> Using F = Δp/Δt, we get 11.2 / 0.01 = 1120 N — more than the weight of a person!</p>
              </div>
            )}
            {checkResult === 'incorrect' && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-xs text-red-700 dark:text-red-300"><strong>Not quite.</strong> Remember velocity changes direction! vf = −40 m/s. So Δv = 40 − (−30) = 70 m/s, not 10 m/s.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
