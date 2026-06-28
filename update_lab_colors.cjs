const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/mashh/.gemini/antigravity/scratch/virtuallab/src';

const replacements = [
  { regex: /bg-\[#1c1c1e\]/g, replacement: 'bg-[#121212]' },
  { regex: /border-\[#1c1c1e\]/g, replacement: 'border-[#1c1b1b]' },
  { regex: /border-\[#2a2a2e\]/g, replacement: 'border-[#1c1b1b]' },
  { regex: /bg-slate-900/g, replacement: 'bg-[#000000]' },
  { regex: /bg-slate-800/g, replacement: 'bg-[#121212]' },
  { regex: /border-slate-800/g, replacement: 'border-[#1c1b1b]' },
  { regex: /border-slate-700/g, replacement: 'border-[#1c1b1b]' },
];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const rule of replacements) {
        content = content.replace(rule.regex, rule.replacement);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

walk(srcDir);
console.log('All lab colors updated to match the global theme.');
