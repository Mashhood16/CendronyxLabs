import { useTranslate } from '../../i18n';
import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import type { TheoremConfig } from '../../components/generic/GenericTheoremLab';
import { Hash, Infinity, Move3d, Ruler, Target, Circle } from 'lucide-react';

// ========== Interactive Components ==========

function ComplexMagInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [x, setX] = useState(3); const [y, setY] = useState(4);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const mag = Math.sqrt(x*x + y*y);
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - mag) < 0.01 ? 'correct' : 'incorrect'); if (Math.abs(val - mag) < 0.01) onAnswer(true); };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-semibold text-slate-600">{t("Real part (x)")}</label><input type="range" min="-10" max="10" step="1" value={x} onChange={e => { setX(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" /><span className="text-xs font-mono text-blue-600">{t("x =")} {x}</span></div>
        <div><label className="text-xs font-semibold text-slate-600">{t("Imaginary part (y)")}</label><input type="range" min="-10" max="10" step="1" value={y} onChange={e => { setY(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-purple-500" /><span className="text-xs font-mono text-purple-600">{t("y =")} {y}</span></div>
      </div>
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
        <p className="text-xs text-indigo-700 dark:text-indigo-300 font-mono">{t("z =")} {x} + {y}i<br />{t("|z| = âˆš(")}{x}² + {y}²) = âˆš{x*x + y*y} = <strong>{mag.toFixed(2)}</strong></p>
      </div>
      <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("|z| = ?")} step="0.01" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-indigo-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button></div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {t("Correct! |z| =")} {mag.toFixed(2)}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> {t("Try |z| = âˆš(x² + y²)")}</p>}
    </div>
  );
}

function DeterminantInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [a, setA] = useState(1); const [b, setB] = useState(2); const [cVal, setCVal] = useState(3); const [d, setD] = useState(4);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const det = a*d - b*cVal;
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - det) < 0.01 ? 'correct' : 'incorrect'); if (Math.abs(val - det) < 0.01) onAnswer(true); };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        <div><label className="text-[10px] font-semibold">{t("aâ‚â‚")}</label><input type="range" min="-5" max="5" step="1" value={a} onChange={e => { setA(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" /><span className="text-xs">{a}</span></div>
        <div><label className="text-[10px] font-semibold">{t("aâ‚â‚‚")}</label><input type="range" min="-5" max="5" step="1" value={b} onChange={e => { setB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" /><span className="text-xs">{b}</span></div>
        <div><label className="text-[10px] font-semibold">{t("aâ‚‚â‚")}</label><input type="range" min="-5" max="5" step="1" value={cVal} onChange={e => { setCVal(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" /><span className="text-xs">{cVal}</span></div>
        <div><label className="text-[10px] font-semibold">{t("aâ‚‚â‚‚")}</label><input type="range" min="-5" max="5" step="1" value={d} onChange={e => { setD(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" /><span className="text-xs">{d}</span></div>
      </div>
      <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-3 border border-rose-200 dark:border-rose-800">
        <p className="text-xs text-rose-700 dark:text-rose-300 font-mono">{t("A = [[")}{a}, {b}], [{cVal}, {d}]]<br />{t("det(A) =")} {a}×{d} âˆ’ {b}×{cVal} = <strong>{det}</strong><br />{t("det(Aáµ€) =")} <strong>{det}</strong> {t("(same!)")}</p>
      </div>
      <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("det(A) = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-rose-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button></div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! det =")} {det}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try det = ad âˆ’ bc")}</p>}
    </div>
  );
}

function VectorAdditionInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [ax, setAx] = useState(2); const [ay, setAy] = useState(3); const [bx, setBx] = useState(5); const [by, setBy] = useState(1);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const mx = (ax + bx) / 2; const my = (ay + by) / 2;
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - mx) < 0.1 ? 'correct' : 'incorrect'); if (Math.abs(val - mx) < 0.1) onAnswer(true); };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-semibold">{t("Vector a (xâ‚, yâ‚)")}</label><div className="grid grid-cols-2 gap-2"><div><span className="text-[10px]">xâ‚</span><input type="range" min="-5" max="5" step="1" value={ax} onChange={e => { setAx(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" /><span className="text-xs">{ax}</span></div><div><span className="text-[10px]">yâ‚</span><input type="range" min="-5" max="5" step="1" value={ay} onChange={e => { setAy(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" /><span className="text-xs">{ay}</span></div></div></div>
        <div><label className="text-xs font-semibold">{t("Vector b (xâ‚‚, yâ‚‚)")}</label><div className="grid grid-cols-2 gap-2"><div><span className="text-[10px]">xâ‚‚</span><input type="range" min="-5" max="5" step="1" value={bx} onChange={e => { setBx(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-violet-500" /><span className="text-xs">{bx}</span></div><div><span className="text-[10px]">yâ‚‚</span><input type="range" min="-5" max="5" step="1" value={by} onChange={e => { setBy(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-violet-500" /><span className="text-xs">{by}</span></div></div></div>
      </div>
      <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-3 border border-cyan-200 dark:border-cyan-800">
        <p className="text-xs text-cyan-700 dark:text-cyan-300 font-mono">{t("a = (")}{ax}, {ay}{t("), b = (")}{bx}, {by})<br />{t("Midpoint of diagonal: ((")}{ax}+{bx})/2, ({ay}+{by})/2) = <strong>({mx.toFixed(1)}, {my.toFixed(1)})</strong></p>
      </div>
      <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("Midpoint x = ?")} step="0.1" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-cyan-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button></div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! (")}{mx.toFixed(1)}, {my.toFixed(1)})</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try midpoint = ((xâ‚+xâ‚‚)/2, (yâ‚+yâ‚‚)/2)")}</p>}
    </div>
  );
}

function GeoSeriesInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [a1, setA1] = useState(1); const [r, setR] = useState(2); const [n, setN] = useState(5);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const S = r === 1 ? a1 * n : a1 * (1 - Math.pow(r, n)) / (1 - r);
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - S) < 0.5 ? 'correct' : 'incorrect'); if (Math.abs(val - S) < 0.5) onAnswer(true); };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div><label className="text-xs font-semibold">{t("aâ‚ (first term)")}</label><input type="range" min="1" max="10" step="1" value={a1} onChange={e => { setA1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-amber-500" /><span className="text-xs">{a1}</span></div>
        <div><label className="text-xs font-semibold">{t("r (ratio)")}</label><input type="range" min="1" max="5" step="0.5" value={r} onChange={e => { setR(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-amber-500" /><span className="text-xs">{r}</span></div>
        <div><label className="text-xs font-semibold">{t("n (terms)")}</label><input type="range" min="1" max="10" step="1" value={n} onChange={e => { setN(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-amber-500" /><span className="text-xs">{n}</span></div>
      </div>
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
        <p className="text-xs text-amber-700 dark:text-amber-300 font-mono">{t("Sâ‚™ =")} {a1}(1âˆ’{r}^{n})/(1âˆ’{r}) = {a1}(1âˆ’{Math.pow(r, n).toFixed(0)})/(1âˆ’{r}) = <strong>{S.toFixed(1)}</strong></p>
      </div>
      <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("Sâ‚™ = ?")} step="0.1" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-amber-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button></div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! Sâ‚™ =")} {S.toFixed(1)}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try Sâ‚™ = aâ‚(1âˆ’râ¿)/(1âˆ’r)")}</p>}
    </div>
  );
}

function RemainderInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [a, setA] = useState(2); const [b, setB] = useState(-5); const [cVal, setCVal] = useState(3); const [xVal, setXVal] = useState(2);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const remainder = a*xVal*xVal + b*xVal + cVal;
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - remainder) < 0.1 ? 'correct' : 'incorrect'); if (Math.abs(val - remainder) < 0.1) onAnswer(true); };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        <div><label className="text-[10px] font-semibold">a</label><input type="range" min="-5" max="5" step="1" value={a} onChange={e => { setA(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" /><span className="text-xs">{a}</span></div>
        <div><label className="text-[10px] font-semibold">b</label><input type="range" min="-5" max="5" step="1" value={b} onChange={e => { setB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" /><span className="text-xs">{b}</span></div>
        <div><label className="text-[10px] font-semibold">c</label><input type="range" min="-5" max="5" step="1" value={cVal} onChange={e => { setCVal(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" /><span className="text-xs">{cVal}</span></div>
        <div><label className="text-[10px] font-semibold">{t("x = c")}</label><input type="range" min="-5" max="5" step="1" value={xVal} onChange={e => { setXVal(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" /><span className="text-xs">{xVal}</span></div>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-700 dark:text-blue-300 font-mono">{t("P(x) =")} {a}{t("x² +")} {b}{t("x +")} {cVal}<br />P({xVal}) = {a}×{xVal}² + {b}×{xVal} + {cVal} = <strong>{remainder}</strong></p>
      </div>
      <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("P(c) = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-blue-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button></div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! Remainder =")} {remainder}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try substituting x = c into P(x)")}</p>}
    </div>
  );
}

function CombinationInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [n, setN] = useState(5); const [r, setR] = useState(2);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const factN = Array.from({length: n}, (_, i) => i + 1).reduce((a, b) => a * b, 1);
  const factR = r <= 1 ? 1 : Array.from({length: r}, (_, i) => i + 1).reduce((a, b) => a * b, 1);
  const factNR = n-r <= 1 ? 1 : Array.from({length: n-r}, (_, i) => i + 1).reduce((a, b) => a * b, 1);
  const nCr = factN / (factR * factNR);
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - nCr) < 0.5 ? 'correct' : 'incorrect'); if (Math.abs(val - nCr) < 0.5) onAnswer(true); };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-semibold">{t("n (total)")}</label><input type="range" min="1" max="10" step="1" value={n} onChange={e => { setN(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-teal-500" /><span className="text-xs">{n}</span></div>
        <div><label className="text-xs font-semibold">{t("r (choose)")}</label><input type="range" min="1" max={n} step="1" value={r} onChange={e => { setR(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-teal-500" /><span className="text-xs">{r}</span></div>
      </div>
      <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3 border border-teal-200 dark:border-teal-800">
        <p className="text-xs text-teal-700 dark:text-teal-300 font-mono">{t("â¿Cáµ£ =")} {n}!/({r}!({n}âˆ’{r})!) = {factN}/({factR}×{factNR}) = <strong>{nCr.toFixed(0)}</strong></p>
      </div>
      <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("â¿Cáµ£ = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-teal-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button></div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct!")} {nCr.toFixed(0)}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try â¿Cáµ£ = n!/(r!(nâˆ’r)!)")}</p>}
    </div>
  );
}

function BinomialInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [nVal, setNVal] = useState(4);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const factN = (x: number): number => x <= 1 ? 1 : x * factN(x - 1);
  const nCr = (n: number, r: number) => factN(n) / (factN(r) * factN(n - r));
  const coeffs = Array.from({length: nVal + 1}, (_, k) => nCr(nVal, k));
  const coeffSum = coeffs.reduce((a, b) => a + b, 0);
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - coeffSum) < 0.5 ? 'correct' : 'incorrect'); if (Math.abs(val - coeffSum) < 0.5) onAnswer(true); };
  return (
    <div className="space-y-4">
      <div><label className="text-xs font-semibold">{t("n (exponent)")}</label><input type="range" min="1" max="7" step="1" value={nVal} onChange={e => { setNVal(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-indigo-500" /><span className="text-xs">{t("n =")} {nVal}</span></div>
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
        <p className="text-xs text-indigo-700 dark:text-indigo-300 font-mono">{t("(a + b)^")}{nVal} = {coeffs.map((c, i) => `${c}a^${nVal-i}b^${i}`).join(' + ')}<br />{t("Sum of coefficients =")} <strong>{coeffSum}</strong> = 2^{nVal}</p>
      </div>
      <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("Sum of coeffs")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-indigo-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button></div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! Sum =")} {coeffSum}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Sum of coefficients = 2â¿")}</p>}
    </div>
  );
}

function TrigFundamentalInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [alpha, setAlpha] = useState(60); const [beta, setBeta] = useState(30);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const cosDiff = Math.cos((alpha - beta) * Math.PI / 180);
  const cosA = Math.cos(alpha * Math.PI / 180); const cosB = Math.cos(beta * Math.PI / 180);
  const sinA = Math.sin(alpha * Math.PI / 180); const sinB = Math.sin(beta * Math.PI / 180);
  const RHS = cosA * cosB + sinA * sinB;
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - cosDiff) < 0.01 ? 'correct' : 'incorrect'); if (Math.abs(val - cosDiff) < 0.01) onAnswer(true); };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-semibold">{t("Alpha (Î±)")}</label><input type="range" min="0" max="90" step="1" value={alpha} onChange={e => { setAlpha(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-violet-500" /><span className="text-xs">{alpha}°</span></div>
        <div><label className="text-xs font-semibold">{t("Beta (Î²)")}</label><input type="range" min="0" max="90" step="1" value={beta} onChange={e => { setBeta(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" /><span className="text-xs">{beta}°</span></div>
      </div>
      <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3 border border-violet-200 dark:border-violet-800">
        <p className="text-xs text-violet-700 dark:text-violet-300 font-mono">{t("cos(")}{alpha}°âˆ’{beta}{t("°) = cos(")}{alpha - beta}°) = <strong>{cosDiff.toFixed(4)}</strong><br />{t("cos Î± cos Î² + sin Î± sin Î² =")} {cosA.toFixed(4)}×{cosB.toFixed(4)} + {sinA.toFixed(4)}×{sinB.toFixed(4)} = {RHS.toFixed(4)}</p>
      </div>
      <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("cos(Î±âˆ’Î²) = ?")} step="0.01" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-violet-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button></div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! cos(Î±âˆ’Î²) =")} {cosDiff.toFixed(4)}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try cos(Î±âˆ’Î²) = cos Î± cos Î² + sin Î± sin Î²")}</p>}
    </div>
  );
}

// ========== Theorem Configs ==========

export const CLASS11_THEOREMS: Record<string, TheoremConfig> = {
  // â”€â”€ Unit 1: Complex Numbers â”€â”€
  complex_magnitude: {
    theoremKey: 'class11.complex_magnitude',
    title: 'Magnitude of a Complex Number',
    icon: <Hash className="w-5 h-5 text-white" />,
    accentGradient: 'from-blue-500 to-indigo-600',
    accentColor: 'bg-blue-600',
    finalFormula: '|z| = sqrt{x^2 + y^2}',
    finalFormulaDesc: 'The magnitude of z = x + iy is the distance from the origin in the complex plane.',
    keyInsight: 'The magnitude |z| is also called the modulus or absolute value. It measures how far the complex number z = x + iy is from the origin on the complex plane, just like the distance formula! This is fundamental in signal processing where |z| represents the amplitude of a signal.',
    steps: [
      { label: 'Let z = x + iy', formula: 'z = x + iy', detail: 'ðŸ—ºï¸ You\'re a radar operator tracking a plane on a circular radar screen. The plane\'s position is at (x, y) — the real part x is the east-west coordinate, and the imaginary part y is the north-south coordinate. The distance from the centre (origin) is what matters for range.' },
      { label: 'Definition of magnitude', formula: '|z| = sqrt{x^2 + y^2}', detail: 'ðŸ“ The magnitude is defined as |z| = âˆš(x² + y²). Since squares of real numbers are always â‰¥ 0: x² â‰¥ 0 and y² â‰¥ 0, so x² + y² â‰¥ 0. The square root of a non-negative number is also non-negative, therefore |z| â‰¥ 0.' },
      { label: 'If |z| = 0, then z = 0', formula: '|z| = 0 \â‡’ x^2 + y^2 = 0', detail: 'ðŸ§® Suppose |z| = 0. Then âˆš(x² + y²) = 0 → x² + y² = 0. The sum of two squares can only be zero if both are zero: x = 0 AND y = 0. So z = 0 + 0i = 0.' },
      { label: 'If z = 0, then |z| = 0', formula: 'z = 0 \â‡’ |z| = sqrt{0^2 + 0^2} = 0', detail: 'ðŸ”„ Conversely, if z = 0 = 0 + 0i, then |z| = âˆš(0² + 0²) = 0. Therefore, |z| = 0 if and only if z = 0. This fact is used in control systems to check if a feedback signal has converged to zero!' },
    ],
    practice: { question: 'z = 3 + 4i. Find |z|.', hint: '|z| = âˆš(3² + 4²) = âˆš(9 + 16)', answer: 5, tolerance: 0.1, explanation: '|3 + 4i| = 5. The classic 3-4-5 triangle on the complex plane!', errorHint: '|z| = âˆš(x² + y²)' },
    interactive: ComplexMagInteractive,
  },

  complex_inverse_polar: {
    theoremKey: 'class11.complex_inverse_polar',
    title: 'Inverse of a Complex Number in Polar Form',
    icon: <Hash className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-purple-600',
    accentColor: 'bg-indigo-600',
    finalFormula: 'z^{-1} = frac{1}{r}(cos theta - i sin theta)',
    finalFormulaDesc: 'The multiplicative inverse in polar form uses the conjugate.',
    keyInsight: 'Just like 2â»¹ = ½ for real numbers, every non-zero complex number z = r(cos Î¸ + i sin Î¸) has an inverse. The inverse is found by dividing 1 by the magnitude r and negating the angle!',
    steps: [
      { label: 'Write 1/z', formula: 'z^{-1} = frac{1}{z} = frac{1}{r(cos theta + i sin theta)}', detail: 'ðŸ”„ You\'re designing an electrical circuit with AC signals represented as complex numbers. To find the impedance of a parallel component, you need to compute 1/Z. Starting with z = r(cos Î¸ + i sin Î¸), write zâ»¹ = 1/z.' },
      { label: 'Multiply by conjugate', formula: "z^{-1} = frac{1}{r(cos theta + i sin theta)} times frac{cos theta - i sin theta}{cos theta - i sin theta}", detail: 'ðŸ“ To rationalize, multiply numerator and denominator by the conjugate cos Î¸ âˆ’ i sin Î¸. This is the complex analog of rationalizing a denominator with âˆš.' },
      { label: 'Simplify denominator', formula: 'z^{-1} = frac{cos theta - i sin theta}{r(cos^2 theta - i^2 sin^2 theta)}', detail: 'ðŸ§® Since i² = âˆ’1: cos²Î¸ âˆ’ i² sin²Î¸ = cos²Î¸ + sin²Î¸ = 1 (the Pythagorean identity!). The denominator collapses to r × 1 = r.' },
      { label: 'Final formula', formula: 'z^{-1} = frac{1}{r}(cos theta - i sin theta)', detail: 'âœ… zâ»¹ = (1/r)(cos Î¸ âˆ’ i sin Î¸). The magnitude is 1/r and the angle is âˆ’Î¸. In AC circuits, this means the inverse impedance has reciprocal magnitude and opposite phase angle — essential for parallel circuit analysis!' },
    ],
    practice: { question: 'z = 2(cos 60° + i sin 60°). Find |zâ»¹|.', hint: '|zâ»¹| = 1/|z| = 1/2', answer: 0.5, tolerance: 0.05, explanation: '|zâ»¹| = 1/2. The inverse has reciprocal magnitude.', errorHint: '|zâ»¹| = 1/r' },
    interactive: ComplexMagInteractive,
  },

  complex_division_polar: {
    theoremKey: 'class11.complex_division_polar',
    title: 'Division of Complex Numbers in Polar Form',
    icon: <Hash className="w-5 h-5 text-white" />,
    accentGradient: 'from-purple-500 to-fuchsia-600',
    accentColor: 'bg-purple-600',
    finalFormula: 'frac{z_1}{z_2} = frac{r_1}{r_2}[cos(theta_1 - theta_2) + i sin(theta_1 - theta_2)]',
    finalFormulaDesc: 'Divide magnitudes, subtract angles.',
    keyInsight: 'Complex division in polar form is elegant: divide the magnitudes and subtract the angles! This is much simpler than the rectangular form and is used extensively in phasor analysis for AC power systems.',
    steps: [
      { label: 'Write the ratio', formula: 'frac{z_1}{z_2} = frac{r_1(cos theta_1 + i sin theta_1)}{r_2(cos theta_2 + i sin theta_2)}', detail: 'ðŸ”Œ An electrical engineer is analyzing a power grid. Two AC voltages are zâ‚ = râ‚(cos Î¸â‚ + i sin Î¸â‚) and zâ‚‚ = râ‚‚(cos Î¸â‚‚ + i sin Î¸â‚‚). To find their ratio, divide them in polar form.' },
      { label: 'Multiply numerator and denominator', formula: 'frac{r_1}{r_2} times frac{(cos theta_1 + i sin theta_1)(cos theta_2 - i sin theta_2)}{(cos theta_2 + i sin theta_2)(cos theta_2 - i sin theta_2)}', detail: 'ðŸ“ Multiply numerator and denominator by the conjugate of the denominator.' },
      { label: 'Simplify using trig identities', formula: 'frac{r_1}{r_2}[(cos theta_1 cos theta_2 + sin theta_1 sin theta_2) + i(sin theta_1 cos theta_2 - cos theta_1 sin theta_2)]', detail: 'ðŸ§® After expanding: the denominator becomes cos²Î¸â‚‚ + sin²Î¸â‚‚ = 1. The numerator simplifies using angle sum/difference identities.' },
      { label: 'Apply difference identities', formula: 'frac{r_1}{r_2}[cos(theta_1 - theta_2) + i sin(theta_1 - theta_2)]', detail: 'âœ… cos Î¸â‚ cos Î¸â‚‚ + sin Î¸â‚ sin Î¸â‚‚ = cos(Î¸â‚âˆ’Î¸â‚‚) and sin Î¸â‚ cos Î¸â‚‚ âˆ’ cos Î¸â‚ sin Î¸â‚‚ = sin(Î¸â‚âˆ’Î¸â‚‚). So zâ‚/zâ‚‚ = (râ‚/râ‚‚)[cos(Î¸â‚âˆ’Î¸â‚‚) + i sin(Î¸â‚âˆ’Î¸â‚‚)] — divide magnitudes, subtract angles!' },
    ],
    practice: { question: 'zâ‚=4(cos 90°+i sin 90°), zâ‚‚=2(cos 30°+i sin 30°). Find râ‚/râ‚‚.', hint: 'râ‚/râ‚‚ = 4/2 = 2', answer: 2, tolerance: 0.1, explanation: 'râ‚/râ‚‚ = 2. The angle of the result is 90°âˆ’30° = 60°.', errorHint: 'râ‚/râ‚‚' },
    interactive: ComplexMagInteractive,
  },

  // â”€â”€ Unit 2: Matrices and Determinants â”€â”€
  determinant_transpose: {
    theoremKey: 'class11.determinant_transpose',
    title: 'Determinant of a Transpose |A| = |Aáµ€|',
    icon: <Hash className="w-5 h-5 text-white" />,
    accentGradient: 'from-rose-500 to-pink-600',
    accentColor: 'bg-rose-600',
    finalFormula: '|A| = |A^T|',
    finalFormulaDesc: 'Transposing a matrix does not change its determinant.',
    keyInsight: 'The determinant of a matrix and its transpose are always equal. This means row operations and column operations have identical effects on the determinant — a key symmetry that simplifies many proofs in linear algebra!',
    steps: [
      { label: 'Consider a 3×3 matrix A', formula: 'A = [a_{ij}]_{3 times 3}', detail: 'ðŸ“Š You\'re a cryptographer working with matrix encryption. The matrix A = [[aâ‚â‚, aâ‚â‚‚, aâ‚â‚ƒ], [aâ‚‚â‚, aâ‚‚â‚‚, aâ‚‚â‚ƒ], [aâ‚ƒâ‚, aâ‚ƒâ‚‚, aâ‚ƒâ‚ƒ]] encodes your message. How does the determinant change if you transpose it?' },
      { label: 'Define the transpose', formula: "A^T = [a_{ji}]_{3 times 3}", detail: 'ðŸ“ The transpose Aáµ€ swaps rows and columns: Aáµ€ = [[aâ‚â‚, aâ‚‚â‚, aâ‚ƒâ‚], [aâ‚â‚‚, aâ‚‚â‚‚, aâ‚ƒâ‚‚], [aâ‚â‚ƒ, aâ‚‚â‚ƒ, aâ‚ƒâ‚ƒ]]. The element at position (i,j) in A goes to position (j,i) in Aáµ€.' },
      { label: 'Expand both determinants', formula: "|A^T| = a_{11}(a_{22}a_{33} - a_{23}a_{32}) - a_{12}(a_{21}a_{33} - a_{23}a_{31}) + a_{13}(a_{21}a_{32} - a_{22}a_{31})", detail: 'ðŸ§® Expanding |Aáµ€| from Column 1 gives the exact same expression as expanding |A| from Row 1. Every term matches identically.' },
      { label: 'Compare expansions', formula: "|A| = a_{11}(a_{22}a_{33} - a_{23}a_{32}) - a_{12}(a_{21}a_{33} - a_{23}a_{31}) + a_{13}(a_{21}a_{32} - a_{22}a_{31}) = |A^T|", detail: 'âœ… The two expansions are identical, so |A| = |Aáµ€|. This is why any theorem about rows in determinants automatically applies to columns too — a powerful symmetry in linear algebra!' },
    ],
    practice: { question: 'A 2×2 matrix has det(A) = 7. What is det(Aáµ€)?', hint: '|Aáµ€| = |A| (they are always equal)', answer: 7, tolerance: 0.1, explanation: '|Aáµ€| = |A| = 7.', errorHint: '|Aáµ€| = |A|' },
    interactive: DeterminantInteractive,
  },

  determinant_interchange: {
    theoremKey: 'class11.determinant_interchange',
    title: 'Row/Column Interchange Flips Determinant Sign',
    icon: <Hash className="w-5 h-5 text-white" />,
    accentGradient: 'from-rose-500 to-red-600',
    accentColor: 'bg-rose-600',
    finalFormula: "|B| = -|A| \\text{ (swap two rows)}",
    finalFormulaDesc: 'Swapping any two rows or columns multiplies the determinant by âˆ’1.',
    keyInsight: 'This property reveals that the determinant is an alternating multilinear function. Swapping rows is like flipping the orientation of a parallelogram — the signed area changes sign! Used in computer graphics for polygon winding order detection.',
    steps: [
      { label: 'Swap two rows of A to get B', formula: 'B = [a_{21}, a_{22}, a_{23}; a_{11}, a_{12}, a_{13}; a_{31}, a_{32}, a_{33}]', detail: 'ðŸŽ¯ You\'re solving a system of 3 equations, and accidentally swapped the first two equations. How does this affect the determinant? Let\'s swap Row 1 and Row 2 of A to form B.' },
      { label: 'Expand B by Row 1', formula: "|B| = a_{21}(a_{12}a_{33} - a_{13}a_{32}) - a_{22}(a_{11}a_{33} - a_{13}a_{31}) + a_{23}(a_{11}a_{32} - a_{12}a_{31})", detail: 'ðŸ“ Expanding |B| by its first row gives a different-looking expression.' },
      { label: 'Factor out âˆ’1', formula: "|B| = -[a_{11}(a_{22}a_{33} - a_{23}a_{32}) - a_{12}(a_{21}a_{33} - a_{23}a_{31}) + a_{13}(a_{21}a_{32} - a_{22}a_{31})]", detail: 'ðŸ§® By rearranging terms and factoring, the expression inside brackets matches exactly the expansion of |A| from Row 1.' },
      { label: 'Therefore |B| = âˆ’|A|', formula: "|B| = -|A|", detail: 'âœ… The determinant changes sign. Swapping rows twice returns the original sign. This property is why Cramer\'s rule works — and why a determinant with two identical rows must be zero (since swapping them gives |A| = âˆ’|A| → 2|A| = 0 → |A| = 0)!' },
    ],
    practice: { question: 'det(A) = 5. You swap two rows. What is the new determinant?', hint: 'Swapping rows flips the sign.', answer: -5, tolerance: 0.1, explanation: 'The new determinant = âˆ’5.', errorHint: 'Swapping rows → sign flips' },
    interactive: DeterminantInteractive,
  },

  determinant_identical: {
    theoremKey: 'class11.determinant_identical',
    title: 'Identical Rows/Columns â‡’ Zero Determinant',
    icon: <Hash className="w-5 h-5 text-white" />,
    accentGradient: 'from-rose-500 to-red-600',
    accentColor: 'bg-rose-600',
    finalFormula: '|A| = 0 \\text{ if two rows are identical}',
    finalFormulaDesc: 'A matrix with two identical rows or columns has determinant zero.',
    keyInsight: 'This makes intuitive sense: if two rows are the same, the matrix is singular (non-invertible). The system of equations would have redundant information and no unique solution. It\'s like trying to pin down a point with two identical directions!',
    steps: [
      { label: 'Suppose Row 1 = Row 2', formula: 'a_{11} = a_{21}, a_{12} = a_{22}, a_{13} = a_{23}', detail: 'ðŸ“‰ Your GPS receiver uses three satellite signals (rows) to triangulate your position. If two satellites send identical signals (identical rows), the receiver can\'t distinguish them — it can\'t find a unique location!' },
      { label: 'Swap Row 1 and Row 2', formula: '\{Swapping gives matrix } B = A', detail: 'ðŸŽ¯ If we swap Row 1 and Row 2, since they\'re identical, matrix B is identical to matrix A. But by the interchange property, swapping rows flips the determinant sign: |B| = âˆ’|A|.' },
      { label: 'Equate the two expressions', formula: '|A| = -|A|', detail: 'ðŸ§® Since B = A (identical rows), |B| = |A|. But also |B| = âˆ’|A| (from the interchange property). Therefore |A| = âˆ’|A|.' },
      { label: 'Solve for |A|', formula: '2|A| = 0 \â‡’ |A| = 0', detail: 'âœ… Adding |A| to both sides: 2|A| = 0 → |A| = 0. This is why Gauss-Jordan elimination breaks when rows are dependent — the determinant being zero tells us the matrix is singular!' },
    ],
    practice: { question: 'A 3×3 matrix has identical first and second rows. What is det(A)?', hint: 'Identical rows → the determinant must be zero', answer: 0, tolerance: 0.1, explanation: 'det(A) = 0. Identical rows make the matrix singular.', errorHint: 'Identical rows → det = 0' },
    interactive: DeterminantInteractive,
  },

  // â”€â”€ Unit 3: Vectors in Space â”€â”€
  parallelogram_diagonals: {
    theoremKey: 'class11.parallelogram_diagonals',
    title: 'Diagonals of a Parallelogram Bisect Each Other',
    icon: <Move3d className="w-5 h-5 text-white" />,
    accentGradient: 'from-cyan-500 to-teal-600',
    accentColor: 'bg-cyan-600',
    finalFormula: 'frac{a + c}{2} = frac{b + d}{2}',
    finalFormulaDesc: 'The midpoints of both diagonals of a parallelogram coincide.',
    keyInsight: 'This is why a crane\'s parallelogram linkage keeps the load level — the diagonals always intersect at their midpoints, maintaining the same relative position regardless of arm angle!',
    steps: [
      { label: 'Define position vectors', formula: '\\vec{a}, \\vec{b}, \\vec{c}, \\vec{d} \{ for vertices } A, B, C, D', detail: 'ðŸ—ï¸ You\'re a structural engineer designing a parallelogram linkage for a construction crane. The four vertices of the parallelogram ABCD have position vectors Ã£, bâƒ—, câƒ—, dâƒ— from the origin.' },
      { label: 'Midpoint of diagonal AC', formula: 'M_1 = \{a + c}{2}', detail: 'ðŸ“ The midpoint Mâ‚ of diagonal AC has position vector (Ã£ + câƒ—)/2 — the average of the two endpoint vectors.' },
      { label: 'Midpoint of diagonal BD', formula: 'M_2 = \{b + d}{2}', detail: 'ðŸ“ The midpoint Mâ‚‚ of diagonal BD has position vector (bâƒ— + dâƒ—)/2.' },
      { label: 'Use parallelogram property', formula: '\\vec{AB} = \\vec{DC} \â‡’ \\vec{b} - \\vec{a} = \\vec{c} - \\vec{d} \â‡’ \{a + c}{2} = \{b + d}{2}', detail: 'ðŸ§® In a parallelogram, AB = DC. In vectors: bâƒ— âˆ’ Ã£ = câƒ— âˆ’ dâƒ— → bâƒ— + dâƒ— = Ã£ + câƒ— → (Ã£ + câƒ—)/2 = (bâƒ— + dâƒ—)/2. The midpoints are identical — the diagonals bisect each other!' },
    ],
    practice: { question: 'Parallelogram with A(1,2), B(4,3), C(6,7). Find midpoint of diagonal AC.', hint: 'Midpoint = ((1+6)/2, (2+7)/2) = (3.5, 4.5)', answer: 3.5, tolerance: 0.1, explanation: 'M = (3.5, 4.5). The other diagonal BD shares the same midpoint.', errorHint: 'M = ((xâ‚+xâ‚‚)/2, (yâ‚+yâ‚‚)/2)' },
    interactive: VectorAdditionInteractive,
  },

  triangle_midpoint: {
    theoremKey: 'class11.triangle_midpoint',
    title: 'Triangle Midpoint Theorem',
    icon: <Move3d className="w-5 h-5 text-white" />,
    accentGradient: 'from-teal-500 to-emerald-600',
    accentColor: 'bg-teal-600',
    finalFormula: '\\vec{M_1M_2} = \\frac{1}{2}\\vec{AB}',
    finalFormulaDesc: 'The segment joining midpoints of two sides is parallel to and half the third side.',
    keyInsight: 'This theorem is the foundation of the intercept theorem and is used in architecture to create truss structures. It also explains why the median of a triangle divides it into two equal areas!',
    steps: [
      { label: 'Define triangle vertices', formula: '\\vec{a}, \\vec{b}, \\vec{c} \{ for } A, B, C', detail: 'ðŸ”º You\'re a carpenter building a roof truss. The triangle has vertices A(Ã£), B(bâƒ—), C(câƒ—). You need to find the beam that connects the midpoints of two sides.' },
      { label: 'Midpoints Mâ‚ and Mâ‚‚', formula: 'M_1 = \{a + c}{2}, M_2 = \{b + c}{2}', detail: 'ðŸ“ Mâ‚ is the midpoint of CA: (Ã£ + câƒ—)/2. Mâ‚‚ is the midpoint of BC: (bâƒ— + câƒ—)/2. These are the truss\'s connection points.' },
      { label: 'Vector Mâ‚Mâ‚‚', formula: '\\vec{M_1M_2} = \{b + c}{2} - \{a + c}{2} = \{1}{2}(\\vec{b} - \\vec{a})', detail: 'ðŸ§® Mâ‚Mâ‚‚ = Mâ‚‚ âˆ’ Mâ‚ = (bâƒ— + câƒ—)/2 âˆ’ (Ã£ + câƒ—)/2 = ½(bâƒ— âˆ’ Ã£) = ½AB. The câƒ— terms cancel!' },
      { label: 'Interpretation', formula: '\\vec{M_1M_2} = \{1}{2}\\vec{AB}', detail: 'âœ… Mâ‚Mâ‚‚ = ½AB. This means: (1) Mâ‚Mâ‚‚ is parallel to AB (scalar multiple), and (2) its length is exactly half of AB. Your roof truss beam is perfectly positioned at half-scale of the base!' },
    ],
    practice: { question: 'Triangle with A(0,0), B(6,0), C(2,4). Find the length of Mâ‚Mâ‚‚ (midpoints of CA and BC).', hint: 'Mâ‚ = ((0+2)/2, (0+4)/2) = (1,2), Mâ‚‚ = ((6+2)/2, (0+4)/2) = (4,2). Distance = 3', answer: 3, tolerance: 0.5, explanation: 'Mâ‚Mâ‚‚ = 3 = ½ × AB = ½ × 6. Correct!', errorHint: 'Mâ‚Mâ‚‚ = ½ × AB' },
    interactive: VectorAdditionInteractive,
  },

  trapezium_midpoint: {
    theoremKey: 'class11.trapezium_midpoint',
    title: 'Trapezium Midpoint Theorem',
    icon: <Move3d className="w-5 h-5 text-white" />,
    accentGradient: 'from-emerald-500 to-green-600',
    accentColor: 'bg-emerald-600',
    finalFormula: '\\vec{M_1M_2} = \\frac{1}{2}(\\vec{AB} + \\vec{DC})',
    finalFormulaDesc: 'The segment joining midpoints of non-parallel sides is half the sum of parallel sides.',
    keyInsight: 'Bridge designers use this theorem: the midline of a trapezoidal bridge girder equals the average of the top and bottom widths. It\'s also used in numerical integration (trapezoidal rule) where the average of endpoints approximates the integral!',
    steps: [
      { label: 'Define trapezium', formula: '\{Parallel sides: } AB \\parallel DC', detail: 'ðŸŒ‰ You\'re a civil engineer designing a bridge with a trapezoidal cross-section. The top deck AB is parallel to the bottom base DC. You need to find the length of the mid-span support beam.' },
      { label: 'Midpoints Mâ‚ and Mâ‚‚', formula: 'M_1 = \{a + d}{2}, M_2 = \{b + c}{2}', detail: 'ðŸ“ Mâ‚ is the midpoint of side AD, Mâ‚‚ is the midpoint of side BC — these are the endpoints of your mid-span beam.' },
      { label: 'Vector Mâ‚Mâ‚‚', formula: '\\vec{M_1M_2} = \{b + c}{2} - \{a + d}{2} = \{1}{2}[(b - a) + (c - d)]', detail: 'ðŸ§® Mâ‚Mâ‚‚ = ½[(bâƒ— âˆ’ Ã£) + (câƒ— âˆ’ dâƒ—)] = ½(AB + DC). The sum of the parallel side vectors, halved.' },
      { label: 'Parallel property', formula: '\\vec{M_1M_2} = \{1}{2}(\\vec{AB} + \\vec{DC}) \\parallel \\vec{AB}', detail: 'âœ… Since AB âˆ¥ DC, Mâ‚Mâ‚‚ is parallel to both. Its length = ½(|AB| + |DC|). For a bridge with top=10m and bottom=16m: midspan = ½(10+16) = 13m. This is why the trapezoidal rule in calculus uses the average of endpoints!' },
    ],
    practice: { question: 'Trapezium with AB=8cm, DC=12cm (parallel). Find the length of the segment joining midpoints of non-parallel sides.', hint: 'Length = ½(AB + DC) = ½(8+12) = 10', answer: 10, tolerance: 0.5, explanation: 'Length = ½(8+12) = 10 cm.', errorHint: 'Length = ½(AB + DC)' },
    interactive: VectorAdditionInteractive,
  },

  // â”€â”€ Unit 4: Sequences and Series â”€â”€
  geometric_sum: {
    theoremKey: 'class11.geometric_sum',
    title: 'Sum of First n Terms of a Geometric Series',
    icon: <Infinity className="w-5 h-5 text-white" />,
    accentGradient: 'from-amber-500 to-orange-600',
    accentColor: 'bg-amber-600',
    finalFormula: 'S_n = frac{a_1(1-r^n)}{1-r}',
    finalFormulaDesc: 'Sum of a geometric series: Sâ‚™ = aâ‚(1âˆ’râ¿)/(1âˆ’r) for r â‰  1.',
    keyInsight: 'This formula explains why a ball bouncing to 60% of its height each time travels a finite total distance despite bouncing infinitely — the infinite sum converges! It\'s also how compound interest calculations work: your bank balance grows geometrically.',
    steps: [
      { label: 'Write the geometric series', formula: 'S_n = a_1 + a_1r + a_1r^2 + ... + a_1r^{n-1}', detail: 'ðŸ’° You\'re an investor. You put $1,000 in a fund that grows by 5% each year. Your balance after n years forms a geometric series: year 0: $1000, year 1: $1050, year 2: $1102.50... Each term is the previous × 1.05.' },
      { label: 'Multiply both sides by r', formula: 'rS_n = a_1r + a_1r^2 + a_1r^3 + ... + a_1r^n', detail: 'ðŸ“ Multiply the entire series by r: rSâ‚™ = aâ‚r + aâ‚r² + aâ‚r³ + ... + aâ‚râ¿. This shifts every term by one position.' },
      { label: 'Subtract the equations', formula: 'S_n - rS_n = a_1 - a_1r^n', detail: 'ðŸ§® Subtract rSâ‚™ from Sâ‚™: Sâ‚™ âˆ’ rSâ‚™ = aâ‚ âˆ’ aâ‚râ¿. All the intermediate terms (aâ‚r through aâ‚râ¿â»¹) cancel out perfectly — the elegance of the telescoping subtraction!' },
      { label: 'Solve for Sâ‚™', formula: 'S_n(1-r) = a_1(1-r^n) \â‡’ S_n = frac{a_1(1-r^n)}{1-r}', detail: 'âœ… Sâ‚™(1âˆ’r) = aâ‚(1âˆ’râ¿) → Sâ‚™ = aâ‚(1âˆ’râ¿)/(1âˆ’r). For infinite series (|r| < 1): Sâˆž = aâ‚/(1âˆ’r). Your $1000 at 5%: if you kept it forever earning 5%, the present value of all future earnings = 1000/(1âˆ’0.05) = $20,000!' },
    ],
    practice: { question: 'aâ‚ = 2, r = 3, n = 4. Find Sâ‚„.', hint: 'Sâ‚„ = 2(1âˆ’3â´)/(1âˆ’3) = 2(1âˆ’81)/(âˆ’2) = 2(âˆ’80)/(âˆ’2)', answer: 80, tolerance: 1, explanation: 'Sâ‚„ = 80. The terms: 2 + 6 + 18 + 54 = 80.', errorHint: 'Sâ‚™ = aâ‚(1âˆ’râ¿)/(1âˆ’r)' },
    interactive: GeoSeriesInteractive,
  },

  arithmetico_geometric_sum: {
    theoremKey: 'class11.arithmetico_geometric_sum',
    title: 'Sum of an Arithmetico-Geometric Series',
    icon: <Infinity className="w-5 h-5 text-white" />,
    accentGradient: 'from-orange-500 to-red-600',
    accentColor: 'bg-orange-600',
    finalFormula: "S_n = frac{a}{1-r} + drfrac{1-r^{n-1}}{(1-r)^2} - frac{(a+nd)r^n}{1-r}",
    finalFormulaDesc: 'Sum of an arithmetico-geometric series (arithmetic × geometric).',
    keyInsight: 'This series combines arithmetic (adding a constant d each term) with geometric (multiplying by r each term). Used in calculating loan amortization schedules where interest compounds while fixed payments are made!',
    steps: [
      { label: 'Write the series', formula: "S_n = a + (a+d)r + (a+2d)r^2 + ... + [a+(n-1)d]r^{n-1}", detail: 'ðŸ¦ You\'re a banker calculating a loan with fixed payments and compound interest. The first payment is a, each subsequent payment increases by d (inflation), and interest compounds at rate r.' },
      { label: 'Multiply by r', formula: "rS_n = ar + (a+d)r^2 + (a+2d)r^3 + ... + [a+(n-1)d]r^n", detail: 'ðŸ“ Multiply by r: rSâ‚™ = ar + (a+d)r² + (a+2d)r³ + ... + [a+(nâˆ’1)d]râ¿.' },
      { label: 'Subtract', formula: "S_n(1-r) = a + dr + dr^2 + ... + dr^{n-1} - (a+nd)r^n", detail: 'ðŸ§® Subtracting: (1âˆ’r)Sâ‚™ = a + dr + dr² + ... + drâ¿â»¹ âˆ’ (a+nd)râ¿. The a terms telescope, and the d terms form a geometric series itself!' },
      { label: 'Apply geometric sum', formula: "S_n = frac{a}{1-r} + drfrac{1-r^{n-1}}{(1-r)^2} - frac{(a+nd)r^n}{1-r}", detail: 'âœ… The middle dr terms form a geometric series: dr(1+r+...+râ¿â»²) = dr(1âˆ’râ¿â»¹)/(1âˆ’r). Dividing through by (1âˆ’r) gives the complete formula. This is how actuaries calculate tiered annuity payments!' },
    ],
    practice: { question: 'a=1, d=2, r=3, n=2. Find Sâ‚‚ (first term = a=1, second term = (a+d)r = 9).', hint: 'Sâ‚‚ = 1 + (1+2)×3 = 1 + 9 = 10', answer: 10, tolerance: 0.5, explanation: 'Sâ‚‚ = 1 + 9 = 10.', errorHint: 'Write out the first n terms and add them' },
    interactive: GeoSeriesInteractive,
  },

  // â”€â”€ Unit 5: Division of Polynomials â”€â”€
  remainder_theorem: {
    theoremKey: 'class11.remainder_theorem',
    title: 'Remainder Theorem',
    icon: <Hash className="w-5 h-5 text-white" />,
    accentGradient: 'from-blue-500 to-sky-600',
    accentColor: 'bg-blue-600',
    finalFormula: 'p(c) = \\text{remainder when } p(x) \\text{ is divided by } (x - c)',
    finalFormulaDesc: 'The remainder when dividing by (xâˆ’c) equals p(c).',
    keyInsight: 'This theorem lets you evaluate polynomials at a point without substituting! It\'s the foundation of synthetic division and is used in computer graphics for fast polynomial evaluation (Horner\'s method).',
    steps: [
      { label: 'Division algorithm', formula: 'p(x) = (x - c)q(x) + r', detail: 'ðŸ“ˆ You\'re a data scientist fitting a polynomial to temperature data. You need to know the value at a specific time t = c. The Remainder Theorem lets you find it without computing the whole polynomial!' },
      { label: 'Substitute x = c', formula: 'p(c) = (c - c)q(c) + r', detail: 'ðŸ“ Substitute x = c into the identity: p(c) = (câˆ’c)q(c) + r. The (câˆ’c) term becomes zero.' },
      { label: 'Simplify', formula: 'p(c) = 0 times q(c) + r = r', detail: 'ðŸ§® Since câˆ’c = 0, the term (câˆ’c)q(c) = 0 × q(c) = 0. Therefore p(c) = r. The remainder when dividing p(x) by (xâˆ’c) equals p(c) — the polynomial evaluated at x = c!' },
      { label: 'Application: Synthetic Division', formula: '\{Synthetic division uses only coefficients}', detail: 'âœ… This theorem is the basis of synthetic division — a shortcut that divides polynomials using only coefficients. It\'s vastly faster for high-degree polynomials and is used in computer graphics for BÃ©zier curve evaluation (Horner\'s method reduces O(n²) to O(n))!' },
    ],
    practice: { question: 'p(x) = x² âˆ’ 5x + 6. Find the remainder when divided by (xâˆ’2).', hint: 'p(2) = 4 âˆ’ 10 + 6', answer: 0, tolerance: 0.1, explanation: 'p(2) = 0. So (xâˆ’2) is a factor!', errorHint: 'Remainder = p(c)' },
    interactive: RemainderInteractive,
  },

  factor_theorem: {
    theoremKey: 'class11.factor_theorem',
    title: 'Factor Theorem',
    icon: <Hash className="w-5 h-5 text-white" />,
    accentGradient: 'from-sky-500 to-indigo-600',
    accentColor: 'bg-sky-600',
    finalFormula: '(x - c) \\text{ is a factor of } p(x) \\iff p(c) = 0',
    finalFormulaDesc: '(xâˆ’c) is a factor of p(x) if and only if p(c) = 0.',
    keyInsight: 'This is the single most powerful tool for factoring polynomials! If you can guess a root (like x=1, x=âˆ’1, x=2), you can immediately factor out (xâˆ’c) and reduce the polynomial degree by 1. It\'s like peeling layers off an onion!',
    steps: [
      { label: 'Part 1: If (xâˆ’c) is a factor', formula: "(x-c) \\text{ factor } \\Rightarrow r = 0 \\Rightarrow p(c) = 0", detail: 'ðŸ” You\'re a codebreaker trying to factor a complex polynomial. The Factor Theorem gives you a systematic way: if you can find a value c where p(c) = 0, you\'ve found a factor (xâˆ’c)!' },
      { label: 'By Remainder Theorem', formula: "p(c) = r \\text{ (remainder)}", detail: 'ðŸ“ If (xâˆ’c) is a factor, the division p(x) ÷ (xâˆ’c) leaves no remainder, so r = 0. By the Remainder Theorem, r = p(c). Therefore p(c) = 0.' },
      { label: 'Part 2: If p(c) = 0', formula: "p(c) = 0 \\Rightarrow r = 0 \\Rightarrow (x-c) \\text{ factor}", detail: 'ðŸ”„ Conversely, if p(c) = 0, then by the Remainder Theorem the remainder r = 0. Substituting r = 0: p(x) = (xâˆ’c)q(x). This proves (xâˆ’c) is a factor.' },
      { label: 'Example', formula: "p(x) = x^3 - 2x^2 - x + 2, p(1) = 0 \\Rightarrow (x-1) \\text{ is a factor}", detail: 'âœ… For p(x) = x³ âˆ’ 2x² âˆ’ x + 2: p(1) = 1 âˆ’ 2 âˆ’ 1 + 2 = 0. So (xâˆ’1) is a factor! Dividing: p(x) = (xâˆ’1)(x² âˆ’ x âˆ’ 2) = (xâˆ’1)(xâˆ’2)(x+1). One root found, the rest follows easily!' },
    ],
    practice: { question: 'p(x) = x² âˆ’ 5x + 6. Is (xâˆ’2) a factor?', hint: 'Check p(2). If p(2) = 0, it\'s a factor.', answer: 1, tolerance: 0.5, explanation: 'p(2) = 4 âˆ’ 10 + 6 = 0. Yes, (xâˆ’2) is a factor!', errorHint: 'Check if p(c) = 0' },
    interactive: RemainderInteractive,
  },

  // â”€â”€ Unit 6: Permutation and Combination â”€â”€
  combination_formula: {
    theoremKey: 'class11.combination_formula',
    title: 'Combination Formula (â¿Cáµ£)',
    icon: <Hash className="w-5 h-5 text-white" />,
    accentGradient: 'from-teal-500 to-emerald-600',
    accentColor: 'bg-teal-600',
    finalFormula: '^nC_r = frac{n!}{r!(n-r)!}',
    finalFormulaDesc: 'Number of ways to choose r objects from n distinct objects.',
    keyInsight: 'Combinations count selections without regard to order. If you\'re picking a 3-person committee from 10 people, the order you pick them doesn\'t matter — that\'s ¹â°Câ‚ƒ = 120 ways! This formula is the foundation of probability calculations.',
    steps: [
      { label: 'Let X = number of combinations', formula: "^nP_r = X times r!", detail: 'ðŸŽ¯ You\'re organizing a 3-person team from 5 volunteers. You first think about permutations (ordered arrangements), but realize order doesn\'t matter — picking Alice, Bob, Charlie is the same team as Charlie, Bob, Alice.' },
      { label: 'Relationship to permutations', formula: "X = ^nC_r, \\text{ and } ^nP_r = frac{n!}{(n-r)!}", detail: 'ðŸ“ Each combination of r objects can be arranged in r! different ways. So the number of permutations (ordered) = number of combinations × arrangements: â¿Páµ£ = X × r!.' },
      { label: 'Substitute permutation formula', formula: "X times r! = frac{n!}{(n-r)!}", detail: 'ðŸ§® We know â¿Páµ£ = n!/(nâˆ’r)!. Substituting: X × r! = n!/(nâˆ’r)!.' },
      { label: 'Solve for X', formula: "X = ^nC_r = frac{n!}{r!(n-r)!}", detail: 'âœ… Divide both sides by r!: X = â¿Cáµ£ = n!/(r!(nâˆ’r)!). For 5-choose-3: âµCâ‚ƒ = 5!/(3!2!) = 120/(6×2) = 10. There are 10 possible 3-person teams from 5 people. This is the foundation of the binomial distribution and Pascal\'s Triangle!' },
    ],
    practice: { question: 'Find âµCâ‚‚ (5 choose 2).', hint: '5!/(2!(5âˆ’2)!) = 120/(2×6)', answer: 10, tolerance: 0.5, explanation: 'âµCâ‚‚ = 10. There are 10 ways to choose 2 from 5.', errorHint: 'â¿Cáµ£ = n!/(r!(nâˆ’r)!)' },
    interactive: CombinationInteractive,
  },

  // â”€â”€ Unit 7: Mathematical Induction and Binomial Theorem â”€â”€
  binomial_theorem: {
    theoremKey: 'class11.binomial_theorem',
    title: 'Binomial Theorem for Positive Integers',
    icon: <Hash className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-fuchsia-600',
    accentColor: 'bg-indigo-600',
    finalFormula: '(a+b)^n = sum_{k=0}^{n} binom{n}{k} a^{n-k} b^k',
    finalFormulaDesc: 'Expand (a+b)â¿ as a sum of terms with binomial coefficients.',
    keyInsight: 'The binomial theorem is the algebraic powerhouse behind probability (binomial distribution), finance (binomial options pricing model), and even fractal geometry (Pascal\'s Triangle generates the Sierpinski triangle!).',
    steps: [
      { label: 'Basis step: n = 1', formula: '(a+b)^1 = a + b', detail: 'ðŸŒ³ You\'re a geneticist tracking how a trait spreads through a family tree. Each generation inherits one allele from each parent. The expansion of (A+B)â¿ gives all possible genotype combinations!' },
      { label: 'Assume true for n = k', formula: '(a+b)^k = sum_{i=0}^{k} binom{k}{i} a^{k-i} b^i', detail: 'ðŸ“ Assume the theorem holds for n = k: (a+b)áµ = Î£ áµCáµ¢ aáµâ»â± bâ±.' },
      { label: 'Multiply both sides by (a+b)', formula: '(a+b)^{k+1} = (a+b) times [binom{k}{0}a^k + binom{k}{1}a^{k-1}b + ... + binom{k}{k}b^k]', detail: 'ðŸ§® To prove for k+1, multiply both sides by (a+b): (a+b)áµâº¹ = (a+b)(áµCâ‚€aáµ + áµCâ‚aáµâ»¹b + ... + áµCâ‚–báµ).' },
      { label: 'Apply Pascal\'s identity', formula: 'binom{k}{r-1} + binom{k}{r} = binom{k+1}{r}', detail: 'âœ… After distributing and grouping like terms, the coefficients follow Pascal\'s identity: áµCáµ£â‚‹â‚ + áµCáµ£ = áµâº¹Cáµ£. Therefore (a+b)áµâº¹ = Î£ áµâº¹Cáµ£ aáµâº¹â»Ê³ bÊ³. By induction, the theorem holds for all positive integers n!' },
    ],
    practice: { question: 'Find the coefficient of a²b² in (a+b)â´.', hint: 'Row 4 of Pascal\'s triangle: 1, 4, 6, 4, 1. Coefficient of a²b² = â´Câ‚‚ = 6', answer: 6, tolerance: 0.5, explanation: 'Coefficient = â´Câ‚‚ = 6.', errorHint: 'Use Pascal\'s Triangle row n, position k' },
    interactive: BinomialInteractive,
  },

  // â”€â”€ Unit 8: Fundamental Laws of Trigonometry â”€â”€
  fundamental_trig: {
    theoremKey: 'class11.fundamental_trig',
    title: 'Fundamental Law of Trigonometry: cos(Î±âˆ’Î²)',
    icon: <Target className="w-5 h-5 text-white" />,
    accentGradient: 'from-violet-500 to-purple-600',
    accentColor: 'bg-violet-600',
    finalFormula: 'cos(alpha - beta) = cos alpha cos beta + sin alpha sin beta',
    finalFormulaDesc: 'The cosine of a difference equals the product of cosines plus product of sines.',
    keyInsight: 'This single formula is the mother of all trigonometric identities! From it, we can derive cos(Î±+Î²), sin(Î±±Î²), double-angle formulas, half-angle formulas, and product-to-sum identities. It\'s the Rosetta Stone of trigonometry.',
    steps: [
      { label: 'Unit circle setup', formula: 'C(cos alpha, sin alpha), D(cos beta, sin beta)', detail: 'ðŸŽ¯ You\'re a GPS engineer. The unit circle represents the Earth\'s equator, and points C and D are two satellites at angles Î± and Î² from the prime meridian.' },
      { label: 'Distance CD = AB', formula: '\{Chords of equal central angles are equal}', detail: 'ðŸ“ The central angle between C and D is Î±âˆ’Î². Construct angle AOB = Î±âˆ’Î² with A(1,0) and B(cos(Î±âˆ’Î²), sin(Î±âˆ’Î²)). Since the central angles are equal, chords CD and AB are equal.' },
      { label: 'Apply distance formula', formula: '(cos alpha - cos beta)^2 + (sin alpha - sin beta)^2 = [cos(alpha-beta) - 1]^2 + sin^2(alpha-beta)', detail: 'ðŸ§® Equating CD² = AB² and expanding both sides. On the left: cos²Î± + cos²Î² âˆ’ 2cosÎ±cosÎ² + sin²Î± + sin²Î² âˆ’ 2sinÎ±sinÎ² = 2 âˆ’ 2(cosÎ±cosÎ² + sinÎ±sinÎ²). On the right: 1 âˆ’ 2cos(Î±âˆ’Î²) + 1 = 2 âˆ’ 2cos(Î±âˆ’Î²).' },
      { label: 'Simplify', formula: 'cos(alpha - beta) = cos alpha cos beta + sin alpha sin beta', detail: 'âœ… Equating: 2 âˆ’ 2(cosÎ±cosÎ² + sinÎ±sinÎ²) = 2 âˆ’ 2cos(Î±âˆ’Î²). Cancel 2 and divide by âˆ’2: cos(Î±âˆ’Î²) = cosÎ±cosÎ² + sinÎ±sinÎ². From this single identity flows ALL of trigonometry!' },
    ],
    practice: { question: 'cos(60°âˆ’30°) = cos 60° cos 30° + sin 60° sin 30°. Compute cos(30°).', hint: 'cos 30° = âˆš3/2 â‰ˆ 0.866', answer: 0.866, tolerance: 0.01, explanation: 'cos 30° = 0.8660. The formula works perfectly!', errorHint: 'Use cos(Î±âˆ’Î²) = cosÎ±cosÎ² + sinÎ±sinÎ²' },
    interactive: TrigFundamentalInteractive,
  },

  trig_identities: {
    theoremKey: 'class11.trig_identities',
    title: 'Trigonometric Identities (Double & Triple Angle)',
    icon: <Target className="w-5 h-5 text-white" />,
    accentGradient: 'from-purple-500 to-pink-600',
    accentColor: 'bg-purple-600',
    finalFormula: 'sin(2alpha) = 2 sin alpha cos alpha, cos(2alpha) = cos^2 alpha - sin^2 alpha',
    finalFormulaDesc: 'Double-angle formulas derived from the fundamental law.',
    keyInsight: 'Double and triple angle formulas are essential in physics (harmonic oscillators, wave interference), engineering (Fourier series decomposing signals into frequencies), and even music synthesis (generating overtones from base frequencies)',
    steps: [
      { label: 'cos(âˆ’Î²) = cos Î²', formula: 'cos(0-beta) = cos 0 cos beta + sin 0 sin beta = cos beta', detail: 'ðŸ§­ Navigation: If you turn 30° clockwise vs 30° counterclockwise, the eastward component is the same! By the fundamental law with Î±=0: cos(âˆ’Î²) = cos 0 cos Î² + sin 0 sin Î² = cos Î².' },
      { label: 'sin(Î±+Î²)', formula: 'sin(alpha + beta) = sin alpha cos beta + cos alpha sin beta', detail: 'ðŸ”„ Using co-ratios: sin(Î±+Î²) = cos(Ï€/2âˆ’(Î±+Î²)) = cos[(Ï€/2âˆ’Î±)âˆ’Î²] = cos(Ï€/2âˆ’Î±)cos Î² + sin(Ï€/2âˆ’Î±)sin Î² = sin Î± cos Î² + cos Î± sin Î².' },
      { label: 'Double-angle identities', formula: 'sin(2alpha) = 2 sin alpha cos alpha, cos(2alpha) = cos^2 alpha - sin^2 alpha', detail: 'ðŸ§® Let Î² = Î± in sin(Î±+Î²): sin(2Î±) = sin Î± cos Î± + cos Î± sin Î± = 2 sin Î± cos Î±. For cos: cos(2Î±) = cos²Î± âˆ’ sin²Î± = 2cos²Î± âˆ’ 1 = 1 âˆ’ 2sin²Î±.' },
      { label: 'Triple-angle for sin', formula: 'sin(3alpha) = 3 sin alpha - 4 sin^3 alpha', detail: 'ðŸ”Š Audio engineers use this: sin(3Î±) = sin(2Î±+Î±) = sin(2Î±)cos Î± + cos(2Î±)sin Î± = (2 sin Î± cos Î±)cos Î± + (1 âˆ’ 2 sin²Î±)sin Î± = 2 sin Î±(1âˆ’sin²Î±) + sin Î± âˆ’ 2 sin³Î± = 3 sin Î± âˆ’ 4 sin³Î±. This generates the third harmonic in synthesizers!' },
    ],
    practice: { question: 'sin(30°) = 0.5. Find sin(60°) using the double-angle formula.', hint: 'sin(60°) = sin(2×30°) = 2×sin30°×cos30° = 2×0.5×0.866', answer: 0.866, tolerance: 0.01, explanation: 'sin(60°) = 0.8660. Double-angle verified!', errorHint: 'sin(2Î±) = 2 sin Î± cos Î±' },
    interactive: TrigFundamentalInteractive,
  },
};

