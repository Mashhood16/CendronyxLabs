import { useTranslate } from '../../i18n';
import { CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import type { TheoremConfig } from '../../components/generic/GenericTheoremLab';
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
      <p className="text-xs text-teal-700 dark:text-teal-300 font-mono">{t("log")}<sub>{b}</sub>({m}) = {logM.toFixed(4)}<br />{t("log")}<sub>{b}</sub>({n}) = {logN.toFixed(4)}<br />{t("log")}<sub>{b}</sub>({m} Ã— {n}{t(") = log")}<sub>{b}</sub>({m * n}) = <strong>{logMN.toFixed(4)}</strong><br />{t("Sum:")} <strong>{(logM + logN).toFixed(4)}</strong> {t("= log")}<sub>{b}</sub>({m * n}) âœ“</p>
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
      <p className="text-xs text-purple-700 dark:text-purple-300 font-mono">{t("log")}<sub>{b}</sub>({m}) = {logM.toFixed(4)}<br />{t("log")}<sub>{b}</sub>({n}) = {logN.toFixed(4)}<br />{t("log")}<sub>{b}</sub>({m}/{n}{t(") = log")}<sub>{b}</sub>({(m/n).toFixed(2)}) = <strong>{logMN.toFixed(4)}</strong><br />{t("Difference:")} <strong>{(logM - logN).toFixed(4)}</strong> {t("= log")}<sub>{b}</sub>({m}/{n}) âœ“</p>
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
      <p className="text-xs text-rose-700 dark:text-rose-300 font-mono">{t("log")}<sub>{b}</sub>({m}) = {logM.toFixed(4)}<br />{t("log")}<sub>{b}</sub>({m}<sup>{n}</sup>{t(") = log")}<sub>{b}</sub>({Math.pow(m, n)}) = <strong>{logMN.toFixed(4)}</strong><br />{t("n Ã— log")}<sub>{b}</sub>{t("(m) =")} {n} Ã— {logM.toFixed(4)} = <strong>{(n * logM).toFixed(4)}</strong> âœ“</p>
    </div>
    <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("log_b(m^n) = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-rose-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition-colors">{t("Check")}</button></div>
    {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {t("Correct! log")}<sub>{b}</sub>({Math.pow(m, n)}) = {logMN.toFixed(4)}</p>}
    {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> {t("Try log_b(m^n) = n Â· log_b m")}</p>}
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
      <p className="text-xs text-cyan-700 dark:text-cyan-300 font-mono">{t("log")}<sub>{b}</sub>({m}) = <strong>{logBaseB.toFixed(4)}</strong><br />{t("Using base 2: logâ‚‚(")}{m}{t(") / logâ‚‚(")}{b}) = {logBase2.toFixed(4)} / {(Math.log(b)/Math.log(2)).toFixed(4)} = <strong>{logBaseB.toFixed(4)}</strong> âœ“<br />{t("Using ln: ln(")}{m}{t(") / ln(")}{b}) = {logBaseE.toFixed(4)} / {Math.log(b).toFixed(4)} = <strong>{logBaseB.toFixed(4)}</strong> âœ“</p>
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
      <div><label className="text-xs font-semibold text-slate-600">{t("|Aâˆ©B|")}</label><input type="range" min="0" max={a} step="1" value={intersect} onChange={e => setIntersect(parseFloat(e.target.value))} className="w-full accent-rose-500" /><span className="text-xs font-mono">{intersect}</span></div>
    </div>
    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800"><p className="text-xs text-indigo-700 dark:text-indigo-300 font-mono">{t("(A âˆª B) âˆª C = A âˆª (B âˆª C) =")} <strong>{aUbUc}</strong> âœ“</p></div>
    <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("|A âˆª B âˆª C| = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-indigo-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors">{t("Check")}</button></div>
    {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! (AâˆªB)âˆªC = Aâˆª(BâˆªC) =")} {aUbUc}</p>}
    {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("How many unique elements total?")}</p>}
  </div>);
}

function IntersectionAssociativeInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [a, setA] = useState(5); const [b, setB] = useState(4); const [c, setC] = useState(3);
  const handleCheck = () => { /* Just shows the concept visually */ };
  return (<div className="space-y-4">
    <div className="grid grid-cols-3 gap-3">
      <div><label className="text-xs font-semibold">{t("Set A")}</label><input type="range" min="2" max="8" step="1" value={a} onChange={e => setA(parseFloat(e.target.value))} className="w-full accent-indigo-500" /><span className="text-xs">{'â™¥'.repeat(a)}</span></div>
      <div><label className="text-xs font-semibold">{t("Set B")}</label><input type="range" min="2" max="8" step="1" value={b} onChange={e => setB(parseFloat(e.target.value))} className="w-full accent-emerald-500" /><span className="text-xs">{'â™¦'.repeat(b)}</span></div>
      <div><label className="text-xs font-semibold">{t("Set C")}</label><input type="range" min="2" max="8" step="1" value={c} onChange={e => setC(parseFloat(e.target.value))} className="w-full accent-amber-500" /><span className="text-xs">{'â™£'.repeat(c)}</span></div>
    </div>
    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
      <p className="text-xs text-indigo-700 dark:text-indigo-300"><strong>{t("Theorem:")}</strong> {t("(A âˆ© B) âˆ© C = A âˆ© (B âˆ© C)")}<br /><span className="italic mt-1 block">{t("Logical AND is associative â€” just like (P AND Q) AND R = P AND (Q AND R). Grouping doesn't change which elements are in all three sets.")}</span></p>
    </div>
  </div>);
}

function DistributeUnionInterInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [aSize, setASize] = useState(5); const [bSize, setBSize] = useState(4); const [cSize, setCSize] = useState(3);
  return (<div className="space-y-4">
    <div className="grid grid-cols-3 gap-3">
      <div><label className="text-xs font-semibold">{t("Set A")}</label><input type="range" min="2" max="8" step="1" value={aSize} onChange={e => setASize(parseFloat(e.target.value))} className="w-full accent-sky-500" /><span className="text-xs">{'â™¥'.repeat(aSize)}</span></div>
      <div><label className="text-xs font-semibold">{t("Set B")}</label><input type="range" min="2" max="8" step="1" value={bSize} onChange={e => setBSize(parseFloat(e.target.value))} className="w-full accent-emerald-500" /><span className="text-xs">{'â™¦'.repeat(bSize)}</span></div>
      <div><label className="text-xs font-semibold">{t("Set C")}</label><input type="range" min="2" max="8" step="1" value={cSize} onChange={e => setCSize(parseFloat(e.target.value))} className="w-full accent-amber-500" /><span className="text-xs">{'â™£'.repeat(cSize)}</span></div>
    </div>
    <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-3 border border-sky-200 dark:border-sky-800">
      <p className="text-xs text-sky-700 dark:text-sky-300"><strong>{t("Theorem:")}</strong> {t("A âˆª (B âˆ© C) = (A âˆª B) âˆ© (A âˆª C)")}<br /><span className="italic mt-1 block">{t("An element is in A âˆª (B âˆ© C) if it's in A, or it's in both B AND C. This is logically equivalent to being in (A âˆª B) AND (A âˆª C).")}</span></p>
    </div>
  </div>);
}

function DistributeInterUnionInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [aSize, setASize] = useState(5); const [bSize, setBSize] = useState(4); const [cSize, setCSize] = useState(3);
  return (<div className="space-y-4">
    <div className="grid grid-cols-3 gap-3">
      <div><label className="text-xs font-semibold">{t("Set A")}</label><input type="range" min="2" max="8" step="1" value={aSize} onChange={e => setASize(parseFloat(e.target.value))} className="w-full accent-sky-500" /><span className="text-xs">{'â™¥'.repeat(aSize)}</span></div>
      <div><label className="text-xs font-semibold">{t("Set B")}</label><input type="range" min="2" max="8" step="1" value={bSize} onChange={e => setBSize(parseFloat(e.target.value))} className="w-full accent-emerald-500" /><span className="text-xs">{'â™¦'.repeat(bSize)}</span></div>
      <div><label className="text-xs font-semibold">{t("Set C")}</label><input type="range" min="2" max="8" step="1" value={cSize} onChange={e => setCSize(parseFloat(e.target.value))} className="w-full accent-amber-500" /><span className="text-xs">{'â™£'.repeat(cSize)}</span></div>
    </div>
    <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-3 border border-sky-200 dark:border-sky-800">
      <p className="text-xs text-sky-700 dark:text-sky-300"><strong>{t("Theorem:")}</strong> {t("A âˆ© (B âˆª C) = (A âˆ© B) âˆª (A âˆ© C)")}<br /><span className="italic mt-1 block">{t("An element is in A âˆ© (B âˆª C) if it's in A AND (in B OR C). This distributes to (Aâˆ©B) OR (Aâˆ©C) â€” just like the distributive law in algebra!")}</span></p>
    </div>
  </div>);
}

function QuotientIdentityInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [angle, setAngle] = useState(30); const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const rad = angle * Math.PI / 180; const sinVal = Math.sin(rad); const cosVal = Math.cos(rad); const tanVal = Math.tan(rad); const sinDivCos = sinVal / cosVal;
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - tanVal) < 0.01 ? 'correct' : 'incorrect'); if (Math.abs(val - tanVal) < 0.01) onAnswer(true); };
  return (<div className="space-y-4">
    <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("Angle Î¸")}</label><input type="range" min="0" max="89" step="1" value={angle} onChange={e => { setAngle(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-yellow-500" /><span className="text-sm font-mono text-yellow-600">Î¸ = {angle}Â°</span></div>
    <div className="relative h-28 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]"><svg viewBox="0 0 200 120" className="w-full h-full"><polygon points="20,100 180,100 20,20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-500" /><text x="50" y="80" className="text-[10px] fill-slate-500">{t("Opposite")}</text><text x="100" y="112" className="text-[10px] fill-slate-500">{t("Adjacent")}</text><text x="12" y="40" className="text-[10px] fill-slate-500">{t("Hyp")}</text><text x="25" y="108" className="text-[10px] fill-yellow-600">Î¸</text></svg></div>
    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800"><p className="text-xs text-yellow-700 dark:text-yellow-300 font-mono">{t("sin(")}{angle}Â°) = {sinVal.toFixed(4)}<br />{t("cos(")}{angle}Â°) = {cosVal.toFixed(4)}<br />{t("tan(")}{angle}Â°) = {tanVal.toFixed(4)}<br />{t("sin/cos =")} {sinVal.toFixed(4)} / {cosVal.toFixed(4)} = <strong>{sinDivCos.toFixed(4)}</strong> {t("= tan(")}{angle}Â°) âœ“</p></div>
    <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("tan(Î¸) = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-yellow-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-colors">{t("Check")}</button></div>
    {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! tan(Î¸) = sin(Î¸)/cos(Î¸)")}</p>}
    {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try tan Î¸ = sin Î¸ / cos Î¸")}</p>}
  </div>);
}

function PythagoreanIdentityInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [angle, setAngle] = useState(37); const [userAns, setUserAns] = useState(''); const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const rad = angle * Math.PI / 180; const sinVal = Math.sin(rad); const cosVal = Math.cos(rad); const sin2cos2 = sinVal * sinVal + cosVal * cosVal;
  const handleCheck = () => { const val = parseFloat(userAns); if (isNaN(val)) return; setCheckResult(Math.abs(val - sin2cos2) < 0.001 ? 'correct' : 'incorrect'); if (Math.abs(val - sin2cos2) < 0.001) onAnswer(true); };
  return (<div className="space-y-4">
    <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("Angle Î¸")}</label><input type="range" min="0" max="360" step="1" value={angle} onChange={e => { setAngle(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" /><span className="text-sm font-mono text-emerald-600">Î¸ = {angle}Â°</span></div>
    <div className="relative h-28 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]"><svg viewBox="0 0 160 120" className="w-full h-full"><circle cx="80" cy="60" r="45" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-600" /><line x1="80" y1="60" x2={80 + 45 * Math.cos(rad)} y2={60 - 45 * Math.sin(rad)} stroke="#059669" strokeWidth="1.5" /><line x1="80" y1="60" x2={80 + Math.abs(45 * Math.cos(rad))} y2={60} stroke="#3b82f6" strokeWidth="1" /><line x1={80 + 45 * Math.cos(rad)} y1={60} x2={80 + 45 * Math.cos(rad)} y2={60 - 45 * Math.sin(rad)} stroke="#f59e0b" strokeWidth="1" /></svg></div>
    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800"><p className="text-xs text-emerald-700 dark:text-emerald-300 font-mono">{t("sinÂ²(")}{angle}{t("Â°) + cosÂ²(")}{angle}Â°) = ({sinVal.toFixed(4)})Â² + ({cosVal.toFixed(4)})Â²<br />= {(sinVal * sinVal).toFixed(4)} + {(cosVal * cosVal).toFixed(4)} = <strong>{sin2cos2.toFixed(6)}</strong></p></div>
    <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("sinÂ²Î¸ + cosÂ²Î¸ = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-emerald-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors">{t("Check")}</button></div>
    {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! sinÂ²Î¸ + cosÂ²Î¸ = 1 always!")}</p>}
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
      <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("Pâ‚(xâ‚, yâ‚)")}</label><div className="grid grid-cols-2 gap-2"><div><span className="text-[10px]">xâ‚</span><input type="range" min="-10" max="10" step="1" value={x1} onChange={e => { setX1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" /><span className="text-xs">{x1}</span></div><div><span className="text-[10px]">yâ‚</span><input type="range" min="-10" max="10" step="1" value={y1} onChange={e => { setY1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" /><span className="text-xs">{y1}</span></div></div></div>
      <div><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("Pâ‚‚(xâ‚‚, yâ‚‚)")}</label><div className="grid grid-cols-2 gap-2"><div><span className="text-[10px]">xâ‚‚</span><input type="range" min="-10" max="10" step="1" value={x2} onChange={e => { setX2(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-orange-500" /><span className="text-xs">{x2}</span></div><div><span className="text-[10px]">yâ‚‚</span><input type="range" min="-10" max="10" step="1" value={y2} onChange={e => { setY2(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-orange-500" /><span className="text-xs">{y2}</span></div></div></div>
    </div>
    <div className="relative h-28 bg-white dark:bg-[#121212] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]"><svg viewBox="0 0 200 100" className="w-full h-full"><circle cx={100 + x1 * 8} cy={50 - y1 * 8} r="4" fill="#3b82f6" /><text x={100 + x1 * 8 + 5} y={50 - y1 * 8 + 3} className="text-[8px] fill-blue-600">Pâ‚</text><circle cx={100 + x2 * 8} cy={50 - y2 * 8} r="4" fill="#f97316" /><text x={100 + x2 * 8 + 5} y={50 - y2 * 8 + 3} className="text-[8px] fill-orange-600">Pâ‚‚</text><line x1={100 + x1 * 8} y1={50 - y1 * 8} x2={100 + x2 * 8} y2={50 - y2 * 8} stroke="#8b5cf6" strokeWidth="1.5" /></svg></div>
    <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3 border border-violet-200 dark:border-violet-800"><p className="text-xs text-violet-700 dark:text-violet-300 font-mono">{t("d = âˆš((")}{x2} âˆ’ {x1})Â² + ({y2} âˆ’ {y1})Â²) = âˆš({dx}Â² + {dy}Â²) = âˆš{dx*dx + dy*dy} = <strong>{distance.toFixed(2)}</strong></p></div>
    <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("Distance = ?")} step="0.1" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-violet-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors">{t("Check")}</button></div>
    {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! d =")} {distance.toFixed(2)}</p>}
    {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try d = âˆš((xâ‚‚-xâ‚)Â² + (yâ‚‚-yâ‚)Â²)")}</p>}
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
    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800"><p className="text-xs text-amber-700 dark:text-amber-300 font-mono">{t("y = mx + c =")} {m} Ã— {xVal} + {c} = <strong>{yResult}</strong></p></div>
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
      <div><label className="text-[10px] font-semibold">xâ‚</label><input type="range" min="-5" max="5" step="1" value={x1} onChange={e => { setX1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" /><span className="text-xs">{x1}</span></div>
      <div><label className="text-[10px] font-semibold">yâ‚</label><input type="range" min="-5" max="5" step="1" value={y1} onChange={e => { setY1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" /><span className="text-xs">{y1}</span></div>
      <div><label className="text-[10px] font-semibold">x</label><input type="range" min="-5" max="10" step="0.5" value={x} onChange={e => { setX(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" /><span className="text-xs">{x}</span></div>
    </div>
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800"><p className="text-xs text-blue-700 dark:text-blue-300 font-mono">{t("y âˆ’")} {y1} = {m}({x} âˆ’ {x1})<br />{t("y =")} {m}({x - x1}) + {y1} = <strong>{y}</strong></p></div>
    <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("y = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-blue-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">{t("Check")}</button></div>
    {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! y =")} {y}</p>}
    {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try y âˆ’ yâ‚ = m(x âˆ’ xâ‚)")}</p>}
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
      <div><label className="text-xs font-semibold">Pâ‚</label><div className="grid grid-cols-2 gap-1"><div><span className="text-[10px]">xâ‚</span><input type="range" min="-5" max="5" step="1" value={x1} onChange={e => setX1(parseFloat(e.target.value))} className="w-full accent-pink-500" /><span className="text-xs">{x1}</span></div><div><span className="text-[10px]">yâ‚</span><input type="range" min="-5" max="5" step="1" value={y1} onChange={e => setY1(parseFloat(e.target.value))} className="w-full accent-pink-500" /><span className="text-xs">{y1}</span></div></div></div>
      <div><label className="text-xs font-semibold">Pâ‚‚</label><div className="grid grid-cols-2 gap-1"><div><span className="text-[10px]">xâ‚‚</span><input type="range" min="-5" max="5" step="1" value={x2} onChange={e => setX2(parseFloat(e.target.value))} className="w-full accent-pink-500" /><span className="text-xs">{x2}</span></div><div><span className="text-[10px]">yâ‚‚</span><input type="range" min="-5" max="5" step="1" value={y2} onChange={e => setY2(parseFloat(e.target.value))} className="w-full accent-pink-500" /><span className="text-xs">{y2}</span></div></div></div>
      <div><label className="text-[10px] font-semibold">{t("x (query)")}</label><input type="range" min="-5" max="10" step="0.5" value={x} onChange={e => setX(parseFloat(e.target.value))} className="w-full accent-pink-500" /><span className="text-xs">{x}</span></div>
    </div>
    <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-3 border border-pink-200 dark:border-pink-800"><p className="text-xs text-pink-700 dark:text-pink-300 font-mono">{t("Slope m = (")}{y2}âˆ’{y1})/({x2}âˆ’{x1}) = {slope.toFixed(2)}<br />{t("At x =")} {x}{t(": y =")} {slope.toFixed(2)}({x}âˆ’{x1}) + {y1} = <strong>{y.toFixed(2)}</strong></p></div>
    <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("y = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-pink-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-lg transition-colors">{t("Check")}</button></div>
    {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! y =")} {y.toFixed(2)}</p>}
    {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try y âˆ’ yâ‚ = ((yâ‚‚âˆ’yâ‚)/(xâ‚‚âˆ’xâ‚))(x âˆ’ xâ‚)")}</p>}
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
      <div><label className="text-xs font-semibold">{t("Î± (inclination)")}</label><input type="range" min="0" max="90" step="1" value={alpha} onChange={e => { setAlpha(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-orange-500" /><span className="text-xs">{alpha}Â°</span></div>
      <div><label className="text-xs font-semibold">{t("p (perp distance)")}</label><input type="range" min="1" max="10" step="0.5" value={p} onChange={e => { setP(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-orange-500" /><span className="text-xs">{p}</span></div>
    </div>
    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800"><p className="text-xs text-orange-700 dark:text-orange-300 font-mono">{t("x cos(")}{alpha}{t("Â°) + y sin(")}{alpha}Â°) = {p}<br />x({cosA.toFixed(4)}{t(") + y(")}{sinA.toFixed(4)}) = {p}</p></div>
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
      <div><label className="text-xs font-semibold">{t("Slope mâ‚")}</label><input type="range" min="-3" max="3" step="0.1" value={m1} onChange={e => { setM1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" /><span className="text-xs">{m1}</span></div>
      <div><label className="text-xs font-semibold">{t("Slope mâ‚‚")}</label><input type="range" min="-3" max="3" step="0.1" value={m2} onChange={e => { setM2(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" /><span className="text-xs">{m2}</span></div>
    </div>
    <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-3 border border-rose-200 dark:border-rose-800"><p className="text-xs text-rose-700 dark:text-rose-300 font-mono">{t("tan Î¸ = |(")}{m2}âˆ’{m1})/(1+{m1}Ã—{m2})| = <strong>{thetaDeg.toFixed(1)}Â°</strong></p></div>
    <div className="flex gap-2"><input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("Î¸ (degrees) = ?")} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-rose-500 outline-none" /><button onClick={handleCheck} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition-colors">{t("Check")}</button></div>
    {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! Î¸ =")} {thetaDeg.toFixed(1)}Â°</p>}
    {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try tan Î¸ = |(mâ‚‚âˆ’mâ‚)/(1+mâ‚mâ‚‚)|")}</p>}
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
    keyInsight: 'The Richter scale uses this law: a magnitude 8 earthquake isn\'t twice as powerful as a magnitude 4 â€” it\'s 10,000 times! Because the scale is logarithmic, each whole number adds a factor of 10.',
    steps: [
      { label: 'Set up variables', formula: 'log_b m = x, log_b n = y', detail: 'ðŸ§® You\'re a sound engineer mixing a live concert. The microphone picks up sound at power m = 4 units, and the amplifier adds n = 8 units. To figure out the total gain, you reach for logarithms. Let log_b m = x and log_b n = y â€” these represent the "logarithmic power" of each signal.' },
      { label: 'Convert to exponentials', formula: 'm = b^x, n = b^y', detail: 'Converting back: m = b^x and n = b^y. In our concert, if b = 2 (binary amplification), then m = 2^x and n = 2^y. The exponential form reveals the actual multipliers hiding behind the log values.' },
      { label: 'Multiply the equations', formula: 'mn = b^x \Â· b^y = b^{x+y}', detail: 'Now multiply m Ã— n: mn = b^x Â· b^y. When multiplying powers with the same base, we ADD the exponents: mn = b^(x+y). This is the key insight â€” multiplication in the real world becomes addition in log world.' },
      { label: 'Convert back to logs', formula: 'log_b(mn) = x + y = log_b m + log_b n', detail: 'Convert mn = b^(x+y) back to logarithmic form: log_b(mn) = x + y. Substitute x = log_b m and y = log_b n, and you get: log_b(mn) = log_b m + log_b n. The total sound power (product) equals the sum of the individual log powers.' },
    ],
    practice: { question: 'logâ‚‚(4) = 2, logâ‚‚(8) = 3. Find logâ‚‚(32).', hint: '32 = 4 Ã— 8. Use product law: logâ‚‚(4) + logâ‚‚(8)', answer: 5, tolerance: 0.1, explanation: 'logâ‚‚(32) = 5. Indeed, 2âµ = 32!', errorHint: 'log_b(mn) = log_b m + log_b n' },
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
    keyInsight: 'pH = âˆ’log[Hâº] uses this: a solution at pH 3 is 100Ã— more acidic than pH 5, because 10^(5âˆ’3) = 10Â² = 100 on the logarithmic scale.',
    steps: [
      { label: 'Set up variables', formula: 'log_b m = x, log_b n = y', detail: 'ðŸ”¬ You\'re a chemist measuring the concentration of a solution before and after dilution. The initial concentration is m = 32 M (molar) and after dilution it drops to n = 4 M. Let\'s set log_b m = x and log_b n = y.' },
      { label: 'Convert to exponentials', formula: 'm = b^x, n = b^y', detail: 'Convert to exponential form: m = b^x and n = b^y. With base b = 10 (common log), we have 32 = 10^x and 4 = 10^y. The exponents x and y are the powers of 10 that give us these concentrations.' },
      { label: 'Divide the equations', formula: 'm/n = b^x / b^y = b^{x-y}', detail: 'Divide m by n: m/n = b^x / b^y. When dividing powers with the same base, we SUBTRACT the exponents: m/n = b^(xâˆ’y). Division in the real world becomes subtraction in log world.' },
      { label: 'Convert back to logs', formula: 'log_b(m/n) = x - y = log_b m - log_b n', detail: 'Convert m/n = b^(xâˆ’y) to log form: log_b(m/n) = x âˆ’ y. Substituting back: log_b(m/n) = log_b m âˆ’ log_b n. The dilution factor in log terms is just the difference of the individual log concentrations.' },
    ],
    practice: { question: 'logâ‚â‚€(100) = 2, logâ‚â‚€(10) = 1. Find logâ‚â‚€(10).', hint: '10 = 100/10. Use quotient law: logâ‚â‚€(100) âˆ’ logâ‚â‚€(10)', answer: 1, tolerance: 0.1, explanation: 'logâ‚â‚€(10) = 1. The quotient law correctly gives us back 1!', errorHint: 'log_b(m/n) = log_b m âˆ’ log_b n' },
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
    keyInsight: 'Astronomers love logs: the distance to the farthest galaxies is 10Â²â¶ meters â€” logâ‚â‚€(10Â²â¶) = 26 Ã— logâ‚â‚€(10) = 26. A 26 on the log scale is easy to write and compare!',
    steps: [
      { label: 'Set up the equation', formula: 'log_b m = x', detail: 'ðŸ’° You\'re an investor watching your money grow. Your initial investment of m = $3,000 grows at b = 2Ã— per year. After n = 4 years, your money multiplies by 2^4. Let log_b m = x, meaning b^x = m.' },
      { label: 'Convert to exponential', formula: 'm = b^x', detail: 'Convert m = b^x. Your initial $3,000 = 2^x means x = logâ‚‚(3000) â‰ˆ 11.55 â€” the "doubling power" of your investment.' },
      { label: 'Raise both sides to power n', formula: 'm^n = (b^x)^n = b^{nx}', detail: 'Raise both sides to the n-th power: m^n = (b^x)^n. Using the power of a power rule: m^n = b^(nx). Your investment after 4 years: 3000^4? No â€” this is a mathematical power, not financial.' },
      { label: 'Convert to log form', formula: 'log_b(m^n) = nx = n log_b m', detail: 'Converting m^n = b^(nx) to log form: log_b(m^n) = nx. Substituting x = log_b m: log_b(m^n) = n log_b m. The exponent "pulls down" in front of the log!' },
    ],
    practice: { question: 'logâ‚‚(3) â‰ˆ 1.585. Find logâ‚‚(81).', hint: '81 = 3â´. Use power law: 4 Ã— logâ‚‚(3)', answer: 6.34, tolerance: 0.1, explanation: 'logâ‚‚(81) = 4 Ã— 1.585 = 6.34. The power pulls down in front!', errorHint: 'log_b(m^n) = n log_b m' },
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
    keyInsight: 'This is THE most practical log law because it lets you compute ANY log with just the logâ‚â‚€ or ln button on your calculator!',
    steps: [
      { label: 'Set up the equation', formula: 'log_b m = x', detail: 'ðŸ“± You\'re programming a calculator that only has logâ‚â‚€ (common log) and ln (natural log) buttons, but you need to compute logâ‚‚(8). This is the classic problem the Change of Base Law solves.' },
      { label: 'Convert to exponentials', formula: 'm = b^x \â‡’ log_a m = log_a(b^x)', detail: 'Convert: m = b^x. We want to express this in terms of a known base a. Taking log_a of both sides: log_a m = log_a(b^x). Now we can use the Power Law in reverse!' },
      { label: 'Apply the Power Law', formula: 'log_a m = x \Â· log_a b \â‡’ x = \{log_a m}{log_a b}', detail: 'log_a m = x Â· log_a b. The exponent x "pulls down" in front. Now isolate x: x = log_a m / log_a b.' },
      { label: 'Substitute back', formula: 'log_b m = \{log_a m}{log_a b}', detail: 'Since x = log_b m, we get: log_b m = log_a m / log_a b. So logâ‚‚(8) = logâ‚â‚€(8) / logâ‚â‚€(2) = 0.9031 / 0.3010 = 3. Indeed, 2Â³ = 8.' },
    ],
    practice: { question: 'logâ‚â‚€(100) = 2. Find logâ‚‚(100) using change of base.', hint: 'logâ‚‚(100) = logâ‚â‚€(100) / logâ‚â‚€(2)', answer: 6.64, tolerance: 0.5, explanation: 'logâ‚‚(100) â‰ˆ 6.64. This formula lets you compute any log with common logs!', errorHint: 'log_b m = log_a m / log_a b' },
    interactive: ChangeBaseInteractive,
  },

  union_associative: {
    theoremKey: 'class9.union_associative',
    title: "Associative Property of Union",
    icon: <PieChart className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-fuchsia-600',
    accentColor: 'bg-indigo-600',
    finalFormula: '(A \\cup B) \\cup C = A \\cup (B \\cup C)',
    finalFormulaDesc: 'The union operation is associative â€” grouping doesn\'t matter.',
    keyInsight: 'The school fair analogy: three groups (food stall, games, raffle). The total combined team is the same no matter how you group them â€” union is just "is in at least one of these sets."',
    steps: [
      { label: 'Let x be an element', formula: 'x \\in (A \\cup B) \\cup C', detail: 'ðŸŸï¸ Imagine three groups of students at a school fair: Group A runs the food stall, Group B runs games, and Group C runs the raffle. Let x be any student. If x is in (A âˆª B) âˆª C, then...' },
      { label: 'Apply union definition', formula: 'x \\in A \\cup B \{ OR } x \\in C', detail: 'x âˆˆ (A âˆª B) âˆª C means x âˆˆ (A âˆª B) OR x âˆˆ C. And x âˆˆ (A âˆª B) means x âˆˆ A OR x âˆˆ B. So overall: (x âˆˆ A OR x âˆˆ B) OR x âˆˆ C.' },
      { label: 'Re-group the ORs', formula: '(x \\in A \{ OR } x \\in B) \{ OR } x \\in C = x \\in A \{ OR } (x \\in B \{ OR } x \\in C)', detail: 'The logical OR is associative â€” (P OR Q) OR R = P OR (Q OR R). So (x âˆˆ A OR x âˆˆ B) OR x âˆˆ C = x âˆˆ A OR (x âˆˆ B OR x âˆˆ C). The school fair doesn\'t care how you group the teams!' },
      { label: 'Convert back to sets', formula: '(A \\cup B) \\cup C = A \\cup (B \\cup C)', detail: 'x âˆˆ A OR (x âˆˆ B OR x âˆˆ C) means x âˆˆ A OR x âˆˆ (B âˆª C), which means x âˆˆ A âˆª (B âˆª C). The reverse containment proves equality. Thus (A âˆª B) âˆª C = A âˆª (B âˆª C). Grouping doesn\'t matter!' },
    ],
    practice: { question: 'A={1,2}, B={2,3}, C={3,4}. Elements in (AâˆªB)âˆªC?', hint: 'AâˆªB = {1,2,3}. Then âˆªC = {1,2,3,4}', answer: 4, tolerance: 0.1, explanation: '(AâˆªB)âˆªC = {1,2,3,4} = Aâˆª(BâˆªC). Same 4 elements!', errorHint: '(AâˆªB)âˆªC = Aâˆª(BâˆªC)' },
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
    keyInsight: 'A student in Art Club, Music Club, AND Drama Club â€” being in all three doesn\'t depend on how you group the clubs. Intersection is just "is in ALL of these sets."',
    steps: [
      { label: 'Let y be an element', formula: 'y \\in (A \\cap B) \\cap C', detail: 'ðŸŽ­ Three clubs at school: Art Club A, Music Club B, and Drama Club C. A triple threat student does all three. Let y âˆˆ (A âˆ© B) âˆ© C.' },
      { label: 'Apply intersection definition', formula: 'y \\in A \\cap B \{ AND } y \\in C', detail: 'y âˆˆ (A âˆ© B) âˆ© C means y âˆˆ (A âˆ© B) AND y âˆˆ C. And y âˆˆ (A âˆ© B) means y âˆˆ A AND y âˆˆ B. So: (y âˆˆ A AND y âˆˆ B) AND y âˆˆ C.' },
      { label: 'Re-group the ANDs', formula: '(y \\in A \{ AND } y \\in B) \{ AND } y \\in C = y \\in A \{ AND } (y \\in B \{ AND } y \\in C)', detail: 'Logical AND is associative: (P AND Q) AND R = P AND (Q AND R). So (y âˆˆ A AND y âˆˆ B) AND y âˆˆ C = y âˆˆ A AND (y âˆˆ B AND y âˆˆ C).' },
      { label: 'Convert back to sets', formula: '(A \\cap B) \\cap C = A \\cap (B \\cap C)', detail: 'y âˆˆ A AND (y âˆˆ B AND y âˆˆ C) means y âˆˆ A AND y âˆˆ (B âˆ© C), which means y âˆˆ A âˆ© (B âˆ© C). Reverse containment proves equality. Just like union, intersection is associative!' },
    ],
    practice: { question: 'A={1,2,3}, B={2,3,4}, C={3,4,5}. Elements in (Aâˆ©B)âˆ©C?', hint: 'Aâˆ©B = {2,3}. Then âˆ©C = {3}', answer: 1, tolerance: 0.1, explanation: '(Aâˆ©B)âˆ©C = {3} = Aâˆ©(Bâˆ©C). Same single element!', errorHint: '(Aâˆ©B)âˆ©C = Aâˆ©(Bâˆ©C)' },
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
    keyInsight: 'Just like 2Ã—(3+4) = 2Ã—3 + 2Ã—4 in arithmetic, set union distributes over intersection â€” it\'s the same distributive law!',
    steps: [
      { label: 'Let x âˆˆ A âˆª (B âˆ© C)', formula: 'x \\in A \{ OR } x \\in (B \\cap C)', detail: 'ðŸ§© Think of a school prize: winners get a free period (A) OR they get both extra recess AND homework pass (B âˆ© C).' },
      { label: 'Break down the OR', formula: 'x \\in A \{ OR } (x \\in B \{ AND } x \\in C)', detail: 'x âˆˆ A OR x âˆˆ (B âˆ© C). That means either x âˆˆ A, OR (x âˆˆ B AND x âˆˆ C).' },
      { label: 'Use logical distribution', formula: '(x \\in A \{ OR } x \\in B) \{ AND } (x \\in A \{ OR } x \\in C)', detail: '(P OR Q) AND (P OR R) is logically equivalent to P OR (Q AND R). So: (x âˆˆ A OR x âˆˆ B) AND (x âˆˆ A OR x âˆˆ C).' },
      { label: 'Convert back to sets', formula: 'A \\cup (B \\cap C) = (A \\cup B) \\cap (A \\cup C)', detail: '(x âˆˆ A âˆª B) AND (x âˆˆ A âˆª C) means x âˆˆ (A âˆª B) âˆ© (A âˆª C). So A âˆª (B âˆ© C) âŠ† (A âˆª B) âˆ© (A âˆª C). The reverse containment also holds. Just like 2Ã—(3+4) = 2Ã—3 + 2Ã—4!' },
    ],
    practice: { question: 'A={1,2}, B={2,3}, C={3,4}. Elements in Aâˆª(Bâˆ©C)?', hint: 'Bâˆ©C = {3}. Aâˆª{3} = {1,2,3}', answer: 3, tolerance: 0.1, explanation: 'Aâˆª(Bâˆ©C) = {1,2,3}. Same result from (AâˆªB)âˆ©(AâˆªC) = {1,2,3}âˆ©{1,2,4} = {1,2}', errorHint: 'Are you sure?' },
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
      { label: 'Let x âˆˆ A âˆ© (B âˆª C)', formula: 'x \\in A \{ AND } x \\in (B \\cup C)', detail: 'ðŸ« School library rule: you need a library card (A) AND (either a valid ID OR a teacher note) (B âˆª C).' },
      { label: 'Break down the AND', formula: 'x \\in A \{ AND } (x \\in B \{ OR } x \\in C)', detail: 'x âˆˆ A AND x âˆˆ (B âˆª C). That means x âˆˆ A AND (x âˆˆ B OR x âˆˆ C).' },
      { label: 'Use logical distribution', formula: '(x \\in A \{ AND } x \\in B) \{ OR } (x \\in A \{ AND } x \\in C)', detail: 'P AND (Q OR R) = (P AND Q) OR (P AND R). So: (x âˆˆ A AND x âˆˆ B) OR (x âˆˆ A AND x âˆˆ C).' },
      { label: 'Convert back to sets', formula: 'A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C)', detail: 'x âˆˆ (A âˆ© B) OR x âˆˆ (A âˆ© C) means x âˆˆ (A âˆ© B) âˆª (A âˆ© C). So A âˆ© (B âˆª C) âŠ† (A âˆ© B) âˆª (A âˆ© C). The reverse direction similarly proves equality.' },
    ],
    practice: { question: 'A={1,2}, B={2,3}, C={3,4}. Elements in Aâˆ©(BâˆªC)?', hint: 'BâˆªC = {2,3,4}. Aâˆ©{2,3,4} = {2}', answer: 1, tolerance: 0.1, explanation: 'Aâˆ©(BâˆªC) = {2}. Same as (Aâˆ©B)âˆª(Aâˆ©C) = {2}âˆªâˆ… = {2}', errorHint: 'Aâˆ©(BâˆªC) = (Aâˆ©B)âˆª(Aâˆ©C)' },
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
    keyInsight: 'On a unit circle, the tangent at angle Î¸ is the y-coordinate divided by the x-coordinate â€” the slope of the radius line!',
    steps: [
      { label: 'Consider a right triangle', formula: 'sin theta = \{a}{c}, cos theta = \{b}{c}, tan theta = \{a}{b}', detail: 'ðŸ”º You\'re standing at the base of a building, looking up at the top. The angle of elevation is Î¸. sin Î¸ = opposite/hypotenuse = a/c. cos Î¸ = adjacent/hypotenuse = b/c. tan Î¸ = opposite/adjacent = a/b.' },
      { label: 'Divide sin by cos', formula: '\{sin theta}{cos theta} = \{a/c}{b/c} = \{a}{b} = tan theta', detail: 'sin Î¸ / cos Î¸ = (a/c) / (b/c) = (a/c) Ã— (c/b) = a/b. The hypotenuse (c) cancels out! And a/b is exactly tan Î¸.' },
      { label: 'Similarly for cotangent', formula: '\{cos theta}{sin theta} = \{b/c}{a/c} = \{b}{a} = \\cot theta', detail: 'Similarly, cos Î¸ / sin Î¸ = b/a = cot Î¸. These are the Quotient Identities. They connect the primary ratios (sin, cos) to the secondary ones (tan, cot).' },
    ],
    practice: { question: 'sin(30Â°) = 0.5, cos(30Â°) â‰ˆ 0.866. Find tan(30Â°).', hint: 'tan(30Â°) = sin(30Â°)/cos(30Â°) = 0.5/0.866', answer: 0.577, tolerance: 0.05, explanation: 'tan(30Â°) = 0.577. Matches sin/cos perfectly!', errorHint: 'tan Î¸ = sin Î¸ / cos Î¸' },
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
    keyInsight: 'From this one identity, we can derive: secÂ²Î¸ âˆ’ tanÂ²Î¸ = 1 and cosecÂ²Î¸ âˆ’ cotÂ²Î¸ = 1. These are used in everything from signal processing to orbital mechanics!',
    steps: [
      { label: 'Start with the Pythagorean Theorem', formula: 'a^2 + b^2 = c^2', detail: 'ðŸ“ In any right triangle with legs a, b and hypotenuse c: aÂ² + bÂ² = cÂ². This is the most famous relationship in all of geometry.' },
      { label: 'Express in trig terms', formula: 'sin^2 theta = \{a^2}{c^2}, cos^2 theta = \{b^2}{c^2}', detail: 'sin Î¸ = a/c and cos Î¸ = b/c. Square both: sinÂ²Î¸ = aÂ²/cÂ² and cosÂ²Î¸ = bÂ²/cÂ².' },
      { label: 'Add the squares', formula: 'sin^2 theta + cos^2 theta = \{a^2}{c^2} + \{b^2}{c^2} = \{c^2}{c^2} = 1', detail: 'sinÂ²Î¸ + cosÂ²Î¸ = aÂ²/cÂ² + bÂ²/cÂ² = (aÂ² + bÂ²)/cÂ² = cÂ²/cÂ² = 1. The triangle\'s legs and hypotenuse cancel out perfectly!' },
      { label: 'The identity is born', formula: 'sin^2 theta + cos^2 theta = 1', detail: 'sinÂ²Î¸ + cosÂ²Î¸ = 1 â€” it doesn\'t matter what Î¸ is, this always holds true! From this, we can derive: secÂ²Î¸ âˆ’ tanÂ²Î¸ = 1 and cosecÂ²Î¸ âˆ’ cotÂ²Î¸ = 1.' },
    ],
    practice: { question: 'sin(30Â°) = 0.5. Find sinÂ²(30Â°) + cosÂ²(30Â°).', hint: 'cos(30Â°) = 0.866. Compute 0.25 + 0.75', answer: 1, tolerance: 0.01, explanation: 'sinÂ²(30Â°) + cosÂ²(30Â°) = 1. Always 1, no matter the angle!', errorHint: 'sinÂ²Î¸ + cosÂ²Î¸ = 1 always!' },
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
      { label: 'Plot two points', formula: 'P_1(x_1, y_1), P_2(x_2, y_2)', detail: 'ðŸ—ºï¸ You\'re a city planner. Point Pâ‚(1, 2) is the library and Pâ‚‚(7, 6) is the hospital. You need the straight-line distance between them to plan a new road.' },
      { label: 'Draw perpendiculars', formula: 'Delta x = x_2 - x_1, Delta y = y_2 - y_1', detail: 'Draw lines from Pâ‚ and Pâ‚‚ to the x-axis. These create a right triangle. The horizontal leg runs from xâ‚ to xâ‚‚, and the vertical leg from yâ‚ to yâ‚‚.' },
      { label: 'Apply Pythagoras', formula: 'd^2 = (Delta x)^2 + (Delta y)^2', detail: 'dÂ² = (Î”x)Â² + (Î”y)Â² â†’ d = âˆš((xâ‚‚âˆ’xâ‚)Â² + (yâ‚‚âˆ’yâ‚)Â²) = âˆš(6Â² + 4Â²) = âˆš(36 + 16) = âˆš52 â‰ˆ 7.21 units.' },
      { label: 'Final formula', formula: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}', detail: 'This formula is the GPS backbone: your phone calculates distance between satellites and your position using this exact formula in 3D!' },
    ],
    practice: { question: 'Pâ‚(0,0), Pâ‚‚(3,4). Find the distance.', hint: 'd = âˆš(3Â² + 4Â²) = âˆš(9+16)', answer: 5, tolerance: 0.1, explanation: 'd = âˆš(9+16) = âˆš25 = 5. The classic 3-4-5 triangle!', errorHint: 'd = âˆš((xâ‚‚âˆ’xâ‚)Â² + (yâ‚‚âˆ’yâ‚)Â²)' },
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
    keyInsight: 'In business, this models linear cost functions: Total Cost = Variable Cost Ã— Units + Fixed Cost. The slope is the cost per unit!',
    steps: [
      { label: 'Identify slope and intercept', formula: 'm = \{slope}, c = y\{-intercept}', detail: 'ðŸ“ˆ You\'re tracking your savings. You start with $100 (y-intercept c = 1 on a scaled graph) and save $2 per week (slope m = 2). The line shows your total savings over time.' },
      { label: 'Pick a general point', formula: 'P(x, y), A(0, c)', detail: 'Let P(x, y) be any point on the line. The point where the line crosses the y-axis is A(0, c) â€” your starting savings at week 0.' },
      { label: 'Calculate slope', formula: "m = \\frac{y - c}{x - 0} = \\frac{y - c}{x}", detail: 'Slope m = (y âˆ’ c) / (x âˆ’ 0) = (y âˆ’ c) / x. This means the rise over run from A to P equals the constant slope of the line.' },
      { label: 'Rearrange for y', formula: "y = mx + c", detail: 'm = (y âˆ’ c)/x â†’ y âˆ’ c = mx â†’ y = mx + c. That\'s it! All straight lines can be written this way.' },
    ],
    practice: { question: 'A line has slope m = 3 and intercept c = 2. What is y when x = 4?', hint: 'y = 3Ã—4 + 2 = 12 + 2', answer: 14, tolerance: 0.1, explanation: 'y = 14. Using y = mx + c.', errorHint: 'y = mx + c' },
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
      { label: 'The problem', formula: '\{Point } (x_1, y_1), \{ slope } m', detail: 'ðŸ“ You know a line passes through the point (2, 3) and has slope m = 1.5. You need the equation of the line to graph it on your digital map.' },
      { label: 'Use slope formula', formula: 'm = \{y - y_1}{x - x_1}', detail: 'Let P(x, y) be any point on the line. With B(xâ‚, yâ‚) = (2, 3), the slope m = (y âˆ’ yâ‚)/(x âˆ’ xâ‚).' },
      { label: 'Cross-multiply', formula: 'm(x - x_1) = y - y_1', detail: 'm(x âˆ’ xâ‚) = y âˆ’ yâ‚. This equation says "for any point on the line, the slope from (xâ‚, yâ‚) to (x, y) is always m."' },
      { label: 'The result', formula: 'y - y_1 = m(x - x_1)', detail: 'y âˆ’ yâ‚ = m(x âˆ’ xâ‚). For our example: y âˆ’ 3 = 1.5(x âˆ’ 2) â†’ y = 1.5x.' },
    ],
    practice: { question: 'Line through (1,2) with slope m = 4. Find y when x = 3.', hint: 'y âˆ’ 2 = 4(3âˆ’1). So y = 2+8', answer: 10, tolerance: 0.1, explanation: 'y = 10. Using yâˆ’yâ‚ = m(xâˆ’xâ‚).', errorHint: 'y âˆ’ yâ‚ = m(x âˆ’ xâ‚)' },
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
    keyInsight: 'Surveyors use this formula to map boundaries between measured points â€” the line connecting two measured coordinates!',
    steps: [
      { label: 'Two points define a line', formula: 'A(x_1, y_1), B(x_2, y_2)', detail: 'ðŸ”— You have two points A(1, 2) and B(4, 8). Only one straight line passes through both â€” the shortest path between them.' },
      { label: 'Find the slope', formula: 'm = \{y_2 - y_1}{x_2 - x_1} = \{8 - 2}{4 - 1} = 2', detail: 'Slope m = (yâ‚‚ âˆ’ yâ‚)/(xâ‚‚ âˆ’ xâ‚) = (8 âˆ’ 2)/(4 âˆ’ 1) = 6/3 = 2. This line rises 2 units for every 1 unit horizontally.' },
      { label: 'Apply Point-Slope Form', formula: 'y - y_1 = m(x - x_1)', detail: 'Now that we have m = 2, use the Point-Slope Form with either point: y âˆ’ yâ‚ = m(x âˆ’ xâ‚) â†’ y âˆ’ 2 = 2(x âˆ’ 1).' },
      { label: 'The formula', formula: 'y - y_1 = \{y_2 - y_1}{x_2 - x_1}(x - x_1)', detail: 'Substituting the slope formula directly gives: y âˆ’ yâ‚ = ((yâ‚‚âˆ’yâ‚)/(xâ‚‚âˆ’xâ‚))(x âˆ’ xâ‚). This is the Two-Point Form.' },
    ],
    practice: { question: 'Line through (0,0) and (2,6). Find y when x = 5.', hint: 'Slope = 6/2 = 3. y âˆ’ 0 = 3(5âˆ’0)', answer: 15, tolerance: 0.1, explanation: 'y = 15. Using the two-point form.', errorHint: 'y âˆ’ yâ‚ = ((yâ‚‚âˆ’yâ‚)/(xâ‚‚âˆ’xâ‚))(x âˆ’ xâ‚)' },
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
      { label: 'Identify intercepts', formula: 'x\{-intercept } = a, y\{-intercept } = b', detail: 'ðŸŽ¯ A line crosses the x-axis at x = 4 (the x-intercept a = 4) and the y-axis at y = 3 (the y-intercept b = 3).' },
      { label: 'Find the slope', formula: 'm = \{b - 0}{0 - a} = -\{b}{a} = -\{3}{4}', detail: 'Slope m = (b âˆ’ 0)/(0 âˆ’ a) = b/(âˆ’a) = âˆ’b/a = âˆ’3/4. The line goes down 3 for every 4 right.' },
      { label: 'Use Point-Slope', formula: '\{x}{a} + \{y}{b} = 1', detail: 'Using point (0, b): y âˆ’ b = (âˆ’b/a)x â†’ ay âˆ’ ab = âˆ’bx â†’ bx + ay = ab.' },
      { label: 'Divide by ab', formula: '\{x}{a} + \{y}{b} = 1', detail: '(bx)/(ab) + (ay)/(ab) = 1 â†’ x/a + y/b = 1. This elegant form shows the intercepts directly.' },
    ],
    practice: { question: 'x-intercept = 6, y-intercept = 3. Find y when x = 2.', hint: '2/6 + y/3 = 1. So y/3 = 1 âˆ’ 1/3 = 2/3', answer: 2, tolerance: 0.1, explanation: 'y = 2. Using x/a + y/b = 1.', errorHint: 'x/a + y/b = 1' },
    interactive: TwoInterceptInteractive,
  },

  normal_form: {
    theoremKey: 'class9.normal_form',
    title: "Normal Form of a Line",
    icon: <Target className="w-5 h-5 text-white" />,
    accentGradient: 'from-orange-500 to-red-600',
    accentColor: 'bg-orange-600',
    finalFormula: 'x cos alpha + y sin alpha = p',
    finalFormulaDesc: 'Equation using perpendicular distance p from origin and inclination Î±.',
    keyInsight: 'This is particularly useful in physics and engineering for finding distances from a point to a line, and for describing wave fronts in optics.',
    steps: [
      { label: 'Define the normal', formula: 'OC = p, \angle COA = alpha', detail: 'ðŸ§­ Imagine a line L and a perpendicular from the origin O to L meeting at point C. The distance OC = p, and the angle this perpendicular makes with the x-axis is Î±.' },
      { label: 'Find intercepts', formula: 'x\{-intercept} = \{p}{cos alpha}, y\{-intercept} = \{p}{sin alpha}', detail: 'From right triangle OCA: cos Î± = p/OA â†’ OA = p/cos Î± (x-intercept). From triangle OCB: sin Î± = p/OB â†’ OB = p/sin Î± (y-intercept).' },
      { label: 'Apply Two-Intercept Form', formula: '\{x}{p/cos alpha} + \{y}{p/sin alpha} = 1', detail: 'Using x/a + y/b = 1: x/(p/cos Î±) + y/(p/sin Î±) = 1 â†’ (x cos Î±)/p + (y sin Î±)/p = 1.' },
      { label: 'Multiply by p', formula: 'x cos alpha + y sin alpha = p', detail: 'x cos Î± + y sin Î± = p. The Normal Form! This is particularly useful in physics and engineering for finding distances from a point to a line.' },
    ],
    practice: { question: 'Î± = 60Â°, p = 5. Find cos Î± and evaluate x cos Î± + y sin Î± at x=2, y=3.', hint: 'cos 60Â° = 0.5, sin 60Â° = 0.866. LHS = 2Ã—0.5+3Ã—0.866', answer: 5, tolerance: 0.3, explanation: '2Ã—0.5 + 3Ã—0.866 = 1 + 2.598 = 3.598 â‰  5. Point (2,3) is not on this line!', errorHint: 'x cos Î± + y sin Î± = p' },
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
    keyInsight: 'Road engineers use this to design safe intersection angles â€” a 90Â° crossing is safest because it maximizes visibility in all directions!',
    steps: [
      { label: 'Lines and inclinations', formula: 'tan alpha = m_1, tan beta = m_2', detail: 'ðŸ”„ Two roads cross at an intersection. One has a gentle slope mâ‚ = 0.5 (gentle hill), the other is steeper mâ‚‚ = 2.' },
      { label: 'Exterior angle theorem', formula: 'alpha = beta + theta', detail: 'When these lines cross, they form a triangle with the x-axis. The exterior angle of this triangle equals the sum of the two opposite interior angles: Î± = Î² + Î¸.' },
      { label: 'Apply tan to both sides', formula: 'tan theta = tan(alpha - beta) = \{tan alpha - tan beta}{1 + tan alpha tan beta}', detail: 'Î¸ = Î± âˆ’ Î². Take tan of both sides: tan Î¸ = tan(Î± âˆ’ Î²). Using the tangent subtraction formula: tan(Î±âˆ’Î²) = (tan Î± âˆ’ tan Î²)/(1 + tan Î± Ã— tan Î²).' },
      { label: 'Substitute slopes', formula: 'tan theta = \|\{m_2 - m_1}{1 + m_1 m_2}\|', detail: 'Since tan Î± = mâ‚‚ and tan Î² = mâ‚: tan Î¸ = (mâ‚‚ âˆ’ mâ‚)/(1 + mâ‚mâ‚‚). Take absolute value for the acute angle. If tan Î¸ = 0, lines are parallel. If 1 + mâ‚mâ‚‚ = 0, lines are perpendicular!' },
    ],
    practice: { question: 'mâ‚ = 1, mâ‚‚ = 2. Find the acute angle between them.', hint: 'tan Î¸ = |(2âˆ’1)/(1+2)| = |1/3| = 0.333', answer: 18.43, tolerance: 1, explanation: 'Î¸ = 18.4Â°. The lines are 18.4Â° apart.', errorHint: 'tan Î¸ = |(mâ‚‚âˆ’mâ‚)/(1+mâ‚mâ‚‚)|' },
    interactive: AngleBetweenLinesInteractive,
  },
};

