// Constants
export const G = 6.674e-11; // Gravitational constant
export const M_EARTH = 5.972e24; // Mass of Earth (kg)
export const R_EARTH = 6.371e6; // Radius of Earth (m)

export interface SatelliteState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  time: number;
  crashed: boolean;
}

export interface PhysicsDataPoint {
  time: number;
  altitude: number; // km
  velocity: number; // m/s
  gravity: number; // m/s^2
}

// Helper function to calculate acceleration at a given position
const getAcceleration = (px: number, py: number) => {
  const r2 = px * px + py * py;
  const r = Math.sqrt(r2);
  if (r < 0.1) return { ax: 0, ay: 0 }; // prevent singularity
  const F_gravity = (G * M_EARTH) / r2;
  return {
    ax: -F_gravity * (px / r),
    ay: -F_gravity * (py / r)
  };
};

/**
 * Calculates a single physics step using Runge-Kutta 4th Order (RK4) integration
 */
export const calculateNextState = (
  state: SatelliteState,
  dt: number,
  timeScale: number // e.g., 1000x real time
): SatelliteState => {
  if (state.crashed) return state;

  const actualDt = dt * timeScale;
  
  const x = state.x;
  const y = state.y;
  const vx = state.vx;
  const vy = state.vy;

  // Runge-Kutta 4th Order (RK4) Integration
  // k1
  const a1 = getAcceleration(x, y);
  const k1_vx = a1.ax * actualDt;
  const k1_vy = a1.ay * actualDt;
  const k1_x = vx * actualDt;
  const k1_y = vy * actualDt;

  // k2
  const a2 = getAcceleration(x + 0.5 * k1_x, y + 0.5 * k1_y);
  const k2_vx = a2.ax * actualDt;
  const k2_vy = a2.ay * actualDt;
  const k2_x = (vx + 0.5 * k1_vx) * actualDt;
  const k2_y = (vy + 0.5 * k1_vy) * actualDt;

  // k3
  const a3 = getAcceleration(x + 0.5 * k2_x, y + 0.5 * k2_y);
  const k3_vx = a3.ax * actualDt;
  const k3_vy = a3.ay * actualDt;
  const k3_x = (vx + 0.5 * k2_vx) * actualDt;
  const k3_y = (vy + 0.5 * k2_vy) * actualDt;

  // k4
  const a4 = getAcceleration(x + k3_x, y + k3_y);
  const k4_vx = a4.ax * actualDt;
  const k4_vy = a4.ay * actualDt;
  const k4_x = (vx + k3_vx) * actualDt;
  const k4_y = (vy + k3_vy) * actualDt;

  // Combine
  const newVx = vx + (k1_vx + 2 * k2_vx + 2 * k3_vx + k4_vx) / 6;
  const newVy = vy + (k1_vy + 2 * k2_vy + 2 * k3_vy + k4_vy) / 6;
  const newX = x + (k1_x + 2 * k2_x + 2 * k3_x + k4_x) / 6;
  const newY = y + (k1_y + 2 * k2_y + 2 * k3_y + k4_y) / 6;

  const currentR = Math.sqrt(newX * newX + newY * newY);
  const hasCrashed = currentR <= R_EARTH;

  return {
    x: newX,
    y: newY,
    vx: newVx,
    vy: newVy,
    time: state.time + actualDt,
    crashed: hasCrashed,
  };
};

/**
 * Extracts student-friendly data points from the raw state
 */
export const extractDataPoint = (state: SatelliteState): PhysicsDataPoint => {
  const r = Math.sqrt(state.x * state.x + state.y * state.y);
  const altitude = (r - R_EARTH) / 1000; // in km
  const velocity = Math.sqrt(state.vx * state.vx + state.vy * state.vy);
  const gravity = (G * M_EARTH) / (r * r);

  return {
    time: parseFloat((state.time / 60).toFixed(2)), // store time in minutes for easier reading
    altitude: parseFloat(Math.max(0, altitude).toFixed(1)),
    velocity: parseFloat(velocity.toFixed(1)),
    gravity: parseFloat(gravity.toFixed(3)),
  };
};

// Calculate initial velocity required for a perfectly circular orbit at a given altitude
export const getCircularOrbitVelocity = (altitudeKm: number): number => {
  const r = R_EARTH + altitudeKm * 1000;
  return Math.sqrt((G * M_EARTH) / r);
};
