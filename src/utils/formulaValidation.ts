/**
 * Normalize a formula string for comparison.
 * Strips whitespace, normalizes symbols, handles common variations.
 */
export function normalizeFormula(formula: string): string {
  let f = formula.toLowerCase().trim();

  // Remove all whitespace
  f = f.replace(/\s+/g, '');

  // Normalize multiplication symbols to '×'
  f = f.replace(/\*/g, '×');
  f = f.replace(/·/g, '×');

  // Normalize division
  f = f.replace(/÷/g, '/');

  // Normalize superscripts
  f = f.replace(/²/g, '^2');
  f = f.replace(/³/g, '^3');

  // Normalize subscripts (Unicode subscripts to _n format)
  f = f.replace(/₁/g, '_1');
  f = f.replace(/₂/g, '_2');
  f = f.replace(/₃/g, '_3');
  f = f.replace(/₄/g, '_4');
  f = f.replace(/₅/g, '_5');
  f = f.replace(/₆/g, '_6');
  f = f.replace(/₇/g, '_7');
  f = f.replace(/₈/g, '_8');
  f = f.replace(/₉/g, '_9');
  f = f.replace(/₀/g, '_0');

  // Normalize special characters
  f = f.replace(/−/g, '-'); // minus sign
  f = f.replace(/–/g, '-');
  f = f.replace(/½/g, '(1/2)');
  f = f.replace(/⅓/g, '(1/3)');
  f = f.replace(/⅔/g, '(2/3)');
  f = f.replace(/¼/g, '(1/4)');
  f = f.replace(/¾/g, '(3/4)');

  // Pi variations
  f = f.replace(/π/g, 'pi');

  // Theta variations
  f = f.replace(/θ/g, 'theta');
  f = f.replace(/ω/g, 'omega');
  f = f.replace(/α/g, 'alpha');
  f = f.replace(/β/g, 'beta');
  f = f.replace(/γ/g, 'gamma');
  f = f.replace(/δ/g, 'delta');
  f = f.replace(/λ/g, 'lambda');
  f = f.replace(/ρ/g, 'rho');
  f = f.replace(/σ/g, 'sigma');
  f = f.replace(/φ/g, 'phi');
  f = f.replace(/μ/g, 'mu');
  f = f.replace(/η/g, 'eta');
  f = f.replace(/Δ/g, 'delta');
  f = f.replace(/Σ/g, 'sigma');
  f = f.replace(/Ω/g, 'omega');

  // Greek letter word names
  f = f.replace(/\btheta\b/g, 'θ');
  f = f.replace(/\bomega\b/g, 'ω');
  f = f.replace(/\balpha\b/g, 'α');
  f = f.replace(/\bbeta\b/g, 'β');
  f = f.replace(/\bgamma\b/g, 'γ');
  f = f.replace(/\bdelta\b/g, 'δ');
  f = f.replace(/\blambda\b/g, 'λ');
  f = f.replace(/\brho\b/g, 'ρ');
  f = f.replace(/\bsigma\b/g, 'σ');
  f = f.replace(/\bphi\b/g, 'φ');
  f = f.replace(/\bmu\b/g, 'μ');
  f = f.replace(/\beta\b/g, 'η');
  f = f.replace(/\bpi\b/g, 'π');

  // sqrt(x) → sqrt{x}
  f = f.replace(/sqrt\(([^)]+)\)/g, 'sqrt{$1}');

  // Normalize multiple equal signs or arrows
  f = f.replace(/⇒/g, '=>');
  f = f.replace(/→/g, '->');

  // Remove leading/trailing operator noise
  f = f.replace(/^[=:]+/, '');
  f = f.replace(/[=:]+$/, '');

  return f;
}

/**
 * Check if a user's answer matches the expected formula.
 * Returns a match score from 0 to 1.
 */
export function checkFormulaMatch(userAnswer: string, expectedFormula: string): number {
  const user = normalizeFormula(userAnswer);
  const expected = normalizeFormula(expectedFormula);

  if (!user || !expected) return 0;
  if (user === expected) return 1;

  // Try with '×' replaced by nothing (implied multiplication)
  const userNoMult = user.replace(/×/g, '');
  const expectedNoMult = expected.replace(/×/g, '');
  if (userNoMult === expectedNoMult) return 0.95;

  // Try with '×' replaced by space
  const userSpaceMult = user.replace(/×/g, ' ');
  const expectedSpaceMult = expected.replace(/×/g, ' ');
  if (userSpaceMult === expectedSpaceMult) return 0.9;

  // Try removing parentheses
  const userNoParen = user.replace(/[(){}[\]]/g, '');
  const expectedNoParen = expected.replace(/[(){}[\]]/g, '');
  if (userNoParen === expectedNoParen) return 0.85;

  // Try simplifying (1/2) to 0.5 etc.
  const userSimplified = user.replace(/\(1\/2\)/g, '0.5').replace(/\(1\/3\)/g, '0.333').replace(/\(2\/3\)/g, '0.667').replace(/\(1\/4\)/g, '0.25').replace(/\(3\/4\)/g, '0.75');
  const expectedSimplified = expected.replace(/\(1\/2\)/g, '0.5').replace(/\(1\/3\)/g, '0.333').replace(/\(2\/3\)/g, '0.667').replace(/\(1\/4\)/g, '0.25').replace(/\(3\/4\)/g, '0.75');
  if (userSimplified === expectedSimplified) return 0.9;

  // Character-by-character similarity (for partial credit / hint generation)
  let matches = 0;
  const maxLen = Math.max(user.length, expected.length);
  for (let i = 0; i < Math.min(user.length, expected.length); i++) {
    if (user[i] === expected[i]) matches++;
  }
  const similarity = matches / maxLen;

  return similarity;
}

/**
 * Get a hint message based on how close the user's answer is.
 */
export function getHintForAnswer(userAnswer: string, expectedFormula: string): string {
  const score = checkFormulaMatch(userAnswer, expectedFormula);

  if (score >= 0.8) {
    return "Very close! Check for small typos in subscripts or operators.";
  }
  if (score >= 0.5) {
    return "You're on the right track! Check the variables and their positions in the formula.";
  }
  if (score >= 0.3) {
    return "Think about which variables should be on each side of the equation.";
  }
  return "Start by identifying the main relationship. What equals what?";
}
