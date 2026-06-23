import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface LabProps { onExit?: () => void; }

type Substance = {
  name: string;
  category: string;
  unsaturation: number; // 0=saturated, 1=low, 2=medium, 3=high
  dropsToDecolourise: number | null; // null = never (saturated)
  formula: string;
  description: string;
  doubleBonds: number;
  structureNote: string;
};

const SUBSTANCES: Substance[] = [
  { name: 'Vegetable Oil', category: 'Triglyceride', unsaturation: 3, dropsToDecolourise: 3, formula: 'C₁₇H₃₁COO⁻ (polyunsaturated)', description: 'Rich in polyunsaturated fatty acids (e.g. linolenic acid). Multiple C=C bonds react rapidly with Br₂.', doubleBonds: 6, structureNote: '~6 C=C double bonds per molecule' },
  { name: 'Olive Oil', category: 'Triglyceride', unsaturation: 2, dropsToDecolourise: 6, formula: 'C₁₇H₃₃COO⁻ (monounsaturated)', description: 'Mainly oleic acid — one C=C double bond per fatty acid chain. Decolourises Br₂ but more slowly.', doubleBonds: 3, structureNote: '~3 C=C double bonds per molecule' },
  { name: 'Butter / Lard', category: 'Saturated Fat', unsaturation: 0, dropsToDecolourise: null, formula: 'C₁₇H₃₅COO⁻ (saturated)', description: 'Saturated fatty acids — no C=C double bonds. Bromine water stays orange-brown.', doubleBonds: 0, structureNote: 'No C=C double bonds' },
  { name: 'Hexane', category: 'Alkane', unsaturation: 0, dropsToDecolourise: null, formula: 'C₆H₁₄', description: 'Saturated hydrocarbon. All C–C single bonds. No reaction with Br₂ (without UV light).', doubleBonds: 0, structureNote: 'All C–C single bonds' },
  { name: 'Cyclohexene', category: 'Cycloalkene', unsaturation: 1, dropsToDecolourise: 4, formula: 'C₆H₁₀', description: 'Cyclic alkene with one C=C double bond. Br₂ adds across the double bond rapidly — electrophilic addition.', doubleBonds: 1, structureNote: '1 C=C double bond' },
];

const MYSTERY = { name: 'Compound Y', observation: 'Decolourises 5 drops of Br₂ water', answer: 'unsaturated', answerHint: 'It is unsaturated (has C=C bonds). Rate suggests ~2–3 double bonds per molecule.' };

type DataRow = { substance: string; drops: number; result: string; unsaturation: string };

export default function LabCh10BromineWater({ onExit }: LabProps) {
  const [selectedSubstance, setSelectedSubstance] = useState(SUBSTANCES[0]);
  const [dropsAdded, setDropsAdded] = useState(1);
  const [dataRows, setDataRows] = useState<DataRow[]>([]);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [tick, setTick] = useState(0);
  const [animatingDrop, setAnimatingDrop] = useState(false);
  const [dropY, setDropY] = useState(30);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dropTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    animRef.current = setInterval(() => setTick(t => t + 1), 150);
    return () => { if (animRef.current) clearInterval(animRef.current); };
  }, []);

  // Compute colour: how much Br₂ has been consumed?
  const getColour = (substance: Substance, drops: number): { r: number; g: number; b: number; label: string } => {
    if (substance.dropsToDecolourise === null) {
      // Saturated — stays orange-brown
      return { r: 210, g: 100, b: 20, label: 'Orange-Brown (no change)' };
    }
    const fraction = Math.min(1, drops / substance.dropsToDecolourise);
    const r = Math.round(210 - fraction * 200);
    const g = Math.round(100 - fraction * 80);
    const b = Math.round(20 + fraction * 180);
    const label = fraction >= 1 ? 'Colourless (decolourised)' : 'Pale orange → decolourising...';
    return { r, g, b, label };
  };

  const colour = getColour(selectedSubstance, dropsAdded);
  const colourStr = `rgb(${colour.r},${colour.g},${colour.b})`;

  const triggerDropAnimation = () => {
    setAnimatingDrop(true);
    setDropY(30);
    if (dropTimerRef.current) clearTimeout(dropTimerRef.current);
    dropTimerRef.current = setTimeout(() => setAnimatingDrop(false), 800);
  };

  const recordData = () => {
    const exists = dataRows.find(r => r.substance === selectedSubstance.name && r.drops === dropsAdded);
    if (exists) return;
    const col = getColour(selectedSubstance, dropsAdded);
    const unsatLabel = selectedSubstance.unsaturation === 0 ? 'Saturated (0 C=C)' : selectedSubstance.unsaturation === 1 ? 'Low (1 C=C)' : selectedSubstance.unsaturation === 2 ? 'Medium (~3 C=C)' : 'High (≥6 C=C)';
    setDataRows(prev => [...prev, {
      substance: selectedSubstance.name,
      drops: dropsAdded,
      result: col.label,
      unsaturation: unsatLabel
    }]);
    triggerDropAnimation();
  };

  const checkAnswer = () => {
    const norm = answer.trim().toLowerCase();
    if (norm.includes('unsaturated') || norm.includes('c=c') || norm.includes('double bond')) {
      setFeedback({ type: 'success', message: `✓ Correct! Compound Y is unsaturated. It decolourised Br₂ water (5 drops), indicating the presence of C=C double bonds. Br₂ undergoes electrophilic addition across C=C: C=C + Br₂ → C(Br)–C(Br).` });
    } else if (norm.includes('saturated') || norm === '') {
      setFeedback({ type: 'error', message: '✗ Incorrect. If Br₂ water is decolourised, the compound MUST be unsaturated (contains C=C bonds). Saturated compounds do not react with Br₂ in the dark.' });
    } else {
      setFeedback({ type: 'error', message: '✗ Hint: Think about what decolourisation of Br₂ water means. Does it indicate saturation or unsaturation?' });
    }
  };

  const reset = () => { setDataRows([]); setAnswer(''); setFeedback({ type: '', message: '' }); };

  // Animated drop positions
  const currentDropY = animatingDrop ? dropY + tick * 8 : 200;

  // Molecular animation: Br2 across C=C
  const brAnimX = 100 + Math.sin(tick * 0.3) * 20;

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-white border-b p-3 flex items-center justify-between sticky top-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          {onExit && <button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft className="w-5 h-5 text-slate-600" /></button>}
          <div>
            <h1 className="text-lg font-bold text-slate-800">Activity 9.1 — Bromine Water Test</h1>
            <p className="text-xs text-slate-500">Saturated vs Unsaturated Hydrocarbons — C=C double bond detection</p>
          </div>
        </div>
        <button onClick={reset} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 transition-colors">
          <RefreshCw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-screen-xl mx-auto w-full">

        {/* Column 1: Theory & Setup */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="text-base font-bold text-slate-800 mb-3 border-b pb-2">Theory</h2>
            <div className="text-sm text-slate-600 space-y-2">
              <p>Bromine water (Br₂ aq) is an <strong>orange-brown</strong> solution. It is decolourised by <strong>unsaturated</strong> compounds containing C=C double bonds.</p>
              <div className="bg-orange-50 border border-orange-200 rounded p-2 text-xs font-mono text-orange-900">
                <div className="font-bold mb-1">Electrophilic Addition:</div>
                C=C + Br₂ → C(Br)–C(Br)
                <div className="text-orange-600 mt-1">(orange-brown → colourless)</div>
              </div>
              <div className="bg-slate-100 rounded p-2 text-xs space-y-1">
                <div className="font-bold text-slate-700">Saturated compounds (alkanes, saturated fats):</div>
                <div>→ No C=C bonds → NO reaction with Br₂</div>
                <div>→ Br₂ water stays <span className="text-orange-600 font-bold">orange-brown</span></div>
              </div>
              <div className="bg-green-50 rounded p-2 text-xs space-y-1 border border-green-200">
                <div className="font-bold text-slate-700">Unsaturated compounds (alkenes, unsaturated fats):</div>
                <div>→ C=C bonds present → REACTS with Br₂</div>
                <div>→ Br₂ water turns <span className="text-green-700 font-bold">colourless</span></div>
              </div>
              <p className="text-xs text-slate-500">Degree of unsaturation: more C=C bonds → more Br₂ consumed → fewer drops needed to observe colour change.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="text-base font-bold text-slate-800 mb-3 border-b pb-2">Controls</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Substance</label>
                <select value={selectedSubstance.name} onChange={e => setSelectedSubstance(SUBSTANCES.find(s => s.name === e.target.value) || SUBSTANCES[0])}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 bg-white">
                  {SUBSTANCES.map(s => <option key={s.name} value={s.name}>{s.name} ({s.category})</option>)}
                </select>
              </div>
              <div>
                <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                  <span>Br₂ Water Drops Added</span>
                  <span className="font-bold text-orange-700">{dropsAdded} drops</span>
                </label>
                <input type="range" min="1" max="10" step="1" value={dropsAdded}
                  onChange={e => setDropsAdded(Number(e.target.value))}
                  className="w-full accent-orange-600 cursor-pointer" />
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>1</span><span>10 drops</span></div>
              </div>

              {/* Substance info card */}
              <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 space-y-1.5">
                <div className="font-bold text-slate-800">{selectedSubstance.name}</div>
                <div className="font-mono text-slate-700 bg-white border rounded p-1">{selectedSubstance.formula}</div>
                <p>{selectedSubstance.description}</p>
                <div className={`font-semibold mt-1 ${selectedSubstance.doubleBonds > 0 ? 'text-green-700' : 'text-orange-700'}`}>
                  Structure: {selectedSubstance.structureNote}
                </div>
              </div>

              {/* Result indicator */}
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: `${colourStr}22`, border: `2px solid ${colourStr}` }}>
                <div className="text-xs text-slate-600 mb-1">Observed Colour:</div>
                <div className="w-8 h-8 rounded-full mx-auto mb-1 border-2 border-white shadow" style={{ backgroundColor: colourStr }} />
                <div className="text-xs font-bold" style={{ color: `rgb(${colour.r},${Math.min(colour.g + 30, 255)},${colour.b})` }}>{colour.label}</div>
              </div>

              <button onClick={recordData}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-lg font-bold text-sm transition-colors shadow">
                ⊕ Record Observation
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: SVG Simulation */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex-1">
            <h2 className="text-base font-bold text-slate-800 mb-1 border-b pb-2">Simulation — Bromine Water Test</h2>

            <svg viewBox="0 0 400 340" className="w-full">
              <defs>
                <linearGradient id="bw-labBg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>
                <linearGradient id="bw-glass" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(200,230,255,0.4)" />
                  <stop offset="40%" stopColor="rgba(255,255,255,0.05)" />
                  <stop offset="100%" stopColor="rgba(200,230,255,0.3)" />
                </linearGradient>
                <filter id="bw-blur">
                  <feGaussianBlur stdDeviation="2" />
                </filter>
                <filter id="bw-glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Lab bench */}
              <rect x={0} y={310} width={400} height={30} fill="#cbd5e1" />
              <rect x={0} y={305} width={400} height={8} fill="#94a3b8" />

              {/* --- Test tube A: Selected substance --- */}
              <g>
                <text x={90} y={22} textAnchor="middle" fontSize={10} fill="#475569" fontWeight="bold">{selectedSubstance.name}</text>
                <text x={90} y={34} textAnchor="middle" fontSize={8} fill="#94a3b8">(test substance)</text>

                {/* Tube body */}
                <rect x={65} y={40} width={50} height={255} rx={25} fill="url(#bw-glass)" stroke="#94a3b8" strokeWidth={2} />

                {/* Substance liquid (bottom layer) */}
                <clipPath id="bw-clipA"><rect x={67} y={170} width={46} height={120} rx={22} /></clipPath>
                <rect x={67} y={170} width={46} height={120} rx={22} fill="#fef9c3" opacity={0.9} clipPath="url(#bw-clipA)" />
                <text x={90} y={235} textAnchor="middle" fontSize={9} fill="#a3a300" opacity={0.8}>{selectedSubstance.category}</text>

                {/* Br₂ water layer on top */}
                <clipPath id="bw-clipB"><rect x={67} y={100} width={46} height={75} rx={22} /></clipPath>
                <rect x={67} y={100} width={46} height={75} rx={22}
                  fill={colourStr} opacity={0.85} clipPath="url(#bw-clipB)" />

                {/* Colour change animation bubbles for unsaturated */}
                {selectedSubstance.doubleBonds > 0 && dropsAdded >= (selectedSubstance.dropsToDecolourise || 99) && (
                  <>
                    {[0,1,2,3].map(i => (
                      <circle key={i} cx={75 + i * 10} cy={115 + (tick * 3 + i * 20) % 60}
                        r={3} fill="rgba(255,255,255,0.6)" opacity={0.7} />
                    ))}
                  </>
                )}

                {/* Glass highlight */}
                <rect x={70} y={50} width={8} height={240} rx={4} fill="rgba(255,255,255,0.3)" />
              </g>

              {/* --- Dropper (Br₂ bottle) in center --- */}
              <g>
                {/* Dropper body */}
                <rect x={178} y={20} width={44} height={80} rx={8} fill="#f97316" opacity={0.9} stroke="#ea580c" strokeWidth={1.5} />
                <rect x={186} y={10} width={28} height={20} rx={4} fill="#fed7aa" stroke="#f97316" strokeWidth={1} />
                <path d="M196,30 L196,40 M204,30 L204,40" stroke="#ea580c" strokeWidth={1} />
                <text x={200} y={55} textAnchor="middle" fontSize={8} fill="white" fontWeight="bold">Br₂</text>
                <text x={200} y={65} textAnchor="middle" fontSize={7} fill="white">water</text>
                <text x={200} y={80} textAnchor="middle" fontSize={9} fill="#fef3c7">●●●</text>
                {/* Dropper tip */}
                <path d="M196,100 Q200,108 204,100" fill="none" stroke="#f97316" strokeWidth={2} />
                <ellipse cx={200} cy={108} rx={4} ry={6} fill="#f97316" />

                {/* Animated drop falling toward tube A */}
                {animatingDrop && (
                  <ellipse cx={140} cy={currentDropY} rx={4} ry={6}
                    fill="#f97316" opacity={0.9} filter="url(#bw-glow)" />
                )}
                {/* Drop count indicator */}
                <text x={200} y={130} textAnchor="middle" fontSize={9} fill="#ea580c" fontWeight="bold">{dropsAdded} drops</text>
              </g>

              {/* --- Test tube B: Reference (saturated, stays orange) --- */}
              <g>
                <text x={310} y={22} textAnchor="middle" fontSize={10} fill="#475569" fontWeight="bold">Reference</text>
                <text x={310} y={34} textAnchor="middle" fontSize={8} fill="#94a3b8">(saturated control)</text>

                <rect x={285} y={40} width={50} height={255} rx={25} fill="url(#bw-glass)" stroke="#94a3b8" strokeWidth={2} />

                {/* Control: always stays orange-brown */}
                <clipPath id="bw-clipC"><rect x={287} y={100} width={46} height={195} rx={22} /></clipPath>
                <rect x={287} y={100} width={46} height={195} rx={22}
                  fill="rgb(210,100,20)" opacity={0.85} clipPath="url(#bw-clipC)" />

                <text x={310} y={200} textAnchor="middle" fontSize={8} fill="#7c2d12" opacity={0.8}>Hexane</text>
                <text x={310} y={212} textAnchor="middle" fontSize={7} fill="#7c2d12" opacity={0.6}>(saturated)</text>

                {/* Orange-brown label */}
                <rect x={272} y={268} width={76} height={14} rx={3} fill="#fef3c7" stroke="#fcd34d" />
                <text x={310} y={278} textAnchor="middle" fontSize={7.5} fill="#92400e" fontWeight="bold">Orange-Brown ✓</text>

                <rect x={70} y={268} width={42} height={14} rx={3} fill={colour.label.includes('Colourless') ? '#dcfce7' : '#fef3c7'} stroke={colour.label.includes('Colourless') ? '#86efac' : '#fcd34d'} />
                <text x={91} y={278} textAnchor="middle" fontSize={7} fill={colour.label.includes('Colourless') ? '#166534' : '#92400e'} fontWeight="bold">
                  {colour.label.includes('Colourless') ? 'Colourless ✓' : 'Reacting...'}
                </text>

                {/* Glass highlight */}
                <rect x={290} y={50} width={8} height={240} rx={4} fill="rgba(255,255,255,0.3)" />
              </g>

              {/* Br2 + C=C addition mechanism diagram */}
              <g transform="translate(20, 160)">
                <rect x={0} y={0} width={350} height={55} rx={8} fill="white" stroke="#e2e8f0" strokeWidth={1} />
                <text x={8} y={14} fontSize={9} fill="#475569" fontWeight="bold">
                  {selectedSubstance.doubleBonds > 0 ? 'Electrophilic Addition (Br₂ across C=C):' : 'No reaction (saturated):'}
                </text>
                {selectedSubstance.doubleBonds > 0 ? (
                  <>
                    {/* C=C bond */}
                    <circle cx={30} cy={35} r={12} fill="#d1fae5" stroke="#6ee7b7" strokeWidth={1.5} />
                    <text x={30} y={39} textAnchor="middle" fontSize={8} fill="#166534" fontWeight="bold">C=C</text>
                    {/* Arrow */}
                    <text x={55} y={39} fontSize={14} fill="#64748b">+</text>
                    {/* Br2 molecule with animation */}
                    <circle cx={brAnimX} cy={35} r={10} fill="rgba(249,115,22,0.2)" stroke="#f97316" strokeWidth={1.5} />
                    <text x={brAnimX} y={39} textAnchor="middle" fontSize={8} fill="#c2410c" fontWeight="bold">Br₂</text>
                    <text x={140} y={39} fontSize={14} fill="#64748b">→</text>
                    <circle cx={178} cy={35} r={14} fill="#e0f2fe" stroke="#38bdf8" strokeWidth={1.5} />
                    <text x={178} y={39} textAnchor="middle" fontSize={7.5} fill="#0369a1" fontWeight="bold">C–C</text>
                    <text x={178} y={48} textAnchor="middle" fontSize={6.5} fill="#0369a1">Br Br</text>
                    <text x={210} y={39} fontSize={9} fill="#94a3b8">Colourless</text>
                  </>
                ) : (
                  <>
                    <text x={10} y={38} fontSize={9} fill="#94a3b8">C–C + Br₂ → No reaction in the dark (no C=C)</text>
                    <text x={10} y={50} fontSize={8} fill="#f97316">Br₂ remains unreacted → stays orange-brown</text>
                  </>
                )}
              </g>
            </svg>
          </div>
        </div>

        {/* Column 3: Data + Assessment */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="text-base font-bold text-slate-800 mb-3 border-b pb-2">Observation Data Log</h2>
            <div className="overflow-auto max-h-52 rounded border border-slate-100">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 sticky top-0">
                  <tr>
                    <th className="py-2 px-2 font-semibold text-slate-600 text-left">Substance</th>
                    <th className="py-2 px-2 font-semibold text-slate-600">Drops</th>
                    <th className="py-2 px-2 font-semibold text-slate-600 text-left">Final Colour</th>
                    <th className="py-2 px-2 font-semibold text-slate-600 text-left">Unsaturation</th>
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((row, i) => (
                    <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="py-1.5 px-2 font-medium text-slate-800">{row.substance}</td>
                      <td className="py-1.5 px-2 font-mono text-center">{row.drops}</td>
                      <td className={`py-1.5 px-2 text-xs font-semibold ${row.result.includes('Colourless') ? 'text-green-700' : 'text-orange-700'}`}>{row.result}</td>
                      <td className="py-1.5 px-2 text-xs text-slate-600">{row.unsaturation}</td>
                    </tr>
                  ))}
                  {dataRows.length === 0 && (
                    <tr><td colSpan={4} className="py-6 text-slate-400 text-center">No data yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400 mt-1">* Fewer drops to decolourise = more C=C bonds = higher unsaturation</p>
          </div>

          {/* Degree of Unsaturation Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="text-base font-bold text-slate-800 mb-3 border-b pb-2">Degree of Unsaturation Chart</h2>
            <svg viewBox="0 0 280 160" className="w-full">
              <line x1={40} y1={10} x2={40} y2={130} stroke="#94a3b8" strokeWidth={1} />
              <line x1={40} y1={130} x2={270} y2={130} stroke="#94a3b8" strokeWidth={1} />
              <text x={10} y={75} textAnchor="middle" fontSize={7} fill="#64748b" transform="rotate(-90,10,75)">Double Bonds</text>
              {[1,2,3,4,5,6].map(v => (
                <g key={v}>
                  <line x1={37} y1={130 - v * 19} x2={270} y2={130 - v * 19} stroke="#f1f5f9" strokeWidth={1} />
                  <text x={33} y={134 - v * 19} textAnchor="end" fontSize={6} fill="#94a3b8">{v}</text>
                </g>
              ))}
              {SUBSTANCES.map((s, i) => {
                const isInData = dataRows.some(r => r.substance === s.name);
                const bx = 50 + i * 44;
                const bH = s.doubleBonds * 19;
                const col = s.doubleBonds === 0 ? '#f97316' : s.doubleBonds === 1 ? '#84cc16' : s.doubleBonds === 3 ? '#22d3ee' : '#6366f1';
                return (
                  <g key={s.name} opacity={isInData ? 1 : 0.3}>
                    <rect x={bx} y={130 - bH} width={32} height={bH} fill={col} rx={3} opacity={0.85} />
                    {s.doubleBonds > 0 && <text x={bx + 16} y={130 - bH - 3} textAnchor="middle" fontSize={7} fill={col} fontWeight="bold">{s.doubleBonds}</text>}
                    <text x={bx + 16} y={145} textAnchor="middle" fontSize={6.5} fill="#475569">{s.name.split(' ')[0]}</text>
                  </g>
                );
              })}
            </svg>
            <p className="text-xs text-slate-400 text-center">Faded bars = not yet recorded. Bars above 0 = unsaturated.</p>
          </div>

          {/* Assessment */}
          <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-4">
            <h2 className="text-base font-bold text-amber-800 mb-3 border-b border-amber-200 pb-2">📋 Assessment</h2>
            <div className="space-y-3 text-sm">
              <div className="bg-amber-50 rounded-lg p-3 text-slate-700 space-y-2">
                <p className="font-semibold text-sm">Mystery Compound Y:</p>
                <div className="text-xs bg-white border rounded p-2 space-y-1">
                  <p><strong>Observation:</strong> {MYSTERY.observation}</p>
                  <p>The solution changed from orange-brown to <strong>colourless</strong> after 5 drops.</p>
                </div>
                <p className="text-xs font-semibold">Q1: Is Compound Y <em>saturated</em> or <em>unsaturated</em>? How do you know?</p>
                <p className="text-xs text-slate-500">Q2: Approximately how many C=C double bonds might it contain?</p>
                <input type="text" value={answer} onChange={e => setAnswer(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  placeholder="e.g. unsaturated, has C=C double bonds..." />
                <button onClick={checkAnswer} className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-bold text-sm transition-colors">
                  Check Answer
                </button>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-xs text-slate-700 space-y-1">
                <p className="font-semibold">Key Formula:</p>
                <p className="font-mono bg-white border rounded p-1.5 text-blue-800">Degree of unsaturation = moles of Br₂ decolourised per mole of compound</p>
                <p>More drops consumed before colour persists → more C=C bonds → higher degree of unsaturation.</p>
              </div>
              {feedback.type && (
                <div className={`p-3 rounded-lg text-xs ${feedback.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                  {feedback.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
