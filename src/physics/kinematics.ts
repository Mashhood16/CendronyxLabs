export interface KinematicsState {
  y: number; // current height (m)
  v: number; // current velocity (m/s) downwards
  time: number; // elapsed time (s)
  hasHitGround: boolean;
}

export interface KinematicsDataPoint {
  time: number;
  height: number;
  velocity: number;
}

// Planetary gravity constants (m/s^2)
export const GRAVITY: Record<string, number> = {
  Earth: 9.81,
  Mars: 3.72,
  Moon: 1.62
};

/**
 * Calculates a single physics step for an object falling
 */
export const calculateKinematicsStep = (
  state: KinematicsState,
  dt: number,
  timeScale: number,
  g: number,
  isVacuum: boolean,
  mass: number = 1, // kg
  dragCoefficient: number = 0.47, // Sphere drag
  airDensity: number = 1.225, // kg/m^3 (approximate Earth sea level)
  crossSectionArea: number = 0.03 // m^2
): KinematicsState => {
  if (state.hasHitGround) return state;

  const actualDt = dt * timeScale;
  
  // Calculate net acceleration
  let acceleration = g;
  
  if (!isVacuum && g > 2) { // Simplify: assume Moon has no air, Mars has 1% (ignoring for this sim, just using isVacuum toggle)
    const vSquared = state.v * state.v;
    const dragForce = 0.5 * airDensity * vSquared * dragCoefficient * crossSectionArea;
    const dragAccel = dragForce / mass;
    // Gravity pulls down (+ velocity), drag pushes up (- acceleration)
    acceleration = g - dragAccel;
    
    // Terminal velocity edge case: can't accelerate upwards from drag alone when falling
    if (acceleration < 0) acceleration = 0;
  }

  const v = state.v + acceleration * actualDt;
  const y = state.y - v * actualDt;

  let hasHitGround = false;
  let finalY = y;
  
  if (y <= 0) {
    hasHitGround = true;
    finalY = 0;
  }

  return {
    y: finalY,
    v: hasHitGround ? 0 : v,
    time: state.time + actualDt,
    hasHitGround
  };
};

export const extractKinematicsDataPoint = (state: KinematicsState): KinematicsDataPoint => {
  return {
    time: parseFloat(state.time.toFixed(2)),
    height: parseFloat(state.y.toFixed(2)),
    velocity: parseFloat(state.v.toFixed(2)),
  };
};
