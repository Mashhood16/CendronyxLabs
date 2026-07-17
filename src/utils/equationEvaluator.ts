/**
 * Safely evaluates mathematical equations containing variables and math functions.
 * Designed to handle syntax errors gracefully by returning a fallback number.
 *
 * Supported functions:
 *   Trigonometry: sin, cos, tan, asin, acos, atan
 *   Power/Root:   sqrt, pow, exp
 *   Rounding:     ceil, floor, round
 *   Comparison:   min, max
 *   Other:        abs, mod (modulo)
 *   Logarithm:    log (natural), log10 (base 10)
 *   Constants:     pi, e
 *   Variables:     t (time), user-defined variables, computed equation values
 */
export function evaluateEquation(expr: string, variables: Record<string, number>, fallback = 0): number {
  if (!expr || typeof expr !== 'string') return fallback;

  try {
    let sanitized = expr.toLowerCase().trim();

    // Replace Math constants
    sanitized = sanitized.replace(/\bpi\b/g, String(Math.PI));
    sanitized = sanitized.replace(/\be\b/g, String(Math.E));

    // Replace trigonometric functions
    sanitized = sanitized.replace(/\basin\b/g, 'Math.asin');
    sanitized = sanitized.replace(/\bacos\b/g, 'Math.acos');
    sanitized = sanitized.replace(/\batan\b/g, 'Math.atan');
    sanitized = sanitized.replace(/\bsin\b/g, 'Math.sin');
    sanitized = sanitized.replace(/\bcos\b/g, 'Math.cos');
    sanitized = sanitized.replace(/\btan\b/g, 'Math.tan');

    // Replace power/root/exponential functions
    sanitized = sanitized.replace(/\bsqrt\b/g, 'Math.sqrt');
    sanitized = sanitized.replace(/\bpow\b/g, 'Math.pow');
    sanitized = sanitized.replace(/\bexp\b/g, 'Math.exp');

    // Replace logarithm functions
    sanitized = sanitized.replace(/\blog10\b/g, 'Math.log10');
    sanitized = sanitized.replace(/\blog\b/g, 'Math.log');

    // Replace rounding functions
    sanitized = sanitized.replace(/\bceil\b/g, 'Math.ceil');
    sanitized = sanitized.replace(/\bfloor\b/g, 'Math.floor');
    sanitized = sanitized.replace(/\bround\b/g, 'Math.round');

    // Replace comparison functions
    sanitized = sanitized.replace(/\bmin\b/g, 'Math.min');
    sanitized = sanitized.replace(/\bmax\b/g, 'Math.max');

    // Replace modulo — mod(a, b) → ((a) % (b))
    sanitized = sanitized.replace(/\bmod\b/g, 'function(a,b){return((a)%(b))}');

    // Replace absolute value — abs(x) → Math.abs(x)
    sanitized = sanitized.replace(/\babs\b/g, 'Math.abs');

    // Replace bound simulation state variables (e.g. L, V, t)
    // Note: expression is already lowercased, so we must lowercase variable names too
    const varNames = Object.keys(variables).sort((a, b) => b.length - a.length);
    for (const name of varNames) {
      const lowerName = name.toLowerCase();
      const escapedName = lowerName.replace(/[-\\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedName}\\b`, 'g');
      sanitized = sanitized.replace(regex, String(variables[name] ?? 0));
    }

    // Sanitization check: Allow only numbers, operators, parentheses, commas, dots, and Math calls
    const testStr = sanitized
      .replace(/Math\.(sin|cos|tan|asin|acos|atan|sqrt|abs|pow|exp|log|log10|ceil|floor|round|min|max)/g, '')
      .replace(/function\(a,b\)\{return\(\(a\)%\(b\)\)\}/g, '')
      .replace(/\s+/g, '');

    if (!/^[0-9+\-*/%().,]*$/.test(testStr)) {
      return fallback;
    }

    // Evaluate using Function constructor
    const result = new Function(`return (${sanitized});`)();
    return typeof result === 'number' && !isNaN(result) ? result : fallback;
  } catch (err) {
    return fallback;
  }
}
