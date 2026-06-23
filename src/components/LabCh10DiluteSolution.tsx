import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, RefreshCw, FlaskConical } from 'lucide-react';

interface LabProps {
  onExit?: () => void;
}

const addNoise = (val: number, scale: number = 0.02): number =>
  parseFloat((val + (Math.random() - 0.5) * 2 * scale).toFixed(3));

const C1 = 12.0;

export default function LabCh10DiluteSolution({ onExit }: LabProps) {
  const [targetM2, setTargetM2] = useState(0.1);
  const [targetV2, setTargetV2] = useState(250);
  const [animStep, setAnimStep] = useState<'idle' | 'pipetting' | 'filling' | 'done'>('idle');
  const [animProgress, setAnimProgress] = useState(0);
  const [dataRows, setDataRows] = useState<{ id: number; m2: number; v2: number; v1Calc: number; v1Meas: number }[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });

  const v1Exact = (targetM2 * targetV2) / C1;

  useEffect(() => {
    if (animStep === 'idle' || animStep === 'done') return;
    const interval = setInterval(() => {
      setAnimProgress((p) => {
        const next = p + 0.015;
        if (next >= 1) {
          if (animStep === 'pipetting') { setAnimStep('filling'); return 0; }
          else { setAnimStep('done'); clearInterval(interval); return 1; }
        }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [animStep]);

  const startAnimation = () => { setAnimStep('pipetting'); setAnimProgress(0); };

  const recordData = () => {
    if (animStep !== 'done') return;
    const noisy = addNoise(v1Exact);
    setDataRows((prev) => [...prev, { id: prev.length + 1, m2: targetM2, v2: targetV2, v1Calc: parseFloat(v1Exact.toFixed(3)), v1Meas: noisy }]);
  };

  const reset = () => { setAnimStep('idle'); setAnimProgress(0); setDataRows([]); setUserAnswer(''); setFeedback({ type: '', message: '' }); };

  const checkAnswer = () => {
    const correct = (0.075 * 250) / C1;
    const val = parseFloat(userAnswer);
    if (isNaN(val)) { setFeedback({ type: 'error', message: 'Enter a valid number.' }); return; }
    if (Math.abs(val - correct) <= 0.1) {
      setFeedback({ type: 'success', message: `Correct! V1 = ${correct.toFixed(3)} cm3. Well done!` });
    } else {
      setFeedback({ type: 'error', message: `Not quite. Use V1 = M2*V2/M1 = (0.075*250)/12.0. Check your arithmetic.` });
    }
  };

  const graphW = 260; const graphH = 160;
  const pad = { l: 44, r: 10, t: 10, b: 36 };
  const maxM2 = 0.5; const maxV1 = (0.5 * 250) / C1 + 1;
  const toX = (m: number) => pad.l + ((m / maxM2) * (graphW - pad.l - pad.r));
  const toY = (v: number) => graphH - pad.b - ((v / maxV1) * (graphH - pad.t - pad.b));

  const { slope, intercept } = useMemo(() => {
    if (dataRows.length < 2) return { slope: 0, intercept: 0 };
    const n = dataRows.length;
    const sx = dataRows.reduce((a, d) => a + d.m2, 0); const sy = dataRows.reduce((a, d) => a + d.v1Meas, 0);
    const sxy = dataRows.reduce((a, d) => a + d.m2 * d.v1Meas, 0); const sx2 = dataRows.reduce((a, d) => a + d.m2 * d.m2, 0);
    const denom = n * sx2 - sx * sx;
    if (denom === 0) return { slope: 0, intercept: sy / n };
    const m = (n * sxy - sx * sy) / denom; const b = (sy - m * sx) / n;
    return { slope: m, intercept: b };
  }, [dataRows]);

  const flaskFillLevel = animStep === 'done' ? 1 : animStep === 'filling' ? animProgress : 0;
  const pipetteX = animStep === 'pipetting' ? 200 + animProgress * (-80) : animStep === 'filling' ? 120 : 200;
  const pipetteY = animStep === 'pipetting' ? 60 + animProgress * 30 : animStep === 'filling' ? 50 : 60;
  const liquidInPipette = animStep === 'pipetting' ? animProgress : animStep === 'filling' ? 1 - animProgress : 0;
  const r = Math.round(253 - flaskFillLevel * 50); const g = Math.round(224 - flaskFillLevel * 80); const bc = Math.round(71 + flaskFillLevel * 120);
  const flaskColor = `rgb(${r},${g},${bc})`;
  const waterDropAlpha = animStep === 'filling' ? Math.sin(animProgress * Math.PI * 8) * 0.5 + 0.5 : 0;
  const v1Displayed = animStep === 'done' ? addNoise(v1Exact) : 0;

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-white border-b p-4 flex items-center justify-between sticky top-0 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4">
          {onExit && (<button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft className="w-5 h-5 text-slate-700" /></button>)}
          <div>
            <h1 className="text-xl font-bold text-slate-800">Preparation of a Dilute Solution</h1>
            <p className="text-sm text-slate-500">Dilution Formula: M1V1 = M2V2 | Concentrated HCl to Dilute HCl</p>
          </div>
        </div>
        <button onClick={reset} className="flex items-center gap-2 bg-slate-200 px-4 py-2 rounded-md hover:bg-slate-300 font-medium transition-colors text-slate-700"><RefreshCw className="w-4 h-4" /> Reset</button>
      </div>

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-7xl mx-auto w-full">
        {/* Column 1 */}
        <div className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col gap-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Theory</h2>
            <p className="text-sm text-slate-600 mb-3">When a concentrated solution is diluted, the moles of solute remain constant. This gives the <span className="font-semibold text-blue-700">Dilution Formula</span>:</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center font-mono font-bold text-blue-800 text-base mb-3">M1V1 = M2V2</div>
            <ul className="text-sm text-slate-600 space-y-1 list-disc ml-4">
              <li><span className="font-medium">M1</span> = Stock molarity (12.0 mol/dm3 fixed)</li>
              <li><span className="font-medium">V1</span> = Volume of stock to pipette</li>
              <li><span className="font-medium">M2</span> = Target molarity</li>
              <li><span className="font-medium">V2</span> = Target final volume</li>
            </ul>
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-800">Safety: Always add acid to water, never the reverse!</div>
          </div>
          <div className="border-t pt-4">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Setup Parameters</h2>
            <div className="bg-slate-100 rounded-lg p-3 text-sm mb-4 border border-slate-200">
              <div className="flex justify-between"><span className="text-slate-600">Stock M1:</span><span className="font-bold text-red-700">12.0 mol/dm3 HCl (fixed)</span></div>
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-1"><label className="text-sm font-medium text-slate-700">Target Molarity (M2)</label><span className="text-sm font-bold text-blue-600">{targetM2.toFixed(3)} M</span></div>
                <input type="range" min="0.05" max="0.5" step="0.005" value={targetM2} onChange={(e) => { setTargetM2(parseFloat(e.target.value)); setAnimStep('idle'); }} className="w-full accent-blue-600" />
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>0.05 M</span><span>0.5 M</span></div>
              </div>
              <div>
                <div className="flex justify-between mb-1"><label className="text-sm font-medium text-slate-700">Target Volume (V2)</label><span className="text-sm font-bold text-blue-600">{targetV2} cm3</span></div>
                <input type="range" min="100" max="500" step="50" value={targetV2} onChange={(e) => { setTargetV2(parseInt(e.target.value)); setAnimStep('idle'); }} className="w-full accent-blue-600" />
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>100 cm3</span><span>500 cm3</span></div>
              </div>
            </div>
          </div>
          <div className="border-t pt-4 bg-green-50 rounded-lg p-3">
            <p className="text-xs text-slate-600 mb-1 font-medium">Calculated V1:</p>
            <div className="font-mono text-sm font-bold text-green-700">V1 = ({targetM2.toFixed(3)} x {targetV2}) / {C1} = <span className="text-green-800">{v1Exact.toFixed(3)} cm3</span></div>
          </div>
          <div className="mt-auto">
            <button onClick={startAnimation} disabled={animStep === 'pipetting' || animStep === 'filling'} className="w-full py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
              <FlaskConical className="w-5 h-5" />
              {animStep === 'idle' ? 'Prepare Solution' : animStep === 'done' ? 'Re-run Preparation' : 'Preparing...'}
            </button>
          </div>
        </div>

        {/* Column 2 */}
        <div className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col items-center">
          <h2 className="text-lg font-bold text-slate-800 mb-1">Simulation</h2>
          <p className="text-xs text-slate-500 mb-3">Observe the dilution procedure step by step</p>
          <svg width="320" height="380" viewBox="0 0 320 380" className="rounded-xl border bg-gradient-to-b from-sky-50 to-slate-100">
            <rect x="20" y="345" width="280" height="18" rx="3" fill="#64748b" />
            <g transform="translate(220, 230)">
              <rect x="0" y="20" width="50" height="80" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
              <rect x="2" y="40" width="46" height="58" rx="4" fill="#f59e0b" opacity="0.7" />
              <rect x="15" y="5" width="20" height="18" rx="3" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
              <rect x="13" y="0" width="24" height="8" rx="3" fill="#d97706" />
              <rect x="5" y="55" width="40" height="30" rx="3" fill="white" opacity="0.9" />
              <text x="25" y="67" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#92400e">Conc. HCl</text>
              <text x="25" y="76" textAnchor="middle" fontSize="7" fill="#92400e">12.0 mol/dm3</text>
              <text x="25" y="85" textAnchor="middle" fontSize="6" fill="#b45309">Corrosive</text>
            </g>
            <g transform={`translate(${pipetteX}, ${pipetteY})`}>
              <rect x="-3" y="0" width="10" height="75" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
              {liquidInPipette > 0 && (<rect x="-1" y={2 + (1 - liquidInPipette) * 68} width="6" height={liquidInPipette * 68} rx="2" fill="#f59e0b" opacity="0.8" />)}
              <path d="M-1 73 Q2 85 2 88 Q2 85 5 73 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
              <text x="9" y="38" fontSize="7" fill="#475569" fontWeight="bold">{v1Exact.toFixed(1)}</text>
              <text x="9" y="47" fontSize="6" fill="#475569">cm3</text>
            </g>
            {animStep === 'filling' && waterDropAlpha > 0.1 && (<ellipse cx="122" cy={220 + animProgress * 30} rx="3" ry="4" fill="#60a5fa" opacity={waterDropAlpha} />)}
            <clipPath id="flaskBulbClipD">
              <ellipse cx="160" cy="305" rx="38" ry="33" />
            </clipPath>
            <ellipse cx="160" cy="305" rx="40" ry="35" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
            <rect x="152" y="220" width="16" height="55" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
            <line x1="148" y1="255" x2="172" y2="255" stroke="#1d4ed8" strokeWidth="2" />
            <text x="176" y="258" fontSize="8" fill="#1d4ed8" fontWeight="bold">{targetV2} cm3</text>
            <ellipse cx="160" cy="219" rx="9" ry="5" fill="#94a3b8" />
            <rect x="122" y={340 - flaskFillLevel * 66} width="76" height={flaskFillLevel * 66 + 5} fill={flaskColor} opacity="0.85" clipPath="url(#flaskBulbClipD)" />
            {flaskFillLevel > 0.95 && (<rect x="154" y="255" width="12" height={20 * (flaskFillLevel - 0.95) / 0.05} fill={flaskColor} opacity="0.7" />)}
            {animStep === 'done' && (<g><rect x="60" y="250" width="68" height="22" rx="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" /><text x="94" y="264" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#166534">V1 = {v1Displayed.toFixed(3)} cm3</text></g>)}
            <g transform="translate(30, 255)">
              <rect x="0" y="0" width="45" height="70" rx="4" fill="none" stroke="#94a3b8" strokeWidth="2" />
              <rect x="2" y="20" width="41" height="48" rx="3" fill="#bfdbfe" opacity="0.5" />
              <text x="22" y="12" textAnchor="middle" fontSize="8" fill="#475569" fontWeight="bold">H2O</text>
            </g>
            <text x="160" y="372" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="bold">
              {animStep === 'idle' && 'Press Prepare Solution to begin'}
              {animStep === 'pipetting' && `Withdrawing ${v1Exact.toFixed(2)} cm3 of stock HCl...`}
              {animStep === 'filling' && 'Adding stock to flask, topping with water...'}
              {animStep === 'done' && 'Solution prepared! Record your reading.'}
            </text>
          </svg>
          <div className="flex gap-3 mt-4 w-full">
            {['Withdraw V1', 'Add to Flask', 'Done'].map((step, i) => {
              const active = (i === 0 && animStep === 'pipetting') || (i === 1 && animStep === 'filling') || (i === 2 && animStep === 'done');
              const done = (i === 0 && (animStep === 'filling' || animStep === 'done')) || (i === 1 && animStep === 'done');
              return (<div key={i} className={`flex-1 text-center py-2 rounded-lg text-xs font-semibold border transition-colors ${active ? 'bg-blue-600 text-white border-blue-600' : done ? 'bg-green-100 text-green-700 border-green-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>{done ? 'v ' : ''}{step}</div>);
            })}
          </div>
        </div>

        {/* Column 3 */}
        <div className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col gap-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-slate-800">Data Log</h2>
              <button onClick={recordData} disabled={animStep !== 'done'} className="bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">+ Record Reading</button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 text-slate-600">
                  <tr><th className="p-2 text-left">#</th><th className="p-2 text-center">M2 (M)</th><th className="p-2 text-center">V2 (cm3)</th><th className="p-2 text-center">V1 Calc</th><th className="p-2 text-center">V1 Meas</th></tr>
                </thead>
                <tbody>
                  {dataRows.length === 0 ? (
                    <tr><td colSpan={5} className="text-center text-slate-400 py-4 italic">No data yet. Prepare a solution and record.</td></tr>
                  ) : (
                    dataRows.map((row) => (
                      <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="p-2 font-medium text-slate-500">{row.id}</td>
                        <td className="p-2 text-center">{row.m2.toFixed(3)}</td>
                        <td className="p-2 text-center">{row.v2}</td>
                        <td className="p-2 text-center text-blue-700 font-mono">{row.v1Calc.toFixed(3)}</td>
                        <td className="p-2 text-center text-green-700 font-mono font-bold">{row.v1Meas.toFixed(3)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400 mt-1 italic">Adjust M2/V2, re-prepare, and record multiple readings to build your graph.</p>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-2">Graph: V1 vs Target M2</h2>
            <svg width={graphW} height={graphH} className="border rounded-lg bg-slate-50 w-full">
              {[0.1, 0.2, 0.3, 0.4, 0.5].map((x) => (<line key={x} x1={toX(x)} y1={pad.t} x2={toX(x)} y2={graphH - pad.b} stroke="#e2e8f0" strokeWidth="1" />))}
              {[2, 4, 6, 8, 10].map((y) => (<line key={y} x1={pad.l} y1={toY(y)} x2={graphW - pad.r} y2={toY(y)} stroke="#e2e8f0" strokeWidth="1" />))}
              <line x1={pad.l} y1={pad.t} x2={pad.l} y2={graphH - pad.b} stroke="#475569" strokeWidth="1.5" />
              <line x1={pad.l} y1={graphH - pad.b} x2={graphW - pad.r} y2={graphH - pad.b} stroke="#475569" strokeWidth="1.5" />
              <text x={graphW / 2} y={graphH - 4} textAnchor="middle" fontSize="9" fill="#475569">Target M2 (mol/dm3)</text>
              <text x="8" y={graphH / 2} textAnchor="middle" fontSize="9" fill="#475569" transform={`rotate(-90, 8, ${graphH / 2})`}>V1 (cm3)</text>
              {[0.1, 0.2, 0.3, 0.4, 0.5].map((x) => (<text key={x} x={toX(x)} y={graphH - pad.b + 10} textAnchor="middle" fontSize="7" fill="#64748b">{x.toFixed(1)}</text>))}
              {[0, 2, 4, 6, 8, 10].map((y) => (<text key={y} x={pad.l - 4} y={toY(y) + 3} textAnchor="end" fontSize="7" fill="#64748b">{y}</text>))}
              <line x1={toX(0)} y1={toY(0)} x2={toX(0.5)} y2={toY((0.5 * 250) / C1)} stroke="#bfdbfe" strokeWidth="1.5" strokeDasharray="4,3" />
              {dataRows.length >= 2 && (<line x1={toX(0)} y1={toY(intercept)} x2={toX(0.5)} y2={toY(slope * 0.5 + intercept)} stroke="#dc2626" strokeWidth="1.5" strokeDasharray="5,3" />)}
              {dataRows.map((d) => (<circle key={d.id} cx={toX(d.m2)} cy={toY(d.v1Meas)} r="4" fill="#2563eb" stroke="white" strokeWidth="1.5" />))}
            </svg>
          </div>
          <div className="border-t pt-4">
            <h2 className="text-base font-bold text-slate-800 mb-2">Assessment</h2>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm text-indigo-800 mb-3">
              <p className="font-semibold mb-1">Challenge Question:</p>
              <p>Using 12.0 mol/dm3 HCl, calculate V1 (cm3) needed to prepare <strong>250 cm3</strong> of <strong>0.075 mol/dm3</strong> HCl. Give answer to 3 decimal places (tolerance: +/-0.1 cm3).</p>
            </div>
            <div className="flex gap-2">
              <input type="number" step="0.001" placeholder="V1 = ? cm3" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" />
              <button onClick={checkAnswer} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors">Check</button>
            </div>
            {feedback.type && (<div className={`mt-2 p-2 rounded-lg text-sm font-medium ${feedback.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>{feedback.message}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
