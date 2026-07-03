import { GenericDerivationLab } from '../components/GenericDerivationLab';
import { CLASS11_DERIVATIONS } from '../data/class11Derivations';

interface Props {
  onExit: () => void;
}

export default function LabP11DerivationDopplerListenerAway({ onExit }: Props) {
  const key = 'doppler_listener_away';
  const config = CLASS11_DERIVATIONS[key];
  return (
    <GenericDerivationLab
      onExit={onExit}
      config={config}
    />
  );
}
