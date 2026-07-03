import { useState } from 'react';
import { Split, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP10DerivationPotentialDivider({ onExit }: { onExit?: () => void }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [vin, setVin] = useState(12);
  const [r1, setR1] = useState(1000);
  const [r2, setR2] = useState(2000);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const vOut = (r2 / (r1 + r2)) * vin;

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - vOut) < vOut * 0.1 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: 'Current in Series Circuit', formula: 'I = V / (R₁ + R₂)', detail: 'For resistors R₁ and R₂ in series, the current I depends on the total resistance and applied voltage.' },
    { label: 'Voltage Drop Across R₂', formula: 'V₂ = I × R₂', detail: 'Using Ohm\'s law, the voltage across R₂ is the product of current and R₂.' },
    { label: 'Substitute Current', formula: 'V₂ = (V / (R₁+R₂)) × R₂', detail: 'Replace I with the expression from step 1. The voltage divides based on resistance values.' },
    { label: 'Potential Divider Formula', formula: 'V_out = R₂ / (R₁+R₂) × V_in', detail: 'This is the potential divider formula. You can select R₁ and R₂ to get any V_out from 0 to V_in. Used in sensors!' },
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title="Derivation: Potential Divider Formula" />
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-lime-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Derivation</button>
        <button onClick={() => setActiveMobileTab('lab')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-lime-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Simulation</button>
      </div>
      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-500 to-green-600 flex items-center justify-center shadow-lg"><Split className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold">Step-by-Step Derivation</h2><p className="text-xs text-slate-500">Deriving V_out = R₂/(R₁+R₂) × V_in</p></div>
          </div>
          <div className="bg-gradient-to-br from-lime-500 to-green-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-lime-200 font-semibold uppercase tracking-wider">Final Formula</p>
            <p className="text-xl font-bold font-mono text-white mt-1">V_out = R₂ / (R₁+R₂) × V_in</p>
            <p className="text-xs text-lime-200 mt-1">Output voltage depends on the ratio of resistances</p>
          </div>
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-lime-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
                    {idx < steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-lime-400 to-lime-200" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-lime-50 dark:bg-lime-900/20 rounded-lg p-3 border border-lime-200 dark:border-lime-800 mb-1"><p className="font-bold text-base text-lime-800 dark:text-lime-300">{step.label}</p></div>
                    <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]"><span className="text-base font-mono font-bold text-yellow-400">{step.formula}</span></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>
                    {idx < steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-lime-400" /></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div><p className="font-bold text-base text-amber-700 dark:text-amber-300">{'💡'} Key Insight</p><p className="text-sm text-amber-700 dark:text-amber-300 mt-1">Potentiometers (variable resistors) use this! Turning the knob changes R₂, giving a variable V_out. Used in dimmer switches, volume controls, and light sensors (LDR + resistor)!</p></div>
            </div>
          </div>
        </div>
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-lime-500" /><h2 className="text-lg font-bold">See the Derivation in Action</h2></div>
            <p className="text-sm text-slate-500 mb-4">Adjust resistors to see how voltage divides.</p>
            <div className="space-y-3">
              <div><div className="flex justify-between text-xs font-semibold"><span>Input Voltage (V_in)</span><span className="text-lime-600 font-mono">{vin} V</span></div><input type="range" min="3" max="24" step="1" value={vin} onChange={e => { setVin(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-lime-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>R₁</span><span className="text-lime-600 font-mono">{r1} Ω</span></div><input type="range" min="100" max="10000" step="100" value={r1} onChange={e => { setR1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-lime-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>R₂ (output across)</span><span className="text-lime-600 font-mono">{r2} Ω</span></div><input type="range" min="100" max="10000" step="100" value={r2} onChange={e => { setR2(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-lime-500" /></div>
              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase">Derivation Trace</p>
                <p className="text-sm text-slate-400">I = {vin}/({r1}+{r2}) = {(vin/(r1+r2)*1000).toFixed(2)} mA</p>
                <p className="text-sm text-slate-400">V_out = {(vin/(r1+r2)*1000).toFixed(2)}mA×{r2}</p>
                <p className="border-t border-[#2a2a2a] pt-1 text-xs"><span className="text-green-400 font-bold">V_out = </span><span className="text-yellow-400 font-mono font-bold">{vOut.toFixed(2)} V</span></p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Split className="w-5 h-5 text-emerald-500" /> Practice: Apply the Derivation</h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">A 9V battery is used with <strong>R₁ = 1kΩ, R₂ = 500Ω</strong>.</p>
              <p className="text-base font-medium">What is V_out across R₂?</p>
              <div className="bg-lime-50 dark:bg-lime-900/20 rounded p-2 mt-2"><p className="text-xs text-lime-700 dark:text-lime-300 font-mono">V_out = 500 / (1000+500) × 9 = ?</p></div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder="V_out (V)..." className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-lime-500 outline-none" />
              <button onClick={checkAnswer} className="px-4 py-2 bg-lime-600 hover:bg-lime-700 text-white text-sm font-semibold rounded-lg transition-colors">Check</button>
            </div>
            {checkResult === 'correct' && <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>Correct! 3V.</strong> The ratio R₂/(R₁+R₂) = 500/1500 = 1/3, giving V_out = 9/3 = 3V.</p></div>}
            {checkResult === 'incorrect' && <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500 shrink-0" /><p className="text-xs text-red-700 dark:text-red-300"><strong>Not quite.</strong> V_out = R₂/(R₁+R₂)×V_in = 500/1500×9 = 3V</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
