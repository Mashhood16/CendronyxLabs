import fs from 'fs';
import path from 'path';

const dir = './src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const issues = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf-8');
  
  const fileIssues = [];
  if (!content.includes('overflow-y-auto')) {
    fileIssues.push('Missing overflow-y-auto');
  }
  if (!content.includes('h-screen')) {
    fileIssues.push('Missing h-screen');
  }
  if (!content.includes('flex-col')) {
    fileIssues.push('Missing flex-col');
  }
  
  if (fileIssues.length > 0) {
    issues.push({ file, issues: fileIssues });
  }
});

console.log("Files with layout issues:", JSON.stringify(issues, null, 2));
