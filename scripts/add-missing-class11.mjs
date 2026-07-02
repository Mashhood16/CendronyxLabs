import fs from 'fs';
import path from 'path';

const COMPONENTS_DIR = 'src/components';
const LAB_ROUTES = 'src/routes/labRoutes.ts';
const LAB_MODULES = 'src/data/labModules.ts';
const CONFIG_FILE = 'src/data/class11Derivations.ts';

// ============================================================
// MISSING CLASS 11 DERIVATION DEFINITIONS
// ============================================================
// These are the derivations from the user's original list that were not
// included in the first batch of 22.

const MISSING = [
  // ── Unit 3: Projectile Time of Flight ──
  {
    key: 'projectile_time_flight',
    name: 'ProjectileTimeFlight',
    title: "Derivation: Time of Flight of Projectile",
    gradient: 'from-rose-500 to-red-600',
    color: 'bg-rose-600',
    formula: 'T = 2v_i sin\u03B8 / g',
    formulaDesc: 'Total time projectile stays in the air',
    steps: [
      { label: 'Vertical Motion Only', formula: 'Vertical motion determines time', detail: 'Time of flight depends ONLY on vertical motion. Horizontal motion does not affect it.' },
      { label: 'Initial Vertical Velocity', formula: 'v_iy = v_i sin\u03B8', detail: 'The vertical component determines how long the projectile stays in the air.' },
      { label: 'Displacement = 0 at Landing', formula: 'S_y = v_iy t + \u00BD a_y t\u00B2 = 0', detail: 'Using second equation of motion vertically. S_y = 0 because projectile returns to same height.' },
      { label: 'Solve for T', formula: '0 = (v_i sin\u03B8)T \u2212 \u00BD g T\u00B2 \u21D2 T = 2v_i sin\u03B8/g', detail: 'Factor T: T(v_i sin\u03B8 \u2212 \u00BD g T) = 0. Non-zero solution: T = 2v_i sin\u03B8/g.' },
    ],
    sliders: [
      { label: 'Initial Velocity (vi)', key: 'vi', min: 5, max: 50, step: 1, default: 20, unit: ' m/s' },
      { label: 'Launch Angle (\u03B8)', key: 'theta', min: 10, max: 90, step: 5, default: 45, unit: ' deg' },
    ],
    compute: `(v) => { const rad = v.theta * Math.PI / 180; const T = 2*v.vi*Math.sin(rad)/9.81; return { traces: [{ label: 'T = 2vi sin\u03B8/g = ', value: \`2x\${v.vi}xsin(\${v.theta})/9.81\` }], result: T.toFixed(2) + ' s' }; }`,
    practice: `{ question: 'vi = 30 m/s, \u03B8 = 45 deg. Find time of flight (g = 9.81).', hint: 'T = 2\u00D730\u00D7sin(45)/9.81 = 2\u00D730\u00D70.707/9.81', answer: 4.32, tolerance: 0.5, explanation: 'T = 4.32 s. The projectile is in the air for over 4 seconds!', errorHint: 'T = 2v_i sin\u03B8/g' }`,
  },

  // ── Unit 4: Angular Momentum ──
  {
    key: 'angular_momentum',
    name: 'AngularMomentum',
    title: "Derivation: Angular Momentum",
    gradient: 'from-green-500 to-emerald-600',
    color: 'bg-green-600',
    formula: 'L = I\u03C9 = mr\u00B2\u03C9',
    formulaDesc: 'Rotational analogue of linear momentum',
    steps: [
      { label: 'Definition of Angular Momentum', formula: 'L = r \u00D7 p = rmv sin90\u00B0 = rmv', detail: 'Angular momentum = position vector cross linear momentum. For circular motion, r is perpendicular to p.' },
      { label: 'Substitute Linear Momentum', formula: 'L = r \u00D7 (mv) = rmv', detail: 'Linear momentum p = mv. Angular momentum magnitude = radius \u00D7 mass \u00D7 linear velocity.' },
      { label: 'Use v = r\u03C9', formula: 'L = r \u00D7 m \u00D7 (r\u03C9) = mr\u00B2\u03C9', detail: 'Substitute v = r\u03C9. Angular momentum L = mr\u00B2\u03C9.' },
      { label: 'Moment of Inertia I = mr\u00B2', formula: 'L = I\u03C9', detail: 'Define moment of inertia I = mr\u00B2 for a point mass. Then L = I\u03C9.' },
    ],
    sliders: [
      { label: 'Mass (m)', key: 'm', min: 0.5, max: 10, step: 0.5, default: 2, unit: ' kg' },
      { label: 'Radius (r)', key: 'r', min: 0.5, max: 5, step: 0.1, default: 1, unit: ' m' },
      { label: 'Angular Velocity (\u03C9)', key: 'w', min: 1, max: 10, step: 0.5, default: 5, unit: ' rad/s' },
    ],
    compute: `(v) => { const I = v.m * v.r * v.r; const L = I * v.w; return { traces: [{ label: 'I = mr\u00B2 = ', value: \`\${v.m}x\${v.r}\u00B2\` }, { label: 'L = I\u03C9 = ', value: \`\${I.toFixed(1)}x\${v.w}\` }], result: L.toFixed(2) + ' kg\u00B7m\u00B2/s' }; }`,
    practice: `{ question: 'm = 2 kg, r = 1 m, \u03C9 = 5 rad/s. Find L.', hint: 'L = (2\u00D71\u00B2)\u00D75 = 2\u00D75', answer: 10, tolerance: 1, explanation: 'L = 10 kg\u00B7m\u00B2/s. Angular momentum is conserved!', errorHint: 'L = I\u03C9 = mr\u00B2\u03C9' }`,
  },

  // ── Unit 4: Torque & Angular Acceleration ──
  {
    key: 'torque_inertia',
    name: 'TorqueInertia',
    title: "Derivation: Torque and Angular Acceleration",
    gradient: 'from-emerald-500 to-teal-600',
    color: 'bg-emerald-600',
    formula: '\u03C4 = I\u03B1',
    formulaDesc: 'Rotational analogue of Newton\u2019s Second Law',
    steps: [
      { label: 'Definition of Torque', formula: '\u03C4 = r F sin90\u00B0 = rF', detail: 'Torque = force \u00D7 perpendicular distance from axis. For tangential force, sin90\u00B0 = 1.' },
      { label: 'Apply Newton\u2019s Second Law', formula: '\u03C4 = r \u00D7 (ma)', detail: 'F = ma from Newton\u2019s Second Law. Substitute into torque equation.' },
      { label: 'Use a_t = r\u03B1', formula: '\u03C4 = r \u00D7 m \u00D7 (r\u03B1) = mr\u00B2\u03B1', detail: 'Tangential acceleration a_t = r\u03B1. Substitute: \u03C4 = m r\u00B2 \u03B1.' },
      { label: 'Moment of Inertia I = mr\u00B2', formula: '\u03C4 = I\u03B1', detail: 'Where I = mr\u00B2. Torque = moment of inertia \u00D7 angular acceleration. Newton\u2019s Second Law for rotation!' },
    ],
    sliders: [
      { label: 'Mass (m)', key: 'm', min: 0.5, max: 10, step: 0.5, default: 2, unit: ' kg' },
      { label: 'Radius (r)', key: 'r', min: 0.2, max: 2, step: 0.1, default: 0.5, unit: ' m' },
      { label: 'Force (F)', key: 'F', min: 1, max: 50, step: 1, default: 10, unit: ' N' },
    ],
    compute: `(v) => { const I = v.m * v.r * v.r; const tau = v.F * v.r; const alpha = tau / I; return { traces: [{ label: 'I = mr\u00B2 = ', value: \`\${v.m}x\${v.r}\u00B2\` }, { label: '\u03C4 = rF = ', value: \`\${v.r}x\${v.F}\` }], result: '\u03B1=' + alpha.toFixed(2) + ' rad/s\u00B2' }; }`,
    practice: `{ question: 'F = 10 N, r = 0.5 m, m = 2 kg. Find \u03B1.', hint: 'I = 2\u00D70.25 = 0.5. \u03C4 = 0.5\u00D710 = 5. \u03B1 = 5/0.5', answer: 10, tolerance: 1, explanation: '\u03B1 = 10 rad/s\u00B2. A small torque on a small I produces large angular acceleration!', errorHint: '\u03B1 = \u03C4/I = Fr/(mr\u00B2)' }`,
  },

  // ── Unit 4: Artificial Gravity ──
  {
    key: 'artificial_gravity',
    name: 'ArtificialGravity',
    title: "Derivation: Artificial Gravity / Satellite Velocity",
    gradient: 'from-teal-500 to-green-600',
    color: 'bg-teal-600',
    formula: 'v = \u221A(gR), \u03C9 = \u221A(g/R)',
    formulaDesc: 'Creating artificial gravity via rotation',
    steps: [
      { label: 'Centripetal Equals Gravity', formula: 'a_c = g', detail: 'For artificial gravity, centripetal acceleration equals gravity (9.81 m/s\u00B2).' },
      { label: 'Substitute a_c = v\u00B2/R', formula: 'v\u00B2/R = g', detail: 'Centripetal acceleration: a_c = v\u00B2/R. Set equal to g.' },
      { label: 'Solve for v', formula: 'v = \u221A(gR)', detail: 'Multiply both sides by R: v\u00B2 = gR. Take square root: v = \u221A(gR).' },
      { label: 'Using v = \u03C9R', formula: '\u03C9 = \u221A(g/R)', detail: 'Substitute v = \u03C9R: (\u03C9R)\u00B2 = gR \u21D2 \u03C9\u00B2R\u00B2 = gR \u21D2 \u03C9\u00B2 = g/R \u21D2 \u03C9 = \u221A(g/R).' },
    ],
    sliders: [
      { label: 'Radius (R)', key: 'R', min: 10, max: 200, step: 5, default: 50, unit: ' m' },
    ],
    compute: `(v) => { const g = 9.81; const linV = Math.sqrt(g * v.R); const angV = Math.sqrt(g / v.R); return { traces: [{ label: 'v = \u221A(gR) = ', value: \`\u221A(\${g}x\${v.R})\` }, { label: '\u03C9 = \u221A(g/R) = ', value: \`\u221A(\${g}/\${v.R})\` }], result: 'v=' + linV.toFixed(1) + ' m/s, \u03C9=' + angV.toFixed(3) + ' rad/s' }; }`,
    practice: `{ question: 'Space station R = 50 m. Find rotation speed for artificial g = 9.81.', hint: 'v = \u221A(9.81\u00D750) = \u221A(490.5)', answer: 22.15, tolerance: 2, explanation: 'v = 22.1 m/s = 79.6 km/h. The station must rotate quite fast!', errorHint: 'v = \u221A(gR)' }`,
  },

  // ── Unit 6: Terminal Velocity ──
  {
    key: 'terminal_velocity',
    name: 'TerminalVelocity',
    title: "Derivation: Terminal Velocity",
    gradient: 'from-sky-500 to-blue-600',
    color: 'bg-sky-600',
    formula: 'v_t = 2\u03C1gr\u00B2 / 9\u03B7',
    formulaDesc: 'Maximum speed reached by a falling object through a fluid',
    steps: [
      { label: 'Forces at Terminal Velocity', formula: 'Weight = Drag: mg = F_drag', detail: 'At terminal velocity, weight equals drag force. Net force = 0, acceleration = 0.' },
      { label: "Stokes\u2019 Law for Drag", formula: 'F_drag = 6\u03C0\u03B7 r v_t', detail: 'For a sphere in a viscous fluid, Stokes\u2019 Law: drag = 6\u03C0 \u00D7 viscosity \u00D7 radius \u00D7 velocity.' },
      { label: 'Mass of Sphere', formula: 'm = \u03C1V = \u03C1 \u00D7 (4/3)\u03C0 r\u00B3', detail: 'Mass = density \u00D7 volume. Volume of a sphere = (4/3)\u03C0r\u00B3.' },
      { label: 'Solve for v_t', formula: 'v_t = 2\u03C1 g r\u00B2 / 9\u03B7', detail: 'Substitute mass: \u03C1(4/3)\u03C0r\u00B3g = 6\u03C0\u03B7rv_t. Cancel \u03C0 and r. v_t \u221D r\u00B2! Larger droplets fall faster.' },
    ],
    sliders: [
      { label: 'Density (\u03C1)', key: 'rho', min: 500, max: 2000, step: 50, default: 1000, unit: ' kg/m\u00B3' },
      { label: 'Radius (r)', key: 'r', min: 0.001, max: 0.01, step: 0.0005, default: 0.005, unit: ' m' },
      { label: 'Viscosity (\u03B7)', key: 'eta', min: 0.001, max: 0.01, step: 0.0005, default: 0.005, unit: ' Pa\u00B7s' },
    ],
    compute: `(v) => { const vt = 2 * v.rho * 9.81 * v.r * v.r / (9 * v.eta); return { traces: [{ label: 'v_t = 2\u03C1gr\u00B2/(9\u03B7) = ', value: \`2x\${v.rho}x9.81x\${v.r}\u00B2/(9x\${v.eta})\` }], result: vt.toFixed(4) + ' m/s' }; }`,
    practice: `{ question: 'Water droplet r = 0.002 m, \u03B7 = 1.8e-5 Pa\u00B7s, \u03C1 = 1000 kg/m\u00B3. Find v_t.', hint: 'v_t = 2\u00D71000\u00D79.81\u00D7(0.002)\u00B2/(9\u00D71.8e-5)', answer: 484.4, tolerance: 50, explanation: 'v_t = 484 m/s! But air resistance becomes more complex at high speeds.', errorHint: 'v_t = 2\u03C1gr\u00B2/(9\u03B7)' }`,
  },

  // ── Unit 11: Equivalent Resistance (Series) ──
  {
    key: 'resistance_series',
    name: 'ResistanceSeries',
    title: "Derivation: Equivalent Resistance (Series)",
    gradient: 'from-blue-500 to-indigo-600',
    color: 'bg-blue-600',
    formula: 'R_eq = R\u2081 + R\u2082 + R\u2083',
    formulaDesc: 'Total resistance in series = sum of individual resistances',
    steps: [
      { label: 'KVL: Voltages Add', formula: 'V_total = V\u2081 + V\u2082 + V\u2083', detail: 'By Kirchhoff\u2019s Voltage Law, total voltage = sum of voltage drops across each resistor.' },
      { label: "Ohm\u2019s Law for Each", formula: 'IR_eq = IR\u2081 + IR\u2082 + IR\u2083', detail: 'Apply V = IR for each resistor. Current I is the same through all resistors in series.' },
      { label: 'Current is Common', formula: 'I R_eq = I (R\u2081 + R\u2082 + R\u2083)', detail: 'Factor out the common current I from both sides.' },
      { label: 'Cancel Current I', formula: 'R_eq = R\u2081 + R\u2082 + R\u2083', detail: 'Divide both sides by I. Equivalent resistance = sum of individual resistances.' },
    ],
    sliders: [
      { label: 'R\u2081', key: 'R1', min: 10, max: 200, step: 5, default: 100, unit: ' \u03A9' },
      { label: 'R\u2082', key: 'R2', min: 10, max: 200, step: 5, default: 50, unit: ' \u03A9' },
      { label: 'R\u2083', key: 'R3', min: 10, max: 200, step: 5, default: 25, unit: ' \u03A9' },
    ],
    compute: `(v) => { const Req = v.R1 + v.R2 + v.R3; return { traces: [{ label: 'R_eq = R\u2081+R\u2082+R\u2083 = ', value: \`\${v.R1}+\${v.R2}+\${v.R3}\` }], result: Req + ' \u03A9' }; }`,
    practice: `{ question: 'R\u2081 = 100 \u03A9, R\u2082 = 50 \u03A9, R\u2083 = 25 \u03A9. Find R_eq in series.', hint: 'R_eq = 100 + 50 + 25', answer: 175, tolerance: 5, explanation: 'R_eq = 175 \u03A9. Series resistors always increase total resistance!', errorHint: 'R_eq = R\u2081 + R\u2082 + R\u2083' }`,
  },

  // ── Unit 11: Equivalent Resistance (Parallel) ──
  {
    key: 'resistance_parallel',
    name: 'ResistanceParallel',
    title: "Derivation: Equivalent Resistance (Parallel)",
    gradient: 'from-indigo-500 to-fuchsia-600',
    color: 'bg-indigo-600',
    formula: '1/R_eq = 1/R\u2081 + 1/R\u2082 + 1/R\u2083',
    formulaDesc: 'Total resistance in parallel = reciprocal of sum of reciprocals',
    steps: [
      { label: 'KCL: Currents Add', formula: 'I_total = I\u2081 + I\u2082 + I\u2083', detail: 'By Kirchhoff\u2019s Current Law, total current = sum of branch currents.' },
      { label: "Ohm\u2019s Law for Each", formula: 'V/R_eq = V/R\u2081 + V/R\u2082 + V/R\u2083', detail: 'Apply I = V/R for each branch. Voltage V is the SAME across all parallel branches.' },
      { label: 'Voltage is Common', formula: 'V(1/R_eq) = V(1/R\u2081 + 1/R\u2082 + 1/R\u2083)', detail: 'Factor out the common voltage V.' },
      { label: 'Cancel Voltage V', formula: '1/R_eq = 1/R\u2081 + 1/R\u2082 + 1/R\u2083', detail: 'Equivalent resistance reciprocal = sum of reciprocals. Always smaller than smallest individual.' },
    ],
    sliders: [
      { label: 'R\u2081', key: 'R1', min: 10, max: 200, step: 5, default: 100, unit: ' \u03A9' },
      { label: 'R\u2082', key: 'R2', min: 10, max: 200, step: 5, default: 50, unit: ' \u03A9' },
      { label: 'R\u2083', key: 'R3', min: 10, max: 200, step: 5, default: 25, unit: ' \u03A9' },
    ],
    compute: `(v) => { const Req = 1 / (1/v.R1 + 1/v.R2 + 1/v.R3); return { traces: [{ label: '1/R_eq = 1/R\u2081+1/R\u2082+1/R\u2083 = ', value: \`1/\${v.R1}+1/\${v.R2}+1/\${v.R3}\` }], result: Req.toFixed(2) + ' \u03A9' }; }`,
    practice: `{ question: 'R\u2081 = 100 \u03A9, R\u2082 = 50 \u03A9. Find R_eq in parallel.', hint: '1/R_eq = 1/100 + 1/50 = 0.01 + 0.02 = 0.03', answer: 33.33, tolerance: 3, explanation: 'R_eq = 33.3 \u03A9. Less than the smallest resistor!', errorHint: '1/R_eq = 1/R\u2081 + 1/R\u2082' }`,
  },

  // ── Unit 6: Venturi Meter ──
  {
    key: 'venturi_meter',
    name: 'VenturiMeter',
    title: "Derivation: Venturi Meter Flow Rate",
    gradient: 'from-cyan-500 to-blue-600',
    color: 'bg-cyan-600',
    formula: 'v\u2081 = \u221A(2gh / ((A\u2081/A\u2082)\u00B2 - 1))',
    formulaDesc: 'Fluid velocity from pressure difference in a Venturi tube',
    steps: [
      { label: "Bernoulli\u2019s Equation (Horizontal)", formula: 'P\u2081 + \u00BD\u03C1v\u2081\u00B2 = P\u2082 + \u00BD\u03C1v\u2082\u00B2', detail: 'For a horizontal pipe (h\u2081 = h\u2082), Bernoulli simplifies to this form.' },
      { label: 'Pressure Difference', formula: 'P\u2081 \u2212 P\u2082 = \u00BD\u03C1(v\u2082\u00B2 \u2212 v\u2081\u00B2)', detail: 'Rearrange: the pressure drop equals the change in dynamic pressure.' },
      { label: 'Continuity Equation', formula: 'v\u2082 = v\u2081 (A\u2081/A\u2082)', detail: 'From A\u2081v\u2081 = A\u2082v\u2082. The fluid speeds up in the narrow section.' },
      { label: 'Manometer Reading', formula: 'P\u2081 \u2212 P\u2082 = \u03C1gh', detail: 'The pressure difference is measured by the manometer height difference h.' },
    ],
    sliders: [
      { label: 'Area 1 (A\u2081)', key: 'A1', min: 0.01, max: 0.1, step: 0.005, default: 0.05, unit: ' m\u00B2' },
      { label: 'Area 2 (A\u2082)', key: 'A2', min: 0.005, max: 0.05, step: 0.001, default: 0.01, unit: ' m\u00B2' },
      { label: 'Height Difference (h)', key: 'h', min: 0.01, max: 0.5, step: 0.01, default: 0.1, unit: ' m' },
    ],
    compute: `(v) => { const ratio = v.A1 / v.A2; const v1 = Math.sqrt(2 * 9.81 * v.h / (ratio * ratio - 1)); return { traces: [{ label: 'v\u2081 = \u221A(2gh/((A\u2081/A\u2082)\u00B2-1)) = ', value: \`\u221A(2x9.81x\${v.h}/((\${v.A1}/\${v.A2})\u00B2-1))\` }], result: v1.toFixed(2) + ' m/s' }; }`,
    practice: `{ question: 'A\u2081 = 0.05 m\u00B2, A\u2082 = 0.01 m\u00B2, h = 0.15 m. Find v\u2081.', hint: 'ratio = 5, v\u2081 = \u221A(2x9.81x0.15/24)', answer: 0.35, tolerance: 0.05, explanation: 'v\u2081 = 0.35 m/s. The Venturi effect is used in carburetors and flow meters!', errorHint: 'v\u2081 = \u221A(2gh/((A\u2081/A\u2082)\u00B2-1))' }`,
  },

  // ── Unit 7: Elastic Potential Energy ──
  {
    key: 'elastic_potential_energy',
    name: 'ElasticPotentialEnergy',
    title: "Derivation: Elastic Potential Energy",
    gradient: 'from-yellow-500 to-amber-600',
    color: 'bg-yellow-600',
    formula: 'U = \u00BD k x\u00B2',
    formulaDesc: 'Energy stored in a deformed spring',
    steps: [
      { label: 'Force-Extension Graph', formula: 'Area under F-x graph = Work done', detail: 'For a spring, force F = kx (Hooke\u2019s Law). The F-x graph is a straight line through origin.' },
      { label: 'Work = Area of Triangle', formula: 'W = \u00BD \u00D7 F \u00D7 x', detail: 'Work done = area under F-x graph. The shape is a right triangle: \u00BD \u00D7 base \u00D7 height.' },
      { label: 'Substitute F = kx', formula: 'W = \u00BD \u00D7 (kx) \u00D7 x = \u00BD k x\u00B2', detail: 'Substituting F = kx: W = \u00BD(kx)x = \u00BDkx\u00B2.' },
      { label: 'Elastic Potential Energy', formula: 'U = \u00BD k x\u00B2', detail: 'This work is stored as elastic potential energy. It can be recovered when the spring returns to its original shape.' },
    ],
    sliders: [
      { label: 'Spring Constant (k)', key: 'k', min: 10, max: 500, step: 10, default: 100, unit: ' N/m' },
      { label: 'Extension (x)', key: 'x', min: 0.01, max: 0.5, step: 0.01, default: 0.1, unit: ' m' },
    ],
    compute: `(v) => { const U = 0.5 * v.k * v.x * v.x; return { traces: [{ label: 'U = \u00BDkx\u00B2 = ', value: \`0.5x\${v.k}x\${v.x}\u00B2\` }], result: U.toFixed(2) + ' J' }; }`,
    practice: `{ question: 'k = 200 N/m, x = 0.1 m. Find elastic PE.', hint: 'U = 0.5 x 200 x 0.01', answer: 1, tolerance: 0.1, explanation: 'U = 1 J. A bow stores this energy when drawn!', errorHint: 'U = \u00BDkx\u00B2' }`,
  },

  // ── Unit 8: Work Done by Gas ──
  {
    key: 'work_done_gas',
    name: 'WorkDoneGas',
    title: "Derivation: Work Done by a Gas",
    gradient: 'from-orange-500 to-red-600',
    color: 'bg-orange-600',
    formula: 'W = P\u0394V',
    formulaDesc: 'Work done during expansion or compression',
    steps: [
      { label: 'Force on Piston', formula: 'F = P \u00D7 A', detail: 'The gas exerts pressure P on the piston of area A. Force = pressure \u00D7 area.' },
      { label: 'Work = Force \u00D7 Distance', formula: 'W = F \u00D7 \u0394y', detail: 'Work = force \u00D7 displacement of the piston in the direction of the force.' },
      { label: 'Substitute Force', formula: 'W = (P \u00D7 A) \u00D7 \u0394y = P \u00D7 (A \u0394y)', detail: 'Substituting F = PA: W = PA\u0394y.' },
      { label: 'A\u0394y = Change in Volume', formula: 'W = P \u0394V', detail: 'Since area \u00D7 displacement = change in volume, W = P\u0394V. For compression (V decreases), work is negative (on the gas).' },
    ],
    sliders: [
      { label: 'Pressure (P)', key: 'P', min: 1e5, max: 5e5, step: 1e4, default: 1.013e5, unit: ' Pa' },
      { label: 'Change in Volume (\u0394V)', key: 'dV', min: 0.001, max: 0.1, step: 0.001, default: 0.01, unit: ' m\u00B3' },
    ],
    compute: `(v) => { const W = v.P * v.dV; return { traces: [{ label: 'W = P\u0394V = ', value: \`\${v.P.toExponential(3)} x \${v.dV}\` }], result: W.toFixed(1) + ' J' }; }`,
    practice: `{ question: 'P = 2e5 Pa, \u0394V = 0.02 m\u00B3. Find work done by gas.', hint: 'W = 2e5 x 0.02', answer: 4000, tolerance: 500, explanation: 'W = 4000 J. This work can be used to move a piston in an engine!', errorHint: 'W = P x \u0394V' }`,
  },

  // ── Unit 8: COP of Refrigerator ──
  {
    key: 'cop_refrigerator',
    name: 'COPRefrigerator',
    title: "Derivation: Coefficient of Performance (Refrigerator)",
    gradient: 'from-cyan-500 to-teal-600',
    color: 'bg-cyan-600',
    formula: 'COP = T\u2082 / (T\u2081 \u2212 T\u2082)',
    formulaDesc: 'Efficiency measure for a refrigerator (reverse Carnot cycle)',
    steps: [
      { label: 'Definition of COP (Cooling)', formula: 'COP = Q\u2082 / W', detail: 'Coefficient of Performance = heat extracted from cold reservoir / work input.' },
      { label: 'Work Input', formula: 'W = Q\u2081 \u2212 Q\u2082', detail: 'Work done on the system = heat rejected to hot reservoir \u2212 heat absorbed from cold reservoir.' },
      { label: 'Substitute', formula: 'COP = Q\u2082 / (Q\u2081 \u2212 Q\u2082)', detail: 'Substituting W = Q\u2081 \u2212 Q\u2082.' },
      { label: 'Using Q \u221D T', formula: 'COP = T\u2082 / (T\u2081 \u2212 T\u2082)', detail: 'For a Carnot refrigerator, Q\u2081/Q\u2082 = T\u2081/T\u2082. Substituting gives COP = T\u2082/(T\u2081\u2212T\u2082). The smaller the temp difference, the higher the COP.' },
    ],
    sliders: [
      { label: 'Cold Temp (T\u2082)', key: 'T2', min: 250, max: 300, step: 5, default: 270, unit: ' K' },
      { label: 'Hot Temp (T\u2081)', key: 'T1', min: 300, max: 350, step: 5, default: 310, unit: ' K' },
    ],
    compute: `(v) => { if (v.T1 <= v.T2) return { traces: [{ label: 'T\u2081 must be > T\u2082!', value: '' }], result: 'Error: Invalid temperatures' }; const cop = v.T2 / (v.T1 - v.T2); return { traces: [{ label: 'COP = T\u2082/(T\u2081-T\u2082) = ', value: \`\${v.T2}/(\${v.T1}-\${v.T2})\` }], result: cop.toFixed(2) }; }`,
    practice: `{ question: 'T\u2082 = 270 K, T\u2081 = 310 K. Find COP.', hint: 'COP = 270/(310-270) = 270/40', answer: 6.75, tolerance: 1, explanation: 'COP = 6.75. A good refrigerator moves 6.75 J of heat per 1 J of work!', errorHint: 'COP = T\u2082/(T\u2081-T\u2082)' }`,
  },

  // ── Unit 9: Doppler Effect (Listener Moving Away) ──
  {
    key: 'doppler_listener_away',
    name: 'DopplerListenerAway',
    title: "Derivation: Doppler Effect (Listener Moving Away)",
    gradient: 'from-pink-500 to-rose-600',
    color: 'bg-pink-600',
    formula: "f' = (v \u2212 v_L)/v \u00D7 f",
    formulaDesc: 'Apparent frequency when listener moves away from source',
    steps: [
      { label: 'Relative Speed of Sound', formula: 'v_relative = v \u2212 v_L', detail: 'When the listener moves away, the effective speed of sound relative to the listener decreases.' },
      { label: 'Apparent Wavelength', formula: '\u03BB = v/f (unchanged)', detail: 'The source is stationary, so the wavelength is unchanged.' },
      { label: 'Apparent Frequency', formula: "f' = v_relative / \u03BB = (v \u2212 v_L) / (v/f)", detail: 'Apparent frequency = relative speed / wavelength.' },
      { label: 'Final Formula', formula: "f' = (v \u2212 v_L)/v \u00D7 f", detail: 'Frequency decreases: listener hears a lower pitch when moving away from a stationary source.' },
    ],
    sliders: [
      { label: 'Source Freq (f)', key: 'f', min: 100, max: 1000, step: 10, default: 440, unit: ' Hz' },
      { label: 'Listener Speed (vL)', key: 'vL', min: 0, max: 50, step: 1, default: 10, unit: ' m/s' },
    ],
    compute: `(v) => { const fp = (340 - v.vL) / 340 * v.f; return { traces: [{ label: \"f' = (v-vL)/v x f = \", value: \\`(\${340}-\${v.vL})/\${340} x \${v.f}\\` }], result: fp.toFixed(1) + ' Hz' }; }`,
    practice: `{ question: 'f = 440 Hz, vL = 20 m/s, v = 340 m/s. Find apparent f.', hint: \"f' = (340-20)/340 x 440\", answer: 414.12, tolerance: 10, explanation: \"f' = 414 Hz. Lower pitch when moving away from the source!\", errorHint: \"f' = (v-vL)/v x f\" }`,
  },

  // ── Unit 9: Doppler Effect (Source Moving Towards) ──
  {
    key: 'doppler_source_towards',
    name: 'DopplerSourceTowards',
    title: "Derivation: Doppler Effect (Source Moving Towards)",
    gradient: 'from-rose-500 to-red-600',
    color: 'bg-rose-600',
    formula: "f' = v/(v \u2212 v_S) \u00D7 f",
    formulaDesc: 'Apparent frequency when source moves toward listener',
    steps: [
      { label: 'Compressed Wavelength', formula: "\u03BB' = \u03BB \u2212 \u0394\u03BB = (v \u2212 v_S)/f", detail: 'Moving source catches up with its own waves, compressing the wavelength ahead of it.' },
      { label: 'Wave Compression', formula: '\u0394\u03BB = v_S/f', detail: 'The distance the source moves in one period = v_S \u00D7 T = v_S/f.' },
      { label: 'Apparent Frequency', formula: "f' = v/\u03BB' = v / ((v \u2212 v_S)/f)", detail: 'Apparent frequency = wave speed / compressed wavelength.' },
      { label: 'Final Formula', formula: "f' = v/(v \u2212 v_S) \u00D7 f", detail: 'Frequency increases: the listener hears a higher pitch when the source approaches.' },
    ],
    sliders: [
      { label: 'Source Freq (f)', key: 'f', min: 100, max: 1000, step: 10, default: 440, unit: ' Hz' },
      { label: 'Source Speed (vS)', key: 'vS', min: 0, max: 50, step: 1, default: 10, unit: ' m/s' },
    ],
    compute: `(v) => { const fp = 340 / (340 - v.vS) * v.f; return { traces: [{ label: \"f' = v/(v-vS) x f = \", value: \\`\${340}/(\${340}-\${v.vS}) x \${v.f}\\` }], result: fp.toFixed(1) + ' Hz' }; }`,
    practice: `{ question: 'f = 440 Hz, vS = 20 m/s, v = 340 m/s. Find apparent f.', hint: \"f' = 340/(340-20) x 440\", answer: 467.5, tolerance: 10, explanation: \"f' = 467.5 Hz. Higher pitch as the ambulance approaches!\", errorHint: \"f' = v/(v-vS) x f\" }`,
  },

  // ── Unit 9: Stationary Waves in Air Columns (Open Pipe) ──
  {
    key: 'stationary_waves_air_column',
    name: 'StationaryWavesAirColumn',
    title: "Derivation: Stationary Waves in Air Columns (Open Pipe)",
    gradient: 'from-violet-500 to-purple-600',
    color: 'bg-violet-600',
    formula: 'f_n = n v / 2L',
    formulaDesc: 'Harmonics of an open pipe (both ends antinodes)',
    steps: [
      { label: 'Antinodes at Both Ends', formula: 'L = n(\u03BB_n/2)', detail: 'For an open pipe, both ends are antinodes. The length L = n \u00D7 (\u03BB_n/2) for the nth harmonic.' },
      { label: 'Wavelength of nth Harmonic', formula: '\u03BB_n = 2L/n', detail: 'Rearrange: \u03BB_n = 2L/n. Fundamental (n=1): \u03BB\u2081 = 2L.' },
      { label: 'Wave Equation', formula: 'v = f_n \u03BB_n', detail: 'Wave speed = frequency \u00D7 wavelength.' },
      { label: 'Frequency Formula', formula: 'f_n = n v / 2L', detail: 'Substitute \u03BB_n: f_n = v/(2L/n) = nv/2L. f\u2081 = v/2L. All harmonics (n=1,2,3,\u2026) are present for open pipes.' },
    ],
    sliders: [
      { label: 'Pipe Length (L)', key: 'L', min: 0.3, max: 3, step: 0.1, default: 1, unit: ' m' },
      { label: 'Harmonic (n)', key: 'n', min: 1, max: 5, step: 1, default: 1, unit: '' },
    ],
    compute: `(v) => { const v_wave = 343; const fn = v.n * v_wave / (2 * v.L); return { traces: [{ label: 'f_n = nv/(2L) = ', value: \\\`\${v.n}x\${v_wave}/(2x\${v.L})\\\` }], result: fn.toFixed(1) + ' Hz' }; }`,
    practice: `{ question: 'L = 1 m, n = 2, v = 343 m/s. Find f_n.', hint: 'f = 2 x 343 / 2 = 343 Hz', answer: 343, tolerance: 20, explanation: 'f\u2082 = 343 Hz. The second harmonic of a 1 m pipe!', errorHint: 'f_n = nv/(2L)' }`,
  },

  // ── Unit 10: Potential Gradient ──
  {
    key: 'potential_gradient',
    name: 'PotentialGradient',
    title: "Derivation: Electric Potential Gradient",
    gradient: 'from-purple-500 to-indigo-600',
    color: 'bg-purple-600',
    formula: 'E = \u2212\u0394V/\u0394r',
    formulaDesc: 'Electric field equals negative potential gradient',
    steps: [
      { label: 'Work Done Moving Test Charge', formula: 'W = F \u0394r = qE \u0394r', detail: 'Work = force \u00D7 displacement = (qE) \u00D7 \u0394r when moving a test charge q through a uniform field.' },
      { label: 'Work = Change in PE', formula: 'W = \u2212q \u0394V', detail: 'Work done against the field = decrease in potential energy = \u2212q\u0394V (negative of charge \u00D7 potential difference).' },
      { label: 'Equate Both Expressions', formula: 'qE \u0394r = \u2212q \u0394V', detail: 'Set the two expressions for work equal to each other.' },
      { label: 'Solve for E', formula: 'E = \u2212\u0394V/\u0394r', detail: 'Cancel q. Electric field E = \u2212(potential gradient). The field points from high to low potential (hence the minus sign).' },
    ],
    sliders: [
      { label: 'Potential Difference (\u0394V)', key: 'dV', min: 1, max: 100, step: 1, default: 12, unit: ' V' },
      { label: 'Distance (\u0394r)', key: 'dr', min: 0.01, max: 1, step: 0.01, default: 0.1, unit: ' m' },
    ],
    compute: `(v) => { const E = v.dV / v.dr; return { traces: [{ label: 'E = \u0394V/\u0394r = ', value: \\\`\${v.dV}/\${v.dr}\\\` }], result: E.toFixed(1) + ' V/m' }; }`,
    practice: `{ question: '\u0394V = 12 V, \u0394r = 0.05 m. Find electric field E.', hint: 'E = 12/0.05', answer: 240, tolerance: 20, explanation: 'E = 240 V/m. The field is the negative gradient of potential!', errorHint: 'E = \u0394V/\u0394r' }`,
  },

  // ── Unit 11: Maximum Power Output ──
  {
    key: 'maximum_power_output',
    name: 'MaximumPowerOutput',
    title: "Derivation: Maximum Power Output",
    gradient: 'from-amber-500 to-orange-600',
    color: 'bg-amber-600',
    formula: 'P_max = \u03B5\u00B2 / 4r',
    formulaDesc: 'Maximum power delivered when load = internal resistance',
    steps: [
      { label: 'Power Delivered to Load', formula: 'P_out = I\u00B2 R', detail: 'Power dissipated in the load resistor R is I\u00B2R.' },
      { label: "Current with Internal Resistance", formula: 'I = \u03B5 / (R + r)', detail: 'From Ohm\u2019s law with internal resistance r: total resistance = R + r, EMF = \u03B5.' },
      { label: 'Substitute Current', formula: 'P_out = \u03B5\u00B2 R / (R + r)\u00B2', detail: 'Substitute I: P_out = (\u03B5/(R+r))\u00B2 \u00D7 R = \u03B5\u00B2R/(R+r)\u00B2.' },
      { label: 'Max When R = r', formula: 'P_max = \u03B5\u00B2 / 4r', detail: 'Maximizing P_out by taking derivative dP/dR = 0 gives R = r. Substituting R=r: P_max = \u03B5\u00B2/(4r).' },
    ],
    sliders: [
      { label: 'EMF (\u03B5)', key: 'emf', min: 1, max: 24, step: 0.5, default: 12, unit: ' V' },
      { label: 'Internal Resistance (r)', key: 'r', min: 0.5, max: 10, step: 0.5, default: 2, unit: ' \u03A9' },
      { label: 'Load Resistance (R)', key: 'R', min: 0.5, max: 20, step: 0.5, default: 2, unit: ' \u03A9' },
    ],
    compute: `(v) => { const I = v.emf / (v.R + v.r); const P = I * I * v.R; const Pmax = v.emf * v.emf / (4 * v.r); return { traces: [{ label: 'P = \u03B5\u00B2R/(R+r)\u00B2 = ', value: \\\`\${v.emf}\u00B2x\${v.R}/(\${v.R}+\${v.r})\u00B2\\\` }, { label: 'P_max = \u03B5\u00B2/4r = ', value: \\\`\${v.emf}\u00B2/(4x\${v.r})\\\` }], result: 'P=' + P.toFixed(2) + 'W (max=' + Pmax.toFixed(2) + 'W)' }; }`,
    practice: `{ question: '\u03B5 = 12 V, r = 2 \u03A9. Find max output power.', hint: 'P_max = 144 / (4 x 2) = 144/8', answer: 18, tolerance: 2, explanation: 'P_max = 18 W. This occurs when R = r = 2 \u03A9!', errorHint: 'P_max = \u03B5\u00B2/(4r)' }`,
  },

  // ── Unit 11: Wheatstone Bridge ──
  {
    key: 'wheatstone_bridge',
    name: 'WheatstoneBridge',
    title: "Derivation: Wheatstone Bridge Balance",
    gradient: 'from-lime-500 to-green-600',
    color: 'bg-lime-600',
    formula: 'R = PS/Q',
    formulaDesc: 'Balance condition: P/Q = R/S',
    steps: [
      { label: 'At Balance, No Current Through Galvanometer', formula: 'I_g = 0', detail: 'When the bridge is balanced, no current flows through the galvanometer (points B and D at same potential).' },
      { label: 'Voltage Drops in Upper Branch', formula: 'V_P = V_R (I\u2081P = I\u2082R)', detail: 'At balance, voltage drop across P equals voltage drop across R (same current in each arm).' },
      { label: 'Voltage Drops in Lower Branch', formula: 'V_Q = V_S (I\u2081Q = I\u2082S)', detail: 'Similarly, voltage across Q equals voltage across S.' },
      { label: 'Divide Equations', formula: 'P/Q = R/S \u21D2 R = PS/Q', detail: 'Dividing the equations: (I\u2081P)/(I\u2081Q) = (I\u2082R)/(I\u2082S). Cancel currents: P/Q = R/S. Therefore R = PS/Q.' },
    ],
    sliders: [
      { label: 'Resistor P', key: 'P', min: 10, max: 200, step: 5, default: 100, unit: ' \u03A9' },
      { label: 'Resistor Q', key: 'Q', min: 10, max: 200, step: 5, default: 50, unit: ' \u03A9' },
      { label: 'Resistor S', key: 'S', min: 10, max: 200, step: 5, default: 75, unit: ' \u03A9' },
    ],
    compute: `(v) => { const R = v.P * v.S / v.Q; return { traces: [{ label: 'R = PS/Q = ', value: \\\`\${v.P}x\${v.S}/\${v.Q}\\\` }], result: R.toFixed(1) + ' \u03A9' }; }`,
    practice: `{ question: 'P = 100 \u03A9, Q = 50 \u03A9, S = 75 \u03A9. Find unknown R.', hint: 'R = 100 x 75 / 50', answer: 150, tolerance: 10, explanation: 'R = 150 \u03A9. The bridge method gives precise resistance measurement!', errorHint: 'R = PS/Q' }`,
  },

  // ── Unit 12: Force Between Two Conductors ──
  {
    key: 'force_between_conductors',
    name: 'ForceBetweenConductors',
    title: "Derivation: Force Between Two Current-Carrying Conductors",
    gradient: 'from-blue-500 to-violet-600',
    color: 'bg-blue-600',
    formula: 'F/L = \u03BC\u2080 I\u2081 I\u2082 / 2\u03C0r',
    formulaDesc: 'Force per unit length between parallel conductors',
    steps: [
      { label: 'Magnetic Field of First Wire', formula: 'B\u2081 = \u03BC\u2080 I\u2081 / 2\u03C0r', detail: 'A long straight wire carrying current I\u2081 produces a circular magnetic field. Strength B\u2081 at distance r.' },
      { label: 'Force on Second Wire', formula: 'F = B\u2081 I\u2082 L', detail: 'The second wire experiences force F = B\u2081 I\u2082 L in the magnetic field of the first wire.' },
      { label: 'Substitute B\u2081', formula: 'F/L = (\u03BC\u2080 I\u2081 / 2\u03C0r) \u00D7 I\u2082 = \u03BC\u2080 I\u2081 I\u2082 / 2\u03C0r', detail: 'Force per unit length. Parallel currents attract, anti-parallel repel.' },
      { label: 'Definition of Ampere', formula: '1 A is current producing 2\u00D710\u207B\u2077 N/m at r = 1 m', detail: 'For I\u2081 = I\u2082 = 1 A and r = 1 m: F/L = \u03BC\u2080/(2\u03C0) = 2\u00D710\u207B\u2077 N/m. This is the definition of the ampere!' },
    ],
    sliders: [
      { label: 'Current 1 (I\u2081)', key: 'I1', min: 1, max: 20, step: 0.5, default: 5, unit: ' A' },
      { label: 'Current 2 (I\u2082)', key: 'I2', min: 1, max: 20, step: 0.5, default: 5, unit: ' A' },
      { label: 'Distance (r)', key: 'r', min: 0.01, max: 0.5, step: 0.01, default: 0.1, unit: ' m' },
    ],
    compute: `(v) => { const mu0 = 4 * Math.PI * 1e-7; const FperL = mu0 * v.I1 * v.I2 / (2 * Math.PI * v.r); return { traces: [{ label: 'F/L = \u03BC\u2080I\u2081I\u2082/(2\u03C0r) = ', value: \\\`\${mu0.toExponential(2)}x\${v.I1}x\${v.I2}/(2\u03C0x\${v.r})\\\` }], result: FperL.toExponential(3) + ' N/m' }; }`,
    practice: `{ question: 'I\u2081 = 5 A, I\u2082 = 5 A, r = 0.1 m. Find F/L (\u03BC\u2080 = 4\u03C0\u00D710\u207B\u2077).', hint: 'F/L = (4\u03C0\u00D710\u207B\u2077)\u00D75\u00D75/(2\u03C0\u00D70.1)', answer: 5e-5, tolerance: 1e-5, explanation: 'F/L = 5\u00D710\u207B\u2075 N/m. A small but measurable force!', errorHint: 'F/L = \u03BC\u2080I\u2081I\u2082/(2\u03C0r)' }`,
  },

  // ── Unit 12: Charged Particle in B Field ──
  {
    key: 'charged_particle_b_field',
    name: 'ChargedParticleBField',
    title: "Derivation: Charged Particle in Magnetic Field",
    gradient: 'from-indigo-500 to-purple-600',
    color: 'bg-indigo-600',
    formula: 'r = mv/qB',
    formulaDesc: 'Radius of circular path of a charge in a magnetic field',
    steps: [
      { label: 'Magnetic Force', formula: 'F_B = qvB (when v \u22A5 B)', detail: 'A charged particle moving perpendicular to a magnetic field experiences a force perpendicular to both v and B.' },
      { label: 'Centripetal Acceleration', formula: 'F_c = mv\u00B2 / r', detail: 'The magnetic force acts as a centripetal force, causing the particle to move in a circle.' },
      { label: 'Forces Balance', formula: 'qvB = mv\u00B2 / r', detail: 'Set magnetic force equal to centripetal force. The charge q cancels from one side.' },
      { label: 'Solve for Radius', formula: 'r = mv / qB', detail: 'Rearrange: r = mv/(qB). Larger mass or velocity = larger radius. Stronger B or larger charge = smaller radius.' },
    ],
    sliders: [
      { label: 'Mass (m)', key: 'm', min: 1e-31, max: 1e-25, step: 1e-31, default: 9.11e-31, unit: ' kg' },
      { label: 'Velocity (v)', key: 'v', min: 1e5, max: 1e7, step: 1e5, default: 2e6, unit: ' m/s' },
      { label: 'Magnetic Field (B)', key: 'B', min: 0.01, max: 1, step: 0.01, default: 0.1, unit: ' T' },
    ],
    compute: `(v) => { const q = 1.6e-19; const r = v.m * v.v / (q * v.B); return { traces: [{ label: 'r = mv/(qB) = ', value: \\\`\${v.m.toExponential(3)}x\${v.v.toExponential(3)}/(1.6e-19x\${v.B})\\\` }], result: r.toExponential(3) + ' m' }; }`,
    practice: `{ question: 'Electron m = 9.11e-31 kg, v = 2e6 m/s, B = 0.1 T. Find r.', hint: 'r = 9.11e-31 x 2e6 / (1.6e-19 x 0.1)', answer: 0.000114, tolerance: 2e-5, explanation: 'r = 1.14\u00D710\u207B\u2074 m = 0.114 mm. The circular path is tiny!', errorHint: 'r = mv/(qB)' }`,
  },

  // ── Unit 12: Velocity Selector ──
  {
    key: 'velocity_selector',
    name: 'VelocitySelector',
    title: "Derivation: Velocity Selector",
    gradient: 'from-cyan-500 to-blue-600',
    color: 'bg-cyan-600',
    formula: 'v = E/B',
    formulaDesc: 'Velocity for undeflected motion through crossed fields',
    finalFormulaExtra: 'Only particles with this velocity pass through undeflected',
    steps: [
      { label: 'Electric Force', formula: 'F_E = qE', detail: 'Electric field exerts force qE on the charged particle in the direction of E.' },
      { label: 'Magnetic Force', formula: 'F_B = qvB', detail: 'Magnetic field exerts force qvB perpendicular to both v and B. For crossed fields, these forces are in opposite directions.' },
      { label: 'Balance Forces (Undeflected)', formula: 'qE = qvB', detail: 'When the forces balance, the particle passes straight through without deflection. Charge q cancels out!' },
      { label: 'Solve for v', formula: 'v = E/B', detail: 'Particles with v = E/B pass through undeflected. Others hit the walls. This is used as a velocity filter in mass spectrometers!' },
    ],
    sliders: [
      { label: 'Electric Field (E)', key: 'E', min: 100, max: 10000, step: 100, default: 1000, unit: ' N/C' },
      { label: 'Magnetic Field (B)', key: 'B', min: 0.01, max: 0.5, step: 0.01, default: 0.05, unit: ' T' },
    ],
    compute: `(v) => { const v_selected = v.E / v.B; return { traces: [{ label: 'v = E/B = ', value: \\\`\${v.E}/\${v.B}\\\` }], result: v_selected.toExponential(3) + ' m/s' }; }`,
    practice: `{ question: 'E = 2000 N/C, B = 0.05 T. Find selected velocity.', hint: 'v = 2000/0.05', answer: 40000, tolerance: 5000, explanation: 'v = 4\u00D710\u2074 m/s. Only particles at this speed pass through undeflected!', errorHint: 'v = E/B' }`,
  },
];

// ============================================================
// GENERATE CONFIG ENTRIES
// ============================================================

// Build TypeScript code for each missing derivation
const newEntries = MISSING.map((m) => {
  const stepsCode = m.steps.map((s) =>
    `      { label: '${s.label.replace(/'/g, "\\'")}', formula: '${s.formula.replace(/'/g, "\\'")}', detail: '${s.detail.replace(/'/g, "\\'")}' }`
  ).join(',\n');

  const slidersCode = m.sliders.map((s) =>
    `      { label: '${s.label.replace(/'/g, "\\'")}', key: '${s.key}', min: ${s.min}, max: ${s.max}, step: ${s.step}, default: ${s.default}, unit: '${s.unit}' }`
  ).join(',\n');

  // compute and practice are already arrow-function / object strings
  const computeCode = m.compute;
  const practiceCode = m.practice;

  return `
  // ── ${m.title} ──
  ${m.key}: {
    title: '${m.title.replace(/'/g, "\\'")}',
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: '${m.gradient}',
    accentColor: '${m.color}',
    finalFormula: '${m.formula.replace(/'/g, "\\'")}',
    finalFormulaDesc: '${m.formulaDesc.replace(/'/g, "\\'")}',
    steps: [
${stepsCode}
    ],
    sliders: [
${slidersCode}
    ],
    compute: ${computeCode},
    practice: ${practiceCode},
  },`;
});

// ============================================================
// UPDATE CONFIG FILE
// ============================================================
let config = fs.readFileSync(CONFIG_FILE, 'utf8');

// Remove the trailing `};` (closing of CLASS11_DERIVATIONS object and export)
config = config.replace(/\n\};$/, ',');

// Append new entries and close
config += `\n${newEntries.join('\n')}\n};\n`;

fs.writeFileSync(CONFIG_FILE, config);
console.log(`✅ Added ${MISSING.length} missing derivations to class11Derivations.ts`);

// ============================================================
// GENERATE COMPONENT FILES
// ============================================================
const TEMPLATE = (name) => `import { GenericDerivationLab } from '../components/GenericDerivationLab';
import { CLASS11_DERIVATIONS } from '../data/class11Derivations';

interface Props {
  onExit: () => void;
}

export default function LabP11Derivation${name}({ onExit }: Props) {
  return (
    <GenericDerivationLab
      onExit={onExit}
      config={CLASS11_DERIVATIONS.${name.charAt(0).toLowerCase() + name.slice(1)}}
    />
  );
}
`;

MISSING.forEach((m) => {
  const filePath = path.join(COMPONENTS_DIR, `LabP11Derivation${m.name}.tsx`);
  fs.writeFileSync(filePath, TEMPLATE(m.name));
  console.log(`  📄 Created LabP11Derivation${m.name}.tsx`);
});

// ============================================================
// UPDATE labRoutes.ts (lazy imports + module ID mappings)
// ============================================================
let routes = fs.readFileSync(LAB_ROUTES, 'utf8');

// Add lazy imports — insert after the last existing Class 11 import
const importLines = MISSING.map((m) =>
  `const LabP11Derivation${m.name} = lazy(() => import('../components/LabP11Derivation${m.name}'));`
).join('\n');

// Find the last p11 lazy import and insert after it
routes = routes.replace(
  /(const LabP11Derivation\w+ = lazy\(\.\.\/components\/LabP11Derivation\w+\)\);)(?![\s\S]*const LabP11Derivation)/,
  `$1\n${importLines}`
);

// Add module ID mappings — insert before the first p12 mapping
const routeMappings = MISSING.map((m) =>
  `  'p11_deriv_${m.key}': 'LabP11Derivation${m.name}',`
).join('\n');

routes = routes.replace(
  /(\/\/ Class 12 Physics)/,
  `  // Class 11 Physics (batch 2)\n${routeMappings}\n\n$1`
);

fs.writeFileSync(LAB_ROUTES, routes);
console.log(`✅ Updated ${LAB_ROUTES} with ${MISSING.length} new imports and mappings`);

// ============================================================
// UPDATE labModules.ts
// ============================================================
let modules = fs.readFileSync(LAB_MODULES, 'utf8');

const moduleEntries = MISSING.map((m) =>
  `  { id: 'p11_deriv_${m.key}', classLevel: '11', subject: 'physics', title: '${m.title.replace(/'/g, "\\'")}', desc: '${m.formulaDesc.replace(/'/g, "\\'")}: ${m.formula}', built: true, bg: '${m.gradient}' },\n`
).join('');

// Insert before the first p12 entry
modules = modules.replace(
  /(\s+\/\/ Class 12 Physics)/,
  `  // Class 11 Physics (batch 2)\n${moduleEntries}$1`
);

fs.writeFileSync(LAB_MODULES, modules);
console.log(`✅ Updated ${LAB_MODULES} with ${MISSING.length} new module entries`);

console.log('\n🎉 All done! Run npx tsc --noEmit to verify.');
