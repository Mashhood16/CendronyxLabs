import fs from 'fs';

const c = fs.readFileSync('dist/assets/index-hE742BZ9.js', 'utf-8');

// Search for any of the SQL keywords used in replacements
const keywords = ['sqrt', 'sin', 'cos', 'tan', 'log', 'ln', 'pi', 'theta', 'omega', 'alpha', 'rho', 'phi', 'eta', 'mu', 'lambda', 'sigma', 'delta', 'constant', 'frac'];

for (const kw of keywords) {
  // Search for the pattern: .replace(/.../g, '...keyword...')
  // This would be in the compiled JS
  const regex = new RegExp('.replace\\([^,]+,[^)]*' + kw + '[^)]*\\)', 'g');
  const matches = c.match(regex);
  if (matches) {
    console.log(`Found ${matches.length} .replace() calls involving '${kw}':`);
    for (const m of matches.slice(0, 3)) {
      console.log('  ', JSON.stringify(m));
    }
    console.log();
  }
}

// Also try to find the preprocessFormula function name or any inline version
const fnMarkers = ['function preprocess', 'preprocessFormula', 'f.replace(', 'let f = formula'];
for (const marker of fnMarkers) {
  const idx = c.indexOf(marker);
  if (idx >= 0) {
    const end = Math.min(c.length, idx + 200);
    console.log(`Marker '${marker}' at ${idx}:`);
    console.log('  TEXT:', JSON.stringify(c.slice(idx, end)));
    console.log();
  }
}
