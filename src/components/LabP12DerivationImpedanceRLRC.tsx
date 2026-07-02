import GenericDerivationLab from './GenericDerivationLab';
import { CLASS12_DERIVATIONS } from '../data/class12Derivations';

export default function LabP12DerivationImpedanceRLRC({ onExit }: { onExit?: () => void }) {
  return <GenericDerivationLab onExit={onExit} config={CLASS12_DERIVATIONS.impedance} />;
}
