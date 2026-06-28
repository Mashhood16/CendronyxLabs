const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/mashh/.gemini/antigravity/scratch/virtuallab/src';

let counts = {
  'bg-[#1c1c1e]': 0,
  'border-slate-800': 0,
  'border-slate-700': 0,
  'bg-slate-800': 0,
  'bg-slate-900': 0,
  'bg-[#000000]': 0,
};

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const key in counts) {
        const regex = new RegExp(key.replace(/\[/g, '\\[').replace(/\]/g, '\\]'), 'g');
        const matches = content.match(regex);
        if (matches) {
          counts[key] += matches.length;
        }
      }
    }
  }
}

walk(srcDir);
console.log(JSON.stringify(counts, null, 2));
