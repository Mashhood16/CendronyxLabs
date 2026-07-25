import { readFileSync, writeFileSync } from 'fs';

const path = 'src/components/labs/class9/physics/LabP9DerivationHydraulic.tsx';
let c = readFileSync(path, 'utf-8');

c = c.replace(/Flower2/g, 'ArrowUpDown');
writeFileSync(path, c, 'utf-8');

console.log('Fixed: Flower2 -> ArrowUpDown');
