import fs from 'fs';
import path from 'path';

const CONFIG_FILE = 'src/data/class11Derivations.ts';
const MISSING_FILE = 'src/data/class11DerivationsMissing.ts';
const COMPONENTS_DIR = 'src/components';
const LAB_ROUTES = 'src/routes/labRoutes.ts';
const LAB_MODULES = 'src/data/labModules.ts';

// ============================================================
// STEP 1: Extract missing derivation names and keys from the file
// ============================================================
const missingContent = fs.readFileSync(MISSING_FILE, 'utf8');

// Extract lines that have key definitions like "projectile_time_flight: {"
// These follow the pattern:  key_name: {
const keyMatches = missingContent.matchAll(/^\s{2}(\w+):\s*\{/gm);
const missingEntries = [];
for (const match of keyMatches) {
  missingEntries.push({ key: match[1] });
}

console.log(`Found ${missingEntries.length} missing derivation entries.`);

// Build name from key: snake_case -> PascalCase
function toPascalCase(key) {
  return key.replace(/(?:^|_)([a-z])/g, (_, c) => c.toUpperCase());
}

// ============================================================
// STEP 2: Merge into class11Derivations.ts
// ============================================================
let config = fs.readFileSync(CONFIG_FILE, 'utf8');

// Extract the entries from the missing file (between the const declaration and the closing };)
// Find the start of the object and the end
const objStart = missingContent.indexOf('{', missingContent.indexOf('MISSING_DERIVATIONS'));
const objEnd = missingContent.lastIndexOf('};');

if (objStart === -1 || objEnd === -1) {
  console.error('Could not find object boundaries in missing file.');
  process.exit(1);
}

const entriesText = missingContent.slice(objStart + 1, objEnd);

// Remove the trailing `};` from the main config and append the new entries
config = config.replace(/\n\};$/, ',\n');

// Append the new entries (they already have proper formatting)
config += entriesText + '\n};\n';

fs.writeFileSync(CONFIG_FILE, config);
console.log(`\u2705 Merged ${missingEntries.length} missing entries into class11Derivations.ts`);

// ============================================================
// STEP 3: Generate component files
// ============================================================
const TEMPLATE = (name) => `import { GenericDerivationLab } from '../components/GenericDerivationLab';
import { CLASS11_DERIVATIONS } from '../data/class11Derivations';

interface Props {
  onExit: () => void;
}

export default function LabP11Derivation${name}({ onExit }: Props) {
  const key = '${name.charAt(0).toLowerCase() + name.slice(1)}';
  const config = CLASS11_DERIVATIONS[key];
  return (
    <GenericDerivationLab
      onExit={onExit}
      config={config}
    />
  );
}
`;

missingEntries.forEach((entry) => {
  const name = toPascalCase(entry.key);
  const filePath = path.join(COMPONENTS_DIR, `LabP11Derivation${name}.tsx`);

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`  \u2139 Skipped ${name} (already exists)`);
    return;
  }

  fs.writeFileSync(filePath, TEMPLATE(name));
  console.log(`  \uD83D\uDCC4 Created LabP11Derivation${name}.tsx`);
});

// ============================================================
// STEP 4: Update labRoutes.ts
// ============================================================
let routes = fs.readFileSync(LAB_ROUTES, 'utf8');

// Add lazy imports - find the last existing class 11 derivation import
const importLines = missingEntries
  .map((entry) => {
    const name = toPascalCase(entry.key);
    return `const LabP11Derivation${name} = lazy(() => import('../components/LabP11Derivation${name}'));`;
  })
  .filter((line) => {
    // Only add if NOT already in routes
    const nameMatch = line.match(/LabP11Derivation\w+/)[0];
    return !routes.includes(nameMatch);
  })
  .join('\n');

if (importLines) {
  // Insert after the last existing p11 lazy import
  const lastP11ImportRegex = /(const LabP11Derivation\w+ = lazy\(\.\.\/components\/LabP11Derivation\w+\)\);)(?![\s\S]*const LabP11Derivation)/;
  routes = routes.replace(lastP11ImportRegex, `$1\n${importLines}`);
  console.log(`\u2705 Added ${missingEntries.length} lazy imports to labRoutes.ts`);
} else {
  console.log('  \u2139 All imports already exist in labRoutes.ts');
}

// Add module ID mappings
const routeMappings = missingEntries
  .map((entry) => {
    const name = toPascalCase(entry.key);
    return `  'p11_deriv_${entry.key}': 'LabP11Derivation${name}',`;
  })
  .filter((mapping) => !routes.includes(mapping.trim()))
  .join('\n');

if (routeMappings) {
  routes = routes.replace(
    /(\/\/ Class 12 Physics)/,
    `  // Class 11 Physics (batch 2)\n${routeMappings}\n\n$1`
  );
  console.log(`\u2705 Added module ID mappings to labRoutes.ts`);
}

fs.writeFileSync(LAB_ROUTES, routes);

// ============================================================
// STEP 5: Update labModules.ts
// ============================================================
let modules = fs.readFileSync(LAB_MODULES, 'utf8');

// Read the missing file to extract titles and descriptions
// We can extract the title and formula from the TypeScript source
const titleRegex = /title:\s*"([^"]+)"/g;
const titleMatches = [];
let tMatch;
while ((tMatch = titleRegex.exec(missingContent)) !== null) {
  titleMatches.push(tMatch[1]);
}

const formulaRegex = /finalFormula:\s*'([^']+)'/g;
const formulaMatches = [];
let fMatch;
while ((fMatch = formulaRegex.exec(missingContent)) !== null) {
  formulaMatches.push(fMatch[1]);
}

const descRegex = /finalFormulaDesc:\s*'([^']+)'/g;
const descMatches = [];
let dMatch;
while ((dMatch = descRegex.exec(missingContent)) !== null) {
  descMatches.push(dMatch[1]);
}

const bgRegex = /accentGradient:\s*'([^']+)'/g;
const bgMatches = [];
let bgMatch;
while ((bgMatch = bgRegex.exec(missingContent)) !== null) {
  bgMatches.push(bgMatch[1]);
}

// Build module entries that don't already exist
const moduleEntries = missingEntries
  .map((entry, i) => {
    const title = titleMatches[i] || entry.key;
    const formula = formulaMatches[i] || '';
    const desc = descMatches[i] || '';
    const bg = bgMatches[i] || 'from-slate-500 to-slate-600';
    const moduleId = `p11_deriv_${entry.key}`;
    // Skip if already exists
    if (modules.includes(moduleId)) return null;
    return `  { id: '${moduleId}', classLevel: '11', subject: 'physics', title: '${title.replace(/'/g, "\\'")}', desc: '${desc}: ${formula}', built: true, bg: '${bg}' },\n`;
  })
  .filter(Boolean)
  .join('');

if (moduleEntries) {
  modules = modules.replace(
    /(\s+\/\/ Class 12 Physics)/,
    `  // Class 11 Physics (batch 2)\n${moduleEntries}$1`
  );
  fs.writeFileSync(LAB_MODULES, modules);
  console.log(`\u2705 Updated labModules.ts with new entries`);
} else {
  console.log('  \u2139 All module entries already exist');
}

console.log('\n\uD83C\uDF89 All done! Run npx tsc --noEmit to verify.');
