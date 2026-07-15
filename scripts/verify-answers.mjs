#!/usr/bin/env node
/**
 * verify-answers.mjs — Systematic answer-verification sweep (v2)
 *
 * Finds every graded practice/assessment question in src/data/*.tsx AND
 * src/components/*.tsx, re-derives the correct answer from the formula/hint
 * stated in each entry, and flags any case where the recomputed value falls
 * outside tolerance.
 *
 * Usage: node scripts/verify-answers.mjs
 */

import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = path.resolve(process.cwd());
const DATA_DIR = path.join(PROJECT_ROOT, 'src', 'data');
const COMP_DIR = path.join(PROJECT_ROOT, 'src', 'components');

// ─── Unicode normalization ───

function normalizeMath(s) {
  return s
    .replace(/[×✕]/g, '*')
    .replace(/÷/g, '/')
    .replace(/½/g, '0.5')
    .replace(/²/g, '**2')
    .replace(/³/g, '**3')
    .replace(/°/g, '')
    .replace(/√/g, 'Math.sqrt')
    .replace(/π/gi, 'Math.PI')
    .replace(/\bsin\(/g, 'Math.sin(deg2rad(')
    .replace(/\bcos\(/g, 'Math.cos(deg2rad(')
    .replace(/\btan\(/g, 'Math.tan(deg2rad(')
    .replace(/\bln\(/g, 'Math.log(')
    .replace(/\blog\(/g, '(x=>Math.log(x)/Math.log(10))(')
    .replace(/\^/g, '**');
}

function deg2rad(d) { return d * Math.PI / 180; }

/** Safe eval — strips Math.* before validation, then re-injects */
function safeEval(raw) {
  try {
    const normalized = normalizeMath(raw);
    // Validate: only allow digits, operators, parens, spaces, dots, e/E, and Math.*
    const stripped = normalized.replace(/Math\.\w+/g, 'M');
    if (/[^0-9+\-*/().,%^eE\sM]/.test(stripped)) return null;
    const fn = new Function('Math', 'deg2rad', `return (${normalized})`);
    const result = fn(Math, deg2rad);
    return typeof result === 'number' && isFinite(result) ? result : null;
  } catch {
    return null;
  }
}

// ─── Verifiers ───

function isConceptualQuestion(q) {
  return /what (is|does|shape|property|called|happens)/i.test(q)
    || /is (it|this|the|there)/i.test(q)
    || /are (they|these|the)/i.test(q)
    || /does (it|this|x)/i.test(q)
    || /how (many|much)/i.test(q)
    || /find the (name|property)/i.test(q);
}

const verifiers = [
  // 1. Hint contains "= <number>" at end
  (e) => {
    const m = e.hint.match(/=\s*([-+]?\d*\.?\d+(?:e[-+]?\d+)?)\s*$/);
    if (m) return { computed: parseFloat(m[1]), method: 'hint-final-value' };
    return null;
  },

  // 2. Hint contains "= <expression>" with operators
  (e) => {
    const norm = normalizeMath(e.hint);
    const m = norm.match(/=\s*([-+]?\d*\.?\d+(?:e[-+]?\d+)?(?:\s*[+\-*/^]\s*[-+]?\d*\.?\d+(?:e[-+]?\d+)?)*)\s*$/);
    if (m) {
      const v = safeEval(m[1]);
      if (v !== null) return { computed: v, method: 'hint-arithmetic' };
    }
    return null;
  },

  // 3. Hint contains direct arithmetic (no "=" prefix needed)
  (e) => {
    const norm = normalizeMath(e.hint);
    // Match: digits followed by operator(s) and more digits
    const m = norm.match(/([-+]?\d*\.?\d+(?:e[-+]?\d+)?(?:\s*[+\-*/^]\s*[-+]?\d*\.?\d+(?:e[-+]?\d+)*)+)/);
    if (m) {
      const v = safeEval(m[1]);
      if (v !== null && Math.abs(v) > 0.001) return { computed: v, method: 'hint-expression' };
    }
    return null;
  },

  // 4. Pythagorean identity: sin²θ + cos²θ = 1
  (e) => {
    if (/sin.*cos.*=.*\?/i.test(e.question) && /0\.25.*0\.75/i.test(e.hint)) {
      return { computed: 1, method: 'pythagorean-identity' };
    }
    return null;
  },

  // 5. tan = sin/cos
  (e) => {
    if (/find\s+tan/i.test(e.question) && /sin.*\/.*cos/i.test(e.hint)) {
      const angleMatch = e.question.match(/(\d+)/);
      if (angleMatch) {
        const angle = parseFloat(angleMatch[1]);
        return { computed: Math.sin(deg2rad(angle)) / Math.cos(deg2rad(angle)), method: 'tan-quotient' };
      }
    }
    return null;
  },

  // 6. Set operations (count elements in final set)
  (e) => {
    if (/elements?\s+in/i.test(e.question)) {
      const m = e.hint.match(/=\s*\{([^}]*)\}/);
      if (m) {
        const elements = m[1].split(',').map(s => s.trim()).filter(Boolean);
        return { computed: elements.length, method: 'set-cardinality' };
      }
    }
    return null;
  },

  // 7. log_b(x) patterns
  (e) => {
    const q = e.question;
    const logMatch = q.match(/log[_₀₁₂₃₄₅₆₇₈₉]*(\d+)\((\d+)\)/i);
    if (logMatch) {
      const base = parseFloat(logMatch[1]);
      const val = parseFloat(logMatch[2]);
      return { computed: Math.log(val) / Math.log(base), method: 'logarithm' };
    }
    return null;
  },

  // 8. Slope-intercept y = mx + c
  (e) => {
    const slopeM = e.question.match(/m\s*=\s*(-?\d+\.?\d*)/);
    const interceptC = e.question.match(/c\s*=\s*(-?\d+\.?\d*)/);
    const xVal = e.question.match(/x\s*=\s*(-?\d+\.?\d*)/);
    if (slopeM && interceptC && xVal) {
      return { computed: parseFloat(slopeM[1]) * parseFloat(xVal[1]) + parseFloat(interceptC[1]), method: 'slope-intercept' };
    }
    return null;
  },

  // 9. Distance formula from points
  (e) => {
    if (/distance/i.test(e.question)) {
      const pts = [...e.question.matchAll(/\((-?\d+\.?\d*),\s*(-?\d+\.?\d*)\)/g)];
      if (pts.length === 2) {
        const [x1, y1] = [parseFloat(pts[0][1]), parseFloat(pts[0][2])];
        const [x2, y2] = [parseFloat(pts[1][1]), parseFloat(pts[1][2])];
        return { computed: Math.sqrt((x2-x1)**2 + (y2-y1)**2), method: 'distance-formula' };
      }
    }
    return null;
  },

  // 10. Explanation contains "= <number>" that matches a clean value
  (e) => {
    if (!e.explanation) return null;
    // Only match "X = <number>" or "≈ <number>" patterns, not random text
    const m = e.explanation.match(/(?:=|≈)\s*([-+]?\d*\.?\d+(?:e[-+]?\d+)?)/);
    if (m) {
      const v = parseFloat(m[1]);
      if (isFinite(v) && v !== 0) return { computed: v, method: 'explanation-value' };
    }
    return null;
  },
];

// ─── Extract practice entries from file content ───

function extractPracticeEntries(filePath, content) {
  const entries = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!/practice:\s*\{/.test(line)) continue;

    // Collect full practice object (may span a few lines)
    let collected = '';
    for (let j = i; j < Math.min(i + 8, lines.length); j++) {
      collected += ' ' + lines[j];
      if (/\}\s*[,}]?\s*$/.test(lines[j]) && j > i) break;
    }

    const questionMatch = collected.match(/question:\s*['"`](.*?)['"`]/);
    const hintMatch = collected.match(/hint:\s*['"`](.*?)['"`]/);
    const answerMatch = collected.match(/answer:\s*([-+]?\d*\.?\d+(?:e[-+]?\d+)?)/);
    const toleranceMatch = collected.match(/tolerance:\s*([-+]?\d*\.?\d+(?:e[-+]?\d+)?)/);
    const explanationMatch = collected.match(/explanation:\s*['"`](.*?)['"`]/);

    if (questionMatch && answerMatch) {
      entries.push({
        file: path.relative(PROJECT_ROOT, filePath).replace(/\\/g, '/'),
        line: i + 1,
        question: questionMatch[1],
        hint: hintMatch ? hintMatch[1] : '',
        answer: parseFloat(answerMatch[1]),
        tolerance: toleranceMatch ? parseFloat(toleranceMatch[1]) : 0.1,
        explanation: explanationMatch ? explanationMatch[1] : '',
      });
    }
  }

  return entries;
}

/** Extract inline graded checks from component files */
function extractInlineGrades(filePath, content) {
  const entries = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Pattern: Math.abs(val - EXPECTED) < TOLERANCE
    const m = line.match(/Math\.abs\(\w+\s*-\s*([\d.]+(?:e[-+]?\d+)?)\)\s*<\s*([\d.]+)/);
    if (m) {
      // Try to find the enclosing question context (look backwards for placeholder/question text)
      let context = '';
      for (let j = Math.max(0, i - 20); j < i; j++) {
        const qm = lines[j].match(/placeholder['":\s]*['"](.*?)['"]/);
        if (qm) { context = qm[1]; break; }
      }

      entries.push({
        file: path.relative(PROJECT_ROOT, filePath).replace(/\\/g, '/'),
        line: i + 1,
        question: context || '(inline comparison)',
        hint: '',
        answer: parseFloat(m[1]),
        tolerance: parseFloat(m[2]),
        explanation: '',
        isInline: true,
      });
    }
  }

  return entries;
}

// ─── Verify ───

function verifyEntry(entry) {
  // Skip conceptual questions with answer 0 or 1
  if ((entry.answer === 0 || entry.answer === 1) && isConceptualQuestion(entry.question)) {
    return { ...entry, computed: null, withinTolerance: true, method: 'conceptual-skip' };
  }

  for (const fn of verifiers) {
    const result = fn(entry);
    if (result && result.computed !== null) {
      const diff = Math.abs(result.computed - entry.answer);
      const withinTolerance = diff <= entry.tolerance + 1e-9;
      return { ...entry, computed: result.computed, diff, withinTolerance, method: result.method };
    }
  }
  return { ...entry, computed: null, withinTolerance: true, method: 'no-auto-verify' };
}

// ─── Main ───

function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  CENDRONYX LABS — Answer Verification Sweep (v2)');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Collect entries from data files
  const dataFiles = fs.readdirSync(DATA_DIR)
    .filter(f => /class\d/.test(f) && (f.endsWith('.tsx') || f.endsWith('.ts')))
    .map(f => path.join(DATA_DIR, f));

  // Collect entries from component files
  const compFiles = fs.readdirSync(COMP_DIR)
    .filter(f => f.endsWith('.tsx') && /Derivation|Theorem/i.test(f))
    .map(f => path.join(COMP_DIR, f));

  let totalEntries = 0;
  let verified = 0;
  let skipped = 0;
  const mismatches = [];
  const allResults = [];

  // Process data files
  for (const filePath of dataFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const entries = extractPracticeEntries(filePath, content);
    for (const entry of entries) {
      totalEntries++;
      const result = verifyEntry(entry);
      allResults.push(result);
      if (result.method === 'no-auto-verify' || result.method === 'conceptual-skip') {
        skipped++;
      } else {
        verified++;
        if (!result.withinTolerance) mismatches.push(result);
      }
    }
  }

  // Process component files (inline grades)
  for (const filePath of compFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const entries = extractInlineGrades(filePath, content);
    for (const entry of entries) {
      totalEntries++;
      const result = verifyEntry(entry);
      allResults.push(result);
      if (result.method === 'no-auto-verify' || result.method === 'conceptual-skip') {
        skipped++;
      } else {
        verified++;
        if (!result.withinTolerance) mismatches.push(result);
      }
    }
  }

  // ─── Output Report ───

  console.log(`Total practice entries found: ${totalEntries}`);
  console.log(`Auto-verified: ${verified}`);
  console.log(`Skipped (conceptual or no auto-verify): ${skipped}`);
  console.log(`Mismatches found: ${mismatches.length}\n`);

  if (mismatches.length > 0) {
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║                    SUSPECTED MISMATCHES                       ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    for (const m of mismatches) {
      console.log(`┌─ ${m.file} (line ${m.line})`);
      console.log(`│  Question: ${m.question}`);
      console.log(`│  Hint: ${m.hint}`);
      console.log(`│  Method: ${m.method}`);
      console.log(`│  Stored answer: ${m.answer}`);
      console.log(`│  Recomputed: ${m.computed?.toFixed(6)}`);
      console.log(`│  Difference: ${m.diff?.toFixed(6)} (tolerance: ${m.tolerance})`);
      console.log(`└──────────────────────────────────────────────────────────────\n`);
    }
  } else {
    console.log('✅ No mismatches found — all auto-verifiable answers check out!\n');
  }

  // Unverified entries
  const unverified = allResults.filter(r => r.method === 'no-auto-verify');
  if (unverified.length > 0) {
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║        ENTRIES REQUIRING MANUAL REVIEW (no auto-verify)       ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    for (const u of unverified) {
      console.log(`┌─ ${u.file} (line ${u.line})`);
      console.log(`│  Q: ${u.question}`);
      console.log(`│  Hint: ${u.hint}`);
      console.log(`│  Stored: ${u.answer} ± ${u.tolerance}`);
      console.log(`└──────────────────────────────────────────────────────────────\n`);
    }
  }

  // Write JSON report
  const report = {
    summary: { totalEntries, verified, skipped, mismatches: mismatches.length },
    mismatches: mismatches.map(m => ({
      file: m.file, line: m.line, question: m.question,
      hint: m.hint, stored: m.answer, recomputed: m.computed,
      diff: m.diff, tolerance: m.tolerance, method: m.method,
    })),
    unverified: unverified.map(u => ({
      file: u.file, line: u.line, question: u.question,
      hint: u.hint, stored: u.answer, tolerance: u.tolerance,
    })),
  };

  fs.writeFileSync(
    path.join(PROJECT_ROOT, 'scripts', 'verify-report.json'),
    JSON.stringify(report, null, 2)
  );
  console.log('\n📄 Full report written to scripts/verify-report.json');
}

main();
