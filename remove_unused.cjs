const fs = require('fs');

function removeImports(file, importsToRemove) {
  let content = fs.readFileSync(file, 'utf8');
  importsToRemove.forEach(imp => {
    const regex = new RegExp(`\\s*,?\\s*${imp}\\b`, 'g');
    content = content.replace(regex, '');
  });
  // Clean up empty braces if any
  content = content.replace(/{\s*}/g, '{}');
  fs.writeFileSync(file, content);
}

removeImports('src/components/LabS8AcidLitmus.tsx', ['Droplet']);
removeImports('src/components/LabS8ChemicalReactionSigns.tsx', ['RefreshCw', 'Beaker']);
removeImports('src/components/LabS8ConservationMass.tsx', ['Scale']);
removeImports('src/components/LabS8Neutralization.tsx', ['useEffect']);

console.log('Unused imports removed.');
