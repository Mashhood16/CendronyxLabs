import { AISimulationSpec } from '../types/aiSimulation';

/**
 * Pure Client-Side AI Simulation AST Synthesizer
 * Converts user natural language prompts into a rich AISimulationSpec AST without external network calls.
 */
export function generateAISimulationSpec(prompt: string): AISimulationSpec {
  const p = prompt.toLowerCase().trim();
  const id = `ai_lab_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const createdAt = Date.now();

  // 1. Newton's Third Law / Action & Reaction / Collision Forces
  if (p.includes('newton') && (p.includes('third') || p.includes('3rd') || p.includes('action') || p.includes('reaction') || p.includes('interaction'))) {
    return {
      id,
      title: "Newton's Third Law: Action & Reaction Forces",
      description: 'Explore equal and opposite reaction force vectors F12 = -F21 during contact interactions and collisions between two masses.',
      subject: 'Physics',
      classLevel: 'Class 9',
      category: 'Dynamics & Forces',
      createdAt,
      theory: {
        overview: "Newton's Third Law of Motion states that when one object exerts a force on a second object, the second object simultaneously exerts a force equal in magnitude and opposite in direction on the first object: F_12 = -F_21.",
        keyConcepts: [
          'Forces always occur in matched action-reaction pairs.',
          'Action and reaction forces act on DIFFERENT bodies, so they never cancel each other out on a single object.',
          'Magnitude of Action Force = Magnitude of Reaction Force (|F_12| = |F_21|).',
          'Accelerations differ if masses differ: a_1 = F / m_1 and a_2 = F / m_2.'
        ],
        realWorldApplication: 'Rocket propulsion (exhaust gases pushed backward push rocket forward), walking (foot pushes earth back, earth pushes body forward), swimming, and firearm recoil.',
        formulaSummary: 'F_12 = -F_21 | m_1 * a_1 = -m_2 * a_2 | p_total = m_1 * v_1 + m_2 * v_2'
      },
      variables: [
        { key: 'm1', label: 'Mass of Object 1 (m₁)', min: 1, max: 20, step: 0.5, default: 5, unit: 'kg' },
        { key: 'm2', label: 'Mass of Object 2 (m₂)', min: 1, max: 20, step: 0.5, default: 10, unit: 'kg' },
        { key: 'F', label: 'Applied Contact Force (F)', min: 10, max: 200, step: 10, default: 80, unit: 'N' }
      ],
      computedVars: [
        { key: 'F12', label: 'Force of 1 on 2 (F₁₂)', expr: 'F', unit: 'N' },
        { key: 'F21', label: 'Force of 2 on 1 (F₂₁)', expr: '-F', unit: 'N' },
        { key: 'a1', label: 'Acceleration of m₁ (a₁)', expr: '-F / m1', unit: 'm/s²' },
        { key: 'a2', label: 'Acceleration of m₂ (a₂)', expr: 'F / m2', unit: 'm/s²' },
        { key: 'x1', label: 'Position of m₁', expr: '-80 + 0.5 * (-F / m1) * (t * 0.1)^2', unit: 'm' },
        { key: 'x2', label: 'Position of m₂', expr: '80 + 0.5 * (F / m2) * (t * 0.1)^2', unit: 'm' }
      ],
      canvasPrimitives: [
        { id: 'ar1', type: 'action_reaction', label: 'Action-Reaction Mass Interaction', color: '#38bdf8', valueExpr: 'F' }
      ],
      chart: {
        xAxisVar: 't',
        yAxisExpr: 'F',
        xLabel: 'Time (s)',
        yLabel: 'Reaction Force magnitude [N]'
      },
      derivation: {
        title: "Derivation of Newton's Third Law & Conservation of Momentum",
        steps: [
          { stepNumber: 1, label: 'Impulse-Momentum Relation', formula: 'F_{12} \\Delta t = \\Delta p_2 \\quad \\text{and} \\quad F_{21} \\Delta t = \\Delta p_1', explanation: 'Each force causes a change in momentum over contact time.' },
          { stepNumber: 2, label: 'Action-Reaction Equality', formula: 'F_{12} = -F_{21}', explanation: 'Substituting forces into impulse yields equal and opposite momentum changes.' },
          { stepNumber: 3, label: 'Conservation of Total Momentum', formula: '\\Delta p_1 + \\Delta p_2 = 0 \\implies p_{initial} = p_{final}', explanation: 'Total momentum of an isolated system remains constant.' }
        ]
      },
      quiz: [
        { id: 'n3q1', question: 'A heavy truck collides head-on with a small compact car. Which vehicle experiences a greater magnitude force during the impact?', options: ['The heavy truck', 'The small car', 'Both experience the EXACT SAME magnitude force', 'Depends on initial speed'], correctIndex: 2, hint: 'Recall Newton\'s Third Law: F_12 = -F_21.', explanation: 'According to Newton\'s 3rd Law, both vehicles experience identical magnitude contact forces in opposite directions.' },
        { id: 'n3q2', question: 'Why do action and reaction forces not cancel each other out to cause zero acceleration?', options: ['They act at different times', 'They act on DIFFERENT objects', 'One force is always larger', 'They are not real vectors'], correctIndex: 1, hint: 'To cancel out, forces must act on the SAME object.', explanation: 'Action and reaction forces act on two separate bodies (Object 1 and Object 2), so they cannot cancel each other.' }
      ]
    };
  }

  // 2. Newton's Second Law (F = m * a)
  if (p.includes('newton') || p.includes('force') || p.includes('acceleration') || p.includes('mass') || p.includes('inertia') || p.includes('momentum')) {
    return {
      id,
      title: capitalize(prompt) || "Newton's Laws of Motion & Dynamics",
      description: 'Analyze net force F = m*a, mass inertia, acceleration, and velocity accumulation over time.',
      subject: 'Physics',
      classLevel: 'Class 9',
      category: 'Dynamics & Forces',
      createdAt,
      theory: {
        overview: "Newton's Second Law states that acceleration is directly proportional to net force and inversely proportional to mass: F = m * a.",
        keyConcepts: [
          'Net Force F = m * a',
          'Momentum p = m * v',
          'Force as rate of change of momentum: F = dp / dt',
          'Work W = F * d | Kinetic Energy KE = 1/2 * m * v^2'
        ],
        realWorldApplication: 'Vehicle braking distances, elevator cables, sports physics, and rocket acceleration.',
        formulaSummary: 'F = m * a | v(t) = v0 + a * t | x(t) = 0.5 * a * t^2'
      },
      variables: [
        { key: 'm', label: 'Mass (m)', min: 1, max: 50, step: 1, default: 10, unit: 'kg' },
        { key: 'F', label: 'Net Force (F)', min: 5, max: 200, step: 5, default: 50, unit: 'N' }
      ],
      computedVars: [
        { key: 'a', label: 'Acceleration (a)', expr: 'F / m', unit: 'm/s²' },
        { key: 'v', label: 'Velocity (v)', expr: '(F / m) * t', unit: 'm/s' },
        { key: 'x', label: 'Distance (x)', expr: '0.5 * (F / m) * t * t', unit: 'm' },
        { key: 'KE', label: 'Kinetic Energy', expr: '0.5 * m * ((F / m) * t)^2', unit: 'J' }
      ],
      canvasPrimitives: [
        { id: 'nb1', type: 'particle', label: 'Mass Block', color: '#38bdf8', xExpr: '0.5 * (F / m) * (t * 0.2)^2 * 10', yExpr: '0', radiusExpr: '22' },
        { id: 'fv1', type: 'vector', label: 'Applied Force Vector', color: '#f43f5e', xExpr: '0.5 * (F / m) * (t * 0.2)^2 * 10', yExpr: '0', vxExpr: 'F * 0.5', vyExpr: '0' }
      ],
      chart: {
        xAxisVar: 't',
        yAxisExpr: '(F / m) * t',
        xLabel: 'Time (s)',
        yLabel: 'Velocity v(t) [m/s]'
      },
      derivation: {
        title: "Derivation of Newton's Second Law",
        steps: [
          { stepNumber: 1, label: 'Definition of Momentum', formula: 'p = m v', explanation: 'Momentum is mass times velocity vector.' },
          { stepNumber: 2, label: 'Rate of Change of Momentum', formula: 'F = \\frac{dp}{dt} = m \\frac{dv}{dt}', explanation: 'For constant mass, dv/dt is acceleration a.' },
          { stepNumber: 3, label: 'Fundamental Force Equation', formula: 'F = m a', explanation: 'Relates force, mass, and acceleration.' }
        ]
      },
      quiz: [
        { id: 'nq1', question: 'If net force F is doubled while mass m is doubled, what happens to acceleration a?', options: ['Doubles', 'Halves', 'Stays the same', 'Quadruples'], correctIndex: 2, hint: 'a = F / m. (2F) / (2m) = ?', explanation: 'Doubling both force and mass leaves the acceleration a = F/m unchanged.' }
      ]
    };
  }

  // 3. Projectile Motion / Kinematics
  if (p.includes('projectile') || p.includes('trajectory') || p.includes('cannon') || p.includes('launch') || p.includes('ballistics')) {
    return {
      id,
      title: capitalize(prompt) || 'Projectile Motion Dynamics',
      description: 'Explore the 2D parabolic trajectory of a projectile under gravity, initial velocity, and launch angle.',
      subject: 'Physics',
      classLevel: 'Class 11',
      category: 'Kinematics',
      createdAt,
      theory: {
        overview: 'Projectile motion is a form of motion experienced by an object or particle that is projected near the Earth\'s surface and moves along a curved path under the action of gravity only.',
        keyConcepts: [
          'Horizontal velocity component remains constant (neglecting air resistance): V_x = V_0 * cos(theta)',
          'Vertical velocity component changes due to gravity: V_y = V_0 * sin(theta) - g * t',
          'Maximum height achieved when V_y = 0',
          'Range R = (V_0^2 * sin(2 * theta)) / g'
        ],
        realWorldApplication: 'Used in ballistics, sports engineering (soccer kicks, basketball shots), rocket launches, and artillery calculations.',
        formulaSummary: 'x(t) = v0 * cos(theta) * t | y(t) = v0 * sin(theta) * t - 0.5 * g * t^2'
      },
      variables: [
        { key: 'v0', label: 'Initial Speed (v₀)', min: 5, max: 100, step: 1, default: 45, unit: 'm/s' },
        { key: 'angle', label: 'Launch Angle (θ)', min: 5, max: 85, step: 1, default: 45, unit: '°' },
        { key: 'g', label: 'Gravity (g)', min: 1.6, max: 25, step: 0.1, default: 9.8, unit: 'm/s²' }
      ],
      computedVars: [
        { key: 'rad', label: 'Angle in Radians', expr: 'angle * pi / 180', unit: 'rad' },
        { key: 'vx', label: 'Horizontal Speed (v_x)', expr: 'v0 * cos(angle * pi / 180)', unit: 'm/s' },
        { key: 'vy', label: 'Vertical Speed (v_y)', expr: 'v0 * sin(angle * pi / 180) - g * t', unit: 'm/s' },
        { key: 'x', label: 'Horizontal Dist (x)', expr: 'v0 * cos(angle * pi / 180) * t', unit: 'm' },
        { key: 'y', label: 'Height (y)', expr: 'max(0, v0 * sin(angle * pi / 180) * t - 0.5 * g * t * t)', unit: 'm' },
        { key: 'maxH', label: 'Max Height (H_max)', expr: '(v0 * sin(angle * pi / 180))^2 / (2 * g)', unit: 'm' },
        { key: 'range', label: 'Total Range (R)', expr: '(v0^2 * sin(2 * angle * pi / 180)) / g', unit: 'm' }
      ],
      canvasPrimitives: [
        { id: 'p1', type: 'projectile', label: 'Projectile Body', color: '#38bdf8', xExpr: 'v0 * cos(angle * pi / 180) * t', yExpr: 'max(0, v0 * sin(angle * pi / 180) * t - 0.5 * g * t * t)', radiusExpr: '12' },
        { id: 'v1', type: 'vector', label: 'Velocity Vector', color: '#f43f5e', xExpr: 'v0 * cos(angle * pi / 180) * t', yExpr: 'max(0, v0 * sin(angle * pi / 180) * t - 0.5 * g * t * t)', vxExpr: 'v0 * cos(angle * pi / 180)', vyExpr: 'v0 * sin(angle * pi / 180) - g * t' }
      ],
      chart: {
        xAxisVar: 't',
        yAxisExpr: 'max(0, v0 * sin(angle * pi / 180) * t - 0.5 * g * t * t)',
        xLabel: 'Time (s)',
        yLabel: 'Height y(t) [m]'
      },
      derivation: {
        title: 'Derivation of Maximum Height and Range',
        steps: [
          { stepNumber: 1, label: 'Vertical Motion Equation', formula: 'v_y(t) = v_0 \\sin(\\theta) - g t', explanation: 'At peak height, the vertical velocity becomes zero: v_y = 0.' },
          { stepNumber: 2, label: 'Time to Peak Height', formula: 't_{peak} = \\frac{v_0 \\sin(\\theta)}{g}', explanation: 'Substitute t_peak into y(t) to solve for maximum height.' },
          { stepNumber: 3, label: 'Maximum Height Formula', formula: 'H_{max} = \\frac{v_0^2 \\sin^2(\\theta)}{2g}', explanation: 'Total time of flight T is 2 * t_peak.' },
          { stepNumber: 4, label: 'Horizontal Range', formula: 'R = v_x \\cdot T = \\frac{v_0^2 \\sin(2\\theta)}{g}', explanation: 'Maximum range is achieved at a 45-degree angle.' }
        ]
      },
      quiz: [
        { id: 'q1', question: 'At what angle does a projectile achieve maximum horizontal range in a vacuum?', options: ['30°', '45°', '60°', '90°'], correctIndex: 1, hint: 'sin(2θ) reaches its maximum value of 1 when 2θ = 90°.', explanation: 'Since sin(90°) = 1, θ = 45° yields the maximum range.' },
        { id: 'q2', question: 'What is the vertical velocity of a projectile at its apex (highest point)?', options: ['Equal to v0', 'Maximum', 'Zero', 'Depends on gravity'], correctIndex: 2, hint: 'The projectile stops moving upwards before descending.', explanation: 'At peak height, instantaneous vertical velocity v_y = 0 m/s.' }
      ]
    };
  }

  // 4. Hooke's Law / Spring Mass Harmonic Oscillator
  if (p.includes('spring') || p.includes('hooke') || p.includes('harmonic') || p.includes('oscillation') || p.includes('vibration')) {
    return {
      id,
      title: capitalize(prompt) || "Hooke's Law & Harmonic Spring Oscillator",
      description: 'Investigate restoring force F = -k*x, kinetic vs potential energy transfer, and natural oscillation frequency.',
      subject: 'Physics',
      classLevel: 'Class 10',
      category: 'Oscillations',
      createdAt,
      theory: {
        overview: "Hooke's Law states that the force needed to extend or compress a spring by some distance x scales linearly with respect to that distance.",
        keyConcepts: [
          'Restoring Force F = -k * x',
          'Angular Frequency ω = sqrt(k / m)',
          'Displacement x(t) = A * cos(ω * t)',
          'Total Mechanical Energy E = 1/2 * k * A^2'
        ],
        realWorldApplication: 'Vehicle suspension shock absorbers, earthquake dampers, atomic lattice vibrations, and mechanical clocks.',
        formulaSummary: 'F = -k * x | T = 2 * pi * sqrt(m / k) | E = 1/2 * k * A^2'
      },
      variables: [
        { key: 'k', label: 'Spring Constant (k)', min: 10, max: 200, step: 5, default: 50, unit: 'N/m' },
        { key: 'm', label: 'Mass (m)', min: 0.5, max: 10, step: 0.5, default: 2, unit: 'kg' },
        { key: 'A', label: 'Amplitude (A)', min: 0.1, max: 2, step: 0.1, default: 0.8, unit: 'm' }
      ],
      computedVars: [
        { key: 'omega', label: 'Angular Freq (ω)', expr: 'sqrt(k / m)', unit: 'rad/s' },
        { key: 'period', label: 'Period (T)', expr: '2 * pi * sqrt(m / k)', unit: 's' },
        { key: 'x', label: 'Displacement (x)', expr: 'A * cos(sqrt(k / m) * t)', unit: 'm' },
        { key: 'v', label: 'Velocity (v)', expr: '-A * sqrt(k / m) * sin(sqrt(k / m) * t)', unit: 'm/s' },
        { key: 'F', label: 'Restoring Force (F)', expr: '-k * A * cos(sqrt(k / m) * t)', unit: 'N' },
        { key: 'PE', label: 'Potential Energy', expr: '0.5 * k * (A * cos(sqrt(k / m) * t))^2', unit: 'J' },
        { key: 'KE', label: 'Kinetic Energy', expr: '0.5 * m * (-A * sqrt(k / m) * sin(sqrt(k / m) * t))^2', unit: 'J' }
      ],
      canvasPrimitives: [
        { id: 'sp1', type: 'spring', label: 'Coil Spring', color: '#a855f7', xExpr: '0', lengthExpr: '150 + A * cos(sqrt(k / m) * t) * 50' },
        { id: 'm1', type: 'particle', label: 'Attached Mass Block', color: '#ec4899', xExpr: 'A * cos(sqrt(k / m) * t) * 50', yExpr: '0', radiusExpr: '20' },
        { id: 'fv', type: 'vector', label: 'Restoring Force Vector', color: '#eab308', xExpr: 'A * cos(sqrt(k / m) * t) * 50', yExpr: '0', vxExpr: '-k * A * cos(sqrt(k / m) * t) * 0.5', vyExpr: '0' }
      ],
      chart: {
        xAxisVar: 't',
        yAxisExpr: 'A * cos(sqrt(k / m) * t)',
        xLabel: 'Time (s)',
        yLabel: 'Displacement x(t) [m]'
      },
      derivation: {
        title: 'Derivation of Simple Harmonic Motion Differential Equation',
        steps: [
          { stepNumber: 1, label: "Newton's Second Law & Hooke's Law", formula: 'F = m a = -k x', explanation: 'Substitute acceleration a = d²x/dt².' },
          { stepNumber: 2, label: 'Differential Equation', formula: '\\frac{d^2x}{dt^2} + \\frac{k}{m} x = 0', explanation: 'Define angular frequency squared ω² = k / m.' },
          { stepNumber: 3, label: 'Solution for Displacement', formula: 'x(t) = A \\cos(\\omega t + \\phi)', explanation: 'Amplitude A represents the maximum compression or extension.' }
        ]
      },
      quiz: [
        { id: 'sq1', question: 'If spring constant k is quadrupled, what happens to the period T of oscillation?', options: ['Doubles', 'Halves', 'Stays same', 'Quadruples'], correctIndex: 1, hint: 'T = 2 * pi * sqrt(m / k). Square root of 1/4 is 1/2.', explanation: 'Increasing k fourfold reduces period T by half, causing faster oscillations.' }
      ]
    };
  }

  // 5. Simple Pendulum / Gravity
  if (p.includes('pendulum') || p.includes('swing') || p.includes('clock') || p.includes('gravity')) {
    return {
      id,
      title: capitalize(prompt) || 'Simple Pendulum Dynamics',
      description: 'Analyze small-angle harmonic motion, string length effects, and gravitational acceleration.',
      subject: 'Physics',
      classLevel: 'Class 9',
      category: 'Gravitation & Motion',
      createdAt,
      theory: {
        overview: 'A simple pendulum consists of a mass m suspended from a light string of length L. For small angular displacements, it exhibits simple harmonic motion.',
        keyConcepts: [
          'Period T = 2 * pi * sqrt(L / g)',
          'Period is independent of mass m for small angles',
          'Restoring Torque τ = -m * g * L * sin(theta)',
          'Small angle approximation: sin(theta) ≈ theta'
        ],
        realWorldApplication: 'Grandfather clocks, seismometers, amusement park rides, and gravimeters.',
        formulaSummary: 'T = 2 * pi * sqrt(L / g) | theta(t) = theta_0 * cos(sqrt(g / L) * t)'
      },
      variables: [
        { key: 'L', label: 'String Length (L)', min: 0.2, max: 5, step: 0.1, default: 1.5, unit: 'm' },
        { key: 'g', label: 'Gravity (g)', min: 1.6, max: 25, step: 0.1, default: 9.8, unit: 'm/s²' },
        { key: 'theta0', label: 'Release Angle (θ₀)', min: 2, max: 30, step: 1, default: 15, unit: '°' }
      ],
      computedVars: [
        { key: 'omega', label: 'Angular Velocity (ω)', expr: 'sqrt(g / L)', unit: 'rad/s' },
        { key: 'period', label: 'Period (T)', expr: '2 * pi * sqrt(L / g)', unit: 's' },
        { key: 'angle', label: 'Current Angle (θ)', expr: 'theta0 * cos(sqrt(g / L) * t)', unit: '°' },
        { key: 'x', label: 'Bob X', expr: 'L * sin(theta0 * pi / 180 * cos(sqrt(g / L) * t))', unit: 'm' },
        { key: 'y', label: 'Bob Y', expr: 'L * (1 - cos(theta0 * pi / 180 * cos(sqrt(g / L) * t)))', unit: 'm' }
      ],
      canvasPrimitives: [
        { id: 'pend1', type: 'pendulum', label: 'Simple Pendulum Bob', color: '#10b981', lengthExpr: 'L * 80', angleExpr: 'theta0 * pi / 180 * cos(sqrt(g / L) * t)', radiusExpr: '16' }
      ],
      chart: {
        xAxisVar: 't',
        yAxisExpr: 'theta0 * cos(sqrt(g / L) * t)',
        xLabel: 'Time (s)',
        yLabel: 'Angle θ(t) [deg]'
      },
      derivation: {
        title: 'Derivation of Pendulum Period Formula',
        steps: [
          { stepNumber: 1, label: 'Restoring Torque', formula: '\\tau = -m g L \\sin(\\theta) = I \\alpha', explanation: 'Moment of inertia for point mass I = m L².' },
          { stepNumber: 2, label: 'Small Angle Approximation', formula: '\\sin(\\theta) \\approx \\theta', explanation: 'Valid for angles less than ~15 degrees.' },
          { stepNumber: 3, label: 'SHM Form', formula: '\\frac{d^2\\theta}{dt^2} + \\frac{g}{L}\\theta = 0', explanation: 'Yields period T = 2\\pi\\sqrt{\\frac{L}{g}}.' }
        ]
      },
      quiz: [
        { id: 'pq1', question: 'How does doubling the mass of the bob change the pendulum period T?', options: ['Doubles', 'Halves', 'No change', 'Increases by sqrt(2)'], correctIndex: 2, hint: 'Look at the period formula T = 2*pi*sqrt(L/g). Does m appear?', explanation: 'Pendulum period depends only on length L and gravity g, not mass m.' }
      ]
    };
  }

  // 6. Wave Motion / Sound / Interference
  if (p.includes('wave') || p.includes('sound') || p.includes('frequency') || p.includes('doppler') || p.includes('optics') || p.includes('light')) {
    return {
      id,
      title: capitalize(prompt) || 'Wave Motion & Harmonic Frequency',
      description: 'Visualize sinusoidal transverse wave propagation, wavelength, frequency, and phase velocity.',
      subject: 'Physics',
      classLevel: 'Class 10',
      category: 'Waves & Optics',
      createdAt,
      theory: {
        overview: 'A wave is a disturbance that transfers energy through matter or space with little or no associated mass transport.',
        keyConcepts: [
          'Wave speed v = f * lambda',
          'Angular frequency ω = 2 * pi * f',
          'Wave number k = 2 * pi / lambda',
          'Wave equation y(x,t) = A * sin(k * x - ω * t)'
        ],
        realWorldApplication: 'Acoustic musical instruments, fiber optic telecommunications, radio broadcasting, and medical ultrasound.',
        formulaSummary: 'v = f * lambda | y(x,t) = A * sin(2*pi*f*t - 2*pi*x/lambda)'
      },
      variables: [
        { key: 'A', label: 'Amplitude (A)', min: 5, max: 50, step: 1, default: 25, unit: 'cm' },
        { key: 'f', label: 'Frequency (f)', min: 0.5, max: 10, step: 0.5, default: 2, unit: 'Hz' },
        { key: 'lambda', label: 'Wavelength (λ)', min: 20, max: 200, step: 5, default: 80, unit: 'cm' }
      ],
      computedVars: [
        { key: 'v', label: 'Wave Speed (v)', expr: 'f * lambda', unit: 'cm/s' },
        { key: 'period', label: 'Period (T)', expr: '1 / f', unit: 's' },
        { key: 'omega', label: 'Angular Freq (ω)', expr: '2 * pi * f', unit: 'rad/s' },
        { key: 'k', label: 'Wave Number (k)', expr: '2 * pi / lambda', unit: 'rad/cm' }
      ],
      canvasPrimitives: [
        { id: 'w1', type: 'wave', label: 'Sinusoidal Transverse Wave', color: '#06b6d4', valueExpr: 'A * sin(2 * pi * f * t - 2 * pi * x / lambda)' }
      ],
      chart: {
        xAxisVar: 't',
        yAxisExpr: 'A * sin(2 * pi * f * t)',
        xLabel: 'Time (s)',
        yLabel: 'Displacement y(t) [cm]'
      },
      derivation: {
        title: 'Wave Speed Equation Derivation',
        steps: [
          { stepNumber: 1, label: 'Definition of Speed', formula: 'v = \\frac{\\text{distance}}{\\text{time}}', explanation: 'In one period T, the wave travels one wavelength λ.' },
          { stepNumber: 2, label: 'Substituting Frequency', formula: 'f = \\frac{1}{T} \\implies v = f \\lambda', explanation: 'Fundamental relation linking frequency, speed, and wavelength.' }
        ]
      },
      quiz: [
        { id: 'wq1', question: 'If wave frequency doubles while medium speed remains constant, what happens to wavelength λ?', options: ['Doubles', 'Halves', 'Quadruples', 'Unchanged'], correctIndex: 1, hint: 'v = f * λ. If v is constant and f doubles, λ must...', explanation: 'Since v = f * λ, wavelength is inversely proportional to frequency.' }
      ]
    };
  }

  // 7. Electric Field / Ohm's Law / Circuit Dynamics
  if (p.includes('electric') || p.includes('circuit') || p.includes('ohm') || p.includes('current') || p.includes('voltage') || p.includes('resistor') || p.includes('charge')) {
    return {
      id,
      title: capitalize(prompt) || "Ohm's Law & DC Circuit Electronics",
      description: 'Simulate voltage, current, resistance relationships, power dissipation, and electron flow in DC circuits.',
      subject: 'Physics',
      classLevel: 'Class 10',
      category: 'Electricity & Magnetism',
      createdAt,
      theory: {
        overview: "Ohm's law states that the current through a conductor between two points is directly proportional to the voltage across the two points.",
        keyConcepts: [
          "Ohm's Law: V = I * R",
          'Electrical Power P = V * I = I^2 * R = V^2 / R',
          'Current is rate of flow of electric charge: I = Q / t',
          'Series resistance R_eq = R1 + R2 | Parallel resistance 1/R_eq = 1/R1 + 1/R2'
        ],
        realWorldApplication: 'Power grids, consumer electronics, battery storage management, and printed circuit board (PCB) design.',
        formulaSummary: 'V = I * R | P = I^2 * R'
      },
      variables: [
        { key: 'V', label: 'Voltage (V)', min: 1, max: 48, step: 1, default: 12, unit: 'V' },
        { key: 'R', label: 'Resistance (R)', min: 1, max: 100, step: 1, default: 10, unit: 'Ω' }
      ],
      computedVars: [
        { key: 'I', label: 'Current (I)', expr: 'V / R', unit: 'A' },
        { key: 'P', label: 'Power (P)', expr: 'V * V / R', unit: 'W' },
        { key: 'energy', label: 'Energy Dissipated in 60s', expr: 'V * V / R * 60', unit: 'J' }
      ],
      canvasPrimitives: [
        { id: 'c1', type: 'circuit', label: 'DC Resistor Circuit Loop', color: '#f59e0b', valueExpr: 'V / R' }
      ],
      chart: {
        xAxisVar: 'V',
        yAxisExpr: 'V / R',
        xLabel: 'Voltage (V)',
        yLabel: 'Current (A)'
      },
      derivation: {
        title: 'Joule Heating & Electrical Power Derivation',
        steps: [
          { stepNumber: 1, label: 'Work Done by Electric Field', formula: 'W = V \\cdot Q', explanation: 'Work to move charge Q across voltage V.' },
          { stepNumber: 2, label: 'Power Definition', formula: 'P = \\frac{W}{t} = V \\cdot \\frac{Q}{t} = V I', explanation: 'Charge per unit time is electric current I.' },
          { stepNumber: 3, label: 'Substituting Ohm\'s Law', formula: 'P = I^2 R = \\frac{V^2}{R}', explanation: 'Heat power generated in a resistor.' }
        ]
      },
      quiz: [
        { id: 'eq1', question: 'If voltage across a fixed resistor is doubled, how does power dissipation change?', options: ['Doubles', 'Halves', 'Quadruples', 'Stays same'], correctIndex: 2, hint: 'P = V^2 / R. Squaring 2 yields...', explanation: 'Power scales with voltage squared (V^2), so doubling voltage quadruples power.' }
      ]
    };
  }

  // 8. Generic/Universal Fallback Prompt Synthesizer
  return {
    id,
    title: capitalize(prompt) || 'Custom Scientific Interactive Simulation',
    description: `Dynamic client-synthesized simulation for: "${prompt}". Explore mathematical relationships and real-time parameters.`,
    subject: p.includes('math') || p.includes('calculus') || p.includes('function') ? 'Mathematics' : p.includes('chem') || p.includes('acid') || p.includes('reaction') ? 'Chemistry' : 'Physics',
    classLevel: 'General',
    category: 'Interactive STEM Model',
    createdAt,
    theory: {
      overview: `This simulation models the principles underlying "${prompt}". Adjust the control variables below to observe mathematical scaling and physical behavior in real time.`,
      keyConcepts: [
        `Primary variable interaction derived from user prompt: "${prompt}"`,
        'Parametric function evaluation engine computes instantaneous state at time t',
        'Real-time data telemetry logs dynamic output metrics onto the chart ledger',
        'Interactive controls allow hypothesis testing and predictive verification'
      ],
      realWorldApplication: `Engineering design, computer graphics simulation, scientific research, and educational experiment modeling for ${prompt}.`,
      formulaSummary: 'y(t) = A * sin(f * t) * exp(-d * t) + offset'
    },
    variables: [
      { key: 'A', label: 'Primary Scale (A)', min: 1, max: 100, step: 1, default: 50, unit: 'units' },
      { key: 'f', label: 'Frequency / Rate (f)', min: 0.1, max: 5, step: 0.1, default: 1, unit: 'Hz' },
      { key: 'd', label: 'Damping / Decay (d)', min: 0, max: 1, step: 0.05, default: 0.1, unit: '1/s' }
    ],
    computedVars: [
      { key: 'y', label: 'System Response y(t)', expr: 'A * sin(2 * pi * f * t) * exp(-d * t)', unit: 'val' },
      { key: 'env', label: 'Envelope Bounds', expr: 'A * exp(-d * t)', unit: 'val' }
    ],
    canvasPrimitives: [
      { id: 'gen1', type: 'particle', label: 'Dynamic State Marker', color: '#6366f1', xExpr: 't * 30', yExpr: 'A * sin(2 * pi * f * t) * exp(-d * t)', radiusExpr: '14' },
      { id: 'gen2', type: 'wave', label: 'Damped Response Curve', color: '#ec4899', valueExpr: 'A * sin(2 * pi * f * t) * exp(-d * t)' }
    ],
    chart: {
      xAxisVar: 't',
      yAxisExpr: 'A * sin(2 * pi * f * t) * exp(-d * t)',
      xLabel: 'Time (s)',
      yLabel: 'Output State y(t)'
    },
    derivation: {
      title: 'Mathematical Formulation of Damped Dynamic Response',
      steps: [
        { stepNumber: 1, label: 'Harmonic Carrier Term', formula: 'S(t) = A \\sin(2\\pi f t)', explanation: 'Oscillatory component driven by frequency f.' },
        { stepNumber: 2, label: 'Exponential Decay Factor', formula: 'E(t) = e^{-d t}', explanation: 'Attenuates amplitude over time due to damping coefficient d.' },
        { stepNumber: 3, label: 'Combined System Function', formula: 'y(t) = A \\sin(2\\pi f t) e^{-d t}', explanation: 'Models energy loss in real physical systems.' }
      ]
    },
    quiz: [
      { id: 'gq1', question: `In this simulation for "${prompt}", what effect does increasing damping coefficient d have?`, options: ['Increases frequency', 'Decays output amplitude faster', 'Increases peak height', 'No effect'], correctIndex: 1, hint: 'exp(-d * t) decreases faster when d is larger.', explanation: 'Higher damping causes energy to dissipate more rapidly, decaying the amplitude envelope faster.' }
    ]
  };
}

function capitalize(str: string): string {
  if (!str) return '';
  return str
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
