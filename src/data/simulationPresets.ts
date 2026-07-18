// ═══════════════════════════════════════════════════════════════════
// SIMULATION PRESETS — Class 11 & 12 Physics Level
// Each preset includes formula, variables, suggested objects, and a
// data logging config so students can record & analyze measurements.
// ═══════════════════════════════════════════════════════════════════

export interface PresetVariable {
  name: string;
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
}

export interface PresetObject {
  type: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
  behavior: string;
  sensitivity: number;
  mass?: number;
  restitution?: number;
  friction?: number;
  anchorX?: number;
  anchorY?: number;
  springK?: number;
  damping?: number;
}

export interface PresetQuestion {
  id: string;
  question: string;
  answer: number;
  tolerance: number;
  hint: string;
  unit: string;
}

export interface DataLogConfig {
  enabled: boolean;
  variables: string[];
  maxPoints: number;
  label: string;
}

export interface SimulationPreset {
  id: string;
  name: string;
  formula: string;
  altFormula?: string;        // secondary formula for multi-result
  resultName: string;
  resultUnit: string;
  description: string;
  theory: string;              // short theory explanation
  category: string;
  icon: string;
  defaultVariables: PresetVariable[];
  suggestedObjects: PresetObject[];
  questions?: PresetQuestion[];
  dataLog?: DataLogConfig;
  derivation?: {
    label: string;
    latex: string;
    explanation: string;
  }[];
}

export const SIMULATION_PRESETS: SimulationPreset[] = [
  // ── SHM & WAVES ──
  {
    id: 'shm-mass-spring',
    name: 'SHM: Mass-Spring System',
    formula: 'k * x',
    resultName: 'F', resultUnit: 'N',
    description: 'ω = √(k/m) — Hooke\'s Law & Simple Harmonic Motion',
    theory: 'A mass attached to a spring undergoes SHM. The restoring force F = -kx, and the angular frequency ω = √(k/m). The period T = 2π/ω = 2π√(m/k).',
    category: 'Waves & SHM', icon: '〰️',
    defaultVariables: [
      { name: 'k', label: 'Spring Constant', unit: 'N/m', value: 20, min: 1, max: 100, step: 1, color: '#8b5cf6' },
      { name: 'm', label: 'Mass', unit: 'kg', value: 0.5, min: 0.1, max: 5, step: 0.1, color: '#3b82f6' },
      { name: 'A', label: 'Amplitude', unit: 'm', value: 0.1, min: 0.01, max: 0.5, step: 0.01, color: '#22c55e' },
    ],
    suggestedObjects: [
      { type: 'wall', label: 'Fixed Wall', x: 100, y: 250, size: 4, color: '#64748b', behavior: 'none', sensitivity: 1 },
      { type: 'block', label: 'Mass (m)', x: 550, y: 250, size: 5, color: '#3b82f6', behavior: 'x-position', sensitivity: 1, mass: 0.5 },
      { type: 'spring', label: 'Spring (k)', x: 325, y: 250, size: 3, color: '#8b5cf6', behavior: 'size', sensitivity: 5 },
    ],
    dataLog: { enabled: true, variables: ['x', 'v', 'a', 'F'], maxPoints: 200, label: 'SHM Displacement vs Time' },
    questions: [
      { id: 'shm-q1', question: 'What is the angular frequency ω = √(k/m) given k = 20 N/m and m = 0.5 kg?', answer: 6.32, tolerance: 0.1, hint: 'ω = √(20/0.5) = √40', unit: 'rad/s' },
      { id: 'shm-q2', question: 'What is the period T = 2π/ω? (use the ω calculated above)', answer: 0.994, tolerance: 0.05, hint: 'T = 2π / 6.32', unit: 's' },
    ],
    derivation: [
      { label: "Hooke's Law & Newton's 2nd", latex: "F = -kx\nm·d²x/dt² = -kx\nd²x/dt² + (k/m)x = 0", explanation: "For an ideal spring, restoring force is proportional to displacement. Apply N2L to get the SHM differential equation." },
      { label: "Solution & Angular Frequency", latex: "x(t) = A·cos(ωt + φ)\nω = √(k/m)\nT = 2π√(m/k)", explanation: "The solution is sinusoidal. Substituting into the differential equation gives ω = √(k/m)." },
    ],
  },
  {
    id: 'simple-pendulum',
    name: 'Simple Pendulum',
    formula: '2 * pi * sqrt(L / g)',
    resultName: 'T', resultUnit: 's',
    description: 'T = 2π√(L/g) — Period of a simple pendulum',
    theory: 'For small angles, a pendulum\'s period T = 2π√(L/g) depends only on length L and gravity g, NOT on mass. This is a classic SHM demonstration.',
    category: 'Waves & SHM', icon: '🔔',
    defaultVariables: [
      { name: 'L', label: 'Length', unit: 'm', value: 1.0, min: 0.2, max: 3.0, step: 0.1, color: '#f59e0b' },
      { name: 'g', label: 'Gravity', unit: 'm/s²', value: 9.81, min: 1, max: 20, step: 0.1, color: '#3b82f6' },
    ],
    suggestedObjects: [
      { type: 'ground', label: 'Pivot Support', x: 400, y: 120, size: 3, color: '#94a3b8', behavior: 'none', sensitivity: 1 },
      { type: 'pendulum', label: 'Pendulum Bob', x: 400, y: 120, size: 4, color: '#f59e0b', behavior: 'rotation', sensitivity: 5 },
      { type: 'text', label: 'T = 2π√(L/g)', x: 400, y: 30, size: 3, color: '#a78bfa', behavior: 'none', sensitivity: 1 },
    ],
    dataLog: { enabled: true, variables: ['T', 'L', 'g'], maxPoints: 100, label: 'Period vs Length' },
    questions: [
      { id: 'pend-q1', question: 'T = 2π√(L/g). For L = 1.0 m, g = 9.81 m/s², what is T?', answer: 2.006, tolerance: 0.05, hint: 'T = 2π × √(1.0/9.81)', unit: 's' },
    ],
  },
  {
    id: 'standing-waves',
    name: 'Standing Waves on String',
    formula: 'n * v / (2 * L)',
    resultName: 'f', resultUnit: 'Hz',
    description: 'fₙ = n·v/(2L) — Harmonics on a fixed string',
    theory: 'A string fixed at both ends vibrates at discrete frequencies: fₙ = n·v/(2L), where n = 1,2,3... is the harmonic number, v = √(T/μ) is wave speed, L is length.',
    category: 'Waves & SHM', icon: '🌊',
    defaultVariables: [
      { name: 'n', label: 'Harmonic (n)', unit: '', value: 2, min: 1, max: 6, step: 1, color: '#8b5cf6' },
      { name: 'v', label: 'Wave Speed', unit: 'm/s', value: 100, min: 10, max: 300, step: 5, color: '#06b6d4' },
      { name: 'L', label: 'String Length', unit: 'm', value: 1.0, min: 0.2, max: 3.0, step: 0.1, color: '#22c55e' },
    ],
    suggestedObjects: [
      { type: 'wall', label: 'Fixed End', x: 100, y: 250, size: 3, color: '#64748b', behavior: 'none', sensitivity: 1 },
      { type: 'wall', label: 'Fixed End', x: 700, y: 250, size: 3, color: '#64748b', behavior: 'none', sensitivity: 1 },
      { type: 'wave', label: 'Standing Wave', x: 400, y: 250, size: 3, color: '#06b6d4', behavior: 'size', sensitivity: 3 },
      { type: 'text', label: 'fₙ = nv/2L', x: 400, y: 30, size: 3, color: '#a78bfa', behavior: 'none', sensitivity: 1 },
    ],
    dataLog: { enabled: true, variables: ['f', 'v', 'L', 'n'], maxPoints: 50, label: 'Frequency vs Harmonic' },
    questions: [
      { id: 'wave-q1', question: 'f₃ = 3·v/(2L). v=100, L=1.0 → f₃ = ?', answer: 150, tolerance: 1, hint: 'f = 3 × 100 / (2 × 1.0)', unit: 'Hz' },
    ],
  },
  {
    id: 'doppler-effect',
    name: 'Doppler Effect',
    formula: 'f0 * (v_sound + v_observer) / (v_sound - v_source)',
    resultName: 'f\'', resultUnit: 'Hz',
    description: 'f\' = f₀(v ± vₒ)/(v ∓ vₛ) — observed frequency shift',
    theory: 'When a source moves towards an observer, the observed frequency increases (blueshift). f\' = f₀(v + vₒ)/(v - vₛ). The formula can handle both source and observer motion.',
    category: 'Waves & SHM', icon: '📡',
    defaultVariables: [
      { name: 'f0', label: 'Source Freq', unit: 'Hz', value: 440, min: 100, max: 1000, step: 10, color: '#3b82f6' },
      { name: 'v_sound', label: 'Speed of Sound', unit: 'm/s', value: 343, min: 100, max: 500, step: 1, color: '#06b6d4' },
      { name: 'v_observer', label: 'Observer Speed', unit: 'm/s', value: 0, min: 0, max: 100, step: 1, color: '#22c55e' },
      { name: 'v_source', label: 'Source Speed', unit: 'm/s', value: 30, min: 0, max: 100, step: 1, color: '#ef4444' },
    ],
    suggestedObjects: [
      { type: 'ball', label: 'Moving Source', x: 200, y: 250, size: 5, color: '#ef4444', behavior: 'x-position', sensitivity: 3 },
      { type: 'arrow-right', label: 'Velocity', x: 300, y: 300, size: 3, color: '#f59e0b', behavior: 'size', sensitivity: 5 },
      { type: 'text', label: 'Doppler Shift', x: 400, y: 60, size: 3, color: '#a78bfa', behavior: 'none', sensitivity: 1 },
    ],
    dataLog: { enabled: true, variables: ["f'", 'f0', 'v_source'], maxPoints: 100, label: 'Observed Frequency vs Source Speed' },
    questions: [
      { id: 'dop-q1', question: 'f\' = 440 × 343 / (343 - 30). What is f\'?', answer: 481.73, tolerance: 0.5, hint: 'f\' = 440 × 343 / 313', unit: 'Hz' },
    ],
  },

  // ── GRAVITATION ──
  {
    id: 'universal-gravitation',
    name: 'Universal Gravitation',
    formula: 'G * m1 * m2 / (r * r)',
    resultName: 'Fg', resultUnit: 'N',
    description: 'F = G·m₁·m₂/r² — Newton\'s Universal Law of Gravitation',
    theory: 'Every particle attracts every other particle with force F = G·m₁·m₂/r², where G = 6.67×10⁻¹¹ N·m²/kg². This law governs planetary motion, tides, and free fall.',
    category: 'Gravitation', icon: '🌍',
    defaultVariables: [
      { name: 'G', label: 'Grav. Constant', unit: '×10⁻¹¹', value: 6.67, min: 1, max: 10, step: 0.1, color: '#64748b' },
      { name: 'm1', label: 'Mass 1', unit: 'kg', value: 5.97e24, min: 1e22, max: 1e26, step: 1e23, color: '#3b82f6' },
      { name: 'm2', label: 'Mass 2', unit: 'kg', value: 1000, min: 1, max: 1e5, step: 10, color: '#f59e0b' },
      { name: 'r', label: 'Distance', unit: 'm', value: 6.37e6, min: 1e6, max: 1e8, step: 1e5, color: '#22c55e' },
    ],
    suggestedObjects: [
      { type: 'ball', label: 'Earth (m₁)', x: 250, y: 250, size: 8, color: '#3b82f6', behavior: 'none', sensitivity: 1 },
      { type: 'ball', label: 'Object (m₂)', x: 500, y: 250, size: 3, color: '#f59e0b', behavior: 'x-position', sensitivity: 2 },
      { type: 'spring', label: 'Gravity Force', x: 375, y: 250, size: 3, color: '#a78bfa', behavior: 'size', sensitivity: 3 },
    ],
    questions: [
      { id: 'grav-q1', question: 'g = G·M/R². Earth M = 5.97×10²⁴, R = 6.37×10⁶, G = 6.67×10⁻¹¹. What is g?', answer: 9.81, tolerance: 0.05, hint: 'g = 6.67e-11 × 5.97e24 / (6.37e6)²', unit: 'm/s²' },
    ],
    derivation: [
      { label: "Universal Law of Gravitation", latex: "F = G·m₁·m₂/r²\nG = 6.67×10⁻¹¹ N·m²/kg²", explanation: "Newton deduced that the same force causing an apple to fall keeps the Moon in orbit. The force is proportional to both masses and inversely proportional to the square of the distance." },
      { label: "Acceleration due to Gravity", latex: "F = mg = G·M·m/R²\ng = G·M/R²", explanation: "For an object on Earth's surface, m cancels out. All objects fall at the same rate g = 9.81 m/s² regardless of mass." },
    ],
  },
  {
    id: 'orbital-velocity',
    name: 'Orbital Velocity',
    formula: 'sqrt(G * M / R)',
    resultName: 'v_orb', resultUnit: 'm/s',
    description: 'vₒᵣ𝒷 = √(GM/R) — velocity for circular orbit',
    theory: 'A satellite in circular orbit balances gravitational force with centripetal force: GMm/R² = mv²/R → v = √(GM/R). Geostationary orbit requires v such that T = 24h.',
    category: 'Gravitation', icon: '🛰️',
    defaultVariables: [
      { name: 'G', label: 'Grav. Constant', unit: '', value: 6.67, min: 1, max: 10, step: 0.1, color: '#64748b' },
      { name: 'M', label: 'Central Mass', unit: 'kg', value: 5.97e24, min: 1e22, max: 1e30, step: 1e23, color: '#f59e0b' },
      { name: 'R', label: 'Orbit Radius', unit: 'm', value: 7.0e6, min: 6.4e6, max: 4.2e7, step: 1e5, color: '#06b6d4' },
    ],
    suggestedObjects: [
      { type: 'ball', label: 'Planet', x: 400, y: 250, size: 7, color: '#f59e0b', behavior: 'none', sensitivity: 1 },
      { type: 'star', label: 'Satellite', x: 550, y: 250, size: 3, color: '#06b6d4', behavior: 'x-position', sensitivity: 2 },
    ],
    questions: [
      { id: 'orb-q1', question: 'v = √(6.67×10⁻¹¹ × 5.97×10²⁴ / 7×10⁶). What is v?', answer: 7540, tolerance: 50, hint: 'v = √(3.98×10¹⁴ / 7×10⁶) = √(5.69×10⁷)', unit: 'm/s' },
    ],
  },
  {
    id: 'escape-velocity',
    name: 'Escape Velocity',
    formula: 'sqrt(2 * G * M / R)',
    resultName: 'v_esc', resultUnit: 'm/s',
    description: 'vₑₛ𝒸 = √(2GM/R) — minimum speed to escape gravity',
    theory: 'Escape velocity is the minimum speed needed for an object to break free from a celestial body\'s gravitational pull. From energy conservation: ½mv² = GMm/R.',
    category: 'Gravitation', icon: '🚀',
    defaultVariables: [
      { name: 'G', label: 'Grav. Constant', unit: '', value: 6.67, min: 1, max: 10, step: 0.1, color: '#64748b' },
      { name: 'M', label: 'Planet Mass', unit: 'kg', value: 5.97e24, min: 1e22, max: 1e30, step: 1e23, color: '#f59e0b' },
      { name: 'R', label: 'Planet Radius', unit: 'm', value: 6.37e6, min: 1e6, max: 7e7, step: 1e5, color: '#ef4444' },
    ],
    suggestedObjects: [
      { type: 'ball', label: 'Planet', x: 400, y: 300, size: 7, color: '#3b82f6', behavior: 'none', sensitivity: 1 },
      { type: 'arrow-up', label: 'Escape', x: 400, y: 200, size: 4, color: '#ef4444', behavior: 'size', sensitivity: 3 },
    ],
    questions: [
      { id: 'esc-q1', question: 'v_esc = √(2×6.67×10⁻¹¹×5.97×10²⁴/6.37×10⁶) = ?', answer: 11180, tolerance: 100, hint: '≈ 11.2 km/s', unit: 'm/s' },
    ],
  },
  {
    id: 'kepler-third',
    name: 'Kepler\'s 3rd Law',
    formula: '2 * pi * sqrt(a^3 / (G * M))',
    resultName: 'T', resultUnit: 's',
    description: 'T² ∝ a³ — Square of period ∝ cube of semi-major axis',
    theory: 'T² = (4π²/GM)·a³. The square of a planet\'s orbital period is proportional to the cube of its average distance from the Sun. This applies to all orbiting bodies.',
    category: 'Gravitation', icon: '🪐',
    defaultVariables: [
      { name: 'G', label: 'Grav. Constant', unit: '', value: 6.67, min: 1, max: 10, step: 0.1, color: '#64748b' },
      { name: 'M', label: 'Sun Mass', unit: 'kg', value: 1.99e30, min: 1e28, max: 1e32, step: 1e29, color: '#f59e0b' },
      { name: 'a', label: 'Semi-Major Axis', unit: 'm', value: 1.5e11, min: 5e10, max: 1e12, step: 1e10, color: '#06b6d4' },
    ],
    suggestedObjects: [
      { type: 'sun', label: 'Sun', x: 400, y: 250, size: 6, color: '#f59e0b', behavior: 'none', sensitivity: 1 },
      { type: 'star', label: 'Planet', x: 550, y: 250, size: 3, color: '#3b82f6', behavior: 'x-position', sensitivity: 1 },
    ],
  },

  // ── THERMODYNAMICS ──
  {
    id: 'ideal-gas-law',
    name: 'Ideal Gas Law',
    formula: 'n * R * T / V',
    resultName: 'P', resultUnit: 'Pa',
    description: 'PV = nRT — Pressure from gas parameters',
    theory: 'PV = nRT. Pressure × Volume = Moles × Gas Constant × Temperature. For R = 8.314 J/(mol·K), using n moles at T Kelvin in V m³ gives pressure in Pascals.',
    category: 'Thermodynamics', icon: '🌡️',
    defaultVariables: [
      { name: 'n', label: 'Moles', unit: 'mol', value: 1, min: 0.1, max: 10, step: 0.1, color: '#22c55e' },
      { name: 'R', label: 'Gas Constant', unit: 'J/mol·K', value: 8.314, min: 1, max: 10, step: 0.1, color: '#64748b' },
      { name: 'T', label: 'Temperature', unit: 'K', value: 300, min: 100, max: 600, step: 10, color: '#ef4444' },
      { name: 'V', label: 'Volume', unit: 'm³', value: 0.0245, min: 0.001, max: 0.1, step: 0.001, color: '#06b6d4' },
    ],
    suggestedObjects: [
      { type: 'circle', label: 'Gas Container', x: 400, y: 250, size: 5, color: '#06b6d4', behavior: 'size', sensitivity: 2 },
      { type: 'wave', label: 'Heat', x: 400, y: 350, size: 3, color: '#ef4444', behavior: 'color', sensitivity: 2 },
    ],
    questions: [
      { id: 'gas-q1', question: 'P = 1×8.314×300/0.0245 = ?', answer: 101800, tolerance: 500, hint: '≈ 1 atm = 1.013×10⁵ Pa', unit: 'Pa' },
    ],
    derivation: [
      { label: "Ideal Gas Law Derivation", latex: "PV = nRT\nP = pressure (Pa)\nV = volume (m³)\nn = number of moles\nR = 8.314 J/(mol·K)\nT = temperature (K)", explanation: "The ideal gas law combines Boyle's Law (P∝1/V), Charles's Law (V∝T), and Avogadro's Law (V∝n)." },
    ],
  },
  {
    id: 'carnot-efficiency',
    name: 'Carnot Engine Efficiency',
    formula: '1 - (T_cold / T_hot)',
    resultName: 'η', resultUnit: '%',
    description: 'η = 1 − T_C/T_H — Maximum possible efficiency',
    theory: 'The Carnot efficiency η = 1 - T_C/T_H sets the maximum efficiency any heat engine can achieve. T must be in Kelvin. Even an ideal Carnot engine cannot be 100% efficient.',
    category: 'Thermodynamics', icon: '⚙️',
    defaultVariables: [
      { name: 'T_hot', label: 'Hot Reservoir', unit: 'K', value: 600, min: 300, max: 1500, step: 10, color: '#ef4444' },
      { name: 'T_cold', label: 'Cold Reservoir', unit: 'K', value: 300, min: 100, max: 500, step: 10, color: '#3b82f6' },
    ],
    suggestedObjects: [
      { type: 'circle', label: 'Hot (T_H)', x: 250, y: 150, size: 5, color: '#ef4444', behavior: 'size', sensitivity: 2 },
      { type: 'circle', label: 'Cold (T_C)', x: 550, y: 350, size: 4, color: '#3b82f6', behavior: 'size', sensitivity: 2 },
      { type: 'arrow-up', label: 'Heat Flow', x: 300, y: 250, size: 3, color: '#f59e0b', behavior: 'size', sensitivity: 3 },
    ],
    questions: [
      { id: 'carnot-q1', question: 'η = 1 - 300/600 = ?', answer: 0.5, tolerance: 0.01, hint: '50% efficiency', unit: '' },
    ],
  },
  {
    id: 'rms-speed',
    name: 'RMS Speed of Gas',
    formula: 'sqrt(3 * R * T / M)',
    resultName: 'v_rms', resultUnit: 'm/s',
    description: 'vᵣₘₛ = √(3RT/M) — root-mean-square speed of gas molecules',
    theory: 'The RMS speed of gas molecules depends on temperature and molar mass: vᵣₘₛ = √(3RT/M). At STP, air molecules move at ~500 m/s (faster than sound!).',
    category: 'Thermodynamics', icon: '💨',
    defaultVariables: [
      { name: 'R', label: 'Gas Constant', unit: 'J/mol·K', value: 8.314, min: 1, max: 10, step: 0.1, color: '#64748b' },
      { name: 'T', label: 'Temperature', unit: 'K', value: 300, min: 50, max: 1000, step: 10, color: '#ef4444' },
      { name: 'M', label: 'Molar Mass', unit: 'kg/mol', value: 0.028, min: 0.002, max: 0.2, step: 0.001, color: '#06b6d4' },
    ],
    suggestedObjects: [
      { type: 'atom', label: 'Gas Molecules', x: 400, y: 250, size: 4, color: '#06b6d4', behavior: 'color', sensitivity: 3 },
      { type: 'arrow-up', label: 'Speed', x: 400, y: 350, size: 3, color: '#ef4444', behavior: 'size', sensitivity: 4 },
    ],
    questions: [
      { id: 'rms-q1', question: 'v_rms = √(3 × 8.314 × 300 / 0.028) = ?', answer: 516, tolerance: 5, hint: '≈ 516 m/s for N₂ at 300K', unit: 'm/s' },
    ],
  },

  // ── ELECTRICITY & MAGNETISM ──
  {
    id: 'ohms-law-adv',
    name: 'Ohm\'s Law & Power',
    formula: 'I * I * R',
    resultName: 'P', resultUnit: 'W',
    altFormula: 'V * V / R',
    description: 'P = I²R = V²/R — Electrical power dissipated',
    theory: 'Power dissipated by a resistor: P = V·I = I²R = V²/R. In AC circuits, average power P_avg = V_rms·I_rms·cos(φ) where cos(φ) is the power factor.',
    category: 'Electricity', icon: '⚡',
    defaultVariables: [
      { name: 'V', label: 'Voltage', unit: 'V', value: 12, min: 1, max: 240, step: 1, color: '#ef4444' },
      { name: 'R', label: 'Resistance', unit: 'Ω', value: 10, min: 1, max: 100, step: 1, color: '#f97316' },
    ],
    suggestedObjects: [
      { type: 'battery', label: 'Battery (V)', x: 200, y: 250, size: 3, color: '#22c55e', behavior: 'none', sensitivity: 1 },
      { type: 'resistor', label: 'Resistor (R)', x: 500, y: 250, size: 4, color: '#f97316', behavior: 'size', sensitivity: 3 },
      { type: 'circle', label: 'Bulb', x: 400, y: 150, size: 4, color: '#fbbf24', behavior: 'color', sensitivity: 3 },
    ],
    questions: [
      { id: 'ohm-q1', question: 'I = V/R = 12/10 = ?', answer: 1.2, tolerance: 0.01, hint: '12/10 = ?', unit: 'A' },
    ],
  },
  {
    id: 'rc-circuit',
    name: 'RC Circuit: Charging',
    formula: 'V * (1 - exp(-t / (R * C)))',
    resultName: 'V_C', resultUnit: 'V',
    description: 'V_C(t) = V₀(1 − e⁻ᵗ/ᴿᶜ) — Capacitor charging curve',
    theory: 'A capacitor charges exponentially: V_C(t) = V₀(1 - e^{-t/RC}). After one time constant τ = RC, V_C = 63% of V₀. After 5τ, V_C ≈ 99% of V₀.',
    category: 'Electricity', icon: '🔋',
    defaultVariables: [
      { name: 'V', label: 'Battery Voltage', unit: 'V', value: 9, min: 1, max: 24, step: 0.5, color: '#22c55e' },
      { name: 'R', label: 'Resistance', unit: 'Ω', value: 10000, min: 1000, max: 100000, step: 1000, color: '#f97316' },
      { name: 'C', label: 'Capacitance', unit: 'F', value: 0.0001, min: 0.00001, max: 0.001, step: 0.00001, color: '#06b6d4' },
    ],
    suggestedObjects: [
      { type: 'battery', label: 'Battery', x: 200, y: 250, size: 3, color: '#22c55e', behavior: 'none', sensitivity: 1 },
      { type: 'resistor', label: 'Resistor', x: 400, y: 250, size: 3, color: '#f97316', behavior: 'none', sensitivity: 1 },
      { type: 'circle', label: 'Capacitor', x: 550, y: 250, size: 4, color: '#06b6d4', behavior: 'color', sensitivity: 4 },
    ],
    dataLog: { enabled: true, variables: ['V_C', 't'], maxPoints: 300, label: 'Capacitor Charging Curve' },
    questions: [
      { id: 'rc-q1', question: 'τ = RC. R = 10kΩ, C = 100µF. What is τ?', answer: 1.0, tolerance: 0.01, hint: 'τ = 10000 × 0.0001', unit: 's' },
    ],
    derivation: [
      { label: "RC Charging Equation", latex: "V_C(t) = V₀(1 - e^{-t/RC})\nτ = RC\nAt t = τ: V_C = 0.632·V₀\nAt t = 5τ: V_C = 0.993·V₀", explanation: "The capacitor charges exponentially. The time constant τ = RC determines how fast it charges." },
    ],
  },
  {
    id: 'ac-circuit',
    name: 'AC Circuit: Reactance',
    formula: '1 / (2 * pi * f * C)',
    resultName: 'X_C', resultUnit: 'Ω',
    altFormula: '2 * pi * f * L',
    description: 'X_C = 1/(2πfC), X_L = 2πfL — Capacitive & Inductive Reactance',
    theory: 'In AC circuits, capacitors have reactance X_C = 1/(2πfC) and inductors have reactance X_L = 2πfL. Impedance Z = √(R² + (X_L - X_C)²).',
    category: 'Electricity', icon: '🔌',
    defaultVariables: [
      { name: 'f', label: 'Frequency', unit: 'Hz', value: 50, min: 10, max: 200, step: 1, color: '#8b5cf6' },
      { name: 'C', label: 'Capacitance', unit: 'F', value: 0.0001, min: 0.00001, max: 0.001, step: 0.00001, color: '#06b6d4' },
      { name: 'L', label: 'Inductance', unit: 'H', value: 0.1, min: 0.01, max: 1, step: 0.01, color: '#f59e0b' },
    ],
    suggestedObjects: [
      { type: 'circle', label: 'Capacitor', x: 300, y: 250, size: 4, color: '#06b6d4', behavior: 'size', sensitivity: 2 },
      { type: 'resistor', label: 'Inductor', x: 500, y: 250, size: 3, color: '#f59e0b', behavior: 'size', sensitivity: 2 },
    ],
    dataLog: { enabled: true, variables: ['X_C', 'X_L', 'f'], maxPoints: 100, label: 'Reactance vs Frequency' },
    questions: [
      { id: 'ac-q1', question: 'X_C = 1/(2π × 50 × 0.0001) = ?', answer: 31.83, tolerance: 0.5, hint: 'X_C = 1/(2π × 50 × 10⁻⁴)', unit: 'Ω' },
    ],
  },
  {
    id: 'coulomb-law',
    name: 'Coulomb\'s Law',
    formula: 'k * q1 * q2 / (r * r)',
    resultName: 'Fe', resultUnit: 'N',
    description: 'Fₑ = k·q₁·q₂/r² — Electrostatic force between two charges',
    theory: 'Like charges repel, opposite charges attract. Force magnitude F = k|q₁q₂|/r², where k = 8.99×10⁹ N·m²/C². Force is along the line joining the charges.',
    category: 'Electricity', icon: '⚡',
    defaultVariables: [
      { name: 'k', label: 'Coulomb Const', unit: '×10⁹', value: 8.99, min: 1, max: 10, step: 0.1, color: '#64748b' },
      { name: 'q1', label: 'Charge 1', unit: 'C', value: 1e-6, min: 1e-9, max: 1e-3, step: 1e-7, color: '#ef4444' },
      { name: 'q2', label: 'Charge 2', unit: 'C', value: -1e-6, min: -1e-3, max: 1e-3, step: 1e-7, color: '#3b82f6' },
      { name: 'r', label: 'Distance', unit: 'm', value: 0.1, min: 0.01, max: 1, step: 0.01, color: '#22c55e' },
    ],
    suggestedObjects: [
      { type: 'circle', label: 'Charge +', x: 250, y: 250, size: 5, color: '#ef4444', behavior: 'none', sensitivity: 1 },
      { type: 'circle', label: 'Charge −', x: 500, y: 250, size: 5, color: '#3b82f6', behavior: 'none', sensitivity: 1 },
      { type: 'spring', label: 'Force', x: 375, y: 250, size: 3, color: '#a78bfa', behavior: 'size', sensitivity: 3 },
    ],
    questions: [
      { id: 'coul-q1', question: 'F = 8.99×10⁹ × 1×10⁻⁶ × 1×10⁻⁶ / (0.1)² = ?', answer: 0.899, tolerance: 0.01, hint: 'F = 8.99×10⁹ × 10⁻¹² / 0.01', unit: 'N' },
    ],
  },

  // ── MODERN PHYSICS ──
  {
    id: 'photoelectric',
    name: 'Photoelectric Effect',
    formula: 'h * f - W0',
    resultName: 'KE_max', resultUnit: 'eV',
    description: 'KEₘₐₓ = hf − Φ — Einstein\'s photoelectric equation',
    theory: 'KE_max = hf - Φ, where h = 6.63×10⁻³⁴ J·s, f is frequency, Φ is work function. Below the threshold frequency f₀ = Φ/h, no electrons are emitted. h = 4.14×10⁻¹⁵ eV·s.',
    category: 'Modern Physics', icon: '☀️',
    defaultVariables: [
      { name: 'h', label: 'Planck\'s Const', unit: 'eV·s', value: 4.14e-15, min: 1e-15, max: 1e-14, step: 1e-16, color: '#8b5cf6' },
      { name: 'f', label: 'Light Freq', unit: 'Hz', value: 1.2e15, min: 5e14, max: 3e15, step: 1e13, color: '#f59e0b' },
      { name: 'W0', label: 'Work Function', unit: 'eV', value: 2.3, min: 1, max: 5, step: 0.1, color: '#ef4444' },
    ],
    suggestedObjects: [
      { type: 'sun', label: 'Light Source', x: 200, y: 150, size: 4, color: '#f59e0b', behavior: 'color', sensitivity: 3 },
      { type: 'block', label: 'Metal Surface', x: 400, y: 300, size: 5, color: '#94a3b8', behavior: 'none', sensitivity: 1 },
      { type: 'arrow-up', label: 'KE of e⁻', x: 400, y: 150, size: 3, color: '#22c55e', behavior: 'size', sensitivity: 4 },
    ],
    dataLog: { enabled: true, variables: ['KE_max', 'f'], maxPoints: 100, label: 'KE_max vs Frequency' },
    questions: [
      { id: 'pe-q1', question: 'KE = 4.14×10⁻¹⁵×1.2×10¹⁵ − 2.3 = ?', answer: 2.668, tolerance: 0.05, hint: '4.14×10⁻¹⁵ × 1.2×10¹⁵ = 4.968', unit: 'eV' },
    ],
  },
  {
    id: 'radioactive-decay',
    name: 'Radioactive Decay',
    formula: 'N0 * exp(-lambda * t)',
    resultName: 'N', resultUnit: 'atoms',
    description: 'N(t) = N₀·e⁻ˡᵗ — Exponential radioactive decay',
    theory: 'N = N₀e^{-λt}. λ = ln(2)/T_{1/2} is the decay constant. After one half-life, N = N₀/2. Activity A = λN. Carbon dating uses t_{1/2} = 5730 years for C-14.',
    category: 'Modern Physics', icon: '☢️',
    defaultVariables: [
      { name: 'N0', label: 'Initial Atoms', unit: '', value: 1000, min: 100, max: 10000, step: 100, color: '#3b82f6' },
      { name: 'lambda', label: 'Decay Const λ', unit: 's⁻¹', value: 0.1, min: 0.01, max: 1, step: 0.01, color: '#ef4444' },
      { name: 't', label: 'Time', unit: 's', value: 10, min: 0, max: 100, step: 0.5, color: '#22c55e' },
    ],
    suggestedObjects: [
      { type: 'circle', label: 'Radioactive Sample', x: 400, y: 250, size: 6, color: '#3b82f6', behavior: 'size', sensitivity: 3 },
      { type: 'atom', label: 'Decay Particles', x: 400, y: 100, size: 3, color: '#f59e0b', behavior: 'color', sensitivity: 4 },
    ],
    dataLog: { enabled: true, variables: ['N', 't'], maxPoints: 200, label: 'Exponential Decay' },
    questions: [
      { id: 'decay-q1', question: 'N = 1000×e^{−0.1×10} = ?', answer: 367.88, tolerance: 1, hint: 'e⁻¹ = 0.3679', unit: 'atoms' },
    ],
    derivation: [
      { label: "Decay Law", latex: "dN/dt = -λN\nN(t) = N₀e^{-λt}\nλ = ln(2)/T_{1/2}\nT_{1/2} = half-life", explanation: "The rate of decay is proportional to the number of atoms present. Solve the differential equation to get exponential decay." },
    ],
  },
  {
    id: 'half-life',
    name: 'Half-Life Calculation',
    formula: 'ln(2) / lambda',
    resultName: 'T_1/2', resultUnit: 's',
    description: 'T_{1/2} = ln(2)/λ — Half-life from decay constant',
    theory: 'Half-life T_{1/2} = ln(2)/λ. After n half-lives, N = N₀(½)ⁿ. Different isotopes have vastly different half-lives — from microseconds to billions of years.',
    category: 'Modern Physics', icon: '⏱️',
    defaultVariables: [
      { name: 'lambda', label: 'Decay Constant', unit: 's⁻¹', value: 0.693, min: 0.001, max: 10, step: 0.001, color: '#ef4444' },
    ],
    suggestedObjects: [
      { type: 'text', label: 'T₁/₂ = ln2/λ', x: 400, y: 100, size: 3, color: '#a78bfa', behavior: 'none', sensitivity: 1 },
      { type: 'circle', label: 'Sample', x: 400, y: 250, size: 5, color: '#f59e0b', behavior: 'opacity', sensitivity: 3 },
    ],
    questions: [
      { id: 'hl-q1', question: 'T_{1/2} = ln(2)/0.693 = ?', answer: 1.0, tolerance: 0.01, hint: 'ln(2) = 0.693', unit: 's' },
    ],
  },
  {
    id: 'de-broglie',
    name: 'De Broglie Wavelength',
    formula: 'h / (m * v)',
    resultName: 'λ', resultUnit: 'm',
    description: 'λ = h/p = h/(mv) — Matter waves',
    theory: 'Every moving particle has a wavelength λ = h/(mv) where h = 6.63×10⁻³⁴ J·s. For electrons, this wavelength is comparable to atomic spacing, enabling electron microscopy.',
    category: 'Modern Physics', icon: '⚛️',
    defaultVariables: [
      { name: 'h', label: 'Planck\'s Const', unit: 'J·s', value: 6.63e-34, min: 1e-34, max: 1e-33, step: 1e-36, color: '#8b5cf6' },
      { name: 'm', label: 'Particle Mass', unit: 'kg', value: 9.11e-31, min: 1e-31, max: 1e-27, step: 1e-32, color: '#3b82f6' },
      { name: 'v', label: 'Velocity', unit: 'm/s', value: 1e6, min: 1e4, max: 1e8, step: 1e4, color: '#22c55e' },
    ],
    suggestedObjects: [
      { type: 'atom', label: 'Electron', x: 400, y: 250, size: 3, color: '#3b82f6', behavior: 'size', sensitivity: 4 },
      { type: 'wave', label: 'Matter Wave', x: 400, y: 150, size: 3, color: '#8b5cf6', behavior: 'color', sensitivity: 2 },
    ],
    questions: [
      { id: 'db-q1', question: 'λ = 6.63×10⁻³⁴/(9.11×10⁻³¹ × 10⁶) = ?', answer: 7.28e-10, tolerance: 1e-11, hint: '≈ 0.73 nm (nanometers)', unit: 'm' },
    ],
  },

  // ── FLUID MECHANICS ──
  {
    id: 'bernoulli',
    name: 'Bernoulli\'s Equation',
    formula: 'P + 0.5 * rho * v * v + rho * g * h',
    resultName: 'Total', resultUnit: 'Pa',
    description: 'P + ½ρv² + ρgh = constant — Bernoulli\'s principle',
    theory: 'For an ideal fluid, P + ½ρv² + ρgh is constant along a streamline. This explains lift (airplanes), atomizers, and why fast-moving fluids have lower pressure.',
    category: 'Fluid Mechanics', icon: '🌪️',
    defaultVariables: [
      { name: 'P', label: 'Static Pressure', unit: 'Pa', value: 101325, min: 0, max: 200000, step: 1000, color: '#3b82f6' },
      { name: 'rho', label: 'Density', unit: 'kg/m³', value: 1000, min: 1, max: 1000, step: 10, color: '#06b6d4' },
      { name: 'v', label: 'Flow Velocity', unit: 'm/s', value: 10, min: 0, max: 50, step: 0.5, color: '#22c55e' },
      { name: 'h', label: 'Height', unit: 'm', value: 5, min: 0, max: 20, step: 0.5, color: '#f59e0b' },
      { name: 'g', label: 'Gravity', unit: 'm/s²', value: 9.81, min: 1, max: 20, step: 0.1, color: '#ef4444' },
    ],
    suggestedObjects: [
      { type: 'arrow-right', label: 'Flow (v)', x: 200, y: 200, size: 3, color: '#22c55e', behavior: 'size', sensitivity: 3 },
      { type: 'arrow-up', label: 'Height (h)', x: 600, y: 350, size: 3, color: '#f59e0b', behavior: 'size', sensitivity: 3 },
      { type: 'circle', label: 'Fluid', x: 400, y: 300, size: 5, color: '#06b6d4', behavior: 'size', sensitivity: 2 },
    ],
    derivation: [
      { label: "Bernoulli's Equation from Work-Energy", latex: "P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂\nDerived from conservation of energy.", explanation: "Bernoulli's equation is a statement of conservation of energy for flowing fluids. The work done by pressure forces equals the change in kinetic and potential energy." },
    ],
  },
  {
    id: 'continuity',
    name: 'Continuity Equation',
    formula: 'A1 * v1 / A2',
    resultName: 'v2', resultUnit: 'm/s',
    description: 'A₁v₁ = A₂v₂ — Flow rate conservation',
    theory: 'For incompressible flow, the volume flow rate Q = Av is constant. If a pipe narrows (A₂ < A₁), velocity increases (v₂ > v₁). This is why a garden hose nozzle speeds up water.',
    category: 'Fluid Mechanics', icon: '🌊',
    defaultVariables: [
      { name: 'A1', label: 'Area (wide)', unit: 'm²', value: 0.01, min: 0.001, max: 0.1, step: 0.001, color: '#3b82f6' },
      { name: 'v1', label: 'Velocity (wide)', unit: 'm/s', value: 2, min: 0.1, max: 10, step: 0.1, color: '#22c55e' },
      { name: 'A2', label: 'Area (narrow)', unit: 'm²', value: 0.002, min: 0.0001, max: 0.05, step: 0.0001, color: '#f59e0b' },
    ],
    suggestedObjects: [
      { type: 'arrow-right', label: 'Flow (v₁)', x: 200, y: 250, size: 3, color: '#22c55e', behavior: 'size', sensitivity: 3 },
      { type: 'arrow-right', label: 'Flow (v₂)', x: 500, y: 250, size: 4, color: '#f59e0b', behavior: 'size', sensitivity: 4 },
      { type: 'arc', label: 'Narrowing Pipe', x: 400, y: 250, size: 3, color: '#64748b', behavior: 'none', sensitivity: 1 },
    ],
    questions: [
      { id: 'cont-q1', question: 'v₂ = A₁×v₁/A₂ = 0.01×2/0.002 = ?', answer: 10, tolerance: 0.1, hint: 'v₂ = 0.02 / 0.002', unit: 'm/s' },
    ],
  },
];
