// Script to generate individual Class 12 Physics derivation components
import fs from 'fs';

// Read the config file to extract keys
const configContent = fs.readFileSync('src/data/class12Derivations.ts', 'utf8');
const exportMatch = configContent.match(/export const CLASS12_DERIVATIONS: Record<string, DerivationConfig> = \{([\s\S]*?)\};/);
if (!exportMatch) {
  console.error('Could not find CLASS12_DERIVATIONS export');
  process.exit(1);
}

// Extract keys by finding lines like "  key_name: {"
const keyPattern = /^\s+(\w[\w_]*):\s*\{/gm;
const keys = [];
let m;
while ((m = keyPattern.exec(configContent)) !== null) {
  keys.push(m[1]);
}

console.log(`Found ${keys.length} derivation keys`);

// For module IDs and display titles, also extract them
const titleMap = {};
const titlePattern = /(\w[\w_]*):\s*\{[\s\S]*?title:\s*'([^']+)'/g;
let t;
while ((t = titlePattern.exec(configContent)) !== null) {
  titleMap[t[1]] = t[2];
}

// Component name mapping
const nameMap = {
  gravitation_law: 'GravitationLaw',
  g_on_surface: 'GOnSurface',
  g_variation: 'GWithAltitude',
  orbital_velocity: 'OrbitalVelocity',
  geostationary: 'GeostationaryOrbit',
  absolute_gpe: 'AbsoluteGPE',
  gravitational_potential: 'GravPotential',
  ideal_gas_pressure: 'IdealGasPressure',
  pressure_ke: 'PressureKE',
  temperature_ke: 'TemperatureKE',
  rms_speed: 'RMSSpeed',
  shm_mass_spring: 'SHMMassSpring',
  shm_displacement: 'SHMDisplacement',
  simple_pendulum: 'SimplePendulum',
  shm_energy: 'SHMEnergy',
  youngs_double_slit: 'YoungsDoubleSlit',
  diffraction_grating: 'DiffractionGrating',
  electric_potential_point: 'ElectricPotentialPoint',
  capacitance: 'CapacitancePP',
  equivalent_capacitance: 'EquivalentCapacitance',
  capacitor_energy: 'CapacitorEnergy',
  rc_circuit: 'RCCircuit',
  ac_power: 'ACPower',
  inductive_reactance: 'InductiveReactance',
  capacitive_reactance: 'CapacitiveReactance',
  impedance: 'ImpedanceRLRC',
  photoelectric: 'PhotoelectricEffect',
  de_broglie: 'DeBroglieWavelength',
  mass_defect: 'MassDefect',
  decay_law: 'DecayLaw',
  half_life: 'HalfLifeRelation',
  wien_law: 'WiensDisplacement',
  hubble_law: 'HubbleLaw',
  coriolis: 'CoriolisForce',
  newton_cannon: 'NewtonCannonball',
};

const COMPONENT_TEMPLATE = (key, componentName) => `import GenericDerivationLab from './GenericDerivationLab';
import { CLASS12_DERIVATIONS } from '../data/class12Derivations';

export default function LabP12Derivation${componentName}({ onExit }: { onExit?: () => void }) {
  return <GenericDerivationLab onExit={onExit} config={CLASS12_DERIVATIONS.${key}} />;
}
`;

// Generate component files
let globalCtr = 0;
for (const key of keys) {
  const componentName = nameMap[key];
  if (!componentName) {
    console.warn(`Warning: No component name mapping for key "${key}"`);
    continue;
  }
  const filePath = `src/components/LabP12Derivation${componentName}.tsx`;
  const content = COMPONENT_TEMPLATE(key, componentName);
  fs.writeFileSync(filePath, content);
  globalCtr++;
  console.log(`  Created: ${filePath}`);
}

console.log(`\n=== Generated ${globalCtr} component files ===`);

// Generate labModules.ts entries
console.log('\n=== labModules.ts entries ===');
for (const key of keys) {
  const componentName = nameMap[key];
  const title = titleMap[key] || key;
  const shortTitle = title.replace(/^Derivation:\s*/, '');
  const id = `p12_deriv_${key}`;
  console.log(`  { id: '${id}', classLevel: '12', subject: 'physics', title: '${title.replace(/'/g, "\\'")}', desc: 'Interactive step-by-step derivation of ${shortTitle} with live simulation.', built: true, bg: 'from-blue-500 to-indigo-600' },`);
}

// Generate labRoutes.ts lazy imports
console.log('\n=== labRoutes.ts lazy imports ===');
for (const key of keys) {
  const componentName = nameMap[key];
  console.log(`  LabP12Derivation${componentName}: lazy(() => import('../components/LabP12Derivation${componentName}')),`);
}

// Generate labRoutes.ts module ID mappings
console.log('\n=== labRoutes.ts module ID mappings ===');
for (const key of keys) {
  const componentName = nameMap[key];
  console.log(`  'p12_deriv_${key}': 'LabP12Derivation${componentName}',`);
}
