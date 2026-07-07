import { ReactNode } from 'react';
import { textWithMathToNodes } from '../utils/mathRender';

interface MathTextProps {
  children?: ReactNode;
  className?: string;
}

export default function MathText({ children, className = '' }: MathTextProps) {
  const nodes = textWithMathToNodes(children, 'mt');
  return <span className={className} style={{ fontStyle: 'italic', fontFamily: '"Cambria Math", "Times New Roman", Georgia, serif' }}>{nodes}</span>;
}
