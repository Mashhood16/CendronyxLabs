import { useState } from 'react';
import { Cable, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP10DerivationResistivity({ onExit }: { onExit?: () => void }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [r, setR] = useState(10);
  const [l, setL] = useState(2);
  const [a, setA] = useState(1e-6);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const rho = (r * a) / l;

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - rho) < rho * 0.1 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: 'Resistance Depends on Geometry', formula: 'R \u221D L / A', detail: 'Resistance is directly proportional to length L and inversely proportional to cross-sectional area A. Longer wires resist more; thicker wires resist less.' },
    { label: 'Insert Proportionality Constant', formula: 'R = \u03C1 \u00D7 L / A', detail: 'The constant \u03C1 (rho) is called resistivity. It is a material property independent of shape.' },
    { label: 'Rearrange for Resistivity', formula: '\u03C1 = R \u00D7 A / L', detail: 'Resistivity = Resistance \u00D7 Area / Length. Units: \u03A9\u00B7m. Each material has its characteristic resistivity.' },
    { label: 'Material Comparison', formula: '\u03C1_Cu = 1.68\u00D710\u207B\u2078, \u03C1_Al = 2.65\u00D710\u207B\u2078, \u03C1_Fe = 9.71\u00D710\u207B\u2078', detail: 'Copper has low resistivity = good conductor. Insulators like rubber have \u03C1 > 10\u00B9\u00B3 \u03A9\u00B7m \u2014 that\'s 10\u00B2\u00B9 times more!' },
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title="Derivation: Resistivity" />
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-amber-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Derivation</button>
        <button onClick={() => setActiveMobileTab('lab')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-amber-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Simulation</button>
      </div>
      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg"><Cable className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold">Step-by-Step Derivation</h2><p className="text-xs text-slate-500">Deriving resistivity from resistance and geometry</p></div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-amber-200 font-semibold uppercase tracking-wider">Final Formula</p>
            <p className="text-2xl font-bold font-mono text-white mt-1">\u03C1 = R \u00D7 A / L</p>
            <p className="text-xs text-amber-200 mt-1">Resistivity = Resistance \u00D7 Area / Length (\u03A9\u00B7m)</p>
          </div>
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
                    {idx < steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-amber-400 to-amber-200" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800 mb-1"><p className="font-bold text-base text-amber-800 dark:text-amber-300">{step.label}</p></div>
                    <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]"><span className="text-base font-mono font-bold text-yellow-400">{step.formula}</span></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>
                    {idx < steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-amber-400" /></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div><p className="font-bold text-base text-amber-700 dark:text-amber-300">{'\uD83D\uDCA1'} Key Insight</p><p className="text-sm text-amber-700 dark:text-amber-300 mt-1">Resistivity is a material fingerprint. Copper (\u03C1=1.68\u00D710\u207B\u2078) is used for wires. Silver is slightly lower but too expensive. Aluminum is a lighter alternative used in power lines!</p></div>
            </div>
          </div>
        </div>
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-amber-500" /><h2 className="text-lg font-bold">See the Derivation in Action</h2></div>
            <p className="text-sm text-slate-500 mb-4">Adjust wire properties to see resistivity in action.</p>
            <div className="space-y-3">
              <div><div className="flex justify-between text-xs font-semibold"><span>Resistance (R)</span><span className="text-amber-600 font-mono">{r} \u03A9</span></div><input type="range" min="1" max="50" step="1" value={r} onChange={e => { setR(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-amber-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>Length (L)</span><span className="text-amber-600 font-mono">{l} m</span></div><input type="range" min="0.5" max="10" step="0.5" value={l} onChange={e => { setL(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-amber-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>Area (A)</span><span className="text-amber-600 font-mono">{(a*1e6).toFixed(0)} mm\u00B2</span></div><input type="range" min="0.2e-6" max="5e-6" step="0.1e-6" value={a} onChange={e => { setA(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-amber-500" /></div>
              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase">Derivation Trace</p>
                <p className="text-sm text-slate-400">\u03C1 = R\u00D7A/L = {r}\u00D7{(a*1e6).toFixed(0)}\u00D710\u207B\u2076/{l}</p>
                <p className="border-t border-[#2a2a2a] pt-1 text-xs"><span className="text-green-400 font-bold">\u03C1 = </span><span className="text-yellow-400 font-mono font-bold">{rho.toExponential(2)} \u03A9\u00B7m</span></p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Cable className="w-5 h-5 text-emerald-500" /> Practice: Apply the Derivation</h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">A copper wire is <strong>5 m</strong> long, <strong>A = 1\u00D710\u207B\u2076 m\u00B2</strong>, and has <strong>R = 0.084 \u03A9</strong>.</p>
              <p className="text-base font-medium">Find the resistivity of copper.</p>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded p-2 mt-2"><p className="text-xs text-amber-700 dark:text-amber-300 font-mono">\u03C1 = 0.084 \u00D7 10\u207B\u2076 / 5 = ?</p></div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder="\u03C1 in \u03A9\u00B7m..." className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-amber-500 outline-none" />
              <button onClick={checkAnswer} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors">Check</button>
            </div>
            {checkResult === 'correct' && <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>Correct! 1.68\u00D710\u207B\u2078 \u03A9\u00B7m.</strong> That\'s copper\'s resistivity \u2014 low enough to make it the standard for electrical wiring!</p></div>}
            {checkResult === 'incorrect' && <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500 shrink-0" /><p className="text-xs text-red-700 dark:text-red-300"><strong>Not quite.</strong> \u03C1 = R\u00D7A/L = 0.084\u00D710\u207B\u2076/5 = 1.68\u00D710\u207B\u2078 \u03A9\u00B7m</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
