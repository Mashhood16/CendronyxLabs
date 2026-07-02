import fs from 'fs';

const FILE = 'src/data/class11Derivations.ts';
let content = fs.readFileSync(FILE, 'utf8');

// The file has the original faraday_law as the last entry before the appended section.
// The appended section starts with "  // ── Unit 3: Projectile Time of Flight ──"
// The original faraday_law ends with:
//   practice: { ... },
// },

// We need to remove the duplicate faraday_law from the appended section.
// Strategy: find the second occurrence of "faraday_law:" and remove from there
// until we hit the next top-level entry (which starts with "  // ──" or "  // === Unit")

// Find the position of the second "faraday_law:" 
const firstIdx = content.indexOf('faraday_law:');
const secondIdx = content.indexOf('faraday_law:', firstIdx + 10);

if (secondIdx === -1) {
  console.log('No duplicate faraday_law found — already fixed.');
  process.exit(0);
}

// Find the line containing the second faraday_law
const lineStart = content.lastIndexOf('\n', secondIdx) + 1;
const lineEnd = content.indexOf('\n', lineStart);

// This is the comment before faraday_law: "  // ── Unit 12: Electromagnetism ──" (from the original)
// Wait, looking at the file structure, the second faraday_law is in the appended section.
// Let me find where the appended section starts.

// Find the entry right before projectile_time_flight (the first appended entry)
const pivotComment = '  // ── Unit 3: Projectile Time of Flight ──';
const pivotIdx = content.indexOf(pivotComment);
if (pivotIdx === -1) {
  console.log('Could not find appended section pivot.');
  process.exit(1);
}

// The appended section starts at pivotIdx.
// The second faraday_law, if it exists, would be between pivotIdx and the end.
// But actually, looking at the file content, there should NOT be a second faraday_law
// in the appended section, because the missing file DID include faraday_law but
// the original config file already had it.

// Let me just count how many times faraday_law appears
const count = (content.match(/faraday_law:/g) || []).length;
console.log(`Found ${count} occurrences of "faraday_law:"`);

if (count <= 1) {
  console.log('No duplicate — exiting.');
  process.exit(0);
}

// Find the line range for the second faraday_law entry
// It's the faraday_law in the appended section
const dupStart = content.indexOf('  // ── Unit 12: Electromagnetism', pivotIdx);
// If there's a comment before it in the appended section
// Actually, the missing file's faraday_law is NOT in the appended section.
// Let me re-check: the missing file has faraday_law as the LAST entry ("// ── Unit 12: Charged Particle in B Field" is the last THREE entries)

// Actually looking at the file content, the appended section starts with projectile_time_flight
// and goes to velocity_selector. The entries in between don't include faraday_law.
// Let me verify by searching between pivotIdx and the end
const endSection = content.slice(pivotIdx);
const dupeInAppended = endSection.indexOf('faraday_law:');
if (dupeInAppended === -1) {
  console.log('No duplicate faraday_law found in appended section — already clean.');
  process.exit(0);
}

// Remove from the comment before faraday_law to the end of the entry
const entryStart = endSection.lastIndexOf('\n  // ', dupeInAppended);
const entryEnd = endSection.indexOf('  },\n\n', dupeInAppended);
if (entryEnd === -1) {
  console.log('Could not find end of duplicate faraday_law entry.');
  process.exit(1);
}

const toRemove = endSection.slice(entryStart, entryEnd + 6);
content = content.replace(toRemove, '');

fs.writeFileSync(FILE, content);
console.log('Removed duplicate faraday_law entry from the appended section.');
