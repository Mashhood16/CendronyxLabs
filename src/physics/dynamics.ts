export interface DynamicsState {
  x: number; // Position of m1 on the table (m)
  v: number; // Velocity of the system (m/s)
  time: number; // Elapsed time (s)
  isMoving: boolean;
  hasFallen: boolean; // m1 fell off the table or m2 hit the ground
  acceleration: number; // Current acceleration (m/s^2)
}

export interface DynamicsDataPoint {
  time: number;
  velocity: number;
  acceleration: number;
  isMoving: boolean;
}

// Materials and their friction coefficients (static, kinetic)
export const MATERIALS: Record<string, { us: number, uk: number }> = {
  Ice: { us: 0.1, uk: 0.03 },
  Wood: { us: 0.4, uk: 0.2 },
  Rubber: { us: 0.9, uk: 0.7 }
};

const g = 9.81; // Earth gravity

/**
 * Calculates a single physics step for a modified Atwood machine
 * (m1 on table with friction, m2 hanging)
 */
export const calculateDynamicsStep = (
  state: DynamicsState,
  dt: number,
  timeScale: number,
  m1: number, // mass on table (kg)
  m2: number, // hanging mass (kg)
  material: string
): DynamicsState => {
  if (state.hasFallen) return state;

  const actualDt = dt * timeScale;
  const { us, uk } = MATERIALS[material];

  // Forces
  const weight2 = m2 * g;
  const normal1 = m1 * g;
  const maxStaticFriction = us * normal1;
  const kineticFriction = uk * normal1;

  let acceleration = 0;
  let isMoving = state.isMoving;

  if (!isMoving) {
    // Check if hanging weight overcomes static friction
    if (weight2 > maxStaticFriction) {
      isMoving = true;
      // Start moving, acceleration uses kinetic friction
      acceleration = (weight2 - kineticFriction) / (m1 + m2);
    } else {
      // Stuck
      acceleration = 0;
    }
  } else {
    // Already moving
    acceleration = (weight2 - kineticFriction) / (m1 + m2);
    // Edge case: if kinetic friction is somehow stronger than weight, it will decelerate
    if (acceleration < 0 && state.v <= 0) {
      acceleration = 0;
      isMoving = false;
    }
  }

  let v = state.v + acceleration * actualDt;
  if (v < 0) v = 0; // Can't go backwards in this simple model

  let x = state.x + v * actualDt;

  let hasFallen = false;
  // Assume table length is 2 meters
  if (x >= 2) {
    hasFallen = true;
    x = 2;
    v = 0;
    acceleration = 0;
  }

  return {
    x,
    v,
    time: state.time + actualDt,
    isMoving,
    hasFallen,
    acceleration
  };
};

export const extractDynamicsDataPoint = (state: DynamicsState): DynamicsDataPoint => {
  return {
    time: parseFloat(state.time.toFixed(2)),
    velocity: parseFloat(state.v.toFixed(2)),
    acceleration: parseFloat(state.acceleration.toFixed(2)),
    isMoving: state.isMoving
  };
};
