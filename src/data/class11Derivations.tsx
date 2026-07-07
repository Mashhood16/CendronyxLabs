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
    keyInsight: 'Electron microscopes achieve 0.05 nm resolution — enough to image individual atoms — because electrons at high voltage have wavelengths 100,000× shorter than visible light.',
    steps: [
      { label: 'Identify Dependencies', formula: 'lambda = f(h, m, v) => h^a m^b v^c', detail: '🔬 You\'re an electron microscope designer trying to see individual atoms. You know electrons behave like waves — but what determines their wavelength? You guess it depends on Planck\'s constant h (the quantum world\'s ruler), the electron\'s mass m (heavier = shorter wavelength), and its velocity v (faster = shorter wavelength). You write: λ = h^a m^b v^c, where a, b, c are unknown powers you must find.' },
      { label: 'Write Dimensions', formula: '[L] = [ML^{2}T^{-1}]^a [M]^b [LT^{-1}]^c', detail: '📏 You pull out your dimensional analysis toolkit. Planck\'s constant h has dimensions [ML²T⁻¹] (energy × time), mass m has [M], velocity v has [LT⁻¹]. The wavelength λ has [L]. You set up: [L] = [ML²T⁻¹]^a [M]^b [LT⁻¹]^c. It\'s like a puzzle where each dimension M, L, T must match on both sides.' },
      { label: 'Solve Power Equations', formula: 'M: a+b=0, L: 2a+c=1, T: -a-c=0', detail: '🧩 You solve three simultaneous equations: For M: a+b=0, for L: 2a+c=1, for T: -a-c=0. Working through: from T: c=-a, from L: 2a-a=1 so a=1, from M: 1+b=0 so b=-1. Three equations, three unknowns — perfectly determined!' },
      { label: 'Final Formula', formula: 'lambda = \\text{constant} \\times h^{1} m^{-1} v^{-1} = h/mv', detail: '✨ Substituting back: λ = constant × h¹ m⁻¹ v⁻¹ = h/(mv). When physicist Louis de Broglie proposed this in 1924, it was revolutionary — particles like electrons have wave nature! Today, electron microscopes use this exact principle, achieving resolutions of 0.05 nm — enough to image individual atoms!' },
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
    keyInsight: 'A 1-meter pendulum takes exactly 2 seconds per swing — this is why grandfather clocks use pendulums of this length to keep perfect time.',
    steps: [
      { label: 'Identify Dependencies', formula: 'T = f(m, l, theta, g) => m^a l^b theta^c g^d', detail: '🕰️ You\'re a clockmaker in the 1600s, inspired by Galileo\'s observation of a swinging chandelier in a cathedral. You want to design a pendulum clock that keeps perfect time. But what determines the period T? Maybe mass m of the bob, length l of the string, angle θ of swing, or gravity g? You write T = m^a l^b θ^c g^d.' },
      { label: 'Write Dimensions', formula: '[T] = [M]^a [L]^b [1]^c [LT^{-2}]^d', detail: '📐 You write dimensions: [T] = [M]^a [L]^b [1]^c [LT⁻²]^d. Angle θ is dimensionless (ratio of arc to radius). Time T has dimension T. Equating: M: a=0 (mass doesn\'t matter!), L: b+d=0, T: -2d=1. The angle\'s power c=0 too!' },
      { label: 'Solve Power Equations', formula: 'a=0, d=-1/2, b=1/2, c=0', detail: '🎯 Solving: a=0, d=-1/2, b=1/2, c=0. The period doesn\'t depend on mass at all — Galileo was right! A heavier bob doesn\'t swing faster or slower. Length has power 1/2, gravity has power -1/2. The angle doesn\'t matter (for small swings).' },
      { label: 'Final Formula', formula: 'T = \\text{constant} \\times l^{1/2} g^{-1/2} = 2\\pi \\sqrt{l/g}', detail: '⏰ Final formula: T = constant × √(l/g). The constant turns out to be 2π (from solving the SHM equation for small angles). T = 2π√(l/g). In 1656, Christiaan Huygens built the first pendulum clock using this formula. A 1-meter pendulum gives T ≈ 2 seconds — perfect for a clock\'s tick-tock!' },
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
    keyInsight: 'GPS navigation resolves your position using vector components from satellite signals — the same trigonometry pilots use to break flight paths into east-west and north-south directions.',
    steps: [
      { label: 'Right Triangle Formed', formula: 'Angle theta between A and x-axis', detail: '🗺️ You\'re a pilot navigating from New York to London. Your flight path forms a 3,000 km vector at 30° north of east. But your navigation system works in east-west (x) and north-south (y) components. You need to break this vector apart — just like resolving forces on an inclined plane or calculating the effective wind component on a runway.' },
      { label: 'Cosine for Adjacent (Ax)', formula: 'cos theta = A_x / A => A_x = A cos theta', detail: '📐 The vector A makes angle θ with the x-axis. Dropping a perpendicular to the x-axis creates a right triangle. The x-component is the adjacent side: Ax = A cos θ. For your flight: Ax = 3000 × cos 30° = 2598 km eastward.' },
      { label: 'Sine for Opposite (Ay)', formula: 'sin theta = A_y / A => A_y = A sin theta', detail: '📐 The y-component is the opposite side: Ay = A sin θ. For your flight: Ay = 3000 × sin 30° = 1500 km northward. These two perpendicular components are independent — you can adjust east-west and north-speed speeds separately without affecting each other.' },
      { label: 'Vector from Components', formula: 'A = \\sqrt{A_x^{2} + A_y^{2}}, tan theta = A_y/A_x', detail: '🔄 Given components, you can always reconstruct the original vector: magnitude A = √(Ax² + Ay²) (Pythagoras) and direction θ = tan⁻¹(Ay/Ax). This works for forces, velocities, electric fields — any vector quantity. GPS uses this to calculate your precise position from satellite signals!' },
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
    keyInsight: 'Drag racers use this equation to calculate the 0-100 km/h time: from 0 to 27.8 m/s in 3 seconds means 9.27 m/s² — nearly 1g of acceleration.',
    steps: [
      { label: 'Acceleration Definition', formula: 'a = (v_f - v_i) / t', detail: '🚗 You\'re at a traffic light in your car. The light turns green and you slam the accelerator. Your speed increases steadily from 0 to 60 km/h (16.7 m/s) — your phone\'s GPS shows it takes exactly 5 seconds. Acceleration is simply the rate at which velocity changes: how many m/s you gain each second.' },
      { label: 'Multiply Both Sides by t', formula: 'a \\times t = v_f - v_i', detail: '📊 By definition: a = (vf - vi)/t. In your car: a = (16.7 - 0)/5 = 3.33 m/s². Your speed increases by 3.33 m/s every second. Cross-multiplying: a × t = vf - vi. The change in velocity equals acceleration multiplied by time.' },
      { label: 'Add v_i to Both Sides', formula: 'v_f = v_i + a t', detail: '➗ Rearranging: vf = vi + at. This is the first equation of motion. For your car: vf = 0 + 3.33 × 5 = 16.7 m/s. Simple but powerful — it tells you your final speed after any acceleration for any duration.' },
      { label: 'Graphical Meaning', formula: 'Slope of v-t graph = a', detail: '📈 On a velocity-time graph, this equation gives a straight line. The slope is acceleration, the y-intercept is initial velocity. Drag racers use this: from 0 to 100 km/h (27.8 m/s) in 3 seconds means a = 9.27 m/s² — nearly 1 g of acceleration!' },
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
    keyInsight: 'Airbag deployment systems use this equation to calculate stopping distance — the car\'s ECU computes how far the occupant will travel during a crash to time the airbag inflation.',
    steps: [
      { label: 'Area Under v-t Graph', formula: 'S = Area of trapezium', detail: '🏎️ You\'re a Formula 1 engineer calculating exactly where your driver will be after accelerating out of a corner. Final velocity isn\'t enough — you need the distance traveled. On a velocity-time graph, the area under the line equals displacement. The shape is a trapezoid (rectangle + triangle).' },
      { label: 'Rectangle Area', formula: 'S_rect = v_i \\times t', detail: '📐 The rectangle part: initial velocity × time. If you start the corner at 15 m/s and take 4 seconds, the rectangle area = 15 × 4 = 60 m. This is how far you\'d go at constant speed.' },
      { label: 'Triangle Area', formula: 'S_tri = \\frac{1}{2} \\times (vf - vi) \\times t = \\frac{1}{2} \\times (at) \\times t', detail: '📐 The triangle part: the extra distance from acceleration. Area = ½ × (vf - vi) × t = ½ × (at) × t = ½at². For acceleration 5 m/s² over 4 s: ½ × 5 × 16 = 40 m. The triangle sits on top of the rectangle.' },
      { label: 'Add Both Areas', formula: 'S = v_i t + \\frac{1}{2} a t^{2}', detail: '✅ Total distance S = vit + ½at². For your F1 car: S = 15×4 + ½×5×16 = 60 + 40 = 100 m. You precisely know where the car will be. This equation is used everywhere — from calculating stopping distances to launching rockets!' },
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
    keyInsight: 'Highway engineers use this to set speed limits: braking from 120 km/h needs about 100 m, which is why the safe following distance at highway speed is 100+ meters.',
    steps: [
      { label: 'Start with Trapezium Area', formula: 'S = \\frac{1}{2}(vi + vf) \\times t', detail: '🛑 You\'re a safety engineer designing brake systems. You need to know: given a certain braking deceleration, how much distance does a car need to stop? The challenge: you know initial speed and braking force, but you don\'t know the stopping time. You need an equation without t.' },
      { label: 'Multiply Both Sides by a/a', formula: 'S = \\frac{1}{2}(vi + vf) \\times (vf - vi)/a', detail: '📐 Start with the trapezoid area: S = ½(vi + vf) × t. This is distance = average velocity × time. Smart — it doesn\'t assume constant velocity, just constant acceleration.' },
      { label: 'Difference of Squares', formula: '2aS = (vi + vf)(vf - vi) = vf^{2} - vi^{2}', detail: '🧮 Eliminate t using the first equation: t = (vf - vi)/a. Substitute: S = ½(vi + vf) × (vf - vi)/a. Multiply both sides by 2a: 2aS = (vi + vf)(vf - vi) = vf² - vi² (difference of squares).' },
      { label: 'Final Form', formula: '2aS = vf^{2} - vi^{2}', detail: '✅ 2aS = vf² - vi². For braking from 30 m/s to 0 with deceleration 5 m/s²: 2×5×S = 0 - 900, so S = 90 m. That\'s your stopping distance! This equation powers everything from airbag deployment calculations to roller coaster safety systems.' },
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
    keyInsight: 'Basketball players instinctively launch at 45-55° to balance height and reach — the arc must clear the defender\'s outstretched hand while reaching the 3.05 m rim.',
    steps: [
      { label: 'Initial Vertical Velocity', formula: 'v_iy = v_i sin theta', detail: '🏀 You\'re a basketball player taking a jump shot. You launch the ball at 10 m/s at 60° above horizontal. How high will the ball go? The vertical component determines the height: v_iy = vi sin θ = 10 × sin 60° = 10 × 0.866 = 8.66 m/s. The horizontal component (5 m/s) doesn\'t affect how high the ball goes — it just carries it forward.' },
      { label: 'At Maximum Height', formula: 'v_fy = 0', detail: '📈 At the maximum height, the ball\'s vertical velocity is momentarily zero — it\'s the turning point between going up and coming down. v_fy = 0. This is the peak of the parabolic arc.' },
      { label: 'Use Third Equation', formula: 'v_fy^{2} = v_iy^{2} + 2a_y H', detail: '🧮 Use the third equation of motion in the vertical direction: v_fy² = v_iy² + 2a_yH. Here a_y = -g (gravity pulls down). Substituting: 0 = (vi sin θ)² - 2gH. Rearranging: 2gH = (vi sin θ)².' },
      { label: 'Solve for H', formula: '0 = (v_i sin theta)^2 - 2gH => H = v_i^{2} sin^{2} theta / 2g', detail: '✅ H = (vi² sin²θ)/(2g). For your shot: H = 100 × 0.75 / 19.62 = 3.82 m. Add release height of 2.5 m, and the ball peaks at 6.32 m — well above the 3.05 m rim! The maximum height for a given speed occurs at θ = 90° (straight up): H_max = vi²/(2g).' },
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
    keyInsight: 'Soccer players like Messi use launch angles of 25-30° rather than 45° for precision shots — the slight loss in range gives much better accuracy for targeting the goal corner.',
    steps: [
      { label: 'Horizontal Velocity', formula: 'v_x = v_i cos theta', detail: '⚽ You\'re a soccer player lining up a free kick 30 m from goal. You need the ball to clear the wall and dip into the top corner. The range R is how far the ball travels horizontally. You know the horizontal velocity is constant (ignoring air resistance): v_x = vi cos θ. If you kick at 25 m/s and 30°: v_x = 25 × 0.866 = 21.65 m/s.' },
      { label: 'Time of Flight', formula: 'T = 2 v_i sin theta / g', detail: '⏱️ The ball stays in the air for time T = 2vi sin θ / g (twice the time to reach max height). For your kick: T = 2 × 25 × 0.5 / 9.81 = 25/9.81 = 2.55 seconds. That\'s your hang time — you need it to clear the wall.' },
      { label: 'Range = v_x x T', formula: 'R = (v_i cos theta) \\times (2 v_i sin theta / g)', detail: '📐 Range = horizontal velocity × time of flight: R = (vi cos θ) × (2vi sin θ / g) = 2vi² sin θ cos θ / g. For your kick: R = 2 × 625 × 0.866 × 0.5 / 9.81 = 541.25/9.81 = 55.2 m.' },
      { label: 'Use sin 2theta = 2 sin theta cos theta', formula: 'R = v_i^{2} sin 2theta / g', detail: '🎯 Using 2 sin θ cos θ = sin 2θ: R = vi² sin 2θ / g. For θ = 45°: sin 90° = 1, R_max = vi²/g = 625/9.81 = 63.7 m. That\'s the maximum range at this speed. But in soccer, you want accuracy, not just distance — top players like Messi use angles around 25-30° for precision!' },
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
    keyInsight: 'Nuclear reactor moderators use elastic collisions: a neutron hitting a hydrogen proton (equal mass) transfers nearly all its energy, slowing it enough to sustain the chain reaction.',
    steps: [
      { label: 'Conservation of Momentum', formula: 'm1 u1 + m2 u2 = m1 v1 + m2 v2', detail: '🎱 You\'re playing pool. The cue ball (m₁ = 0.17 kg) rolls at 3 m/s toward the 8-ball (m₂ = 0.17 kg) at rest. After the crash, what happens? In the ideal case (elastic collision), both balls bounce perfectly — no energy lost to heat or deformation. Two laws govern this: conservation of momentum and conservation of kinetic energy.' },
      { label: 'Conservation of KE', formula: '0.5m1 u1^2 + 0.5m2 u2^2 = 0.5m1 v1^2 + 0.5m2 v2^2', detail: '⚡ Momentum conservation: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂. With u₁=3, u₂=0, m₁=m₂: 0.17×3 = 0.17v₁ + 0.17v₂, so v₁ + v₂ = 3. But one equation, two unknowns — you need more information.' },
      { label: 'Relative Speed Relation', formula: 'u1 - u2 = v2 - v1', detail: '🔋 Kinetic energy conservation: ½m₁u₁² + ½m₂u₂² = ½m₁v₁² + ½m₂v₂². Canceling ½m: 9 = v₁² + v₂². Combined with v₁ + v₂ = 3: solving gives v₁ = 0, v₂ = 3. The cue ball stops dead, the 8-ball rolls away at 3 m/s — a perfect transfer!' },
      { label: 'Solve for v1 and v2', formula: 'v1 = (m1-m2)/(m1+m2) u1 + 2m2/(m1+m2) u2', detail: '🎯 The general solution: v₁ = (m₁-m₂)/(m₁+m₂) × u₁ + 2m₂/(m₁+m₂) × u₂. For equal masses: the first ball stops, the second takes its speed. For a heavy car hitting a light car: the light one flies backward. For a neutron hitting a proton in a nuclear reactor: the neutron transfers most of its energy — this is how nuclear moderators work!' },
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
    keyInsight: 'A Ferris wheel rider at the outer edge moves twice as fast as someone at half the radius — this is why amusement park rides place seats at the maximum radius for maximum thrill.',
    steps: [
      { label: 'Arc Length', formula: 'S = r theta', detail: '🎡 You\'re at an amusement park on the Ferris wheel. The wheel rotates at a constant angular speed ω, but you\'re moving much faster at the outer edge than someone near the center. The same angular motion produces very different linear speeds depending on your distance from the axis — this is the fundamental link between rotation and straight-line motion.' },
      { label: 'Linear Velocity', formula: 'v = S/t = r theta/t = r omega', detail: '📐 When a point at radius r rotates through angle θ (in radians), it travels arc length S = rθ. On a Ferris wheel with radius 20 m, a half rotation (θ = π rad) means you travel S = 20π ≈ 62.8 m through the air!' },
      { label: 'Tangential Acceleration', formula: 'a_t = v/t = r omega/t = r alpha', detail: '🔄 Linear speed v = S/t = rθ/t = rω. If the Ferris wheel completes a rotation (2π rad) in 40 seconds: ω = π/20 ≈ 0.157 rad/s, and your speed v = 20 × 0.157 = 3.14 m/s. The kid at half the radius (10 m) moves at only 1.57 m/s.' },
      { label: 'Direction Matters', formula: 'a_c = v^{2}/r (centripetal)', detail: '🎯 Tangential acceleration a_t = rα (where α is angular acceleration). But there\'s also centripetal acceleration a_c = v²/r pulling you toward the center. Total acceleration is the vector sum of these two perpendicular components — your Ferris wheel seat experiences both changing speed and changing direction!' },
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
    keyInsight: 'Banked curves on highways are tilted so that the horizontal component of the normal force provides the centripetal acceleration — at the design speed, no friction is needed to turn.',
    steps: [
      { label: 'Similar Triangles (Position)', formula: 'delta r / r = delta theta', detail: '🎢 You\'re riding a roller coaster through a sharp curve. You feel pushed sideways — that\'s centripetal acceleration pulling you toward the center. But where does this formula come from? Imagine a particle moving in a circle: in a small time Δt, it moves through a small angle Δθ. The position vectors before and after make a small triangle — similar to the velocity vectors before and after.' },
      { label: 'Similar Triangles (Velocity)', formula: 'delta v / v = delta theta', detail: '📐 From the position triangle: Δr/r ≈ Δθ (for small angles). From the velocity triangle: Δv/v ≈ Δθ (same Δθ). Since the triangles are similar: Δv/v = Δr/r. The change in velocity is proportional to the original velocity and the angular change.' },
      { label: 'Acceleration = delta v / delta t', formula: 'a = v (delta theta/delta t) = v omega', detail: '🧮 Acceleration a = Δv/Δt = v(Δθ/Δt) = vω. Since Δv = vΔθ (from similar triangles), dividing by Δt: a = v(Δθ/Δt) = vω. The direction of a is perpendicular to v — toward the center of the circle.' },
      { label: 'Substitute v = r omega', formula: 'a_c = v^{2}/r = r omega^{2}', detail: '✅ Substituting ω = v/r: a_c = v(v/r) = v²/r. Or a_c = (rω)ω = rω². For a car taking a curve of radius 50 m at 20 m/s: a_c = 400/50 = 8 m/s² ≈ 0.8g. This is why you feel thrown outward — your inertia wants to go straight while the road pushes you centripetally!' },
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
    keyInsight: 'Crumple zones in cars are designed to absorb the 300,000 J of kinetic energy over 0.5 m of deformation, keeping the force on occupants below lethal levels.',
    steps: [
      { label: 'Work-Energy Theorem', formula: 'W = F \\times d = KE', detail: '🚗 You\'re a crash test engineer analyzing vehicle safety. A car of mass 1500 kg traveling at 20 m/s (72 km/h) carries enormous energy that must be dissipated in a crash. Work = force × distance, and this work equals the change in kinetic energy — the work-energy theorem.' },
      { label: 'Substitute F = ma', formula: 'W = m \\times a \\times d', detail: '📐 Work W = F × d. From Newton\'s Second Law: F = ma. So W = (ma) × d. The force that stops you does work over the crumple zone distance.' },
      { label: 'Use Third Equation of Motion', formula: 'd = (vf^{2} - vi^{2}) / 2a', detail: '🧮 Use the third equation of motion: 2ad = vf² - vi². If stopping from vi to 0: 2ad = -vi², so d = -vi²/(2a). Substituting into W: W = ma × (-vi²/(2a)) = -½mvi². The work is negative — energy is being removed from the car.' },
      { label: 'Final Result', formula: 'KE = \\frac{1}{2} m (vf^{2} - vi^{2}) or \\frac{1}{2} mv^{2}', detail: '✅ KE = ½mv². Your 1500 kg car at 20 m/s: KE = ½ × 1500 × 400 = 300,000 J. That\'s enough to lift a 1000 kg car 30 m in the air! Modern crumple zones absorb this energy over about 0.5 m of deformation, requiring an average force of 600,000 N — about 60 tons of force!' },
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
    keyInsight: 'Cargo ships displacing 50,000 tons of seawater float effortlessly — the hull shape maximizes displaced volume while keeping steel mass low.',
    steps: [
      { label: 'Pressure at Top Surface', formula: 'F1 = P1 A = rho g h1 A', detail: '🛳️ You\'re designing a cargo ship. A massive steel vessel weighing 50,000 tons floats effortlessly while a tiny steel nail sinks. Why? Archimedes\' principle: the buoyant force equals the weight of fluid displaced. Imagine a cylinder of height h submerged in water of density ρ.' },
      { label: 'Pressure at Bottom Surface', formula: 'F2 = P2 A = rho g h2 A', detail: '📐 Pressure at the top: P₁ = ρgh₁. Force at top: F₁ = P₁A = ρgh₁A. Pressure at bottom: P₂ = ρgh₂. Force at bottom: F₂ = ρgh₂A. Since h₂ > h₁, the upward force from the bottom is larger than the downward force from the top.' },
      { label: 'Net Upward Force', formula: 'F = F2 - F1 = rho g A (h2 - h1)', detail: '🧮 Net upward (buoyant) force: F_up = F₂ - F₁ = ρgA(h₂ - h₁) = ρgAΔh. But AΔh = V — the volume of the object! So F_up = ρgV. This is the weight of the displaced fluid: ρV × g.' },
      { label: 'Volume Substitution', formula: 'F = rho g V', detail: '✅ A ship floats when its weight equals the weight of water it displaces. For a 50,000-ton cargo ship: it must displace 50,000 m³ of seawater (density 1025 kg/m³). This is why hollow objects float — they displace a lot of water for their mass. Hot air balloons use the same principle: the hot air inside is less dense than the cool air outside!' },
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
    keyInsight: 'A garden hose nozzle squeezes the opening from 1 cm² to 0.1 cm², making water shoot 10× faster — the same mass of water must pass through every point each second.',
    steps: [
      { label: 'Mass Entering Pipe', formula: 'delta m1 = rho1 A1 v1 delta t', detail: '🌊 You\'re standing by a river. The river is wide and slow upstream, but narrows into a fast-flowing rapids downstream. The same amount of water must pass every point each second — water is incompressible. Mass entering = mass leaving.' },
      { label: 'Mass Leaving Pipe', formula: 'delta m2 = rho2 A2 v2 delta t', detail: '📐 Mass entering in time Δt: Δm₁ = ρA₁v₁Δt. Density ρ × area A₁ × velocity v₁ × time Δt. This is the mass of water flowing through cross-section A₁ in time Δt.' },
      { label: 'Mass Conservation', formula: 'delta m1 = delta m2', detail: '📐 Mass leaving: Δm₂ = ρA₂v₂Δt. For incompressible flow (ρ₁ = ρ₂), conservation of mass means Δm₁ = Δm₂. Cancel density and time: A₁v₁ = A₂v₂.' },
      { label: 'Cancel Common Terms', formula: 'A1 v1 = A2 v2 = \\text{constant}', detail: '✅ Flow rate is constant: Av = constant. If the river is 10 m wide and 2 m deep (A₁ = 20 m²) flowing at 1 m/s, then through a narrows of 5 m²: v₂ = 20 × 1 / 5 = 4 m/s — four times faster! This explains how garden hose nozzles work: squeezing the opening makes the water shoot farther.' },
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
    keyInsight: 'A Boeing 747 wing generates 170,000 N/m² of lift by making air travel faster over the curved top surface, creating lower pressure above than below the wing.',
    steps: [
      { label: 'Work at Lower End', formula: 'W1 = P1 A1 delta x1 = P1 V', detail: '✈️ You\'re an aerospace engineer designing an airplane wing. How does a 380-ton Airbus lift off the ground? Bernoulli\'s principle: faster-moving fluid has lower pressure. The wing is curved on top, making air travel faster there — creating lower pressure above than below.' },
      { label: 'Work at Upper End', formula: 'W2 = -P2 A2 delta x2 = -P2 V', detail: '📐 Work done on the fluid at the lower end: W₁ = P₁A₁Δx₁ = P₁V. The pressure pushes fluid in. Work done by the fluid at the upper end: W₂ = -P₂A₂Δx₂ = -P₂V. The negative sign means the fluid does work on its surroundings to exit.' },
      { label: 'Net Work = Change in Energy', formula: '(P1 - P2)V = (0.5mv2^2 - 0.5mv1^2) + (mgh2 - mgh1)', detail: '🧮 Net work = Change in mechanical energy: (P₁ - P₂)V = (½mv₂² - ½mv₁²) + (mgh₂ - mgh₁). Net work on the fluid = change in kinetic energy + change in gravitational potential energy (Work-Energy Theorem).' },
      { label: 'Divide by Volume', formula: 'P1 + 0.5 rho v1^2 + rho g h1 = P2 + 0.5 rho v2^2 + rho g h2', detail: '✅ Divide by volume (m = ρV): P + ½ρv² + ρgh = constant along a streamline. For an airplane wing: air travels faster above (v₂ > v₁), so P₂ < P₁ — creating net upward force! A typical Boeing 747 wing generates about 0.5 psi pressure difference over 500 m², producing 170,000 N of lift per square meter!' },
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
    keyInsight: 'Modern gas turbines operate at 1600 K to maximize efficiency — every 100 K increase in turbine inlet temperature improves efficiency by 5-8%, saving millions in fuel costs.',
    steps: [
      { label: 'Efficiency Definition', formula: 'eta = Work output / Heat input = (Q1 - Q2) / Q1', detail: '🏭 You\'re a power plant engineer trying to maximize electricity generation. Your steam turbine operates between 800 K (steam from boiler) and 300 K (cooling water). What\'s the maximum possible efficiency? French engineer Sadi Carnot discovered the answer in 1824, laying the foundation of thermodynamics.' },
      { label: 'Carnot Cycle Property', formula: 'Q2/Q1 = T2/T1', detail: '📐 Efficiency η = Work output / Heat input = (Q₁ - Q₂)/Q₁ = 1 - Q₂/Q₁. Here Q₁ is heat absorbed from the hot reservoir, Q₂ is heat rejected to the cold reservoir. No engine can be more efficient than this fundamental limit.' },
      { label: 'Substitute', formula: 'eta = 1 - T2/T1', detail: '🧮 For a Carnot (ideal reversible) cycle, Q₂/Q₁ = T₂/T₁ (ratio of absolute temperatures). This is because heat transfer is proportional to temperature in a reversible cycle. Substitute: η = 1 - T₂/T₁.' },
      { label: 'Limits', formula: 'eta < 1 always', detail: '✅ η_max = 1 - 300/800 = 1 - 0.375 = 0.625 = 62.5%. Real steam turbines achieve about 40-45%. Since T₂ can never be 0 K (absolute zero), no engine can be 100% efficient. This is why billions are spent on materials that withstand higher T₁ — every 100 K increase in turbine temperature improves efficiency by 5-8%!' },
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
    keyInsight: 'Police radar guns use the Doppler shift of radio waves bouncing off your car to measure speed — a 1 m/s speed change shifts the frequency by a measurable amount.',
    steps: [
      { label: 'Relative Speed of Sound', formula: 'v_relative = v + v_L', detail: '🚶 You\'re walking toward a stationary speaker playing a 440 Hz note (A4). As you approach, the pitch sounds higher. Why? Sound travels at v = 340 m/s in air. When you walk toward it at vL = 2 m/s, the sound waves reach you faster — the effective speed increases to v + vL = 342 m/s.' },
      { label: 'Apparent Wavelength', formula: "lambda = v/f (unchanged)", detail: '📐 The wavelength is determined by the stationary source: λ = v/f = 340/440 = 0.773 m. The source isn\'t moving, so the wave pattern in air is unchanged — peaks are still 0.773 m apart.' },
      { label: 'Apparent Frequency', formula: "f' = v_relative / lambda = (v + v_L) / (v/f)", detail: '🧮 You encounter more wave peaks per second because you\'re moving toward them: f\' = v_relative / λ = (v + vL)/(v/f) = f × (v + vL)/v. Each second, you cover the distance sound travels PLUS the distance you walk.' },
      { label: 'Final Formula', formula: "f' = (v + v_L)/v x f", detail: '✅ f\' = 440 × (340 + 2)/340 = 440 × 342/340 = 442.6 Hz. The pitch rises by 2.6 Hz. This is why an approaching train horn sounds higher pitched — and why police radar uses the Doppler shift of radio waves bouncing off your car to measure your speed!' },
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
    keyInsight: 'The 12th fret on a guitar sits exactly at the midpoint — pressing it halves the string length, doubling the frequency to produce a note one octave higher.',
    steps: [
      { label: 'Nodes at Both Ends', formula: 'L = n \\times lambda_n / 2', detail: '🎸 You\'re tuning your guitar before a concert. When you pluck a string, it vibrates at specific frequencies determined by its length, tension, and mass. The string is fixed at both ends — these are nodes (points of zero vibration). The vibration pattern must fit an integer number of half-wavelengths between the fixed ends.' },
      { label: 'Wavelength of nth Harmonic', formula: 'lambda_n = 2L / n', detail: '📐 For a string of length L, the nth harmonic has n half-wavelengths: L = n(λ_n/2). The fundamental (n=1): λ₁ = 2L (the whole string vibrates in one loop). The second harmonic (n=2): λ₂ = L (two loops), and so on.' },
      { label: 'Wave Equation', formula: 'v = f_n \\times lambda_n', detail: '🧮 Wave speed v = f_n × λ_n. The wave speed on a string depends on tension and linear density: v = √(T/μ). For a typical guitar string: v ≈ 100 m/s. Longer strings produce lower fundamental frequencies.' },
      { label: 'Frequency Formula', formula: 'f_n = n \\times v / 2L', detail: '✅ f_n = nv/(2L). For a guitar string L = 0.65 m, v = 100 m/s: f₁ = 100/(2×0.65) = 76.9 Hz. The harmonics: f₂ = 153.8 Hz, f₃ = 230.7 Hz... These overtones give each instrument its unique timbre. The 12th fret sits exactly at the midpoint — pressing it halves the effective string length, doubling the frequency — that\'s an octave higher!' },
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
    keyInsight: 'Lightning forms when the electric field between storm clouds and ground exceeds 3 million V/m — strong enough to ionize air and create a conducting path.',
    steps: [
      { label: 'Definition of Electric Field', formula: 'E = F / q', detail: '⚡ You\'re investigating a Van de Graaff generator in a science museum. As you bring your hand near the metal dome, you feel a crackling sensation — the electric field. A charged object creates an invisible \'force field\' around it that pushes or pulls on other charges. The field E at any point is defined as the force per unit test charge: E = F/q.' },
      { label: 'Coulomb\'s Law', formula: 'F = k Q q / r^{2}', detail: '📐 Coulomb\'s Law: the force between two charges Q and q separated by distance r is F = kQq/r², where k = 9×10⁹ N·m²/C². For the Van de Graaff dome (Q = 1×10⁻⁶ C) and your hand with induced charge: the force is proportional to both charges and inversely proportional to distance squared.' },
      { label: 'Substitute F into E', formula: 'E = (k Q q / r^{2}) / q', detail: '🧮 Substituting F into E = F/q: E = (kQq/r²)/q = kQ/r². The test charge q cancels! The electric field depends only on the source charge Q, not on whatever you use to measure it. A larger Q or closer distance = stronger field.' },
      { label: 'Final Formula', formula: 'E = k Q / r^{2}', detail: '✅ E = kQ/r². Near the Van de Graaff dome (r = 0.1 m, Q = 1×10⁻⁶ C): E = 9×10⁹ × 1×10⁻⁶ / 0.01 = 9×10⁵ N/C. That\'s 900,000 N/C — strong enough to ionize air molecules, creating the crackling sparks! Lightning is the same physics on a massive scale.' },
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
    keyInsight: 'Electrons drift at only 0.074 mm/s in a wire, yet your light turns on instantly because the electric field propagates at near light speed — like pushing marbles in a filled tube.',
    steps: [
      { label: 'Total Charge in Conductor', formula: 'Q = n A L e', detail: '💡 You flip a light switch, and the bulb turns on instantly. But the electrons themselves move incredibly slowly through the wire. How can a light turn on instantly if electrons crawl? The answer: the signal propagates at near light speed through the electric field, while individual electrons drift at a snail\'s pace.' },
      { label: 'Current = Charge / Time', formula: 'I = Q/t = (n A L e) / t', detail: '📐 In a copper wire, there are n = 8.5×10²⁸ free electrons per cubic meter. Each has charge e = 1.6×10⁻¹⁹ C. In a wire of cross-sectional area A, a length L contains total charge Q = nALe. That\'s a staggering number of electrons!' },
      { label: 'Distance / Time = Velocity', formula: 'I = n A e (L/t) = n A e v_d', detail: '🧮 Current I = Q/t = nALe/t = nAe(L/t) = nAev_d. Here v_d = L/t is the drift velocity — the average speed electrons drift along the wire. For a 1 A current in a 1 mm² copper wire: v_d = I/(nAe) = 1/(8.5×10²⁸ × 10⁻⁶ × 1.6×10⁻¹⁹) = 7.4×10⁻⁵ m/s.' },
      { label: 'Final Formula', formula: 'I = n e A v_d', detail: '✅ I = nAev_d. The drift velocity is only 0.074 mm/s — an electron takes over 3 hours to travel 1 meter! Yet the light turns on instantly because electrons throughout the wire are already there — like a tube filled with marbles: push one in, one immediately comes out the other end.' },
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
    keyInsight: 'Electric motors in Tesla vehicles use this principle: 14,000 rpm with B=1.5 T coils producing 400 kW of mechanical power from the F=BIL interaction.',
    steps: [
      { label: 'Force on Moving Charges', formula: 'F = q v B sin theta', detail: '🔌 You\'re building an electric motor. A wire carrying current I placed in a magnetic field B experiences a force. This is the fundamental principle behind all electric motors — from the tiny vibration motor in your phone to the massive traction motors in electric trains.' },
      { label: 'Current = Moving Charges', formula: 'I = q/t so q = I t', detail: '📐 A single charge q moving at velocity v through field B experiences force F = qvB sin θ (perpendicular to both v and B). In a wire, many charges move together. Total charge q = I × t (current × time).' },
      { label: 'Velocity = L/t', formula: 'F = (I t) \\times (L/t) \\times B sin theta = I L B sin theta', detail: '🧮 The average velocity of charges is v = L/t (length of wire per unit time). Substituting: F = (It) × (L/t) × B sin θ = ILB sin θ. The time cancels! The force depends on current, not on how long it flows.' },
      { label: 'Direction: Right Hand Rule', formula: 'F perpendicular to both I and B', detail: '✅ F = BIL sin θ. Maximum force when θ = 90° (current perpendicular to field). For a motor coil: B = 0.5 T, I = 3 A, L = 0.2 m (per turn), N = 50 turns: F = 0.5 × 3 × (0.2×50) × 1 = 15 N. The right-hand rule gives the direction — it\'s the basis of every electric motor!' },
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
    keyInsight: 'Induction cooktops generate 20-100 kHz oscillating magnetic fields that induce eddy currents in the metal pan — the pan itself becomes the heating element, with no flame or hot coil.',
    steps: [
      { label: 'Faraday\'s Observation', formula: 'epsilon proportional to N dPhi/dt', detail: '🍳 You\'re cooking with an induction cooktop. It generates heat WITHOUT any visible flame or glowing element — just a magnetic field that changes thousands of times per second. How? Michael Faraday discovered in 1831 that a changing magnetic field induces an electric current in nearby conductors — electromagnetic induction.' },
      { label: 'Magnetic Flux', formula: 'Phi = B A cos theta', detail: '📐 Magnetic flux Φ = BA cos θ — the amount of magnetic field passing through a surface. Think of it like the number of field lines piercing the area. A stronger field B, larger area A, or better alignment (θ = 0) all increase flux.' },
      { label: 'Rate of Change', formula: 'epsilon = -N (delta Phi / delta t)', detail: '🧮 Faraday found that the induced EMF is proportional to the rate of change of flux through N turns: ε = -N(ΔΦ/Δt). If flux through a 100-turn coil changes by 0.5 Wb in 0.5 s: ε = -100 × 0.5/0.5 = -100 V. The faster the change, the higher the voltage!' },
      { label: 'Lenz\'s Law (Negative Sign)', formula: 'epsilon = -N dPhi/dt', detail: '✅ ε = -NdΦ/dt. The negative sign is Lenz\'s Law: the induced current opposes the change that created it. In an induction cooktop, coils under the glass generate a rapidly oscillating magnetic field (20-100 kHz) that induces eddy currents in the metal pan. The pan itself becomes the heating element!' },
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
    keyInsight: 'World-class long jumpers achieve about 1 second of hang time with takeoff speeds near 10 m/s at 22° — that airborne second feels like an eternity to the athlete.',
    steps: [
      { label: 'Vertical Motion Only', formula: 'Vertical motion determines time', detail: '🏃 You\'re a long jump athlete running down the track. Your takeoff speed is 9 m/s at 20° above horizontal. How long will you be airborne before hitting the sand pit? The answer depends only on vertical motion — your horizontal speed doesn\'t affect hang time at all.' },
      { label: 'Initial Vertical Velocity', formula: 'v_iy = v_i sin\u03B8', detail: '📏 Your initial vertical velocity: v_iy = vi sin θ = 9 × sin 20° = 9 × 0.342 = 3.08 m/s. This upward component is what keeps you off the ground. The higher your launch angle, the longer you stay up — but too high and you lose horizontal distance.' },
      { label: 'Displacement = 0 at Landing', formula: 'S_y = v_iy t + \u00BD a_y t\u00B2 = 0', detail: '🧮 Using the second equation of motion vertically: S_y = v_iy T + ½a_y T². At landing, S_y = 0 (same height as takeoff). a_y = -g. So 0 = (vi sin θ)T - ½gT². Factor T: T(vi sin θ - ½gT) = 0.' },
      { label: 'Solve for T', formula: '0 = (v_i sin\u03B8)T \u2212 \u00BD g T\u00B2 \u21D2 T = 2v_i sin\u03B8/g', detail: '✅ Non-zero solution: T = 2vi sin θ / g. For your jump: T = 2 × 9 × 0.342 / 9.81 = 6.16/9.81 = 0.628 seconds. World-class long jumpers achieve about 1 second of hang time with takeoff speeds near 10 m/s and angles around 22°. That second feels like an eternity!' },
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
    keyInsight: 'Figure skaters spin 11× faster when pulling arms from 1 m to 0.3 m radius — the same conservation law explains why neutron stars spin hundreds of times per second.',
    steps: [
      { label: 'Definition of Angular Momentum', formula: 'L = r \u00D7 p = rmv sin90\u00B0 = rmv', detail: '⛸️ You\'re watching an Olympic figure skater. She starts spinning with arms extended, then pulls her arms in — and suddenly spins much faster! This is conservation of angular momentum in action. Angular momentum L is the rotational equivalent of linear momentum (p = mv), and it\'s defined as L = r × p (position vector cross linear momentum).' },
      { label: 'Substitute Linear Momentum', formula: 'L = r \u00D7 (mv) = rmv', detail: '📐 For an object moving in a circle of radius r: L = r × mv. Since r and v are perpendicular (circular motion): L = rmv. If a skater with mass 50 kg spins at radius 1 m with speed 3 m/s: L = 1 × 50 × 3 = 150 kg·m²/s.' },
      { label: 'Use v = r\u03C9', formula: 'L = r \u00D7 m \u00D7 (r\u03C9) = mr\u00B2\u03C9', detail: '🔄 Substitute v = rω: L = r × m × (rω) = mr²ω. The quantity I = mr² is called the moment of inertia — it measures how hard it is to spin an object. When the skater pulls arms in from r = 1 m to r = 0.3 m, I drops from 50 to 4.5 kg·m².' },
      { label: 'Moment of Inertia I = mr\u00B2', formula: 'L = I\u03C9', detail: '🎯 Conservation of angular momentum: L = Iω = constant. If I decreases, ω must increase: ω_new = ω_old × (I_old/I_new). The skater\'s spin speed multiplies by 11! This also explains why neutron stars spin at hundreds of times per second — they\'re the collapsed cores of massive stars, with unimaginably small moments of inertia.' },
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
    keyInsight: 'Mechanics use 0.5 m breaker bars on stubborn bolts — doubling the lever arm doubles the torque, making it possible to loosen rusted fasteners that a standard wrench cannot.',
    steps: [
      { label: 'Definition of Torque', formula: '\u03C4 = r F sin90\u00B0 = rF', detail: '🚪 You\'re trying to open a heavy door. You instinctively push as far from the hinges as possible. Why? Torque τ = rF depends on both the force F and the lever arm distance r. Pushing at the door edge (r = 0.8 m) with 20 N gives τ = 16 N·m. Pushing near the hinge (r = 0.1 m) with the same force gives only τ = 2 N·m — eight times less effective!' },
      { label: 'Apply Newton\u2019s Second Law', formula: '\u03C4 = r \u00D7 (ma)', detail: '🏗️ Newton\'s Second Law says F = ma for linear motion. For rotation: τ = rF = r(ma_t). The tangential acceleration a_t = rα, where α is angular acceleration. Substituting: τ = r × m × (rα) = mr²α.' },
      { label: 'Use a_t = r\u03B1', formula: '\u03C4 = r \u00D7 m \u00D7 (r\u03B1) = mr\u00B2\u03B1', detail: '📐 The quantity I = mr² is the moment of inertia — it\'s the rotational equivalent of mass. Just as heavier objects are harder to push linearly, objects with larger I are harder to spin. For the door (mass 30 kg, treat as concentrated at r = 0.4 m): I ≈ 30 × 0.16 = 4.8 kg·m².' },
      { label: 'Moment of Inertia I = mr\u00B2', formula: '\u03C4 = I\u03B1', detail: '✅ Newton\'s Second Law for rotation: τ = Iα. A wrench uses this — applying 50 N at 0.3 m gives τ = 15 N·m. If the bolt\'s I = 0.01 kg·m², α = 1500 rad/s² — the bolt spins fast!' },
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
    keyInsight: 'NASA\'s proposed Nautilus-X space station uses a 9 m rotating section to provide partial gravity for Mars astronauts, preventing the bone loss seen in zero gravity.',
    steps: [
      { label: 'Centripetal Equals Gravity', formula: 'a_c = g', detail: '🛸 You\'re the engineer designing a rotating space station for a Mars mission, like the one from \'2001: A Space Odyssey\'. Astronauts in zero gravity suffer bone loss and muscle atrophy. Your solution: spin the station to create artificial gravity using centripetal acceleration. The target: a_c = 9.81 m/s² — Earth-normal gravity.' },
      { label: 'Substitute a_c = v\u00B2/R', formula: 'v\u00B2/R = g', detail: '📐 Centripetal acceleration a_c = v²/R. Set this equal to Earth\'s gravity: v²/R = g = 9.81 m/s². Multiply both sides by R: v² = gR. The required linear speed v = √(gR). For a station with radius R = 50 m: v = √(9.81 × 50) = √490.5 = 22.1 m/s ≈ 80 km/h.' },
      { label: 'Solve for v', formula: 'v = \u221A(gR)', detail: '🔄 Using v = ωR: ω²R² = gR, so ω² = g/R, ω = √(g/R). For R = 50 m: ω = √(9.81/50) = √0.1962 = 0.443 rad/s. One full rotation takes T = 2π/ω = 2π/0.443 ≈ 14.2 seconds.' },
      { label: 'Using v = \u03C9R', formula: '\u03C9 = \u221A(g/R)', detail: '🌍 A smaller station (R = 10 m) would need ω = √(9.81/10) = 0.99 rad/s, rotating once every 6.3 seconds — fast enough to cause dizziness! This is why space stations need large radii. NASA\'s proposed Nautilus-X would use a 9 m radius rotating section to provide partial gravity for Mars-bound astronauts.' },
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
    keyInsight: 'Skydivers in belly-down position fall at 55 m/s (200 km/h); going head-down they reach 90 m/s — body position controls drag area and thus terminal speed.',
    steps: [
      { label: 'Forces at Terminal Velocity', formula: 'Weight = Drag: mg = F_drag', detail: '🌧️ You\'re a meteorologist studying raindrops. Why don\'t raindrops keep accelerating until they hit the ground? Because air drag increases with speed until it balances gravity. At that point, net force = 0, acceleration = 0, and the drop falls at constant terminal velocity.' },
      { label: 'Stokes\u2019 Law for Drag', formula: 'F_drag = 6\u03C0\u03B7 r v_t', detail: '📐 For a small sphere in a viscous fluid, Stokes\' Law gives drag force: F_drag = 6πηrv_t, where η is fluid viscosity, r is radius. A tiny raindrop (r = 0.5 mm) in air (η = 1.8×10⁻⁵ Pa·s) experiences drag proportional to its speed and radius.' },
      { label: 'Mass of Sphere', formula: 'm = \u03C1V = \u03C1 \u00D7 (4/3)\u03C0 r\u00B3', detail: '🧮 At terminal velocity: Weight = Drag. mg = 6πηrv_t. Mass of a sphere: m = ρV = ρ × (4/3)πr³. So ρ(4/3)πr³g = 6πηrv_t. Cancel π and one r: ρ(4/3)r²g = 6ηv_t.' },
      { label: 'Solve for v_t', formula: 'v_t = 2\u03C1 g r\u00B2 / 9\u03B7', detail: '✅ Solve for v_t: v_t = 2ρgr²/(9η). For a raindrop (ρ = 1000 kg/m³, r = 0.5 mm): v_t = 2×1000×9.81×(5×10⁻⁴)²/(9×1.8×10⁻⁵) = 30.3 m/s (109 km/h). Larger drops fall faster — that\'s why drizzle floats gently while heavy rain pounds down! Skydivers: v_t ≈ 55 m/s (200 km/h) in belly-down position.' },
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
    keyInsight: 'Old Christmas lights wired in series go dark when one bulb fails — the broken bulb breaks the only current path. Modern lights use parallel wiring so the rest stay lit.',
    steps: [
      { label: 'KVL: Voltages Add', formula: 'V_total = V\u2081 + V\u2082 + V\u2083', detail: '🎄 You\'re decorating a Christmas tree with old-style incandescent fairy lights connected in series. If one bulb burns out, the whole string goes dark. In a series circuit, the same current I flows through every component. By Kirchhoff\'s Voltage Law, the total voltage equals the sum of individual voltage drops.' },
      { label: 'Ohm\u2019s Law for Each', formula: 'IR_eq = IR\u2081 + IR\u2082 + IR\u2083', detail: '📐 For three resistors in series: V_total = V₁ + V₂ + V₃. Each voltage drop follows Ohm\'s Law: V = IR. So: V_total = IR₁ + IR₂ + IR₃ = I(R₁ + R₂ + R₃).' },
      { label: 'Current is Common', formula: 'I R_eq = I (R\u2081 + R\u2082 + R\u2083)', detail: '🧮 But by Ohm\'s Law for the equivalent resistance: V_total = IR_eq. Equating: IR_eq = I(R₁ + R₂ + R₃). The current I is common to all terms — cancel it!' },
      { label: 'Cancel Current I', formula: 'R_eq = R\u2081 + R\u2082 + R\u2083', detail: '✅ R_eq = R₁ + R₂ + R₃. For 100 Ω + 50 Ω + 25 Ω: R_eq = 175 Ω. Series resistance always adds up — total is always larger than the largest individual. That\'s why the old Christmas lights went dark when one bulb failed: the broken bulb broke the only path for current.' },
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
    keyInsight: 'House wiring is parallel so unplugging one appliance doesn\'t cut power to others — each outlet gets the full 230 V independently.',
    steps: [
      { label: 'KCL: Currents Add', formula: 'I_total = I\u2081 + I\u2082 + I\u2083', detail: '🏠 You\'re wiring your house. Every outlet, light, and appliance is connected in parallel across the 230 V mains. This is crucial: if you unplug your toaster, the rest of the house stays on. In parallel, each branch has the SAME voltage but carries its own current. By Kirchhoff\'s Current Law, total current = sum of branch currents.' },
      { label: 'Ohm\u2019s Law for Each', formula: 'V/R_eq = V/R\u2081 + V/R\u2082 + V/R\u2083', detail: '📐 For three resistors in parallel: I_total = I₁ + I₂ + I₃. Each branch follows Ohm\'s Law: I = V/R. So: V/R_eq = V/R₁ + V/R₂ + V/R₃. The voltage V is the same across all parallel branches.' },
      { label: 'Voltage is Common', formula: 'V(1/R_eq) = V(1/R\u2081 + 1/R\u2082 + 1/R\u2083)', detail: '🧮 Factor out V: V(1/R_eq) = V(1/R₁ + 1/R₂ + 1/R₃). Cancel V (same for all branches): 1/R_eq = 1/R₁ + 1/R₂ + 1/R₃.' },
      { label: 'Cancel Voltage V', formula: '1/R_eq = 1/R\u2081 + 1/R\u2082 + 1/R\u2083', detail: '✅ 1/R_eq = 1/R₁ + 1/R₂ + 1/R₃. For 100 Ω, 50 Ω, 25 Ω in parallel: 1/R_eq = 1/100 + 1/50 + 1/25 = 0.01 + 0.02 + 0.04 = 0.07, so R_eq = 14.3 Ω. The equivalent resistance is LESS than the smallest individual!' },
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
    keyInsight: 'Carburetors use the Venturi effect: a constriction in the air passage drops pressure, sucking fuel into the airstream to create the combustible mixture the engine needs.',
    steps: [
      { label: 'Bernoulli\u2019s Equation (Horizontal)', formula: 'P\u2081 + \u00BD\u03C1v\u2081\u00B2 = P\u2082 + \u00BD\u03C1v\u2082\u00B2', detail: '🧪 You\'re a plumber diagnosing a clogged pipe. You attach a Venturi meter — a tube that narrows in the middle — to measure flow rate. The constriction makes the fluid speed up, which drops its pressure. The pressure difference tells you the flow velocity.' },
      { label: 'Pressure Difference', formula: 'P\u2081 \u2212 P\u2082 = \u00BD\u03C1(v\u2082\u00B2 \u2212 v\u2081\u00B2)', detail: '📐 In a horizontal pipe (h₁ = h₂), Bernoulli simplifies: P₁ + ½ρv₁² = P₂ + ½ρv₂². Rearranging: P₁ - P₂ = ½ρ(v₂² - v₁²). The pressure drop between the wide and narrow sections equals the change in dynamic pressure.' },
      { label: 'Continuity Equation', formula: 'v\u2082 = v\u2081 (A\u2081/A\u2082)', detail: '🔄 From continuity: A₁v₁ = A₂v₂, so v₂ = v₁(A₁/A₂). The fluid must speed up in the narrow section by the ratio of areas. Substitute: P₁ - P₂ = ½ρv₁²((A₁/A₂)² - 1).' },
      { label: 'Manometer Reading', formula: 'P\u2081 \u2212 P\u2082 = \u03C1gh', detail: '📊 The pressure difference is measured by a manometer: P₁ - P₂ = ρgh. Equating: ρgh = ½ρv₁²((A₁/A₂)² - 1). Solve: v₁ = √(2gh/((A₁/A₂)² - 1)). This formula is used in carburetors to mix fuel with air, in perfume atomizers, and in medical nebulizers!' },
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
    keyInsight: 'A bow stores 25 J of elastic energy when drawn 0.5 m — when released, this converts to kinetic energy, launching the arrow at 147 km/h toward the target.',
    steps: [
      { label: 'Force-Extension Graph', formula: 'Area under F-x graph = Work done', detail: '🏹 You\'re an archer drawing a bow. The more you pull back the string, the harder it becomes to pull further — Robert Hooke discovered this in 1660: F = kx, where k is the spring constant. A typical bow has k = 200 N/m. Pulling back 0.5 m requires 100 N of force.' },
      { label: 'Work = Area of Triangle', formula: 'W = \u00BD \u00D7 F \u00D7 x', detail: '📐 On a force-extension graph, F = kx is a straight line through the origin. The work done to stretch the spring equals the area under this line — which is a triangle! Area = ½ × base × height = ½ × x × F.' },
      { label: 'Substitute F = kx', formula: 'W = \u00BD \u00D7 (kx) \u00D7 \\times = \u00BD k x\u00B2', detail: '🧮 Substitute F = kx: W = ½ × x × kx = ½kx². If you pull your bow 0.5 m with k = 200 N/m: W = ½ × 200 × 0.25 = 25 J. That 25 joules of work is stored as elastic potential energy.' },
      { label: 'Elastic Potential Energy', formula: 'U = \u00BD k x\u00B2', detail: '✅ U = ½kx². When released, this energy converts to kinetic energy of the arrow: ½mv² = ½kx². An arrow of mass 0.03 kg: v = √(kx²/m) = √(200×0.25/0.03) = √1667 = 40.8 m/s (147 km/h)! This same principle powers everything from trampolines to vehicle suspension systems.' },
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
    keyInsight: 'A 4-cylinder engine at 3000 RPM produces 6000 power strokes per minute — each delivering 250 J from expanding gas, totaling 25,000 W (33 horsepower) of mechanical output.',
    steps: [
      { label: 'Force on Piston', formula: 'F = P \u00D7 A', detail: '🔧 You\'re a mechanical engineer designing a car engine. Inside each cylinder, burning gasoline expands, pushing a piston that turns the crankshaft. The work done by the expanding gas is what propels your car forward. Think of a piston of area A being pushed by gas pressure P.' },
      { label: 'Work = Force \u00D7 Distance', formula: 'W = F \u00D7 \u0394y', detail: '📐 The gas exerts force F = P × A on the piston. Work = force × distance: W = F × Δy = (PA) × Δy. The piston moves a distance Δy as the gas expands.' },
      { label: 'Substitute Force', formula: 'W = (P \u00D7 A) \u00D7 \u0394y = P \u00D7 (A \u0394y)', detail: '🧮 Substitute: W = P × (AΔy). But A × Δy = ΔV — the change in volume of the gas! So W = PΔV. For a car cylinder: if gas at 5×10⁵ Pa expands by 0.5 L (5×10⁻⁴ m³): W = 5×10⁵ × 5×10⁻⁴ = 250 J per stroke.' },
      { label: 'A\u0394y = Change in Volume', formula: 'W = P \u0394V', detail: '🔥 A four-cylinder engine at 3000 RPM does 4 cylinders × 2 strokes/rotation = 6000 power strokes per minute. That\'s 6000 × 250 = 1,500,000 J/min = 25,000 W ≈ 33 horsepower! The negative sign (W = -PΔV) means work is done ON the gas during compression — like in a diesel engine\'s compression stroke.' },
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
    keyInsight: 'Your kitchen fridge achieves COP 3-4: for every 1 J of electricity, it removes 3-4 J of heat from your food — and dumps all of it plus the electrical energy as heat out the back.',
    steps: [
      { label: 'Definition of COP (Cooling)', formula: 'COP = Q\u2082 / W', detail: '❄️ You\'re designing a refrigerator. Your goal: remove as much heat as possible from the inside (cold reservoir at 270 K) while doing minimum work. The compressor does work W, heat Q₂ is extracted from the food compartment, and Q₁ is rejected to the kitchen (at 310 K).' },
      { label: 'Work Input', formula: 'W = Q\u2081 \u2212 Q\u2082', detail: '📐 COP (Coefficient of Performance) = Q₂/W (for cooling) — the heat removed per unit work input. A COP of 6 means you remove 6 J of heat for every 1 J of electrical work. Better than 100% \'efficiency\' because you\'re moving heat, not creating it!' },
      { label: 'Substitute', formula: 'COP = Q\u2082 / (Q\u2081 \u2212 Q\u2082)', detail: '🧮 For a Carnot refrigerator: W = Q₁ - Q₂ (work input = heat rejected - heat absorbed). COP = Q₂/(Q₁ - Q₂). Using Q₁/Q₂ = T₁/T₂ (for a reversible cycle): COP = T₂/(T₁ - T₂).' },
      { label: 'Using Q \u221D T', formula: 'COP = T\u2082 / (T\u2081 \u2212 T\u2082)', detail: '✅ COP = 270/(310-270) = 270/40 = 6.75. For every 1 J of electricity, 6.75 J of heat is removed from your food! Your kitchen gets Q₁ = Q₂ + W = 6.75 + 1 = 7.75 J of heat — that\'s why the back of the fridge feels warm. Modern refrigerators achieve COP of 3-4 in practice.' },
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
    keyInsight: 'Doppler echocardiography measures blood flow velocity by comparing ultrasound frequency shifts from moving red blood cells — non-invasive heart diagnostics.',
    steps: [
      { label: 'Relative Speed of Sound', formula: 'v_relative = v \u2212 v_L', detail: '🚶 You\'re walking away from a fixed speaker playing the same 440 Hz note. Now the pitch drops! Walking away at vL = 2 m/s, the sound waves reach you slower — effective speed decreases to v - vL = 338 m/s.' },
      { label: 'Apparent Wavelength', formula: '\u03BB = v/f (unchanged)', detail: '📐 The wavelength is still unchanged: λ = v/f = 340/440 = 0.773 m. The source is stationary, so the spatial pattern of compressions and rarefactions in the air doesn\'t change regardless of your motion.' },
      { label: 'Apparent Frequency', formula: "f' = v_relative / \u03BB = (v \u2212 v_L) / (v/f)", detail: '🧮 You encounter fewer wave peaks per second: f\' = v_relative / λ = (v - vL)/(v/f) = f × (v - vL)/v. You\'re running away from the waves, so they take longer to catch up to you.' },
      { label: 'Final Formula', formula: "f' = (v \u2212 v_L)/v \u00D7 f", detail: '✅ f\' = 440 × (340 - 2)/340 = 440 × 338/340 = 437.4 Hz. The pitch drops by 2.6 Hz. The same shift magnitude as approaching, just in the opposite direction. This symmetry is used in Doppler echocardiography — doctors measure blood flow velocity by comparing the frequency shift of ultrasound waves reflected from moving red blood cells!' },
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
    keyInsight: 'An ambulance at 30 m/s shifts its siren pitch by 42 Hz as it approaches — the classic rising-then-falling wail you hear as it passes by at speed.',
    steps: [
      { label: 'Compressed Wavelength', formula: "\u03BB' = \u03BB \u2212 \u0394\u03BB = (v \u2212 v_S)/f", detail: '🚑 You\'re standing still as an ambulance races toward you with its siren blaring at 440 Hz. The pitch sounds much higher than when it\'s stationary. But the physics is different here: the source is moving, compressing the sound waves ahead of it.' },
      { label: 'Wave Compression', formula: '\u0394\u03BB = v_S/f', detail: '📐 In one period T = 1/f, the source moves distance vS × T toward you while the wave travels v × T. The new wavelength: λ\' = vT - vST = (v - vS)/f. The waves are bunched up — compressed!' },
      { label: 'Apparent Frequency', formula: "f' = v/\u03BB' = v / ((v \u2212 v_S)/f)", detail: '🧮 You hear the compressed waves at: f\' = v/λ\' = v/((v - vS)/f) = f × v/(v - vS). Since the denominator is smaller than v, the frequency increases. The speed of sound v = 340 m/s is fixed, but the spacing between wavefronts is squeezed.' },
      { label: 'Final Formula', formula: "f' = v/(v \u2212 v_S) \u00D7 f", detail: '✅ Ambulance at 30 m/s: f\' = 440 × 340/(340-30) = 440 × 340/310 = 482.6 Hz. The pitch jumps by 42.6 Hz — a noticeable higher pitch! The formula breaks down when vS approaches v (the sound barrier) — at vS = v, the frequency becomes infinite, and you hear a sonic boom!' },
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
    keyInsight: 'Clarinets sound different from flutes because they\'re closed pipes (only odd harmonics) while flutes are open pipes (all harmonics) — same length, different timbre.',
    steps: [
      { label: 'Antinodes at Both Ends', formula: 'L = n(\u03BB_n/2)', detail: '🎵 You\'re a flute player in an orchestra. When you blow across the mouthpiece, the air column inside vibrates producing musical notes. An open pipe (open at both ends) has antinodes (maximum vibration) at both ends. The air must vibrate freely at the openings.' },
      { label: 'Wavelength of nth Harmonic', formula: '\u03BB_n = 2L/n', detail: '📐 For an open pipe of length L: L = n(λ_n/2). Same formula as the string! The fundamental (n=1): λ₁ = 2L. Second harmonic (n=2): λ₂ = L. All harmonics are present in an open pipe, giving it a rich, bright sound.' },
      { label: 'Wave Equation', formula: 'v = f_n \u03BB_n', detail: '🧮 Using v = fλ: f_n = nv/(2L). The speed of sound in air v = 343 m/s at 20°C. A 0.6 m flute: f₁ = 343/(2×0.6) = 285.8 Hz (around middle C#). Warmer air increases v, raising the pitch — that\'s why orchestras tune before performances!' },
      { label: 'Frequency Formula', formula: 'f_n = n v / 2L', detail: '✅ A closed pipe (one end closed) is different: it has a node at the closed end and an antinode at the open end. L = (2n-1)λ_n/4, so f_n = (2n-1)v/(4L) — only odd harmonics! A 0.6 m closed pipe: f₁ = 343/(4×0.6) = 142.9 Hz (lower, hollow sound). This is why clarinets (closed pipe) sound different from flutes (open pipe)!' },
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
    keyInsight: 'Lightning rods concentrate charge at their sharp tips, creating field gradients exceeding 3 million V/m that ionize air and safely conduct strikes to ground.',
    steps: [
      { label: 'Work Done Moving Test Charge', formula: 'W = F \u0394r = qE \u0394r', detail: '🔋 You\'re working with a parallel plate capacitor — two metal plates with a voltage difference across them. The electric field between the plates is uniform. If you move a test charge q from one plate to the other, you do work against the field. How does this work relate to voltage?' },
      { label: 'Work = Change in PE', formula: 'W = \u2212q \u0394V', detail: '📐 Work = force × displacement: W = FΔr = (qE)Δr. Moving a charge through a uniform field E over distance Δr requires force qE (overcoming the field\'s push).' },
      { label: 'Equate Both Expressions', formula: 'qE \u0394r = \u2212q \u0394V', detail: '🧮 But work also equals the negative change in potential energy: W = -qΔV (negative because moving against the field increases potential energy). Equate: qEΔr = -qΔV. Cancel q: EΔr = -ΔV.' },
      { label: 'Solve for E', formula: 'E = \u2212\u0394V/\u0394r', detail: '✅ E = -ΔV/Δr. The electric field equals the negative potential gradient. For a capacitor with 12 V across 0.01 m gap: E = -12/0.01 = -1200 V/m. The negative sign means the field points from HIGH to LOW potential. Lightning forms when the potential gradient exceeds 3×10⁶ V/m!' },
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
    keyInsight: 'Solar panels are matched to their inverter\'s input impedance using this theorem — matching resistance maximizes power transfer from panel to grid.',
    steps: [
      { label: 'Power Delivered to Load', formula: 'P_out = I\u00B2 R', detail: '🔊 You\'re an audio engineer matching a speaker to an amplifier. An amplifier has internal resistance r = 4 Ω and EMF ε = 20 V. The speaker has resistance R. To get the loudest sound, you need to maximize the power delivered to R. But what value of R gives maximum power?' },
      { label: 'Current with Internal Resistance', formula: 'I = \u03B5 / (R + r)', detail: '📐 Power delivered to load R: P_out = I²R. Using Ohm\'s Law with internal resistance: I = ε/(R + r). So P_out = ε²R/(R + r)².' },
      { label: 'Substitute Current', formula: 'P_out = \u03B5\u00B2 R / (R + r)\u00B2', detail: '🧮 For R = 2 Ω: P = 400×2/(6)² = 800/36 = 22.2 W. For R = 4 Ω: P = 400×4/(8)² = 1600/64 = 25.0 W. For R = 8 Ω: P = 400×8/(12)² = 3200/144 = 22.2 W. The power is maximized when R = r!' },
      { label: 'Max When R = r', formula: 'P_max = \u03B5\u00B2 / 4r', detail: '✅ P_max = ε²/(4r). For ε = 20 V, r = 4 Ω: P_max = 400/16 = 25 W. This is the Maximum Power Transfer Theorem — load resistance equals source resistance for maximum power. It applies everywhere — from solar panels to wireless charging!' },
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
    keyInsight: 'Strain gauges in bathroom scales and structural monitors use Wheatstone bridges to detect resistance changes as small as 0.01% — precision that a multimeter cannot match.',
    steps: [
      { label: 'At Balance, No Current Through Galvanometer', formula: 'I_g = 0', detail: '🔬 You\'re in a physics lab needing to measure an unknown resistance R precisely. A multimeter gives approximate values, but you need higher accuracy. Samuel Hunter Christie (1833) and later Charles Wheatstone created a bridge circuit that compares unknown to known resistors — and it\'s incredibly precise because it uses a null measurement (zero current through the galvanometer).' },
      { label: 'Voltage Drops in Upper Branch', formula: 'V_P = V_R (I\u2081P = I\u2082R)', detail: '📐 At balance, no current flows through the galvanometer — points B and D are at the same potential. In the upper branch: voltage across P = voltage across R. Since B and D are at same potential: I₁P = I₂R.' },
      { label: 'Voltage Drops in Lower Branch', formula: 'V_Q = V_S (I\u2081Q = I\u2082S)', detail: '📐 In the lower branch: similarly I₁Q = I₂S. The same current I₁ flows through P and Q (they\'re in series), and I₂ flows through R and S. At balance, the voltage divider ratios are equal.' },
      { label: 'Divide Equations', formula: 'P/Q = R/S \u21D2 R = PS/Q', detail: '✅ Divide the equations: (I₁P)/(I₁Q) = (I₂R)/(I₂S). Cancel currents: P/Q = R/S, so R = PS/Q. If P = 100 Ω, Q = 50 Ω, S = 75 Ω: R = 100×75/50 = 150 Ω. The bridge gives precision to 0.01% because it detects ZERO current!' },
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
    keyInsight: 'High-voltage transmission lines spaced 0.5 m apart exert 0.4 N/m of force at 1000 A — parallel currents attract, which is why power company bundles them in specific geometries.',
    steps: [
      { label: 'Magnetic Field of First Wire', formula: 'B\u2081 = \u03BC\u2080 I\u2081 / 2\u03C0r', detail: '🔌 You\'re designing a high-voltage transmission line. When two parallel wires carry current, they exert force on each other — like tiny electromagnets attracting or repelling. This interaction is the basis of the definition of the ampere, the fundamental unit of electric current.' },
      { label: 'Force on Second Wire', formula: 'F = B\u2081 I\u2082 L', detail: '📐 A long straight wire carrying current I₁ produces a magnetic field at distance r: B₁ = μ₀I₁/(2πr), where μ₀ = 4π×10⁻⁷ T·m/A is the permeability of free space. This field circulates around the wire like concentric rings.' },
      { label: 'Substitute B\u2081', formula: 'F/L = (\u03BC\u2080 I\u2081 / 2\u03C0r) \u00D7 I\u2082 = \u03BC\u2080 I\u2081 I\u2082 / 2\u03C0r', detail: '🧮 The second wire (carrying I₂) experiences force F = B₁I₂L in this magnetic field. Substitute B₁: F/L = (μ₀I₁/(2πr)) × I₂ = μ₀I₁I₂/(2πr). Parallel currents attract; opposite currents repel.' },
      { label: 'Definition of Ampere', formula: '1 A is current producing 2\u00D710\u207B\u2077 N/m at r = 1 m', detail: '✅ F/L = μ₀I₁I₂/(2πr). For I₁ = I₂ = 1 A, r = 1 m: F/L = (4π×10⁻⁷)/(2π) = 2×10⁻⁷ N/m. This tiny force defines the ampere! In a high-voltage line with I = 1000 A, r = 0.5 m: F/L = (4π×10⁻⁷)×10⁶/(2π×0.5) = 0.4 N/m.' },
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
    keyInsight: 'The aurora borealis occurs when solar wind charged particles spiral along Earth\'s magnetic field lines, creating curtains of light at the poles — same physics as CRT electron beams.',
    steps: [
      { label: 'Magnetic Force', formula: 'F_B = qvB (when v \u22A5 B)', detail: '📺 You\'re fixing an old CRT television. Inside the glass tube, electrons are fired at the screen to create the picture. A magnetic field bends their path — the electron beam scans across the screen 60 times per second. The force qvB acts perpendicular to the velocity, creating circular motion.' },
      { label: 'Centripetal Acceleration', formula: 'F_c = mv\u00B2 / r', detail: '📐 The magnetic force F_B = qvB (when v ⟂ B) acts as a centripetal force: it\'s always perpendicular to velocity, pulling the electron into a circular path. No work is done (force ⟂ displacement), so speed stays constant.' },
      { label: 'Forces Balance', formula: 'qvB = mv\u00B2 / r', detail: '🧮 Set magnetic force equal to centripetal force: qvB = mv²/r. Rearranging: r = mv/(qB). For an electron in a CRT: m = 9.11×10⁻³¹ kg, v = 2×10⁷ m/s, B = 0.01 T: r = (9.11×10⁻³¹ × 2×10⁷)/(1.6×10⁻¹⁹ × 0.01) = 1.14×10⁻² m = 1.14 cm.' },
      { label: 'Solve for Radius', formula: 'r = mv / qB', detail: '✅ r = mv/(qB). By varying the magnetic field in the deflection coils, the electron beam scans across the screen to create 625 lines of resolution. The same physics explains the aurora borealis: charged particles from the solar wind spiral along Earth\'s magnetic field lines, creating stunning light shows at the poles.' },
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
    keyInsight: 'Mass spectrometers identify molecules by first filtering them through crossed E and B fields — only particles with velocity v=E/B pass through to the mass analyzer, detecting everything from drug metabolites to explosives.',
    steps: [
      { label: 'Electric Force', formula: 'F_E = qE', detail: '🧪 You\'re operating a mass spectrometer — a device that identifies molecules by their mass. But first, you need a beam of particles all moving at the same velocity. Enter the velocity selector: crossed electric and magnetic fields that filter particles by speed.' },
      { label: 'Magnetic Force', formula: 'F_B = qvB', detail: '📐 An electric field exerts force F_E = qE in the direction of the field. The particles are pulled one way by the electric field.' },
      { label: 'Balance Forces (Undeflected)', formula: 'qE = qvB', detail: '📐 Simultaneously, a magnetic field exerts F_B = qvB perpendicular to both v and B. By orienting the fields perpendicularly (crossed), the two forces oppose each other. Particles experience F_E one way and F_B the opposite way.' },
      { label: 'Solve for v', formula: 'v = E/B', detail: '✅ When forces balance: qE = qvB, cancel q: v = E/B. Only particles with exactly this speed pass straight through. For E = 3000 N/C and B = 0.1 T: v = 3000/0.1 = 30,000 m/s. Mass spectrometers use this to identify molecules — this is how airports detect explosives!' },
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
    keyInsight: 'Astronomers measure galaxy recession velocities using this formula — redshift of spectral lines tells us how fast distant galaxies are moving away, revealing the expanding universe.',
    steps: [
      { label: 'Expanded Wavelength', formula: "\u03BB' = \u03BB + \u0394\u03BB = (v + v_S)/f", detail: '🚑 The ambulance passes you and races away. The pitch drops dramatically. Now the source is moving away, stretching the sound waves behind it — like a boat creating longer waves behind it as it moves forward.' },
      { label: 'Wave Expansion', formula: '\u0394\u03BB = v_S/f', detail: '📐 In one period, the source moves vS × T away from you. The wave travels v × T. The new wavelength behind: λ\' = vT + vST = (v + vS)/f. The waves are stretched — longer wavelength means lower frequency!' },
      { label: 'Apparent Frequency', formula: "f' = v/\u03BB' = v / ((v + v_S)/f)", detail: '🧮 Apparent frequency: f\' = v/λ\' = v/((v + vS)/f) = f × v/(v + vS). Now the denominator is larger than v, so frequency decreases. The waves are being \'left behind\' by the receding source.' },
      { label: 'Final Formula', formula: "f' = v/(v + v_S) \u00D7 f", detail: '✅ Ambulance at 30 m/s moving away: f\' = 440 × 340/(340+30) = 440 × 340/370 = 404.3 Hz. The pitch drops by 35.7 Hz — the classic \'wooo\' as it passes. Astronomers use the same principle to measure how fast stars and galaxies are moving toward or away from Earth!' },
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
    keyInsight: 'Calibrating a voltmeter requires a potentiometer because it draws zero current at balance — measuring true EMF without loading the cell being tested.',
    steps: [
      { label: 'Potential Gradient Along Wire', formula: 'V/L = \\text{constant}', detail: '🔋 You\'re comparing two batteries to find the EMF of an unknown cell. You can\'t use a voltmeter directly because it draws some current and gives inaccurate readings. Instead, use a potentiometer — a long uniform wire with a sliding contact. The wire has a constant potential gradient (voltage per unit length is uniform).' },
      { label: 'Fall of Potential', formula: '\u03B5 \u221D l', detail: '📐 The potential difference across any length l of the wire is proportional to l: V ∝ l. If the wire is 1 m long with a 2 V battery across it, the gradient is 2 V/m. Every centimeter gives exactly 0.02 V.' },
      { label: 'For Two Cells', formula: '\u03B5\u2081 \u221D l\u2081, \u03B5\u2082 \u221D l\u2082', detail: '📐 For cell 1 with known EMF ε₁: you slide the contact until the galvanometer reads zero (no current drawn). Balancing length = l₁. For cell 2: balancing length = l₂. Since the gradient is constant: ε₁ ∝ l₁, ε₂ ∝ l₂.' },
      { label: 'Divide Equations', formula: '\u03B5\u2082/\u03B5\u2081 = l\u2082/l\u2081', detail: '✅ ε₂/ε₁ = l₂/l₁. If ε₁ = 1.5 V gives l₁ = 60 cm, and unknown cell gives l₂ = 40 cm: ε₂ = 1.5 × 40/60 = 1.0 V. The beauty: at balance, the cell draws ZERO current — you measure the true EMF!' },
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
    keyInsight: 'PET scanners in hospitals use positron annihilation — the antimatter that Dirac predicted from the ± sign in this equation — to detect cancer tumors with millimeter precision.',
    steps: [
      { label: "Einstein's Energy Relation", formula: 'E = \u00B1\u221A(m\u00B2c\u2074 + p\u00B2c\u00B2)', detail: '🔬 You\'re analyzing data from the Large Hadron Collider at CERN. Particles smash together at nearly light speed, and Einstein\'s special relativity governs their behavior. For a particle with rest mass m and momentum p, the total energy E includes both rest energy and kinetic energy.' },
      { label: 'Square Both Sides', formula: 'E\u00B2 = m\u00B2c\u2074 + p\u00B2c\u00B2', detail: '📐 Einstein\'s energy-momentum relation: E² = (mc²)² + (pc)². This is the relativistic Pythagorean theorem — rest energy and momentum energy are perpendicular legs, total energy is the hypotenuse. For a stationary particle (p=0): E = mc². For a massless photon (m=0): E = pc.' },
      { label: 'Rearrange for p\u00B2c\u00B2', formula: 'p\u00B2c\u00B2 = E\u00B2 \u2212 m\u00B2c\u2074', detail: '🧮 Squared: E² = m²c⁴ + p²c². Rearranging: p²c² = E² - m²c⁴. Divide by c²: p² = (E² - m²c⁴)/c².' },
      { label: 'Solve for p', formula: 'p = \u00B1\u221A(E\u00B2 \u2212 m\u00B2c\u2074)/c', detail: '✅ p = √(E² - m²c⁴)/c. For a 1 TeV proton (m_pc² = 0.938 GeV) at the LHC: p ≈ 1 TeV/c. The ± sign Dirac noticed: E = ±√(m²c⁴ + p²c²). This led Dirac to predict antimatter — the positron — in 1928! Today, PET scanners in hospitals use positron annihilation to detect cancer.' },
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
