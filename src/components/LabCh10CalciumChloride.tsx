import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, FlaskConical } from 'lucide-react';

interface LabProps { onExit?: () => void; }

const CACO3_MW = 100.09;
const CACL2_MW = 111.0;
const CO2_MW = 44.01;

function withNoise(val: number, pct = 0.05): number {
  return val * (1 + (Math.random() - 0.5) * 2 * pct);
}

export default function LabCh10CalciumChloride({ onExit }: LabProps) {
  const [volume, setVolume] = useState(25);           // cm³
  const [concentration, setConcentration] = useState(1.0); // mol/dm³
  const [massAdded, setMassAdded] = useState(2.0);    // g CaCO3 added
  const [stage, setStage] = useState(0);
  const [bubblePhase, setBubblePhase] = useState(0);
  const [dataRows, setDataRows] = useState<{
    v: number; c: number; molesHCl: number; molesCaCO3Needed: number;
    molesCO2: number; massAddedVal: number; theoYieldCaCl2: number; actYieldCaCl2: number;
  }[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  // Mystery assessment
  const mysteryV = 30;
  const mysteryC = 1.5;

  const molesHCl = (volume / 1000) * concentration;
  const molesCaCO3Needed = molesHCl / 2;       // CaCO3 + 2HCl → 1:2 ratio
  const massCaCO3Needed = molesCaCO3Needed * CACO3_MW;
  const molesCO2 = molesCaCO3Needed;             // 1 mol CO2 per mol CaCO3
  const theoYieldCaCl2 = molesCaCO3Needed * CACL2_MW;
  const massAddedMoles = massAdded / CACO3_MW;
  const acidConsumed = Math.min(massAddedMoles, molesCaCO3Needed); // limited by whichever runs out
  const fractionReacted = molesCaCO3Needed > 0 ? Math.min(1, massAddedMoles / molesCaCO3Needed) : 0;
  const co2EvolvedPartial = acidConsumed * CO2_MW; // grams
  const reactionComplete = massAddedMoles >= molesCaCO3Needed;

  useEffect(() => {
    const id = setInterval(() => setBubblePhase(p => (p + 1) % 60), 80);
    return () => clearInterval(id);
  }, []);

  const recordData = () => {
    const actYieldCaCl2 = withNoise(fractionReacted * theoYieldCaCl2, 0.05);
    setDataRows(prev => [
      ...prev,
      {
        v: volume, c: concentration,
        molesHCl: +molesHCl.toFixed(4),
        molesCaCO3Needed: +molesCaCO3Needed.toFixed(4),
        molesCO2: +(acidConsumed).toFixed(4),
        massAddedVal: massAdded,
        theoYieldCaCl2: +theoYieldCaCl2.toFixed(3),
        actYieldCaCl2: +actYieldCaCl2.toFixed(3),
      }
    ]);
  };

  const reset = () => {
    setVolume(25); setConcentration(1.0); setMassAdded(2.0);
    setStage(0); setDataRows([]); setUserAnswer(''); setFeedback(null);
  };

  const checkAnswer = () => {
    const expectedMolesHCl = (mysteryV / 1000) * mysteryC;
    const expectedMolesCO2 = expectedMolesHCl / 2;
    const expectedYield = expectedMolesCO2 * CACL2_MW;
    const val = parseFloat(userAnswer);
    if (isNaN(val)) { setFeedback({ ok: false, msg: 'Enter a valid number.' }); return; }
    if (Math.abs(val - expectedYield) <= 0.5) {
      setFeedback({ ok: true, msg: `Correct! n(HCl)=${expectedMolesHCl.toFixed(3)} mol; n(CaCO₃)=${expectedMolesCO2.toFixed(3)} mol; n(CaCl₂)=${expectedMolesCO2.toFixed(3)} mol; yield=${expectedYield.toFixed(2)} g. Excellent!` });
    } else {
      setFeedback({ ok: false, msg: `Not quite. n(HCl)=(${mysteryV}/1000)×${mysteryC}=${expectedMolesHCl.toFixed(3)} mol; n(CaCO₃)=n(HCl)/2=${expectedMolesCO2.toFixed(3)} mol; yield=n×111.0=${expectedYield.toFixed(2)} g.` });
    }
  };

  // Graph: CO2 evolved vs CaCO3 added — plateau when acid exhausted
  const graphDataPoints = dataRows.map(r => ({ x: r.massAddedVal, y: r.molesCO2 }));
  const maxX = 5.0;
  const maxY = Math.max(0.2, ...graphDataPoints.map(p => p.y), molesCO2 * 1.1);
  const gToSvgX = (m: number) => (m / maxX) * 220 + 30;
  const gToSvgY = (y: number) => 160 - (y / maxY) * 140;

  // Theoretical plateau line
  const plateauMass = massCaCO3Needed;
  const plateauMoles = molesCO2;

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          {onExit && (
            <button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
          )}
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">Activity 6.4 — Preparation of CaCl₂ (Excess CaCO₃ Method)</h1>
            <p className="text-xs text-slate-500">CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂ &nbsp;|&nbsp; Grade 10 Chemistry</p>
          </div>
        </div>
        <button onClick={reset} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
          <RefreshCw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* 3-Column Grid */}
      <div className="flex-1 p-4 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Column 1: Theory & Controls */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="font-bold text-slate-800 mb-3 border-b pb-2 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-teal-600" /> Theory
            </h2>
            <div className="text-sm text-slate-600 space-y-2">
              <p>Calcium carbonate (limestone) reacts with hydrochloric acid:</p>
              <div className="bg-teal-50 border border-teal-200 rounded p-2 font-mono text-center text-sm font-bold text-teal-800">
                CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑
              </div>
              <p><strong>Excess CaCO₃</strong> ensures all HCl is consumed. When bubbling stops and white solid remains, the acid is fully reacted.</p>
              <div className="bg-slate-100 rounded p-2 text-xs space-y-1">
                <div className="font-semibold">Molar masses:</div>
                <div>CaCO₃ = 100.09 g/mol &nbsp;|&nbsp; HCl = 36.46 g/mol</div>
                <div>CaCl₂ = 111.0 g/mol &nbsp;|&nbsp; CO₂ = 44.01 g/mol</div>
                <div className="mt-1 font-semibold">Molar ratio CaCO₃ : HCl = 1 : 2</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-800">
                <strong>Key observation:</strong> CO₂ bubbles stop when all HCl is consumed, even if CaCO₃ remains.
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="font-bold text-slate-800 mb-3 border-b pb-2">Experiment Controls</h2>
            <div className="space-y-4 text-sm">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-medium text-slate-700">HCl Volume</label>
                  <span className="font-bold text-teal-600">{volume} cm³</span>
                </div>
                <input type="range" min="10" max="50" step="1" value={volume} onChange={e => setVolume(+e.target.value)}
                  className="w-full accent-teal-500 h-2 rounded-lg cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-medium text-slate-700">HCl Concentration</label>
                  <span className="font-bold text-teal-600">{concentration.toFixed(2)} mol/dm³</span>
                </div>
                <input type="range" min="0.1" max="2.0" step="0.05" value={concentration} onChange={e => setConcentration(+e.target.value)}
                  className="w-full accent-teal-500 h-2 rounded-lg cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-medium text-slate-700">CaCO₃ Mass Added</label>
                  <span className="font-bold text-slate-600">{massAdded.toFixed(1)} g</span>
                </div>
                <input type="range" min="0.1" max="5.0" step="0.1" value={massAdded} onChange={e => setMassAdded(+e.target.value)}
                  className="w-full accent-slate-500 h-2 rounded-lg cursor-pointer" />
              </div>

              <div className="bg-slate-50 rounded-lg p-3 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between"><span className="text-slate-500">n(HCl):</span><span className="font-bold">{molesHCl.toFixed(4)} mol</span></div>
                <div className="flex justify-between"><span className="text-slate-500">n(CaCO₃) needed:</span><span className="font-bold text-teal-700">{molesCaCO3Needed.toFixed(4)} mol</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Mass CaCO₃ needed:</span><span className="font-bold text-teal-700">{massCaCO3Needed.toFixed(3)} g</span></div>
                <div className="flex justify-between"><span className="text-slate-500">n(CO₂) evolved:</span><span className="font-bold text-orange-600">{acidConsumed.toFixed(4)} mol</span></div>
                <div className="border-t border-slate-200 pt-1 flex justify-between">
                  <span className="text-slate-500">Theo. yield CaCl₂:</span>
                  <span className="font-bold text-teal-800">{theoYieldCaCl2.toFixed(3)} g</span>
                </div>
              </div>

              {/* Reaction status */}
              <div className={`rounded-lg p-3 text-center font-bold text-sm ${reactionComplete ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                {reactionComplete
                  ? `✓ Acid fully consumed — excess CaCO₃ remains (${(massAdded - massCaCO3Needed).toFixed(2)} g)`
                  : `⚡ Reaction ${(fractionReacted * 100).toFixed(0)}% complete — add more CaCO₃`}
              </div>

              {/* CO2 gauge */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="text-xs text-orange-700 font-semibold mb-2">CO₂ Evolution Rate</div>
                <div className="w-full bg-orange-100 rounded-full h-3">
                  <div className="bg-orange-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${fractionReacted * 100}%` }} />
                </div>
                <div className="flex justify-between text-xs text-orange-600 mt-1">
                  <span>0</span>
                  <span className="font-bold">{(acidConsumed * CO2_MW).toFixed(2)} g CO₂</span>
                  <span>{(molesCO2 * CO2_MW).toFixed(2)} g max</span>
                </div>
              </div>

              <button onClick={recordData}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg font-bold text-sm transition-colors">
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
                    className={`w-7 h-7 rounded-full text-xs font-bold transition-colors ${stage === i ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            <svg viewBox="0 0 320 400" className="flex-1 w-full" style={{ maxHeight: 440 }}>
              <defs>
                <linearGradient id="cc-acid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f0fdf4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#d1fae5" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="cc-cacl2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f0fdf4" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="cc-filtrate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ecfdf5" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.7" />
                </linearGradient>
              </defs>

              {/* STAGE 0: REACTION */}
              {stage === 0 && (
                <g>
                  <rect x="20" y="355" width="280" height="12" rx="3" fill="#94a3b8" />
                  <rect x="50" y="15" width="220" height="30" rx="6" fill="#f0fdf4" stroke="#6ee7b7" />
                  <text x="160" y="36" textAnchor="middle" fontSize="13" fill="#065f46" fontWeight="bold">Stage 1: CaCO₃ + HCl Reaction</text>

                  {/* Conical flask */}
                  <path d="M135 155 L105 295 L215 295 L185 155 Z" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
                  <rect x="132" y="148" width="56" height="12" rx="4" fill="#cbd5e1" />
                  {/* HCl liquid */}
                  <path d="M108 235 L108 292 L212 292 L212 235 Q160 230 108 235 Z" fill="url(#cc-acid)" />
                  {/* Label */}
                  <rect x="120" y="255" width="80" height="18" rx="4" fill="#6ee7b7" opacity="0.6" />
                  <text x="160" y="268" textAnchor="middle" fontSize="8" fill="#065f46" fontWeight="bold">HCl {concentration.toFixed(2)} mol/dm³</text>

                  {/* CaCO3 chunks */}
                  {[...Array(5)].map((_, i) => {
                    const cx = 125 + (i % 3) * 22 + Math.sin(i) * 5;
                    const cy = 245 + Math.floor(i / 3) * 18;
                    return (
                      <g key={i}>
                        <polygon points={`${cx},${cy - 8} ${cx + 9},${cy + 2} ${cx + 5},${cy + 9} ${cx - 5},${cy + 9} ${cx - 9},${cy + 2}`}
                          fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                        <polygon points={`${cx},${cy - 5} ${cx + 6},${cy} ${cx + 3},${cy + 5} ${cx - 3},${cy + 5} ${cx - 6},${cy}`}
                          fill="white" opacity="0.4" />
                      </g>
                    );
                  })}

                  {/* CO2 bubbles — rate proportional to fractionReacted */}
                  {fractionReacted > 0 && [...Array(Math.round(10 * fractionReacted))].map((_, i) => {
                    const bx = 118 + (i % 5) * 18 + ((bubblePhase + i * 13) % 18);
                    const by = 244 - ((bubblePhase * 3 + i * 21) % 60);
                    const r = 1.5 + (i % 3);
                    return (
                      <circle key={i} cx={bx} cy={by} r={r} fill="none"
                        stroke={reactionComplete ? "#d1d5db" : "#f97316"}
                        strokeWidth="1" opacity={0.5 + 0.4 * Math.sin(bubblePhase * 0.2 + i)} />
                    );
                  })}
                  {fractionReacted > 0 && !reactionComplete && (
                    <text x="240" y="215" fontSize="10" fill="#f97316" fontWeight="bold">CO₂↑</text>
                  )}
                  {reactionComplete && (
                    <text x="238" y="215" fontSize="8" fill="#6b7280" textAnchor="middle">No more</text>
                  )}
                  {reactionComplete && (
                    <text x="238" y="226" fontSize="8" fill="#6b7280" textAnchor="middle">bubbles ✓</text>
                  )}

                  {/* CO2 rising from neck */}
                  {fractionReacted > 0 && !reactionComplete && [...Array(3)].map(i => (
                    <path key={i} d={`M ${152 + i * 10} 148 Q ${155 + i * 10} ${130 - (bubblePhase + i * 18) % 30} ${152 + i * 10} ${110 - (bubblePhase + i * 18) % 30}`}
                      fill="none" stroke="#fdba74" strokeWidth="2" opacity="0.6" />
                  ))}

                  {/* Volume annotation */}
                  <line x1="105" y1="235" x2="93" y2="235" stroke="#14b8a6" strokeWidth="1" />
                  <line x1="105" y1="292" x2="93" y2="292" stroke="#14b8a6" strokeWidth="1" />
                  <line x1="98" y1="235" x2="98" y2="292" stroke="#14b8a6" strokeWidth="1" />
                  <text x="86" y="265" textAnchor="middle" fontSize="7" fill="#14b8a6">{volume}cm³</text>

                  {/* Reaction status overlay */}
                  <rect x="60" y="308" width="200" height="38" rx="7" fill={reactionComplete ? "#dcfce7" : "#fff7ed"} stroke={reactionComplete ? "#4ade80" : "#fb923c"} strokeWidth="1.5" />
                  <text x="160" y="325" textAnchor="middle" fontSize="9" fill={reactionComplete ? "#166534" : "#9a3412"} fontWeight="bold">
                    {reactionComplete ? "✓ All HCl consumed — CaCO₃ in excess" : `Reaction ${(fractionReacted * 100).toFixed(0)}% complete`}
                  </text>
                  <text x="160" y="340" textAnchor="middle" fontSize="8" fill={reactionComplete ? "#15803d" : "#ea580c"}>
                    {reactionComplete ? `Excess CaCO₃: ${(massAdded - massCaCO3Needed).toFixed(2)} g` : `Need ${(massCaCO3Needed - massAdded).toFixed(2)} g more CaCO₃`}
                  </text>
                </g>
              )}

              {/* STAGE 1: FILTRATION */}
              {stage === 1 && (
                <g>
                  <rect x="20" y="355" width="280" height="12" rx="3" fill="#94a3b8" />
                  <rect x="50" y="15" width="220" height="30" rx="6" fill="#f0fdf4" stroke="#6ee7b7" />
                  <text x="160" y="36" textAnchor="middle" fontSize="13" fill="#065f46" fontWeight="bold">Stage 2: Filtration</text>
                  <line x1="160" y1="108" x2="160" y2="355" stroke="#475569" strokeWidth="4" />
                  <line x1="108" y1="200" x2="212" y2="200" stroke="#475569" strokeWidth="3" />
                  <rect x="148" y="103" width="24" height="10" rx="3" fill="#374151" />
                  <path d="M100 122 L220 122 L186 212 L134 212 Z" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="2" />
                  <path d="M104 127 L215 127 L183 208 L137 208 Z" fill="white" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2" />
                  {/* White CaCO3 residue on paper */}
                  {[...Array(5)].map((_, i) => {
                    const px = 140 + (i % 3) * 13;
                    const py = 163 + Math.floor(i / 3) * 12;
                    return <polygon key={i} points={`${px},${py - 6} ${px + 7},${py + 1} ${px + 4},${py + 7} ${px - 4},${py + 7} ${px - 7},${py + 1}`}
                      fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.8" />;
                  })}
                  <text x="160" y="150" textAnchor="middle" fontSize="8" fill="#374151">Unreacted CaCO₃</text>
                  <path d="M154 212 L166 212 L164 244 L156 244 Z" fill="url(#cc-filtrate)" stroke="#34d399" strokeWidth="1" />
                  {[0, 1].map(i => (
                    <ellipse key={i} cx="160" cy={250 + (bubblePhase * 2 + i * 24) % 24} rx="2" ry="3" fill="#6ee7b7" opacity="0.85" />
                  ))}
                  <path d="M118 266 L113 340 L207 340 L202 266 Z" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
                  <path d="M120 290 L120 337 L200 337 L200 290 Q160 285 120 290 Z" fill="url(#cc-filtrate)" opacity="0.9" />
                  <text x="160" y="318" textAnchor="middle" fontSize="8" fill="#065f46" fontWeight="bold">CaCl₂(aq) — colourless</text>
                  <text x="160" y="260" textAnchor="middle" fontSize="8" fill="#047857">Clear colourless filtrate</text>
                </g>
              )}

              {/* STAGE 2: CRYSTALLISATION */}
              {stage === 2 && (
                <g>
                  <rect x="20" y="355" width="280" height="12" rx="3" fill="#94a3b8" />
                  <rect x="45" y="15" width="230" height="30" rx="6" fill="#f0fdf4" stroke="#6ee7b7" />
                  <text x="160" y="36" textAnchor="middle" fontSize="12" fill="#065f46" fontWeight="bold">Stage 3: Evaporation & Crystallisation</text>

                  {/* Tripod & gauze */}
                  <line x1="115" y1="305" x2="95" y2="355" stroke="#475569" strokeWidth="3" />
                  <line x1="205" y1="305" x2="225" y2="355" stroke="#475569" strokeWidth="3" />
                  <rect x="95" y="301" width="130" height="6" rx="2" fill="#9ca3af" />

                  {/* Evaporating dish */}
                  <path d="M98 238 Q98 308 160 313 Q222 308 222 238 Z" fill="none" stroke="#94a3b8" strokeWidth="3" />
                  <path d="M93 236 L227 236" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                  {/* Colourless liquid */}
                  <path d="M102 240 Q102 305 160 308 Q218 305 218 240 Z" fill="url(#cc-cacl2)" opacity="0.85" />

                  {/* White CaCl2 crystals forming */}
                  {[...Array(14)].map((_, i) => {
                    const cx = 120 + (i % 7) * 14;
                    const cy = 286 - Math.floor(i / 7) * 13;
                    const grow = Math.min(1, (bubblePhase % 60) / 32);
                    const sz = 6 * grow;
                    return (
                      <g key={i}>
                        <rect x={cx - sz / 2} y={cy - sz / 2} width={sz} height={sz}
                          fill="white" stroke="#94a3b8" strokeWidth="0.7" opacity="0.95"
                          transform={`rotate(${30 + i * 15} ${cx} ${cy})`} />
                      </g>
                    );
                  })}

                  {/* Steam */}
                  {[0, 1, 2].map(i => (
                    <path key={i} d={`M ${146 + i * 14} 235 Q ${150 + i * 14} ${220 - (bubblePhase * 2 + i * 18) % 28} ${147 + i * 14} ${203 - (bubblePhase * 2 + i * 18) % 28}`}
                      fill="none" stroke="#d1fae5" strokeWidth="2" opacity="0.6" />
                  ))}

                  {/* Bunsen */}
                  <rect x="143" y="316" width="34" height="20" rx="4" fill="#374151" />
                  <rect x="151" y="312" width="18" height="8" rx="2" fill="#475569" />
                  <ellipse cx="160" cy="306" rx="10" ry={4 + (bubblePhase % 4)} fill="#f97316" opacity="0.7" />
                  <ellipse cx="160" cy="303" rx="6" ry={3 + (bubblePhase % 3)} fill="#fbbf24" opacity="0.8" />

                  {/* Yield box */}
                  <rect x="85" y="60" width="150" height="50" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
                  <text x="160" y="80" textAnchor="middle" fontSize="9" fill="#065f46">Theoretical yield CaCl₂:</text>
                  <text x="160" y="96" textAnchor="middle" fontSize="12" fill="#047857" fontWeight="bold">{theoYieldCaCl2.toFixed(3)} g</text>
                  <text x="160" y="108" textAnchor="middle" fontSize="8" fill="#6ee7b7">White anhydrous crystals</text>

                  <text x="160" y="264" textAnchor="middle" fontSize="8" fill="#065f46">CaCl₂ white crystals forming</text>
                  <text x="160" y="193" textAnchor="middle" fontSize="8" fill="#6ee7b7">H₂O vapour evaporating</text>
                </g>
              )}

              {/* Navigation */}
              {stage < 2 && (
                <g onClick={() => setStage(s => s + 1)} style={{ cursor: 'pointer' }}>
                  <rect x="230" y="368" width="76" height="20" rx="5" fill="#0d9488" />
                  <text x="268" y="382" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">Next Stage →</text>
                </g>
              )}
              {stage > 0 && (
                <g onClick={() => setStage(s => s - 1)} style={{ cursor: 'pointer' }}>
                  <rect x="14" y="368" width="76" height="20" rx="5" fill="#64748b" />
                  <text x="52" y="382" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">← Back</text>
                </g>
              )}
              {[0, 1, 2].map(i => (
                <circle key={i} cx={148 + i * 14} cy={376} r="4" fill={stage === i ? '#0d9488' : '#cbd5e1'} stroke="white" strokeWidth="1" />
              ))}
            </svg>

            <p className="text-xs text-slate-400 text-center mt-1 min-h-[16px]">
              {['CaCO₃ chunks added to HCl; vigorous CO₂ bubbles; bubbles stop when acid exhausted.',
                'Filtration removes unreacted CaCO₃; clear colourless CaCl₂ solution passes through.',
                'Gentle evaporation: white anhydrous CaCl₂ crystals form on cooling.'][stage]}
            </p>
          </div>
        </div>

        {/* Column 3: Data, Graph, Assessment */}
        <div className="flex flex-col gap-4">
          {/* Data Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="font-bold text-slate-800 mb-3 border-b pb-2">📊 Data Log</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="py-1.5 px-1">V (cm³)</th>
                    <th className="py-1.5 px-1">C (M)</th>
                    <th className="py-1.5 px-1">n(HCl)</th>
                    <th className="py-1.5 px-1">n(CO₂)</th>
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
                      <td className="py-1 font-mono text-teal-700">{r.molesHCl.toFixed(3)}</td>
                      <td className="py-1 font-mono text-orange-600">{r.molesCO2.toFixed(3)}</td>
                      <td className="py-1 font-mono text-teal-800">{r.theoYieldCaCl2.toFixed(2)}</td>
                      <td className="py-1 font-mono text-slate-600">{r.actYieldCaCl2.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Graph: CO2 vs CaCO3 mass — plateau */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="font-bold text-slate-800 mb-1">📈 CO₂ Evolved vs CaCO₃ Added</h2>
            <p className="text-xs text-slate-500 mb-2">mol CO₂ vs mass CaCO₃ added (g) — note plateau</p>
            <svg viewBox="0 0 280 195" className="w-full border border-slate-100 rounded bg-slate-50">
              <line x1="30" y1="10" x2="30" y2="165" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="30" y1="165" x2="265" y2="165" stroke="#94a3b8" strokeWidth="1.5" />

              {/* Y ticks */}
              {[0, 25, 50, 75, 100].map(pct => {
                const y = 165 - (pct / 100) * 140;
                const val = (maxY * pct / 100).toFixed(3);
                return (
                  <g key={pct}>
                    <line x1="26" y1={y} x2="30" y2={y} stroke="#94a3b8" />
                    <text x="24" y={y + 3} textAnchor="end" fontSize="6.5" fill="#64748b">{val}</text>
                    <line x1="30" y1={y} x2="265" y2={y} stroke="#e2e8f0" />
                  </g>
                );
              })}

              {/* X ticks */}
              {[0, 1, 2, 3, 4, 5].map(m => {
                const x = gToSvgX(m);
                return (
                  <g key={m}>
                    <line x1={x} y1="165" x2={x} y2="169" stroke="#94a3b8" />
                    <text x={x} y="177" textAnchor="middle" fontSize="7" fill="#64748b">{m}</text>
                    <line x1={x} y1="10" x2={x} y2="165" stroke="#e2e8f0" />
                  </g>
                );
              })}

              <text x="147" y="190" textAnchor="middle" fontSize="8" fill="#475569">CaCO₃ added (g)</text>
              <text transform="rotate(-90)" x="-90" y="12" textAnchor="middle" fontSize="8" fill="#475569">n(CO₂) evolved (mol)</text>

              {/* Theoretical curve with plateau */}
              {plateauMass > 0 && plateauMoles > 0 && (
                <>
                  <line x1={gToSvgX(0)} y1={gToSvgY(0)} x2={gToSvgX(Math.min(plateauMass, maxX))} y2={gToSvgY(plateauMoles)}
                    stroke="#f97316" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.5" />
                  {plateauMass < maxX && (
                    <line x1={gToSvgX(plateauMass)} y1={gToSvgY(plateauMoles)} x2={gToSvgX(maxX)} y2={gToSvgY(plateauMoles)}
                      stroke="#f97316" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.5" />
                  )}
                  {plateauMass < maxX && (
                    <text x={gToSvgX(plateauMass) + 4} y={gToSvgY(plateauMoles) - 4} fontSize="7" fill="#f97316">Plateau</text>
                  )}
                </>
              )}

              {/* Data points */}
              {graphDataPoints.map((pt, i) => (
                <circle key={i} cx={gToSvgX(pt.x)} cy={gToSvgY(pt.y)} r="4" fill="#0d9488" stroke="white" strokeWidth="1" opacity="0.9" />
              ))}
              {graphDataPoints.length === 0 && (
                <text x="147" y="92" textAnchor="middle" fontSize="9" fill="#cbd5e1">Record data to plot</text>
              )}
            </svg>
            <p className="text-xs text-slate-500 mt-1">Dashed line = theoretical; plateau shows acid fully consumed</p>
          </div>

          {/* Assessment */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="font-bold text-slate-800 mb-2 border-b pb-2">🎓 Assessment Question</h2>
            <div className="text-sm text-slate-700 space-y-2">
              <p>A student reacts excess CaCO₃ with <strong>{mysteryV} cm³</strong> of HCl at <strong>{mysteryC} mol/dm³</strong>.</p>
              <p className="text-xs text-slate-500">Calculate (i) moles of CO₂ evolved and (ii) theoretical yield of CaCl₂ in grams. M(CaCl₂)=111.0 g/mol. Answer (ii) to 2 d.p.</p>
              <div className="flex gap-2 mt-2">
                <input type="number" step="0.01" value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
                  placeholder="CaCl₂ yield (g)" className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal-500" />
                <button onClick={checkAnswer} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-medium text-sm transition-colors">
                  Check
                </button>
              </div>
              {feedback && (
                <div className={`p-3 rounded-lg text-xs leading-relaxed ${feedback.ok ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {feedback.ok ? '✅ ' : '❌ '}{feedback.msg}
                </div>
              )}
            </div>
            <div className="mt-3 bg-slate-50 rounded-lg p-2 text-xs text-slate-500">
              <p className="font-semibold text-slate-600 mb-1">Formula reminder:</p>
              <p>n(HCl) = V(dm³) × C &nbsp;→&nbsp; n(CaCO₃) = n(HCl) ÷ 2 &nbsp;→&nbsp; n(CO₂) = n(CaCO₃) &nbsp;→&nbsp; n(CaCl₂) = n(CaCO₃) &nbsp;→&nbsp; mass = n × 111.0 g/mol</p>
            </div>
            <div className="mt-2 bg-teal-50 border border-teal-200 rounded-lg p-2 text-xs text-teal-800">
              <strong>Hint:</strong> The molar ratio is CaCO₃ : HCl = 1 : 2, so you need <em>half</em> as many moles of CaCO₃ as HCl.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
