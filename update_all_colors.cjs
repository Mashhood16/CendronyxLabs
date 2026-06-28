const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/mashh/.gemini/antigravity/scratch/virtuallab/src';

const replacements = [
  // Backgrounds
  { regex: /dark:bg-black/g, replacement: 'dark:bg-[#000000]' },
  { regex: /dark:bg-slate-900/g, replacement: 'dark:bg-[#000000]' },
  { regex: /dark:bg-neutral-900/g, replacement: 'dark:bg-[#000000]' },
  { regex: /dark:bg-gray-900/g, replacement: 'dark:bg-[#000000]' },

  // Surfaces
  { regex: /dark:bg-neutral-800/g, replacement: 'dark:bg-[#121212]' },
  { regex: /dark:bg-gray-800/g, replacement: 'dark:bg-[#121212]' },
  { regex: /dark:bg-slate-800/g, replacement: 'dark:bg-[#121212]' },
  { regex: /dark:bg-\[#1c1c1e\]/g, replacement: 'dark:bg-[#121212]' },

  // Borders
  { regex: /dark:border-neutral-800/g, replacement: 'dark:border-[#1c1b1b]' },
  { regex: /dark:border-neutral-700/g, replacement: 'dark:border-[#1c1b1b]' },
  { regex: /dark:border-gray-800/g, replacement: 'dark:border-[#1c1b1b]' },
  { regex: /dark:border-gray-700/g, replacement: 'dark:border-[#1c1b1b]' },
  { regex: /dark:border-slate-800/g, replacement: 'dark:border-[#1c1b1b]' },
  { regex: /dark:border-slate-700/g, replacement: 'dark:border-[#1c1b1b]' },
  { regex: /dark:border-\[#1c1c1e\]/g, replacement: 'dark:border-[#1c1b1b]' },

  // Typography - Primary
  { regex: /dark:text-gray-200/g, replacement: 'dark:text-[#ffffff]' },
  { regex: /dark:text-neutral-200/g, replacement: 'dark:text-[#ffffff]' },
  { regex: /dark:text-slate-200/g, replacement: 'dark:text-[#ffffff]' },
  { regex: /dark:text-gray-300/g, replacement: 'dark:text-[#ffffff]' },
  { regex: /dark:text-neutral-300/g, replacement: 'dark:text-[#ffffff]' },
  { regex: /dark:text-slate-300/g, replacement: 'dark:text-[#ffffff]' },

  // Typography - Secondary
  { regex: /dark:text-gray-400/g, replacement: 'dark:text-[#a1a1aa]' },
  { regex: /dark:text-neutral-400/g, replacement: 'dark:text-[#a1a1aa]' },
  { regex: /dark:text-slate-400/g, replacement: 'dark:text-[#a1a1aa]' },
  { regex: /dark:text-gray-500/g, replacement: 'dark:text-[#71717a]' },
  { regex: /dark:text-neutral-500/g, replacement: 'dark:text-[#71717a]' },
  { regex: /dark:text-slate-500/g, replacement: 'dark:text-[#71717a]' },
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
console.log('All comprehensive color replacements completed.');
