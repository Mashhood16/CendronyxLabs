import { useState } from 'react';
import { Atom, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP10DerivationRadioactiveDecay({ onExit }: { onExit?: () => void }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [no, setNo] = useState(1000);
  const [halfLife, setHalfLife] = useState(10);
  const [totalTime, setTotalTime] = useState(30);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const n = totalTime / halfLife;
  const remaining = no / Math.pow(2, n);

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - remaining) < remaining * 0.1 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: 'After 1 Half-Life', formula: 'N₁ = ½ N₀', detail: 'After one half-life, exactly half of the radioactive nuclei remain. The rest have decayed into other elements.' },
    { label: 'After 2 Half-Lives', formula: 'N₂ = ½ × ½ N₀ = (½)² N₀', detail: 'After two half-lives, one quarter remains. The pattern is clear: each half-life multiplies by 1/2.' },
    { label: 'After n Half-Lives', formula: 'N = (½)ⁿ N₀ = N₀ / 2ⁿ', detail: 'After n half-lives, N = N₀ / 2ⁿ. This is an exponential decay law.' },
    { label: 'Number of Half-Lives', formula: 'n = Δt / T½', detail: 'The number of half-lives n equals total time divided by the half-life period. Substituting gives: N = N₀ / 2^(Δt/T½).' },
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title="Derivation: Radioactive Decay Formula" />
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Derivation</button>
        <button onClick={() => setActiveMobileTab('lab')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Simulation</button>
      </div>
      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg"><Atom className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold">Step-by-Step Derivation</h2><p className="text-xs text-slate-500">Deriving the exponential decay law N = N₀/2ⁿ</p></div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-emerald-200 font-semibold uppercase tracking-wider">Final Formula</p>
            <p className="text-xl font-bold font-mono text-white mt-1">N = N₀ / 2^(Δt / T½)</p>
            <p className="text-xs text-emerald-200 mt-1">Exponential decay law for radioactive nuclei</p>
          </div>
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
                    {idx < steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-emerald-400 to-emerald-200" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 mb-1"><p className="font-bold text-base text-emerald-800 dark:text-emerald-300">{step.label}</p></div>
                    <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]"><span className="text-base font-mono font-bold text-yellow-400">{step.formula}</span></div>
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
              <div><p className="font-bold text-base text-amber-700 dark:text-amber-300">{'💡'} Key Insight</p><p className="text-sm text-amber-700 dark:text-amber-300 mt-1">Carbon-14 dating uses this formula! C-14 half-life = 5730 years. By measuring remaining C-14 in ancient organic material, we can calculate its age. N = N₀/2^(Δt/5730)!</p></div>
            </div>
          </div>
        </div>
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-emerald-500" /><h2 className="text-lg font-bold">See the Derivation in Action</h2></div>
            <p className="text-sm text-slate-500 mb-4">Adjust half-life and time to see exponential decay.</p>
            <div className="space-y-3">
              <div><div className="flex justify-between text-xs font-semibold"><span>Initial Nuclei (N₀)</span><span className="text-emerald-600 font-mono">{no}</span></div><input type="range" min="100" max="5000" step="50" value={no} onChange={e => { setNo(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>Half-Life (T½)</span><span className="text-emerald-600 font-mono">{halfLife} s</span></div><input type="range" min="1" max="60" step="1" value={halfLife} onChange={e => { setHalfLife(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>Total Time (Δt)</span><span className="text-emerald-600 font-mono">{totalTime} s</span></div><input type="range" min={halfLife} max={60 * halfLife} step="1" value={totalTime} onChange={e => { setTotalTime(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" /></div>
              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase">Derivation Trace</p>
                <p className="text-sm text-slate-400">n = Δt/T½ = {totalTime}/{halfLife} = {n.toFixed(1)} half-lives</p>
                <p className="text-sm text-slate-400">N = {no} / 2^{n.toFixed(1)}</p>
                <p className="border-t border-[#2a2a2a] pt-1 text-xs"><span className="text-green-400 font-bold">N = </span><span className="text-yellow-400 font-mono font-bold">{remaining.toFixed(0)} nuclei</span></p>
              </div>
              <div className="relative h-8 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500 rounded-lg" style={{ width: `${(remaining / no) * 100}%` }} />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Atom className="w-5 h-5 text-emerald-500" /> Practice: Apply the Derivation</h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">A sample starts with <strong>800 nuclei</strong>, half-life = <strong>5 years</strong>. How many remain after <strong>15 years</strong>?</p>
              <p className="text-base font-medium">Find remaining nuclei.</p>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded p-2 mt-2"><p className="text-xs text-emerald-700 dark:text-emerald-300 font-mono">n = 15/5 = 3. N = 800/2³ = ?</p></div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder="Remaining nuclei..." className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-emerald-500 outline-none" />
              <button onClick={checkAnswer} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors">Check</button>
            </div>
            {checkResult === 'correct' && <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>Correct! 100 nuclei.</strong> After 15 years (3 half-lives): 800 → 400 → 200 → 100. Exponential decay halves repeatedly!</p></div>}
            {checkResult === 'incorrect' && <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500 shrink-0" /><p className="text-xs text-red-700 dark:text-red-300"><strong>Not quite.</strong> n = 15/5 = 3. N = 800/2³ = 800/8 = 100</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
