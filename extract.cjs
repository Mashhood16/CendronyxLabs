const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\mashh\\.gemini\\antigravity\\brain\\b47352b4-db2e-4d68-87c6-1713dd9e80ad\\.system_generated\\logs\\transcript_full.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const parsed = JSON.parse(line);
    if (parsed.type === 'USER_INPUT' && parsed.content && parsed.content.includes('highly detailed list of all 34 formal practical activities')) {
      fs.writeFileSync('C:\\Users\\mashh\\.gemini\\antigravity\\scratch\\virtuallab\\list.txt', parsed.content);
      console.log('Found and wrote list.txt');
      break;
    }
  } catch(e) {}
}
