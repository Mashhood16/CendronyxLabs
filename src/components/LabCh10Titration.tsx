import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, RefreshCw, Play } from 'lucide-react';

interface LabProps {
  onExit?: () => void;
}

const TRUE_CONC_OPTIONS = [0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.14, 0.15];

export default function LabCh10Titration({ onExit }: LabProps) {
  const [trueHClConc] = useState(() => TRUE_CONC_OPTIONS[Math.floor(Math.random() * TRUE_CONC_OPTIONS.length)]);
  const [naohVolume] = useState(10.0); // fixed 10 cm3 NaOH in flask
  const [naohConc] = useState(0.1); // standard 0.1 mol/dm3
  const [isRunning, setIsRunning] = useState(false);
  const [buretteReading, setBuretteReading] = useState(0.0); // current volume dispensed
  const [initialReading, setInitialReading] = useState(0.0);
  const [flaskColor, setFlaskColor] = useState(1.0); // 1 = pink, 0 = colourless
  const [endpointReached, setEndpointReached] = useState(false);
  const [animTick, setAnimTick] = useState(0);
  const [trials, setTrials] = useState<{ id: number; initial: number; final: number; volume: number }[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });

  // True endpoint volume: M_base * V_base = M_acid * V_acid => V_acid = (naohConc * naohVolume) / trueHClConc
  const trueEndpointVol = (naohConc * naohVolume) / trueHClConc;

  // Noise: ±0.05 cm3
  const addNoise = (val: number) => parseFloat((val + (Math.random() - 0.5) * 0.1).toFixed(2));

  useEffect(() => {
    if (!isRunning || endpointReached) return;
    const speed = buretteReading < trueEndpointVol * 0.85 ? 0.25 : 0.05; // slow near endpoint
    const interval = setInterval(() => {
      setAnimTick(t => t + 1);
      setBuretteReading(prev => {
        const next = parseFloat((prev + speed).toFixed(2));
        const ratio = next / trueEndpointVol;
        // Color fades from pink to colourless as we approach endpoint
        setFlaskColor(Math.max(0, 1 - ratio * 1.05));
        if (ratio >= 1.0) {
          setEndpointReached(true);
          setIsRunning(false);
          return addNoise(trueEndpointVol);
        }
        return next;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [isRunning, endpointReached, buretteReading, trueEndpointVol]);

  const startTitration = () => {
    if (trials.length >= 5) return;
    setInitialReading(parseFloat(buretteReading.toFixed(2)));
    setEndpointReached(false);
    setFlaskColor(1.0);
    setIsRunning(true);
  };

  const recordTrial = () => {
    if (!endpointReached) return;
    const vol = parseFloat((buretteReading - initialReading).toFixed(2));
    setTrials(prev => [...prev, { id: prev.length + 1, initial: initialReading, final: parseFloat(buretteReading.toFixed(2)), volume: vol }]);
  };

  const resetBurette = () => {
    setBuretteReading(0.0); setInitialReading(0.0);
    setEndpointReached(false); setFlaskColor(1.0); setIsRunning(false);
  };

  const reset = () => {
    resetBurette(); setTrials([]); setUserAnswer(''); setFeedback({ type: '', message: '' });
  };

  const checkAnswer = () => {
    const val = parseFloat(userAnswer);
    if (isNaN(val)) { setFeedback({ type: 'error', message: 'Enter a valid number.' }); return; }
    if (Math.abs(val - trueHClConc) <= 0.005) {
      setFeedback({ type: 'success', message: `Correct! The HCl concentration is ${trueHClConc.toFixed(3)} mol/dm3.` });
    } else {
      setFeedback({ type: 'error', message: `Not quite. Use: M_acid = (M_base * V_base) / V_acid. Check your average volume.` });
    }
  };

  // Concordant check: trials within 0.1 cm3 of each other
  const concordantTrials = trials.length >= 2 ? trials.filter(t => Math.abs(t.volume - (trials.reduce((a, b) => a + b.volume, 0) / trials.length)) < 0.1) : [];
  const avgVolume = concordantTrials.length >= 2 ? concordantTrials.reduce((a, t) => a + t.volume, 0) / concordantTrials.length : (trials.length > 0 ? trials.reduce((a, t) => a + t.volume, 0) / trials.length : 0);

  // Graph: volume vs trial
  const graphW = 260; const graphH = 130;
  const padG = { l: 44, r: 10, t: 10, b: 36 };
  const maxVol = Math.max(15, trueEndpointVol * 1.5);
  const toGX = (i: number) => padG.l + ((i / Math.max(trials.length, 1)) * (graphW - padG.l - padG.r)) + 15;
  const toGY = (v: number) => graphH - padG.b - ((v / maxVol) * (graphH - padG.t - padG.b));

  // Burette SVG
  const buretteTotalH = 200; // px for 50 cm3
  const cmPerPx = 50 / buretteTotalH;
  const buretteFilledH = (buretteReading / 50) * buretteTotalH;
  const r_pink = Math.round(251 - flaskColor * 100);
  const g_col = Math.round(207 - flaskColor * 100);
  const b_flask = Math.round(232 - flaskColor * 130);
  const fColor = `rgb(${r_pink},${g_col},${b_flask})`;
  const dropVisible = isRunning && animTick % 3 === 0;

  // Tick marks every 5 cm3
  const buretteTicks = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-white border-b p-4 flex items-center justify-between sticky top-0 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4">
          {onExit && (<button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft className="w-5 h-5 text-slate-700" /></button>)}
          <div>
            <h1 className="text-xl font-bold text-slate-800">Acid-Base Titration</h1>
            <p className="text-sm text-slate-500">Standardise HCl against 0.1 mol/dm3 NaOH | Indicator: Phenolphthalein</p>
          </div>
        </div>
        <button onClick={reset} className="flex items-center gap-2 bg-slate-200 px-4 py-2 rounded-md hover:bg-slate-300 font-medium transition-colors text-slate-700"><RefreshCw className="w-4 h-4" /> Reset</button>
      </div>

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-7xl mx-auto w-full">
        {/* Column 1 */}
        <div className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col gap-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Theory</h2>
            <p className="text-sm text-slate-600 mb-3">In a titration, an acid of known concentration neutralises a base (or vice versa). At the equivalence point, moles of acid = moles of base:</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center font-mono font-bold text-blue-800 text-sm mb-3">M_acid x V_acid = M_base x V_base</div>
            <p className="text-sm text-slate-600 mb-2">Phenolphthalein is pink in alkali and colourless in acid. The endpoint is the first permanent colourless colour.</p>
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-2 text-xs text-rose-800">Perform at least 3 concordant titrations (within 0.1 cm3 of each other) for a reliable average.</div>
          </div>
          <div className="border-t pt-4">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Experiment Setup</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center bg-slate-50 border rounded-lg p-2">
                <span className="text-slate-600">Burette solution:</span>
                <span className="font-bold text-red-700">HCl (unknown conc.)</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 border rounded-lg p-2">
                <span className="text-slate-600">Flask solution:</span>
                <span className="font-bold text-blue-700">NaOH 0.1 mol/dm3</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 border rounded-lg p-2">
                <span className="text-slate-600">Volume NaOH:</span>
                <span className="font-bold text-blue-700">{naohVolume.toFixed(1)} cm3 (fixed)</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 border rounded-lg p-2">
                <span className="text-slate-600">Indicator:</span>
                <span className="font-bold text-pink-600">Phenolphthalein</span>
              </div>
            </div>
          </div>
          <div className="border-t pt-4">
            <h2 className="text-base font-bold text-slate-800 mb-3">Burette Status</h2>
            <div className="bg-slate-50 border rounded-lg p-3 text-sm font-mono space-y-1">
              <div className="flex justify-between"><span className="text-slate-500">Initial reading:</span><span className="font-bold">{initialReading.toFixed(2)} cm3</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Current reading:</span><span className="font-bold text-blue-700">{buretteReading.toFixed(2)} cm3</span></div>
              {endpointReached && <div className="flex justify-between text-green-700 font-bold"><span>Endpoint volume:</span><span>{(buretteReading - initialReading).toFixed(2)} cm3</span></div>}
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-2">
            <button onClick={startTitration} disabled={isRunning || endpointReached || trials.length >= 5} className="w-full py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
              <Play className="w-4 h-4" /> {isRunning ? 'Running...' : 'Run Titration'}
            </button>
            {endpointReached && (
              <button onClick={recordTrial} className="w-full py-2 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 transition-colors">Record This Trial</button>
            )}
            {endpointReached && (
              <button onClick={resetBurette} className="w-full py-2 rounded-lg font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors">Reset Burette for Next Trial</button>
            )}
          </div>
        </div>

        {/* Column 2 */}
        <div className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col items-center">
          <h2 className="text-lg font-bold text-slate-800 mb-1">Titration Apparatus</h2>
          <p className="text-xs text-slate-500 mb-3">HCl drips into pink NaOH solution until colourless</p>
          <svg width="300" height="400" viewBox="0 0 300 400" className="rounded-xl border bg-gradient-to-b from-sky-50 to-slate-100 overflow-visible">
            {/* Stand rod */}
            <rect x="240" y="10" width="8" height="340" rx="3" fill="#6b7280" />
            <rect x="150" y="340" width="100" height="12" rx="3" fill="#6b7280" />
            {/* Clamp */}
            <rect x="190" y="50" width="55" height="16" rx="4" fill="#374151" />
            {/* === BURETTE === */}
            <rect x="195" y="65" width="22" height={buretteTotalH} rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
            {/* Liquid in burette (from top) */}
            <rect x="197" y="67" width="18" height={Math.max(0, buretteTotalH - buretteFilledH - 2)} rx="2" fill="#fee2e2" opacity="0.7" />
            {/* Tick marks */}
            {buretteTicks.map(v => {
              const yPos = 65 + (v / 50) * buretteTotalH;
              return (<g key={v}><line x1="195" y1={yPos} x2="203" y2={yPos} stroke="#64748b" strokeWidth="1" /><text x="192" y={yPos + 3} textAnchor="end" fontSize="7" fill="#475569">{v}</text></g>);
            })}
            {/* Current reading arrow */}
            <line x1="220" y1={65 + (buretteReading / 50) * buretteTotalH} x2="232" y2={65 + (buretteReading / 50) * buretteTotalH} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" />
            <text x="234" y={68 + (buretteReading / 50) * buretteTotalH} fontSize="8" fill="#ef4444" fontWeight="bold">{buretteReading.toFixed(2)}</text>
            {/* Burette tip and tap */}
            <rect x="201" y={65 + buretteTotalH} width="10" height="18" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
            <rect x="196" y={73 + buretteTotalH} width="20" height="8" rx="2" fill="#6b7280" />
            {/* Drop */}
            {dropVisible && <ellipse cx="206" cy={92 + buretteTotalH + (animTick % 20) * 3} rx="3" ry="4" fill="#fee2e2" opacity="0.8" />}
            {/* === CONICAL FLASK === */}
            <g transform="translate(90, 260)">
              {/* Flask outline */}
              <path d="M20 0 L20 50 L0 100 Q0 115 30 120 Q60 115 60 100 L40 50 L40 0 Z" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
              {/* Liquid fill */}
              <clipPath id="flaskClipT">
                <path d="M20 0 L20 50 L0 100 Q0 115 30 120 Q60 115 60 100 L40 50 L40 0 Z" />
              </clipPath>
              <rect x="0" y="50" width="60" height="80" fill={fColor} opacity="0.75" clipPath="url(#flaskClipT)" />
              {/* Foam highlight */}
              <ellipse cx="30" cy="52" rx="12" ry="3" fill="white" opacity={0.3} />
              {/* Flask rim */}
              <rect x="16" y="-8" width="28" height="10" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
            </g>
            {/* Endpoint label */}
            {endpointReached && (
              <g>
                <rect x="10" y="300" width="110" height="28" rx="6" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
                <text x="65" y="318" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#166534">Endpoint reached!</text>
              </g>
            )}
            {/* Status bar */}
            <text x="150" y="390" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="bold">
              {!isRunning && !endpointReached && 'Press Run Titration to begin'}
              {isRunning && `Dispensing HCl... ${buretteReading.toFixed(2)} cm3 used`}
              {endpointReached && `Colourless! Vol used: ${(buretteReading - initialReading).toFixed(2)} cm3`}
            </text>
            {/* Volume label */}
            <text x="165" y="290" fontSize="8" fill="#374151" fontWeight="bold">cm3 scale</text>
          </svg>
          {/* Color indicator legend */}
          <div className="flex gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1"><div className="w-4 h-4 rounded-full border" style={{ background: 'rgb(251,207,232)' }}></div><span className="text-slate-600">Alkaline (pink)</span></div>
            <div className="flex items-center gap-1"><div className="w-4 h-4 rounded-full border bg-slate-100"></div><span className="text-slate-600">Neutral (colourless)</span></div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col gap-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Results Table</h2>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 text-slate-600">
                  <tr><th className="p-2 text-left">Trial</th><th className="p-2 text-center">Initial (cm3)</th><th className="p-2 text-center">Final (cm3)</th><th className="p-2 text-center">Vol Used (cm3)</th></tr>
                </thead>
                <tbody>
                  {trials.length === 0 ? (
                    <tr><td colSpan={4} className="text-center text-slate-400 py-4 italic">Run and record 3+ titrations.</td></tr>
                  ) : (
                    trials.map(t => (
                      <tr key={t.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="p-2 font-medium text-slate-500">{t.id}</td>
                        <td className="p-2 text-center font-mono">{t.initial.toFixed(2)}</td>
                        <td className="p-2 text-center font-mono">{t.final.toFixed(2)}</td>
                        <td className="p-2 text-center font-mono font-bold text-blue-700">{t.volume.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {trials.length >= 2 && (
              <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs">
                <div className="flex justify-between"><span className="text-blue-700 font-semibold">Concordant trials:</span><span className="font-mono font-bold text-blue-800">{concordantTrials.length} / {trials.length}</span></div>
                <div className="flex justify-between mt-1"><span className="text-blue-700 font-semibold">Mean volume used:</span><span className="font-mono font-bold text-blue-800">{avgVolume.toFixed(2)} cm3</span></div>
              </div>
            )}
          </div>

          {/* Volume graph */}
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-2">Graph: Volume Used per Trial</h2>
            <svg width={graphW} height={graphH} className="border rounded-lg bg-slate-50 w-full">
              {[5, 10, 15].map(y => (<line key={y} x1={padG.l} y1={toGY(y)} x2={graphW - padG.r} y2={toGY(y)} stroke="#e2e8f0" strokeWidth="1" />))}
              <line x1={padG.l} y1={padG.t} x2={padG.l} y2={graphH - padG.b} stroke="#475569" strokeWidth="1.5" />
              <line x1={padG.l} y1={graphH - padG.b} x2={graphW - padG.r} y2={graphH - padG.b} stroke="#475569" strokeWidth="1.5" />
              <text x={graphW / 2} y={graphH - 4} textAnchor="middle" fontSize="9" fill="#475569">Trial #</text>
              <text x="8" y={graphH / 2} textAnchor="middle" fontSize="9" fill="#475569" transform={`rotate(-90, 8, ${graphH / 2})`}>Vol (cm3)</text>
              {[0, 5, 10, 15].map(y => (<text key={y} x={padG.l - 4} y={toGY(y) + 3} textAnchor="end" fontSize="7" fill="#64748b">{y}</text>))}
              {/* Mean line */}
              {trials.length >= 2 && (<line x1={padG.l} y1={toGY(avgVolume)} x2={graphW - padG.r} y2={toGY(avgVolume)} stroke="#dc2626" strokeWidth="1.5" strokeDasharray="5,3" />)}
              {/* Points */}
              {trials.map((t, i) => (<circle key={t.id} cx={toGX(i)} cy={toGY(t.volume)} r="5" fill="#2563eb" stroke="white" strokeWidth="1.5" />))}
              {trials.map((t, i) => (<text key={`l${t.id}`} x={toGX(i)} y={graphH - padG.b + 10} textAnchor="middle" fontSize="8" fill="#475569">{i + 1}</text>))}
            </svg>
          </div>

          {/* Assessment */}
          <div className="border-t pt-4">
            <h2 className="text-base font-bold text-slate-800 mb-2">Assessment</h2>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm text-indigo-800 mb-3">
              <p className="font-semibold mb-1">Calculate [HCl]:</p>
              <p>Using M_acid x V_acid = M_base x V_base, where M_base = 0.1 mol/dm3, V_base = 10.0 cm3, and your average V_acid from the table above, calculate M_acid in mol/dm3. (Tolerance: +/-0.005 mol/dm3)</p>
            </div>
            <div className="flex gap-2">
              <input type="number" step="0.001" placeholder="M_acid = ? mol/dm3" value={userAnswer} onChange={e => setUserAnswer(e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" />
              <button onClick={checkAnswer} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors">Check</button>
            </div>
            {feedback.type && (<div className={`mt-2 p-2 rounded-lg text-sm font-medium ${feedback.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>{feedback.message}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
