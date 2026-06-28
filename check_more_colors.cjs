const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/mashh/.gemini/antigravity/scratch/virtuallab/src';

let counts = {
  'bg-black': 0,
  'border-neutral-800': 0,
  'border-gray-800': 0,
  'text-gray-200': 0,
  'text-neutral-200': 0,
  'text-gray-400': 0,
  'text-neutral-400': 0,
  'text-slate-300': 0,
  'text-slate-400': 0,
  'text-[#a1a1aa]': 0,
  'text-[#ffffff]': 0,
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
