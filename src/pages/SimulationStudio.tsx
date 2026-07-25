import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save, ArrowLeft, Play, Pause, RotateCcw,
  Plus, Trash2, Copy, Eye, Zap, Sliders, Layers, Check, Sparkles, Move,
  ChevronRight, Activity, HelpCircle, FileText, ArrowRight, RefreshCw, BarChart2
} from 'lucide-react';
import { useTheme } from '../store';
import { theme } from '../utils/labTheme';
import { customSimService, SavedSimulation } from '../services/customSimService';
import SimulationDataChart from '../components/widgets/SimulationDataChart';
import type { DataPoint } from '../components/widgets/SimulationDataChart';
import AssessmentPanel from '../components/widgets/AssessmentPanel';
import type { AssessmentQuestion } from '../components/widgets/AssessmentPanel';
import { SIMULATION_PRESETS } from '../data/simulationPresets';

// ═══════════════════════════════════════════════════════════════════
// TYPES & DATA STRUCTURES
// ═══════════════════════════════════════════════════════════════════

export interface SimVariable {
  id: string;
  name: string;
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
}

export interface SimFormula {
  id: string;
  name: string;
  expression: string;
  resultName: string;
  resultUnit: string;
  enabled: boolean;
}

export type CanvasObjectType =
  | 'wave-fourier'
  | 'projectile-path'
  | 'circuit-loop'
  | 'titration-flask'
  | 'pendulum-arm'
  | 'optics-lens'
  | 'gas-piston'
  | 'atom-molecule'
  | 'heart-pump'
  | 'logic-gate'
  | 'ball'
  | 'block'
  | 'resistor'
  | 'text';

export interface StudioObject {
  id: string;
  type: CanvasObjectType;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
  behavior: 'none' | 'x-position' | 'y-position' | 'size' | 'rotation' | 'color' | 'opacity';
  boundFormulaVar: string;
  sensitivity: number;
}

export const SUBJECT_OBJECT_PALETTE: { category: string; icon: string; items: { type: CanvasObjectType; label: string; icon: string; defaultColor: string }[] }[] = [
  {
    category: 'Physics',
    icon: '⚡',
    items: [
      { type: 'projectile-path', label: 'Projectile Arc', icon: '🎯', defaultColor: '#38bdf8' },
      { type: 'wave-fourier', label: 'Fourier Wave', icon: '📊', defaultColor: '#a855f7' },
      { type: 'circuit-loop', label: 'RLC Circuit', icon: '⚡', defaultColor: '#06b6d4' },
      { type: 'pendulum-arm', label: 'Pendulum', icon: '⏱️', defaultColor: '#f59e0b' },
      { type: 'optics-lens', label: 'Optics Lens', icon: '🔍', defaultColor: '#06b6d4' },
      { type: 'ball', label: 'Kinematic Ball', icon: '⚽', defaultColor: '#ef4444' },
      { type: 'block', label: 'Friction Block', icon: '📦', defaultColor: '#6366f1' },
    ]
  },
  {
    category: 'Chemistry',
    icon: '🧪',
    items: [
      { type: 'titration-flask', label: 'Titration Flask', icon: '🧪', defaultColor: '#ec4899' },
      { type: 'gas-piston', label: 'Gas Piston', icon: '💨', defaultColor: '#f59e0b' },
      { type: 'atom-molecule', label: 'Atom Model', icon: '⚛️', defaultColor: '#ef4444' },
    ]
  },
  {
    category: 'Biology',
    icon: '🧫',
    items: [
      { type: 'heart-pump', label: 'Heart Beat', icon: '❤️', defaultColor: '#ef4444' },
      { type: 'ball', label: 'Cell Structure', icon: '🧫', defaultColor: '#22c55e' },
    ]
  },
  {
    category: 'Computer Science',
    icon: '💻',
    items: [
      { type: 'logic-gate', label: 'AND Gate', icon: '🔌', defaultColor: '#a855f7' },
      { type: 'block', label: 'Binary Register', icon: '💻', defaultColor: '#3b82f6' },
    ]
  },
  {
    category: 'Mathematics',
    icon: '📐',
    items: [
      { type: 'wave-fourier', label: 'Function Plot', icon: '📈', defaultColor: '#3b82f6' },
      { type: 'block', label: 'Geometric Polygon', icon: '📐', defaultColor: '#f59e0b' },
    ]
  },
  {
    category: 'English & Languages',
    icon: '📖',
    items: [
      { type: 'text', label: 'Grammar Block', icon: '🏷️', defaultColor: '#a78bfa' },
      { type: 'block', label: 'Word Card', icon: '🃏', defaultColor: '#ec4899' },
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════
// MATH & EXPRESSION EVALUATOR
// ═══════════════════════════════════════════════════════════════════

function evaluateExpression(expr: string, variables: Record<string, number>, defaultVal = 0): number {
  if (!expr || typeof expr !== 'string') return defaultVal;
  try {
    let clean = expr.trim();

    // Exponents ^ -> **
    clean = clean.replace(/\^/g, '**');

    // Physics & Math Constants
    clean = clean.replace(/\bpi\b/gi, String(Math.PI));
    clean = clean.replace(/\be\b/gi, String(Math.E));
    clean = clean.replace(/\bg_const\b/gi, '9.81');
    clean = clean.replace(/\bh_const\b/gi, '6.626e-34');
    clean = clean.replace(/\bc_const\b/gi, '299792458');
    clean = clean.replace(/\bk_coulomb\b/gi, '8.9875e9');
    clean = clean.replace(/\br_gas\b/gi, '8.314');

    // Math & Trig Functions
    clean = clean.replace(/\basin\b/gi, 'Math.asin');
    clean = clean.replace(/\bacos\b/gi, 'Math.acos');
    clean = clean.replace(/\batan2\b/gi, 'Math.atan2');
    clean = clean.replace(/\batan\b/gi, 'Math.atan');
    clean = clean.replace(/\bsinh\b/gi, 'Math.sinh');
    clean = clean.replace(/\bcosh\b/gi, 'Math.cosh');
    clean = clean.replace(/\btanh\b/gi, 'Math.tanh');
    clean = clean.replace(/\bsin\b/gi, 'Math.sin');
    clean = clean.replace(/\bcos\b/gi, 'Math.cos');
    clean = clean.replace(/\btan\b/gi, 'Math.tan');
    clean = clean.replace(/\bsqrt\b/gi, 'Math.sqrt');
    clean = clean.replace(/\bcbrt\b/gi, 'Math.cbrt');
    clean = clean.replace(/\babs\b/gi, 'Math.abs');
    clean = clean.replace(/\bexp\b/gi, 'Math.exp');
    clean = clean.replace(/\blog10\b/gi, 'Math.log10');
    clean = clean.replace(/\blog2\b/gi, 'Math.log2');
    clean = clean.replace(/\blog\b/gi, 'Math.log');
    clean = clean.replace(/\bpow\b/gi, 'Math.pow');
    clean = clean.replace(/\bfloor\b/gi, 'Math.floor');
    clean = clean.replace(/\bceil\b/gi, 'Math.ceil');
    clean = clean.replace(/\bround\b/gi, 'Math.round');
    clean = clean.replace(/\bmin\b/gi, 'Math.min');
    clean = clean.replace(/\bmax\b/gi, 'Math.max');

    const sortedVars = Object.keys(variables).sort((a, b) => b.length - a.length);
    for (const v of sortedVars) {
      const reg = new RegExp(`\\b${v}\\b`, 'gi');
      clean = clean.replace(reg, String(variables[v] ?? 0));
    }

    const sanitized = clean.replace(/Math\.\w+/g, '').replace(/\s+/g, '');
    if (!/^[0-9+\-*/%().,eE]*$/.test(sanitized)) return defaultVal;

    const res = new Function(`return (${clean});`)();
    return typeof res === 'number' && !isNaN(res) ? res : defaultVal;
  } catch {
    return defaultVal;
  }
}

// ═══════════════════════════════════════════════════════════════════
// HIGH-PRECISION STEM CANVAS SVG RENDERER
// ═══════════════════════════════════════════════════════════════════

function renderStudioCanvasObject(
  obj: StudioObject,
  evalVars: Record<string, number>,
  simTime: number
) {
  const time = simTime;
  const boundVal = evalVars[obj.boundFormulaVar] ?? 0;

  let cx = obj.x;
  let cy = obj.y;
  let csize = obj.size;
  let cangle = 0;
  let copacity = 1;

  if (obj.behavior === 'x-position') cx += boundVal * obj.sensitivity * 5;
  if (obj.behavior === 'y-position') cy -= boundVal * obj.sensitivity * 5;
  if (obj.behavior === 'size') csize = Math.max(1, obj.size + boundVal * obj.sensitivity * 0.5);
  if (obj.behavior === 'rotation') cangle = boundVal * obj.sensitivity * 10;

  switch (obj.type as string) {
    case 'wave-fourier': {
      const A1 = evalVars['A1'] ?? 2;
      const f1 = evalVars['f1'] ?? 1;
      const A2 = evalVars['A2'] ?? 1;
      const f2 = evalVars['f2'] ?? 3;

      let pRes = '', pH1 = '', pH2 = '';
      const w = 560, startX = 120, centerY = 240, scale = 22;

      for (let i = 0; i <= 140; i++) {
        const xRel = (i / 140) * 10;
        const xPos = startX + (i / 140) * w;
        const y1 = A1 * Math.sin(2 * Math.PI * (f1 * time - xRel * 0.2));
        const y2 = A2 * Math.sin(2 * Math.PI * (f2 * time - xRel * 0.2));
        const ySum = y1 + y2;

        const cyR = centerY - ySum * scale;
        const cy1 = centerY - y1 * scale;
        const cy2 = centerY - y2 * scale;

        pRes += (i === 0 ? `M ${xPos} ${cyR}` : ` L ${xPos} ${cyR}`);
        pH1 += (i === 0 ? `M ${xPos} ${cy1}` : ` L ${xPos} ${cy1}`);
        pH2 += (i === 0 ? `M ${xPos} ${cy2}` : ` L ${xPos} ${cy2}`);
      }

      return (
        <g key={obj.id}>
          <line x1={startX} y1={centerY} x2={startX + w} y2={centerY} stroke="#475569" strokeWidth={1} strokeDasharray="4 4" />
          <path d={pH1} fill="none" stroke="#3b82f6" strokeWidth={1.5} opacity={0.5} strokeDasharray="3 3" />
          <path d={pH2} fill="none" stroke="#ec4899" strokeWidth={1.5} opacity={0.5} strokeDasharray="3 3" />
          <path d={pRes} fill="none" stroke="#a855f7" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
          <g transform="translate(140, 370)">
            <rect x={0} y={-A1 * 12} width={28} height={A1 * 12} fill="#3b82f6" rx={4} />
            <text x={14} y={16} fill="#94a3b8" fontSize={10} textAnchor="middle" className="font-mono">f1={f1}Hz</text>
            <rect x={45} y={-A2 * 12} width={28} height={A2 * 12} fill="#ec4899" rx={4} />
            <text x={59} y={16} fill="#94a3b8" fontSize={10} textAnchor="middle" className="font-mono">f2={f2}Hz</text>
            <text x={36} y={-65} fill="#a855f7" fontSize={12} className="font-extrabold">Live Fourier Spectrum</text>
          </g>
        </g>
      );
    }

    case 'projectile-path': {
      const v0 = evalVars['v0'] ?? 25;
      const thetaDeg = evalVars['theta'] ?? 45;
      const g = evalVars['g'] ?? 9.81;
      const theta = (thetaDeg * Math.PI) / 180;

      const vx = v0 * Math.cos(theta);
      const vy0 = v0 * Math.sin(theta);
      const totalT = (2 * vy0) / g;
      const maxR = (v0 * v0 * Math.sin(2 * theta)) / g;
      const maxH = (vy0 * vy0) / (2 * g);

      const curT = time % (totalT + 0.8);
      const ballX = 120 + Math.min(1, curT / totalT) * 560;
      const curYVal = vy0 * Math.min(curT, totalT) - 0.5 * g * Math.min(curT, totalT) ** 2;
      const ballY = 380 - (curYVal / Math.max(1, maxH)) * 240;

      let arc = '';
      for (let i = 0; i <= 60; i++) {
        const frac = i / 60;
        const px = 120 + frac * 560;
        const tVal = frac * totalT;
        const yVal = vy0 * tVal - 0.5 * g * tVal ** 2;
        const py = 380 - (yVal / Math.max(1, maxH)) * 240;
        arc += (i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`);
      }

      return (
        <g key={obj.id}>
          <line x1={80} y1={380} x2={720} y2={380} stroke="#64748b" strokeWidth={3} />
          <path d={arc} fill="none" stroke="#38bdf8" strokeWidth={2.5} strokeDasharray="5 4" />
          <circle cx={ballX} cy={ballY} r={10} fill="#ef4444" className="shadow-lg" />
          <text x={400} y={415} fill="#94a3b8" fontSize={11} textAnchor="middle" className="font-mono">
            R = {maxR.toFixed(1)}m | H = {maxH.toFixed(1)}m | Flight t = {totalT.toFixed(1)}s
          </text>
        </g>
      );
    }

    case 'circuit-loop': {
      const V0 = evalVars['V0'] ?? 120;
      const R = evalVars['R'] ?? 50;
      const I0 = evalVars['I0'] ?? (V0 / R);
      const bright = Math.min(1, (I0 ** 2 * R) / 200);

      return (
        <g key={obj.id}>
          <rect x={160} y={120} width={480} height={240} fill="none" stroke="#64748b" strokeWidth={4} rx={18} />
          <g transform="translate(160, 240)">
            <circle cx={0} cy={0} r={24} fill="#1e293b" stroke="#ef4444" strokeWidth={3} />
            <text x={-28} y={42} fill="#ef4444" fontSize={11} className="font-bold">AC ({V0}V)</text>
          </g>
          <g transform="translate(400, 120)">
            <rect x={-40} y={-14} width={80} height={28} fill="#1e293b" stroke="#f59e0b" strokeWidth={3} rx={4} />
            <text x={0} y={4} fill="#f59e0b" fontSize={11} textAnchor="middle" className="font-bold">R = {R}Ω</text>
          </g>
          <g transform="translate(640, 240)">
            <circle cx={0} cy={0} r={26} fill={bright > 0.1 ? `rgba(251, 191, 36, ${0.3 + bright * 0.7})` : '#1e293b'} stroke="#fbbf24" strokeWidth={3} />
            <text x={35} y={5} fill="#fbbf24" fontSize={11} className="font-bold">Current I = {I0.toFixed(2)}A</text>
          </g>
        </g>
      );
    }

    case 'titration-flask': {
      const pH = evalVars['pH'] ?? 7;
      let fluidColor = '#38bdf8';
      if (pH < 4) fluidColor = '#ef4444';
      else if (pH < 6) fluidColor = '#f59e0b';
      else if (pH < 8) fluidColor = '#22c55e';
      else if (pH < 11) fluidColor = '#a855f7';
      else fluidColor = '#3b82f6';

      return (
        <g key={obj.id}>
          <g transform="translate(400, 80)">
            <rect x={-8} y={0} width={16} height={140} fill="#1e293b" stroke="#94a3b8" strokeWidth={2.5} />
            <line x1={0} y1={140} x2={0} y2={170} stroke="#94a3b8" strokeWidth={3.5} />
            <circle cx={0} cy={170 + ((time * 50) % 40)} r={4} fill="#ec4899" />
          </g>
          <g transform="translate(400, 310)">
            <path d="M -18 -60 L 18 -60 L 60 40 C 60 55 -60 55 -60 40 Z" fill={fluidColor} opacity={0.8} stroke="#cbd5e1" strokeWidth={3.5} />
            <text x={0} y={75} fill={fluidColor} fontSize={16} textAnchor="middle" className="font-extrabold">
              Calculated pH = {pH.toFixed(2)}
            </text>
          </g>
        </g>
      );
    }

    case 'spring': {
      const startX = 100;
      const endX = Math.max(startX + 40, cx);
      const coils = 12;
      const step = (endX - startX) / coils;
      let pathD = `M ${startX} ${cy}`;
      for (let i = 1; i <= coils; i++) {
        const px = startX + i * step - step / 2;
        const py = i % 2 === 1 ? cy - 18 : cy + 18;
        pathD += ` L ${px} ${py}`;
      }
      pathD += ` L ${endX} ${cy}`;
      return (
        <path key={obj.id} d={pathD} fill="none" stroke={obj.color || '#8b5cf6'} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      );
    }

    case 'wall': {
      return (
        <g key={obj.id}>
          <rect x={cx - 15} y={cy - 120} width={20} height={240} fill="#334155" stroke="#64748b" strokeWidth={2} />
          {[...Array(8)].map((_, i) => (
            <line key={i} x1={cx - 15} y1={cy - 110 + i * 30} x2={cx - 30} y2={cy - 95 + i * 30} stroke="#64748b" strokeWidth={2} />
          ))}
        </g>
      );
    }

    case 'ground': {
      return (
        <g key={obj.id}>
          <line x1={80} y1={cy} x2={720} y2={cy} stroke="#64748b" strokeWidth={4} />
          {[...Array(20)].map((_, i) => (
            <line key={i} x1={90 + i * 30} y1={cy} x2={75 + i * 30} y2={cy + 15} stroke="#475569" strokeWidth={2} />
          ))}
        </g>
      );
    }

    case 'wave': {
      let waveD = '';
      for (let i = 0; i <= 100; i++) {
        const px = 100 + i * 6;
        const py = cy + Math.sin(i * 0.15 - time * 6) * (csize * 6);
        waveD += i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
      }
      return (
        <path key={obj.id} d={waveD} fill="none" stroke={obj.color || '#06b6d4'} strokeWidth={3.5} strokeLinecap="round" />
      );
    }

    case 'pendulum': {
      const angle = cangle || Math.sin(time * 3) * 0.4;
      const len = 180;
      const bobX = cx + Math.sin(angle) * len;
      const bobY = cy + Math.cos(angle) * len;
      return (
        <g key={obj.id}>
          <circle cx={cx} cy={cy} r={6} fill="#94a3b8" />
          <line x1={cx} y1={cy} x2={bobX} y2={bobY} stroke="#94a3b8" strokeWidth={3} />
          <circle cx={bobX} cy={bobY} r={18} fill={obj.color || '#f59e0b'} stroke="#cbd5e1" strokeWidth={2} />
        </g>
      );
    }

    case 'heart-pump':
    case 'heart-rate': {
      const bpm = evalVars['bpm'] ?? 72;
      const pulse = 1 + 0.18 * Math.sin(2 * Math.PI * (bpm / 60) * time);
      let ecgD = 'M -90 0 L -50 0 L -40 -15 L -30 25 L -15 -45 L 0 50 L 15 -10 L 25 0 L 90 0';

      return (
        <g key={obj.id} transform={`translate(${cx}, ${cy})`}>
          <g transform={`scale(${pulse})`}>
            <path d="M 0 -20 C -25 -50 -60 -10 -30 20 L 0 50 L 30 20 C 60 -10 25 -50 0 -20 Z" fill={obj.color || '#ef4444'} opacity={0.9} stroke="#dc2626" strokeWidth={3} />
          </g>
          {/* ECG Monitor Line */}
          <path d={ecgD} fill="none" stroke="#22c55e" strokeWidth={3} strokeLinecap="round" transform="translate(0, 75)" />
          <text x={0} y={105} fill="#22c55e" fontSize={12} textAnchor="middle" className="font-mono font-extrabold">
            Heart Beat ({bpm} BPM)
          </text>
        </g>
      );
    }

    case 'atom-molecule':
    case 'atom': {
      const eAngle1 = time * 3;
      const eAngle2 = time * 2.5 + 1;
      const eAngle3 = time * 4 + 2;

      return (
        <g key={obj.id} transform={`translate(${cx}, ${cy})`}>
          {/* Orbital Shells */}
          <ellipse rx={csize * 6} ry={csize * 2} fill="none" stroke="#06b6d4" strokeWidth={2} opacity={0.6} />
          <ellipse rx={csize * 6} ry={csize * 2} fill="none" stroke="#a855f7" strokeWidth={2} opacity={0.6} transform="rotate(60)" />
          <ellipse rx={csize * 6} ry={csize * 2} fill="none" stroke="#3b82f6" strokeWidth={2} opacity={0.6} transform="rotate(120)" />

          {/* Nucleus Clustered Protons & Neutrons */}
          <circle cx={-5} cy={-5} r={8} fill="#ef4444" />
          <circle cx={5} cy={-2} r={8} fill="#3b82f6" />
          <circle cx={-2} cy={6} r={8} fill="#ef4444" />
          <circle cx={4} cy={4} r={8} fill="#3b82f6" />

          {/* Revolving Electrons */}
          <circle cx={Math.cos(eAngle1) * csize * 6} cy={Math.sin(eAngle1) * csize * 2} r={5} fill="#38bdf8" />
          <g transform="rotate(60)">
            <circle cx={Math.cos(eAngle2) * csize * 6} cy={Math.sin(eAngle2) * csize * 2} r={5} fill="#c084fc" />
          </g>
          <g transform="rotate(120)">
            <circle cx={Math.cos(eAngle3) * csize * 6} cy={Math.sin(eAngle3) * csize * 2} r={5} fill="#60a5fa" />
          </g>
          <text x={0} y={csize * 6 + 20} fill="#38bdf8" fontSize={11} textAnchor="middle" className="font-bold font-mono">
            Rutherford-Bohr Atom Model
          </text>
        </g>
      );
    }

    case 'optics-lens':
    case 'lens-convex':
    case 'lens-concave': {
      const f = evalVars['f'] ?? 150;
      return (
        <g key={obj.id} transform={`translate(${cx}, ${cy})`}>
          {/* Optical Axis */}
          <line x1={-250} y1={0} x2={250} y2={0} stroke="#64748b" strokeWidth={2} strokeDasharray="6 4" />
          {/* Convex Lens Body */}
          <path d="M 0 -110 C 35 -40 35 40 0 110 C -35 40 -35 -40 0 -110 Z" fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" strokeWidth={3} />
          {/* Focal Points */}
          <circle cx={-f} cy={0} r={4} fill="#f59e0b" />
          <circle cx={f} cy={0} r={4} fill="#f59e0b" />
          <text x={-f} y={20} fill="#f59e0b" fontSize={10} textAnchor="middle" className="font-mono">F1 (-{f}px)</text>
          <text x={f} y={20} fill="#f59e0b" fontSize={10} textAnchor="middle" className="font-mono">F2 (+{f}px)</text>
          {/* Light Rays */}
          <line x1={-250} y1={-50} x2={0} y2={-50} stroke="#ef4444" strokeWidth={2.5} />
          <line x1={0} y1={-50} x2={f} y2={0} stroke="#ef4444" strokeWidth={2.5} />
          <line x1={-250} y1={50} x2={0} y2={50} stroke="#ef4444" strokeWidth={2.5} />
          <line x1={0} y1={50} x2={f} y2={0} stroke="#ef4444" strokeWidth={2.5} />
        </g>
      );
    }

    case 'prism': {
      return (
        <g key={obj.id} transform={`translate(${cx}, ${cy})`}>
          {/* Light Incident Beam */}
          <line x1={-180} y1={20} x2={-40} y2={0} stroke="#ffffff" strokeWidth={4} />
          {/* Triangular Prism Glass */}
          <polygon points="0,-80 -60,60 60,60" fill="rgba(255,255,255,0.15)" stroke="#38bdf8" strokeWidth={3.5} />
          {/* Refracted Spectrum Fan */}
          {['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7'].map((col, idx) => (
            <line key={col} x1={15} y1={10 + idx * 2} x2={160} y2={-40 + idx * 16} stroke={col} strokeWidth={3.5} />
          ))}
          <text x={0} y={90} fill="#38bdf8" fontSize={11} textAnchor="middle" className="font-mono font-bold">
            Dispersive Optical Prism
          </text>
        </g>
      );
    }

    case 'gas-piston': {
      const P = evalVars['P'] ?? (evalVars['n'] ?? 1) * 8.314 * (evalVars['T'] ?? 300) / (evalVars['V'] ?? 10);
      const pistonY = Math.max(-60, Math.min(40, 20 - P * 2));

      return (
        <g key={obj.id} transform={`translate(${cx}, ${cy})`}>
          {/* Cylinder Body */}
          <rect x={-70} y={-80} width={140} height={160} fill="none" stroke="#64748b" strokeWidth={4} rx={8} />
          {/* Piston Head */}
          <rect x={-66} y={pistonY} width={132} height={20} fill="#f59e0b" stroke="#d97706" strokeWidth={2} rx={4} />
          <line x1={0} y1={pistonY} x2={0} y2={-110} stroke="#94a3b8" strokeWidth={6} />
          {/* Bouncing Gas Molecules */}
          {[...Array(14)].map((_, i) => {
            const mx = Math.sin(time * 3 + i * 1.5) * 50;
            const my = pistonY + 30 + Math.cos(time * 4 + i * 2.1) * 35;
            return <circle key={i} cx={mx} cy={my} r={4} fill="#ef4444" />;
          })}
          <text x={0} y={105} fill="#f59e0b" fontSize={12} textAnchor="middle" className="font-mono font-bold">
            Gas Pressure P = {P.toFixed(2)} Pa
          </text>
        </g>
      );
    }

    case 'logic-gate': {
      const inA = (evalVars['A'] ?? 1) > 0 ? 1 : 0;
      const inB = (evalVars['B'] ?? 1) > 0 ? 1 : 0;
      const outVal = (inA && inB) ? 1 : 0;

      return (
        <g key={obj.id} transform={`translate(${cx}, ${cy})`}>
          {/* Inputs */}
          <line x1={-120} y1={-30} x2={-50} y2={-30} stroke={inA ? '#22c55e' : '#64748b'} strokeWidth={4} />
          <line x1={-120} y1={30} x2={-50} y2={30} stroke={inB ? '#22c55e' : '#64748b'} strokeWidth={4} />
          {/* AND Gate Body */}
          <path d="M -50 -50 L 0 -50 A 50 50 0 0 1 0 50 L -50 50 Z" fill="#1e293b" stroke="#a855f7" strokeWidth={3.5} />
          {/* Output */}
          <line x1={50} y1={0} x2={120} y2={0} stroke={outVal ? '#22c55e' : '#64748b'} strokeWidth={4} />
          <circle cx={135} cy={0} r={14} fill={outVal ? '#22c55e' : '#1e293b'} stroke="#22c55e" strokeWidth={3} />
          <text x={-20} y={6} fill="#a855f7" fontSize={16} textAnchor="middle" className="font-black">AND</text>
          <text x={0} y={80} fill="#94a3b8" fontSize={11} textAnchor="middle" className="font-mono font-bold">
            Logic Output Q = {outVal}
          </text>
        </g>
      );
    }

    case 'resistor': {
      return (
        <g key={obj.id} transform={`translate(${cx}, ${cy})`}>
          <line x1={-100} y1={0} x2={-40} y2={0} stroke="#94a3b8" strokeWidth={4} />
          <rect x={-40} y={-16} width={80} height={32} fill="#d97706" stroke="#b45309" strokeWidth={3} rx={6} />
          <line x1={40} y1={0} x2={100} y2={0} stroke="#94a3b8" strokeWidth={4} />
          {/* Color Bands */}
          <rect x={-25} y={-16} width={6} height={32} fill="#ef4444" />
          <rect x={-10} y={-16} width={6} height={32} fill="#a855f7" />
          <rect x={5} y={-16} width={6} height={32} fill="#eab308" />
          <rect x={20} y={-16} width={6} height={32} fill="#d97706" />
          <text x={0} y={35} fill="#f59e0b" fontSize={11} textAnchor="middle" className="font-mono font-bold">
            Resistor R = {evalVars['R'] ?? 100} Ω
          </text>
        </g>
      );
    }

    case 'text': {
      return (
        <g key={obj.id} transform={`translate(${cx}, ${cy})`}>
          <rect x={-100} y={-22} width={200} height={44} fill="#0f172a" stroke="#6366f1" strokeWidth={2.5} rx={12} />
          <text x={0} y={6} fill="#818cf8" fontSize={14} textAnchor="middle" className="font-extrabold font-mono">
            {obj.label || 'Dynamic Text Badge'}
          </text>
        </g>
      );
    }

    case 'ball':
      return <circle key={obj.id} cx={cx} cy={cy} r={csize * 4} fill={obj.color} opacity={copacity} />;
    case 'block':
      return <rect key={obj.id} x={cx - csize * 4} y={cy - csize * 4} width={csize * 8} height={csize * 8} rx={csize} fill={obj.color} opacity={copacity} transform={cangle ? `rotate(${cangle} ${cx} ${cy})` : undefined} />;
    default:
      return <circle key={obj.id} cx={cx} cy={cy} r={csize * 4} fill={obj.color} />;
  }
}

export default function SimulationStudio() {
  const { simId } = useParams<{ simId?: string }>();
  const navigate = useNavigate();
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  // State
  const [activeTab, setActiveTab] = useState<'preset' | 'canvas' | 'variables' | 'preview'>('preset');
  const [simTitle, setSimTitle] = useState('My Custom Simulation');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [mainFormula, setMainFormula] = useState('v0 * sin(theta) * t - 0.5 * g * t^2');
  const [resultVarName, setResultVarName] = useState('y');
  const [resultVarUnit, setResultVarUnit] = useState('m');

  const [variables, setVariables] = useState<SimVariable[]>([
    { id: 'v1', name: 'v0', label: 'Initial Velocity', unit: 'm/s', value: 25, min: 5, max: 100, step: 1, color: '#3b82f6' },
    { id: 'v2', name: 'theta', label: 'Launch Angle', unit: 'deg', value: 45, min: 10, max: 85, step: 1, color: '#ec4899' },
    { id: 'v3', name: 'g', label: 'Gravity', unit: 'm/s²', value: 9.81, min: 1, max: 25, step: 0.1, color: '#f59e0b' }
  ]);

  const [objects, setObjects] = useState<StudioObject[]>([
    { id: 'o1', type: 'projectile-path', label: 'Projectile Arc', x: 400, y: 250, size: 5, color: '#38bdf8', behavior: 'none', boundFormulaVar: 'y', sensitivity: 1 }
  ]);

  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [logData, setLogData] = useState<DataPoint[]>([]);

  // Simulation Playback Loop
  const [isRunning, setIsRunning] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Start Blank Simulation from Scratch
  const handleStartBlank = () => {
    setSelectedPresetId(null);
    setSimTitle('Blank Simulation');
    setMainFormula('v0 * t');
    setResultVarName('x');
    setResultVarUnit('m');
    setVariables([
      { id: 'v-1', name: 'v0', label: 'Speed', unit: 'm/s', value: 10, min: 1, max: 50, step: 1, color: '#3b82f6' }
    ]);
    setObjects([
      { id: 'o-1', type: 'ball', label: 'Object', x: 400, y: 250, size: 5, color: '#38bdf8', behavior: 'x-position', boundFormulaVar: 'x', sensitivity: 1 }
    ]);
    setQuestions([]);
    setActiveTab('canvas');
  };

  // Load Preset
  const applyPreset = (preset: any) => {
    setSelectedPresetId(preset.id);
    setSimTitle(preset.name);
    setMainFormula(preset.formula);
    setResultVarName(preset.resultName);
    setResultVarUnit(preset.resultUnit);
    setVariables(preset.defaultVariables.map((v: any, idx: number) => ({ ...v, id: `v-${idx}` })));
    setObjects(preset.suggestedObjects.map((o: any, idx: number) => ({
      id: `o-${idx}`,
      type: o.type,
      label: o.label,
      x: o.x,
      y: o.y,
      size: o.size,
      color: o.color,
      behavior: o.behavior || 'none',
      boundFormulaVar: preset.resultName,
      sensitivity: o.sensitivity || 1
    })));
    if (preset.questions) setQuestions(preset.questions);
    setActiveTab('canvas');
  };

  // Evaluate Variables
  const evalVars = useMemo(() => {
    const vars: Record<string, number> = { t: simTime, pi: Math.PI, e: Math.E };
    variables.forEach(v => { vars[v.name] = v.value; });
    vars[resultVarName] = evaluateExpression(mainFormula, vars, 0);
    return vars;
  }, [simTime, variables, mainFormula, resultVarName]);

  const primaryResult = evalVars[resultVarName] ?? 0;

  // Animation Loop
  useEffect(() => {
    if (!isRunning) return;
    const loop = (time: number) => {
      if (lastTimeRef.current !== null) {
        const delta = (time - lastTimeRef.current) / 1000;
        setSimTime(prev => prev + Math.min(delta, 0.1) * speed);
      }
      lastTimeRef.current = time;
      animRef.current = requestAnimationFrame(loop);
    };
    lastTimeRef.current = null;
    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isRunning, speed]);

  // Log Data Points
  useEffect(() => {
    if (isRunning) {
      setLogData(prev => [
        ...prev.slice(-150),
        { t: simTime, values: { [resultVarName]: primaryResult, ...Object.fromEntries(variables.map(v => [v.name, v.value])) } }
      ]);
    }
  }, [simTime, isRunning, primaryResult, resultVarName, variables]);

  // Save Simulation to Custom Lab Service
  const handleSaveSimulation = () => {
    const simData: SavedSimulation = {
      id: simId || `sim-${Math.random().toString(36).substring(2, 11)}`,
      name: simTitle || 'Custom STEM Simulation',
      description: `${resultVarName} = ${mainFormula}`,
      category: 'Custom',
      createdAt: Date.now(),
      formula: mainFormula,
      resultName: resultVarName,
      resultUnit: resultVarUnit,
      variables: variables.map(v => ({ name: v.name, label: v.label, value: v.value, min: v.min, max: v.max, step: v.step, unit: v.unit, color: v.color })),
      equations: [{ id: 'eq-1', name: resultVarName, expression: mainFormula, label: resultVarName, unit: resultVarUnit, enabled: true }],
      shapes: objects.map(o => ({ id: o.id, type: o.type, label: o.label, color: o.color, behavior: o.behavior, sensitivity: o.sensitivity, xExpr: String(o.x), yExpr: String(o.y) })),
      questions: questions.map(q => ({ id: q.id, question: q.question, answer: q.answer, tolerance: q.tolerance, hint: q.hint, unit: q.unit })),
      dataLogConfig: { enabled: true, variables: [resultVarName, ...variables.map(v => v.name)], maxPoints: 200, label: simTitle }
    };

    customSimService.saveSimulation(simData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Additional State
  const [selectedSubjectCategory, setSelectedSubjectCategory] = useState('Physics');
  const [complexityMode, setComplexityMode] = useState<'visual' | 'advanced'>('visual');
  const [selectedObjId, setSelectedObjId] = useState<string | null>(null);
  const [isFormulaBuilderOpen, setIsFormulaBuilderOpen] = useState(false);
  const [draggingObjId, setDraggingObjId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // SVG Pointer Dragging Handlers
  const handlePointerDownObject = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedObjId(id);
    setDraggingObjId(id);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMoveCanvas = (e: React.PointerEvent) => {
    if (!draggingObjId || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 500 / rect.height;
    const newX = Math.round(Math.max(20, Math.min(780, (e.clientX - rect.left) * scaleX)));
    const newY = Math.round(Math.max(20, Math.min(480, (e.clientY - rect.top) * scaleY)));

    setObjects(prev => prev.map(o => o.id === draggingObjId ? { ...o, x: newX, y: newY } : o));
  };

  const handlePointerUpCanvas = (e: React.PointerEvent) => {
    if (draggingObjId) {
      setDraggingObjId(null);
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {}
    }
  };

  // Selected Object
  const selectedObject = useMemo(() => {
    return objects.find(o => o.id === selectedObjId) || null;
  }, [objects, selectedObjId]);

  // Add Object from Palette
  const addObjectFromPalette = (item: { type: CanvasObjectType; label: string; icon: string; defaultColor: string }) => {
    const newObj: StudioObject = {
      id: `obj-${Date.now()}`,
      type: item.type,
      label: item.label,
      x: 350 + (objects.length % 5) * 20,
      y: 200 + (objects.length % 5) * 20,
      size: 5,
      color: item.defaultColor,
      behavior: 'none',
      boundFormulaVar: resultVarName,
      sensitivity: 1
    };
    setObjects(prev => [...prev, newObj]);
    setSelectedObjId(newObj.id);
  };

  // Delete Selected Object
  const deleteSelectedObject = () => {
    if (!selectedObjId) return;
    setObjects(prev => prev.filter(o => o.id !== selectedObjId));
    setSelectedObjId(null);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans ${theme.page.bg}`}>
      {/* HEADER NAVBAR */}
      <header className={`px-6 py-3.5 flex items-center justify-between border-b ${theme.nav.border} ${isDark ? 'bg-[#0f0f11]' : 'bg-white'} shadow-sm`}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className={`p-2 rounded-xl border transition-all ${isDark ? 'border-slate-800 hover:bg-[#1a1a1f] text-slate-300' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className={`text-base sm:text-lg font-extrabold flex items-center gap-2 ${theme.text.primary}`}>
              <Zap className="w-5 h-5 text-amber-500" /> Universal STEM Simulation Studio
            </h1>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Class 6 to 12 Multi-Subject Interactive Simulation Builder
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFormulaBuilderOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all shadow-sm"
          >
            <Sliders size={14} className="text-amber-400" /> 📐 Formula Builder
          </button>

          {/* Complexity Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button onClick={() => setComplexityMode('visual')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${complexityMode === 'visual' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>
              Class 6–8 (Visual)
            </button>
            <button onClick={() => setComplexityMode('advanced')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${complexityMode === 'advanced' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
              Class 9–12 (Math)
            </button>
          </div>

          <button onClick={handleSaveSimulation} disabled={savedSuccess} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-all ${savedSuccess ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
            {savedSuccess ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save to Custom Labs</>}
          </button>
        </div>
      </header>

      {/* TABS NAVIGATION */}
      <div className={`flex items-center gap-2 px-6 py-2.5 border-b overflow-x-auto ${isDark ? 'bg-[#0a0a0c] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        {[
          { id: 'preset', label: '0. Presets & Scratch' },
          { id: 'canvas', label: '1. Multi-Subject Canvas & Objects' },
          { id: 'variables', label: '2. Sliders & Formula' },
          { id: 'preview', label: '3. Live Simulation & Quiz' }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === t.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'preset' ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* FEATURED: BLANK SIMULATION CARD */}
            <div className={`p-6 rounded-2xl border-2 border-dashed transition-all hover:border-indigo-500 hover:shadow-xl ${isDark ? 'bg-indigo-950/20 border-indigo-500/40' : 'bg-indigo-50/50 border-indigo-300'}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                    ✨
                  </div>
                  <div>
                    <h2 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Create Blank Simulation from Scratch
                    </h2>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Start with a clean empty canvas. Add custom shapes, physics variables, and equations.
                    </p>
                  </div>
                </div>
                <button onClick={handleStartBlank} className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all whitespace-nowrap">
                  + Create from Scratch
                </button>
              </div>
            </div>

            <h3 className={`text-md font-extrabold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              🎯 Or Start with a Pre-built Interactive Model
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SIMULATION_PRESETS.map(preset => (
                <button key={preset.id} onClick={() => applyPreset(preset)} className={`group text-left p-5 rounded-2xl border transition-all hover:scale-[1.02] hover:shadow-xl ${selectedPresetId === preset.id ? 'border-indigo-500 bg-indigo-500/10' : isDark ? 'bg-[#121215] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{preset.icon}</span>
                    <div>
                      <p className={`text-sm font-extrabold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{preset.name}</p>
                      <p className="text-[10px] uppercase font-bold text-slate-500">{preset.category}</p>
                    </div>
                  </div>
                  <p className="text-xs font-mono text-indigo-400 mb-2">{preset.resultName} = {preset.formula}</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{preset.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* LEFT PALETTE BAR (When tab 1: Canvas is active) */}
          {activeTab === 'canvas' && (
              <div className={`w-72 border-r flex flex-col ${isDark ? 'bg-[#0a0a0c] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="p-3 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
                  {SUBJECT_OBJECT_PALETTE.map(cat => (
                    <button key={cat.category} onClick={() => setSelectedSubjectCategory(cat.category)} className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${selectedSubjectCategory === cat.category ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                      {cat.icon} {cat.category}
                    </button>
                  ))}
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {SUBJECT_OBJECT_PALETTE.find(c => c.category === selectedSubjectCategory)?.items.map(item => (
                    <button key={item.type} onClick={() => addObjectFromPalette(item)} className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all hover:scale-[1.02] ${isDark ? 'bg-[#121215] border-slate-800 hover:border-indigo-500' : 'bg-white border-slate-200 hover:border-indigo-400'}`}>
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <p className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{item.label}</p>
                        <p className="text-[9px] text-slate-500 font-mono">+ Add to Canvas</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CANVAS VIEWPORT */}
            <div className="flex-1 p-4 relative flex flex-col">
              <div className={`flex-1 rounded-2xl border overflow-hidden relative ${isDark ? 'bg-[#0c0c0e] border-slate-800' : 'bg-white border-slate-200'}`}>
                {/* HUD Overlay */}
                <div className="absolute top-4 left-4 px-4 py-2 rounded-xl bg-black/80 border border-slate-800 text-emerald-400 font-mono text-sm font-bold z-20 shadow-xl">
                  {resultVarName} = {primaryResult.toFixed(2)} {resultVarUnit} | t = {simTime.toFixed(2)}s
                </div>

                {/* Drag instruction notice */}
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-bold z-20 shadow-lg flex items-center gap-1.5">
                  <Move size={13} className="text-amber-400" /> Click & Drag Objects to Move
                </div>

                <svg
                  ref={svgRef}
                  viewBox="0 0 800 500"
                  className="w-full h-full relative z-10 cursor-crosshair select-none"
                  onClick={() => setSelectedObjId(null)}
                  onPointerMove={handlePointerMoveCanvas}
                  onPointerUp={handlePointerUpCanvas}
                  onPointerLeave={handlePointerUpCanvas}
                >
                  {objects.map(obj => (
                    <g
                      key={obj.id}
                      className="cursor-grab active:cursor-grabbing hover:opacity-90 transition-opacity"
                      onPointerDown={(e) => handlePointerDownObject(obj.id, e)}
                      onClick={(e) => { e.stopPropagation(); setSelectedObjId(obj.id); }}
                    >
                      {renderStudioCanvasObject(obj, evalVars, simTime)}
                      {selectedObjId === obj.id && (
                        <g>
                          <rect
                            x={obj.x - Math.max(28, obj.size * 6)}
                            y={obj.y - Math.max(28, obj.size * 6)}
                            width={Math.max(56, obj.size * 12)}
                            height={Math.max(56, obj.size * 12)}
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            rx="8"
                          />
                          <text
                            x={obj.x}
                            y={obj.y - Math.max(34, obj.size * 6)}
                            fill="#38bdf8"
                            fontSize="10"
                            fontWeight="bold"
                            textAnchor="middle"
                            className="font-mono bg-black"
                          >
                            X:{obj.x}, Y:{obj.y}
                          </text>
                        </g>
                      )}
                    </g>
                  ))}
                </svg>
              </div>

              {/* TIMELINE CONTROLS */}
              <div className={`mt-4 p-4 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-[#0f0f11] border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsRunning(!isRunning)} className={`px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-md ${isRunning ? 'bg-rose-500' : 'bg-indigo-600'}`}>
                    {isRunning ? 'Pause' : 'Run Simulation'}
                  </button>
                  <button onClick={() => setSimTime(0)} className={`p-2.5 rounded-xl border ${isDark ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-700'}`}>
                    <RotateCcw size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Speed:</span>
                  <select value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} className="px-2 py-1 rounded-lg border text-xs font-bold bg-slate-900 text-white">
                    <option value="0.5">0.5x</option>
                    <option value="1">1.0x</option>
                    <option value="2">2.0x</option>
                  </select>
                </div>
              </div>

              {/* LIVE DATA CHART (When in Preview Tab) */}
              {activeTab === 'preview' && logData.length > 2 && (
                <div className="mt-4">
                  <SimulationDataChart
                    data={logData}
                    variables={[resultVarName, ...variables.map(v => v.name)]}
                    title={`${resultVarName} vs Time`}
                    onClear={() => setLogData([])}
                  />
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR EDIT PANEL */}
            <div className={`w-96 border-l overflow-y-auto p-5 space-y-5 ${isDark ? 'bg-[#0f0f11] border-slate-800' : 'bg-white border-slate-200'}`}>
              {/* OBJECT INSPECTOR (If object selected) */}
              {selectedObject ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className={`text-sm font-extrabold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      ✏️ Edit Object: {selectedObject.label}
                    </h3>
                    <button onClick={deleteSelectedObject} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* POSITION X & Y SLIDERS */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <label className="text-[11px] font-extrabold uppercase text-indigo-400 flex items-center gap-1.5">
                      <Move size={13} /> Object Position & Placement
                    </label>

                    {/* X Position */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 mb-1">
                        <span>X Coordinate</span>
                        <span className="text-amber-400">{selectedObject.x} px</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={800}
                        value={selectedObject.x}
                        onChange={e => {
                          const val = parseInt(e.target.value) || 0;
                          setObjects(prev => prev.map(o => o.id === selectedObject.id ? { ...o, x: val } : o));
                        }}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>

                    {/* Y Position */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 mb-1">
                        <span>Y Coordinate</span>
                        <span className="text-amber-400">{selectedObject.y} px</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={500}
                        value={selectedObject.y}
                        onChange={e => {
                          const val = parseInt(e.target.value) || 0;
                          setObjects(prev => prev.map(o => o.id === selectedObject.id ? { ...o, y: val } : o));
                        }}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>

                    {/* Quick Align Buttons */}
                    <div className="flex items-center justify-between gap-1.5 pt-1">
                      <button
                        onClick={() => setObjects(prev => prev.map(o => o.id === selectedObject.id ? { ...o, x: 400, y: 250 } : o))}
                        className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 transition-all"
                      >
                        Center
                      </button>
                      <button
                        onClick={() => setObjects(prev => prev.map(o => o.id === selectedObject.id ? { ...o, y: 400 } : o))}
                        className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 transition-all"
                      >
                        Ground
                      </button>
                      <button
                        onClick={() => setObjects(prev => prev.map(o => o.id === selectedObject.id ? { ...o, x: 100 } : o))}
                        className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 transition-all"
                      >
                        Left Wall
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Display Label</label>
                    <input type="text" value={selectedObject.label} onChange={e => {
                      const val = e.target.value;
                      setObjects(prev => prev.map(o => o.id === selectedObject.id ? { ...o, label: val } : o));
                    }} className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-900 text-white border-slate-800" />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Color</label>
                    <input type="color" value={selectedObject.color} onChange={e => {
                      const val = e.target.value;
                      setObjects(prev => prev.map(o => o.id === selectedObject.id ? { ...o, color: val } : o));
                    }} className="w-full h-8 rounded-lg cursor-pointer bg-transparent border-0" />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Behavior Binding</label>
                    <select value={selectedObject.behavior} onChange={e => {
                      const val = e.target.value as any;
                      setObjects(prev => prev.map(o => o.id === selectedObject.id ? { ...o, behavior: val } : o));
                    }} className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-900 text-white border-slate-800">
                      <option value="none">Static (No Motion)</option>
                      <option value="x-position">Horizontal Position</option>
                      <option value="y-position">Vertical Position</option>
                      <option value="size">Size Pulse</option>
                      <option value="rotation">Rotation Angle</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* FORMULA EDITOR CARD */}
                  <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-[#121215] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`text-xs font-extrabold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <Sliders size={14} className="text-indigo-400" /> Math Formula & Output
                      </h3>
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        {resultVarName} = {primaryResult.toFixed(2)} {resultVarUnit}
                      </span>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400">Main Equation</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={mainFormula}
                          onClick={() => setIsFormulaBuilderOpen(true)}
                          onChange={e => setMainFormula(e.target.value)}
                          placeholder="Click to open Formula Builder..."
                          className="w-full px-3 py-2 rounded-xl border text-xs font-mono bg-slate-900 text-indigo-300 border-indigo-500/40 hover:border-indigo-400 focus:outline-none focus:border-indigo-500 cursor-pointer transition-all shadow-inner"
                        />
                        <button
                          type="button"
                          onClick={() => setIsFormulaBuilderOpen(true)}
                          className="absolute right-2 top-1.5 p-1 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all text-[10px] font-bold flex items-center gap-1"
                        >
                          <Sparkles size={11} className="text-amber-400" /> Edit
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsFormulaBuilderOpen(true)}
                        className="w-full mt-2 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-[11px] font-bold border border-indigo-500/30 flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        <Sliders size={12} className="text-amber-400" /> Open Visual Formula Builder
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400">Output Variable</label>
                        <input
                          type="text"
                          value={resultVarName}
                          onChange={e => setResultVarName(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono bg-slate-900 text-white border-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400">Unit</label>
                        <input
                          type="text"
                          value={resultVarUnit}
                          onChange={e => setResultVarUnit(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono bg-slate-900 text-white border-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SLIDER PARAMETERS HEADER & ADD BUTTON */}
                  <div className="flex items-center justify-between pt-2">
                    <h3 className={`text-xs font-extrabold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      🎛️ Parameters & Sliders
                    </h3>
                    <button
                      onClick={() => {
                        const newName = `v${variables.length + 1}`;
                        setVariables(prev => [
                          ...prev,
                          {
                            id: `v-${Date.now()}`,
                            name: newName,
                            label: `Parameter ${newName}`,
                            unit: 'val',
                            value: 10,
                            min: 1,
                            max: 100,
                            step: 1,
                            color: '#3b82f6'
                          }
                        ]);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all"
                    >
                      <Plus size={12} /> Add Variable
                    </button>
                  </div>

                  {/* SLIDERS LIST */}
                  <div className="space-y-3">
                    {variables.map((v, i) => (
                      <div key={v.id} className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#121215] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <input
                            type="text"
                            value={v.label}
                            onChange={e => {
                              const val = e.target.value;
                              setVariables(prev => prev.map((item, idx) => idx === i ? { ...item, label: val } : item));
                            }}
                            className={`text-xs font-bold bg-transparent border-0 focus:outline-none ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}
                          />
                          <span className="font-mono text-xs font-bold text-white">{v.value.toFixed(1)} {v.unit}</span>
                        </div>
                        <input
                          type="range"
                          min={v.min}
                          max={v.max}
                          step={v.step}
                          value={v.value}
                          onChange={e => {
                            const val = parseFloat(e.target.value);
                            setVariables(prev => prev.map((item, idx) => idx === i ? { ...item, value: val } : item));
                          }}
                          className="w-full accent-indigo-500"
                        />
                        <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono mt-1">
                          <span>min: {v.min}</span>
                          <span>var: {v.name}</span>
                          <span>max: {v.max}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* FORMULA BUILDER MODAL OVERLAY */}
      {isFormulaBuilderOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl rounded-3xl border border-indigo-500/30 shadow-2xl overflow-hidden flex flex-col bg-[#080c16] text-white">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-indigo-500/40 flex items-center justify-between bg-[#070b14]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white flex items-center justify-center font-extrabold shadow-lg shadow-indigo-500/40">
                  <Sliders size={20} />
                </div>
                <div>
                  <h2 className="text-base font-black text-[#f1f5f9] tracking-wide flex items-center gap-2">
                    Professional STEM Math & Physics Formula Studio
                  </h2>
                  <p className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest">
                    Build complex differential, harmonic, thermodynamic & kinematic equations
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormulaBuilderOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center font-black text-sm shadow-md"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
              {/* Formula Templates Quick Select */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between gap-3 shadow-inner">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 whitespace-nowrap">
                  <Sparkles size={14} className="text-amber-400" /> Presets:
                </span>
                <select
                  onChange={e => {
                    if (e.target.value) setMainFormula(e.target.value);
                  }}
                  className="w-full max-w-lg px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#0c1220] text-indigo-200 border border-indigo-500/40 focus:outline-none focus:border-indigo-400"
                >
                  <option value="">-- Select Pre-built Math / Physics Model --</option>
                  <option value="A * cos(sqrt(k / m) * t)">Harmonic Motion: x(t) = A·cos(√(k/m)·t)</option>
                  <option value="v0 * sin(theta) * t - 0.5 * g_const * t^2">Projectile Motion: y(t) = v₀·sin(θ)·t - ½g·t²</option>
                  <option value="V0 * (1 - exp(-t / (R * C)))">RC Circuit Voltage: V_C(t) = V₀·(1 - e⁻ᵗ/ᴿᶜ)</option>
                  <option value="A1 * sin(2 * pi * f1 * t) + A2 * sin(2 * pi * f2 * t)">Harmonic Superposition: y = A₁·sin(2πf₁t) + A₂·sin(2πf₂t)</option>
                  <option value="k_coulomb * q1 * q2 / (r * r)">Coulomb Law: F_e = k·q₁·q₂/r²</option>
                  <option value="n * r_gas * T / V">Ideal Gas Pressure: P = nRT/V</option>
                  <option value="sqrt(3 * r_gas * T / M)">RMS Molecular Velocity: v_rms = √(3RT/M)</option>
                </select>
              </div>

              {/* Main Formula Textarea */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders size={14} /> Active Math Expression
                  </label>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    Live Evaluation Mode
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    rows={3}
                    value={mainFormula}
                    onChange={e => setMainFormula(e.target.value)}
                    placeholder="Type expression e.g. A * sin(omega * t)"
                    className="w-full p-4 rounded-2xl border text-sm font-mono bg-[#050811] text-indigo-200 border-indigo-500/50 focus:outline-none focus:border-indigo-400 shadow-2xl leading-relaxed"
                  />
                  <div className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-xl bg-emerald-950/95 border border-emerald-500/60 text-emerald-300 text-xs font-mono font-extrabold shadow-lg flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {resultVarName} = {primaryResult.toFixed(2)} {resultVarUnit}
                  </div>
                </div>
              </div>

              {/* KEYPADS SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Trigonometry & Transcendental */}
                <div className="p-4 rounded-2xl bg-[#0d1322] border border-slate-800/80 space-y-2">
                  <label className="text-[11px] font-extrabold text-purple-400 uppercase tracking-wider block">
                    📐 Trigonometry & Inverse
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['sin(', 'cos(', 'tan(', 'asin(', 'acos(', 'atan(', 'sinh(', 'cosh(', 'tanh('].map(fn => (
                      <button
                        key={fn}
                        onClick={() => setMainFormula(prev => prev + fn)}
                        className="px-2 py-1.5 rounded-xl border text-xs font-mono font-bold bg-purple-950/40 text-purple-300 border-purple-800/80 hover:border-purple-400 hover:bg-purple-600/30 transition-all text-center shadow-sm"
                      >
                        {fn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Powers, Roots & Calculus */}
                <div className="p-4 rounded-2xl bg-[#0d1322] border border-slate-800/80 space-y-2">
                  <label className="text-[11px] font-extrabold text-cyan-400 uppercase tracking-wider block">
                    ⚡ Powers, Roots & Logs
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['sqrt(', 'cbrt(', 'exp(', 'log(', 'log10(', 'abs(', 'min(', 'max(', 'floor('].map(fn => (
                      <button
                        key={fn}
                        onClick={() => setMainFormula(prev => prev + fn)}
                        className="px-2 py-1.5 rounded-xl border text-xs font-mono font-bold bg-cyan-950/40 text-cyan-300 border-cyan-800/80 hover:border-cyan-400 hover:bg-cyan-600/30 transition-all text-center shadow-sm"
                      >
                        {fn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Physics & Universal Constants */}
                <div className="p-4 rounded-2xl bg-[#0d1322] border border-slate-800/80 space-y-2">
                  <label className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                    ⚛️ Physics & Math Constants
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: 'π (Pi)', val: 'pi' },
                      { label: 'e (Euler)', val: 'e' },
                      { label: 'g (9.81 m/s²)', val: 'g_const' },
                      { label: 'c (3×10⁸ m/s)', val: 'c_const' },
                      { label: 'h (Planck)', val: 'h_const' },
                      { label: 'k_e (Coulomb)', val: 'k_coulomb' },
                      { label: 'R (8.314 Gas)', val: 'r_gas' }
                    ].map(c => (
                      <button
                        key={c.val}
                        onClick={() => setMainFormula(prev => prev + c.val)}
                        className="px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-bold bg-emerald-950/40 text-emerald-300 border-emerald-800/80 hover:border-emerald-400 hover:bg-emerald-600/30 transition-all text-left truncate shadow-sm"
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Time t & Simulation Variables Section */}
              <div className="p-4 rounded-2xl bg-[#0d1322] border border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider block">
                    🎛️ Simulation Parameters & Time (t)
                  </label>
                  <button
                    onClick={() => {
                      const newName = `v${variables.length + 1}`;
                      setVariables(prev => [
                        ...prev,
                        {
                          id: `v-${Date.now()}`,
                          name: newName,
                          label: `Parameter ${newName}`,
                          unit: 'val',
                          value: 10,
                          min: 1,
                          max: 100,
                          step: 1,
                          color: '#3b82f6'
                        }
                      ]);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold border border-amber-500/40 transition-all flex items-center gap-1"
                  >
                    + Add New Parameter Slider
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setMainFormula(prev => prev + 't')}
                    className="px-4 py-2 rounded-xl border text-xs font-mono font-extrabold bg-amber-500/25 text-amber-300 border-amber-500/50 hover:bg-amber-500/40 transition-all shadow-sm"
                  >
                    t (Time Variable)
                  </button>
                  {variables.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setMainFormula(prev => prev + v.name)}
                      className="px-3.5 py-2 rounded-xl border text-xs font-mono font-bold bg-indigo-950/60 text-indigo-300 border-indigo-700/80 hover:border-indigo-400 transition-all shadow-sm"
                    >
                      {v.name} = {v.value} {v.unit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Operators Row */}
              <div className="p-4 rounded-2xl bg-[#0d1322] border border-slate-800/80 space-y-2">
                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  ➕ Operators & Brackets
                </label>
                <div className="flex flex-wrap gap-2">
                  {[' + ', ' - ', ' * ', ' / ', ' ^ ', ' ( ', ' ) ', ' , '].map(op => (
                    <button
                      key={op}
                      onClick={() => setMainFormula(prev => prev + op)}
                      className="w-11 h-11 rounded-xl border text-sm font-mono font-bold bg-[#141b2d] text-white border-slate-700 hover:border-indigo-500 hover:bg-indigo-600/30 transition-all flex items-center justify-center shadow-sm"
                    >
                      {op.trim()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Output Symbol & Unit Setup */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800/80">
                <div>
                  <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 block">
                    Output Variable Symbol
                  </label>
                  <input
                    type="text"
                    value={resultVarName}
                    onChange={e => setResultVarName(e.target.value)}
                    placeholder="e.g. x, y, F, P, v"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono bg-[#070b14] text-white border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 block">
                    Measurement Unit
                  </label>
                  <input
                    type="text"
                    value={resultVarUnit}
                    onChange={e => setResultVarUnit(e.target.value)}
                    placeholder="e.g. m, N, Pa, m/s, J"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono bg-[#070b14] text-white border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-800/80 bg-[#070b14] flex items-center justify-end gap-3">
              <button
                onClick={() => setIsFormulaBuilderOpen(false)}
                className="px-5 py-2.5 rounded-xl border text-xs font-bold text-slate-300 border-slate-700 hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsFormulaBuilderOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white text-xs font-extrabold shadow-lg transition-all"
              >
                Apply Equation to Simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
