import { GenericDerivationLab } from '../components/GenericDerivationLab';
import { CLASS11_DERIVATIONS } from '../data/class11Derivations';

interface Props {
  onExit: () => void;
}

export default function LabP11DerivationPotentiometer({ onExit }: Props) {
  const config = CLASS11_DERIVATIONS.potentiometer;
  return <GenericDerivationLab onExit={onExit} config={config} />;
}
