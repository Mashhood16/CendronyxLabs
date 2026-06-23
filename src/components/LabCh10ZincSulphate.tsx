import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, FlaskConical } from 'lucide-react';

interface LabProps { onExit?: () => void; }

const ZN_MW = 65.38;
const ZNSO4_MW = 161.47;

function withNoise(val: number, pct = 0.05): number {
  return val * (1 + (Math.random() - 0.5) * 2 * pct);
}

export default function LabCh10ZincSulphate({ onExit }: LabProps) {
  const [volume, setVolume] = useState(25);
  const [concentration, setConcentration] = useState(0.5);
  const [znMass, setZnMass] = useState(2.5);
  const [stage, setStage] = useState(0);
  const [bubblePhase, setBubblePhase] = useState(0);
  const [dataRows, setDataRows] = useState<{ v: number; c: number; molesAcid: number; molesZn: number; theoYield: number; actYield: number }[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const mysteryV = 35;
  const mysteryC = 0.72;

  const molesAcid = (volume / 1000) * concentration;
  const molesZn = znMass / ZN_MW;
  const znExcess = molesZn > molesAcid;
  const theoYieldZnSO4 = molesAcid * ZNSO4_MW;

  useEffect(() => {
    const id = setInterval(() => setBubblePhase(p => (p + 1) % 60), 80);
    return () => clearInterval(id);
  }, []);

  const recordData = () => {
    const actYield = withNoise(theoYieldZnSO4, 0.05);
    setDataRows(prev => [
      ...prev,
      { v: volume, c: concentration, molesAcid: +molesAcid.toFixed(4), molesZn: +molesZn.toFixed(4), theoYield: +theoYieldZnSO4.toFixed(3), actYield: +actYield.toFixed(3) }
    ]);
  };

  const reset = () => {
    setVolume(25); setConcentration(0.5); setZnMass(2.5);
    setStage(0); setDataRows([]); setUserAnswer(''); setFeedback(null);
  };

  const checkAnswer = () => {
    const expected = (mysteryV / 1000) * mysteryC * ZNSO4_MW;
    const val = parseFloat(userAnswer);
    if (isNaN(val)) { setFeedback({ ok: false, msg: 'Enter a valid number.' }); return; }
    if (Math.abs(val - expected) <= 0.5) {
      setFeedback({ ok: true, msg: `Correct! Theoretical yield = ${expected.toFixed(2)} g. Excellent stoichiometry!` });
    } else {
      setFeedback({ ok: false, msg: `Not quite. Hint: n(H₂SO₄) = (${mysteryV}/1000) × ${mysteryC} mol; mass = n × ${ZNSO4_MW} g/mol. Expected ≈ ${expected.toFixed(2)} g.` });
    }
  };

  const graphPoints = dataRows.map(r => ({ x: r.v, y: r.actYield }));
  const maxY = Math.max(10, ...graphPoints.map(p => p.y));
  const toSvgX = (v: number) => ((v - 10) / 40) * 220 + 30;
  const toSvgY = (y: number) => 160 - (y / maxY) * 140;

  let bfSlope = 0;
  if (graphPoints.length > 1) {
    const sumXY = graphPoints.reduce((s, p) => s + p.x * p.y, 0);
    const sumXX = graphPoints.reduce((s, p) => s + p.x * p.x, 0);
    bfSlope = sumXX > 0 ? sumXY / sumXX : 0;
  }

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          {onExit && (
            <button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
          )}
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">Activity 6.2 — Preparation of ZnSO₄ (Excess Metal Method)</h1>
            <p className="text-xs text-slate-500">Zn + H₂SO₄ → ZnSO₄ + H₂ &nbsp;|&nbsp; Grade 10 Chemistry</p>
          </div>
        </div>
        <button onClick={reset} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
          <RefreshCw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="flex-1 p-4 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Column 1: Theory & Controls */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="font-bold text-slate-800 mb-3 border-b pb-2 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-emerald-600" /> Theory
            </h2>
            <div className="text-sm text-slate-600 space-y-2">
              <p>When zinc metal reacts with dilute sulphuric acid, zinc sulphate and hydrogen gas are produced:</p>
              <div className="bg-emerald-50 border border-emerald-200 rounded p-2 font-mono text-center text-sm font-bold text-emerald-800">
                Zn + H₂SO₄ → ZnSO₄ + H₂↑
              </div>
              <p>Using <strong>excess zinc</strong> ensures <em>all</em> the acid is consumed. The excess zinc is removed by filtration.</p>
              <div className="bg-slate-100 rounded p-2 text-xs space-y-1">
                <div className="font-semibold">Molar masses:</div>
                <div>Zn = 65.38 g/mol &nbsp;|&nbsp; H₂SO₄ = 98.08 g/mol</div>
                <div>ZnSO₄ = 161.47 g/mol</div>
                <div className="mt-1 font-semibold">Molar ratio: 1 : 1 : 1 : 1</div>
              </div>
              <p className="text-xs text-slate-500">Theoretical yield = moles of H₂SO₄ × M(ZnSO₄)</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="font-bold text-slate-800 mb-3 border-b pb-2">Experiment Controls</h2>
            <div className="space-y-4 text-sm">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-medium text-slate-700">H₂SO₄ Volume</label>
                  <span className="font-bold text-blue-600">{volume} cm³</span>
                </div>
                <input type="range" min="10" max="50" step="1" value={volume} onChange={e => setVolume(+e.target.value)}
                  className="w-full accent-blue-500 h-2 rounded-lg cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-medium text-slate-700">H₂SO₄ Concentration</label>
                  <span className="font-bold text-blue-600">{concentration.toFixed(2)} mol/dm³</span>
                </div>
                <input type="range" min="0.1" max="1.0" step="0.05" value={concentration} onChange={e => setConcentration(+e.target.value)}
                  className="w-full accent-blue-500 h-2 rounded-lg cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-medium text-slate-700">Zinc Mass Added</label>
                  <span className="font-bold text-slate-600">{znMass.toFixed(1)} g</span>
                </div>
                <input type="range" min="0.5" max="5.0" step="0.1" value={znMass} onChange={e => setZnMass(+e.target.value)}
                  className="w-full accent-slate-500 h-2 rounded-lg cursor-pointer" />
              </div>

              <div className="bg-slate-50 rounded-lg p-3 space-y-1 text-xs font-mono">
                <div className="flex justify-between"><span className="text-slate-500">Moles H₂SO₄:</span><span className="font-bold">{molesAcid.toFixed(4)} mol</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Moles Zn added:</span><span className="font-bold">{molesZn.toFixed(4)} mol</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Theo. yield ZnSO₄:</span><span className="font-bold text-emerald-700">{theoYieldZnSO4.toFixed(3)} g</span></div>
              </div>

              <div className={`rounded-lg p-3 text-center font-bold text-sm ${znExcess ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                {znExcess
                  ? `✓ Zinc is in EXCESS by ${((molesZn - molesAcid) * ZN_MW).toFixed(2)} g`
                  : `✗ Zinc is DEFICIENT — need ${((molesAcid - molesZn) * ZN_MW).toFixed(2)} g more`}
              </div>

              <button onClick={recordData}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-bold text-sm transition-colors">
                📋 Record Data Point
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: SVG Simulation */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col flex-1 min-h-[520px]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-800">Laboratory Simulation</h2>
              <div className="flex items-center gap-1">
                {['1', '2', '3'].map((lbl, i) => (
                  <button key={i} onClick={() => setStage(i)}
                    className={`w-7 h-7 rounded-full text-xs font-bold transition-colors ${stage === i ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            <svg viewBox="0 0 320 380" className="flex-1 w-full" style={{ maxHeight: 420 }}>
              <defs>
                <linearGradient id="zs-acidGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#fde047" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="zs-znso4Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d1fae5" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.7" />
                </linearGradient>
              </defs>

              {/* STAGE 0: REACTION */}
              {stage === 0 && (
                <g>
                  <rect x="20" y="340" width="280" height="12" rx="3" fill="#94a3b8" />
                  <line x1="120" y1="275" x2="100" y2="340" stroke="#475569" strokeWidth="3" />
                  <line x1="200" y1="275" x2="220" y2="340" stroke="#475569" strokeWidth="3" />
                  <rect x="60" y="20" width="200" height="30" rx="6" fill="#f0fdf4" stroke="#86efac" />
                  <text x="160" y="41" textAnchor="middle" fontSize="13" fill="#166534" fontWeight="bold">Stage 1: Acid + Zinc</text>
                  <path d="M105 185 L100 275 L220 275 L215 185 Z" fill="none" stroke="#94a3b8" strokeWidth="3" />
                  <rect x="102" y="180" width="116" height="10" rx="3" fill="#cbd5e1" />
                  <path d="M107 225 L107 271 L213 271 L213 225 Q160 220 107 225 Z" fill="url(#zs-acidGrad)" />
                  <rect x="120" y="248" width="80" height="16" rx="4" fill="#fbbf24" opacity="0.7" />
                  <text x="160" y="260" textAnchor="middle" fontSize="8" fill="#78350f" fontWeight="bold">H₂SO₄ {concentration.toFixed(2)} mol/dm³</text>
                  {[0, 1, 2].map(i => (
                    <g key={i} transform={`translate(${128 + i * 22}, 188)`}>
                      <rect x="-5" y="0" width="10" height="50" rx="2" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" />
                      <rect x="-4" y="1" width="8" height="5" rx="1" fill="#e2e8f0" opacity="0.6" />
                    </g>
                  ))}
                  {znExcess && [...Array(9)].map((_, i) => {
                    const bx = 118 + (i * 11) + (bubblePhase % 11);
                    const by = 228 + ((bubblePhase * 3 + i * 19) % 42);
                    return <circle key={i} cx={bx} cy={by} r={1.5 + (i % 3)} fill="none" stroke="#60a5fa" strokeWidth="1" opacity={0.5 + 0.3 * Math.sin(bubblePhase * 0.15 + i)} />;
                  })}
                  {znExcess && <text x="240" y="215" fontSize="11" fill="#3b82f6" fontWeight="bold">H₂↑</text>}
                  {!znExcess && <text x="160" y="170" textAnchor="middle" fontSize="9" fill="#dc2626">⚠ Add more zinc!</text>}
                  <text x="160" y="296" textAnchor="middle" fontSize="8" fill="#475569">{volume} cm³ of H₂SO₄ acid</text>
                </g>
              )}

              {/* STAGE 1: FILTRATION */}
              {stage === 1 && (
                <g>
                  <rect x="20" y="340" width="280" height="12" rx="3" fill="#94a3b8" />
                  <rect x="55" y="20" width="210" height="30" rx="6" fill="#f0fdf4" stroke="#86efac" />
                  <text x="160" y="41" textAnchor="middle" fontSize="13" fill="#166534" fontWeight="bold">Stage 2: Filtration</text>
                  <line x1="160" y1="105" x2="160" y2="340" stroke="#475569" strokeWidth="4" />
                  <line x1="110" y1="195" x2="210" y2="195" stroke="#475569" strokeWidth="3" />
                  <rect x="148" y="100" width="24" height="10" rx="3" fill="#374151" />
                  <path d="M100 118 L220 118 L185 205 L135 205 Z" fill="#e0f2fe" stroke="#7dd3fc" strokeWidth="2" />
                  <path d="M105 123 L215 123 L183 202 L137 202 Z" fill="white" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2" />
                  <ellipse cx="160" cy="168" rx="18" ry="6" fill="#9ca3af" opacity="0.85" />
                  <text x="160" y="153" textAnchor="middle" fontSize="8" fill="#374151">Excess Zn on filter</text>
                  <path d="M155 205 L165 205 L163 235 L157 235 Z" fill="#7dd3fc" stroke="#38bdf8" strokeWidth="1" />
                  {[0, 1].map(i => (
                    <ellipse key={i} cx="160" cy={242 + (bubblePhase * 2 + i * 28) % 28} rx="2" ry="3" fill="#6ee7b7" opacity="0.8" />
                  ))}
                  <path d="M118 260 L113 336 L207 336 L202 260 Z" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
                  <path d="M120 285 L120 333 L200 333 L200 285 Q160 280 120 285 Z" fill="url(#zs-znso4Grad)" opacity="0.9" />
                  <text x="160" y="313" textAnchor="middle" fontSize="8" fill="#065f46" fontWeight="bold">ZnSO₄(aq) filtrate</text>
                </g>
              )}

              {/* STAGE 2: CRYSTALLISATION */}
              {stage === 2 && (
                <g>
                  <rect x="20" y="340" width="280" height="12" rx="3" fill="#94a3b8" />
                  <rect x="50" y="20" width="220" height="30" rx="6" fill="#f0fdf4" stroke="#86efac" />
                  <text x="160" y="41" textAnchor="middle" fontSize="13" fill="#166534" fontWeight="bold">Stage 3: Crystallisation</text>
                  <line x1="115" y1="306" x2="95" y2="338" stroke="#475569" strokeWidth="3" />
                  <line x1="205" y1="306" x2="225" y2="338" stroke="#475569" strokeWidth="3" />
                  <rect x="95" y="302" width="130" height="6" rx="2" fill="#9ca3af" />
                  <path d="M98 238 Q98 308 160 312 Q222 308 222 238 Z" fill="none" stroke="#94a3b8" strokeWidth="3" />
                  <path d="M93 236 L227 236" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                  <path d="M102 240 Q102 304 160 307 Q218 304 218 240 Z" fill="url(#zs-znso4Grad)" opacity="0.85" />
                  {[...Array(14)].map((_, i) => {
                    const cx = 122 + (i % 7) * 14;
                    const cy = 285 - Math.floor(i / 7) * 14;
                    const sz = 5 + (bubblePhase % 4);
                    return <polygon key={i} points={`${cx},${cy - sz} ${cx + sz * 0.8},${cy + sz * 0.5} ${cx - sz * 0.8},${cy + sz * 0.5}`} fill="white" stroke="#6ee7b7" strokeWidth="1" opacity="0.9" />;
                  })}
                  {[0, 1, 2].map(i => (
                    <path key={i} d={`M ${148 + i * 14} 235 Q ${152 + i * 14} ${222 - (bubblePhase * 2 + i * 18) % 28} ${147 + i * 14} ${205 - (bubblePhase * 2 + i * 18) % 28}`}
                      fill="none" stroke="#e0f2fe" strokeWidth="2" opacity="0.6" />
                  ))}
                  <rect x="143" y="316" width="34" height="20" rx="4" fill="#374151" />
                  <rect x="151" y="312" width="18" height="8" rx="2" fill="#475569" />
                  <ellipse cx="160" cy="307" rx="10" ry={4 + (bubblePhase % 4)} fill="#f97316" opacity="0.7" />
                  <ellipse cx="160" cy="304" rx="6" ry={3 + (bubblePhase % 3)} fill="#fbbf24" opacity="0.8" />
                  <rect x="88" y="62" width="164" height="38" rx="8" fill="#ecfdf5" stroke="#34d399" strokeWidth="1.5" />
                  <text x="170" y="81" textAnchor="middle" fontSize="9" fill="#065f46">Theoretical yield:</text>
                  <text x="170" y="96" textAnchor="middle" fontSize="12" fill="#059669" fontWeight="bold">{theoYieldZnSO4.toFixed(3)} g ZnSO₄</text>
                  <text x="160" y="268" textAnchor="middle" fontSize="8" fill="#065f46">White ZnSO₄ crystals forming</text>
                  <text x="160" y="194" textAnchor="middle" fontSize="8" fill="#7dd3fc">H₂O evaporating</text>
                </g>
              )}

              {stage < 2 && (
                <g onClick={() => setStage(s => s + 1)} style={{ cursor: 'pointer' }}>
                  <rect x="230" y="352" width="76" height="20" rx="5" fill="#059669" />
                  <text x="268" y="366" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">Next Stage →</text>
                </g>
              )}
              {stage > 0 && (
                <g onClick={() => setStage(s => s - 1)} style={{ cursor: 'pointer' }}>
                  <rect x="14" y="352" width="76" height="20" rx="5" fill="#64748b" />
                  <text x="52" y="366" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">← Back</text>
                </g>
              )}
              {[0, 1, 2].map(i => (
                <circle key={i} cx={148 + i * 14} cy={360} r="4" fill={stage === i ? '#059669' : '#cbd5e1'} stroke="white" strokeWidth="1" />
              ))}
            </svg>

            <p className="text-xs text-slate-400 text-center mt-1 min-h-[16px]">
              {['Zinc strips react with H₂SO₄; H₂ gas bubbles vigorously; excess Zn sinks to bottom.',
                'Gravity filtration: excess Zn remains on filter paper; clear ZnSO₄ solution passes through.',
                'Gentle evaporation over Bunsen burner: white anhydrous ZnSO₄ crystals form.'][stage]}
            </p>
          </div>
        </div>

        {/* Column 3: Data, Graph, Assessment */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="font-bold text-slate-800 mb-3 border-b pb-2">📊 Data Log</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="py-1.5 px-1">V (cm³)</th>
                    <th className="py-1.5 px-1">C (M)</th>
                    <th className="py-1.5 px-1">n(acid)</th>
                    <th className="py-1.5 px-1">n(Zn)</th>
                    <th className="py-1.5 px-1">Theo (g)</th>
                    <th className="py-1.5 px-1">Act (g)</th>
                  </tr>
                </thead>
                <tbody>
                  {dataRows.length === 0 && (
                    <tr><td colSpan={6} className="py-4 text-slate-400 italic">No data recorded yet</td></tr>
                  )}
                  {dataRows.map((r, i) => (
                    <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="py-1 font-mono">{r.v}</td>
                      <td className="py-1 font-mono">{r.c.toFixed(2)}</td>
                      <td className="py-1 font-mono text-blue-600">{r.molesAcid.toFixed(3)}</td>
                      <td className="py-1 font-mono text-slate-600">{r.molesZn.toFixed(3)}</td>
                      <td className="py-1 font-mono text-emerald-700">{r.theoYield.toFixed(2)}</td>
                      <td className="py-1 font-mono text-orange-600">{r.actYield.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="font-bold text-slate-800 mb-1">📈 Yield vs. Volume Graph</h2>
            <p className="text-xs text-slate-500 mb-2">Actual ZnSO₄ yield (g) vs H₂SO₄ volume (cm³)</p>
            <svg viewBox="0 0 280 185" className="w-full border border-slate-100 rounded bg-slate-50">
              <line x1="30" y1="10" x2="30" y2="165" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="30" y1="165" x2="265" y2="165" stroke="#94a3b8" strokeWidth="1.5" />
              {[0, 25, 50, 75, 100].map(pct => {
                const y = 165 - (pct / 100) * 140;
                return (
                  <g key={pct}>
                    <line x1="26" y1={y} x2="30" y2={y} stroke="#94a3b8" />
                    <text x="24" y={y + 3} textAnchor="end" fontSize="7" fill="#64748b">{(maxY * pct / 100).toFixed(1)}</text>
                    <line x1="30" y1={y} x2="265" y2={y} stroke="#e2e8f0" />
                  </g>
                );
              })}
              {[10, 20, 30, 40, 50].map(v => {
                const x = toSvgX(v);
                return (
                  <g key={v}>
                    <line x1={x} y1="165" x2={x} y2="169" stroke="#94a3b8" />
                    <text x={x} y="177" textAnchor="middle" fontSize="7" fill="#64748b">{v}</text>
                    <line x1={x} y1="10" x2={x} y2="165" stroke="#e2e8f0" />
                  </g>
                );
              })}
              <text x="147" y="185" textAnchor="middle" fontSize="8" fill="#475569">Volume H₂SO₄ (cm³)</text>
              <text transform="rotate(-90)" x="-90" y="12" textAnchor="middle" fontSize="8" fill="#475569">ZnSO₄ Yield (g)</text>
              {graphPoints.length > 1 && bfSlope > 0 && (
                <line x1={toSvgX(10)} y1={toSvgY(bfSlope * 10)} x2={toSvgX(50)} y2={toSvgY(bfSlope * 50)}
                  stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.6" />
              )}
              {graphPoints.map((pt, i) => (
                <circle key={i} cx={toSvgX(pt.x)} cy={toSvgY(pt.y)} r="4" fill="#059669" stroke="white" strokeWidth="1" opacity="0.9" />
              ))}
              {graphPoints.length === 0 && (
                <text x="147" y="92" textAnchor="middle" fontSize="9" fill="#cbd5e1">Record data to plot</text>
              )}
            </svg>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="font-bold text-slate-800 mb-2 border-b pb-2">🎓 Assessment Question</h2>
            <div className="text-sm text-slate-700 space-y-2">
              <p>A student uses <strong>{mysteryV} cm³</strong> of H₂SO₄ at <strong>{mysteryC} mol/dm³</strong> with excess zinc.</p>
              <p className="text-xs text-slate-500">Calculate the theoretical yield of ZnSO₄ in grams. M(ZnSO₄) = 161.47 g/mol. Give answer to 2 d.p.</p>
              <div className="flex gap-2 mt-2">
                <input type="number" step="0.01" value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
                  placeholder="Yield (g)" className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-emerald-500" />
                <button onClick={checkAnswer} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-medium text-sm transition-colors">
                  Check
                </button>
              </div>
              {feedback && (
                <div className={`p-3 rounded-lg text-xs ${feedback.ok ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {feedback.ok ? '✅ ' : '❌ '}{feedback.msg}
                </div>
              )}
            </div>
            <div className="mt-3 bg-slate-50 rounded-lg p-2 text-xs text-slate-500">
              <p className="font-semibold text-slate-600 mb-1">Formula reminder:</p>
              <p>n(H₂SO₄) = V(dm³) × C &nbsp;→&nbsp; n(ZnSO₄) = n(H₂SO₄) &nbsp;→&nbsp; mass = n × 161.47 g/mol</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
