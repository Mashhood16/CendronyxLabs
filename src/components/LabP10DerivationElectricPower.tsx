import { useState } from 'react';
import { Zap, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP10DerivationElectricPower({ onExit }: { onExit?: () => void }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [v, setV] = useState(230);
  const [i, setI] = useState(0.5);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const r = v / i;
  const p1 = v * i;
  const p2 = i * i * r;
  const p3 = v * v / r;

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - p1) < p1 * 0.1 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: 'Power = Energy / Time', formula: 'P = E / t', detail: 'Power is the rate at which energy is used. Energy per unit time.' },
    { label: 'Substitute E = IVt', formula: 'P = (I V t) / t = IV', detail: 'Substituting electrical energy E = IVt and dividing by time t gives P = IV. Power = current × voltage!' },
    { label: 'Using Ohm\'s Law V = IR', formula: 'P = I² R', detail: 'Substitute V = IR into P = IV. Result: P = I²R. Power lost in a resistor (heating).' },
    { label: 'Using Ohm\'s Law I = V/R', formula: 'P = V² / R', detail: 'Substitute I = V/R into P = IV. Result: P = V²/R. Useful for fixed-voltage appliances.' },
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title="Derivation: Electric Power" />
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-pink-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Derivation</button>
        <button onClick={() => setActiveMobileTab('lab')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-pink-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Simulation</button>
      </div>
      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg"><Zap className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold">Step-by-Step Derivation</h2><p className="text-xs text-slate-500">Deriving P = IV = I²R = V²/R</p></div>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-pink-200 font-semibold uppercase tracking-wider">Three Power Formulas</p>
            <p className="text-base font-bold font-mono text-white mt-1">P = IV = I²R = V²/R</p>
            <p className="text-xs text-pink-200 mt-1">Power formulas derived from energy and Ohm\'s law</p>
          </div>
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
                    {idx < steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-pink-400 to-pink-200" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-3 border border-pink-200 dark:border-pink-800 mb-1"><p className="font-bold text-base text-pink-800 dark:text-pink-300">{step.label}</p></div>
                    <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]"><span className="text-base font-mono font-bold text-yellow-400">{step.formula}</span></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>
                    {idx < steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-pink-400" /></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div><p className="font-bold text-base text-amber-700 dark:text-amber-300">{'💡'} Key Insight</p><p className="text-sm text-amber-700 dark:text-amber-300 mt-1">Appliance power ratings use P=IV. A 100W bulb at 230V draws I = P/V = 100/230 = 0.43A. P=I²R explains why power lines use high voltage (low I = less I²R loss)!</p></div>
            </div>
          </div>
        </div>
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-pink-500" /><h2 className="text-lg font-bold">See the Derivation in Action</h2></div>
            <p className="text-sm text-slate-500 mb-4">Adjust values to see all three power forms.</p>
            <div className="space-y-3">
              <div><div className="flex justify-between text-xs font-semibold"><span>Voltage (V)</span><span className="text-pink-600 font-mono">{v} V</span></div><input type="range" min="3" max="240" step="1" value={v} onChange={e => { setV(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-pink-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>Current (I)</span><span className="text-pink-600 font-mono">{i} A</span></div><input type="range" min="0.1" max="10" step="0.1" value={i} onChange={e => { setI(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-pink-500" /></div>
              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase">All Three Forms</p>
                <p className="text-sm text-slate-400">P = IV = {v}×{i} = {p1.toFixed(1)} W</p>
                <p className="text-sm text-slate-400">P = I²R = {i}²×{r.toFixed(1)} = {p2.toFixed(1)} W</p>
                <p className="text-sm text-slate-400">P = V²/R = {v}²/{r.toFixed(1)} = {p3.toFixed(1)} W</p>
                <p className="text-xs text-slate-500">R = V/I = {r.toFixed(1)} Ω</p>
                <p className="border-t border-[#2a2a2a] pt-1 text-xs"><span className="text-green-400 font-bold">P = </span><span className="text-yellow-400 font-mono font-bold">{p1.toFixed(1)} W</span></p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Zap className="w-5 h-5 text-emerald-500" /> Practice: Apply the Derivation</h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">A kettle draws <strong>10A</strong> from a <strong>230V</strong> supply.</p>
              <p className="text-base font-medium">Find its power in Watts.</p>
              <div className="bg-pink-50 dark:bg-pink-900/20 rounded p-2 mt-2"><p className="text-xs text-pink-700 dark:text-pink-300 font-mono">P = IV = 230 × 10 = ?</p></div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder="Power in Watts..." className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-pink-500 outline-none" />
              <button onClick={checkAnswer} className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-lg transition-colors">Check</button>
            </div>
            {checkResult === 'correct' && <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>Correct! 2300 W (2.3 kW).</strong> That\'s typical for a household kettle. In one hour, it uses 2.3 kWh of energy!</p></div>}
            {checkResult === 'incorrect' && <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500 shrink-0" /><p className="text-xs text-red-700 dark:text-red-300"><strong>Not quite.</strong> P = IV = 230 × 10 = 2300 W</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
