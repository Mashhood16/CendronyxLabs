import { useState } from 'react';
import { Zap, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP10DerivationSpecificHeatElectrical({ onExit }: { onExit?: () => void }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [v, setV] = useState(12);
  const [i, setI] = useState(2);
  const [t, setT] = useState(120);
  const [ml, setMl] = useState(0.5);
  const [ti, setTi] = useState(25);
  const [tf, setTf] = useState(50);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const cc = 900, mc = 0.1;
  const qHeater = v * i * t;
  const cl = (qHeater - mc * cc * (tf - ti)) / (ml * (tf - ti));

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - cl) < cl * 0.1 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: 'Energy Supplied by Heater', formula: 'Q_heater = V × I × t', detail: 'You fill an electric kettle with water and switch it on. The heating element converts electrical energy into heat: Q-heater = V x I x t. A 230V 10A kettle running for 120 seconds delivers 276,000 J of energy.' },
    { label: 'Heat Gained by Liquid + Calorimeter', formula: 'Q_heater = m_l c_l ΔT + m_c c_c ΔT', detail: 'The heat warms both the water AND the metal calorimeter: Q-heater = m-liquid x c-liquid x Delta-T + m-cup x c-cup x Delta-T. Some heat is stolen by the container — we must account for it.' },
    { label: 'Final Formula', formula: 'c_l = (VIt - m_c c_c (T_f - T_i)) / (m_l (T_f - T_i))', detail: 'Rearrange to find specific heat of water: c-liquid = (Q-heater - m-cup x c-cup x Delta-T) / (m-liquid x Delta-T). Subtract the calorimeter share, then divide by water mass and temperature rise.' }
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title="Derivation: Specific Heat (Electrical Method)" />
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-violet-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Derivation</button>
        <button onClick={() => setActiveMobileTab('lab')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-violet-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Simulation</button>
      </div>
      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg"><Zap className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold">Step-by-Step Derivation</h2><p className="text-xs text-slate-500">Deriving c_l using electrical heating and calorimetry</p></div>
          </div>
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-violet-200 font-semibold uppercase tracking-wider">Final Formula</p>
            <p className="text-lg font-bold font-mono text-white mt-1">c_l = (VIt - m_c c_c (T_f - T_i)) / (m_l (T_f - T_i))</p>
            <p className="text-xs text-violet-200 mt-1">Specific heat of liquid from electrical heating</p>
          </div>
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
                    {idx < steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-violet-400 to-violet-200" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3 border border-violet-200 dark:border-violet-800 mb-1"><p className="font-bold text-base text-violet-800 dark:text-violet-300">{step.label}</p></div>
                    <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]"><span className="text-base font-mono font-bold text-yellow-400">{step.formula}</span></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>
                    {idx < steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-violet-400" /></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div><p className="font-bold text-base text-amber-700 dark:text-amber-300">{'💡'} Key Insight</p><p className="text-sm text-amber-700 dark:text-amber-300 mt-1">The electrical method is more accurate than the mixture method because you can precisely control the heat input. The calorimeter absorbs some heat, so its correction term m_c c_c ΔT is essential.</p></div>
            </div>
          </div>
        </div>
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-violet-500" /><h2 className="text-lg font-bold">See the Derivation in Action</h2></div>
            <p className="text-sm text-slate-500 mb-4">Adjust values to see electrical calorimetry determine specific heat.</p>
            <div className="space-y-3">
              <div><div className="flex justify-between text-xs font-semibold"><span>Voltage (V)</span><span className="text-violet-600 font-mono">{v} V</span></div><input type="range" min="6" max="24" step="1" value={v} onChange={e => { setV(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-violet-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>Current (I)</span><span className="text-violet-600 font-mono">{i} A</span></div><input type="range" min="0.5" max="5" step="0.5" value={i} onChange={e => { setI(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-violet-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>Heating Time (t)</span><span className="text-violet-600 font-mono">{t} s</span></div><input type="range" min="30" max="300" step="10" value={t} onChange={e => { setT(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-violet-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>Liquid Mass (m_l)</span><span className="text-violet-600 font-mono">{ml} kg</span></div><input type="range" min="0.1" max="1" step="0.05" value={ml} onChange={e => { setMl(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-violet-500" /></div>
              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase">Derivation Trace</p>
                <p className="text-sm text-slate-400">Q_heater = {v}×{i}×{t} = {qHeater} J</p>
                <p className="text-sm text-slate-400">c_l = ({qHeater} - {mc}×{cc}×({tf}-{ti})) / ({ml}×({tf}-{ti}))</p>
                <p className="border-t border-[#2a2a2a] pt-1 text-xs"><span className="text-green-400 font-bold">c_l = </span><span className="text-yellow-400 font-mono font-bold">{cl.toFixed(0)} J/kg·K</span></p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Zap className="w-5 h-5 text-emerald-500" /> Practice: Apply the Derivation</h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">A 12V, 3A heater runs for 150s in a calorimeter (m_c=0.08 kg, c_c=900 J/kg·K) containing 0.3 kg liquid. Temp rises from 22°C to 42°C.</p>
              <p className="text-base font-medium">Find the specific heat of the liquid.</p>
              <div className="bg-violet-50 dark:bg-violet-900/20 rounded p-2 mt-2"><p className="text-xs text-violet-700 dark:text-violet-300 font-mono">Q_heater = 12×3×150 = 5400 J. ΔT = 20. c_l = (5400 - 0.08×900×20) / (0.3×20)</p></div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder="c_l (J/kg·K)..." className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-violet-500 outline-none" />
              <button onClick={checkAnswer} className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors">Check</button>
            </div>
            {checkResult === 'correct' && <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>Correct! ~780 J/kg·K</strong> — typical for vegetable oils! Different liquids have unique specific heats.</p></div>}
            {checkResult === 'incorrect' && <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500 shrink-0" /><p className="text-xs text-red-700 dark:text-red-300"><strong>Not quite.</strong> Use c_l = (VIt - m_c c_c (T_f - T_i)) / (m_l (T_f - T_i))</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
