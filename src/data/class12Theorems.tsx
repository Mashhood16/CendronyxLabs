import { useTranslate } from '../i18n';
import { useState } from 'react';
import { CheckCircle, XCircle, Hash, Infinity, Move3d, Circle, Target } from 'lucide-react';
import type { TheoremConfig } from '../components/GenericTheoremLab';

// ========== Shared Interactive Components ==========

function CalcInteractive({ onAnswer, mode }: { onAnswer: (correct: boolean) => void; mode?: string }) {
  const { t } = useTranslate();
  const [n, setN] = useState(3);
  const [x, setX] = useState(2);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');
  const derivative = n * Math.pow(x, n - 1);
  const sinDeriv = Math.cos(x * Math.PI / 180);
  const invSinDeriv = 1 / Math.sqrt(1 - Math.pow(0.5, 2));

  let displayVal = derivative;
  let formula = `d/dx(x^${n}) at x=${x} = ${n}×${x}^${n-1}`;
  let resultStr = `f'(${x}) = ${derivative.toFixed(2)}`;
  let correctVal = derivative;

  if (mode === 'sin') {
    displayVal = sinDeriv;
    formula = `d/dx(sin x) at x=${x}° = cos(${x}°)`;
    resultStr = `cos(${x}°) = ${sinDeriv.toFixed(4)}`;
    correctVal = sinDeriv;
  } else if (mode === 'invsin') {
    displayVal = invSinDeriv;
    formula = `d/dx(sin⁻¹x) at x=0.5 = 1/√(1-0.5²)`;
    resultStr = `1/√(0.75) = ${invSinDeriv.toFixed(4)}`;
    correctVal = invSinDeriv;
  }

  const handleCheck = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - correctVal) < 0.05 ? 'correct' : 'incorrect');
    if (Math.abs(val - correctVal) < 0.05) onAnswer(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {mode !== 'invsin' && (
          <div>
            <label className="text-xs font-semibold">{t("n (exponent)")}</label>
            <input type="range" min="1" max="8" step="1" value={n} onChange={e => { setN(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-indigo-500" />
            <span className="text-xs">{t("n =")} {n}</span>
          </div>
        )}
        <div>
          <label className="text-xs font-semibold">{t("x value")}</label>
          <input type="range" min="1" max="5" step="1" value={x} onChange={e => { setX(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-indigo-500" />
          <span className="text-xs">{t("x =")} {x}</span>
        </div>
      </div>
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
        <p className="text-xs text-indigo-700 dark:text-indigo-300 font-mono">{formula}<br />{resultStr}</p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("f'(x) = ?")} step="0.01" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-indigo-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct!")}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Try computing the derivative formula")}</p>}
    </div>
  );
}

function IntegralInteractive({ onAnswer, mode }: { onAnswer: (correct: boolean) => void; mode?: string }) {
  const { t } = useTranslate();
  const [aVal, setAVal] = useState(2);
  const [bVal, setBVal] = useState(4);
  const [nExp, setNExp] = useState(2);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const integral = Math.pow(bVal, nExp + 1) / (nExp + 1) - Math.pow(aVal, nExp + 1) / (nExp + 1);

  const handleCheck = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - integral) < 0.5 ? 'correct' : 'incorrect');
    if (Math.abs(val - integral) < 0.5) onAnswer(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold">{t("Lower bound (a)")}</label>
          <input type="range" min="0" max="5" step="1" value={aVal} onChange={e => { setAVal(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" />
          <span className="text-xs">{t("a =")} {aVal}</span>
        </div>
        <div>
          <label className="text-xs font-semibold">{t("Upper bound (b)")}</label>
          <input type="range" min="1" max="5" step="1" value={bVal} onChange={e => { setBVal(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" />
          <span className="text-xs">{t("b =")} {bVal}</span>
        </div>
        <div>
          <label className="text-xs font-semibold">n</label>
          <input type="range" min="1" max="5" step="1" value={nExp} onChange={e => { setNExp(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-emerald-500" />
          <span className="text-xs">{t("n =")} {nExp}</span>
        </div>
      </div>
      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
        <p className="text-xs text-emerald-700 dark:text-emerald-300 font-mono">
          {t("∫ₐᵇ xⁿ dx = [xⁿ⁺¹/(n+1)]ₐᵇ")}<br />
          = {bVal}^{nExp+1}/{nExp+1} - {aVal}^{nExp+1}/{nExp+1}<br />
          = <strong>{integral.toFixed(2)}</strong>
        </p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder="∫ = ?" step="0.1" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-emerald-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! Integral =")} {integral.toFixed(2)}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Apply ∫ xⁿ = xⁿ⁺¹/(n+1)")}</p>}
    </div>
  );
}

function FTCInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [aVal, setAVal] = useState(1);
  const [bVal, setBVal] = useState(3);
  const [coeffA, setCoeffA] = useState(1);
  const [coeffB, setCoeffB] = useState(0);
  const [coeffC, setCoeffC] = useState(0);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const F = (x: number) => coeffA * x * x * x / 3 + coeffB * x * x / 2 + coeffC * x;
  const integral = F(bVal) - F(aVal);

  const handleCheck = () => {
  const { t } = useTranslate();
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - integral) < 0.5 ? 'correct' : 'incorrect');
    if (Math.abs(val - integral) < 0.5) onAnswer(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[10px] font-semibold">{t("a (coeff of x²)")}</label>
          <input type="range" min="0" max="3" step="1" value={coeffA} onChange={e => { setCoeffA(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" />
          <span className="text-xs">{coeffA}</span>
        </div>
        <div>
          <label className="text-[10px] font-semibold">{t("b (coeff of x)")}</label>
          <input type="range" min="0" max="3" step="1" value={coeffB} onChange={e => { setCoeffB(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" />
          <span className="text-xs">{coeffB}</span>
        </div>
        <div>
          <label className="text-[10px] font-semibold">{t("c (constant)")}</label>
          <input type="range" min="0" max="3" step="1" value={coeffC} onChange={e => { setCoeffC(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" />
          <span className="text-xs">{coeffC}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-semibold">{t("Lower bound a")}</label>
          <input type="range" min="0" max="5" step="1" value={aVal} onChange={e => { setAVal(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" />
          <span className="text-xs">{t("a =")} {aVal}</span>
        </div>
        <div>
          <label className="text-xs font-semibold">{t("Upper bound b")}</label>
          <input type="range" min="1" max="5" step="1" value={bVal} onChange={e => { setBVal(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-rose-500" />
          <span className="text-xs">{t("b =")} {bVal}</span>
        </div>
      </div>
      <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-3 border border-rose-200 dark:border-rose-800">
        <p className="text-xs text-rose-700 dark:text-rose-300 font-mono">
          {t("f(x) =")} {coeffA}{t("x² +")} {coeffB}{t("x +")} {coeffC}<br />
          {t("F(x) =")} {coeffA}{t("x³/3 +")} {coeffB}{t("x²/2 +")} {coeffC}x<br />
          {t("∫ₐᵇ = F(")}{bVal}{t(") − F(")}{aVal}) = <strong>{integral.toFixed(2)}</strong>
        </p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("∫ f(x) dx = ?")} step="0.1" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-rose-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! ∫ =")} {integral.toFixed(2)}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Use F(b) − F(a)")}</p>}
    </div>
  );
}

function ConcurrencyInteractive({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate();
  const [x1, setX1] = useState(1); const [y1, setY1] = useState(1);
  const [x2, setX2] = useState(7); const [y2, setY2] = useState(1);
  const [x3, setX3] = useState(4); const [y3, setY3] = useState(6);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const centroidX = (x1 + x2 + x3) / 3;
  const centroidY = (y1 + y2 + y3) / 3;

  const handleCheck = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - centroidX) < 0.1 ? 'correct' : 'incorrect');
    if (Math.abs(val - centroidX) < 0.1) onAnswer(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[10px] font-semibold">{t("A (x₁,y₁)")}</label>
          <div className="grid grid-cols-2 gap-1">
            <input type="range" min="1" max="8" step="1" value={x1} onChange={e => { setX1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-cyan-500" />
            <input type="range" min="1" max="8" step="1" value={y1} onChange={e => { setY1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-cyan-500" />
          </div>
          <span className="text-xs">({x1},{y1})</span>
        </div>
        <div>
          <label className="text-[10px] font-semibold">{t("B (x₂,y₂)")}</label>
          <div className="grid grid-cols-2 gap-1">
            <input type="range" min="1" max="8" step="1" value={x2} onChange={e => { setX2(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-cyan-500" />
            <input type="range" min="1" max="8" step="1" value={y2} onChange={e => { setY2(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-cyan-500" />
          </div>
          <span className="text-xs">({x2},{y2})</span>
        </div>
        <div>
          <label className="text-[10px] font-semibold">{t("C (x₃,y₃)")}</label>
          <div className="grid grid-cols-2 gap-1">
            <input type="range" min="1" max="8" step="1" value={x3} onChange={e => { setX3(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-cyan-500" />
            <input type="range" min="1" max="8" step="1" value={y3} onChange={e => { setY3(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-cyan-500" />
          </div>
          <span className="text-xs">({x3},{y3})</span>
        </div>
      </div>
      <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-3 border border-cyan-200 dark:border-cyan-800">
        <p className="text-xs text-cyan-700 dark:text-cyan-300 font-mono">
          {t("Triangle: (")}{x1},{y1}), ({x2},{y2}), ({x3},{y3})<br />
          {t("Centroid: ((")}{x1}+{x2}+{x3})/3, ({y1}+{y2}+{y3})/3)<br />
          = <strong>({centroidX.toFixed(1)}, {centroidY.toFixed(1)})</strong>
        </p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("Centroid x = ?")} step="0.1" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-cyan-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Centroid x =")} {centroidX.toFixed(1)}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Centroid = ((x₁+x₂+x₃)/3, (y₁+y₂+y₃)/3)")}</p>}
    </div>
  );
}

function CircleInteractive({ onAnswer, mode }: { onAnswer: (correct: boolean) => void; mode?: string }) {
  const { t } = useTranslate();
  const [gVal, setGVal] = useState(2);
  const [fVal, setFVal] = useState(3);
  const [cVal, setCVal] = useState(1);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const centerX = -gVal;
  const centerY = -fVal;
  const radius = Math.sqrt(gVal * gVal + fVal * fVal - cVal);
  const isValid = gVal * gVal + fVal * fVal - cVal >= 0;

  const handleCheck = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    const target = mode === 'radius' ? (isValid ? radius : 0) : centerX;
    setCheckResult(Math.abs(val - target) < 0.1 ? 'correct' : 'incorrect');
    if (Math.abs(val - target) < 0.1) onAnswer(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[10px] font-semibold">g</label>
          <input type="range" min="0" max="5" step="1" value={gVal} onChange={e => { setGVal(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-violet-500" />
          <span className="text-xs">{t("g =")} {gVal}</span>
        </div>
        <div>
          <label className="text-[10px] font-semibold">f</label>
          <input type="range" min="0" max="5" step="1" value={fVal} onChange={e => { setFVal(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-violet-500" />
          <span className="text-xs">{t("f =")} {fVal}</span>
        </div>
        <div>
          <label className="text-[10px] font-semibold">c</label>
          <input type="range" min="0" max="5" step="1" value={cVal} onChange={e => { setCVal(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-violet-500" />
          <span className="text-xs">{t("c =")} {cVal}</span>
        </div>
      </div>
      <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3 border border-violet-200 dark:border-violet-800">
        <p className="text-xs text-violet-700 dark:text-violet-300 font-mono">
          {t("x² + y² + 2(")}{gVal}{t(")x + 2(")}{fVal}{t(")y +")} {cVal} = 0<br />
          {t("Center: (")}{-gVal}, {-fVal})<br />
          {t("radius² =")} {gVal}² + {fVal}² − {cVal} = {gVal * gVal + fVal * fVal - cVal}<br />
          {t("r =")} {isValid ? radius.toFixed(2) : 'imaginary - no real circle'}
        </p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={mode === 'radius' ? 'r = ?' : 'h = ?'} step="0.1" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-violet-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct!")}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Complete the square: (x+g)² + (y+f)² = g²+f²-c")}</p>}
    </div>
  );
}

function ConicInteractive({ onAnswer, mode }: { onAnswer: (correct: boolean) => void; mode?: string }) {
  const { t } = useTranslate();
  const [aVal, setAVal] = useState(4);
  const [bVal, setBVal] = useState(2);
  const [cEcc, setCEcc] = useState(3);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const isEllipse = aVal > bVal;
  const ecc = Math.sqrt(1 - (bVal * bVal) / (aVal * aVal));
  const hypEcc = Math.sqrt(1 + (bVal * bVal) / (aVal * aVal));
  const focusDist = isEllipse ? Math.sqrt(aVal * aVal - bVal * bVal) : Math.sqrt(aVal * aVal + bVal * bVal);
  const parabFocal = cEcc;

  let displayStr = '';
  let correctVal = 0;

  if (mode === 'ellipse') {
    displayStr = `x²/${aVal}² + y²/${bVal}² = 1\ne = ${ecc.toFixed(3)}, foci: (±${focusDist.toFixed(1)}, 0)`;
    correctVal = focusDist;
  } else if (mode === 'hyperbola') {
    displayStr = `x²/${aVal}² − y²/${bVal}² = 1\ne = ${hypEcc.toFixed(3)}, foci: (±${focusDist.toFixed(1)}, 0)`;
    correctVal = hypEcc;
  } else {
    displayStr = `y² = 4(${parabFocal})x\nFocus: (${parabFocal}, 0), Directrix: x = -${parabFocal}`;
    correctVal = parabFocal;
  }

  const handleCheck = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    const target = mode === 'ellipse' ? correctVal : (mode === 'hyperbola' ? correctVal : correctVal);
    setCheckResult(Math.abs(val - target) < 0.2 ? 'correct' : 'incorrect');
    if (Math.abs(val - target) < 0.2) onAnswer(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold">{t("a (semi-major)")}</label>
          <input type="range" min="2" max="6" step="1" value={aVal} onChange={e => { setAVal(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-fuchsia-500" />
          <span className="text-xs">{t("a =")} {aVal}</span>
        </div>
        {mode !== 'parabola' && (
          <div>
            <label className="text-xs font-semibold">{t("b (semi-minor)")}</label>
            <input type="range" min="1" max={aVal} step="1" value={bVal} onChange={e => { setBVal(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-fuchsia-500" />
            <span className="text-xs">{t("b =")} {bVal}</span>
          </div>
        )}
        {mode === 'parabola' && (
          <div>
            <label className="text-xs font-semibold">{t("a (focal length)")}</label>
            <input type="range" min="1" max="6" step="1" value={cEcc} onChange={e => { setCEcc(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-fuchsia-500" />
            <span className="text-xs">{t("a =")} {cEcc}</span>
          </div>
        )}
      </div>
      <div className="bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-lg p-3 border border-fuchsia-200 dark:border-fuchsia-800">
        <p className="text-xs text-fuchsia-700 dark:text-fuchsia-300 font-mono whitespace-pre-line">{displayStr}</p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("Value")} step="0.1" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-fuchsia-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct!")}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Apply the standard formula")}</p>}
    </div>
  );
}

// Wrapper components
function PowerRuleInteractiveWrapper(p: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate(); return <CalcInteractive onAnswer={p.onAnswer} mode="power" />; }
function SinDerivativeInteractiveWrapper(p: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate(); return <CalcInteractive onAnswer={p.onAnswer} mode="sin" />; }
function InverseTrigInteractiveWrapper(p: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate(); return <CalcInteractive onAnswer={p.onAnswer} mode="invsin" />; }
function EllipseInteractiveWrapper(p: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate(); return <ConicInteractive onAnswer={p.onAnswer} mode="ellipse" />; }
function HyperbolaInteractiveWrapper(p: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate(); return <ConicInteractive onAnswer={p.onAnswer} mode="hyperbola" />; }
function ParabolaInteractiveWrapper(p: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate(); return <ConicInteractive onAnswer={p.onAnswer} mode="parabola" />; }
function CircleCenterInteractiveWrapper(p: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate(); return <CircleInteractive onAnswer={p.onAnswer} mode="center" />; }
function CircleRadiusInteractiveWrapper(p: { onAnswer: (correct: boolean) => void }) {
  const { t } = useTranslate(); return <CircleInteractive onAnswer={p.onAnswer} mode="radius" />; }

// ========== Theorem Configs ==========

export const CLASS12_THEOREMS: Record<string, TheoremConfig> = {
  // ── Unit 2: Limits, Continuity and Derivative ──
  power_rule: {
    theoremKey: 'class12.power_rule',
    title: 'Power Rule for Differentiation',
    icon: <Hash className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-purple-600',
    accentColor: 'bg-indigo-600',
    finalFormula: 'd/dx x^n = nx^{n-1}',
    finalFormulaDesc: 'The derivative of xⁿ is n·xⁿ⁻¹ for any positive integer n.',
    keyInsight: 'The power rule is the single most used differentiation formula! It transforms polynomials into simpler ones: each term\'s exponent drops by 1 and becomes the new coefficient. Used everywhere from physics (velocity = derivative of position) to economics (marginal cost from total cost).',
    steps: [
      { label: 'Definition of derivative', formula: "f'(x) = lim_{h \→ 0} \{f(x+h) - f(x)}{h}", detail: '📈 A rocket scientist needs to calculate the velocity of a spacecraft at every instant. Position s(t) = t³. By definition, velocity = derivative = limit of (s(t+h)−s(t))/h as h→0.' },
      { label: 'Expand using binomial theorem', formula: "(x+h)^n = x^n + nx^{n-1}h + \\frac{n(n-1)}{2!}x^{n-2}h^2 + ... + h^n", detail: '📐 Expand (x+h)ⁿ using the binomial theorem. The terms are: xⁿ + n·xⁿ⁻¹·h + n(n−1)/2!·xⁿ⁻²·h² + ... + hⁿ.' },
      { label: 'Cancel xⁿ terms', formula: "\\frac{(x+h)^n - x^n}{h} = nx^{n-1} + \\frac{n(n-1)}{2!}x^{n-2}h + ... + h^{n-1}", detail: '🧮 Subtract xⁿ and divide by h. The xⁿ cancels, and every remaining term contains h. Factor h: the numerator becomes h[n·xⁿ⁻¹ + ... + hⁿ⁻¹]. Cancel h with denominator.' },
      { label: 'Take limit as h→0', formula: "lim_{h \\to 0} nx^{n-1} + \\frac{n(n-1)}{2!}x^{n-2}h + ... + h^{n-1} = nx^{n-1}", detail: '✅ As h→0, all terms with h vanish, leaving only n·xⁿ⁻¹. For the rocket: if s(t) = t³, velocity v(t) = 3t². At t=5 seconds: v = 3×25 = 75 m/s. The power rule makes differentiation instant!' },
    ],
    practice: { question: 'd/dx x⁵ = ?', hint: 'd/dx xⁿ = n·xⁿ⁻¹, so d/dx x⁵ = 5·x⁴', answer: 0, tolerance: 10, explanation: 'd/dx x⁵ = 5x⁴', errorHint: 'd/dx xⁿ = n·xⁿ⁻¹' },
    interactive: PowerRuleInteractiveWrapper,
  },

  sin_derivative: {
    theoremKey: 'class12.sin_derivative',
    title: 'Derivative of Sine Function',
    icon: <Hash className="w-5 h-5 text-white" />,
    accentGradient: 'from-purple-500 to-fuchsia-600',
    accentColor: 'bg-purple-600',
    finalFormula: 'd/dx sin x = cos x',
    finalFormulaDesc: 'The derivative of sin x is cos x.',
    keyInsight: 'This is the foundation of all trigonometric calculus! The derivative of sine is cosine because the slope of sin x at any point equals the value of cos x at that point. This relationship is what makes simple harmonic motion (springs, pendulums) so elegant: d²x/dt² = −ω²x.',
    steps: [
      { label: 'Definition of derivative', formula: "d/dx sin x = lim_{h \\to 0} \\frac{sin(x+h) - sin x}{h}", detail: '🎵 An audio engineer analyzing sound waves needs to know how the amplitude changes. A sine wave sin(440t) represents musical note A440. The rate of change gives the velocity of the speaker cone.' },
      { label: 'Apply sum identity', formula: "sin(x+h) = sin x cos h + cos x sin h", detail: '📐 Use the identity sin(A+B) = sin A cos B + cos A sin B: sin(x+h) = sin x cos h + cos x sin h.' },
      { label: 'Group and rearrange', formula: "lim_{h \\to 0} [sin x \\frac{cos h - 1}{h} + cos x \\frac{sin h}{h}]", detail: '🧮 Factor: = lim[sin x(cos h − 1)/h + cos x(sin h)/h]. Two special limits emerge!' },
      { label: 'Apply known limits', formula: "lim_{h \\to 0} \\frac{cos h - 1}{h} = 0, lim_{h \\to 0} \\frac{sin h}{h} = 1", detail: '✅ The two fundamental limits: (1) lim(cos h − 1)/h = 0 (the graph of cos is flat at h=0), (2) lim(sin h)/h = 1 (the small-angle approximation). Result: d/dx sin x = sin x·0 + cos x·1 = cos x. Similarly, d/dx cos x = −sin x.' },
    ],
    practice: { question: 'd/dx sin(π/3) = cos(π/3) = ?', hint: 'cos(60°) = 0.5', answer: 0.5, tolerance: 0.05, explanation: 'cos(60°) = 0.5', errorHint: 'd/dx sin x = cos x' },
    interactive: SinDerivativeInteractiveWrapper,
  },

  inverse_trig_derivatives: {
    theoremKey: 'class12.inverse_trig_derivatives',
    title: 'Derivatives of Inverse Trigonometric Functions',
    icon: <Hash className="w-5 h-5 text-white" />,
    accentGradient: 'from-fuchsia-500 to-pink-600',
    accentColor: 'bg-fuchsia-600',
    finalFormula: "d/dx sin^{-1} x = frac{1}{sqrt{1-x^2}}, d/dx tan^{-1} x = frac{1}{1+x^2}",
    finalFormulaDesc: 'Derivatives of inverse trig functions using implicit differentiation.',
    keyInsight: 'Inverse trig derivatives appear in many integration problems (∫ 1/√(1−x²) dx = sin⁻¹ x + C). They\'re also essential in physics for calculating angles from ratios, like finding the launch angle of a projectile from its velocity components!',
    steps: [
      { label: 'Let y = sin⁻¹ x ⇒ x = sin y', formula: "x = sin y, \\quad -pi/2 \\le y \\le pi/2", detail: '🎯 A ballistics expert measures the ratio of vertical to horizontal velocity (x) and needs the angle. If x = 0.5, then y = sin⁻¹(0.5) = 30°. Implicit differentiation finds how the angle changes with the ratio.' },
      { label: 'Differentiate implicitly', formula: "1 = cos y \\frac{dy}{dx} \\Rightarrow \\frac{dy}{dx} = \\frac{1}{cos y}", detail: '📐 Using implicit differentiation: d/dx(x) = d/dx(sin y) → 1 = cos y · dy/dx → dy/dx = 1/cos y.' },
      { label: 'Substitute cos y = √(1−sin²y)', formula: "\\frac{dy}{dx} = \\frac{1}{\\sqrt{1 - sin^2 y}} = \\frac{1}{\\sqrt{1 - x^2}}", detail: '🧮 Using the identity cos²y + sin²y = 1: cos y = √(1−sin²y) = √(1−x²). Therefore d/dx sin⁻¹ x = 1/√(1−x²).' },
      { label: 'Same process for tan⁻¹ x', formula: "x = tan y \\Rightarrow 1 = sec^2 y \\frac{dy}{dx} \\Rightarrow \\frac{1}{sec^2 y} = \\frac{1}{1+tan^2 y} = \\frac{1}{1+x^2}", detail: '✅ For tan⁻¹: differentiate x = tan y → 1 = sec²y·dy/dx. Since sec²y = 1 + tan²y = 1 + x², we get d/dx tan⁻¹ x = 1/(1+x²). These formulas are the key to integrating rational functions!' },
    ],
    practice: { question: 'd/dx sin⁻¹(0) = 1/√(1−0²) = ?', hint: '1/√1 = 1', answer: 1, tolerance: 0.1, explanation: 'd/dx sin⁻¹(0) = 1', errorHint: 'd/dx sin⁻¹ x = 1/√(1−x²)' },
    interactive: InverseTrigInteractiveWrapper,
  },

  // ── Unit 3: Integration ──
  basic_integrals: {
    theoremKey: 'class12.basic_integrals',
    title: 'Basic Indefinite Integrals',
    icon: <Infinity className="w-5 h-5 text-white" />,
    accentGradient: 'from-emerald-500 to-teal-600',
    accentColor: 'bg-emerald-600',
    finalFormula: 'int x^n dx = frac{x^{n+1}}{n+1} + c, int frac{1}{x} dx = ln|x| + c, int a^x dx = frac{a^x}{ln a} + c',
    finalFormulaDesc: 'Basic integral formulas derived from reverse differentiation.',
    keyInsight: 'Integration is the inverse of differentiation. Every differentiation rule gives an integration rule! The power rule d/dx xⁿ⁺¹/(n+1) = xⁿ reverses to ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C. This is the foundation of all integral calculus.',
    steps: [
      { label: 'Reverse the power rule', formula: "\\int x^n dx = \\frac{x^{n+1}}{n+1} + c, (n neq -1)", detail: '🏗️ A civil engineer calculating the volume of an irregular foundation uses integration. If the cross-sectional area is A(x) = x², the volume from x=0 to x=3 is ∫₀³ x² dx = [x³/3]₀³ = 9 cubic meters.' },
      { label: 'The special case n = −1', formula: "\\int \\frac{1}{x} dx = ln|x| + c", detail: '📐 The power rule fails when n = −1 (would give division by zero). But d/dx[ln x] = 1/x, so ∫ 1/x dx = ln|x| + C. This is the bridge between algebraic and logarithmic functions.' },
      { label: 'Integral of exponential aˣ', formula: "\\frac{d}{dx}[\\frac{a^x}{ln a}] = \\frac{a^x ln a}{ln a} = a^x \\Rightarrow \\int a^x dx = \\frac{a^x}{ln a} + c", detail: '🧮 Differentiate aˣ/ln a: the derivative is aˣ·ln a / ln a = aˣ. Therefore ∫ aˣ dx = aˣ/ln a + C. For the natural exponential: ∫ eˣ dx = eˣ + C (since ln e = 1).' },
      { label: 'Linearity of integration', formula: "\\int [f(x) + g(x)] dx = \\int f(x) dx + \\int g(x) dx, \\int kf(x) dx = k \\int f(x) dx", detail: '✅ Integration is linear: the integral of a sum is the sum of integrals, and constants factor out. This is why ∫ (3x² + 2x + 1) dx = 3·x³/3 + 2·x²/2 + x + C = x³ + x² + x + C.' },
    ],
    practice: { question: '∫ x³ dx = ? (Evaluate at x=2 minus x=0)', hint: '∫ x³ dx = x⁴/4. From 0 to 2: 2⁴/4 = 16/4 = 4', answer: 4, tolerance: 0.5, explanation: '∫₀² x³ dx = 2⁴/4 − 0⁴/4 = 4', errorHint: '∫ xⁿ dx = xⁿ⁺¹/(n+1)' },
    interactive: IntegralInteractive,
  },

  substitution_integrals: {
    theoremKey: 'class12.substitution_integrals',
    title: 'Integration by Substitution',
    icon: <Infinity className="w-5 h-5 text-white" />,
    accentGradient: 'from-teal-500 to-cyan-600',
    accentColor: 'bg-teal-600',
    finalFormula: 'int frac{1}{sqrt{a^2 - x^2}} dx = sin^{-1}frac{x}{a} + c, int sqrt{a^2 - x^2} dx = frac{a^2}{2}sin^{-1}frac{x}{a} + frac{xsqrt{a^2 - x^2}}{2} + c',
    finalFormulaDesc: 'Standard integrals derived via trigonometric substitution.',
    keyInsight: 'Trigonometric substitution transforms square roots into trigonometric functions! √(a²−x²) → x = a sin θ → a cos θ, eliminating the radical. This technique was used by Newton to derive the area of a circle: ∫ √(a²−x²) dx gives the area of a circular segment!',
    steps: [
      { label: 'Substitute x = a sin θ', formula: "x = a sin theta, dx = a cos theta d theta", detail: '📐 An astronomer is calculating the area of a circular telescope mirror of radius a. The integral ∫ √(a²−x²) dx appears. Substitute x = a sin θ, which converts the circle’s equation into a trigonometric form.' },
      { label: 'Simplify the square root', formula: "\\sqrt{a^2 - x^2} = \\sqrt{a^2 - a^2 sin^2 theta} = a cos theta", detail: '🧮 √(a²−x²) = √(a²−a²sin²θ) = a√(1−sin²θ) = a cos θ. The integral becomes ∫ a cos θ · a cos θ dθ = a² ∫ cos²θ dθ.' },
      { label: 'Integrate using half-angle', formula: "a^2 \\int \\frac{1+cos 2theta}{2} dtheta = \\frac{a^2}{2}(theta + \\frac{sin 2theta}{2}) + c", detail: '📐 Use cos²θ = (1+cos 2θ)/2. Integrate: a²[θ/2 + sin 2θ/4] + C = (a²/2)θ + (a²/4) sin 2θ + C.' },
      { label: 'Convert back to x', formula: "theta = sin^{-1}\\frac{x}{a}, sin 2theta = 2 sin theta cos theta = 2frac{x}{a}\\frac{\\sqrt{a^2 - x^2}}{a}", detail: '✅ Substituting back: ∫√(a²−x²)dx = (a²/2)sin⁻¹(x/a) + (x√(a²−x²))/2 + C. This formula gives the area of a circular segment of height x — used in civil engineering for water flow in partially filled pipes!' },
    ],
    practice: { question: '∫₀³ 1/√(9−x²) dx = sin⁻¹(3/3) − sin⁻¹(0/3) = ?', hint: 'sin⁻¹(1) = π/2 ≈ 1.57', answer: 1.57, tolerance: 0.1, explanation: '∫₀³ 1/√(9−x²) dx = sin⁻¹(1) − sin⁻¹(0) = π/2 ≈ 1.57', errorHint: 'Use the formula ∫ 1/√(a²−x²) dx = sin⁻¹(x/a) + C' },
    interactive: IntegralInteractive,
  },

  fundamental_theorem_calc: {
    theoremKey: 'class12.fundamental_theorem_calc',
    title: 'Fundamental Theorem of Calculus',
    icon: <Infinity className="w-5 h-5 text-white" />,
    accentGradient: 'from-rose-500 to-red-600',
    accentColor: 'bg-rose-600',
    finalFormula: 'int_a^b f(x) dx = F(b) - F(a)',
    finalFormulaDesc: 'The definite integral equals the difference of the antiderivative at the bounds.',
    keyInsight: 'The FTC is the single most important theorem in calculus! It connects the two central concepts: differentiation and integration are inverse operations. This is why we can compute areas by finding antiderivatives — a profound link between geometry and algebra.',
    steps: [
      { label: 'Define the area function', formula: "A(x) = int_a^x f(t) dt", detail: '🏔️ A geologist is calculating the volume of sediment in a river delta. The cross-sectional area varies with distance x from the shore. Define A(x) = ∫ₐˣ f(t) dt as the accumulated area from a to x.' },
      { label: "Show A'(x) = f(x)", formula: "A'(x) = lim_{h \\to 0} \\frac{A(x+h) - A(x)}{h} = f(x)", detail: '📐 By definition: A\'(x) = lim[A(x+h)−A(x)]/h as h→0. But A(x+h)−A(x) = ∫ₓˣ⁺ʰ f(t) dt ≈ f(x)·h by the Mean Value Theorem. So A\'(x) = f(x). The area function is an antiderivative of f!' },
      { label: 'Any antiderivative F', formula: "F(x) = A(x) + c \\Rightarrow F(b) - F(a) = [A(b) + c] - [A(a) + c] = A(b) - A(a)", detail: '🧮 Since A\'(x) = f(x), any antiderivative F of f differs from A by a constant: F(x) = A(x) + C. Then F(b)−F(a) = A(b)−A(a).' },
      { label: 'Final result', formula: "int_a^b f(x) dx = A(b) = F(b) - F(a)", detail: '✅ But A(a) = ∫ₐᵃ f(t) dt = 0, so F(b)−F(a) = A(b) = ∫ₐᵇ f(x) dx. The definite integral equals the antiderivative evaluated at the bounds. The river delta volume: if A\'(x) = 2x (linear increase), volume from x=0 to x=5 = [x²]₀⁵ = 25 cubic meters!' },
    ],
    practice: { question: '∫₁³ (2x) dx. Find F(3) − F(1) where F(x) = x².', hint: 'F(3) = 9, F(1) = 1, so 9 − 1 = 8', answer: 8, tolerance: 0.5, explanation: 'F(3)−F(1) = 9−1 = 8.', errorHint: 'FTC: ∫ₐᵇ f(x) dx = F(b)−F(a)' },
    interactive: FTCInteractive,
  },

  // ── Unit 6: Analytical Geometry ──
  concurrency_altitudes: {
    theoremKey: 'class12.concurrency_altitudes',
    title: 'Concurrency of Altitudes in a Triangle',
    icon: <Move3d className="w-5 h-5 text-white" />,
    accentGradient: 'from-cyan-500 to-blue-600',
    accentColor: 'bg-cyan-600',
    finalFormula: 'text{Altitudes AD, BE, CF are concurrent}',
    finalFormulaDesc: 'The three altitudes of a triangle always intersect at a single point (the orthocenter).',
    keyInsight: 'The orthocenter is the intersection of all three altitudes. In an acute triangle it lies inside; in an obtuse triangle it lies outside! This concurrency is why the three altitudes of a triangle always meet — a remarkable geometric fact used in surveying to locate positions.',
    steps: [
      { label: 'Define vertices and slopes', formula: "A(x_1, y_1), B(x_2, y_2), C(x_3, y_3)", detail: '🏔️ A surveyor is mapping a triangular plot of land. To find the orthocenter (where all lines of elevation meet), they need to prove the three altitudes intersect at one point.' },
      { label: 'Slope of BC → altitude AD', formula: "m_{BC} = \\frac{y_3 - y_2}{x_3 - x_2} \\Rightarrow m_{AD} = -\\frac{x_3 - x_2}{y_3 - y_2}", detail: '📐 The slope of BC is (y₃−y₂)/(x₃−x₂). Altitude AD ∦ BC, so its slope is the negative reciprocal: m_AD = −(x₃−x₂)/(y₃−y₂).' },
      { label: 'Equation of altitude AD', formula: "y - y_1 = -\\frac{x_3 - x_2}{y_3 - y_2}(x - x_1)", detail: '🧮 Using point-slope form with point A(x₁, y₁): y − y₁ = m_AD(x − x₁). Rearranging: (x₃−x₂)x + (y₃−y₂)y − x₁(x₃−x₂) − y₁(y₃−y₂) = 0.' },
      { label: 'Determinant of coefficients = 0', formula: "R_1 \\to R_1 + R_2 + R_3 \\Rightarrow |D| = 0", detail: '✅ Write similar equations for BE and CF. Place their coefficients in a determinant. Adding R₂ + R₃ to R₁ makes the first row zero (since the sums of coefficients from each row cancel). A zero row means the determinant = 0, proving the lines are concurrent at the orthocenter!' },
    ],
    practice: { question: 'Triangle with vertices (0,0), (4,0), (2,5). The three altitudes meet at a single point. What is this property called?', hint: 'Hint: It starts with "con" and relates to lines of elevation.', answer: 1, tolerance: 0.5, explanation: 'Concurrency of altitudes — the orthocenter!', errorHint: 'Think about what it means for three lines to meet at one point' },
    interactive: ConcurrencyInteractive,
  },

  concurrency_bisectors: {
    theoremKey: 'class12.concurrency_bisectors',
    title: 'Concurrency of Right Bisectors',
    icon: <Move3d className="w-5 h-5 text-white" />,
    accentGradient: 'from-blue-500 to-indigo-600',
    accentColor: 'bg-blue-600',
    finalFormula: 'text{Right bisectors of sides are concurrent}',
    finalFormulaDesc: "The perpendicular bisectors of a triangle\'s sides intersect at the circumcenter.",
    keyInsight: "The circumcenter is the center of the circle that passes through all three vertices. It\'s the intersection of the three perpendicular bisectors. This point is equidistant from all vertices — explaining why you can always draw a unique circle through any three non-collinear points!",
    steps: [
      { label: 'Midpoint and slope of BC', formula: "M_{BC} = (\\frac{x_2+x_3}{2}, \\frac{y_2+y_3}{2}), m_{\\perp} = -\\frac{x_3-x_2}{y_3-y_2}", detail: '📍 GPS triangulation: Three satellite positions A, B, C are known. To find your location, construct the perpendicular bisectors of AB and BC — their intersection is your position (circumcenter)!' },
      { label: 'Equation of right bisector', formula: "y - \\frac{y_2+y_3}{2} = -\\frac{x_3-x_2}{y_3-y_2}(x - \\frac{x_2+x_3}{2})", detail: '📐 The right bisector of BC passes through the midpoint with slope perpendicular to BC.' },
      { label: 'Simplify and write in standard form', formula: "(x_3-x_2)x + (y_3-y_2)y - \\frac{1}{2}(x_3^2 - x_2^2) - \\frac{1}{2}(y_3^2 - y_2^2) = 0", detail: '🧮 Multiplying through and rearranging gives the standard linear equation. Note the constant terms involve squares of coordinates.' },
      { label: 'Determinant test', formula: "R_1 \\to R_1 + R_2 + R_3 \\Rightarrow first row = 0 \\Rightarrow |D| = 0", detail: '✅ Write the equations for all three bisectors. The coefficient determinant has its first row become zero after adding R₂ + R₃. Zero determinant = concurrency. The intersection point (circumcenter) is equidistant from all three vertices — the center of the circumscribed circle!' },
    ],
    practice: { question: 'What is the center of the circumscribed circle called?', hint: 'Hint: "circum" + "center"', answer: 1, tolerance: 0.5, explanation: 'The circumcenter!', errorHint: 'circum + center = ?' },
    interactive: ConcurrencyInteractive,
  },

  concurrency_medians: {
    theoremKey: 'class12.concurrency_medians',
    title: 'Concurrency of Medians',
    icon: <Move3d className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-violet-600',
    accentColor: 'bg-indigo-600',
    finalFormula: 'text{Medians AD, BE, CF are concurrent at centroid}',
    finalFormulaDesc: 'The three medians of a triangle intersect at the centroid — the triangle’s center of mass.',
    keyInsight: 'The centroid divides each median in a 2:1 ratio from the vertex to the midpoint. It’s the center of mass of the triangle — if you cut a triangle out of cardboard, it balances perfectly at the centroid! Engineers use this to find the center of gravity of triangular structures.',
    steps: [
      { label: 'Median AD: vertex A to midpoint of BC', formula: "M_{BC} = (\\frac{x_2 + x_3}{2}, \\frac{y_2 + y_3}{2})", detail: '⚖️ An architect is designing a triangular steel truss for a bridge roof. The center of mass (centroid) is where the medians intersect — this is where the main support column should be placed.' },
      { label: 'Two-point form of median AD', formula: "\\frac{y - y_1}{x - x_1} = \\frac{\\frac{y_2+y_3}{2} - y_1}{\\frac{x_2+x_3}{2} - x_1}", detail: '📐 The median AD passes through A(x₁, y₁) and the midpoint of BC. Using the two-point formula.' },
      { label: 'Simplify to linear equation', formula: "(y_2+y_3-2y_1)x - (x_2+x_3-2x_1)y + (x_2+x_3-2x_1)y_1 - (y_2+y_3-2y_1)x_1 = 0", detail: '🧮 Cross-multiply and simplify to get a standard linear form.' },
      { label: 'Determinant of coefficients = 0', formula: "R_1 \\to R_1 + R_2 + R_3 \\Rightarrow |D| = 0", detail: '✅ Write all three median equations. Their coefficient determinant becomes zero after adding rows, proving concurrency. The intersection point G = ((x₁+x₂+x₃)/3, (y₁+y₂+y₃)/3) — the centroid. This is also the average of the vertices, making it the center of mass!' },
    ],
    practice: { question: 'Triangle with vertices (0,0), (6,0), (3,6). Find the centroid x-coordinate.', hint: 'Centroid = ((0+6+3)/3, (0+0+6)/3) = (3, 2). x = 3', answer: 3, tolerance: 0.5, explanation: 'Centroid x = (0+6+3)/3 = 3.', errorHint: 'Centroid = ((x₁+x₂+x₃)/3, (y₁+y₂+y₃)/3)' },
    interactive: ConcurrencyInteractive,
  },

  homogeneous_second_degree: {
    theoremKey: 'class12.homogeneous_second_degree',
    title: 'Homogeneous Second-Degree Equations',
    icon: <Hash className="w-5 h-5 text-white" />,
    accentGradient: 'from-violet-500 to-indigo-600',
    accentColor: 'bg-violet-600',
    finalFormula: 'ax^2 + 2hxy + by^2 = 0 text{ represents two lines through origin}',
    finalFormulaDesc: 'Every homogeneous second-degree equation represents a pair of lines through the origin.',
    keyInsight: 'A homogeneous equation ax² + 2hxy + by² = 0 has all terms of degree 2. It always factors into two linear equations, meaning it represents two straight lines through the origin. If h² − ab > 0, the lines are distinct and real — used in optics to analyze light cone sections!',
    steps: [
      { label: 'Multiply both sides by a', formula: "a^2 x^2 + 2ahxy + aby^2 = 0", detail: '🔦 A physicist is analyzing a beam of light spreading from a point source. The light cone is described by a homogeneous equation: ax² + 2hxy + by² = 0. The goal is to factor it into two distinct rays.' },
      { label: 'Add and subtract h²y²', formula: "a^2x^2 + 2ahxy + h^2y^2 - h^2y^2 + aby^2 = 0", detail: '📐 The key insight: complete a perfect square by adding and subtracting h²y².' },
      { label: 'Condense into perfect square', formula: "(ax + hy)^2 - y^2(h^2 - ab) = 0", detail: '🧮 The first three terms form (ax + hy)². The remaining terms become −y²(h²−ab).' },
      { label: 'Factor as difference of squares', formula: "(ax + hy + ysqrt{h^2-ab})(ax + hy - ysqrt{h^2-ab}) = 0", detail: '✅ As a difference of squares: (ax + hy)² − (y√(h²−ab))² = 0. This factors into two linear equations: ax + y(h ± √(h²−ab)) = 0. Both pass through the origin (no constant term). If h² > ab: two distinct real lines. If h² = ab: one repeated line. If h² < ab: complex (imaginary) lines.' },
    ],
    practice: { question: 'Does x² − y² = 0 factor into two lines?', hint: 'x² − y² = (x−y)(x+y) = 0 gives lines x=y and x=−y', answer: 1, tolerance: 0.5, explanation: 'Yes! x² − y² = (x−y)(x+y) = 0 is two lines through the origin: x = y and x = −y.', errorHint: 'Check if h² − ab > 0' },
    interactive: ConcurrencyInteractive,
  },

  // ── Unit 7: Conic Sections ──
  circle_general: {
    theoremKey: 'class12.circle_general',
    title: 'General Equation of a Circle',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-violet-500 to-purple-600',
    accentColor: 'bg-violet-600',
    finalFormula: "x^2 + y^2 + 2gx + 2fy + c = 0 text{ is a circle with center } (-g, -f) text{ and radius } sqrt{g^2+f^2-c}",
    finalFormulaDesc: 'The general equation represents a circle with center (−g, −f) and radius √(g²+f²−c).',
    keyInsight: 'By completing the square, any equation x² + y² + 2gx + 2fy + c = 0 can be rewritten as a circle. If g²+f²−c > 0, it’s a real circle; if equal to 0, it’s a point circle; if negative, the equation has no real graph. This is how GPS receivers determine your position from three circle equations!',
    steps: [
      { label: 'Start with general equation', formula: "x^2 + y^2 + 2gx + 2fy + c = 0", detail: '🗺️ A GPS receiver detects signals from three satellites. Each satellite’s signal defines a circle: x² + y² + 2gx + 2fy + c = 0. The receiver needs to find the center and radius of each circle to triangulate your position.' },
      { label: 'Group x and y terms', formula: "(x^2 + 2gx) + (y^2 + 2fy) = -c", detail: '📐 Separate the x and y terms, moving c to the right side.' },
      { label: 'Complete the square for x and y', formula: "(x^2 + 2gx + g^2) - g^2 + (y^2 + 2fy + f^2) - f^2 = -c", detail: '🧮 Add g² (to complete (x+g)²) and f² (to complete (y+f)²). Balance by subtracting g² and f² on the same side.' },
      { label: 'Rewrite in standard form', formula: "(x+g)^2 + (y+f)^2 = g^2 + f^2 - c", detail: '✅ This matches the standard circle form (x−h)² + (y−k)² = r² where h = −g, k = −f, r = √(g²+f²−c). The center is (−g, −f) and radius is √(g²+f²−c). For a real circle, we need g²+f²−c > 0!' },
    ],
    practice: { question: 'x²+y²+4x+6y+4=0. Find the center x-coordinate.', hint: 'Center = (−g, −f) = (−2, −3). x = −2', answer: -2, tolerance: 0.5, explanation: 'g=2, f=3, c=4. Center = (−2, −3). Radius = √(4+9−4) = 3.', errorHint: 'Complete the square: center = (−g, −f)' },
    interactive: CircleCenterInteractiveWrapper,
  },

  circle_tangent: {
    theoremKey: 'class12.circle_tangent',
    title: 'Tangent to a Circle at a Given Point',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-purple-500 to-fuchsia-600',
    accentColor: 'bg-purple-600',
    finalFormula: "x_1x + y_1y + g(x + x_1) + f(y + y_1) + c = 0",
    finalFormulaDesc: 'Equation of the tangent to the circle at point P(x₁, y₁).',
    keyInsight: 'The tangent to a circle at a point is perpendicular to the radius at that point. The formula x₁x + y₁y + g(x + x₁) + f(y + y₁) + c = 0 is derived by applying the slope condition. This is known as "T = 0" — replace x² → x₁x, y² → y₁y, x → (x+x₁)/2, y → (y+y₁)/2!',
    steps: [
      { label: 'Find the slope by implicit differentiation', formula: "2x + 2y \\frac{dy}{dx} + 2g + 2f \\frac{dy}{dx} = 0", detail: '🎯 A machinist needs to cut a gear tooth that makes contact at a precise point on a circular gear. The cutting tool must follow the tangent line at the contact point.' },
      { label: 'Solve for dy/dx', formula: "\\frac{dy}{dx} = -\\frac{x+g}{y+f}", detail: '📐 Differentiate implicitly: 2x + 2y·y\' + 2g + 2f·y\' = 0. Solve for y\': dy/dx = −(x+g)/(y+f).' },
      { label: 'Point-slope form at P(x₁, y₁)', formula: "y - y_1 = -\\frac{x_1+g}{y_1+f}(x - x_1)", detail: '🧮 At point P(x₁, y₁), substitute into dy/dx: slope m = −(x₁+g)/(y₁+f). The tangent line in point-slope form: y − y₁ = m(x − x₁).' },
      { label: 'Rearrange to T = 0 form', formula: "(y_1+f)(y - y_1) = -(x_1+g)(x - x_1) \\Rightarrow x_1x + y_1y + g(x + x_1) + f(y + y_1) + c = 0", detail: '✅ Cross-multiply and rearrange. The result is the elegant T = 0 formula: replace x² → x₁x, y² → y₁y, 2gx → g(x+x₁), 2fy → f(y+y₁), c → c. The tangent equation is written without computing the derivative explicitly!' },
    ],
    practice: { question: 'Circle x²+y²=25 at point (3,4). Tangent slope = −x₁/y₁ = −3/4 = ?', hint: '−3/4 = −0.75', answer: -0.75, tolerance: 0.05, explanation: 'Slope = −3/4 = −0.75. The tangent equation is 3x+4y=25.', errorHint: 'Slope = −(x₁+g)/(y₁+f)' },
    interactive: CircleRadiusInteractiveWrapper,
  },

  parabola_standard: {
    theoremKey: 'class12.parabola_standard',
    title: 'Standard Equation of a Parabola',
    icon: <Target className="w-5 h-5 text-white" />,
    accentGradient: 'from-amber-500 to-orange-600',
    accentColor: 'bg-amber-600',
    finalFormula: 'y^2 = 4ax',
    finalFormulaDesc: 'A parabola with focus at (a, 0) and directrix x = −a.',
    keyInsight: 'A parabola is the set of points equidistant from a fixed point (focus) and a fixed line (directrix). This reflective property is why parabolic mirrors concentrate parallel light rays at the focus — used in telescopes, satellite dishes, and solar cookers!',
    steps: [
      { label: 'Definition: distance to focus = distance to directrix', formula: "|PF| = |PM|", detail: '📡 A satellite dish antenna has a parabolic shape. Signals arriving parallel to the axis reflect to the focus where the receiver is placed. The definition: every point P on the parabola is equidistant from the focus F and the directrix line.' },
      { label: 'Place focus at (a, 0) and directrix x = −a', formula: "\\sqrt{(x-a)^2 + y^2} = |x + a|", detail: '📐 Choose coordinate axes so the focus F = (a, 0) and the directrix is x = −a. The distance from P(x,y) to F is √[(x−a)²+y²]. The distance to the directrix is |x−(−a)| = |x + a|.' },
      { label: 'Square both sides', formula: "(x-a)^2 + y^2 = (x+a)^2", detail: '🧮 Square both sides (both are non-negative): (x−a)² + y² = (x+a)².' },
      { label: 'Simplify to y² = 4ax', formula: "x^2 - 2ax + a^2 + y^2 = x^2 + 2ax + a^2 \\Rightarrow y^2 = 4ax", detail: '✅ Expand: x²−2ax+a²+y² = x²+2ax+a². Cancel x² and a² on both sides. Solve: y² = 4ax. This is the standard equation of a parabola opening to the right. For satellite dishes: the receiver is at the focus (a, 0) and the dish follows y² = 4ax!' },
    ],
    practice: { question: 'Parabola y² = 12x. Find the focus (a, 0).', hint: 'y² = 4ax → 4a = 12 → a = 3', answer: 3, tolerance: 0.5, explanation: '4a = 12, so a = 3. Focus = (3, 0).', errorHint: 'y² = 4ax. Solve for a from 4a = coefficient.' },
    interactive: ParabolaInteractiveWrapper,
  },

  parabola_tangent: {
    theoremKey: 'class12.parabola_tangent',
    title: 'Tangent to a Parabola',
    icon: <Target className="w-5 h-5 text-white" />,
    accentGradient: 'from-orange-500 to-red-600',
    accentColor: 'bg-orange-600',
    finalFormula: "y = mx + frac{a}{m}, text{ where } c = frac{a}{m}",
    finalFormulaDesc: 'Condition for tangency: substitute y = mx + c into y² = 4ax and set discriminant = 0.',
    keyInsight: 'A line y = mx + c is tangent to y² = 4ax if c = a/m. This means the slope form of the tangent is y = mx + a/m. For a given slope m, there are exactly two parallel tangents (one on each side of the parabola), except for the vertical tangent at the vertex!',
    steps: [
      { label: 'Substitute line into parabola', formula: "y = mx + c \\Rightarrow (mx + c)^2 = 4ax", detail: '🎯 An architect is designing a parabolic arch and needs to find the tangent line at a point to calculate the support beam angle. Substitute the line equation y = mx + c into the parabola y² = 4ax.' },
      { label: 'Expand to quadratic in x', formula: "m^2x^2 + 2mcx + c^2 - 4ax = 0 \\Rightarrow m^2x^2 + 2(mc - 2a)x + c^2 = 0", detail: '📐 Expand: m²x² + 2mcx + c² = 4ax. Rearrange: m²x² + 2(mc−2a)x + c² = 0. This is a quadratic in x.' },
      { label: 'Set discriminant = 0 for tangency', formula: "D = 4(mc-2a)^2 - 4m^2c^2 = 0", detail: '🧮 For tangency, the line must intersect at exactly one point. This means the quadratic has a double root: its discriminant D = b²−4ac must be zero.' },
      { label: 'Solve for c', formula: "4(mc-2a)^2 - 4m^2c^2 = 0 \\Rightarrow -16amc + 16a^2 = 0 \\Rightarrow mc = a \\Rightarrow c = \\frac{a}{m}", detail: '✅ Expand: 4(m²c²−4amc+4a²) − 4m²c² = 0 → −16amc + 16a² = 0 → mc = a → c = a/m. The tangent equation in slope form: y = mx + a/m. This formula allows architects to find the support beam angle at any point on a parabolic arch!' },
    ],
    practice: { question: 'Parabola y² = 8x. Line slope m = 2. Find c for tangency (c = a/m).', hint: 'y² = 8x → 4a = 8 → a = 2. c = 2/2 = 1', answer: 1, tolerance: 0.5, explanation: 'a = 2, c = 2/2 = 1. Tangent: y = 2x + 1.', errorHint: 'c = a/m (coefficient from 4a)' },
    interactive: ParabolaInteractiveWrapper,
  },

  ellipse_standard: {
    theoremKey: 'class12.ellipse_standard',
    title: 'Standard Equation of an Ellipse',
    icon: <Target className="w-5 h-5 text-white" />,
    accentGradient: 'from-green-500 to-emerald-600',
    accentColor: 'bg-green-600',
    finalFormula: 'frac{x^2}{a^2} + frac{y^2}{b^2} = 1',
    finalFormulaDesc: 'An ellipse with foci at (±c, 0) where c² = a²−b².',
    keyInsight: 'An ellipse is the set of points where the sum of distances to two foci is constant (2a). This is why planetary orbits are elliptical with the Sun at one focus (Kepler’s First Law). The flattening depends on eccentricity e = c/a = √(1−b²/a²)!',
    steps: [
      { label: 'Definition: sum of distances to foci = 2a', formula: "|PF_1| + |PF_2| = 2a", detail: '🌍 Johannes Kepler discovered that planets orbit the Sun in elliptical paths. The Sun is at one focus. The sum of distances from any point on the ellipse to the two foci is constant — the length of the major axis.' },
      { label: 'Set foci at (±c, 0) and point P(x, y)', formula: "\\sqrt{(x+c)^2 + y^2} + \\sqrt{(x-c)^2 + y^2} = 2a", detail: '📐 Place foci at F₁(−c, 0) and F₂(c, 0). For any point P(x,y) on the ellipse: √[(x+c)²+y²] + √[(x−c)²+y²] = 2a.' },
      { label: 'Isolate and square twice', formula: "a \\sqrt{(x-c)^2 + y^2} = a^2 - cx \\Rightarrow (a^2-c^2)x^2 + a^2y^2 = a^2(a^2-c^2)", detail: '🧮 Isolate one radical, square both sides, isolate the remaining radical, square again. After simplifying: (a²−c²)x² + a²y² = a²(a²−c²).' },
      { label: 'Let b² = a²−c² to get standard form', formula: "b^2x^2 + a^2y^2 = a^2b^2 \\Rightarrow \\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1", detail: '✅ Define b² = a²−c². Then b²x² + a²y² = a²b² → x²/a² + y²/b² = 1. For Earth’s orbit: a ≈ 149.6 million km, b ≈ 149.5 million km (nearly circular, e ≈ 0.017). Mars has e ≈ 0.093 — noticeably more elliptical!' },
    ],
    practice: { question: 'Ellipse x²/25 + y²/9 = 1. Find c (distance from center to focus).', hint: 'a²=25, b²=9. c² = a²−b² = 25−9 = 16. c = 4', answer: 4, tolerance: 0.5, explanation: 'a=5, b=3, c=√(25−9)=4.', errorHint: 'c² = a²−b²' },
    interactive: EllipseInteractiveWrapper,
  },

  hyperbola_standard: {
    theoremKey: 'class12.hyperbola_standard',
    title: 'Standard Equation of a Hyperbola',
    icon: <Target className="w-5 h-5 text-white" />,
    accentGradient: 'from-rose-500 to-pink-600',
    accentColor: 'bg-rose-600',
    finalFormula: 'frac{x^2}{a^2} - frac{y^2}{b^2} = 1',
    finalFormulaDesc: 'A hyperbola with foci at (±c, 0) where c² = a²+b².',
    keyInsight: 'A hyperbola is the set of points where the difference of distances to two foci is constant (2a). Unlike the ellipse (sum is constant), the hyperbola has two separate branches. Used in navigation (LORAN systems) where the difference in signal arrival times from two stations locates a ship!',
    steps: [
      { label: 'Definition: difference of distances to foci = 2a', formula: "||PF_1| - |PF_2|| = 2a", detail: '🚢 A ship uses LORAN navigation: two radio stations at F₁ and F₂ transmit synchronized signals. The ship measures the difference in arrival times. The locus of constant time difference is a hyperbola with foci at the stations.' },
      { label: 'Set foci at (±c, 0) and point P(x, y)', formula: "\\sqrt{(x+c)^2 + y^2} - \\sqrt{(x-c)^2 + y^2} = 2a", detail: '📐 The absolute difference of distances to F₁(−c,0) and F₂(c,0) equals 2a. Choose the branch where PF₁ > PF₂.' },
      { label: 'Square twice (same process as ellipse but sign differs)', formula: "(c^2 - a^2)x^2 - a^2y^2 = a^2(c^2 - a^2)", detail: '🧮 Same double-squaring technique as the ellipse. But the sign difference (subtraction vs addition) leads to a different final form.' },
      { label: 'Let b² = c²−a² to get standard form', formula: "b^2x^2 - a^2y^2 = a^2b^2 \\Rightarrow \\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1", detail: '✅ Define b² = c²−a². The standard form x²/a² − y²/b² = 1 has two branches (left and \). Asymptotes: y = ±(b/a)x. The LORAN ship: if stations are 100km apart (2c=100) and the constant difference is 60km (2a=60), then b² = 50²−30² = 1600, and the ship lies on x²/900 − y²/1600 = 1!' },
    ],
    practice: { question: 'Hyperbola x²/16 − y²/9 = 1. Find c (focus distance from center).', hint: 'a²=16, b²=9. c² = a²+b² = 16+9 = 25. c = 5', answer: 5, tolerance: 0.5, explanation: 'a=4, b=3, c=√(16+9)=5.', errorHint: 'For hyperbola, c² = a²+b²' },
    interactive: HyperbolaInteractiveWrapper,
  },
};
