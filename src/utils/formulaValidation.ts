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
  f = f.replace(/â‚/g, '_1');
  f = f.replace(/â‚‚/g, '_2');
  f = f.replace(/â‚ƒ/g, '_3');
  f = f.replace(/â‚„/g, '_4');
  f = f.replace(/â‚…/g, '_5');
  f = f.replace(/â‚†/g, '_6');
  f = f.replace(/â‚‡/g, '_7');
  f = f.replace(/â‚ˆ/g, '_8');
  f = f.replace(/â‚‰/g, '_9');
  f = f.replace(/â‚€/g, '_0');

  // Normalize special characters
  f = f.replace(/âˆ’/g, '-'); // minus sign
  f = f.replace(/–/g, '-');
  f = f.replace(/½/g, '(1/2)');
  f = f.replace(/â…“/g, '(1/3)');
  f = f.replace(/â…”/g, '(2/3)');
  f = f.replace(/¼/g, '(1/4)');
  f = f.replace(/¾/g, '(3/4)');

  // Pi variations
  f = f.replace(/Ï€/g, 'pi');

  // Theta variations
  f = f.replace(/Î¸/g, 'theta');
  f = f.replace(/Ï‰/g, 'omega');
  f = f.replace(/Î±/g, 'alpha');
  f = f.replace(/Î²/g, 'beta');
  f = f.replace(/Î³/g, 'gamma');
  f = f.replace(/Î´/g, 'delta');
  f = f.replace(/Î»/g, 'lambda');
  f = f.replace(/Ï/g, 'rho');
  f = f.replace(/Ïƒ/g, 'sigma');
  f = f.replace(/Ï†/g, 'phi');
  f = f.replace(/Î¼/g, 'mu');
  f = f.replace(/Î·/g, 'eta');
  f = f.replace(/Î”/g, 'delta');
  f = f.replace(/Î£/g, 'sigma');
  f = f.replace(/Î©/g, 'omega');

  // Greek letter word names
  f = f.replace(/\btheta\b/g, 'Î¸');
  f = f.replace(/\bomega\b/g, 'Ï‰');
  f = f.replace(/\balpha\b/g, 'Î±');
  f = f.replace(/\bbeta\b/g, 'Î²');
  f = f.replace(/\bgamma\b/g, 'Î³');
  f = f.replace(/\bdelta\b/g, 'Î´');
  f = f.replace(/\blambda\b/g, 'Î»');
  f = f.replace(/\brho\b/g, 'Ï');
  f = f.replace(/\bsigma\b/g, 'Ïƒ');
  f = f.replace(/\bphi\b/g, 'Ï†');
  f = f.replace(/\bmu\b/g, 'Î¼');
  f = f.replace(/\beta\b/g, 'Î·');
  f = f.replace(/\bpi\b/g, 'Ï€');

  // sqrt(x) → sqrt{x}
  f = f.replace(/sqrt\(([^)]+)\)/g, 'sqrt{$1}');

  // Normalize multiple equal signs or arrows
  f = f.replace(/â‡’/g, '=>');
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

