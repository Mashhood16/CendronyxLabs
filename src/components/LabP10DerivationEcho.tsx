import { useState } from 'react';
import { Ear, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

export default function LabP10DerivationEcho({ onExit }: { onExit?: () => void }) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [v, setV] = useState(1500);
  const [t, setT] = useState(0.1);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const d = (v * t) / 2;

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - d) < d * 0.1 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: 'Basic Speed Formula', formula: 'v = D / t', detail: 'You\'re a sonar operator on a research ship mapping the ocean floor. You send a powerful ping into the deep. Speed = distance over time — the sound pulse travels through water at 1500 m/s, searching for the bottom.' },
    { label: 'Distance is Double (There and Back)', formula: 'D = 2d', detail: 'The ping hits the ocean floor and reflects back up. The total journey is there AND back: D = 2d. Your sound travels twice the target distance. You wait, listening for the echo...' },
    { label: 'Substitute D', formula: 'v = 2d / t', detail: 'Your equipment measures exactly 0.4 seconds between sending the ping and receiving the echo. v = 2d/t means 1500 = 2d/0.4. The sound traveled 600 m total.' },
    { label: 'Solve for Distance', formula: 'd = v × t / 2', detail: 'd = v x t / 2 = 1500 x 0.4 / 2 = 300 m. Divide by 2 because the sound went down AND back up! This same formula maps the ocean floor, detects submarines, and creates ultrasound images of babies in the womb.' }
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title="Derivation: Depth via Echo (Ultrasound)" />
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-sky-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Derivation</button>
        <button onClick={() => setActiveMobileTab('lab')} className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-sky-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>Simulation</button>
      </div>
      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg"><Ear className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-lg font-bold">Step-by-Step Derivation</h2><p className="text-xs text-slate-500">Deriving the ultrasound depth formula from basic speed</p></div>
          </div>
          <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-sky-200 font-semibold uppercase tracking-wider">Final Formula</p>
            <p className="text-2xl font-bold font-mono text-white mt-1">d = v × t / 2</p>
            <p className="text-xs text-sky-200 mt-1">Depth = (Speed × Time) / 2 — used in sonar & ultrasound</p>
          </div>
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
                    {idx < steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-sky-400 to-sky-200" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-3 border border-sky-200 dark:border-sky-800 mb-1"><p className="font-bold text-base text-sky-800 dark:text-sky-300">{step.label}</p></div>
                    <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]"><span className="text-base font-mono font-bold text-yellow-400">{step.formula}</span></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>
                    {idx < steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-sky-400" /></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div><p className="font-bold text-base text-amber-700 dark:text-amber-300">{'💡'} Key Insight</p><p className="text-sm text-amber-700 dark:text-amber-300 mt-1">In medical ultrasound, the same formula measures the depth of organs! Sound speed in tissue ~1540 m/s. A 0.0001 s echo return means the boundary is only ~7.7 cm deep.</p></div>
            </div>
          </div>
        </div>
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-sky-500" /><h2 className="text-lg font-bold">See the Derivation in Action</h2></div>
            <p className="text-sm text-slate-500 mb-4">Adjust speed and time to see how depth is calculated.</p>
            <div className="space-y-3">
              <div><div className="flex justify-between text-xs font-semibold"><span>Sound Speed (v)</span><span className="text-sky-600 font-mono">{v} m/s</span></div><input type="range" min="340" max="1500" step="10" value={v} onChange={e => { setV(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-sky-500" /></div>
              <div><div className="flex justify-between text-xs font-semibold"><span>Echo Time (t)</span><span className="text-sky-600 font-mono">{t} s</span></div><input type="range" min="0.01" max="1" step="0.01" value={t} onChange={e => { setT(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-sky-500" /></div>
              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase">Derivation Trace</p>
                <p className="text-sm text-slate-400">D = v×t = {v}×{t} = {(v*t).toFixed(0)} m</p>
                <p className="text-sm text-slate-400">d = D/2 = {(v*t).toFixed(0)}/2</p>
                <p className="border-t border-[#2a2a2a] pt-1 text-xs"><span className="text-green-400 font-bold">d = </span><span className="text-yellow-400 font-mono font-bold">{d.toFixed(1)} m</span></p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Ear className="w-5 h-5 text-emerald-500" /> Practice: Apply the Derivation</h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">A ship sends a sonar pulse. The echo returns after <strong>0.4 s</strong>. Sound in water = <strong>1500 m/s</strong>.</p>
              <p className="text-base font-medium">Find the depth of the ocean floor.</p>
              <div className="bg-sky-50 dark:bg-sky-900/20 rounded p-2 mt-2"><p className="text-xs text-sky-700 dark:text-sky-300 font-mono">d = 1500 × 0.4 / 2 = ?</p></div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder="Depth in meters..." className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-sky-500 outline-none" />
              <button onClick={checkAnswer} className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors">Check</button>
            </div>
            {checkResult === 'correct' && <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /><p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>Correct! 300 m.</strong> The total distance traveled is 600 m (there and back), so the ocean floor is 300 m deep.</p></div>}
            {checkResult === 'incorrect' && <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500 shrink-0" /><p className="text-xs text-red-700 dark:text-red-300"><strong>Not quite.</strong> Remember to divide by 2! d = v×t/2 = 1500×0.4/2</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
