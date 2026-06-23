const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let fixedCount = 0;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  if (!content.includes('overflow-y-auto')) {
    content = content.replace(/className="([^"]*)"/, (match, p1) => {
      let classes = p1.split(' ');
      
      if (!classes.includes('flex')) classes.unshift('flex');
      if (!classes.includes('flex-col')) classes.unshift('flex-col');
      if (!classes.includes('h-screen')) classes.unshift('h-screen');
      if (!classes.includes('overflow-y-auto')) classes.unshift('overflow-y-auto');
      
      return 'className="' + classes.join(' ') + '"';
    });
    
    fs.writeFileSync(filePath, content, 'utf-8');
    fixedCount++;
    console.log('Fixed: ' + file);
  }
});

console.log('Total files fixed: ' + fixedCount);
