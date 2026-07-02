import GenericDerivationLab from './GenericDerivationLab';
import { CLASS11_DERIVATIONS } from '../data/class11Derivations';

export default function LabP11DerivationMagneticForce({ onExit }: { onExit?: () => void }) {
  return <GenericDerivationLab onExit={onExit} config={CLASS11_DERIVATIONS.magnetic_force} />;
}
