export interface MaterialProps {
  name: string;
  youngsModulus: number; // E (GPa)
  yieldStrength: number; // MPa
  ultimateStrength: number; // MPa
  fractureStrain: number; // unitless (e.g. 0.15 for 15%)
}

export const MATERIALS: Record<string, MaterialProps> = {
  Aluminum: { name: 'Aluminum', youngsModulus: 69, yieldStrength: 275, ultimateStrength: 310, fractureStrain: 0.15 },
  Copper:   { name: 'Copper',   youngsModulus: 110, yieldStrength: 210, ultimateStrength: 220, fractureStrain: 0.25 },
  Steel:    { name: 'Steel',    youngsModulus: 200, yieldStrength: 400, ultimateStrength: 500, fractureStrain: 0.12 }
};

export type MatterStatePhase = 'Elastic' | 'Plastic' | 'Fractured';

export interface MatterState {
  force: number; // kN (KiloNewtons) applied
  stress: number; // MPa
  strain: number; // unitless
  extension: number; // mm (delta L)
  phase: MatterStatePhase;
}

export const calculateMatterState = (
  appliedForceKN: number,
  originalLengthMM: number, // mm
  radiusMM: number, // mm
  materialKey: string,
  // We track max force ever applied to handle plastic deformation (doesn't return to 0)
  maxForceAppliedKN: number 
): MatterState => {
  const mat = MATERIALS[materialKey];
  
  // Calculate Area in mm^2. (1 mm^2 = 10^-6 m^2)
  const area = Math.PI * radiusMM * radiusMM;
  
  // Applied Force in N
  const forceN = appliedForceKN * 1000;
  
  // Engineering Stress = Force / Area. N/mm^2 is exactly equal to MPa.
  const stressMPa = forceN / area;

  // Max stress ever experienced
  const maxStressMPa = (maxForceAppliedKN * 1000) / area;

  let strain = 0;
  let phase: MatterStatePhase = 'Elastic';

  // Has it fractured?
  if (maxStressMPa >= mat.ultimateStrength) {
    phase = 'Fractured';
    // If it fractures, it snaps and stress goes to 0 but strain remains at fracture point
    strain = mat.fractureStrain;
    return {
      force: appliedForceKN,
      stress: 0,
      strain: strain,
      extension: strain * originalLengthMM,
      phase
    };
  }

  // E is in GPa. 1 GPa = 1000 MPa.
  const E_MPa = mat.youngsModulus * 1000;

  if (maxStressMPa <= mat.yieldStrength) {
    // Completely Elastic Region
    // Hooke's Law: Stress = E * Strain => Strain = Stress / E
    strain = stressMPa / E_MPa;
    phase = 'Elastic';
  } else {
    // Plastic Region
    // It has yielded. We model the plastic curve as a simple quadratic or empirical curve 
    // reaching from (yieldStrength, yieldStrain) to (ultimateStrength, fractureStrain).
    phase = 'Plastic';

    const yieldStrain = mat.yieldStrength / E_MPa;
    
    // We need to find the "current" strain based on the stress.
    // However, if the user lowers the force (stressMPa < maxStressMPa), 
    // it unloads parallel to the elastic line (slope E).
    
    // First, find the maximum strain reached at maxStressMPa
    const plasticStressRatio = (maxStressMPa - mat.yieldStrength) / (mat.ultimateStrength - mat.yieldStrength);
    // Simple interpolation for the plastic region shape (using sqrt for a typical curve shape)
    const maxStrain = yieldStrain + Math.sqrt(plasticStressRatio) * (mat.fractureStrain - yieldStrain);

    if (stressMPa < maxStressMPa) {
      // Unloading elastically from max point
      // Strain drops by deltaStress / E
      const strainRecovery = (maxStressMPa - stressMPa) / E_MPa;
      strain = maxStrain - strainRecovery;
    } else {
      // Loading plastically
      strain = maxStrain;
    }
  }

  return {
    force: appliedForceKN,
    stress: stressMPa,
    strain: strain,
    extension: strain * originalLengthMM,
    phase
  };
};
