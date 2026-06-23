export interface EnergyState {
  x: number; // Horizontal position
  y: number; // Vertical position (height)
  velocity: number; // Speed along the curve path
  time: number;
  pe: number; // Potential Energy (J)
  ke: number; // Kinetic Energy (J)
  thermal: number; // Heat energy from friction (J)
  totalE: number; // Total initial mechanical energy (J)
}

const g = 9.81;

// Define the curve: y = a * x^2
// For a nice half-pipe shape that is 10 units wide (-5 to 5), y at x=5 is 5.
// So 5 = a * 25 => a = 0.2
const A = 0.2;

export const getCurveY = (x: number) => A * x * x;

// Derivative of the curve dy/dx = 2 * a * x
const getDerivative = (x: number) => 2 * A * x;

export const calculateEnergyStep = (
  state: EnergyState,
  dt: number,
  timeScale: number,
  mass: number,
  frictionCoef: number // mu
): EnergyState => {
  const actualDt = dt * timeScale;
  
  // 1. Current State
  const x = state.x;
  const v = state.velocity; // velocity is positive for moving right along the curve, negative for left
  
  // Tangent angle theta
  const slope = getDerivative(x);
  const theta = Math.atan(slope); // Angle relative to horizontal
  
  // 2. Forces along the tangent
  // Gravity component pulling down the slope: -m*g*sin(theta)
  // (if x is positive, slope is positive, theta is positive, gravity pulls back towards x=0)
  const F_gravity_parallel = -mass * g * Math.sin(theta);
  
  // Normal force: m*g*cos(theta) + centrifugal force (m*v^2 / R)
  // Second derivative: d2y/dx2 = 2*A
  // Curvature kappa = |y''| / (1 + y'^2)^(3/2)
  const yDoublePrime = 2 * A;
  const kappa = Math.abs(yDoublePrime) / Math.pow(1 + slope * slope, 1.5);
  const R = 1 / kappa;
  
  const F_normal = mass * g * Math.cos(theta) + (mass * v * v) / R;
  
  // Friction force opposes motion
  const F_friction_mag = frictionCoef * F_normal;
  let F_friction = 0;
  
  if (Math.abs(v) > 0.01) {
    F_friction = -Math.sign(v) * F_friction_mag;
  } else {
    // If very slow, friction can stop it entirely
    if (Math.abs(F_gravity_parallel) <= F_friction_mag) {
      // Stopped
      return {
        ...state,
        velocity: 0,
        time: state.time + actualDt
      };
    } else {
      F_friction = -Math.sign(F_gravity_parallel) * F_friction_mag;
    }
  }

  // Net force along curve
  const F_net = F_gravity_parallel + F_friction;
  const acceleration = F_net / mass;
  
  // 3. Integration (Euler method along the arc length)
  // Arc length s. ds/dt = v. dx/dt = v * cos(theta)
  let newV = v + acceleration * actualDt;
  
  // Calculate horizontal distance traveled based on newV
  // If moving right (v > 0), dx is positive.
  // v is arc length velocity. v = ds/dt. ds = sqrt(dx^2 + dy^2) = dx * sqrt(1 + (dy/dx)^2)
  // dx/dt = v / sqrt(1 + (dy/dx)^2) = v * cos(theta)
  const dx = (newV * Math.cos(theta)) * actualDt;
  let newX = x + dx;
  
  // Bounds check (don't fly off the track)
  if (newX > 5) {
    newX = 5;
    newV = 0;
  } else if (newX < -5) {
    newX = -5;
    newV = 0;
  }

  const newY = getCurveY(newX);
  
  // 4. Energy Calculations
  const PE = mass * g * newY;
  const KE = 0.5 * mass * newV * newV;
  
  // Work done by friction = F_friction * distance
  // We incrementally add absolute work done by friction to thermal energy
  const arcLengthMoved = Math.abs(newV * actualDt);
  let newThermal = state.thermal + (F_friction_mag * arcLengthMoved);
  
  // Self correction to ensure perfect energy conservation display due to integration drift
  const expectedTotal = state.totalE;
  const currentSum = PE + KE + newThermal;
  
  if (Math.abs(expectedTotal - currentSum) > 0.1) {
    // Force KE to perfectly match theoretical if we drift slightly
    // This ensures the graphs look perfect for educational purposes
    // as Euler integration isn't perfectly energy conserving over long periods
    const theoreticalKE = expectedTotal - PE - newThermal;
    if (theoreticalKE >= 0) {
      newV = Math.sign(newV) * Math.sqrt((2 * theoreticalKE) / mass);
    } else {
      newV = 0;
      newThermal = expectedTotal - PE; // All leftover energy is thermal
    }
  }

  return {
    x: newX,
    y: newY,
    velocity: newV,
    time: state.time + actualDt,
    pe: PE,
    ke: 0.5 * mass * newV * newV,
    thermal: newThermal,
    totalE: expectedTotal
  };
};
