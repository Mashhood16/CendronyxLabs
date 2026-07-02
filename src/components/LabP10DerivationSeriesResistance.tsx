import { useState } from 'react';
import { Link, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP10DerivationSeriesResistance({ onExit }: { onExit?: () => void }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [v, setV] = useState(12);
  const [r1, setR1] = useState(100);
  const [r2, setR2] = useState(200);
  const [r3, setR3] = useState(300);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const req = r1 + r2 + r3;
  const current = v / req;

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - req) < req * 0.1 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: 'Voltage Drops Add Up', formula: 'V = V\u2081 + V\u2082 + V\u2083', detail: 'In a series circuit, the total voltage is the sum of individual voltage drops across each resistor.' },
    { label: 'Apply Ohm\'s Law to Each', formula: 'I R_eq = I R\u2081 + I R\u2082 + I R\u2083', detail: 'V=IR for each. The current I is the same through all series resistors.' },
    { label: 'Factor Out Current', formula: 'R_eq = R\u2081 + R\u2082 + R\u2083', detail: 'Divide both sides by I (which is constant). Equivalent resistance is simply the sum!' },
    { label: 'Key Principle', formula: 'R_eq > R\u2081, R\u2082, R\u2083 individually', detail: 'Adding resistors in series always increases total resistance. More resistors = more opposition to current!' },
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title="Derivation: Series Resistance" />
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Derivation</button>
        <button onClick={() => setActiveMobileTab('lab')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Simulation</button>
      </div>
      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg"><Link className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold">Step-by-Step Derivation</h2><p className="text-xs text-slate-500">Deriving R_eq = R\u2081 + R\u2082 + R\u2083 for series</p></div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-blue-200 font-semibold uppercase tracking-wider">Final Formula</p>
            <p className="text-2xl font-bold font-mono text-white mt-1">R_eq = R\u2081 + R\u2082 + R\u2083</p>
            <p className="text-xs text-blue-200 mt-1">Sum of all resistances in series</p>
          </div>
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
                    {idx < steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-blue-400 to-blue-200" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800 mb-1"><p className="font-bold text-base text-blue-800 dark:text-blue-300">{step.label}</p></div>
                    <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]"><span className="text-base font-mono font-bold text-yellow-400">{step.formula}</span></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>
                    {idx < steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-blue-400" /></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div><p className="font-bold text-base text-amber-700 dark:text-amber-300">{'\uD83D\uDCA1'} Key Insight</p><p className="text-sm text-amber-700 dark:text-amber-300 mt-1">Series resistors act like a single longer resistor. The total resistance is always greater than any individual. This is why old Christmas lights would all go out when one bulb failed!</p></div>
            </div>
          </div>
        </div>
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-blue-500" /><h2 className="text-lg font-bold">See the Derivation in Action</h2></div>
            <p className="text-sm text-slate-500 mb-4">Adjust resistor values to see series equivalent.</p>
            <div className="space-y-3">
              <div><div className="flex justify-between text-xs font-semibold"><span>R\u2081</span><span className="text-blue-600 font-mono">{r1} \u03A9</span></div><input type="range" min="50" max="500" step="10" value={r1} onChange={e => { setR1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>R\u2082</span><span className="text-blue-600 font-mono">{r2} \u03A9</span></div><input type="range" min="50" max="500" step="10" value={r2} onChange={e => { setR2(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>R\u2083</span><span className="text-blue-600 font-mono">{r3} \u03A9</span></div><input type="range" min="50" max="500" step="10" value={r3} onChange={e => { setR3(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" /></div>
              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase">Derivation Trace</p>
                <p className="text-sm text-slate-400">V = V\u2081 + V\u2082 + V\u2083 (voltage adds)</p>
                <p className="text-sm text-slate-400">IR_eq = I\u00D7{r1} + I\u00D7{r2} + I\u00D7{r3}</p>
                <p className="border-t border-[#2a2a2a] pt-1 text-xs"><span className="text-green-400 font-bold">R_eq = </span><span className="text-yellow-400 font-mono font-bold">{req} \u03A9</span></p>
                <p className="text-xs text-slate-500">Current: I = V/R_eq = {(current*1000).toFixed(1)} mA</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Link className="w-5 h-5 text-emerald-500" /> Practice: Apply the Derivation</h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">Three resistors <strong>200\u03A9, 300\u03A9, 500\u03A9</strong> are in series with a 10V battery.</p>
              <p className="text-base font-medium">Find the total resistance.</p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2 mt-2"><p className="text-xs text-blue-700 dark:text-blue-300 font-mono">R_eq = 200 + 300 + 500 = ?</p></div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder="R_eq in \u03A9..." className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-blue-500 outline-none" />
              <button onClick={checkAnswer} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">Check</button>
            </div>
            {checkResult === 'correct' && <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>Correct! 1000\u03A9.</strong> The current I = 10/1000 = 10 mA, flowing through all three resistors.</p></div>}
            {checkResult === 'incorrect' && <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500 shrink-0" /><p className="text-xs text-red-700 dark:text-red-300"><strong>Not quite.</strong> R_eq = R\u2081 + R\u2082 + R\u2083 = 200 + 300 + 500 = 1000\u03A9</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
