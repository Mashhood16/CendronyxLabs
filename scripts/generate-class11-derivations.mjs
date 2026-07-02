import fs from 'fs';

const configContent = fs.readFileSync('src/data/class11Derivations.ts', 'utf8');
const keyPattern = /^\s+(\w[\w_]*):\s*\{/gm;
const keys = [];
let m;
while ((m = keyPattern.exec(configContent)) !== null) {
  keys.push(m[1]);
}

console.log(`Found ${keys.length} derivation keys`);

const nameMap = {
  dimensional_wavelength: 'DimensionalWavelength',
  dimensional_pendulum: 'DimensionalPendulum',
  rectangular_components: 'RectangularComponents',
  first_equation: 'FirstEquation',
  second_equation: 'SecondEquation',
  third_equation: 'ThirdEquation',
  projectile_height: 'ProjectileHeight',
  projectile_range: 'ProjectileRange',
  elastic_collision: 'ElasticCollision',
  linear_angular: 'LinearAngular',
  centripetal_acceleration: 'CentripetalAcceleration',
  kinetic_energy: 'KineticEnergyDerivation',
  archimedes: 'ArchimedesUpthrust',
  continuity: 'ContinuityEquation',
  bernoulli: 'BernoulliEquation',
  carnot_efficiency: 'CarnotEfficiency',
  doppler_listener_towards: 'DopplerListenerTowards',
  stationary_waves_string: 'StationaryWavesString',
  electric_field_point: 'ElectricFieldPoint',
  drift_velocity: 'DriftVelocity',
  magnetic_force: 'MagneticForce',
  faraday_law: 'FaradayLawDerivation',
};

const COMPONENT_TEMPLATE = (key, name) => `import GenericDerivationLab from './GenericDerivationLab';
import { CLASS11_DERIVATIONS } from '../data/class11Derivations';

export default function LabP11Derivation${name}({ onExit }: { onExit?: () => void }) {
  return <GenericDerivationLab onExit={onExit} config={CLASS11_DERIVATIONS.${key}} />;
}
`;

let ctr = 0;
for (const key of keys) {
  const name = nameMap[key];
  if (!name) {
    console.warn(`Warning: No mapping for "${key}"`);
    continue;
  }
  fs.writeFileSync(`src/components/LabP11Derivation${name}.tsx`, COMPONENT_TEMPLATE(key, name));
  ctr++;
  console.log(`  Created: LabP11Derivation${name}.tsx`);
}

console.log(`\n=== Generated ${ctr} component files ===`);

// Output labModules.ts entries
console.log('\n=== labModules.ts entries ===');
for (const key of keys) {
  const name = nameMap[key];
  const id = `p11_deriv_${key}`;
  const title_key = key.replace(/_/g, ' ');
  const title = title_key.charAt(0).toUpperCase() + title_key.slice(1);
  console.log(`  { id: '${id}', classLevel: '11', subject: 'physics', title: 'Derivation: ${title}', desc: 'Interactive step-by-step derivation with live simulation.', built: true, bg: 'from-blue-500 to-indigo-600' },`);
}

// Output lazy imports
console.log('\n=== labRoutes.ts lazy imports ===');
for (const key of keys) {
  const name = nameMap[key];
  console.log(`  LabP11Derivation${name}: lazy(() => import('../components/LabP11Derivation${name}')),`);
}

// Output module ID mappings
console.log('\n=== labRoutes.ts module ID mappings ===');
for (const key of keys) {
  const name = nameMap[key];
  console.log(`  'p11_deriv_${key}': 'LabP11Derivation${name}',`);
}
