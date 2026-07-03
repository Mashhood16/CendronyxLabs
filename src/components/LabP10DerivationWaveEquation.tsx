import { useState } from 'react';
import { Waves, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP10DerivationWaveEquation({ onExit }: { onExit?: () => void }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [freq, setFreq] = useState(2);
  const [wavelength, setWavelength] = useState(1.5);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const waveSpeed = freq * wavelength;

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - waveSpeed) < waveSpeed * 0.1 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: 'Wave Speed = Distance / Time', formula: 'v = Δd / Δt', detail: 'The basic definition of speed applies to waves too. Distance traveled divided by time taken.' },
    { label: 'One Wavelength in One Period', formula: 'v = λ / T', detail: 'In one complete cycle, a wave travels one wavelength λ in one time period T. Substitute these into the speed formula.' },
    { label: 'Frequency = 1 / Period', formula: 'f = 1 / T', detail: 'The frequency f is the reciprocal of the period. Higher frequency means shorter period — more waves per second.' },
    { label: 'Final Wave Equation', formula: 'v = f λ', detail: 'Substitute 1/T = f into v = λ/T to get v = fλ. This is the universal wave equation - it works for ALL waves!' },
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title="Derivation: Universal Wave Equation v = fλ" />
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-cyan-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Derivation</button>
        <button onClick={() => setActiveMobileTab('lab')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-cyan-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Simulation</button>
      </div>
      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg"><Waves className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold">Step-by-Step Derivation</h2><p className="text-xs text-slate-500">Deriving the universal wave equation from basic speed formula</p></div>
          </div>
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-cyan-200 font-semibold uppercase tracking-wider">Final Formula</p>
            <p className="text-2xl font-bold font-mono text-white mt-1">v = f × λ</p>
            <p className="text-xs text-cyan-200 mt-1">Speed = Frequency × Wavelength — universal for all waves</p>
          </div>
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
                    {idx < steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-cyan-400 to-cyan-200" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-3 border border-cyan-200 dark:border-cyan-800 mb-1"><p className="font-bold text-base text-cyan-800 dark:text-cyan-300">{step.label}</p></div>
                    <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]"><span className="text-base font-mono font-bold text-yellow-400">{step.formula}</span></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>
                    {idx < steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-cyan-400" /></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div><p className="font-bold text-base text-amber-700 dark:text-amber-300">{'💡'} Key Insight</p><p className="text-sm text-amber-700 dark:text-amber-300 mt-1">This equation works for ALL waves: sound, light, water, and seismic waves. For light in vacuum, v = c = 3×10⁸ m/s, giving the famous c = fλ relation.</p></div>
            </div>
          </div>
        </div>
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-cyan-500" /><h2 className="text-lg font-bold">See the Derivation in Action</h2></div>
            <p className="text-sm text-slate-500 mb-4">Adjust frequency and wavelength to see wave speed.</p>
            <div className="space-y-3">
              <div><div className="flex justify-between text-xs font-semibold"><span>Frequency (f)</span><span className="text-cyan-600 font-mono">{freq} Hz</span></div><input type="range" min="0.5" max="10" step="0.5" value={freq} onChange={e => { setFreq(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-cyan-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>Wavelength (λ)</span><span className="text-cyan-600 font-mono">{wavelength} m</span></div><input type="range" min="0.1" max="5" step="0.1" value={wavelength} onChange={e => { setWavelength(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-cyan-500" /></div>
              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase">Derivation Trace</p>
                <p className="text-sm text-slate-400">Step 1: v = d/t</p>
                <p className="text-sm text-slate-400">Step 2: v = λ/T = {wavelength}/({1/freq})</p>
                <p className="text-sm text-slate-400">Step 3: v = fλ = {freq}×{wavelength}</p>
                <p className="border-t border-[#2a2a2a] pt-1 text-xs"><span className="text-green-400 font-bold">v = </span><span className="text-yellow-400 font-mono font-bold">{waveSpeed.toFixed(1)} m/s</span></p>
              </div>
              <div className="relative h-16 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
                <svg className="w-full h-full" viewBox="0 0 200 60">
                  <path d={`M 0 30 Q ${25 / freq} 5 ${50 / freq} 30 T ${100 / freq} 30 T ${150 / freq} 30 T ${200 / freq} 30`} fill="none" stroke="#06b6d4" strokeWidth="2" />
                </svg>
                <span className="absolute bottom-1 right-2 text-[8px] text-slate-400 font-mono">{'λ'}={wavelength}m</span>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Waves className="w-5 h-5 text-emerald-500" /> Practice: Apply the Derivation</h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">A sound wave has <strong>f = 440 Hz</strong> (middle A) and <strong>λ = 0.78 m</strong>.</p>
              <p className="text-base font-medium">Find the speed of sound.</p>
              <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded p-2 mt-2"><p className="text-xs text-cyan-700 dark:text-cyan-300 font-mono">v = 440 × 0.78 = ?</p></div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder="Speed in m/s..." className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-cyan-500 outline-none" />
              <button onClick={checkAnswer} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg transition-colors">Check</button>
            </div>
            {checkResult === 'correct' && <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>Correct! ~343 m/s.</strong> That\'s the speed of sound in air at 20°C — confirmed by the wave equation!</p></div>}
            {checkResult === 'incorrect' && <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500 shrink-0" /><p className="text-xs text-red-700 dark:text-red-300"><strong>Not quite.</strong> v = f × λ = 440 × 0.78 = ?</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
