const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(dir).filter(f => f.startsWith('Lab') && f.endsWith('.tsx'));

let issuesFound = [];

files.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  let lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Check if it's a side panel (like w-80, w-96, w-1/3, w-[300px]) that has flex-col but no overflow-y-auto
    if (line.match(/className="[^"]*\bw-(80|96|1\/3|1\/4|64|72|1\/2|\[[0-9]+px\])\b[^"]*"/) && 
        line.includes('flex-col') && 
        !line.includes('overflow-y-auto') &&
        !line.includes('overflow-auto')) {
      issuesFound.push({ file, line: index + 1, type: 'Side Panel missing overflow-y-auto', content: line.trim() });
    }

    // Checking fixed h-screen without flex-1
    if (line.includes('className="') && line.includes('h-screen') && !line.includes('flex')) {
      issuesFound.push({ file, line: index + 1, type: 'h-screen without flex layout', content: line.trim() });
    }
  });
});

console.log(JSON.stringify(issuesFound, null, 2));
