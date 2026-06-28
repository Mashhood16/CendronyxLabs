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

  content = content.replace(/<button([^>]*)className="([^"]+)"([^>]*)>/g, (match, before, classes, after) => {
    let newClasses = classes;
    
    // Check if it's a primary colored button
    let primaryColorMatch = newClasses.match(/bg-([a-z]+)-([0-9]+)/);
    let color = primaryColorMatch ? primaryColorMatch[1] : null;
    let shade = primaryColorMatch ? parseInt(primaryColorMatch[2]) : null;

    if (color && neonColors.includes(color) && shade >= 400 && shade <= 700) {
      // It's a primary button. Let's make it vibrant for dark mode.
      let newShade = Math.max(400, shade - 100); // 600 -> 500, 500 -> 400
      let hoverShade = Math.max(300, newShade - 100);

      // Remove the #000000 override
      newClasses = newClasses.replace(/dark:bg-\[\#000000\]/g, '');
      newClasses = newClasses.replace(/dark:border-\[\#1c1b1b\]/g, '');
      
      // Clean up multiple spaces
      newClasses = newClasses.replace(/\s+/g, ' ').trim();

      // Add vibrant dark mode classes
      if (!newClasses.includes(`dark:bg-${color}-${newShade}`)) {
        newClasses += ` dark:bg-${color}-${newShade} dark:hover:bg-${color}-${hoverShade} dark:text-white dark:shadow-lg dark:shadow-${color}-500/40`;
      }
    } else if (newClasses.includes('bg-white') || newClasses.includes('bg-slate-')) {
      // It's a secondary button (e.g. bg-white border-slate-200)
      // They also got hit with dark:bg-[#000000]. Leave them dark, but #141414 instead.
      newClasses = newClasses.replace(/dark:bg-\[\#000000\]/g, 'dark:bg-[#141414]');
    }

    return `<button${before}className="${newClasses.trim()}"${after}>`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedCount++;
  }
}

console.log(`Updated ${modifiedCount} files with vibrant buttons.`);
