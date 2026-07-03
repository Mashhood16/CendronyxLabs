import { useState } from 'react';
import { ArrowUpDown, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP9DerivationHydraulic({ onExit }: { onExit?: () => void }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [areaSmall, setAreaSmall] = useState(0.01);
  const [areaLarge, setAreaLarge] = useState(0.5);
  const [inputForce, setInputForce] = useState(100);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const outputForce = (areaLarge / areaSmall) * inputForce;
  const mechanicalAdvantage = areaLarge / areaSmall;

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - outputForce) < outputForce * 0.1 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: "Pascal's Principle", formula: 'P₁ = P₂', detail: "🔧 You're a mechanic with a 1500 kg car that needs lifting. You place a hydraulic jack under the frame and pump the handle. Blaise Pascal discovered that pressure applied to a fluid in a closed container is transmitted equally in all directions. The pressure you create at the handle reaches the car undiminished." },
    { label: 'Pressure on Small Piston', formula: 'P₁ = F₁ / A₁', detail: 'Pushing the small piston (area = 0.005 m²) with just 240 N of force creates P₁ = 240/0.005 = 48,000 Pa — like pressing a pen tip into your palm. A small area means big pressure from a small force.' },
    { label: 'Same Pressure on Large Piston', formula: 'F₂ / A₂ = F₁ / A₁', detail: 'By Pascal\'s principle, the 48,000 Pa you created at the pump handle is transmitted through the hydraulic fluid WITHOUT LOSING ANY STRENGTH. P₂ = P₁ = 48,000 Pa. The fluid carries your force invisibly to where it\'s needed.' },
    { label: 'Solve for Output Force', formula: 'F₂ = (A₂ / A₁) × F₁', detail: 'F₂/A₂ = F₁/A₁, so F₂ = (A₂/A₁) × F₁ = (0.25/0.005) × 240 = 12,000 N! Your puny 240 N push lifts a full car. Mechanical advantage = 50×. This same principle stops your car when you press the brake pedal, controls massive excavators, and even powers dentist chairs!' },
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title="Derivation: Hydraulic Lift (Pascal's Principle)" />
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')}
          className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-rose-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Derivation</button>
        <button onClick={() => setActiveMobileTab('lab')}
          className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-rose-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Simulation</button>
      </div>
      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        {/* Column 1: Derivation (primary - spans 3) */}
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg">
              <ArrowUpDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Step-by-Step Derivation</h2>
              <p className="text-xs text-slate-500">How Pascal's principle lets a small force lift a heavy load</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-rose-200 font-semibold uppercase tracking-wider">Final Formula</p>
            <p className="text-2xl font-bold font-mono text-white mt-1">F₂ = (A₂/A₁) × F₁</p>
            <p className="text-xs text-rose-200 mt-1">Output force = area ratio × input force</p>
          </div>

          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
                    {idx < steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-rose-400 to-rose-200 dark:from-rose-600 dark:to-rose-800" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-3 border border-rose-200 dark:border-rose-800 mb-1">
                      <p className="font-bold text-base text-rose-800 dark:text-rose-300">{step.label}</p>
                    </div>
                    <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]">
                      <span className="text-sm font-mono font-bold text-yellow-400">{step.formula}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>
                    {idx < steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-rose-400" /></div>}
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
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">The mechanical advantage A₂/A₁ is what makes hydraulics so powerful. Car brakes, construction excavators, and dentist chairs all use this principle to multiply force!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Interactive + Assessment */}
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-rose-500" /><h2 className="text-lg font-bold">See the Derivation in Action</h2></div>
            <p className="text-sm text-slate-500 mb-4">Adjust piston areas and input force to see force multiplication.</p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold"><span>Small Piston Area (A₁)</span><span className="text-rose-600 font-mono">{areaSmall} m²</span></div>
                <input type="range" min="0.002" max="0.05" step="0.001" value={areaSmall} onChange={e => { setAreaSmall(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold"><span>Large Piston Area (A₂)</span><span className="text-rose-600 font-mono">{areaLarge} m²</span></div>
                <input type="range" min="0.05" max="2" step="0.01" value={areaLarge} onChange={e => { setAreaLarge(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold"><span>Input Force (F₁)</span><span className="text-rose-600 font-mono">{inputForce} N</span></div>
                <input type="range" min="10" max="500" step="10" value={inputForce} onChange={e => { setInputForce(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" />
              </div>

              <div className="relative h-32 bg-white dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-300 dark:border-[#2a2a2a]">
                <div className="absolute bottom-2 left-[15%] right-[15%] h-[55%] bg-rose-400/20 rounded-b-lg border border-rose-400/30" />
                <div className="absolute bottom-[calc(2px+55%)] left-[15%] translate-x-[-50%]" style={{ width: `${12 + areaSmall * 400}px`, height: '18px' }}>
                  <div className="w-full h-full bg-rose-500 rounded-t-lg flex items-center justify-center text-[7px] text-white font-bold">F₁={inputForce}N</div>
                </div>
                <div className="absolute bottom-[calc(2px+55%)] right-[15%] translate-x-[50%]" style={{ width: `${12 + areaLarge * 18}px`, height: `${18 + inputForce / 25}px`, minHeight: '28px' }}>
                  <div className="w-full h-full bg-rose-600 rounded-t-lg flex items-center justify-center text-[7px] text-white font-bold text-center leading-tight">F₂={outputForce.toFixed(0)}N</div>
                </div>
                <div className="absolute bottom-1 left-1 text-[7px] text-slate-500">A₁={areaSmall}m²</div>
                <div className="absolute bottom-1 right-1 text-[7px] text-slate-500">A₂={areaLarge}m²</div>
              </div>

              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase">Derivation Trace</p>
                <p className="text-sm text-slate-400">P₁ = F₁/A₁ = {inputForce}/{areaSmall} = {(inputForce/areaSmall).toFixed(0)} Pa</p>
                <p className="text-sm text-slate-400">P₂ = P₁ (Pascal's Principle)</p>
                <p className="text-sm text-slate-400">F₂ = P₂ × A₂ = {(inputForce/areaSmall).toFixed(0)} × {areaLarge}</p>
                <p className="border-t border-[#2a2a2a] pt-1 text-xs"><span className="text-green-400 font-bold">Mech. Advantage: </span><span className="text-yellow-400 font-mono font-bold">{mechanicalAdvantage.toFixed(1)}×</span> <span className="text-green-400 font-bold"> | F₂ = </span><span className="text-yellow-400 font-mono font-bold">{outputForce.toFixed(0)} N</span></p>
                {outputForce > 1000 && <p className="text-xs text-amber-400">Lifts {(outputForce/9.81).toFixed(0)} kg!</p>}
              </div>
            </div>
          </div>

          {/* Assessment */}
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><ArrowUpDown className="w-5 h-5 text-emerald-500" /> Practice: Apply the Derivation</h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">Hydraulic lift: A₁ = <strong>0.005 m²</strong>, A₂ = <strong>0.25 m²</strong>. Car weight = <strong>12,000 N</strong>.</p>
              <p className="text-base font-medium">What minimum input force is needed?</p>
              <div className="bg-rose-50 dark:bg-rose-900/20 rounded p-2 mt-2">
                <p className="text-xs text-rose-700 dark:text-rose-300 font-mono">F₁ = F₂ × A₁/A₂ = 12,000 × 0.005 / 0.25</p>
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
                placeholder="Input force (N)..."
                className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-rose-500 outline-none" />
              <button onClick={checkAnswer} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition-colors">Check</button>
            </div>
            {checkResult === 'correct' && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>Correct! F₁ = 240 N.</strong> With a 50:1 mechanical advantage, 240 N lifts 12,000 N — that's the power of hydraulics!</p>
              </div>
            )}
            {checkResult === 'incorrect' && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-xs text-red-700 dark:text-red-300"><strong>Not quite.</strong> F₁ = F₂ × A₁/A₂ = 12,000 × 0.005 / 0.25</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
