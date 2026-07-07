import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  CheckCircle, XCircle, ChevronDown, ChevronRight,
  ArrowRight, Lightbulb, Sigma, BookOpen,
  Target, Hash, Infinity, PieChart, Move3d,
  Ruler, GraduationCap
} from 'lucide-react';
import MathFormula from './MathFormula';
import { useTranslate } from "../i18n";

// ========== Types ==========
interface TheoremModule {
  id: string;
  icon: typeof Target;
  title: string;
  formula: string;
  formulaDesc: string;
  color: string;
  steps: { label: string; content: string; }[];
  interactive: (props: { onAnswer: (correct: boolean) => void }) => React.ReactElement;
}

// ========== Interactive Components ==========

// --- Product Law: log_b(mn) = log_b m + log_b n ---
function ProductLogInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [m, setM] = useState(4);
  const [n, setN] = useState(8);
  const [b, setB] = useState(2);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const logM = Math.log(m) / Math.log(b);
  const logN = Math.log(n) / Math.log(b);
  const logMN = Math.log(m * n) / Math.log(b);

  const handleCheck = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - logMN) < 0.01 ? 'correct' : 'incorrect');
    if (Math.abs(val - logMN) < 0.01) onAnswer(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.m9theorems_base_b')}</label>
          <input type="range" min="2" max="10" step="1" value={b} onChange={e => { setB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-teal-500" />
          <span className="text-sm font-mono text-teal-600">{t('lab.m9theorems_b')} {b}</span>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.m9theorems_number_m')}</label>
          <input type="range" min="1" max="64" step="1" value={m} onChange={e => { setM(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-teal-500" />
          <span className="text-sm font-mono text-teal-600">{t('lab.m9theorems_m')} {m}</span>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.m9theorems_number_n')}</label>
          <input type="range" min="1" max="64" step="1" value={n} onChange={e => { setN(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-teal-500" />
          <span className="text-sm font-mono text-teal-600">{t('lab.m9theorems_n')} {n}</span>
        </div>
      </div>
      <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3 border border-teal-200 dark:border-teal-800">
        <p className="text-xs text-teal-700 dark:text-teal-300 font-mono">
          
                            {t('lab.m9theorems_log')}<sub>{b}</sub>({m}) = {logM.toFixed(4)}<br />
          
                            {t('lab.m9theorems_log')}<sub>{b}</sub>({n}) = {logN.toFixed(4)}<br />
          
                            {t('lab.m9theorems_log')}<sub>{b}</sub>({m} × {n}{t('lab.m9theorems_log_1')}<sub>{b}</sub>({m * n}) = <strong>{logMN.toFixed(4)}</strong><br />
          
                            {t('lab.m9theorems_sum')} <strong>{(logM + logN).toFixed(4)}</strong>  {t('lab.m9theorems_log_2')}<sub>{b}</sub>({m * n}) ✓
        </p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
          placeholder={t('lab.m9theorems_log_b_mn')} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-teal-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m9theorems_check')}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" />  {t('lab.m9theorems_correct_log')}<sub>{b}</sub>({m * n}) = {logMN.toFixed(4)}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" />  {t('lab.m9theorems_try_using_log_b_mn_log_b_m_log')}</p>}
    </div>
  );
}

// --- Quotient Law: log_b(m/n) = log_b m - log_b n ---
function QuotientLogInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [m, setM] = useState(32);
  const [n, setN] = useState(4);
  const [b, setB] = useState(2);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const logM = Math.log(m) / Math.log(b);
  const logN = Math.log(n) / Math.log(b);
  const logMN = Math.log(m / n) / Math.log(b);

  const handleCheck = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - logMN) < 0.01 ? 'correct' : 'incorrect');
    if (Math.abs(val - logMN) < 0.01) onAnswer(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.m9theorems_base_b')}</label>
          <input type="range" min="2" max="10" step="1" value={b} onChange={e => { setB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-purple-500" />
          <span className="text-sm font-mono text-purple-600">{t('lab.m9theorems_b')} {b}</span>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.m9theorems_numerator_m')}</label>
          <input type="range" min="2" max="64" step="1" value={m} onChange={e => { setM(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-purple-500" />
          <span className="text-sm font-mono text-purple-600">{t('lab.m9theorems_m')} {m}</span>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.m9theorems_denominator_n')}</label>
          <input type="range" min="1" max="32" step="1" value={n} onChange={e => { setN(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-purple-500" />
          <span className="text-sm font-mono text-purple-600">{t('lab.m9theorems_n')} {n}</span>
        </div>
      </div>
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
        <p className="text-xs text-purple-700 dark:text-purple-300 font-mono">
          
                            {t('lab.m9theorems_log')}<sub>{b}</sub>({m}) = {logM.toFixed(4)}<br />
          
                            {t('lab.m9theorems_log')}<sub>{b}</sub>({n}) = {logN.toFixed(4)}<br />
          
                            {t('lab.m9theorems_log')}<sub>{b}</sub>({m}/{n}{t('lab.m9theorems_log_1')}<sub>{b}</sub>({(m/n).toFixed(2)}) = <strong>{logMN.toFixed(4)}</strong><br />
          
                            {t('lab.m9theorems_difference')} <strong>{(logM - logN).toFixed(4)}</strong>  {t('lab.m9theorems_log_2')}<sub>{b}</sub>({m}/{n}) ✓
        </p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
          placeholder={t('lab.m9theorems_log_b_m_n')} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-purple-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m9theorems_check')}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" />  {t('lab.m9theorems_correct_log')}<sub>{b}</sub>({(m/n).toFixed(2)}) = {logMN.toFixed(4)}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" />  {t('lab.m9theorems_try_log_b_m_n_log_b_m_log_b_n')}</p>}
    </div>
  );
}

// --- Power Law: log_b(m^n) = n log_b m ---
function PowerLogInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [m, setM] = useState(3);
  const [n, setN] = useState(4);
  const [b, setB] = useState(2);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const logM = Math.log(m) / Math.log(b);
  const logMN = Math.log(Math.pow(m, n)) / Math.log(b);

  const handleCheck = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - logMN) < 0.01 ? 'correct' : 'incorrect');
    if (Math.abs(val - logMN) < 0.01) onAnswer(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.m9theorems_base_b')}</label>
          <input type="range" min="2" max="10" step="1" value={b} onChange={e => { setB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" />
          <span className="text-sm font-mono text-rose-600">{t('lab.m9theorems_b')} {b}</span>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.m9theorems_number_m')}</label>
          <input type="range" min="1" max="10" step="1" value={m} onChange={e => { setM(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" />
          <span className="text-sm font-mono text-rose-600">{t('lab.m9theorems_m')} {m}</span>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.m9theorems_power_n')}</label>
          <input type="range" min="1" max="10" step="1" value={n} onChange={e => { setN(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" />
          <span className="text-sm font-mono text-rose-600">{t('lab.m9theorems_n')} {n}</span>
        </div>
      </div>
      <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-3 border border-rose-200 dark:border-rose-800">
        <p className="text-xs text-rose-700 dark:text-rose-300 font-mono">
          
                            {t('lab.m9theorems_log')}<sub>{b}</sub>({m}) = {logM.toFixed(4)}<br />
          
                            {t('lab.m9theorems_log')}<sub>{b}</sub>({m}<sup>{n}</sup>{t('lab.m9theorems_log_1')}<sub>{b}</sub>({Math.pow(m, n)}) = <strong>{logMN.toFixed(4)}</strong><br />
          
                            {t('lab.m9theorems_n_log')}<sub>{b}</sub>{t('lab.m9theorems_m_1')} {n} × {logM.toFixed(4)} = <strong>{(n * logM).toFixed(4)}</strong> ✓
        </p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
          placeholder={t('lab.m9theorems_log_b_m_n_1')} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-rose-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m9theorems_check')}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" />  {t('lab.m9theorems_correct_log')}<sub>{b}</sub>({Math.pow(m, n)}) = {logMN.toFixed(4)}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" />  {t('lab.m9theorems_try_log_b_m_n_n_log_b_m')}</p>}
    </div>
  );
}

// --- Change of Base: log_a m = log_b m / log_b a ---
function ChangeBaseInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [m, setM] = useState(8);
  const [b, setB] = useState(10);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const logBaseB = Math.log(m) / Math.log(b);
  const logBase2 = Math.log(m) / Math.log(2);
  const logBaseE = Math.log(m);

  const handleCheck = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - logBaseB) < 0.01 ? 'correct' : 'incorrect');
    if (Math.abs(val - logBaseB) < 0.01) onAnswer(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.m9theorems_number_m')}</label>
          <input type="range" min="1" max="100" step="1" value={m} onChange={e => { setM(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-cyan-500" />
          <span className="text-sm font-mono text-cyan-600">{t('lab.m9theorems_m')} {m}</span>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.m9theorems_new_base_b')}</label>
          <input type="range" min="2" max="20" step="1" value={b} onChange={e => { setB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-cyan-500" />
          <span className="text-sm font-mono text-cyan-600">{t('lab.m9theorems_b')} {b}</span>
        </div>
      </div>
      <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-3 border border-cyan-200 dark:border-cyan-800">
        <p className="text-xs text-cyan-700 dark:text-cyan-300 font-mono">
          
                            {t('lab.m9theorems_log')}<sub>{b}</sub>({m}) = <strong>{logBaseB.toFixed(4)}</strong><br />
          
                            {t('lab.m9theorems_using_base_2_log')}{m}{t('lab.m9theorems_log_3')}{b}) = {logBase2.toFixed(4)} / {(Math.log(b)/Math.log(2)).toFixed(4)} = <strong>{logBaseB.toFixed(4)}</strong> ✓<br />
          
                            {t('lab.m9theorems_using_ln_ln')}{m}{t('lab.m9theorems_ln')}{b}) = {logBaseE.toFixed(4)} / {Math.log(b).toFixed(4)} = <strong>{logBaseB.toFixed(4)}</strong> ✓
        </p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
          placeholder={t('lab.m9theorems_log_b_m')} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-cyan-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m9theorems_check')}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" />  {t('lab.m9theorems_correct_log')}<sub>{b}</sub>({m}) = {logBaseB.toFixed(4)}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" />  {t('lab.m9theorems_try_log_b_m_log_a_m_log_a_b')}</p>}
    </div>
  );
}

// --- Union Venn Diagram Visual ---
function UnionAssociativeInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [a, setA] = useState(4);
  const [b, setB] = useState(3);
  const [c, setC] = useState(5);
  const [intersect, setIntersect] = useState(2);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const aUb = a + b - intersect;
  const aUc = a + c - intersect;
  const bUc = b + c - intersect;
  const aUbUc = a + b + c - intersect - intersect - intersect + 0; // assume no triple intersection

  const handleCheck = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - aUbUc) < 0.5 ? 'correct' : 'incorrect');
    if (Math.abs(val - aUbUc) < 0.5) onAnswer(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        <div><label className="text-xs font-semibold text-slate-600">{t('lab.m9theorems_a')}</label>
          <input type="range" min="1" max="10" step="1" value={a} onChange={e => setA(parseFloat(e.target.value))} className="w-full accent-blue-500" />
          <span className="text-xs font-mono">{a}</span></div>
        <div><label className="text-xs font-semibold text-slate-600">{t('lab.m9theorems_b_1')}</label>
          <input type="range" min="1" max="10" step="1" value={b} onChange={e => setB(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
          <span className="text-xs font-mono">{b}</span></div>
        <div><label className="text-xs font-semibold text-slate-600">{t('lab.m9theorems_c')}</label>
          <input type="range" min="1" max="10" step="1" value={c} onChange={e => setC(parseFloat(e.target.value))} className="w-full accent-amber-500" />
          <span className="text-xs font-mono">{c}</span></div>
        <div><label className="text-xs font-semibold text-slate-600">{t('lab.m9theorems_a_b')}</label>
          <input type="range" min="0" max={a} step="1" value={intersect} onChange={e => setIntersect(parseFloat(e.target.value))} className="w-full accent-rose-500" />
          <span className="text-xs font-mono">{intersect}</span></div>
      </div>
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
        <p className="text-xs text-indigo-700 dark:text-indigo-300 font-mono">
          
                            {t('lab.m9theorems_a_b_1')} {aUb}<br />
          
                            {t('lab.m9theorems_a_b_c')} {aUb} + {c} = <strong>{aUb + c}</strong><br />
          
                            {t('lab.m9theorems_b_c')} {bUc}<br />
          
                            {t('lab.m9theorems_a_b_c_1')} {a} + {bUc} = <strong>{a + bUc - 0}</strong><br />
          
                            {t('lab.m9theorems_result')} <strong>{t('lab.m9theorems_a_b_c_a_b_c')} {aUb + c}</strong> ✓
        </p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
          placeholder={t('lab.m9theorems_a_b_c_2')} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-indigo-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m9theorems_check')}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" />  {t('lab.m9theorems_correct_a_b_c_a_b_c')} {aUb + c}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" />  {t('lab.m9theorems_how_many_unique_elements_total')}</p>}
    </div>
  );
}

// --- Distributive Union over Intersection card visual ---
function DistributeUnionInterInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [aSize, setASize] = useState(5);
  const [bSize, setBSize] = useState(4);
  const [cSize, setCSize] = useState(3);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  // Simplified: show with examples
  const handleCheck = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - (aSize + bSize + cSize)) < 1 ? 'correct' : 'incorrect');
    if (Math.abs(val - (aSize + bSize + cSize)) < 1) onAnswer(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div><label className="text-xs font-semibold">{t('lab.m9theorems_set_a')}</label>
          <input type="range" min="2" max="8" step="1" value={aSize} onChange={e => setASize(parseFloat(e.target.value))} className="w-full accent-blue-500" />
          <span className="text-xs">{'♥'.repeat(aSize)}</span></div>
        <div><label className="text-xs font-semibold">{t('lab.m9theorems_set_b')}</label>
          <input type="range" min="2" max="8" step="1" value={bSize} onChange={e => setBSize(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
          <span className="text-xs">{'♦'.repeat(bSize)}</span></div>
        <div><label className="text-xs font-semibold">{t('lab.m9theorems_set_c')}</label>
          <input type="range" min="2" max="8" step="1" value={cSize} onChange={e => setCSize(parseFloat(e.target.value))} className="w-full accent-amber-500" />
          <span className="text-xs">{'♣'.repeat(cSize)}</span></div>
      </div>
      <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-3 border border-sky-200 dark:border-sky-800">
        <p className="text-xs text-sky-700 dark:text-sky-300">
          <strong>{t('lab.m9theorems_theorem')}</strong>  {t('lab.m9theorems_a_b_c_a_b_a_c')}<br />
          <span className="italic mt-1 block">{t('lab.m9theorems_elements_in_a_b_c_are_those_in')}<br />
          
                                {t('lab.m9theorems_elements_in_a_b_a_c_are_those_')}<br />
          
                                {t('lab.m9theorems_in_both_cases_an_element_is_in')}</span>
        </p>
      </div>
    </div>
  );
}

// --- Quotient Identities: tan = sin/cos ---
function QuotientIdentityInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [angle, setAngle] = useState(30);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const rad = angle * Math.PI / 180;
  const sinVal = Math.sin(rad);
  const cosVal = Math.cos(rad);
  const tanVal = Math.tan(rad);
  const sinDivCos = sinVal / cosVal;

  const handleCheck = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - tanVal) < 0.01 ? 'correct' : 'incorrect');
    if (Math.abs(val - tanVal) < 0.01) onAnswer(true);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.m9theorems_angle')}</label>
        <input type="range" min="0" max="89" step="1" value={angle} onChange={e => { setAngle(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-yellow-500" />
        <span className="text-sm font-mono text-yellow-600">θ = {angle}°</span>
      </div>
      {/* Right triangle visual */}
      <div className="relative h-28 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
        <svg viewBox="0 0 200 120" className="w-full h-full">
          <polygon points="20,100 180,100 20,20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-500" />
          <text x="50" y="80" className="text-[10px] fill-slate-500">{t('lab.m9theorems_opposite')}</text>
          <text x="100" y="112" className="text-[10px] fill-slate-500">{t('lab.m9theorems_adjacent')}</text>
          <text x="12" y="40" className="text-[10px] fill-slate-500">{t('lab.m9theorems_hyp')}</text>
          <text x="25" y="108" className="text-[10px] fill-yellow-600">θ</text>
        </svg>
      </div>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
        <p className="text-xs text-yellow-700 dark:text-yellow-300 font-mono">
          
                            {t('lab.m9theorems_sin')}{angle}°) = {sinVal.toFixed(4)}<br />
          
                            {t('lab.m9theorems_cos')}{angle}°) = {cosVal.toFixed(4)}<br />
          
                            {t('lab.m9theorems_tan')}{angle}°) = {tanVal.toFixed(4)}<br />
          
                            {t('lab.m9theorems_sin_cos')} {sinVal.toFixed(4)} / {cosVal.toFixed(4)} = <strong>{sinDivCos.toFixed(4)}</strong>  {t('lab.m9theorems_tan_1')}{angle}°) ✓<br />
          
                            {t('lab.m9theorems_cot_cos_sin')} {cosVal.toFixed(4)} / {sinVal.toFixed(4)} = <strong>{(cosVal/sinVal).toFixed(4)}</strong>
        </p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
          placeholder={t('lab.m9theorems_tan_2')} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-yellow-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m9theorems_check')}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" />  {t('lab.m9theorems_correct_tan_sin_cos')}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" />  {t('lab.m9theorems_try_tan_sin_cos')}</p>}
    </div>
  );
}

// --- Pythagorean Identity: sin² + cos² = 1 ---
function PythagoreanIdentityInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [angle, setAngle] = useState(37);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const rad = angle * Math.PI / 180;
  const sinVal = Math.sin(rad);
  const cosVal = Math.cos(rad);
  const sin2cos2 = sinVal * sinVal + cosVal * cosVal;

  const handleCheck = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - sin2cos2) < 0.001 ? 'correct' : 'incorrect');
    if (Math.abs(val - sin2cos2) < 0.001) onAnswer(true);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.m9theorems_angle')}</label>
        <input type="range" min="0" max="360" step="1" value={angle} onChange={e => { setAngle(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" />
        <span className="text-sm font-mono text-emerald-600">θ = {angle}°</span>
      </div>
      {/* Unit circle visualization */}
      <div className="relative h-32 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
        <svg viewBox="0 0 160 120" className="w-full h-full">
          <circle cx="80" cy="60" r="45" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-600" />
          <line x1="80" y1="60" x2={80 + 45 * Math.cos(rad)} y2={60 - 45 * Math.sin(rad)} stroke="#059669" strokeWidth="1.5" />
          <line x1="80" y1="60" x2={80 + Math.abs(45 * Math.cos(rad))} y2={60} stroke="#3b82f6" strokeWidth="1" />
          <line x1={80 + 45 * Math.cos(rad)} y1={60} x2={80 + 45 * Math.cos(rad)} y2={60 - 45 * Math.sin(rad)} stroke="#f59e0b" strokeWidth="1" />
          <text x="40" y="10" className="text-[8px] fill-emerald-600">{t('lab.m9theorems_sin_1')}</text>
          <text x="110" y="58" className="text-[8px] fill-blue-600">{t('lab.m9theorems_cos_1')}</text>
        </svg>
      </div>
      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
        <p className="text-xs text-emerald-700 dark:text-emerald-300 font-mono">
          
                            {t('lab.m9theorems_sin_2')}{angle}{t('lab.m9theorems_cos_2')}{angle}°) = ({sinVal.toFixed(4)})² + ({cosVal.toFixed(4)})²<br />
          = {(sinVal * sinVal).toFixed(4)} + {(cosVal * cosVal).toFixed(4)} = <strong>{sin2cos2.toFixed(6)}</strong>
        </p>
        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 italic">{t('lab.m9theorems_no_matter_the_angle_sin_cos_al')}</p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
          placeholder={t('lab.m9theorems_sin_cos_1')} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-emerald-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m9theorems_check')}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" />  {t('lab.m9theorems_correct_sin_cos_1_always')}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" />  {t('lab.m9theorems_the_answer_is_always_1_try_aga')}</p>}
    </div>
  );
}

// --- Distance Formula ---
function DistanceFormulaInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [x1, setX1] = useState(1);
  const [y1, setY1] = useState(2);
  const [x2, setX2] = useState(7);
  const [y2, setY2] = useState(6);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const handleCheck = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - distance) < 0.1 ? 'correct' : 'incorrect');
    if (Math.abs(val - distance) < 0.1) onAnswer(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.m9theorems_p_x_y')}</label>
          <div className="grid grid-cols-2 gap-2">
            <div><span className="text-[10px]">x₁</span>
              <input type="range" min="-10" max="10" step="1" value={x1} onChange={e => { setX1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
              <span className="text-xs">{x1}</span></div>
            <div><span className="text-[10px]">y₁</span>
              <input type="range" min="-10" max="10" step="1" value={y1} onChange={e => { setY1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
              <span className="text-xs">{y1}</span></div>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('lab.m9theorems_p_x_y_1')}</label>
          <div className="grid grid-cols-2 gap-2">
            <div><span className="text-[10px]">x₂</span>
              <input type="range" min="-10" max="10" step="1" value={x2} onChange={e => { setX2(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-orange-500" />
              <span className="text-xs">{x2}</span></div>
            <div><span className="text-[10px]">y₂</span>
              <input type="range" min="-10" max="10" step="1" value={y2} onChange={e => { setY2(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-orange-500" />
              <span className="text-xs">{y2}</span></div>
          </div>
        </div>
      </div>
      {/* Coordinate plane visual */}
      <div className="relative h-36 bg-white dark:bg-[#121212] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
        <svg viewBox="0 0 200 150" className="w-full h-full">
          <line x1="100" y1="0" x2="100" y2="150" stroke="#cbd5e1" strokeWidth="0.5" />
          <line x1="0" y1="75" x2="200" y2="75" stroke="#cbd5e1" strokeWidth="0.5" />
          {/* P1 */}
          <circle cx={100 + x1 * 8} cy={75 - y1 * 8} r="4" fill="#3b82f6" />
          <text x={100 + x1 * 8 + 5} y={75 - y1 * 8 + 3} className="text-[8px] fill-blue-600">P₁</text>
          {/* P2 */}
          <circle cx={100 + x2 * 8} cy={75 - y2 * 8} r="4" fill="#f97316" />
          <text x={100 + x2 * 8 + 5} y={75 - y2 * 8 + 3} className="text-[8px] fill-orange-600">P₂</text>
          {/* Line */}
          <line x1={100 + x1 * 8} y1={75 - y1 * 8} x2={100 + x2 * 8} y2={75 - y2 * 8} stroke="#8b5cf6" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3 border border-violet-200 dark:border-violet-800">
        <p className="text-xs text-violet-700 dark:text-violet-300 font-mono">
          
                            {t('lab.m9theorems_d')}{x2} − {x1})² + ({y2} − {y1})²)<br />
          = √({dx}² + {dy}²) = √({dx*dx} + {dy*dy}) = √{dx*dx + dy*dy} = <strong>{distance.toFixed(2)}</strong>
        </p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
          placeholder={t('lab.m9theorems_distance')} step="0.1" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-violet-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m9theorems_check')}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" />  {t('lab.m9theorems_correct_d')} {distance.toFixed(2)}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" />  {t('lab.m9theorems_try_d_x_x_y_y')}</p>}
    </div>
  );
}

// --- Slope-Intercept: y = mx + c ---
function SlopeInterceptInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [m, setM] = useState(2);
  const [c, setC] = useState(1);
  const [xVal, setXVal] = useState(3);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const yResult = m * xVal + c;

  const handleCheck = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - yResult) < 0.1 ? 'correct' : 'incorrect');
    if (Math.abs(val - yResult) < 0.1) onAnswer(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div><label className="text-xs font-semibold">{t('lab.m9theorems_slope_m')}</label>
          <input type="range" min="-5" max="5" step="0.5" value={m} onChange={e => { setM(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-amber-500" />
          <span className="text-xs">{m}</span></div>
        <div><label className="text-xs font-semibold">{t('lab.m9theorems_y_intercept_c')}</label>
          <input type="range" min="-5" max="5" step="0.5" value={c} onChange={e => { setC(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-amber-500" />
          <span className="text-xs">{c}</span></div>
        <div><label className="text-xs font-semibold">{t('lab.m9theorems_x_value')}</label>
          <input type="range" min="-10" max="10" step="0.5" value={xVal} onChange={e => { setXVal(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-amber-500" />
          <span className="text-xs">{xVal}</span></div>
      </div>
      <div className="relative h-36 bg-white dark:bg-[#121212] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
        <svg viewBox="0 0 200 150" className="w-full h-full">
          <line x1="100" y1="0" x2="100" y2="150" stroke="#cbd5e1" strokeWidth="0.5" />
          <line x1="0" y1="75" x2="200" y2="75" stroke="#cbd5e1" strokeWidth="0.5" />
          {/* Plot points of the line */}
          {Array.from({length: 21}, (_, i) => {
            const x = i - 10;
            const y = m * x + c;
            const px = 100 + x * 8;
            const py = 75 - y * 8;
            return py >= 0 && py <= 150 ? (
              <circle key={i} cx={px} cy={py} r="1.5" fill="#d97706" />
            ) : null;
          })}
          {/* Show point where x = xVal */}
          <circle cx={100 + xVal * 8} cy={75 - yResult * 8} r="4" fill="#dc2626" />
          <text x={100 + xVal * 8 + 5} y={75 - yResult * 8 + 3} className="text-[8px] fill-red-600">({xVal},{yResult})</text>
        </svg>
      </div>
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
        <p className="text-xs text-amber-700 dark:text-amber-300 font-mono">
          
                            {t('lab.m9theorems_y_mx_c')} {m} × {xVal} + {c} = <strong>{yResult}</strong>
        </p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
          placeholder={t('lab.m9theorems_y_5')} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-amber-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m9theorems_check')}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" />  {t('lab.m9theorems_correct_y')} {yResult}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" />  {t('lab.m9theorems_try_y_mx_c')}</p>}
    </div>
  );
}

// --- Point-Slope Form ---
function PointSlopeInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [m, setM] = useState(1.5);
  const [x1, setX1] = useState(2);
  const [y1, setY1] = useState(3);
  const [x, setX] = useState(5);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const y = m * (x - x1) + y1;

  const handleCheck = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - y) < 0.1 ? 'correct' : 'incorrect');
    if (Math.abs(val - y) < 0.1) onAnswer(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        <div><label className="text-[10px] font-semibold">m</label>
          <input type="range" min="-3" max="3" step="0.5" value={m} onChange={e => { setM(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
          <span className="text-xs">{m}</span></div>
        <div><label className="text-[10px] font-semibold">x₁</label>
          <input type="range" min="-5" max="5" step="1" value={x1} onChange={e => { setX1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
          <span className="text-xs">{x1}</span></div>
        <div><label className="text-[10px] font-semibold">y₁</label>
          <input type="range" min="-5" max="5" step="1" value={y1} onChange={e => { setY1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
          <span className="text-xs">{y1}</span></div>
        <div><label className="text-[10px] font-semibold">x</label>
          <input type="range" min="-5" max="10" step="0.5" value={x} onChange={e => { setX(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
          <span className="text-xs">{x}</span></div>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-700 dark:text-blue-300 font-mono">
          
                            {t('lab.m9theorems_y_y_m_x_x')}<br />
          
                            {t('lab.m9theorems_y')} {y1} = {m}({x} − {x1})<br />
          
                            {t('lab.m9theorems_y_1')} {m}({x - x1}) + {y1} = <strong>{y}</strong>
        </p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
          placeholder={t('lab.m9theorems_y_5')} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-blue-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m9theorems_check')}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" />  {t('lab.m9theorems_correct_y')} {y}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" />  {t('lab.m9theorems_try_y_y_m_x_x')}</p>}
    </div>
  );
}

// --- Two-Point Form ---
function TwoPointFormInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [x1, setX1] = useState(1);
  const [y1, setY1] = useState(2);
  const [x2, setX2] = useState(4);
  const [y2, setY2] = useState(8);
  const [x, setX] = useState(3);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const slope = (y2 - y1) / (x2 - x1);
  const y = slope * (x - x1) + y1;

  const handleCheck = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - y) < 0.1 ? 'correct' : 'incorrect');
    if (Math.abs(val - y) < 0.1) onAnswer(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div><label className="text-xs font-semibold">P₁</label>
          <div className="grid grid-cols-2 gap-1">
            <div><span className="text-[10px]">x₁</span>
              <input type="range" min="-5" max="5" step="1" value={x1} onChange={e => setX1(parseFloat(e.target.value))} className="w-full accent-pink-500" />
              <span className="text-xs">{x1}</span></div>
            <div><span className="text-[10px]">y₁</span>
              <input type="range" min="-5" max="5" step="1" value={y1} onChange={e => setY1(parseFloat(e.target.value))} className="w-full accent-pink-500" />
              <span className="text-xs">{y1}</span></div>
          </div>
        </div>
        <div><label className="text-xs font-semibold">P₂</label>
          <div className="grid grid-cols-2 gap-1">
            <div><span className="text-[10px]">x₂</span>
              <input type="range" min="-5" max="5" step="1" value={x2} onChange={e => setX2(parseFloat(e.target.value))} className="w-full accent-pink-500" />
              <span className="text-xs">{x2}</span></div>
            <div><span className="text-[10px]">y₂</span>
              <input type="range" min="-5" max="5" step="1" value={y2} onChange={e => setY2(parseFloat(e.target.value))} className="w-full accent-pink-500" />
              <span className="text-xs">{y2}</span></div>
          </div>
        </div>
        <div><label className="text-[10px] font-semibold">{t('lab.m9theorems_x_query')}</label>
          <input type="range" min="-5" max="10" step="0.5" value={x} onChange={e => setX(parseFloat(e.target.value))} className="w-full accent-pink-500" />
          <span className="text-xs">{x}</span></div>
      </div>
      <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-3 border border-pink-200 dark:border-pink-800">
        <p className="text-xs text-pink-700 dark:text-pink-300 font-mono">
          
                            {t('lab.m9theorems_slope_m_1')}{y2}−{y1})/({x2}−{x1}) = {slope.toFixed(2)}<br />
          
                            {t('lab.m9theorems_y')} {y1} = {slope.toFixed(2)}{t('lab.m9theorems_x')} {x1})<br />
          
                            {t('lab.m9theorems_at_x')} {x}{t('lab.m9theorems_y_2')} {slope.toFixed(2)}({x}−{x1}) + {y1} = <strong>{y.toFixed(2)}</strong>
        </p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
          placeholder={t('lab.m9theorems_y_5')} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-pink-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m9theorems_check')}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" />  {t('lab.m9theorems_correct_y')} {y.toFixed(2)}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" />  {t('lab.m9theorems_try_y_y_y_y_x_x_x_x')}</p>}
    </div>
  );
}

// --- Two-Intercept Form ---
function TwoInterceptInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [a, setA] = useState(4);
  const [b, setB] = useState(3);
  const [x, setX] = useState(2);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const y = b * (1 - x / a);

  const handleCheck = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - y) < 0.1 ? 'correct' : 'incorrect');
    if (Math.abs(val - y) < 0.1) onAnswer(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div><label className="text-xs font-semibold">{t('lab.m9theorems_x_intercept_a')}</label>
          <input type="range" min="1" max="10" step="0.5" value={a} onChange={e => { setA(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-indigo-500" />
          <span className="text-xs">{a}</span></div>
        <div><label className="text-xs font-semibold">{t('lab.m9theorems_y_intercept_b')}</label>
          <input type="range" min="1" max="10" step="0.5" value={b} onChange={e => { setB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-indigo-500" />
          <span className="text-xs">{b}</span></div>
        <div><label className="text-xs font-semibold">{t('lab.m9theorems_x_value')}</label>
          <input type="range" min="0" max="10" step="0.5" value={x} onChange={e => { setX(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-indigo-500" />
          <span className="text-xs">{x}</span></div>
      </div>
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
        <p className="text-xs text-indigo-700 dark:text-indigo-300 font-mono">
          x/{a}  {t('lab.m9theorems_y_3')}{b} = 1<br />
          
                            {t('lab.m9theorems_at_x')} {x}: {x}/{a}  {t('lab.m9theorems_y_3')}{b} = 1<br />
          y/{b} = 1 − {x}/{a} = {(1 - x/a).toFixed(3)}<br />
          
                            {t('lab.m9theorems_y_1')} {(1 - x/a).toFixed(3)} × {b} = <strong>{y.toFixed(2)}</strong>
        </p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
          placeholder={t('lab.m9theorems_y_5')} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-indigo-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m9theorems_check')}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" />  {t('lab.m9theorems_correct_y')} {y.toFixed(2)}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" />  {t('lab.m9theorems_try_x_a_y_b_1')}</p>}
    </div>
  );
}

// --- Normal Form ---
function NormalFormInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [alpha, setAlpha] = useState(45);
  const [p, setP] = useState(5);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const rad = alpha * Math.PI / 180;
  const cosA = Math.cos(rad);
  const sinA = Math.sin(rad);

  const handleCheck = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    // Check if user entered cos term or sin term
    setCheckResult(Math.abs(val - p) < 0.1 ? 'correct' : 'incorrect');
    if (Math.abs(val - p) < 0.1) onAnswer(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-semibold">{t('lab.m9theorems_inclination')}</label>
          <input type="range" min="0" max="90" step="1" value={alpha} onChange={e => { setAlpha(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-orange-500" />
          <span className="text-xs">{alpha}°</span></div>
        <div><label className="text-xs font-semibold">{t('lab.m9theorems_p_perp_distance')}</label>
          <input type="range" min="1" max="10" step="0.5" value={p} onChange={e => { setP(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-orange-500" />
          <span className="text-xs">{p}</span></div>
      </div>
      <div className="relative h-28 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <line x1="20" y1={100 - 10 * p} x2="180" y2={100 - 10 * p - 160 * Math.tan(rad) * 0.2} stroke="#f97316" strokeWidth="1.5" />
          <line x1="20" y1="100" x2="20" y2={100 - 10 * p} stroke="#8b5cf6" strokeWidth="1" strokeDasharray="3,3" />
          <text x="10" y={100 - 5 * p} className="text-[8px] fill-violet-600">p={p}</text>
          <text x="60" y="20" className="text-[8px] fill-orange-600">α={alpha}°</text>
        </svg>
      </div>
      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
        <p className="text-xs text-orange-700 dark:text-orange-300 font-mono">
          
                            {t('lab.m9theorems_x_cos_y_sin_p')}<br />
          
                            {t('lab.m9theorems_x_cos')}{alpha}{t('lab.m9theorems_y_sin')}{alpha}°) = {p}<br />
          x({cosA.toFixed(4)}{t('lab.m9theorems_y_4')}{sinA.toFixed(4)}) = {p}
        </p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
          placeholder={t('lab.m9theorems_p')} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-orange-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m9theorems_check')}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" />  {t('lab.m9theorems_correct_p')} {p}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" />  {t('lab.m9theorems_the_perpendicular_distance_p')} {p}</p>}
    </div>
  );
}

// --- Angle Between Two Lines ---
function AngleBetweenLinesInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [m1, setM1] = useState(0.5);
  const [m2, setM2] = useState(2);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const tanTheta = Math.abs((m2 - m1) / (1 + m1 * m2));
  const thetaRad = Math.atan(tanTheta);
  const thetaDeg = thetaRad * 180 / Math.PI;

  const handleCheck = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - thetaDeg) < 0.5 ? 'correct' : 'incorrect');
    if (Math.abs(val - thetaDeg) < 0.5) onAnswer(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-semibold">{t('lab.m9theorems_slope_m_2')}</label>
          <input type="range" min="-3" max="3" step="0.1" value={m1} onChange={e => { setM1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" />
          <span className="text-xs">{m1}</span></div>
        <div><label className="text-xs font-semibold">{t('lab.m9theorems_slope_m_3')}</label>
          <input type="range" min="-3" max="3" step="0.1" value={m2} onChange={e => { setM2(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" />
          <span className="text-xs">{m2}</span></div>
      </div>
      <div className="relative h-28 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <line x1="20" y1="80" x2="180" y2={80 - 60 * m1 * 0.5} stroke="#3b82f6" strokeWidth="1.5" />
          <line x1="20" y1="80" x2="180" y2={80 - 60 * m2 * 0.5} stroke="#ef4444" strokeWidth="1.5" />
          <text x="130" y={80 - 60 * m1 * 0.5} className="text-[8px] fill-blue-600">{t('lab.m9theorems_m_2')}{m1}</text>
          <text x="130" y={80 - 60 * m2 * 0.5 + 10} className="text-[8px] fill-red-600">{t('lab.m9theorems_m_3')}{m2}</text>
        </svg>
      </div>
      <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-3 border border-rose-200 dark:border-rose-800">
        <p className="text-xs text-rose-700 dark:text-rose-300 font-mono">
          
                            {t('lab.m9theorems_tan_m_m_1_m_m')}<br />
          = |({m2} − {m1}) / (1 + {m1}×{m2})| = |{m2 - m1} / {1 + m1 * m2}|<br />
          θ = <strong>{thetaDeg.toFixed(1)}°</strong>
        </p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
          placeholder={t('lab.m9theorems_degrees')} className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-rose-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.m9theorems_check')}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" />  {t('lab.m9theorems_correct')} {thetaDeg.toFixed(1)}°</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" />  {t('lab.m9theorems_try_tan_m_m_1_m_m')}</p>}
    </div>
  );
}

// ========== Theorem Modules ==========

const THEOREMS: TheoremModule[] = [
  // === Unit 2: Logarithms ===
  {
    id: 'product-log',
    icon: Hash,
    title: 'Product Law of Logarithms',
    formula: 'log_b (mn) = log_b m + log_b n',
    formulaDesc: 'The log of a product equals the sum of the logs.',
    color: 'teal',
    steps: [
      { label: 'Set up variables', content: '🧮 You\'re a sound engineer mixing a live concert. The microphone picks up sound at power m = 4 units, and the amplifier adds n = 8 units. To figure out the total gain, you reach for logarithms. Let log_b m = x and log_b n = y — these represent the "logarithmic power" of each signal.' },
      { label: 'Convert to exponentials', content: 'Converting back: m = b^x and n = b^y. In our concert, if b = 2 (binary amplification), then m = 2^x and n = 2^y. The exponential form reveals the actual multipliers hiding behind the log values.' },
      { label: 'Multiply the equations', content: 'Now multiply m × n: mn = b^x · b^y. When multiplying powers with the same base, we ADD the exponents: mn = b^(x+y). This is the key insight — multiplication in the real world becomes addition in log world.' },
      { label: 'Convert back to logs', content: 'Convert mn = b^(x+y) back to logarithmic form: log_b(mn) = x + y. Substitute x = log_b m and y = log_b n, and you get: log_b(mn) = log_b m + log_b n. The total sound power (product) equals the sum of the individual log powers. This is why the Richter scale for earthquakes uses logs — a magnitude 8 earthquake isn\'t twice as powerful as a magnitude 4, it\'s 10,000 times!' },
    ],
    interactive: ProductLogInteractive,
  },
  {
    id: 'quotient-log',
    icon: Hash,
    title: 'Quotient Law of Logarithms',
    formula: 'log_b (m/n) = log_b m − log_b n',
    formulaDesc: 'The log of a quotient equals the difference of the logs.',
    color: 'purple',
    steps: [
      { label: 'Set up variables', content: '🔬 You\'re a chemist measuring the concentration of a solution before and after dilution. The initial concentration is m = 32 M (molar) and after dilution it drops to n = 4 M. The ratio m/n tells you the dilution factor. Let\'s set log_b m = x and log_b n = y.' },
      { label: 'Convert to exponentials', content: 'Convert to exponential form: m = b^x and n = b^y. With base b = 10 (common log), we have 32 = 10^x and 4 = 10^y. The exponents x and y are the powers of 10 that give us these concentrations.' },
      { label: 'Divide the equations', content: 'Divide m by n: m/n = b^x / b^y. When dividing powers with the same base, we SUBTRACT the exponents: m/n = b^(x−y). Division in the real world becomes subtraction in log world — this is the magic that makes slide rules work!' },
      { label: 'Convert back to logs', content: 'Convert m/n = b^(x−y) to log form: log_b(m/n) = x − y. Substituting back: log_b(m/n) = log_b m − log_b n. The dilution factor in log terms is just the difference of the individual log concentrations. This is why pH = −log[H⁺] — a solution at pH 3 is 100× more acidic than pH 5, because 10^(5−3) = 10² = 100!' },
    ],
    interactive: QuotientLogInteractive,
  },
  {
    id: 'power-log',
    icon: Hash,
    title: 'Power Law of Logarithms',
    formula: 'log_b m^n = n log_b m',
    formulaDesc: 'The log of a power equals the exponent times the log of the base.',
    color: 'rose',
    steps: [
      { label: 'Set up the equation', content: '💰 You\'re an investor watching your money grow. Your initial investment of m = $3,000 grows at b = 2× per year. After n = 4 years, your money multiplies by 2^4. Let log_b m = x, meaning b^x = m.' },
      { label: 'Convert m to exponential', content: 'Convert m = b^x. Your initial $3,000 = 2^x means x = log₂(3000) ≈ 11.55 — the "doubling power" of your investment.' },
      { label: 'Raise both sides to power n', content: 'Raise both sides to the n-th power: m^n = (b^x)^n. Using the power of a power rule: m^n = b^(nx). Your investment after 4 years: 3000^4? No! Wait — m^n means (initial money) raised to n, which is different from compound interest. This is a mathematical power, not financial.' },
      { label: 'Convert to log form', content: 'Converting m^n = b^(nx) to log form: log_b(m^n) = nx. Substituting x = log_b m: log_b(m^n) = n log_b m. The exponent "pulls down" in front of the log! This is why astronomers love logs: the distance to the farthest galaxies is 10^26 meters — log₁₀(10^26) = 26 × log₁₀(10) = 26. A 26 on the log scale is easy to write and compare!' },
    ],
    interactive: PowerLogInteractive,
  },
  {
    id: 'change-base',
    icon: Infinity,
    title: 'Change of Base Law',
    formula: 'log_a m = log_b m · log_a b',
    formulaDesc: 'Convert a logarithm from one base to any other base.',
    color: 'cyan',
    steps: [
      { label: 'Set up the equation', content: '📱 You\'re programming a calculator that only has log₁₀ (common log) and ln (natural log) buttons, but you need to compute log₂(8). This is the classic problem the Change of Base Law solves. Let log_b m = x, where b is the target base and m is the number.' },
      { label: 'Convert to exponentials', content: 'Convert: m = b^x. We want to express this in terms of a known base a. Taking log_a of both sides: log_a m = log_a(b^x). Now we can use the Power Law in reverse!' },
      { label: 'Apply the Power Law', content: 'log_a m = x · log_a b. The exponent x "pulls down" in front. Now isolate x: x = log_a m / log_a b.' },
      { label: 'Substitute back', content: 'Since x = log_b m, we get: log_b m = log_a m / log_a b. That\'s the formula! So log₂(8) = log₁₀(8) / log₁₀(2) = 0.9031 / 0.3010 = 3. Indeed, 2³ = 8. This is THE most practical log law because it lets you compute ANY log with just the log₁₀ or ln button on your calculator!' },
    ],
    interactive: ChangeBaseInteractive,
  },

  // === Unit 3: Sets and Relations ===
  {
    id: 'union-associative',
    icon: PieChart,
    title: 'Associative Property of Union',
    formula: '(A ∪ B) ∪ C = A ∪ (B ∪ C)',
    formulaDesc: 'The union operation is associative — grouping doesn\'t matter.',
    color: 'indigo',
    steps: [
      { label: 'Let x be an element', content: '🏟️ Imagine three groups of students at a school fair: Group A runs the food stall, Group B runs games, and Group C runs the raffle. Let x be any student. If x is in (A ∪ B) ∪ C, then...' },
      { label: 'Apply union definition', content: 'x ∈ (A ∪ B) ∪ C means x ∈ (A ∪ B) OR x ∈ C. And x ∈ (A ∪ B) means x ∈ A OR x ∈ B. So overall: (x ∈ A OR x ∈ B) OR x ∈ C.' },
      { label: 'Re-group the ORs', content: 'The logical OR is associative — (P OR Q) OR R = P OR (Q OR R). So (x ∈ A OR x ∈ B) OR x ∈ C = x ∈ A OR (x ∈ B OR x ∈ C). The school fair doesn\'t care how you group the teams — either way, x is part of the combined group!' },
      { label: 'Convert back to sets', content: 'x ∈ A OR (x ∈ B OR x ∈ C) means x ∈ A OR x ∈ (B ∪ C), which means x ∈ A ∪ (B ∪ C). So (A ∪ B) ∪ C ⊆ A ∪ (B ∪ C). Proving the reverse containment works the same way. Thus (A ∪ B) ∪ C = A ∪ (B ∪ C). Grouping doesn\'t matter — the total union is the same!' },
    ],
    interactive: UnionAssociativeInteractive,
  },
  {
    id: 'intersection-associative',
    icon: PieChart,
    title: 'Associative Property of Intersection',
    formula: '(A ∩ B) ∩ C = A ∩ (B ∩ C)',
    formulaDesc: 'The intersection operation is also associative.',
    color: 'indigo',
    steps: [
      { label: 'Let y be an element', content: '🎭 Three clubs at school: Art Club A, Music Club B, and Drama Club C. A triple threat student does all three. Let y ∈ (A ∩ B) ∩ C.' },
      { label: 'Apply intersection definition', content: 'y ∈ (A ∩ B) ∩ C means y ∈ (A ∩ B) AND y ∈ C. And y ∈ (A ∩ B) means y ∈ A AND y ∈ B. So: (y ∈ A AND y ∈ B) AND y ∈ C.' },
      { label: 'Re-group the ANDs', content: 'Logical AND is associative: (P AND Q) AND R = P AND (Q AND R). So (y ∈ A AND y ∈ B) AND y ∈ C = y ∈ A AND (y ∈ B AND y ∈ C). A student who\'s in all three clubs is in all three — the grouping doesn\'t change anything!' },
      { label: 'Convert back to sets', content: 'y ∈ A AND (y ∈ B AND y ∈ C) means y ∈ A AND y ∈ (B ∩ C), which means y ∈ A ∩ (B ∩ C). So (A ∩ B) ∩ C ⊆ A ∩ (B ∩ C). Reverse containment proves equality. Thus (A ∩ B) ∩ C = A ∩ (B ∩ C). Just like union, intersection is associative!' },
    ],
    interactive: UnionAssociativeInteractive,
  },
  {
    id: 'distributive-union-inter',
    icon: PieChart,
    title: 'Distributive: Union over Intersection',
    formula: 'A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C)',
    formulaDesc: 'Union distributes over intersection, like multiplication over addition.',
    color: 'sky',
    steps: [
      { label: 'Let x ∈ A ∪ (B ∩ C)', content: '🧩 Think of a school prize: winners get a free period (A) OR they get both extra recess AND homework pass (B ∩ C).' },
      { label: 'Break down the OR', content: 'x ∈ A OR x ∈ (B ∩ C). That means either x ∈ A, OR (x ∈ B AND x ∈ C).' },
      { label: 'Use logical distribution', content: '(P OR Q) AND (P OR R) is logically equivalent to P OR (Q AND R). So: (x ∈ A OR x ∈ B) AND (x ∈ A OR x ∈ C).' },
      { label: 'Convert back to sets', content: '(x ∈ A ∪ B) AND (x ∈ A ∪ C) means x ∈ (A ∪ B) ∩ (A ∪ C). So A ∪ (B ∩ C) ⊆ (A ∪ B) ∩ (A ∪ C). The reverse containment also holds. Just like 2×(3+4) = 2×3 + 2×4, set union distributes over intersection!' },
    ],
    interactive: DistributeUnionInterInteractive,
  },
  {
    id: 'distributive-inter-union',
    icon: PieChart,
    title: 'Distributive: Intersection over Union',
    formula: 'A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)',
    formulaDesc: 'Intersection also distributes over union.',
    color: 'sky',
    steps: [
      { label: 'Let x ∈ A ∩ (B ∪ C)', content: '🏫 School library rule: you need a library card (A) AND (either a valid ID OR a teacher note) (B ∪ C).' },
      { label: 'Break down the AND', content: 'x ∈ A AND x ∈ (B ∪ C). That means x ∈ A AND (x ∈ B OR x ∈ C).' },
      { label: 'Use logical distribution', content: 'P AND (Q OR R) = (P AND Q) OR (P AND R). So: (x ∈ A AND x ∈ B) OR (x ∈ A AND x ∈ C).' },
      { label: 'Convert back to sets', content: 'x ∈ (A ∩ B) OR x ∈ (A ∩ C) means x ∈ (A ∩ B) ∪ (A ∩ C). So A ∩ (B ∪ C) ⊆ (A ∩ B) ∪ (A ∩ C). The reverse direction similarly proves equality. Intersection distributes over union, just like the distributive law in algebra!' },
    ],
    interactive: DistributeUnionInterInteractive,
  },

  // === Unit 6: Trigonometry ===
  {
    id: 'quotient-identities',
    icon: Move3d,
    title: 'Quotient Trigonometric Identities',
    formula: 'tan θ = sin θ / cos θ,  cot θ = cos θ / sin θ',
    formulaDesc: 'Tangent is sine divided by cosine; cotangent is the reciprocal.',
    color: 'yellow',
    steps: [
      { label: 'Consider a right triangle', content: '🔺 You\'re standing at the base of a building, looking up at the top. The angle of elevation is θ. The height of the building is the "opposite" side, and your distance from it is the "adjacent" side. The hypotenuse is the line of sight.' },
      { label: 'Recall basic definitions', content: 'sin θ = opposite / hypotenuse = a/c. cos θ = adjacent / hypotenuse = b/c. tan θ = opposite / adjacent = a/b. These three ratios define any right triangle.' },
      { label: 'Divide sin by cos', content: 'sin θ / cos θ = (a/c) / (b/c) = (a/c) × (c/b) = a/b. The hypotenuse (c) cancels out! And a/b is exactly tan θ.' },
      { label: 'Final identities', content: 'Therefore: tan θ = sin θ / cos θ and cot θ = cos θ / sin θ. These are the Quotient Identities. They connect the primary ratios (sin, cos) to the secondary ones (tan, cot). This is why on a unit circle, the tangent at angle θ is the y-coordinate divided by the x-coordinate!' },
    ],
    interactive: QuotientIdentityInteractive,
  },
  {
    id: 'pythagorean-identities',
    icon: Move3d,
    title: 'Pythagorean Trigonometric Identities',
    formula: 'sin²θ + cos²θ = 1',
    formulaDesc: 'The Pythagorean Theorem restated in trigonometric form.',
    color: 'emerald',
    steps: [
      { label: 'Start with the Pythagorean Theorem', content: '📐 In any right triangle with legs a, b and hypotenuse c: a² + b² = c². This is the most famous relationship in all of geometry, discovered over 2,500 years ago.' },
      { label: 'Express in trig terms', content: 'sin θ = a/c and cos θ = b/c. Square both: sin²θ = a²/c² and cos²θ = b²/c².' },
      { label: 'Add the squares', content: 'sin²θ + cos²θ = a²/c² + b²/c² = (a² + b²)/c² = c²/c² = 1. The triangle\'s legs and hypotenuse cancel out perfectly!' },
      { label: 'The identity is born', content: 'sin²θ + cos²θ = 1 — it doesn\'t matter what θ is, this always holds true! From this, we can derive: sec²θ − tan²θ = 1 and cosec²θ − cot²θ = 1. These are the Pythagorean Identities, the most fundamental relationships in trigonometry. They\'re used in everything from signal processing to 3D graphics to orbital mechanics!' },
    ],
    interactive: PythagoreanIdentityInteractive,
  },

  // === Unit 7: Coordinate Geometry ===
  {
    id: 'distance-formula',
    icon: Ruler,
    title: 'The Distance Formula',
    formula: 'd = √((x₂ − x₁)² + (y₂ − y₁)²)',
    formulaDesc: 'Calculate the distance between any two points on a coordinate plane.',
    color: 'violet',
    steps: [
      { label: 'Plot two points', content: '🗺️ You\'re a city planner. Point P₁(1, 2) is the library and P₂(7, 6) is the hospital. You need the straight-line distance between them to plan a new road. The Pythagorean Theorem is your tool!' },
      { label: 'Draw perpendiculars', content: 'Draw lines from P₁ and P₂ to the x-axis. These create a right triangle. The horizontal leg runs from x₁ to x₂, and the vertical leg from y₁ to y₂.' },
      { label: 'Find the legs', content: 'Horizontal distance = |x₂ − x₁| = |7 − 1| = 6 blocks east. Vertical distance = |y₂ − y₁| = |6 − 2| = 4 blocks north.' },
      { label: 'Apply Pythagoras', content: 'd² = (Δx)² + (Δy)² → d = √((x₂−x₁)² + (y₂−y₁)²) = √(6² + 4²) = √(36 + 16) = √52 ≈ 7.21 units. This formula is the GPS backbone: your phone calculates distance between satellites and your position using this exact formula in 3D!' },
    ],
    interactive: DistanceFormulaInteractive,
  },

  // === Unit 8: Geometry of Straight Lines ===
  {
    id: 'slope-intercept',
    icon: Target,
    title: 'Slope-Intercept Form',
    formula: 'y = mx + c',
    formulaDesc: 'Equation of a straight line with slope m and y-intercept c.',
    color: 'amber',
    steps: [
      { label: 'Identify slope and intercept', content: '📈 You\'re tracking your savings. You start with $100 (y-intercept c = 1 on a scaled graph) and save $2 per week (slope m = 2). The line shows your total savings over time.' },
      { label: 'Pick a general point', content: 'Let P(x, y) be any point on the line. The point where the line crosses the y-axis is A(0, c) — your starting savings at week 0.' },
      { label: 'Calculate slope between points', content: 'Slope m = (y − c) / (x − 0) = (y − c) / x. This means the rise over run from A to P equals the constant slope of the line.' },
      { label: 'Rearrange to solve for y', content: 'm = (y − c)/x → y − c = mx → y = mx + c. That\'s it! All straight lines can be written this way. In business, this models linear cost functions: Total Cost = Variable Cost × Units + Fixed Cost.' },
    ],
    interactive: SlopeInterceptInteractive,
  },
  {
    id: 'point-slope',
    icon: Target,
    title: 'Point-Slope Form',
    formula: 'y − y₁ = m(x − x₁)',
    formulaDesc: 'Equation of a line through a point with a given slope.',
    color: 'blue',
    steps: [
      { label: 'The problem', content: '📍 You know a line passes through the point (2, 3) and has slope m = 1.5. You need the equation of the line to graph it on your digital map.' },
      { label: 'Use slope formula with general point', content: 'Let P(x, y) be any point on the line. With B(x₁, y₁) = (2, 3), the slope m = (y − y₁)/(x − x₁).' },
      { label: 'Cross-multiply', content: 'm(x − x₁) = y − y₁. This equation says "for any point on the line, the slope from (x₁, y₁) to (x, y) is always m."' },
      { label: 'The result', content: 'y − y₁ = m(x − x₁). This is the Point-Slope Form. It\'s incredibly useful in calculus, physics, and engineering when you know one point and the rate of change (slope). For our example: y − 3 = 1.5(x − 2) → y = 1.5x.' },
    ],
    interactive: PointSlopeInteractive,
  },
  {
    id: 'two-point-form',
    icon: Target,
    title: 'Two-Point Form',
    formula: 'y − y₁ = ((y₂−y₁)/(x₂−x₁))(x − x₁)',
    formulaDesc: 'Equation of a line through two given points.',
    color: 'pink',
    steps: [
      { label: 'Two points define a line', content: '🔗 You have two points A(1, 2) and B(4, 8). Only one straight line passes through both — the shortest path between them.' },
      { label: 'Find the slope', content: 'Slope m = (y₂ − y₁)/(x₂ − x₁) = (8 − 2)/(4 − 1) = 6/3 = 2. This line rises 2 units for every 1 unit horizontally.' },
      { label: 'Apply Point-Slope Form', content: 'Now that we have m = 2, use the Point-Slope Form with either point: y − y₁ = m(x − x₁) → y − 2 = 2(x − 1).' },
      { label: 'The formula', content: 'Substituting the slope formula directly gives: y − y₁ = ((y₂−y₁)/(x₂−x₁))(x − x₁). This is the Two-Point Form — it combines the slope calculation with the line equation in one step. Surveyors use this to map boundaries between measured points!' },
    ],
    interactive: TwoPointFormInteractive,
  },
  {
    id: 'two-intercept-form',
    icon: Target,
    title: 'Two-Intercept Form',
    formula: 'x/a + y/b = 1',
    formulaDesc: 'Equation of a line using its x-intercept a and y-intercept b.',
    color: 'indigo',
    steps: [
      { label: 'Identify intercepts', content: '🎯 A line crosses the x-axis at x = 4 (the x-intercept a = 4) and the y-axis at y = 3 (the y-intercept b = 3). These two points completely define the line.' },
      { label: 'Find the slope', content: 'Slope m = (b − 0)/(0 − a) = b/(−a) = −b/a = −3/4. The line goes down 3 for every 4 right.' },
      { label: 'Use Point-Slope with y-intercept', content: 'Using point (0, b): y − b = m(x − 0) → y − b = (−b/a)x → ay − ab = −bx → bx + ay = ab.' },
      { label: 'Divide by ab', content: '(bx)/(ab) + (ay)/(ab) = 1 → x/a + y/b = 1. This elegant form shows the intercepts directly. Economists use this to graph budget constraints: if you spend $a on food and $b on housing, x/a + y/b = 1 shows all possible spending combinations!' },
    ],
    interactive: TwoInterceptInteractive,
  },
  {
    id: 'normal-form',
    icon: Target,
    title: 'Normal Form of a Line',
    formula: 'x cos α + y sin α = p',
    formulaDesc: 'Equation using perpendicular distance p from origin and inclination α.',
    color: 'orange',
    steps: [
      { label: 'Define the normal', content: '🧭 Imagine a line L and a perpendicular from the origin O to L meeting at point C. The distance OC = p, and the angle this perpendicular makes with the x-axis is α.' },
      { label: 'Find intercepts', content: 'From right triangle OCA: cos α = p/OA → OA = p/cos α (x-intercept). From triangle OCB: sin α = p/OB → OB = p/sin α (y-intercept).' },
      { label: 'Apply Two-Intercept Form', content: 'Using x/a + y/b = 1 where a = OA, b = OB: x/(p/cos α) + y/(p/sin α) = 1 → (x cos α)/p + (y sin α)/p = 1.' },
      { label: 'Multiply by p', content: 'x cos α + y sin α = p. The Normal Form! This is particularly useful in physics and engineering for finding distances from a point to a line, and for describing wave fronts in optics.' },
    ],
    interactive: NormalFormInteractive,
  },
  {
    id: 'angle-between-lines',
    icon: Target,
    title: 'Angle Between Two Lines',
    formula: 'tan θ = |(m₂ − m₁) / (1 + m₁ m₂)|',
    formulaDesc: 'Find the acute angle between two intersecting lines from their slopes.',
    color: 'rose',
    steps: [
      { label: 'Lines and inclinations', content: '🔄 Two roads cross at an intersection. One has a gentle slope m₁ = 0.5 (gentle hill), the other is steeper m₂ = 2. Their inclinations relative to the x-axis are α and β.' },
      { label: 'Exterior angle theorem', content: 'When these lines cross, they form a triangle with the x-axis. The exterior angle of this triangle equals the sum of the two opposite interior angles: α = β + θ, where θ is the angle between the lines.' },
      { label: 'Solve for θ and apply tan', content: 'θ = α − β. Take tan of both sides: tan θ = tan(α − β). Using the tangent subtraction formula: tan(α−β) = (tan α − tan β)/(1 + tan α × tan β).' },
      { label: 'Substitute slopes', content: 'Since tan α = m₂ and tan β = m₁: tan θ = (m₂ − m₁)/(1 + m₁m₂). Take absolute value for the acute angle. If tan θ = 0, lines are parallel. If 1 + m₁m₂ = 0, lines are perpendicular. Road engineers use this to design safe intersection angles!' },
    ],
    interactive: AngleBetweenLinesInteractive,
  },
];

// ========== Color Helper ==========
function getColorClasses(color: string) {
  const colors: Record<string, { bg: string; text: string; border: string; light: string; dark: string; btn: string; btnHover: string }> = {
    teal: { bg: 'bg-teal-500', text: 'text-teal-600', border: 'border-teal-200', light: 'bg-teal-50', dark: 'dark:bg-teal-900/20', btn: 'bg-teal-600', btnHover: 'hover:bg-teal-700' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-200', light: 'bg-purple-50', dark: 'dark:bg-purple-900/20', btn: 'bg-purple-600', btnHover: 'hover:bg-purple-700' },
    rose: { bg: 'bg-rose-500', text: 'text-rose-600', border: 'border-rose-200', light: 'bg-rose-50', dark: 'dark:bg-rose-900/20', btn: 'bg-rose-600', btnHover: 'hover:bg-rose-700' },
    cyan: { bg: 'bg-cyan-500', text: 'text-cyan-600', border: 'border-cyan-200', light: 'bg-cyan-50', dark: 'dark:bg-cyan-900/20', btn: 'bg-cyan-600', btnHover: 'hover:bg-cyan-700' },
    indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-200', light: 'bg-indigo-50', dark: 'dark:bg-indigo-900/20', btn: 'bg-indigo-600', btnHover: 'hover:bg-indigo-700' },
    sky: { bg: 'bg-sky-500', text: 'text-sky-600', border: 'border-sky-200', light: 'bg-sky-50', dark: 'dark:bg-sky-900/20', btn: 'bg-sky-600', btnHover: 'hover:bg-sky-700' },
    yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-yellow-200', light: 'bg-yellow-50', dark: 'dark:bg-yellow-900/20', btn: 'bg-yellow-600', btnHover: 'hover:bg-yellow-700' },
    emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200', light: 'bg-emerald-50', dark: 'dark:bg-emerald-900/20', btn: 'bg-emerald-600', btnHover: 'hover:bg-emerald-700' },
    violet: { bg: 'bg-violet-500', text: 'text-violet-600', border: 'border-violet-200', light: 'bg-violet-50', dark: 'dark:bg-violet-900/20', btn: 'bg-violet-600', btnHover: 'hover:bg-violet-700' },
    amber: { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200', light: 'bg-amber-50', dark: 'dark:bg-amber-900/20', btn: 'bg-amber-600', btnHover: 'hover:bg-amber-700' },
    blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200', light: 'bg-blue-50', dark: 'dark:bg-blue-900/20', btn: 'bg-blue-600', btnHover: 'hover:bg-blue-700' },
    pink: { bg: 'bg-pink-500', text: 'text-pink-600', border: 'border-pink-200', light: 'bg-pink-50', dark: 'dark:bg-pink-900/20', btn: 'bg-pink-600', btnHover: 'hover:bg-pink-700' },
    orange: { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-200', light: 'bg-orange-50', dark: 'dark:bg-orange-900/20', btn: 'bg-orange-600', btnHover: 'hover:bg-orange-700' },
  };
  return colors[color] || colors.teal;
}

// ========== Main Component ==========
export default function LabM9Theorems({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
  const { moduleId } = useParams<{ moduleId: string }>();
  const moduleToTheorem: Record<string, string> = {
    'm9_theorem_product_log': 'product-log',
    'm9_theorem_quotient_log': 'quotient-log',
    'm9_theorem_power_log': 'power-log',
    'm9_theorem_change_base': 'change-base',
    'm9_theorem_union_assoc': 'union-associative',
    'm9_theorem_intersection_assoc': 'intersection-associative',
    'm9_theorem_distributive_union': 'distributive-union-inter',
    'm9_theorem_distributive_intersection': 'distributive-inter-union',
    'm9_theorem_quotient_identity': 'quotient-identities',
    'm9_theorem_pythagorean_identity': 'pythagorean-identities',
    'm9_theorem_distance_formula': 'distance-formula',
    'm9_theorem_slope_intercept': 'slope-intercept',
    'm9_theorem_point_slope': 'point-slope',
    'm9_theorem_two_point': 'two-point-form',
    'm9_theorem_two_intercept': 'two-intercept-form',
    'm9_theorem_normal_form': 'normal-form',
    'm9_theorem_angle_between_lines': 'angle-between-lines',
  };
  const initialTheorem = moduleId && moduleToTheorem[moduleId] ? moduleToTheorem[moduleId] : THEOREMS[0].id;
  const [activeTheorem, setActiveTheorem] = useState(initialTheorem);
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const current = THEOREMS.find(t => t.id === activeTheorem)!;
  const cc = getColorClasses(current.color);

  const toggleStep = (theoremId: string, stepIdx: number) => {
    setExpandedSteps(prev => ({ ...prev, [`${theoremId}-${stepIdx}`]: !prev[`${theoremId}-${stepIdx}`] }));
  };

  const handleAnswer = (correct: boolean) => {
    if (correct && !completed[activeTheorem]) {
      setCompleted(prev => ({ ...prev, [activeTheorem]: true }));
      setScore(s => s + 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 text-white px-4 md:px-6 py-4 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <GraduationCap className="w-6 h-6" />
              
                                        Class 9 Math Interactive Theorems
                                      </h1>
            <p className="text-sm text-white/80 mt-1">{t('lab.m9theorems_master_17_essential_theorems_t')}</p>
          </div>
          {onExit && (
            <button onClick={onExit} className="px-3 py-1.5 bg-white dark:bg-[#121212] dark:border-[#1c1b1b]/20 hover:bg-white dark:bg-[#121212] dark:border-[#1c1b1b]/30 rounded-lg text-xs font-bold transition-colors">
              
                                        {t('lab.m9theorems_exit')}
                                      </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0 bg-white dark:bg-[#121212] border-r border-slate-200 dark:border-[#1c1b1b] overflow-y-auto">
          <div className="p-3 border-b border-slate-100 dark:border-[#1c1b1b]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('lab.m9theorems_progress')}</span>
              <span className="text-xs font-bold text-violet-600">{score}/{THEOREMS.length}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-[#1c1b1b] rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${(score / THEOREMS.length) * 100}%` }} />
            </div>
          </div>
          {/* Unit grouping */}
          {[
            { name: 'Unit 2: Logarithms', ids: ['product-log', 'quotient-log', 'power-log', 'change-base'] },
            { name: 'Unit 3: Sets & Relations', ids: ['union-associative', 'intersection-associative', 'distributive-union-inter', 'distributive-inter-union'] },
            { name: 'Unit 6: Trigonometry', ids: ['quotient-identities', 'pythagorean-identities'] },
            { name: 'Unit 7: Coordinate Geometry', ids: ['distance-formula'] },
            { name: 'Unit 8: Straight Lines', ids: ['slope-intercept', 'point-slope', 'two-point-form', 'two-intercept-form', 'normal-form', 'angle-between-lines'] },
          ].map(group => (
            <div key={group.name}>
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-[#1c1b1b]">
                {group.name}
              </div>
              {group.ids.map(id => {
                const t = THEOREMS.find(ti => ti.id === id)!;
                const colors = getColorClasses(t.color);
                const isActive = t.id === activeTheorem;
                const isDone = completed[t.id];
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTheorem(t.id)}
                    className={`w-full text-left px-3 py-2.5 border-b border-slate-100 dark:border-[#1c1b1b] transition-colors ${
                      isActive ? `${colors.light} ${colors.dark} border-l-2 ${colors.border}` : 'hover:bg-slate-50 dark:hover:bg-[#1c1b1b]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg ${colors.bg} flex items-center justify-center shrink-0 ${isDone ? 'opacity-100' : 'opacity-60'}`}>
                        {isDone ? <CheckCircle className="w-3.5 h-3.5 text-white" /> : <t.icon className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div className="min-w-0">
                        <div className={`text-[11px] font-semibold truncate ${isActive ? colors.text : 'text-slate-700 dark:text-slate-300'}`}>
                          {t.title}
                        </div>
                        <div className="text-[9px] font-mono text-slate-400 truncate">{t.formula}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-3xl mx-auto space-y-5">
            {/* Title & Formula */}
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl ${cc.bg} flex items-center justify-center shrink-0`}>
                <current.icon className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">{current.title}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">{current.formulaDesc}</p>
              </div>
            </div>

            {/* Formula Card */}
            <div className={`${cc.light} ${cc.dark} rounded-xl p-4 border ${cc.border} text-center`}>
              <div className={`text-2xl font-bold ${cc.text}`}><MathFormula formula={current.formula} className="text-2xl font-bold" /></div>
            </div>

            {/* Step-by-step Proof */}
            <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-[#1c1b1b] flex items-center gap-2">
                <Sigma className="w-4 h-4 text-violet-500" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{t('lab.m9theorems_step_by_step_proof')}</span>
              </div>
              <div className="p-4">
                {current.steps.map((step, idx) => {
                  const key = `${current.id}-${idx}`;
                  const isExpanded = expandedSteps[key] !== undefined ? expandedSteps[key] : idx === 0;
                  const isLast = idx === current.steps.length - 1;
                  return (
                    <div key={idx} className="mb-3 last:mb-0">
                      <button
                        onClick={() => toggleStep(current.id, idx)}
                        className="flex items-center gap-2 w-full text-left"
                      >
                        <div className={`w-6 h-6 rounded-full ${cc.bg} text-white flex items-center justify-center text-[10px] font-bold shrink-0`}>
                          {idx + 1}
                        </div>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{step.label}</span>
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-auto" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-auto" />}
                      </button>
                      {isExpanded && (
                        <div className="ml-9 mt-2">
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step.content}</p>
                          {!isLast && <ArrowRight className="w-3.5 h-3.5 text-slate-300 ml-3 mt-2" />}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Playground */}
            <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-[#1c1b1b] flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{t('lab.m9theorems_try_it_yourself')}</span>
                {completed[current.id] && (
                  <span className="ml-auto text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />  {t('lab.m9theorems_mastered')}
                                                        </span>
                )}
              </div>
              <div className="p-4">
                <current.interactive onAnswer={handleAnswer} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
