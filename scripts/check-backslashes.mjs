import fs from 'fs';

const c = fs.readFileSync('src/data/class11Derivations.tsx', 'utf-8');
let count1 = 0, count2 = 0, count3plus = 0;

for (let i = 0; i < c.length; i++) {
  if (c[i] === '\\' && c.slice(i+1, i+5) === 'frac') {
    let bs = 0;
    let j = i;
    while (j >= 0 && c[j] === '\\') { bs++; j--; }
    if (bs === 1) count1++;
    else if (bs === 2) count2++;
    else count3plus++;
  }
}
console.log(JSON.stringify({ singleBsFrac: count1, doubleBsFrac: count2, threePlusBsFrac: count3plus }));
