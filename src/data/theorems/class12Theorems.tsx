import { useTranslate } from '../../i18n';
import { useState } from 'react';
import { CheckCircle, XCircle, Hash, Infinity, Move3d, Circle, Target } from 'lucide-react';
import type { TheoremConfig } from '../../components/generic/GenericTheoremLab';

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
  let formula = `d/dx(x^${n}) at x=${x} = ${n}Ã—${x}^${n-1}`;
  let resultStr = `f'(${x}) = ${derivative.toFixed(2)}`;
  let correctVal = derivative;

  if (mode === 'sin') {
    displayVal = sinDeriv;
    formula = `d/dx(sin x) at x=${x}Â° = cos(${x}Â°)`;
    resultStr = `cos(${x}Â°) = ${sinDeriv.toFixed(4)}`;
    correctVal = sinDeriv;
  } else if (mode === 'invsin') {
    displayVal = invSinDeriv;
    formula = `d/dx(sinâ»Â¹x) at x=0.5 = 1/âˆš(1-0.5Â²)`;
    resultStr = `1/âˆš(0.75) = ${invSinDeriv.toFixed(4)}`;
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
          {t("âˆ«â‚áµ‡ xâ¿ dx = [xâ¿âºÂ¹/(n+1)]â‚áµ‡")}<br />
          = {bVal}^{nExp+1}/{nExp+1} - {aVal}^{nExp+1}/{nExp+1}<br />
          = <strong>{integral.toFixed(2)}</strong>
        </p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder="âˆ« = ?" step="0.1" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-emerald-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! Integral =")} {integral.toFixed(2)}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Apply âˆ« xâ¿ = xâ¿âºÂ¹/(n+1)")}</p>}
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
          <label className="text-[10px] font-semibold">{t("a (coeff of xÂ²)")}</label>
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
          {t("f(x) =")} {coeffA}{t("xÂ² +")} {coeffB}{t("x +")} {coeffC}<br />
          {t("F(x) =")} {coeffA}{t("xÂ³/3 +")} {coeffB}{t("xÂ²/2 +")} {coeffC}x<br />
          {t("âˆ«â‚áµ‡ = F(")}{bVal}{t(") âˆ’ F(")}{aVal}) = <strong>{integral.toFixed(2)}</strong>
        </p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={t("âˆ« f(x) dx = ?")} step="0.1" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-rose-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct! âˆ« =")} {integral.toFixed(2)}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Use F(b) âˆ’ F(a)")}</p>}
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
          <label className="text-[10px] font-semibold">{t("A (xâ‚,yâ‚)")}</label>
          <div className="grid grid-cols-2 gap-1">
            <input type="range" min="1" max="8" step="1" value={x1} onChange={e => { setX1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-cyan-500" />
            <input type="range" min="1" max="8" step="1" value={y1} onChange={e => { setY1(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-cyan-500" />
          </div>
          <span className="text-xs">({x1},{y1})</span>
        </div>
        <div>
          <label className="text-[10px] font-semibold">{t("B (xâ‚‚,yâ‚‚)")}</label>
          <div className="grid grid-cols-2 gap-1">
            <input type="range" min="1" max="8" step="1" value={x2} onChange={e => { setX2(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-cyan-500" />
            <input type="range" min="1" max="8" step="1" value={y2} onChange={e => { setY2(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-cyan-500" />
          </div>
          <span className="text-xs">({x2},{y2})</span>
        </div>
        <div>
          <label className="text-[10px] font-semibold">{t("C (xâ‚ƒ,yâ‚ƒ)")}</label>
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
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Centroid = ((xâ‚+xâ‚‚+xâ‚ƒ)/3, (yâ‚+yâ‚‚+yâ‚ƒ)/3)")}</p>}
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
          {t("xÂ² + yÂ² + 2(")}{gVal}{t(")x + 2(")}{fVal}{t(")y +")} {cVal} = 0<br />
          {t("Center: (")}{-gVal}, {-fVal})<br />
          {t("radiusÂ² =")} {gVal}Â² + {fVal}Â² âˆ’ {cVal} = {gVal * gVal + fVal * fVal - cVal}<br />
          {t("r =")} {isValid ? radius.toFixed(2) : 'imaginary - no real circle'}
        </p>
      </div>
      <div className="flex gap-2">
        <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)} placeholder={mode === 'radius' ? 'r = ?' : 'h = ?'} step="0.1" className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-violet-500 outline-none" />
        <button onClick={handleCheck} className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg">{t("Check")}</button>
      </div>
      {checkResult === 'correct' && <p className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 inline" /> {t("Correct!")}</p>}
      {checkResult === 'incorrect' && <p className="text-xs text-red-500"><XCircle className="w-3 h-3 inline" /> {t("Complete the square: (x+g)Â² + (y+f)Â² = gÂ²+fÂ²-c")}</p>}
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
    displayStr = `xÂ²/${aVal}Â² + yÂ²/${bVal}Â² = 1\ne = ${ecc.toFixed(3)}, foci: (Â±${focusDist.toFixed(1)}, 0)`;
    correctVal = focusDist;
  } else if (mode === 'hyperbola') {
    displayStr = `xÂ²/${aVal}Â² âˆ’ yÂ²/${bVal}Â² = 1\ne = ${hypEcc.toFixed(3)}, foci: (Â±${focusDist.toFixed(1)}, 0)`;
    correctVal = hypEcc;
  } else {
    displayStr = `yÂ² = 4(${parabFocal})x\nFocus: (${parabFocal}, 0), Directrix: x = -${parabFocal}`;
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
  // â”€â”€ Unit 2: Limits, Continuity and Derivative â”€â”€
  power_rule: {
    theoremKey: 'class12.power_rule',
    title: 'Power Rule for Differentiation',
    icon: <Hash className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-purple-600',
    accentColor: 'bg-indigo-600',
    finalFormula: 'd/dx x^n = nx^{n-1}',
    finalFormulaDesc: 'The derivative of xâ¿ is nÂ·xâ¿â»Â¹ for any positive integer n.',
    keyInsight: 'The power rule is the single most used differentiation formula! It transforms polynomials into simpler ones: each term\'s exponent drops by 1 and becomes the new coefficient. Used everywhere from physics (velocity = derivative of position) to economics (marginal cost from total cost).',
    steps: [
      { label: 'Definition of derivative', formula: "f'(x) = lim_{h \â†’ 0} \{f(x+h) - f(x)}{h}", detail: 'ðŸ“ˆ A rocket scientist needs to calculate the velocity of a spacecraft at every instant. Position s(t) = tÂ³. By definition, velocity = derivative = limit of (s(t+h)âˆ’s(t))/h as hâ†’0.' },
      { label: 'Expand using binomial theorem', formula: "(x+h)^n = x^n + nx^{n-1}h + \\frac{n(n-1)}{2!}x^{n-2}h^2 + ... + h^n", detail: 'ðŸ“ Expand (x+h)â¿ using the binomial theorem. The terms are: xâ¿ + nÂ·xâ¿â»Â¹Â·h + n(nâˆ’1)/2!Â·xâ¿â»Â²Â·hÂ² + ... + hâ¿.' },
      { label: 'Cancel xâ¿ terms', formula: "\\frac{(x+h)^n - x^n}{h} = nx^{n-1} + \\frac{n(n-1)}{2!}x^{n-2}h + ... + h^{n-1}", detail: 'ðŸ§® Subtract xâ¿ and divide by h. The xâ¿ cancels, and every remaining term contains h. Factor h: the numerator becomes h[nÂ·xâ¿â»Â¹ + ... + hâ¿â»Â¹]. Cancel h with denominator.' },
      { label: 'Take limit as hâ†’0', formula: "lim_{h \\to 0} nx^{n-1} + \\frac{n(n-1)}{2!}x^{n-2}h + ... + h^{n-1} = nx^{n-1}", detail: 'âœ… As hâ†’0, all terms with h vanish, leaving only nÂ·xâ¿â»Â¹. For the rocket: if s(t) = tÂ³, velocity v(t) = 3tÂ². At t=5 seconds: v = 3Ã—25 = 75 m/s. The power rule makes differentiation instant!' },
    ],
    practice: { question: 'd/dx xâµ = ?', hint: 'd/dx xâ¿ = nÂ·xâ¿â»Â¹, so d/dx xâµ = 5Â·xâ´', answer: 0, tolerance: 10, explanation: 'd/dx xâµ = 5xâ´', errorHint: 'd/dx xâ¿ = nÂ·xâ¿â»Â¹' },
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
    keyInsight: 'This is the foundation of all trigonometric calculus! The derivative of sine is cosine because the slope of sin x at any point equals the value of cos x at that point. This relationship is what makes simple harmonic motion (springs, pendulums) so elegant: dÂ²x/dtÂ² = âˆ’Ï‰Â²x.',
    steps: [
      { label: 'Definition of derivative', formula: "d/dx sin x = lim_{h \\to 0} \\frac{sin(x+h) - sin x}{h}", detail: 'ðŸŽµ An audio engineer analyzing sound waves needs to know how the amplitude changes. A sine wave sin(440t) represents musical note A440. The rate of change gives the velocity of the speaker cone.' },
      { label: 'Apply sum identity', formula: "sin(x+h) = sin x cos h + cos x sin h", detail: 'ðŸ“ Use the identity sin(A+B) = sin A cos B + cos A sin B: sin(x+h) = sin x cos h + cos x sin h.' },
      { label: 'Group and rearrange', formula: "lim_{h \\to 0} [sin x \\frac{cos h - 1}{h} + cos x \\frac{sin h}{h}]", detail: 'ðŸ§® Factor: = lim[sin x(cos h âˆ’ 1)/h + cos x(sin h)/h]. Two special limits emerge!' },
      { label: 'Apply known limits', formula: "lim_{h \\to 0} \\frac{cos h - 1}{h} = 0, lim_{h \\to 0} \\frac{sin h}{h} = 1", detail: 'âœ… The two fundamental limits: (1) lim(cos h âˆ’ 1)/h = 0 (the graph of cos is flat at h=0), (2) lim(sin h)/h = 1 (the small-angle approximation). Result: d/dx sin x = sin xÂ·0 + cos xÂ·1 = cos x. Similarly, d/dx cos x = âˆ’sin x.' },
    ],
    practice: { question: 'd/dx sin(Ï€/3) = cos(Ï€/3) = ?', hint: 'cos(60Â°) = 0.5', answer: 0.5, tolerance: 0.05, explanation: 'cos(60Â°) = 0.5', errorHint: 'd/dx sin x = cos x' },
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
    keyInsight: 'Inverse trig derivatives appear in many integration problems (âˆ« 1/âˆš(1âˆ’xÂ²) dx = sinâ»Â¹ x + C). They\'re also essential in physics for calculating angles from ratios, like finding the launch angle of a projectile from its velocity components!',
    steps: [
      { label: 'Let y = sinâ»Â¹ x â‡’ x = sin y', formula: "x = sin y, \\quad -pi/2 \\le y \\le pi/2", detail: 'ðŸŽ¯ A ballistics expert measures the ratio of vertical to horizontal velocity (x) and needs the angle. If x = 0.5, then y = sinâ»Â¹(0.5) = 30Â°. Implicit differentiation finds how the angle changes with the ratio.' },
      { label: 'Differentiate implicitly', formula: "1 = cos y \\frac{dy}{dx} \\Rightarrow \\frac{dy}{dx} = \\frac{1}{cos y}", detail: 'ðŸ“ Using implicit differentiation: d/dx(x) = d/dx(sin y) â†’ 1 = cos y Â· dy/dx â†’ dy/dx = 1/cos y.' },
      { label: 'Substitute cos y = âˆš(1âˆ’sinÂ²y)', formula: "\\frac{dy}{dx} = \\frac{1}{\\sqrt{1 - sin^2 y}} = \\frac{1}{\\sqrt{1 - x^2}}", detail: 'ðŸ§® Using the identity cosÂ²y + sinÂ²y = 1: cos y = âˆš(1âˆ’sinÂ²y) = âˆš(1âˆ’xÂ²). Therefore d/dx sinâ»Â¹ x = 1/âˆš(1âˆ’xÂ²).' },
      { label: 'Same process for tanâ»Â¹ x', formula: "x = tan y \\Rightarrow 1 = sec^2 y \\frac{dy}{dx} \\Rightarrow \\frac{1}{sec^2 y} = \\frac{1}{1+tan^2 y} = \\frac{1}{1+x^2}", detail: 'âœ… For tanâ»Â¹: differentiate x = tan y â†’ 1 = secÂ²yÂ·dy/dx. Since secÂ²y = 1 + tanÂ²y = 1 + xÂ², we get d/dx tanâ»Â¹ x = 1/(1+xÂ²). These formulas are the key to integrating rational functions!' },
    ],
    practice: { question: 'd/dx sinâ»Â¹(0) = 1/âˆš(1âˆ’0Â²) = ?', hint: '1/âˆš1 = 1', answer: 1, tolerance: 0.1, explanation: 'd/dx sinâ»Â¹(0) = 1', errorHint: 'd/dx sinâ»Â¹ x = 1/âˆš(1âˆ’xÂ²)' },
    interactive: InverseTrigInteractiveWrapper,
  },

  // â”€â”€ Unit 3: Integration â”€â”€
  basic_integrals: {
    theoremKey: 'class12.basic_integrals',
    title: 'Basic Indefinite Integrals',
    icon: <Infinity className="w-5 h-5 text-white" />,
    accentGradient: 'from-emerald-500 to-teal-600',
    accentColor: 'bg-emerald-600',
    finalFormula: 'int x^n dx = frac{x^{n+1}}{n+1} + c, int frac{1}{x} dx = ln|x| + c, int a^x dx = frac{a^x}{ln a} + c',
    finalFormulaDesc: 'Basic integral formulas derived from reverse differentiation.',
    keyInsight: 'Integration is the inverse of differentiation. Every differentiation rule gives an integration rule! The power rule d/dx xâ¿âºÂ¹/(n+1) = xâ¿ reverses to âˆ« xâ¿ dx = xâ¿âºÂ¹/(n+1) + C. This is the foundation of all integral calculus.',
    steps: [
      { label: 'Reverse the power rule', formula: "\\int x^n dx = \\frac{x^{n+1}}{n+1} + c, (n neq -1)", detail: 'ðŸ—ï¸ A civil engineer calculating the volume of an irregular foundation uses integration. If the cross-sectional area is A(x) = xÂ², the volume from x=0 to x=3 is âˆ«â‚€Â³ xÂ² dx = [xÂ³/3]â‚€Â³ = 9 cubic meters.' },
      { label: 'The special case n = âˆ’1', formula: "\\int \\frac{1}{x} dx = ln|x| + c", detail: 'ðŸ“ The power rule fails when n = âˆ’1 (would give division by zero). But d/dx[ln x] = 1/x, so âˆ« 1/x dx = ln|x| + C. This is the bridge between algebraic and logarithmic functions.' },
      { label: 'Integral of exponential aË£', formula: "\\frac{d}{dx}[\\frac{a^x}{ln a}] = \\frac{a^x ln a}{ln a} = a^x \\Rightarrow \\int a^x dx = \\frac{a^x}{ln a} + c", detail: 'ðŸ§® Differentiate aË£/ln a: the derivative is aË£Â·ln a / ln a = aË£. Therefore âˆ« aË£ dx = aË£/ln a + C. For the natural exponential: âˆ« eË£ dx = eË£ + C (since ln e = 1).' },
      { label: 'Linearity of integration', formula: "\\int [f(x) + g(x)] dx = \\int f(x) dx + \\int g(x) dx, \\int kf(x) dx = k \\int f(x) dx", detail: 'âœ… Integration is linear: the integral of a sum is the sum of integrals, and constants factor out. This is why âˆ« (3xÂ² + 2x + 1) dx = 3Â·xÂ³/3 + 2Â·xÂ²/2 + x + C = xÂ³ + xÂ² + x + C.' },
    ],
    practice: { question: 'âˆ« xÂ³ dx = ? (Evaluate at x=2 minus x=0)', hint: 'âˆ« xÂ³ dx = xâ´/4. From 0 to 2: 2â´/4 = 16/4 = 4', answer: 4, tolerance: 0.5, explanation: 'âˆ«â‚€Â² xÂ³ dx = 2â´/4 âˆ’ 0â´/4 = 4', errorHint: 'âˆ« xâ¿ dx = xâ¿âºÂ¹/(n+1)' },
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
    keyInsight: 'Trigonometric substitution transforms square roots into trigonometric functions! âˆš(aÂ²âˆ’xÂ²) â†’ x = a sin Î¸ â†’ a cos Î¸, eliminating the radical. This technique was used by Newton to derive the area of a circle: âˆ« âˆš(aÂ²âˆ’xÂ²) dx gives the area of a circular segment!',
    steps: [
      { label: 'Substitute x = a sin Î¸', formula: "x = a sin theta, dx = a cos theta d theta", detail: 'ðŸ“ An astronomer is calculating the area of a circular telescope mirror of radius a. The integral âˆ« âˆš(aÂ²âˆ’xÂ²) dx appears. Substitute x = a sin Î¸, which converts the circleâ€™s equation into a trigonometric form.' },
      { label: 'Simplify the square root', formula: "\\sqrt{a^2 - x^2} = \\sqrt{a^2 - a^2 sin^2 theta} = a cos theta", detail: 'ðŸ§® âˆš(aÂ²âˆ’xÂ²) = âˆš(aÂ²âˆ’aÂ²sinÂ²Î¸) = aâˆš(1âˆ’sinÂ²Î¸) = a cos Î¸. The integral becomes âˆ« a cos Î¸ Â· a cos Î¸ dÎ¸ = aÂ² âˆ« cosÂ²Î¸ dÎ¸.' },
      { label: 'Integrate using half-angle', formula: "a^2 \\int \\frac{1+cos 2theta}{2} dtheta = \\frac{a^2}{2}(theta + \\frac{sin 2theta}{2}) + c", detail: 'ðŸ“ Use cosÂ²Î¸ = (1+cos 2Î¸)/2. Integrate: aÂ²[Î¸/2 + sin 2Î¸/4] + C = (aÂ²/2)Î¸ + (aÂ²/4) sin 2Î¸ + C.' },
      { label: 'Convert back to x', formula: "theta = sin^{-1}\\frac{x}{a}, sin 2theta = 2 sin theta cos theta = 2frac{x}{a}\\frac{\\sqrt{a^2 - x^2}}{a}", detail: 'âœ… Substituting back: âˆ«âˆš(aÂ²âˆ’xÂ²)dx = (aÂ²/2)sinâ»Â¹(x/a) + (xâˆš(aÂ²âˆ’xÂ²))/2 + C. This formula gives the area of a circular segment of height x â€” used in civil engineering for water flow in partially filled pipes!' },
    ],
    practice: { question: 'âˆ«â‚€Â³ 1/âˆš(9âˆ’xÂ²) dx = sinâ»Â¹(3/3) âˆ’ sinâ»Â¹(0/3) = ?', hint: 'sinâ»Â¹(1) = Ï€/2 â‰ˆ 1.57', answer: 1.57, tolerance: 0.1, explanation: 'âˆ«â‚€Â³ 1/âˆš(9âˆ’xÂ²) dx = sinâ»Â¹(1) âˆ’ sinâ»Â¹(0) = Ï€/2 â‰ˆ 1.57', errorHint: 'Use the formula âˆ« 1/âˆš(aÂ²âˆ’xÂ²) dx = sinâ»Â¹(x/a) + C' },
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
    keyInsight: 'The FTC is the single most important theorem in calculus! It connects the two central concepts: differentiation and integration are inverse operations. This is why we can compute areas by finding antiderivatives â€” a profound link between geometry and algebra.',
    steps: [
      { label: 'Define the area function', formula: "A(x) = int_a^x f(t) dt", detail: 'ðŸ”ï¸ A geologist is calculating the volume of sediment in a river delta. The cross-sectional area varies with distance x from the shore. Define A(x) = âˆ«â‚Ë£ f(t) dt as the accumulated area from a to x.' },
      { label: "Show A'(x) = f(x)", formula: "A'(x) = lim_{h \\to 0} \\frac{A(x+h) - A(x)}{h} = f(x)", detail: 'ðŸ“ By definition: A\'(x) = lim[A(x+h)âˆ’A(x)]/h as hâ†’0. But A(x+h)âˆ’A(x) = âˆ«â‚“Ë£âºÊ° f(t) dt â‰ˆ f(x)Â·h by the Mean Value Theorem. So A\'(x) = f(x). The area function is an antiderivative of f!' },
      { label: 'Any antiderivative F', formula: "F(x) = A(x) + c \\Rightarrow F(b) - F(a) = [A(b) + c] - [A(a) + c] = A(b) - A(a)", detail: 'ðŸ§® Since A\'(x) = f(x), any antiderivative F of f differs from A by a constant: F(x) = A(x) + C. Then F(b)âˆ’F(a) = A(b)âˆ’A(a).' },
      { label: 'Final result', formula: "int_a^b f(x) dx = A(b) = F(b) - F(a)", detail: 'âœ… But A(a) = âˆ«â‚áµƒ f(t) dt = 0, so F(b)âˆ’F(a) = A(b) = âˆ«â‚áµ‡ f(x) dx. The definite integral equals the antiderivative evaluated at the bounds. The river delta volume: if A\'(x) = 2x (linear increase), volume from x=0 to x=5 = [xÂ²]â‚€âµ = 25 cubic meters!' },
    ],
    practice: { question: 'âˆ«â‚Â³ (2x) dx. Find F(3) âˆ’ F(1) where F(x) = xÂ².', hint: 'F(3) = 9, F(1) = 1, so 9 âˆ’ 1 = 8', answer: 8, tolerance: 0.5, explanation: 'F(3)âˆ’F(1) = 9âˆ’1 = 8.', errorHint: 'FTC: âˆ«â‚áµ‡ f(x) dx = F(b)âˆ’F(a)' },
    interactive: FTCInteractive,
  },

  // â”€â”€ Unit 6: Analytical Geometry â”€â”€
  concurrency_altitudes: {
    theoremKey: 'class12.concurrency_altitudes',
    title: 'Concurrency of Altitudes in a Triangle',
    icon: <Move3d className="w-5 h-5 text-white" />,
    accentGradient: 'from-cyan-500 to-blue-600',
    accentColor: 'bg-cyan-600',
    finalFormula: 'text{Altitudes AD, BE, CF are concurrent}',
    finalFormulaDesc: 'The three altitudes of a triangle always intersect at a single point (the orthocenter).',
    keyInsight: 'The orthocenter is the intersection of all three altitudes. In an acute triangle it lies inside; in an obtuse triangle it lies outside! This concurrency is why the three altitudes of a triangle always meet â€” a remarkable geometric fact used in surveying to locate positions.',
    steps: [
      { label: 'Define vertices and slopes', formula: "A(x_1, y_1), B(x_2, y_2), C(x_3, y_3)", detail: 'ðŸ”ï¸ A surveyor is mapping a triangular plot of land. To find the orthocenter (where all lines of elevation meet), they need to prove the three altitudes intersect at one point.' },
      { label: 'Slope of BC â†’ altitude AD', formula: "m_{BC} = \\frac{y_3 - y_2}{x_3 - x_2} \\Rightarrow m_{AD} = -\\frac{x_3 - x_2}{y_3 - y_2}", detail: 'ðŸ“ The slope of BC is (yâ‚ƒâˆ’yâ‚‚)/(xâ‚ƒâˆ’xâ‚‚). Altitude AD âˆ¦ BC, so its slope is the negative reciprocal: m_AD = âˆ’(xâ‚ƒâˆ’xâ‚‚)/(yâ‚ƒâˆ’yâ‚‚).' },
      { label: 'Equation of altitude AD', formula: "y - y_1 = -\\frac{x_3 - x_2}{y_3 - y_2}(x - x_1)", detail: 'ðŸ§® Using point-slope form with point A(xâ‚, yâ‚): y âˆ’ yâ‚ = m_AD(x âˆ’ xâ‚). Rearranging: (xâ‚ƒâˆ’xâ‚‚)x + (yâ‚ƒâˆ’yâ‚‚)y âˆ’ xâ‚(xâ‚ƒâˆ’xâ‚‚) âˆ’ yâ‚(yâ‚ƒâˆ’yâ‚‚) = 0.' },
      { label: 'Determinant of coefficients = 0', formula: "R_1 \\to R_1 + R_2 + R_3 \\Rightarrow |D| = 0", detail: 'âœ… Write similar equations for BE and CF. Place their coefficients in a determinant. Adding Râ‚‚ + Râ‚ƒ to Râ‚ makes the first row zero (since the sums of coefficients from each row cancel). A zero row means the determinant = 0, proving the lines are concurrent at the orthocenter!' },
    ],
    practice: { question: 'Triangle with vertices (0,0), (4,0), (2,5). The three altitudes meet at a single point. What is this property called?', hint: 'Hint: It starts with "con" and relates to lines of elevation.', answer: 1, tolerance: 0.5, explanation: 'Concurrency of altitudes â€” the orthocenter!', errorHint: 'Think about what it means for three lines to meet at one point' },
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
    keyInsight: "The circumcenter is the center of the circle that passes through all three vertices. It\'s the intersection of the three perpendicular bisectors. This point is equidistant from all vertices â€” explaining why you can always draw a unique circle through any three non-collinear points!",
    steps: [
      { label: 'Midpoint and slope of BC', formula: "M_{BC} = (\\frac{x_2+x_3}{2}, \\frac{y_2+y_3}{2}), m_{\\perp} = -\\frac{x_3-x_2}{y_3-y_2}", detail: 'ðŸ“ GPS triangulation: Three satellite positions A, B, C are known. To find your location, construct the perpendicular bisectors of AB and BC â€” their intersection is your position (circumcenter)!' },
      { label: 'Equation of right bisector', formula: "y - \\frac{y_2+y_3}{2} = -\\frac{x_3-x_2}{y_3-y_2}(x - \\frac{x_2+x_3}{2})", detail: 'ðŸ“ The right bisector of BC passes through the midpoint with slope perpendicular to BC.' },
      { label: 'Simplify and write in standard form', formula: "(x_3-x_2)x + (y_3-y_2)y - \\frac{1}{2}(x_3^2 - x_2^2) - \\frac{1}{2}(y_3^2 - y_2^2) = 0", detail: 'ðŸ§® Multiplying through and rearranging gives the standard linear equation. Note the constant terms involve squares of coordinates.' },
      { label: 'Determinant test', formula: "R_1 \\to R_1 + R_2 + R_3 \\Rightarrow first row = 0 \\Rightarrow |D| = 0", detail: 'âœ… Write the equations for all three bisectors. The coefficient determinant has its first row become zero after adding Râ‚‚ + Râ‚ƒ. Zero determinant = concurrency. The intersection point (circumcenter) is equidistant from all three vertices â€” the center of the circumscribed circle!' },
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
    finalFormulaDesc: 'The three medians of a triangle intersect at the centroid â€” the triangleâ€™s center of mass.',
    keyInsight: 'The centroid divides each median in a 2:1 ratio from the vertex to the midpoint. Itâ€™s the center of mass of the triangle â€” if you cut a triangle out of cardboard, it balances perfectly at the centroid! Engineers use this to find the center of gravity of triangular structures.',
    steps: [
      { label: 'Median AD: vertex A to midpoint of BC', formula: "M_{BC} = (\\frac{x_2 + x_3}{2}, \\frac{y_2 + y_3}{2})", detail: 'âš–ï¸ An architect is designing a triangular steel truss for a bridge roof. The center of mass (centroid) is where the medians intersect â€” this is where the main support column should be placed.' },
      { label: 'Two-point form of median AD', formula: "\\frac{y - y_1}{x - x_1} = \\frac{\\frac{y_2+y_3}{2} - y_1}{\\frac{x_2+x_3}{2} - x_1}", detail: 'ðŸ“ The median AD passes through A(xâ‚, yâ‚) and the midpoint of BC. Using the two-point formula.' },
      { label: 'Simplify to linear equation', formula: "(y_2+y_3-2y_1)x - (x_2+x_3-2x_1)y + (x_2+x_3-2x_1)y_1 - (y_2+y_3-2y_1)x_1 = 0", detail: 'ðŸ§® Cross-multiply and simplify to get a standard linear form.' },
      { label: 'Determinant of coefficients = 0', formula: "R_1 \\to R_1 + R_2 + R_3 \\Rightarrow |D| = 0", detail: 'âœ… Write all three median equations. Their coefficient determinant becomes zero after adding rows, proving concurrency. The intersection point G = ((xâ‚+xâ‚‚+xâ‚ƒ)/3, (yâ‚+yâ‚‚+yâ‚ƒ)/3) â€” the centroid. This is also the average of the vertices, making it the center of mass!' },
    ],
    practice: { question: 'Triangle with vertices (0,0), (6,0), (3,6). Find the centroid x-coordinate.', hint: 'Centroid = ((0+6+3)/3, (0+0+6)/3) = (3, 2). x = 3', answer: 3, tolerance: 0.5, explanation: 'Centroid x = (0+6+3)/3 = 3.', errorHint: 'Centroid = ((xâ‚+xâ‚‚+xâ‚ƒ)/3, (yâ‚+yâ‚‚+yâ‚ƒ)/3)' },
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
    keyInsight: 'A homogeneous equation axÂ² + 2hxy + byÂ² = 0 has all terms of degree 2. It always factors into two linear equations, meaning it represents two straight lines through the origin. If hÂ² âˆ’ ab > 0, the lines are distinct and real â€” used in optics to analyze light cone sections!',
    steps: [
      { label: 'Multiply both sides by a', formula: "a^2 x^2 + 2ahxy + aby^2 = 0", detail: 'ðŸ”¦ A physicist is analyzing a beam of light spreading from a point source. The light cone is described by a homogeneous equation: axÂ² + 2hxy + byÂ² = 0. The goal is to factor it into two distinct rays.' },
      { label: 'Add and subtract hÂ²yÂ²', formula: "a^2x^2 + 2ahxy + h^2y^2 - h^2y^2 + aby^2 = 0", detail: 'ðŸ“ The key insight: complete a perfect square by adding and subtracting hÂ²yÂ².' },
      { label: 'Condense into perfect square', formula: "(ax + hy)^2 - y^2(h^2 - ab) = 0", detail: 'ðŸ§® The first three terms form (ax + hy)Â². The remaining terms become âˆ’yÂ²(hÂ²âˆ’ab).' },
      { label: 'Factor as difference of squares', formula: "(ax + hy + ysqrt{h^2-ab})(ax + hy - ysqrt{h^2-ab}) = 0", detail: 'âœ… As a difference of squares: (ax + hy)Â² âˆ’ (yâˆš(hÂ²âˆ’ab))Â² = 0. This factors into two linear equations: ax + y(h Â± âˆš(hÂ²âˆ’ab)) = 0. Both pass through the origin (no constant term). If hÂ² > ab: two distinct real lines. If hÂ² = ab: one repeated line. If hÂ² < ab: complex (imaginary) lines.' },
    ],
    practice: { question: 'Does xÂ² âˆ’ yÂ² = 0 factor into two lines?', hint: 'xÂ² âˆ’ yÂ² = (xâˆ’y)(x+y) = 0 gives lines x=y and x=âˆ’y', answer: 1, tolerance: 0.5, explanation: 'Yes! xÂ² âˆ’ yÂ² = (xâˆ’y)(x+y) = 0 is two lines through the origin: x = y and x = âˆ’y.', errorHint: 'Check if hÂ² âˆ’ ab > 0' },
    interactive: ConcurrencyInteractive,
  },

  // â”€â”€ Unit 7: Conic Sections â”€â”€
  circle_general: {
    theoremKey: 'class12.circle_general',
    title: 'General Equation of a Circle',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-violet-500 to-purple-600',
    accentColor: 'bg-violet-600',
    finalFormula: "x^2 + y^2 + 2gx + 2fy + c = 0 text{ is a circle with center } (-g, -f) text{ and radius } sqrt{g^2+f^2-c}",
    finalFormulaDesc: 'The general equation represents a circle with center (âˆ’g, âˆ’f) and radius âˆš(gÂ²+fÂ²âˆ’c).',
    keyInsight: 'By completing the square, any equation xÂ² + yÂ² + 2gx + 2fy + c = 0 can be rewritten as a circle. If gÂ²+fÂ²âˆ’c > 0, itâ€™s a real circle; if equal to 0, itâ€™s a point circle; if negative, the equation has no real graph. This is how GPS receivers determine your position from three circle equations!',
    steps: [
      { label: 'Start with general equation', formula: "x^2 + y^2 + 2gx + 2fy + c = 0", detail: 'ðŸ—ºï¸ A GPS receiver detects signals from three satellites. Each satelliteâ€™s signal defines a circle: xÂ² + yÂ² + 2gx + 2fy + c = 0. The receiver needs to find the center and radius of each circle to triangulate your position.' },
      { label: 'Group x and y terms', formula: "(x^2 + 2gx) + (y^2 + 2fy) = -c", detail: 'ðŸ“ Separate the x and y terms, moving c to the right side.' },
      { label: 'Complete the square for x and y', formula: "(x^2 + 2gx + g^2) - g^2 + (y^2 + 2fy + f^2) - f^2 = -c", detail: 'ðŸ§® Add gÂ² (to complete (x+g)Â²) and fÂ² (to complete (y+f)Â²). Balance by subtracting gÂ² and fÂ² on the same side.' },
      { label: 'Rewrite in standard form', formula: "(x+g)^2 + (y+f)^2 = g^2 + f^2 - c", detail: 'âœ… This matches the standard circle form (xâˆ’h)Â² + (yâˆ’k)Â² = rÂ² where h = âˆ’g, k = âˆ’f, r = âˆš(gÂ²+fÂ²âˆ’c). The center is (âˆ’g, âˆ’f) and radius is âˆš(gÂ²+fÂ²âˆ’c). For a real circle, we need gÂ²+fÂ²âˆ’c > 0!' },
    ],
    practice: { question: 'xÂ²+yÂ²+4x+6y+4=0. Find the center x-coordinate.', hint: 'Center = (âˆ’g, âˆ’f) = (âˆ’2, âˆ’3). x = âˆ’2', answer: -2, tolerance: 0.5, explanation: 'g=2, f=3, c=4. Center = (âˆ’2, âˆ’3). Radius = âˆš(4+9âˆ’4) = 3.', errorHint: 'Complete the square: center = (âˆ’g, âˆ’f)' },
    interactive: CircleCenterInteractiveWrapper,
  },

  circle_tangent: {
    theoremKey: 'class12.circle_tangent',
    title: 'Tangent to a Circle at a Given Point',
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-purple-500 to-fuchsia-600',
    accentColor: 'bg-purple-600',
    finalFormula: "x_1x + y_1y + g(x + x_1) + f(y + y_1) + c = 0",
    finalFormulaDesc: 'Equation of the tangent to the circle at point P(xâ‚, yâ‚).',
    keyInsight: 'The tangent to a circle at a point is perpendicular to the radius at that point. The formula xâ‚x + yâ‚y + g(x + xâ‚) + f(y + yâ‚) + c = 0 is derived by applying the slope condition. This is known as "T = 0" â€” replace xÂ² â†’ xâ‚x, yÂ² â†’ yâ‚y, x â†’ (x+xâ‚)/2, y â†’ (y+yâ‚)/2!',
    steps: [
      { label: 'Find the slope by implicit differentiation', formula: "2x + 2y \\frac{dy}{dx} + 2g + 2f \\frac{dy}{dx} = 0", detail: 'ðŸŽ¯ A machinist needs to cut a gear tooth that makes contact at a precise point on a circular gear. The cutting tool must follow the tangent line at the contact point.' },
      { label: 'Solve for dy/dx', formula: "\\frac{dy}{dx} = -\\frac{x+g}{y+f}", detail: 'ðŸ“ Differentiate implicitly: 2x + 2yÂ·y\' + 2g + 2fÂ·y\' = 0. Solve for y\': dy/dx = âˆ’(x+g)/(y+f).' },
      { label: 'Point-slope form at P(xâ‚, yâ‚)', formula: "y - y_1 = -\\frac{x_1+g}{y_1+f}(x - x_1)", detail: 'ðŸ§® At point P(xâ‚, yâ‚), substitute into dy/dx: slope m = âˆ’(xâ‚+g)/(yâ‚+f). The tangent line in point-slope form: y âˆ’ yâ‚ = m(x âˆ’ xâ‚).' },
      { label: 'Rearrange to T = 0 form', formula: "(y_1+f)(y - y_1) = -(x_1+g)(x - x_1) \\Rightarrow x_1x + y_1y + g(x + x_1) + f(y + y_1) + c = 0", detail: 'âœ… Cross-multiply and rearrange. The result is the elegant T = 0 formula: replace xÂ² â†’ xâ‚x, yÂ² â†’ yâ‚y, 2gx â†’ g(x+xâ‚), 2fy â†’ f(y+yâ‚), c â†’ c. The tangent equation is written without computing the derivative explicitly!' },
    ],
    practice: { question: 'Circle xÂ²+yÂ²=25 at point (3,4). Tangent slope = âˆ’xâ‚/yâ‚ = âˆ’3/4 = ?', hint: 'âˆ’3/4 = âˆ’0.75', answer: -0.75, tolerance: 0.05, explanation: 'Slope = âˆ’3/4 = âˆ’0.75. The tangent equation is 3x+4y=25.', errorHint: 'Slope = âˆ’(xâ‚+g)/(yâ‚+f)' },
    interactive: CircleRadiusInteractiveWrapper,
  },

  parabola_standard: {
    theoremKey: 'class12.parabola_standard',
    title: 'Standard Equation of a Parabola',
    icon: <Target className="w-5 h-5 text-white" />,
    accentGradient: 'from-amber-500 to-orange-600',
    accentColor: 'bg-amber-600',
    finalFormula: 'y^2 = 4ax',
    finalFormulaDesc: 'A parabola with focus at (a, 0) and directrix x = âˆ’a.',
    keyInsight: 'A parabola is the set of points equidistant from a fixed point (focus) and a fixed line (directrix). This reflective property is why parabolic mirrors concentrate parallel light rays at the focus â€” used in telescopes, satellite dishes, and solar cookers!',
    steps: [
      { label: 'Definition: distance to focus = distance to directrix', formula: "|PF| = |PM|", detail: 'ðŸ“¡ A satellite dish antenna has a parabolic shape. Signals arriving parallel to the axis reflect to the focus where the receiver is placed. The definition: every point P on the parabola is equidistant from the focus F and the directrix line.' },
      { label: 'Place focus at (a, 0) and directrix x = âˆ’a', formula: "\\sqrt{(x-a)^2 + y^2} = |x + a|", detail: 'ðŸ“ Choose coordinate axes so the focus F = (a, 0) and the directrix is x = âˆ’a. The distance from P(x,y) to F is âˆš[(xâˆ’a)Â²+yÂ²]. The distance to the directrix is |xâˆ’(âˆ’a)| = |x + a|.' },
      { label: 'Square both sides', formula: "(x-a)^2 + y^2 = (x+a)^2", detail: 'ðŸ§® Square both sides (both are non-negative): (xâˆ’a)Â² + yÂ² = (x+a)Â².' },
      { label: 'Simplify to yÂ² = 4ax', formula: "x^2 - 2ax + a^2 + y^2 = x^2 + 2ax + a^2 \\Rightarrow y^2 = 4ax", detail: 'âœ… Expand: xÂ²âˆ’2ax+aÂ²+yÂ² = xÂ²+2ax+aÂ². Cancel xÂ² and aÂ² on both sides. Solve: yÂ² = 4ax. This is the standard equation of a parabola opening to the right. For satellite dishes: the receiver is at the focus (a, 0) and the dish follows yÂ² = 4ax!' },
    ],
    practice: { question: 'Parabola yÂ² = 12x. Find the focus (a, 0).', hint: 'yÂ² = 4ax â†’ 4a = 12 â†’ a = 3', answer: 3, tolerance: 0.5, explanation: '4a = 12, so a = 3. Focus = (3, 0).', errorHint: 'yÂ² = 4ax. Solve for a from 4a = coefficient.' },
    interactive: ParabolaInteractiveWrapper,
  },

  parabola_tangent: {
    theoremKey: 'class12.parabola_tangent',
    title: 'Tangent to a Parabola',
    icon: <Target className="w-5 h-5 text-white" />,
    accentGradient: 'from-orange-500 to-red-600',
    accentColor: 'bg-orange-600',
    finalFormula: "y = mx + frac{a}{m}, text{ where } c = frac{a}{m}",
    finalFormulaDesc: 'Condition for tangency: substitute y = mx + c into yÂ² = 4ax and set discriminant = 0.',
    keyInsight: 'A line y = mx + c is tangent to yÂ² = 4ax if c = a/m. This means the slope form of the tangent is y = mx + a/m. For a given slope m, there are exactly two parallel tangents (one on each side of the parabola), except for the vertical tangent at the vertex!',
    steps: [
      { label: 'Substitute line into parabola', formula: "y = mx + c \\Rightarrow (mx + c)^2 = 4ax", detail: 'ðŸŽ¯ An architect is designing a parabolic arch and needs to find the tangent line at a point to calculate the support beam angle. Substitute the line equation y = mx + c into the parabola yÂ² = 4ax.' },
      { label: 'Expand to quadratic in x', formula: "m^2x^2 + 2mcx + c^2 - 4ax = 0 \\Rightarrow m^2x^2 + 2(mc - 2a)x + c^2 = 0", detail: 'ðŸ“ Expand: mÂ²xÂ² + 2mcx + cÂ² = 4ax. Rearrange: mÂ²xÂ² + 2(mcâˆ’2a)x + cÂ² = 0. This is a quadratic in x.' },
      { label: 'Set discriminant = 0 for tangency', formula: "D = 4(mc-2a)^2 - 4m^2c^2 = 0", detail: 'ðŸ§® For tangency, the line must intersect at exactly one point. This means the quadratic has a double root: its discriminant D = bÂ²âˆ’4ac must be zero.' },
      { label: 'Solve for c', formula: "4(mc-2a)^2 - 4m^2c^2 = 0 \\Rightarrow -16amc + 16a^2 = 0 \\Rightarrow mc = a \\Rightarrow c = \\frac{a}{m}", detail: 'âœ… Expand: 4(mÂ²cÂ²âˆ’4amc+4aÂ²) âˆ’ 4mÂ²cÂ² = 0 â†’ âˆ’16amc + 16aÂ² = 0 â†’ mc = a â†’ c = a/m. The tangent equation in slope form: y = mx + a/m. This formula allows architects to find the support beam angle at any point on a parabolic arch!' },
    ],
    practice: { question: 'Parabola yÂ² = 8x. Line slope m = 2. Find c for tangency (c = a/m).', hint: 'yÂ² = 8x â†’ 4a = 8 â†’ a = 2. c = 2/2 = 1', answer: 1, tolerance: 0.5, explanation: 'a = 2, c = 2/2 = 1. Tangent: y = 2x + 1.', errorHint: 'c = a/m (coefficient from 4a)' },
    interactive: ParabolaInteractiveWrapper,
  },

  ellipse_standard: {
    theoremKey: 'class12.ellipse_standard',
    title: 'Standard Equation of an Ellipse',
    icon: <Target className="w-5 h-5 text-white" />,
    accentGradient: 'from-green-500 to-emerald-600',
    accentColor: 'bg-green-600',
    finalFormula: 'frac{x^2}{a^2} + frac{y^2}{b^2} = 1',
    finalFormulaDesc: 'An ellipse with foci at (Â±c, 0) where cÂ² = aÂ²âˆ’bÂ².',
    keyInsight: 'An ellipse is the set of points where the sum of distances to two foci is constant (2a). This is why planetary orbits are elliptical with the Sun at one focus (Keplerâ€™s First Law). The flattening depends on eccentricity e = c/a = âˆš(1âˆ’bÂ²/aÂ²)!',
    steps: [
      { label: 'Definition: sum of distances to foci = 2a', formula: "|PF_1| + |PF_2| = 2a", detail: 'ðŸŒ Johannes Kepler discovered that planets orbit the Sun in elliptical paths. The Sun is at one focus. The sum of distances from any point on the ellipse to the two foci is constant â€” the length of the major axis.' },
      { label: 'Set foci at (Â±c, 0) and point P(x, y)', formula: "\\sqrt{(x+c)^2 + y^2} + \\sqrt{(x-c)^2 + y^2} = 2a", detail: 'ðŸ“ Place foci at Fâ‚(âˆ’c, 0) and Fâ‚‚(c, 0). For any point P(x,y) on the ellipse: âˆš[(x+c)Â²+yÂ²] + âˆš[(xâˆ’c)Â²+yÂ²] = 2a.' },
      { label: 'Isolate and square twice', formula: "a \\sqrt{(x-c)^2 + y^2} = a^2 - cx \\Rightarrow (a^2-c^2)x^2 + a^2y^2 = a^2(a^2-c^2)", detail: 'ðŸ§® Isolate one radical, square both sides, isolate the remaining radical, square again. After simplifying: (aÂ²âˆ’cÂ²)xÂ² + aÂ²yÂ² = aÂ²(aÂ²âˆ’cÂ²).' },
      { label: 'Let bÂ² = aÂ²âˆ’cÂ² to get standard form', formula: "b^2x^2 + a^2y^2 = a^2b^2 \\Rightarrow \\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1", detail: 'âœ… Define bÂ² = aÂ²âˆ’cÂ². Then bÂ²xÂ² + aÂ²yÂ² = aÂ²bÂ² â†’ xÂ²/aÂ² + yÂ²/bÂ² = 1. For Earthâ€™s orbit: a â‰ˆ 149.6 million km, b â‰ˆ 149.5 million km (nearly circular, e â‰ˆ 0.017). Mars has e â‰ˆ 0.093 â€” noticeably more elliptical!' },
    ],
    practice: { question: 'Ellipse xÂ²/25 + yÂ²/9 = 1. Find c (distance from center to focus).', hint: 'aÂ²=25, bÂ²=9. cÂ² = aÂ²âˆ’bÂ² = 25âˆ’9 = 16. c = 4', answer: 4, tolerance: 0.5, explanation: 'a=5, b=3, c=âˆš(25âˆ’9)=4.', errorHint: 'cÂ² = aÂ²âˆ’bÂ²' },
    interactive: EllipseInteractiveWrapper,
  },

  hyperbola_standard: {
    theoremKey: 'class12.hyperbola_standard',
    title: 'Standard Equation of a Hyperbola',
    icon: <Target className="w-5 h-5 text-white" />,
    accentGradient: 'from-rose-500 to-pink-600',
    accentColor: 'bg-rose-600',
    finalFormula: 'frac{x^2}{a^2} - frac{y^2}{b^2} = 1',
    finalFormulaDesc: 'A hyperbola with foci at (Â±c, 0) where cÂ² = aÂ²+bÂ².',
    keyInsight: 'A hyperbola is the set of points where the difference of distances to two foci is constant (2a). Unlike the ellipse (sum is constant), the hyperbola has two separate branches. Used in navigation (LORAN systems) where the difference in signal arrival times from two stations locates a ship!',
    steps: [
      { label: 'Definition: difference of distances to foci = 2a', formula: "||PF_1| - |PF_2|| = 2a", detail: 'ðŸš¢ A ship uses LORAN navigation: two radio stations at Fâ‚ and Fâ‚‚ transmit synchronized signals. The ship measures the difference in arrival times. The locus of constant time difference is a hyperbola with foci at the stations.' },
      { label: 'Set foci at (Â±c, 0) and point P(x, y)', formula: "\\sqrt{(x+c)^2 + y^2} - \\sqrt{(x-c)^2 + y^2} = 2a", detail: 'ðŸ“ The absolute difference of distances to Fâ‚(âˆ’c,0) and Fâ‚‚(c,0) equals 2a. Choose the branch where PFâ‚ > PFâ‚‚.' },
      { label: 'Square twice (same process as ellipse but sign differs)', formula: "(c^2 - a^2)x^2 - a^2y^2 = a^2(c^2 - a^2)", detail: 'ðŸ§® Same double-squaring technique as the ellipse. But the sign difference (subtraction vs addition) leads to a different final form.' },
      { label: 'Let bÂ² = cÂ²âˆ’aÂ² to get standard form', formula: "b^2x^2 - a^2y^2 = a^2b^2 \\Rightarrow \\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1", detail: 'âœ… Define bÂ² = cÂ²âˆ’aÂ². The standard form xÂ²/aÂ² âˆ’ yÂ²/bÂ² = 1 has two branches (left and \). Asymptotes: y = Â±(b/a)x. The LORAN ship: if stations are 100km apart (2c=100) and the constant difference is 60km (2a=60), then bÂ² = 50Â²âˆ’30Â² = 1600, and the ship lies on xÂ²/900 âˆ’ yÂ²/1600 = 1!' },
    ],
    practice: { question: 'Hyperbola xÂ²/16 âˆ’ yÂ²/9 = 1. Find c (focus distance from center).', hint: 'aÂ²=16, bÂ²=9. cÂ² = aÂ²+bÂ² = 16+9 = 25. c = 5', answer: 5, tolerance: 0.5, explanation: 'a=4, b=3, c=âˆš(16+9)=5.', errorHint: 'For hyperbola, cÂ² = aÂ²+bÂ²' },
    interactive: HyperbolaInteractiveWrapper,
  },
};

