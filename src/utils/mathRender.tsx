import { ReactNode, Children, isValidElement } from 'react';

const LATEX_SYMBOLS: Record<string, string> = {
  '\\times': '\u00D7',
  '\\div': '\u00F7',
  '\\cdot': '\u00B7',
  '\\pm': '\u00B1',
  '\\mp': '\u2213',
  '\\propto': '\u221D',
  '\\approx': '\u2248',
  '\\neq': '\u2260',
  '\\leq': '\u2264',
  '\\geq': '\u2265',
  '\\ll': '\u226A',
  '\\gg': '\u226B',
  '\\Rightarrow': '\u21D2',
  '\\rightarrow': '\u2192',
  '\\leftarrow': '\u2190',
  '\\leftrightarrow': '\u2194',
  '\\infty': '\u221E',
  '\\int': '\u222B',
  '\\sum': '\u03A3',
  '\\prod': '\u03A0',
  '\\nabla': '\u2207',
  '\\partial': '\u2202',
  '\\sqrt': '\u221A',
  '\\langle': '\u27E8',
  '\\rangle': '\u27E9',
  '\\circ': '\u00B0',
  '\\prime': '\u2032',
  '\\theta': '\u03B8',
  '\\omega': '\u03C9',
  '\\alpha': '\u03B1',
  '\\beta': '\u03B2',
  '\\gamma': '\u03B3',
  '\\delta': '\u03B4',
  '\\epsilon': '\u03B5',
  '\\varepsilon': '\u03B5',
  '\\zeta': '\u03B6',
  '\\eta': '\u03B7',
  '\\lambda': '\u03BB',
  '\\mu': '\u03BC',
  '\\nu': '\u03BD',
  '\\xi': '\u03BE',
  '\\pi': '\u03C0',
  '\\rho': '\u03C1',
  '\\sigma': '\u03C3',
  '\\tau': '\u03C4',
  '\\phi': '\u03C6',
  '\\chi': '\u03C7',
  '\\psi': '\u03C8',
  '\\kappa': '\u03BA',
  '\\iota': '\u03B9',
  '\\Theta': '\u0398',
  '\\Omega': '\u03A9',
  '\\Sigma': '\u03A3',
  '\\Delta': '\u0394',
  '\\Gamma': '\u0393',
  '\\Lambda': '\u039B',
  '\\Phi': '\u03A6',
  '\\Psi': '\u03A8',
  '\\sin': 'sin',
  '\\cos': 'cos',
  '\\tan': 'tan',
  '\\cot': 'cot',
  '\\sec': 'sec',
  '\\csc': 'csc',
  '\\log': 'log',
  '\\ln': 'ln',
  '\\exp': 'exp',
  '\\arctan': 'arctan',
  '\\arcsin': 'arcsin',
  '\\arccos': 'arccos',
  '\\lim': 'lim',
  '\\max': 'max',
  '\\min': 'min',
  '\\text': '',
  '\\mathrm': '',
  '\\mathbf': '',
  '\\mathcal': '',
  '\\operatorname': '',
  '\\displaystyle': '',
  '\\left': '',
  '\\right': '',
  '\\big': '',
  '\\Big': '',
  '\\bigg': '',
  '\\Bigg': '',
  '\\,': ' ',
  '\\:': ' ',
  '\\;': ' ',
  '\\!': '',
  '\\quad': '  ',
  '\\qquad': '    ',
};

const sortedLatexKeys = Object.keys(LATEX_SYMBOLS).sort((a, b) => b.length - a.length);

function stripBraces(s: string): string {
  let s2 = s.trim();
  if (s2.startsWith('{') && s2.endsWith('}')) {
    let depth = 0;
    let canStrip = true;
    for (let i = 0; i < s2.length; i++) {
      if (s2[i] === '{') depth++;
      else if (s2[i] === '}') depth--;
      if (depth === 0 && i < s2.length - 1) { canStrip = false; break; }
    }
    if (canStrip) return s2.slice(1, -1);
  }
  return s2;
}

export function latexToHtml(formula: string): string {
  let f = formula;

  f = f.replace(/\\text\{([^}]*)\}/g, '$1');
  f = f.replace(/\\mathrm\{([^}]*)\}/g, '$1');
  f = f.replace(/\\mathbf\{([^}]*)\}/g, '$1');
  f = f.replace(/\\mathcal\{([^}]*)\}/g, '$1');
  f = f.replace(/\\operatorname\{([^}]*)\}/g, '$1');

  let prev: string;
  do {
    prev = f;
    f = f.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (_m, a, b) => {
      const num = stripBraces(a);
      const den = stripBraces(b);
      const numNeedsParens = /[+\-]/.test(num) && !/^-?\d+(\.\d+)?$/.test(num);
      const denNeedsParens = /[+\-]/.test(den) && !/^-?\d+(\.\d+)?$/.test(den);
      return `${numNeedsParens ? '(' + num + ')' : num}/${denNeedsParens ? '(' + den + ')' : den}`;
    });
  } while (f !== prev);

  f = f.replace(/\\binom\{([^{}]*)\}\{([^{}]*)\}/g, 'C($1,$2)');

  do {
    prev = f;
    f = f.replace(/\\sqrt\{([^{}]*)\}/g, '\u221A($1)');
  } while (f !== prev);

  f = f.replace(/\\left\(/g, '(').replace(/\\right\)/g, ')');
  f = f.replace(/\\left\|/g, '|').replace(/\\right\|/g, '|');
  f = f.replace(/\\left\{/g, '{').replace(/\\right\}/g, '}');

  for (const key of sortedLatexKeys) {
    if (f.includes(key)) {
      f = f.split(key).join(LATEX_SYMBOLS[key]);
    }
  }

  f = f.replace(/\\[a-zA-Z]+/g, '');

  f = f.replace(/\^\{([^}]*)\}/g, '<sup>$1</sup>');
  f = f.replace(/\^([a-zA-Z0-9])/g, '<sup>$1</sup>');
  f = f.replace(/_\{([^}]*)\}/g, '<sub>$1</sub>');
  f = f.replace(/_([a-zA-Z][a-zA-Z0-9]*)/g, '<sub>$1</sub>');
  f = f.replace(/_(\d+)/g, '<sub>$1</sub>');

  f = f.replace(/\{([^{}]*)\}/g, '$1');
  f = f.replace(/  +/g, ' ').trim();

  return f;
}

interface HtmlSegment {
  type: 'text' | 'sup' | 'sub';
  content: string;
}

function parseHtmlSegments(html: string): HtmlSegment[] {
  const segments: HtmlSegment[] = [];
  const regex = /<(sup|sub)>([\s\S]*?)<\/\1>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: html.slice(lastIndex, match.index) });
    }
    segments.push({ type: match[1] as 'sup' | 'sub', content: match[2] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < html.length) {
    segments.push({ type: 'text', content: html.slice(lastIndex) });
  }
  return segments.length ? segments : [{ type: 'text', content: html }];
}

export function latexToNodes(formula: string, keyPrefix: string = ''): ReactNode[] {
  const html = latexToHtml(formula);
  const segments = parseHtmlSegments(html);
  return segments.map((seg, i) => {
    if (seg.type === 'sup') return <sup key={`${keyPrefix}-${i}`}>{seg.content}</sup>;
    if (seg.type === 'sub') return <sub key={`${keyPrefix}-${i}`}>{seg.content}</sub>;
    return <span key={`${keyPrefix}-${i}`}>{seg.content}</span>;
  });
}

function flattenChildren(children: ReactNode): ReactNode[] {
  const out: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (child === null || child === undefined || typeof child === 'boolean') return;
    if (typeof child === 'string' || typeof child === 'number') {
      out.push(String(child));
    } else if (Array.isArray(child)) {
      out.push(...flattenChildren(child));
    } else if (isValidElement(child)) {
      out.push(child);
    } else {
      out.push(String(child));
    }
  });
  return out;
}

export function textWithMathToNodes(children: ReactNode, keyPrefix: string = ''): ReactNode[] {
  const flat = flattenChildren(children);
  const out: ReactNode[] = [];
  let keyIdx = 0;
  flat.forEach((seg) => {
    if (typeof seg === 'string') {
      let s = seg;
      s = s.replace(/\$\$([^$]+)\$\$/g, '$1');
      s = s.replace(/\$([^$\n]+)\$/g, '$1');
      out.push(...latexToNodes(s, `${keyPrefix}-${keyIdx++}`));
    } else {
      out.push(<span key={`${keyPrefix}-${keyIdx++}`}>{seg}</span>);
    }
  });
  return out;
}
