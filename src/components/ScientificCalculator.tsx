import { useTranslate } from '../i18n';
import { useState, useRef, useCallback, useEffect } from 'react';

interface CalculatorProps {
  onClose: () => void;
}

type CalcOperator = '+' | '-' | '×' | '÷';
type MemoryOp = 'MC' | 'MR' | 'M+' | 'M-';

const SCIENTIFIC_BUTTONS = [
  { label: 'sin', action: 'sin' },
  { label: 'cos', action: 'cos' },
  { label: 'tan', action: 'tan' },
  { label: 'log', action: 'log' },
  { label: 'ln', action: 'ln' },
  { label: '√', action: 'sqrt' },
  { label: 'x²', action: 'square' },
  { label: 'x³', action: 'cube' },
  { label: 'xⁿ', action: 'pow' },
  { label: '1/x', action: 'reciprocal' },
  { label: '|x|', action: 'abs' },
  { label: 'π', action: 'pi' },
  { label: 'e', action: 'euler' },
  { label: 'n!', action: 'factorial' },
];


type CalculatorState = {
  display: string;
  expression: string;
  previousValue: number | null;
  operator: CalcOperator | null;
  waitingForOperand: boolean;
  memory: number;
  degreeMode: boolean;
  history: string[];
};

function factorial(n: number): number {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function applyUnaryOp(value: number, op: string, degMode: boolean): number {
  const toRad = (v: number) => degMode ? v * Math.PI / 180 : v;
  switch (op) {
    case 'sin': return Math.sin(toRad(value));
    case 'cos': return Math.cos(toRad(value));
    case 'tan': return Math.tan(toRad(value));
    case 'log': return Math.log10(value);
    case 'ln': return Math.log(value);
    case 'sqrt': return Math.sqrt(value);
    case 'square': return value * value;
    case 'cube': return value * value * value;
    case 'reciprocal': return 1 / value;
    case 'abs': return Math.abs(value);
    case 'factorial': return factorial(Math.round(value));
    default: return value;
  }
}

function compute(a: number, op: CalcOperator, b: number): number {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '×': return a * b;
    case '÷': return b !== 0 ? a / b : NaN;
  }
}

export default function ScientificCalculator({ onClose }: CalculatorProps) {
  const { t } = useTranslate();
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    expression: '',
    previousValue: null,
    operator: null,
    waitingForOperand: false,
    memory: 0,
    degreeMode: true,
    history: [],
  });
  const [showScientific, setShowScientific] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Dragging state
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 80, y: 60 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Resizing state
  const [size, setSize] = useState({ width: 360, height: 500 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Minimize state
  const [isMinimized, setIsMinimized] = useState(false);

  const handleDigit = useCallback((digit: string) => {
    setState(prev => {
      if (prev.waitingForOperand) {
        return { ...prev, display: digit, waitingForOperand: false, expression: prev.expression + ' ' + digit };
      }
      const newDisplay = prev.display === '0' ? digit : prev.display + digit;
      return { ...prev, display: newDisplay, expression: prev.expression + digit };
    });
  }, []);

  const handleDecimal = useCallback(() => {
    setState(prev => {
      if (prev.waitingForOperand) {
        return { ...prev, display: '0.', waitingForOperand: false };
      }
      if (prev.display.includes('.')) return prev;
      return { ...prev, display: prev.display + '.' };
    });
  }, []);

  const handleOperator = useCallback((op: CalcOperator) => {
    setState(prev => {
      const current = parseFloat(prev.display);
      if (prev.operator && !prev.waitingForOperand) {
        const result = compute(prev.previousValue!, prev.operator, current);
        if (isNaN(result)) return { ...prev, display: 'Error', expression: 'Error' };
        return {
          ...prev,
          display: String(result),
          expression: String(result),
          previousValue: result,
          operator: op,
          waitingForOperand: true,
          history: [...prev.history, `${prev.previousValue} ${prev.operator} ${current} = ${result}`],
        };
      }
      return {
        ...prev,
        previousValue: current,
        operator: op,
        waitingForOperand: true,
        expression: prev.display + ' ' + op,
      };
    });
  }, []);

  const handleEquals = useCallback(() => {
    setState(prev => {
      const current = parseFloat(prev.display);
      if (prev.operator && prev.previousValue !== null) {
        const result = compute(prev.previousValue, prev.operator, current);
        if (isNaN(result)) return { ...prev, display: 'Error', expression: 'Error' };
        const entry = `${prev.previousValue} ${prev.operator} ${current} = ${result}`;
        return {
          ...prev,
          display: String(result),
          expression: entry,
          previousValue: null,
          operator: null,
          waitingForOperand: true,
          history: [...prev.history, entry],
        };
      }
      return prev;
    });
  }, []);

  const handleScientific = useCallback((action: string) => {
    setState(prev => {
      const current = parseFloat(prev.display);
      let result: number;
      
      switch (action) {
        case 'pi':
          result = Math.PI;
          break;
        case 'euler':
          result = Math.E;
          break;
        case 'pow':
          result = current * current; // xⁿ defaults to x² for now
          break;
        default:
          result = applyUnaryOp(current, action, prev.degreeMode);
      }
      
      if (isNaN(result) || !isFinite(result)) {
        return { ...prev, display: 'Error', expression: 'Error' };
      }
      
      const entry = `${action}(${current}) = ${result}`;
      return {
        ...prev,
        display: String(result),
        expression: entry,
        waitingForOperand: true,
        history: [...prev.history, entry],
      };
    });
  }, []);

  const handleClear = useCallback(() => {
    setState(prev => ({
      ...prev,
      display: '0',
      expression: '',
      previousValue: null,
      operator: null,
      waitingForOperand: false,
    }));
  }, []);

  const handleBackspace = useCallback(() => {
    setState(prev => {
      if (prev.waitingForOperand) return prev;
      const newDisplay = prev.display.length > 1 ? prev.display.slice(0, -1) : '0';
      return { ...prev, display: newDisplay };
    });
  }, []);

  const handleNegate = useCallback(() => {
    setState(prev => {
      if (prev.display === '0') return prev;
      const newDisplay = prev.display.startsWith('-') ? prev.display.slice(1) : '-' + prev.display;
      return { ...prev, display: newDisplay };
    });
  }, []);

  const handleMemory = useCallback((op: MemoryOp) => {
    setState(prev => {
      const current = parseFloat(prev.display);
      switch (op) {
        case 'MC': return { ...prev, memory: 0 };
        case 'MR': return { ...prev, display: String(prev.memory), waitingForOperand: true };
        case 'M+': return { ...prev, memory: prev.memory + current };
        case 'M-': return { ...prev, memory: prev.memory - current };
        default: return prev;
      }
    });
  }, []);

  const toggleScientific = () => setShowScientific(s => !s);
  const toggleHistory = () => setShowHistory(s => !s);

  // Drag handlers
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
    setIsDragging(true);
  }, [position]);

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setPosition({
      x: Math.max(0, Math.min(window.innerWidth - 100, clientX - dragStart.x)),
      y: Math.max(0, Math.min(window.innerHeight - 100, clientY - dragStart.y)),
    });
  }, [isDragging, dragStart]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Resize handlers (supports both mouse and touch)
  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setResizeStart({ x: clientX, y: clientY, width: size.width, height: size.height });
  }, [size]);

  const handleResizeMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isResizing) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const newWidth = Math.max(300, resizeStart.width + (clientX - resizeStart.x));
    const newHeight = Math.max(400, resizeStart.height + (clientY - resizeStart.y));
    setSize({ width: newWidth, height: newHeight });
  }, [isResizing, resizeStart]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
      window.addEventListener('touchmove', handleResizeMove);
      window.addEventListener('touchend', handleResizeEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
      window.removeEventListener('touchmove', handleResizeMove);
      window.removeEventListener('touchend', handleResizeEnd);
    };
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleDigit(e.key);
      else if (e.key === '.') handleDecimal();
      else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        const op: CalcOperator = e.key === '*' ? '×' : e.key === '/' ? '÷' : e.key as CalcOperator;
        handleOperator(op);
      }
      else if (e.key === 'Enter' || e.key === '=') handleEquals();
      else if (e.key === 'Backspace') handleBackspace();
      else if (e.key === 'Escape') handleClear();
      else if (e.key === 'Delete') handleClear();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleDecimal, handleOperator, handleEquals, handleBackspace, handleClear]);

  const btnClass = (color?: string) => {
    switch (color) {
      case 'clear': return 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400';
      case 'operator': return 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400';
      case 'equals': return 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25';
      default: return 'bg-slate-100 dark:bg-[#1c1b1b] hover:bg-slate-200 dark:hover:bg-[#2a2a2a] text-slate-800 dark:text-slate-200';
    }
  };

  const formatDisplay = (val: string) => {
    if (val === 'Error') return val;
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    if (val.length > 14) return num.toExponential(6);
    return val;
  };

  return (
    <div
      ref={popupRef}
      className="fixed z-[200] bg-white dark:bg-[#121212] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#1c1b1b] overflow-hidden flex flex-col select-none"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: isMinimized ? 'auto' : size.height,
        minWidth: 300,
        minHeight: isMinimized ? 'auto' : 400,
      }}
    >
        {/* Title Bar */}
        <div
          className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-[#1c1b1b] border-b border-slate-200 dark:border-[#2a2a2a] cursor-grab active:cursor-grabbing shrink-0"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t("Scientific Calculator")}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-[#2a2a2a] text-slate-500 dark:text-slate-400 transition-colors"
            title={t("Close")}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleHistory}
              className={`px-2 py-1 text-xs rounded font-medium transition-colors ${showHistory ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              {showHistory ? 'History' : 'Hist'}
            </button>
            <button
              onClick={toggleScientific}
              className={`px-2 py-1 text-xs rounded font-medium transition-colors ${showScientific ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              {showScientific ? 'Basic' : 'Sci'}
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Display */}
            <div className="px-4 py-3 bg-slate-50/50 dark:bg-[#0a0a0a] border-b border-slate-200 dark:border-[#1c1b1b] shrink-0">
              <div className="text-right">
                <div className="text-xs text-slate-500 dark:text-[#71717a] font-mono h-5 truncate">
                  {state.expression}
                </div>
                <div className="text-3xl md:text-4xl font-bold font-mono text-slate-900 dark:text-white tracking-tight overflow-x-auto whitespace-nowrap scrollbar-hide mt-1">
                  {formatDisplay(state.display)}
                </div>
              </div>
              {state.memory !== 0 && (
                <div className="text-[10px] font-mono text-indigo-500 mt-1">M = {state.memory}</div>
              )}
            </div>

            {/* History Panel */}
            {showHistory && (
              <div className="flex-1 overflow-y-auto p-3 bg-slate-50/50 dark:bg-[#0a0a0a] border-b border-slate-200 dark:border-[#1c1b1b]">
                {state.history.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">{t("No calculations yet")}</p>
                ) : (
                  state.history.map((entry, i) => (
                    <div key={i} className="text-xs font-mono text-slate-600 dark:text-[#a1a1aa] py-1 border-b border-slate-100 dark:border-[#1c1b1b] last:border-0">
                      {entry}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Scientific Buttons */}
            {showScientific && (
              <div className="grid grid-cols-7 gap-1 p-2 bg-slate-50/50 dark:bg-[#0a0a0a] border-b border-slate-200 dark:border-[#1c1b1b] shrink-0">
                {SCIENTIFIC_BUTTONS.map(btn => (
                  <button
                    key={btn.action}
                    onClick={() => handleScientific(btn.action)}
                    className="px-1 py-1.5 text-[11px] font-semibold rounded-md bg-slate-100 dark:bg-[#1c1b1b] hover:bg-slate-200 dark:hover:bg-[#2a2a2a] text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {btn.label}
                  </button>
                ))}
                {/* Degree mode toggle */}
                <button
                  onClick={() => setState(prev => ({ ...prev, degreeMode: !prev.degreeMode }))}
                  className={`px-1 py-1.5 text-[11px] font-semibold rounded-md transition-colors ${state.degreeMode ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'bg-slate-100 dark:bg-[#1c1b1b] text-slate-500'}`}
                >
                  {state.degreeMode ? 'DEG' : 'RAD'}
                </button>
                {/* Memory buttons */}
                {(['MC', 'MR', 'M+', 'M-'] as MemoryOp[]).map(op => (
                  <button
                    key={op}
                    onClick={() => handleMemory(op)}
                    className="px-1 py-1.5 text-[11px] font-semibold rounded-md bg-slate-100 dark:bg-[#1c1b1b] hover:bg-slate-200 dark:hover:bg-[#2a2a2a] text-slate-600 dark:text-slate-400 transition-colors"
                  >
                    {op}
                  </button>
                ))}
              </div>
            )}

            {/* Basic Buttons Grid */}
            <div className="flex-1 grid grid-cols-4 gap-1.5 p-3 overflow-y-auto">
              {/* Row: Memory (always visible) */}
              {(['MC', 'MR', 'M+', 'M-'] as MemoryOp[]).map(op => (
                <button
                  key={op}
                  onClick={() => handleMemory(op)}
                  className="py-2 text-xs font-bold rounded-lg bg-slate-100 dark:bg-[#1c1b1b] hover:bg-slate-200 dark:hover:bg-[#2a2a2a] text-slate-500 dark:text-slate-400 transition-colors"
                >
                  {op}
                </button>
              ))}
              
              {/* Main buttons */}
              {[
                { label: 'C', action: 'clear', color: 'clear' as const },
                { label: '⌫', action: 'backspace', color: 'clear' as const },
                { label: '()', action: 'parens' },
                { label: '÷', action: '÷', color: 'operator' as const },
                { label: '7', action: '7' },
                { label: '8', action: '8' },
                { label: '9', action: '9' },
                { label: '×', action: '×', color: 'operator' as const },
                { label: '4', action: '4' },
                { label: '5', action: '5' },
                { label: '6', action: '6' },
                { label: '-', action: '-', color: 'operator' as const },
                { label: '1', action: '1' },
                { label: '2', action: '2' },
                { label: '3', action: '3' },
                { label: '+', action: '+', color: 'operator' as const },
                { label: '±', action: 'negate' },
                { label: '0', action: '0' },
                { label: '.', action: '.' },
                { label: '=', action: 'equals', color: 'equals' as const },
              ].map(btn => (
                <button
                  key={btn.action}
                  onClick={() => {
                    if (btn.action === 'clear') handleClear();
                    else if (btn.action === 'backspace') handleBackspace();
                    else if (btn.action === 'negate') handleNegate();
                    else if (btn.action === 'equals') handleEquals();
                    else if (btn.action === 'parens') { handleDigit('('); handleDigit(')'); }
                    else if (btn.action === '.' ) handleDecimal();
                    else if (['+', '-', '×', '÷'].includes(btn.action)) handleOperator(btn.action as CalcOperator);
                    else handleDigit(btn.action);
                  }}
                  className={`py-3 text-lg font-bold rounded-xl transition-all active:scale-95 ${btnClass(btn.color)} ${btn.action === '0' ? '' : ''}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Resize handle */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
              onMouseDown={handleResizeStart}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" className="absolute bottom-1 right-1 text-slate-400 dark:text-[#71717a]">
                <path d="M1,9 L9,1 M4,9 L9,4 M7,9 L9,7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        )}
    </div>
  );
}
