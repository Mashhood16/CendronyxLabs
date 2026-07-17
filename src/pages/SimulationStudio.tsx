import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save, ArrowLeft, ArrowUp, ArrowDown, Sparkles, Layers, Code, Sliders,
  Check, Copy, Download, Upload, AlertTriangle, CheckCircle, XCircle,
  Zap, BookOpen, Trash2, Circle, Square, Minus, Triangle, Type,
  MousePointer, Eraser, Play, Pause, RotateCcw, ChevronRight, ChevronLeft,
} from 'lucide-react';
import { useTheme } from '../store';
import { theme } from '../utils/labTheme';
import { customSimService, SavedSimulation } from '../services/customSimService';
import { CustomSimulationRenderer } from '../components/CustomSimulationRenderer';
import { evaluateEquation } from '../utils/equationEvaluator';
import InteractiveCanvas from '../components/InteractiveCanvas';
import FormulaBuilder from '../components/FormulaBuilder';

// ═══════════════════════════════════════════════════════════════════
// PRESET TEMPLATES
// ═══════════════════════════════════════════════════════════════════

interface SimulationPreset {
  id: string; name: string; description: string; category: string; icon: string;
  variables: SavedSimulation['variables']; equations: SavedSimulation['equations']; shapes: SavedSimulation['shapes'];
}

const SIMULATION_PRESETS: SimulationPreset[] = [
  {
    id: 'pendulum', name: 'Simple Pendulum', description: 'Classic pendulum motion.', category: 'Physics', icon: '🔔',
    variables: [
      { name: 'L', label: 'Length (m)', value: 2.5, min: 0.5, max: 5, step: 0.1 },
      { name: 'g', label: 'Gravity (m/s²)', value: 9.81, min: 1, max: 20, step: 0.1 },
    ],
    equations: [
      { name: 'omega', expression: 'sqrt(g / L)' },
      { name: 'angle', expression: '0.8 * sin(omega * t)' },
    ],
    shapes: [
      { id: 'pivot', type: 'circle', color: '#ef4444', xExpr: '400', yExpr: '100', radiusExpr: '6' },
      { id: 'rod', type: 'line', color: '#94a3b8', xExpr: '400', yExpr: '100', x2Expr: '400 + L * 80 * sin(angle)', y2Expr: '100 + L * 80 * cos(angle)', strokeWidth: '3' },
      { id: 'bob', type: 'circle', color: '#6366f1', xExpr: '400 + L * 80 * sin(angle)', yExpr: '100 + L * 80 * cos(angle)', radiusExpr: '20' },
      { id: 'label', type: 'text', color: '#34d399', xExpr: '400', yExpr: '380', textExpr: '"Angle: " + (angle * 180 / pi).toFixed(1) + "°"', fontSizeExpr: '14' },
    ],
  },
  {
    id: 'projectile', name: 'Projectile Motion', description: 'Launch angle & velocity.', category: 'Physics', icon: '🚀',
    variables: [
      { name: 'v0', label: 'Velocity (m/s)', value: 20, min: 5, max: 50, step: 1 },
      { name: 'theta', label: 'Angle (°)', value: 45, min: 5, max: 85, step: 1 },
      { name: 'g', label: 'Gravity (m/s²)', value: 9.81, min: 1, max: 20, step: 0.1 },
    ],
    equations: [
      { name: 'vx', expression: 'v0 * cos(theta * pi / 180)' },
      { name: 'vy', expression: 'v0 * sin(theta * pi / 180)' },
      { name: 'px', expression: '100 + vx * t * 10' },
      { name: 'py', expression: '350 - (vy * t - 0.5 * g * t * t) * 10' },
    ],
    shapes: [
      { id: 'ground', type: 'line', color: '#22c55e', xExpr: '50', yExpr: '350', x2Expr: '750', y2Expr: '350', strokeWidth: '3' },
      { id: 'ball', type: 'circle', color: '#f59e0b', xExpr: 'px', yExpr: 'py', radiusExpr: '10' },
      { id: 'vel', type: 'line', color: '#ef4444', xExpr: '100', yExpr: '350', x2Expr: '100 + vx * 3', y2Expr: '350 - vy * 3', strokeWidth: '2' },
      { id: 'info', type: 'text', color: '#6366f1', xExpr: '400', yExpr: '30', textExpr: '"v₀=" + v0.toFixed(0) + " θ=" + theta.toFixed(0) + "°"', fontSizeExpr: '14' },
    ],
  },
  {
    id: 'spring', name: 'Spring Oscillator', description: 'Mass-spring system.', category: 'Physics', icon: '〰️',
    variables: [
      { name: 'k', label: 'Spring Const (N/m)', value: 10, min: 1, max: 50, step: 0.5 },
      { name: 'm', label: 'Mass (kg)', value: 1, min: 0.1, max: 10, step: 0.1 },
      { name: 'A', label: 'Amplitude (px)', value: 100, min: 20, max: 200, step: 5 },
    ],
    equations: [
      { name: 'omega', expression: 'sqrt(k / m)' },
      { name: 'x', expression: 'A * cos(omega * t)' },
      { name: 'v', expression: '-A * omega * sin(omega * t)' },
    ],
    shapes: [
      { id: 'wall', type: 'rectangle', color: '#64748b', xExpr: '100', yExpr: '250', widthExpr: '15', heightExpr: '120', angleExpr: '0' },
      { id: 'spring', type: 'line', color: '#a855f7', xExpr: '108', yExpr: '250', x2Expr: '400 + x', y2Expr: '250', strokeWidth: '3' },
      { id: 'mass', type: 'rectangle', color: '#3b82f6', xExpr: '400 + x', yExpr: '250', widthExpr: '40', heightExpr: '40', angleExpr: '0' },
      { id: 'eq', type: 'text', color: '#22d3ee', xExpr: '400', yExpr: '350', textExpr: '"x=" + x.toFixed(1) + " v=" + v.toFixed(1)', fontSizeExpr: '13' },
    ],
  },
  {
    id: 'orbital', name: 'Orbital Motion', description: 'Planet orbiting a star.', category: 'Physics', icon: '🪐',
    variables: [
      { name: 'R', label: 'Radius (px)', value: 120, min: 40, max: 200, step: 5 },
      { name: 'speed', label: 'Speed', value: 1.5, min: 0.1, max: 5, step: 0.1 },
    ],
    equations: [
      { name: 'angle', expression: 'speed * t' },
    ],
    shapes: [
      { id: 'star', type: 'circle', color: '#fbbf24', xExpr: '400', yExpr: '250', radiusExpr: '18' },
      { id: 'orbit', type: 'circle', color: '#334155', xExpr: '400', yExpr: '250', radiusExpr: 'R' },
      { id: 'planet', type: 'circle', color: '#3b82f6', xExpr: '400 + R * cos(angle)', yExpr: '250 + R * sin(angle)', radiusExpr: '12' },
      { id: 'info', type: 'text', color: '#a78bfa', xExpr: '400', yExpr: '430', textExpr: '"R=" + R.toFixed(0) + " ω=" + speed.toFixed(1)', fontSizeExpr: '13' },
    ],
  },
  {
    id: 'blank', name: 'Blank Canvas', description: 'Start from scratch.', category: 'Custom', icon: '✨',
    variables: [], equations: [], shapes: [],
  },
];

type CanvasTool = 'select' | 'circle' | 'rectangle' | 'line' | 'triangle' | 'text' | 'delete';

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function SimulationStudio() {
  const { simId } = useParams<{ simId?: string }>();
  const navigate = useNavigate();
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  // ── Wizard Step ──
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // ── Simulation Data ──
  const [simName, setSimName] = useState('My Custom Simulation');
  const [simDesc, setSimDesc] = useState('A custom physics simulation.');
  const [simCategory, setSimCategory] = useState('Physics');

  const [variables, setVariables] = useState<SavedSimulation['variables']>([]);
  const [equations, setEquations] = useState<SavedSimulation['equations']>([]);
  const [shapes, setShapes] = useState<SavedSimulation['shapes']>([]);

  // ── Canvas State ──
  const [canvasTool, setCanvasTool] = useState<CanvasTool>('select');
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

  // ── Formula Builder State ──
  const [formulaTarget, setFormulaTarget] = useState<{ shapeIdx: number; field: string; label: string } | null>(null);
  const [formulaValue, setFormulaValue] = useState('');

  // ── Equation editor state ──
  const [equationEditIdx, setEquationEditIdx] = useState<number | null>(null);
  const [equationFormulaValue, setEquationFormulaValue] = useState('');

  // ── UI State ──
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3 | 4 | null>(1);
  const [onboardingDismissed, setOnboardingDismissed] = useState<Record<number, boolean>>({});

  // ── Load existing simulation ──
  useEffect(() => {
    if (simId) {
      const loaded = customSimService.getSimulation(simId);
      if (loaded) {
        setSimName(loaded.name);
        setSimDesc(loaded.description);
        setSimCategory(loaded.category || 'Physics');
        setVariables(loaded.variables);
        setEquations(loaded.equations);
        setShapes(loaded.shapes);
      }
    }
  }, [simId]);

  // ── Load preset ──
  const loadPreset = (preset: SimulationPreset) => {
    setSimName(preset.name);
    setSimDesc(preset.description);
    setSimCategory(preset.category);
    setVariables(preset.variables);
    setEquations(preset.equations);
    setShapes(preset.shapes);
    setShowPresets(false);
    setStep(1);
  };

  // ── Save ──
  const handleSave = () => {
    const simulationToSave: SavedSimulation = {
      id: simId || `sim-${Math.random().toString(36).substring(2, 11)}`,
      name: simName.trim() || 'Untitled Simulation',
      description: simDesc.trim(),
      category: simCategory,
      createdAt: Date.now(),
      variables, equations, shapes,
    };
    customSimService.saveSimulation(simulationToSave);
    setSaveSuccess(true);
    setTimeout(() => { setSaveSuccess(false); navigate('/'); }, 1500);
  };

  // ── Export / Import ──
  const handleExport = () => {
    const data: SavedSimulation = {
      id: simId || `sim-${Math.random().toString(36).substring(2, 11)}`,
      name: simName.trim() || 'Untitled', description: simDesc.trim(), category: simCategory,
      createdAt: Date.now(), variables, equations, shapes,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${simName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string) as SavedSimulation;
          if (data.variables && data.equations && data.shapes) {
            setSimName(data.name || 'Imported'); setSimDesc(data.description || '');
            setSimCategory(data.category || 'Physics');
            setVariables(data.variables); setEquations(data.equations); setShapes(data.shapes);
          }
        } catch { alert('Invalid simulation file.'); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // ── Variables CRUD ──
  const addVariable = () => {
    const usedNames = variables.map(v => v.name);
    const available = ['x', 'y', 'z', 'k', 'm', 'v', 'a', 'F', 'r', 'd', 'w', 'h'].filter(n => !usedNames.includes(n));
    const name = available[0] || `var${variables.length}`;
    setVariables([...variables, { name, label: `Variable ${name}`, value: 2, min: 0, max: 10, step: 0.1 }]);
  };
  const removeVariable = (idx: number) => setVariables(variables.filter((_, i) => i !== idx));
  const updateVariable = (idx: number, field: string, val: any) => {
    const updated = [...variables]; updated[idx] = { ...updated[idx], [field]: val }; setVariables(updated);
  };

  // ── Equations CRUD ──
  const addEquation = () => setEquations([...equations, { name: `val_${equations.length + 1}`, expression: '0' }]);
  const removeEquation = (idx: number) => setEquations(equations.filter((_, i) => i !== idx));
  const updateEquation = (idx: number, field: string, val: any) => {
    const updated = [...equations]; updated[idx] = { ...updated[idx], [field]: val }; setEquations(updated);
  };

  // ── Open formula builder for a shape property ──
  const openShapeFormula = (shapeIdx: number, field: string, label: string, currentValue: string) => {
    setFormulaTarget({ shapeIdx, field, label });
    setFormulaValue(currentValue || '');
    setEquationEditIdx(null);
  };

  const applyShapeFormula = () => {
    if (!formulaTarget) return;
    const updated = [...shapes];
    updated[formulaTarget.shapeIdx] = { ...updated[formulaTarget.shapeIdx], [formulaTarget.field]: formulaValue };
    setShapes(updated);
    setFormulaTarget(null);
  };

  // ── Open formula builder for an equation ──
  const openEquationFormula = (eqIdx: number) => {
    setEquationEditIdx(eqIdx);
    setEquationFormulaValue(equations[eqIdx].expression);
    setFormulaTarget(null);
  };

  const applyEquationFormula = () => {
    if (equationEditIdx === null) return;
    updateEquation(equationEditIdx, 'expression', equationFormulaValue);
    setEquationEditIdx(null);
  };

  // ── Transient model for live preview ──
  const transientSimulation: SavedSimulation = useMemo(() => ({
    id: 'transient', name: simName, description: simDesc, category: simCategory, createdAt: Date.now(),
    variables, equations, shapes,
  }), [simName, simDesc, simCategory, variables, equations, shapes]);

  // ── Available variables for formula builder ──
  const availableVarsForFormula = useMemo(() => [
    ...variables.map(v => ({ name: v.name, label: v.label })),
    ...equations.map(e => ({ name: e.name, label: `Computed: ${e.name}` })),
  ], [variables, equations]);

  // ── Get selected shape info ──
  const selectedShape = selectedShapeId ? shapes.find(s => s.id === selectedShapeId) : null;
  const selectedShapeIdx = selectedShapeId ? shapes.findIndex(s => s.id === selectedShapeId) : -1;

  // ── Shape property fields per type ──
  const getShapeFields = (type: SavedSimulation['shapes'][number]['type']) => {
    const common = [
      { field: 'color', label: 'Color (hex)', type: 'color' },
    ];
    switch (type) {
      case 'circle': return [...common, { field: 'xExpr', label: 'Center X' }, { field: 'yExpr', label: 'Center Y' }, { field: 'radiusExpr', label: 'Radius' }];
      case 'rectangle': return [...common, { field: 'xExpr', label: 'Center X' }, { field: 'yExpr', label: 'Center Y' }, { field: 'widthExpr', label: 'Width' }, { field: 'heightExpr', label: 'Height' }, { field: 'angleExpr', label: 'Rotation °' }];
      case 'line': return [...common, { field: 'xExpr', label: 'Start X' }, { field: 'yExpr', label: 'Start Y' }, { field: 'x2Expr', label: 'End X' }, { field: 'y2Expr', label: 'End Y' }, { field: 'strokeWidth', label: 'Thickness' }];
      case 'triangle': return [...common, { field: 'xExpr', label: 'Point 1 X' }, { field: 'yExpr', label: 'Point 1 Y' }, { field: 'x2Expr', label: 'Point 2 X' }, { field: 'y2Expr', label: 'Point 2 Y' }, { field: 'x3Expr', label: 'Point 3 X' }, { field: 'y3Expr', label: 'Point 3 Y' }];
      case 'text': return [...common, { field: 'xExpr', label: 'X Position' }, { field: 'yExpr', label: 'Y Position' }, { field: 'textExpr', label: 'Text Content' }, { field: 'fontSizeExpr', label: 'Font Size' }];
      default: return common;
    }
  };

  const isDarkCanvas = true; // Canvas is always dark for better contrast

  // ════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════
  const stepLabels = ['1. Shapes', '2. Variables', '3. Formulas', '4. Preview'];

  // ── Onboarding content for each step ──
  const onboardingContent: Record<number, { icon: string; title: string; description: string; tips: string[] }> = {
    1: {
      icon: '🎨',
      title: 'Draw Your Shapes',
      description: 'Place the visual objects of your simulation on the canvas, just like Microsoft Paint.',
      tips: [
        'Click a shape tool on the left toolbar (Circle, Rectangle, Line, Triangle, Text)',
        'Click on the canvas to place the shape at that position',
        'Click on a placed shape to select it and edit its properties on the right',
        'Drag shapes to reposition them',
        'Use the Delete tool to remove shapes you don\'t need',
      ],
    },
    2: {
      icon: '🎛️',
      title: 'Add Variables (Sliders)',
      description: 'Define interactive controls that users can adjust during the simulation.',
      tips: [
        'Click "+ Add" to create a new variable (slider)',
        'Give it a short Name (like L, g, A) — you\'ll use this name in formulas later',
        'Set the Label (shown to users), Default value, Min, Max, and Step',
        'Variables become sliders in the final simulation',
        'Keep names short — they appear in your formulas!',
      ],
    },
    3: {
      icon: '📐',
      title: 'Write Formulas',
      description: 'Define equations that compute values and link them to shape properties to create motion.',
      tips: [
        'Add equations in the left panel — they compute values from variables + time (t)',
        'Click a formula field to open the Formula Builder with categorized buttons',
        'Use t (time) in formulas to make things move over time',
        'On the right, click shape properties to link them to equations',
        'Example: sin(speed * t) creates oscillating motion',
      ],
    },
    4: {
      icon: '▶️',
      title: 'Preview & Run',
      description: 'Watch your simulation come to life! Adjust sliders and see real-time changes.',
      tips: [
        'Click "Run Simulation" to start the animation',
        'Drag sliders to adjust variables in real-time',
        'Use Pause/Reset controls to control playback',
        'Adjust speed with the speed dropdown (0.25x to 2x)',
        'Click "Save" when you\'re happy with your simulation!',
      ],
    },
  };

  const dismissOnboarding = (stepNum: number) => {
    setOnboardingDismissed(prev => ({ ...prev, [stepNum]: true }));
    setOnboardingStep(null);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans ${theme.page.bg} transition-colors duration-300`}>
      {/* ═══ HEADER ═══ */}
      <header className={`px-4 sm:px-6 py-3 flex items-center justify-between border-b ${theme.nav.border} ${isDark ? 'bg-[#0f0f11]' : 'bg-white'} shadow-sm`}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className={`p-2 rounded-xl border transition-all ${isDark ? 'border-slate-800 hover:bg-[#1a1a1f] text-slate-200' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className={`text-md sm:text-lg font-extrabold flex items-center gap-1.5 ${theme.text.primary}`}>
              <Sparkles className="w-5 h-5 text-amber-500" /> Simulation Studio
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Draw → Define → Animate</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setShowPresets(!showPresets)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${showPresets ? 'bg-amber-500 text-white' : isDark ? 'bg-[#1a1a1f] border border-slate-800 text-slate-300 hover:bg-[#222228]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            <BookOpen size={14} /> Presets
          </button>
          <button onClick={handleImport} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold ${isDark ? 'bg-[#1a1a1f] border border-slate-800 text-slate-300 hover:bg-[#222228]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            <Upload size={14} /> Import
          </button>
          <button onClick={handleExport} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold ${isDark ? 'bg-[#1a1a1f] border border-slate-800 text-slate-300 hover:bg-[#222228]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            <Download size={14} /> Export
          </button>
          <button onClick={handleSave} disabled={saveSuccess}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-all ${saveSuccess ? 'bg-emerald-600 text-white scale-95' : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.02]'}`}>
            {saveSuccess ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save</>}
          </button>
        </div>
      </header>

      {/* ═══ PRESETS PANEL ═══ */}
      {showPresets && (
        <div className={`border-b px-4 sm:px-6 py-4 ${isDark ? 'bg-[#0f0f11] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-extrabold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Quick Start Templates</h3>
            <button onClick={() => setShowPresets(false)} className={`p-1 rounded-lg ${isDark ? 'text-slate-500 hover:bg-[#1a1a1f]' : 'text-slate-400 hover:bg-slate-200'}`}><XCircle size={16} /></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {SIMULATION_PRESETS.map((preset) => (
              <button key={preset.id} onClick={() => loadPreset(preset)}
                className={`group p-3 rounded-xl border text-left transition-all hover:scale-[1.02] hover:shadow-md ${isDark ? 'bg-[#121215] border-slate-800 hover:border-indigo-500/50 hover:bg-[#1a1a1f]' : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50'}`}>
                <span className="text-2xl block mb-1.5">{preset.icon}</span>
                <p className={`text-xs font-extrabold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{preset.name}</p>
                <p className={`text-[10px] mt-0.5 leading-tight ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{preset.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══ WIZARD STEP BAR ═══ */}
      <div className={`flex items-center gap-1 px-4 sm:px-6 py-3 border-b ${isDark ? 'bg-[#0a0a0c] border-slate-800/50' : 'bg-slate-50 border-slate-200'}`}>
        {stepLabels.map((label, i) => {
          const num = (i + 1) as 1 | 2 | 3 | 4;
          const isActive = step === num;
          const isPast = step > num;
          return (
            <React.Fragment key={num}>
              <button
                onClick={() => setStep(num)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : isPast
                      ? isDark ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/40' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : isDark ? 'bg-slate-800/50 text-slate-500 border border-slate-800' : 'bg-white text-slate-400 border border-slate-200'
                }`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                  isActive ? 'bg-white text-indigo-600' : isPast ? 'bg-emerald-500 text-white' : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-400'
                }`}>{isPast ? '✓' : num}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
              {i < 3 && <ChevronRight size={12} className={isDark ? 'text-slate-700' : 'text-slate-300'} />}
            </React.Fragment>
          );
        })}

        {/* Step navigation */}
        <div className="ml-auto flex items-center gap-2">
          {step > 1 && (
            <button onClick={() => setStep((step - 1) as 1 | 2 | 3)} className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              <ChevronLeft size={14} /> Back
            </button>
          )}
          {step < 4 && (
            <button onClick={() => setStep((step + 1) as 2 | 3 | 4)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500">
              Next <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ═══ SIMULATION NAME BAR ═══ */}
      <div className={`flex items-center gap-3 px-4 sm:px-6 py-2 border-b ${isDark ? 'bg-[#0c0c0e] border-slate-800/30' : 'bg-white border-slate-100'}`}>
        <input type="text" value={simName} onChange={(e) => setSimName(e.target.value)}
          className={`flex-1 bg-transparent outline-none text-sm font-bold ${isDark ? 'text-white placeholder:text-slate-600' : 'text-slate-800 placeholder:text-slate-300'}`}
          placeholder="Simulation name..." />
        <select value={simCategory} onChange={(e) => setSimCategory(e.target.value)}
          className={`text-[10px] font-bold rounded-lg px-2 py-1 border outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
          <option value="Physics">Physics</option>
          <option value="Math">Math</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Biology">Biology</option>
          <option value="Technology">Tech</option>
        </select>
      </div>

      {/* ═══ MAIN CONTENT AREA ═══ */}
      <main className="flex-1 flex overflow-hidden">

        {/* ════════════════════════════════════════════════════════
            STEP 1: SHAPES — Paint-style canvas + shape toolbar
            ════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="flex-1 flex overflow-hidden">
            {/* Shape Toolbar (left side) */}
            <div className={`w-14 flex flex-col items-center gap-1 py-3 border-r ${isDark ? 'bg-[#0a0a0c] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              {([
                { tool: 'select' as CanvasTool, icon: MousePointer, label: 'Select', color: 'text-slate-400' },
                { tool: 'circle' as CanvasTool, icon: Circle, label: 'Circle', color: 'text-blue-400' },
                { tool: 'rectangle' as CanvasTool, icon: Square, label: 'Rectangle', color: 'text-indigo-400' },
                { tool: 'line' as CanvasTool, icon: Minus, label: 'Line', color: 'text-emerald-400' },
                { tool: 'triangle' as CanvasTool, icon: Triangle, label: 'Triangle', color: 'text-amber-400' },
                { tool: 'text' as CanvasTool, icon: Type, label: 'Text', color: 'text-pink-400' },
                { tool: 'delete' as CanvasTool, icon: Eraser, label: 'Delete', color: 'text-rose-400' },
              ]).map(({ tool: t, icon: Icon, label, color }) => (
                <button key={t} onClick={() => setCanvasTool(t)} title={label}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    canvasTool === t
                      ? 'bg-indigo-600 text-white shadow-lg scale-110'
                      : `${color} ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-200'}`
                  }`}>
                  <Icon size={18} />
                </button>
              ))}

              <div className="flex-1" />

              <div className={`text-[8px] font-bold text-center ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>
                {shapes.length} shapes
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 p-3">
              <InteractiveCanvas
                shapes={shapes} onShapesChange={setShapes}
                selectedShapeId={selectedShapeId} onSelectShape={setSelectedShapeId}
                tool={canvasTool} isDark={isDark}
              />
            </div>

            {/* Shape Properties Panel (right side) */}
            <div className={`w-72 border-l overflow-y-auto ${isDark ? 'bg-[#0f0f11] border-slate-800' : 'bg-white border-slate-200'}`}>
              {selectedShape ? (
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                        {selectedShape.type}
                      </span>
                      <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{selectedShape.id}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => { const idx = selectedShapeIdx; if (idx > 0) { const u = [...shapes]; [u[idx-1], u[idx]] = [u[idx], u[idx-1]]; setShapes(u); } }}
                        className={`p-1 rounded ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}><ArrowUp size={13} /></button>
                      <button onClick={() => { const idx = selectedShapeIdx; if (idx < shapes.length - 1) { const u = [...shapes]; [u[idx], u[idx+1]] = [u[idx+1], u[idx]]; setShapes(u); } }}
                        className={`p-1 rounded ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}><ArrowDown size={13} /></button>
                      <button onClick={() => { const copy = { ...selectedShape, id: `${selectedShape.id}-copy` }; const u = [...shapes]; u.splice(selectedShapeIdx + 1, 0, copy); setShapes(u); }}
                        className={`p-1 rounded ${isDark ? 'text-slate-500 hover:text-blue-400' : 'text-slate-400 hover:text-blue-600'}`}><Copy size={13} /></button>
                      <button onClick={() => { setShapes(shapes.filter(s => s.id !== selectedShapeId)); setSelectedShapeId(null); }}
                        className="p-1 rounded text-slate-500 hover:text-rose-500"><Trash2 size={13} /></button>
                    </div>
                  </div>

                  <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Click a property below to open the formula builder, or drag on canvas to move.
                  </p>

                  <div className="space-y-2">
                    {getShapeFields(selectedShape.type).map(({ field, label, type: fType }) => {
                      const currentValue = (selectedShape as any)[field] || '';
                      return (
                        <div key={field}>
                          <label className={`block text-[9px] font-bold uppercase mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</label>
                          {fType === 'color' ? (
                            <div className="flex items-center gap-2">
                              <input type="color" value={currentValue.startsWith('#') && currentValue.length === 7 ? currentValue : '#6366f1'}
                                onChange={(e) => { const u = [...shapes]; u[selectedShapeIdx] = { ...u[selectedShapeIdx], color: e.target.value }; setShapes(u); }}
                                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent" />
                              <input type="text" value={currentValue}
                                onChange={(e) => { const u = [...shapes]; u[selectedShapeIdx] = { ...u[selectedShapeIdx], color: e.target.value }; setShapes(u); }}
                                className={`flex-1 px-2 py-1 rounded border text-[10px] font-mono ${isDark ? 'bg-[#0a0a0c] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`} />
                            </div>
                          ) : (
                            <button onClick={() => openShapeFormula(selectedShapeIdx, field, label, currentValue)}
                              className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-mono transition-all ${
                                isDark ? 'bg-[#0a0a0c] border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-500/5' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50'
                              }`}>
                              <span className={`block text-[9px] font-bold mb-0.5 ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>{label}</span>
                              <span className="font-mono">{currentValue || '0'}</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className={`p-6 text-center space-y-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <div className="text-3xl">🎨</div>
                  <p className="text-xs font-bold">Select a tool and click the canvas to place shapes</p>
                  <p className="text-[10px]">Use the toolbar on the left to choose shapes. Click shapes on canvas to select and edit properties.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            STEP 2: VARIABLES — Add slider controls
            ════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="flex-1 flex overflow-hidden">
            {/* Canvas preview (left) */}
            <div className="flex-1 p-3">
              <InteractiveCanvas shapes={shapes} onShapesChange={setShapes} selectedShapeId={null} onSelectShape={() => {}} tool="select" isDark={isDark} previewMode />
            </div>

            {/* Variables panel (right) */}
            <div className={`w-96 border-l overflow-y-auto ${isDark ? 'bg-[#0f0f11] border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-sm font-extrabold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>🎛️ Variables</h2>
                    <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      These become sliders in the simulation. Use their names in formulas.
                    </p>
                  </div>
                  <button onClick={addVariable} className="flex items-center gap-1 text-[11px] font-extrabold text-indigo-500 bg-indigo-500/10 px-3 py-1.5 rounded-xl hover:bg-indigo-500/25 transition-all">
                    <Sliders size={12} /> Add
                  </button>
                </div>

                {variables.length === 0 ? (
                  <div className={`text-center py-12 border border-dashed rounded-2xl ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                    <p className="text-xs font-bold mb-1">No variables yet</p>
                    <p className="text-[10px]">Add variables to create interactive sliders for your simulation.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {variables.map((v, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-[#121215] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center justify-between">
                          <input type="text" value={v.name}
                            onChange={(e) => updateVariable(idx, 'name', e.target.value.replace(/[^a-zA-Z]/g, ''))}
                            className={`text-sm font-mono font-bold w-16 bg-transparent outline-none ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}
                            placeholder="Name" />
                          <button onClick={() => removeVariable(idx)} className="p-1 text-slate-500 hover:text-rose-500"><Trash2 size={13} /></button>
                        </div>
                        <input type="text" value={v.label}
                          onChange={(e) => updateVariable(idx, 'label', e.target.value)}
                          className={`w-full text-xs font-semibold bg-transparent outline-none ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
                          placeholder="Display label" />
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className={`block text-[9px] font-bold mb-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Default</label>
                            <input type="number" step="any" value={v.value}
                              onChange={(e) => updateVariable(idx, 'value', parseFloat(e.target.value) || 0)}
                              className={`w-full px-2 py-1 rounded border text-xs text-center ${isDark ? 'bg-[#0a0a0c] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`} />
                          </div>
                          <div>
                            <label className={`block text-[9px] font-bold mb-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Min</label>
                            <input type="number" step="any" value={v.min}
                              onChange={(e) => updateVariable(idx, 'min', parseFloat(e.target.value) || 0)}
                              className={`w-full px-2 py-1 rounded border text-xs text-center ${isDark ? 'bg-[#0a0a0c] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`} />
                          </div>
                          <div>
                            <label className={`block text-[9px] font-bold mb-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Max</label>
                            <input type="number" step="any" value={v.max}
                              onChange={(e) => updateVariable(idx, 'max', parseFloat(e.target.value) || 0)}
                              className={`w-full px-2 py-1 rounded border text-xs text-center ${isDark ? 'bg-[#0a0a0c] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Step:</span>
                          <input type="number" step="any" value={v.step}
                            onChange={(e) => updateVariable(idx, 'step', parseFloat(e.target.value) || 0.1)}
                            className={`w-20 px-2 py-1 rounded border text-xs text-center ${isDark ? 'bg-[#0a0a0c] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`} />
                        </div>
                        {/* Preview slider */}
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{v.value.toFixed(1)}</span>
                          <input type="range" min={v.min} max={v.max} step={v.step} value={v.value}
                            onChange={(e) => updateVariable(idx, 'value', parseFloat(e.target.value))}
                            className="flex-1 accent-indigo-500 h-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            STEP 3: FORMULAS — Equations + Shape property formulas
            ════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Equations */}
            <div className={`flex-1 border-r overflow-y-auto ${isDark ? 'bg-[#0f0f11] border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-sm font-extrabold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>📐 Physics Equations</h2>
                    <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      Define computed values. Sequential evaluation. Use sin, cos, sqrt, pi, t.
                    </p>
                  </div>
                  <button onClick={addEquation} className="flex items-center gap-1 text-[11px] font-extrabold text-indigo-500 bg-indigo-500/10 px-3 py-1.5 rounded-xl hover:bg-indigo-500/25">
                    <Code size={12} /> Add
                  </button>
                </div>

                {equations.length === 0 ? (
                  <div className={`text-center py-12 border border-dashed rounded-2xl ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                    <p className="text-xs font-bold mb-1">No equations yet</p>
                    <p className="text-[10px]">Add equations to compute values from variables.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {equations.map((eq, idx) => {
                      let preview = '';
                      let hasError = false;
                      try {
                        const vars: Record<string, number> = { t: 1, pi: Math.PI, e: Math.E };
                        variables.forEach(v => { vars[v.name] = v.value; });
                        // Evaluate all previous equations sequentially so later ones can reference earlier ones
                        for (let i = 0; i < idx; i++) {
                          vars[equations[i].name] = evaluateEquation(equations[i].expression, vars, 0);
                        }
                        const result = evaluateEquation(eq.expression, vars, NaN);
                        preview = isNaN(result) ? 'Error' : result.toFixed(4);
                        hasError = isNaN(result);
                      } catch { preview = 'Error'; hasError = true; }

                      return (
                        <div key={idx} className={`p-3 rounded-xl border ${hasError ? (isDark ? 'bg-red-950/20 border-red-800/40' : 'bg-red-50 border-red-200') : (isDark ? 'bg-[#121215] border-slate-800' : 'bg-slate-50 border-slate-200')}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <input type="text" value={eq.name}
                              onChange={(e) => updateEquation(idx, 'name', e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                              className={`w-28 text-xs font-mono font-bold bg-transparent outline-none ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}
                              placeholder="name" />
                            <span className={`text-xs font-bold ${isDark ? 'text-slate-600' : 'text-slate-300'}`}> = </span>
                            <button onClick={() => openEquationFormula(idx)}
                              className={`flex-1 text-left px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${isDark ? 'bg-[#0a0a0c] border-slate-800 text-white hover:border-indigo-500/50' : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300'}`}>
                              {eq.expression || 'Click to edit...'}
                            </button>
                            <button onClick={() => removeEquation(idx)} className="p-1 text-slate-500 hover:text-rose-500"><Trash2 size={13} /></button>
                          </div>
                          <div className={`flex items-center gap-1 text-[10px] font-mono font-bold ${hasError ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {hasError ? <><AlertTriangle size={10} /> {preview}</> : <><CheckCircle size={10} /> = {preview}</>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Shape properties */}
            <div className={`w-80 overflow-y-auto ${isDark ? 'bg-[#0c0c0e]' : 'bg-slate-50'}`}>
              <div className="p-4 space-y-3">
                <h3 className={`text-xs font-extrabold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>🎨 Shape Formulas</h3>
                <p className={`text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                  Click any property to open the calculator-style formula builder.
                </p>
                {shapes.map((shape, idx) => (
                  <div key={shape.id} className={`p-3 rounded-xl border ${isDark ? 'bg-[#121215] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: shape.color }} />
                      <span className={`text-[10px] font-extrabold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{shape.type}</span>
                      <span className={`text-[10px] font-mono ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>{shape.id}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {getShapeFields(shape.type).filter(f => f.type !== 'color').map(({ field, label }) => {
                        const val = (shape as any)[field] || '';
                        return (
                          <button key={field} onClick={() => openShapeFormula(idx, field, label, val)}
                            className={`text-left px-2 py-1.5 rounded-lg border text-[10px] transition-all ${isDark ? 'bg-[#0a0a0c] border-slate-800 hover:border-indigo-500/40' : 'bg-slate-50 border-slate-200 hover:border-indigo-300'}`}>
                            <span className={`block font-bold mb-0.5 ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>{label}</span>
                            <span className={`font-mono text-[10px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{val || '0'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            STEP 4: PREVIEW — Full simulation preview
            ════════════════════════════════════════════════════════ */}
        {step === 4 && (
          <div className="flex-1 p-4">
            <div className="h-full">
              <CustomSimulationRenderer sim={transientSimulation} isDark={isDark} />
            </div>
          </div>
        )}
      </main>

      {/* ═══ ONBOARDING OVERLAY ═══ */}
      {onboardingStep && !onboardingDismissed[onboardingStep] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => dismissOnboarding(onboardingStep)}>
          <div
            className={`w-[480px] max-w-[90vw] rounded-3xl border p-6 space-y-4 ${isDark ? 'bg-[#121215] border-slate-800' : 'bg-white border-slate-200'} shadow-2xl`} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{onboardingContent[onboardingStep].icon}</span>
                <div>
                  <h2 className={`text-lg font-extrabold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {onboardingContent[onboardingStep].title}
                  </h2>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {onboardingContent[onboardingStep].description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => dismissOnboarding(onboardingStep)}
                className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-500 hover:bg-slate-800 hover:text-slate-300' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}>
                <XCircle size={18} />
              </button>
            </div>

            {/* Tips List */}
            <div className="space-y-2">
              {onboardingContent[onboardingStep].tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 ${
                    isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                  }`}>{i + 1}</span>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{tip}</p>
                </div>
              ))}
            </div>

            {/* Step Progress */}
            <div className="flex items-center gap-2 pt-2">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className={`flex-1 h-1.5 rounded-full transition-all ${
                  n === onboardingStep ? 'bg-indigo-500' :
                  n < onboardingStep ? 'bg-emerald-500' :
                  isDark ? 'bg-slate-800' : 'bg-slate-200'
                }`} />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => dismissOnboarding(onboardingStep)}
                className={`text-xs font-bold ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}>
                Skip all tips
              </button>
              <div className="flex items-center gap-2">
                {onboardingStep > 1 && (
                  <button
                    onClick={() => { setOnboardingStep((onboardingStep - 1) as 1 | 2 | 3); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    ← Back
                  </button>
                )}
                {onboardingStep < 4 ? (
                  <button
                    onClick={() => { setOnboardingStep((onboardingStep + 1) as 2 | 3 | 4); }}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500">
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={() => dismissOnboarding(4)}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500">
                    Start Building! 🚀
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ FORMULA BUILDER MODAL ═══ */}
      {(formulaTarget || equationEditIdx !== null) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => { setFormulaTarget(null); setEquationEditIdx(null); }}>
          <div className="w-[420px] max-w-[95vw]" onClick={(e) => e.stopPropagation()}>
            <FormulaBuilder
              value={formulaTarget ? formulaValue : equationFormulaValue}
              onChange={formulaTarget ? setFormulaValue : setEquationFormulaValue}
              availableVariables={availableVarsForFormula}
              preview={(() => {
                try {
                  const expr = formulaTarget ? formulaValue : equationFormulaValue;
                  if (!expr.trim()) return undefined;
                  const vars: Record<string, number> = { t: 1, pi: Math.PI, e: Math.E };
                  variables.forEach(v => { vars[v.name] = v.value; });
                  // For shape formulas, also evaluate existing equations
                  if (formulaTarget) {
                    equations.forEach(eq => { vars[eq.name] = evaluateEquation(eq.expression, vars, 0); });
                  }
                  // For equation editing, evaluate previous equations
                  if (equationEditIdx !== null) {
                    for (let i = 0; i < equationEditIdx; i++) {
                      vars[equations[i].name] = evaluateEquation(equations[i].expression, vars, 0);
                    }
                  }
                  return evaluateEquation(expr, vars, NaN);
                } catch { return undefined; }
              })()}
              onClose={() => { if (formulaTarget) applyShapeFormula(); else applyEquationFormula(); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
