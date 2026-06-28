const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components');
const files = fs.readdirSync(dir).filter(f => f.startsWith('Lab') && f.endsWith('.tsx'));

const neonColors = ['indigo', 'blue', 'amber', 'emerald', 'rose', 'violet', 'red', 'green', 'purple', 'fuchsia', 'cyan', 'teal', 'pink', 'orange', 'yellow', 'sky', 'lime'];

let modifiedCount = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  content = content.replace(/className="([^"]+)"/g, (match, classes) => {
    let newClasses = classes;
    
    // Target any element with padding, rounding, and a primary background color.
    // This safely covers all our buttons without parsing HTML tags.
    if (newClasses.includes('bg-') && (newClasses.includes('px-') || newClasses.includes('py-') || newClasses.includes('p-') || newClasses.includes('w-full')) && newClasses.includes('rounded')) {
      let primaryColorMatch = newClasses.match(/bg-([a-z]+)-([0-9]+)/);
      let color = primaryColorMatch ? primaryColorMatch[1] : null;
      let shade = primaryColorMatch ? parseInt(primaryColorMatch[2]) : null;

      if (color && neonColors.includes(color) && shade >= 400 && shade <= 700) {
        newClasses = newClasses.replace(/dark:bg-\[#000000\]/g, '');
        newClasses = newClasses.replace(/dark:bg-\[#141414\]/g, '');
        newClasses = newClasses.replace(/dark:bg-\[#0a0a0a\]/g, '');
        newClasses = newClasses.replace(/dark:border-\[#1c1b1b\]/g, '');
        newClasses = newClasses.replace(/dark:bg-[a-z]+-[0-9]+/g, '');
        newClasses = newClasses.replace(/dark:hover:bg-[a-z]+-[0-9]+/g, '');
        newClasses = newClasses.replace(/dark:text-black/g, '');
        newClasses = newClasses.replace(/dark:text-\[#ffffff\]/g, '');
        newClasses = newClasses.replace(/dark:shadow-[a-z]+-[0-9]+\/[0-9]+/g, '');
        newClasses = newClasses.replace(/dark:shadow-lg/g, '');
        newClasses = newClasses.replace(/dark:border-transparent/g, '');
        
        let newShade = Math.max(500, shade - 100);
        let hoverShade = Math.max(400, newShade - 100);

        newClasses = newClasses.replace(/\s+/g, ' ').trim();

        newClasses += ` dark:bg-${color}-${newShade} dark:hover:bg-${color}-${hoverShade} dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-${color}-500/40`;
      }
    }

    // Also fix secondary buttons that were made pitch black:
    if ((newClasses.includes('bg-white') || newClasses.includes('bg-slate-50')) && newClasses.includes('border') && (newClasses.includes('hover:bg-') || newClasses.includes('hover:border-'))) {
      newClasses = newClasses.replace(/dark:bg-\[#000000\]/g, 'dark:bg-[#141414]');
    }

    return `className="${newClasses.trim()}"`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedCount++;
  }
}

console.log(`Updated ${modifiedCount} files with vibrant buttons.`);
