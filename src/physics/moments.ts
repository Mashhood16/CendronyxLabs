export interface MassObject {
  id: string;
  mass: number; // kg
  position: number; // meters from fulcrum (negative is left, positive is right)
}

export interface MomentsState {
  angle: number; // radians (0 is perfectly horizontal)
  angularVelocity: number; // rad/s
  time: number; // elapsed time
  isBalanced: boolean;
  hasHitGround: boolean;
}

export interface MomentsDataPoint {
  time: number;
  cwMoment: number; // Clockwise moment (N*m)
  acwMoment: number; // Anticlockwise moment (N*m)
  netTorque: number; // Net torque
  angleDeg: number;
}

const g = 9.81; // Earth gravity
const PLANK_MASS = 10; // kg
const PLANK_LENGTH = 10; // meters (from -5 to 5)
const MAX_ANGLE = 0.35; // ~20 degrees in radians (hits the ground)

export const calculateMomentsStep = (
  state: MomentsState,
  dt: number,
  timeScale: number,
  masses: MassObject[]
): MomentsState => {
  if (state.hasHitGround) return state;

  const actualDt = dt * timeScale;

  // 1. Calculate Torques (Moments)
  // Torque = r x F. Since force is gravity (down), torque = distance * (mass * g) * cos(angle)
  // For small angles, cos(angle) ~ 1, but we use strict math.
  const cosTheta = Math.cos(state.angle);
  
  let netTorque = 0;
  
  // Calculate torque from added masses
  for (const m of masses) {
    // positive position = clockwise torque (positive)
    // negative position = anticlockwise torque (negative)
    netTorque += (m.position * cosTheta) * (m.mass * g);
  }
  
  // Plank itself is uniform, center of mass at 0, so its torque is 0

  // 2. Calculate Moment of Inertia (I = sum(m * r^2))
  // I_plank = (1/12) * M * L^2
  let I = (1/12) * PLANK_MASS * (PLANK_LENGTH * PLANK_LENGTH);
  for (const m of masses) {
    I += m.mass * (m.position * m.position);
  }

  // Add rotational friction (dampening)
  // netTorque drives positive angular velocity for ACW, but here R3F angle is Z.
  // Actually, R3F Z rotation: positive is counter-clockwise.
  // Above, clockwise torque is positive. So positive torque should DECREASE angle.
  // Let's keep the sign convention: Torque is Clockwise positive.
  // So alpha (clockwise) = netTorque / I.
  // Friction opposes current velocity. Since angularVelocity is the rate of change of the angle (which goes negative for CW torque),
  // let's apply friction directly against the velocity.
  // We'll calculate alpha after deciding the sign of velocity relative to torque.
  // Let's just dampen the angularVelocity directly in the euler step:

  // 3. Angular Acceleration (alpha = tau / I)
  // netTorque is clockwise positive.
  let angularAcceleration = netTorque / I;

  // 4. Update Velocity and Angle
  let newVelocity = state.angularVelocity + angularAcceleration * actualDt;
  
  // Apply dampening to velocity directly
  newVelocity *= Math.pow(0.9, actualDt * 60); // decay 10% per frame at 60fps

  let angle = state.angle - newVelocity * actualDt; // subtract because CW torque (pos) decreases R3F angle

  let hasHitGround = false;
  let isBalanced = false;

  // Check boundaries and apply restitution (bounce)
  if (angle <= -MAX_ANGLE) {
    angle = -MAX_ANGLE;
    hasHitGround = true;
    newVelocity = -newVelocity * 0.4; // Bounce with 0.4 restitution
  } else if (angle >= MAX_ANGLE) {
    angle = MAX_ANGLE;
    hasHitGround = true;
    newVelocity = -newVelocity * 0.4; // Bounce
  }

  // Check balanced
  if (Math.abs(netTorque) < 0.5 && Math.abs(angle) < 0.02 && Math.abs(newVelocity) < 0.05) {
    isBalanced = true;
    hasHitGround = false; // it's stable horizontally
    newVelocity = 0;
    angle = 0; // snap perfectly to 0 for a satisfying visual lock
  }

  return {
    angle,
    angularVelocity: newVelocity,
    time: state.time + actualDt,
    isBalanced,
    hasHitGround
  };
};

export const extractMomentsData = (masses: MassObject[], state: MomentsState): MomentsDataPoint => {
  let cwMoment = 0;
  let acwMoment = 0;
  
  const cosTheta = Math.cos(state.angle);

  for (const m of masses) {
    const torque = (m.position * cosTheta) * (m.mass * g);
    if (torque > 0) {
      cwMoment += torque;
    } else {
      acwMoment += Math.abs(torque);
    }
  }

  return {
    time: parseFloat(state.time.toFixed(2)),
    cwMoment: parseFloat(cwMoment.toFixed(1)),
    acwMoment: parseFloat(acwMoment.toFixed(1)),
    netTorque: parseFloat((cwMoment - acwMoment).toFixed(1)),
    angleDeg: parseFloat((state.angle * (180 / Math.PI)).toFixed(1))
  };
};
