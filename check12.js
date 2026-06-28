const fs = require('fs');
const c = fs.readFileSync('C:/Users/mashh/.gemini/antigravity/scratch/virtuallab/src/data/labModules.ts', 'utf8');
console.log(c.includes('classLevel: \'12\'') || c.includes('classLevel: "12"'));
