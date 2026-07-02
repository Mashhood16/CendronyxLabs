import { useState } from 'react';
import { GitBranch, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP10DerivationParallelResistance({ onExit }: { onExit?: () => void }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [v, setV] = useState(12);
  const [r1, setR1] = useState(100);
  const [r2, setR2] = useState(200);
  const [r3, setR3] = useState(300);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const req = 1 / (1/r1 + 1/r2 + 1/r3);
  const totalCurrent = v / req;

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - req) < req * 0.1 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: 'Currents in Branches Add Up', formula: 'I = I\u2081 + I\u2082 + I\u2083', detail: 'In a parallel circuit, total current splits among branches. Each branch carries part of the total current.' },
    { label: 'Apply Ohm\'s Law to Each Branch', formula: 'V/R_eq = V/R\u2081 + V/R\u2082 + V/R\u2083', detail: 'I = V/R for each branch. Voltage V is the same across all parallel resistors.' },
    { label: 'Factor Out Voltage', formula: '1/R_eq = 1/R\u2081 + 1/R\u2082 + 1/R\u2083', detail: 'Divide both sides by V (same voltage). The reciprocal of equivalent resistance equals sum of reciprocals.' },
    { label: 'Key Principle', formula: 'R_eq < R\u2081, R\u2082, R\u2083 individually', detail: 'Adding resistors in parallel always decreases total resistance. More paths = less opposition to current!' },
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title="Derivation: Parallel Resistance" />
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-purple-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Derivation</button>
        <button onClick={() => setActiveMobileTab('lab')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-purple-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Simulation</button>
      </div>
      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg"><GitBranch className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold">Step-by-Step Derivation</h2><p className="text-xs text-slate-500">Deriving 1/R_eq = 1/R\u2081 + 1/R\u2082 + 1/R\u2083</p></div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-purple-200 font-semibold uppercase tracking-wider">Final Formula</p>
            <p className="text-xl font-bold font-mono text-white mt-1">1/R_eq = 1/R\u2081 + 1/R\u2082 + 1/R\u2083</p>
            <p className="text-xs text-purple-200 mt-1">Reciprocals add for parallel resistances</p>
          </div>
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
                    {idx < steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-purple-400 to-purple-200" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800 mb-1"><p className="font-bold text-base text-purple-800 dark:text-purple-300">{step.label}</p></div>
                    <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]"><span className="text-base font-mono font-bold text-yellow-400">{step.formula}</span></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>
                    {idx < steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-purple-400" /></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div><p className="font-bold text-base text-amber-700 dark:text-amber-300">{'\uD83D\uDCA1'} Key Insight</p><p className="text-sm text-amber-700 dark:text-amber-300 mt-1">For two equal resistors R in parallel, R_eq = R/2. For n equal resistors, R_eq = R/n. Modern LED lights are wired in parallel so each stays on independently!</p></div>
            </div>
          </div>
        </div>
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-purple-500" /><h2 className="text-lg font-bold">See the Derivation in Action</h2></div>
            <p className="text-sm text-slate-500 mb-4">Adjust resistor values to see parallel equivalent.</p>
            <div className="space-y-3">
              <div><div className="flex justify-between text-xs font-semibold"><span>R\u2081</span><span className="text-purple-600 font-mono">{r1} \u03A9</span></div><input type="range" min="50" max="500" step="10" value={r1} onChange={e => { setR1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-purple-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>R\u2082</span><span className="text-purple-600 font-mono">{r2} \u03A9</span></div><input type="range" min="50" max="500" step="10" value={r2} onChange={e => { setR2(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-purple-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>R\u2083</span><span className="text-purple-600 font-mono">{r3} \u03A9</span></div><input type="range" min="50" max="500" step="10" value={r3} onChange={e => { setR3(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-purple-500" /></div>
              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase">Derivation Trace</p>
                <p className="text-sm text-slate-400">I = I\u2081 + I\u2082 + I\u2083 (currents add)</p>
                <p className="text-sm text-slate-400">V/R_eq = V/{r1} + V/{r2} + V/{r3}</p>
                <p className="border-t border-[#2a2a2a] pt-1 text-xs"><span className="text-green-400 font-bold">R_eq = </span><span className="text-yellow-400 font-mono font-bold">{req.toFixed(1)} \u03A9</span></p>
                <p className="text-xs text-slate-500">Total current I = {(totalCurrent*1000).toFixed(1)} mA</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><GitBranch className="w-5 h-5 text-emerald-500" /> Practice: Apply the Derivation</h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">Two resistors <strong>100\u03A9 and 100\u03A9</strong> are in parallel.</p>
              <p className="text-base font-medium">Find the equivalent resistance.</p>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-2 mt-2"><p className="text-xs text-purple-700 dark:text-purple-300 font-mono">1/R_eq = 1/100 + 1/100 = 2/100. R_eq = ?</p></div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder="R_eq in \u03A9..." className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-purple-500 outline-none" />
              <button onClick={checkAnswer} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors">Check</button>
            </div>
            {checkResult === 'correct' && <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>Correct! 50\u03A9.</strong> Two equal resistors in parallel give half the value. The equivalent is always less than the smallest individual!</p></div>}
            {checkResult === 'incorrect' && <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500 shrink-0" /><p className="text-xs text-red-700 dark:text-red-300"><strong>Not quite.</strong> 1/R_eq = 1/100 + 1/100 = 2/100. So R_eq = 100/2 = 50\u03A9</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
