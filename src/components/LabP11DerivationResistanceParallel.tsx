import { GenericDerivationLab } from '../components/GenericDerivationLab';
import { CLASS11_DERIVATIONS } from '../data/class11Derivations';

interface Props {
  onExit: () => void;
}

export default function LabP11DerivationResistanceParallel({ onExit }: Props) {
  const key = 'resistance_parallel';
  const config = CLASS11_DERIVATIONS[key];
  return (
    <GenericDerivationLab
      onExit={onExit}
      config={config}
    />
  );
}
