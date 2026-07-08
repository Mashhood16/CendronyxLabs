import { useTranslate } from '../i18n';
import { CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import type { TheoremConfig } from '../components/GenericTheoremLab';
import { Hash, Infinity, PieChart, Move3d, Ruler, Target } from 'lucide-react';

// ========== Interactive Components ==========

function ProductLogInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [m, setM] = useState(4); const [n, setN] = useState(8); const [b, setB] = useState(2);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const logM = Math.log(m) / Math.log(b); const logN = Math.log(n) / Math.log(b); const logMN = Math.log(m * n) / Math.log(b);
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - logMN) < 0.01 ? 'correct' : 'incorrect'); if (Math.abs(val - logMN) < 0.01) onAnswer(true); };
  return (<div className="space-y-4">
    <div className="grid grid-cols-3 gap-3">
      <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("Base (b)")}</label><input type="range" min="2" max="10" step="1" value={b} onChange={e => { setB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-teal-500" /><span className="text-sm font-mono text-teal-600">{t("b =")} {b}</span></div>
      <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("Number (m)")}</label><input type="range" min="1" max="64" step="1" value={m} onChange={e => { setM(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-teal-500" /><span className="text-sm font-mono text-teal-600">{t("m =")} {m}</span></div>
      <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("Number (n)")}</label><input type="range" min="1" max="64" step="1" value={n} onChange={e => { setN(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-teal-500" /><span className="text-sm font-mono text-teal-600">{t("n =")} {n}</span></div>
    </div>
    <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3 border border-teal-200 dark:border-teal-800">
      <p className="text-xs text-teal-700 dark:text-teal-300 font-mono">{t("log")}<sub>{b}</sub>({m}) = {logM.toFixed(4)}<br />{t("log")}<sub>{b}</sub>({n}) = {logN.toFixed(4)}<br />{t("log")}<sub>{b}</sub>({m} × {n}{t(") = log")}<sub>{b}</sub>({m * n}) = <strong>{logMN.toFixed(4)}</strong><br />{t("Sum:")} <strong>{(logM + logN).toFixed(4)}</strong> {t("= log")}<sub>{b}</sub>({m * n}) ✓</p>
    </div>
    <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("log_b(mn) = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-teal-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors">{t("Check")}</button></div>
    {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {t("Correct! log")}<sub>{b}</sub>({m * n}) = {logMN.toFixed(4)}</p>}
    {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> {t("Try using log_b(mn) = log_b m + log_b n")}</p>}
  </div>);
}

function QuotientLogInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [m, setM] = useState(32); const [n, setN] = useState(4); const [b, setB] = useState(2);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const logM = Math.log(m) / Math.log(b); const logN = Math.log(n) / Math.log(b); const logMN = Math.log(m / n) / Math.log(b);
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - logMN) < 0.01 ? 'correct' : 'incorrect'); if (Math.abs(val - logMN) < 0.01) onAnswer(true); };
  return (<div className="space-y-4">
    <div className="grid grid-cols-3 gap-3">
      <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("Base (b)")}</label><input type="range" min="2" max="10" step="1" value={b} onChange={e => { setB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-purple-500" /><span className="text-sm font-mono text-purple-600">{t("b =")} {b}</span></div>
      <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("Numerator (m)")}</label><input type="range" min="2" max="64" step="1" value={m} onChange={e => { setM(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-purple-500" /><span className="text-sm font-mono text-purple-600">{t("m =")} {m}</span></div>
      <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("Denominator (n)")}</label><input type="range" min="1" max="32" step="1" value={n} onChange={e => { setN(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-purple-500" /><span className="text-sm font-mono text-purple-600">{t("n =")} {n}</span></div>
    </div>
    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
      <p className="text-xs text-purple-700 dark:text-purple-300 font-mono">{t("log")}<sub>{b}</sub>({m}) = {logM.toFixed(4)}<br />{t("log")}<sub>{b}</sub>({n}) = {logN.toFixed(4)}<br />{t("log")}<sub>{b}</sub>({m}/{n}{t(") = log")}<sub>{b}</sub>({(m/n).toFixed(2)}) = <strong>{logMN.toFixed(4)}</strong><br />{t("Difference:")} <strong>{(logM - logN).toFixed(4)}</strong> {t("= log")}<sub>{b}</sub>({m}/{n}) ✓</p>
    </div>
    <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("log_b(m/n) = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-purple-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors">{t("Check")}</button></div>
    {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {t("Correct! log")}<sub>{b}</sub>({(m/n).toFixed(2)}) = {logMN.toFixed(4)}</p>}
    {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> {t("Try log_b(m/n) = log_b m - log_b n")}</p>}
  </div>);
}

function PowerLogInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [m, setM] = useState(3); const [n, setN] = useState(4); const [b, setB] = useState(2);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const logM = Math.log(m) / Math.log(b); const logMN = Math.log(Math.pow(m, n)) / Math.log(b);
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - logMN) < 0.01 ? 'correct' : 'incorrect'); if (Math.abs(val - logMN) < 0.01) onAnswer(true); };
  return (<div className="space-y-4">
    <div className="grid grid-cols-3 gap-3">
      <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("Base (b)")}</label><input type="range" min="2" max="10" step="1" value={b} onChange={e => { setB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" /><span className="text-sm font-mono text-rose-600">{t("b =")} {b}</span></div>
      <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("Number (m)")}</label><input type="range" min="1" max="10" step="1" value={m} onChange={e => { setM(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" /><span className="text-sm font-mono text-rose-600">{t("m =")} {m}</span></div>
      <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("Power (n)")}</label><input type="range" min="1" max="10" step="1" value={n} onChange={e => { setN(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" /><span className="text-sm font-mono text-rose-600">{t("n =")} {n}</span></div>
    </div>
    <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-3 border border-rose-200 dark:border-rose-800">
      <p className="text-xs text-rose-700 dark:text-rose-300 font-mono">{t("log")}<sub>{b}</sub>({m}) = {logM.toFixed(4)}<br />{t("log")}<sub>{b}</sub>({m}<sup>{n}</sup>{t(") = log")}<sub>{b}</sub>({Math.pow(m, n)}) = <strong>{logMN.toFixed(4)}</strong><br />{t("n × log")}<sub>{b}</sub>{t("(m) =")} {n} × {logM.toFixed(4)} = <strong>{(n * logM).toFixed(4)}</strong> ✓</p>
    </div>
    <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("log_b(m^n) = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-rose-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition-colors">{t("Check")}</button></div>
    {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {t("Correct! log")}<sub>{b}</sub>({Math.pow(m, n)}) = {logMN.toFixed(4)}</p>}
    {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> {t("Try log_b(m^n) = n · log_b m")}</p>}
  </div>);
}

function ChangeBaseInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [m, setM] = useState(8); const [b, setB] = useState(10);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const logBaseB = Math.log(m) / Math.log(b); const logBase2 = Math.log(m) / Math.log(2); const logBaseE = Math.log(m);
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - logBaseB) < 0.01 ? 'correct' : 'incorrect'); if (Math.abs(val - logBaseB) < 0.01) onAnswer(true); };
  return (<div className="space-y-4">
    <div className="grid grid-cols-2 gap-3">
      <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("Number (m)")}</label><input type="range" min="1" max="100" step="1" value={m} onChange={e => { setM(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-cyan-500" /><span className="text-sm font-mono text-cyan-600">{t("m =")} {m}</span></div>
      <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("New Base (b)")}</label><input type="range" min="2" max="20" step="1" value={b} onChange={e => { setB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-cyan-500" /><span className="text-sm font-mono text-cyan-600">{t("b =")} {b}</span></div>
    </div>
    <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-3 border border-cyan-200 dark:border-cyan-800">
      <p className="text-xs text-cyan-700 dark:text-cyan-300 font-mono">{t("log")}<sub>{b}</sub>({m}) = <strong>{logBaseB.toFixed(4)}</strong><br />{t("Using base 2: log₂(")}{m}{t(") / log₂(")}{b}) = {logBase2.toFixed(4)} / {(Math.log(b)/Math.log(2)).toFixed(4)} = <strong>{logBaseB.toFixed(4)}</strong> ✓<br />{t("Using ln: ln(")}{m}{t(") / ln(")}{b}) = {logBaseE.toFixed(4)} / {Math.log(b).toFixed(4)} = <strong>{logBaseB.toFixed(4)}</strong> ✓</p>
    </div>
    <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("log_b(m) = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-cyan-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg transition-colors">{t("Check")}</button></div>
    {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {t("Correct! log")}<sub>{b}</sub>({m}) = {logBaseB.toFixed(4)}</p>}
    {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> {t("Try log_b(m) = log_a(m)/log_a(b)")}</p>}
  </div>);
}

function UnionAssociativeInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [a, setA] = useState(4); const [b, setB] = useState(3); const [c, setC] = useState(5); const [intersect, setIntersect] = useState(2);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const aUbUc = a + b + c - intersect - intersect - intersect;
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - aUbUc) < 0.5 ? 'correct' : 'incorrect'); if (Math.abs(val - aUbUc) < 0.5) onAnswer(true); };
  return (<div className="space-y-4">
    <div className="grid grid-cols-4 gap-2">
      <div><label className="text-xs font-semibold text-slate-600">{t("|A|")}</label><input type="range" min="1" max="10" step="1" value={a} onChange={e => setA(parseFloat(e.target.value))} className="w-full accent-blue-500" /><span className="text-xs font-mono">{a}</span></div>
      <div><label className="text-xs font-semibold text-slate-600">{t("|B|")}</label><input type="range" min="1" max="10" step="1" value={b} onChange={e => setB(parseFloat(e.target.value))} className="w-full accent-emerald-500" /><span className="text-xs font-mono">{b}</span></div>
      <div><label className="text-xs font-semibold text-slate-600">{t("|C|")}</label><input type="range" min="1" max="10" step="1" value={c} onChange={e => setC(parseFloat(e.target.value))} className="w-full accent-amber-500" /><span className="text-xs font-mono">{c}</span></div>
      <div><label className="text-xs font-semibold text-slate-600">{t("|A∩B|")}</label><input type="range" min="0" max={a} step="1" value={intersect} onChange={e => setIntersect(parseFloat(e.target.value))} className="w-full accent-rose-500" /><span className="text-xs font-mono">{intersect}</span></div>
    </div>
    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800"><p className="text-xs text-indigo-700 dark:text-indigo-300 font-mono">{t("(A ∪ B) ∪ C = A ∪ (B ∪ C) =")} <strong>{aUbUc}</strong> ✓</p></div>
    <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("|A ∪ B ∪ C| = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-indigo-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors">{t("Check")}</button></div>
    {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! (A∪B)∪C = A∪(B∪C) =")} {aUbUc}</p>}
    {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("How many unique elements total?")}</p>}
  </div>);
}

function IntersectionAssociativeInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [a, setA] = useState(5); const [b, setB] = useState(4); const [c, setC] = useState(3);
  const handleCheck = () => { /* Just shows the concept visually */ };
  return (<div className="space-y-4">
    <div className="grid grid-cols-3 gap-3">
      <div><label className="text-xs font-semibold">{t("Set A")}</label><input type="range" min="2" max="8" step="1" value={a} onChange={e => setA(parseFloat(e.target.value))} className="w-full accent-indigo-500" /><span className="text-xs">{'♥'.repeat(a)}</span></div>
      <div><label className="text-xs font-semibold">{t("Set B")}</label><input type="range" min="2" max="8" step="1" value={b} onChange={e => setB(parseFloat(e.target.value))} className="w-full accent-emerald-500" /><span className="text-xs">{'♦'.repeat(b)}</span></div>
      <div><label className="text-xs font-semibold">{t("Set C")}</label><input type="range" min="2" max="8" step="1" value={c} onChange={e => setC(parseFloat(e.target.value))} className="w-full accent-amber-500" /><span className="text-xs">{'♣'.repeat(c)}</span></div>
    </div>
    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
      <p className="text-xs text-indigo-700 dark:text-indigo-300"><strong>{t("Theorem:")}</strong> {t("(A ∩ B) ∩ C = A ∩ (B ∩ C)")}<br /><span className="italic mt-1 block">{t("Logical AND is associative — just like (P AND Q) AND R = P AND (Q AND R). Grouping doesn't change which elements are in all three sets.")}</span></p>
    </div>
  </div>);
}

function DistributeUnionInterInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [aSize, setASize] = useState(5); const [bSize, setBSize] = useState(4); const [cSize, setCSize] = useState(3);
  return (<div className="space-y-4">
    <div className="grid grid-cols-3 gap-3">
      <div><label className="text-xs font-semibold">{t("Set A")}</label><input type="range" min="2" max="8" step="1" value={aSize} onChange={e => setASize(parseFloat(e.target.value))} className="w-full accent-sky-500" /><span className="text-xs">{'♥'.repeat(aSize)}</span></div>
      <div><label className="text-xs font-semibold">{t("Set B")}</label><input type="range" min="2" max="8" step="1" value={bSize} onChange={e => setBSize(parseFloat(e.target.value))} className="w-full accent-emerald-500" /><span className="text-xs">{'♦'.repeat(bSize)}</span></div>
      <div><label className="text-xs font-semibold">{t("Set C")}</label><input type="range" min="2" max="8" step="1" value={cSize} onChange={e => setCSize(parseFloat(e.target.value))} className="w-full accent-amber-500" /><span className="text-xs">{'♣'.repeat(cSize)}</span></div>
    </div>
    <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-3 border border-sky-200 dark:border-sky-800">
      <p className="text-xs text-sky-700 dark:text-sky-300"><strong>{t("Theorem:")}</strong> {t("A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C)")}<br /><span className="italic mt-1 block">{t("An element is in A ∪ (B ∩ C) if it's in A, or it's in both B AND C. This is logically equivalent to being in (A ∪ B) AND (A ∪ C).")}</span></p>
    </div>
  </div>);
}

function DistributeInterUnionInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [aSize, setASize] = useState(5); const [bSize, setBSize] = useState(4); const [cSize, setCSize] = useState(3);
  return (<div className="space-y-4">
    <div className="grid grid-cols-3 gap-3">
      <div><label className="text-xs font-semibold">{t("Set A")}</label><input type="range" min="2" max="8" step="1" value={aSize} onChange={e => setASize(parseFloat(e.target.value))} className="w-full accent-sky-500" /><span className="text-xs">{'♥'.repeat(aSize)}</span></div>
      <div><label className="text-xs font-semibold">{t("Set B")}</label><input type="range" min="2" max="8" step="1" value={bSize} onChange={e => setBSize(parseFloat(e.target.value))} className="w-full accent-emerald-500" /><span className="text-xs">{'♦'.repeat(bSize)}</span></div>
      <div><label className="text-xs font-semibold">{t("Set C")}</label><input type="range" min="2" max="8" step="1" value={cSize} onChange={e => setCSize(parseFloat(e.target.value))} className="w-full accent-amber-500" /><span className="text-xs">{'♣'.repeat(cSize)}</span></div>
    </div>
    <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-3 border border-sky-200 dark:border-sky-800">
      <p className="text-xs text-sky-700 dark:text-sky-300"><strong>{t("Theorem:")}</strong> {t("A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)")}<br /><span className="italic mt-1 block">{t("An element is in A ∩ (B ∪ C) if it's in A AND (in B OR C). This distributes to (A∩B) OR (A∩C) — just like the distributive law in algebra!")}</span></p>
    </div>
  </div>);
}

function QuotientIdentityInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [angle, setAngle] = useState(30); const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const rad = angle * Math.PI / 180; const sinVal = Math.sin(rad); const cosVal = Math.cos(rad); const tanVal = Math.tan(rad); const sinDivCos = sinVal / cosVal;
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - tanVal) < 0.01 ? 'correct' : 'incorrect'); if (Math.abs(val - tanVal) < 0.01) onAnswer(true); };
  return (<div className="space-y-4">
    <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("Angle θ")}</label><input type="range" min="0" max="89" step="1" value={angle} onChange={e => { setAngle(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-yellow-500" /><span className="text-sm font-mono text-yellow-600">θ = {angle}°</span></div>
    <div className="relative h-28 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]"><svg viewBox="0 0 200 120" className="w-full h-full"><polygon points="20,100 180,100 20,20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-500" /><text x="50" y="80" className="text-[10px] fill-slate-500">{t("Opposite")}</text><text x="100" y="112" className="text-[10px] fill-slate-500">{t("Adjacent")}</text><text x="12" y="40" className="text-[10px] fill-slate-500">{t("Hyp")}</text><text x="25" y="108" className="text-[10px] fill-yellow-600">θ</text></svg></div>
    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800"><p className="text-xs text-yellow-700 dark:text-yellow-300 font-mono">{t("sin(")}{angle}°) = {sinVal.toFixed(4)}<br />{t("cos(")}{angle}°) = {cosVal.toFixed(4)}<br />{t("tan(")}{angle}°) = {tanVal.toFixed(4)}<br />{t("sin/cos =")} {sinVal.toFixed(4)} / {cosVal.toFixed(4)} = <strong>{sinDivCos.toFixed(4)}</strong> {t("= tan(")}{angle}°) ✓</p></div>
    <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("tan(θ) = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-yellow-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-colors">{t("Check")}</button></div>
    {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! tan(θ) = sin(θ)/cos(θ)")}</p>}
    {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try tan θ = sin θ / cos θ")}</p>}
  </div>);
}

function PythagoreanIdentityInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [angle, setAngle] = useState(37); const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const rad = angle * Math.PI / 180; const sinVal = Math.sin(rad); const cosVal = Math.cos(rad); const sin2cos2 = sinVal * sinVal + cosVal * cosVal;
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - sin2cos2) < 0.001 ? 'correct' : 'incorrect'); if (Math.abs(val - sin2cos2) < 0.001) onAnswer(true); };
  return (<div className="space-y-4">
    <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("Angle θ")}</label><input type="range" min="0" max="360" step="1" value={angle} onChange={e => { setAngle(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" /><span className="text-sm font-mono text-emerald-600">θ = {angle}°</span></div>
    <div className="relative h-28 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]"><svg viewBox="0 0 160 120" className="w-full h-full"><circle cx="80" cy="60" r="45" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-600" /><line x1="80" y1="60" x2={80 + 45 * Math.cos(rad)} y2={60 - 45 * Math.sin(rad)} stroke="#059669" strokeWidth="1.5" /><line x1="80" y1="60" x2={80 + Math.abs(45 * Math.cos(rad))} y2={60} stroke="#3b82f6" strokeWidth="1" /><line x1={80 + 45 * Math.cos(rad)} y1={60} x2={80 + 45 * Math.cos(rad)} y2={60 - 45 * Math.sin(rad)} stroke="#f59e0b" strokeWidth="1" /></svg></div>
    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800"><p className="text-xs text-emerald-700 dark:text-emerald-300 font-mono">{t("sin²(")}{angle}{t("°) + cos²(")}{angle}°) = ({sinVal.toFixed(4)})² + ({cosVal.toFixed(4)})²<br />= {(sinVal * sinVal).toFixed(4)} + {(cosVal * cosVal).toFixed(4)} = <strong>{sin2cos2.toFixed(6)}</strong></p></div>
    <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("sin²θ + cos²θ = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-emerald-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors">{t("Check")}</button></div>
    {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! sin²θ + cos²θ = 1 always!")}</p>}
    {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("The answer is always 1. Try again!")}</p>}
  </div>);
}

function DistanceFormulaInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [x1, setX1] = useState(1); const [y1, setY1] = useState(2); const [x2, setX2] = useState(7); const [y2, setY2] = useState(6);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const dx = x2 - x1; const dy = y2 - y1; const distance = Math.sqrt(dx * dx + dy * dy);
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - distance) < 0.1 ? 'correct' : 'incorrect'); if (Math.abs(val - distance) < 0.1) onAnswer(true); };
  return (<div className="space-y-4">
    <div className="grid grid-cols-2 gap-3">
      <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("P₁(x₁, y₁)")}</label><div className="grid grid-cols-2 gap-2"><div><span className="text-[10px]">x₁</span><input type="range" min="-10" max="10" step="1" value={x1} onChange={e => { setX1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" /><span className="text-xs">{x1}</span></div><div><span className="text-[10px]">y₁</span><input type="range" min="-10" max="10" step="1" value={y1} onChange={e => { setY1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" /><span className="text-xs">{y1}</span></div></div></div>
      <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("P₂(x₂, y₂)")}</label><div className="grid grid-cols-2 gap-2"><div><span className="text-[10px]">x₂</span><input type="range" min="-10" max="10" step="1" value={x2} onChange={e => { setX2(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-orange-500" /><span className="text-xs">{x2}</span></div><div><span className="text-[10px]">y₂</span><input type="range" min="-10" max="10" step="1" value={y2} onChange={e => { setY2(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-orange-500" /><span className="text-xs">{y2}</span></div></div></div>
    </div>
    <div className="relative h-28 bg-white dark:bg-[#121212] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]"><svg viewBox="0 0 200 100" className="w-full h-full"><circle cx={100 + x1 * 8} cy={50 - y1 * 8} r="4" fill="#3b82f6" /><text x={100 + x1 * 8 + 5} y={50 - y1 * 8 + 3} className="text-[8px] fill-blue-600">P₁</text><circle cx={100 + x2 * 8} cy={50 - y2 * 8} r="4" fill="#f97316" /><text x={100 + x2 * 8 + 5} y={50 - y2 * 8 + 3} className="text-[8px] fill-orange-600">P₂</text><line x1={100 + x1 * 8} y1={50 - y1 * 8} x2={100 + x2 * 8} y2={50 - y2 * 8} stroke="#8b5cf6" strokeWidth="1.5" /></svg></div>
    <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3 border border-violet-200 dark:border-violet-800"><p className="text-xs text-violet-700 dark:text-violet-300 font-mono">{t("d = √((")}{x2} − {x1})² + ({y2} − {y1})²) = √({dx}² + {dy}²) = √{dx*dx + dy*dy} = <strong>{distance.toFixed(2)}</strong></p></div>
    <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("Distance = ?")} step="0.1" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-violet-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors">{t("Check")}</button></div>
    {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! d =")} {distance.toFixed(2)}</p>}
    {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try d = √((x₂-x₁)² + (y₂-y₁)²)")}</p>}
  </div>);
}

function SlopeInterceptInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [m, setM] = useState(2); const [c, setC] = useState(1); const [xVal, setXVal] = useState(3);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const yResult = m * xVal + c;
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - yResult) < 0.1 ? 'correct' : 'incorrect'); if (Math.abs(val - yResult) < 0.1) onAnswer(true); };
  return (<div className="space-y-4">
    <div className="grid grid-cols-3 gap-3">
      <div><label className="text-xs font-semibold">{t("Slope (m)")}</label><input type="range" min="-5" max="5" step="0.5" value={m} onChange={e => { setM(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-amber-500" /><span className="text-xs">{m}</span></div>
      <div><label className="text-xs font-semibold">{t("y-intercept (c)")}</label><input type="range" min="-5" max="5" step="0.5" value={c} onChange={e => { setC(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-amber-500" /><span className="text-xs">{c}</span></div>
      <div><label className="text-xs font-semibold">{t("x value")}</label><input type="range" min="-10" max="10" step="0.5" value={xVal} onChange={e => { setXVal(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-amber-500" /><span className="text-xs">{xVal}</span></div>
    </div>
    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800"><p className="text-xs text-amber-700 dark:text-amber-300 font-mono">{t("y = mx + c =")} {m} × {xVal} + {c} = <strong>{yResult}</strong></p></div>
    <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("y = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-amber-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors">{t("Check")}</button></div>
    {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! y =")} {yResult}</p>}
    {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try y = mx + c")}</p>}
  </div>);
}

function PointSlopeInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [m, setM] = useState(1.5); const [x1, setX1] = useState(2); const [y1, setY1] = useState(3); const [x, setX] = useState(5);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const y = m * (x - x1) + y1;
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - y) < 0.1 ? 'correct' : 'incorrect'); if (Math.abs(val - y) < 0.1) onAnswer(true); };
  return (<div className="space-y-4">
    <div className="grid grid-cols-4 gap-2">
      <div><label className="text-[10px] font-semibold">m</label><input type="range" min="-3" max="3" step="0.5" value={m} onChange={e => { setM(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" /><span className="text-xs">{m}</span></div>
      <div><label className="text-[10px] font-semibold">x₁</label><input type="range" min="-5" max="5" step="1" value={x1} onChange={e => { setX1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" /><span className="text-xs">{x1}</span></div>
      <div><label className="text-[10px] font-semibold">y₁</label><input type="range" min="-5" max="5" step="1" value={y1} onChange={e => { setY1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" /><span className="text-xs">{y1}</span></div>
      <div><label className="text-[10px] font-semibold">x</label><input type="range" min="-5" max="10" step="0.5" value={x} onChange={e => { setX(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" /><span className="text-xs">{x}</span></div>
    </div>
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800"><p className="text-xs text-blue-700 dark:text-blue-300 font-mono">{t("y −")} {y1} = {m}({x} − {x1})<br />{t("y =")} {m}({x - x1}) + {y1} = <strong>{y}</strong></p></div>
    <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("y = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-blue-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">{t("Check")}</button></div>
    {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! y =")} {y}</p>}
    {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try y − y₁ = m(x − x₁)")}</p>}
  </div>);
}

function TwoPointFormInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [x1, setX1] = useState(1); const [y1, setY1] = useState(2); const [x2, setX2] = useState(4); const [y2, setY2] = useState(8); const [x, setX] = useState(3);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const slope = (y2 - y1) / (x2 - x1); const y = slope * (x - x1) + y1;
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - y) < 0.1 ? 'correct' : 'incorrect'); if (Math.abs(val - y) < 0.1) onAnswer(true); };
  return (<div className="space-y-4">
    <div className="grid grid-cols-3 gap-3">
      <div><label className="text-xs font-semibold">P₁</label><div className="grid grid-cols-2 gap-1"><div><span className="text-[10px]">x₁</span><input type="range" min="-5" max="5" step="1" value={x1} onChange={e => setX1(parseFloat(e.target.value))} className="w-full accent-pink-500" /><span className="text-xs">{x1}</span></div><div><span className="text-[10px]">y₁</span><input type="range" min="-5" max="5" step="1" value={y1} onChange={e => setY1(parseFloat(e.target.value))} className="w-full accent-pink-500" /><span className="text-xs">{y1}</span></div></div></div>
      <div><label className="text-xs font-semibold">P₂</label><div className="grid grid-cols-2 gap-1"><div><span className="text-[10px]">x₂</span><input type="range" min="-5" max="5" step="1" value={x2} onChange={e => setX2(parseFloat(e.target.value))} className="w-full accent-pink-500" /><span className="text-xs">{x2}</span></div><div><span className="text-[10px]">y₂</span><input type="range" min="-5" max="5" step="1" value={y2} onChange={e => setY2(parseFloat(e.target.value))} className="w-full accent-pink-500" /><span className="text-xs">{y2}</span></div></div></div>
      <div><label className="text-[10px] font-semibold">{t("x (query)")}</label><input type="range" min="-5" max="10" step="0.5" value={x} onChange={e => setX(parseFloat(e.target.value))} className="w-full accent-pink-500" /><span className="text-xs">{x}</span></div>
    </div>
    <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-3 border border-pink-200 dark:border-pink-800"><p className="text-xs text-pink-700 dark:text-pink-300 font-mono">{t("Slope m = (")}{y2}−{y1})/({x2}−{x1}) = {slope.toFixed(2)}<br />{t("At x =")} {x}{t(": y =")} {slope.toFixed(2)}({x}−{x1}) + {y1} = <strong>{y.toFixed(2)}</strong></p></div>
    <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("y = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-pink-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-lg transition-colors">{t("Check")}</button></div>
    {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! y =")} {y.toFixed(2)}</p>}
    {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try y − y₁ = ((y₂−y₁)/(x₂−x₁))(x − x₁)")}</p>}
  </div>);
}

function TwoInterceptInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [a, setA] = useState(4); const [b, setB] = useState(3); const [x, setX] = useState(2);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const y = b * (1 - x / a);
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - y) < 0.1 ? 'correct' : 'incorrect'); if (Math.abs(val - y) < 0.1) onAnswer(true); };
  return (<div className="space-y-4">
    <div className="grid grid-cols-3 gap-3">
      <div><label className="text-xs font-semibold">{t("x-intercept (a)")}</label><input type="range" min="1" max="10" step="0.5" value={a} onChange={e => { setA(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-indigo-500" /><span className="text-xs">{a}</span></div>
      <div><label className="text-xs font-semibold">{t("y-intercept (b)")}</label><input type="range" min="1" max="10" step="0.5" value={b} onChange={e => { setB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-indigo-500" /><span className="text-xs">{b}</span></div>
      <div><label className="text-xs font-semibold">{t("x value")}</label><input type="range" min="0" max="10" step="0.5" value={x} onChange={e => { setX(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-indigo-500" /><span className="text-xs">{x}</span></div>
    </div>
    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800"><p className="text-xs text-indigo-700 dark:text-indigo-300 font-mono">{x}/{a} {t("+ y/")}{b} = 1 <br />{t("y =")} <strong>{y.toFixed(2)}</strong></p></div>
    <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("y = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-indigo-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors">{t("Check")}</button></div>
    {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! y =")} {y.toFixed(2)}</p>}
    {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try x/a + y/b = 1")}</p>}
  </div>);
}

function NormalFormInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [alpha, setAlpha] = useState(45); const [p, setP] = useState(5);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const rad = alpha * Math.PI / 180; const cosA = Math.cos(rad); const sinA = Math.sin(rad);
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - p) < 0.1 ? 'correct' : 'incorrect'); if (Math.abs(val - p) < 0.1) onAnswer(true); };
  return (<div className="space-y-4">
    <div className="grid grid-cols-2 gap-3">
      <div><label className="text-xs font-semibold">{t("α (inclination)")}</label><input type="range" min="0" max="90" step="1" value={alpha} onChange={e => { setAlpha(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-orange-500" /><span className="text-xs">{alpha}°</span></div>
      <div><label className="text-xs font-semibold">{t("p (perp distance)")}</label><input type="range" min="1" max="10" step="0.5" value={p} onChange={e => { setP(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-orange-500" /><span className="text-xs">{p}</span></div>
    </div>
    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800"><p className="text-xs text-orange-700 dark:text-orange-300 font-mono">{t("x cos(")}{alpha}{t("°) + y sin(")}{alpha}°) = {p}<br />x({cosA.toFixed(4)}{t(") + y(")}{sinA.toFixed(4)}) = {p}</p></div>
    <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("p = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-orange-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors">{t("Check")}</button></div>
    {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! p =")} {p}</p>}
    {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("The perpendicular distance p =")} {p}</p>}
  </div>);
}

function AngleBetweenLinesInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [m1, setM1] = useState(0.5); const [m2, setM2] = useState(2);
  const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const tanTheta = Math.abs((m2 - m1) / (1 + m1 * m2)); const thetaDeg = Math.atan(tanTheta) * 180 / Math.PI;
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - thetaDeg) < 0.5 ? 'correct' : 'incorrect'); if (Math.abs(val - thetaDeg) < 0.5) onAnswer(true); };
  return (<div className="space-y-4">
    <div className="grid grid-cols-2 gap-3">
      <div><label className="text-xs font-semibold">{t("Slope m₁")}</label><input type="range" min="-3" max="3" step="0.1" value={m1} onChange={e => { setM1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" /><span className="text-xs">{m1}</span></div>
      <div><label className="text-xs font-semibold">{t("Slope m₂")}</label><input type="range" min="-3" max="3" step="0.1" value={m2} onChange={e => { setM2(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" /><span className="text-xs">{m2}</span></div>
    </div>
    <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-3 border border-rose-200 dark:border-rose-800"><p className="text-xs text-rose-700 dark:text-rose-300 font-mono">{t("tan θ = |(")}{m2}−{m1})/(1+{m1}×{m2})| = <strong>{thetaDeg.toFixed(1)}°</strong></p></div>
    <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("θ (degrees) = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-rose-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition-colors">{t("Check")}</button></div>
    {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! θ =")} {thetaDeg.toFixed(1)}°</p>}
    {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try tan θ = |(m₂−m₁)/(1+m₁m₂)|")}</p>}
  </div>);
}

// ========== Theorem Configs ==========

export const CLASS9_THEOREMS: Record<string, TheoremConfig> = {
  product_log: {
    theoremKey: 'class9.product_log',
    title: "Product Law of Logarithms",
    icon: <Hash className="w-5 h-5 text-white" />,
    accentGradient: 'from-teal-500 to-emerald-600',
    accentColor: 'bg-teal-600',
    finalFormula: 'log_b (mn) = log_b m + log_b n',
    finalFormulaDesc: 'The log of a product equals the sum of the logs.',
    keyInsight: 'The Richter scale uses this law: a magnitude 8 earthquake isn\'t twice as powerful as a magnitude 4 — it\'s 10,000 times! Because the scale is logarithmic, each whole number adds a factor of 10.',
    steps: [
      { label: 'Set up variables', formula: 'log_b m = x, log_b n = y', detail: '🧮 You\'re a sound engineer mixing a live concert. The microphone picks up sound at power m = 4 units, and the amplifier adds n = 8 units. To figure out the total gain, you reach for logarithms. Let log_b m = x and log_b n = y — these represent the "logarithmic power" of each signal.' },
      { label: 'Convert to exponentials', formula: 'm = b^x, n = b^y', detail: 'Converting back: m = b^x and n = b^y. In our concert, if b = 2 (binary amplification), then m = 2^x and n = 2^y. The exponential form reveals the actual multipliers hiding behind the log values.' },
      { label: 'Multiply the equations', formula: 'mn = b^x \· b^y = b^{x+y}', detail: 'Now multiply m × n: mn = b^x · b^y. When multiplying powers with the same base, we ADD the exponents: mn = b^(x+y). This is the key insight — multiplication in the real world becomes addition in log world.' },
      { label: 'Convert back to logs', formula: 'log_b(mn) = x + y = log_b m + log_b n', detail: 'Convert mn = b^(x+y) back to logarithmic form: log_b(mn) = x + y. Substitute x = log_b m and y = log_b n, and you get: log_b(mn) = log_b m + log_b n. The total sound power (product) equals the sum of the individual log powers.' },
    ],
    practice: { question: 'log₂(4) = 2, log₂(8) = 3. Find log₂(32).', hint: '32 = 4 × 8. Use product law: log₂(4) + log₂(8)', answer: 5, tolerance: 0.1, explanation: 'log₂(32) = 5. Indeed, 2⁵ = 32!', errorHint: 'log_b(mn) = log_b m + log_b n' },
    interactive: ProductLogInteractive,
  },

  quotient_log: {
    theoremKey: 'class9.quotient_log',
    title: "Quotient Law of Logarithms",
    icon: <Hash className="w-5 h-5 text-white" />,
    accentGradient: 'from-purple-500 to-violet-600',
    accentColor: 'bg-purple-600',
    finalFormula: 'log_b (m/n) = log_b m - log_b n',
    finalFormulaDesc: 'The log of a quotient equals the difference of the logs.',
    keyInsight: 'pH = −log[H⁺] uses this: a solution at pH 3 is 100× more acidic than pH 5, because 10^(5−3) = 10² = 100 on the logarithmic scale.',
    steps: [
      { label: 'Set up variables', formula: 'log_b m = x, log_b n = y', detail: '🔬 You\'re a chemist measuring the concentration of a solution before and after dilution. The initial concentration is m = 32 M (molar) and after dilution it drops to n = 4 M. Let\'s set log_b m = x and log_b n = y.' },
      { label: 'Convert to exponentials', formula: 'm = b^x, n = b^y', detail: 'Convert to exponential form: m = b^x and n = b^y. With base b = 10 (common log), we have 32 = 10^x and 4 = 10^y. The exponents x and y are the powers of 10 that give us these concentrations.' },
      { label: 'Divide the equations', formula: 'm/n = b^x / b^y = b^{x-y}', detail: 'Divide m by n: m/n = b^x / b^y. When dividing powers with the same base, we SUBTRACT the exponents: m/n = b^(x−y). Division in the real world becomes subtraction in log world.' },
      { label: 'Convert back to logs', formula: 'log_b(m/n) = x - y = log_b m - log_b n', detail: 'Convert m/n = b^(x−y) to log form: log_b(m/n) = x − y. Substituting back: log_b(m/n) = log_b m − log_b n. The dilution factor in log terms is just the difference of the individual log concentrations.' },
    ],
    practice: { question: 'log₁₀(100) = 2, log₁₀(10) = 1. Find log₁₀(10).', hint: '10 = 100/10. Use quotient law: log₁₀(100) − log₁₀(10)', answer: 1, tolerance: 0.1, explanation: 'log₁₀(10) = 1. The quotient law correctly gives us back 1!', errorHint: 'log_b(m/n) = log_b m − log_b n' },
    interactive: QuotientLogInteractive,
  },

  power_log: {
    theoremKey: 'class9.power_log',
    title: "Power Law of Logarithms",
    icon: <Hash className="w-5 h-5 text-white" />,
    accentGradient: 'from-rose-500 to-pink-600',
    accentColor: 'bg-rose-600',
    finalFormula: 'log_b m^n = n log_b m',
    finalFormulaDesc: 'The log of a power equals the exponent times the log of the base.',
    keyInsight: 'Astronomers love logs: the distance to the farthest galaxies is 10²⁶ meters — log₁₀(10²⁶) = 26 × log₁₀(10) = 26. A 26 on the log scale is easy to write and compare!',
    steps: [
      { label: 'Set up the equation', formula: 'log_b m = x', detail: '💰 You\'re an investor watching your money grow. Your initial investment of m = $3,000 grows at b = 2× per year. After n = 4 years, your money multiplies by 2^4. Let log_b m = x, meaning b^x = m.' },
      { label: 'Convert to exponential', formula: 'm = b^x', detail: 'Convert m = b^x. Your initial $3,000 = 2^x means x = log₂(3000) ≈ 11.55 — the "doubling power" of your investment.' },
      { label: 'Raise both sides to power n', formula: 'm^n = (b^x)^n = b^{nx}', detail: 'Raise both sides to the n-th power: m^n = (b^x)^n. Using the power of a power rule: m^n = b^(nx). Your investment after 4 years: 3000^4? No — this is a mathematical power, not financial.' },
      { label: 'Convert to log form', formula: 'log_b(m^n) = nx = n log_b m', detail: 'Converting m^n = b^(nx) to log form: log_b(m^n) = nx. Substituting x = log_b m: log_b(m^n) = n log_b m. The exponent "pulls down" in front of the log!' },
    ],
    practice: { question: 'log₂(3) ≈ 1.585. Find log₂(81).', hint: '81 = 3⁴. Use power law: 4 × log₂(3)', answer: 6.34, tolerance: 0.1, explanation: 'log₂(81) = 4 × 1.585 = 6.34. The power pulls down in front!', errorHint: 'log_b(m^n) = n log_b m' },
    interactive: PowerLogInteractive,
  },

  change_base: {
    theoremKey: 'class9.change_base',
    title: "Change of Base Law",
    icon: <Infinity className="w-5 h-5 text-white" />,
    accentGradient: 'from-cyan-500 to-blue-600',
    accentColor: 'bg-cyan-600',
    finalFormula: 'log_a m = \\frac{log_b m}{log_b a}',
    finalFormulaDesc: 'Convert a logarithm from one base to any other base.',
    keyInsight: 'This is THE most practical log law because it lets you compute ANY log with just the log₁₀ or ln button on your calculator!',
    steps: [
      { label: 'Set up the equation', formula: 'log_b m = x', detail: '📱 You\'re programming a calculator that only has log₁₀ (common log) and ln (natural log) buttons, but you need to compute log₂(8). This is the classic problem the Change of Base Law solves.' },
      { label: 'Convert to exponentials', formula: 'm = b^x \⇒ log_a m = log_a(b^x)', detail: 'Convert: m = b^x. We want to express this in terms of a known base a. Taking log_a of both sides: log_a m = log_a(b^x). Now we can use the Power Law in reverse!' },
      { label: 'Apply the Power Law', formula: 'log_a m = x \· log_a b \⇒ x = \{log_a m}{log_a b}', detail: 'log_a m = x · log_a b. The exponent x "pulls down" in front. Now isolate x: x = log_a m / log_a b.' },
      { label: 'Substitute back', formula: 'log_b m = \{log_a m}{log_a b}', detail: 'Since x = log_b m, we get: log_b m = log_a m / log_a b. So log₂(8) = log₁₀(8) / log₁₀(2) = 0.9031 / 0.3010 = 3. Indeed, 2³ = 8.' },
    ],
    practice: { question: 'log₁₀(100) = 2. Find log₂(100) using change of base.', hint: 'log₂(100) = log₁₀(100) / log₁₀(2)', answer: 6.64, tolerance: 0.5, explanation: 'log₂(100) ≈ 6.64. This formula lets you compute any log with common logs!', errorHint: 'log_b m = log_a m / log_a b' },
    interactive: ChangeBaseInteractive,
  },

  union_associative: {
    theoremKey: 'class9.union_associative',
    title: "Associative Property of Union",
    icon: <PieChart className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-fuchsia-600',
    accentColor: 'bg-indigo-600',
    finalFormula: '(A \\cup B) \\cup C = A \\cup (B \\cup C)',
    finalFormulaDesc: 'The union operation is associative — grouping doesn\'t matter.',
    keyInsight: 'The school fair analogy: three groups (food stall, games, raffle). The total combined team is the same no matter how you group them — union is just "is in at least one of these sets."',
    steps: [
      { label: 'Let x be an element', formula: 'x \\in (A \\cup B) \\cup C', detail: '🏟️ Imagine three groups of students at a school fair: Group A runs the food stall, Group B runs games, and Group C runs the raffle. Let x be any student. If x is in (A ∪ B) ∪ C, then...' },
      { label: 'Apply union definition', formula: 'x \\in A \\cup B \{ OR } x \\in C', detail: 'x ∈ (A ∪ B) ∪ C means x ∈ (A ∪ B) OR x ∈ C. And x ∈ (A ∪ B) means x ∈ A OR x ∈ B. So overall: (x ∈ A OR x ∈ B) OR x ∈ C.' },
      { label: 'Re-group the ORs', formula: '(x \\in A \{ OR } x \\in B) \{ OR } x \\in C = x \\in A \{ OR } (x \\in B \{ OR } x \\in C)', detail: 'The logical OR is associative — (P OR Q) OR R = P OR (Q OR R). So (x ∈ A OR x ∈ B) OR x ∈ C = x ∈ A OR (x ∈ B OR x ∈ C). The school fair doesn\'t care how you group the teams!' },
      { label: 'Convert back to sets', formula: '(A \\cup B) \\cup C = A \\cup (B \\cup C)', detail: 'x ∈ A OR (x ∈ B OR x ∈ C) means x ∈ A OR x ∈ (B ∪ C), which means x ∈ A ∪ (B ∪ C). The reverse containment proves equality. Thus (A ∪ B) ∪ C = A ∪ (B ∪ C). Grouping doesn\'t matter!' },
    ],
    practice: { question: 'A={1,2}, B={2,3}, C={3,4}. Elements in (A∪B)∪C?', hint: 'A∪B = {1,2,3}. Then ∪C = {1,2,3,4}', answer: 4, tolerance: 0.1, explanation: '(A∪B)∪C = {1,2,3,4} = A∪(B∪C). Same 4 elements!', errorHint: '(A∪B)∪C = A∪(B∪C)' },
    interactive: UnionAssociativeInteractive,
  },

  intersection_associative: {
    theoremKey: 'class9.intersection_associative',
    title: "Associative Property of Intersection",
    icon: <PieChart className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-purple-600',
    accentColor: 'bg-indigo-600',
    finalFormula: '(A \\cap B) \\cap C = A \\cap (B \\cap C)',
    finalFormulaDesc: 'The intersection operation is also associative.',
    keyInsight: 'A student in Art Club, Music Club, AND Drama Club — being in all three doesn\'t depend on how you group the clubs. Intersection is just "is in ALL of these sets."',
    steps: [
      { label: 'Let y be an element', formula: 'y \\in (A \\cap B) \\cap C', detail: '🎭 Three clubs at school: Art Club A, Music Club B, and Drama Club C. A triple threat student does all three. Let y ∈ (A ∩ B) ∩ C.' },
      { label: 'Apply intersection definition', formula: 'y \\in A \\cap B \{ AND } y \\in C', detail: 'y ∈ (A ∩ B) ∩ C means y ∈ (A ∩ B) AND y ∈ C. And y ∈ (A ∩ B) means y ∈ A AND y ∈ B. So: (y ∈ A AND y ∈ B) AND y ∈ C.' },
      { label: 'Re-group the ANDs', formula: '(y \\in A \{ AND } y \\in B) \{ AND } y \\in C = y \\in A \{ AND } (y \\in B \{ AND } y \\in C)', detail: 'Logical AND is associative: (P AND Q) AND R = P AND (Q AND R). So (y ∈ A AND y ∈ B) AND y ∈ C = y ∈ A AND (y ∈ B AND y ∈ C).' },
      { label: 'Convert back to sets', formula: '(A \\cap B) \\cap C = A \\cap (B \\cap C)', detail: 'y ∈ A AND (y ∈ B AND y ∈ C) means y ∈ A AND y ∈ (B ∩ C), which means y ∈ A ∩ (B ∩ C). Reverse containment proves equality. Just like union, intersection is associative!' },
    ],
    practice: { question: 'A={1,2,3}, B={2,3,4}, C={3,4,5}. Elements in (A∩B)∩C?', hint: 'A∩B = {2,3}. Then ∩C = {3}', answer: 1, tolerance: 0.1, explanation: '(A∩B)∩C = {3} = A∩(B∩C). Same single element!', errorHint: '(A∩B)∩C = A∩(B∩C)' },
    interactive: IntersectionAssociativeInteractive,
  },

  distributive_union_inter: {
    theoremKey: 'class9.distributive_union_inter',
    title: "Distributive: Union over Intersection",
    icon: <PieChart className="w-5 h-5 text-white" />,
    accentGradient: 'from-sky-500 to-blue-600',
    accentColor: 'bg-sky-600',
    finalFormula: 'A \\cup (B \\cap C) = (A \\cup B) \\cap (A \\cup C)',
    finalFormulaDesc: 'Union distributes over intersection, like multiplication over addition.',
    keyInsight: 'Just like 2×(3+4) = 2×3 + 2×4 in arithmetic, set union distributes over intersection — it\'s the same distributive law!',
    steps: [
      { label: 'Let x ∈ A ∪ (B ∩ C)', formula: 'x \\in A \{ OR } x \\in (B \\cap C)', detail: '🧩 Think of a school prize: winners get a free period (A) OR they get both extra recess AND homework pass (B ∩ C).' },
      { label: 'Break down the OR', formula: 'x \\in A \{ OR } (x \\in B \{ AND } x \\in C)', detail: 'x ∈ A OR x ∈ (B ∩ C). That means either x ∈ A, OR (x ∈ B AND x ∈ C).' },
      { label: 'Use logical distribution', formula: '(x \\in A \{ OR } x \\in B) \{ AND } (x \\in A \{ OR } x \\in C)', detail: '(P OR Q) AND (P OR R) is logically equivalent to P OR (Q AND R). So: (x ∈ A OR x ∈ B) AND (x ∈ A OR x ∈ C).' },
      { label: 'Convert back to sets', formula: 'A \\cup (B \\cap C) = (A \\cup B) \\cap (A \\cup C)', detail: '(x ∈ A ∪ B) AND (x ∈ A ∪ C) means x ∈ (A ∪ B) ∩ (A ∪ C). So A ∪ (B ∩ C) ⊆ (A ∪ B) ∩ (A ∪ C). The reverse containment also holds. Just like 2×(3+4) = 2×3 + 2×4!' },
    ],
    practice: { question: 'A={1,2}, B={2,3}, C={3,4}. Elements in A∪(B∩C)?', hint: 'B∩C = {3}. A∪{3} = {1,2,3}', answer: 3, tolerance: 0.1, explanation: 'A∪(B∩C) = {1,2,3}. Same result from (A∪B)∩(A∪C) = {1,2,3}∩{1,2,4} = {1,2}', errorHint: 'Are you sure?' },
    interactive: DistributeUnionInterInteractive,
  },

  distributive_inter_union: {
    theoremKey: 'class9.distributive_inter_union',
    title: "Distributive: Intersection over Union",
    icon: <PieChart className="w-5 h-5 text-white" />,
    accentGradient: 'from-sky-500 to-indigo-600',
    accentColor: 'bg-sky-600',
    finalFormula: 'A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C)',
    finalFormulaDesc: 'Intersection also distributes over union.',
    keyInsight: 'School library rule: you need a library card (A) AND (either a valid ID OR a teacher note). This is the same as (card AND ID) OR (card AND note).',
    steps: [
      { label: 'Let x ∈ A ∩ (B ∪ C)', formula: 'x \\in A \{ AND } x \\in (B \\cup C)', detail: '🏫 School library rule: you need a library card (A) AND (either a valid ID OR a teacher note) (B ∪ C).' },
      { label: 'Break down the AND', formula: 'x \\in A \{ AND } (x \\in B \{ OR } x \\in C)', detail: 'x ∈ A AND x ∈ (B ∪ C). That means x ∈ A AND (x ∈ B OR x ∈ C).' },
      { label: 'Use logical distribution', formula: '(x \\in A \{ AND } x \\in B) \{ OR } (x \\in A \{ AND } x \\in C)', detail: 'P AND (Q OR R) = (P AND Q) OR (P AND R). So: (x ∈ A AND x ∈ B) OR (x ∈ A AND x ∈ C).' },
      { label: 'Convert back to sets', formula: 'A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C)', detail: 'x ∈ (A ∩ B) OR x ∈ (A ∩ C) means x ∈ (A ∩ B) ∪ (A ∩ C). So A ∩ (B ∪ C) ⊆ (A ∩ B) ∪ (A ∩ C). The reverse direction similarly proves equality.' },
    ],
    practice: { question: 'A={1,2}, B={2,3}, C={3,4}. Elements in A∩(B∪C)?', hint: 'B∪C = {2,3,4}. A∩{2,3,4} = {2}', answer: 1, tolerance: 0.1, explanation: 'A∩(B∪C) = {2}. Same as (A∩B)∪(A∩C) = {2}∪∅ = {2}', errorHint: 'A∩(B∪C) = (A∩B)∪(A∩C)' },
    interactive: DistributeInterUnionInteractive,
  },

  quotient_identities: {
    theoremKey: 'class9.quotient_identities',
    title: "Quotient Trigonometric Identities",
    icon: <Move3d className="w-5 h-5 text-white" />,
    accentGradient: 'from-yellow-500 to-amber-600',
    accentColor: 'bg-yellow-600',
    finalFormula: 'tan theta = \\frac{sin theta}{cos theta}, \\quad \\cot theta = \\frac{cos theta}{sin theta}',
    finalFormulaDesc: 'Tangent is sine divided by cosine; cotangent is the reciprocal.',
    keyInsight: 'On a unit circle, the tangent at angle θ is the y-coordinate divided by the x-coordinate — the slope of the radius line!',
    steps: [
      { label: 'Consider a right triangle', formula: 'sin theta = \{a}{c}, cos theta = \{b}{c}, tan theta = \{a}{b}', detail: '🔺 You\'re standing at the base of a building, looking up at the top. The angle of elevation is θ. sin θ = opposite/hypotenuse = a/c. cos θ = adjacent/hypotenuse = b/c. tan θ = opposite/adjacent = a/b.' },
      { label: 'Divide sin by cos', formula: '\{sin theta}{cos theta} = \{a/c}{b/c} = \{a}{b} = tan theta', detail: 'sin θ / cos θ = (a/c) / (b/c) = (a/c) × (c/b) = a/b. The hypotenuse (c) cancels out! And a/b is exactly tan θ.' },
      { label: 'Similarly for cotangent', formula: '\{cos theta}{sin theta} = \{b/c}{a/c} = \{b}{a} = \\cot theta', detail: 'Similarly, cos θ / sin θ = b/a = cot θ. These are the Quotient Identities. They connect the primary ratios (sin, cos) to the secondary ones (tan, cot).' },
    ],
    practice: { question: 'sin(30°) = 0.5, cos(30°) ≈ 0.866. Find tan(30°).', hint: 'tan(30°) = sin(30°)/cos(30°) = 0.5/0.866', answer: 0.577, tolerance: 0.05, explanation: 'tan(30°) = 0.577. Matches sin/cos perfectly!', errorHint: 'tan θ = sin θ / cos θ' },
    interactive: QuotientIdentityInteractive,
  },

  pythagorean_identities: {
    theoremKey: 'class9.pythagorean_identities',
    title: "Pythagorean Trigonometric Identities",
    icon: <Move3d className="w-5 h-5 text-white" />,
    accentGradient: 'from-emerald-500 to-teal-600',
    accentColor: 'bg-emerald-600',
    finalFormula: 'sin^2 theta + cos^2 theta = 1',
    finalFormulaDesc: 'The Pythagorean Theorem restated in trigonometric form.',
    keyInsight: 'From this one identity, we can derive: sec²θ − tan²θ = 1 and cosec²θ − cot²θ = 1. These are used in everything from signal processing to orbital mechanics!',
    steps: [
      { label: 'Start with the Pythagorean Theorem', formula: 'a^2 + b^2 = c^2', detail: '📐 In any right triangle with legs a, b and hypotenuse c: a² + b² = c². This is the most famous relationship in all of geometry.' },
      { label: 'Express in trig terms', formula: 'sin^2 theta = \{a^2}{c^2}, cos^2 theta = \{b^2}{c^2}', detail: 'sin θ = a/c and cos θ = b/c. Square both: sin²θ = a²/c² and cos²θ = b²/c².' },
      { label: 'Add the squares', formula: 'sin^2 theta + cos^2 theta = \{a^2}{c^2} + \{b^2}{c^2} = \{c^2}{c^2} = 1', detail: 'sin²θ + cos²θ = a²/c² + b²/c² = (a² + b²)/c² = c²/c² = 1. The triangle\'s legs and hypotenuse cancel out perfectly!' },
      { label: 'The identity is born', formula: 'sin^2 theta + cos^2 theta = 1', detail: 'sin²θ + cos²θ = 1 — it doesn\'t matter what θ is, this always holds true! From this, we can derive: sec²θ − tan²θ = 1 and cosec²θ − cot²θ = 1.' },
    ],
    practice: { question: 'sin(30°) = 0.5. Find sin²(30°) + cos²(30°).', hint: 'cos(30°) = 0.866. Compute 0.25 + 0.75', answer: 1, tolerance: 0.01, explanation: 'sin²(30°) + cos²(30°) = 1. Always 1, no matter the angle!', errorHint: 'sin²θ + cos²θ = 1 always!' },
    interactive: PythagoreanIdentityInteractive,
  },

  distance_formula: {
    theoremKey: 'class9.distance_formula',
    title: "The Distance Formula",
    icon: <Ruler className="w-5 h-5 text-white" />,
    accentGradient: 'from-violet-500 to-indigo-600',
    accentColor: 'bg-violet-600',
    finalFormula: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}',
    finalFormulaDesc: 'Calculate the distance between any two points on a coordinate plane.',
    keyInsight: 'This formula is the GPS backbone: your phone calculates distance between satellites and your position using this exact formula in 3D!',
    steps: [
      { label: 'Plot two points', formula: 'P_1(x_1, y_1), P_2(x_2, y_2)', detail: '🗺️ You\'re a city planner. Point P₁(1, 2) is the library and P₂(7, 6) is the hospital. You need the straight-line distance between them to plan a new road.' },
      { label: 'Draw perpendiculars', formula: 'Delta x = x_2 - x_1, Delta y = y_2 - y_1', detail: 'Draw lines from P₁ and P₂ to the x-axis. These create a right triangle. The horizontal leg runs from x₁ to x₂, and the vertical leg from y₁ to y₂.' },
      { label: 'Apply Pythagoras', formula: 'd^2 = (Delta x)^2 + (Delta y)^2', detail: 'd² = (Δx)² + (Δy)² → d = √((x₂−x₁)² + (y₂−y₁)²) = √(6² + 4²) = √(36 + 16) = √52 ≈ 7.21 units.' },
      { label: 'Final formula', formula: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}', detail: 'This formula is the GPS backbone: your phone calculates distance between satellites and your position using this exact formula in 3D!' },
    ],
    practice: { question: 'P₁(0,0), P₂(3,4). Find the distance.', hint: 'd = √(3² + 4²) = √(9+16)', answer: 5, tolerance: 0.1, explanation: 'd = √(9+16) = √25 = 5. The classic 3-4-5 triangle!', errorHint: 'd = √((x₂−x₁)² + (y₂−y₁)²)' },
    interactive: DistanceFormulaInteractive,
  },

  slope_intercept: {
    theoremKey: 'class9.slope_intercept',
    title: "Slope-Intercept Form",
    icon: <Target className="w-5 h-5 text-white" />,
    accentGradient: 'from-amber-500 to-yellow-600',
    accentColor: 'bg-amber-600',
    finalFormula: 'y = mx + c',
    finalFormulaDesc: 'Equation of a straight line with slope m and y-intercept c.',
    keyInsight: 'In business, this models linear cost functions: Total Cost = Variable Cost × Units + Fixed Cost. The slope is the cost per unit!',
    steps: [
      { label: 'Identify slope and intercept', formula: 'm = \{slope}, c = y\{-intercept}', detail: '📈 You\'re tracking your savings. You start with $100 (y-intercept c = 1 on a scaled graph) and save $2 per week (slope m = 2). The line shows your total savings over time.' },
      { label: 'Pick a general point', formula: 'P(x, y), A(0, c)', detail: 'Let P(x, y) be any point on the line. The point where the line crosses the y-axis is A(0, c) — your starting savings at week 0.' },
      { label: 'Calculate slope', formula: "m = \\frac{y - c}{x - 0} = \\frac{y - c}{x}", detail: 'Slope m = (y − c) / (x − 0) = (y − c) / x. This means the rise over run from A to P equals the constant slope of the line.' },
      { label: 'Rearrange for y', formula: "y = mx + c", detail: 'm = (y − c)/x → y − c = mx → y = mx + c. That\'s it! All straight lines can be written this way.' },
    ],
    practice: { question: 'A line has slope m = 3 and intercept c = 2. What is y when x = 4?', hint: 'y = 3×4 + 2 = 12 + 2', answer: 14, tolerance: 0.1, explanation: 'y = 14. Using y = mx + c.', errorHint: 'y = mx + c' },
    interactive: SlopeInterceptInteractive,
  },

  point_slope: {
    theoremKey: 'class9.point_slope',
    title: "Point-Slope Form",
    icon: <Target className="w-5 h-5 text-white" />,
    accentGradient: 'from-blue-500 to-indigo-600',
    accentColor: 'bg-blue-600',
    finalFormula: 'y - y_1 = m(x - x_1)',
    finalFormulaDesc: 'Equation of a line through a point with a given slope.',
    keyInsight: 'This is incredibly useful in calculus, physics, and engineering when you know one point and the rate of change (slope).',
    steps: [
      { label: 'The problem', formula: '\{Point } (x_1, y_1), \{ slope } m', detail: '📍 You know a line passes through the point (2, 3) and has slope m = 1.5. You need the equation of the line to graph it on your digital map.' },
      { label: 'Use slope formula', formula: 'm = \{y - y_1}{x - x_1}', detail: 'Let P(x, y) be any point on the line. With B(x₁, y₁) = (2, 3), the slope m = (y − y₁)/(x − x₁).' },
      { label: 'Cross-multiply', formula: 'm(x - x_1) = y - y_1', detail: 'm(x − x₁) = y − y₁. This equation says "for any point on the line, the slope from (x₁, y₁) to (x, y) is always m."' },
      { label: 'The result', formula: 'y - y_1 = m(x - x_1)', detail: 'y − y₁ = m(x − x₁). For our example: y − 3 = 1.5(x − 2) → y = 1.5x.' },
    ],
    practice: { question: 'Line through (1,2) with slope m = 4. Find y when x = 3.', hint: 'y − 2 = 4(3−1). So y = 2+8', answer: 10, tolerance: 0.1, explanation: 'y = 10. Using y−y₁ = m(x−x₁).', errorHint: 'y − y₁ = m(x − x₁)' },
    interactive: PointSlopeInteractive,
  },

  two_point_form: {
    theoremKey: 'class9.two_point_form',
    title: "Two-Point Form",
    icon: <Target className="w-5 h-5 text-white" />,
    accentGradient: 'from-pink-500 to-rose-600',
    accentColor: 'bg-pink-600',
    finalFormula: 'y - y_1 = \\frac{y_2 - y_1}{x_2 - x_1}(x - x_1)',
    finalFormulaDesc: 'Equation of a line through two given points.',
    keyInsight: 'Surveyors use this formula to map boundaries between measured points — the line connecting two measured coordinates!',
    steps: [
      { label: 'Two points define a line', formula: 'A(x_1, y_1), B(x_2, y_2)', detail: '🔗 You have two points A(1, 2) and B(4, 8). Only one straight line passes through both — the shortest path between them.' },
      { label: 'Find the slope', formula: 'm = \{y_2 - y_1}{x_2 - x_1} = \{8 - 2}{4 - 1} = 2', detail: 'Slope m = (y₂ − y₁)/(x₂ − x₁) = (8 − 2)/(4 − 1) = 6/3 = 2. This line rises 2 units for every 1 unit horizontally.' },
      { label: 'Apply Point-Slope Form', formula: 'y - y_1 = m(x - x_1)', detail: 'Now that we have m = 2, use the Point-Slope Form with either point: y − y₁ = m(x − x₁) → y − 2 = 2(x − 1).' },
      { label: 'The formula', formula: 'y - y_1 = \{y_2 - y_1}{x_2 - x_1}(x - x_1)', detail: 'Substituting the slope formula directly gives: y − y₁ = ((y₂−y₁)/(x₂−x₁))(x − x₁). This is the Two-Point Form.' },
    ],
    practice: { question: 'Line through (0,0) and (2,6). Find y when x = 5.', hint: 'Slope = 6/2 = 3. y − 0 = 3(5−0)', answer: 15, tolerance: 0.1, explanation: 'y = 15. Using the two-point form.', errorHint: 'y − y₁ = ((y₂−y₁)/(x₂−x₁))(x − x₁)' },
    interactive: TwoPointFormInteractive,
  },

  two_intercept_form: {
    theoremKey: 'class9.two_intercept_form',
    title: "Two-Intercept Form",
    icon: <Target className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-indigo-600',
    accentColor: 'bg-indigo-600',
    finalFormula: '\\frac{x}{a} + \\frac{y}{b} = 1',
    finalFormulaDesc: 'Equation of a line using its x-intercept a and y-intercept b.',
    keyInsight: 'Economists use this to graph budget constraints: if you spend $a on food and $b on housing, x/a + y/b = 1 shows all possible spending combinations!',
    steps: [
      { label: 'Identify intercepts', formula: 'x\{-intercept } = a, y\{-intercept } = b', detail: '🎯 A line crosses the x-axis at x = 4 (the x-intercept a = 4) and the y-axis at y = 3 (the y-intercept b = 3).' },
      { label: 'Find the slope', formula: 'm = \{b - 0}{0 - a} = -\{b}{a} = -\{3}{4}', detail: 'Slope m = (b − 0)/(0 − a) = b/(−a) = −b/a = −3/4. The line goes down 3 for every 4 right.' },
      { label: 'Use Point-Slope', formula: '\{x}{a} + \{y}{b} = 1', detail: 'Using point (0, b): y − b = (−b/a)x → ay − ab = −bx → bx + ay = ab.' },
      { label: 'Divide by ab', formula: '\{x}{a} + \{y}{b} = 1', detail: '(bx)/(ab) + (ay)/(ab) = 1 → x/a + y/b = 1. This elegant form shows the intercepts directly.' },
    ],
    practice: { question: 'x-intercept = 6, y-intercept = 3. Find y when x = 2.', hint: '2/6 + y/3 = 1. So y/3 = 1 − 1/3 = 2/3', answer: 2, tolerance: 0.1, explanation: 'y = 2. Using x/a + y/b = 1.', errorHint: 'x/a + y/b = 1' },
    interactive: TwoInterceptInteractive,
  },

  normal_form: {
    theoremKey: 'class9.normal_form',
    title: "Normal Form of a Line",
    icon: <Target className="w-5 h-5 text-white" />,
    accentGradient: 'from-orange-500 to-red-600',
    accentColor: 'bg-orange-600',
    finalFormula: 'x cos alpha + y sin alpha = p',
    finalFormulaDesc: 'Equation using perpendicular distance p from origin and inclination α.',
    keyInsight: 'This is particularly useful in physics and engineering for finding distances from a point to a line, and for describing wave fronts in optics.',
    steps: [
      { label: 'Define the normal', formula: 'OC = p, \angle COA = alpha', detail: '🧭 Imagine a line L and a perpendicular from the origin O to L meeting at point C. The distance OC = p, and the angle this perpendicular makes with the x-axis is α.' },
      { label: 'Find intercepts', formula: 'x\{-intercept} = \{p}{cos alpha}, y\{-intercept} = \{p}{sin alpha}', detail: 'From right triangle OCA: cos α = p/OA → OA = p/cos α (x-intercept). From triangle OCB: sin α = p/OB → OB = p/sin α (y-intercept).' },
      { label: 'Apply Two-Intercept Form', formula: '\{x}{p/cos alpha} + \{y}{p/sin alpha} = 1', detail: 'Using x/a + y/b = 1: x/(p/cos α) + y/(p/sin α) = 1 → (x cos α)/p + (y sin α)/p = 1.' },
      { label: 'Multiply by p', formula: 'x cos alpha + y sin alpha = p', detail: 'x cos α + y sin α = p. The Normal Form! This is particularly useful in physics and engineering for finding distances from a point to a line.' },
    ],
    practice: { question: 'α = 60°, p = 5. Find cos α and evaluate x cos α + y sin α at x=2, y=3.', hint: 'cos 60° = 0.5, sin 60° = 0.866. LHS = 2×0.5+3×0.866', answer: 5, tolerance: 0.3, explanation: '2×0.5 + 3×0.866 = 1 + 2.598 = 3.598 ≠ 5. Point (2,3) is not on this line!', errorHint: 'x cos α + y sin α = p' },
    interactive: NormalFormInteractive,
  },

  angle_between_lines: {
    theoremKey: 'class9.angle_between_lines',
    title: "Angle Between Two Lines",
    icon: <Target className="w-5 h-5 text-white" />,
    accentGradient: 'from-rose-500 to-red-600',
    accentColor: 'bg-rose-600',
    finalFormula: 'tan theta = \\left|\\frac{m_2 - m_1}{1 + m_1 m_2}\\right|',
    finalFormulaDesc: 'Find the acute angle between two intersecting lines from their slopes.',
    keyInsight: 'Road engineers use this to design safe intersection angles — a 90° crossing is safest because it maximizes visibility in all directions!',
    steps: [
      { label: 'Lines and inclinations', formula: 'tan alpha = m_1, tan beta = m_2', detail: '🔄 Two roads cross at an intersection. One has a gentle slope m₁ = 0.5 (gentle hill), the other is steeper m₂ = 2.' },
      { label: 'Exterior angle theorem', formula: 'alpha = beta + theta', detail: 'When these lines cross, they form a triangle with the x-axis. The exterior angle of this triangle equals the sum of the two opposite interior angles: α = β + θ.' },
      { label: 'Apply tan to both sides', formula: 'tan theta = tan(alpha - beta) = \{tan alpha - tan beta}{1 + tan alpha tan beta}', detail: 'θ = α − β. Take tan of both sides: tan θ = tan(α − β). Using the tangent subtraction formula: tan(α−β) = (tan α − tan β)/(1 + tan α × tan β).' },
      { label: 'Substitute slopes', formula: 'tan theta = \|\{m_2 - m_1}{1 + m_1 m_2}\|', detail: 'Since tan α = m₂ and tan β = m₁: tan θ = (m₂ − m₁)/(1 + m₁m₂). Take absolute value for the acute angle. If tan θ = 0, lines are parallel. If 1 + m₁m₂ = 0, lines are perpendicular!' },
    ],
    practice: { question: 'm₁ = 1, m₂ = 2. Find the acute angle between them.', hint: 'tan θ = |(2−1)/(1+2)| = |1/3| = 0.333', answer: 18.43, tolerance: 1, explanation: 'θ = 18.4°. The lines are 18.4° apart.', errorHint: 'tan θ = |(m₂−m₁)/(1+m₁m₂)|' },
    interactive: AngleBetweenLinesInteractive,
  },
};
