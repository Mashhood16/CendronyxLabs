import GenericDerivationLab from '../../../generic/GenericDerivationLab';
import { CLASS11_DERIVATIONS } from '../../../../data/derivations/class11Derivations';

export default function LabP11DerivationProjectileHeight({ onExit }: { onExit?: () => void }) {
 return <GenericDerivationLab onExit={onExit} config={CLASS11_DERIVATIONS.projectile_height} />;
}
