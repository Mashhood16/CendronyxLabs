import { useState } from 'react';
import { Thermometer, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP10DerivationTempCoefficient({ onExit }: { onExit?: () => void }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [rho0, setRho0] = useState(1.68e-8);
  const [rhoT, setRhoT] = useState(2.0e-8);
  const [dt, setDt] = useState(50);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const alpha = (rhoT - rho0) / (rho0 * dt);

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - alpha) < alpha * 0.1 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: 'Resistivity Changes with Temperature', formula: 'ρᴵ − ρ₀ ∝ ρ₀ × ΔT', detail: 'The change in resistivity is directly proportional to the initial resistivity and the temperature change.' },
    { label: 'Insert Proportionality Constant', formula: 'ρᴵ − ρ₀ = α ρ₀ ΔT', detail: 'The constant α is the temperature coefficient of resistivity. Positive for metals, negative for semiconductors.' },
    { label: 'Rearrange for α', formula: 'α = (ρᴵ − ρ₀) / (ρ₀ ΔT)', detail: 'Temperature coefficient per °C. For copper α = 0.0039/°C meaning resistance increases 0.39% per °C.' },
    { label: 'Final Resistivity Formula', formula: 'ρᴵ = ρ₀ [1 + α(T − T₀)]', detail: 'This is the practical form. R(T) = R₀[1 + αΔT] for resistance. Used in RTD temperature sensors!' },
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title="Derivation: Temperature Coefficient of Resistivity" />
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-yellow-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Derivation</button>
        <button onClick={() => setActiveMobileTab('lab')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-yellow-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Simulation</button>
      </div>
      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg"><Thermometer className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold">Step-by-Step Derivation</h2><p className="text-xs text-slate-500">Deriving the temperature coefficient α of resistivity</p></div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-yellow-200 font-semibold uppercase tracking-wider">Final Formula</p>
            <p className="text-xl font-bold font-mono text-white mt-1">α = (ρₜ − ρ₀) / (ρ₀ ΔT)</p>
            <p className="text-xs text-yellow-200 mt-1">Temperature coefficient of resistivity (/°C)</p>
          </div>
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
                    {idx < steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-yellow-400 to-yellow-200" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800 mb-1"><p className="font-bold text-base text-yellow-800 dark:text-yellow-300">{step.label}</p></div>
                    <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]"><span className="text-base font-mono font-bold text-yellow-400">{step.formula}</span></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>
                    {idx < steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-yellow-400" /></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div><p className="font-bold text-base text-amber-700 dark:text-amber-300">{'💡'} Key Insight</p><p className="text-sm text-amber-700 dark:text-amber-300 mt-1">Metals have positive α (resistance increases with heat). Carbon and semiconductors have negative α (resistance decreases). This is used in thermistors for digital thermometers!</p></div>
            </div>
          </div>
        </div>
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-yellow-500" /><h2 className="text-lg font-bold">See the Derivation in Action</h2></div>
            <p className="text-sm text-slate-500 mb-4">Adjust values to find temperature coefficient.</p>
            <div className="space-y-3">
              <div><div className="flex justify-between text-xs font-semibold"><span>Initial Resistivity (ρ₀)</span><span className="text-yellow-600 font-mono">{rho0.toExponential(2)} Ω·m</span></div><input type="range" min="1e-8" max="1e-7" step="0.1e-8" value={rho0} onChange={e => { setRho0(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-yellow-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>Resistivity at T (ρₜ)</span><span className="text-yellow-600 font-mono">{rhoT.toExponential(2)} Ω·m</span></div><input type="range" min={rho0+0.1e-8} max="5e-7" step="0.1e-8" value={rhoT} onChange={e => { setRhoT(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-yellow-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>Temp Change (ΔT)</span><span className="text-yellow-600 font-mono">{dt}°C</span></div><input type="range" min="10" max="200" step="5" value={dt} onChange={e => { setDt(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-yellow-500" /></div>
              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase">Derivation Trace</p>
                <p className="text-sm text-slate-400">α = ({rhoT.toExponential(2)} - {rho0.toExponential(2)}) / ({rho0.toExponential(2)}×{dt})</p>
                <p className="border-t border-[#2a2a2a] pt-1 text-xs"><span className="text-green-400 font-bold">α = </span><span className="text-yellow-400 font-mono font-bold">{alpha.toExponential(4)} /°C</span></p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Thermometer className="w-5 h-5 text-emerald-500" /> Practice: Apply the Derivation</h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">Copper has ρ₀ = 1.68×10⁻⁸ at 20°C. At 70°C, ρₜ = 2.01×10⁻⁸.</p>
              <p className="text-base font-medium">Find the temperature coefficient α of copper.</p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded p-2 mt-2"><p className="text-xs text-yellow-700 dark:text-yellow-300 font-mono">α = (2.01-1.68)×10⁻⁸ / (1.68×10⁻⁸×50) = ?</p></div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder="α in /°C..." className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-yellow-500 outline-none" />
              <button onClick={checkAnswer} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-colors">Check</button>
            </div>
            {checkResult === 'correct' && <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>Correct! 0.0039/°C.</strong> This means copper resistance increases 0.39% per °C rise — important for power line calculations!</p></div>}
            {checkResult === 'incorrect' && <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500 shrink-0" /><p className="text-xs text-red-700 dark:text-red-300"><strong>Not quite.</strong> α = (ρₜ-ρ₀)/(ρ₀ΔT) = (0.33×10⁻⁸)/(1.68×10⁻⁸×50) = 0.0039/°C</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
