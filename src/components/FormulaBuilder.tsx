import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Delete, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useTheme } from '../store';

interface FormulaBuilderProps {
  value: string;
  onChange: (formula: string) => void;
  availableVariables?: { name: string; label: string }[];
  onClose?: () => void;
  preview?: number | string;
  error?: string;
}

interface ButtonGroup {
  label: string;
  icon?: string;
  items: { text: string; display: string; tooltip: string; insert: string }[];
}

/**
 * Comprehensive formula builder with all building blocks organized by category.
 * No calculator UI — just clean, organized clickable buttons for every formula element.
 */
export default function FormulaBuilder({
  value,
  onChange,
  availableVariables = [],
  onClose,
  preview,
  error,
}: FormulaBuilderProps) {
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorPos, setCursorPos] = useState(value.length);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Variables': true,
    'Time & Constants': true,
    'Math Functions': true,
    'Operators': true,
    'Numbers': true,
    'Motion Patterns': false,
    'String & Formatting': false,
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(cursorPos, cursorPos);
    }
  }, [value]);

  const insertAtCursor = useCallback((text: string) => {
    const before = value.substring(0, cursorPos);
    const after = value.substring(cursorPos);
    const newValue = before + text + after;
    onChange(newValue);
    setCursorPos(cursorPos + text.length);
  }, [value, cursorPos, onChange]);

  const handleBackspace = useCallback(() => {
    if (cursorPos === 0) return;
    const before = value.substring(0, cursorPos - 1);
    const after = value.substring(cursorPos);
    onChange(before + after);
    setCursorPos(cursorPos - 1);
  }, [value, cursorPos, onChange]);

  const handleClear = useCallback(() => {
    onChange('');
    setCursorPos(0);
  }, [onChange]);

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  // ── Button styles ──
  const chipBase = `inline-flex items-center justify-center px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 select-none cursor-pointer whitespace-nowrap`;

  const varChip = `${chipBase} ${isDark ? 'bg-amber-900/40 text-amber-300 hover:bg-amber-800/50 border border-amber-800/50' : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'}`;
  const constChip = `${chipBase} ${isDark ? 'bg-cyan-900/40 text-cyan-300 hover:bg-cyan-800/50 border border-cyan-800/50' : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-200'}`;
  const fnChip = `${chipBase} ${isDark ? 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800/50 border border-emerald-800/50' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'}`;
  const opChip = `${chipBase} ${isDark ? 'bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/50 border border-indigo-800/50' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'}`;
  const numChip = `${chipBase} ${isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}`;
  const motionChip = `${chipBase} ${isDark ? 'bg-purple-900/40 text-purple-300 hover:bg-purple-800/50 border border-purple-800/50' : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'}`;
  const strChip = `${chipBase} ${isDark ? 'bg-pink-900/40 text-pink-300 hover:bg-pink-800/50 border border-pink-800/50' : 'bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200'}`;
  const delChip = `${chipBase} ${isDark ? 'bg-rose-900/40 text-rose-400 hover:bg-rose-800/50 border border-rose-800/50' : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'}`;

  const sectionBg = isDark ? 'bg-[#0c0c0e] border-slate-800/60' : 'bg-slate-50/80 border-slate-200';
  const sectionHeader = isDark ? 'text-slate-300 hover:bg-slate-800/40' : 'text-slate-600 hover:bg-slate-100';

  // ── Button Groups Definition ──
  const groups: ButtonGroup[] = [
    {
      label: 'Variables',
      items: [
        ...availableVariables.map(v => ({ text: v.name, display: v.name, tooltip: v.label, insert: v.name })),
      ],
    },
    {
      label: 'Time & Constants',
      items: [
        { text: 't', display: 't', tooltip: 'Time — increases when simulation runs', insert: 't' },
        { text: 'pi', display: 'π', tooltip: 'Pi constant ≈ 3.14159', insert: 'pi' },
        { text: 'e', display: 'e', tooltip: 'Euler\'s number ≈ 2.71828', insert: 'e' },
      ],
    },
    {
      label: 'Math Functions',
      items: [
        { text: 'sin(', display: 'sin()', tooltip: 'Sine function', insert: 'sin()' },
        { text: 'cos(', display: 'cos()', tooltip: 'Cosine function', insert: 'cos()' },
        { text: 'tan(', display: 'tan()', tooltip: 'Tangent function', insert: 'tan()' },
        { text: 'asin(', display: 'asin()', tooltip: 'Arc sine (inverse sine)', insert: 'asin()' },
        { text: 'acos(', display: 'acos()', tooltip: 'Arc cosine (inverse cosine)', insert: 'acos()' },
        { text: 'atan(', display: 'atan()', tooltip: 'Arc tangent (inverse tangent)', insert: 'atan()' },
        { text: 'sqrt(', display: '√()', tooltip: 'Square root', insert: 'sqrt()' },
        { text: 'abs(', display: '|x|', tooltip: 'Absolute value', insert: 'abs()' },
        { text: 'pow(', display: 'pow()', tooltip: 'Power: pow(base, exponent)', insert: 'pow()' },
        { text: 'exp(', display: 'e^x', tooltip: 'Exponential: e raised to power', insert: 'exp()' },
        { text: 'log(', display: 'log()', tooltip: 'Natural logarithm (base e)', insert: 'log()' },
        { text: 'log10(', display: 'log₁₀()', tooltip: 'Logarithm base 10', insert: 'log10()' },
        { text: 'ceil(', display: 'ceil()', tooltip: 'Round up to nearest integer', insert: 'ceil()' },
        { text: 'floor(', display: 'floor()', tooltip: 'Round down to nearest integer', insert: 'floor()' },
        { text: 'round(', display: 'round()', tooltip: 'Round to nearest integer', insert: 'round()' },
        { text: 'min(', display: 'min()', tooltip: 'Minimum of two values', insert: 'min()' },
        { text: 'max(', display: 'max()', tooltip: 'Maximum of two values', insert: 'max()' },
        { text: 'mod(', display: 'mod()', tooltip: 'Modulo (remainder): mod(a,b)', insert: 'mod()' },
      ],
    },
    {
      label: 'Operators',
      items: [
        { text: '+', display: '+', tooltip: 'Addition', insert: ' + ' },
        { text: '-', display: '−', tooltip: 'Subtraction', insert: ' - ' },
        { text: '*', display: '×', tooltip: 'Multiplication', insert: ' * ' },
        { text: '/', display: '÷', tooltip: 'Division', insert: ' / ' },
        { text: '^', display: '^', tooltip: 'Power (e.g. 2^3 = 8)', insert: '^' },
        { text: '%', display: '%', tooltip: 'Percent (divides by 100)', insert: '/100' },
        { text: '(', display: '(', tooltip: 'Open bracket', insert: '(' },
        { text: ')', display: ')', tooltip: 'Close bracket', insert: ')' },
        { text: '.', display: '.', tooltip: 'Decimal point', insert: '.' },
      ],
    },
    {
      label: 'Numbers',
      items: [
        { text: '0', display: '0', tooltip: 'Zero', insert: '0' },
        { text: '1', display: '1', tooltip: 'One', insert: '1' },
        { text: '2', display: '2', tooltip: 'Two', insert: '2' },
        { text: '3', display: '3', tooltip: 'Three', insert: '3' },
        { text: '4', display: '4', tooltip: 'Four', insert: '4' },
        { text: '5', display: '5', tooltip: 'Five', insert: '5' },
        { text: '6', display: '6', tooltip: 'Six', insert: '6' },
        { text: '7', display: '7', tooltip: 'Seven', insert: '7' },
        { text: '8', display: '8', tooltip: 'Eight', insert: '8' },
        { text: '9', display: '9', tooltip: 'Nine', insert: '9' },
      ],
    },
    {
      label: 'Motion Patterns',
      items: [
        { text: 'oscillate', display: 'Oscillate', tooltip: 'Insert: center + amp * sin(speed * t)', insert: 'center + amp * sin(speed * t)' },
        { text: 'rotate', display: 'Rotate', tooltip: 'Insert: cos(speed * t)', insert: 'cos(speed * t)' },
        { text: 'linear', display: 'Linear', tooltip: 'Insert: start + velocity * t', insert: 'start + velocity * t' },
        { text: 'bounce', display: 'Bounce', tooltip: 'Insert: center + amp * abs(sin(speed * t))', insert: 'center + amp * abs(sin(speed * t))' },
        { text: 'orbit-x', display: 'Orbit X', tooltip: 'Insert: center + radius * cos(speed * t)', insert: 'center + radius * cos(speed * t)' },
        { text: 'orbit-y', display: 'Orbit Y', tooltip: 'Insert: center + radius * sin(speed * t)', insert: 'center + radius * sin(speed * t)' },
        { text: 'damped', display: 'Damped', tooltip: 'Insert: center + amp * exp(-damp * t) * sin(omega * t)', insert: 'center + amp * exp(-damp * t) * sin(omega * t)' },
        { text: 'pulsate', display: 'Pulsate', tooltip: 'Insert: base + range * (0.5 + 0.5 * sin(speed * t))', insert: 'base + range * (0.5 + 0.5 * sin(speed * t))' },
        { text: 'sawtooth', display: 'Sawtooth', tooltip: 'Insert: center + amp * (2 * (t * freq - floor(t * freq)) - 1)', insert: 'center + amp * (2 * (t * freq - floor(t * freq)) - 1)' },
        { text: 'triangle-wave', display: 'Triangle', tooltip: 'Insert: center + amp * abs(2 * (t * freq - floor(t * freq + 0.5)))', insert: 'center + amp * abs(2 * (t * freq - floor(t * freq + 0.5)))' },
      ],
    },
    {
      label: 'String & Formatting',
      items: [
        { text: 'quote', display: '"text"', tooltip: 'Insert quoted string', insert: '""' },
        { text: 'toFixed()', display: '.toFixed()', tooltip: 'Format number to decimal places', insert: '.toFixed(1)' },
        { text: 'concat', display: '+ "text"', tooltip: 'Concatenate string', insert: ' + ""' },
        { text: 'degrees', display: '→ °', tooltip: 'Convert radians to degrees: (val * 180 / pi)', insert: ' * 180 / pi' },
        { text: 'radians', display: '→ rad', tooltip: 'Convert degrees to radians: (val * pi / 180)', insert: ' * pi / 180' },
      ],
    },
  ];

  return (
    <div className={`rounded-2xl border p-4 space-y-3 max-h-[85vh] overflow-y-auto ${isDark ? 'bg-[#121215] border-slate-800' : 'bg-white border-slate-200'} shadow-lg`}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between sticky top-0 z-10 bg-inherit pb-2 border-b border-slate-800/20">
        <h3 className={`text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          ✏️ Formula Builder
        </h3>
        {onClose && (
          <button onClick={onClose} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${isDark ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
            Done
          </button>
        )}
      </div>

      {/* ── Formula Display / Input ── */}
      <div className={`relative rounded-xl border px-3 py-2.5 ${isDark ? 'bg-[#0a0a0c] border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => { onChange(e.target.value); setCursorPos(e.target.selectionStart || 0); }}
          onFocus={(e) => setCursorPos(e.target.selectionStart || 0)}
          onClick={(e) => setCursorPos((e.target as HTMLInputElement).selectionStart || 0)}
          onKeyDown={(e) => { if (e.key === 'Backspace') { e.preventDefault(); handleBackspace(); } }}
          className={`w-full bg-transparent outline-none font-mono text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}
          placeholder="Click buttons below to build your formula..."
          spellCheck={false}
        />
        {preview !== undefined && (
          <div className={`mt-1.5 text-xs font-mono font-bold ${error ? 'text-rose-400' : 'text-emerald-400'}`}>
            {error ? `⚠ ${error}` : `= ${typeof preview === 'number' ? preview.toFixed(4) : preview}`}
          </div>
        )}
      </div>

      {/* ── Quick Actions ── */}
      <div className="flex items-center gap-2">
        <button onClick={handleClear} className={`${delChip} text-[10px]`}>Clear All</button>
        <button onClick={handleBackspace} className={`${delChip} text-[10px]`}>⌫ Delete</button>
        <div className="flex-1" />
        <span className={`text-[9px] font-bold ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>
          {value.length} chars
        </span>
      </div>

      {/* ── Button Groups ── */}
      {groups.map((group) => {
        const isOpen = openGroups[group.label] !== false;
        const hasItems = group.items.length > 0;

        return (
          <div key={group.label} className={`rounded-xl border overflow-hidden ${sectionBg}`}>
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.label)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-extrabold uppercase tracking-wider transition-colors ${sectionHeader}`}
            >
              <div className="flex items-center gap-2">
                {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                <span>{group.label}</span>
                <span className={`text-[9px] font-bold ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>
                  {group.items.length}
                </span>
              </div>
            </button>

            {/* Group Items */}
            {isOpen && hasItems && (
              <div className="px-3 pb-3 flex flex-wrap gap-1.5">
                {group.items.map((item) => {
                  let chipClass = numChip;
                  if (group.label === 'Variables') chipClass = varChip;
                  else if (group.label === 'Time & Constants') chipClass = constChip;
                  else if (group.label === 'Math Functions') chipClass = fnChip;
                  else if (group.label === 'Operators') chipClass = opChip;
                  else if (group.label === 'Motion Patterns') chipClass = motionChip;
                  else if (group.label === 'String & Formatting') chipClass = strChip;

                  return (
                    <button
                      key={item.text}
                      onClick={() => insertAtCursor(item.insert)}
                      className={chipClass}
                      title={item.tooltip}
                    >
                      {item.display}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* ── Tip ── */}
      <div className={`text-[9px] font-medium text-center py-2 ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>
        Use <strong>t</strong> for time-based animation · Click any button to insert at cursor position
      </div>
    </div>
  );
}
