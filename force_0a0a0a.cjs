const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/mashh/.gemini/antigravity/scratch/virtuallab/src';

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // The user wants the labs to match the Sidebar and Header perfectly, which are #0a0a0a
      content = content.replace(/dark:bg-\[#121212\]/g, 'dark:bg-[#0a0a0a]');
      
      // Clean up messy duplicate border classes left over from previous regex
      content = content.replace(/dark:border-\[#1c1b1b\] dark:border-slate-500/g, 'dark:border-[#1c1b1b]');
      content = content.replace(/dark:border-\[#1c1b1b\] dark:border-neutral-800/g, 'dark:border-[#1c1b1b]');
      content = content.replace(/dark:border-\[#1c1b1b\] dark:border-\[#1c1b1b\]/g, 'dark:border-[#1c1b1b]');

      // Let's also catch any stray slate-800 or slate-900 that might have been missed in earlier sweeps
      content = content.replace(/dark:bg-slate-800/g, 'dark:bg-[#0a0a0a]');
      content = content.replace(/dark:bg-slate-900/g, 'dark:bg-[#0a0a0a]');
      content = content.replace(/dark:bg-\[#1c1c1e\]/g, 'dark:bg-[#0a0a0a]');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

walk(srcDir);
console.log('Force update to #0a0a0a completed.');
