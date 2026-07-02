import { useState } from 'react';
import { FlaskRound, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP10DerivationExpansionLiquids({ onExit }: { onExit?: () => void }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [gammaA, setGammaA] = useState(1.1e-4);
  const [gammaG, setGammaG] = useState(3.6e-5);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const gammaR = gammaA + gammaG;

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - gammaR) < gammaR * 0.1 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: 'Real vs Apparent Expansion', formula: 'Real Expansion = Apparent Expansion + Flask Expansion', detail: 'When a liquid is heated in a glass flask, we only see apparent expansion. The flask itself also expands, hiding some of the liquid\'s true expansion.' },
    { label: 'Define Coefficients', formula: '\u03B3_r = \u03B3_a + \u03B3_g', detail: '\u03B3_r is the real expansion coefficient of the liquid. \u03B3_a is what we observe. \u03B3_g is the glass flask expansion coefficient.' },
    { label: 'Physical Meaning', formula: '\u03B3_r > \u03B3_a', detail: 'The real expansion is always greater than apparent expansion because the container expands too, making room for the liquid.' },
    { label: 'Why It Matters', formula: '\u03B3_a = \u03B3_r \u2212 \u03B3_g', detail: 'To find true liquid expansion, subtract the container expansion from what you measure. Mercury thermometers account for this!' },
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title="Derivation: Real vs Apparent Expansion of Liquids" />
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-teal-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Derivation</button>
        <button onClick={() => setActiveMobileTab('lab')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-teal-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Simulation</button>
      </div>
      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg"><FlaskRound className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold">Step-by-Step Derivation</h2><p className="text-xs text-slate-500">Understanding why \u03B3_r = \u03B3_a + \u03B3_g</p></div>
          </div>
          <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-teal-200 font-semibold uppercase tracking-wider">Core Relation</p>
            <p className="text-2xl font-bold font-mono text-white mt-1">\u03B3_r = \u03B3_a + \u03B3_g</p>
            <p className="text-xs text-teal-200 mt-1">Real = Apparent + Glass expansion coefficients</p>
          </div>
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
                    {idx < steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-teal-400 to-teal-200" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3 border border-teal-200 dark:border-teal-800 mb-1"><p className="font-bold text-base text-teal-800 dark:text-teal-300">{step.label}</p></div>
                    <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]"><span className="text-base font-mono font-bold text-yellow-400">{step.formula}</span></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>
                    {idx < steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-teal-400" /></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div><p className="font-bold text-base text-amber-700 dark:text-amber-300">{'\uD83D\uDCA1'} Key Insight</p><p className="text-sm text-amber-700 dark:text-amber-300 mt-1">This is why liquid-in-glass thermometers work! The liquid (\u03B3_r large) expands more than glass (\u03B3_g small), so the apparent rise (\u03B3_a) is positive and observable.</p></div>
            </div>
          </div>
        </div>
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-teal-500" /><h2 className="text-lg font-bold">See the Relation in Action</h2></div>
            <p className="text-sm text-slate-500 mb-4">Adjust expansion coefficients to see the real vs apparent relationship.</p>
            <div className="space-y-3">
              <div><div className="flex justify-between text-xs font-semibold"><span>Apparent Coeff (\u03B3_a)</span><span className="text-teal-600 font-mono">{gammaA.toExponential(2)}</span></div><input type="range" min="0.5e-4" max="2e-4" step="0.1e-4" value={gammaA} onChange={e => { setGammaA(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-teal-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>Glass Coeff (\u03B3_g)</span><span className="text-teal-600 font-mono">{gammaG.toExponential(2)}</span></div><input type="range" min="1e-5" max="5e-5" step="0.1e-5" value={gammaG} onChange={e => { setGammaG(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-teal-500" /></div>
              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase">Derivation Trace</p>
                <p className="text-sm text-slate-400">\u03B3_r = {gammaA.toExponential(2)} + {gammaG.toExponential(2)}</p>
                <p className="border-t border-[#2a2a2a] pt-1 text-xs"><span className="text-green-400 font-bold">\u03B3_r = </span><span className="text-yellow-400 font-mono font-bold">{gammaR.toExponential(2)}/\u00B0C</span></p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><FlaskRound className="w-5 h-5 text-emerald-500" /> Practice: Apply the Derivation</h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">A liquid\'s apparent expansion in a glass flask is \u03B3_a = 1.2\u00D710\u207B\u2074/\u00B0C. The glass expansion is \u03B3_g = 2.5\u00D710\u207B\u2075/\u00B0C.</p>
              <p className="text-base font-medium">Find the real expansion coefficient \u03B3_r.</p>
              <div className="bg-teal-50 dark:bg-teal-900/20 rounded p-2 mt-2"><p className="text-xs text-teal-700 dark:text-teal-300 font-mono">\u03B3_r = 1.2\u00D710\u207B\u2074 + 2.5\u00D710\u207B\u2075 = ?</p></div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder="\u03B3_r (scientific notation)..." className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-teal-500 outline-none" />
              <button onClick={checkAnswer} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors">Check</button>
            </div>
            {checkResult === 'correct' && <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>Correct! 1.45\u00D710\u207B\u2074/\u00B0C.</strong> The real expansion is always larger than apparent due to the glass expansion.</p></div>}
            {checkResult === 'incorrect' && <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500 shrink-0" /><p className="text-xs text-red-700 dark:text-red-300"><strong>Not quite.</strong> \u03B3_r = \u03B3_a + \u03B3_g = (1.2 + 0.25)\u00D710\u207B\u2074 = 1.45\u00D710\u207B\u2074/\u00B0C</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
