import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save, ArrowLeft, Play, Pause, RotateCcw,
  ChevronRight, ChevronLeft, Check, Trash2, Copy,
  MoveHorizontal, MoveVertical, Maximize, RotateCw, Palette, Eye,
  Zap, Download, Upload, Edit3,
  ArrowUp, ArrowDown, Minus as MinusIcon,
} from 'lucide-react';
import { useTheme } from '../store';
import { theme } from '../utils/labTheme';
import { customSimService, SavedSimulation } from '../services/customSimService';
import FormulaBuilder from '../components/FormulaBuilder';
import SimulationDataChart from '../components/SimulationDataChart';
import type { DataPoint } from '../components/SimulationDataChart';
import AssessmentPanel from '../components/AssessmentPanel';
import type { AssessmentQuestion } from '../components/AssessmentPanel';
import { SIMULATION_PRESETS } from '../data/simulationPresets';
import type { SimulationPreset } from '../data/simulationPresets';

// ═══════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════

interface Variable {
  name: string;
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
}

type BehaviorType = 'x-position' | 'y-position' | 'size' | 'rotation' | 'color' | 'opacity' | 'none'
  | 'gravity' | 'friction' | 'collision' | 'spring';

interface SceneObject {
  id: string;
  type: 'ball' | 'block' | 'arrow-right' | 'arrow-up' | 'spring' | 'pendulum' | 'circle' | 'rectangle' | 'text' | 'ground' | 'star' | 'diamond' | 'triangle' | 'wave' | 'battery' | 'resistor' | 'weight' | 'heart' | 'cloud' | 'flag' | 'wheel' | 'arrow-down' | 'arrow-left' | 'plus' | 'cross' | 'arc' | 'platform' | 'wall' | 'lens' | 'mirror'
    | 'beaker' | 'flask' | 'atom' | 'test-tube' | 'molecule'
    | 'cell' | 'leaf' | 'flower' | 'dna' | 'tree' | 'bacteria'
    | 'grid' | 'ruler' | 'protractor' | 'compass' | 'graph'
    | 'mountain' | 'sun' | 'moon' | 'globe' | 'compass-rose';
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
  behavior: BehaviorType;
  sensitivity: number;
  // Physics properties
  mass?: number;
  restitution?: number;   // bounciness (0 = no bounce, 1 = perfect bounce)
  friction?: number;       // friction coefficient (0 = frictionless, 1 = high friction)
  anchorX?: number;        // spring anchor point X
  anchorY?: number;        // spring anchor point Y
  springK?: number;        // spring constant (stiffness)
  damping?: number;        // spring damping coefficient
}

interface PhysicsLaw {
  id: string;
  name: string;
  formula: string;
  resultName: string;
  resultUnit: string;
  description: string;
  category: string;
  icon: string;
  defaultVariables: Variable[];
  suggestedObjects: Partial<SceneObject>[];
}

// ═══════════════════════════════════════════════════════════════════
// PRESET PHYSICS LAWS — One Formula Drives Everything
// ═══════════════════════════════════════════════════════════════════

const PHYSICS_LAWS: PhysicsLaw[] = [
  {
    id: 'newton-2nd', name: "Newton's 2nd Law", formula: 'm * a', resultName: 'F', resultUnit: 'N',
    description: 'Force = Mass × Acceleration', category: 'Mechanics', icon: '🍎',
    defaultVariables: [
      { name: 'm', label: 'Mass', unit: 'kg', value: 5, min: 0.5, max: 20, step: 0.5, color: '#3b82f6' },
      { name: 'a', label: 'Acceleration', unit: 'm/s²', value: 3, min: 0, max: 15, step: 0.5, color: '#f59e0b' },
    ],
    suggestedObjects: [
      { type: 'block', label: 'Object', x: 150, y: 250, size: 5, color: '#3b82f6', behavior: 'x-position', sensitivity: 15 },
      { type: 'arrow-right', label: 'Force Arrow', x: 300, y: 250, size: 4, color: '#ef4444', behavior: 'x-position', sensitivity: 15 },
      { type: 'text', label: 'F = m × a', x: 400, y: 50, size: 3, color: '#a78bfa', behavior: 'none', sensitivity: 1 },
    ],
  },
  {
    id: 'ohm-law', name: "Ohm's Law", formula: 'I * R', resultName: 'V', resultUnit: 'V',
    description: 'Voltage = Current × Resistance', category: 'Electricity', icon: '⚡',
    defaultVariables: [
      { name: 'I', label: 'Current', unit: 'A', value: 3, min: 0, max: 10, step: 0.5, color: '#06b6d4' },
      { name: 'R', label: 'Resistance', unit: 'Ω', value: 4, min: 1, max: 20, step: 0.5, color: '#f97316' },
    ],
    suggestedObjects: [
      { type: 'circle', label: 'Light Bulb', x: 400, y: 200, size: 6, color: '#fbbf24', behavior: 'size', sensitivity: 2 },
      { type: 'arrow-right', label: 'Current Flow', x: 200, y: 200, size: 3, color: '#06b6d4', behavior: 'x-position', sensitivity: 10 },
      { type: 'text', label: 'V = I × R', x: 400, y: 50, size: 3, color: '#a78bfa', behavior: 'none', sensitivity: 1 },
    ],
  },
  {
    id: 'ke-formula', name: 'Kinetic Energy', formula: '0.5 * m * v * v', resultName: 'KE', resultUnit: 'J',
    description: 'KE = ½mv²', category: 'Energy', icon: '🏃',
    defaultVariables: [
      { name: 'm', label: 'Mass', unit: 'kg', value: 3, min: 0.5, max: 15, step: 0.5, color: '#3b82f6' },
      { name: 'v', label: 'Velocity', unit: 'm/s', value: 4, min: 0, max: 10, step: 0.5, color: '#22c55e' },
    ],
    suggestedObjects: [
      { type: 'ball', label: 'Moving Ball', x: 150, y: 250, size: 5, color: '#22c55e', behavior: 'x-position', sensitivity: 10 },
      { type: 'arrow-right', label: 'Velocity', x: 250, y: 300, size: 3, color: '#f59e0b', behavior: 'x-position', sensitivity: 10 },
      { type: 'text', label: 'KE = ½mv²', x: 400, y: 50, size: 3, color: '#a78bfa', behavior: 'none', sensitivity: 1 },
    ],
  },
  {
    id: 'gravity', name: 'Gravitational Force', formula: 'G * m1 * m2 / (r * r)', resultName: 'Fg', resultUnit: 'N',
    description: 'Universal Gravitation', category: 'Mechanics', icon: '🌍',
    defaultVariables: [
      { name: 'G', label: 'Grav. Constant', unit: '', value: 6.67, min: 1, max: 10, step: 0.1, color: '#64748b' },
      { name: 'm1', label: 'Mass 1', unit: 'kg', value: 5, min: 0.5, max: 20, step: 0.5, color: '#3b82f6' },
      { name: 'm2', label: 'Mass 2', unit: 'kg', value: 3, min: 0.5, max: 20, step: 0.5, color: '#f59e0b' },
      { name: 'r', label: 'Distance', unit: 'm', value: 5, min: 1, max: 15, step: 0.5, color: '#22c55e' },
    ],
    suggestedObjects: [
      { type: 'ball', label: 'Planet 1', x: 250, y: 200, size: 7, color: '#3b82f6', behavior: 'none', sensitivity: 1 },
      { type: 'ball', label: 'Planet 2', x: 500, y: 200, size: 5, color: '#f59e0b', behavior: 'none', sensitivity: 1 },
      { type: 'spring', label: 'Gravity Link', x: 375, y: 200, size: 3, color: '#a78bfa', behavior: 'size', sensitivity: 3 },
      { type: 'text', label: 'F = Gm₁m₂/r²', x: 400, y: 50, size: 3, color: '#a78bfa', behavior: 'none', sensitivity: 1 },
    ],
  },
  {
    id: 'density', name: 'Density', formula: 'm / V', resultName: 'ρ', resultUnit: 'kg/m³',
    description: 'Density = Mass ÷ Volume', category: 'Properties', icon: '🧪',
    defaultVariables: [
      { name: 'm', label: 'Mass', unit: 'kg', value: 8, min: 0.5, max: 20, step: 0.5, color: '#3b82f6' },
      { name: 'V', label: 'Volume', unit: 'm³', value: 4, min: 0.5, max: 15, step: 0.5, color: '#06b6d4' },
    ],
    suggestedObjects: [
      { type: 'block', label: 'Material', x: 400, y: 200, size: 5, color: '#06b6d4', behavior: 'color', sensitivity: 2 },
      { type: 'text', label: 'ρ = m / V', x: 400, y: 50, size: 3, color: '#a78bfa', behavior: 'none', sensitivity: 1 },
    ],
  },
  {
    id: 'work', name: 'Work Done', formula: 'F * d * cos(theta * pi / 180)', resultName: 'W', resultUnit: 'J',
    description: 'Work = Force × Distance × cos(θ)', category: 'Energy', icon: '💪',
    defaultVariables: [
      { name: 'F', label: 'Force', unit: 'N', value: 10, min: 0, max: 30, step: 1, color: '#ef4444' },
      { name: 'd', label: 'Distance', unit: 'm', value: 5, min: 0, max: 15, step: 0.5, color: '#22c55e' },
      { name: 'theta', label: 'Angle', unit: '°', value: 30, min: 0, max: 90, step: 5, color: '#f59e0b' },
    ],
    suggestedObjects: [
      { type: 'block', label: 'Object', x: 150, y: 250, size: 5, color: '#3b82f6', behavior: 'x-position', sensitivity: 10 },
      { type: 'arrow-right', label: 'Force', x: 250, y: 250, size: 4, color: '#ef4444', behavior: 'x-position', sensitivity: 10 },
      { type: 'text', label: 'W = Fd·cosθ', x: 400, y: 50, size: 3, color: '#a78bfa', behavior: 'none', sensitivity: 1 },
    ],
  },
  {
    id: 'hooks-law', name: "Hooke's Law", formula: 'k * x', resultName: 'Fs', resultUnit: 'N',
    description: 'Spring Force = kx (restoring force)', category: 'Mechanics', icon: '🔩',
    defaultVariables: [
      { name: 'k', label: 'Spring Constant', unit: 'N/m', value: 10, min: 1, max: 50, step: 1, color: '#8b5cf6' },
      { name: 'x', label: 'Displacement', unit: 'm', value: 3, min: 0, max: 10, step: 0.5, color: '#06b6d4' },
    ],
    suggestedObjects: [
      { type: 'spring', label: 'Spring', x: 200, y: 250, size: 4, color: '#8b5cf6', behavior: 'size', sensitivity: 3 },
      { type: 'block', label: 'Block', x: 400, y: 250, size: 5, color: '#06b6d4', behavior: 'x-position', sensitivity: 10 },
      { type: 'text', label: 'Fs = kx', x: 400, y: 50, size: 3, color: '#a78bfa', behavior: 'none', sensitivity: 1 },
    ],
  },
  {
    id: 'coulomb-law', name: "Coulomb's Law", formula: 'k * q1 * q2 / (r * r)', resultName: 'Fe', resultUnit: 'N',
    description: 'Electrostatic Force between charges', category: 'Electricity', icon: '⚡',
    defaultVariables: [
      { name: 'k', label: 'Coulomb Constant', unit: '', value: 9, min: 1, max: 20, step: 0.5, color: '#64748b' },
      { name: 'q1', label: 'Charge 1', unit: 'C', value: 3, min: 0.5, max: 15, step: 0.5, color: '#ef4444' },
      { name: 'q2', label: 'Charge 2', unit: 'C', value: 2, min: 0.5, max: 15, step: 0.5, color: '#3b82f6' },
      { name: 'r', label: 'Distance', unit: 'm', value: 4, min: 1, max: 15, step: 0.5, color: '#22c55e' },
    ],
    suggestedObjects: [
      { type: 'circle', label: 'Charge +', x: 250, y: 200, size: 5, color: '#ef4444', behavior: 'none', sensitivity: 1 },
      { type: 'circle', label: 'Charge −', x: 500, y: 200, size: 5, color: '#3b82f6', behavior: 'none', sensitivity: 1 },
      { type: 'spring', label: 'Force Link', x: 375, y: 200, size: 3, color: '#f59e0b', behavior: 'size', sensitivity: 3 },
      { type: 'text', label: 'Fe = kq₁q₂/r²', x: 400, y: 50, size: 3, color: '#a78bfa', behavior: 'none', sensitivity: 1 },
    ],
  },
  {
    id: 'ideal-gas', name: 'Ideal Gas Law', formula: 'n * R * T / V', resultName: 'P', resultUnit: 'Pa',
    description: 'PV = nRT → Pressure from gas parameters', category: 'Thermodynamics', icon: '🌡️',
    defaultVariables: [
      { name: 'n', label: 'Moles', unit: 'mol', value: 2, min: 0.5, max: 10, step: 0.5, color: '#22c55e' },
      { name: 'R', label: 'Gas Constant', unit: 'J/mol·K', value: 8.314, min: 1, max: 10, step: 0.1, color: '#64748b' },
      { name: 'T', label: 'Temperature', unit: 'K', value: 300, min: 100, max: 600, step: 10, color: '#ef4444' },
      { name: 'V', label: 'Volume', unit: 'm³', value: 2, min: 0.5, max: 10, step: 0.5, color: '#06b6d4' },
    ],
    suggestedObjects: [
      { type: 'circle', label: 'Gas Container', x: 400, y: 250, size: 6, color: '#06b6d4', behavior: 'size', sensitivity: 2 },
      { type: 'wave', label: 'Heat Wave', x: 400, y: 350, size: 3, color: '#ef4444', behavior: 'color', sensitivity: 2 },
      { type: 'text', label: 'P = nRT/V', x: 400, y: 50, size: 3, color: '#a78bfa', behavior: 'none', sensitivity: 1 },
    ],
  },
  {
    id: 'momentum', name: 'Momentum', formula: 'm * v', resultName: 'p', resultUnit: 'kg·m/s',
    description: 'Momentum = Mass × Velocity', category: 'Mechanics', icon: '🏃',
    defaultVariables: [
      { name: 'm', label: 'Mass', unit: 'kg', value: 5, min: 0.5, max: 20, step: 0.5, color: '#3b82f6' },
      { name: 'v', label: 'Velocity', unit: 'm/s', value: 4, min: 0, max: 15, step: 0.5, color: '#22c55e' },
    ],
    suggestedObjects: [
      { type: 'ball', label: 'Moving Ball', x: 150, y: 250, size: 5, color: '#3b82f6', behavior: 'x-position', sensitivity: 12 },
      { type: 'arrow-right', label: 'Velocity', x: 250, y: 300, size: 3, color: '#22c55e', behavior: 'x-position', sensitivity: 12 },
      { type: 'text', label: 'p = mv', x: 400, y: 50, size: 3, color: '#a78bfa', behavior: 'none', sensitivity: 1 },
    ],
  },
  {
    id: 'power', name: 'Power', formula: 'E / t', resultName: 'P', resultUnit: 'W',
    description: 'Power = Energy ÷ Time', category: 'Energy', icon: '💡',
    defaultVariables: [
      { name: 'E', label: 'Energy', unit: 'J', value: 100, min: 10, max: 500, step: 10, color: '#f59e0b' },
      { name: 't', label: 'Time', unit: 's', value: 5, min: 1, max: 30, step: 1, color: '#06b6d4' },
    ],
    suggestedObjects: [
      { type: 'circle', label: 'Light Bulb', x: 400, y: 200, size: 6, color: '#fbbf24', behavior: 'size', sensitivity: 2 },
      { type: 'battery', label: 'Battery', x: 200, y: 200, size: 3, color: '#22c55e', behavior: 'none', sensitivity: 1 },
      { type: 'text', label: 'P = E/t', x: 400, y: 50, size: 3, color: '#a78bfa', behavior: 'none', sensitivity: 1 },
    ],
  },
  {
    id: 'acceleration', name: 'Acceleration', formula: '(v2 - v1) / t', resultName: 'a', resultUnit: 'm/s²',
    description: 'Acceleration = Change in velocity ÷ time', category: 'Mechanics', icon: '🏎️',
    defaultVariables: [
      { name: 'v2', label: 'Final Velocity', unit: 'm/s', value: 20, min: 0, max: 40, step: 1, color: '#22c55e' },
      { name: 'v1', label: 'Initial Velocity', unit: 'm/s', value: 5, min: 0, max: 40, step: 1, color: '#f59e0b' },
      { name: 't', label: 'Time', unit: 's', value: 3, min: 1, max: 20, step: 0.5, color: '#06b6d4' },
    ],
    suggestedObjects: [
      { type: 'block', label: 'Car', x: 150, y: 250, size: 5, color: '#22c55e', behavior: 'x-position', sensitivity: 15 },
      { type: 'arrow-right', label: 'Acceleration', x: 300, y: 300, size: 4, color: '#ef4444', behavior: 'x-position', sensitivity: 15 },
      { type: 'text', label: 'a = Δv/Δt', x: 400, y: 50, size: 3, color: '#a78bfa', behavior: 'none', sensitivity: 1 },
    ],
  },
  {
    id: 'frequency', name: 'Frequency & Period', formula: '1 / T', resultName: 'f', resultUnit: 'Hz',
    description: 'Frequency = 1 ÷ Period', category: 'Waves', icon: '🌊',
    defaultVariables: [
      { name: 'T', label: 'Period', unit: 's', value: 2, min: 0.1, max: 10, step: 0.1, color: '#8b5cf6' },
    ],
    suggestedObjects: [
      { type: 'wave', label: 'Wave', x: 400, y: 250, size: 4, color: '#06b6d4', behavior: 'color', sensitivity: 3 },
      { type: 'arrow-up', label: 'Amplitude', x: 400, y: 150, size: 3, color: '#f59e0b', behavior: 'size', sensitivity: 2 },
      { type: 'text', label: 'f = 1/T', x: 400, y: 50, size: 3, color: '#a78bfa', behavior: 'none', sensitivity: 1 },
    ],
  },
  {
    id: 'custom', name: 'Custom Formula', formula: '', resultName: 'Result', resultUnit: '',
    description: 'Write your own formula', category: 'Custom', icon: '✨',
    defaultVariables: [],
    suggestedObjects: [],
  },
];

// ═══════════════════════════════════════════════════════════════════
// OBJECT GALLERY — Drag-and-Drop Ready
// ═══════════════════════════════════════════════════════════════════

interface ObjectTemplate {
  type: SceneObject['type'];
  label: string;
  icon: string;
  defaultSize: number;
  defaultColor: string;
}

const OBJECT_GALLERY: ObjectTemplate[] = [
  // ── Basic Shapes ──
  { type: 'ball', label: 'Ball', icon: '⚽', defaultSize: 5, defaultColor: '#3b82f6' },
  { type: 'block', label: 'Block', icon: '📦', defaultSize: 5, defaultColor: '#6366f1' },
  { type: 'circle', label: 'Circle', icon: '⭕', defaultSize: 4, defaultColor: '#f59e0b' },
  { type: 'rectangle', label: 'Rectangle', icon: '▬', defaultSize: 4, defaultColor: '#06b6d4' },
  { type: 'triangle', label: 'Triangle', icon: '🔺', defaultSize: 4, defaultColor: '#ef4444' },
  { type: 'diamond', label: 'Diamond', icon: '💎', defaultSize: 4, defaultColor: '#06b6d4' },
  { type: 'star', label: 'Star', icon: '⭐', defaultSize: 4, defaultColor: '#f59e0b' },
  { type: 'heart', label: 'Heart', icon: '❤️', defaultSize: 4, defaultColor: '#ef4444' },
  // ── Arrows ──
  { type: 'arrow-right', label: 'Arrow →', icon: '➡️', defaultSize: 3, defaultColor: '#ef4444' },
  { type: 'arrow-up', label: 'Arrow ↑', icon: '⬆️', defaultSize: 3, defaultColor: '#22c55e' },
  { type: 'arrow-left', label: 'Arrow ←', icon: '⬅️', defaultSize: 3, defaultColor: '#f59e0b' },
  { type: 'arrow-down', label: 'Arrow ↓', icon: '⬇️', defaultSize: 3, defaultColor: '#a855f7' },
  { type: 'plus', label: 'Plus', icon: '➕', defaultSize: 3, defaultColor: '#22c55e' },
  { type: 'cross', label: 'Cross', icon: '❌', defaultSize: 3, defaultColor: '#ef4444' },
  // ── Physics Elements ──
  { type: 'spring', label: 'Spring', icon: '〰️', defaultSize: 3, defaultColor: '#a855f7' },
  { type: 'pendulum', label: 'Pendulum', icon: '🔔', defaultSize: 4, defaultColor: '#f97316' },
  { type: 'weight', label: 'Weight', icon: '🏋️', defaultSize: 4, defaultColor: '#64748b' },
  { type: 'battery', label: 'Battery', icon: '🔋', defaultSize: 3, defaultColor: '#22c55e' },
  { type: 'resistor', label: 'Resistor', icon: '⚡', defaultSize: 3, defaultColor: '#f97316' },
  { type: 'lens', label: 'Lens', icon: '🔍', defaultSize: 4, defaultColor: '#06b6d4' },
  { type: 'mirror', label: 'Mirror', icon: '🪞', defaultSize: 4, defaultColor: '#94a3b8' },
  // ── Environment ──
  { type: 'ground', label: 'Ground Line', icon: '➖', defaultSize: 3, defaultColor: '#22c55e' },
  { type: 'platform', label: 'Platform', icon: '🟫', defaultSize: 3, defaultColor: '#92400e' },
  { type: 'wall', label: 'Wall', icon: '🧱', defaultSize: 3, defaultColor: '#b45309' },
  { type: 'cloud', label: 'Cloud', icon: '☁️', defaultSize: 4, defaultColor: '#e2e8f0' },
  { type: 'wave', label: 'Wave', icon: '🌊', defaultSize: 3, defaultColor: '#06b6d4' },
  { type: 'arc', label: 'Arc', icon: '🌈', defaultSize: 3, defaultColor: '#a855f7' },
  { type: 'wheel', label: 'Wheel', icon: '⚙️', defaultSize: 4, defaultColor: '#64748b' },
  { type: 'flag', label: 'Flag', icon: '🚩', defaultSize: 3, defaultColor: '#ef4444' },
  // ── Text & Labels ──
  { type: 'text', label: 'Text Label', icon: '🏷️', defaultSize: 3, defaultColor: '#a78bfa' },
  // ── Chemistry ──
  { type: 'beaker', label: 'Beaker', icon: '🧪', defaultSize: 4, defaultColor: '#06b6d4' },
  { type: 'flask', label: 'Flask', icon: '⚗️', defaultSize: 4, defaultColor: '#8b5cf6' },
  { type: 'atom', label: 'Atom', icon: '⚛️', defaultSize: 4, defaultColor: '#ef4444' },
  { type: 'test-tube', label: 'Test Tube', icon: '🧫', defaultSize: 3, defaultColor: '#22c55e' },
  { type: 'molecule', label: 'Molecule', icon: '🔬', defaultSize: 4, defaultColor: '#f59e0b' },
  // ── Biology ──
  { type: 'cell', label: 'Cell', icon: '🧫', defaultSize: 5, defaultColor: '#22c55e' },
  { type: 'leaf', label: 'Leaf', icon: '🍃', defaultSize: 4, defaultColor: '#22c55e' },
  { type: 'flower', label: 'Flower', icon: '🌸', defaultSize: 4, defaultColor: '#ec4899' },
  { type: 'dna', label: 'DNA Strand', icon: '🧬', defaultSize: 4, defaultColor: '#6366f1' },
  { type: 'tree', label: 'Tree', icon: '🌳', defaultSize: 5, defaultColor: '#16a34a' },
  { type: 'bacteria', label: 'Bacteria', icon: '🦠', defaultSize: 3, defaultColor: '#a3e635' },
  // ── Math & Geometry ──
  { type: 'grid', label: 'Grid', icon: '📊', defaultSize: 4, defaultColor: '#94a3b8' },
  { type: 'ruler', label: 'Ruler', icon: '📏', defaultSize: 4, defaultColor: '#f59e0b' },
  { type: 'protractor', label: 'Protractor', icon: '📐', defaultSize: 4, defaultColor: '#06b6d4' },
  { type: 'compass', label: 'Compass', icon: '🧭', defaultSize: 4, defaultColor: '#ef4444' },
  { type: 'graph', label: 'Graph Line', icon: '📈', defaultSize: 3, defaultColor: '#22c55e' },
  // ── Geography & Earth Science ──
  { type: 'mountain', label: 'Mountain', icon: '🏔️', defaultSize: 5, defaultColor: '#64748b' },
  { type: 'sun', label: 'Sun', icon: '☀️', defaultSize: 5, defaultColor: '#f59e0b' },
  { type: 'moon', label: 'Moon', icon: '🌙', defaultSize: 4, defaultColor: '#e2e8f0' },
  { type: 'globe', label: 'Globe', icon: '🌍', defaultSize: 5, defaultColor: '#3b82f6' },
  { type: 'compass-rose', label: 'Compass Rose', icon: '🧭', defaultSize: 4, defaultColor: '#f97316' },
];

const BEHAVIOR_OPTIONS: { value: BehaviorType; label: string; icon: React.ReactNode; description: string; category?: string }[] = [
  // ── Basic ──
  { value: 'none', label: 'Static', icon: <Eye size={14} />, description: 'Does not move', category: 'Basic' },
  { value: 'x-position', label: 'Move Left ↔ Right', icon: <MoveHorizontal size={14} />, description: 'Moves horizontally based on formula', category: 'Basic' },
  { value: 'y-position', label: 'Move Up ↔ Down', icon: <MoveVertical size={14} />, description: 'Moves vertically based on formula', category: 'Basic' },
  { value: 'size', label: 'Change Size', icon: <Maximize size={14} />, description: 'Grows/shrinks based on formula', category: 'Basic' },
  { value: 'rotation', label: 'Rotate', icon: <RotateCw size={14} />, description: 'Rotates based on formula', category: 'Basic' },
  { value: 'color', label: 'Change Color', icon: <Palette size={14} />, description: 'Color intensity changes with formula', category: 'Basic' },
  // ── Physics ──
  { value: 'gravity', label: 'Free Fall (Gravity)', icon: <ArrowDown size={14} />, description: 'Object falls under gravity with mass-dependent acceleration', category: 'Physics' },
  { value: 'friction', label: 'Slide with Friction', icon: <MinusIcon size={14} />, description: 'Object slides with friction deceleration', category: 'Physics' },
  { value: 'collision', label: 'Bounce (Collision)', icon: <Zap size={14} />, description: 'Object bounces off canvas walls', category: 'Physics' },
  { value: 'spring', label: 'Spring Oscillator', icon: <ChevronRight size={14} />, description: 'Object oscillates on a spring from anchor point', category: 'Physics' },
];

// ═══════════════════════════════════════════════════════════════════
// EQUATION EVALUATOR (reuses existing logic)
// ═══════════════════════════════════════════════════════════════════

function safeEval(expr: string, vars: Record<string, number>, fallback = 0): number {
  if (!expr || typeof expr !== 'string') return fallback;
  try {
    let s = expr.toLowerCase().trim();
    s = s.replace(/\bpi\b/g, String(Math.PI));
    s = s.replace(/\be\b/g, String(Math.E));
    s = s.replace(/\basin\b/g, 'Math.asin');
    s = s.replace(/\bacos\b/g, 'Math.acos');
    s = s.replace(/\batan\b/g, 'Math.atan');
    s = s.replace(/\bsin\b/g, 'Math.sin');
    s = s.replace(/\bcos\b/g, 'Math.cos');
    s = s.replace(/\btan\b/g, 'Math.tan');
    s = s.replace(/\bsqrt\b/g, 'Math.sqrt');
    s = s.replace(/\bpow\b/g, 'Math.pow');
    s = s.replace(/\bexp\b/g, 'Math.exp');
    s = s.replace(/\blog10\b/g, 'Math.log10');
    s = s.replace(/\blog\b/g, 'Math.log');
    s = s.replace(/\bceil\b/g, 'Math.ceil');
    s = s.replace(/\bfloor\b/g, 'Math.floor');
    s = s.replace(/\bround\b/g, 'Math.round');
    s = s.replace(/\bmin\b/g, 'Math.min');
    s = s.replace(/\bmax\b/g, 'Math.max');
    s = s.replace(/\babs\b/g, 'Math.abs');
    s = s.replace(/\bmod\b/g, 'function(a,b){return((a)%(b))}');
    const varNames = Object.keys(vars).sort((a, b) => b.length - a.length);
    for (const name of varNames) {
      const regex = new RegExp(`\\b${name.toLowerCase()}\\b`, 'g');
      s = s.replace(regex, String(vars[name] ?? 0));
    }
    const testStr = s.replace(/Math\.\w+/g, '').replace(/function\(a,b\)\{return\(\(a\)%\(b\)\)\}/g, '').replace(/\s+/g, '');
    if (!/^[0-9+\-*/%().,]*$/.test(testStr)) return fallback;
    const result = new Function(`return (${s});`)();
    return typeof result === 'number' && !isNaN(result) ? result : fallback;
  } catch { return fallback; }
}

// ═══════════════════════════════════════════════════════════════════
// RENDER SHAPES ON SVG CANVAS
// ═══════════════════════════════════════════════════════════════════

function renderObjectSVG(obj: SceneObject, computedX: number, computedY: number, computedSize: number, computedAngle: number, computedOpacity: number, computedColor: string) {
  const s = computedSize;
  const rot = computedAngle ? `rotate(${computedAngle} ${computedX} ${computedY})` : undefined;
  switch (obj.type) {
    // ── Basic Shapes ──
    case 'ball':
      return <circle cx={computedX} cy={computedY} r={s * 4} fill={computedColor} opacity={computedOpacity} />;
    case 'block':
      return <rect x={computedX - s * 4} y={computedY - s * 4} width={s * 8} height={s * 8} rx={s} fill={computedColor} opacity={computedOpacity} transform={rot} />;
    case 'circle':
      return <circle cx={computedX} cy={computedY} r={s * 5} fill="none" stroke={computedColor} strokeWidth={3} opacity={computedOpacity} />;
    case 'rectangle':
      return <rect x={computedX - s * 6} y={computedY - s * 3} width={s * 12} height={s * 6} fill={computedColor} opacity={computedOpacity} transform={rot} />;
    case 'triangle': {
      const h = s * 7;
      const w = s * 7;
      return <polygon points={`${computedX},${computedY - h / 2} ${computedX - w / 2},${computedY + h / 2} ${computedX + w / 2},${computedY + h / 2}`} fill={computedColor} opacity={computedOpacity} transform={rot} />;
    }
    case 'diamond': {
      const d = s * 5;
      return <polygon points={`${computedX},${computedY - d} ${computedX + d},${computedY} ${computedX},${computedY + d} ${computedX - d},${computedY}`} fill={computedColor} opacity={computedOpacity} transform={rot} />;
    }
    case 'star': {
      const outerR = s * 5;
      const innerR = s * 2.5;
      let pts = '';
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        pts += `${computedX + r * Math.cos(angle)},${computedY + r * Math.sin(angle)} `;
      }
      return <polygon points={pts.trim()} fill={computedColor} opacity={computedOpacity} transform={rot} />;
    }
    case 'heart': {
      const hs = s * 1.2;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <path d={`M ${computedX} ${computedY + hs * 2} C ${computedX - hs * 3} ${computedY} ${computedX - hs * 3} ${computedY - hs * 3} ${computedX} ${computedY - hs * 1.5} C ${computedX + hs * 3} ${computedY - hs * 3} ${computedX + hs * 3} ${computedY} ${computedX} ${computedY + hs * 2} Z`} fill={computedColor} />
        </g>
      );
    }
    // ── Arrows ──
    case 'arrow-right': {
      const len = s * 10;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <line x1={computedX - len / 2} y1={computedY} x2={computedX + len / 2} y2={computedY} stroke={computedColor} strokeWidth={3} strokeLinecap="round" />
          <polygon points={`${computedX + len / 2},${computedY} ${computedX + len / 2 - s * 3},${computedY - s * 2} ${computedX + len / 2 - s * 3},${computedY + s * 2}`} fill={computedColor} />
        </g>
      );
    }
    case 'arrow-up': {
      const len = s * 10;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <line x1={computedX} y1={computedY + len / 2} x2={computedX} y2={computedY - len / 2} stroke={computedColor} strokeWidth={3} strokeLinecap="round" />
          <polygon points={`${computedX},${computedY - len / 2} ${computedX - s * 2},${computedY - len / 2 + s * 3} ${computedX + s * 2},${computedY - len / 2 + s * 3}`} fill={computedColor} />
        </g>
      );
    }
    case 'arrow-left': {
      const len = s * 10;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <line x1={computedX + len / 2} y1={computedY} x2={computedX - len / 2} y2={computedY} stroke={computedColor} strokeWidth={3} strokeLinecap="round" />
          <polygon points={`${computedX - len / 2},${computedY} ${computedX - len / 2 + s * 3},${computedY - s * 2} ${computedX - len / 2 + s * 3},${computedY + s * 2}`} fill={computedColor} />
        </g>
      );
    }
    case 'arrow-down': {
      const len = s * 10;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <line x1={computedX} y1={computedY - len / 2} x2={computedX} y2={computedY + len / 2} stroke={computedColor} strokeWidth={3} strokeLinecap="round" />
          <polygon points={`${computedX},${computedY + len / 2} ${computedX - s * 2},${computedY + len / 2 - s * 3} ${computedX + s * 2},${computedY + len / 2 - s * 3}`} fill={computedColor} />
        </g>
      );
    }
    case 'plus': {
      const l = s * 4;
      const t = s * 1.5;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <rect x={computedX - t} y={computedY - l} width={t * 2} height={l * 2} rx={t / 2} fill={computedColor} />
          <rect x={computedX - l} y={computedY - t} width={l * 2} height={t * 2} rx={t / 2} fill={computedColor} />
        </g>
      );
    }
    case 'cross': {
      const l = s * 4;
      const t = s * 1.2;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <line x1={computedX - l} y1={computedY - l} x2={computedX + l} y2={computedY + l} stroke={computedColor} strokeWidth={t * 2} strokeLinecap="round" />
          <line x1={computedX + l} y1={computedY - l} x2={computedX - l} y2={computedY + l} stroke={computedColor} strokeWidth={t * 2} strokeLinecap="round" />
        </g>
      );
    }
    // ── Physics Elements ──
    case 'spring': {
      const coils = 8;
      const w = s * 8;
      const h = s * 3;
      let d = `M ${computedX - w / 2} ${computedY}`;
      for (let i = 0; i < coils; i++) {
        const x1 = computedX - w / 2 + (w / coils) * (i + 0.25);
        const x2 = computedX - w / 2 + (w / coils) * (i + 0.75);
        d += ` L ${x1} ${computedY - h} L ${x2} ${computedY + h}`;
      }
      d += ` L ${computedX + w / 2} ${computedY}`;
      return <path d={d} fill="none" stroke={computedColor} strokeWidth={2.5} opacity={computedOpacity} />;
    }
    case 'pendulum': {
      const armLen = s * 12;
      const bobR = s * 3;
      const angleRad = (computedAngle * Math.PI) / 180;
      const bx = computedX + armLen * Math.sin(angleRad);
      const by = computedY + armLen * Math.cos(angleRad);
      return (
        <g opacity={computedOpacity}>
          <circle cx={computedX} cy={computedY} r={4} fill="#94a3b8" />
          <line x1={computedX} y1={computedY} x2={bx} y2={by} stroke="#94a3b8" strokeWidth={2} />
          <circle cx={bx} cy={by} r={bobR} fill={computedColor} />
        </g>
      );
    }
    case 'weight': {
      const w2 = s * 8;
      const h2 = s * 6;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <rect x={computedX - w2 / 2} y={computedY - h2 / 2 + s * 2} width={w2} height={h2} rx={s} fill={computedColor} />
          <rect x={computedX - w2 / 3} y={computedY - h2 / 2 - s} width={w2 / 1.5} height={s * 3} rx={s / 2} fill={computedColor} />
        </g>
      );
    }
    case 'battery': {
      const w2 = s * 8;
      const h2 = s * 5;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <rect x={computedX - w2 / 2} y={computedY - h2 / 2} width={w2} height={h2} rx={s / 2} fill="none" stroke={computedColor} strokeWidth={2} />
          <line x1={computedX - w2 / 2 + s} y1={computedY - h2 / 4} x2={computedX + w2 / 2 - s} y2={computedY - h2 / 4} stroke={computedColor} strokeWidth={3} />
          <line x1={computedX - w2 / 2 + s} y1={computedY + h2 / 4} x2={computedX + w2 / 2 - s} y2={computedY + h2 / 4} stroke={computedColor} strokeWidth={1.5} />
          <text x={computedX - w2 / 2 - s * 2} y={computedY + 3} fill={computedColor} fontSize={s * 3} fontWeight="bold">−</text>
          <text x={computedX + w2 / 2 + s} y={computedY + 3} fill={computedColor} fontSize={s * 3} fontWeight="bold">+</text>
        </g>
      );
    }
    case 'resistor': {
      const w2 = s * 10;
      let d = `M ${computedX - w2 / 2} ${computedY}`;
      const segs = 6;
      const segW = w2 / segs;
      for (let i = 0; i < segs; i++) {
        const x1 = computedX - w2 / 2 + segW * (i + 0.5);
        const yOff = i % 2 === 0 ? -s * 2 : s * 2;
        d += ` L ${x1} ${computedY + yOff}`;
      }
      d += ` L ${computedX + w2 / 2} ${computedY}`;
      return <path d={d} fill="none" stroke={computedColor} strokeWidth={2.5} strokeLinecap="round" opacity={computedOpacity} transform={rot} />;
    }
    case 'lens': {
      const h2 = s * 8;
      const w2 = s * 2.5;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <ellipse cx={computedX} cy={computedY} rx={w2} ry={h2 / 2} fill="none" stroke={computedColor} strokeWidth={2.5} />
          <line x1={computedX - w2 * 3} y1={computedY} x2={computedX - w2} y2={computedY} stroke={computedColor} strokeWidth={1.5} strokeDasharray="3 2" />
          <line x1={computedX + w2} y1={computedY} x2={computedX + w2 * 3} y2={computedY} stroke={computedColor} strokeWidth={1.5} strokeDasharray="3 2" />
        </g>
      );
    }
    case 'mirror': {
      const h2 = s * 8;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <line x1={computedX} y1={computedY - h2 / 2} x2={computedX} y2={computedY + h2 / 2} stroke={computedColor} strokeWidth={3} />
          {[...Array(5)].map((_, i) => {
            const y = computedY - h2 / 2 + (h2 / 4) * i;
            return <line key={i} x1={computedX} y1={y} x2={computedX - s * 2} y2={y + s * 1.5} stroke={computedColor} strokeWidth={1.5} />;
          })}
        </g>
      );
    }
    // ── Environment ──
    case 'ground':
      return <line x1={50} y1={computedY} x2={750} y2={computedY} stroke={computedColor} strokeWidth={2} strokeDasharray="8 4" opacity={computedOpacity} />;
    case 'platform': {
      const w2 = s * 12;
      const h2 = s * 2;
      return <rect x={computedX - w2 / 2} y={computedY - h2 / 2} width={w2} height={h2} rx={1} fill={computedColor} opacity={computedOpacity} transform={rot} />;
    }
    case 'wall': {
      const w2 = s * 3;
      const h2 = s * 10;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <rect x={computedX - w2 / 2} y={computedY - h2 / 2} width={w2} height={h2} fill={computedColor} />
          {[...Array(4)].map((_, i) => {
            const y = computedY - h2 / 2 + (h2 / 4) * i;
            return <line key={i} x1={computedX - w2 / 2} y1={y} x2={computedX + w2 / 2} y2={y} stroke="rgba(0,0,0,0.2)" strokeWidth={1} />;
          })}
        </g>
      );
    }
    case 'cloud': {
      return (
        <g opacity={computedOpacity} transform={rot}>
          <circle cx={computedX - s * 3} cy={computedY} r={s * 2.5} fill={computedColor} />
          <circle cx={computedX} cy={computedY - s * 1.5} r={s * 3.5} fill={computedColor} />
          <circle cx={computedX + s * 3} cy={computedY} r={s * 2.5} fill={computedColor} />
          <circle cx={computedX - s * 1.5} cy={computedY + s * 1} r={s * 2.5} fill={computedColor} />
          <circle cx={computedX + s * 1.5} cy={computedY + s * 1} r={s * 2.5} fill={computedColor} />
        </g>
      );
    }
    case 'wave': {
      const w2 = s * 12;
      let d = `M ${computedX - w2 / 2} ${computedY}`;
      for (let i = 0; i <= 20; i++) {
        const x = computedX - w2 / 2 + (w2 / 20) * i;
        const y = computedY + Math.sin((i / 20) * Math.PI * 4) * s * 2;
        d += ` L ${x} ${y}`;
      }
      return <path d={d} fill="none" stroke={computedColor} strokeWidth={2.5} strokeLinecap="round" opacity={computedOpacity} />;
    }
    case 'arc': {
      const r = s * 5;
      return <path d={`M ${computedX - r} ${computedY + r * 0.5} A ${r} ${r} 0 0 1 ${computedX + r} ${computedY + r * 0.5}`} fill="none" stroke={computedColor} strokeWidth={2.5} strokeLinecap="round" opacity={computedOpacity} transform={rot} />;
    }
    case 'wheel': {
      const r = s * 4;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <circle cx={computedX} cy={computedY} r={r} fill="none" stroke={computedColor} strokeWidth={2.5} />
          <circle cx={computedX} cy={computedY} r={r * 0.2} fill={computedColor} />
          {[0, 60, 120].map(angle => {
            const rad = (angle * Math.PI) / 180;
            return <line key={angle} x1={computedX + r * 0.2 * Math.cos(rad)} y1={computedY + r * 0.2 * Math.sin(rad)} x2={computedX + r * 0.9 * Math.cos(rad)} y2={computedY + r * 0.9 * Math.sin(rad)} stroke={computedColor} strokeWidth={1.5} />;
          })}
        </g>
      );
    }
    case 'flag': {
      return (
        <g opacity={computedOpacity} transform={rot}>
          <line x1={computedX} y1={computedY - s * 6} x2={computedX} y2={computedY + s * 6} stroke="#94a3b8" strokeWidth={2} />
          <polygon points={`${computedX},${computedY - s * 6} ${computedX + s * 6},${computedY - s * 4} ${computedX},${computedY - s * 2}`} fill={computedColor} />
        </g>
      );
    }
    case 'text':
      return (
        <text x={computedX} y={computedY} fill={computedColor} fontSize={s * 4} textAnchor="middle" dominantBaseline="middle" fontWeight="bold" opacity={computedOpacity}>
          {obj.label}
        </text>
      );
    // ── Chemistry ──
    case 'beaker': {
      const bw = s * 6, bh = s * 8;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <rect x={computedX - bw / 2} y={computedY - bh / 2} width={bw} height={bh} rx={2} fill="none" stroke={computedColor} strokeWidth={2.5} />
          <rect x={computedX - bw / 2 + 2} y={computedY} width={bw - 4} height={bh / 2 - 2} fill={computedColor} opacity={0.3} />
          <line x1={computedX - bw / 2 - 3} y1={computedY - bh / 2} x2={computedX + bw / 2 + 3} y2={computedY - bh / 2} stroke={computedColor} strokeWidth={2} />
        </g>
      );
    }
    case 'flask': {
      const fw = s * 8, fh = s * 10;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <path d={`M ${computedX - s * 1.5} ${computedY - fh / 2} L ${computedX - s * 1.5} ${computedY - fh / 4} L ${computedX - fw / 2} ${computedY + fh / 4} Q ${computedX} ${computedY + fh / 2 + 2} ${computedX + fw / 2} ${computedY + fh / 4} L ${computedX + s * 1.5} ${computedY - fh / 4} L ${computedX + s * 1.5} ${computedY - fh / 2}`} fill="none" stroke={computedColor} strokeWidth={2.5} strokeLinejoin="round" />
          <ellipse cx={computedX} cy={computedY + fh / 5} rx={fw / 3} ry={fh / 6} fill={computedColor} opacity={0.25} />
        </g>
      );
    }
    case 'atom': {
      const ar = s * 5;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <circle cx={computedX} cy={computedY} r={s * 1.5} fill={computedColor} />
          {[0, 60, 120].map(a => {
            const rad = (a * Math.PI) / 180;
            return (
              <ellipse key={a} cx={computedX} cy={computedY} rx={ar} ry={ar * 0.35}
                fill="none" stroke={computedColor} strokeWidth={1.5} opacity={0.7}
                transform={`rotate(${a} ${computedX} ${computedY})`} />
            );
          })}
        </g>
      );
    }
    case 'test-tube': {
      const tw = s * 2.5, th = s * 10;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <path d={`M ${computedX - tw / 2} ${computedY - th / 2} L ${computedX - tw / 2} ${computedY + th / 3} A ${tw / 2} ${tw / 2} 0 0 0 ${computedX + tw / 2} ${computedY + th / 3} L ${computedX + tw / 2} ${computedY - th / 2}`} fill="none" stroke={computedColor} strokeWidth={2.5} />
          <rect x={computedX - tw / 2 + 1.5} y={computedY} width={tw - 3} height={th / 3} rx={tw / 4} fill={computedColor} opacity={0.3} />
          <line x1={computedX - tw / 2 - 2} y1={computedY - th / 2} x2={computedX + tw / 2 + 2} y2={computedY - th / 2} stroke={computedColor} strokeWidth={2} />
        </g>
      );
    }
    case 'molecule': {
      const mr = s * 2;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <circle cx={computedX} cy={computedY} r={mr} fill={computedColor} />
          <circle cx={computedX - s * 4} cy={computedY - s * 3} r={mr * 0.7} fill={computedColor} opacity={0.7} />
          <circle cx={computedX + s * 4} cy={computedY - s * 3} r={mr * 0.7} fill={computedColor} opacity={0.7} />
          <circle cx={computedX} cy={computedY + s * 4} r={mr * 0.7} fill={computedColor} opacity={0.7} />
          <line x1={computedX} y1={computedY} x2={computedX - s * 4} y2={computedY - s * 3} stroke={computedColor} strokeWidth={2} />
          <line x1={computedX} y1={computedY} x2={computedX + s * 4} y2={computedY - s * 3} stroke={computedColor} strokeWidth={2} />
          <line x1={computedX} y1={computedY} x2={computedX} y2={computedY + s * 4} stroke={computedColor} strokeWidth={2} />
        </g>
      );
    }
    // ── Biology ──
    case 'cell': {
      return (
        <g opacity={computedOpacity} transform={rot}>
          <ellipse cx={computedX} cy={computedY} rx={s * 6} ry={s * 5} fill="none" stroke={computedColor} strokeWidth={2.5} />
          <circle cx={computedX} cy={computedY} r={s * 2} fill={computedColor} opacity={0.6} />
          <circle cx={computedX + s * 2} cy={computedY - s * 1} r={s * 0.8} fill={computedColor} opacity={0.3} />
          <circle cx={computedX - s * 2.5} cy={computedY + s * 1.5} r={s * 0.6} fill={computedColor} opacity={0.3} />
        </g>
      );
    }
    case 'leaf': {
      return (
        <g opacity={computedOpacity} transform={rot}>
          <path d={`M ${computedX} ${computedY + s * 4} Q ${computedX - s * 6} ${computedY - s * 2} ${computedX} ${computedY - s * 4} Q ${computedX + s * 6} ${computedY - s * 2} ${computedX} ${computedY + s * 4} Z`} fill={computedColor} opacity={0.7} />
          <line x1={computedX} y1={computedY - s * 4} x2={computedX} y2={computedY + s * 4} stroke="rgba(0,0,0,0.2)" strokeWidth={1.5} />
          <line x1={computedX} y1={computedY} x2={computedX - s * 3} y2={computedY - s * 2} stroke="rgba(0,0,0,0.15)" strokeWidth={1} />
          <line x1={computedX} y1={computedY} x2={computedX + s * 3} y2={computedY - s * 2} stroke="rgba(0,0,0,0.15)" strokeWidth={1} />
        </g>
      );
    }
    case 'flower': {
      return (
        <g opacity={computedOpacity} transform={rot}>
          {[0, 60, 120, 180, 240, 300].map(a => {
            const rad = (a * Math.PI) / 180;
            const px = computedX + Math.cos(rad) * s * 3;
            const py = computedY + Math.sin(rad) * s * 3;
            return <ellipse key={a} cx={px} cy={py} rx={s * 2} ry={s * 1.2} fill={computedColor} opacity={0.7} transform={`rotate(${a} ${px} ${py})`} />;
          })}
          <circle cx={computedX} cy={computedY} r={s * 1.5} fill="#fbbf24" />
        </g>
      );
    }
    case 'dna': {
      const dw = s * 6, dh = s * 10;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <path d={`M ${computedX - dw / 2} ${computedY - dh / 2} Q ${computedX + dw / 2} ${computedY - dh / 4} ${computedX - dw / 2} ${computedY} Q ${computedX + dw / 2} ${computedY + dh / 4} ${computedX - dw / 2} ${computedY + dh / 2}`} fill="none" stroke={computedColor} strokeWidth={2.5} />
          <path d={`M ${computedX + dw / 2} ${computedY - dh / 2} Q ${computedX - dw / 2} ${computedY - dh / 4} ${computedX + dw / 2} ${computedY} Q ${computedX - dw / 2} ${computedY + dh / 4} ${computedX + dw / 2} ${computedY + dh / 2}`} fill="none" stroke={computedColor} strokeWidth={2.5} />
          {[-dh / 3, 0, dh / 3].map((yOff, i) => (
            <line key={i} x1={computedX - s * 2.5} y1={computedY + yOff} x2={computedX + s * 2.5} y2={computedY + yOff} stroke={computedColor} strokeWidth={1.5} opacity={0.5} />
          ))}
        </g>
      );
    }
    case 'tree': {
      return (
        <g opacity={computedOpacity} transform={rot}>
          <rect x={computedX - s * 1} y={computedY + s * 2} width={s * 2} height={s * 4} fill="#92400e" />
          <polygon points={`${computedX},${computedY - s * 5} ${computedX - s * 4},${computedY + s * 3} ${computedX + s * 4},${computedY + s * 3}`} fill={computedColor} />
          <polygon points={`${computedX},${computedY - s * 3} ${computedX - s * 3},${computedY + s * 1} ${computedX + s * 3},${computedY + s * 1}`} fill={computedColor} opacity={0.8} />
        </g>
      );
    }
    case 'bacteria': {
      return (
        <g opacity={computedOpacity} transform={rot}>
          <ellipse cx={computedX} cy={computedY} rx={s * 4} ry={s * 2.5} fill={computedColor} opacity={0.7} />
          <circle cx={computedX - s * 1} cy={computedY} r={s * 0.8} fill="rgba(0,0,0,0.2)" />
          <path d={`M ${computedX + s * 4} ${computedY - s * 1} Q ${computedX + s * 6} ${computedY - s * 3} ${computedX + s * 5} ${computedY - s * 4}`} fill="none" stroke={computedColor} strokeWidth={1.5} opacity={0.7} />
          <path d={`M ${computedX + s * 4} ${computedY + s * 1} Q ${computedX + s * 6} ${computedY + s * 3} ${computedX + s * 5} ${computedY + s * 4}`} fill="none" stroke={computedColor} strokeWidth={1.5} opacity={0.7} />
        </g>
      );
    }
    // ── Math & Geometry ──
    case 'grid': {
      const gs = s * 8;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <rect x={computedX - gs / 2} y={computedY - gs / 2} width={gs} height={gs} fill="none" stroke={computedColor} strokeWidth={1.5} />
          {[1, 2, 3, 4].map(i => (
            <g key={i}>
              <line x1={computedX - gs / 2 + (gs / 4) * i} y1={computedY - gs / 2} x2={computedX - gs / 2 + (gs / 4) * i} y2={computedY + gs / 2} stroke={computedColor} strokeWidth={0.8} opacity={0.5} />
              <line x1={computedX - gs / 2} y1={computedY - gs / 2 + (gs / 4) * i} x2={computedX + gs / 2} y2={computedY - gs / 2 + (gs / 4) * i} stroke={computedColor} strokeWidth={0.8} opacity={0.5} />
            </g>
          ))}
        </g>
      );
    }
    case 'ruler': {
      const rw = s * 12, rh = s * 2;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <rect x={computedX - rw / 2} y={computedY - rh / 2} width={rw} height={rh} fill={computedColor} opacity={0.2} stroke={computedColor} strokeWidth={1.5} rx={1} />
          {[0, 1, 2, 3, 4, 5, 6].map(i => {
            const x = computedX - rw / 2 + (rw / 6) * i;
            const isMajor = i % 2 === 0;
            return <line key={i} x1={x} y1={computedY - rh / 2} x2={x} y2={computedY - rh / 2 + (isMajor ? rh * 0.7 : rh * 0.4)} stroke={computedColor} strokeWidth={isMajor ? 1.5 : 0.8} />;
          })}
        </g>
      );
    }
    case 'protractor': {
      const pr = s * 5;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <path d={`M ${computedX - pr} ${computedY} A ${pr} ${pr} 0 0 1 ${computedX + pr} ${computedY}`} fill="none" stroke={computedColor} strokeWidth={2.5} />
          <line x1={computedX - pr} y1={computedY} x2={computedX + pr} y2={computedY} stroke={computedColor} strokeWidth={1.5} />
          {[0, 30, 60, 90, 120, 150, 180].map(a => {
            const rad = (a * Math.PI) / 180;
            const ix = computedX - pr * Math.cos(rad);
            const iy = computedY - pr * Math.sin(rad);
            const ox = computedX - (pr + 3) * Math.cos(rad);
            const oy = computedY - (pr + 3) * Math.sin(rad);
            return <line key={a} x1={ix} y1={iy} x2={ox} y2={oy} stroke={computedColor} strokeWidth={a % 90 === 0 ? 1.5 : 0.8} />;
          })}
        </g>
      );
    }
    case 'compass': {
      const cr = s * 5;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <circle cx={computedX} cy={computedY} r={cr} fill="none" stroke={computedColor} strokeWidth={2} />
          <polygon points={`${computedX},${computedY - cr + 3} ${computedX - 3},${computedY} ${computedX + 3},${computedY}`} fill="#ef4444" />
          <polygon points={`${computedX},${computedY + cr - 3} ${computedX - 3},${computedY} ${computedX + 3},${computedY}`} fill="white" stroke={computedColor} strokeWidth={1} />
          <circle cx={computedX} cy={computedY} r={2} fill={computedColor} />
        </g>
      );
    }
    case 'graph': {
      const gw = s * 12, gh = s * 8;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <line x1={computedX - gw / 2} y1={computedY + gh / 2} x2={computedX + gw / 2} y2={computedY + gh / 2} stroke={computedColor} strokeWidth={2} />
          <line x1={computedX - gw / 2} y1={computedY + gh / 2} x2={computedX - gw / 2} y2={computedY - gh / 2} stroke={computedColor} strokeWidth={2} />
          <polyline points={`${computedX - gw / 3},${computedY + gh / 4} ${computedX - gw / 8},${computedY - gh / 6} ${computedX + gw / 8},${computedY + gh / 8} ${computedX + gw / 3},${computedY - gh / 3}`} fill="none" stroke={computedColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    }
    // ── Geography & Earth Science ──
    case 'mountain': {
      return (
        <g opacity={computedOpacity} transform={rot}>
          <polygon points={`${computedX},${computedY - s * 5} ${computedX - s * 6},${computedY + s * 3} ${computedX + s * 6},${computedY + s * 3}`} fill={computedColor} />
          <polygon points={`${computedX},${computedY - s * 5} ${computedX - s * 1.5},${computedY - s * 2} ${computedX + s * 1.5},${computedY - s * 2}`} fill="white" opacity={0.6} />
          <polygon points={`${computedX - s * 2},${computedY - s * 2} ${computedX - s * 6},${computedY + s * 3} ${computedX + s * 2},${computedY + s * 3}`} fill={computedColor} opacity={0.7} />
        </g>
      );
    }
    case 'sun': {
      const sr = s * 3;
      return (
        <g opacity={computedOpacity} transform={rot}>
          <circle cx={computedX} cy={computedY} r={sr} fill={computedColor} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
            const rad = (a * Math.PI) / 180;
            return <line key={a} x1={computedX + (sr + 2) * Math.cos(rad)} y1={computedY + (sr + 2) * Math.sin(rad)} x2={computedX + (sr + s * 2.5) * Math.cos(rad)} y2={computedY + (sr + s * 2.5) * Math.sin(rad)} stroke={computedColor} strokeWidth={2} strokeLinecap="round" />;
          })}
        </g>
      );
    }
    case 'moon': {
      return (
        <g opacity={computedOpacity} transform={rot}>
          <circle cx={computedX} cy={computedY} r={s * 4} fill={computedColor} />
          <circle cx={computedX - s * 1.5} cy={computedY - s * 1} r={s * 1} fill="rgba(0,0,0,0.08)" />
          <circle cx={computedX + s * 1} cy={computedY + s * 1.5} r={s * 0.6} fill="rgba(0,0,0,0.06)" />
          <circle cx={computedX + s * 2} cy={computedY - s * 0.5} r={s * 0.4} fill="rgba(0,0,0,0.05)" />
        </g>
      );
    }
    case 'globe': {
      return (
        <g opacity={computedOpacity} transform={rot}>
          <circle cx={computedX} cy={computedY} r={s * 5} fill="none" stroke={computedColor} strokeWidth={2.5} />
          <ellipse cx={computedX} cy={computedY} rx={s * 2} ry={s * 5} fill="none" stroke={computedColor} strokeWidth={1.5} opacity={0.5} />
          <line x1={computedX - s * 5} y1={computedY} x2={computedX + s * 5} y2={computedY} stroke={computedColor} strokeWidth={1} opacity={0.4} />
          <path d={`M ${computedX - s * 5} ${computedY - s * 2} Q ${computedX} ${computedY - s * 3} ${computedX + s * 5} ${computedY - s * 2}`} fill="none" stroke={computedColor} strokeWidth={1} opacity={0.4} />
        </g>
      );
    }
    case 'compass-rose': {
      return (
        <g opacity={computedOpacity} transform={rot}>
          <polygon points={`${computedX},${computedY - s * 5} ${computedX - s * 1.5},${computedY} ${computedX},${computedY - s * 1}`} fill={computedColor} />
          <polygon points={`${computedX},${computedY - s * 5} ${computedX + s * 1.5},${computedY} ${computedX},${computedY - s * 1}`} fill={computedColor} opacity={0.6} />
          <polygon points={`${computedX},${computedY + s * 5} ${computedX - s * 1},${computedY} ${computedX},${computedY + s * 1}`} fill={computedColor} opacity={0.4} />
          <polygon points={`${computedX},${computedY + s * 5} ${computedX + s * 1},${computedY} ${computedX},${computedY + s * 1}`} fill={computedColor} opacity={0.3} />
          <circle cx={computedX} cy={computedY} r={s * 0.8} fill={computedColor} />
          <text x={computedX} y={computedY - s * 6} fill={computedColor} fontSize={s * 2} textAnchor="middle" fontWeight="bold">N</text>
        </g>
      );
    }
    default:
      return null;
  }
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function SimulationStudioSimple() {
  const { simId } = useParams<{ simId?: string }>();
  const navigate = useNavigate();
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  // ── Wizard Step ──
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // ── Simulation Data ──
  const [simName, setSimName] = useState('My Simulation');
  const [selectedLawId, setSelectedLawId] = useState<string | null>(null);
  const [formula, setFormula] = useState('');
  const [resultName, setResultName] = useState('Result');
  const [resultUnit, setResultUnit] = useState('');
  const [variables, setVariables] = useState<Variable[]>([]);
  const [objects, setObjects] = useState<SceneObject[]>([]);
  // ── Multi-Formula Support (Phase 1) ──
  interface FormulaEntry { id: string; name: string; expression: string; resultName: string; resultUnit: string; enabled: boolean; }
  const [formulas, setFormulas] = useState<FormulaEntry[]>([]);
  // ── Stateful Variable Integration (Phase 2) ──
  // Stores accumulated values that persist across frames (e.g., velocity integrating acceleration)
  const statefulVarsRef = useRef<Record<string, number>>({});
  const [statefulVarNames, setStatefulVarNames] = useState<string[]>([]);
  // ── Canvas interaction ──
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const objectClickedRef = useRef(false);

  // ── Playback state ──
  const [isRunning, setIsRunning] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // ── Save state ──
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ── Data Logging ──
  const [logData, setLogData] = useState<DataPoint[]>([]);
  const [logPaused, setLogPaused] = useState(false);
  const logIntervalRef = useRef(0);
  
  // ── Assessment ──
  const [assessmentQuestions, setAssessmentQuestions] = useState<AssessmentQuestion[]>([]);
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState(0);
  
  // ── Period / Frequency measurement ──
  const [measurePeriod, setMeasurePeriod] = useState(false);
  const [measuredFreq, setMeasuredFreq] = useState(0);

  // ── Onboarding ──
  const [showOnboarding, setShowOnboarding] = useState(true);

  // ── Formula Builder Modal ──
  const [showFormulaBuilder, setShowFormulaBuilder] = useState(false);

  // ── Trail / Trace ──
  const [showTrails, setShowTrails] = useState(false);
  const [trailLength, setTrailLength] = useState(30);
  const trailRef = useRef<Map<string, { x: number; y: number }[]>>(new Map());
  // Physics state tracking — stores velocity and position per object for frame-to-frame integration
  const physicsVelRef = useRef<Map<string, { vx: number; vy: number }>>(new Map());
  const physicsPosRef = useRef<Map<string, { x: number; y: number }>>(new Map());

  // ══════════════════════════════════════════════════════════════
  // LOAD EXISTING SIMULATION (backward compatible)
  // ══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (simId) {
      const loaded = customSimService.getSimulation(simId);
      if (loaded) {
        setSimName(loaded.name);
        // Try to reconstruct from legacy format
        if (loaded.equations.length > 0) {
          setFormula(loaded.equations.map(e => e.expression).join(' + '));
        }
        setVariables(loaded.variables.map(v => ({
          name: v.name, label: v.label, unit: '', value: v.value,
          min: v.min, max: v.max, step: v.step,
          color: ['#3b82f6', '#f59e0b', '#22c55e', '#ef4444'][Math.floor(Math.random() * 4)],
        })));
        setObjects(loaded.shapes.map((s, i) => ({
          id: s.id, type: (['ball', 'block', 'circle', 'rectangle'] as const)[i % 4],
          label: s.id, x: parseFloat(s.xExpr || '400'), y: parseFloat(s.yExpr || '250'),
          size: 5, color: s.color, behavior: 'x-position' as BehaviorType, sensitivity: 10,
        })));
        setStep(2);
      }
    }
  }, [simId]);

  // ══════════════════════════════════════════════════════════════
  // SELECT A PHYSICS LAW
  // ══════════════════════════════════════════════════════════════
  const selectLaw = (law: PhysicsLaw) => {
    setSelectedLawId(law.id);
    setSimName(law.id === 'custom' ? 'My Custom Simulation' : law.name);
    setFormula(law.formula);
    setResultName(law.resultName);
    setResultUnit(law.resultUnit);
    setVariables(law.defaultVariables.map(v => ({ ...v })));
    setObjects(law.suggestedObjects.map((o, i) => ({
      id: `obj-${Date.now()}-${i}`,
      type: o.type || 'ball',
      label: o.label || `Object ${i + 1}`,
      x: o.x || 400, y: o.y || 250,
      size: o.size || 5,
      color: o.color || '#3b82f6',
      behavior: o.behavior || 'none',
      sensitivity: o.sensitivity || 10,
    })));
    // Check enhanced presets for assessment questions
    const enhancedPreset = SIMULATION_PRESETS.find(p => p.id === law.id);
    if (enhancedPreset?.questions?.length) {
      setAssessmentQuestions(enhancedPreset.questions.map(q => ({
        id: q.id, question: q.question, answer: q.answer,
        tolerance: q.tolerance, hint: q.hint, unit: q.unit,
      })));
      setShowAssessment(true);
    } else {
      setAssessmentQuestions([]);
      setShowAssessment(false);
    }
    setShowOnboarding(false);
    if (law.id === 'custom') {
      // Open the formula builder for custom formulas
      setShowFormulaBuilder(true);
    } else {
      setStep(2);
    }
  };

  // ══════════════════════════════════════════════════════════════
  // VARIABLE MANAGEMENT
  // ══════════════════════════════════════════════════════════════
  const addVariable = () => {
    const used = variables.map(v => v.name);
    const available = ['x', 'y', 'z', 'k', 'm', 'v', 'a', 'F', 'r', 'd', 'w', 'h', 't', 'p', 'q', 'n'].filter(n => !used.includes(n));
    const name = available[0] || `var${variables.length + 1}`;
    setVariables([...variables, {
      name, label: `Variable ${name}`, unit: '', value: 5,
      min: 0, max: 10, step: 0.5,
      color: ['#3b82f6', '#f59e0b', '#22c55e', '#ef4444', '#a855f7'][variables.length % 5],
    }]);
  };

  const removeVariable = (idx: number) => setVariables(variables.filter((_, i) => i !== idx));

  const updateVariable = (idx: number, field: keyof Variable, val: any) => {
    const updated = [...variables];
    updated[idx] = { ...updated[idx], [field]: val };
    setVariables(updated);
  };

  // ══════════════════════════════════════════════════════════════
  // OBJECT MANAGEMENT
  // ══════════════════════════════════════════════════════════════
  const addObjectFromGallery = (template: ObjectTemplate) => {
    const newObj: SceneObject = {
      id: `obj-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      type: template.type,
      label: template.label,
      x: 300 + Math.random() * 200,
      y: 200 + Math.random() * 100,
      size: template.defaultSize,
      color: template.defaultColor,
      behavior: 'none',
      sensitivity: 10,
    };
    setObjects([...objects, newObj]);
    setSelectedObjectId(newObj.id);
  };

  const removeObject = (id: string) => {
    setObjects(objects.filter(o => o.id !== id));
    if (selectedObjectId === id) setSelectedObjectId(null);
  };

  const duplicateObject = (obj: SceneObject) => {
    const copy = { ...obj, id: `obj-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`, x: obj.x + 30, y: obj.y + 30 };
    setObjects([...objects, copy]);
    setSelectedObjectId(copy.id);
  };

  const updateObject = (id: string, field: keyof SceneObject, val: any) => {
    setObjects(objects.map(o => o.id === id ? { ...o, [field]: val } : o));
  };

  // ══════════════════════════════════════════════════════════════
  // OBJECT REORDER (bring to front / send to back)
  // SVG renders last child on top, so array order = z-order.
  // ══════════════════════════════════════════════════════════════
  const bringToFront = (id: string) => {
    const idx = objects.findIndex(o => o.id === id);
    if (idx < 0 || idx === objects.length - 1) return;
    const obj = objects[idx];
    const rest = objects.filter((_, i) => i !== idx);
    setObjects([...rest, obj]);
  };

  const sendToBack = (id: string) => {
    const idx = objects.findIndex(o => o.id === id);
    if (idx <= 0) return;
    const obj = objects[idx];
    const rest = objects.filter((_, i) => i !== idx);
    setObjects([obj, ...rest]);
  };

  // ══════════════════════════════════════════════════════════════
  // CANVAS DRAG & DROP
  // ══════════════════════════════════════════════════════════════
  const [dragging, setDragging] = useState<{ id: string; startX: number; startY: number; objStartX: number; objStartY: number } | null>(null);

  const handleCanvasMouseDown = (e: React.MouseEvent, objId: string) => {
    e.stopPropagation();
    e.preventDefault();
    objectClickedRef.current = true;
    setTimeout(() => { objectClickedRef.current = false; }, 0);
    setSelectedObjectId(objId);
    setDragging({
      id: objId,
      startX: e.clientX,
      startY: e.clientY,
      objStartX: objects.find(o => o.id === objId)?.x || 0,
      objStartY: objects.find(o => o.id === objId)?.y || 0,
    });
  };

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: MouseEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const scale = 800 / rect.width;
      const dx = (e.clientX - dragging.startX) * scale;
      const dy = (e.clientY - dragging.startY) * scale;
      setObjects(prev => prev.map(o =>
        o.id === dragging.id
          ? { ...o, x: Math.round(dragging.objStartX + dx), y: Math.round(dragging.objStartY + dy) }
          : o
      ));
    };
    const handleUp = () => setDragging(null);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => { window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', handleUp); };
  }, [dragging]);

  // ══════════════════════════════════════════════════════════════
  // FORMULA EVALUATION & LIVE COMPUTATION
  // ══════════════════════════════════════════════════════════════
  // ── Available variables for FormulaBuilder ──
  const availableVarsForBuilder = useMemo(() => [
    ...variables.map(v => ({ name: v.name, label: v.label })),
    { name: 't', label: 'Time (animation)' },
    { name: 'pi', label: 'Pi constant' },
    { name: 'e', label: 'Euler number' },
  ], [variables]);

  // ── Live formula preview ──
  const formulaPreview = useMemo(() => {
    if (!formula.trim()) return undefined;
    const vars: Record<string, number> = { t: simTime, pi: Math.PI, e: Math.E };
    variables.forEach(v => { vars[v.name] = v.value; });
    const result = safeEval(formula, vars, NaN);
    return isNaN(result) ? 'Error in formula' : result;
  }, [formula, variables, simTime]);

  // ══════════════════════════════════════════════════════════════
  // MULTI-FORMULA EVALUATION (Phase 1 + 2)
  // Evaluates all formulas and integrates stateful variables
  // ══════════════════════════════════════════════════════════════
  const computedResult = useMemo(() => {
    const vars: Record<string, number> = { t: simTime, pi: Math.PI, e: Math.E };
    variables.forEach(v => { vars[v.name] = v.value; });
    // Inject stateful accumulated values (e.g., velocity, position)
    Object.entries(statefulVarsRef.current).forEach(([k, v]) => { vars[k] = v; });
    // Evaluate all enabled multi-formulas and store results
    const results: Record<string, number> = {};
    formulas.filter(f => f.enabled).forEach(f => {
      results[f.resultName] = safeEval(f.expression, vars, 0);
    });
    // Also store in vars so formulas can reference each other
    Object.entries(results).forEach(([k, v]) => { vars[k] = v; });
    // Return the primary formula result (backward compatible)
    return safeEval(formula, vars, 0);
  }, [formula, variables, simTime, formulas, statefulVarNames]);

  // ── Stateful variable integration (runs after render, not inside useMemo) ──
  useEffect(() => {
    if (!isRunning) return;
    const dt = 1 / 60;
    const vars: Record<string, number> = { t: simTime, pi: Math.PI, e: Math.E };
    variables.forEach(v => { vars[v.name] = v.value; });
    Object.entries(statefulVarsRef.current).forEach(([k, v]) => { vars[k] = v; });
    const results: Record<string, number> = {};
    formulas.filter(f => f.enabled).forEach(f => {
      results[f.resultName] = safeEval(f.expression, vars, 0);
    });
    statefulVarNames.forEach(name => {
      const val = results[name] ?? 0;
      statefulVarsRef.current[name] = (statefulVarsRef.current[name] ?? 0) + val * dt;
    });
  }, [simTime, isRunning, formulas, statefulVarNames, variables]);

  // ══════════════════════════════════════════════════════════════
  // ANIMATION LOOP
  // ══════════════════════════════════════════════════════════════
  const animateRef = useRef<((timestamp: number) => void) | null>(null);
  animateRef.current = (timestamp: number) => {
    if (lastTimeRef.current !== null) {
      const delta = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      setSimTime(prev => prev + delta * speed);
    }
    lastTimeRef.current = timestamp;
    requestRef.current = requestAnimationFrame(animateRef.current!);
  };

  useEffect(() => {
    if (isRunning) {
      lastTimeRef.current = null;
      requestRef.current = requestAnimationFrame(animateRef.current!);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isRunning, speed]);

  // ══════════════════════════════════════════════════════════════
  // COMPUTE OBJECT POSITIONS FROM FORMULA RESULT
  // Objects with x/y-position/size/rotation/color/opacity behaviors
  // ALWAYS animate using simTime so the scene is always alive.
  // The formula result acts as a "velocity" or "amplitude" multiplier.
  // ══════════════════════════════════════════════════════════════
  const computedObjects = useMemo(() => {
    return objects.map(obj => {
      const result = computedResult;
      let cx = obj.x;
      let cy = obj.y;
      let csize = obj.size;
      let cangle = 0;
      let copacity = 1;
      let ccolor = obj.color;

      switch (obj.behavior) {
        case 'x-position': {
          // Position is directly proportional to formula result (e.g., F=ma)
          // Object moves LEFT based on force value — more force = more displacement
          cx = obj.x + result * obj.sensitivity;
          break;
        }
        case 'y-position': {
          // Position is directly proportional to formula result
          cy = obj.y + result * obj.sensitivity;
          break;
        }
        case 'size': {
          // Size scales proportionally with formula result
          csize = Math.max(1, Math.abs(obj.size + result * obj.sensitivity * 0.1));
          break;
        }
        case 'rotation': {
          // Rotation speed is proportional to formula result
          const rotSpeed = result !== 0 ? result : 0;
          cangle = simTime * rotSpeed * obj.sensitivity * 0.5;
          break;
        }
        // ═══════════════════════════════════════════════
        // PHYSICS ENGINE PRIMITIVES
        // ═══════════════════════════════════════════════
        case 'gravity': {
          // Free fall: all objects accelerate at g regardless of mass
          const g = (result !== 0 ? Math.abs(result) : 9.8) * obj.sensitivity * 0.15;
          const dt = 1 / 60;
          const vel = physicsVelRef.current.get(obj.id) || { vx: 0, vy: 0 };
          const pos = physicsPosRef.current.get(obj.id) || { x: obj.x, y: obj.y };
          vel.vy += g * dt * 60; // scale to pixels
          pos.y += vel.vy * dt * 60;
          // Bounce off bottom
          if (pos.y > 470) { pos.y = 470; vel.vy = -vel.vy * (obj.restitution ?? 0.5); }
          if (pos.y < 10) { pos.y = 10; vel.vy = Math.abs(vel.vy) * (obj.restitution ?? 0.5); }
          cx = pos.x; cy = pos.y;
          physicsVelRef.current.set(obj.id, vel);
          physicsPosRef.current.set(obj.id, pos);
          break;
        }
        case 'friction': {
          // Object slides with force and friction deceleration
          const mu = obj.friction ?? 0.3;
          const force = result !== 0 ? result : 10;
          const dt2 = 1 / 60;
          const vel2 = physicsVelRef.current.get(obj.id) || { vx: 0, vy: 0 };
          const pos2 = physicsPosRef.current.get(obj.id) || { x: obj.x, y: obj.y };
          // Apply driving force
          vel2.vx += force * dt2 * obj.sensitivity * 0.3;
          // Apply kinetic friction deceleration (opposes velocity)
          const frictionAccel = mu * 9.8 * 60;
          if (vel2.vx > 0) vel2.vx = Math.max(0, vel2.vx - frictionAccel * dt2);
          else if (vel2.vx < 0) vel2.vx = Math.min(0, vel2.vx + frictionAccel * dt2);
          pos2.x += vel2.vx * dt2 * 60;
          // Bounce off walls
          if (pos2.x > 770) { pos2.x = 770; vel2.vx = -vel2.vx * (obj.restitution ?? 0.5); }
          if (pos2.x < 30) { pos2.x = 30; vel2.vx = -vel2.vx * (obj.restitution ?? 0.5); }
          cx = pos2.x; cy = pos2.y;
          physicsVelRef.current.set(obj.id, vel2);
          physicsPosRef.current.set(obj.id, pos2);
          break;
        }
        case 'collision': {
          // Bouncing ball with gravity and wall collisions
          const bounciness = obj.restitution ?? 0.7;
          const dt3 = 1 / 60;
          const vel3 = physicsVelRef.current.get(obj.id) || { vx: (result !== 0 ? result : 5) * obj.sensitivity * 0.5, vy: -3 };
          const pos3 = physicsPosRef.current.get(obj.id) || { x: obj.x, y: obj.y };
          // Gravity pulls down
          vel3.vy += (result !== 0 ? Math.abs(result) * 0.15 : 0.5) * dt3 * 60;
          pos3.x += vel3.vx * dt3 * 60;
          pos3.y += vel3.vy * dt3 * 60;
          // Bounce off walls
          const radius = obj.size * 4;
          if (pos3.x < radius) { pos3.x = radius; vel3.vx = Math.abs(vel3.vx) * bounciness; }
          if (pos3.x > 800 - radius) { pos3.x = 800 - radius; vel3.vx = -Math.abs(vel3.vx) * bounciness; }
          if (pos3.y < radius) { pos3.y = radius; vel3.vy = Math.abs(vel3.vy) * bounciness; }
          if (pos3.y > 500 - radius) { pos3.y = 500 - radius; vel3.vy = -Math.abs(vel3.vy) * bounciness; }
          cx = pos3.x; cy = pos3.y;
          physicsVelRef.current.set(obj.id, vel3);
          physicsPosRef.current.set(obj.id, pos3);
          break;
        }
        case 'spring': {
          // Spring oscillator: F = -k * displacement - damping * velocity
          const anchorX = obj.anchorX ?? obj.x;
          const anchorY = obj.anchorY ?? obj.y - 100;
          const k = obj.springK ?? (result !== 0 ? Math.abs(result) : 5) * obj.sensitivity * 0.5;
          const damp = obj.damping ?? 0.03;
          const mass4 = obj.mass || 5;
          const dt4 = 1 / 60;
          const vel4 = physicsVelRef.current.get(obj.id) || { vx: 0, vy: 0 };
          const pos4 = physicsPosRef.current.get(obj.id) || { x: obj.x, y: obj.y };
          // Spring force from current physics position (not original)
          const sdx = pos4.x - anchorX;
          const sdy = pos4.y - anchorY;
          const fx = -k * sdx - damp * vel4.vx * mass4;
          const fy = -k * sdy - damp * vel4.vy * mass4;
          vel4.vx += (fx / mass4) * dt4 * 60;
          vel4.vy += (fy / mass4) * dt4 * 60;
          pos4.x += vel4.vx * dt4 * 60;
          pos4.y += vel4.vy * dt4 * 60;
          cx = pos4.x; cy = pos4.y;
          physicsVelRef.current.set(obj.id, vel4);
          physicsPosRef.current.set(obj.id, pos4);
          break;
        }
        case 'color': {
          // Color brightness/intensity proportional to formula result magnitude
          const intensity = Math.min(1, Math.abs(result) * obj.sensitivity / 50);
          const r = parseInt(obj.color.slice(1, 3), 16);
          const g = parseInt(obj.color.slice(3, 5), 16);
          const b = parseInt(obj.color.slice(5, 7), 16);
          const nr = Math.min(255, Math.round(r + (255 - r) * intensity));
          const ng = Math.min(255, Math.round(g + (255 - g) * intensity));
          const nb = Math.min(255, Math.round(b + (255 - b) * intensity));
          ccolor = `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
          break;
        }
        case 'opacity': {
          // Opacity proportional to formula result magnitude
          copacity = Math.max(0.1, Math.min(1, Math.abs(result) * obj.sensitivity / 30));
          break;
        }
      }
      // Record trail positions for objects that move
      if (showTrails && (obj.behavior === 'x-position' || obj.behavior === 'y-position' || obj.behavior === 'gravity' || obj.behavior === 'friction' || obj.behavior === 'collision' || obj.behavior === 'spring')) {
        if (!trailRef.current.has(obj.id)) trailRef.current.set(obj.id, []);
        const trail = trailRef.current.get(obj.id)!;
        const lastPt = trail[trail.length - 1];
        // Only add if moved enough to avoid tiny noise
        if (!lastPt || Math.abs(lastPt.x - cx) > 0.5 || Math.abs(lastPt.y - cy) > 0.5) {
          trail.push({ x: cx, y: cy });
          if (trail.length > trailLength) trail.shift();
        }
      }
      return { ...obj, cx, cy, csize, cangle, copacity, ccolor };
    });
  }, [objects, computedResult, simTime, showTrails, trailLength]);

  // Clear trails and physics state for objects that no longer exist
  useEffect(() => {
    const objIds = new Set(objects.map(o => o.id));
    for (const key of trailRef.current.keys()) {
      if (!objIds.has(key)) trailRef.current.delete(key);
    }
    for (const key of physicsVelRef.current.keys()) {
      if (!objIds.has(key)) physicsVelRef.current.delete(key);
    }
    for (const key of physicsPosRef.current.keys()) {
      if (!objIds.has(key)) physicsPosRef.current.delete(key);
    }
  }, [objects]);

  // ══════════════════════════════════════════════════════════════
  // CONVERT TO LEGACY FORMAT FOR SAVE
  // ══════════════════════════════════════════════════════════════
  const handleSave = () => {
    const legacySim: SavedSimulation = {
      id: simId || `sim-${Math.random().toString(36).substring(2, 11)}`,
      name: simName.trim() || 'Untitled Simulation',
      description: `${resultName} = ${formula} (${resultUnit})`,
      category: selectedLawId ? PHYSICS_LAWS.find(l => l.id === selectedLawId)?.category || 'Custom' : 'Custom',
      createdAt: Date.now(),
      variables: variables.map(v => ({
        name: v.name, label: `${v.label} (${v.unit})`, value: v.value,
        min: v.min, max: v.max, step: v.step,
      })),
      equations: formula.trim() ? [{ name: resultName, expression: formula }] : [],
      shapes: objects.map(obj => ({
        id: obj.id,
        type: (['ball', 'block', 'circle', 'rectangle', 'text', 'ground'].includes(obj.type) ? obj.type : 'circle') as any,
        color: obj.color,
        xExpr: String(obj.x),
        yExpr: String(obj.y),
        radiusExpr: obj.type === 'ball' || obj.type === 'circle' ? String(obj.size * 4) : '10',
        widthExpr: obj.type === 'block' || obj.type === 'rectangle' ? String(obj.size * 8) : '20',
        heightExpr: obj.type === 'block' || obj.type === 'rectangle' ? String(obj.size * 8) : '20',
        strokeWidth: '3',
        textExpr: obj.type === 'text' ? `"${obj.label}"` : '""',
        fontSizeExpr: String(obj.size * 4),
      })),
    };
    customSimService.saveSimulation(legacySim);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // ══════════════════════════════════════════════════════════════
  // EXPORT / IMPORT
  // ══════════════════════════════════════════════════════════════
  const handleExport = () => {
    const data = { simName, selectedLawId, formula, resultName, resultUnit, variables, objects };
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
          const data = JSON.parse(ev.target?.result as string);
          setSimName(data.simName || 'Imported');
          setSelectedLawId(data.selectedLawId);
          setFormula(data.formula || '');
          setResultName(data.resultName || 'Result');
          setResultUnit(data.resultUnit || '');
          setVariables(data.variables || []);
          setObjects(data.objects || []);
        } catch { alert('Invalid simulation file.'); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // ══════════════════════════════════════════════════════════════
  // SELECTED OBJECT
  // ══════════════════════════════════════════════════════════════
  const selectedObj = objects.find(o => o.id === selectedObjectId);

  // Clear trails on reset
  const handleReset = () => { setSimTime(0); setIsRunning(false); trailRef.current.clear(); physicsVelRef.current.clear(); physicsPosRef.current.clear(); statefulVarsRef.current = {}; setLogData([]); setMeasuredFreq(0); };

  // ── Data Logging: record data every 50ms ──
  useEffect(() => {
    if (!isRunning || logPaused) return;
    logIntervalRef.current = window.setInterval(() => {
      setLogData(prev => {
        const vars: Record<string, number> = { t: simTime, pi: Math.PI, e: Math.E };
        variables.forEach(v => { vars[v.name] = v.value; });
        formulas.filter(f => f.enabled).forEach(f => { vars[f.resultName] = safeEval(f.expression, vars, 0); });
        vars[resultName] = safeEval(formula, vars, 0);
        const newPt: DataPoint = { t: simTime, values: { ...vars } };
        const updated = [...prev, newPt];
        if (updated.length > 500) updated.splice(0, updated.length - 500);
        return updated;
      });
    }, 50);
    return () => clearInterval(logIntervalRef.current);
  }, [isRunning, logPaused, simTime, variables, formulas, formula, resultName]);

  // ══════════════════════════════════════════════════════════════
  // STEP LABELS
  // ══════════════════════════════════════════════════════════════
  const stepLabels = ['1. Choose Formula', '2. Variables', '3. Objects & Behaviors', '4. Preview & Run'];

  // ══════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════
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
              <Zap className="w-5 h-5 text-amber-500" /> Simple Simulation Builder
            </h1>
            <p className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              One Formula → One Result → Everything Moves
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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

      {/* ═══ WIZARD STEP BAR ═══ */}
      <div className={`flex items-center gap-1 px-4 sm:px-6 py-3 border-b overflow-x-auto ${isDark ? 'bg-[#0a0a0c] border-slate-800/50' : 'bg-slate-50 border-slate-200'}`}>
        {stepLabels.map((label, i) => {
          const num = (i + 1) as 1 | 2 | 3 | 4;
          const isActive = step === num;
          const isPast = step > num;
          return (
            <React.Fragment key={num}>
              <button onClick={() => setStep(num)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive ? 'bg-indigo-600 text-white shadow-md'
                  : isPast ? (isDark ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/40' : 'bg-emerald-50 text-emerald-600 border border-emerald-200')
                  : (isDark ? 'bg-slate-800/50 text-slate-500 border border-slate-800' : 'bg-white text-slate-400 border border-slate-200')
                }`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                  isActive ? 'bg-white text-indigo-600' : isPast ? 'bg-emerald-500 text-white' : (isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-400')
                }`}>{isPast ? '✓' : num}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
              {i < 3 && <ChevronRight size={12} className={isDark ? 'text-slate-700' : 'text-slate-300'} />}
            </React.Fragment>
          );
        })}
        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
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

      {/* ═══ SIMULATION NAME ═══ */}
      <div className={`flex items-center gap-3 px-4 sm:px-6 py-2 border-b ${isDark ? 'bg-[#0c0c0e] border-slate-800/30' : 'bg-white border-slate-100'}`}>
        <input type="text" value={simName} onChange={(e) => setSimName(e.target.value)}
          className={`flex-1 bg-transparent outline-none text-sm font-bold ${isDark ? 'text-white placeholder:text-slate-600' : 'text-slate-800 placeholder:text-slate-300'}`}
          placeholder="Give your simulation a name..." />
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-1 flex overflow-hidden">

        {/* ════════════════════════════════════════════════════════
            STEP 1: CHOOSE FORMULA — Gallery of Physics Laws
            ════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="flex-1 overflow-y-auto p-6">
            {/* Onboarding Banner */}
            {showOnboarding && (
              <div className={`mb-6 p-5 rounded-2xl border ${isDark ? 'bg-indigo-950/30 border-indigo-800/40' : 'bg-indigo-50 border-indigo-200'}`}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🎯</span>
                  <div className="flex-1">
                    <h3 className={`text-sm font-extrabold mb-1 ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
                      Welcome! Building a simulation is as easy as 1-2-3
                    </h3>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-indigo-400/80' : 'text-indigo-600'}`}>
                      <strong>Step 1:</strong> Pick a formula (like F = m × a) — this single formula drives everything.<br/>
                      <strong>Step 2:</strong> Adjust the variables (mass, acceleration, etc.) with sliders.<br/>
                      <strong>Step 3:</strong> Add visual objects and connect them to the formula.<br/>
                      <strong>Step 4:</strong> Watch your simulation come alive! 🚀
                    </p>
                    <button onClick={() => setShowOnboarding(false)} className={`mt-2 text-[10px] font-bold ${isDark ? 'text-indigo-500 hover:text-indigo-300' : 'text-indigo-500 hover:text-indigo-700'}`}>
                      Got it, dismiss →
                    </button>
                  </div>
                </div>
              </div>
            )}

            <h2 className={`text-lg font-extrabold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              🎯 Choose Your Formula
            </h2>
            <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Pick a physics law below, or write your own custom formula. This <strong>one formula</strong> will drive your entire simulation.
            </p>

            {/* Custom Formula Builder Modal */}
            {showFormulaBuilder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowFormulaBuilder(false)}>
                <div className="w-[480px] max-w-[95vw]" onClick={(e) => e.stopPropagation()}>
                  <FormulaBuilder
                    value={formula}
                    onChange={setFormula}
                    availableVariables={availableVarsForBuilder}
                    onClose={() => setShowFormulaBuilder(false)}
                    preview={formulaPreview}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PHYSICS_LAWS.map((law) => (
                <button key={law.id} onClick={() => selectLaw(law)}
                  className={`group text-left p-5 rounded-2xl border transition-all hover:scale-[1.02] hover:shadow-xl ${
                    selectedLawId === law.id
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                      : isDark ? 'bg-[#121215] border-slate-800 hover:border-indigo-500/50 hover:bg-[#1a1a1f]' : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50'
                  }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{law.icon}</span>
                    <div>
                      <p className={`text-sm font-extrabold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{law.name}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{law.category}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-2 rounded-xl font-mono text-sm font-bold mb-2 ${isDark ? 'bg-[#0a0a0c] text-indigo-400' : 'bg-slate-50 text-indigo-600'}`}>
                    {law.formula ? `${law.resultName} = ${law.formula}` : 'Write your own formula'}
                  </div>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{law.description}</p>
                  {law.defaultVariables.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {law.defaultVariables.map(v => (
                        <span key={v.name} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                          {v.name} = {v.value} {v.unit}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* ── Enhanced Class 11/12 Physics Presets ── */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">📚</span>
                <h3 className={`text-sm font-extrabold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  Class 11 & 12 Physics Labs
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                  NEW
                </span>
              </div>
              <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Advanced presets with built-in assessment questions, data logging, and step-by-step derivations.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SIMULATION_PRESETS.filter(p => !PHYSICS_LAWS.find(l => l.id === p.id)).map((preset) => (
                  <button key={preset.id} onClick={() => {
                    // Convert enhanced preset to the format selectLaw expects
                    // selectLaw internally populates assessmentQuestions from SIMULATION_PRESETS
                    selectLaw({
                      id: preset.id,
                      name: preset.name,
                      formula: preset.formula,
                      resultName: preset.resultName,
                      resultUnit: preset.resultUnit,
                      description: preset.description,
                      category: preset.category,
                      icon: preset.icon,
                      defaultVariables: preset.defaultVariables.map(v => ({
                        name: v.name, label: v.label, unit: v.unit,
                        value: v.value, min: v.min, max: v.max, step: v.step, color: v.color,
                      })),
                      suggestedObjects: preset.suggestedObjects.map(o => ({
                        type: o.type, label: o.label, x: o.x, y: o.y,
                        size: o.size, color: o.color, behavior: o.behavior,
                        sensitivity: o.sensitivity,
                      })),
                    });
                  }}
                    className={`group text-left p-4 rounded-2xl border transition-all hover:scale-[1.02] hover:shadow-xl ${
                      selectedLawId === preset.id
                        ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/10'
                        : isDark ? 'bg-[#121215] border-slate-800 hover:border-purple-500/50 hover:bg-[#1a1a1f]' : 'bg-white border-slate-200 hover:border-purple-400 hover:bg-purple-50/50'
                    }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{preset.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-extrabold truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{preset.name}</p>
                        <p className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{preset.category}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {preset.questions?.length ? <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold" title={`${preset.questions.length} question(s)`}>📝</span> : null}
                        {preset.dataLog?.enabled ? <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold" title="Data logging enabled">📊</span> : null}
                        {preset.derivation?.length ? <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold" title="Has derivations">📐</span> : null}
                      </div>
                    </div>
                    <div className={`px-2.5 py-1.5 rounded-lg font-mono text-[10px] font-bold mb-1.5 ${isDark ? 'bg-[#0a0a0c] text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                      {preset.formula ? `${preset.resultName} = ${preset.formula}` : 'Custom'}
                    </div>
                    <p className={`text-[10px] leading-tight line-clamp-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{preset.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Formula Quick Entry */}
            {!selectedLawId && (
              <div className={`mt-6 p-5 rounded-2xl border ${isDark ? 'bg-[#121215] border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-sm font-extrabold mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>✍️ Or Write Your Own Formula</h3>
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => setShowFormulaBuilder(true)}
                    className={`flex-1 text-left px-4 py-3 rounded-xl border font-mono text-sm transition-all ${
                      formula
                        ? isDark ? 'bg-[#0a0a0c] border-indigo-500/50 text-white hover:border-indigo-400' : 'bg-slate-50 border-indigo-300 text-slate-800 hover:border-indigo-400'
                        : isDark ? 'bg-[#0a0a0c] border-slate-800 text-slate-500 hover:border-indigo-500/50' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-indigo-300'
                    }`}>
                    <span className="block text-[10px] font-bold mb-1 uppercase tracking-wider">
                      {formula ? '✏️ Edit Formula' : '📝 Click to Open Formula Builder'}
                    </span>
                    <span className="font-mono text-sm">{formula || 'Click here to build your formula...'}</span>
                  </button>
                  <input type="text" value={resultName} onChange={(e) => setResultName(e.target.value)}
                    className={`w-24 px-3 py-3 rounded-xl border font-mono text-sm text-center ${isDark ? 'bg-[#0a0a0c] border-slate-800 text-indigo-400' : 'bg-slate-50 border-slate-200 text-indigo-600'}`}
                    placeholder="Result" />
                  <input type="text" value={resultUnit} onChange={(e) => setResultUnit(e.target.value)}
                    className={`w-20 px-3 py-3 rounded-xl border text-sm text-center ${isDark ? 'bg-[#0a0a0c] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                    placeholder="Unit" />
                  <button onClick={() => { if (formula.trim()) { setStep(2); } }}
                    className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-all">
                    Use This →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            STEP 2: VARIABLES — Simple sliders
            ════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Live preview */}
            <div className="flex-1 p-4">
              <div className={`h-full rounded-2xl border overflow-hidden ${isDark ? 'bg-[#0c0c0e] border-slate-800' : 'bg-white border-slate-200'}`}>
                <svg ref={svgRef} viewBox="0 0 800 500" className="w-full h-full">
                  <defs>
                    <pattern id="grid2" width="25" height="25" patternUnits="userSpaceOnUse">
                      <path d="M 25 0 L 0 0 0 25" fill="none" stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="800" height="500" fill="url(#grid2)" />
                  {computedObjects.map(obj => renderObjectSVG(obj, obj.cx, obj.cy, obj.csize, obj.cangle, obj.copacity, obj.ccolor))}
                </svg>
                {/* Formula Result HUD */}
                <div className={`absolute top-3 left-3 px-3 py-2 rounded-xl text-xs font-mono font-bold shadow-lg ${isDark ? 'bg-black/80 border border-slate-800 text-emerald-400' : 'bg-white/90 border border-slate-200 text-emerald-600'}`}>
                  <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{resultName} =</span>{' '}
                  {computedResult.toFixed(2)} {resultUnit && <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{resultUnit}</span>}
                </div>
              </div>
            </div>

            {/* Right: Variables panel */}
            <div className={`w-96 border-l overflow-y-auto ${isDark ? 'bg-[#0f0f11] border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-sm font-extrabold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>🎛️ Variables</h2>
                    <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      These become sliders. They feed into: <code className="font-mono text-indigo-400">{resultName} = {formula}</code>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowFormulaBuilder(true)} className="flex items-center gap-1 text-[11px] font-extrabold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-xl hover:bg-amber-500/25 transition-all">
                      ✏️ Edit Formula
                    </button>
                    <button onClick={() => {
                      const newF: FormulaEntry = {
                        id: `f-${Date.now()}`,
                        name: `Formula ${formulas.length + 1}`,
                        expression: '',
                        resultName: `result${formulas.length + 1}`,
                        resultUnit: '',
                        enabled: true,
                      };
                      setFormulas([...formulas, newF]);
                    }} className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl hover:bg-emerald-500/25 transition-all">
                      + Formula
                    </button>
                    <button onClick={addVariable} className="flex items-center gap-1 text-[11px] font-extrabold text-indigo-500 bg-indigo-500/10 px-3 py-1.5 rounded-xl hover:bg-indigo-500/25 transition-all">
                      + Add
                    </button>
                  </div>
                  {/* ── Multi-Formula List ── */}
                  {formulas.length > 0 && (
                    <div className="space-y-2 mt-3">
                      <label className={`text-[10px] font-extrabold uppercase ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>📐 Additional Formulas</label>
                      {formulas.map((f, idx) => (
                        <div key={f.id} className={`p-3 rounded-xl border ${isDark ? 'bg-[#0c0c0e] border-slate-800' : 'bg-white border-slate-200'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <input type="text" value={f.name}
                              onChange={(e) => { const nf = [...formulas]; nf[idx] = { ...f, name: e.target.value }; setFormulas(nf); }}
                              className={`flex-1 text-[11px] font-bold px-2 py-1 rounded-lg border ${isDark ? 'bg-[#121214] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                            <button onClick={() => { const nf = [...formulas]; nf[idx] = { ...f, enabled: !f.enabled }; setFormulas(nf); }}
                              className={`text-[10px] px-2 py-1 rounded-lg font-bold transition-all ${f.enabled ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                              {f.enabled ? 'ON' : 'OFF'}
                            </button>
                            <button onClick={() => setFormulas(formulas.filter((_, i) => i !== idx))} className="text-[10px] text-red-400 hover:text-red-600 font-bold">✕</button>
                          </div>
                          <input type="text" value={f.expression}
                            placeholder="e.g., v + a * t"
                            onChange={(e) => { const nf = [...formulas]; nf[idx] = { ...f, expression: e.target.value }; setFormulas(nf); }}
                            className={`w-full text-[11px] font-mono px-2 py-1.5 rounded-lg border mb-1 ${isDark ? 'bg-[#121214] border-slate-700 text-emerald-400' : 'bg-slate-50 border-slate-200 text-emerald-700'}`} />
                          <div className="flex gap-2">
                            <input type="text" value={f.resultName} placeholder="Result name"
                              onChange={(e) => { const nf = [...formulas]; nf[idx] = { ...f, resultName: e.target.value }; setFormulas(nf); }}
                              className={`flex-1 text-[10px] px-2 py-1 rounded-lg border ${isDark ? 'bg-[#121214] border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`} />
                            <input type="text" value={f.resultUnit} placeholder="Unit"
                              onChange={(e) => { const nf = [...formulas]; nf[idx] = { ...f, resultUnit: e.target.value }; setFormulas(nf); }}
                              className={`w-16 text-[10px] px-2 py-1 rounded-lg border ${isDark ? 'bg-[#121214] border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`} />
                          </div>
                          {/* Stateful variable toggle */}
                          <label className="flex items-center gap-2 mt-2 text-[10px] cursor-pointer">
                            <input type="checkbox" checked={statefulVarNames.includes(f.resultName)}
                              onChange={() => {
                                if (statefulVarNames.includes(f.resultName)) {
                                  setStatefulVarNames(statefulVarNames.filter(n => n !== f.resultName));
                                  delete statefulVarsRef.current[f.resultName];
                                } else {
                                  setStatefulVarNames([...statefulVarNames, f.resultName]);
                                  statefulVarsRef.current[f.resultName] = 0;
                                }
                              }}
                              className="accent-emerald-500" />
                            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Accumulate over time (stateful)</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {variables.length === 0 ? (
                  <div className={`text-center py-12 border border-dashed rounded-2xl ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                    <p className="text-xs font-bold mb-1">No variables yet</p>
                    <p className="text-[10px]">Click "+ Add" to create a variable slider.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {variables.map((v, idx) => (
                      <div key={idx} className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-[#121215] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: v.color }} />
                            <input type="text" value={v.name}
                              onChange={(e) => updateVariable(idx, 'name', e.target.value.replace(/[^a-zA-Z]/g, ''))}
                              className={`text-sm font-mono font-bold w-16 bg-transparent outline-none ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}
                              placeholder="Name" />
                          </div>
                          <button onClick={() => removeVariable(idx)} className="p-1 text-slate-500 hover:text-rose-500">
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <input type="text" value={v.label}
                          onChange={(e) => updateVariable(idx, 'label', e.target.value)}
                          className={`w-full text-xs font-semibold bg-transparent outline-none ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
                          placeholder="Display label (e.g. Mass)" />

                        {/* Large value display */}
                        <div className={`text-center py-2 rounded-xl ${isDark ? 'bg-[#0a0a0c]' : 'bg-white'}`}>
                          <span className={`text-2xl font-extrabold font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {v.value.toFixed(1)}
                          </span>
                          <span className={`text-xs ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{v.unit}</span>
                        </div>

                        {/* Slider */}
                        <input type="range" min={v.min} max={v.max} step={v.step} value={v.value}
                          onChange={(e) => updateVariable(idx, 'value', parseFloat(e.target.value))}
                          className="w-full accent-indigo-500 h-2" />

                        {/* Min/Max/Step */}
                        <div className="grid grid-cols-4 gap-2">
                          <div>
                            <label className={`block text-[9px] font-bold mb-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Min</label>
                            <input type="number" step="any" value={v.min}
                              onChange={(e) => updateVariable(idx, 'min', parseFloat(e.target.value) || 0)}
                              className={`w-full px-2 py-1 rounded-lg border text-[10px] text-center ${isDark ? 'bg-[#0a0a0c] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`} />
                          </div>
                          <div>
                            <label className={`block text-[9px] font-bold mb-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Max</label>
                            <input type="number" step="any" value={v.max}
                              onChange={(e) => updateVariable(idx, 'max', parseFloat(e.target.value) || 0)}
                              className={`w-full px-2 py-1 rounded-lg border text-[10px] text-center ${isDark ? 'bg-[#0a0a0c] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`} />
                          </div>
                          <div>
                            <label className={`block text-[9px] font-bold mb-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Step</label>
                            <input type="number" step="any" value={v.step}
                              onChange={(e) => updateVariable(idx, 'step', parseFloat(e.target.value) || 0.1)}
                              className={`w-full px-2 py-1 rounded-lg border text-[10px] text-center ${isDark ? 'bg-[#0a0a0c] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`} />
                          </div>
                          <div>
                            <label className={`block text-[9px] font-bold mb-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Unit</label>
                            <input type="text" value={v.unit}
                              onChange={(e) => updateVariable(idx, 'unit', e.target.value)}
                              className={`w-full px-2 py-1 rounded-lg border text-[10px] text-center ${isDark ? 'bg-[#0a0a0c] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                              placeholder="kg" />
                          </div>
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
            STEP 3: OBJECTS & BEHAVIORS — Drag-and-drop gallery
            ════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Canvas with draggable objects */}
            <div className="flex-1 p-4 relative">
              <div className={`h-full rounded-2xl border overflow-hidden relative ${isDark ? 'bg-[#0c0c0e] border-slate-800' : 'bg-white border-slate-200'}`}>
                {/* Canvas grid */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="grid3" width="25" height="25" patternUnits="userSpaceOnUse">
                        <path d="M 25 0 L 0 0 0 25" fill="none" stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid3)" />
                  </svg>
                </div>

                {/* Formula HUD */}
                <div className={`absolute top-3 left-3 px-3 py-2 rounded-xl text-xs font-mono font-bold shadow-lg z-20 ${isDark ? 'bg-black/80 border border-slate-800 text-emerald-400' : 'bg-white/90 border border-slate-200 text-emerald-600'}`}>
                  <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{resultName} =</span>{' '}
                  {computedResult.toFixed(2)} {resultUnit && <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{resultUnit}</span>}
                </div>

                {/* Drag hint */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-[9px] font-bold z-20 ${isDark ? 'bg-black/60 text-slate-500' : 'bg-white/80 text-slate-400'}`}>
                  🖱️ Drag objects to reposition
                </div>

                {/* Object count */}
                <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-lg text-[9px] font-bold z-20 ${isDark ? 'bg-black/60 text-slate-500' : 'bg-white/80 text-slate-400'}`}>
                  {objects.length} object{objects.length !== 1 ? 's' : ''}
                </div>

                {/* SVG Canvas */}
                <svg ref={svgRef} viewBox="0 0 800 500" className="w-full h-full relative z-10"
                  onClick={(e) => { if (!objectClickedRef.current && e.target === svgRef.current) setSelectedObjectId(null); }}>
                  {/* ── Trail / Trace Rendering ── */}
                  {showTrails && Array.from(trailRef.current.entries()).map(([objId, trail]) => {
                    if (trail.length < 2) return null;
                    const points = trail.map(p => `${p.x},${p.y}`).join(' ');
                    const obj = objects.find(o => o.id === objId);
                    const color = obj?.color || '#6366f1';
                    return (
                      <g key={`trail-${objId}`}>
                        <polyline
                          points={points}
                          fill="none"
                          stroke={color}
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity={0.4}
                        />
                        {/* Trail dots at intervals */}
                        {trail.filter((_, i) => i % 5 === 0 || i === trail.length - 1).map((p, i) => (
                          <circle key={i} cx={p.x} cy={p.y} r={2} fill={color} opacity={0.5} />
                        ))}
                      </g>
                    );
                  })}
                  {/* ── Object Rendering ── */}
                  {computedObjects.map(obj => (
                    <g key={obj.id}
                      style={{ cursor: 'grab' }}
                      onMouseDown={(e) => handleCanvasMouseDown(e, obj.id)}>
                      {renderObjectSVG(obj, obj.cx, obj.cy, obj.csize, obj.cangle, obj.copacity, obj.ccolor)}
                      {/* Selection ring */}
                      {selectedObjectId === obj.id && (
                        <circle cx={obj.cx} cy={obj.cy} r={Math.max(obj.csize * 5, 20)}
                          fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="6 3" className="pointer-events-none" />
                      )}
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Right side panel */}
            <div className={`w-96 border-l flex flex-col ${isDark ? 'bg-[#0f0f11] border-slate-800' : 'bg-white border-slate-200'}`}>
              {/* Object Gallery (top) */}
              <div className={`p-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <h3 className={`text-xs font-extrabold mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  🎨 Object Gallery — Click to Add
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {OBJECT_GALLERY.map((template) => (
                    <button key={template.type} onClick={() => addObjectFromGallery(template)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-all hover:scale-110 hover:shadow-md ${
                        isDark ? 'bg-[#121215] border-slate-800 hover:border-indigo-500/50' : 'bg-slate-50 border-slate-200 hover:border-indigo-400'
                      }`}>
                      <span className="text-lg">{template.icon}</span>
                      <span className={`text-[8px] font-bold leading-tight ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{template.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Object Properties */}
              <div className="flex-1 overflow-y-auto p-4">
                {selectedObj ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                          {selectedObj.type}
                        </span>
                        <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{selectedObj.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => bringToFront(selectedObj.id)} className={`p-1 rounded ${isDark ? 'text-slate-500 hover:text-emerald-400' : 'text-slate-400 hover:text-emerald-600'}`} title="Bring to Front">
                          <ArrowUp size={13} />
                        </button>
                        <button onClick={() => sendToBack(selectedObj.id)} className={`p-1 rounded ${isDark ? 'text-slate-500 hover:text-emerald-400' : 'text-slate-400 hover:text-emerald-600'}`} title="Send to Back">
                          <ArrowDown size={13} />
                        </button>
                        <button onClick={() => duplicateObject(selectedObj)} className={`p-1 rounded ${isDark ? 'text-slate-500 hover:text-blue-400' : 'text-slate-400 hover:text-blue-600'}`} title="Duplicate">
                          <Copy size={13} />
                        </button>
                        <button onClick={() => removeObject(selectedObj.id)} className="p-1 text-slate-500 hover:text-rose-500" title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Label */}
                    <div>
                      <label className={`block text-[9px] font-bold uppercase mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Label</label>
                      <input type="text" value={selectedObj.label}
                        onChange={(e) => updateObject(selectedObj.id, 'label', e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold ${isDark ? 'bg-[#0a0a0c] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                    </div>

                    {/* Color */}
                    <div>
                      <label className={`block text-[9px] font-bold uppercase mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Color</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={selectedObj.color}
                          onChange={(e) => updateObject(selectedObj.id, 'color', e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent" />
                        <input type="text" value={selectedObj.color}
                          onChange={(e) => updateObject(selectedObj.id, 'color', e.target.value)}
                          className={`flex-1 px-3 py-2 rounded-xl border text-xs font-mono ${isDark ? 'bg-[#0a0a0c] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                      </div>
                    </div>

                    {/* Size */}
                    <div>
                      <label className={`block text-[9px] font-bold uppercase mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Size: {selectedObj.size}</label>
                      <input type="range" min={1} max={10} step={0.5} value={selectedObj.size}
                        onChange={(e) => updateObject(selectedObj.id, 'size', parseFloat(e.target.value))}
                        className="w-full accent-indigo-500 h-2" />
                    </div>

                    {/* ═══ THE KEY FEATURE: Formula → Object Behavior ═══ */}
                    <div className={`p-4 rounded-2xl border ${isDark ? 'bg-indigo-950/30 border-indigo-800/40' : 'bg-indigo-50 border-indigo-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap size={14} className="text-amber-500" />
                        <label className={`text-xs font-extrabold ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
                          Formula → This Object
                        </label>
                      </div>
                      <p className={`text-[10px] mb-3 ${isDark ? 'text-indigo-400/70' : 'text-indigo-500'}`}>
                        What should <code className="font-mono font-bold">{resultName}</code> control?
                      </p>

                      <div className="space-y-1.5">
                        {BEHAVIOR_OPTIONS.map((opt) => (
                          <button key={opt.value}
                            onClick={() => updateObject(selectedObj.id, 'behavior', opt.value)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                              selectedObj.behavior === opt.value
                                ? 'bg-indigo-600 text-white shadow-md'
                                : isDark ? 'bg-[#0a0a0c] text-slate-300 hover:bg-[#1a1a1f] border border-slate-800' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}>
                            {opt.icon}
                            <div className="flex-1">
                              <p className="text-xs font-bold">{opt.label}</p>
                              <p className={`text-[9px] ${selectedObj.behavior === opt.value ? 'text-indigo-200' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>{opt.description}</p>
                            </div>
                            {selectedObj.behavior === opt.value && <Check size={14} />}
                          </button>
                        ))}
                      </div>

                      {/* Sensitivity slider */}
                      {selectedObj.behavior !== 'none' && (
                        <div className="mt-3">
                          <label className={`block text-[9px] font-bold mb-1 ${isDark ? 'text-indigo-400/70' : 'text-indigo-500'}`}>
                            Sensitivity: {selectedObj.sensitivity.toFixed(1)} — How much formula affects this object
                          </label>
                          <input type="range" min={1} max={50} step={1} value={selectedObj.sensitivity}
                            onChange={(e) => updateObject(selectedObj.id, 'sensitivity', parseFloat(e.target.value))}
                            className="w-full accent-indigo-500 h-2" />
                        </div>
                      )}
                      {/* ── Physics Property Controls ── */}
                      {['gravity', 'friction', 'collision', 'spring'].includes(selectedObj.behavior) && (
                        <div className={`mt-3 p-3 rounded-xl border space-y-3 ${isDark ? 'bg-amber-950/20 border-amber-800/30' : 'bg-amber-50 border-amber-200'}`}>
                          <div className="flex items-center gap-1.5">
                            <Zap size={12} className="text-amber-500" />
                            <span className={`text-[10px] font-extrabold uppercase ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Physics Properties</span>
                          </div>
                          {/* Mass */}
                          <div>
                            <label className={`block text-[9px] font-bold uppercase mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Mass: {selectedObj.mass ?? 5} kg</label>
                            <input type="range" min={0.5} max={20} step={0.5} value={selectedObj.mass ?? 5}
                              onChange={(e) => updateObject(selectedObj.id, 'mass', parseFloat(e.target.value))}
                              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-amber-200 dark:bg-amber-900 accent-amber-500" />
                          </div>
                          {/* Restitution (bounciness) */}
                          {(selectedObj.behavior === 'collision' || selectedObj.behavior === 'gravity') && (
                            <div>
                              <label className={`block text-[9px] font-bold uppercase mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Bounciness: {selectedObj.restitution ?? 0.5}</label>
                              <input type="range" min={0} max={1} step={0.05} value={selectedObj.restitution ?? 0.5}
                                onChange={(e) => updateObject(selectedObj.id, 'restitution', parseFloat(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-amber-200 dark:bg-amber-900 accent-amber-500" />
                            </div>
                          )}
                          {/* Friction coefficient */}
                          {selectedObj.behavior === 'friction' && (
                            <div>
                              <label className={`block text-[9px] font-bold uppercase mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Friction: {selectedObj.friction ?? 0.3}</label>
                              <input type="range" min={0} max={1} step={0.05} value={selectedObj.friction ?? 0.3}
                                onChange={(e) => updateObject(selectedObj.id, 'friction', parseFloat(e.target.value))}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-amber-200 dark:bg-amber-900 accent-amber-500" />
                            </div>
                          )}
                          {/* Spring constant */}
                          {selectedObj.behavior === 'spring' && (
                            <>
                              <div>
                                <label className={`block text-[9px] font-bold uppercase mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Spring Stiffness: {selectedObj.springK ?? 5}</label>
                                <input type="range" min={0.5} max={20} step={0.5} value={selectedObj.springK ?? 5}
                                  onChange={(e) => updateObject(selectedObj.id, 'springK', parseFloat(e.target.value))}
                                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-amber-200 dark:bg-amber-900 accent-amber-500" />
                              </div>
                              <div>
                                <label className={`block text-[9px] font-bold uppercase mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Damping: {selectedObj.damping ?? 0.02}</label>
                                <input type="range" min={0} max={0.2} step={0.005} value={selectedObj.damping ?? 0.02}
                                  onChange={(e) => updateObject(selectedObj.id, 'damping', parseFloat(e.target.value))}
                                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-amber-200 dark:bg-amber-900 accent-amber-500" />
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Position display */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-[9px] font-bold mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>X Position</label>
                        <input type="number" value={selectedObj.x}
                          onChange={(e) => updateObject(selectedObj.id, 'x', parseInt(e.target.value) || 0)}
                          className={`w-full px-3 py-2 rounded-xl border text-xs font-mono text-center ${isDark ? 'bg-[#0a0a0c] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                      </div>
                      <div>
                        <label className={`block text-[9px] font-bold mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Y Position</label>
                        <input type="number" value={selectedObj.y}
                          onChange={(e) => updateObject(selectedObj.id, 'y', parseInt(e.target.value) || 0)}
                          className={`w-full px-3 py-2 rounded-xl border text-xs font-mono text-center ${isDark ? 'bg-[#0a0a0c] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`text-center py-12 space-y-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    <div className="text-3xl">👆</div>
                    <p className="text-xs font-bold">Click an object on the canvas to edit it</p>
                    <p className="text-[10px]">Or add new objects from the gallery above</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            STEP 4: PREVIEW & RUN — Full simulation
            ════════════════════════════════════════════════════════ */}
        {step === 4 && (
          <div className="flex-1 flex flex-col p-4">
            <div className={`flex-1 rounded-2xl border overflow-hidden relative ${isDark ? 'bg-[#0c0c0e] border-slate-800' : 'bg-white border-slate-200'}`}>
              {/* Grid */}
              <div className="absolute inset-0 pointer-events-none opacity-15">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="grid4" width="25" height="25" patternUnits="userSpaceOnUse">
                      <path d="M 25 0 L 0 0 0 25" fill="none" stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid4)" />
                </svg>
              </div>

              {/* Formula HUD */}
              <div className={`absolute top-4 left-4 px-4 py-2.5 rounded-xl text-sm font-mono font-bold shadow-xl z-20 ${isDark ? 'bg-black/80 border border-slate-800 text-emerald-400' : 'bg-white/90 border border-slate-200 text-emerald-600'}`}>
                <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{resultName} =</span>{' '}
                <span className="text-lg">{computedResult.toFixed(2)}</span>{' '}
                {resultUnit && <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{resultUnit}</span>}
              </div>

              {/* Time HUD */}
              <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-xl text-xs font-mono font-bold shadow-xl z-20 ${isDark ? 'bg-black/80 border border-slate-800 text-cyan-400' : 'bg-white/90 border border-slate-200 text-cyan-600'}`}>
                t = {simTime.toFixed(2)}s
              </div>

              {/* SVG Canvas */}
              <svg viewBox="0 0 800 500" className="w-full h-full relative z-10">
                {computedObjects.map(obj => (
                  <g key={obj.id}>
                    {renderObjectSVG(obj, obj.cx, obj.cy, obj.csize, obj.cangle, obj.copacity, obj.ccolor)}
                    {/* Object labels */}
                    {obj.type !== 'text' && obj.type !== 'ground' && (
                      <text x={obj.cx} y={obj.cy + obj.csize * 6 + 12} fill={isDark ? '#94a3b8' : '#64748b'}
                        fontSize="10" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">
                        {obj.label}
                      </text>
                    )}
                  </g>
                ))}
              </svg>
            </div>

            {/* Controls Bar */}
            <div className={`mt-4 p-4 rounded-2xl border ${isDark ? 'bg-[#0f0f11] border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Playback */}
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsRunning(!isRunning)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md ${
                      isRunning ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg'
                    }`}>
                    {isRunning ? <><Pause size={16} /> Pause</> : <><Play size={16} fill="currentColor" /> Run Simulation</>}
                  </button>
                  <button onClick={handleReset}
                    className={`p-3 rounded-xl border transition-colors ${isDark ? 'border-slate-800 hover:bg-slate-800/80 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}
                    title="Reset">
                    <RotateCcw size={16} />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Speed:</span>
                    <select value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))}
                      className={`text-xs rounded-xl border px-3 py-2 font-bold outline-none cursor-pointer ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                      <option value="0.25">0.25×</option>
                      <option value="0.5">0.5×</option>
                      <option value="1">1×</option>
                      <option value="1.5">1.5×</option>
                      <option value="2">2×</option>
                    </select>
                  </div>
                  {/* ── Trail / Trace Toggle ── */}
                  <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-300 dark:border-slate-700">
                    <button
                      onClick={() => { setShowTrails(!showTrails); if (!showTrails) trailRef.current.clear(); }}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        showTrails
                          ? 'bg-amber-500 border-amber-600 text-white shadow-md'
                          : isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-amber-600'
                      }`}
                    >
                      <Eye size={14} />
                      {showTrails ? 'Trails ON' : 'Trails'}
                    </button>
                    {showTrails && (
                      <select value={trailLength} onChange={(e) => setTrailLength(parseInt(e.target.value))}
                        className={`text-xs rounded-xl border px-2 py-1.5 font-bold outline-none cursor-pointer ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                        <option value={15}>15 pts</option>
                        <option value={30}>30 pts</option>
                        <option value={60}>60 pts</option>
                        <option value={100}>100 pts</option>
                      </select>
                    )}
                  </div>
                </div>

                {/* Variable Sliders */}
                <div className="flex items-center gap-6 flex-wrap">
                  {variables.map(v => (
                    <div key={v.name} className="flex flex-col gap-1 min-w-[120px]">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {v.label} <code className="font-mono text-indigo-400 ml-0.5">{v.name}</code>
                        </span>
                        <span className="font-mono text-indigo-500 font-bold">{v.value.toFixed(1)}</span>
                      </div>
                      <input type="range" min={v.min} max={v.max} step={v.step} value={v.value}
                        onChange={(e) => updateVariable(variables.indexOf(v), 'value', parseFloat(e.target.value))}
                        className="accent-indigo-500 h-1.5" />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* ── Data Logging Chart ── */}
              {isRunning && logData.length > 1 && (
                <div className="mt-4">
                  <SimulationDataChart
                    data={logData}
                    variables={[resultName, ...variables.map(v => v.name).filter(n => n !== resultName)]}
                    title={`${resultName} vs Time`}
                    onClear={() => setLogData([])}
                    isPaused={logPaused}
                    onTogglePause={() => setLogPaused(!logPaused)}
                  />
                </div>
              )}

              {/* ── Assessment / Quiz Section ── */}
              {assessmentQuestions.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => setShowAssessment(!showAssessment)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {showAssessment ? 'Hide' : 'Show'} Assessment ({assessmentQuestions.length} questions)
                    </button>
                    {!showAssessment && assessmentScore > 0 && (
                      <span className={`text-xs font-bold ${assessmentScore === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        Score: {assessmentScore}%
                      </span>
                    )}
                  </div>
                  {showAssessment && (
                    <AssessmentPanel
                      title="Physics Assessment"
                      questions={assessmentQuestions}
                      onScoreUpdate={(correct, total) => {
                        setAssessmentScore(Math.round((correct / total) * 100));
                      }}
                    />
                  )}
                </div>
              )}

              {/* Empty state when no data and no assessments */}
              {!isRunning && assessmentQuestions.length === 0 && logData.length === 0 && (
                <div className={`mt-4 p-6 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <p className="text-xs font-bold">Press "Run Simulation" to start. Logged data appears here.</p>
                  <p className="text-[10px] mt-1">Real-time charts update as the simulation runs.</p>
                </div>
              )}

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
