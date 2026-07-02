import { GenericDerivationLab } from '../components/GenericDerivationLab';
import { CLASS11_DERIVATIONS } from '../data/class11Derivations';

interface Props {
  onExit: () => void;
}

export default function LabP11DerivationElasticPotentialEnergy({ onExit }: Props) {
  const key = 'elasticPotentialEnergy';
  const config = CLASS11_DERIVATIONS[key];
  return (
    <GenericDerivationLab
      onExit={onExit}
      config={config}
    />
  );
}
