import { useState } from 'react';
import { ZoomIn, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP10DerivationMagnification({ onExit }: { onExit?: () => void }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [objH, setObjH] = useState(5);
  const [imgH, setImgH] = useState(15);
  const [objD, setObjD] = useState(10);
  const [imgD, setImgD] = useState(-30);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const m1 = imgH / objH;
  const m2 = imgD / objD;

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - m1) < m1 * 0.1 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: 'Magnification = Image / Object Height', formula: 'M = I / O', detail: 'Magnification is defined as the ratio of image height to object height. If M {'>'} 1, the image is enlarged.' },
    { label: 'From Ray Diagram Similar Triangles', formula: 'M = q / p', detail: 'Using similar triangles in ray diagrams, the same ratio equals image distance q divided by object distance p.' },
    { label: 'Combined Formula', formula: 'M = I / O = q / p', detail: 'So magnification can be found from heights OR distances. For a concave mirror, q is negative for real images.' },
    { label: 'Sign Convention Matters', formula: 'M = −q / p (mirrors)', detail: 'For mirrors, the Cartesian sign convention gives M = -q/p. Negative M means an inverted image.' },
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title="Derivation: Linear Magnification" />
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-green-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Derivation</button>
        <button onClick={() => setActiveMobileTab('lab')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-green-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Simulation</button>
      </div>
      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg"><ZoomIn className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold">Step-by-Step Derivation</h2><p className="text-xs text-slate-500">Deriving M = I/O = q/p from geometry</p></div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-green-200 font-semibold uppercase tracking-wider">Final Formula</p>
            <p className="text-2xl font-bold font-mono text-white mt-1">M = I / O = q / p</p>
            <p className="text-xs text-green-200 mt-1">Magnification = Image height / Object height = Image distance / Object distance</p>
          </div>
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
                    {idx < steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-green-400 to-green-200" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800 mb-1"><p className="font-bold text-base text-green-800 dark:text-green-300">{step.label}</p></div>
                    <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]"><span className="text-base font-mono font-bold text-yellow-400">{step.formula}</span></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>
                    {idx < steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-green-400" /></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div><p className="font-bold text-base text-amber-700 dark:text-amber-300">{'💡'} Key Insight</p><p className="text-sm text-amber-700 dark:text-amber-300 mt-1">Magnification M = -q/p for mirrors (using sign convention). Negative M = inverted image. |M| {'>'} 1 means enlarged. A microscope uses M = I/O with eyepiece and objective!</p></div>
            </div>
          </div>
        </div>
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-green-500" /><h2 className="text-lg font-bold">See the Derivation in Action</h2></div>
            <p className="text-sm text-slate-500 mb-4">Adjust values to see magnification from both methods.</p>
            <div className="space-y-3">
              <div><div className="flex justify-between text-xs font-semibold"><span>Object Height (O)</span><span className="text-green-600 font-mono">{objH} cm</span></div><input type="range" min="1" max="10" step="0.5" value={objH} onChange={e => { setObjH(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-green-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>Image Height (I)</span><span className="text-green-600 font-mono">{imgH} cm</span></div><input type="range" min="1" max="30" step="0.5" value={imgH} onChange={e => { setImgH(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-green-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>Object Distance (p)</span><span className="text-green-600 font-mono">{objD} cm</span></div><input type="range" min="5" max="30" step="1" value={objD} onChange={e => { setObjD(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-green-500" /></div>
              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase">Derivation Trace</p>
                <p className="text-sm text-slate-400">M = I/O = {imgH}/{objH} = {m1.toFixed(2)}</p>
                <p className="text-sm text-slate-400">M = q/p = {imgD}/{objD} = {m2.toFixed(2)}</p>
                <p className="border-t border-[#2a2a2a] pt-1 text-xs"><span className="text-green-400 font-bold">M = </span><span className="text-yellow-400 font-mono font-bold">{m1.toFixed(2)}×</span></p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><ZoomIn className="w-5 h-5 text-emerald-500" /> Practice: Apply the Derivation</h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">An object <strong>2 cm</strong> tall is placed <strong>15 cm</strong> from a concave mirror. Image forms <strong>30 cm</strong> in front.</p>
              <p className="text-base font-medium">Find the magnification and image height.</p>
              <div className="bg-green-50 dark:bg-green-900/20 rounded p-2 mt-2"><p className="text-xs text-green-700 dark:text-green-300 font-mono">M = -30/15 = -2. I = M×O = -2×2 = ?</p></div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder="Image height (cm)..." className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-green-500 outline-none" />
              <button onClick={checkAnswer} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors">Check</button>
            </div>
            {checkResult === 'correct' && <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>Correct! I = 4 cm (inverted).</strong> M = -2 means the image is twice as tall and inverted!</p></div>}
            {checkResult === 'incorrect' && <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500 shrink-0" /><p className="text-xs text-red-700 dark:text-red-300"><strong>Not quite.</strong> M = q/p = 30/15 = 2. Image height I = M×O = 2×2 = 4 cm (inverted).</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
