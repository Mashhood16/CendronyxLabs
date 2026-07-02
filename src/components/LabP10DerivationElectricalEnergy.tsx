import { useState } from 'react';
import { Battery, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP10DerivationElectricalEnergy({ onExit }: { onExit?: () => void }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [v, setV] = useState(12);
  const [i, setI] = useState(2);
  const [t, setT] = useState(60);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const e1 = v * i * t;
  const e2 = i * i * (v / i) * t;
  const e3 = (v * v) / (v / i) * t;

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - e1) < e1 * 0.1 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: 'Energy from Voltage and Charge', formula: 'E = qV', detail: 'Potential difference V = W/q = E/q. So energy E = qV. Voltage tells us energy per unit charge.' },
    { label: 'Charge = Current \u00D7 Time', formula: 'E = I t V', detail: 'Charge q = current \u00D7 time. Substitute q = It into E = qV. This gives E = IVt, the basic electrical energy formula.' },
    { label: 'Using Ohm\'s Law V = IR', formula: 'E = I\u00B2 R t', detail: 'Substitute V = IR into E = IVt to get E = I\u00B2Rt. Useful when you know current and resistance.' },
    { label: 'Using Ohm\'s Law I = V/R', formula: 'E = V\u00B2 t / R', detail: 'Substitute I = V/R into E = IVt to get E = V\u00B2t/R. Useful when you know voltage and resistance.' },
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title="Derivation: Electrical Energy" />
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Derivation</button>
        <button onClick={() => setActiveMobileTab('lab')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Simulation</button>
      </div>
      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg"><Battery className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold">Step-by-Step Derivation</h2><p className="text-xs text-slate-500">Deriving E = IVt = I\u00B2Rt = V\u00B2t/R</p></div>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-indigo-200 font-semibold uppercase tracking-wider">Three Equivalent Formulas</p>
            <p className="text-base font-bold font-mono text-white mt-1">E = IVt = I\u00B2Rt = V\u00B2t/R</p>
            <p className="text-xs text-indigo-200 mt-1">Choose the form with the quantities you know</p>
          </div>
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
                    {idx < steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-indigo-400 to-indigo-200" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800 mb-1"><p className="font-bold text-base text-indigo-800 dark:text-indigo-300">{step.label}</p></div>
                    <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]"><span className="text-base font-mono font-bold text-yellow-400">{step.formula}</span></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>
                    {idx < steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-indigo-400" /></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div><p className="font-bold text-base text-amber-700 dark:text-amber-300">{'\uD83D\uDCA1'} Key Insight</p><p className="text-sm text-amber-700 dark:text-amber-300 mt-1">Your electricity bill charges for energy in kWh. 1 kWh = 3.6\u00D710\u2076 J. A 100W bulb running 10 hours uses 1 kWh of energy. Energy companies use E = Pt (power \u00D7 time)!</p></div>
            </div>
          </div>
        </div>
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-indigo-500" /><h2 className="text-lg font-bold">See the Derivation in Action</h2></div>
            <p className="text-sm text-slate-500 mb-4">Adjust values to see the three energy forms.</p>
            <div className="space-y-3">
              <div><div className="flex justify-between text-xs font-semibold"><span>Voltage (V)</span><span className="text-indigo-600 font-mono">{v} V</span></div><input type="range" min="3" max="240" step="1" value={v} onChange={e => { setV(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-indigo-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>Current (I)</span><span className="text-indigo-600 font-mono">{i} A</span></div><input type="range" min="0.1" max="10" step="0.1" value={i} onChange={e => { setI(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-indigo-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>Time (t)</span><span className="text-indigo-600 font-mono">{t} s</span></div><input type="range" min="10" max="300" step="10" value={t} onChange={e => { setT(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-indigo-500" /></div>
              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase">All Three Forms</p>
                <p className="text-sm text-slate-400">E = IVt = {v}\u00D7{i}\u00D7{t} = {e1} J</p>
                <p className="text-sm text-slate-400">E = I\u00B2Rt = {i}\u00B2\u00D7{(v/i).toFixed(1)}\u00D7{t} = {e1} J</p>
                <p className="text-sm text-slate-400">E = V\u00B2t/R = {v}\u00B2\u00D7{t}/{(v/i).toFixed(1)} = {e1} J</p>
                <p className="border-t border-[#2a2a2a] pt-1 text-xs"><span className="text-green-400 font-bold">E = </span><span className="text-yellow-400 font-mono font-bold">{e1} J</span></p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Battery className="w-5 h-5 text-emerald-500" /> Practice: Apply the Derivation</h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">A <strong>12V</strong> heater draws <strong>5A</strong> for <strong>2 minutes (120s)</strong>.</p>
              <p className="text-base font-medium">How much electrical energy is used?</p>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded p-2 mt-2"><p className="text-xs text-indigo-700 dark:text-indigo-300 font-mono">E = IVt = 12 \u00D7 5 \u00D7 120 = ?</p></div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder="Energy in Joules..." className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-indigo-500 outline-none" />
              <button onClick={checkAnswer} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors">Check</button>
            </div>
            {checkResult === 'correct' && <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>Correct! 7200 J.</strong> That\'s enough energy to heat a cup of coffee! In kWh: 7200/3.6\u00D710\u2076 = 0.002 kWh.</p></div>}
            {checkResult === 'incorrect' && <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500 shrink-0" /><p className="text-xs text-red-700 dark:text-red-300"><strong>Not quite.</strong> E = IVt = 12 \u00D7 5 \u00D7 120 = 7200 J</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
