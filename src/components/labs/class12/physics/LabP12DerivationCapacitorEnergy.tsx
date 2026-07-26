import GenericDerivationLab from '../../../generic/GenericDerivationLab';
import { CLASS12_DERIVATIONS } from '../../../../data/derivations/class12Derivations';

export default function LabP12DerivationCapacitorEnergy({ onExit }: { onExit?: () => void }) {
 return <GenericDerivationLab onExit={onExit} config={CLASS12_DERIVATIONS.capacitor_energy} />;
}

