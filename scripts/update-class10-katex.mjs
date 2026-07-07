/**
 * Script to update all Class 10 derivation files to use MathFormula component.
 */
import { readFileSync, writeFileSync } from 'fs';

const DERIVATIONS = [
  'LabP10DerivationCriticalAngle',
  'LabP10DerivationEcho',
  'LabP10DerivationElectricalEnergy',
  'LabP10DerivationElectricPower',
  'LabP10DerivationExpansionLiquids',
  'LabP10DerivationLinearExpansion',
  'LabP10DerivationMagnification',
  'LabP10DerivationParallelResistance',
  'LabP10DerivationPhotonEnergy',
  'LabP10DerivationPotentialDivider',
  'LabP10DerivationRadioactiveDecay',
  'LabP10DerivationResistivity',
  'LabP10DerivationSeriesResistance',
  'LabP10DerivationSpecificHeatElectrical',
  'LabP10DerivationSpecificHeatMixtures',
  'LabP10DerivationTempCoefficient',
  'LabP10DerivationTransformer',
  'LabP10DerivationTransistorGain',
  'LabP10DerivationVolumetricExpansion',
  'LabP10DerivationWaveEquation',
];

let updated = 0;
for (const name of DERIVATIONS) {
  const filepath = `src/components/${name}.tsx`;
  let content = readFileSync(filepath, 'utf-8');
  let modified = content;

  // 1. Add MathFormula import after LabHeader import
  if (modified.includes("import LabHeader from './LabHeader'") && !modified.includes("import MathFormula")) {
    modified = modified.replace(
      "import LabHeader from './LabHeader'",
      "import LabHeader from './LabHeader';\nimport MathFormula from './MathFormula'"
    );
  } else if (modified.includes("import LabHeader from './LabHeader'") && !modified.includes('from \'./MathFormula\'')) {
    modified = modified.replace(
      "import LabHeader from './LabHeader'",
      "import LabHeader from './LabHeader';\nimport MathFormula from './MathFormula'"
    );
  }

  // 2. Replace final formula rendering: <p className="text-xl font-bold font-mono text-white mt-1">{name}
  // With: <div className="text-xl font-bold text-white mt-1"><MathFormula formula={name} className="text-xl font-bold" /></div>
  // The final formula is the first occurrence of text-xl font-bold font-mono text-white
  // Actually let me handle the pattern more specifically

  // Replace step formula rendering
  // <span className="text-base font-mono font-bold text-yellow-400">{step.formula}</span>
  modified = modified.replace(
    /<span className="text-base font-mono font-bold text-yellow-400">\{step\.formula\}<\/span>/g,
    '<MathFormula formula={step.formula} className="text-base font-bold text-yellow-400" />'
  );

  // Replace final formula rendering
  // Look for pattern: <p className="text-xl font-bold font-mono text-white mt-1">{...}</p>
  // This could be a variable or a literal formula string
  modified = modified.replace(
    /<p className="text-xl font-bold font-mono text-white mt-1">{([^}]+)}<\/p>/g,
    '<div className="text-xl font-bold text-white mt-1"><MathFormula formula={$1} className="text-xl font-bold" /></div>'
  );

  // Also handle text-2xl variant
  modified = modified.replace(
    /<p className="text-2xl font-bold font-mono text-white mt-1">{([^}]+)}<\/p>/g,
    '<div className="text-2xl font-bold text-white mt-1"><MathFormula formula={$1} className="text-2xl font-bold" /></div>'
  );

  if (modified !== content) {
    writeFileSync(filepath, modified);
    console.log('Updated: ' + name);
    updated++;
  } else {
    console.log('No changes: ' + name);
  }
}

console.log('\nUpdated ' + updated + ' files.');
