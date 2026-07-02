import { useState } from 'react';
import { Sun, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP10DerivationPhotonEnergy({ onExit }: { onExit?: () => void }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [freq, setFreq] = useState(5e14);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const h = 6.626e-34;
  const c = 3e8;
  const energy = h * freq;
  const lambda = c / freq;

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - energy) < energy * 0.1 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: "Planck's Equation", formula: 'E = hf', detail: 'Max Planck discovered that energy is quantized. The energy of a photon equals Planck\'s constant h times its frequency f.' },
    { label: 'Wave Equation for Light', formula: 'c = f\u03BB \u21D2 f = c/\u03BB', detail: 'For light, speed c = f\u03BB. Rearranging gives f = c/\u03BB, which relates frequency to wavelength.' },
    { label: 'Substitute f', formula: 'E = hc / \u03BB', detail: 'Replace f with c/\u03BB in Planck\'s equation. Energy is inversely proportional to wavelength \u2014 shorter wavelength = higher energy!' },
    { label: 'Photon Momentum', formula: 'p = h / \u03BB = hf / c', detail: 'Light has momentum too! p = h/\u03BB (from de Broglie). This is why light can push solar sails in space.' },
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title="Derivation: Photon Energy & Momentum" />
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-yellow-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Derivation</button>
        <button onClick={() => setActiveMobileTab('lab')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-yellow-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Simulation</button>
      </div>
      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg"><Sun className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold">Step-by-Step Derivation</h2><p className="text-xs text-slate-500">Deriving E = hf = hc/\u03BB and p = h/\u03BB</p></div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-yellow-200 font-semibold uppercase tracking-wider">Key Formulas</p>
            <p className="text-base font-bold font-mono text-white mt-1">E = hf = hc/\u03BB, p = h/\u03BB</p>
            <p className="text-xs text-yellow-200 mt-1">Photon energy and momentum from Planck and de Broglie</p>
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
              <div><p className="font-bold text-base text-amber-700 dark:text-amber-300">{'\uD83D\uDCA1'} Key Insight</p><p className="text-sm text-amber-700 dark:text-amber-300 mt-1">This explains why UV light (short \u03BB) causes sunburn but visible light doesn\'t. E = hc/\u03BB: UV photons have enough energy to damage DNA, while visible photons don\'t!</p></div>
            </div>
          </div>
        </div>
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-yellow-500" /><h2 className="text-lg font-bold">See the Derivation in Action</h2></div>
            <p className="text-sm text-slate-500 mb-4">Adjust frequency to see photon energy and momentum.</p>
            <div className="space-y-3">
              <div><div className="flex justify-between text-xs font-semibold"><span>Frequency (f)</span><span className="text-yellow-600 font-mono">{freq.toExponential(2)} Hz</span></div><input type="range" min="1e14" max="1e15" step="1e13" value={freq} onChange={e => { setFreq(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-yellow-500" /></div>
              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase">Derivation Trace</p>
                <p className="text-sm text-slate-400">\u03BB = c/f = 3e8/{freq.toExponential(2)} = {lambda.toExponential(3)} m</p>
                <p className="text-sm text-slate-400">E = hf = {h.toExponential(3)}\u00D7{freq.toExponential(2)}</p>
                <p className="text-sm text-slate-400">E = hc/\u03BB = {h.toExponential(3)}\u00D7{3e8}/{lambda.toExponential(3)}</p>
                <p className="text-sm text-slate-400">p = h/\u03BB = {h.toExponential(3)}/{lambda.toExponential(3)}</p>
                <p className="border-t border-[#2a2a2a] pt-1 text-xs"><span className="text-green-400 font-bold">E = </span><span className="text-yellow-400 font-mono font-bold">{energy.toExponential(3)} J</span></p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Sun className="w-5 h-5 text-emerald-500" /> Practice: Apply the Derivation</h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">Green light has <strong>f = 5.45\u00D710\u00B9\u2074 Hz</strong>. h = 6.63\u00D710\u207B\u00B3\u2074.</p>
              <p className="text-base font-medium">Find the photon energy.</p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded p-2 mt-2"><p className="text-xs text-yellow-700 dark:text-yellow-300 font-mono">E = 6.63\u00D710\u207B\u00B3\u2074 \u00D7 5.45\u00D710\u00B9\u2074 = ?</p></div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder="Energy in Joules..." className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-yellow-500 outline-none" />
              <button onClick={checkAnswer} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-colors">Check</button>
            </div>
            {checkResult === 'correct' && <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>Correct! 3.61\u00D710\u207B\u00B9\u2079 J.</strong> In electronvolts: E = 2.25 eV. Photon energy is incredibly tiny at human scale!</p></div>}
            {checkResult === 'incorrect' && <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500 shrink-0" /><p className="text-xs text-red-700 dark:text-red-300"><strong>Not quite.</strong> E = hf = 6.63\u00D710\u207B\u00B3\u2074 \u00D7 5.45\u00D710\u00B9\u2074 = 3.61\u00D710\u207B\u00B9\u2079 J</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
