const fs = require('fs');
const path = require('path');

const dir = 'src/components/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.jsx') || f.endsWith('.js'));

files.forEach(f => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  const initialContent = content;
  content = content.replace(/\\`/g, '`').replace(/\\\$/g, '$');
  if (content !== initialContent) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed:', f);
  }
});
