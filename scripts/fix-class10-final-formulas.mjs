/**
 * Fix Class 10 final formulas that are literal text in JSX.
 * Converts:
 *   <p className="text-xl font-bold font-mono text-white mt-1">FORMULA</p>
 * To:
 *   <div className="text-xl font-bold text-white mt-1"><MathFormula formula="FORMULA" className="text-xl font-bold" /></div>
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

  // Match literal text final formulas: <p className="text-xl...">FORMULA</p>
  // The formula is a literal text between the > and </p>
  modified = modified.replace(
    /<p className="text-xl font-bold font-mono text-white mt-1">([^<]+)<\/p>/g,
    (match, formula) => {
      // Escape any special characters in the formula for the JSX attribute
      const escaped = formula.replace(/"/g, '&quot;');
      // Don't escape what's already valid
      return `<div className="text-xl font-bold text-white mt-1"><MathFormula formula="${escaped}" className="text-xl font-bold" /></div>`;
    }
  );

  // Also handle text-2xl variant
  modified = modified.replace(
    /<p className="text-2xl font-bold font-mono text-white mt-1">([^<]+)<\/p>/g,
    (match, formula) => {
      const escaped = formula.replace(/"/g, '&quot;');
      return `<div className="text-2xl font-bold text-white mt-1"><MathFormula formula="${escaped}" className="text-2xl font-bold" /></div>`;
    }
  );

  if (modified !== content) {
    writeFileSync(filepath, modified);
    console.log('Fixed final formula: ' + name);
    updated++;
  } else {
    console.log('No change: ' + name);
  }
}

console.log('\nFixed ' + updated + ' files.');
