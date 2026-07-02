import type { DerivationConfig } from '../components/GenericDerivationLab';
import { Ruler, ArrowUp, Move, RefreshCw, Circle, Target, Zap, Droplets, Thermometer, Waves, Sun, Battery, Magnet, Atom } from 'lucide-react';

export const CLASS11_DERIVATIONS: Record<string, DerivationConfig> = {
  // === Unit 1: Physical Quantities ===
  dimensional_wavelength: {
    title: "Derivation: Dimensional Analysis (Matter Waves)",
    icon: <Ruler className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-purple-600',
    accentColor: 'bg-indigo-600',
    finalFormula: 'lambda = h / mv',
    finalFormulaDesc: 'Wavelength of matter waves from dimensional analysis',
    steps: [
      { label: 'Identify Dependencies', formula: 'lambda = f(h, m, v) => h^a m^b v^c', detail: 'Wavelength depends on Planck\'s constant h, mass m, and velocity v. Write as proportionality with unknown powers.' },
      { label: 'Write Dimensions', formula: '[L] = [ML^2T^-1]^a [M]^b [LT^-1]^c', detail: 'h has dimensions ML^2T^-1, m has M, v has LT^-1. lambda has L. Equate powers of M, L, T.' },
      { label: 'Solve Power Equations', formula: 'M: a+b=0, L: 2a+c=1, T: -a-c=0', detail: 'Solving: a=1, b=-1, c=-1. These powers make the equation dimensionally consistent.' },
      { label: 'Final Formula', formula: 'lambda = constant x h^1 m^-1 v^-1 = h/mv', detail: 'The constant is 1 (de Broglie later confirmed this). This is the famous de Broglie wavelength formula!' },
    ],
    sliders: [
      { label: 'Mass (m)', key: 'm', min: 1e-31, max: 1e-27, step: 1e-31, default: 9.11e-31, unit: ' kg' },
      { label: 'Velocity (v)', key: 'v', min: 1e3, max: 1e7, step: 1e3, default: 1e5, unit: ' m/s' },
    ],
    compute: (v) => {
      const h = 6.63e-34;
      const lam = h / (v.m * v.v);
      return { traces: [{ label: 'lambda = h/(mv) = ', value: `${h.toExponential(3)}/(${v.m.toExponential(3)}x${v.v.toExponential(3)})` }], result: lam.toExponential(3) + ' m' };
    },
    practice: { question: 'Electron m = 9.11e-31 kg, v = 2e6 m/s. Find lambda (h = 6.63e-34).', hint: 'lambda = 6.63e-34/(9.11e-31 x 2e6)', answer: 3.64e-10, tolerance: 1e-10, explanation: '3.64e-10 m = 0.364 nm. Electron wavelengths are comparable to X-rays!', errorHint: 'lambda = h/(mv)' }
  },

  dimensional_pendulum: {
    title: "Derivation: Time Period of Simple Pendulum",
    icon: <Ruler className="w-5 h-5 text-white" />,
    accentGradient: 'from-emerald-500 to-teal-600',
    accentColor: 'bg-emerald-600',
    finalFormula: 'T = 2pi sqrt(l/g)',
    finalFormulaDesc: 'Period depends on length and gravity, not mass',
    steps: [
      { label: 'Identify Dependencies', formula: 'T = f(m, l, theta, g) => m^a l^b theta^c g^d', detail: 'Period may depend on mass m, length l, angle theta, and gravity g.' },
      { label: 'Write Dimensions', formula: '[T] = [M]^a [L]^b [1]^c [LT^-2]^d', detail: 'Angle theta is dimensionless. T has dimension T. Equate: M: a=0, L: b+d=0, T: -2d=1.' },
      { label: 'Solve Power Equations', formula: 'a=0, d=-1/2, b=1/2, c=0', detail: 'Mass a=0 (period doesn\'t depend on mass!). Angle c=0. l has power 1/2, g has power -1/2.' },
      { label: 'Final Formula', formula: 'T = constant x l^(1/2) g^(-1/2) = 2pi sqrt(l/g)', detail: 'The constant is 2pi (from solving the SHM differential equation). T = 2pi sqrt(l/g).' },
    ],
    sliders: [
      { label: 'Length (l)', key: 'l', min: 0.2, max: 5, step: 0.1, default: 1, unit: ' m' },
    ],
    compute: (v) => {
      const T = 2 * Math.PI * Math.sqrt(v.l / 9.81);
      return { traces: [{ label: 'T = 2pi sqrt(l/g) = ', value: `2x3.14xsqrt(${v.l}/9.81)` }], result: T.toFixed(3) + ' s' };
    },
    practice: { question: 'A pendulum of length l = 1 m. Find its period (g = 9.81).', hint: 'T = 2pi sqrt(1/9.81)', answer: 2.006, tolerance: 0.2, explanation: 'T = 2.01 s. This formula is used in pendulum clocks!', errorHint: 'T = 2pi sqrt(l/g)' }
  },

  // === Unit 2: Vectors ===
  rectangular_components: {
    title: "Derivation: Rectangular Components of a Vector",
    icon: <ArrowUp className="w-5 h-5 text-white" />,
    accentGradient: 'from-sky-500 to-blue-600',
    accentColor: 'bg-sky-600',
    finalFormula: 'A_x = A cos theta, A_y = A sin theta',
    finalFormulaDesc: 'Components from magnitude and direction',
    steps: [
      { label: 'Right Triangle Formed', formula: 'Angle theta between A and x-axis', detail: 'Vector A makes angle theta with the x-axis. Drop a perpendicular to form a right triangle.' },
      { label: 'Cosine for Adjacent (Ax)', formula: 'cos theta = A_x / A => A_x = A cos theta', detail: 'The x-component is adjacent to the angle. Use cosine to find it.' },
      { label: 'Sine for Opposite (Ay)', formula: 'sin theta = A_y / A => A_y = A sin theta', detail: 'The y-component is opposite to the angle. Use sine to find it.' },
      { label: 'Vector from Components', formula: 'A = sqrt(A_x^2 + A_y^2), tan theta = A_y/A_x', detail: 'Pythagoras gives magnitude. Inverse tangent gives direction.' },
    ],
    sliders: [
      { label: 'Magnitude (A)', key: 'A', min: 1, max: 20, step: 1, default: 10, unit: '' },
      { label: 'Angle (theta)', key: 'theta', min: 0, max: 90, step: 1, default: 30, unit: 'deg' },
    ],
    compute: (v) => {
      const rad = v.theta * Math.PI / 180;
      const Ax = v.A * Math.cos(rad);
      const Ay = v.A * Math.sin(rad);
      return { traces: [{ label: 'Ax = A cos theta = ', value: `${v.A}xcos(${v.theta})` }, { label: 'Ay = A sin theta = ', value: `${v.A}xsin(${v.theta})` }], result: `Ax=${Ax.toFixed(1)}, Ay=${Ay.toFixed(1)}` };
    },
    practice: { question: 'A = 10, theta = 30 deg. Find Ay.', hint: 'Ay = 10 x sin(30) = 10 x 0.5', answer: 5, tolerance: 0.5, explanation: 'Ay = 5. The vertical component is half the magnitude.', errorHint: 'Ay = A x sin(theta)' }
  },

  // === Unit 3: Translatory Motion ===
  first_equation: {
    title: "Derivation: First Equation of Motion",
    icon: <Move className="w-5 h-5 text-white" />,
    accentGradient: 'from-blue-500 to-indigo-600',
    accentColor: 'bg-blue-600',
    finalFormula: 'v_f = v_i + at',
    finalFormulaDesc: 'Final velocity = initial velocity + acceleration x time',
    steps: [
      { label: 'Acceleration Definition', formula: 'a = (v_f - v_i) / t', detail: 'Acceleration is the rate of change of velocity: (final - initial) divided by time.' },
      { label: 'Multiply Both Sides by t', formula: 'a x t = v_f - v_i', detail: 'Cross-multiplying: acceleration times time equals the change in velocity.' },
      { label: 'Add v_i to Both Sides', formula: 'v_f = v_i + a t', detail: 'Rearranging: final velocity = initial velocity + (acceleration x time).' },
      { label: 'Graphical Meaning', formula: 'Slope of v-t graph = a', detail: 'On a velocity-time graph, the slope (rise/run) equals acceleration. The equation gives the line.' },
    ],
    sliders: [
      { label: 'Initial Velocity (vi)', key: 'vi', min: 0, max: 50, step: 1, default: 10, unit: ' m/s' },
      { label: 'Acceleration (a)', key: 'a', min: 0, max: 10, step: 0.5, default: 5, unit: ' m/s2' },
      { label: 'Time (t)', key: 't', min: 0, max: 10, step: 0.5, default: 3, unit: ' s' },
    ],
    compute: (v) => {
      const vf = v.vi + v.a * v.t;
      return { traces: [{ label: 'vf = vi + at = ', value: `${v.vi} + ${v.a}x${v.t}` }], result: vf.toFixed(1) + ' m/s' };
    },
    practice: { question: 'vi = 0 m/s, a = 9.81 m/s2, t = 3 s. Find vf.', hint: 'vf = 0 + 9.81 x 3', answer: 29.43, tolerance: 1, explanation: 'vf = 29.4 m/s. Free falling for 3 seconds!', errorHint: 'vf = vi + at' }
  },

  second_equation: {
    title: "Derivation: Second Equation of Motion",
    icon: <Move className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-fuchsia-600',
    accentColor: 'bg-indigo-600',
    finalFormula: 'S = v_i t + (1/2) a t^2',
    finalFormulaDesc: 'Distance = initial velocity x time + half acceleration x time squared',
    steps: [
      { label: 'Area Under v-t Graph', formula: 'S = Area of trapezium', detail: 'Distance is the area under the velocity-time graph. Shape is a trapezium (rectangle + triangle).' },
      { label: 'Rectangle Area', formula: 'S_rect = v_i x t', detail: 'The rectangular part: initial velocity times time.' },
      { label: 'Triangle Area', formula: 'S_tri = (1/2) x (vf - vi) x t = (1/2) x (at) x t', detail: 'The triangular part: half x (change in velocity) x time. Substitute vf-vi = at.' },
      { label: 'Add Both Areas', formula: 'S = v_i t + (1/2) a t^2', detail: 'Total displacement = rectangular area + triangular area.' },
    ],
    sliders: [
      { label: 'Initial Velocity (vi)', key: 'vi', min: 0, max: 30, step: 1, default: 5, unit: ' m/s' },
      { label: 'Acceleration (a)', key: 'a', min: 0, max: 10, step: 0.5, default: 5, unit: ' m/s2' },
      { label: 'Time (t)', key: 't', min: 0, max: 10, step: 0.5, default: 4, unit: ' s' },
    ],
    compute: (v) => {
      const S = v.vi * v.t + 0.5 * v.a * v.t * v.t;
      return { traces: [{ label: 'S = vi t + 0.5at^2 = ', value: `${v.vi}x${v.t} + 0.5x${v.a}x${v.t}^2` }], result: S.toFixed(1) + ' m' };
    },
    practice: { question: 'vi = 0, a = 9.81, t = 2 s. Find distance S.', hint: 'S = 0 + 0.5 x 9.81 x 4', answer: 19.62, tolerance: 1, explanation: 'S = 19.6 m. Distance fallen in 2 seconds of free fall!', errorHint: 'S = vit + 0.5at^2' }
  },

  third_equation: {
    title: "Derivation: Third Equation of Motion",
    icon: <Move className="w-5 h-5 text-white" />,
    accentGradient: 'from-violet-500 to-purple-600',
    accentColor: 'bg-violet-600',
    finalFormula: '2aS = v_f^2 - v_i^2',
    finalFormulaDesc: 'Acceleration x distance = change in velocity squared / 2',
    steps: [
      { label: 'Start with Trapezium Area', formula: 'S = (1/2)(vi + vf) x t', detail: 'Distance = average velocity x time. Average of vi and vf for constant acceleration.' },
      { label: 'Multiply Both Sides by a/a', formula: 'S = (1/2)(vi + vf) x (vf - vi)/a', detail: 'Substitute t = (vf-vi)/a from the first equation of motion.' },
      { label: 'Difference of Squares', formula: '2aS = (vi + vf)(vf - vi) = vf^2 - vi^2', detail: 'Simplify: (vi+vf)(vf-vi) = vf^2 - vi^2. Multiply both sides by 2a.' },
      { label: 'Final Form', formula: '2aS = vf^2 - vi^2', detail: 'This is useful when time is not known. If vi=0: vf^2 = 2aS.' },
    ],
    sliders: [
      { label: 'Initial Velocity (vi)', key: 'vi', min: 0, max: 20, step: 1, default: 0, unit: ' m/s' },
      { label: 'Acceleration (a)', key: 'a', min: 1, max: 10, step: 0.5, default: 5, unit: ' m/s2' },
      { label: 'Distance (S)', key: 'S', min: 1, max: 50, step: 1, default: 10, unit: ' m' },
    ],
    compute: (v) => {
      const vf = Math.sqrt(v.vi * v.vi + 2 * v.a * v.S);
      return { traces: [{ label: 'vf^2 = vi^2 + 2aS = ', value: `${v.vi}^2 + 2x${v.a}x${v.S}` }], result: vf.toFixed(2) + ' m/s' };
    },
    practice: { question: 'vi = 0, a = 9.81, S = 20 m. Find vf.', hint: 'vf^2 = 0 + 2 x 9.81 x 20', answer: 19.81, tolerance: 1, explanation: 'vf = 19.8 m/s. Speed after falling 20 m!', errorHint: 'vf^2 = vi^2 + 2aS' }
  },

  projectile_height: {
    title: "Derivation: Maximum Height of Projectile",
    icon: <Target className="w-5 h-5 text-white" />,
    accentGradient: 'from-rose-500 to-pink-600',
    accentColor: 'bg-rose-600',
    finalFormula: 'H = (v_i^2 sin^2 theta) / 2g',
    finalFormulaDesc: 'Maximum vertical height depends on launch angle',
    steps: [
      { label: 'Initial Vertical Velocity', formula: 'v_iy = v_i sin theta', detail: 'The vertical component of initial velocity determines how high the projectile goes.' },
      { label: 'At Maximum Height', formula: 'v_fy = 0', detail: 'At the peak of the trajectory, the vertical velocity becomes zero (before falling back down).' },
      { label: 'Use Third Equation', formula: 'v_fy^2 = v_iy^2 + 2a_y H', detail: 'Using 2aS = vf^2 - vi^2 in the vertical direction. a_y = -g (downward).' },
      { label: 'Solve for H', formula: '0 = (v_i sin theta)^2 - 2gH => H = v_i^2 sin^2 theta / 2g', detail: 'Rearrange: H = (vi^2 sin^2 theta)/(2g). Maximum height at theta = 90 deg.' },
    ],
    sliders: [
      { label: 'Initial Velocity (vi)', key: 'vi', min: 5, max: 50, step: 1, default: 20, unit: ' m/s' },
      { label: 'Launch Angle (theta)', key: 'theta', min: 10, max: 90, step: 5, default: 45, unit: ' deg' },
    ],
    compute: (v) => {
      const rad = v.theta * Math.PI / 180;
      const H = (v.vi * v.vi * Math.sin(rad) * Math.sin(rad)) / (2 * 9.81);
      return { traces: [{ label: 'H = vi^2 sin^2(theta)/2g = ', value: `${v.vi}^2 x sin^2(${v.theta})/19.62` }], result: H.toFixed(2) + ' m' };
    },
    practice: { question: 'vi = 30 m/s, theta = 45 deg. Find max height (g = 9.81).', hint: 'H = 900 x sin^2(45) / 19.62 = 900 x 0.5 / 19.62', answer: 22.94, tolerance: 2, explanation: 'H = 22.9 m. Maximum height at a given speed occurs at 90 deg!', errorHint: 'H = vi^2 sin^2(theta)/(2g)' }
  },

  projectile_range: {
    title: "Derivation: Range of a Projectile",
    icon: <Target className="w-5 h-5 text-white" />,
    accentGradient: 'from-pink-500 to-rose-600',
    accentColor: 'bg-pink-600',
    finalFormula: 'R = (v_i^2 sin 2theta) / g',
    finalFormulaDesc: 'Horizontal range depends on launch angle (max at 45 deg)',
    steps: [
      { label: 'Horizontal Velocity', formula: 'v_x = v_i cos theta', detail: 'Horizontal velocity is constant (no horizontal force, ignoring air resistance).' },
      { label: 'Time of Flight', formula: 'T = 2 v_i sin theta / g', detail: 'From T = 2v_iy/g. The total time the projectile is in the air.' },
      { label: 'Range = v_x x T', formula: 'R = (v_i cos theta) x (2 v_i sin theta / g)', detail: 'Range = horizontal velocity x time of flight.' },
      { label: 'Use sin 2theta = 2 sin theta cos theta', formula: 'R = v_i^2 sin 2theta / g', detail: 'Using the trig identity: 2 sin theta cos theta = sin 2theta. Max range at theta = 45 deg!' },
    ],
    sliders: [
      { label: 'Initial Velocity (vi)', key: 'vi', min: 5, max: 50, step: 1, default: 20, unit: ' m/s' },
      { label: 'Launch Angle (theta)', key: 'theta', min: 10, max: 80, step: 5, default: 45, unit: ' deg' },
    ],
    compute: (v) => {
      const rad = v.theta * Math.PI / 180;
      const R = (v.vi * v.vi * Math.sin(2 * rad)) / 9.81;
      return { traces: [{ label: 'R = vi^2 sin(2theta)/g = ', value: `${v.vi}^2 x sin(${2*v.theta})/9.81` }], result: R.toFixed(2) + ' m' };
    },
    practice: { question: 'vi = 30 m/s, theta = 45 deg. Find range (g = 9.81).', hint: 'R = 900 x sin(90) / 9.81 = 900 x 1/9.81', answer: 91.74, tolerance: 5, explanation: 'R = 91.7 m. 45 deg gives the maximum range!', errorHint: 'R = vi^2 sin(2theta)/g' }
  },

  elastic_collision: {
    title: "Derivation: 1D Elastic Collision Velocities",
    icon: <RefreshCw className="w-5 h-5 text-white" />,
    accentGradient: 'from-amber-500 to-orange-600',
    accentColor: 'bg-amber-600',
    finalFormula: 'v1 = (m1-m2)/(m1+m2) u1 + 2m2/(m1+m2) u2',
    finalFormulaDesc: 'Final velocities after an elastic collision',
    steps: [
      { label: 'Conservation of Momentum', formula: 'm1 u1 + m2 u2 = m1 v1 + m2 v2', detail: 'Total momentum before collision = total momentum after collision.' },
      { label: 'Conservation of KE', formula: '0.5m1 u1^2 + 0.5m2 u2^2 = 0.5m1 v1^2 + 0.5m2 v2^2', detail: 'In elastic collisions, total kinetic energy is also conserved.' },
      { label: 'Relative Speed Relation', formula: 'u1 - u2 = v2 - v1', detail: 'Dividing the KE equation by the momentum equation gives: relative approach speed = relative separation speed.' },
      { label: 'Solve for v1 and v2', formula: 'v1 = (m1-m2)/(m1+m2) u1 + 2m2/(m1+m2) u2', detail: 'Substitute v2 = v1 + (u1-u2) into momentum equation and solve for v1. Then find v2.' },
    ],
    sliders: [
      { label: 'Mass 1 (m1)', key: 'm1', min: 1, max: 10, step: 0.5, default: 2, unit: ' kg' },
      { label: 'Mass 2 (m2)', key: 'm2', min: 1, max: 10, step: 0.5, default: 1, unit: ' kg' },
      { label: 'Vel 1 (u1)', key: 'u1', min: 0, max: 10, step: 0.5, default: 5, unit: ' m/s' },
      { label: 'Vel 2 (u2)', key: 'u2', min: 0, max: 10, step: 0.5, default: 0, unit: ' m/s' },
    ],
    compute: (v) => {
      const v1 = ((v.m1 - v.m2)/(v.m1 + v.m2))*v.u1 + (2*v.m2/(v.m1+v.m2))*v.u2;
      const v2 = ((2*v.m1)/(v.m1+v.m2))*v.u1 + ((v.m2-v.m1)/(v.m1+v.m2))*v.u2;
      return { traces: [{ label: 'v1 = ', value: `(${v.m1}-${v.m2})/(${v.m1}+${v.m2})x${v.u1} + 2x${v.m2}/(${v.m1}+${v.m2})x${v.u2}` }], result: `v1=${v1.toFixed(2)}, v2=${v2.toFixed(2)} m/s` };
    },
    practice: { question: 'm1 = 2 kg, m2 = 1 kg, u1 = 3 m/s, u2 = 0. Find v1.', hint: 'v1 = (2-1)/(3) x 3 + 0 = 1/3 x 3', answer: 1, tolerance: 0.5, explanation: 'v1 = 1 m/s. The heavier mass continues forward but slower!', errorHint: 'v1 = (m1-m2)/(m1+m2) u1' }
  },

  // === Unit 4: Rotational/Circular ===
  linear_angular: {
    title: "Derivation: Linear-Angular Kinematics Relations",
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-teal-500 to-cyan-600',
    accentColor: 'bg-teal-600',
    finalFormula: 'S = r theta, v = r omega, a_t = r alpha',
    finalFormulaDesc: 'Relating linear and angular variables',
    steps: [
      { label: 'Arc Length', formula: 'S = r theta', detail: 'The arc length traveled by a point at radius r through angle theta (in radians).' },
      { label: 'Linear Velocity', formula: 'v = S/t = r theta/t = r omega', detail: 'Dividing arc length by time: S/t = r(theta/t) = r omega. Tangential velocity.' },
      { label: 'Tangential Acceleration', formula: 'a_t = v/t = r omega/t = r alpha', detail: 'Rate of change of tangential velocity: a_t = r(omega/t) = r alpha.' },
      { label: 'Direction Matters', formula: 'a_c = v^2/r (centripetal)', detail: 'Total linear acceleration has two parts: tangential (a_t = r alpha) and centripetal (a_c = v^2/r).' },
    ],
    sliders: [
      { label: 'Radius (r)', key: 'r', min: 0.1, max: 5, step: 0.1, default: 1, unit: ' m' },
      { label: 'Angular Velocity (omega)', key: 'w', min: 1, max: 20, step: 0.5, default: 5, unit: ' rad/s' },
    ],
    compute: (v) => {
      const linV = v.r * v.w;
      return { traces: [{ label: 'v = r omega = ', value: `${v.r}x${v.w}` }], result: linV.toFixed(2) + ' m/s' };
    },
    practice: { question: 'r = 2 m, omega = 3 rad/s. Find linear velocity v.', hint: 'v = 2 x 3', answer: 6, tolerance: 0.5, explanation: 'v = 6 m/s. The tangential speed at the rim!', errorHint: 'v = r x omega' }
  },

  centripetal_acceleration: {
    title: "Derivation: Centripetal Acceleration",
    icon: <Circle className="w-5 h-5 text-white" />,
    accentGradient: 'from-cyan-500 to-sky-600',
    accentColor: 'bg-cyan-600',
    finalFormula: 'a_c = v^2/r = r omega^2',
    finalFormulaDesc: 'Acceleration toward the center of circular motion',
    steps: [
      { label: 'Similar Triangles (Position)', formula: 'delta r / r = delta theta', detail: 'For small angles, the change in position vector makes a triangle similar to the radius triangle.' },
      { label: 'Similar Triangles (Velocity)', formula: 'delta v / v = delta theta', detail: 'Similarly, the change in velocity vector makes a triangle similar to the velocity triangle.' },
      { label: 'Acceleration = delta v / delta t', formula: 'a = v (delta theta/delta t) = v omega', detail: 'From similar triangles: delta v = v delta theta. Dividing by delta t: a = v(delta theta/delta t) = v omega.' },
      { label: 'Substitute v = r omega', formula: 'a_c = v^2/r = r omega^2', detail: 'Since v = r omega, then a = v omega = v(v/r) = v^2/r. Or a = (r omega)omega = r omega^2.' },
    ],
    sliders: [
      { label: 'Velocity (v)', key: 'v', min: 1, max: 30, step: 0.5, default: 10, unit: ' m/s' },
      { label: 'Radius (r)', key: 'r', min: 1, max: 20, step: 0.5, default: 5, unit: ' m' },
    ],
    compute: (v) => {
      const ac = v.v * v.v / v.r;
      return { traces: [{ label: 'a_c = v^2/r = ', value: `${v.v}^2/${v.r}` }], result: ac.toFixed(2) + ' m/s^2' };
    },
    practice: { question: 'v = 20 m/s, r = 10 m. Find centripetal acceleration.', hint: 'a_c = 20^2/10 = 400/10', answer: 40, tolerance: 2, explanation: 'a_c = 40 m/s^2. About 4x gravity!', errorHint: 'a_c = v^2/r' }
  },

  // === Unit 5: Work & Energy ===
  kinetic_energy: {
    title: "Derivation: Kinetic Energy Formula",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-yellow-500 to-amber-600',
    accentColor: 'bg-yellow-600',
    finalFormula: 'KE = (1/2) m v^2',
    finalFormulaDesc: 'Energy due to motion',
    steps: [
      { label: 'Work-Energy Theorem', formula: 'W = F x d = KE', detail: 'Work done on an object equals change in kinetic energy. W = Fd for constant force.' },
      { label: 'Substitute F = ma', formula: 'W = m x a x d', detail: 'From Newton\'s Second Law, F = ma. Substitute into the work formula.' },
      { label: 'Use Third Equation of Motion', formula: 'd = (vf^2 - vi^2) / 2a', detail: 'From 2ad = vf^2 - vi^2, the distance d = (vf^2 - vi^2)/2a.' },
      { label: 'Final Result', formula: 'KE = (1/2) m (vf^2 - vi^2) or (1/2) mv^2', detail: 'Simplifying: KE = ma x (vf^2-vi^2)/2a = (1/2)m(vf^2-vi^2). If starting from rest: KE = (1/2)mv^2.' },
    ],
    sliders: [
      { label: 'Mass (m)', key: 'm', min: 1, max: 50, step: 1, default: 10, unit: ' kg' },
      { label: 'Velocity (v)', key: 'v', min: 1, max: 20, step: 0.5, default: 5, unit: ' m/s' },
    ],
    compute: (v) => {
      const KE = 0.5 * v.m * v.v * v.v;
      return { traces: [{ label: 'KE = 0.5 x m x v^2 = ', value: `0.5 x ${v.m} x ${v.v}^2` }], result: KE.toFixed(0) + ' J' };
    },
    practice: { question: 'm = 1000 kg, v = 20 m/s. Find KE.', hint: 'KE = 0.5 x 1000 x 400', answer: 200000, tolerance: 10000, explanation: 'KE = 200,000 J. A car at highway speed carries enormous energy!', errorHint: 'KE = 0.5 x m x v^2' }
  },

  // === Unit 6: Fluid Mechanics ===
  archimedes: {
    title: "Derivation: Archimedes' Principle (Upthrust)",
    icon: <Droplets className="w-5 h-5 text-white" />,
    accentGradient: 'from-sky-500 to-blue-600',
    accentColor: 'bg-sky-600',
    finalFormula: 'F_upthrust = rho g V',
    finalFormulaDesc: 'Buoyant force equals weight of displaced fluid',
    steps: [
      { label: 'Pressure at Top Surface', formula: 'F1 = P1 A = rho g h1 A', detail: 'Force on the top of the submerged cylinder is pressure x area. Pressure = rho g h.' },
      { label: 'Pressure at Bottom Surface', formula: 'F2 = P2 A = rho g h2 A', detail: 'Bottom force is larger because h2 > h1. Pressure increases with depth.' },
      { label: 'Net Upward Force', formula: 'F = F2 - F1 = rho g A (h2 - h1)', detail: 'Net buoyant force = bottom force - top force = rho g A x height of cylinder.' },
      { label: 'Volume Substitution', formula: 'F = rho g V', detail: 'Since A x (h2-h1) = V (volume of cylinder), F = rho g V. This equals the weight of the displaced fluid!' },
    ],
    sliders: [
      { label: 'Fluid Density (rho)', key: 'rho', min: 500, max: 2000, step: 50, default: 1000, unit: ' kg/m3' },
      { label: 'Volume Immersed (V)', key: 'V', min: 0.001, max: 0.1, step: 0.001, default: 0.01, unit: ' m3' },
    ],
    compute: (v) => {
      const F = v.rho * 9.81 * v.V;
      return { traces: [{ label: 'F = rho g V = ', value: `${v.rho} x 9.81 x ${v.V}` }], result: F.toFixed(2) + ' N' };
    },
    practice: { question: 'rho = 1000 kg/m3, V = 0.02 m3. Find upthrust (g = 9.81).', hint: 'F = 1000 x 9.81 x 0.02', answer: 196.2, tolerance: 10, explanation: 'F = 196 N. This is why ships float!', errorHint: 'F = rho x g x V' }
  },

  continuity: {
    title: "Derivation: Equation of Continuity",
    icon: <Droplets className="w-5 h-5 text-white" />,
    accentGradient: 'from-blue-500 to-indigo-600',
    accentColor: 'bg-blue-600',
    finalFormula: 'A1 v1 = A2 v2',
    finalFormulaDesc: 'Flow rate is constant: Av = constant for ideal fluids',
    steps: [
      { label: 'Mass Entering Pipe', formula: 'delta m1 = rho1 A1 v1 delta t', detail: 'Mass entering the pipe in time delta t = density x area x velocity x time.' },
      { label: 'Mass Leaving Pipe', formula: 'delta m2 = rho2 A2 v2 delta t', detail: 'Similar expression for mass leaving the other end.' },
      { label: 'Mass Conservation', formula: 'delta m1 = delta m2', detail: 'For steady flow, mass in = mass out. Since rho1 = rho2 (ideal fluid is incompressible).' },
      { label: 'Cancel Common Terms', formula: 'A1 v1 = A2 v2 = constant', detail: 'Cancel density and time. The product Av remains constant throughout the pipe.' },
    ],
    sliders: [
      { label: 'Area 1 (A1)', key: 'A1', min: 0.01, max: 0.1, step: 0.005, default: 0.05, unit: ' m2' },
      { label: 'Velocity 1 (v1)', key: 'v1', min: 1, max: 10, step: 0.5, default: 3, unit: ' m/s' },
      { label: 'Area 2 (A2)', key: 'A2', min: 0.005, max: 0.05, step: 0.001, default: 0.01, unit: ' m2' },
    ],
    compute: (v) => {
      const v2 = v.A1 * v.v1 / v.A2;
      return { traces: [{ label: 'v2 = A1v1/A2 = ', value: `${v.A1}x${v.v1}/${v.A2}` }], result: v2.toFixed(2) + ' m/s' };
    },
    practice: { question: 'A1 = 0.05 m2, v1 = 2 m/s, A2 = 0.01 m2. Find v2.', hint: 'v2 = 0.05 x 2 / 0.01', answer: 10, tolerance: 1, explanation: 'v2 = 10 m/s! Fluid speeds up when area narrows!', errorHint: 'A1v1 = A2v2' }
  },

  bernoulli: {
    title: "Derivation: Bernoulli's Equation",
    icon: <Droplets className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-blue-600',
    accentColor: 'bg-indigo-600',
    finalFormula: 'P + 0.5 rho v^2 + rho g h = constant',
    finalFormulaDesc: 'Energy conservation in fluid flow',
    steps: [
      { label: 'Work at Lower End', formula: 'W1 = P1 A1 delta x1 = P1 V', detail: 'Work done on the fluid at the lower end = pressure x area x displacement = P x volume.' },
      { label: 'Work at Upper End', formula: 'W2 = -P2 A2 delta x2 = -P2 V', detail: 'Work done by fluid at upper end is negative (fluid does work on surroundings).' },
      { label: 'Net Work = Change in Energy', formula: '(P1 - P2)V = (0.5mv2^2 - 0.5mv1^2) + (mgh2 - mgh1)', detail: 'Net work = change in KE + change in PE (Work-Energy Theorem).' },
      { label: 'Divide by Volume', formula: 'P1 + 0.5 rho v1^2 + rho g h1 = P2 + 0.5 rho v2^2 + rho g h2', detail: 'Mass m = rho V. Substituting and dividing by V gives Bernoulli\'s equation. Total energy per volume is constant!' },
    ],
    sliders: [
      { label: 'Height (h)', key: 'h', min: 0, max: 20, step: 1, default: 0, unit: ' m' },
      { label: 'Velocity (v)', key: 'v', min: 1, max: 20, step: 0.5, default: 5, unit: ' m/s' },
      { label: 'Pressure (P)', key: 'P', min: 1e5, max: 3e5, step: 1e4, default: 1e5, unit: ' Pa' },
    ],
    compute: (v) => {
      const constant = v.P + 0.5 * 1000 * v.v * v.v + 1000 * 9.81 * v.h;
      return { traces: [{ label: 'Bernoulli constant = ', value: `${v.P} + 0.5x1000x${v.v}^2 + 1000x9.81x${v.h}` }], result: constant.toExponential(3) + ' Pa' };
    },
    practice: { question: 'P = 200000 Pa, v = 5 m/s, h = 10 m. Find Bernoulli constant (rho = 1000).', hint: 'C = 200000 + 0.5x1000x25 + 1000x9.81x10', answer: 310600, tolerance: 20000, explanation: 'C = 310,600 Pa. The constant stays the same along any streamline!', errorHint: 'P + 0.5 rho v^2 + rho g h' }
  },

  // === Unit 8: Thermodynamics ===
  carnot_efficiency: {
    title: "Derivation: Carnot Engine Efficiency",
    icon: <Thermometer className="w-5 h-5 text-white" />,
    accentGradient: 'from-red-500 to-orange-600',
    accentColor: 'bg-red-600',
    finalFormula: 'eta = 1 - T2/T1',
    finalFormulaDesc: 'Maximum possible efficiency of a heat engine',
    steps: [
      { label: 'Efficiency Definition', formula: 'eta = Work output / Heat input = (Q1 - Q2) / Q1', detail: 'Efficiency = (input - waste)/input = 1 - Q2/Q1. Q1 is heat absorbed, Q2 is heat rejected.' },
      { label: 'Carnot Cycle Property', formula: 'Q2/Q1 = T2/T1', detail: 'For a Carnot (ideal) cycle, the ratio of heat rejected to heat absorbed equals the ratio of absolute temperatures.' },
      { label: 'Substitute', formula: 'eta = 1 - T2/T1', detail: 'Substitute Q2/Q1 with T2/T1. This gives the maximum theoretical efficiency.' },
      { label: 'Limits', formula: 'eta < 1 always', detail: 'Since T2 > 0 always (cannot reach absolute zero), eta is always less than 1. No engine can be 100% efficient!' },
    ],
    sliders: [
      { label: 'Hot Reservoir (T1)', key: 'T1', min: 300, max: 1000, step: 10, default: 500, unit: ' K' },
      { label: 'Cold Reservoir (T2)', key: 'T2', min: 200, max: 400, step: 5, default: 300, unit: ' K' },
    ],
    compute: (v) => {
      if (v.T2 >= v.T1) return { traces: [{ label: 'T2 must be < T1!', value: '' }], result: 'Error: T2 < T1 required' };
      const eta = 1 - v.T2 / v.T1;
      return { traces: [{ label: 'eta = 1 - T2/T1 = 1 - ', value: `${v.T2}/${v.T1}` }], result: (eta * 100).toFixed(1) + '%' };
    },
    practice: { question: 'T1 = 600 K, T2 = 300 K. Find Carnot efficiency.', hint: 'eta = 1 - 300/600 = 1 - 0.5', answer: 0.5, tolerance: 0.05, explanation: 'eta = 50%. The maximum possible efficiency is 50%!', errorHint: 'eta = 1 - T2/T1' }
  },

  // === Unit 9: Waves ===
  doppler_listener_towards: {
    title: "Derivation: Doppler Effect (Listener Moving Towards)",
    icon: <Waves className="w-5 h-5 text-white" />,
    accentGradient: 'from-fuchsia-500 to-pink-600',
    accentColor: 'bg-fuchsia-600',
    finalFormula: "f' = (v + v_L)/v x f",
    finalFormulaDesc: 'Apparent frequency when listener moves toward source',
    steps: [
      { label: 'Relative Speed of Sound', formula: 'v_relative = v + v_L', detail: 'When listener moves toward the source, the effective speed of sound relative to listener increases.' },
      { label: 'Apparent Wavelength', formula: "lambda = v/f (unchanged)", detail: 'The wavelength is determined by the source, which is stationary. Wavelength stays the same.' },
      { label: 'Apparent Frequency', formula: "f' = v_relative / lambda = (v + v_L) / (v/f)", detail: 'Apparent frequency = relative speed / wavelength. Substitute lambda = v/f.' },
      { label: 'Final Formula', formula: "f' = (v + v_L)/v x f", detail: 'Frequency increases: the listener hears a higher pitch when moving toward a stationary source.' },
    ],
    sliders: [
      { label: 'Source Freq (f)', key: 'f', min: 100, max: 1000, step: 10, default: 440, unit: ' Hz' },
      { label: 'Listener Speed (vL)', key: 'vL', min: 0, max: 50, step: 1, default: 10, unit: ' m/s' },
    ],
    compute: (v) => {
      const fp = (340 + v.vL) / 340 * v.f;
      return { traces: [{ label: "f' = (v+vL)/v x f = ", value: `(${340}+${v.vL})/${340} x ${v.f}` }], result: fp.toFixed(1) + ' Hz' };
    },
    practice: { question: 'f = 440 Hz, vL = 20 m/s, v = 340 m/s. Find apparent f.', hint: "f' = (340+20)/340 x 440", answer: 465.88, tolerance: 10, explanation: "f' = 466 Hz. Pitch sounds higher when moving toward the source!", errorHint: "f' = (v+vL)/v x f" }
  },

  stationary_waves_string: {
    title: "Derivation: Stationary Waves in Strings",
    icon: <Waves className="w-5 h-5 text-white" />,
    accentGradient: 'from-pink-500 to-rose-600',
    accentColor: 'bg-pink-600',
    finalFormula: 'f_n = n x v / 2L',
    finalFormulaDesc: 'Harmonics of a stretched string',
    steps: [
      { label: 'Nodes at Both Ends', formula: 'L = n x lambda_n / 2', detail: 'For a fixed string, both ends are nodes. String length L = n(lambda/2) for the nth harmonic.' },
      { label: 'Wavelength of nth Harmonic', formula: 'lambda_n = 2L / n', detail: 'Rearrange: lambda_n = 2L/n. The fundamental (n=1): lambda_1 = 2L.' },
      { label: 'Wave Equation', formula: 'v = f_n x lambda_n', detail: 'Using the universal wave equation: speed = frequency x wavelength.' },
      { label: 'Frequency Formula', formula: 'f_n = n x v / 2L', detail: 'Substitute lambda_n: f_n = v/(2L/n) = n v/(2L). f_1 = v/2L (fundamental). f_n = n f_1 (harmonics).' },
    ],
    sliders: [
      { label: 'String Length (L)', key: 'L', min: 0.5, max: 3, step: 0.1, default: 1, unit: ' m' },
      { label: 'Harmonic (n)', key: 'n', min: 1, max: 5, step: 1, default: 1, unit: '' },
    ],
    compute: (v) => {
      const v_wave = 100; // wave speed on string in m/s
      const fn = v.n * v_wave / (2 * v.L);
      return { traces: [{ label: 'f_n = n x v/(2L) = ', value: `${v.n} x ${v_wave}/(2x${v.L})` }], result: fn.toFixed(1) + ' Hz' };
    },
    practice: { question: 'L = 1.5 m, n = 2, v = 100 m/s. Find frequency.', hint: 'f = 2 x 100/(2 x 1.5) = 200/3', answer: 66.67, tolerance: 5, explanation: 'f_2 = 66.7 Hz. The second harmonic is twice the fundamental frequency!', errorHint: 'f_n = n x v/(2L)' }
  },

  // === Unit 10: Electrostatics ===
  electric_field_point: {
    title: "Derivation: Electric Field of a Point Charge",
    icon: <Sun className="w-5 h-5 text-white" />,
    accentGradient: 'from-violet-500 to-purple-600',
    accentColor: 'bg-violet-600',
    finalFormula: 'E = k Q / r^2',
    finalFormulaDesc: 'Electric field intensity from a point charge',
    steps: [
      { label: 'Definition of Electric Field', formula: 'E = F / q', detail: 'Electric field at a point = force experienced by a test charge q divided by the test charge.' },
      { label: 'Coulomb\'s Law', formula: 'F = k Q q / r^2', detail: 'Force between two point charges: k = 9x10^9 N m^2/C^2.' },
      { label: 'Substitute F into E', formula: 'E = (k Q q / r^2) / q', detail: 'The test charge q cancels out! The field depends only on the source charge Q.' },
      { label: 'Final Formula', formula: 'E = k Q / r^2', detail: 'Direction: radially outward from positive Q, inward toward negative Q.' },
    ],
    sliders: [
      { label: 'Charge (Q)', key: 'Q', min: 1e-9, max: 1e-6, step: 1e-9, default: 1e-8, unit: ' C' },
      { label: 'Distance (r)', key: 'r', min: 0.1, max: 5, step: 0.1, default: 1, unit: ' m' },
    ],
    compute: (v) => {
      const E = 9e9 * v.Q / (v.r * v.r);
      return { traces: [{ label: 'E = kQ/r^2 = 9e9 x ', value: `${v.Q.toExponential(3)}/${v.r}^2` }], result: E.toExponential(3) + ' N/C' };
    },
    practice: { question: 'Q = 2e-9 C, r = 0.5 m. Find E (k = 9e9).', hint: 'E = 9e9 x 2e-9 / 0.25', answer: 72, tolerance: 10, explanation: 'E = 72 N/C. Field is stronger closer to the charge!', errorHint: 'E = kQ/r^2' }
  },

  // === Unit 11: Electricity ===
  drift_velocity: {
    title: "Derivation: Drift Velocity and Electric Current",
    icon: <Battery className="w-5 h-5 text-white" />,
    accentGradient: 'from-amber-500 to-orange-600',
    accentColor: 'bg-amber-600',
    finalFormula: 'I = n e A v_d',
    finalFormulaDesc: 'Current from charge carrier density and drift velocity',
    steps: [
      { label: 'Total Charge in Conductor', formula: 'Q = n A L e', detail: 'Total charge Q = number density n x volume (A x L) x charge per carrier e.' },
      { label: 'Current = Charge / Time', formula: 'I = Q/t = (n A L e) / t', detail: 'By definition, current is the amount of charge passing through per unit time.' },
      { label: 'Distance / Time = Velocity', formula: 'I = n A e (L/t) = n A e v_d', detail: 'L/t is the drift velocity v_d (the average speed of charge carriers through the conductor).' },
      { label: 'Final Formula', formula: 'I = n e A v_d', detail: 'Current = number density x elementary charge x cross-sectional area x drift velocity. For copper: v_d ~ 0.1 mm/s!' },
    ],
    sliders: [
      { label: 'Charge Density (n)', key: 'n', min: 1e28, max: 1e29, step: 1e27, default: 8.5e28, unit: '/m3' },
      { label: 'Area (A)', key: 'A', min: 1e-6, max: 1e-4, step: 1e-6, default: 1e-5, unit: ' m2' },
      { label: 'Drift Velocity (vd)', key: 'vd', min: 1e-5, max: 1e-3, step: 1e-5, default: 1e-4, unit: ' m/s' },
    ],
    compute: (v) => {
      const I = v.n * 1.6e-19 * v.A * v.vd;
      return { traces: [{ label: 'I = n e A vd = ', value: `${v.n.toExponential(3)} x 1.6e-19 x ${v.A.toExponential(3)} x ${v.vd.toExponential(3)}` }], result: I.toFixed(3) + ' A' };
    },
    practice: { question: 'n = 8.5e28, A = 1e-5, vd = 2e-4. Find I (e = 1.6e-19).', hint: 'I = 8.5e28 x 1.6e-19 x 1e-5 x 2e-4', answer: 0.0272, tolerance: 0.01, explanation: 'I = 0.027 A. Electrons move incredibly slowly (0.2 mm/s) yet carry significant current!', errorHint: 'I = n e A vd' }
  },

  // === Unit 12: Electromagnetism ===
  magnetic_force: {
    title: "Derivation: Magnetic Force on Current-Carrying Conductor",
    icon: <Magnet className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-fuchsia-600',
    accentColor: 'bg-indigo-600',
    finalFormula: 'F = B I L sin theta',
    finalFormulaDesc: 'Force = mag field x current x length x sin(angle)',
    steps: [
      { label: 'Force on Moving Charges', formula: 'F = q v B sin theta', detail: 'A single moving charge q in a magnetic field B experiences a force perpendicular to both v and B.' },
      { label: 'Current = Moving Charges', formula: 'I = q/t so q = I t', detail: 'Total charge = current x time. The force acts on ALL charge carriers in the wire.' },
      { label: 'Velocity = L/t', formula: 'F = (I t) x (L/t) x B sin theta = I L B sin theta', detail: 'Substitute q = It and v = L/t. Time cancels out: F = I L B sin theta.' },
      { label: 'Direction: Right Hand Rule', formula: 'F perpendicular to both I and B', detail: 'Use the right-hand rule: thumb in direction of current, fingers in B field, force comes out of palm.' },
    ],
    sliders: [
      { label: 'Current (I)', key: 'I', min: 0.5, max: 10, step: 0.5, default: 3, unit: ' A' },
      { label: 'Length (L)', key: 'L', min: 0.1, max: 2, step: 0.1, default: 0.5, unit: ' m' },
      { label: 'Magnetic Field (B)', key: 'B', min: 0.1, max: 2, step: 0.1, default: 0.5, unit: ' T' },
      { label: 'Angle (theta)', key: 'theta', min: 0, max: 90, step: 5, default: 90, unit: ' deg' },
    ],
    compute: (v) => {
      const rad = v.theta * Math.PI / 180;
      const F = v.B * v.I * v.L * Math.sin(rad);
      return { traces: [{ label: 'F = B I L sin(theta) = ', value: `${v.B} x ${v.I} x ${v.L} x sin(${v.theta})` }], result: F.toFixed(3) + ' N' };
    },
    practice: { question: 'B = 0.5 T, I = 2 A, L = 0.3 m, theta = 90 deg. Find F.', hint: 'F = 0.5 x 2 x 0.3 x 1', answer: 0.3, tolerance: 0.05, explanation: 'F = 0.3 N. This is how electric motors work!', errorHint: 'F = BIL sin(theta)' }
  },

  faraday_law: {
    title: "Derivation: Faraday's Law of Induction",
    icon: <Magnet className="w-5 h-5 text-white" />,
    accentGradient: 'from-fuchsia-500 to-pink-600',
    accentColor: 'bg-fuchsia-600',
    finalFormula: 'epsilon = -N d(Phi)/dt',
    finalFormulaDesc: 'Induced EMF equals negative rate of change of flux',
    steps: [
      { label: 'Faraday\'s Observation', formula: 'epsilon proportional to N dPhi/dt', detail: 'Michael Faraday discovered that a changing magnetic field induces an EMF in a nearby conductor.' },
      { label: 'Magnetic Flux', formula: 'Phi = B A cos theta', detail: 'Magnetic flux = magnetic field x area x cosine of the angle between field and normal to surface.' },
      { label: 'Rate of Change', formula: 'epsilon = -N (delta Phi / delta t)', detail: 'The induced EMF is proportional to the rate at which magnetic flux changes through the coil.' },
      { label: 'Lenz\'s Law (Negative Sign)', formula: 'epsilon = -N dPhi/dt', detail: 'Lenz\'s Law: the induced current opposes the change causing it. This is why there\'s a negative sign.' },
    ],
    sliders: [
      { label: 'Number of Turns (N)', key: 'N', min: 1, max: 200, step: 5, default: 100, unit: '' },
      { label: 'Change in Flux (dPhi)', key: 'dPhi', min: 0.01, max: 1, step: 0.01, default: 0.5, unit: ' Wb' },
      { label: 'Time Interval (dt)', key: 'dt', min: 0.1, max: 2, step: 0.1, default: 0.5, unit: ' s' },
    ],
    compute: (v) => {
      const emf = v.N * v.dPhi / v.dt;
      return { traces: [{ label: 'epsilon = N dPhi/dt = ', value: `${v.N} x ${v.dPhi}/${v.dt}` }], result: emf.toFixed(2) + ' V' };
    },
    practice: { question: 'N = 100, dPhi = 0.2 Wb, dt = 0.1 s. Find induced EMF.', hint: 'epsilon = 100 x 0.2/0.1', answer: 200, tolerance: 20, explanation: 'epsilon = 200 V. Fast-changing flux generates high voltage!', errorHint: 'epsilon = N x dPhi/dt' }
  },

  // ── Unit 3: Projectile Time of Flight ──
  projectile_time_flight: {
    title: "Derivation: Time of Flight of Projectile",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-rose-500 to-red-600',
    accentColor: 'bg-rose-600',
    finalFormula: 'T = 2v_i sin\u03B8 / g',
    finalFormulaDesc: 'Total time projectile stays in the air',
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
    compute: (v: any) => {
      const rad = v.theta * Math.PI / 180;
      const T = 2 * v.vi * Math.sin(rad) / 9.81;
      return { traces: [{ label: 'T = 2v_i sin\u03B8/g = ', value: `2x${v.vi}xsin(${v.theta})/9.81` }], result: T.toFixed(2) + ' s' };
    },
    practice: { question: 'vi = 30 m/s, \u03B8 = 45 deg. Find time of flight (g = 9.81).', hint: 'T = 2\u00D730\u00D7sin(45)/9.81 = 2\u00D730\u00D70.707/9.81', answer: 4.32, tolerance: 0.5, explanation: 'T = 4.32 s. The projectile is in the air for over 4 seconds!', errorHint: 'T = 2v_i sin\u03B8/g' },
  },

  // ── Unit 4: Angular Momentum ──
  angular_momentum: {
    title: "Derivation: Angular Momentum",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-green-500 to-emerald-600',
    accentColor: 'bg-green-600',
    finalFormula: 'L = I\u03C9 = mr\u00B2\u03C9',
    finalFormulaDesc: 'Rotational analogue of linear momentum',
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
    compute: (v: any) => {
      const I = v.m * v.r * v.r;
      const L = I * v.w;
      return { traces: [{ label: 'I = mr\u00B2 = ', value: `${v.m}x${v.r}\u00B2` }, { label: 'L = I\u03C9 = ', value: `${I.toFixed(1)}x${v.w}` }], result: L.toFixed(2) + ' kg\u00B7m\u00B2/s' };
    },
    practice: { question: 'm = 2 kg, r = 1 m, \u03C9 = 5 rad/s. Find L.', hint: 'L = (2\u00D71\u00B2)\u00D75 = 2\u00D75', answer: 10, tolerance: 1, explanation: 'L = 10 kg\u00B7m\u00B2/s. Angular momentum is conserved!', errorHint: 'L = I\u03C9 = mr\u00B2\u03C9' },
  },

  // ── Unit 4: Torque & Angular Acceleration ──
  torque_inertia: {
    title: "Derivation: Torque and Angular Acceleration",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-emerald-500 to-teal-600',
    accentColor: 'bg-emerald-600',
    finalFormula: '\u03C4 = I\u03B1',
    finalFormulaDesc: 'Rotational analogue of Newton\u2019s Second Law',
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
    compute: (v: any) => {
      const I = v.m * v.r * v.r;
      const tau = v.F * v.r;
      const alpha = tau / I;
      return { traces: [{ label: 'I = mr\u00B2 = ', value: `${v.m}x${v.r}\u00B2` }, { label: '\u03C4 = rF = ', value: `${v.r}x${v.F}` }], result: '\u03B1=' + alpha.toFixed(2) + ' rad/s\u00B2' };
    },
    practice: { question: 'F = 10 N, r = 0.5 m, m = 2 kg. Find \u03B1.', hint: 'I = 2\u00D70.25 = 0.5. \u03C4 = 0.5\u00D710 = 5. \u03B1 = 5/0.5', answer: 10, tolerance: 1, explanation: '\u03B1 = 10 rad/s\u00B2. A small torque on a small I produces large angular acceleration!', errorHint: '\u03B1 = \u03C4/I = Fr/(mr\u00B2)' },
  },

  // ── Unit 4: Artificial Gravity ──
  artificial_gravity: {
    title: "Derivation: Artificial Gravity / Satellite Velocity",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-teal-500 to-green-600',
    accentColor: 'bg-teal-600',
    finalFormula: 'v = \u221A(gR), \u03C9 = \u221A(g/R)',
    finalFormulaDesc: 'Creating artificial gravity via rotation',
    steps: [
      { label: 'Centripetal Equals Gravity', formula: 'a_c = g', detail: 'For artificial gravity, centripetal acceleration equals gravity (9.81 m/s\u00B2).' },
      { label: 'Substitute a_c = v\u00B2/R', formula: 'v\u00B2/R = g', detail: 'Centripetal acceleration: a_c = v\u00B2/R. Set equal to g.' },
      { label: 'Solve for v', formula: 'v = \u221A(gR)', detail: 'Multiply both sides by R: v\u00B2 = gR. Take square root: v = \u221A(gR).' },
      { label: 'Using v = \u03C9R', formula: '\u03C9 = \u221A(g/R)', detail: 'Substitute v = \u03C9R: (\u03C9R)\u00B2 = gR \u21D2 \u03C9\u00B2R\u00B2 = gR \u21D2 \u03C9\u00B2 = g/R \u21D2 \u03C9 = \u221A(g/R).' },
    ],
    sliders: [
      { label: 'Radius (R)', key: 'R', min: 10, max: 200, step: 5, default: 50, unit: ' m' },
    ],
    compute: (v: any) => {
      const g = 9.81;
      const linV = Math.sqrt(g * v.R);
      const angV = Math.sqrt(g / v.R);
      return { traces: [{ label: 'v = \u221A(gR) = ', value: `\u221A(${g}x${v.R})` }, { label: '\u03C9 = \u221A(g/R) = ', value: `\u221A(${g}/${v.R})` }], result: 'v=' + linV.toFixed(1) + ' m/s, \u03C9=' + angV.toFixed(3) + ' rad/s' };
    },
    practice: { question: 'Space station R = 50 m. Find rotation speed for artificial g = 9.81.', hint: 'v = \u221A(9.81\u00D750) = \u221A(490.5)', answer: 22.15, tolerance: 2, explanation: 'v = 22.1 m/s = 79.6 km/h. The station must rotate quite fast!', errorHint: 'v = \u221A(gR)' },
  },

  // ── Unit 6: Terminal Velocity ──
  terminal_velocity: {
    title: "Derivation: Terminal Velocity",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-sky-500 to-blue-600',
    accentColor: 'bg-sky-600',
    finalFormula: 'v_t = 2\u03C1gr\u00B2 / 9\u03B7',
    finalFormulaDesc: 'Maximum speed reached by a falling object through a fluid',
    steps: [
      { label: 'Forces at Terminal Velocity', formula: 'Weight = Drag: mg = F_drag', detail: 'At terminal velocity, weight equals drag force. Net force = 0, acceleration = 0.' },
      { label: 'Stokes\u2019 Law for Drag', formula: 'F_drag = 6\u03C0\u03B7 r v_t', detail: 'For a sphere in a viscous fluid, Stokes\u2019 Law: drag = 6\u03C0 \u00D7 viscosity \u00D7 radius \u00D7 velocity.' },
      { label: 'Mass of Sphere', formula: 'm = \u03C1V = \u03C1 \u00D7 (4/3)\u03C0 r\u00B3', detail: 'Mass = density \u00D7 volume. Volume of a sphere = (4/3)\u03C0r\u00B3.' },
      { label: 'Solve for v_t', formula: 'v_t = 2\u03C1 g r\u00B2 / 9\u03B7', detail: 'Substitute mass: \u03C1(4/3)\u03C0r\u00B3g = 6\u03C0\u03B7rv_t. Cancel \u03C0 and r. v_t \u221D r\u00B2! Larger droplets fall faster.' },
    ],
    sliders: [
      { label: 'Density (\u03C1)', key: 'rho', min: 500, max: 2000, step: 50, default: 1000, unit: ' kg/m\u00B3' },
      { label: 'Radius (r)', key: 'r', min: 0.001, max: 0.01, step: 0.0005, default: 0.005, unit: ' m' },
      { label: 'Viscosity (\u03B7)', key: 'eta', min: 0.001, max: 0.01, step: 0.0005, default: 0.005, unit: ' Pa\u00B7s' },
    ],
    compute: (v: any) => {
      const vt = 2 * v.rho * 9.81 * v.r * v.r / (9 * v.eta);
      return { traces: [{ label: 'v_t = 2\u03C1gr\u00B2/(9\u03B7) = ', value: `2x${v.rho}x9.81x${v.r}\u00B2/(9x${v.eta})` }], result: vt.toFixed(4) + ' m/s' };
    },
    practice: { question: 'Water droplet r = 0.002 m, \u03B7 = 1.8e-5 Pa\u00B7s, \u03C1 = 1000 kg/m\u00B3. Find v_t.', hint: 'v_t = 2\u00D71000\u00D79.81\u00D7(0.002)\u00B2/(9\u00D71.8e-5)', answer: 484.4, tolerance: 50, explanation: 'v_t = 484 m/s! But air resistance becomes more complex at high speeds.', errorHint: 'v_t = 2\u03C1gr\u00B2/(9\u03B7)' },
  },

  // ── Unit 11: Equivalent Resistance (Series) ──
  resistance_series: {
    title: "Derivation: Equivalent Resistance (Series)",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-blue-500 to-indigo-600',
    accentColor: 'bg-blue-600',
    finalFormula: 'R_eq = R\u2081 + R\u2082 + R\u2083',
    finalFormulaDesc: 'Total resistance in series = sum of individual resistances',
    steps: [
      { label: 'KVL: Voltages Add', formula: 'V_total = V\u2081 + V\u2082 + V\u2083', detail: 'By Kirchhoff\u2019s Voltage Law, total voltage = sum of voltage drops across each resistor.' },
      { label: 'Ohm\u2019s Law for Each', formula: 'IR_eq = IR\u2081 + IR\u2082 + IR\u2083', detail: 'Apply V = IR for each resistor. Current I is the same through all resistors in series.' },
      { label: 'Current is Common', formula: 'I R_eq = I (R\u2081 + R\u2082 + R\u2083)', detail: 'Factor out the common current I from both sides.' },
      { label: 'Cancel Current I', formula: 'R_eq = R\u2081 + R\u2082 + R\u2083', detail: 'Divide both sides by I. Equivalent resistance = sum of individual resistances.' },
    ],
    sliders: [
      { label: 'R\u2081', key: 'R1', min: 10, max: 200, step: 5, default: 100, unit: ' \u03A9' },
      { label: 'R\u2082', key: 'R2', min: 10, max: 200, step: 5, default: 50, unit: ' \u03A9' },
      { label: 'R\u2083', key: 'R3', min: 10, max: 200, step: 5, default: 25, unit: ' \u03A9' },
    ],
    compute: (v: any) => {
      const Req = v.R1 + v.R2 + v.R3;
      return { traces: [{ label: 'R_eq = R\u2081+R\u2082+R\u2083 = ', value: `${v.R1}+${v.R2}+${v.R3}` }], result: Req + ' \u03A9' };
    },
    practice: { question: 'R\u2081 = 100 \u03A9, R\u2082 = 50 \u03A9, R\u2083 = 25 \u03A9. Find R_eq in series.', hint: 'R_eq = 100 + 50 + 25', answer: 175, tolerance: 5, explanation: 'R_eq = 175 \u03A9. Series resistors always increase total resistance!', errorHint: 'R_eq = R\u2081 + R\u2082 + R\u2083' },
  },

  // ── Unit 11: Equivalent Resistance (Parallel) ──
  resistance_parallel: {
    title: "Derivation: Equivalent Resistance (Parallel)",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-fuchsia-600',
    accentColor: 'bg-indigo-600',
    finalFormula: '1/R_eq = 1/R\u2081 + 1/R\u2082 + 1/R\u2083',
    finalFormulaDesc: 'Total resistance in parallel = reciprocal of sum of reciprocals',
    steps: [
      { label: 'KCL: Currents Add', formula: 'I_total = I\u2081 + I\u2082 + I\u2083', detail: 'By Kirchhoff\u2019s Current Law, total current = sum of branch currents.' },
      { label: 'Ohm\u2019s Law for Each', formula: 'V/R_eq = V/R\u2081 + V/R\u2082 + V/R\u2083', detail: 'Apply I = V/R for each branch. Voltage V is the SAME across all parallel branches.' },
      { label: 'Voltage is Common', formula: 'V(1/R_eq) = V(1/R\u2081 + 1/R\u2082 + 1/R\u2083)', detail: 'Factor out the common voltage V.' },
      { label: 'Cancel Voltage V', formula: '1/R_eq = 1/R\u2081 + 1/R\u2082 + 1/R\u2083', detail: 'Equivalent resistance reciprocal = sum of reciprocals. Always smaller than smallest individual.' },
    ],
    sliders: [
      { label: 'R\u2081', key: 'R1', min: 10, max: 200, step: 5, default: 100, unit: ' \u03A9' },
      { label: 'R\u2082', key: 'R2', min: 10, max: 200, step: 5, default: 50, unit: ' \u03A9' },
      { label: 'R\u2083', key: 'R3', min: 10, max: 200, step: 5, default: 25, unit: ' \u03A9' },
    ],
    compute: (v: any) => {
      const Req = 1 / (1 / v.R1 + 1 / v.R2 + 1 / v.R3);
      return { traces: [{ label: '1/R_eq = 1/R\u2081+1/R\u2082+1/R\u2083 = ', value: `1/${v.R1}+1/${v.R2}+1/${v.R3}` }], result: Req.toFixed(2) + ' \u03A9' };
    },
    practice: { question: 'R\u2081 = 100 \u03A9, R\u2082 = 50 \u03A9. Find R_eq in parallel.', hint: '1/R_eq = 1/100 + 1/50 = 0.01 + 0.02 = 0.03', answer: 33.33, tolerance: 3, explanation: 'R_eq = 33.3 \u03A9. Less than the smallest resistor!', errorHint: '1/R_eq = 1/R\u2081 + 1/R\u2082' },
  },

  // ── Unit 6: Venturi Meter ──
  venturi_meter: {
    title: "Derivation: Venturi Meter Flow Rate",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-cyan-500 to-blue-600',
    accentColor: 'bg-cyan-600',
    finalFormula: 'v\u2081 = \u221A(2gh / ((A\u2081/A\u2082)\u00B2 \u2212 1))',
    finalFormulaDesc: 'Fluid velocity from pressure difference in a Venturi tube',
    steps: [
      { label: 'Bernoulli\u2019s Equation (Horizontal)', formula: 'P\u2081 + \u00BD\u03C1v\u2081\u00B2 = P\u2082 + \u00BD\u03C1v\u2082\u00B2', detail: 'For a horizontal pipe (h\u2081 = h\u2082), Bernoulli simplifies to this form.' },
      { label: 'Pressure Difference', formula: 'P\u2081 \u2212 P\u2082 = \u00BD\u03C1(v\u2082\u00B2 \u2212 v\u2081\u00B2)', detail: 'Rearrange: the pressure drop equals the change in dynamic pressure.' },
      { label: 'Continuity Equation', formula: 'v\u2082 = v\u2081 (A\u2081/A\u2082)', detail: 'From A\u2081v\u2081 = A\u2082v\u2082. The fluid speeds up in the narrow section.' },
      { label: 'Manometer Reading', formula: 'P\u2081 \u2212 P\u2082 = \u03C1gh', detail: 'The pressure difference is measured by the manometer height difference h.' },
    ],
    sliders: [
      { label: 'Area 1 (A\u2081)', key: 'A1', min: 0.01, max: 0.1, step: 0.005, default: 0.05, unit: ' m\u00B2' },
      { label: 'Area 2 (A\u2082)', key: 'A2', min: 0.005, max: 0.05, step: 0.001, default: 0.01, unit: ' m\u00B2' },
      { label: 'Height Difference (h)', key: 'h', min: 0.01, max: 0.5, step: 0.01, default: 0.1, unit: ' m' },
    ],
    compute: (v: any) => {
      const ratio = v.A1 / v.A2;
      const v1 = Math.sqrt(2 * 9.81 * v.h / (ratio * ratio - 1));
      return { traces: [{ label: 'v\u2081 = \u221A(2gh/((A\u2081/A\u2082)\u00B2-1)) = ', value: `\u221A(2x9.81x${v.h}/((${v.A1}/${v.A2})\u00B2-1))` }], result: v1.toFixed(2) + ' m/s' };
    },
    practice: { question: 'A\u2081 = 0.05 m\u00B2, A\u2082 = 0.01 m\u00B2, h = 0.15 m. Find v\u2081.', hint: 'ratio = 5, v\u2081 = \u221A(2x9.81x0.15/24)', answer: 0.35, tolerance: 0.05, explanation: 'v\u2081 = 0.35 m/s. The Venturi effect is used in carburetors and flow meters!', errorHint: 'v\u2081 = \u221A(2gh/((A\u2081/A\u2082)\u00B2-1))' },
  },

  // ── Unit 7: Elastic Potential Energy ──
  elastic_potential_energy: {
    title: "Derivation: Elastic Potential Energy",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-yellow-500 to-amber-600',
    accentColor: 'bg-yellow-600',
    finalFormula: 'U = \u00BD k x\u00B2',
    finalFormulaDesc: 'Energy stored in a deformed spring',
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
    compute: (v: any) => {
      const U = 0.5 * v.k * v.x * v.x;
      return { traces: [{ label: 'U = \u00BDkx\u00B2 = ', value: `0.5x${v.k}x${v.x}\u00B2` }], result: U.toFixed(2) + ' J' };
    },
    practice: { question: 'k = 200 N/m, x = 0.1 m. Find elastic PE.', hint: 'U = 0.5 x 200 x 0.01', answer: 1, tolerance: 0.1, explanation: 'U = 1 J. A bow stores this energy when drawn!', errorHint: 'U = \u00BDkx\u00B2' },
  },

  // ── Unit 8: Work Done by Gas ──
  work_done_gas: {
    title: "Derivation: Work Done by a Gas",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-orange-500 to-red-600',
    accentColor: 'bg-orange-600',
    finalFormula: 'W = P\u0394V',
    finalFormulaDesc: 'Work done during expansion or compression',
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
    compute: (v: any) => {
      const W = v.P * v.dV;
      return { traces: [{ label: 'W = P\u0394V = ', value: `${v.P.toExponential(3)} x ${v.dV}` }], result: W.toFixed(1) + ' J' };
    },
    practice: { question: 'P = 2e5 Pa, \u0394V = 0.02 m\u00B3. Find work done by gas.', hint: 'W = 2e5 x 0.02', answer: 4000, tolerance: 500, explanation: 'W = 4000 J. This work can be used to move a piston in an engine!', errorHint: 'W = P x \u0394V' },
  },

  // ── Unit 8: COP of Refrigerator ──
  cop_refrigerator: {
    title: "Derivation: Coefficient of Performance (Refrigerator)",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-cyan-500 to-teal-600',
    accentColor: 'bg-cyan-600',
    finalFormula: 'COP = T\u2082 / (T\u2081 \u2212 T\u2082)',
    finalFormulaDesc: 'Efficiency measure for a refrigerator (reverse Carnot cycle)',
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
    compute: (v: any) => {
      if (v.T1 <= v.T2) return { traces: [{ label: 'T\u2081 must be > T\u2082!', value: '' }], result: 'Error: Invalid temperatures' };
      const cop = v.T2 / (v.T1 - v.T2);
      return { traces: [{ label: 'COP = T\u2082/(T\u2081-T\u2082) = ', value: `${v.T2}/(${v.T1}-${v.T2})` }], result: cop.toFixed(2) };
    },
    practice: { question: 'T\u2082 = 270 K, T\u2081 = 310 K. Find COP.', hint: 'COP = 270/(310-270) = 270/40', answer: 6.75, tolerance: 1, explanation: 'COP = 6.75. A good refrigerator moves 6.75 J of heat per 1 J of work!', errorHint: 'COP = T\u2082/(T\u2081-T\u2082)' },
  },

  // ── Unit 9: Doppler Effect (Listener Moving Away) ──
  doppler_listener_away: {
    title: "Derivation: Doppler Effect (Listener Moving Away)",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-pink-500 to-rose-600',
    accentColor: 'bg-pink-600',
    finalFormula: "f' = (v \u2212 v_L)/v \u00D7 f",
    finalFormulaDesc: 'Apparent frequency when listener moves away from source',
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
    compute: (v: any) => {
      const fp = (340 - v.vL) / 340 * v.f;
      return { traces: [{ label: "f' = (v-vL)/v x f = ", value: `(${340}-${v.vL})/${340} x ${v.f}` }], result: fp.toFixed(1) + ' Hz' };
    },
    practice: { question: 'f = 440 Hz, vL = 20 m/s, v = 340 m/s. Find apparent f.', hint: "f' = (340-20)/340 x 440", answer: 414.12, tolerance: 10, explanation: "f' = 414 Hz. Lower pitch when moving away from the source!", errorHint: "f' = (v-vL)/v x f" },
  },

  // ── Unit 9: Doppler Effect (Source Moving Towards) ──
  doppler_source_towards: {
    title: "Derivation: Doppler Effect (Source Moving Towards)",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-rose-500 to-red-600',
    accentColor: 'bg-rose-600',
    finalFormula: "f' = v/(v \u2212 v_S) \u00D7 f",
    finalFormulaDesc: 'Apparent frequency when source moves toward listener',
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
    compute: (v: any) => {
      const fp = 340 / (340 - v.vS) * v.f;
      return { traces: [{ label: "f' = v/(v-vS) x f = ", value: `${340}/(${340}-${v.vS}) x ${v.f}` }], result: fp.toFixed(1) + ' Hz' };
    },
    practice: { question: 'f = 440 Hz, vS = 20 m/s, v = 340 m/s. Find apparent f.', hint: "f' = 340/(340-20) x 440", answer: 467.5, tolerance: 10, explanation: "f' = 467.5 Hz. Higher pitch as the ambulance approaches!", errorHint: "f' = v/(v-vS) x f" },
  },

  // ── Unit 9: Stationary Waves in Air Columns (Open Pipe) ──
  stationary_waves_air_column: {
    title: "Derivation: Stationary Waves in Air Columns (Open Pipe)",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-violet-500 to-purple-600',
    accentColor: 'bg-violet-600',
    finalFormula: 'f_n = n v / 2L',
    finalFormulaDesc: 'Harmonics of an open pipe (both ends antinodes)',
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
    compute: (v: any) => {
      const v_wave = 343;
      const fn = v.n * v_wave / (2 * v.L);
      return { traces: [{ label: 'f_n = nv/(2L) = ', value: `${v.n}x${v_wave}/(2x${v.L})` }], result: fn.toFixed(1) + ' Hz' };
    },
    practice: { question: 'L = 1 m, n = 2, v = 343 m/s. Find f_n.', hint: 'f = 2 x 343 / 2 = 343 Hz', answer: 343, tolerance: 20, explanation: 'f\u2082 = 343 Hz. The second harmonic of a 1 m pipe!', errorHint: 'f_n = nv/(2L)' },
  },

  // ── Unit 10: Potential Gradient ──
  potential_gradient: {
    title: "Derivation: Electric Potential Gradient",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-purple-500 to-indigo-600',
    accentColor: 'bg-purple-600',
    finalFormula: 'E = \u2212\u0394V/\u0394r',
    finalFormulaDesc: 'Electric field equals negative potential gradient',
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
    compute: (v: any) => {
      const E = v.dV / v.dr;
      return { traces: [{ label: 'E = \u0394V/\u0394r = ', value: `${v.dV}/${v.dr}` }], result: E.toFixed(1) + ' V/m' };
    },
    practice: { question: '\u0394V = 12 V, \u0394r = 0.05 m. Find electric field E.', hint: 'E = 12/0.05', answer: 240, tolerance: 20, explanation: 'E = 240 V/m. The field is the negative gradient of potential!', errorHint: 'E = \u0394V/\u0394r' },
  },

  // ── Unit 11: Maximum Power Output ──
  maximum_power_output: {
    title: "Derivation: Maximum Power Output",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-amber-500 to-orange-600',
    accentColor: 'bg-amber-600',
    finalFormula: 'P_max = \u03B5\u00B2 / 4r',
    finalFormulaDesc: 'Maximum power delivered when load = internal resistance',
    steps: [
      { label: 'Power Delivered to Load', formula: 'P_out = I\u00B2 R', detail: 'Power dissipated in the load resistor R is I\u00B2R.' },
      { label: 'Current with Internal Resistance', formula: 'I = \u03B5 / (R + r)', detail: 'From Ohm\u2019s law with internal resistance r: total resistance = R + r, EMF = \u03B5.' },
      { label: 'Substitute Current', formula: 'P_out = \u03B5\u00B2 R / (R + r)\u00B2', detail: 'Substitute I: P_out = (\u03B5/(R+r))\u00B2 \u00D7 R = \u03B5\u00B2R/(R+r)\u00B2.' },
      { label: 'Max When R = r', formula: 'P_max = \u03B5\u00B2 / 4r', detail: 'Maximizing P_out by taking derivative dP/dR = 0 gives R = r. Substituting R=r: P_max = \u03B5\u00B2/(4r).' },
    ],
    sliders: [
      { label: 'EMF (\u03B5)', key: 'emf', min: 1, max: 24, step: 0.5, default: 12, unit: ' V' },
      { label: 'Internal Resistance (r)', key: 'r', min: 0.5, max: 10, step: 0.5, default: 2, unit: ' \u03A9' },
      { label: 'Load Resistance (R)', key: 'R', min: 0.5, max: 20, step: 0.5, default: 2, unit: ' \u03A9' },
    ],
    compute: (v: any) => {
      const I = v.emf / (v.R + v.r);
      const P = I * I * v.R;
      const Pmax = v.emf * v.emf / (4 * v.r);
      return { traces: [{ label: 'P = \u03B5\u00B2R/(R+r)\u00B2 = ', value: `${v.emf}\u00B2x${v.R}/(${v.R}+${v.r})\u00B2` }, { label: 'P_max = \u03B5\u00B2/4r = ', value: `${v.emf}\u00B2/(4x${v.r})` }], result: 'P=' + P.toFixed(2) + 'W (max=' + Pmax.toFixed(2) + 'W)' };
    },
    practice: { question: '\u03B5 = 12 V, r = 2 \u03A9. Find max output power.', hint: 'P_max = 144 / (4 x 2) = 144/8', answer: 18, tolerance: 2, explanation: 'P_max = 18 W. This occurs when R = r = 2 \u03A9!', errorHint: 'P_max = \u03B5\u00B2/(4r)' },
  },

  // ── Unit 11: Wheatstone Bridge ──
  wheatstone_bridge: {
    title: "Derivation: Wheatstone Bridge Balance",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-lime-500 to-green-600',
    accentColor: 'bg-lime-600',
    finalFormula: 'R = PS/Q',
    finalFormulaDesc: 'Balance condition: P/Q = R/S',
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
    compute: (v: any) => {
      const R = v.P * v.S / v.Q;
      return { traces: [{ label: 'R = PS/Q = ', value: `${v.P}x${v.S}/${v.Q}` }], result: R.toFixed(1) + ' \u03A9' };
    },
    practice: { question: 'P = 100 \u03A9, Q = 50 \u03A9, S = 75 \u03A9. Find unknown R.', hint: 'R = 100 x 75 / 50', answer: 150, tolerance: 10, explanation: 'R = 150 \u03A9. The bridge method gives precise resistance measurement!', errorHint: 'R = PS/Q' },
  },

  // ── Unit 12: Force Between Two Conductors ──
  force_between_conductors: {
    title: "Derivation: Force Between Two Current-Carrying Conductors",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-blue-500 to-violet-600',
    accentColor: 'bg-blue-600',
    finalFormula: 'F/L = \u03BC\u2080 I\u2081 I\u2082 / 2\u03C0r',
    finalFormulaDesc: 'Force per unit length between parallel conductors',
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
    compute: (v: any) => {
      const mu0 = 4 * Math.PI * 1e-7;
      const FperL = mu0 * v.I1 * v.I2 / (2 * Math.PI * v.r);
      return { traces: [{ label: 'F/L = \u03BC\u2080I\u2081I\u2082/(2\u03C0r) = ', value: `${mu0.toExponential(2)}x${v.I1}x${v.I2}/(2\u03C0x${v.r})` }], result: FperL.toExponential(3) + ' N/m' };
    },
    practice: { question: 'I\u2081 = 5 A, I\u2082 = 5 A, r = 0.1 m. Find F/L (\u03BC\u2080 = 4\u03C0\u00D710\u207B\u2077).', hint: 'F/L = (4\u03C0\u00D710\u207B\u2077)\u00D75\u00D75/(2\u03C0\u00D70.1)', answer: 5e-5, tolerance: 1e-5, explanation: 'F/L = 5\u00D710\u207B\u2075 N/m. A small but measurable force!', errorHint: 'F/L = \u03BC\u2080I\u2081I\u2082/(2\u03C0r)' },
  },

  // ── Unit 12: Charged Particle in B Field ──
  charged_particle_b_field: {
    title: "Derivation: Charged Particle in Magnetic Field",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-purple-600',
    accentColor: 'bg-indigo-600',
    finalFormula: 'r = mv/qB',
    finalFormulaDesc: 'Radius of circular path of a charge in a magnetic field',
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
    compute: (v: any) => {
      const q = 1.6e-19;
      const r = v.m * v.v / (q * v.B);
      return { traces: [{ label: 'r = mv/(qB) = ', value: `${v.m.toExponential(3)}x${v.v.toExponential(3)}/(1.6e-19x${v.B})` }], result: r.toExponential(3) + ' m' };
    },
    practice: { question: 'Electron m = 9.11e-31 kg, v = 2e6 m/s, B = 0.1 T. Find r.', hint: 'r = 9.11e-31 x 2e6 / (1.6e-19 x 0.1)', answer: 0.000114, tolerance: 2e-5, explanation: 'r = 1.14\u00D710\u207B\u2074 m = 0.114 mm. The circular path is tiny!', errorHint: 'r = mv/(qB)' },
  },

  // ── Unit 12: Velocity Selector ──
  velocity_selector: {
    title: "Derivation: Velocity Selector",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-cyan-500 to-blue-600',
    accentColor: 'bg-cyan-600',
    finalFormula: 'v = E/B',
    finalFormulaDesc: 'Velocity for undeflected motion through crossed fields',
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
    compute: (v: any) => {
      const v_selected = v.E / v.B;
      return { traces: [{ label: 'v = E/B = ', value: `${v.E}/${v.B}` }], result: v_selected.toExponential(3) + ' m/s' };
    },
    practice: { question: 'E = 2000 N/C, B = 0.05 T. Find selected velocity.', hint: 'v = 2000/0.05', answer: 40000, tolerance: 5000, explanation: 'v = 4\u00D710\u2074 m/s. Only particles at this speed pass through undeflected!', errorHint: 'v = E/B' },
  },

  // ── Unit 9: Doppler Effect (Source Moving Away) ──
  doppler_source_away: {
    title: "Derivation: Doppler Effect (Source Moving Away)",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-red-500 to-rose-600',
    accentColor: 'bg-red-600',
    finalFormula: "f' = v/(v + v_S) \u00D7 f",
    finalFormulaDesc: 'Apparent frequency when source moves away from listener',
    steps: [
      { label: 'Expanded Wavelength', formula: "\u03BB' = \u03BB + \u0394\u03BB = (v + v_S)/f", detail: 'Moving source stretches its own waves behind it, expanding the wavelength.' },
      { label: 'Wave Expansion', formula: '\u0394\u03BB = v_S/f', detail: 'The distance the source moves in one period = v_S \u00D7 T = v_S/f. This adds to the wavelength.' },
      { label: 'Apparent Frequency', formula: "f' = v/\u03BB' = v / ((v + v_S)/f)", detail: 'Apparent frequency = wave speed / expanded wavelength.' },
      { label: 'Final Formula', formula: "f' = v/(v + v_S) \u00D7 f", detail: 'Frequency decreases: the listener hears a lower pitch when the source moves away (like an ambulance receding).' },
    ],
    sliders: [
      { label: 'Source Freq (f)', key: 'f', min: 100, max: 1000, step: 10, default: 440, unit: ' Hz' },
      { label: 'Source Speed (vS)', key: 'vS', min: 0, max: 50, step: 1, default: 10, unit: ' m/s' },
    ],
    compute: (v: any) => {
      const fp = 340 / (340 + v.vS) * v.f;
      return { traces: [{ label: "f' = v/(v+vS) x f = ", value: `${340}/(${340}+${v.vS}) x ${v.f}` }], result: fp.toFixed(1) + ' Hz' };
    },
    practice: { question: 'f = 440 Hz, vS = 20 m/s, v = 340 m/s. Find apparent f.', hint: "f' = 340/(340+20) x 440", answer: 415.56, tolerance: 10, explanation: "f' = 416 Hz. Lower pitch as the ambulance drives away!", errorHint: "f' = v/(v+vS) x f" },
  },

  // ── Unit 11: Potentiometer EMF Comparison ──
  potentiometer: {
    title: "Derivation: Potentiometer EMF Comparison",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-green-500 to-teal-600',
    accentColor: 'bg-green-600',
    finalFormula: '\u03B5\u2082/\u03B5\u2081 = l\u2082/l\u2081',
    finalFormulaDesc: 'Ratio of EMFs equals ratio of balancing lengths',
    steps: [
      { label: 'Potential Gradient Along Wire', formula: 'V/L = constant', detail: 'A potentiometer has a uniform wire with constant potential gradient. Voltage per unit length is constant.' },
      { label: 'Fall of Potential', formula: '\u03B5 \u221D l', detail: 'The potential difference across a length l of the potentiometer wire is proportional to l.' },
      { label: 'For Two Cells', formula: '\u03B5\u2081 \u221D l\u2081, \u03B5\u2082 \u221D l\u2082', detail: 'Each cell connected to the potentiometer gives a balancing length where the galvanometer shows zero deflection.' },
      { label: 'Divide Equations', formula: '\u03B5\u2082/\u03B5\u2081 = l\u2082/l\u2081', detail: 'The ratio of EMFs equals the ratio of their balancing lengths. No need to know the current or resistance!' },
    ],
    sliders: [
      { label: 'EMF 1 (\u03B5\u2081)', key: 'e1', min: 1, max: 3, step: 0.1, default: 1.5, unit: ' V' },
      { label: 'Balancing Length 1 (l\u2081)', key: 'l1', min: 20, max: 100, step: 1, default: 60, unit: ' cm' },
      { label: 'Balancing Length 2 (l\u2082)', key: 'l2', min: 10, max: 100, step: 1, default: 40, unit: ' cm' },
    ],
    compute: (v: any) => {
      const e2 = v.e1 * v.l2 / v.l1;
      return { traces: [{ label: '\u03B5\u2082 = \u03B5\u2081 x l\u2082/l\u2081 = ', value: `${v.e1} x ${v.l2}/${v.l1}` }], result: e2.toFixed(3) + ' V' };
    },
    practice: { question: '\u03B5\u2081 = 1.5 V, l\u2081 = 60 cm, l\u2082 = 40 cm. Find \u03B5\u2082.', hint: '\u03B5\u2082 = 1.5 x 40/60 = 1.5 x 0.667', answer: 1, tolerance: 0.1, explanation: '\u03B5\u2082 = 1.0 V. The potentiometer compares EMFs without drawing any current!', errorHint: '\u03B5\u2082/\u03B5\u2081 = l\u2082/l\u2081' },
  },

  // ── Unit 14: Dirac Momentum (Particle Physics) ──
  dirac_momentum: {
    title: "Derivation: Dirac Momentum from Energy-Momentum Relation",
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-purple-600',
    accentColor: 'bg-indigo-600',
    finalFormula: 'p = \u221A(E\u00B2 \u2212 m\u00B2c\u2074)/c',
    finalFormulaDesc: 'Relativistic momentum from Einstein\u2019s energy relation',
    steps: [
      { label: "Einstein's Energy Relation", formula: 'E = \u00B1\u221A(m\u00B2c\u2074 + p\u00B2c\u00B2)', detail: 'From special relativity: total energy E relates to rest energy mc\u00B2 and momentum p. The \u00B1 sign indicates both positive and negative energy solutions.' },
      { label: 'Square Both Sides', formula: 'E\u00B2 = m\u00B2c\u2074 + p\u00B2c\u00B2', detail: 'Squaring removes the square root and the \u00B1 sign. This is the relativistic energy-momentum relation.' },
      { label: 'Rearrange for p\u00B2c\u00B2', formula: 'p\u00B2c\u00B2 = E\u00B2 \u2212 m\u00B2c\u2074', detail: 'Subtract rest energy squared from both sides to isolate the momentum term.' },
      { label: 'Solve for p', formula: 'p = \u00B1\u221A(E\u00B2 \u2212 m\u00B2c\u2074)/c', detail: 'Divide by c\u00B2 and take square root. The \u00B1 sign indicates momentum can be in either direction. For massless particles like photons (m=0): p = E/c.' },
    ],
    sliders: [
      { label: 'Total Energy (E)', key: 'E', min: 1e-13, max: 1e-10, step: 1e-13, default: 2e-12, unit: ' J' },
      { label: 'Rest Mass (m)', key: 'm', min: 1e-31, max: 1e-27, step: 1e-31, default: 9.11e-31, unit: ' kg' },
    ],
    compute: (v: any) => {
      const c = 3e8;
      const mc2 = v.m * c * c;
      if (v.E < mc2) return { traces: [{ label: 'E must be >= mc\u00B2!', value: '' }], result: 'Error: Energy below rest mass' };
      const p = Math.sqrt(v.E * v.E - mc2 * mc2) / c;
      return { traces: [{ label: 'p = √(E\u00B2-m\u00B2c\u2074)/c = ', value: `√(${v.E.toExponential(3)}²-(${mc2.toExponential(3)})²)/3e8` }], result: p.toExponential(3) + ' kg\u00B7m/s' };
    },
    practice: { question: 'E = 3e-12 J, m = 9.11e-31 kg (electron). Find p (c = 3e8).', hint: 'mc\u00B2 = 9.11e-31 x 9e16 = 8.2e-14. p = √(9e-24 - 6.7e-27)/3e8', answer: 3.16e-20, tolerance: 1e-20, explanation: 'p \u2248 3.2e-20 kg\u00B7m/s. The relativistic momentum accounts for the energy beyond rest mass!', errorHint: 'p = √(E\u00B2 - m\u00B2c\u2074)/c' },
  },


};
