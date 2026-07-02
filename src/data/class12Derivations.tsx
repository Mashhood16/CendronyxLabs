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
    steps: [
      { label: 'Force Proportional to Masses', formula: 'F\u2091 \u221D m\u2081 \u00D7 m\u2082', detail: 'Gravitational force between two objects is directly proportional to the product of their masses. Double the mass = double the force.' },
      { label: 'Force Inversely Proportional to Distance\u00B2', formula: 'F\u2091 \u221D 1 / r\u00B2', detail: 'The force decreases with the square of the distance between the objects. Double the distance = one-quarter the force.' },
      { label: 'Combine Both Proportionalities', formula: 'F\u2091 \u221D (m\u2081\u00D7m\u2082) / r\u00B2', detail: 'Combining both relationships: gravitational force is proportional to masses divided by distance squared.' },
      { label: 'Insert Gravitational Constant G', formula: 'F\u2091 = G \u00D7 (m\u2081\u00D7m\u2082) / r\u00B2', detail: 'The constant G = 6.67\u00D710\u207B\u00B9\u00B9 N\u00B7m\u00B2/kg\u00B2. Found experimentally by Henry Cavendish using a torsion balance.' },
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
    steps: [
      { label: 'Weight = Gravitational Force', formula: 'm\u2092 \u00D7 g = G \u00D7 m\u2092 \u00D7 M_E / R_E\u00B2', detail: 'An object\'s weight mg equals the gravitational force from Earth. The object\'s mass m cancels out!' },
      { label: 'Cancel Object Mass', formula: 'g = G \u00D7 M_E / R_E\u00B2', detail: 'Mass m cancels from both sides. This is why all objects fall at the same rate regardless of mass!' },
      { label: 'Plug in Earth Values', formula: 'g = 6.67\u00D710\u207B\u00B9\u00B9 \u00D7 5.97\u00D710\u00B2\u2074 / (6.37\u00D710\u2076)\u00B2', detail: 'M_E = 5.97\u00D710\u00B2\u2074 kg, R_E = 6.37\u00D710\u2076 m. Calculate: g \u2248 9.81 m/s\u00B2.' },
      { label: 'Final Value', formula: 'g = 9.81 m/s\u00B2', detail: 'The acceleration due to gravity on Earth is approximately 9.81 m/s\u00B2. Varies slightly with latitude and altitude.' },
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
    steps: [
      { label: 'Replace R with R + h', formula: 'g_h = G \u00D7 M_E / (R_E + h)\u00B2', detail: 'At height h above Earth\'s surface, distance from Earth\'s center is R_E + h. The same formula applies with this new distance.' },
      { label: 'Compare to Surface g', formula: 'g_h / g = R_E\u00B2 / (R_E + h)\u00B2', detail: 'Dividing g_h by surface g gives a ratio. As h increases, g_h decreases.' },
      { label: 'Approximation for Small h', formula: 'g_h \u2248 g(1 \u2212 2h/R_E)', detail: 'Using binomial expansion for h << R_E: (1+h/R_E)\u207B\u00B2 \u2248 1-2h/R_E. Used in aviation.' },
      { label: 'Practical Effect', formula: 'At h = 10 km: g_h = 9.78 m/s\u00B2', detail: 'At typical airplane cruising altitude (10 km), gravity is only 0.3% less than at sea level.' },
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
    steps: [
      { label: 'Centripetal = Gravitational Force', formula: 'm v_o\u00B2 / r = G m M_E / r\u00B2', detail: 'For a satellite in circular orbit, centripetal force (mv\u00B2/r) equals gravitational force (GMm/r\u00B2).' },
      { label: 'Cancel Satellite Mass m', formula: 'v_o\u00B2 / r = G M_E / r\u00B2', detail: 'Mass m cancels out. Orbital velocity depends only on Earth\'s mass and orbit radius, NOT on satellite mass!' },
      { label: 'Solve for v_o', formula: 'v_o\u00B2 = G M_E / r', detail: 'Multiply both sides by r. The orbital velocity squared equals GM_E divided by orbit radius.' },
      { label: 'Take Square Root', formula: 'v_o = \u221A(G M_E / r)', detail: 'At Earth\'s surface (r = R_E), v_o \u2248 7.9 km/s. This is the speed needed for low Earth orbit.' },
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
    steps: [
      { label: 'Orbital Velocity Formula', formula: 'v_o = \u221A(G M_E / r)', detail: 'From previous derivation: orbital speed depends on radius.' },
      { label: 'Orbital Period Formula', formula: 'v_o = 2\u03C0r / T', detail: 'Speed = circumference / period. For geostationary orbit, T = 24 hours = 86400 s.' },
      { label: 'Equate Both Expressions', formula: '2\u03C0r/T = \u221A(G M_E / r)', detail: 'Set the two v_o expressions equal. Square both sides.' },
      { label: 'Solve for r', formula: 'r\u00B3 = G M_E T\u00B2 / 4\u03C0\u00B2', detail: 'After squaring and rearranging: r = (G M_E T\u00B2/4\u03C0\u00B2)^(1/3). Result: r \u2248 42,164 km from Earth\'s center.' },
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
    steps: [
      { label: 'Work Against Gravity', formula: 'W = F_av \u00D7 \u0394r', detail: 'Work is force \u00D7 distance. Moving a mass against gravity requires work. But gravity changes with distance.' },
      { label: 'Integrate from R to \u221E', formula: 'U = \u222B_R^\u221E G M_E m / r\u00B2 dr', detail: 'Using calculus: total work = integral of gravitational force from Earth\'s surface to infinity.' },
      { label: 'Evaluate the Integral', formula: 'U = \u2212G M_E m / r', detail: 'Integral of 1/r\u00B2 is -1/r. The result is NEGATIVE because potential energy is zero at infinity and decreases as you get closer to Earth.' },
      { label: 'Physical Meaning', formula: 'U < 0 means bound system', detail: 'Negative PE means the mass is bound to Earth. To escape, you must add positive energy to make U = 0.' },
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
    steps: [
      { label: 'Definition of Potential', formula: 'V = U / m', detail: 'Gravitational potential V at a point is the gravitational potential energy per unit mass.' },
      { label: 'Substitute U = \u2212GMM_E/r', formula: 'V = (\u2212G M_E m / r) / m', detail: 'The test mass m cancels out! Potential depends only on Earth\'s mass and the distance from its center.' },
      { label: 'Simplify', formula: 'V = \u2212G M_E / r', detail: 'Potential is also negative. Units: J/kg. At Earth\'s surface, V \u2248 \u221262.5 MJ/kg.' },
      { label: 'Potential Difference', formula: '\u0394V = V\u2082 \u2212 V\u2081', detail: 'The work needed to move a mass between two points is m \u00D7 \u0394V. Used to calculate escape velocity!' },
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
    steps: [
      { label: 'Momentum Change per Collision', formula: '\u0394p = \u22122mv_x', detail: 'When a gas molecule hits a wall, its x-velocity reverses. Momentum change is -2mv_x per collision.' },
      { label: 'Force from One Molecule', formula: 'F = \u0394p / \u0394t = 2mv_x / (2L/v_x)', detail: 'Time between collisions on same wall = 2L/v_x. Force = momentum change per unit time.' },
      { label: 'Sum Over All Molecules', formula: 'F_total = m/L \u00D7 \u03A3(v_x\u00B2)', detail: 'Total force = sum of all molecules. Use <v_x\u00B2> = (1/3)<v\u00B2> since motion is equally likely in all 3 directions.' },
      { label: 'Pressure = Force/Area', formula: 'P = (1/3) (N/V) m <v\u00B2> = (1/3) \u03C1 <v\u00B2>', detail: 'Dividing by area A (and using V = AL): P = (1/3)(N/V)m<v\u00B2>. Using density \u03C1 = Nm/V: P = (1/3)\u03C1<v\u00B2>.' },
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
    steps: [
      { label: 'Start with Pressure Formula', formula: 'P = (1/3) N m <v\u00B2> / V', detail: 'From kinetic theory: pressure depends on number N, mass m, mean square speed, and volume V.' },
      { label: 'Multiply and Divide by 2', formula: 'P = (2/3) (N/V) (1/2) m <v\u00B2>', detail: 'Multiplying by 2/2 creates the kinetic energy term (1/2)mv\u00B2 in the equation.' },
      { label: 'Recognize Translational KE', formula: 'P = (2/3) (N/V) \u00D7 KE_avg', detail: '(1/2)m<v\u00B2> is the average translational kinetic energy per molecule.' },
      { label: 'Final Relation', formula: 'P \u221D (2/3) \u00D7 n \u00D7 KE_avg', detail: 'Pressure is directly proportional to the number density times the average KE. This connects macroscopic pressure to microscopic motion!' },
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
    steps: [
      { label: 'Ideal Gas Law', formula: 'PV = NkT', detail: 'The ideal gas law relates pressure, volume, temperature, and number of molecules. k = 1.38\u00D710\u207B\u00B2\u00B3 J/K.' },
      { label: 'Kinetic Theory Pressure', formula: 'PV = (2/3) N KE_avg', detail: 'From the previous derivation: PV = (2/3)N\u00D7(KE_avg).' },
      { label: 'Equate Both Expressions', formula: 'NkT = (2/3) N KE_avg', detail: 'Set the two PV expressions equal. N cancels on both sides!' },
      { label: 'Solve for KE_avg', formula: 'KE_avg = (3/2) kT', detail: 'The average translational kinetic energy per molecule is directly proportional to absolute temperature. At T = 0 K, all motion stops.' },
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
    steps: [
      { label: 'Start with KE-Temperature Relation', formula: '(1/2) m <v\u00B2> = (3/2) kT', detail: 'The average KE equals (3/2)kT. This relates molecular motion to temperature.' },
      { label: 'Solve for <v\u00B2>', formula: '<v\u00B2> = 3kT / m', detail: 'Multiply both sides by 2 and divide by m. The mean square speed equals 3kT/m.' },
      { label: 'Take Square Root', formula: 'v_rms = \u221A(3kT / m)', detail: 'The RMS (root mean square) speed is the square root of the mean of the squares of individual speeds.' },
      { label: 'Using Molar Mass', formula: 'v_rms = \u221A(3RT / M)', detail: 'For practical calculations: R = 8.31 J/mol\u00B7K, M = molar mass. For O\u2082 at 300 K: v_rms \u2248 483 m/s.' },
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
    steps: [
      { label: 'Hooke\'s Law', formula: 'F = \u2212kx', detail: 'The restoring force from a spring is proportional to displacement x from equilibrium, with constant k (spring constant).' },
      { label: 'Newton\'s Second Law', formula: 'ma = \u2212kx', detail: 'Set F = ma. Acceleration a = -\u03C9\u00B2x for SHM. Substitute a.' },
      { label: 'Compare to SHM Definition', formula: '\u2212\u03C9\u00B2x = \u2212(k/m)x', detail: 'For SHM, a = -\u03C9\u00B2x. Cancel \u2212x from both sides.' },
      { label: 'Solve for \u03C9 and T', formula: '\u03C9 = \u221A(k/m), T = 2\u03C0\u221A(m/k)', detail: 'Angular frequency \u03C9 = \u221A(k/m). Period T = 2\u03C0/\u03C9 = 2\u03C0\u221A(m/k). Stiffer spring = shorter period.' },
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
    steps: [
      { label: 'Projection of Circular Motion', formula: 'x = x_o cos(\u03B8) = x_o cos(\u03C9t)', detail: 'SHM is the projection of uniform circular motion onto a diameter. \u03B8 = \u03C9t for constant angular speed.' },
      { label: 'Velocity from Derivative', formula: 'v = \u2212\u03C9 x_o sin(\u03C9t) = \u2212\u03C9\u221A(x_o\u00B2 \u2212 x\u00B2)', detail: 'Differentiating displacement gives velocity. Using sin\u00B2 + cos\u00B2 = 1: v = \u00B1\u03C9\u221A(x_o\u00B2 - x\u00B2).' },
      { label: 'Acceleration from Derivative', formula: 'a = \u2212\u03C9\u00B2 x_o cos(\u03C9t) = \u2212\u03C9\u00B2x', detail: 'Differentiating velocity: a = -\u03C9\u00B2x. Acceleration is proportional to displacement and always towards the center.' },
      { label: 'Key SHM Property', formula: 'a = \u2212\u03C9\u00B2x', detail: 'This is the defining equation of SHM: acceleration is proportional to displacement but in the opposite direction.' },
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
    steps: [
      { label: 'Restoring Force on Bob', formula: 'F = \u2212mg sin\u03B8', detail: 'The restoring force is the component of weight along the arc. For small angles, sin\u03B8 \u2248 \u03B8.' },
      { label: 'Small Angle Approximation', formula: 'F \u2248 \u2212mg \u03B8 = \u2212mg (x/l)', detail: 'For small \u03B8, sin\u03B8 \u2248 \u03B8 and arc length x = l\u03B8. So F = -mg(x/l).' },
      { label: 'Apply Newton\'s Second Law', formula: 'ma = \u2212(mg/l) x \u21D2 a = \u2212(g/l) x', detail: 'Mass m cancels! Comparing with a = -\u03C9\u00B2x gives \u03C9\u00B2 = g/l.' },
      { label: 'Solve for Period', formula: 'T = 2\u03C0 / \u03C9 = 2\u03C0 \u221A(l/g)', detail: 'Period depends ONLY on length l and gravity g. Not on mass or amplitude (for small angles)! Used in clocks.' },
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
    steps: [
      { label: 'Elastic Potential Energy', formula: 'PE = (1/2) k x\u00B2', detail: 'The energy stored in the spring is half the spring constant times displacement squared.' },
      { label: 'Kinetic Energy', formula: 'KE = (1/2) m v\u00B2', detail: 'Standard kinetic energy formula. Speed depends on position in SHM.' },
      { label: 'Substitute SHM Velocity', formula: 'v\u00B2 = \u03C9\u00B2(x_o\u00B2 \u2212 x\u00B2)', detail: 'From v = \u00B1\u03C9\u221A(x_o\u00B2 - x\u00B2). Squaring gives v\u00B2 = \u03C9\u00B2(x_o\u00B2 - x\u00B2).' },
      { label: 'Total Energy Constant', formula: 'E = (1/2)k x_o\u00B2', detail: 'KE + PE = (1/2)m\u03C9\u00B2(x_o\u00B2 - x\u00B2) + (1/2)kx\u00B2. Since \u03C9\u00B2 = k/m, KE = (1/2)k(x_o\u00B2 - x\u00B2). Adding PE: E = (1/2)kx_o\u00B2.' },
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
    steps: [
      { label: 'Path Difference', formula: '\u0394 = d sin\u03B8', detail: 'The difference in distance from each slit to a point on the screen depends on slit spacing d and angle \u03B8.' },
      { label: 'Constructive Interference (Bright)', formula: 'd sin\u03B8 = m\u03BB, y = m\u03BBL/d', detail: 'For bright fringes, path difference = m\u03BB (whole number of wavelengths). Position y = m\u03BBL/d from center.' },
      { label: 'Destructive Interference (Dark)', formula: 'd sin\u03B8 = (m+1/2)\u03BB, y = (m+1/2)\u03BBL/d', detail: 'For dark fringes, path difference = (m+1/2)\u03BB (half-wavelength mismatch).' },
      { label: 'Fringe Spacing', formula: '\u0394y = y_{m+1} \u2212 y_m = \u03BBL/d', detail: 'Subtracting adjacent bright fringe positions: \u0394y = \u03BBL/d. Closer slits = wider fringes!' },
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
    steps: [
      { label: 'Grating Spacing', formula: 'd = 1 / N', detail: 'The spacing between adjacent slits in a diffraction grating is the inverse of the number of lines per unit length.' },
      { label: 'Path Difference', formula: '\u0394 = d sin\u03B8', detail: 'Same as double-slit: the path difference between adjacent slits is d sin\u03B8.' },
      { label: 'Maxima Condition', formula: 'd sin\u03B8 = m\u03BB', detail: 'Constructive interference when path difference = integer \u00D7 wavelength. m is the order number.' },
      { label: 'Maximum Orders', formula: 'm_max < d/\u03BB', detail: 'Since sin\u03B8 \u2264 1, there is a maximum visible order. For d = 1/500 mm and \u03BB = 550 nm: m_max \u2248 3.' },
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
    steps: [
      { label: 'Work Against Electric Field', formula: 'W = \u222B F dr = \u222B qE dr', detail: 'Work done moving a test charge q against a non-uniform electric field is the integral of force over distance.' },
      { label: 'Coulomb\'s Law Field', formula: 'E = (1/4\u03C0\u03B5\u2080) Q / r\u00B2', detail: 'The electric field from a point charge Q decreases with 1/r\u00B2.' },
      { label: 'Integrate from Infinity', formula: 'V = \u222B_\u221E^r (1/4\u03C0\u03B5\u2080) Q/r\u00B2 dr', detail: 'Integrate from infinity to r. Result: V = (1/4\u03C0\u03B5\u2080)Q/r.' },
      { label: 'Final Result', formula: 'V = kQ / r', detail: 'Where k = 1/(4\u03C0\u03B5\u2080) = 9\u00D710\u2079 N\u00B7m\u00B2/C\u00B2. Potential is positive for positive charges, negative for negative.' },
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
    steps: [
      { label: 'Electric Field Between Plates', formula: 'E = V / d', detail: 'Between parallel plates, the electric field is uniform. E = V/d where d is plate separation.' },
      { label: 'Field from Surface Charge', formula: 'E = Q / (A \u03B5\u2080)', detail: 'The field also equals surface charge density divided by permittivity. Q is charge, A is plate area.' },
      { label: 'Equate Both E Expressions', formula: 'V/d = Q/(A\u03B5\u2080)', detail: 'Set both expressions for E equal. Rearranging: Q = (\u03B5\u2080A/d)V.' },
      { label: 'Capacitance C = Q/V', formula: 'C = \u03B5\u2080 A / d', detail: 'Since C = Q/V: C = \u03B5\u2080A/d. With dielectric: C = \u03B5\u2080\u03B5\u2091A/d.' },
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
    steps: [
      { label: 'Series: Charge is Constant', formula: 'Q = Q\u2081 = Q\u2082 = Q\u2083', detail: 'In series, the same charge Q flows through each capacitor. Voltage divides.' },
      { label: 'Series: Voltages Add', formula: 'V = V\u2081 + V\u2082 + V\u2083 = Q/C\u2081 + Q/C\u2082 + Q/C\u2083', detail: 'Total voltage = sum. Substituting V = Q/C: 1/C_eq = 1/C\u2081 + 1/C\u2082 + 1/C\u2083.' },
      { label: 'Parallel: Voltage is Constant', formula: 'V = V\u2081 = V\u2082 = V\u2083', detail: 'In parallel, voltage is the same across each capacitor. Charge divides.' },
      { label: 'Parallel: Charges Add', formula: 'Q = Q\u2081 + Q\u2082 + Q\u2083 = C\u2081V + C\u2082V + C\u2083V', detail: 'Total charge = sum. Substituting Q = CV: C_eq = C\u2081 + C\u2082 + C\u2083.' },
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
    steps: [
      { label: 'Work to Charge Capacitor', formula: 'W = \u03A3 \u0394W = \u03A3 V \u0394q', detail: 'Building up charge on a capacitor requires moving small charge increments \u0394q against increasing voltage.' },
      { label: 'Voltage-Charge Graph', formula: 'Area under V-q graph', detail: 'On a V vs q graph, voltage increases linearly: V = q/C. The work done is the triangular area under the line.' },
      { label: 'Area of Triangle', formula: 'E = (1/2) Q V', detail: 'Area = (1/2) \u00D7 base \u00D7 height = (1/2) \u00D7 Q \u00D7 V. This is the total energy stored.' },
      { label: 'Using Q = CV', formula: 'E = (1/2) C V\u00B2 = Q\u00B2 / 2C', detail: 'Three equivalent forms: E = \u00BDQV = \u00BDCV\u00B2 = Q\u00B2/2C. Energy is stored in the electric field between plates!' },
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
    steps: [
      { label: 'Kirchhoff\'s Voltage Law', formula: 'V = IR + Q/C', detail: 'In an RC circuit, battery voltage V = voltage across resistor (IR) + voltage across capacitor (Q/C).' },
      { label: 'Solve Differential Equation', formula: 'R dQ/dt + Q/C = V', detail: 'Since I = dQ/dt, we get a differential equation. During charging: V is constant.' },
      { label: 'Charging Solution', formula: 'Q(t) = Q_o(1 \u2212 e\u207B\u1D56/\u1D43\u1D36)', detail: 'Solution: Q increases exponentially toward Q_o = CV. \u03C4 = RC is the time constant.' },
      { label: 'Discharging Solution', formula: 'Q(t) = Q_o e\u207B\u1D56/\u1D43\u1D36', detail: 'Discharging (V=0): Q decreases exponentially. After t = RC, charge drops to 37% of initial.' },
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
    steps: [
      { label: 'Instantaneous Power', formula: 'P(t) = I\u00B2R = (I_o sin\u03C9t)\u00B2 R', detail: 'Instantaneous power = I\u00B2R where I varies sinusoidally with time.' },
      { label: 'Using Trig Identity', formula: 'sin\u00B2\u03C9t = (1 \u2212 cos 2\u03C9t)/2', detail: 'The squared sine function can be rewritten using the double-angle formula.' },
      { label: 'Average Over One Cycle', formula: '<P> = \u00BD I_o\u00B2 R', detail: 'The average of cos 2\u03C9t over a complete cycle is zero. So <sin\u00B2\u03C9t> = 1/2.' },
      { label: 'RMS Current', formula: 'I_rms = I_o/\u221A2, P = I_rms\u00B2 R', detail: 'Root-mean-square current I_rms = I_o/\u221A2. Then <P> = I_rms\u00B2R = I_rms V_rms.' },
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
    steps: [
      { label: 'Back EMF in Inductor', formula: 'V = L \u0394I/\u0394t', detail: 'The voltage across an inductor depends on the rate of change of current through it.' },
      { label: 'Sinusoidal Current', formula: 'I = I_o sin(\u03C9t)', detail: 'For AC, current varies sinusoidally with angular frequency \u03C9 = 2\u03C0f.' },
      { label: 'Voltage Leads Current', formula: 'V = L \u00D7 d(I_o sin\u03C9t)/dt = \u03C9L I_o cos(\u03C9t)', detail: 'Differentiating: V = \u03C9L I_o cos(\u03C9t) = \u03C9L I_o sin(\u03C9t + \u03C0/2). Voltage LEADS current by 90\u00B0.' },
      { label: 'Inductive Reactance', formula: 'X_L = V_o / I_o = \u03C9L = 2\u03C0fL', detail: 'X_L is the ratio of peak voltage to peak current. Units: ohms. Increases with frequency!' },
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
    steps: [
      { label: 'Capacitor Current-Voltage', formula: 'I = C dV/dt', detail: 'The current through a capacitor depends on how fast the voltage changes across it.' },
      { label: 'Sinusoidal Voltage', formula: 'V = V_o sin(\u03C9t)', detail: 'For AC, voltage varies sinusoidally across the capacitor.' },
      { label: 'Current Leads Voltage', formula: 'I = C \u00D7 d(V_o sin\u03C9t)/dt = \u03C9C V_o cos(\u03C9t)', detail: 'Differentiating: I = \u03C9C V_o cos(\u03C9t) = \u03C9C V_o sin(\u03C9t + \u03C0/2). Current LEADS voltage by 90\u00B0.' },
      { label: 'Capacitive Reactance', formula: 'X_C = V_o / I_o = 1/(\u03C9C) = 1/(2\u03C0fC)', detail: 'X_C is the ratio of peak voltage to peak current. Units: ohms. DECREASES with frequency!' },
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
    steps: [
      { label: 'Phasor Voltage Addition', formula: 'V\u00B2 = V_R\u00B2 + V_X\u00B2', detail: 'In series RL or RC, voltage across R and reactance X are 90\u00B0 out of phase. They add as VECTORS (Pythagoras).' },
      { label: 'Using Ohm\'s Law for Each', formula: 'V_R = IR, V_X = IX_X', detail: 'V_R = IR (in phase). V_L leads by 90\u00B0 or V_C lags by 90\u00B0.' },
      { label: 'Substitute', formula: '(IZ)\u00B2 = (IR)\u00B2 + (IX_X)\u00B2', detail: 'Substituting into phasor equation: I\u00B2Z\u00B2 = I\u00B2(R\u00B2 + X\u00B2). Cancel I\u00B2.' },
      { label: 'Impedance Formula', formula: 'Z = \u221A(R\u00B2 + X\u00B2)', detail: 'Impedance Z is the vector sum of R and X. For RL: Z = \u221A(R\u00B2 + X_L\u00B2). For RC: Z = \u221A(R\u00B2 + X_C\u00B2).' },
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
    steps: [
      { label: 'Photon Energy (Planck)', formula: 'E_photon = hf', detail: 'Light comes in discrete packets (photons). Each photon carries energy E = hf where h = 6.63\u00D710\u207B\u00B3\u2074 J\u00B7s.' },
      { label: 'Work Function (\u03A6)', formula: '\u03A6 = hf_o', detail: 'The minimum energy needed to eject an electron from a metal. \u03A6 = hf_o where f_o is the threshold frequency.' },
      { label: 'Conservation of Energy', formula: 'hf = \u03A6 + KE_max', detail: 'Photon energy is used to overcome the work function + remaining energy becomes kinetic energy of the ejected electron.' },
      { label: 'Photoelectric Equation', formula: 'KE_max = hf \u2212 \u03A6', detail: 'Einstein\'s Nobel-winning equation. KE_max is independent of light intensity! Only frequency matters.' },
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
    steps: [
      { label: 'Planck\'s Energy', formula: 'E = hf = hc/\u03BB', detail: 'Photons have energy proportional to frequency (Planck) and inversely proportional to wavelength.' },
      { label: 'Einstein\'s Mass-Energy', formula: 'E = mc\u00B2', detail: 'Energy and mass are equivalent. For a photon, E = pc (since m=0, p = momentum).' },
      { label: 'Equate Both Energies', formula: 'hc/\u03BB = pc \u21D2 h/\u03BB = p', detail: 'Setting E = hf equal to E = pc: hf = pc. Since f = c/\u03BB: hc/\u03BB = pc. Cancel c.' },
      { label: 'De Broglie Formula', formula: '\u03BB = h/p = h/(mv)', detail: 'h/\u03BB = p, so \u03BB = h/p. De Broglie proposed this applies to ALL matter, not just photons. Matter waves!' },
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
    steps: [
      { label: 'Mass of Constituent Nucleons', formula: 'm_total = (A\u2212Z)m_n + Z m_p', detail: 'The total mass of the separate protons and neutrons that make up the nucleus.' },
      { label: 'Actual Mass of Nucleus', formula: 'm_nucleus < m_total', detail: 'The actual mass of the nucleus is LESS than the sum of its parts. This difference is the mass defect.' },
      { label: 'Mass Defect', formula: '\u0394m = [(A\u2212Z)m_n + Zm_p] \u2212 m_nucleus', detail: 'Mass defect = difference between constituent mass and actual nuclear mass.' },
      { label: 'Einstein\'s E = mc\u00B2', formula: 'E_binding = \u0394m \u00D7 c\u00B2', detail: 'This missing mass is converted to binding energy that holds the nucleus together. Very large: 1 amu \u2192 931.5 MeV.' },
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
    steps: [
      { label: 'Decay Rate Proportional to N', formula: 'dN/dt = \u2212\u03BB N', detail: 'The rate of decay (number of nuclei decaying per unit time) is proportional to the number N of undecayed nuclei.' },
      { label: 'Separate Variables', formula: 'dN/N = \u2212\u03BB dt', detail: 'Rearrange the differential equation to separate N and t terms on opposite sides.' },
      { label: 'Integrate Both Sides', formula: '\u222B dN/N = \u2212\u03BB \u222B dt', detail: 'Integrate: ln(N) = \u2212\u03BBt + C. At t=0, N=N_o so C = ln(N_o).' },
      { label: 'Exponential Decay Formula', formula: 'N = N_o e\u207B\u03BB\u1D56', detail: 'Solving: ln(N/N_o) = \u2212\u03BBt. Taking exponential: N = N_o e\u207B\u03BB\u1D56. This is the universal radioactive decay law.' },
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
    steps: [
      { label: 'Definition of Half-Life', formula: 'At t = T_{\u00BD}, N = N_o/2', detail: 'Half-life is the time taken for half of the radioactive nuclei to decay.' },
      { label: 'Substitute into Decay Law', formula: 'N_o/2 = N_o e\u207B\u03BB T_{\u00BD}', detail: 'Put N = N_o/2 and t = T_{\u00BD} into the exponential decay formula.' },
      { label: 'Cancel N_o and Take ln', formula: 'ln(1/2) = \u2212\u03BB T_{\u00BD}', detail: 'Cancel N_o, take natural log of both sides. ln(1/2) = -ln(2).' },
      { label: 'Solve for T_{\u00BD}', formula: 'T_{\u00BD} = ln(2)/\u03BB = 0.693/\u03BB', detail: 'Rearranging: T_{\u00BD} = ln(2)/\u03BB. So \u03BB = 0.693/T_{\u00BD}. Shorter half-life means faster decay!' },
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
    steps: [
      { label: 'Blackbody Radiation', formula: 'Hot objects emit radiation across a spectrum', detail: 'All hot objects emit electromagnetic radiation. The peak wavelength shifts with temperature.' },
      { label: 'Wien\'s Observation', formula: '\u03BB_max \u221D 1/T', detail: 'As temperature increases, the peak wavelength DECREASES. Hotter = bluer.' },
      { label: 'Insert Proportionality Constant', formula: '\u03BB_max \u00D7 T = 2.9\u00D710\u207B\u00B3 m\u00B7K', detail: 'Wien\'s constant = 2.9\u00D710\u207B\u00B3 m\u00B7K. Sun (5800 K): peak at 500 nm (green). Cooler stars: redder.' },
      { label: 'Applications', formula: 'T = 2.9\u00D710\u207B\u00B3 / \u03BB_max', detail: 'Used to find star temperatures from their color. Also used in IR thermography.' },
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
    steps: [
      { label: 'Hubble\'s Observation', formula: 'v \u221D d', detail: 'Edwin Hubble observed that distant galaxies are moving away from us. The speed is proportional to distance.' },
      { label: 'Hubble\'s Law', formula: 'v = H_o \u00D7 d', detail: 'H_o = Hubble constant \u2248 70 km/s/Mpc. A galaxy at 100 Mpc recedes at 7000 km/s.' },
      { label: 'Age of Universe', formula: 't = d/v = d/(H_o d) = 1/H_o', detail: 'If universe expanded at constant rate, time = distance/speed. t = d/(H_o d) = 1/H_o.' },
      { label: 'Calculate Approximate Age', formula: 'T_o = 1/(70 km/s/Mpc) \u2248 13.8 billion years', detail: 'Converting units: 1/H_o \u2248 14 billion years. This gives the age of the universe!' },
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
    steps: [
      { label: 'Earth\'s Rotation', formula: '\u03C9 = 2\u03C0/T = 7.27\u00D710\u207B\u2075 rad/s', detail: 'Earth rotates once per 24 hours. Angular velocity is very small.' },
      { label: 'Velocity on Surface', formula: 'v = \u03C9 R cos(\u03B8)', detail: 'A point on Earth\'s surface moves at different speeds depending on latitude. Equator: fastest.' },
      { label: 'Conservation of Angular Momentum', formula: 'L = mvR = constant', detail: 'When air moves toward the equator (decreasing R cos\u03B8), its eastward velocity increases to conserve angular momentum.' },
      { label: 'Coriolis Force', formula: 'F_c = 2 m v \u03C9 sin\u03B8', detail: 'F_c is the apparent force deflecting moving objects. N hemisphere: right. S hemisphere: left. Zero at equator.' },
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
    steps: [
      { label: 'Horizontal Motion', formula: 'x = vt', detail: 'Fired horizontally, the cannonball moves at constant speed horizontally (ignoring air resistance).' },
      { label: 'Vertical Fall', formula: 'y = (1/2)gt\u00B2', detail: 'Simultaneously, the cannonball falls under gravity. The vertical drop follows the same quadratic as free fall.' },
      { label: 'Curved Path', formula: 'y = (g/2v\u00B2) x\u00B2', detail: 'Combining both: y = (g/2v\u00B2)x\u00B2. The path is a parabola for ordinary projectiles.' },
      { label: 'Orbital Condition', formula: 'v\u00B2/r = g', detail: 'If the cannonball is fired fast enough, Earth\'s curvature matches the fall. Centripetal acceleration = g, giving orbit. v \u2248 7.9 km/s!' },
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
