import { latexToNodes } from '../utils/mathRender';

function preprocessFormula(f: string): string {
  // Greek letter names (whole words) -> LaTeX commands
  f = f.replace(/\btheta\b/g, '\\theta');
  f = f.replace(/\bomega\b/g, '\\omega');
  f = f.replace(/\balpha\b/g, '\\alpha');
  f = f.replace(/\brho\b/g, '\\rho');
  f = f.replace(/\bphi\b/g, '\\phi');
  f = f.replace(/\bbeta\b/g, '\\beta');
  f = f.replace(/\beta\b/g, '\\eta');
  f = f.replace(/\bmu\b/g, '\\mu');
  f = f.replace(/\blambda\b/g, '\\lambda');
  f = f.replace(/\bsigma\b/g, '\\sigma');
  f = f.replace(/\bdelta\b/g, '\\delta');
  f = f.replace(/\bgamma\b/g, '\\gamma');

  // sqrt(x) -> \\sqrt{x}  (parentheses form)
  f = f.replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}');

  // sqrt{...} -> \\sqrt{...}  (braces / LaTeX form, only if not already \sqrt)
  f = f.replace(/(?<!\\)sqrt\{([^}]+)\}/g, '\\sqrt{$1}');

  // frac{n}{d} -> \\frac{n}{d}  (bare frac without backslash, only if not already \frac)
  f = f.replace(/(?<!\\)frac\{([^}]+)\}\{([^}]+)\}/g, '\\frac{$1}{$2}');

  // (n/m) fraction pattern -> \\frac{n}{m}
  f = f.replace(/\((\d+)\/(\d+)\)/g, '\\frac{$1}{$2}');

  // pi as whole word -> \\pi (generic FIRST to avoid re-matching in already-converted \pi)
  f = f.replace(/\bpi\b/g, '\\pi');
  f = f.replace(/(\d)pi\b/g, '$1\\pi');

  // trig and log functions
  f = f.replace(/\bsin\b/g, '\\sin');
  f = f.replace(/\bcos\b/g, '\\cos');
  f = f.replace(/\btan\b/g, '\\tan');
  f = f.replace(/\blog\b/g, '\\log');
  f = f.replace(/\bln\b/g, '\\ln');

  // log₁₀ -> \\log_{10}
  f = f.replace(/log₁₀/g, '\\log_{10}');

  // constant -> \\text{constant}
  f = f.replace(/\bconstant\b/g, '\\text{constant}');

  // spaced x as multiplication -> \\times
  f = f.replace(/ x /g, ' \\times ');

  return f;
}

interface MathFormulaProps {
  formula: string;
  display?: boolean;
  className?: string;
}

export default function MathFormula({ formula, display = false, className = '' }: MathFormulaProps) {
  const processedFormula = preprocessFormula(formula);
  const nodes = latexToNodes(processedFormula, 'mf');
  if (display) {
    return (
      <span className={`katex-block-wrapper block text-center my-1 ${className}`} style={{ fontFamily: '"STIX Two Text", "Cambria Math", Georgia, "Times New Roman", serif' }}>
        {nodes}
      </span>
    );
  }

  return (
    <span className={`katex-inline-wrapper ${className}`} style={{ fontFamily: '"STIX Two Text", "Cambria Math", Georgia, "Times New Roman", serif' }}>
      {nodes}
    </span>
  );
}
