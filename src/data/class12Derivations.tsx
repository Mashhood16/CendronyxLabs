import type { DerivationConfig } from '../components/GenericDerivationLab';
import { Globe, Thermometer, Activity, Waves, Zap, Cpu, Atom, Sun, Cloud, Target } from 'lucide-react';

export const CLASS12_DERIVATIONS: Record<string, DerivationConfig> = {
  // === Unit 15: Gravitation ===
  gravitation_law: {
    title: 'Derivation: Newton\'s Law of Universal Gravitation',
    icon: <Globe className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-purple-600',
    accentColor: 'bg-indigo-600',
    finalFormula: 'F\u2091 = G \u00D7 m\u2081 \u00D7 m\u2082 / r\u00B2',
    finalFormulaDesc: 'Force of gravity between any two masses',
    keyInsight: 'The gravitational force between two 1 kg masses 1 m apart is just 6.67×10⁻¹¹ N — a billionth of a Newton. Gravity is by far the weakest fundamental force, yet it dominates the cosmos at large scales.',
    steps: [
      { label: 'Force Proportional to Masses', formula: 'F\u2091 \u221D m\u2081 \u00D7 m\u2082', detail: '🍎 It\'s 1666, and Isaac Newton sits under an apple tree at Woolsthorpe Manor. An apple falls — but what if the same force that pulls the apple extends to the Moon? Newton realized the gravitational force between any two masses depends on how much matter each has: F_g ∝ m₁ × m₂. Double one mass = double the pull. A 50 kg person and a 70 kg friend feel 1.4× the force of two 50 kg people.' },
      { label: 'Force Inversely Proportional to Distance\u00B2', formula: 'F\u2091 \u221D 1 / r\u00B2', detail: '📏 But as objects get farther apart, gravity weakens rapidly. Newton figured: F_g ∝ 1/r². If you double the distance, the force drops to 1/4. This inverse-square law explains why astronauts on the ISS (400 km up) feel about 90% of Earth\'s surface gravity despite appearing weightless — they\'re in free fall!' },
      { label: 'Combine Both Proportionalities', formula: 'F\u2091 \u221D (m\u2081\u00D7m\u2082) / r\u00B2', detail: '🧮 Combine both insights: F_g ∝ (m₁ × m₂)/r². The force is proportional to the product of masses divided by the square of the distance. Newton had the form — but he needed a constant to make it an equation.' },
      { label: 'Insert Gravitational Constant G', formula: 'F\u2091 = G \u00D7 (m\u2081\u00D7m\u2082) / r\u00B2', detail: '✅ F_g = G × (m₁ × m₂)/r². The constant G = 6.67×10⁻¹¹ N·m²/kg² is tiny — it took Henry Cavendish 71 years after Newton\'s death to measure it using a delicate torsion balance with lead spheres. Two 1 kg masses 1 m apart attract with just 6.67×10⁻¹¹ N — that\'s billionths of a Newton! Gravity truly is the weakest force.' },
    ],
    sliders: [
      { label: 'Mass 1 (m\u2081)', key: 'm1', min: 1, max: 100, step: 1, default: 50, unit: ' kg' },
      { label: 'Mass 2 (m\u2082)', key: 'm2', min: 1, max: 100, step: 1, default: 50, unit: ' kg' },
      { label: 'Distance (r)', key: 'r', min: 1, max: 10, step: 0.5, default: 5, unit: ' m' },
    ],
    compute: (v) => {
      const G = 6.67e-11;
      const F = G * v.m1 * v.m2 / (v.r * v.r);
      return {
        traces: [
          { label: 'F \u221D m\u2081\u00D7m\u2082 = ', value: `${v.m1}\u00D7${v.m2} = ${v.m1*v.m2}` },
          { label: 'F \u221D 1/r\u00B2 = ', value: `1/${v.r}\u00B2 = ${(1/(v.r*v.r)).toExponential(3)}` },
          { label: 'F = G\u00D7', value: `${v.m1}\u00D7${v.m2}/${v.r}\u00B2` },
        ],
        result: F.toExponential(3) + ' N'
      };
    },
    practice: {
      question: 'Two 10 kg masses are 2 m apart. Find the gravitational force between them.',
      hint: 'F = 6.67\u00D710\u207B\u00B9\u00B9 \u00D7 10 \u00D7 10 / 2\u00B2 = ?',
      answer: 1.6675e-9,
      tolerance: 1e-10,
      explanation: 'F = 1.67\u00D710\u207B\u2079 N \u2014 a tiny force! Gravity is the weakest of all fundamental forces.',
      errorHint: 'Use F = G\u00D7m\u2081\u00D7m\u2082/r\u00B2 with G = 6.67\u00D710\u207B\u00B9\u00B9'
    }
  },

  g_on_surface: {
    title: 'Derivation: g on Earth\'s Surface',
    icon: <Globe className="w-5 h-5 text-white" />,
    accentGradient: 'from-emerald-500 to-teal-600',
    accentColor: 'bg-emerald-600',
    finalFormula: 'g = G \u00D7 M_E / R_E\u00B2',
    finalFormulaDesc: 'Acceleration due to gravity on Earth\'s surface',
    keyInsight: 'A 70 kg person weighs 686 N on Earth but only 262 N on Mars — g depends only on the planet\'s mass and radius, not on the object\'s mass. This is why Galileo\'s feather and hammer fell together on the Moon.',
    steps: [
      { label: 'Weight = Gravitational Force', formula: 'm\u2092 \u00D7 g = G \u00D7 m\u2092 \u00D7 M_E / R_E\u00B2', detail: '⚖️ You step on a bathroom scale. It reads your weight mg. But why does a 70 kg person weigh 686 N? The answer lies in equating weight with Newton\'s law: mg = G × m × M_E / R_E². Your mass m appears on both sides — cancel it! This means the acceleration due to gravity doesn\'t depend on your mass at all.' },
      { label: 'Cancel Object Mass', formula: 'g = G \u00D7 M_E / R_E\u00B2', detail: '🧮 Cancel mass m: g = G × M_E / R_E². This is why Galileo\'s legendary Leaning Tower of Pisa experiment works — a feather and a hammer fall at the same rate in vacuum. Mass doesn\'t matter!' },
      { label: 'Plug in Earth Values', formula: 'g = 6.67\u00D710\u207B\u00B9\u00B9 \u00D7 5.97\u00D710\u00B2\u2074 / (6.37\u00D710\u2076)\u00B2', detail: '📐 Plug in Earth\'s values: M_E = 5.97×10²⁴ kg (about 6 sextillion tons), R_E = 6.37×10⁶ m (6370 km). G = 6.67×10⁻¹¹. Calculate: g = 6.67×10⁻¹¹ × 5.97×10²⁴ / (6.37×10⁶)² = 9.81 m/s².' },
      { label: 'Final Value', formula: 'g = 9.81 m/s\u00B2', detail: '🌍 g = 9.81 m/s². Every second in free fall, your speed increases by 9.81 m/s. But g varies: at the equator (9.78 m/s²) due to Earth\'s rotation, at the poles (9.83 m/s²) due to flattening. On Mount Everest, g is 9.79 m/s² — 0.2% less. On Mars, g is just 3.71 m/s² — you\'d weigh only 38% of your Earth weight!' },
    ],
    sliders: [
      { label: 'Earth Mass Factor', key: 'mFact', min: 0.5, max: 2, step: 0.1, default: 1, unit: '\u00D7' },
    ],
    compute: (v) => {
      const G = 6.67e-11, ME = 5.97e24 * v.mFact, RE = 6.37e6;
      const g = G * ME / (RE * RE);
      return {
        traces: [
          { label: 'M_E = ', value: `${(5.97e24 * v.mFact).toExponential(3)} kg` },
          { label: 'R_E = ', value: `6.37\u00D710\u2076 m` },
          { label: 'g = G\u00D7M_E/R_E\u00B2 = ', value: '' },
        ],
        result: g.toFixed(2) + ' m/s\u00B2'
      };
    },
    practice: {
      question: 'If Earth had twice its mass but the same radius, what would g be?',
      hint: 'g = G \u00D7 2M_E / R_E\u00B2 = 2 \u00D7 9.81 = ?',
      answer: 19.62,
      tolerance: 1,
      explanation: 'g = 19.62 m/s\u00B2! Double the mass means double the gravity.',
      errorHint: 'g is directly proportional to Earth\'s mass. g_new = 2 \u00D7 9.81'
    }
  },

  g_variation: {
    title: 'Derivation: Variation of g with Altitude',
    icon: <Globe className="w-5 h-5 text-white" />,
    accentGradient: 'from-sky-500 to-blue-600',
    accentColor: 'bg-sky-600',
    finalFormula: 'g_h = G \u00D7 M_E / (R_E + h)\u00B2',
    finalFormulaDesc: 'Gravity decreases with height above Earth\'s surface',
    keyInsight: 'Astronauts on the ISS (400 km up) still feel 89% of Earth\'s gravity — they float not because gravity is absent, but because they\'re in continuous free fall around Earth at 7.66 km/s.',
    steps: [
      { label: 'Replace R with R + h', formula: 'g_h = G \u00D7 M_E / (R_E + h)\u00B2', detail: '🏔️ You\'re climbing Mount Everest. At the summit (8,848 m), you\'d expect gravity to be weaker because you\'re farther from Earth\'s center. Indeed: g_h = G × M_E / (R_E + h)². At the top of Everest: g_h = 6.67×10⁻¹¹ × 5.97×10²⁴ / (6.37×10⁶ + 8848)² = 9.79 m/s² — just a bit less than sea level\'s 9.81.' },
      { label: 'Compare to Surface g', formula: 'g_h / g = R_E\u00B2 / (R_E + h)\u00B2', detail: '📐 Divide by surface g: g_h/g = R_E²/(R_E + h)². As h increases, the ratio drops. For small heights compared to R_E (6370 km), we can approximate using binomial expansion.' },
      { label: 'Approximation for Small h', formula: 'g_h \u2248 g(1 \u2212 2h/R_E)', detail: '🧮 For h << R_E: (1 + h/R_E)⁻² ≈ 1 − 2h/R_E. So g_h ≈ g(1 − 2h/R_E). At 10 km altitude (airliner cruising): g_h = 9.81 × (1 − 2×10/6370) = 9.81 × 0.9969 = 9.78 m/s² — only 0.3% less. That\'s why you don\'t feel noticeably lighter on a plane!' },
      { label: 'Practical Effect', formula: 'At h = 10 km: g_h = 9.78 m/s\u00B2', detail: '🛰️ At the International Space Station (h = 400 km): g_h = 9.81 × (6370)²/(6370+400)² = 8.69 m/s². That\'s 89% of surface gravity! Astronauts feel weightless NOT because gravity is gone — but because they\'re in continuous free fall around Earth, exactly like Newton\'s cannonball.' },
    ],
    sliders: [
      { label: 'Altitude (h)', key: 'h', min: 0, max: 500, step: 10, default: 100, unit: ' km' },
    ],
    compute: (v) => {
      const G = 6.67e-11, ME = 5.97e24, RE = 6.37e6;
      const hM = v.h * 1000;
      const gh = G * ME / ((RE + hM) * (RE + hM));
      const gs = G * ME / (RE * RE);
      return {
        traces: [
          { label: 'Surface g = ', value: gs.toFixed(2) + ' m/s\u00B2' },
          { label: 'R_E + h = ', value: `${(RE + hM).toExponential(3)} m` },
          { label: 'g_h = G\u00D7M_E/(R_E+h)\u00B2 = ', value: '' },
        ],
        result: gh.toFixed(3) + ' m/s\u00B2'
      };
    },
    practice: {
      question: 'What is g at the International Space Station (h = 400 km)?',
      hint: 'R_E = 6370 km. g_h = 9.81 \u00D7 (6370) \u00B2 / (6370+400) \u00B2 = ?',
      answer: 8.69,
      tolerance: 0.5,
      explanation: 'g_h \u2248 8.7 m/s\u00B2. Astronauts feel weightless NOT because g=0, but because they\'re in free fall!',
      errorHint: 'Use g_h = g \u00D7 R_E\u00B2 / (R_E + h)\u00B2 with R_E = 6370 km'
    }
  },

  orbital_velocity: {
    title: 'Derivation: Orbital Velocity of a Satellite',
    icon: <Globe className="w-5 h-5 text-white" />,
    accentGradient: 'from-violet-500 to-indigo-600',
    accentColor: 'bg-violet-600',
    finalFormula: 'v_o = \u221A(G \u00D7 M_E / r)',
    finalFormulaDesc: 'Minimum velocity to stay in circular orbit',
    keyInsight: 'The ISS orbits at 7.66 km/s, completing one lap every 90 minutes — astronauts see 16 sunrises and sunsets every 24 hours. At this speed, Earth\'s gravity provides exactly the centripetal force needed.',
    steps: [
      { label: 'Centripetal = Gravitational Force', formula: 'm v_o\u00B2 / r = G m M_E / r\u00B2', detail: '🚀 You\'re a SpaceX engineer preparing a Falcon 9 launch. The satellite needs to reach Low Earth Orbit. But how fast must it go? For a satellite in circular orbit, the centripetal force (mv²/r) must exactly equal the gravitational force (GMm/r²). If it\'s too slow, it falls back to Earth. Too fast, it flies away.' },
      { label: 'Cancel Satellite Mass m', formula: 'v_o\u00B2 / r = G M_E / r\u00B2', detail: '🧮 Set mv²/r = GMm/r². The satellite\'s mass m cancels out completely — orbital velocity doesn\'t depend on the satellite\'s mass! A tiny CubeSat and a massive ISS need the same speed at the same altitude. Cancel m: v²/r = GM/r².' },
      { label: 'Solve for v_o', formula: 'v_o\u00B2 = G M_E / r', detail: '📐 Multiply by r: v² = GM/r. For low Earth orbit (r = 6,570 km, just 200 km above surface): v² = 6.67×10⁻¹¹ × 5.97×10²⁴ / 6.57×10⁶ = 60.6×10⁶. v = √(60.6×10⁶) = 7,790 m/s ≈ 7.8 km/s.' },
      { label: 'Take Square Root', formula: 'v_o = \u221A(G M_E / r)', detail: '✅ v_o = √(GM/r). At the surface (r = R_E): v_o = √(GM/R_E) = √(gR_E) ≈ 7.9 km/s ≈ 28,000 km/h. That\'s Mach 23! The ISS orbits at about 7.66 km/s, completing one lap around Earth every 90 minutes. In 24 hours, astronauts see 16 sunrises and sunsets!' },
    ],
    sliders: [
      { label: 'Orbit Radius (r)', key: 'r', min: 6600, max: 42000, step: 100, default: 7000, unit: ' km' },
    ],
    compute: (v) => {
      const G = 6.67e-11, ME = 5.97e24;
      const rM = v.r * 1000;
      const vo = Math.sqrt(G * ME / rM);
      return {
        traces: [
          { label: 'r = ', value: `${v.r} km = ${rM.toExponential(3)} m` },
          { label: 'G\u00D7M_E = ', value: `6.67e-11\u00D75.97e24 = ${(G*ME).toExponential(3)}` },
          { label: 'v_o\u00B2 = G\u00D7M_E/r = ', value: '' },
        ],
        result: (vo/1000).toFixed(2) + ' km/s'
      };
    },
    practice: {
      question: 'Find orbital velocity at r = 7000 km from Earth\'s center (ME = 5.97\u00D710\u00B2\u2074 kg, G = 6.67\u00D710\u207B\u00B9\u00B9).',
      hint: 'v_o = \u221A(6.67\u00D710\u207B\u00B9\u00B9 \u00D7 5.97\u00D710\u00B2\u2074 / 7\u00D710\u2076) = ?',
      answer: 7540,
      tolerance: 500,
      explanation: 'v_o \u2248 7.54 km/s! That\'s about 27,000 km/h \u2014 fast enough to orbit Earth in ~90 minutes.',
      errorHint: 'Use v_o = \u221A(G\u00D7M_E/r). Convert km to m first: r = 7\u00D710\u2076 m.'
    }
  },

  geostationary: {
    title: 'Derivation: Geostationary Orbit Radius',
    icon: <Globe className="w-5 h-5 text-white" />,
    accentGradient: 'from-cyan-500 to-sky-600',
    accentColor: 'bg-cyan-600',
    finalFormula: 'r = (G\u00D7M_E\u00D7T\u00B2 / 4\u03C0\u00B2)^(1/3)',
    finalFormulaDesc: 'Radius at which satellite orbits at same rate as Earth rotates',
    keyInsight: 'Satellite TV dishes never need to move because geostationary satellites orbit at 35,786 km — exactly where the orbital period matches Earth\'s 24-hour rotation. Just 3 satellites can cover the entire globe.',
    steps: [
      { label: 'Orbital Velocity Formula', formula: 'v_o = \u221A(G M_E / r)', detail: '📡 You\'re designing a communications satellite for satellite TV. It needs to stay fixed above the same point on Earth so your dish never has to move. This requires a geostationary orbit — the satellite\'s orbital period must equal Earth\'s rotation period: 24 hours exactly.' },
      { label: 'Orbital Period Formula', formula: 'v_o = 2\u03C0r / T', detail: '📐 Orbital speed: v = 2πr/T (circumference ÷ period). For geostationary, T = 86,400 s (24 hours). From orbital velocity: v = √(GM/r). Set them equal: 2πr/T = √(GM/r).' },
      { label: 'Equate Both Expressions', formula: '2\u03C0r/T = \u221A(G M_E / r)', detail: '🧮 Square both sides: 4π²r²/T² = GM/r. Multiply by r: 4π²r³/T² = GM. So r³ = GMT²/4π². The cube of the radius is proportional to the square of the period — Kepler\'s Third Law!' },
      { label: 'Solve for r', formula: 'r\u00B3 = G M_E T\u00B2 / 4\u03C0\u00B2', detail: '✅ r = (GMT²/4π²)^(1/3). Plugging in: r = (6.67×10⁻¹¹ × 5.97×10²⁴ × 86400² / 4π²)^(1/3) = 42,164 km from Earth\'s center. Subtract R_E = 6,370 km: height = 35,786 km above the surface. At this altitude, the satellite covers about 1/3 of Earth\'s surface — just 3 satellites can cover the entire globe!' },
    ],
    sliders: [
      { label: 'Orbital Period (T)', key: 'T', min: 12, max: 48, step: 1, default: 24, unit: ' h' },
    ],
    compute: (v) => {
      const G = 6.67e-11, ME = 5.97e24;
      const Ts = v.T * 3600;
      const r = Math.cbrt(G * ME * Ts * Ts / (4 * Math.PI * Math.PI));
      return {
        traces: [
          { label: 'T = ', value: `${v.T} h = ${Ts.toExponential(3)} s` },
          { label: 'G\u00D7M_E\u00D7T\u00B2 = ', value: `${(G*ME*Ts*Ts).toExponential(3)}` },
          { label: '4\u03C0\u00B2 = ', value: `${(4*Math.PI*Math.PI).toFixed(1)}` },
        ],
        result: (r/1000).toFixed(0) + ' km from center'
      };
    },
    practice: {
      question: 'Calculate the geostationary orbit radius (T = 86400 s).',
      hint: 'r = (6.67e-11 \u00D7 5.97e24 \u00D7 86400\u00B2 / 4\u03C0\u00B2)^(1/3)',
      answer: 42164,
      tolerance: 1000,
      explanation: 'r \u2248 42,164 km from Earth\'s center (about 35,786 km above the surface). Used for communication satellites!',
      errorHint: 'Use r = (G\u00D7M_E\u00D7T\u00B2/4\u03C0\u00B2)^(1/3). T must be in seconds.'
    }
  },

  absolute_gpe: {
    title: 'Derivation: Absolute Gravitational Potential Energy',
    icon: <Globe className="w-5 h-5 text-white" />,
    accentGradient: 'from-teal-500 to-emerald-600',
    accentColor: 'bg-teal-600',
    finalFormula: 'U = \u2212G\u00D7M_E\u00D7m / r',
    finalFormulaDesc: 'Gravitational potential energy is always negative',
    keyInsight: 'A 1000 kg satellite at 7000 km has −5.69×10¹⁰ J of gravitational PE — it needs that much kinetic energy to escape Earth. This is why reaching escape velocity (11.2 km/s) is far harder than orbital velocity (7.9 km/s).',
    steps: [
      { label: 'Work Against Gravity', formula: 'W = F_av \u00D7 \u0394r', detail: '🌍 You\'re calculating how much energy is needed to launch a rocket to infinity — to escape Earth\'s gravity completely. But there\'s a catch: gravity weakens with distance (1/r²), so the force isn\'t constant. You can\'t just use W = Fd. You need calculus to sum up the work over an infinite path.' },
      { label: 'Integrate from R to \u221E', formula: 'U = \u222B_R^\u221E G M_E m / r\u00B2 dr', detail: '📐 The work done against gravity from Earth\'s surface R to infinity is the integral: U = ∫ₚ^∞ (GMm/r²) dr. This integral sums up the tiny bits of work at each distance, where the force gets weaker and weaker the farther you go.' },
      { label: 'Evaluate the Integral', formula: 'U = \u2212G M_E m / r', detail: '🧮 The integral of 1/r² is −1/r. Evaluating from R to ∞: U = [−GMm/r]ₚ^∞ = (−GMm/∞) − (−GMm/R) = 0 + GMm/R = −GMm/R. Wait — the reference point matters. We define U = 0 at infinity (where gravity is negligible). So at Earth\'s surface, U = −GMm/R. The negative sign means you\'re bound!' },
      { label: 'Physical Meaning', formula: 'U < 0 means bound system', detail: '✅ U = −GMm/r. A satellite at r = 7,000 km: U = −6.67×10⁻¹¹ × 5.97×10²⁴ × 1000 / 7×10⁶ = −5.69×10¹⁰ J. The negative value means it\'s gravitationally bound — you need to ADD 5.69×10¹⁰ J of kinetic energy to make U = 0 (escape). This is why reaching escape velocity (11.2 km/s) is so much harder than orbital velocity (7.9 km/s)!' },
    ],
    sliders: [
      { label: 'Distance from Center (r)', key: 'r', min: 6400, max: 50000, step: 100, default: 6370, unit: ' km' },
    ],
    compute: (v) => {
      const G = 6.67e-11, ME = 5.97e24, m = 1000;
      const rM = v.r * 1000;
      const U = -G * ME * m / rM;
      return {
        traces: [
          { label: 'r = ', value: `${v.r} km = ${rM.toExponential(3)} m` },
          { label: 'G\u00D7M_E\u00D7m = ', value: `${(G*ME*m).toExponential(3)}` },
          { label: 'U = \u2212G\u00D7M_E\u00D7m/r = ', value: '' },
        ],
        result: U.toExponential(3) + ' J'
      };
    },
    practice: {
      question: 'A 1000 kg satellite is at r = 7000 km from Earth\'s center. Find its gravitational PE.',
      hint: 'U = \u22126.67e-11 \u00D7 5.97e24 \u00D7 1000 / 7e6',
      answer: -5.69e10,
      tolerance: 1e9,
      explanation: 'U \u2248 \u22125.7\u00D710\u00B9\u2070 J. The negative sign means the satellite is gravitationally bound to Earth.',
      errorHint: 'U = \u2212G\u00D7M_E\u00D7m/r. r must be in meters (7\u00D710\u2076 m).'
    }
  },

  gravitational_potential: {
    title: 'Derivation: Gravitational Potential',
    icon: <Globe className="w-5 h-5 text-white" />,
    accentGradient: 'from-blue-500 to-indigo-600',
    accentColor: 'bg-blue-600',
    finalFormula: 'V = \u2212G\u00D7M_E / r',
    finalFormulaDesc: 'Gravitational potential = potential energy per unit mass',
    keyInsight: 'To escape Earth, each kilogram of you needs 62.5 MJ of energy — that\'s the energy in 1.5 liters of gasoline. A black hole\'s potential well is 700 million times deeper, which is why not even light can escape.',
    steps: [
      { label: 'Definition of Potential', formula: 'V = U / m', detail: '🕳️ You\'re studying black holes — regions where gravity is so intense that nothing, not even light, can escape. Gravitational potential V = U/m tells you the \'gravitational energy per kilogram\' at any point in space, independent of the test mass.' },
      { label: 'Substitute U = \u2212GMM_E/r', formula: 'V = (\u2212G M_E m / r) / m', detail: '📐 By definition: V = U/m. Substitute U = −GMm/r. The mass m cancels: V = (−GMm/r)/m = −GM/r. Potential depends only on Earth\'s mass and distance, not on the object you\'re considering.' },
      { label: 'Simplify', formula: 'V = \u2212G M_E / r', detail: '🧮 At Earth\'s surface: V = −6.67×10⁻¹¹ × 5.97×10²⁴ / 6.37×10⁶ = −62.5×10⁶ J/kg = −62.5 MJ/kg. Every kilogram of you has −62.5 MJ of gravitational potential energy relative to infinity. To escape Earth, each kg needs 62.5 MJ of kinetic energy — that\'s the energy in 1.5 liters of gasoline!' },
      { label: 'Potential Difference', formula: '\u0394V = V\u2082 \u2212 V\u2081', detail: '⚫ The potential well near a black hole is incredibly deep. For a black hole with mass 10× the Sun, at its event horizon (r = 30 km): V = −GM/r = −6.67×10⁻¹¹ × 2×10³¹ / 30000 = −4.4×10¹⁶ J/kg. That\'s 700 million times deeper than Earth\'s well! No wonder light can\'t escape.' },
    ],
    sliders: [
      { label: 'Distance from Center (r)', key: 'r', min: 6400, max: 50000, step: 100, default: 6370, unit: ' km' },
    ],
    compute: (v) => {
      const G = 6.67e-11, ME = 5.97e24;
      const rM = v.r * 1000;
      const V = -G * ME / rM;
      return {
        traces: [
          { label: 'r = ', value: `${v.r} km` },
          { label: 'V = \u2212G\u00D7M_E/r = ', value: '' },
        ],
        result: (V/1e6).toFixed(2) + ' MJ/kg'
      };
    },
    practice: {
      question: 'Calculate gravitational potential at Earth\'s surface (R = 6370 km).',
      hint: 'V = \u22126.67e-11 \u00D7 5.97e24 / 6.37e6 = ?',
      answer: -62.5e6,
      tolerance: 5e6,
      explanation: 'V \u2248 \u221262.5 MJ/kg. This is the energy per kg needed to escape Earth\'s gravity from the surface.',
      errorHint: 'V = \u2212G\u00D7M_E/r. r must be in meters (6.37\u00D710\u2076 m).'
    }
  },

  // === Unit 16: Statistical Mechanics ===
  ideal_gas_pressure: {
    title: 'Derivation: Pressure of an Ideal Gas',
    icon: <Thermometer className="w-5 h-5 text-white" />,
    accentGradient: 'from-red-500 to-orange-600',
    accentColor: 'bg-red-600',
    finalFormula: 'P = (1/3) \u00D7 \u03C1 \u00D7 <v\u00B2>',
    finalFormulaDesc: 'Gas pressure from molecular collisions with walls',
    keyInsight: 'Each square centimeter of a bicycle tire wall is struck by 2.5×10²³ molecules per second — 250 billion billion impacts every second, which is what we feel as 2 atmospheres of pressure.',
    steps: [
      { label: 'Momentum Change per Collision', formula: '\u0394p = \u22122mv_x', detail: '🚲 You\'re pumping up a bicycle tire. With each pump stroke, you compress more air molecules into the tire, and the pressure increases. But what is pressure, really? It\'s the collective effect of billions of trillions of gas molecules slamming into the tire walls billions of times per second!' },
      { label: 'Force from One Molecule', formula: 'F = \u0394p / \u0394t = 2mv_x / (2L/v_x)', detail: '📐 When a molecule of mass m hits the wall with x-velocity v_x, it bounces back with −v_x. Momentum change per collision: Δp = −2mv_x. The force from one molecule = Δp/Δt. Time between hits on the same wall: Δt = 2L/v_x. So F_one = mv_x²/L.' },
      { label: 'Sum Over All Molecules', formula: 'F_total = m/L \u00D7 \u03A3(v_x\u00B2)', detail: '🧮 Summing over all N molecules: F_total = (m/L) × Σv_x². Since motion is random, <v_x²> = <v_y²> = <v_z²> = <v²>/3. So Σv_x² = N<v²>/3. Total force F = (Nm<v²>)/(3L). Pressure P = F/A = (Nm<v²>)/(3LA) = (Nm<v²>)/(3V).' },
      { label: 'Pressure = Force/Area', formula: 'P = \\frac{1}{3} (N/V) m <v\u00B2> = \\frac{1}{3} \u03C1 <v\u00B2>', detail: '✅ P = (1/3)(N/V)m<v²> = (1/3)ρ<v²>. For air at sea level (ρ = 1.2 kg/m³, <v²> = (483 m/s)²): P = (1/3)×1.2×233,000 = 93,200 Pa ≈ 0.92 atm. Close to 1 atm! Each square centimeter of your tire wall is struck by about 2.5×10²³ molecules per second. That\'s 250 billion billion impacts — every single second!' },
    ],
    sliders: [
      { label: 'Number of Molecules (N)', key: 'N', min: 1e23, max: 1e25, step: 1e23, default: 2.5e24, unit: '' },
      { label: 'Average Speed Squared (<v\u00B2>)', key: 'vsq', min: 1e5, max: 1e6, step: 1e4, default: 5e5, unit: ' m\u00B2/s\u00B2' },
    ],
    compute: (v) => {
      const m = 4.65e-26, V = 0.0224;
      const rho = v.N * m / V;
      const P = (1/3) * rho * v.vsq;
      return {
        traces: [
          { label: '\u03C1 = N\u00D7m/V = ', value: `${rho.toExponential(3)} kg/m\u00B3` },
          { label: 'P = (1/3)\u00D7\u03C1\u00D7<v\u00B2> = ', value: `${(1/3)}\u00D7${rho.toExponential(3)}\u00D7${v.vsq.toExponential(3)}` },
        ],
        result: P.toExponential(3) + ' Pa'
      };
    },
    practice: {
      question: 'If <v\u00B2> = 5\u00D710\u2075 m\u00B2/s\u00B2 and \u03C1 = 1.2 kg/m\u00B3, find the gas pressure.',
      hint: 'P = (1/3) \u00D7 1.2 \u00D7 5\u00D710\u2075 = ?',
      answer: 200000,
      tolerance: 20000,
      explanation: 'P = 200,000 Pa \u2248 2 atm. This is the kinetic theory derivation of gas pressure!',
      errorHint: 'P = (1/3)\u00D7\u03C1\u00D7<v\u00B2> = (1/3)\u00D71.2\u00D75e5'
    }
  },

  pressure_ke: {
    title: 'Derivation: Pressure and Kinetic Energy',
    icon: <Thermometer className="w-5 h-5 text-white" />,
    accentGradient: 'from-orange-500 to-amber-600',
    accentColor: 'bg-orange-600',
    finalFormula: 'P = (2/3) \u00D7 N \u00D7 KE_avg / V',
    finalFormulaDesc: 'Gas pressure is proportional to average kinetic energy per molecule',
    keyInsight: 'In a pressure cooker, heating increases molecular KE, which directly raises pressure — the safety valve is critical because at 120°C the pressure is 2 atm, enough to burst a sealed container.',
    steps: [
      { label: 'Start with Pressure Formula', formula: 'P = \\frac{1}{3} N m <v\u00B2> / V', detail: '🍲 You\'re cooking with a pressure cooker. The lid seals tight, trapping steam inside. The pressure builds up because the gas molecules are moving faster (heated) in the same volume. Let\'s connect pressure to the microscopic kinetic energy of individual molecules.' },
      { label: 'Multiply and Divide by 2', formula: 'P = \\frac{2}{3} (N/V) \\frac{1}{2} m <v\u00B2>', detail: '📐 From kinetic theory: P = (1/3)(N/V)m<v²>. Multiply and divide by 2: P = (2/3)(N/V)×(½)m<v²>. The term (½)m<v²> is the average translational kinetic energy per molecule!' },
      { label: 'Recognize Translational KE', formula: 'P = \\frac{2}{3} (N/V) \u00D7 KE_avg', detail: '🧮 P = (2/3)(N/V)×KE_avg. Pressure is directly proportional to both the number density of molecules and their average kinetic energy. In a pressure cooker, as you heat the contents, KE_avg increases, so pressure rises — that\'s why the safety valve is critical!' },
      { label: 'Final Relation', formula: 'P \u221D \\frac{2}{3} \u00D7 n \u00D7 KE_avg', detail: '✅ P ∝ (2/3) × (number density) × KE_avg. At room temperature (KE_avg = 6.2×10⁻²¹ J, N/V = 2.5×10²⁵ m⁻³): P = (2/3)×2.5×10²⁵×6.2×10⁻²¹ = 103,000 Pa ≈ 1 atm. The pressure doubles if you double either the density or the temperature!' },
    ],
    sliders: [
      { label: 'Avg KE per Molecule', key: 'ke', min: 1e-21, max: 1e-20, step: 1e-22, default: 6.2e-21, unit: ' J' },
      { label: 'Number Density (N/V)', key: 'nd', min: 1e25, max: 1e27, step: 1e25, default: 2.5e25, unit: ' m\u207B\u00B3' },
    ],
    compute: (v) => {
      const P = (2/3) * v.nd * v.ke;
      return {
        traces: [
          { label: 'P = (2/3)\u00D7N/V\u00D7KE_avg = ', value: `${(2/3)}\u00D7${v.nd.toExponential(3)}\u00D7${v.ke.toExponential(3)}` },
        ],
        result: P.toExponential(3) + ' Pa'
      };
    },
    practice: {
      question: 'If KE_avg = 6.2\u00D710\u207B\u00B2\u00B9 J, N/V = 2.5\u00D710\u00B2\u2075 m\u207B\u00B3, find P.',
      hint: 'P = (2/3) \u00D7 2.5e25 \u00D7 6.2e-21 = ?',
      answer: 103333,
      tolerance: 15000,
      explanation: 'P \u2248 103,000 Pa \u2248 1 atm. Room temperature gas!',
      errorHint: 'P = (2/3) \u00D7 (N/V) \u00D7 KE_avg'
    }
  },

  temperature_ke: {
    title: 'Derivation: Temperature and Kinetic Energy',
    icon: <Thermometer className="w-5 h-5 text-white" />,
    accentGradient: 'from-amber-500 to-yellow-600',
    accentColor: 'bg-amber-600',
    finalFormula: 'KE_avg = (3/2) kT',
    finalFormulaDesc: 'Absolute temperature is proportional to average KE per molecule',
    keyInsight: 'At absolute zero (0 K), all molecular motion stops — but you can never reach it because extracting the last bit of kinetic energy requires infinite work. The coldest lab temperature achieved is 100 pK.',
    steps: [
      { label: 'Ideal Gas Law', formula: 'PV = NkT', detail: '🌡️ You\'re checking a fever with a thermometer. Mercury rises — but what does temperature really measure at the molecular level? The ideal gas law PV = NkT relates macroscopic pressure/volume/temperature. Combine this with the microscopic kinetic theory result PV = (2/3)N×KE_avg.' },
      { label: 'Kinetic Theory Pressure', formula: 'PV = \\frac{2}{3} N KE_avg', detail: '📐 PV from ideal gas law: PV = NkT. PV from kinetic theory: PV = (2/3)N×KE_avg. Here k = 1.38×10⁻²³ J/K is Boltzmann\'s constant — it connects the macroscopic world (temperature) to the microscopic world (molecular energy).' },
      { label: 'Equate Both Expressions', formula: 'NkT = \\frac{2}{3} N KE_avg', detail: '🧮 Equate: NkT = (2/3)N×KE_avg. The number N cancels! Temperature is directly proportional to average kinetic energy per molecule, independent of how many molecules there are.' },
      { label: 'Solve for KE_avg', formula: 'KE_avg = \\frac{3}{2} kT', detail: '✅ KE_avg = (3/2)kT. At 300 K (room temp): KE_avg = (3/2)×1.38×10⁻²³×300 = 6.21×10⁻²¹ J. At 0 K (−273°C), all molecular motion stops — absolute zero! This is why you can\'t reach absolute zero: to extract that last bit of kinetic energy would require infinite work. The coldest temperature ever achieved in a lab is about 100 pK (picokelvin)!' },
    ],
    sliders: [
      { label: 'Temperature (T)', key: 'T', min: 50, max: 500, step: 10, default: 300, unit: ' K' },
    ],
    compute: (v) => {
      const k = 1.38e-23;
      const KE = (3/2) * k * v.T;
      return {
        traces: [
          { label: 'T = ', value: `${v.T} K` },
          { label: 'KE = (3/2)\u00D7k\u00D7T = ', value: `${(3/2)}\u00D7${k.toExponential(3)}\u00D7${v.T}` },
        ],
        result: KE.toExponential(3) + ' J'
      };
    },
    practice: {
      question: 'What is the average KE of a gas molecule at 300 K? (k = 1.38\u00D710\u207B\u00B2\u00B3 J/K)',
      hint: 'KE = (3/2) \u00D7 1.38e-23 \u00D7 300 = ?',
      answer: 6.21e-21,
      tolerance: 1e-21,
      explanation: 'KE = 6.21\u00D710\u207B\u00B2\u00B9 J. This tiny energy per molecule adds up to macroscopic pressure!',
      errorHint: 'KE = (3/2)kT = 1.5 \u00D7 1.38e-23 \u00D7 300'
    }
  },

  rms_speed: {
    title: 'Derivation: Root Mean Square Speed',
    icon: <Thermometer className="w-5 h-5 text-white" />,
    accentGradient: 'from-yellow-500 to-amber-600',
    accentColor: 'bg-yellow-600',
    finalFormula: 'v_rms = \u221A(3kT / m)',
    finalFormulaDesc: 'RMS speed of gas molecules from temperature and mass',
    keyInsight: 'Oxygen molecules zip around at 483 m/s (1,740 km/h) at room temperature — faster than a jet fighter! But they collide 7 billion times per second, which is why smells take seconds, not milliseconds, to cross a room.',
    steps: [
      { label: 'Start with KE-Temperature Relation', formula: '\\frac{1}{2} m <v\u00B2> = \\frac{3}{2} kT', detail: '👃 You walk into a room and smell freshly baked bread. The aroma molecules travel from the kitchen to your nose — but how fast are individual molecules actually moving? Start with KE_avg = (3/2)kT = (½)m<v²>. This relates temperature to molecular motion.' },
      { label: 'Solve for <v\u00B2>', formula: '<v\u00B2> = 3kT / m', detail: '📐 Solve for mean square speed: <v²> = 3kT/m. The mean square speed is 3kT divided by molecular mass. Lighter molecules move faster at the same temperature. Hydrogen (H₂) molecules at room temperature have about 16× the mean square speed of oxygen (O₂)!' },
      { label: 'Take Square Root', formula: 'v_rms = \u221A(3kT / m)', detail: '🧮 RMS speed v_rms = √(3kT/m). For oxygen (m = 5.3×10⁻²⁶ kg) at 300 K: v_rms = √(3×1.38×10⁻²³×300/5.3×10⁻²⁶) = √(2.34×10⁵) = 483 m/s.' },
      { label: 'Using Molar Mass', formula: 'v_rms = \u221A(3RT / M)', detail: '✅ v_rms = √(3kT/m) = √(3RT/M). Oxygen molecules zip around at 483 m/s = 1,740 km/h — faster than a jet fighter! But they don\'t travel far in a straight line; they collide with other molecules about 7 billion times per second, each collision changing direction. This zigzag path (diffusion) is why smell takes seconds to cross a room, not milliseconds.' },
    ],
    sliders: [
      { label: 'Temperature (T)', key: 'T', min: 100, max: 1000, step: 10, default: 300, unit: ' K' },
      { label: 'Molecular Mass (m)', key: 'mMass', min: 2e-26, max: 1e-25, step: 1e-27, default: 5.3e-26, unit: ' kg' },
    ],
    compute: (v) => {
      const k = 1.38e-23;
      const vrms = Math.sqrt(3 * k * v.T / v.mMass);
      return {
        traces: [
          { label: 'T = ', value: `${v.T} K` },
          { label: 'm = ', value: `${v.mMass.toExponential(3)} kg` },
          { label: 'v_rms = \u221A(3kT/m) = ', value: '' },
        ],
        result: vrms.toFixed(0) + ' m/s'
      };
    },
    practice: {
      question: 'Find v_rms for N\u2082 at 300 K (m = 4.65\u00D710\u207B\u00B2\u2076 kg, k = 1.38\u00D710\u207B\u00B2\u00B3 J/K).',
      hint: 'v_rms = \u221A(3 \u00D7 1.38e-23 \u00D7 300 / 4.65e-26) = ?',
      answer: 517,
      tolerance: 50,
      explanation: 'v_rms \u2248 517 m/s! That\'s faster than the speed of sound (343 m/s).',
      errorHint: 'v_rms = \u221A(3kT/m). Use k = 1.38e-23.'
    }
  },

  // === Unit 17: SHM ===
  shm_mass_spring: {
    title: 'Derivation: Mass-Spring System (SHM)',
    icon: <Activity className="w-5 h-5 text-white" />,
    accentGradient: 'from-green-500 to-emerald-600',
    accentColor: 'bg-green-600',
    finalFormula: '\u03C9 = \u221A(k/m), T = 2\u03C0\u221A(m/k)',
    finalFormulaDesc: 'Angular frequency and period of a mass-spring oscillator',
    keyInsight: 'Your car suspension uses springs with k≈40,000 N/m total, giving a bounce period of about 1 second. Race cars use stiffer springs for sharper handling — that\'s why they feel harsh on bumps.',
    steps: [
      { label: 'Hooke\'s Law', formula: 'F = \u2212kx', detail: '🚗 Your car hits a bump and the suspension bounces. The spring pushes back with a force proportional to how much it\'s compressed — Hooke\'s Law: F = −kx. The negative sign means the force always pushes toward equilibrium. This restoring force is the heart of Simple Harmonic Motion.' },
      { label: 'Newton\'s Second Law', formula: 'ma = \u2212kx', detail: '📐 Newton\'s Second Law: F = ma. So ma = −kx. But for SHM, acceleration is proportional to displacement in the opposite direction: a = −ω²x (ω is angular frequency). Substitute: m(−ω²x) = −kx.' },
      { label: 'Compare to SHM Definition', formula: '\u2212\u03C9\u00B2x = \u2212(k/m)x', detail: '🧮 Cancel −x from both sides: mω² = k, so ω² = k/m. The angular frequency depends on the spring constant and mass. A stiffer spring (higher k) = faster oscillation. A heavier mass = slower oscillation. ω = √(k/m).' },
      { label: 'Solve for \u03C9 and T', formula: '\u03C9 = \u221A(k/m), T = 2\u03C0\u221A(m/k)', detail: '✅ ω = √(k/m), T = 2π√(m/k). For a car with 1000 kg on springs with k = 40,000 N/m total: ω = √(40000/1000) = 6.32 rad/s, T = 2π/6.32 = 0.99 s. Your car bounces about once per second. Race cars use stiffer springs (higher k) for better handling — that\'s why they feel harsh on bumpy roads!' },
    ],
    sliders: [
      { label: 'Spring Constant (k)', key: 'k', min: 10, max: 200, step: 5, default: 100, unit: ' N/m' },
      { label: 'Mass (m)', key: 'm', min: 0.1, max: 5, step: 0.1, default: 1, unit: ' kg' },
    ],
    compute: (v) => {
      const omega = Math.sqrt(v.k / v.m);
      const T = 2 * Math.PI / omega;
      return {
        traces: [
          { label: '\u03C9 = \u221A(k/m) = \u221A(', value: `${v.k}/${v.m}) = ${omega.toFixed(2)} rad/s` },
          { label: 'T = 2\u03C0/\u03C9 = 2\u03C0/', value: `${omega.toFixed(2)} = ${T.toFixed(3)} s` },
        ],
        result: `T = ${T.toFixed(3)} s, \u03C9 = ${omega.toFixed(2)} rad/s`
      };
    },
    practice: {
      question: 'A mass m = 0.5 kg is attached to a spring with k = 50 N/m. Find the time period.',
      hint: 'T = 2\u03C0 \u00D7 \u221A(0.5/50) = ?',
      answer: 0.628,
      tolerance: 0.1,
      explanation: 'T = 0.628 s. The mass oscillates about 1.6 times per second.',
      errorHint: 'T = 2\u03C0\u221A(m/k) = 2\u03C0\u221A(0.5/50)'
    }
  },

  shm_displacement: {
    title: 'Derivation: SHM Displacement, Velocity, Acceleration',
    icon: <Activity className="w-5 h-5 text-white" />,
    accentGradient: 'from-emerald-500 to-teal-600',
    accentColor: 'bg-emerald-600',
    finalFormula: 'x = x_o cos(\u03C9t), v = \u03C9\u221A(x_o\u00B2\u2212x\u00B2), a = \u2212\u03C9\u00B2x',
    finalFormulaDesc: 'Kinematics of simple harmonic motion',
    keyInsight: 'Earthquakes cause buildings to oscillate in SHM — engineers tune a building\'s natural frequency away from typical earthquake frequencies (0.5-5 Hz) to prevent resonant collapse.',
    steps: [
      { label: 'Projection of Circular Motion', formula: 'x = x_o cos(\u03B8) = x_o cos(\u03C9t)', detail: '🎵 A metronome ticks back and forth, marking time for a pianist. Its motion is SHM — the projection of uniform circular motion onto a diameter. Imagine a point moving around a circle at constant angular speed ω. Its x-coordinate traces out a cosine wave over time.' },
      { label: 'Velocity from Derivative', formula: 'v = \u2212\u03C9 x_o sin(\u03C9t) = \u2212\u03C9\u221A(x_o\u00B2 \u2212 x\u00B2)', detail: '📐 Displacement: x = x₀ cos(ωt). At t = 0, x = x₀ (fully right). At t = π/(2ω), x = 0 (center). At t = π/ω, x = −x₀ (fully left). Velocity is the derivative: v = −ωx₀ sin(ωt). Using sin² + cos² = 1: v = ±ω√(x₀² − x²). At the center, speed is maximum. At extremes, speed is zero.' },
      { label: 'Acceleration from Derivative', formula: 'a = \u2212\u03C9\u00B2 x_o cos(\u03C9t) = \u2212\u03C9\u00B2x', detail: '📐 Acceleration is the derivative of velocity: a = −ω²x₀ cos(ωt) = −ω²x. This is the hallmark of SHM — acceleration is always proportional to displacement and opposite in direction. At the extremes, acceleration is maximum. At center, acceleration is zero.' },
      { label: 'Key SHM Property', formula: 'a = \u2212\u03C9\u00B2x', detail: '✅ x = x₀ cos(ωt), v = ±ω√(x₀²−x²), a = −ω²x. For a metronome with ω = 2π rad/s and x₀ = 0.1 m: at t = 0.2 s, x = 0.1×cos(2π×0.2) = 0.1×cos(72°) = 0.031 m, v = −2π×0.1×sin(72°) = −0.6 m/s, a = −(2π)²×0.031 = −1.22 m/s². This simple pattern describes everything from guitar strings to swaying buildings!' },
    ],
    sliders: [
      { label: 'Amplitude (x_o)', key: 'xo', min: 0.1, max: 2, step: 0.1, default: 1, unit: ' m' },
      { label: 'Angular Freq (\u03C9)', key: 'omega', min: 1, max: 10, step: 0.5, default: 5, unit: ' rad/s' },
      { label: 'Time (t)', key: 't', min: 0, max: 3, step: 0.1, default: 0.5, unit: ' s' },
    ],
    compute: (v) => {
      const x = v.xo * Math.cos(v.omega * v.t);
      const vel = -v.omega * v.xo * Math.sin(v.omega * v.t);
      const acc = -v.omega * v.omega * x;
      return {
        traces: [
          { label: 'x = x_o cos(\u03C9t) = ', value: `${v.xo}\u00D7cos(${v.omega}\u00D7${v.t})` },
          { label: 'v = \u2212\u03C9 x_o sin(\u03C9t) = ', value: '' },
          { label: 'a = \u2212\u03C9\u00B2x = ', value: '' },
        ],
        result: `x=${x.toFixed(3)}m, v=${vel.toFixed(3)}m/s, a=${acc.toFixed(3)}m/s\u00B2`
      };
    },
    practice: {
      question: 'At t = 0.5 s, x_o = 1 m, \u03C9 = 5 rad/s. Find the displacement x.',
      hint: 'x = 1 \u00D7 cos(5 \u00D7 0.5) = cos(2.5) = ?',
      answer: -0.801,
      tolerance: 0.1,
      explanation: 'x = -0.80 m. The mass is on the opposite side of equilibrium!',
      errorHint: 'x = x_o cos(\u03C9t). Make sure calculator is in radians mode.'
    }
  },

  simple_pendulum: {
    title: 'Derivation: Time Period of a Simple Pendulum',
    icon: <Activity className="w-5 h-5 text-white" />,
    accentGradient: 'from-teal-500 to-cyan-600',
    accentColor: 'bg-teal-600',
    finalFormula: 'T = 2\u03C0 \u221A(l / g)',
    finalFormulaDesc: 'Period of a simple pendulum depends only on length and gravity',
    keyInsight: 'Grandfather clocks use a ~1 m pendulum because it swings exactly once per second. On the Moon, the same pendulum would take 4.93 s — 2.5× slower due to the Moon\'s weaker gravity.',
    steps: [
      { label: 'Restoring Force on Bob', formula: 'F = \u2212mg sin\u03B8', detail: '🕰️ You\'re watching a grandfather clock. The pendulum swings majestically — and it keeps near-perfect time because its period doesn\'t depend on how wide it swings (for small angles). Galileo supposedly discovered this watching a swinging chandelier in Pisa Cathedral, timing it with his pulse.' },
      { label: 'Small Angle Approximation', formula: 'F \u2248 \u2212mg \u03B8 = \u2212mg (x/l)', detail: '📐 The restoring force is the component of gravity along the arc: F = −mg sin θ. For small angles (θ < 15°), sin θ ≈ θ. And arc length x = Lθ, so θ = x/L. Therefore F ≈ −mg(x/L) = −(mg/L)x. The force is proportional to displacement — SHM!' },
      { label: 'Apply Newton\'s Second Law', formula: 'ma = \u2212(mg/l) \\times \u21D2 a = \u2212(g/l) x', detail: '🧮 Using F = ma: ma = −(mg/L)x. The mass m cancels! a = −(g/L)x. Comparing with a = −ω²x: ω² = g/L. The period depends only on length and gravity — not on mass or amplitude.' },
      { label: 'Solve for Period', formula: 'T = 2\u03C0 / \u03C9 = 2\u03C0 \u221A(l/g)', detail: '✅ T = 2π√(L/g). A 1 m pendulum: T = 2π√(1/9.81) = 2.01 s. This is why grandfather clocks have pendulums about 1 m long — each swing takes one second. On the Moon (g = 1.62 m/s²), the same pendulum would take T = 2π√(1/1.62) = 4.93 s — nearly 5 seconds per swing!' },
    ],
    sliders: [
      { label: 'Length (l)', key: 'l', min: 0.2, max: 5, step: 0.1, default: 1, unit: ' m' },
    ],
    compute: (v) => {
      const g = 9.81;
      const T = 2 * Math.PI * Math.sqrt(v.l / g);
      return {
        traces: [
          { label: 'l = ', value: `${v.l} m` },
          { label: 'g = ', value: `${g} m/s\u00B2` },
          { label: 'T = 2\u03C0\u221A(l/g) = 2\u03C0\u221A(', value: `${v.l}/${g})` },
        ],
        result: T.toFixed(3) + ' s'
      };
    },
    practice: {
      question: 'A pendulum of length l = 2 m. Find its period (g = 9.81 m/s\u00B2).',
      hint: 'T = 2\u03C0 \u00D7 \u221A(2/9.81) = ?',
      answer: 2.837,
      tolerance: 0.2,
      explanation: 'T = 2.84 s. A longer pendulum swings more slowly!',
      errorHint: 'T = 2\u03C0\u221A(l/g) = 2\u03C0\u221A(2/9.81)'
    }
  },

  shm_energy: {
    title: 'Derivation: Energy Conservation in SHM',
    icon: <Activity className="w-5 h-5 text-white" />,
    accentGradient: 'from-cyan-500 to-sky-600',
    accentColor: 'bg-cyan-600',
    finalFormula: 'E_total = (1/2) k x_o\u00B2 = constant',
    finalFormulaDesc: 'Total mechanical energy is conserved in SHM',
    keyInsight: 'A trampoline with k=5000 N/m bouncing 0.5 m stores 625 J — energy sloshes between elastic (at the bottom) and gravitational (at the top), with total energy always conserved.',
    steps: [
      { label: 'Elastic Potential Energy', formula: 'PE = \\frac{1}{2} k x\u00B2', detail: '🪃 You\'re bouncing on a trampoline. At the top, you\'re momentarily motionless — all your energy is gravitational potential. As you fall, PE converts to KE. At the bottom, the mat stretches and stores elastic energy. Then you\'re launched back up. Total mechanical energy is conserved throughout.' },
      { label: 'Kinetic Energy', formula: 'KE = \\frac{1}{2} m v\u00B2', detail: '📐 For a mass-spring system: Elastic PE = ½kx². KE = ½mv². At any point, total E = PE + KE = ½kx² + ½mv². Energy sloshes back and forth between these two forms.' },
      { label: 'Substitute SHM Velocity', formula: 'v\u00B2 = \u03C9\u00B2(x_o\u00B2 \u2212 x\u00B2)', detail: '🧮 Substituting SHM velocity: v² = ω²(x₀² − x²) and ω² = k/m: KE = ½m × (k/m)(x₀² − x²) = ½k(x₀² − x²). Total E = PE + KE = ½kx² + ½k(x₀² − x²) = ½kx₀².' },
      { label: 'Total Energy Constant', formula: 'E = \\frac{1}{2}k x_o\u00B2', detail: '✅ E_total = ½kx₀² = constant! For a trampoline with k = 5000 N/m bouncing 0.5 m amplitude: E = ½×5000×0.25 = 625 J. This energy is always conserved — it just trades between potential at the extremes and kinetic at the center. A real trampoline loses energy to air resistance and internal friction, which is why you need to keep pumping your legs!' },
    ],
    sliders: [
      { label: 'Spring Const (k)', key: 'k', min: 10, max: 200, step: 5, default: 100, unit: ' N/m' },
      { label: 'Amplitude (x_o)', key: 'xo', min: 0.1, max: 2, step: 0.1, default: 1, unit: ' m' },
      { label: 'Displacement (x)', key: 'x', min: 0, max: 2, step: 0.1, default: 0.5, unit: ' m' },
    ],
    compute: (v) => {
      const x = Math.min(v.x, v.xo);
      const m = 1;
      const omega = Math.sqrt(v.k / m);
      const PE = 0.5 * v.k * x * x;
      const KE = 0.5 * v.k * (v.xo * v.xo - x * x);
      const total = PE + KE;
      return {
        traces: [
          { label: 'PE = (1/2)kx\u00B2 = ', value: `${(0.5*v.k).toFixed(0)}\u00D7${x.toFixed(1)}\u00B2` },
          { label: 'KE = (1/2)k(x_o\u00B2\u2212x\u00B2) = ', value: '' },
          { label: 'Total E = ', value: `${total.toFixed(2)} J` },
        ],
        result: `${total.toFixed(2)} J (constant)`
      };
    },
    practice: {
      question: 'A spring with k = 100 N/m, x_o = 0.5 m. Find total energy.',
      hint: 'E = (1/2) \u00D7 100 \u00D7 (0.5)\u00B2 = ?',
      answer: 12.5,
      tolerance: 1,
      explanation: 'E = 12.5 J. This energy is constant - it just converts between KE and PE during oscillation.',
      errorHint: 'E = (1/2)kx_o\u00B2 = 0.5 \u00D7 100 \u00D7 0.25'
    }
  },

  // === Unit 18: Diffraction ===
  youngs_double_slit: {
    title: 'Derivation: Young\'s Double Slit Interference',
    icon: <Waves className="w-5 h-5 text-white" />,
    accentGradient: 'from-fuchsia-500 to-pink-600',
    accentColor: 'bg-fuchsia-600',
    finalFormula: '\u0394y = \u03BB L / d',
    finalFormulaDesc: 'Fringe spacing in double-slit interference',
    keyInsight: 'Young\'s 1801 experiment settled the centuries-old debate: light is a wave. Today, the same principle is used in LIGO to detect gravitational waves by measuring shifts smaller than a proton\'s width.',
    steps: [
      { label: 'Path Difference', formula: '\u0394 = d sin\u03B8', detail: '💡 It\'s 1801. Thomas Young performs a revolutionary experiment that proves light is a wave. He shines light through two tiny slits and observes alternating bright and dark bands on a screen — interference! Water waves do the same thing when passing through two openings in a barrier.' },
      { label: 'Constructive Interference (Bright)', formula: 'd sin\u03B8 = m\u03BB, y = m\u03BBL/d', detail: '📐 The path difference from the two slits to a point on the screen is Δ = d sin θ. If this equals a whole number of wavelengths (mλ), the waves arrive in phase and interfere constructively — bright fringe. If it\'s a half-wavelength (m+½)λ, they cancel — dark fringe.' },
      { label: 'Destructive Interference (Dark)', formula: 'd sin\u03B8 = (m+1/2)\u03BB, y = (m+1/2)\u03BBL/d', detail: '🧮 For bright fringes: d sin θ = mλ. For small angles (screen far away), sin θ ≈ y/L, so y = mλL/d. The distance from center to the mth bright fringe is proportional to wavelength and screen distance, inversely proportional to slit spacing.' },
      { label: 'Fringe Spacing', formula: '\u0394y = y_{m+1} \u2212 y_m = \u03BBL/d', detail: '✅ Δy = λL/d. For red light (λ = 650 nm) with d = 0.5 mm, L = 2 m: Δy = 650×10⁻⁹×2/0.0005 = 2.6 mm. Young measured these tiny fringe spacings and calculated the wavelength of light — less than a micrometer! This experiment settled the centuries-old debate: light is a wave.' },
    ],
    sliders: [
      { label: 'Wavelength (\u03BB)', key: 'lam', min: 400, max: 700, step: 10, default: 550, unit: ' nm' },
      { label: 'Slit Spacing (d)', key: 'd', min: 0.1, max: 1, step: 0.05, default: 0.5, unit: ' mm' },
      { label: 'Screen Distance (L)', key: 'L', min: 0.5, max: 5, step: 0.1, default: 2, unit: ' m' },
    ],
    compute: (v) => {
      const lamM = v.lam * 1e-9;
      const dM = v.d * 1e-3;
      const dy = lamM * v.L / dM;
      return {
        traces: [
          { label: '\u0394y = \u03BB\u00D7L/d = ', value: `${v.lam}e-9\u00D7${v.L}/${v.d}e-3` },
        ],
        result: (dy*1000).toFixed(2) + ' mm'
      };
    },
    practice: {
      question: '\u03BB = 500 nm, d = 0.4 mm, L = 2 m. Find fringe spacing.',
      hint: '\u0394y = (500e-9 \u00D7 2) / (0.4e-3) = ?',
      answer: 0.0025,
      tolerance: 0.0005,
      explanation: '\u0394y = 2.5 mm. The bright and dark fringes alternate at regular intervals!',
      errorHint: '\u0394y = \u03BBL/d. Convert nm to m: \u03BB = 5\u00D710\u207B\u2077 m.'
    }
  },

  diffraction_grating: {
    title: 'Derivation: Diffraction Grating Equation',
    icon: <Waves className="w-5 h-5 text-white" />,
    accentGradient: 'from-pink-500 to-rose-600',
    accentColor: 'bg-pink-600',
    finalFormula: 'd sin\u03B8 = m\u03BB',
    finalFormulaDesc: 'Condition for maxima in diffraction grating',
    keyInsight: 'A CD\'s spiral track has 625 lines/mm — it acts as a diffraction grating, splitting white light into the rainbow you see when tilting it. Spectrometers use this to identify chemical elements in stars.',
    steps: [
      { label: 'Grating Spacing', formula: 'd = 1 / N', detail: '💿 You hold a CD up to the light and see a rainbow of colors. The CD\'s surface has a spiral track with grooves spaced 1.6 μm apart — it acts as a diffraction grating! When white light hits it, different wavelengths (colors) bend at different angles, creating the rainbow.' },
      { label: 'Path Difference', formula: '\u0394 = d sin\u03B8', detail: '📐 The grating equation is the same as double-slit: d sin θ = mλ. But a grating has thousands of slits per mm, producing much sharper, brighter fringes. The grating spacing d = 1/N where N is the number of lines per unit length.' },
      { label: 'Maxima Condition', formula: 'd sin\u03B8 = m\u03BB', detail: '🧮 For a grating with 500 lines/mm: d = 1/500 mm = 2×10⁻⁶ m. For green light (λ = 550 nm), m = 1: sin θ = 1×550×10⁻⁹/2×10⁻⁶ = 0.275, so θ₁ = 16.0°. For red light (λ = 650 nm): sin θ = 0.325, θ₁ = 19.0°. The colors spread out!' },
      { label: 'Maximum Orders', formula: 'm_max < d/\u03BB', detail: '✅ Maximum order: m_max < d/λ. For d = 2 μm, λ = 550 nm: m_max = floor(2×10⁻⁶/550×10⁻⁹) = floor(3.64) = 3. You can see up to 3rd order on each side — 6 bright spots plus the central maximum! CD rainbows, spectrometers, and even the beautiful colors of butterfly wings all use diffraction gratings.' },
    ],
    sliders: [
      { label: 'Lines per mm (N)', key: 'N', min: 100, max: 1000, step: 50, default: 500, unit: ' /mm' },
      { label: 'Wavelength (\u03BB)', key: 'lam', min: 400, max: 700, step: 10, default: 550, unit: ' nm' },
    ],
    compute: (v) => {
      const d = 1e-3 / v.N;
      const lam = v.lam * 1e-9;
      const maxM = Math.floor(d / lam);
      const theta1 = Math.asin(lam / d) * 180 / Math.PI;
      return {
        traces: [
          { label: 'd = 1/N = 1/', value: `${v.N} = ${d.toExponential(3)} m` },
          { label: 'd/\u03BB = ', value: `${(d/lam).toFixed(2)}` },
          { label: 'Max order m_max = ', value: `${maxM}` },
        ],
        result: `\u03B8\u2081 = ${theta1.toFixed(1)}\u00B0`
      };
    },
    practice: {
      question: 'Grating: 500 lines/mm, \u03BB = 600 nm. Find the angle for m=1.',
      hint: 'd = 1/500 mm = 2\u00D710\u207B\u2076 m. \u03B8 = sin\u207B\u00B9(600e-9 / 2e-6) = ?',
      answer: 17.46,
      tolerance: 2,
      explanation: '\u03B8 = 17.5\u00B0. This is the angle at which the first-order bright fringe appears!',
      errorHint: '\u03B8 = sin\u207B\u00B9(m\u03BB/d). d = 1/N in meters.'
    }
  },

  // === Unit 19: Electric Potential & Capacitors ===
  electric_potential_point: {
    title: 'Derivation: Electric Potential of a Point Charge',
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-purple-500 to-violet-600',
    accentColor: 'bg-purple-600',
    finalFormula: 'V = (1/4\u03C0\u03B5\u2080) Q / r',
    finalFormulaDesc: 'Potential due to a point charge at distance r',
    keyInsight: 'A Van de Graaff generator dome at 1 μC charge creates 60,000 V — enough to make your hair stand on end. Near a proton at 1 Ångström, the potential is 14.4 V, enormous at atomic scale.',
    steps: [
      { label: 'Work Against Electric Field', formula: 'W = \u222B F dr = \u222B qE dr', detail: '⚡ You\'re standing near a lightning rod during a thunderstorm. The rod concentrates charge at its tip, creating a strong electric field that ionizes the air and safely conducts lightning to ground. The electric potential V at any point tells you the potential energy per unit charge.' },
      { label: 'Coulomb\'s Law Field', formula: 'E = (1/4\u03C0\u03B5\u2080) Q / r\u00B2', detail: '📐 To find V from a point charge Q, calculate the work to bring a test charge q from infinity to distance r: W = ∫_∞^r F dr = ∫_∞^r (kQq/r²) dr. The integral of 1/r² is −1/r.' },
      { label: 'Integrate from Infinity', formula: 'V = \u222B_\u221E^r (1/4\u03C0\u03B5\u2080) Q/r\u00B2 dr', detail: '🧮 Evaluating: W = kQq[−1/r]_∞^r = kQq(0 + 1/r) = kQq/r. But potential V = W/q (work per unit charge). The test charge cancels: V = kQ/r.' },
      { label: 'Final Result', formula: 'V = kQ / r', detail: '✅ V = kQ/r = Q/(4πε₀r). For a Van de Graaff generator dome (Q = 1 μC, r = 0.15 m): V = 9×10⁹ × 10⁻⁶/0.15 = 60,000 V = 60 kV! That\'s enough to make your hair stand on end. Potential is positive for positive charges, negative for negative. Near a proton (Q = 1.6×10⁻¹⁹ C, r = 1 Å): V = 14.4 V — a huge potential at the atomic scale!' },
    ],
    sliders: [
      { label: 'Charge (Q)', key: 'Q', min: 1e-9, max: 1e-6, step: 1e-9, default: 1e-8, unit: ' C' },
      { label: 'Distance (r)', key: 'r', min: 0.1, max: 5, step: 0.1, default: 1, unit: ' m' },
    ],
    compute: (v) => {
      const k = 9e9;
      const V = k * v.Q / v.r;
      return {
        traces: [
          { label: 'V = k\u00D7Q/r = 9e9\u00D7', value: `${v.Q.toExponential(3)}/${v.r}` },
        ],
        result: V.toExponential(3) + ' V'
      };
    },
    practice: {
      question: 'Q = 2 nC (2\u00D710\u207B\u2079 C), r = 0.5 m. Find V. (k = 9\u00D710\u2079)',
      hint: 'V = 9e9 \u00D7 2e-9 / 0.5 = ?',
      answer: 36,
      tolerance: 5,
      explanation: 'V = 36 V. The potential increases as you get closer to the charge!',
      errorHint: 'V = kQ/r = 9e9 \u00D7 2e-9 / 0.5'
    }
  },

  capacitance: {
    title: 'Derivation: Capacitance of Parallel Plate Capacitor',
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-violet-500 to-purple-600',
    accentColor: 'bg-violet-600',
    finalFormula: 'C = \u03B5\u2080 A / d',
    finalFormulaDesc: 'Capacitance depends on area and plate separation',
    keyInsight: 'Your phone touchscreen has thousands of tiny capacitors — when your finger (a conductor) approaches, it changes the capacitance at that point, and the phone detects exactly where you touched.',
    steps: [
      { label: 'Electric Field Between Plates', formula: 'E = V / d', detail: '📱 Your phone\'s touchscreen detects your finger\'s touch using capacitors. When you touch the screen, you change the capacitance at that point. A capacitor is two parallel plates separated by an insulator. The capacitance C tells you how much charge it stores per volt: C = Q/V.' },
      { label: 'Field from Surface Charge', formula: 'E = Q / (A \u03B5\u2080)', detail: '📐 Between parallel plates, the electric field is uniform: E = V/d. Also, from Gauss\'s law, E = σ/ε₀ = Q/(Aε₀), where σ is surface charge density. Set these equal: V/d = Q/(Aε₀).' },
      { label: 'Equate Both E Expressions', formula: 'V/d = Q/(A\u03B5\u2080)', detail: '🧮 Solve for Q: Q = (ε₀A/d)V. Since C = Q/V: C = ε₀A/d. For a touchscreen sensor (A = 4 mm², d = 0.1 mm glass): C = 8.85×10⁻¹²×4×10⁻⁶/1×10⁻⁴ = 3.5×10⁻¹³ F = 0.35 pF. Tiny!' },
      { label: 'Capacitance C = Q/V', formula: 'C = \u03B5\u2080 A / d', detail: '✅ C = ε₀A/d. With a dielectric (like glass) of relative permittivity εᵣ: C = ε₀εᵣA/d. For a typical capacitor with A = 0.01 m², d = 0.1 mm: C = 8.85×10⁻¹²×0.01/0.0001 = 8.85×10⁻¹⁰ F ≈ 885 pF. Larger plates, closer spacing, and higher-εᵣ dielectrics all increase capacitance.' },
    ],
    sliders: [
      { label: 'Plate Area (A)', key: 'A', min: 0.01, max: 1, step: 0.01, default: 0.1, unit: ' m\u00B2' },
      { label: 'Plate Separation (d)', key: 'd', min: 0.001, max: 0.05, step: 0.001, default: 0.01, unit: ' m' },
    ],
    compute: (v) => {
      const e0 = 8.85e-12;
      const C = e0 * v.A / v.d;
      return {
        traces: [
          { label: 'C = \u03B5\u2080\u00D7A/d = ', value: `${e0.toExponential(3)}\u00D7${v.A}/${v.d}` },
        ],
        result: (C*1e12).toFixed(2) + ' pF'
      };
    },
    practice: {
      question: 'Area = 0.2 m\u00B2, d = 0.005 m. Find capacitance. (\u03B5\u2080 = 8.85\u00D710\u207B\u00B9\u00B2)',
      hint: 'C = 8.85e-12 \u00D7 0.2 / 0.005 = ?',
      answer: 3.54e-10,
      tolerance: 1e-10,
      explanation: 'C = 354 pF. Typical capacitor values are in the pF to \u03BCF range.',
      errorHint: 'C = \u03B5\u2080A/d = 8.85e-12 \u00D7 0.2 / 0.005'
    }
  },

  equivalent_capacitance: {
    title: 'Derivation: Equivalent Capacitance (Series & Parallel)',
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-blue-600',
    accentColor: 'bg-indigo-600',
    finalFormula: 'Series: 1/C_eq = \u03A3(1/C_i), Parallel: C_eq = \u03A3C_i',
    finalFormulaDesc: 'Capacitors combine opposite to resistors',
    keyInsight: 'Camera flash units use capacitor banks in parallel: four 100 μF capacitors give 400 μF total, storing enough energy to fire a brilliant 9 J flash in milliseconds.',
    steps: [
      { label: 'Series: Charge is Constant', formula: 'Q = Q\u2081 = Q\u2082 = Q\u2083', detail: '⚡ Your camera\'s flash needs a sudden burst of energy. A large capacitor bank stores charge slowly, then releases it instantly. Sometimes capacitors are connected in series (to handle higher voltage) or parallel (to store more charge). Their equivalent capacitance is the opposite of resistors.' },
      { label: 'Series: Voltages Add', formula: 'V = V\u2081 + V\u2082 + V\u2083 = Q/C\u2081 + Q/C\u2082 + Q/C\u2083', detail: '📐 In SERIES: The same charge Q flows through each capacitor. Q = Q₁ = Q₂ = Q₃. Voltages add: V = V₁ + V₂ + V₃ = Q/C₁ + Q/C₂ + Q/C₃ = Q(1/C₁ + 1/C₂ + 1/C₃). Since V = Q/C_eq: 1/C_eq = 1/C₁ + 1/C₂ + 1/C₃. Series capacitance is LESS than the smallest individual — like making a thicker insulator.' },
      { label: 'Parallel: Voltage is Constant', formula: 'V = V\u2081 = V\u2082 = V\u2083', detail: '📐 In PARALLEL: Voltage is the SAME across each: V = V₁ = V₂ = V₃. Charges add: Q = Q₁ + Q₂ + Q₃ = C₁V + C₂V + C₃V = V(C₁ + C₂ + C₃). Since Q = C_eqV: C_eq = C₁ + C₂ + C₃. Parallel capacitance ADDS — like making larger plates.' },
      { label: 'Parallel: Charges Add', formula: 'Q = Q\u2081 + Q\u2082 + Q\u2083 = C\u2081V + C\u2082V + C\u2083V', detail: '✅ Series: 1/C_eq = Σ(1/Cᵢ). Parallel: C_eq = ΣCᵢ. For C₁ = 10 μF, C₂ = 20 μF: series gives 1/(1/10+1/20) = 6.67 μF (less), parallel gives 10+20 = 30 μF (more). Camera flash capacitors use parallel banks: four 100 μF in parallel = 400 μF, storing enough energy for a brilliant flash!' },
    ],
    sliders: [
      { label: 'C\u2081', key: 'c1', min: 1, max: 100, step: 1, default: 10, unit: ' \u03BCF' },
      { label: 'C\u2082', key: 'c2', min: 1, max: 100, step: 1, default: 20, unit: ' \u03BCF' },
      { label: 'C\u2083', key: 'c3', min: 1, max: 100, step: 1, default: 30, unit: ' \u03BCF' },
    ],
    compute: (v) => {
      const c1 = v.c1 * 1e-6, c2 = v.c2 * 1e-6, c3 = v.c3 * 1e-6;
      const series = 1 / (1/c1 + 1/c2 + 1/c3);
      const parallel = c1 + c2 + c3;
      return {
        traces: [
          { label: 'Series: 1/C_eq = 1/', value: `${v.c1} + 1/${v.c2} + 1/${v.c3}` },
          { label: 'Parallel: C_eq = ', value: `${v.c1} + ${v.c2} + ${v.c3}` },
        ],
        result: `C_series = ${(series*1e6).toFixed(1)}\u03BCF, C_parallel = ${(parallel*1e6).toFixed(1)}\u03BCF`
      };
    },
    practice: {
      question: 'Two capacitors C\u2081 = 10 \u03BCF, C\u2082 = 20 \u03BCF in series. Find C_eq.',
      hint: '1/C_eq = 1/10 + 1/20 = 3/20. C_eq = ?',
      answer: 6.67e-6,
      tolerance: 1e-6,
      explanation: 'C_eq = 6.67 \u03BCF (less than the smallest individual capacitor, just like resistors in parallel!)',
      errorHint: '1/C_eq = 1/C\u2081 + 1/C\u2082 = 1/10 + 1/20'
    }
  },

  capacitor_energy: {
    title: 'Derivation: Energy Stored in a Capacitor',
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-blue-500 to-indigo-600',
    accentColor: 'bg-blue-600',
    finalFormula: 'E = (1/2) C V\u00B2 = Q\u00B2 / 2C',
    finalFormulaDesc: 'Energy stored in electric field between plates',
    keyInsight: 'A defibrillator stores 1250 J in a 100 μF capacitor charged to 5000 V — released in 5 ms, that\'s 250,000 W of power for an instant, enough to restart a stopped heart.',
    steps: [
      { label: 'Work to Charge Capacitor', formula: 'W = \u03A3 \u0394W = \u03A3 V \u0394q', detail: '❤️ A defibrillator delivers a life-saving electric shock to restart a heart. Inside, a capacitor stores energy and releases it in milliseconds. The energy stored in a capacitor comes from the work done to separate charges — building up positive charge on one plate and negative on the other against the growing electric field.' },
      { label: 'Voltage-Charge Graph', formula: 'Area under V-q graph', detail: '📐 To charge a capacitor from 0 to Q, you move small charge increments Δq. The voltage increases linearly: V = q/C. On a V-q graph, voltage rises from 0 to V as charge builds from 0 to Q. The work done is the area under this line.' },
      { label: 'Area of Triangle', formula: 'E = \\frac{1}{2} Q V', detail: '🧮 The area is a triangle: Area = ½ × base × height = ½ × Q × V. This area equals the stored energy E. Using Q = CV: E = ½QV = ½CV² = Q²/2C.' },
      { label: 'Using Q = CV', formula: 'E = \\frac{1}{2} C V\u00B2 = Q\u00B2 / 2C', detail: '✅ E = ½CV². A defibrillator capacitor: C = 100 μF, charged to 5000 V: E = ½×100×10⁻⁶×5000² = 1250 J. That 1250 J is delivered in about 5 ms — a power of 250,000 W for an instant! This is why the patient\'s chest jumps. The same physics powers camera flashes (E = ½×200×10⁻⁶×300² = 9 J per flash), delivering a brilliant burst of light.' },
    ],
    sliders: [
      { label: 'Capacitance (C)', key: 'C', min: 1, max: 100, step: 1, default: 10, unit: ' \u03BCF' },
      { label: 'Voltage (V)', key: 'V', min: 1, max: 100, step: 1, default: 12, unit: ' V' },
    ],
    compute: (v) => {
      const C = v.C * 1e-6;
      const E = 0.5 * C * v.V * v.V;
      return {
        traces: [
          { label: 'E = \u00BDCV\u00B2 = 0.5\u00D7', value: `${v.C}e-6\u00D7${v.V}\u00B2` },
          { label: 'Q = CV = ', value: `${(C*v.V).toExponential(3)} C` },
        ],
        result: (E*1e6).toFixed(3) + ' \u03BCJ'
      };
    },
    practice: {
      question: 'C = 47 \u03BCF, V = 9 V. Find stored energy.',
      hint: 'E = (1/2) \u00D7 47e-6 \u00D7 9\u00B2 = ?',
      answer: 0.0019035,
      tolerance: 0.0005,
      explanation: 'E = 1.9 mJ. This energy is released instantly when the capacitor discharges - used in camera flashes!',
      errorHint: 'E = \u00BDCV\u00B2 = 0.5 \u00D7 47e-6 \u00D7 81'
    }
  },

  rc_circuit: {
    title: 'Derivation: Charging & Discharging a Capacitor (RC Circuit)',
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-sky-500 to-indigo-600',
    accentColor: 'bg-sky-600',
    finalFormula: 'Q_charge = Q_o(1\u2212e\u207B\u1D56/\u1D43\u1D36), Q_discharge = Q_o e\u207B\u1D56/\u1D43\u1D36',
    finalFormulaDesc: 'Exponential charge/discharge in RC circuits',
    keyInsight: 'Windshield wiper intermittent mode uses an RC circuit: R=100 kΩ and C=100 μF give τ=10 s, triggering a wipe about every 7 seconds. Pacemakers and keyboard debouncing use the same timing principle.',
    steps: [
      { label: 'Kirchhoff\'s Voltage Law', formula: 'V = IR + Q/C', detail: '🚗 Your car\'s windshield wipers have an intermittent setting — wipe, pause, wipe again. The timing is controlled by an RC circuit: a resistor and capacitor work together to create a precise time delay. The capacitor charges through the resistor, and when it reaches a threshold voltage, the wipers activate.' },
      { label: 'Solve Differential Equation', formula: 'R dQ/dt + Q/C = V', detail: '📐 Apply Kirchhoff\'s Voltage Law: V_battery = IR + Q/C. Since I = dQ/dt, we get a differential equation: R(dQ/dt) + Q/C = V. This describes how the charge builds up over time.' },
      { label: 'Charging Solution', formula: 'Q(t) = Q_o(1 \u2212 e\u207B\u1D56/\u1D43\u1D36)', detail: '🧮 The solution: Q(t) = CV(1 − e⁻ᵗ/ᴿᶜ). The charge approaches Q₀ = CV exponentially. τ = RC is the time constant — the time to reach 63% of full charge. After 3τ: 95%. After 5τ: 99.3% — essentially fully charged.' },
      { label: 'Discharging Solution', formula: 'Q(t) = Q_o e\u207B\u1D56/\u1D43\u1D36', detail: '✅ τ = RC. For the wiper circuit (R = 100 kΩ, C = 100 μF): τ = 100,000 × 100×10⁻⁶ = 10 s. The capacitor reaches the threshold at about 7 s, triggering the wiper sweep. Discharging: Q(t) = Q₀e⁻ᵗ/ᴿᶜ. After t = RC, only 37% remains. RC circuits are everywhere — from pacemakers to audio filters to the 60 Hz debounce filter on your keyboard!' },
    ],
    sliders: [
      { label: 'Resistance (R)', key: 'R', min: 1e3, max: 1e6, step: 1e3, default: 10000, unit: ' \u03A9' },
      { label: 'Capacitance (C)', key: 'C', min: 1, max: 1000, step: 1, default: 100, unit: ' \u03BCF' },
      { label: 'Time (t)', key: 't', min: 0, max: 10, step: 0.1, default: 1, unit: ' s' },
    ],
    compute: (v) => {
      const tau = v.R * v.C * 1e-6;
      const ratio = 1 - Math.exp(-v.t / tau);
      return {
        traces: [
          { label: '\u03C4 = RC = ', value: `${v.R}\u00D7${v.C}e-6 = ${tau.toFixed(2)} s` },
          { label: 't/\u03C4 = ', value: `${(v.t/tau).toFixed(2)}` },
          { label: 'Charge ratio Q/Q_o = 1\u2212e\u207B\u1D56/\u207D = ', value: '' },
        ],
        result: `${(ratio*100).toFixed(1)}% charged`
      };
    },
    practice: {
      question: 'R = 10 k\u03A9, C = 100 \u03BCF. Find the time constant \u03C4 = RC.',
      hint: '\u03C4 = 10000 \u00D7 100e-6 = ?',
      answer: 1,
      tolerance: 0.1,
      explanation: '\u03C4 = 1.0 s. After 1 second, the capacitor is 63% charged. After 5\u03C4 (5 s), it\'s 99% charged.',
      errorHint: '\u03C4 = RC. Convert \u03BCF to F: 100 \u03BCF = 1\u00D710\u207B\u2074 F.'
    }
  },

  // === Unit 20: AC ===
  ac_power: {
    title: 'Derivation: Mean Power in AC Circuit',
    icon: <Zap className="w-5 h-5 text-white" />,
    accentGradient: 'from-rose-500 to-pink-600',
    accentColor: 'bg-rose-600',
    finalFormula: '<P> = (1/2) I_o\u00B2 R = I_rms V_rms',
    finalFormulaDesc: 'Average power dissipated in an AC resistive load',
    keyInsight: 'Your "120 V" household outlet actually swings from +170 V to −170 V, 60 times per second. The 120 V is the RMS value — the DC voltage that would deliver the same average power to a heater.',
    steps: [
      { label: 'Instantaneous Power', formula: 'P(t) = I\u00B2R = (I_o sin\u03C9t)\u00B2 R', detail: '💡 You look at your electricity bill. It charges you for kilowatt-hours of energy used. But the voltage and current in your home are alternating — they reverse direction 50 or 60 times per second. How do you calculate the average power when voltage and current are constantly changing?' },
      { label: 'Using Trig Identity', formula: 'sin\u00B2\u03C9t = (1 \u2212 cos 2\u03C9t)/2', detail: '📐 Instantaneous power in a resistor: P(t) = I²R = (I₀ sin ωt)²R = I₀²R sin²ωt. The power pulses at twice the frequency — it\'s always positive (heating is the same regardless of current direction), but varies between 0 and I₀²R.' },
      { label: 'Average Over One Cycle', formula: '<P> = \u00BD I_o\u00B2 R', detail: '🧮 Average of sin²ωt over a full cycle = ½. So <P> = ½I₀²R. Define RMS (Root Mean Square) current: I_rms = √(<I²>) = I₀/√2. Then <P> = I_rms²R = I_rmsV_rms.' },
      { label: 'RMS Current', formula: 'I_rms = I_o/\u221A2, P = I_rms\u00B2 R', detail: '✅ <P> = I_rmsV_rms. For US household supply (V_rms = 120 V, I_rms = 10 A): <P> = 1200 W. Peak voltage V₀ = 120×√2 = 170 V. Peak-to-peak = 340 V! Your \'120 V\' outlet actually swings from +170 V to −170 V, 60 times per second. The 120 V you read is the RMS value — the DC voltage that would deliver the same average power.' },
    ],
    sliders: [
      { label: 'Peak Current (I_o)', key: 'Io', min: 0.5, max: 10, step: 0.5, default: 5, unit: ' A' },
      { label: 'Resistance (R)', key: 'R', min: 10, max: 200, step: 5, default: 100, unit: ' \u03A9' },
    ],
    compute: (v) => {
      const Pavg = 0.5 * v.Io * v.Io * v.R;
      const Irms = v.Io / Math.sqrt(2);
      return {
        traces: [
          { label: '<P> = \u00BDI_o\u00B2R = 0.5\u00D7', value: `${v.Io}\u00B2\u00D7${v.R}` },
          { label: 'I_rms = I_o/\u221A2 = ', value: `${v.Io}/${Math.sqrt(2).toFixed(3)}` },
        ],
        result: `${Pavg.toFixed(1)} W (avg), I_rms = ${Irms.toFixed(2)} A`
      };
    },
    practice: {
      question: 'I_o = 2 A, R = 50 \u03A9. Find mean power.',
      hint: '<P> = (1/2) \u00D7 2\u00B2 \u00D7 50 = ?',
      answer: 100,
      tolerance: 10,
      explanation: '<P> = 100 W. AC power calculations use RMS values for convenience!',
      errorHint: '<P> = \u00BDI_o\u00B2R = 0.5 \u00D7 4 \u00D7 50'
    }
  },

  inductive_reactance: {
    title: 'Derivation: Inductive Reactance (X_L)',
    icon: <Cpu className="w-5 h-5 text-white" />,
    accentGradient: 'from-orange-500 to-red-600',
    accentColor: 'bg-orange-600',
    finalFormula: 'X_L = \u03C9L = 2\u03C0fL',
    finalFormulaDesc: 'Opposition to AC in an inductor',
    keyInsight: 'Audio crossovers use inductors to block high frequencies from woofers — at 1000 Hz an inductor has 20× more reactance than at 50 Hz, naturally directing bass to the big speaker.',
    steps: [
      { label: 'Back EMF in Inductor', formula: 'V = L \u0394I/\u0394t', detail: '🌀 Your electric fan has an inductor (a coil of wire) inside. When AC passes through it, the inductor resists changes in current — creating back EMF. This opposition to AC is called inductive reactance X_L. Unlike a resistor, it doesn\'t dissipate energy — it stores and releases it in the magnetic field.' },
      { label: 'Sinusoidal Current', formula: 'I = I_o sin(\u03C9t)', detail: '📐 The voltage across an inductor: V = L(dI/dt). For sinusoidal current I = I₀ sin ωt: V = L × d(I₀ sin ωt)/dt = ωLI₀ cos ωt. Notice: voltage involves cos, current involves sin — they\'re 90° out of phase! Voltage LEADS current by 90°.' },
      { label: 'Voltage Leads Current', formula: 'V = L \u00D7 d(I_o sin\u03C9t)/dt = \u03C9L I_o cos(\u03C9t)', detail: '🧮 The peak voltage V₀ = ωLI₀. By analogy with Ohm\'s Law (V = IR), define inductive reactance X_L = V₀/I₀ = ωL = 2πfL. Like resistance, its unit is ohms. But X_L depends on frequency — at DC (f=0), X_L = 0 (inductor acts as a short). At high frequencies, X_L is huge (inductor blocks AC).' },
      { label: 'Inductive Reactance', formula: 'X_L = V_o / I_o = \u03C9L = 2\u03C0fL', detail: '✅ X_L = 2πfL. For a fan motor inductor (L = 0.5 H) at 50 Hz: X_L = 2π×50×0.5 = 157 Ω. At 60 Hz: X_L = 188 Ω. At 1000 Hz: X_L = 3142 Ω — 20× more! This is why inductors are used in audio crossovers: they block high frequencies from reaching the woofer and let low frequencies pass through.' },
    ],
    sliders: [
      { label: 'Frequency (f)', key: 'f', min: 10, max: 1000, step: 10, default: 50, unit: ' Hz' },
      { label: 'Inductance (L)', key: 'L', min: 0.01, max: 1, step: 0.01, default: 0.5, unit: ' H' },
    ],
    compute: (v) => {
      const XL = 2 * Math.PI * v.f * v.L;
      return {
        traces: [
          { label: 'X_L = 2\u03C0fL = 2\u03C0\u00D7', value: `${v.f}\u00D7${v.L}` },
        ],
        result: XL.toFixed(2) + ' \u03A9'
      };
    },
    practice: {
      question: 'f = 60 Hz, L = 0.2 H. Find X_L.',
      hint: 'X_L = 2\u03C0 \u00D7 60 \u00D7 0.2 = ?',
      answer: 75.4,
      tolerance: 10,
      explanation: 'X_L = 75.4 \u03A9. At higher frequencies, inductors block more current!',
      errorHint: 'X_L = 2\u03C0fL = 2\u03C0 \u00D7 60 \u00D7 0.2'
    }
  },

  capacitive_reactance: {
    title: 'Derivation: Capacitive Reactance (X_C)',
    icon: <Cpu className="w-5 h-5 text-white" />,
    accentGradient: 'from-red-500 to-rose-600',
    accentColor: 'bg-red-600',
    finalFormula: 'X_C = 1/(\u03C9C) = 1/(2\u03C0fC)',
    finalFormulaDesc: 'Opposition to AC in a capacitor',
    keyInsight: 'Radio tuners use variable capacitors: at 100 pF, FM frequencies (100 MHz) pass easily (X_C=16 Ω) while AM (1 MHz) is blocked (X_C=1592 Ω) — selecting exactly one station.',
    steps: [
      { label: 'Capacitor Current-Voltage', formula: 'I = C dV/dt', detail: '📻 Your radio tuner uses a variable capacitor to select different stations. When AC passes through a capacitor, the plates alternately charge and discharge. The capacitor resists voltage changes — this opposition is capacitive reactance X_C, which behaves opposite to inductors.' },
      { label: 'Sinusoidal Voltage', formula: 'V = V_o sin(\u03C9t)', detail: '📐 The current through a capacitor: I = C(dV/dt). For sinusoidal voltage V = V₀ sin ωt: I = C × d(V₀ sin ωt)/dt = ωCV₀ cos ωt. Current involves cos, voltage involves sin — also 90° out of phase, but current LEADS voltage (opposite of inductor)!' },
      { label: 'Current Leads Voltage', formula: 'I = C \u00D7 d(V_o sin\u03C9t)/dt = \u03C9C V_o cos(\u03C9t)', detail: '🧮 Peak current I₀ = ωCV₀. Define capacitive reactance X_C = V₀/I₀ = 1/(ωC) = 1/(2πfC). At DC (f=0), X_C → ∞ (capacitor blocks DC). At high frequencies, X_C → 0 (capacitor passes AC easily). This is why capacitors are used to couple AC signals while blocking DC bias.' },
      { label: 'Capacitive Reactance', formula: 'X_C = V_o / I_o = 1/(\u03C9C) = 1/(2\u03C0fC)', detail: '✅ X_C = 1/(2πfC). For a radio tuning capacitor (C = 100 pF) at 1 MHz (AM band): X_C = 1/(2π×10⁶×100×10⁻¹²) = 1/(6.28×10⁻⁴) = 1592 Ω. At 100 MHz (FM band): X_C = 1/(2π×10⁸×10⁻¹⁰) = 15.9 Ω. The capacitor passes FM easily but resists AM — exactly what a radio tuner needs!' },
    ],
    sliders: [
      { label: 'Frequency (f)', key: 'f', min: 10, max: 1000, step: 10, default: 50, unit: ' Hz' },
      { label: 'Capacitance (C)', key: 'C', min: 1, max: 1000, step: 1, default: 100, unit: ' \u03BCF' },
    ],
    compute: (v) => {
      const XC = 1 / (2 * Math.PI * v.f * v.C * 1e-6);
      return {
        traces: [
          { label: 'X_C = 1/(2\u03C0fC) = 1/(2\u03C0\u00D7', value: `${v.f}\u00D7${v.C}e-6)` },
        ],
        result: XC.toFixed(2) + ' \u03A9'
      };
    },
    practice: {
      question: 'f = 60 Hz, C = 100 \u03BCF. Find X_C.',
      hint: 'X_C = 1 / (2\u03C0 \u00D7 60 \u00D7 100e-6) = ?',
      answer: 26.53,
      tolerance: 5,
      explanation: 'X_C = 26.5 \u03A9. At higher frequencies, capacitors conduct more easily!',
      errorHint: 'X_C = 1/(2\u03C0fC). Convert \u03BCF to F: C = 1e-4 F.'
    }
  },

  impedance: {
    title: 'Derivation: Impedance in RL and RC Circuits',
    icon: <Cpu className="w-5 h-5 text-white" />,
    accentGradient: 'from-rose-500 to-red-600',
    accentColor: 'bg-rose-600',
    finalFormula: 'Z_RL = \u221A(R\u00B2 + X_L\u00B2), Z_RC = \u221A(R\u00B2 + X_C\u00B2)',
    finalFormulaDesc: 'Total opposition to AC combining resistance and reactance',
    keyInsight: 'Speaker crossovers split audio: at 1 kHz the woofer path (with inductor) has Z=32.5 Ω while the tweeter path (with capacitor) has Z=17.8 Ω — each driver gets the frequencies it handles best.',
    steps: [
      { label: 'Phasor Voltage Addition', formula: 'V\u00B2 = V_R\u00B2 + V_X\u00B2', detail: '🎵 Your stereo system has a crossover network that splits the audio signal: low frequencies go to the woofer, high frequencies to the tweeter. This uses the frequency-dependent behavior of inductors and capacitors. The total opposition to AC is impedance Z — a combination of resistance R and reactance X.' },
      { label: 'Using Ohm\'s Law for Each', formula: 'V_R = IR, V_X = IX_X', detail: '📐 In a series RL or RC circuit, the voltages across R and X are 90° out of phase. They add as vectors (Pythagorean theorem), not as simple numbers. The total voltage squared = V_R² + V_X².' },
      { label: 'Substitute', formula: '(IZ)\u00B2 = (IR)\u00B2 + (IX_X)\u00B2', detail: '🧮 Using Ohm\'s Law for each: V_R = IR (in phase), V_L = IX_L (leading 90°), V_C = IX_C (lagging 90°). Substituting: (IZ)² = (IR)² + (IX)². Cancel I²: Z² = R² + X².' },
      { label: 'Impedance Formula', formula: 'Z = \u221A(R\u00B2 + X\u00B2)', detail: '✅ Z = √(R² + X²). For a speaker crossover: woofer path has L = 5 mH (X_L = 2π×1000×0.005 = 31.4 Ω at 1 kHz) and R = 8 Ω: Z_woofer = √(8² + 31.4²) = √1057 = 32.5 Ω. The tweeter path uses a capacitor C = 10 μF (X_C = 1/(2π×1000×10⁻⁵) = 15.9 Ω at 1 kHz): Z_tweeter = √(8² + 15.9²) = 17.8 Ω. At 100 Hz, the woofer impedance drops (easier to drive) while the tweeter impedance skyrockets — effectively directing frequencies to the right driver!' },
    ],
    sliders: [
      { label: 'Resistance (R)', key: 'R', min: 10, max: 200, step: 5, default: 100, unit: ' \u03A9' },
      { label: 'Reactance (X)', key: 'X', min: 10, max: 200, step: 5, default: 100, unit: ' \u03A9' },
    ],
    compute: (v) => {
      const Z = Math.sqrt(v.R * v.R + v.X * v.X);
      return {
        traces: [
          { label: 'Z = \u221A(R\u00B2+X\u00B2) = \u221A(', value: `${v.R}\u00B2+${v.X}\u00B2)` },
        ],
        result: Z.toFixed(2) + ' \u03A9'
      };
    },
    practice: {
      question: 'R = 100 \u03A9, X_L = 75 \u03A9. Find Z.',
      hint: 'Z = \u221A(100\u00B2 + 75\u00B2) = ?',
      answer: 125,
      tolerance: 10,
      explanation: 'Z = 125 \u03A9. The impedance is always greater than either R or X alone.',
      errorHint: 'Z = \u221A(R\u00B2 + X\u00B2) = \u221A(10000 + 5625)'
    }
  },

  // === Unit 21: Quantum ===
  photoelectric: {
    title: 'Derivation: Einstein\'s Photoelectric Equation',
    icon: <Sun className="w-5 h-5 text-white" />,
    accentGradient: 'from-yellow-500 to-amber-600',
    accentColor: 'bg-yellow-600',
    finalFormula: 'KE_max = hf \u2212 \u03A6',
    finalFormulaDesc: 'Maximum kinetic energy of photoelectrons',
    keyInsight: 'Solar panels use the photoelectric effect: photons with energy above silicon\'s 1.1 eV work function knock electrons loose, creating current. This is why solar cells respond to visible and infrared but not radio waves.',
    steps: [
      { label: 'Photon Energy (Planck)', formula: 'E_photon = hf', detail: '☀️ You walk through automatic sliding doors at the supermarket. A light beam above the door is broken by your presence, triggering the mechanism. But here\'s the puzzle: shine dim blue light and it works fine; shine bright red light and nothing happens — even if the red light is 100× brighter! This baffled physicists until Einstein explained it in 1905.' },
      { label: 'Work Function (\u03A6)', formula: '\u03A6 = hf_o', detail: '📐 Planck proposed that light comes in discrete packets (quanta) called photons, each with energy E = hf. Here h = 6.63×10⁻³⁴ J·s is Planck\'s constant — a fundamental constant of nature. Blue light (f ≈ 6.5×10¹⁴ Hz) has more energy per photon than red light (f ≈ 4.5×10¹⁴ Hz).' },
      { label: 'Conservation of Energy', formula: 'hf = \u03A6 + KE_max', detail: '🧮 Each metal has a work function Φ = hf₀ — the minimum energy needed to eject an electron. For sodium: Φ ≈ 2.3 eV. A photon with energy > Φ can eject an electron; the excess becomes kinetic energy. Conservation of energy: hf = Φ + KE_max.' },
      { label: 'Photoelectric Equation', formula: 'KE_max = hf \u2212 \u03A6', detail: '✅ KE_max = hf − Φ. This is Einstein\'s photoelectric equation, for which he won the Nobel Prize. If hf < Φ, no electrons are ejected — regardless of intensity! Solar panels use this: photons knock electrons loose, creating current. Silicon\'s work function (≈ 1.1 eV) means it responds to infrared through visible light — perfectly matched to the Sun\'s spectrum!' },
    ],
    sliders: [
      { label: 'Light Frequency (f)', key: 'f', min: 4e14, max: 1.5e15, step: 1e13, default: 1e15, unit: ' Hz' },
      { label: 'Work Function (\u03A6)', key: 'phi', min: 1, max: 5, step: 0.1, default: 2.3, unit: ' eV' },
    ],
    compute: (v) => {
      const h = 6.63e-34, eV = 1.6e-19;
      const KE = (h * v.f - v.phi * eV) / eV;
      const stoppingV = KE;
      return {
        traces: [
          { label: 'hf = 6.63e-34\u00D7', value: `${v.f.toExponential(3)} = ${(h*v.f/eV).toFixed(3)} eV` },
          { label: 'hf - \u03A6 = ', value: `${(h*v.f/eV).toFixed(3)} - ${v.phi}` },
        ],
        result: KE.toFixed(2) + ' eV (stopping potential: ' + stoppingV.toFixed(2) + ' V)'
      };
    },
    practice: {
      question: 'f = 6\u00D710\u00B9\u2074 Hz, \u03A6 = 2.3 eV. Find KE_max. (h = 4.14\u00D710\u207B\u00B9\u2075 eV\u00B7s)',
      hint: 'KE = (4.14e-15 \u00D7 6e14) - 2.3 = ? eV',
      answer: 0.184,
      tolerance: 0.2,
      explanation: 'KE_max = 0.18 eV. The electron barely escapes! Increase frequency for more KE.',
      errorHint: 'KE_max = hf - \u03A6. h = 4.14\u00D710\u207B\u00B9\u2075 eV\u00B7s for direct eV calculation.'
    }
  },

  de_broglie: {
    title: 'Derivation: De Broglie Wavelength',
    icon: <Atom className="w-5 h-5 text-white" />,
    accentGradient: 'from-indigo-500 to-fuchsia-600',
    accentColor: 'bg-indigo-600',
    finalFormula: '\u03BB = h / mv = h / p',
    finalFormulaDesc: 'Matter has wave-like properties with wavelength = h/momentum',
    keyInsight: 'Electron microscopes achieve 0.0037 nm resolution — 100,000× sharper than visible light — because high-energy electrons have wavelengths far smaller than atoms. A cricket ball\'s wavelength is 10⁻³⁴ m, undetectably tiny.',
    steps: [
      { label: 'Planck\'s Energy', formula: 'E = hf = hc/\u03BB', detail: '🔬 You\'re looking at an image from an electron microscope, showing individual atoms arranged like a crystal lattice. But how can a microscope see something smaller than the wavelength of visible light? The answer: use electrons instead of photons! In 1924, Louis de Broglie proposed that all matter has wave-like properties.' },
      { label: 'Einstein\'s Mass-Energy', formula: 'E = mc\u00B2', detail: '📐 For photons: E = hf = hc/λ (Planck-Einstein). Also E = pc (from special relativity for massless particles). Equate: hc/λ = pc. Cancel c: h/λ = p. So λ = h/p. For photons, wavelength = Planck\'s constant / momentum.' },
      { label: 'Equate Both Energies', formula: 'hc/\u03BB = pc \u21D2 h/\u03BB = p', detail: '🧮 De Broglie\'s bold hypothesis: this applies to ALL matter, not just photons! Any object with momentum p has a wavelength λ = h/p = h/(mv). An electron (m = 9.11×10⁻³¹ kg) moving at v = 10⁶ m/s: λ = 6.63×10⁻³⁴/(9.11×10⁻³¹×10⁶) = 7.28×10⁻¹⁰ m = 0.73 nm. That\'s smaller than atomic spacing!' },
      { label: 'De Broglie Formula', formula: '\u03BB = h/p = h/(mv)', detail: '✅ λ = h/p = h/(mv). Electron microscopes use this: electrons accelerated to 100,000 eV have λ ≈ 0.0037 nm — 100,000× smaller than visible light! This is why they can resolve individual atoms. A cricket ball (m = 0.16 kg) moving at 30 m/s has λ = 1.4×10⁻³⁴ m — so tiny it\'s undetectable, which is why macroscopic objects don\'t show obvious wave behavior.' },
    ],
    sliders: [
      { label: 'Mass (m)', key: 'm', min: 1e-31, max: 1e-27, step: 1e-31, default: 9.11e-31, unit: ' kg' },
      { label: 'Velocity (v)', key: 'v', min: 1e3, max: 1e7, step: 1e3, default: 1e5, unit: ' m/s' },
    ],
    compute: (v) => {
      const h = 6.63e-34;
      const lam = h / (v.m * v.v);
      return {
        traces: [
          { label: '\u03BB = h/(mv) = 6.63e-34/', value: `(${v.m.toExponential(3)}\u00D7${v.v.toExponential(3)})` },
        ],
        result: lam.toExponential(3) + ' m'
      };
    },
    practice: {
      question: 'Electron mass = 9.11\u00D710\u207B\u00B3\u00B9 kg, v = 2\u00D710\u2076 m/s. Find \u03BB. (h = 6.63\u00D710\u207B\u00B3\u2074)',
      hint: '\u03BB = 6.63e-34 / (9.11e-31 \u00D7 2e6) = ?',
      answer: 3.64e-10,
      tolerance: 1e-10,
      explanation: '\u03BB = 0.364 nm = 3.64\u00D710\u207B\u00B9\u2070 m. This is the wavelength of an electron - comparable to X-ray wavelengths!',
      errorHint: '\u03BB = h/(mv) = 6.63e-34 / (9.11e-31 \u00D7 2e6)'
    }
  },

  // === Unit 22: Nuclear ===
  mass_defect: {
    title: 'Derivation: Mass Defect and Binding Energy',
    icon: <Atom className="w-5 h-5 text-white" />,
    accentGradient: 'from-emerald-500 to-green-600',
    accentColor: 'bg-emerald-600',
    finalFormula: '\u0394E = \u0394m \u00D7 c\u00B2',
    finalFormulaDesc: 'Energy released equals mass converted to energy',
    keyInsight: '1 kg of uranium fuel releases 2.5 million times more energy than 1 kg of coal — the mass defect in nuclear fission, converted via E=mc², powers cities and submarines.',
    steps: [
      { label: 'Mass of Constituent Nucleons', formula: 'm_total = (A\u2212Z)m_n + Z m_p', detail: '☢️ A nuclear power plant generates electricity by splitting uranium atoms. When a uranium nucleus splits, the products have slightly less total mass than the original nucleus. Where does the mass go? It\'s converted to energy! E = mc². A small amount of mass releases an enormous amount of energy.' },
      { label: 'Actual Mass of Nucleus', formula: 'm_nucleus < m_total', detail: '📐 A nucleus is made of Z protons and (A−Z) neutrons. The total mass of these separate nucleons: m_total = Zm_p + (A−Z)m_n. For helium-4 (2 protons, 2 neutrons): m_total = 2×1.00728 + 2×1.00866 = 4.03188 amu.' },
      { label: 'Mass Defect', formula: '\u0394m = [(A\u2212Z)m_n + Zm_p] \u2212 m_nucleus', detail: '🧮 But the actual mass of a helium-4 nucleus is 4.00151 amu. Mass defect Δm = 4.03188 − 4.00151 = 0.03037 amu = 5.04×10⁻²⁹ kg. Using E = Δm × c²: E = 5.04×10⁻²⁹ × (3×10⁸)² = 4.54×10⁻¹² J = 28.3 MeV.' },
      { label: 'Einstein\'s E = mc\u00B2', formula: 'E_binding = \u0394m \u00D7 c\u00B2', detail: '✅ E_binding = Δm × c². For helium-4, 28.3 MeV of binding energy holds the nucleus together — that\'s about 7.1 MeV per nucleon. To put this in perspective: 1 kg of nuclear fuel (uranium) releases about 2.5 million times more energy than 1 kg of coal! This is the principle behind both nuclear power and nuclear weapons — harnessing Einstein\'s most famous equation.' },
    ],
    sliders: [
      { label: 'Mass Defect (\u0394m)', key: 'dm', min: 1e-30, max: 1e-27, step: 1e-30, default: 3e-28, unit: ' kg' },
    ],
    compute: (v) => {
      const c = 3e8;
      const E = v.dm * c * c;
      return {
        traces: [
          { label: 'E = \u0394m\u00D7c\u00B2 = ', value: `${v.dm.toExponential(3)}\u00D7(3e8)\u00B2` },
        ],
        result: E.toExponential(3) + ' J (' + (E/1.6e-13).toFixed(2) + ' MeV)'
      };
    },
    practice: {
      question: 'Mass defect = 1.67\u00D710\u207B\u00B2\u2077 kg (1 amu \u2248 1.66e-27). Find energy in J (c = 3\u00D710\u2078 m/s).',
      hint: 'E = 1.67e-27 \u00D7 (3e8)\u00B2 = ?',
      answer: 1.503e-10,
      tolerance: 5e-11,
      explanation: 'E = 1.5\u00D710\u207B\u00B9\u2070 J = 931.5 MeV. This is the energy equivalent of 1 atomic mass unit!',
      errorHint: 'E = \u0394m \u00D7 c\u00B2 = \u0394m \u00D7 9\u00D710\u00B9\u2076'
    }
  },

  decay_law: {
    title: 'Derivation: Radioactive Decay Law (Exponential)',
    icon: <Atom className="w-5 h-5 text-white" />,
    accentGradient: 'from-green-500 to-emerald-600',
    accentColor: 'bg-green-600',
    finalFormula: 'N = N_o e\u207B\u03BB\u1D56',
    finalFormulaDesc: 'Exponential decay of radioactive nuclei',
    keyInsight: 'Carbon-14 dating works because after 5730 years (one half-life), exactly half the ¹⁴C remains. By measuring the ratio in ancient wood, archaeologists date samples up to 50,000 years old.',
    steps: [
      { label: 'Decay Rate Proportional to N', formula: 'dN/dt = \u2212\u03BB N', detail: '🦴 You\'re an archaeologist who\'s discovered an ancient wooden tool. How old is it? Carbon-14 dating tells you. Carbon-14 is radioactive — it decays over time. The rate of decay depends only on how many radioactive atoms remain: dN/dt = −λN, where λ is the decay constant. This differential equation describes exponential decay.' },
      { label: 'Separate Variables', formula: 'dN/N = \u2212\u03BB dt', detail: '📐 Separate variables: dN/N = −λ dt. Integrate both sides: ∫(dN/N) = −λ∫dt. ln N = −λt + C. At t = 0, N = N₀, so C = ln N₀. Therefore ln N = −λt + ln N₀.' },
      { label: 'Integrate Both Sides', formula: '\u222B dN/N = \u2212\u03BB \u222B dt', detail: '🧮 Rearranging: ln(N/N₀) = −λt. Take exponential of both sides: N/N₀ = e⁻ˡᵗ. So N = N₀e⁻ˡᵗ. The number of undecayed nuclei decreases exponentially over time. Each nucleus has the same probability of decaying per unit time, independent of its age — there\'s no \'aging\' of individual nuclei!' },
      { label: 'Exponential Decay Formula', formula: 'N = N_o e\u207B\u03BB\u1D56', detail: '✅ N = N₀e⁻ˡᵗ. For carbon-14 (λ = 1.21×10⁻⁴ year⁻¹), after 5730 years (one half-life): N = N₀e⁻⁰·⁶⁹³ = N₀/2 — exactly half remains. By measuring the remaining ¹⁴C in the ancient wooden tool, you can calculate when the tree was cut down. This works for samples up to about 50,000 years old — beyond that, too little ¹⁴C remains.' },
    ],
    sliders: [
      { label: 'Initial Nuclei (N_o)', key: 'No', min: 100, max: 10000, step: 100, default: 1000, unit: '' },
      { label: 'Decay Constant (\u03BB)', key: 'lam', min: 0.1, max: 2, step: 0.1, default: 0.5, unit: ' s\u207B\u00B9' },
      { label: 'Time (t)', key: 't', min: 0, max: 10, step: 0.5, default: 2, unit: ' s' },
    ],
    compute: (v) => {
      const N = v.No * Math.exp(-v.lam * v.t);
      return {
        traces: [
          { label: 'N = N_o\u00D7e\u207B\u03BB\u1D56 = ', value: `${v.No}\u00D7e\u207B${v.lam}\u00D7${v.t}` },
        ],
        result: N.toFixed(0) + ' nuclei remaining'
      };
    },
    practice: {
      question: 'N_o = 1000, \u03BB = 0.693 s\u207B\u00B9, t = 1 s. Find N.',
      hint: 'N = 1000 \u00D7 e\u207B\u2070\u00B7\u2076\u2079\u00B3\u00D7\u00B9 = 1000 \u00D7 e\u207B\u2070\u00B7\u2076\u2079\u00B3 = ?',
      answer: 500,
      tolerance: 50,
      explanation: 'N = 500! After 1 second with \u03BB = 0.693, exactly half remains. This is the half-life connection!',
      errorHint: 'N = N_o e\u207B\u03BB\u1D56. e\u207B\u2070\u00B7\u2076\u2079\u00B3 = 1/2.'
    }
  },

  half_life: {
    title: 'Derivation: Half-Life and Decay Constant',
    icon: <Atom className="w-5 h-5 text-white" />,
    accentGradient: 'from-teal-500 to-emerald-600',
    accentColor: 'bg-teal-600',
    finalFormula: 'T_{\u00BD} = ln(2) / \u03BB = 0.693 / \u03BB',
    finalFormulaDesc: 'Relationship between half-life and decay constant',
    keyInsight: 'Fluorine-18 PET scan tracers have a 110-minute half-life — if prepared at 8 AM and injected at 10 AM, only 47% remains active. Nuclear medicine technicians must account for this decay during transport.',
    steps: [
      { label: 'Definition of Half-Life', formula: 'At t = T_{\u00BD}, N = N_o/2', detail: '🏥 You\'re a nuclear medicine technician preparing a radioactive tracer for a patient\'s PET scan. The tracer (fluorine-18) has a half-life of 110 minutes. You need to calculate how much remains active by the time it\'s injected. Half-life is the time for half the nuclei to decay — and it\'s related to the decay constant by a simple formula.' },
      { label: 'Substitute into Decay Law', formula: 'N_o/2 = N_o e\u207B\u03BB T_{\u00BD}', detail: '📐 By definition: at t = T_½, N = N₀/2. Substitute into the decay law: N₀/2 = N₀e⁻ˡᵀ_½. Cancel N₀: 1/2 = e⁻ˡᵀ_½.' },
      { label: 'Cancel N_o and Take ln', formula: 'ln\\frac{1}{2} = \u2212\u03BB T_{\u00BD}', detail: '🧮 Take natural log: ln(1/2) = −λT_½. Since ln(1/2) = −ln(2) = −0.693: −0.693 = −λT_½. So T_½ = 0.693/λ.' },
      { label: 'Solve for T_{\u00BD}', formula: 'T_{\u00BD} = ln(2)/\u03BB = 0.693/\u03BB', detail: '✅ T_½ = ln(2)/λ = 0.693/λ. For fluor-18 (T_½ = 110 min): λ = 0.693/110 = 0.00630 min⁻¹. If prepared at 8:00 AM and injected at 10:00 AM (2 hours later): N/N₀ = e⁻⁰·⁰⁰⁶³⁰×¹²⁰ = e⁻⁰·⁷⁵⁶ = 0.47. Only 47% of the tracer remains active! Different half-lives: uranium-238 (4.5 billion years — Earth\'s age), iodine-131 (8 days — medical treatment), polonium-214 (164 microseconds — barely exists!).' },
    ],
    sliders: [
      { label: 'Decay Constant (\u03BB)', key: 'lam', min: 0.1, max: 2, step: 0.1, default: 0.5, unit: ' s\u207B\u00B9' },
    ],
    compute: (v) => {
      const Thalf = 0.693 / v.lam;
      return {
        traces: [
          { label: 'T_{\u00BD} = 0.693/\u03BB = 0.693/', value: `${v.lam}` },
        ],
        result: Thalf.toFixed(2) + ' s'
      };
    },
    practice: {
      question: '\u03BB = 0.1 s\u207B\u00B9. Find the half-life.',
      hint: 'T_{\u00BD} = 0.693 / 0.1 = ?',
      answer: 6.93,
      tolerance: 0.5,
      explanation: 'T_{\u00BD} = 6.93 s. After 6.93 s, half the nuclei have decayed! Carbon-14 has T_{\u00BD} = 5730 years.',
      errorHint: 'T_{\u00BD} = 0.693/\u03BB = 0.693/0.1'
    }
  },

  // === Unit 23: Cosmology ===
  wien_law: {
    title: 'Derivation: Wien\'s Displacement Law',
    icon: <Sun className="w-5 h-5 text-white" />,
    accentGradient: 'from-amber-500 to-yellow-600',
    accentColor: 'bg-amber-600',
    finalFormula: '\u03BB_max \u00D7 T = 2.9\u00D710\u207B\u00B3 m\u00B7K',
    finalFormulaDesc: 'Peak wavelength is inversely proportional to temperature',
    keyInsight: 'The Sun\'s 5800 K surface peaks at 500 nm (green light) — our eyes evolved maximum sensitivity at exactly this wavelength. Thermal cameras detect our bodies glowing at 9350 nm in the infrared.',
    steps: [
      { label: 'Blackbody Radiation', formula: 'Hot objects emit radiation across a spectrum', detail: '🔥 A blacksmith heats a piece of iron. First it glows dull red, then orange, then yellow, then white-hot — and would turn blue if it didn\'t melt first. The color of hot objects tells us their temperature. Wien\'s Displacement Law: the peak wavelength λ_max is inversely proportional to temperature T.' },
      { label: 'Wien\'s Observation', formula: '\u03BB_max \u221D 1/T', detail: '📐 All objects emit thermal radiation. The spectrum has a peak — the wavelength where most energy is emitted. As temperature increases, this peak shifts to shorter (bluer) wavelengths: λ_max ∝ 1/T.' },
      { label: 'Insert Proportionality Constant', formula: '\u03BB_max \u00D7 T = 2.9\u00D710\u207B\u00B3 m\u00B7K', detail: '🧮 Wien\'s constant: b = 2.9×10⁻³ m·K. λ_max × T = b. For the Sun (T = 5800 K): λ_max = 2.9×10⁻³/5800 = 500 nm — that\'s green light! Our eyes evolved to be most sensitive to the Sun\'s peak wavelength. For a red star (T = 3000 K): λ_max = 967 nm (infrared). For a blue star (T = 30,000 K): λ_max = 97 nm (ultraviolet).' },
      { label: 'Applications', formula: 'T = 2.9\u00D710\u207B\u00B3 / \u03BB_max', detail: '✅ λ_max × T = 2.9×10⁻³ m·K. A blacksmith\'s forge at 1300 K: λ_max = 2.9×10⁻³/1300 = 2230 nm (far infrared — you FEEL the heat before you see it glow). At 800 K: λ_max = 3625 nm. The human body (310 K): λ_max = 9350 nm — we glow in the infrared! This is how thermal imaging cameras and night vision work.' },
    ],
    sliders: [
      { label: 'Temperature (T)', key: 'T', min: 3000, max: 30000, step: 100, default: 5800, unit: ' K' },
    ],
    compute: (v) => {
      const lam = 2.9e-3 / v.T;
      return {
        traces: [
          { label: '\u03BB_max = 2.9e-3 / T = 2.9e-3 / ', value: `${v.T}` },
        ],
        result: (lam*1e9).toFixed(0) + ' nm'
      };
    },
    practice: {
      question: 'A star\'s peak wavelength is 500 nm. Find its temperature.',
      hint: 'T = 2.9e-3 / 500e-9 = ?',
      answer: 5800,
      tolerance: 500,
      explanation: 'T = 5800 K \u2014 that\'s our Sun! The surface temperature determines the star\'s color.',
      errorHint: 'T = 2.9\u00D710\u207B\u00B3 / \u03BB_max. Convert nm to m: 500 nm = 5\u00D710\u207B\u2077 m.'
    }
  },

  hubble_law: {
    title: 'Derivation: Hubble\'s Law and Age of Universe',
    icon: <Sun className="w-5 h-5 text-white" />,
    accentGradient: 'from-purple-500 to-indigo-600',
    accentColor: 'bg-purple-600',
    finalFormula: 'v = H_o d, T_o = 1/H_o',
    finalFormulaDesc: 'Galaxies recede faster as distance increases',
    keyInsight: 'Hubble\'s discovery that galaxies recede faster with distance revealed the expanding universe — and rewinding gives an age of 13.8 billion years. Everything was once at a single point: the Big Bang.',
    steps: [
      { label: 'Hubble\'s Observation', formula: 'v \u221D d', detail: '🌌 You\'re an astronomer at the Mount Wilson Observatory in 1929. Edwin Hubble makes a shocking discovery: every distant galaxy is moving away from us, and the farther away they are, the faster they recede. The universe is expanding! v ∝ d — recession velocity is proportional to distance.' },
      { label: 'Hubble\'s Law', formula: 'v = H_o \u00D7 d', detail: '📐 Hubble\'s Law: v = H₀ × d. H₀ (the Hubble constant) ≈ 70 km/s/Mpc. A galaxy at 100 Mpc (326 million light-years) recedes at 7000 km/s. A galaxy at 1000 Mpc recedes at 70,000 km/s — that\'s 23% of the speed of light!' },
      { label: 'Age of Universe', formula: 't = d/v = d/(H_o d) = 1/H_o', detail: '🧮 If the universe has been expanding at a constant rate, we can rewind: time = distance/speed = d/(H₀d) = 1/H₀. This gives the age of the universe! t = 1/(70 km/s/Mpc). Convert: 1 Mpc = 3.086×10¹⁹ km, so t = 3.086×10¹⁹/70 = 4.41×10¹⁷ s ≈ 14 billion years.' },
      { label: 'Calculate Approximate Age', formula: 'T_o = 1/(70 km/s/Mpc) \u2248 13.8 billion years', detail: '✅ v = H₀d, Age ≈ 1/H₀ ≈ 13.8 billion years. The current best estimate from the Planck satellite: H₀ = 67.4 km/s/Mpc, giving age = 13.8 billion years. Everything in the universe was once concentrated at a single point — the Big Bang! This discovery transformed our view of the cosmos and earned Hubble a place among the greatest scientists in history.' },
    ],
    sliders: [
      { label: 'Distance (d)', key: 'd', min: 10, max: 1000, step: 10, default: 100, unit: ' Mpc' },
      { label: 'Hubble Const (H_o)', key: 'Ho', min: 50, max: 100, step: 1, default: 70, unit: ' km/s/Mpc' },
    ],
    compute: (v) => {
      const speed = v.Ho * v.d;
      const age_s = 1 / (v.Ho * 1000 / (3.086e22));
      const age_yr = age_s / (365.25 * 24 * 3600);
      return {
        traces: [
          { label: 'v = H_o\u00D7d = ', value: `${v.Ho}\u00D7${v.d}` },
          { label: 'T_o = 1/H_o = ', value: `${age_yr.toFixed(1)} billion years` },
        ],
        result: `${speed} km/s, Age \u2248 ${age_yr.toFixed(1)} billion years`
      };
    },
    practice: {
      question: 'A galaxy at d = 200 Mpc recedes at v = 14000 km/s. Find H_o.',
      hint: 'H_o = v/d = 14000 / 200 = ?',
      answer: 70,
      tolerance: 5,
      explanation: 'H_o = 70 km/s/Mpc. This is consistent with current measurements of the Hubble constant!',
      errorHint: 'H_o = v/d = 14000/200 = 70 km/s/Mpc'
    }
  },

  // === Unit 24: Climate ===
  coriolis: {
    title: 'Derivation: Coriolis Force',
    icon: <Cloud className="w-5 h-5 text-white" />,
    accentGradient: 'from-sky-500 to-blue-600',
    accentColor: 'bg-sky-600',
    finalFormula: 'F_c = 2mv\u03C9 sin\u03B8',
    finalFormulaDesc: 'Apparent force deflecting moving objects on rotating Earth',
    keyInsight: 'Hurricanes spin counterclockwise in the Northern Hemisphere and clockwise in the Southern — the Coriolis force deflects moving air right (north) or left (south), and is zero at the equator, which is why storms can\'t form there.',
    steps: [
      { label: 'Earth\'s Rotation', formula: '\u03C9 = 2\u03C0/T = 7.27\u00D710\u207B\u2075 rad/s', detail: '🌀 You\'re watching a weather forecast. The meteorologist points to a swirling cyclone spinning counterclockwise in the Northern Hemisphere. Why do storms spin? The Coriolis force — an apparent force that deflects moving objects on the rotating Earth. It\'s why winds don\'t blow straight from high to low pressure.' },
      { label: 'Velocity on Surface', formula: 'v = \u03C9 R cos(\u03B8)', detail: '📐 Earth rotates once per 24 hours: ω = 2π/86400 = 7.27×10⁻⁵ rad/s. A point on the equator moves at v = ωR = 7.27×10⁻⁵ × 6.37×10⁶ = 463 m/s (1670 km/h). At latitude 45°, the rotational speed is v = ωR cos 45° = 327 m/s.' },
      { label: 'Conservation of Angular Momentum', formula: 'L = mvR = \\text{constant}', detail: '🧮 When air moves toward the equator, it conserves angular momentum: L = mvR cos θ = constant. As latitude decreases, R cos θ increases, so v must decrease — but the air retains its higher eastward speed from higher latitudes, so it appears to deflect to the right in the Northern Hemisphere. The force: F_c = 2mvω sin θ.' },
      { label: 'Coriolis Force', formula: 'F_c = 2 m v \u03C9 sin\u03B8', detail: '✅ F_c = 2mvω sin θ. For a hurricane-force wind (m = 1 kg of air, v = 50 m/s) at latitude 30°: F_c = 2×1×50×7.27×10⁻⁵×0.5 = 0.0036 N/kg. Tiny, but over hundreds of kilometers, it deflects air masses enough to create cyclones! Northern Hemisphere: deflection right. Southern: left. Zero at equator — hurricanes can\'t form there. This is why the Coriolis effect determines global wind patterns and ocean currents.' },
    ],
    sliders: [
      { label: 'Mass (m)', key: 'm', min: 1, max: 1000, step: 1, default: 100, unit: ' kg' },
      { label: 'Velocity (v)', key: 'v', min: 1, max: 50, step: 1, default: 10, unit: ' m/s' },
      { label: 'Latitude (\u03B8)', key: 'theta', min: 0, max: 90, step: 5, default: 45, unit: '\u00B0' },
    ],
    compute: (v) => {
      const omega = 7.27e-5;
      const F = 2 * v.m * v.v * omega * Math.sin(v.theta * Math.PI / 180);
      return {
        traces: [
          { label: 'F_c = 2\u00D7m\u00D7v\u00D7\u03C9\u00D7sin\u03B8 = 2\u00D7', value: `${v.m}\u00D7${v.v}\u00D77.27e-5\u00D7sin(${v.theta}\u00B0)` },
        ],
        result: F.toExponential(3) + ' N'
      };
    },
    practice: {
      question: 'A 10 kg air mass moves at 20 m/s at latitude 30\u00B0. Find Coriolis force.',
      hint: 'F_c = 2 \u00D7 10 \u00D7 20 \u00D7 7.27e-5 \u00D7 sin(30\u00B0) = ?',
      answer: 0.01454,
      tolerance: 0.005,
      explanation: 'F_c = 0.0145 N. Small but persistent - it deflects winds to create cyclones!',
      errorHint: 'F_c = 2mv\u03C9 sin\u03B8. sin(30\u00B0) = 0.5.'
    }
  },

  // === Unit 26: Nature of Science ===
  newton_cannon: {
    title: 'Derivation: Newton\'s Cannonball Thought Experiment',
    icon: <Target className="w-5 h-5 text-white" />,
    accentGradient: 'from-slate-500 to-zinc-600',
    accentColor: 'bg-slate-600',
    finalFormula: 'If a_c = v\u00B2/r = g, the cannonball orbits',
    finalFormulaDesc: 'Conceptual derivation of orbital motion',
    keyInsight: 'Newton predicted in the 1680s that a cannonball fired at 7.9 km/s would orbit Earth — 270 years before Sputnik 1 proved him right in 1957. The ISS now orbits at 7.66 km/s, exactly as Newton calculated.',
    steps: [
      { label: 'Horizontal Motion', formula: 'x = vt', detail: '🛰️ Isaac Newton imagined a cannon on a mountaintop firing balls horizontally. A slow ball falls to Earth in a curve. A faster ball travels farther before hitting the ground. But what if you fire it so fast that the Earth curves away beneath it at exactly the same rate as the ball falls? The ball would circle Earth forever — it\'s in orbit!' },
      { label: 'Vertical Fall', formula: 'y = \\frac{1}{2}gt\u00B2', detail: '📐 Horizontal motion: x = vt. The ball moves at constant speed horizontally with no air resistance. Vertical motion: y = ½gt². It falls under gravity just like any dropped object. Combining: y = (g/2v²)x² — the path is a parabola.' },
      { label: 'Curved Path', formula: 'y = (g/2v\u00B2) x\u00B2', detail: '🧮 But Earth is round! It curves away with drop = x²/(2R) over horizontal distance x. For the cannonball to stay at constant height, its fall must match Earth\'s curvature: ½gt² = x²/(2R). Using x = vt: ½gt² = (vt)²/(2R). Cancel ½t²: g = v²/R.' },
      { label: 'Orbital Condition', formula: 'v\u00B2/r = g', detail: '✅ Orbital condition: a_c = v²/r = g. Solving: v = √(gR) = √(9.81 × 6.37×10⁶) = 7905 m/s ≈ 7.9 km/s! Newton realized this in the 1680s — more than 250 years before the first rocket reached orbit in 1957 (Sputnik 1). Today, the ISS orbits at about 7.66 km/s, completing a lap around Earth every 90 minutes. Newton\'s thought experiment was the birth of orbital mechanics!' },
    ],
    sliders: [
      { label: 'Velocity (v)', key: 'v', min: 1000, max: 10000, step: 100, default: 7900, unit: ' m/s' },
      { label: 'Time (t)', key: 't', min: 0.1, max: 5, step: 0.1, default: 1, unit: ' s' },
    ],
    compute: (v) => {
      const g = 9.81, R = 6.37e6;
      const x = v.v * v.t;
      const y = 0.5 * g * v.t * v.t;
      const ac = v.v * v.v / R;
      const isOrbit = ac >= g * 0.95 && ac <= g * 1.05;
      return {
        traces: [
          { label: 'x = vt = ', value: `${v.v}\u00D7${v.t} = ${x.toFixed(0)} m` },
          { label: 'y = \u00BDgt\u00B2 = 0.5\u00D79.81\u00D7', value: `${v.t}\u00B2 = ${y.toFixed(1)} m` },
          { label: 'a_c = v\u00B2/r = ', value: `${(v.v*v.v).toExponential(3)}/${R.toExponential(3)}` },
        ],
        result: isOrbit ? '\u2705 ORBIT! a_c \u2248 g' : '\u2744 Not orbiting. Increase speed to ~7900 m/s.'
      };
    },
    practice: {
      question: 'Find the orbital speed for a_c = g near Earth. (g = 9.81, R = 6370000 m)',
      hint: 'v = \u221A(gR) = \u221A(9.81 \u00D7 6.37e6) = ?',
      answer: 7905,
      tolerance: 500,
      explanation: 'v \u2248 7905 m/s \u2248 7.9 km/s! This is the orbital velocity for low Earth orbit - Newton predicted it 300 years before rockets!',
      errorHint: 'v = \u221A(gR) = \u221A(9.81 \u00D7 6.37\u00D710\u2076)'
    }
  }
};
