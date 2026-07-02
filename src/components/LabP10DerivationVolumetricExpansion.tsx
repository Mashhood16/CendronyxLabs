import { useState } from 'react';
import { Box, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP10DerivationVolumetricExpansion({ onExit }: { onExit?: () => void }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [vo, setVo] = useState(1);
  const [dt, setDt] = useState(50);
  const [betaInput, setBetaInput] = useState(3.6e-5);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const dV = betaInput * vo * dt;

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - dV) < dV * 0.1 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: 'Volume Change is Proportional', formula: '\u0394V \u221D V_o \u00D7 \u0394T', detail: 'The change in volume of a solid or liquid is directly proportional to its original volume and temperature change.' },
    { label: 'Insert Proportionality Constant', formula: '\u0394V = \u03B2 V_o \u0394T', detail: 'The constant \u03B2 is the coefficient of volumetric thermal expansion. For isotropic solids, \u03B2 \u2248 3\u03B1.' },
    { label: 'Rearrange for \u03B2', formula: '\u03B2 = \u0394V / (V_o \u0394T)', detail: 'This gives volumetric expansion coefficient. Units: 1/\u00B0C. Used for liquids, gases, and solids.' },
    { label: 'Relation between \u03B2 and \u03B1', formula: '\u03B2 = 3\u03B1', detail: 'For isotropic solids, volumetric expansion is approximately three times linear expansion. Volume depends on length in three dimensions!' },
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title="Derivation: Volumetric Thermal Expansion" />
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-rose-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Derivation</button>
        <button onClick={() => setActiveMobileTab('lab')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-rose-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Simulation</button>
      </div>
      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg"><Box className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold">Step-by-Step Derivation</h2><p className="text-xs text-slate-500">Deriving \u03B2 the coefficient of volumetric expansion</p></div>
          </div>
          <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-rose-200 font-semibold uppercase tracking-wider">Final Formula</p>
            <p className="text-2xl font-bold font-mono text-white mt-1">\u03B2 = \u0394V / (V\u2080 \u0394T)</p>
            <p className="text-xs text-rose-200 mt-1">Coefficient of volumetric thermal expansion</p>
          </div>
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
                    {idx < steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-rose-400 to-rose-200" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-3 border border-rose-200 dark:border-rose-800 mb-1"><p className="font-bold text-base text-rose-800 dark:text-rose-300">{step.label}</p></div>
                    <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]"><span className="text-base font-mono font-bold text-yellow-400">{step.formula}</span></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>
                    {idx < steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-rose-400" /></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div><p className="font-bold text-base text-amber-700 dark:text-amber-300">{'\uD83D\uDCA1'} Key Insight</p><p className="text-sm text-amber-700 dark:text-amber-300 mt-1">For isotropic solids, \u03B2 = 3\u03B1. Why? Volume = L\u00B3. If L expands by \u03B1\u0394T, then V expands by approximately 3\u03B1\u0394T. This is why liquid thermometers work!</p></div>
            </div>
          </div>
        </div>
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-rose-500" /><h2 className="text-lg font-bold">See the Derivation in Action</h2></div>
            <p className="text-sm text-slate-500 mb-4">Adjust values to see volume expansion.</p>
            <div className="space-y-3">
              <div><div className="flex justify-between text-xs font-semibold"><span>Original Volume (V_o)</span><span className="text-rose-600 font-mono">{vo} m\u00B3</span></div><input type="range" min="0.1" max="2" step="0.05" value={vo} onChange={e => { setVo(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>Temp Change (\u0394T)</span><span className="text-rose-600 font-mono">{dt}\u00B0C</span></div><input type="range" min="10" max="200" step="5" value={dt} onChange={e => { setDt(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>Expansion Coeff (\u03B2)</span><span className="text-rose-600 font-mono">{betaInput.toExponential(1)}/\u00B0C</span></div><input type="range" min="1e-5" max="1e-4" step="0.1e-5" value={betaInput} onChange={e => { setBetaInput(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" /></div>
              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase">Derivation Trace</p>
                <p className="text-sm text-slate-400">\u0394V = {betaInput.toExponential(1)}\u00D7{vo}\u00D7{dt}</p>
                <p className="border-t border-[#2a2a2a] pt-1 text-xs"><span className="text-green-400 font-bold">\u0394V = </span><span className="text-yellow-400 font-mono font-bold">{(dV*1000).toFixed(2)} cm\u00B3</span></p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Box className="w-5 h-5 text-emerald-500" /> Practice: Apply the Derivation</h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">A <strong>0.5 m\u00B3</strong> alcohol tank at 10\u00B0C heats to 30\u00B0C. \u03B2_alcohol = 1.1\u00D710\u207B\u00B3/\u00B0C.</p>
              <p className="text-base font-medium">Find the volume expansion \u0394V.</p>
              <div className="bg-rose-50 dark:bg-rose-900/20 rounded p-2 mt-2"><p className="text-xs text-rose-700 dark:text-rose-300 font-mono">\u0394V = 1.1\u00D710\u207B\u00B3 \u00D7 0.5 \u00D7 (30-10) = ?</p></div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder="\u0394V in m\u00B3..." className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-rose-500 outline-none" />
              <button onClick={checkAnswer} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition-colors">Check</button>
            </div>
            {checkResult === 'correct' && <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>Correct! 0.011 m\u00B3 (11 L).</strong> Liquids expand more than solids \u2014 this is why thermometers use liquids!</p></div>}
            {checkResult === 'incorrect' && <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500 shrink-0" /><p className="text-xs text-red-700 dark:text-red-300"><strong>Not quite.</strong> Use \u0394V = \u03B2 \u00D7 V_o \u00D7 \u0394T. \u0394T = 30 - 10 = 20\u00B0C.</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
