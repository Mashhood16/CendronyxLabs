import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, FlaskConical } from 'lucide-react';

interface LabProps { onExit?: () => void; }

const CUO_MW = 79.55;
const CUSO4_5H2O_MW = 249.69;

function withNoise(val: number, pct = 0.04): number {
  return val * (1 + (Math.random() - 0.5) * 2 * pct);
}

export default function LabCh10CopperSulphate({ onExit }: LabProps) {
  const [volume, setVolume] = useState(25);
  const [concentration, setConcentration] = useState(0.5);
  const [stage, setStage] = useState(0);
  const [bubblePhase, setBubblePhase] = useState(0);
  const [dataRows, setDataRows] = useState<{ v: number; c: number; molesAcid: number; molesCuO: number; massCuO: number; theoYield: number; actYield: number }[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  // Mystery values for assessment
  const mysteryV = 40;
  const mysteryC = 0.65;

  const molesAcid = (volume / 1000) * concentration;
  const molesCuO = molesAcid; // 1:1
  const massCuO = molesCuO * CUO_MW;
  const theoYield = molesCuO * CUSO4_5H2O_MW;

  useEffect(() => {
    const id = setInterval(() => setBubblePhase(p => (p + 1) % 60), 80);
    return () => clearInterval(id);
  }, []);

  const recordData = () => {
    const actYield = withNoise(theoYield, 0.04);
    setDataRows(prev => [
      ...prev,
      {
        v: volume, c: concentration,
        molesAcid: +molesAcid.toFixed(4),
        molesCuO: +molesCuO.toFixed(4),
        massCuO: +massCuO.toFixed(3),
        theoYield: +theoYield.toFixed(3),
        actYield: +actYield.toFixed(3)
      }
    ]);
  };

  const reset = () => {
    setVolume(25); setConcentration(0.5);
    setStage(0); setDataRows([]); setUserAnswer(''); setFeedback(null);
  };

  const checkAnswer = () => {
    const expectedMoles = (mysteryV / 1000) * mysteryC;
    const expectedYield = expectedMoles * CUSO4_5H2O_MW;
    const val = parseFloat(userAnswer);
    if (isNaN(val)) { setFeedback({ ok: false, msg: 'Enter a valid number.' }); return; }
    if (Math.abs(val - expectedYield) <= 1.0) {
      setFeedback({ ok: true, msg: `Correct! n(CuO) = ${expectedMoles.toFixed(4)} mol; yield CuSO₄·5H₂O = ${expectedYield.toFixed(2)} g. Well done!` });
    } else {
      setFeedback({ ok: false, msg: `Not quite. n(H₂SO₄) = (${mysteryV}/1000) × ${mysteryC} = ${expectedMoles.toFixed(4)} mol = n(CuO). Mass = n × 249.69 ≈ ${expectedYield.toFixed(2)} g.` });
    }
  };

  // Graph: yield vs volume
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
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          {onExit && (
            <button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
          )}
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">Activity 6.3 — Preparation of CuSO₄·5H₂O (Excess CuO Method)</h1>
            <p className="text-xs text-slate-500">CuO + H₂SO₄ → CuSO₄ + H₂O &nbsp;|&nbsp; Grade 10 Chemistry</p>
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
              <FlaskConical className="w-4 h-4 text-blue-600" /> Theory
            </h2>
            <div className="text-sm text-slate-600 space-y-2">
              <p>Copper(II) oxide reacts with hot dilute sulphuric acid to produce copper(II) sulphate solution:</p>
              <div className="bg-blue-50 border border-blue-200 rounded p-2 font-mono text-center text-sm font-bold text-blue-800">
                CuO + H₂SO₄ → CuSO₄ + H₂O
              </div>
              <p><strong>Excess CuO</strong> (black powder) is added to ensure all the acid reacts. Black residue remaining after the reaction proves the acid is fully consumed.</p>
              <div className="bg-slate-100 rounded p-2 text-xs space-y-1">
                <div className="font-semibold">Molar masses:</div>
                <div>CuO = 79.55 g/mol &nbsp;|&nbsp; H₂SO₄ = 98.08 g/mol</div>
                <div>CuSO₄·5H₂O = 249.69 g/mol</div>
                <div className="mt-1 font-semibold">Molar ratio CuO : H₂SO₄ = 1 : 1</div>
              </div>
              <p className="text-xs text-slate-500">Theo. yield = n(H₂SO₄) × M(CuSO₄·5H₂O)</p>
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

              <div className="bg-slate-50 rounded-lg p-3 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between"><span className="text-slate-500">n(H₂SO₄):</span><span className="font-bold">{molesAcid.toFixed(4)} mol</span></div>
                <div className="flex justify-between"><span className="text-slate-500">n(CuO) needed:</span><span className="font-bold text-amber-700">{molesCuO.toFixed(4)} mol</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Mass CuO needed:</span><span className="font-bold text-amber-700">{massCuO.toFixed(3)} g</span></div>
                <div className="border-t border-slate-200 pt-1 flex justify-between">
                  <span className="text-slate-500">Theo. yield CuSO₄·5H₂O:</span>
                  <span className="font-bold text-blue-700">{theoYield.toFixed(3)} g</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <div className="text-xs text-blue-600 font-medium mb-1">CuO Mass to Add (excess: +20%)</div>
                <div className="text-xl font-bold text-blue-800">{(massCuO * 1.2).toFixed(2)} g</div>
                <div className="text-xs text-blue-500 mt-1">Black residue = proof all acid reacted</div>
              </div>

              <button onClick={recordData}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-bold text-sm transition-colors">
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
                    className={`w-7 h-7 rounded-full text-xs font-bold transition-colors ${stage === i ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            <svg viewBox="0 0 320 390" className="flex-1 w-full" style={{ maxHeight: 430 }}>
              <defs>
                <linearGradient id="cs-acid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="cs-deepsol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#1e40af" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="cs-filtrate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.8" />
                </linearGradient>
                <radialGradient id="cs-crystal" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.8" />
                </radialGradient>
              </defs>

              {/* STAGE 0: CuO ADDED TO ACID */}
              {stage === 0 && (
                <g>
                  <rect x="20" y="348" width="280" height="12" rx="3" fill="#94a3b8" />
                  <rect x="55" y="18" width="210" height="30" rx="6" fill="#eff6ff" stroke="#93c5fd" />
                  <text x="160" y="39" textAnchor="middle" fontSize="13" fill="#1e40af" fontWeight="bold">Stage 1: CuO + H₂SO₄</text>

                  {/* Bunsen + tripod */}
                  <line x1="115" y1="295" x2="95" y2="348" stroke="#475569" strokeWidth="3" />
                  <line x1="205" y1="295" x2="225" y2="348" stroke="#475569" strokeWidth="3" />
                  <rect x="95" y="292" width="130" height="6" rx="2" fill="#9ca3af" />
                  <rect x="143" y="310" width="34" height="18" rx="4" fill="#374151" />
                  <rect x="151" y="306" width="18" height="7" rx="2" fill="#475569" />
                  <ellipse cx="160" cy="299" rx="10" ry={4 + (bubblePhase % 4)} fill="#f97316" opacity="0.7" />
                  <ellipse cx="160" cy="296" rx="7" ry={3 + (bubblePhase % 3)} fill="#fbbf24" opacity="0.8" />

                  {/* Beaker */}
                  <path d="M105 178 L100 288 L220 288 L215 178 Z" fill="none" stroke="#94a3b8" strokeWidth="3" />
                  <rect x="102" y="172" width="116" height="10" rx="3" fill="#cbd5e1" />

                  {/* Solution turning deep blue */}
                  <path d="M107 215 L107 284 L213 284 L213 215 Q160 210 107 215 Z" fill="url(#cs-deepsol)" />

                  {/* Black CuO particles suspended/sinking */}
                  {[...Array(10)].map((_, i) => {
                    const px = 118 + (i % 5) * 19;
                    const py = 218 + Math.floor(i / 5) * 22 + (bubblePhase % 8);
                    return <ellipse key={i} cx={px} cy={py} rx="5" ry="3" fill="#1c1917" opacity="0.7" />;
                  })}
                  <text x="160" y="205" textAnchor="middle" fontSize="8" fill="#1e3a8a">Deep blue CuSO₄ solution</text>
                  <text x="245" y="245" fontSize="8" fill="#1c1917" textAnchor="middle">Black</text>
                  <text x="245" y="255" fontSize="8" fill="#1c1917" textAnchor="middle">CuO↓</text>

                  {/* Steam from hot acid */}
                  {[0, 1, 2].map(i => (
                    <path key={i} d={`M ${145 + i * 14} 172 Q ${148 + i * 14} ${158 - (bubblePhase * 1.5 + i * 16) % 24} ${145 + i * 14} ${140 - (bubblePhase * 1.5 + i * 16) % 24}`}
                      fill="none" stroke="#bfdbfe" strokeWidth="2" opacity="0.5" />
                  ))}

                  {/* Volume annotation */}
                  <line x1="100" y1="215" x2="88" y2="215" stroke="#3b82f6" strokeWidth="1" />
                  <line x1="100" y1="284" x2="88" y2="284" stroke="#3b82f6" strokeWidth="1" />
                  <line x1="93" y1="215" x2="93" y2="284" stroke="#3b82f6" strokeWidth="1" />
                  <text x="82" y="252" textAnchor="middle" fontSize="7" fill="#3b82f6">{volume}cm³</text>
                </g>
              )}

              {/* STAGE 1: FILTRATION */}
              {stage === 1 && (
                <g>
                  <rect x="20" y="348" width="280" height="12" rx="3" fill="#94a3b8" />
                  <rect x="50" y="18" width="220" height="30" rx="6" fill="#eff6ff" stroke="#93c5fd" />
                  <text x="160" y="39" textAnchor="middle" fontSize="13" fill="#1e40af" fontWeight="bold">Stage 2: Filtration</text>

                  {/* Stand */}
                  <line x1="160" y1="108" x2="160" y2="348" stroke="#475569" strokeWidth="4" />
                  <line x1="108" y1="200" x2="212" y2="200" stroke="#475569" strokeWidth="3" />
                  <rect x="148" y="103" width="24" height="10" rx="3" fill="#374151" />

                  {/* Funnel */}
                  <path d="M100 122 L220 122 L186 212 L134 212 Z" fill="#dbeafe" stroke="#7dd3fc" strokeWidth="2" />
                  {/* Filter paper */}
                  <path d="M105 127 L215 127 L183 207 L137 207 Z" fill="white" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2" />
                  {/* Black CuO on paper */}
                  {[...Array(6)].map((_, i) => {
                    const px = 140 + (i % 3) * 14;
                    const py = 163 + Math.floor(i / 3) * 10;
                    return <ellipse key={i} cx={px} cy={py} rx="6" ry="3.5" fill="#1c1917" opacity="0.75" />;
                  })}
                  <text x="160" y="150" textAnchor="middle" fontSize="8" fill="#1c1917">Black CuO residue</text>

                  {/* Stem */}
                  <path d="M154 212 L166 212 L163 245 L157 245 Z" fill="url(#cs-filtrate)" stroke="#38bdf8" strokeWidth="1" />
                  {/* Blue drips */}
                  {[0, 1].map(i => (
                    <ellipse key={i} cx="160" cy={252 + (bubblePhase * 2 + i * 25) % 25} rx="2.5" ry="3.5" fill="#1d4ed8" opacity="0.85" />
                  ))}

                  {/* Collecting beaker */}
                  <path d="M118 268 L113 340 L207 340 L202 268 Z" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
                  <path d="M120 294 L120 337 L200 337 L200 294 Q160 288 120 294 Z" fill="url(#cs-filtrate)" opacity="0.9" />
                  <text x="160" y="322" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">Blue CuSO₄(aq)</text>
                  <text x="160" y="260" textAnchor="middle" fontSize="8" fill="#1e40af">Deep blue filtrate</text>
                </g>
              )}

              {/* STAGE 2: CRYSTALLISATION */}
              {stage === 2 && (
                <g>
                  <rect x="20" y="348" width="280" height="12" rx="3" fill="#94a3b8" />
                  <rect x="45" y="18" width="230" height="30" rx="6" fill="#eff6ff" stroke="#93c5fd" />
                  <text x="160" y="39" textAnchor="middle" fontSize="12" fill="#1e40af" fontWeight="bold">Stage 3: Evaporation & Crystallisation</text>

                  {/* Tripod & gauze */}
                  <line x1="115" y1="305" x2="95" y2="348" stroke="#475569" strokeWidth="3" />
                  <line x1="205" y1="305" x2="225" y2="348" stroke="#475569" strokeWidth="3" />
                  <rect x="95" y="301" width="130" height="6" rx="2" fill="#9ca3af" />

                  {/* Evaporating dish */}
                  <path d="M98 240 Q98 310 160 315 Q222 310 222 240 Z" fill="none" stroke="#7dd3fc" strokeWidth="3" />
                  <path d="M93 238 L227 238" stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round" />
                  {/* Deep blue liquid */}
                  <path d="M102 240 Q102 306 160 309 Q218 306 218 240 Z" fill="url(#cs-deepsol)" opacity="0.9" />

                  {/* Blue CuSO4·5H2O crystals - distinctive monoclinic shape */}
                  {[...Array(10)].map((_, i) => {
                    const cx = 123 + (i % 5) * 17;
                    const cy = 283 - Math.floor(i / 5) * 14;
                    const grow = Math.min(1, (bubblePhase % 60) / 35);
                    const sz = 6 * grow;
                    return (
                      <g key={i} transform={`translate(${cx},${cy})`}>
                        <polygon points={`0,${-sz} ${sz * 0.7},0 0,${sz} ${-sz * 0.7},0`}
                          fill="url(#cs-crystal)" stroke="#1d4ed8" strokeWidth="0.8" opacity="0.95" />
                      </g>
                    );
                  })}

                  {/* Steam */}
                  {[0, 1, 2].map(i => (
                    <path key={i} d={`M ${145 + i * 14} 237 Q ${150 + i * 14} ${222 - (bubblePhase * 2 + i * 18) % 28} ${146 + i * 14} ${204 - (bubblePhase * 2 + i * 18) % 28}`}
                      fill="none" stroke="#bfdbfe" strokeWidth="2" opacity="0.6" />
                  ))}

                  {/* Bunsen */}
                  <rect x="143" y="316" width="34" height="20" rx="4" fill="#374151" />
                  <rect x="151" y="312" width="18" height="8" rx="2" fill="#475569" />
                  <ellipse cx="160" cy="306" rx="10" ry={4 + (bubblePhase % 4)} fill="#f97316" opacity="0.7" />
                  <ellipse cx="160" cy="303" rx="6" ry={3 + (bubblePhase % 3)} fill="#fbbf24" opacity="0.8" />

                  {/* Yield info box */}
                  <rect x="85" y="60" width="170" height="50" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
                  <text x="170" y="80" textAnchor="middle" fontSize="9" fill="#1e40af">Theoretical yield:</text>
                  <text x="170" y="97" textAnchor="middle" fontSize="12" fill="#1d4ed8" fontWeight="bold">{theoYield.toFixed(3)} g</text>
                  <text x="170" y="107" textAnchor="middle" fontSize="8" fill="#3b82f6">CuSO₄·5H₂O (blue vitriol)</text>

                  <text x="160" y="264" textAnchor="middle" fontSize="8" fill="#bfdbfe">Vivid blue CuSO₄·5H₂O crystals</text>
                  <text x="160" y="193" textAnchor="middle" fontSize="8" fill="#7dd3fc">H₂O vapour rising</text>
                </g>
              )}

              {/* Navigation */}
              {stage < 2 && (
                <g onClick={() => setStage(s => s + 1)} style={{ cursor: 'pointer' }}>
                  <rect x="230" y="360" width="76" height="20" rx="5" fill="#1d4ed8" />
                  <text x="268" y="374" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">Next Stage →</text>
                </g>
              )}
              {stage > 0 && (
                <g onClick={() => setStage(s => s - 1)} style={{ cursor: 'pointer' }}>
                  <rect x="14" y="360" width="76" height="20" rx="5" fill="#64748b" />
                  <text x="52" y="374" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">← Back</text>
                </g>
              )}
              {[0, 1, 2].map(i => (
                <circle key={i} cx={148 + i * 14} cy={368} r="4" fill={stage === i ? '#1d4ed8' : '#cbd5e1'} stroke="white" strokeWidth="1" />
              ))}
            </svg>

            <p className="text-xs text-slate-400 text-center mt-1 min-h-[16px]">
              {['Black CuO powder stirred into hot H₂SO₄; solution turns deep blue; excess CuO settles.',
                'Filtration removes black CuO residue; vivid blue CuSO₄ filtrate collected.',
                'Gentle evaporation: characteristic blue CuSO₄·5H₂O (blue vitriol) crystals form.'][stage]}
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
                    <th className="py-1.5 px-1">n(acid)</th>
                    <th className="py-1.5 px-1">m(CuO) g</th>
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
                      <td className="py-1 font-mono text-amber-700">{r.massCuO.toFixed(2)}</td>
                      <td className="py-1 font-mono text-blue-700">{r.theoYield.toFixed(2)}</td>
                      <td className="py-1 font-mono text-indigo-600">{r.actYield.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Graph */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="font-bold text-slate-800 mb-1">📈 Yield vs. Volume Graph</h2>
            <p className="text-xs text-slate-500 mb-2">CuSO₄·5H₂O yield (g) vs H₂SO₄ volume (cm³)</p>
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
              <text transform="rotate(-90)" x="-90" y="12" textAnchor="middle" fontSize="8" fill="#475569">CuSO₄·5H₂O (g)</text>
              {graphPoints.length > 1 && bfSlope > 0 && (
                <line x1={toSvgX(10)} y1={toSvgY(bfSlope * 10)} x2={toSvgX(50)} y2={toSvgY(bfSlope * 50)}
                  stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.6" />
              )}
              {graphPoints.map((pt, i) => (
                <circle key={i} cx={toSvgX(pt.x)} cy={toSvgY(pt.y)} r="4" fill="#1d4ed8" stroke="white" strokeWidth="1" opacity="0.9" />
              ))}
              {graphPoints.length === 0 && (
                <text x="147" y="92" textAnchor="middle" fontSize="9" fill="#cbd5e1">Record data to plot</text>
              )}
            </svg>
          </div>

          {/* Assessment */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="font-bold text-slate-800 mb-2 border-b pb-2">🎓 Assessment Question</h2>
            <div className="text-sm text-slate-700 space-y-2">
              <p>A student uses <strong>{mysteryV} cm³</strong> of H₂SO₄ at <strong>{mysteryC} mol/dm³</strong> with excess CuO.</p>
              <p className="text-xs text-slate-500">Calculate the theoretical yield of CuSO₄·5H₂O in grams. M = 249.69 g/mol. Answer to 2 d.p.</p>
              <div className="flex gap-2 mt-2">
                <input type="number" step="0.01" value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
                  placeholder="Yield (g)" className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500" />
                <button onClick={checkAnswer} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium text-sm transition-colors">
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
              <p>n(H₂SO₄) = V(dm³) × C &nbsp;→&nbsp; n(CuO) = n(H₂SO₄) &nbsp;→&nbsp; n(CuSO₄·5H₂O) = n(CuO) &nbsp;→&nbsp; mass = n × 249.69</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
