const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(dir).filter(f => f.startsWith('Lab') && f.endsWith('.tsx'));

let modifiedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  let newContent = content.split('\n').map(line => {
    // Check if it's a side panel
    if (line.match(/className="[^"]*\bw-(80|96|1\/3|1\/4|64|72|1\/2|\[[0-9]+px\])\b[^"]*"/) && 
        line.includes('flex-col') && 
        !line.includes('overflow-y-auto') &&
        !line.includes('overflow-auto')) {
      
      // We don't want to add overflow to small inner boxes, only large layout panels.
      // Layout panels usually have z-10, shadow, border-l, or padding p-8.
      if (line.includes('z-10') || line.includes('p-8') || line.includes('shadow') || line.includes('border-l')) {
        return line.replace(/className="([^"]+)"/, 'className="$1 overflow-y-auto"');
      }
    }
    
    // Also fix the main left/center panels that might be `flex-1` and need scrolling
    // A flex-1 container that has padding and flex-col often needs scrolling if content grows
    if (line.match(/className="[^"]*\bflex-1\b[^"]*"/) && 
        line.includes('p-') && 
        !line.includes('overflow-y-auto') &&
        !line.includes('overflow-auto') &&
        !line.includes('overflow-hidden') &&
        !line.includes('items-center') &&
        !line.includes('justify-center')) {
      // return line.replace(/className="([^"]+)"/, 'className="$1 overflow-y-auto"');
    }

    return line;
  }).join('\n');

  if (content !== newContent) {
    fs.writeFileSync(path.join(dir, file), newContent, 'utf8');
    modifiedCount++;
    console.log(`Fixed: ${file}`);
  }
});

console.log(`Total files fixed: ${modifiedCount}`);
