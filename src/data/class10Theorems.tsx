import { useTranslate } from '../i18n';
import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import type { TheoremConfig } from '../components/GenericTheoremLab';
import { Hash, Move3d, Triangle, Square, Circle, Target, Ruler } from 'lucide-react';

// ========== Interactive Components ==========

function QuadraticFormulaInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [a, setA] = useState(2); const [b, setB] = useState(7); const [cVal, setCVal] = useState(3);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const discriminant = b*b - 4*a*cVal;
  const root1 = (-b + Math.sqrt(discriminant)) / (2*a);
  const root2 = (-b - Math.sqrt(discriminant)) / (2*a);
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; const correct = Math.abs(val - root1) < 0.01 || Math.abs(val - root2) < 0.01; setCheckResult(correct ? 'correct' : 'incorrect'); if (correct) onAnswer(true); };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div><label className="text-xs font-semibold text-slate-600">a</label><input type="range" min="-10" max="10" step="1" value={a} onChange={e => { setA(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" /><span className="text-xs font-mono text-blue-600">{t("a =")} {a}</span></div>
        <div><label className="text-xs font-semibold text-slate-600">b</label><input type="range" min="-10" max="10" step="1" value={b} onChange={e => { setB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" /><span className="text-xs font-mono text-blue-600">{t("b =")} {b}</span></div>
        <div><label className="text-xs font-semibold text-slate-600">c</label><input type="range" min="-10" max="10" step="1" value={cVal} onChange={e => { setCVal(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" /><span className="text-xs font-mono text-blue-600">{t("c =")} {cVal}</span></div>
      </div>
      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
        <p className="text-xs text-blue-700 font-mono">{t("Equation:")} {a}{t("x² +")} {b}{t("x +")} {cVal} = 0<br />{t("D = b²−4ac =")} {b}²−4({a})({cVal}) = <strong>{discriminant}</strong><br />{discriminant >= 0 ? <>Roots: x = [{root1.toFixed(2)}, {root2.toFixed(2)}]</> : <span className="text-red-500">{t("No real roots")}</span>}</p>
      </div>
      <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("Enter a root")} step="0.01" className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button></div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {t("Correct!")}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> {t("Try x = [−b ± √(b²−4ac)] / 2a")}</p>}
    </div>
  );
}

function VectorDiffInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [ax, setAx] = useState(2); const [ay, setAy] = useState(3); const [bx, setBx] = useState(7); const [by, setBy] = useState(5);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const compX = bx - ax; const compY = by - ay; const mag = Math.sqrt(compX*compX + compY*compY);
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - compX) < 0.1 ? 'correct' : 'incorrect'); if (Math.abs(val - compX) < 0.1) onAnswer(true); };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-semibold">{t("A = (x₁, y₁)")}</label><div className="grid grid-cols-2 gap-2"><div><span className="text-[10px]">x₁</span><input type="range" min="-5" max="5" step="1" value={ax} onChange={e => { setAx(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" /><span className="text-xs">{ax}</span></div><div><span className="text-[10px]">y₁</span><input type="range" min="-5" max="5" step="1" value={ay} onChange={e => { setAy(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" /><span className="text-xs">{ay}</span></div></div></div>
        <div><label className="text-xs font-semibold">{t("B = (x₂, y₂)")}</label><div className="grid grid-cols-2 gap-2"><div><span className="text-[10px]">x₂</span><input type="range" min="-5" max="5" step="1" value={bx} onChange={e => { setBx(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-violet-500" /><span className="text-xs">{bx}</span></div><div><span className="text-[10px]">y₂</span><input type="range" min="-5" max="5" step="1" value={by} onChange={e => { setBy(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-violet-500" /><span className="text-xs">{by}</span></div></div></div>
      </div>
      <div className="relative h-28 bg-white rounded-lg overflow-hidden border border-slate-200"><svg viewBox="0 0 240 120" className="w-full h-full"><line x1="120" y1="0" x2="120" y2="120" stroke="#cbd5e1" strokeWidth="0.5" /><line x1="0" y1="60" x2="240" y2="60" stroke="#cbd5e1" strokeWidth="0.5" /><circle cx={120 + ax*15} cy={60 - ay*15} r="4" fill="#10b981" /><text x={120 + ax*15 + 5} y={60 - ay*15 + 3} className="text-[8px] fill-emerald-600">A</text><circle cx={120 + bx*15} cy={60 - by*15} r="4" fill="#8b5cf6" /><text x={120 + bx*15 + 5} y={60 - by*15 + 3} className="text-[8px] fill-violet-600">B</text><defs><marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto"><polygon points="0,0 6,2 0,4" fill="#f59e0b" /></marker></defs><line x1={120 + ax*15} y1={60 - ay*15} x2={120 + bx*15} y2={60 - by*15} stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowhead)" /></svg></div>
      <div className="bg-amber-50 rounded-lg p-3 border border-amber-200"><p className="text-xs text-amber-700 font-mono">ã = ({ax}, {ay}{t("), b⃗ = (")}{bx}, {by})<br />{t("AB = b − ã = (")}{bx}−{ax}, {by}−{ay}) = <strong>({compX}, {compY})</strong><br />{t("|AB| = √")}{compX*compX + compY*compY} = <strong>{mag.toFixed(2)}</strong></p></div>
      <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("x-component of AB")} className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button></div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! AB = b − a")}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try AB = (x₂−x₁, y₂−y₁)")}</p>}
    </div>
  );
}

function LawCosinesInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [b, setB] = useState(5); const [c, setC] = useState(6); const [alpha, setAlpha] = useState(60);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const rad = alpha * Math.PI / 180; const aCalc = Math.sqrt(b*b + c*c - 2*b*c*Math.cos(rad));
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - aCalc) < 0.1 ? 'correct' : 'incorrect'); if (Math.abs(val - aCalc) < 0.1) onAnswer(true); };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div><label className="text-xs font-semibold">{t("Side b")}</label><input type="range" min="1" max="10" step="0.5" value={b} onChange={e => { setB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" /><span className="text-xs">{b}</span></div>
        <div><label className="text-xs font-semibold">{t("Side c")}</label><input type="range" min="1" max="10" step="0.5" value={c} onChange={e => { setC(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" /><span className="text-xs">{c}</span></div>
        <div><label className="text-xs font-semibold">{t("Angle α")}</label><input type="range" min="1" max="179" step="1" value={alpha} onChange={e => { setAlpha(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" /><span className="text-xs">{alpha}°</span></div>
      </div>
      <div className="bg-rose-50 rounded-lg p-3 border border-rose-200"><p className="text-xs text-rose-700 font-mono">{t("a² =")} {b}² + {c}² − 2({b})({c}{t(") cos(")}{alpha}°)<br />{t("a =")} <strong>{aCalc.toFixed(2)}</strong></p></div>
      <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("Side a")} step="0.01" className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-rose-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button></div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! a =")} {aCalc.toFixed(2)}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try a² = b² + c² − 2bc cos α")}</p>}
    </div>
  );
}

function LawSinesInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [a, setA] = useState(7); const [alpha, setAlpha] = useState(50); const [beta, setBeta] = useState(70);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const gamma = 180 - alpha - beta; const b = a * Math.sin(beta * Math.PI/180) / Math.sin(alpha * Math.PI/180);
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - b) < 0.1 ? 'correct' : 'incorrect'); if (Math.abs(val - b) < 0.1) onAnswer(true); };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div><label className="text-xs font-semibold">{t("Side a")}</label><input type="range" min="1" max="10" step="0.5" value={a} onChange={e => { setA(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-sky-500" /><span className="text-xs">{a}</span></div>
        <div><label className="text-xs font-semibold">∠α</label><input type="range" min="1" max="178" step="1" value={alpha} onChange={e => { setAlpha(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-sky-500" /><span className="text-xs">{alpha}°</span></div>
        <div><label className="text-xs font-semibold">∠β</label><input type="range" min="1" max={178-alpha} step="1" value={beta} onChange={e => { setBeta(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-sky-500" /><span className="text-xs">{beta}°</span></div>
      </div>
      <div className="bg-sky-50 rounded-lg p-3 border border-sky-200"><p className="text-xs text-sky-700 font-mono">γ = 180°−{alpha}°−{beta}° = {gamma}°<br />{t("b = a × sin β / sin α =")} {a} {t("× sin(")}{beta}{t("°)/sin(")}{alpha}°) = <strong>{b.toFixed(2)}</strong></p></div>
      <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("Side b")} step="0.01" className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button></div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! b =")} {b.toFixed(2)}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try a/sin α = b/sin β")}</p>}
    </div>
  );
}

function HerosFormulaInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [a, setA] = useState(5); const [b, setB] = useState(6); const [c, setC] = useState(7);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const S = (a + b + c) / 2; const area = Math.sqrt(S * (S-a) * (S-b) * (S-c));
  const handleCheck = () => {
  const { t } = useTranslate(); const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - area) < 0.1 ? 'correct' : 'incorrect'); if (Math.abs(val - area) < 0.1) onAnswer(true); };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div><label className="text-xs font-semibold">{t("Side a")}</label><input type="range" min="1" max="10" step="0.5" value={a} onChange={e => { setA(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" /><span className="text-xs">{a}</span></div>
        <div><label className="text-xs font-semibold">{t("Side b")}</label><input type="range" min="1" max="10" step="0.5" value={b} onChange={e => { setB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" /><span className="text-xs">{b}</span></div>
        <div><label className="text-xs font-semibold">{t("Side c")}</label><input type="range" min="1" max="10" step="0.5" value={c} onChange={e => { setC(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" /><span className="text-xs">{c}</span></div>
      </div>
      <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200"><p className="text-xs text-emerald-700 font-mono">S = ({a}+{b}+{c})/2 = <strong>{S.toFixed(1)}</strong><br />Δ = √[{S.toFixed(1)}×{(S-a).toFixed(1)}×{(S-b).toFixed(1)}×{(S-c).toFixed(1)}] = <strong>{area.toFixed(2)}</strong></p></div>
      <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("Area")} step="0.01" className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button></div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! Δ =")} {area.toFixed(2)}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try Hero's formula: √[S(S−a)(S−b)(S−c)]")}</p>}
    </div>
  );
}

function CircumRadiusInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [a, setA] = useState(5); const [b, setB] = useState(6); const [c, setC] = useState(7);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const S = (a + b + c) / 2; const area = Math.sqrt(S * (S-a) * (S-b) * (S-c)); const R = (a * b * c) / (4 * area);
  const handleCheck = () => {
  const { t } = useTranslate(); const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - R) < 0.1 ? 'correct' : 'incorrect'); if (Math.abs(val - R) < 0.1) onAnswer(true); };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div><label className="text-xs font-semibold">{t("Side a")}</label><input type="range" min="1" max="10" step="0.5" value={a} onChange={e => { setA(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-orange-500" /><span className="text-xs">{a}</span></div>
        <div><label className="text-xs font-semibold">{t("Side b")}</label><input type="range" min="1" max="10" step="0.5" value={b} onChange={e => { setB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-orange-500" /><span className="text-xs">{b}</span></div>
        <div><label className="text-xs font-semibold">{t("Side c")}</label><input type="range" min="1" max="10" step="0.5" value={c} onChange={e => { setC(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-orange-500" /><span className="text-xs">{c}</span></div>
      </div>
      <div className="bg-orange-50 rounded-lg p-3 border border-orange-200"><p className="text-xs text-orange-700 font-mono">Δ = {area.toFixed(2)}<br />R = ({a}×{b}×{c})/(4×{area.toFixed(2)}) = <strong>{R.toFixed(2)}</strong></p></div>
      <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder="R" step="0.01" className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button></div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! R =")} {R.toFixed(2)}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try R = abc / (4Δ)")}</p>}
    </div>
  );
}

function InRadiusInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [a, setA] = useState(5); const [b, setB] = useState(6); const [c, setC] = useState(7);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const S = (a + b + c) / 2; const area = Math.sqrt(S * (S-a) * (S-b) * (S-c)); const r = area / S;
  const handleCheck = () => {
  const { t } = useTranslate(); const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - r) < 0.1 ? 'correct' : 'incorrect'); if (Math.abs(val - r) < 0.1) onAnswer(true); };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div><label className="text-xs font-semibold">{t("Side a")}</label><input type="range" min="1" max="10" step="0.5" value={a} onChange={e => { setA(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-teal-500" /><span className="text-xs">{a}</span></div>
        <div><label className="text-xs font-semibold">{t("Side b")}</label><input type="range" min="1" max="10" step="0.5" value={b} onChange={e => { setB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-teal-500" /><span className="text-xs">{b}</span></div>
        <div><label className="text-xs font-semibold">{t("Side c")}</label><input type="range" min="1" max="10" step="0.5" value={c} onChange={e => { setC(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-teal-500" /><span className="text-xs">{c}</span></div>
      </div>
      <div className="bg-teal-50 rounded-lg p-3 border border-teal-200"><p className="text-xs text-teal-700 font-mono">S = {S.toFixed(1)}, Δ = {area.toFixed(2)}<br />{t("r = Δ / S =")} <strong>{r.toFixed(2)}</strong></p></div>
      <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder="r" step="0.01" className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button></div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! r =")} {r.toFixed(2)}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try r = Δ / S")}</p>}
    </div>
  );
}

function CircleChordInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [radius, setRadius] = useState(70); const [chordOffset, setChordOffset] = useState(20);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const halfChord = Math.sqrt(radius*radius - chordOffset*chordOffset);
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - halfChord*2) < 1 ? 'correct' : 'incorrect'); if (Math.abs(val - halfChord*2) < 1) onAnswer(true); };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-semibold">{t("Radius (r)")}</label><input type="range" min="30" max="90" step="1" value={radius} onChange={e => { setRadius(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-indigo-500" /><span className="text-xs">{radius}</span></div>
        <div><label className="text-xs font-semibold">{t("Dist from Centre")}</label><input type="range" min="0" max={radius-1} step="1" value={chordOffset} onChange={e => { setChordOffset(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-indigo-500" /><span className="text-xs">{chordOffset}</span></div>
      </div>
      <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200"><p className="text-xs text-indigo-700 font-mono">{t("Half-chord = √(")}{radius}²−{chordOffset}²) = {halfChord.toFixed(1)}<br />{t("Full chord =")} <strong>{(halfChord*2).toFixed(1)}</strong></p></div>
      <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("Chord length")} step="1" className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button></div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! Chord =")} {(halfChord*2).toFixed(1)}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try chord = 2√(r²−d²)")}</p>}
    </div>
  );
}

function TangentCircleInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [r1, setR1] = useState(50); const [r2, setR2] = useState(30); const [mode, setMode] = useState<'external'|'internal'>('external');
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const distance = mode === 'external' ? r1 + r2 : Math.abs(r1 - r2);
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - distance) < 1 ? 'correct' : 'incorrect'); if (Math.abs(val - distance) < 1) onAnswer(true); };
  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        <button onClick={() => setMode('external')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${mode === 'external' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{t("External Touch")}</button>
        <button onClick={() => setMode('internal')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${mode === 'internal' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{t("Internal Touch")}</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-semibold">{t("Radius r₁")}</label><input type="range" min="20" max="80" step="1" value={r1} onChange={e => { setR1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-purple-500" /><span className="text-xs">{r1}</span></div>
        <div><label className="text-xs font-semibold">{t("Radius r₂")}</label><input type="range" min="10" max="70" step="1" value={r2} onChange={e => { setR2(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-purple-500" /><span className="text-xs">{r2}</span></div>
      </div>
      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200"><p className="text-xs text-purple-700 font-mono">{t("r₁ =")} {r1}{t(", r₂ =")} {r2}<br />{t("Distance d =")} {mode === 'external' ? 'r₁ + r₂' : '|r₁ − r₂|'} = <strong>{distance}</strong></p></div>
      <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("Distance d")} step="1" className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button></div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! d =")} {distance}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("d =")} {mode === 'external' ? 'r₁ + r₂' : '|r₁ − r₂|'}</p>}
    </div>
  );
}

function CyclicQuadInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [angleA, setAngleA] = useState(70);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const angleC = 180 - angleA;
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - angleC) < 0.5 ? 'correct' : 'incorrect'); if (Math.abs(val - angleC) < 0.5) onAnswer(true); };
  return (
    <div className="space-y-4">
      <div><label className="text-xs font-semibold">∠A</label><input type="range" min="1" max="179" step="1" value={angleA} onChange={e => { setAngleA(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-cyan-500" /><span className="text-xs">{t("∠A =")} {angleA}°</span></div>
      <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200"><p className="text-xs text-cyan-700 font-mono">{t("∠A + ∠C =")} {angleA}° + {angleC}° = <strong>180°</strong> ✓</p></div>
      <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("∠C")} step="1" className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-cyan-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button></div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! ∠A+∠C=180°")}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try ∠C = 180° − ∠A")}</p>}
    </div>
  );
}

function AlternateSegmentInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [angle, setAngle] = useState(40);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - angle) < 0.5 ? 'correct' : 'incorrect'); if (Math.abs(val - angle) < 0.5) onAnswer(true); };
  return (
    <div className="space-y-4">
      <div><label className="text-xs font-semibold">{t("∠APT")}</label><input type="range" min="10" max="80" step="1" value={angle} onChange={e => { setAngle(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-pink-500" /><span className="text-xs">{t("∠APT =")} {angle}°</span></div>
      <div className="bg-pink-50 rounded-lg p-3 border border-pink-200"><p className="text-xs text-pink-700 font-mono">{t("Alternate Segment Theorem: ∠APT = ∠ABP")}<br />{t("∠ABP =")} <strong>{angle}°</strong></p></div>
      <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("∠ABP")} step="1" className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-pink-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button></div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! ∠ABP =")} {angle}°</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("∠ABP equals ∠APT in the alternate segment")}</p>}
    </div>
  );
}

function SemicircleAngleInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [position, setPosition] = useState(40);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - 90) < 1 ? 'correct' : 'incorrect'); if (Math.abs(val - 90) < 1) onAnswer(true); };
  return (
    <div className="space-y-4">
      <div><label className="text-xs font-semibold">{t("Point P on semicircle")}</label><input type="range" min="0" max="100" step="1" value={position} onChange={e => setPosition(parseFloat(e.target.value))} className="w-full accent-blue-500" /></div>
      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200"><p className="text-xs text-blue-700 font-mono">{t("∠APB =")} <strong>90°</strong> {t("(angle in a semicircle)")}</p></div>
      <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("∠APB")} step="1" className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button></div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! Always 90°!")}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Angle in a semicircle is always 90°!")}</p>}
    </div>
  );
}

// ========== Theme Configs ==========

export const CLASS10_THEOREMS: Record<string, TheoremConfig> = {
  // === Unit 2: Quadratic Equations ===
  quadratic_formula: {
    theoremKey: 'class10.quadratic_formula',
    title: 'Derivation of the Quadratic Formula',
    icon: <Hash className="w-5 h-5 text-white" />,
    accentGradient: 'from-blue-500 to-indigo-600',
    accentColor: 'bg-blue-600',
    finalFormula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    finalFormulaDesc: 'A universal formula to solve any quadratic equation ax² + bx + c = 0.',
    keyInsight: 'The discriminant D = b²−4ac tells you everything: D > 0 means 2 real roots (parabola crosses x-axis twice), D = 0 means 1 root (touches once), D < 0 means no real roots (never crosses). Architects use this to design arches that perfectly span a given distance!',
    steps: [
      { label: 'Start with standard form', formula: 'ax^2 + bx + c = 0', detail: '🏗️ You\'re an architect designing a parabolic arch. The curve follows ax² + bx + c = 0. You need a formula that works for ANY arch shape. Start with the general quadratic equation.' },
      { label: 'Move constant term', formula: 'ax^2 + bx = -c', detail: 'Shift the constant c to the right side: ax² + bx = −c. The arch\'s vertical offset doesn\'t affect its shape — it just shifts it up or down.' },
      { label: 'Divide by a', formula: 'x^2 + \{b}{a}x = -\{c}{a}', detail: 'Divide by a to make the coefficient of x² equal to 1. This sets up the next step: completing the square.' },
      { label: 'Complete the square', formula: '\(x + \{b}{2a}\)^2 = \{b^2 - 4ac}{4a^2}', detail: 'Add (b/2a)² to both sides: x² + (b/a)x + (b/2a)² = (b/2a)² − c/a. The left simplifies to (x + b/2a)², and the right becomes (b²−4ac)/(4a²).' },
      { label: 'Take square root and solve', formula: 'x = \{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', detail: 'Take the square root: x + b/2a = ±√(b²−4ac)/(2a). Isolate x to get the Quadratic Formula. This is the single most used formula in algebra!' },
    ],
    practice: { question: 'Solve x² − 5x + 6 = 0 using the formula.', hint: 'a=1, b=−5, c=6. D = 25−24 = 1, x = [5±1]/2', answer: 3, tolerance: 0.5, explanation: 'x = 2 or 3. The quadratic formula finds both roots!', errorHint: 'Use x = [−b ± √(b²−4ac)] / 2a' },
    interactive: QuadraticFormulaInteractive,
  },

  // === Unit 7: Vectors in Plane ===
  vector_diff: {
    theoremKey: 'class10.vector_diff',
    title: 'Finding a Vector from Position Vectors',
    icon: <Move3d className="w-5 h-5 text-white" />,
    accentGradient: 'from-amber-500 to-yellow-600',
    accentColor: 'bg-amber-600',
    finalFormula: '\\overrightarrow{AB} = \\mathbf{b} - \\mathbf{a}',
    finalFormulaDesc: 'The vector AB equals the position vector of B minus the position vector of A.',
    keyInsight: 'GPS navigation uses this every second! Your phone calculates the vector from your current position to your destination by subtracting their coordinates. This is the foundation of all motion tracking in physics and engineering.',
    steps: [
      { label: 'Define position vectors', formula: '\\mathbf{a} = \\overrightarrow{OA}, \\mathbf{b} = \\overrightarrow{OB}', detail: '🗺️ You\'re tracking two delivery drones. Drone A is at (2, 3) and drone B is at (7, 5). Their position vectors from the control tower (origin O) are ã and b⃗.' },
      { label: 'Use triangle law', formula: '\\overrightarrow{OA} + \\overrightarrow{AB} = \\overrightarrow{OB}', detail: 'To travel from O to B via A: OA + AB = OB. This is the triangle law of vector addition.' },
      { label: 'Rearrange', formula: '\\overrightarrow{AB} = \\mathbf{b} - \\mathbf{a}', detail: 'AB = OB − OA. The vector from A to B is the difference between the two position vectors.' },
      { label: 'Substitute coordinates', formula: '\\overrightarrow{AB} = (x_2 - x_1, y_2 - y_1)', detail: 'AB = (x₂−x₁, y₂−y₁). The components tell you the displacement in each direction. The magnitude |AB| = √((x₂−x₁)² + (y₂−y₁)²) gives the straight-line distance.' },
    ],
    practice: { question: 'A=(1,2), B=(4,6). Find the x-component of AB.', hint: 'AB = (4−1, 6−2) = (3, 4)', answer: 3, tolerance: 0.1, explanation: 'The x-component is 3. AB = (3, 4) and |AB| = 5.', errorHint: 'AB = (x₂−x₁, y₂−y₁)' },
    interactive: VectorDiffInteractive,
  },

  // === Unit 8: Application of Trigonometry ===
  law_cosines: {
    theoremKey: 'class10.law_cosines',
    title: 'Law of Cosines',
    icon: <Triangle className="w-5 h-5 text-white" />,
    accentGradient: 'from-rose-500 to-pink-600',
    accentColor: 'bg-rose-600',
    finalFormula: 'a^2 = b^2 + c^2 - 2bc \\cos \\alpha',
    finalFormulaDesc: 'Generalizes Pythagoras for ANY triangle, not just right-angled ones.',
    keyInsight: 'Surveyors use this to measure land plots. If you know two sides of a field and the angle between them (SAS), you can calculate the third side without having to walk across it!',
    steps: [
      { label: 'Draw altitude AD ⟂ BC', formula: 'AD = c \\sin \\beta, BD = c \\cos \\beta', detail: '🏔️ Drop a perpendicular AD from A to side BC, creating two right triangles.' },
      { label: 'Find CD = a − BD', formula: 'CD = a - c \\cos \\beta', detail: 'CD = a − c \\cos β. The altitude splits the base into two segments.' },
      { label: 'Apply Pythagoras in right triangle ADC', formula: 'b^2 = (c \\sin \\beta)^2 + (a - c \\cos \\beta)^2', detail: 'b² = c² \\sin²β + a² + c² \\cos²β − 2ac \\cos β.' },
      { label: 'Simplify using \\sin²+\\cos²=1', formula: 'b^2 = a^2 + c^2 - 2ac \\cos \\beta', detail: 'b² = a² + c²(\\sin²β + \\cos²β) − 2ac \\cos β = a² + c² − 2ac \\cos β. When β = 90°, this becomes the Pythagorean Theorem!' },
    ],
    practice: { question: 'b=5, c=6, α=60°. Find side a.', hint: 'a² = 5² + 6² − 2×5×6×cos 60° = 25+36−60×0.5 = 31', answer: 5.57, tolerance: 0.1, explanation: 'a = √31 ≈ 5.57 units.', errorHint: 'a² = b² + c² − 2bc cos α' },
    interactive: LawCosinesInteractive,
  },
  law_sines: {
    theoremKey: 'class10.law_sines',
    title: 'Law of Sines',
    icon: <Triangle className="w-5 h-5 text-white" />,
    accentGradient: 'from-sky-500 to-blue-600',
    accentColor: 'bg-sky-600',
    finalFormula: '\\frac{a}{\\sin \\alpha} = \\frac{b}{\\sin \\beta} = \\frac{c}{\\sin \\gamma}',
    finalFormulaDesc: 'The ratio of a side to the sine of its opposite angle is constant.',
    keyInsight: 'GPS satellites use this! By measuring angles to multiple satellites, your phone uses the Law of Sines to triangulate your exact position anywhere on Earth.',
    steps: [
      { label: 'Draw altitude h from B to AC', formula: 'h = c \\sin \\alpha = a \\sin \\gamma', detail: '🌄 Drop a perpendicular from B to base AC. The altitude h can be expressed in two ways: h = c \\sin α and h = a \\sin γ.' },
      { label: 'Equate the expressions', formula: 'c \\sin \\alpha = a \\sin \\gamma \⇒ \{a}{\\sin \\alpha} = \{c}{\\sin \\gamma}', detail: 'Since both equal the same altitude: c \\sin α = a \\sin γ → a/\\sin α = c/\\sin γ.' },
      { label: 'Repeat for other sides', formula: '\{a}{\\sin \\alpha} = \{b}{\\sin \\beta} = \{c}{\\sin \\gamma}', detail: 'Repeat with other altitudes to get the complete Law of Sines.' },
    ],
    practice: { question: 'a=7, α=50°, β=70°. Find side b.', hint: 'b = 7 × sin(70°)/sin(50°) = 7×0.9397/0.7660', answer: 8.59, tolerance: 0.1, explanation: 'b ≈ 8.59 units.', errorHint: 'a/sin α = b/sin β' },
    interactive: LawSinesInteractive,
  },
  law_tangents: {
    theoremKey: 'class10.law_tangents',
    title: 'Law of Tangents',
    icon: <Triangle className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-fuchsia-600',
    accentColor: 'bg-indigo-600',
    finalFormula: '\\frac{a+b}{a-b} = \\frac{tan[(\\alpha+\\beta)/2]}{tan[(\\alpha-\\beta)/2]}',
    finalFormulaDesc: 'Relates side lengths to tangent of half angle sums and differences.',
    keyInsight: 'In navigation and surveying, the Law of Tangents is preferred over the Law of Cosines when two sides and the included angle are known, as it avoids square roots and gives cleaner results!',
    steps: [
      { label: 'Start with Law of Sines', formula: '\{a}{b} = \{\\sin \\alpha}{\\sin \\beta}', detail: '📐 From a/\\sin α = b/\\sin β, we get a/b = \\sin α/\\sin β.' },
      { label: 'Apply componendo-dividendo', formula: '\{a+b}{a-b} = \{\\sin \\alpha + \\sin \\beta}{\\sin \\alpha - \\sin \\beta}', detail: 'Using componendo-dividendo: (a+b)/(a−b) = (\\sin α + \\sin β)/(\\sin α − \\sin β).' },
      { label: 'Apply sum-to-product', formula: '\{a+b}{a-b} = \{tan[(\\alpha+\\beta)/2]}{tan[(\\alpha-\\beta)/2]}', detail: '\\sin α + \\sin β = 2 \\sin[(α+β)/2] \\cos[(α−β)/2] and \\sin α − \\sin β = 2 \\cos[(α+β)/2] \\sin[(α−β)/2]. The ratio simplifies to the tangent form.' },
    ],
    practice: { question: 'α=80°, β=40°. Find tan[(α+β)/2]/tan[(α−β)/2].', hint: '(80+40)/2 = 60°, (80-40)/2 = 20°. tan60°/tan20°', answer: 4.76, tolerance: 0.5, explanation: 'tan60°/tan20° ≈ 1.732/0.364 ≈ 4.76', errorHint: 'Use tan[(α+β)/2] / tan[(α−β)/2]' },
    interactive: LawCosinesInteractive,
  },
  half_angle_cos: {
    theoremKey: 'class10.half_angle_cos',
    title: 'Half Angle Formula for Cosines',
    icon: <Square className="w-5 h-5 text-white" />,
    accentGradient: 'from-emerald-500 to-teal-600',
    accentColor: 'bg-emerald-600',
    finalFormula: '\\cos(\\alpha/2) = \\sqrt{\\frac{S(S-a)}{bc}}',
    finalFormulaDesc: 'Express half-angle cosines directly in terms of side lengths.',
    keyInsight: 'These formulas allow you to compute trigonometric functions of half-angles without needing a calculator — just the side lengths! They\'re used in lunar and planetary calculations.',
    steps: [
      { label: 'Start with Law of Cosines', formula: '\\cos \\alpha = \{b^2 + c^2 - a^2}{2bc}', detail: '📊 \\cos α = (b²+c²−a²)/(2bc). This gives \\cos of the full angle in terms of side lengths.' },
      { label: 'Use double-angle identity', formula: '2cos^2(\\alpha/2) - 1 = \{b^2 + c^2 - a^2}{2bc}', detail: 'Since \\cos α = 2cos²(α/2) − 1, substitute: 2cos²(α/2) − 1 = (b²+c²−a²)/(2bc).' },
      { label: 'Solve for \\cos²(α/2)', formula: '\\cos^2(\\alpha/2) = \{S(S-a)}{bc}', detail: 'After algebra using the semi-perimeter S = (a+b+c)/2, we get \\cos²(α/2) = S(S−a)/(bc).' },
      { label: 'Take square root', formula: '\\cos(\\alpha/2) = \\sqrt{\{S(S-a)}{bc}}', detail: 'Taking the positive square root gives the half-angle cosine. This formula expresses a trigonometric ratio purely in terms of side lengths!' },
    ],
    practice: { question: 'a=5, b=6, c=7. S=9. Find cos(α/2).', hint: 'S=9, S−a=4, bc=42. cos(α/2) = √(9×4/42) = √(36/42)', answer: 0.926, tolerance: 0.05, explanation: 'cos(α/2) ≈ 0.926', errorHint: 'cos(α/2) = √[S(S−a)/(bc)]' },
    interactive: HerosFormulaInteractive,
  },
  half_angle_sin: {
    theoremKey: 'class10.half_angle_sin',
    title: 'Half Angle Formula for Sines',
    icon: <Square className="w-5 h-5 text-white" />,
    accentGradient: 'from-emerald-500 to-teal-600',
    accentColor: 'bg-emerald-600',
    finalFormula: '\\sin(\\alpha/2) = \\sqrt{\\frac{(S-b)(S-c)}{bc}}',
    finalFormulaDesc: 'Express half-angle sines directly in terms of side lengths.',
    keyInsight: 'Together with the cosine half-angle formula, these form the basis for Hero\'s formula and are used extensively in navigation and astronomy for celestial calculations!',
    steps: [
      { label: 'Use \\cos α = 1 − 2sin²(α/2)', formula: '1 - 2sin^2(\\alpha/2) = \{b^2 + c^2 - a^2}{2bc}', detail: '🔄 Starting with \\cos α = 1 − 2sin²(α/2), substitute the Law of Cosines.' },
      { label: 'Solve for \\sin²(α/2)', formula: '\\sin^2(\\alpha/2) = \{(S-b)(S-c)}{bc}', detail: 'After algebraic manipulation using the semi-perimeter S, we get \\sin²(α/2) = (S−b)(S−c)/(bc).' },
      { label: 'Take square root', formula: '\\sin(\\alpha/2) = \\sqrt{\{(S-b)(S-c)}{bc}}', detail: 'Together with the cosine half-angle formula, these are used extensively in navigation and astronomy for celestial calculations!' },
    ],
    practice: { question: 'a=5, b=6, c=7. S=9. Find sin(α/2).', hint: 'S−b=3, S−c=2, bc=42. sin(α/2) = √(3×2/42) = √(6/42)', answer: 0.378, tolerance: 0.05, explanation: 'sin(α/2) ≈ 0.378', errorHint: 'sin(α/2) = √[(S−b)(S−c)/(bc)]' },
    interactive: HerosFormulaInteractive,
  },
  area_sas: {
    theoremKey: 'class10.area_sas',
    title: 'Area of a Triangle (SAS)',
    icon: <Square className="w-5 h-5 text-white" />,
    accentGradient: 'from-violet-500 to-purple-600',
    accentColor: 'bg-violet-600',
    finalFormula: '\\Delta = \\frac\\frac{1}{2} bc \\sin \\alpha',
    finalFormulaDesc: 'The area of a triangle using two sides and the included angle.',
    keyInsight: 'Land surveyors love this formula: measure two sides of a plot and the angle between them, and you get the area instantly — no need to walk the entire perimeter!',
    steps: [
      { label: 'Basic area formula', formula: '\{Area} = \\frac{1}{2} \\times \{base} \\times \{height}', detail: '🌳 Take side c = AB as the base. The height is the perpendicular from C to AB.' },
      { label: 'Express height', formula: 'h = b \\sin \\alpha', detail: 'From right triangle ACD, the height h = b \\sin α.' },
      { label: 'Substitute', formula: '\\Delta = \\frac{1}{2} c \\times (b \\sin \\alpha) = \\frac{1}{2} bc \\sin \\alpha', detail: 'If α = 90°, \\sin 90° = 1, so Δ = ½bc — the familiar right triangle area formula!' },
    ],
    practice: { question: 'b=5, c=6, α=30°. Find the area.', hint: 'sin 30° = 0.5. Δ = ½×5×6×0.5', answer: 7.5, tolerance: 0.1, explanation: 'Δ = ½×5×6×sin30° = 15×0.5 = 7.5 sq units.', errorHint: 'Δ = ½ bc sin α' },
    interactive: LawCosinesInteractive,
  },
  area_aas: {
    theoremKey: 'class10.area_aas',
    title: 'Area of a Triangle (AAS)',
    icon: <Square className="w-5 h-5 text-white" />,
    accentGradient: 'from-violet-500 to-indigo-600',
    accentColor: 'bg-violet-600',
    finalFormula: '\\Delta = \\frac\\frac{1}{2} a^2 \\frac{\\sin \\beta \\sin \\gamma}{\\sin \\alpha}',
    finalFormulaDesc: 'The area using one side and two angles.',
    keyInsight: 'Perfect for measuring mountains! When you can\'t measure both adjacent sides but can measure angles from a distance, this formula gives you the area.',
    steps: [
      { label: 'Start with SAS formula', formula: '\\Delta = \\frac{1}{2} ab \\sin \\gamma', detail: '📋 When you know two angles (β, γ) and the included side a (AAS), start from Δ = ½ ab \\sin γ.' },
      { label: 'Use Law of Sines to find b', formula: 'b = \{a \\sin \\beta}{\\sin \\alpha}', detail: 'From Law of Sines: b/\\sin β = a/\\sin α → b = a \\sin β / \\sin α.' },
      { label: 'Substitute', formula: '\\Delta = \\frac{1}{2} a^2 \{\\sin \\beta \\sin \\gamma}{\\sin \\alpha}', detail: 'Δ = ½ a × (a \\sin β / \\sin α) × \\sin γ. This formula requires only one side length and two angles!' },
    ],
    practice: { question: 'a=7, β=70°, γ=60°. α=50°. Find the area.', hint: 'Δ = ½×49×sin70°×sin60°/sin50°', answer: 24.5, tolerance: 1, explanation: 'Δ ≈ 24.5 sq units.', errorHint: 'Δ = ½ a² sin β sin γ / sin α' },
    interactive: LawSinesInteractive,
  },
  heros_formula: {
    theoremKey: 'class10.heros_formula',
    title: 'Hero\'s Formula (SSS)',
    icon: <Square className="w-5 h-5 text-white" />,
    accentGradient: 'from-emerald-500 to-teal-600',
    accentColor: 'bg-emerald-600',
    finalFormula: '\\Delta = \\sqrt{S(S-a)(S-b)(S-c)}',
    finalFormulaDesc: 'The area of a triangle from its three side lengths alone.',
    keyInsight: 'This 2,000-year-old formula by Hero of Alexandria requires ONLY side lengths — no angles, no trigonometry! It\'s used today in land surveying, GPS area calculation, and even computer graphics.',
    steps: [
      { label: 'Start with Δ = ½ bc \\sin α', formula: '\\Delta = \\frac{1}{2} bc \\sin \\alpha', detail: '📏 You\'ve measured all three sides of a triangular garden: a=5m, b=6m, c=7m. Start with Δ = ½ bc \\sin α.' },
      { label: 'Use \\sin α = 2 \\sin(α/2) \\cos(α/2)', formula: '\\Delta = bc \\times \\sin(\\alpha/2) \\times \\cos(\\alpha/2)', detail: 'Using the double-angle identity: \\sin α = 2 \\sin(α/2) \\cos(α/2). Now substitute the half-angle formulas.' },
      { label: 'Substitute half-angle formulas', formula: '\\Delta = \\sqrt{S(S-a)(S-b)(S-c)}', detail: 'Substituting \\sin(α/2) = √[(S−b)(S−c)/(bc)] and \\cos(α/2) = √[S(S−a)/(bc)], the bc factors cancel, leaving Hero\'s formula!' },
    ],
    practice: { question: 'a=5, b=12, c=13. Find S and the area.', hint: 'S = (5+12+13)/2 = 15. Δ = √[15×10×3×2]', answer: 30, tolerance: 0.1, explanation: 'Δ = √900 = 30. This is a 5-12-13 right triangle!', errorHint: 'Δ = √[S(S−a)(S−b)(S−c)]' },
    interactive: HerosFormulaInteractive,
  },
  circum_radius: {
    theoremKey: 'class10.circum_radius',
    title: 'Circum-Radius of a Triangle',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-orange-500 to-red-600',
    accentColor: 'bg-orange-600',
    finalFormula: 'R = \\frac{abc}{4\\Delta}',
    finalFormulaDesc: 'The radius of the circle passing through all three vertices.',
    keyInsight: 'The circumradius relates the three sides and the area! For an equilateral triangle, R = a/√3. The larger the triangle, the larger the circumcircle. This is used in gear and wheel design.',
    steps: [
      { label: 'Draw circumscribed circle', formula: '\angle BDC = \\alpha', detail: '🌍 Draw a circle through all three vertices. Draw diameter BD. Since α and ∠BDC are in the same segment, ∠BDC = α.' },
      { label: 'Apply sine in right triangle', formula: '\{a}{2R} = \\sin \\alpha', detail: 'In right triangle BCD (angle in a semicircle): a/(2R) = \\sin α → R = a/(2 \\sin α).' },
      { label: 'Express in terms of sides and area', formula: '\\sin \\alpha = \{2\\Delta}{bc}', detail: 'From area formula: Δ = ½ bc \\sin α → \\sin α = 2Δ/(bc).' },
      { label: 'Substitute to get formula', formula: 'R = \{abc}{4\\Delta}', detail: 'R = a/(2 × 2Δ/(bc)) = abc/(4Δ). The circumradius relates all three sides and the area!' },
    ],
    practice: { question: 'a=5, b=6, c=7, Δ≈14.7. Find R.', hint: 'R = (5×6×7)/(4×14.7) = 210/58.8', answer: 3.57, tolerance: 0.1, explanation: 'R ≈ 3.57 units.', errorHint: 'R = abc/(4Δ)' },
    interactive: CircumRadiusInteractive,
  },
  in_radius: {
    theoremKey: 'class10.in_radius',
    title: 'In-Radius of a Triangle',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-teal-500 to-emerald-600',
    accentColor: 'bg-teal-600',
    finalFormula: 'r = \\frac{\\Delta}{S}',
    finalFormulaDesc: 'The radius of the circle inscribed inside a triangle.',
    keyInsight: 'The incircle is the largest circle that fits inside a triangle. This formula is used to find the radius of a pizza that fits exactly inside a triangular box — the inradius!',
    steps: [
      { label: 'Draw the incircle', formula: '\{Distance from I to each side} = r', detail: '🎯 The incircle touches all three sides of a triangle from the inside. Its centre I is the intersection of the angle bisectors.' },
      { label: 'Split triangle into three', formula: '\\Delta = \\frac{1}{2} ar + \\frac{1}{2} br + \\frac{1}{2} cr', detail: 'The incentre I divides ΔABC into three smaller triangles, each with height r.' },
      { label: 'Factor and simplify', formula: '\\Delta = r \· \{a+b+c}{2} = rS', detail: 'Δ = r(a+b+c)/2 = rS. So r = Δ/S.' },
    ],
    practice: { question: 'a=6, b=8, c=10. Area=24. Find the inradius.', hint: 'S = (6+8+10)/2 = 12. r = Δ/S = 24/12', answer: 2, tolerance: 0.1, explanation: 'r = 2. The incircle of a 6-8-10 right triangle has radius 2.', errorHint: 'r = Δ / S' },
    interactive: InRadiusInteractive,
  },
  ex_radius: {
    theoremKey: 'class10.ex_radius',
    title: 'Ex-Radius of a Triangle',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-teal-500 to-emerald-600',
    accentColor: 'bg-teal-600',
    finalFormula: 'r_1 = \\frac{\\Delta}{S-a}',
    finalFormulaDesc: 'The radius of the excircle opposite vertex A.',
    keyInsight: 'Exradii are always larger than the inradius. Each ex-circle touches one side of the triangle and the extensions of the other two sides. Used in advanced geometry and triangle geometry problems.',
    steps: [
      { label: 'Draw the excircle opposite A', formula: '\{Area}(\\triangle I_1BC) = \\frac{1}{2} a r_1', detail: '🔵 Draw the ex-centre I₁ opposite vertex A. Connect it to all three vertices, creating three regions.' },
      { label: 'Sum the signed areas', formula: '\\Delta = \\frac{1}{2} c r_1 + \\frac{1}{2} b r_1 - \\frac{1}{2} a r_1', detail: 'Δ = Area(I₁AB) + Area(I₁AC) − Area(I₁BC) because I₁BC is outside the original triangle.' },
      { label: 'Simplify', formula: '\\Delta = \\frac{1}{2} r_1(b + c - a) = r_1(S - a)', detail: 'b + c − a = 2S − 2a = 2(S−a). So Δ = ½r₁ × 2(S−a) = r₁(S−a).' },
    ],
    practice: { question: 'a=5, b=6, c=7, S=9, Δ≈14.7. Find r₁.', hint: 'r₁ = 14.7 / (9−5) = 14.7/4', answer: 3.68, tolerance: 0.1, explanation: 'r₁ ≈ 3.68. Compare with inradius r ≈ 2.10 — exradius is larger!', errorHint: 'r₁ = Δ/(S−a)' },
    interactive: InRadiusInteractive,
  },

  // === Unit 9: Chords and Arcs of a Circle ===
  three_point_circle: {
    theoremKey: 'class10.three_point_circle',
    title: 'Theorem 9.1: Three Non-Collinear Points Determine a Circle',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-purple-600',
    accentColor: 'bg-indigo-600',
    finalFormula: '\\text{One unique circle passes through three non-collinear points}',
    finalFormulaDesc: 'Three points not on a line uniquely define a circle.',
    keyInsight: 'This theorem is why three legs of a tripod always touch the ground — any three non-collinear points define a unique circle. GPS trilateration uses this principle to locate positions!',
    steps: [
      { label: 'Take three non-collinear points', formula: '\{Points } A, B, C', detail: '📍 Pick any three points A, B, C that don\'t lie on a straight line. Connect them to form a triangle.' },
      { label: 'Draw perpendicular bisectors', formula: '\{Perpendicular bisectors intersect at } O', detail: 'Draw the perpendicular bisectors of any two sides. They meet at a single point O, the circumcentre.' },
      { label: 'O is equidistant', formula: 'OA = OB = OC = R', detail: 'O lies on the bisector of AB, so OA = OB. It also lies on the bisector of BC, so OB = OC. Therefore OA = OB = OC.' },
      { label: 'Draw the circle', formula: '\{Circle with centre } O \{ and radius } OA', detail: 'If the points were collinear, the bisectors would be parallel and never meet — proving collinear points can never lie on a circle!' },
    ],
    practice: { question: 'Three points form a triangle with sides 3, 4, 5. What shape defines the unique circle through them?', hint: 'Every triangle has a unique circumcircle.', answer: 1, tolerance: 0.5, explanation: 'Every triangle (3 non-collinear points) defines exactly one circumcircle.', errorHint: 'Any three non-collinear points define one circle' },
    interactive: CircleChordInteractive,
  },
  centre_bisects: {
    theoremKey: 'class10.centre_bisects',
    title: 'Theorem 9.2: Centre to Midpoint of Chord is Perpendicular',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-purple-600',
    accentColor: 'bg-indigo-600',
    finalFormula: 'OC \\perp AB \\text{ if } AC = BC',
    finalFormulaDesc: 'A line from the centre to the midpoint of a chord is perpendicular to the chord.',
    keyInsight: 'This is why a spirit level works — the bubble\'s centre line is perpendicular to the surface. In construction, this theorem ensures circular pipes are level.',
    steps: [
      { label: 'Draw chord AB with midpoint C', formula: 'AC = BC', detail: '⚽ Take a chord AB on a circle. Mark its midpoint C. Draw a line from the centre O to C.' },
      { label: 'Join OA and OB', formula: 'OA = OB', detail: 'OA and OB are radii, so OA = OB. Triangle OAB is isosceles with apex at O.' },
      { label: 'Use isosceles property', formula: 'OC \\perp AB', detail: 'In isosceles triangle OAB, the line from O to the midpoint C of base AB is also the altitude. So OC ⟂ AB.' },
    ],
    practice: { question: 'In a circle of radius 10, a chord has midpoint 6 units from centre. Find half the chord length.', hint: 'By Pythagoras: half-chord = √(10²−6²)', answer: 8, tolerance: 0.5, explanation: 'Half-chord = √(100−36) = √64 = 8. Full chord = 16.', errorHint: 'Use Pythagoras: half-chord = √(r²−d²)' },
    interactive: CircleChordInteractive,
  },
  perp_bisects: {
    theoremKey: 'class10.perp_bisects',
    title: 'Theorem 9.3: Perpendicular from Centre Bisects Chord',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-purple-600',
    accentColor: 'bg-indigo-600',
    finalFormula: 'OC \\perp AB \\Rightarrow AC = BC',
    finalFormulaDesc: 'The perpendicular from the centre to a chord bisects it.',
    keyInsight: 'This is the converse of Theorem 9.2. Together, they form the foundation of all chord calculations — used in designing arches, bridges, and circular structures like the Colosseum!',
    steps: [
      { label: 'Draw perpendicular from O', formula: '\angle OCA = 90^\\circ', detail: '🎯 Draw a chord AB and a perpendicular from centre O to meet AB at C.' },
      { label: 'Join OA and OB', formula: 'OA = OB', detail: 'OA and OB are radii, so OA = OB. Triangle OAB is isosceles.' },
      { label: 'Prove triangles congruent', formula: '\\triangle OAC \\cong \\triangle OBC', detail: 'OA = OB (radii), OC = OC (common), ∠OCA = ∠OCB = 90°. So triangles are congruent by RHS. Therefore AC = BC.' },
    ],
    practice: { question: 'A chord 16 units long has distance 6 from the centre. Find the radius.', hint: 'r² = 6² + (16/2)² = 36 + 64', answer: 10, tolerance: 0.5, explanation: 'r = √(36+64) = √100 = 10.', errorHint: 'r² = d² + (c/2)²' },
    interactive: CircleChordInteractive,
  },
  equal_chords_equal_dist: {
    theoremKey: 'class10.equal_chords_equal_dist',
    title: 'Theorem 9.4: Equal Chords are Equidistant from Centre',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-purple-600',
    accentColor: 'bg-indigo-600',
    finalFormula: 'AB = CD \\Rightarrow OE = OF',
    finalFormulaDesc: 'Equal chords are at the same distance from the centre.',
    keyInsight: 'Two guitar strings (chords) of the same length are the same distance from the centre of the circular sound hole. This is used in engineering to balance forces in circular structures.',
    steps: [
      { label: 'Draw two equal chords', formula: 'AB = CD', detail: '✏️ Draw two chords AB and CD of equal length. Draw perpendiculars OE and OF from the centre to each chord.' },
      { label: 'Apply perpendicular bisector property', formula: 'AE = CF', detail: 'By Theorem 9.3, E and F are midpoints. AE = AB/2, CF = CD/2. Since AB = CD, AE = CF.' },
      { label: 'Use Pythagoras', formula: 'OE^2 = OA^2 - AE^2, OF^2 = OC^2 - CF^2', detail: 'In right triangles OAE and OCF, since OA = OC (radii) and AE = CF: OE² = OF² → OE = OF.' },
    ],
    practice: { question: 'Two equal chords of length 16 have distance 6 from centre. What is the distance?', hint: 'Equal chords → equal distances from centre.', answer: 6, tolerance: 0.5, explanation: 'Equal chords are equidistant from the centre.', errorHint: 'Equal chords are equidistant from centre' },
    interactive: CircleChordInteractive,
  },
  equidistant_chords: {
    theoremKey: 'class10.equidistant_chords',
    title: 'Theorem 9.5: Equidistant Chords are Congruent',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-purple-600',
    accentColor: 'bg-indigo-600',
    finalFormula: 'OE = OF \\Rightarrow AB = CD',
    finalFormulaDesc: 'Chords at equal distance from the centre are equal in length.',
    keyInsight: 'This completes the \"if and only if\": chords are equal ↔ equidistant. This symmetry is fundamental in circular grid design and radial structures like Ferris wheels.',
    steps: [
      { label: 'Draw chords at equal distance', formula: 'OE = OF', detail: '🎪 Draw two chords AB and CD such that their perpendicular distances from the centre (OE and OF) are equal.' },
      { label: 'Use Pythagoras', formula: 'AE^2 = OA^2 - OE^2, CF^2 = OC^2 - OF^2', detail: 'Since OA = OC (radii) and OE = OF: AE² = CF² → AE = CF.' },
      { label: 'Double the half-lengths', formula: 'AB = 2 \\times AE = 2 \\times CF = CD', detail: 'E and F are midpoints (Theorem 9.3), so AB = 2×AE and CD = 2×CF. Since AE = CF, we get AB = CD.' },
    ],
    practice: { question: 'Two chords are both 8 units from the centre of a circle of radius 10. Are they equal?', hint: 'Equal distances from centre → equal chords.', answer: 1, tolerance: 0.5, explanation: 'Yes, chords at equal distance from the centre are always equal in length.', errorHint: 'Equal distance from centre → equal chords' },
    interactive: CircleChordInteractive,
  },
  congruent_arcs: {
    theoremKey: 'class10.congruent_arcs',
    title: 'Theorem 9.6: Congruent Arcs → Equal Chords',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-purple-600',
    accentColor: 'bg-indigo-600',
    finalFormula: '\\text{Arc } AB \\cong \\text{Arc } CD \\Rightarrow AB = CD',
    finalFormulaDesc: 'Congruent arcs subtend equal chords.',
    keyInsight: 'Equal gear teeth (arcs) must have equal chord lengths for smooth meshing. In map-making, equal arcs of latitude create equal chords on the globe.',
    steps: [
      { label: 'Take two congruent arcs', formula: '\{Arc } AB \\cong \{Arc } CD', detail: '🎵 Imagine two identical arcs on a circle — like equal-length curved sections of a circular railway track.' },
      { label: 'Rotate to coincide', formula: '\{Arc } AB \{ maps to Arc } CD', detail: 'Since the arcs are congruent, rotate one arc onto the other. Their endpoints match up.' },
      { label: 'Chords are equal', formula: 'AB = CD', detail: 'The chords connect corresponding endpoints. Since arcs perfectly overlap, chords must be equal.' },
    ],
    practice: { question: 'Arcs AB and CD each subtend 60° at the centre. Are chords AB and CD equal?', hint: 'Equal central angles → equal arcs → equal chords.', answer: 1, tolerance: 0.5, explanation: 'Yes, congruent arcs have equal chords.', errorHint: 'Congruent arcs → equal chords' },
    interactive: CircleChordInteractive,
  },
  equal_chords_arcs: {
    theoremKey: 'class10.equal_chords_arcs',
    title: 'Theorem 9.7: Equal Chords → Congruent Arcs',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-purple-600',
    accentColor: 'bg-indigo-600',
    finalFormula: 'AB = CD \\Rightarrow \\text{Arc } AB \\cong \\text{Arc } CD',
    finalFormulaDesc: 'Equal chords subtend congruent arcs.',
    keyInsight: 'Equal chords ↔ equal central angles ↔ congruent arcs. This one-to-one correspondence is fundamental to circular geometry and is used in compass and straightedge constructions.',
    steps: [
      { label: 'Draw two equal chords', formula: 'AB = CD', detail: '🔗 Draw two equal chords AB and CD on a circle, like two equal-length strings on a circular instrument.' },
      { label: 'Join centre to endpoints', formula: '\\triangle OAB \\cong \\triangle OCD \{ (SSS)}', detail: 'OA = OB = OC = OD = r and AB = CD. So triangles are congruent by SSS.' },
      { label: 'Central angles are equal', formula: '\angle AOB = \angle COD', detail: 'From congruency of triangles, the central angles are equal. Equal central angles mean equal arcs.' },
    ],
    practice: { question: 'Two equal chords subtend what kind of arcs?', hint: 'Equal chords → equal central angles → equal arcs.', answer: 1, tolerance: 0.5, explanation: 'Equal chords always subtend congruent arcs.', errorHint: 'Equal chords → congruent arcs' },
    interactive: CircleChordInteractive,
  },
  equal_chords_angles: {
    theoremKey: 'class10.equal_chords_angles',
    title: 'Theorem 9.8: Equal Chords → Equal Angles at Centre',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-purple-600',
    accentColor: 'bg-indigo-600',
    finalFormula: 'AB = CD \\Rightarrow \\angle AOB = \\angle COD',
    finalFormulaDesc: 'Equal chords subtend equal angles at the centre.',
    keyInsight: 'Equal pizza crust slices (chords) mean equal central angles — giving you equal-sized slices! This theorem is why equal spacing on a circle creates equal angles, fundamental in polygon construction.',
    steps: [
      { label: 'Draw two equal chords', formula: 'AB = CD', detail: '🎯 Draw two equal chords AB and CD in a circle. Connect their endpoints to the centre O.' },
      { label: 'Compare triangles', formula: '\\triangle OAB \\cong \\triangle OCD \{ (SSS)}', detail: 'OA = OC (radii), OB = OD (radii), AB = CD (given). SSS congruence.' },
      { label: 'Corresponding angles equal', formula: '\angle AOB = \angle COD', detail: 'From the congruence, ∠AOB = ∠COD. Equal chords subtend equal central angles.' },
    ],
    practice: { question: 'Chord AB = chord CD in the same circle. If ∠AOB = 60°, what is ∠COD?', hint: 'Equal chords → equal central angles.', answer: 60, tolerance: 1, explanation: '∠COD = 60°. Equal chords subtend equal angles at the centre.', errorHint: 'Equal chords subtend equal central angles' },
    interactive: CircleChordInteractive,
  },
  equal_angles_chords: {
    theoremKey: 'class10.equal_angles_chords',
    title: 'Theorem 9.9: Equal Central Angles → Equal Chords',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-purple-600',
    accentColor: 'bg-indigo-600',
    finalFormula: '\\angle AOB = \\angle COD \\Rightarrow AB = CD',
    finalFormulaDesc: 'Equal angles at the centre subtend equal chords.',
    keyInsight: 'This completes the cycle: equal chords ↔ equal central angles ↔ congruent arcs. Used in engineering to create evenly spaced holes on a circular flange!',
    steps: [
      { label: 'Draw chords with equal central angles', formula: '\angle AOB = \angle COD', detail: '📐 Draw two chords AB and CD with equal central angles.' },
      { label: 'Compare triangles', formula: '\\triangle OAB \\cong \\triangle OCD \{ (SAS)}', detail: 'OA = OC (radii), OB = OD (radii), ∠AOB = ∠COD (given). SAS congruence.' },
      { label: 'Corresponding sides equal', formula: 'AB = CD', detail: 'From the congruence, AB = CD. Equal central angles subtend equal chords.' },
    ],
    practice: { question: 'Central angles ∠AOB = ∠COD = 45°. Are chords AB and CD equal?', hint: 'Equal central angles → equal chords.', answer: 1, tolerance: 0.5, explanation: 'Yes, equal central angles always subtend equal chords.', errorHint: 'Equal central angles → equal chords' },
    interactive: CircleChordInteractive,
  },

  // === Unit 10: Tangents and Angles of a Circle ===
  perp_radius_tangent: {
    theoremKey: 'class10.perp_radius_tangent',
    title: 'Theorem 10.1: Perpendicular to Radius = Tangent',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-purple-500 to-violet-600',
    accentColor: 'bg-purple-600',
    finalFormula: '\\text{Line } \\perp \\text{ radius at endpoint } \\Rightarrow \\text{ tangent}',
    finalFormulaDesc: 'A line perpendicular to a radius at its endpoint on the circle is a tangent.',
    keyInsight: 'This is the construction method for tangents — simply draw a perpendicular at the endpoint of a radius. Used in designing roller coaster tracks and railway curves!',
    steps: [
      { label: 'Draw radius and perpendicular', formula: 'OA \\perp PQ', detail: '🔄 Draw a radial segment OA from centre O to point A on the circle. Draw line PQ ⟂ OA at A.' },
      { label: 'Check distance from centre', formula: '\{Distance from O to any point on PQ} \\geq OA', detail: 'Since OA is the perpendicular distance, it\'s the shortest distance from O to PQ. Any other point on PQ is farther from O than OA.' },
      { label: 'Only one intersection', formula: '\{PQ touches circle at exactly } A', detail: 'The distance from O to any other point on PQ is greater than the radius, so no other point lies on the circle.' },
      { label: 'PQ is a tangent', formula: '\{PQ is tangent to the circle at } A', detail: 'A line touching a circle at exactly one point is a tangent. Draw a perpendicular at a radius endpoint to construct a tangent!' },
    ],
    practice: { question: 'A line is drawn perpendicular to a radius at its endpoint on the circle. What is it?', hint: 'A line perpendicular to radius at endpoint is a...', answer: 1, tolerance: 0.5, explanation: 'It\'s a tangent to the circle.', errorHint: 'Perpendicular at endpoint of radius = tangent' },
    interactive: TangentCircleInteractive,
  },
  tangent_perp_radius: {
    theoremKey: 'class10.tangent_perp_radius',
    title: 'Theorem 10.2: Tangent ⟂ Radius at Point of Contact',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-purple-500 to-violet-600',
    accentColor: 'bg-purple-600',
    finalFormula: '\\text{Tangent } \\perp \\text{ radius at point of contact}',
    finalFormulaDesc: 'The tangent and the radius at the point of contact are perpendicular.',
    keyInsight: 'This is why a bicycle wheel\'s spokes (radii) are perpendicular to the ground (tangent) at the contact point. This property is fundamental in wheel design and railway engineering.',
    steps: [
      { label: 'Draw tangent and radius', formula: '\{Tangent } PQ, \{ radius } OB', detail: '⭕ Draw a circle with centre O. Draw a tangent PQ touching the circle at B. Draw radius OB.' },
      { label: 'Assume not ⟂ (contradiction)', formula: '\{Suppose } OB \{ not } \\perp PQ', detail: 'If OB is NOT perpendicular, then some other point on PQ is closer to O than B.' },
      { label: 'Contradiction', formula: '\{Other point would be inside the circle}', detail: 'That closer point would be inside the circle, meaning PQ intersects the circle at two points — contradicting that PQ is a tangent.' },
      { label: 'Therefore OB ⟂ PQ', formula: 'OB \\perp PQ', detail: 'The assumption is false, so OB ⟂ PQ. The radius and tangent are always perpendicular.' },
    ],
    practice: { question: 'Radius OB meets tangent at B. What is the angle between them?', hint: 'Tangent is perpendicular to radius at point of contact.', answer: 90, tolerance: 1, explanation: 'The angle is always 90°.', errorHint: 'Tangent ⟂ radius = 90°' },
    interactive: TangentCircleInteractive,
  },
  equal_tangents: {
    theoremKey: 'class10.equal_tangents',
    title: 'Theorem 10.3: Two Tangents from External Point are Equal',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-purple-500 to-violet-600',
    accentColor: 'bg-purple-600',
    finalFormula: 'AB = AC \\text{ (tangents from } A \\text{ to circle)}',
    finalFormulaDesc: 'The lengths of two tangents from an external point to a circle are equal.',
    keyInsight: 'When you draw two tangents from a point to a circle, they\'re always the same length. This is used in designing V-belt drives around pulleys — both sides of the belt are equal!',
    steps: [
      { label: 'Draw tangents from external point', formula: '\{Tangents } AB \{ and } AC', detail: '📍 Take point A outside the circle. Draw two tangents AB and AC touching the circle at B and C.' },
      { label: 'Join centre to points', formula: "OB \\perp AB, OC \\perp AC", detail: 'Join OA, OB, OC. By Theorem 10.2: OB ⟂ AB and OC ⟂ AC, so ∠OBA = ∠OCA = 90°.' },
      { label: 'Prove triangles congruent', formula: '\\triangle OBA \\cong \\triangle OCA \{ (RHS)}', detail: 'OB = OC (radii), OA = OA (common), ∠OBA = ∠OCA = 90°. RHS congruence → AB = AC.' },
    ],
    practice: { question: 'Two tangents are drawn from point A to a circle. If one tangent is 12 cm, how long is the other?', hint: 'Two tangents from the same external point are equal.', answer: 12, tolerance: 0.5, explanation: 'Both tangents from A are equal: AB = AC = 12 cm.', errorHint: 'Tangents from same point are equal' },
    interactive: TangentCircleInteractive,
  },
  external_touching: {
    theoremKey: 'class10.external_touching',
    title: 'Theorem 10.4: Externally Touching Circles',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-purple-500 to-violet-600',
    accentColor: 'bg-purple-600',
    finalFormula: 'd = r_1 + r_2 \\text{ (distance between centres)}',
    finalFormulaDesc: 'If circles touch externally, distance between centres equals sum of radii.',
    keyInsight: 'When two soap bubbles merge, their centres are separated by the sum of their radii. This is also why ball bearings sit perfectly between inner and outer races.',
    steps: [
      { label: 'Draw two circles touching externally', formula: '\{Centres } A, B, \{ radii } r_1, r_2', detail: '🔵🔵 Draw two circles with centres A and B that touch at exactly one point C.' },
      { label: 'Point C lies on line AB', formula: '\{C is on the line connecting centres}', detail: 'The shortest distance between A and B passes through point of contact C.' },
      { label: 'AC = r₁, BC = r₂', formula: 'AB = AC + BC = r_1 + r_2', detail: 'AC is radius r₁, BC is radius r₂. Since C lies on line AB: AB = r₁ + r₂.' },
    ],
    practice: { question: 'Two circles of radii 3 cm and 4 cm touch externally. Distance between centres?', hint: 'd = r₁ + r₂ = 3 + 4', answer: 7, tolerance: 0.5, explanation: 'd = 3 + 4 = 7 cm.', errorHint: 'd = r₁ + r₂ (external touch)' },
    interactive: TangentCircleInteractive,
  },
  internal_touching: {
    theoremKey: 'class10.internal_touching',
    title: 'Theorem 10.5: Internally Touching Circles',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-purple-500 to-violet-600',
    accentColor: 'bg-purple-600',
    finalFormula: 'd = |r_1 - r_2| \\text{ (distance between centres)}',
    finalFormulaDesc: 'If circles touch internally, distance equals difference of radii.',
    keyInsight: 'Ball bearings use this principle: the inner race (small circle) touches the outer race (large circle) internally at exactly one point.',
    steps: [
      { label: 'Draw circles touching internally', formula: '\{Larger radius } r_1, \{ smaller } r_2', detail: '⭕🔵 Draw a larger circle (radius r₁) and a smaller one (radius r₂) inside it, touching at C.' },
      { label: 'Point C on line AB', formula: '\{C is on the line connecting centres } A \{ and } B', detail: 'The circles touch at C, which lies on line AB. The smaller circle is inside the larger one.' },
      { label: 'AC = r₁, BC = r₂', formula: 'AB = AC - BC = r_1 - r_2', detail: 'For the outer circle: AC = r₁. For the inner circle: BC = r₂. Since B is inside: AB = r₁ − r₂.' },
    ],
    practice: { question: 'Two circles of radii 5 cm and 2 cm touch internally. Distance between centres?', hint: 'd = |r₁ − r₂| = 5 − 2', answer: 3, tolerance: 0.5, explanation: 'd = 5 − 2 = 3 cm.', errorHint: 'd = |r₁ − r₂| (internal touch)' },
    interactive: TangentCircleInteractive,
  },
  alternate_segment: {
    theoremKey: 'class10.alternate_segment',
    title: 'Theorem 10.6: Alternate Segment Theorem',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-pink-500 to-rose-600',
    accentColor: 'bg-pink-600',
    finalFormula: '\\angle APT = \\angle ABP \\text{ (tangent-chord angle)}',
    finalFormulaDesc: 'Angle between tangent and chord equals angle in the alternate segment.',
    keyInsight: 'Sailors use this theorem: the angle between a coastline (tangent) and a line to a lighthouse (chord) determines their position. It\'s one of the most beautiful theorems in circle geometry!',
    steps: [
      { label: 'Draw tangent and chord', formula: '\{Tangent } PT \{ at } A, \{ chord } AB', detail: '🎯 Draw a circle with tangent PT at point A. Draw chord AB, creating ∠APT between tangent and chord.' },
      { label: 'Identify alternate segment', formula: '\{Alternate segment is opposite the tangent}', detail: 'The chord AB divides the circle into two segments. The alternate segment is opposite the tangent.' },
      { label: 'Measure both angles', formula: '\angle APT = \angle ABP', detail: 'The angle between tangent and chord equals the angle in the alternate segment.' },
    ],
    practice: { question: '∠APT = 55°. What is ∠ABP?', hint: 'Alternate Segment Theorem: ∠ABP = ∠APT', answer: 55, tolerance: 1, explanation: '∠ABP = 55°, the same as ∠APT.', errorHint: '∠APT = ∠ABP (alternate segment)' },
    interactive: AlternateSegmentInteractive,
  },
  central_angle: {
    theoremKey: 'class10.central_angle',
    title: 'Theorem 10.7: Central Angle = 2 × Inscribed Angle',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-cyan-500 to-blue-600',
    accentColor: 'bg-cyan-600',
    finalFormula: '\\angle COD = 2 \\angle CED \\text{ (on the major arc)}',
    finalFormulaDesc: 'The central angle is double any inscribed angle subtended by the same arc.',
    keyInsight: 'This explains why the angle in a semicircle is 90° — the central angle is 180° (a straight line), so the inscribed angle is half: 90°. This is the \"Golden Theorem\" of circle geometry!',
    steps: [
      { label: 'Draw central and inscribed angles', formula: '\angle COD \{ (central)}, \angle CED \{ (inscribed)}', detail: '📐 Draw chord CD. Central angle ∠COD and inscribed angle ∠CED subtend the same chord CD.' },
      { label: 'Join O to E and extend', formula: '\angle COF = 2\angle CEO', detail: 'Extend OE to F. Since OC = OE (radii), triangle COE is isosceles. The exterior angle ∠COF = 2∠CEO.' },
      { label: 'Similarly for ∠DOF', formula: '\angle DOF = 2\angle DEO', detail: 'Similarly, ∠DOF = 2∠DEO.' },
      { label: 'Combine', formula: '\angle COD = 2\angle CEO + 2\angle DEO = 2\angle CED', detail: '∠COD = 2∠CEO + 2∠DEO = 2(∠CEO + ∠DEO) = 2∠CED. The central angle is ALWAYS twice the inscribed angle!' },
    ],
    practice: { question: 'An inscribed angle subtended by an arc is 35°. What is the central angle?', hint: 'Central angle = 2 × inscribed angle.', answer: 70, tolerance: 1, explanation: 'Central angle = 2 × 35° = 70°.', errorHint: 'Central = 2 × inscribed' },
    interactive: SemicircleAngleInteractive,
  },
  same_segment: {
    theoremKey: 'class10.same_segment',
    title: 'Theorem 10.8: Angles in Same Segment are Equal',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-cyan-500 to-blue-600',
    accentColor: 'bg-cyan-600',
    finalFormula: '\\angle ACB = \\angle ADB = \\angle AEB \\text{ (same segment)}',
    finalFormulaDesc: 'All angles subtended by a chord in the same segment are equal.',
    keyInsight: 'Any point on a circular arc \"sees\" a chord at the same angle. This is the principle behind the \"goal line\" in circular sports stadiums — every seat has the same viewing angle!',
    steps: [
      { label: 'Take chord AB and points on same segment', formula: '\{Points } C, D, E \{ on same segment}', detail: '🎯 Draw a chord AB. Take three points C, D, E on the SAME segment of the circle.' },
      { label: 'Measure inscribed angles', formula: '\angle ACB, \angle ADB, \angle AEB', detail: 'Each of these angles is subtended by chord AB at different points on the same arc.' },
      { label: 'All equal half of ∠AOB', formula: '\angle ACB = \angle ADB = \angle AEB', detail: 'Each equals half the central angle ∠AOB (Theorem 10.7). Since they equal half of the same central angle, they must be equal!' },
    ],
    practice: { question: '∠ACB = 40° in a segment. What is ∠ADB if D is also in the same segment?', hint: 'Angles in the same segment are equal.', answer: 40, tolerance: 1, explanation: '∠ADB = 40° since both are in the same segment.', errorHint: 'Angles in same segment are equal' },
    interactive: SemicircleAngleInteractive,
  },
  semicircle: {
    theoremKey: 'class10.semicircle',
    title: 'Theorem 10.9: Angle in a Semicircle is a Right Angle',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-blue-500 to-indigo-600',
    accentColor: 'bg-blue-600',
    finalFormula: '\\angle APB = 90^\\circ \\text{ (where } AB \\text{ is diameter)}',
    finalFormulaDesc: 'An angle inscribed in a semicircle is always 90°.',
    keyInsight: 'Attributed to Thales of Miletus (c. 600 BCE), this is one of the oldest known theorems. Egyptian pyramid builders used it to construct right angles. It\'s the basis for the \"circle of possibilities\" in GPS triangulation!',
    steps: [
      { label: 'Draw diameter AB', formula: 'AB \{ is a diameter (through centre } O)', detail: '🌓 Draw a circle with diameter AB passing through centre O. Take any point P on the semicircle arc.' },
      { label: 'Apply central angle theorem', formula: "\\angle AOB = 180^\\circ \\Rightarrow \\angle APB = \\frac\\frac{1}{2} \\times 180^\\circ = 90^\\circ", detail: 'The central angle for chord AB is ∠AOB = 180°. By Theorem 10.7, ∠APB = ½ × 180° = 90°.' },
      { label: 'Works for any point P', formula: '\angle APB = 90^\\circ \{ for any } P \{ on the semicircle}', detail: 'No matter where P is on the semicircle arc, ∠APB always equals 90°!' },
    ],
    practice: { question: 'AB is a diameter. Point P is on the semicircle. What is ∠APB?', hint: 'Angle in a semicircle is always...', answer: 90, tolerance: 1, explanation: '∠APB = 90° always.', errorHint: 'Angle in a semicircle = 90°' },
    interactive: SemicircleAngleInteractive,
  },
  major_segment: {
    theoremKey: 'class10.major_segment',
    title: 'Theorem 10.10: Angle in Major Segment < 90°',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-cyan-500 to-blue-600',
    accentColor: 'bg-cyan-600',
    finalFormula: '\\angle APB < 90^\\circ \\text{ (major segment)}',
    finalFormulaDesc: 'An angle in a segment greater than a semicircle is acute.',
    keyInsight: 'Combined with Theorems 10.11, this gives a complete classification of angles in circular segments. The semicircle at 90° is the boundary between acute and obtuse.',
    steps: [
      { label: 'Draw chord AB forming a major segment', formula: '\{Major segment} > \{semicircle}', detail: '📐 Draw chord AB creating a major segment (larger than a semicircle). Pick a point P on the major arc.' },
      { label: 'Central angle < 180°', formula: '\angle AOB < 180^\\circ', detail: 'The central angle subtended by the major segment is less than 180°.' },
      { label: 'Apply Theorem 10.7', formula: "\\angle APB = \\frac\\frac{1}{2}\\angle AOB < \\frac\\frac{1}{2} \\times 180^\\circ = 90^\\circ", detail: 'Since the central angle is less than 180°, the inscribed angle is less than 90° (acute).' },
    ],
    practice: { question: 'An angle in a major segment is: acute or obtuse?', hint: 'Major segment > semicircle → angle < 90°', answer: 1, tolerance: 0.5, explanation: 'Angles in a major segment are acute (< 90°).', errorHint: 'Major segment → angle < 90° (acute)' },
    interactive: SemicircleAngleInteractive,
  },
  minor_segment: {
    theoremKey: 'class10.minor_segment',
    title: 'Theorem 10.11: Angle in Minor Segment > 90°',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-cyan-500 to-blue-600',
    accentColor: 'bg-cyan-600',
    finalFormula: '\\angle APB > 90^\\circ \\text{ (minor segment)}',
    finalFormulaDesc: 'An angle in a segment less than a semicircle is obtuse.',
    keyInsight: 'This completes the classification: major segment → acute (< 90°), semicircle → right (= 90°), minor segment → obtuse (> 90°). This beautiful result explains why right angles are so special!',
    steps: [
      { label: 'Draw chord forming a minor segment', formula: '\{Minor segment} < \{semicircle}', detail: '📐 Draw chord AB forming a minor segment (smaller than a semicircle).' },
      { label: 'Central angle > 180°', formula: '\{Major central angle} > 180^\\circ', detail: 'The central angle subtended by the minor segment is greater than 180°.' },
      { label: 'Apply Theorem 10.7', formula: "\\angle APB = \\frac\\frac{1}{2} \\times \\text{major central angle} > 90^\\circ", detail: 'Half of an angle greater than 180° gives an inscribed angle greater than 90°.' },
    ],
    practice: { question: 'An angle in a minor segment is: acute or obtuse?', hint: 'Minor segment < semicircle → angle > 90°', answer: 0, tolerance: 0.5, explanation: 'Angles in a minor segment are obtuse (> 90°).', errorHint: 'Minor segment → angle > 90° (obtuse)' },
    interactive: SemicircleAngleInteractive,
  },
  cyclic_quad: {
    theoremKey: 'class10.cyclic_quad',
    title: 'Theorem 10.12: Opposite Angles of Cyclic Quadrilateral are Supplementary',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-cyan-500 to-blue-600',
    accentColor: 'bg-cyan-600',
    finalFormula: '\\angle A + \\angle C = 180^\\circ, \\angle B + \\angle D = 180^\\circ',
    finalFormulaDesc: 'The sum of opposite angles in a cyclic quadrilateral is 180°.',
    keyInsight: 'A rectangular picture frame can always be inscribed in a circle because its opposite angles are 90°+90°=180°. This theorem is used in surveying to check if four points lie on a circle!',
    steps: [
      { label: 'Draw cyclic quadrilateral ABCD', formula: '\{All four vertices on the circle}', detail: '🔷 Draw a quadrilateral ABCD inscribed in a circle (all vertices on the circle).' },
      { label: 'Join centre O to vertices', formula: '\{Central angles: } \angle BOD \{ and reflex } \angle BOD', detail: 'Join O to A, B, C, D. Arc BCD subtends reflex ∠BOD at centre. Arc BAD subtends ∠BOD.' },
      { label: 'Apply central angle theorem', formula: "\\angle BAD = \\frac\\frac{1}{2}\\text{(reflex } \\angle BOD), \\angle BCD = \\frac\\frac{1}{2}\\angle BOD", detail: '∠A = ½×(reflex ∠BOD) and ∠C = ½×(∠BOD). The two central angles sum to 360°.' },
      { label: 'Sum of opposite angles = 180°', formula: "\\angle A + \\angle C = \\frac\\frac{1}{2}(360^\\circ) = 180^\\circ", detail: '∠A + ∠C = ½(360°) = 180°. Similarly, ∠B + ∠D = 180°. Opposite angles of a cyclic quadrilateral are supplementary!' },
    ],
    practice: { question: 'In a cyclic quadrilateral, ∠A = 80°. Find ∠C.', hint: '∠A + ∠C = 180° (opposite angles supplementary)', answer: 100, tolerance: 1, explanation: '∠C = 180° − 80° = 100°.', errorHint: '∠A + ∠C = 180° (cyclic quadrilateral)' },
    interactive: CyclicQuadInteractive,
  },
};
