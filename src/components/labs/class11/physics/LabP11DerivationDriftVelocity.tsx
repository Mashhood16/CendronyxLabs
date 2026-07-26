import GenericDerivationLab from '../../../generic/GenericDerivationLab';
import { CLASS11_DERIVATIONS } from '../../../../data/derivations/class11Derivations';

export default function LabP11DerivationDriftVelocity({ onExit }: { onExit?: () => void }) {
 return <GenericDerivationLab onExit={onExit} config={CLASS11_DERIVATIONS.drift_velocity} />;
}

