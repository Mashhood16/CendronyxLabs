import { useState } from 'react';
import { Ruler, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP10DerivationLinearExpansion({ onExit }: { onExit?: () => void }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [lo, setLo] = useState(1);
  const [dt, setDt] = useState(50);
  const [alphaInput, setAlphaInput] = useState(1.2e-5);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const dL = alphaInput * lo * dt;

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - dL) < dL * 0.1 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: 'Length Change is Proportional', formula: 'ΔL ∝ L_o × ΔT', detail: 'On a scorching summer day, train tracks can buckle under the heat. The rails expand — a 100 m steel track grows several centimeters. The change in length is proportional to original length and temperature change.' },
    { label: 'Insert Proportionality Constant', formula: 'ΔL = α L_o ΔT', detail: 'Engineers use expansion joints (gaps between rails) to prevent buckling. The constant alpha is the coefficient of linear expansion: Delta-L = alpha x L-zero x Delta-T. Steel has alpha = 1.2e-5 per degree C.' },
    { label: 'Rearrange for α', formula: 'α = ΔL / (L_o ΔT)', detail: 'Rearranging: alpha = Delta-L/(L-zero x Delta-T). A 100 m rail heating from 15 C to 45 C expands by 3.6 cm. That gap is the sound you hear when trains go clickety-clack!' },
    { label: 'Final Formula', formula: 'L = L_o (1 + α ΔT)', detail: 'L = L-zero(1 + alpha x Delta-T). Every material has its own alpha. Invar barely expands at all — used in precision instruments like clocks and telescopes. Bimetallic strips in thermostats use two different metals to bend and switch circuits!' }
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title="Derivation: Linear Thermal Expansion" />
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-red-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Derivation</button>
        <button onClick={() => setActiveMobileTab('lab')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-red-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Simulation</button>
      </div>
      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg"><Ruler className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold">Step-by-Step Derivation</h2><p className="text-xs text-slate-500">Deriving α the coefficient of linear thermal expansion</p></div>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-red-200 font-semibold uppercase tracking-wider">Final Formula</p>
            <p className="text-2xl font-bold font-mono text-white mt-1">α = ΔL / (L₀ ΔT)</p>
            <p className="text-xs text-red-200 mt-1">Coefficient of linear thermal expansion</p>
          </div>
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
                    {idx < steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-red-400 to-red-200" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 mb-1"><p className="font-bold text-base text-red-800 dark:text-red-300">{step.label}</p></div>
                    <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]"><span className="text-base font-mono font-bold text-yellow-400">{step.formula}</span></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>
                    {idx < steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-red-400" /></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div><p className="font-bold text-base text-amber-700 dark:text-amber-300">{'💡'} Key Insight</p><p className="text-sm text-amber-700 dark:text-amber-300 mt-1">Bridges have expansion gaps for a reason! Steel α = 1.2×10⁻¹/°C. A 100m bridge expanding 50°C would grow 6 cm — enough to buckle without gaps!</p></div>
            </div>
          </div>
        </div>
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-red-500" /><h2 className="text-lg font-bold">See the Derivation in Action</h2></div>
            <p className="text-sm text-slate-500 mb-4">Adjust values to see how rods expand with temperature.</p>
            <div className="space-y-3">
              <div><div className="flex justify-between text-xs font-semibold"><span>Original Length (L_o)</span><span className="text-red-600 font-mono">{lo} m</span></div><input type="range" min="0.5" max="5" step="0.1" value={lo} onChange={e => { setLo(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-red-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>Temp Change (ΔT)</span><span className="text-red-600 font-mono">{dt}°C</span></div><input type="range" min="10" max="200" step="5" value={dt} onChange={e => { setDt(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-red-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>Expansion Coeff (α)</span><span className="text-red-600 font-mono">{alphaInput.toExponential(1)}/°C</span></div><input type="range" min="0.5e-5" max="3e-5" step="0.1e-5" value={alphaInput} onChange={e => { setAlphaInput(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-red-500" /></div>
              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase">Derivation Trace</p>
                <p className="text-sm text-slate-400">ΔL = {alphaInput.toExponential(1)}×{lo}×{dt}</p>
                <p className="border-t border-[#2a2a2a] pt-1 text-xs"><span className="text-green-400 font-bold">ΔL = </span><span className="text-yellow-400 font-mono font-bold">{(dL*1000).toFixed(2)} mm</span></p>
              </div>
              <div className="relative h-16 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
                <div className="absolute bottom-2 left-4 right-4 h-3 bg-gradient-to-r from-blue-400 to-red-500 rounded transition-all duration-300" style={{ width: `${Math.min(30 + dL * 3000, 90)}%` }}>
                  <div className="absolute -top-4 text-[9px] font-mono font-bold text-red-500 whitespace-nowrap">{lo}m + {(dL*1000).toFixed(1)}mm</div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Ruler className="w-5 h-5 text-emerald-500" /> Practice: Apply the Derivation</h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">A steel rail is <strong>20 m</strong> long at 15°C. In summer it reaches <strong>45°C</strong>. α_steel = 1.2×10⁻⁵/°C.</p>
              <p className="text-base font-medium">How much does the rail expand?</p>
              <div className="bg-red-50 dark:bg-red-900/20 rounded p-2 mt-2"><p className="text-xs text-red-700 dark:text-red-300 font-mono">ΔL = 1.2×10⁻⁵ × 20 × (45-15) = ?</p></div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder="ΔL in mm..." className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-red-500 outline-none" />
              <button onClick={checkAnswer} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors">Check</button>
            </div>
            {checkResult === 'correct' && <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>Correct! 7.2 mm.</strong> Over 1 km of rail, this would be 36 cm — that\'s why expansion gaps exist!</p></div>}
            {checkResult === 'incorrect' && <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500 shrink-0" /><p className="text-xs text-red-700 dark:text-red-300"><strong>Not quite.</strong> Use ΔL = α × L_o × ΔT. ΔT = 45 - 15 = 30°C.</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
