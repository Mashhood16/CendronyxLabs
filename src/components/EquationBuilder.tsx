import { useState, useRef, useCallback } from 'react';
import { Delete, Hash, Sigma, FunctionSquare, Variable, Eraser, ChevronLeft, ChevronRight } from 'lucide-react';
import MathFormula from './MathFormula';
import { theme } from '../utils/labTheme';

interface EquationBuilderProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  accentColor?: string;
}

interface MathButton {
  label: string;
  value: string;
  title?: string;
  width?: 'sm' | 'md' | 'lg';
}

type ButtonCategory = {
  name: string;
  icon: React.ReactNode;
  buttons: MathButton[];
};

const CATEGORIES: ButtonCategory[] = [
  {
    name: 'Numbers',
    icon: <Hash className="w-3 h-3" />,
    buttons: [
      { label: '7', value: '7', width: 'sm' },
      { label: '8', value: '8', width: 'sm' },
      { label: '9', value: '9', width: 'sm' },
      { label: '4', value: '4', width: 'sm' },
      { label: '5', value: '5', width: 'sm' },
      { label: '6', value: '6', width: 'sm' },
      { label: '1', value: '1', width: 'sm' },
      { label: '2', value: '2', width: 'sm' },
      { label: '3', value: '3', width: 'sm' },
      { label: '0', value: '0', width: 'sm' },
      { label: '.', value: '.', width: 'sm' },
      { label: ',', value: ',', width: 'sm' },
    ],
  },
  {
    name: 'Operators',
    icon: <Sigma className="w-3 h-3" />,
    buttons: [
      { label: '+', value: ' + ', title: 'Add' },
      { label: '−', value: ' − ', title: 'Subtract' },
      { label: '×', value: ' × ', title: 'Multiply' },
      { label: '÷', value: ' / ', title: 'Divide' },
      { label: '=', value: ' = ', title: 'Equals' },
      { label: '²', value: '²', title: 'Squared' },
      { label: '³', value: '³', title: 'Cubed' },
      { label: '^', value: '^', title: 'Power' },
      { label: '√', value: 'sqrt(', title: 'Square root' },
      { label: '_', value: '_', title: 'Subscript' },
      { label: '|x|', value: '|', title: 'Absolute value' },
      { label: '(', value: '(', title: 'Open parenthesis' },
      { label: ')', value: ')', title: 'Close parenthesis' },
    ],
  },
  {
    name: 'Greek',
    icon: <FunctionSquare className="w-3 h-3" />,
    buttons: [
      { label: 'π', value: 'π', title: 'Pi' },
      { label: 'Δ', value: 'Δ', title: 'Delta' },
      { label: 'θ', value: 'θ', title: 'Theta' },
      { label: 'α', value: 'α', title: 'Alpha' },
      { label: 'β', value: 'β', title: 'Beta' },
      { label: 'γ', value: 'γ', title: 'Gamma' },
      { label: 'λ', value: 'λ', title: 'Lambda' },
      { label: 'μ', value: 'μ', title: 'Mu' },
      { label: 'ρ', value: 'ρ', title: 'Rho' },
      { label: 'σ', value: 'σ', title: 'Sigma' },
      { label: 'ω', value: 'ω', title: 'Omega' },
      { label: 'φ', value: 'φ', title: 'Phi' },
      { label: 'η', value: 'η', title: 'Eta' },
      { label: '∞', value: '∞', title: 'Infinity' },
      { label: '∂', value: '∂', title: 'Partial derivative' },
    ],
  },
  {
    name: 'Functions',
    icon: <FunctionSquare className="w-3 h-3" />,
    buttons: [
      { label: 'sin', value: 'sin(', width: 'md', title: 'Sine' },
      { label: 'cos', value: 'cos(', width: 'md', title: 'Cosine' },
      { label: 'tan', value: 'tan(', width: 'md', title: 'Tangent' },
      { label: 'log', value: 'log(', width: 'md', title: 'Logarithm' },
      { label: 'ln', value: 'ln(', width: 'md', title: 'Natural log' },
      { label: 'sin⁻¹', value: 'asin(', width: 'md', title: 'Arc sine' },
      { label: 'cos⁻¹', value: 'acos(', width: 'md', title: 'Arc cosine' },
      { label: 'tan⁻¹', value: 'atan(', width: 'md', title: 'Arc tangent' },
    ],
  },
];

const VARIABLE_GROUPS = [
  {
    name: 'Common',
    vars: ['m', 'v', 'a', 't', 'd', 'F', 'E', 'P', 'W', 'V', 'I', 'R', 'c', 'g', 'h', 'k', 'T', 'x', 'y', 'z'],
  },
  {
    name: 'Physics',
    vars: ['ρ', 'ω', 'ε₀', 'μ₀', 'ℏ', 'λ', 'ν', 'Φ', 'Ψ', 'Ω', 'Σ'],
  },
];

// ---- Styling helpers ----
const NUM_BTN = `px-2 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 bg-white dark:bg-[#1c1b1b] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#2a2a2a] hover:bg-slate-100 dark:hover:bg-[#2a2a2a] hover:border-slate-300 dark:hover:border-[#3a3a3a] active:scale-90 active:bg-slate-200 dark:active:bg-[#333] shadow-sm hover:shadow min-w-[32px] text-center cursor-pointer select-none touch-manipulation`;
const OP_BTN = `px-2 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 hover:border-amber-300 dark:hover:border-amber-700 active:scale-90 active:bg-amber-200 dark:active:bg-amber-900/60 shadow-sm min-w-[32px] text-center cursor-pointer select-none touch-manipulation`;
const GREEK_BTN = `px-2 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50 hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:border-purple-300 dark:hover:border-purple-700 active:scale-90 active:bg-purple-200 dark:active:bg-purple-900/50 shadow-sm min-w-[32px] text-center cursor-pointer select-none touch-manipulation`;
const FUNC_BTN = `px-2.5 py-1.5 text-[11px] font-bold rounded-lg transition-all duration-150 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-900/50 hover:bg-sky-100 dark:hover:bg-sky-900/40 hover:border-sky-300 dark:hover:border-sky-700 active:scale-90 active:bg-sky-200 dark:active:bg-sky-900/50 shadow-sm min-w-[40px] text-center cursor-pointer select-none touch-manipulation`;
const VAR_BTN = `w-7 h-7 text-[11px] font-mono font-semibold rounded-md transition-all duration-100 bg-slate-50 dark:bg-[#1c1b1b] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#2a2a2a] hover:text-slate-800 dark:hover:text-slate-200 active:scale-90 border border-slate-200 dark:border-transparent cursor-pointer select-none touch-manipulation`;
const PHYS_VAR_BTN = `w-7 h-7 text-[11px] font-semibold rounded-md transition-all duration-100 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/40 hover:text-indigo-800 dark:hover:text-indigo-200 active:scale-90 border border-indigo-200 dark:border-indigo-900/50 cursor-pointer select-none touch-manipulation`;
const DANGER_BTN = `px-2 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/50 hover:border-red-300 dark:hover:border-red-700 active:scale-90 active:bg-red-200 dark:active:bg-red-900/60 shadow-sm min-w-[32px] text-center cursor-pointer select-none touch-manipulation`;

export default function EquationBuilder({
  value,
  onChange,
  placeholder,
  accentColor,
}: EquationBuilderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorPos, setCursorPos] = useState<number>(value.length);
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [showVars, setShowVars] = useState(false);

  const insertAtCursor = useCallback(
    (text: string) => {
      const pos = cursorPos;
      const newVal = value.slice(0, pos) + text + value.slice(pos);
      onChange(newVal);
      const newPos = pos + text.length;
      setCursorPos(newPos);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(newPos, newPos);
        }
      }, 0);
    },
    [value, cursorPos, onChange]
  );

  const handleButtonClick = useCallback(
    (val: string) => {
      if (val === '__BACKSPACE__') {
        if (cursorPos > 0) {
          const newVal = value.slice(0, cursorPos - 1) + value.slice(cursorPos);
          onChange(newVal);
          setCursorPos(cursorPos - 1);
        }
      } else if (val === '__CLEAR__') {
        onChange('');
        setCursorPos(0);
      } else if (val === '__LEFT__') {
        if (cursorPos > 0) {
          setCursorPos(cursorPos - 1);
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
              inputRef.current.setSelectionRange(cursorPos - 1, cursorPos - 1);
            }
          }, 0);
        }
      } else if (val === '__RIGHT__') {
        if (cursorPos < value.length) {
          setCursorPos(cursorPos + 1);
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
              inputRef.current.setSelectionRange(cursorPos + 1, cursorPos + 1);
            }
          }, 0);
        }
      } else {
        insertAtCursor(val);
      }
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    [value, cursorPos, onChange, insertAtCursor]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setCursorPos(target.selectionStart || 0);
  };

  const getBtnStyle = (rowIdx: number, btnLabel: string, btnValue: string) => {
    if (btnValue === '__BACKSPACE__' || btnValue === '__CLEAR__') return DANGER_BTN;
    if (['__LEFT__', '__RIGHT__'].includes(btnValue)) return OP_BTN;
    if ([' + ', ' − ', ' / ', ' × ', ' = ', '^', '²', '³', '_', 'sqrt(', '|'].includes(btnValue)) return OP_BTN;
    if (['α', 'β', 'γ', 'θ', 'λ', 'μ', 'ρ', 'σ', 'ω', 'φ', 'η', 'π', 'Δ', 'Σ', '∞', '∂', '|x|'].includes(btnLabel)) return GREEK_BTN;
    if (['sin', 'cos', 'tan', 'log', 'ln', 'sin⁻¹', 'cos⁻¹', 'tan⁻¹'].includes(btnLabel)) return FUNC_BTN;
    return NUM_BTN;
  };

  const getWidth = (btn: MathButton) => {
    if (btn.width === 'md') return 'min-w-[48px]';
    if (btn.width === 'lg') return 'min-w-[56px]';
    return 'min-w-[32px]';
  };

  return (
    <div className="w-full space-y-2">
      {/* Input with preview */}
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault();
            }}
            onSelect={handleSelect}
            onClick={handleSelect}
            onKeyUp={(e) => {
              const target = e.target as HTMLInputElement;
              setCursorPos(target.selectionStart || 0);
            }}
            placeholder={placeholder || 'Type or build your formula...'}
            className={`w-full px-3 py-2.5 pr-8 text-sm font-mono rounded-lg bg-white dark:bg-[#121212] border-2 border-slate-200 dark:border-[#2a2a2a] text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 ${
              value ? 'border-blue-300 dark:border-blue-700' : ''
            }`}
          />
          {/* Cursor position indicator */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 dark:text-slate-600 pointer-events-none">
            {cursorPos}/{value.length}
          </div>
        </div>
      </div>

      {/* Rendered formula preview */}
      {value && (
        <div className="bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] rounded-xl px-4 py-3 text-center border border-[#2a2a3a] shadow-inner min-h-[40px] flex items-center justify-center">
          <MathFormula formula={value} className="text-base font-bold text-yellow-300 drop-shadow-sm" />
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-[#1a1a1a] p-1 rounded-xl overflow-x-auto">
        <button
          onClick={() => {
            setActiveCategory(0);
            setShowVars(false);
          }}
          className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all shrink-0 ${
            activeCategory === 0 && !showVars
              ? 'bg-white dark:bg-[#2a2a2a] text-slate-800 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 dark:text-[#ffffff]'
          }`}
        >
          <Hash className="w-3 h-3" /> Numbers
        </button>
        <button
          onClick={() => {
            setActiveCategory(1);
            setShowVars(false);
          }}
          className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all shrink-0 ${
            activeCategory === 1 && !showVars
              ? 'bg-white dark:bg-[#2a2a2a] text-slate-800 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 dark:text-[#ffffff]'
          }`}
        >
          <Sigma className="w-3 h-3" /> Operators
        </button>
        <button
          onClick={() => {
            setActiveCategory(2);
            setShowVars(false);
          }}
          className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all shrink-0 ${
            activeCategory === 2 && !showVars
              ? 'bg-white dark:bg-[#2a2a2a] text-slate-800 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 dark:text-[#ffffff]'
          }`}
        >
          <FunctionSquare className="w-3 h-3" /> Greek
        </button>
        <button
          onClick={() => {
            setActiveCategory(3);
            setShowVars(false);
          }}
          className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all shrink-0 ${
            activeCategory === 3 && !showVars
              ? 'bg-white dark:bg-[#2a2a2a] text-slate-800 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 dark:text-[#ffffff]'
          }`}
        >
          <FunctionSquare className="w-3 h-3" /> Functions
        </button>
        <button
          onClick={() => setShowVars(true)}
          className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all shrink-0 ${
            showVars
              ? 'bg-white dark:bg-[#2a2a2a] text-slate-800 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 dark:text-[#ffffff]'
          }`}
        >
          <Variable className="w-3 h-3" /> Variables
        </button>
      </div>

      {/* Button panel */}
      <div className="bg-slate-50 dark:bg-black/30 rounded-xl p-2.5 border border-slate-200 dark:border-[#1c1c1c] shadow-inner">
        {!showVars ? (
          <>
            {/* Category header with cursor controls */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {CATEGORIES[activeCategory].name}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => handleButtonClick('__LEFT__')}
                  className="w-6 h-5 flex items-center justify-center rounded text-[10px] text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-[#2a2a2a] transition-all"
                  title="Move cursor left"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleButtonClick('__RIGHT__')}
                  className="w-6 h-5 flex items-center justify-center rounded text-[10px] text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-[#2a2a2a] transition-all"
                  title="Move cursor right"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleButtonClick('__BACKSPACE__')}
                  className="w-6 h-5 flex items-center justify-center rounded text-[10px] text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  title="Backspace"
                >
                  <Delete className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleButtonClick('__CLEAR__')}
                  className="w-6 h-5 flex items-center justify-center rounded text-[10px] text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  title="Clear all"
                >
                  <Eraser className="w-3 h-3" />
                </button>
              </div>
            </div>
            {/* Button grid for active category */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              {CATEGORIES[activeCategory].buttons.map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => handleButtonClick(btn.value)}
                  title={btn.title || btn.label}
                  className={`${getBtnStyle(activeCategory, btn.label, btn.value)} ${getWidth(btn)}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Variables panel header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Variables
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => handleButtonClick('__BACKSPACE__')}
                  className="w-6 h-5 flex items-center justify-center rounded text-[10px] text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  title="Backspace"
                >
                  <Delete className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleButtonClick('__CLEAR__')}
                  className="w-6 h-5 flex items-center justify-center rounded text-[10px] text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  title="Clear all"
                >
                  <Eraser className="w-3 h-3" />
                </button>
              </div>
            </div>
            {/* Common variables */}
            <div className="mb-2">
              <p className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
                Common
              </p>
              <div className="flex flex-wrap gap-1 justify-center">
                {VARIABLE_GROUPS[0].vars.map((v) => (
                  <button key={v} onClick={() => handleButtonClick(v)} className={VAR_BTN} title={`Insert ${v}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
            {/* Physics constants/symbols */}
            <div>
              <p className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
                Physics Symbols
              </p>
              <div className="flex flex-wrap gap-1 justify-center">
                {VARIABLE_GROUPS[1].vars.map((v) => (
                  <button key={v} onClick={() => handleButtonClick(v)} className={PHYS_VAR_BTN} title={`Insert ${v}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}