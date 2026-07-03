import { useState } from 'react';
import { Eye, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP10DerivationCriticalAngle({ onExit }: { onExit?: () => void }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [n1, setN1] = useState(1.5);
  const [n2, setN2] = useState(1);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const thetaC = Math.asin(n2 / n1) * (180 / Math.PI);

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - thetaC) < thetaC * 0.1 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: 'At Critical Angle, θr = 90°', formula: 'n₁ sinθc = n₂ sin 90°', detail: 'Swimming underwater, you look up at the surface. The world above appears as a shimmering circle. Light bends as it leaves water (n=1.33) into air (n=1.0). Snell\'s law n₁ sinθᵢ = n₂ sinθr describes exactly how much it bends.' },
    { label: 'sin 90° = 1', formula: 'n₁ sinθc = n₂', detail: 'As you swim deeper and look up at a steeper angle, the bright circle shrinks. At a certain angle, the refracted ray runs along the surface at 90 degrees. This is the critical angle — beyond it, you can no longer see above the water.' },
    { label: 'Solve for Critical Angle', formula: 'θc = sin⁻¹(n₂ / n₁)', detail: 'With sin 90 = 1, Snell\'s law simplifies: n₁ sinθc = n₂. The water surface turns into a perfect mirror. Below the critical angle, total internal reflection takes over.' }
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title="Derivation: Critical Angle for TIR" />
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-fuchsia-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Derivation</button>
        <button onClick={() => setActiveMobileTab('lab')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-fuchsia-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Simulation</button>
      </div>
      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-lg"><Eye className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold">Step-by-Step Derivation</h2><p className="text-xs text-slate-500">Deriving θc from Snell\'s Law for Total Internal Reflection</p></div>
          </div>
          <div className="bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-fuchsia-200 font-semibold uppercase tracking-wider">Final Formula</p>
            <p className="text-xl font-bold font-mono text-white mt-1">θc = sin⁻¹(n₂ / n₁)</p>
            <p className="text-xs text-fuchsia-200 mt-1">Critical angle determines the threshold for total internal reflection</p>
          </div>
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-fuchsia-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
                    {idx < steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-fuchsia-400 to-fuchsia-200" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-lg p-3 border border-fuchsia-200 dark:border-fuchsia-800 mb-1"><p className="font-bold text-base text-fuchsia-800 dark:text-fuchsia-300">{step.label}</p></div>
                    <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]"><span className="text-base font-mono font-bold text-yellow-400">{step.formula}</span></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>
                    {idx < steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-fuchsia-400" /></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div><p className="font-bold text-base text-amber-700 dark:text-amber-300">{'💡'} Key Insight</p><p className="text-sm text-amber-700 dark:text-amber-300 mt-1">Diamonds sparkle because they have a high n (2.42), giving θc ≈ 24°. Light entering gets trapped by TIR bouncing inside before escaping — creating brilliant fire!</p></div>
            </div>
          </div>
        </div>
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-fuchsia-500" /><h2 className="text-lg font-bold">See the Derivation in Action</h2></div>
            <p className="text-sm text-slate-500 mb-4">Adjust refractive indices to see critical angle change.</p>
            <div className="space-y-3">
              <div><div className="flex justify-between text-xs font-semibold"><span>Denser Medium (n₁)</span><span className="text-fuchsia-600 font-mono">{n1.toFixed(2)}</span></div><input type="range" min="1.33" max="2.5" step="0.01" value={n1} onChange={e => { setN1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-fuchsia-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>Rarer Medium (n₂)</span><span className="text-fuchsia-600 font-mono">{n2.toFixed(2)}</span></div><input type="range" min="1" max="1.5" step="0.01" value={n2} onChange={e => { setN2(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-fuchsia-500" /></div>
              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase">Derivation Trace</p>
                <p className="text-sm text-slate-400">n₁ sinθc = n₂ × 1</p>
                <p className="text-sm text-slate-400">sinθc = {n2}/{n1} = {(n2/n1).toFixed(4)}</p>
                <p className="border-t border-[#2a2a2a] pt-1 text-xs"><span className="text-green-400 font-bold">θc = </span><span className="text-yellow-400 font-mono font-bold">{thetaC.toFixed(1)}°</span></p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Eye className="w-5 h-5 text-emerald-500" /> Practice: Apply the Derivation</h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">Glass has <strong>n = 1.5</strong> and air is <strong>n = 1.0</strong>.</p>
              <p className="text-base font-medium">Find the critical angle for the glass-air boundary.</p>
              <div className="bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded p-2 mt-2"><p className="text-xs text-fuchsia-700 dark:text-fuchsia-300 font-mono">θc = sin⁻¹(1/1.5) = ?</p></div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder="θc in degrees..." className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-fuchsia-500 outline-none" />
              <button onClick={checkAnswer} className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-sm font-semibold rounded-lg transition-colors">Check</button>
            </div>
            {checkResult === 'correct' && <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>Correct! 41.8°.</strong> Beyond this angle, light totally reflects inside glass — the principle behind optical fibers!</p></div>}
            {checkResult === 'incorrect' && <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500 shrink-0" /><p className="text-xs text-red-700 dark:text-red-300"><strong>Not quite.</strong> θc = sin⁻¹(n₂/n₁) = sin⁻¹(1/1.5) ≈ 41.8°</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
