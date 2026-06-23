import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, ChevronRight } from 'lucide-react';

interface LabProps {
  onExit?: () => void;
}

const NACL_MOLAR_MASS = 58.44; // g/mol

export default function LabCh10SaltTitration({ onExit }: LabProps) {
  const [hclConc, setHclConc] = useState(0.1);  // mol/dm3
  const [naohConc, setNaohConc] = useState(0.1); // mol/dm3
  const [hclVolume] = useState(25.0); // fixed 25 cm3 HCl in flask

  // Step management: 0=titration, 1=evaporation, 2=crystallization
  const [step, setStep] = useState(0);

  // Titration state
  const [isRunning, setIsRunning] = useState(false);
  const [dispensed, setDispensed] = useState(0.0);
  const [endpointReached, setEndpointReached] = useState(false);
  const [animTick, setAnimTick] = useState(0);

  // Evaporation state
  const [evapProgress, setEvapProgress] = useState(0.0); // 0-1
  const [isEvaporating, setIsEvaporating] = useState(false);

  // Crystallization state
  const [crystalProgress, setCrystalProgress] = useState(0.0);
  const [isCooling, setIsCooling] = useState(false);

  // Data records
  const [dataRows, setDataRows] = useState<{ id: number; vNaoh: number; molHcl: number; molNaoh: number; molNacl: number; yieldG: number }[]>([]);

  // Assessment
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });

  // Derived chemistry
  const vNaohNeeded = (hclConc * hclVolume) / naohConc; // cm3
  const molHcl = (hclConc * hclVolume) / 1000; // mol
  const molNaoh = (naohConc * vNaohNeeded) / 1000; // mol
  const molNacl = Math.min(molHcl, molNaoh); // limiting reagent = same moles
  const theoreticalYield = molNacl * NACL_MOLAR_MASS; // grams

  // Titration speed
  const trueEndpoint = vNaohNeeded;
  const speed = dispensed < trueEndpoint * 0.85 ? 0.3 : 0.06;

  useEffect(() => {
    if (!isRunning || endpointReached) return;
    const interval = setInterval(() => {
      setAnimTick(t => t + 1);
      setDispensed(prev => {
        const next = parseFloat((prev + speed).toFixed(2));
        if (next >= trueEndpoint) { setEndpointReached(true); setIsRunning(false); return parseFloat(trueEndpoint.toFixed(2)); }
        return next;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [isRunning, endpointReached, speed, trueEndpoint]);

  useEffect(() => {
    if (!isEvaporating) return;
    const interval = setInterval(() => {
      setEvapProgress(p => { if (p >= 1) { setIsEvaporating(false); return 1; } return Math.min(1, p + 0.008); });
    }, 50);
    return () => clearInterval(interval);
  }, [isEvaporating]);

  useEffect(() => {
    if (!isCooling) return;
    const interval = setInterval(() => {
      setCrystalProgress(p => { if (p >= 1) { setIsCooling(false); return 1; } return Math.min(1, p + 0.006); });
    }, 50);
    return () => clearInterval(interval);
  }, [isCooling]);

  const recordData = () => {
    const noisy = parseFloat((theoreticalYield * (1 - Math.random() * 0.04)).toFixed(3));
    setDataRows(prev => [...prev, { id: prev.length + 1, vNaoh: parseFloat(vNaohNeeded.toFixed(2)), molHcl: parseFloat(molHcl.toFixed(5)), molNaoh: parseFloat(molNaoh.toFixed(5)), molNacl: parseFloat(molNacl.toFixed(5)), yieldG: noisy }]);
  };

  const reset = () => {
    setStep(0); setIsRunning(false); setDispensed(0); setEndpointReached(false); setAnimTick(0);
    setEvapProgress(0); setIsEvaporating(false); setCrystalProgress(0); setIsCooling(false);
    setDataRows([]); setUserAnswer(''); setFeedback({ type: '', message: '' });
  };

  const checkAnswer = () => {
    const val = parseFloat(userAnswer);
    if (isNaN(val)) { setFeedback({ type: 'error', message: 'Enter a valid number.' }); return; }
    if (Math.abs(val - theoreticalYield) <= 0.1) {
      setFeedback({ type: 'success', message: `Correct! Theoretical yield = ${theoreticalYield.toFixed(3)} g NaCl. Excellent work!` });
    } else {
      setFeedback({ type: 'error', message: `Not quite. Remember: moles NaCl = moles HCl = M*V/1000. Then mass = moles * 58.44 g/mol.` });
    }
  };

  // SVG helpers
  const flaskPinkness = step === 0 ? (endpointReached ? 0 : Math.max(0, 1 - (dispensed / trueEndpoint) * 1.1)) : 0;
  const rP = Math.round(251 - flaskPinkness * 100); const gP = Math.round(207 - flaskPinkness * 100); const bP = Math.round(232 - flaskPinkness * 130);
  const flaskFillColor = `rgb(${rP},${gP},${bP})`;
  const dropVisible = isRunning && animTick % 3 === 0;
  const liquidLevel = step === 1 ? (1 - evapProgress) : 1;
  const crystalAlpha = step === 2 ? crystalProgress : 0;

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-white border-b p-4 flex items-center justify-between sticky top-0 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4">
          {onExit && (<button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft className="w-5 h-5 text-slate-700" /></button>)}
          <div>
            <h1 className="text-xl font-bold text-slate-800">Preparation of NaCl by Titration</h1>
            <p className="text-sm text-slate-500">HCl + NaOH to NaCl + H2O then evaporation and crystallisation</p>
          </div>
        </div>
        <button onClick={reset} className="flex items-center gap-2 bg-slate-200 px-4 py-2 rounded-md hover:bg-slate-300 font-medium transition-colors text-slate-700"><RefreshCw className="w-4 h-4" /> Reset</button>
      </div>

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-7xl mx-auto w-full">
        {/* Column 1 */}
        <div className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col gap-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Theory</h2>
            <p className="text-sm text-slate-600 mb-2">Hydrochloric acid reacts with sodium hydroxide in a neutralisation reaction:</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center font-mono font-bold text-blue-800 text-sm mb-3">HCl + NaOH to NaCl + H2O</div>
            <p className="text-sm text-slate-600 mb-2">The moles of NaCl formed equal the moles of the limiting reagent (whichever is used up first). Theoretical yield:</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center font-mono text-xs text-green-800 font-bold mb-3">mass(NaCl) = n(NaCl) x 58.44 g/mol</div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-800">The solution is evaporated to concentrate it, then cooled so NaCl crystallises out.</div>
          </div>
          <div className="border-t pt-4">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Setup Parameters</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1"><label className="text-sm font-medium text-slate-700">HCl Concentration</label><span className="text-sm font-bold text-red-600">{hclConc.toFixed(2)} mol/dm3</span></div>
                <input type="range" min="0.05" max="0.2" step="0.01" value={hclConc} onChange={e => { setHclConc(parseFloat(e.target.value)); reset(); }} className="w-full accent-red-600" />
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>0.05</span><span>0.20 mol/dm3</span></div>
              </div>
              <div>
                <div className="flex justify-between mb-1"><label className="text-sm font-medium text-slate-700">NaOH Concentration</label><span className="text-sm font-bold text-blue-600">{naohConc.toFixed(2)} mol/dm3</span></div>
                <input type="range" min="0.05" max="0.2" step="0.01" value={naohConc} onChange={e => { setNaohConc(parseFloat(e.target.value)); reset(); }} className="w-full accent-blue-600" />
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>0.05</span><span>0.20 mol/dm3</span></div>
              </div>
              <div className="bg-slate-100 rounded-lg p-2 text-xs border border-slate-200">
                <div className="flex justify-between"><span className="text-slate-500">Volume HCl (fixed):</span><span className="font-bold">{hclVolume.toFixed(1)} cm3</span></div>
                <div className="flex justify-between mt-1"><span className="text-slate-500">V(NaOH) needed:</span><span className="font-bold text-blue-700">{vNaohNeeded.toFixed(2)} cm3</span></div>
                <div className="flex justify-between mt-1"><span className="text-slate-500">Theoretical yield:</span><span className="font-bold text-green-700">{theoreticalYield.toFixed(3)} g NaCl</span></div>
              </div>
            </div>
          </div>
          <div className="border-t pt-4">
            <h2 className="text-base font-bold text-slate-800 mb-2">Step Progress</h2>
            <div className="flex gap-2">
              {['Titration', 'Evaporation', 'Crystallise'].map((s, i) => (
                <div key={i} className={`flex-1 text-center py-2 rounded-lg text-xs font-semibold border ${step === i ? 'bg-blue-600 text-white border-blue-600' : step > i ? 'bg-green-100 text-green-700 border-green-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>{step > i ? 'Done' : s}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col items-center">
          <h2 className="text-lg font-bold text-slate-800 mb-1">Laboratory Simulation</h2>
          <div className="flex gap-2 mb-3">
            {['Step 1: Titrate', 'Step 2: Evaporate', 'Step 3: Crystallise'].map((s, i) => (
              <button key={i} onClick={() => { if (i === 0 || step >= i) setStep(i); }} className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${step === i ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>{s}</button>
            ))}
          </div>

          {/* Step 1: Titration */}
          {step === 0 && (
            <svg width="300" height="360" viewBox="0 0 300 360" className="rounded-xl border bg-gradient-to-b from-sky-50 to-slate-100">
              {/* Stand */}
              <rect x="240" y="10" width="8" height="310" rx="3" fill="#6b7280" />
              <rect x="150" y="315" width="100" height="12" rx="3" fill="#6b7280" />
              <rect x="190" y="40" width="55" height="14" rx="4" fill="#374151" />
              {/* Burette */}
              <rect x="196" y="52" width="20" height="170" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
              {/* NaOH in burette (blue tint) */}
              <rect x="198" y="54" width="16" height={Math.max(0, 166 - (dispensed / 50) * 166)} rx="2" fill="#bfdbfe" opacity="0.7" />
              {/* Tick marks */}
              {[0, 10, 20, 30, 40, 50].map(v => { const yp = 52 + (v / 50) * 170; return (<g key={v}><line x1="196" y1={yp} x2="204" y2={yp} stroke="#64748b" strokeWidth="1" /><text x="193" y={yp + 3} textAnchor="end" fontSize="7" fill="#475569">{v}</text></g>); })}
              {/* Burette tip */}
              <rect x="200" y="222" width="12" height="16" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Tap */}
              <rect x="196" y="228" width="20" height="7" rx="2" fill="#6b7280" />
              {/* Drop */}
              {dropVisible && <ellipse cx="206" cy={246 + (animTick % 20) * 2.5} rx="3" ry="4" fill="#bfdbfe" opacity="0.85" />}
              {/* Volume label */}
              <text x="234" y={56 + (dispensed / 50) * 170} fontSize="8" fill="#ef4444" fontWeight="bold">{dispensed.toFixed(2)}</text>
              <line x1="218" y1={54 + (dispensed / 50) * 170} x2="232" y2={54 + (dispensed / 50) * 170} stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" />
              {/* Flask */}
              <g transform="translate(65, 230)">
                <path d="M18 0 L18 45 L0 90 Q0 110 28 115 Q56 110 56 90 L38 45 L38 0 Z" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
                <clipPath id="saltFlaskClip">
                  <path d="M18 0 L18 45 L0 90 Q0 110 28 115 Q56 110 56 90 L38 45 L38 0 Z" />
                </clipPath>
                <rect x="0" y="40" width="56" height="80" fill={flaskFillColor} opacity="0.75" clipPath="url(#saltFlaskClip)" />
                <rect x="14" y="-8" width="28" height="10" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
                <text x="28" y="-1" textAnchor="middle" fontSize="6" fill="#475569">HCl 25cm3</text>
              </g>
              {endpointReached && (<g><rect x="10" y="275" width="120" height="26" rx="6" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" /><text x="70" y="292" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#166534">Endpoint! V(NaOH) = {dispensed.toFixed(2)} cm3</text></g>)}
              <text x="150" y="348" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="bold">
                {!isRunning && !endpointReached && 'Press Run Titration'}
                {isRunning && `Dispensing NaOH... ${dispensed.toFixed(2)} cm3`}
                {endpointReached && 'Colourless - neutralisation complete!'}
              </text>
            </svg>
          )}

          {/* Step 2: Evaporation */}
          {step === 1 && (
            <svg width="300" height="360" viewBox="0 0 300 360" className="rounded-xl border bg-gradient-to-b from-orange-50 to-slate-100">
              {/* Hotplate */}
              <rect x="60" y="290" width="180" height="30" rx="6" fill="#374151" />
              <rect x="70" y="282" width="160" height="14" rx="4" fill="#6b7280" />
              {/* Heat coils */}
              {isEvaporating && [0, 1, 2].map(i => (<ellipse key={i} cx={120 + i * 25} cy="285" rx="10" ry="3" fill="none" stroke="#ef4444" strokeWidth="2" opacity={0.6 + Math.sin(animTick * 0.2 + i) * 0.3} />))}
              {/* Heat waves */}
              {isEvaporating && evapProgress < 0.95 && [0, 1, 2, 3].map(i => (
                <path key={i} d={`M${115 + i * 20} ${260 - evapProgress * 30} Q${120 + i * 20} ${240 - evapProgress * 30} ${125 + i * 20} ${260 - evapProgress * 30}`}
                  fill="none" stroke="#f97316" strokeWidth="1.5" opacity={0.4} strokeDasharray="3,2" />
              ))}
              {/* Evaporating dish */}
              <ellipse cx="150" cy="280" rx="75" ry="16" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
              <ellipse cx="150" cy="264" rx="73" ry="14" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Liquid inside dish */}
              {liquidLevel > 0.05 && (
                <>
                  <clipPath id="dishClip">
                    <ellipse cx="150" cy="278" rx="70" ry="12" />
                  </clipPath>
                  <ellipse cx="150" cy={278 - (1 - liquidLevel) * 10} rx="70" ry={12 * liquidLevel} fill="#bfdbfe" opacity="0.6" clipPath="url(#dishClip)" />
                </>
              )}
              {/* Steam clouds */}
              {isEvaporating && evapProgress < 0.95 && (
                <>
                  <ellipse cx="130" cy={220 - evapProgress * 40} rx="18" ry="12" fill="white" opacity={0.6 * (1 - evapProgress)} />
                  <ellipse cx="160" cy={200 - evapProgress * 50} rx="14" ry="10" fill="white" opacity={0.5 * (1 - evapProgress)} />
                  <ellipse cx="180" cy={215 - evapProgress * 40} rx="16" ry="11" fill="white" opacity={0.55 * (1 - evapProgress)} />
                </>
              )}
              {/* Salt residue appearing */}
              {evapProgress > 0.6 && (
                <ellipse cx="150" cy="274" rx={60 * (evapProgress - 0.6) / 0.4} ry={8 * (evapProgress - 0.6) / 0.4} fill="white" opacity="0.9" />
              )}
              <text x="150" y="340" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="bold">
                {!isEvaporating && evapProgress < 1 && 'Press Start Evaporation'}
                {isEvaporating && `Evaporating... ${Math.round(evapProgress * 100)}%`}
                {evapProgress >= 1 && 'Evaporation complete! Proceed to crystallise.'}
              </text>
              <text x="150" y="355" textAnchor="middle" fontSize="9" fill="#94a3b8">NaCl solution concentrating...</text>
            </svg>
          )}

          {/* Step 3: Crystallisation */}
          {step === 2 && (
            <svg width="300" height="360" viewBox="0 0 300 360" className="rounded-xl border bg-gradient-to-b from-blue-50 to-slate-100">
              {/* Dish */}
              <ellipse cx="150" cy="240" rx="85" ry="18" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
              <ellipse cx="150" cy="225" rx="83" ry="16" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Crystals growing */}
              {crystalAlpha > 0 && Array.from({ length: 20 }, (_, i) => {
                const cx = 90 + (i % 5) * 24; const cy = 235 - Math.floor(i / 5) * 8;
                const size = 4 + Math.random() * 6;
                return (<rect key={i} x={cx - size / 2} y={cy - size / 2} width={size} height={size} transform={`rotate(45, ${cx}, ${cy})`} fill="white" stroke="#94a3b8" strokeWidth="0.8" opacity={crystalAlpha} />);
              })}
              {/* Thermometer */}
              <rect x="220" y="170" width="10" height="60" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
              <ellipse cx="225" cy="232" rx="7" ry="7" fill="#ef4444" />
              <rect x="222" y={175 + (1 - crystalProgress) * 50} width="6" height={crystalProgress * 50} rx="2" fill="#ef4444" opacity="0.8" />
              <text x="235" y="200" fontSize="8" fill="#475569" fontWeight="bold">{Math.round(100 - crystalProgress * 80)}C</text>
              {/* Snowflake/cool icon */}
              {isCooling && (
                <>
                  <text x="50" y="185" fontSize="20" fill="#93c5fd" opacity="0.7">*</text>
                  <text x="235" y="175" fontSize="16" fill="#93c5fd" opacity="0.6">*</text>
                </>
              )}
              {crystalProgress >= 1 && (<g><rect x="50" y="270" width="200" height="28" rx="6" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" /><text x="150" y="288" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#166534">NaCl crystals formed! Yield ~{theoreticalYield.toFixed(2)} g</text></g>)}
              <text x="150" y="340" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="bold">
                {!isCooling && crystalProgress < 1 && 'Press Cool & Crystallise'}
                {isCooling && `Cooling... ${Math.round(crystalProgress * 100)}%`}
                {crystalProgress >= 1 && 'Record your data and answer the assessment!'}
              </text>
            </svg>
          )}

          {/* Step-specific controls */}
          <div className="mt-4 w-full flex flex-col gap-2">
            {step === 0 && (
              <>
                <button onClick={() => setIsRunning(true)} disabled={isRunning || endpointReached} className="w-full py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Run Titration</button>
                {endpointReached && (<button onClick={() => setStep(1)} className="w-full py-2 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 transition-colors flex items-center justify-center gap-2">Proceed to Evaporation <ChevronRight className="w-4 h-4" /></button>)}
              </>
            )}
            {step === 1 && (
              <>
                <button onClick={() => setIsEvaporating(true)} disabled={isEvaporating || evapProgress >= 1} className="w-full py-2 rounded-lg font-bold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Start Evaporation</button>
                {evapProgress >= 1 && (<button onClick={() => setStep(2)} className="w-full py-2 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 transition-colors flex items-center justify-center gap-2">Proceed to Crystallise <ChevronRight className="w-4 h-4" /></button>)}
              </>
            )}
            {step === 2 && (
              <button onClick={() => setIsCooling(true)} disabled={isCooling || crystalProgress >= 1} className="w-full py-2 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Cool and Crystallise</button>
            )}
          </div>
        </div>

        {/* Column 3 */}
        <div className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col gap-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-slate-800">Moles & Yield Table</h2>
              <button onClick={recordData} disabled={crystalProgress < 1} className="bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">+ Record</button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 text-slate-600">
                  <tr><th className="p-1.5 text-left">#</th><th className="p-1.5 text-center">V(NaOH) cm3</th><th className="p-1.5 text-center">n(HCl)</th><th className="p-1.5 text-center">n(NaOH)</th><th className="p-1.5 text-center">n(NaCl)</th><th className="p-1.5 text-center">Yield (g)</th></tr>
                </thead>
                <tbody>
                  {dataRows.length === 0 ? (
                    <tr><td colSpan={6} className="text-center text-slate-400 py-3 italic">Complete all 3 steps first.</td></tr>
                  ) : (
                    dataRows.map(row => (
                      <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="p-1.5 font-medium text-slate-500">{row.id}</td>
                        <td className="p-1.5 text-center font-mono">{row.vNaoh}</td>
                        <td className="p-1.5 text-center font-mono">{row.molHcl.toFixed(4)}</td>
                        <td className="p-1.5 text-center font-mono">{row.molNaoh.toFixed(4)}</td>
                        <td className="p-1.5 text-center font-mono">{row.molNacl.toFixed(4)}</td>
                        <td className="p-1.5 text-center font-mono font-bold text-green-700">{row.yieldG.toFixed(3)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {dataRows.length > 0 && (
              <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-2 text-xs">
                <div className="grid grid-cols-2 gap-1">
                  <div><span className="text-slate-500">Moles HCl:</span> <span className="font-bold text-green-800">{molHcl.toFixed(4)} mol</span></div>
                  <div><span className="text-slate-500">Moles NaCl:</span> <span className="font-bold text-green-800">{molNacl.toFixed(4)} mol</span></div>
                  <div><span className="text-slate-500">Molar mass NaCl:</span> <span className="font-bold text-green-800">58.44 g/mol</span></div>
                  <div><span className="text-slate-500">Theoretical yield:</span> <span className="font-bold text-green-800">{theoreticalYield.toFixed(3)} g</span></div>
                </div>
              </div>
            )}
          </div>

          {/* Mole ratio diagram */}
          <div className="bg-slate-50 border rounded-lg p-3">
            <h3 className="text-sm font-bold text-slate-700 mb-2">Mole Calculations (live)</h3>
            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between"><span className="text-slate-500">n(HCl) = {hclConc} x {hclVolume}/1000 =</span><span className="font-bold text-red-700">{molHcl.toFixed(4)} mol</span></div>
              <div className="flex justify-between"><span className="text-slate-500">n(NaOH) = {naohConc} x {vNaohNeeded.toFixed(2)}/1000 =</span><span className="font-bold text-blue-700">{molNaoh.toFixed(4)} mol</span></div>
              <div className="flex justify-between"><span className="text-slate-500">n(NaCl) = min(n(HCl), n(NaOH)) =</span><span className="font-bold text-green-700">{molNacl.toFixed(4)} mol</span></div>
              <div className="flex justify-between border-t pt-1"><span className="text-slate-500">m(NaCl) = n x M_r = {molNacl.toFixed(4)} x 58.44 =</span><span className="font-bold text-green-800">{theoreticalYield.toFixed(3)} g</span></div>
            </div>
          </div>

          {/* Assessment */}
          <div className="border-t pt-4">
            <h2 className="text-base font-bold text-slate-800 mb-2">Assessment</h2>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm text-indigo-800 mb-3">
              <p className="font-semibold mb-1">Calculate Theoretical Yield:</p>
              <p>Given <strong>{hclConc.toFixed(2)} mol/dm3 HCl</strong> ({hclVolume} cm3) + <strong>{naohConc.toFixed(2)} mol/dm3 NaOH</strong>, calculate the theoretical yield of NaCl in grams. (Tolerance: +/-0.1 g, M_r(NaCl) = 58.44)</p>
            </div>
            <div className="flex gap-2">
              <input type="number" step="0.001" placeholder="Mass NaCl = ? g" value={userAnswer} onChange={e => setUserAnswer(e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" />
              <button onClick={checkAnswer} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors">Check</button>
            </div>
            {feedback.type && (<div className={`mt-2 p-2 rounded-lg text-sm font-medium ${feedback.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>{feedback.message}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
