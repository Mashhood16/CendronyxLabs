import GenericDerivationLab from '../../../generic/GenericDerivationLab';
import { CLASS11_DERIVATIONS } from '../../../../data/derivations/class11Derivations';

export default function LabP11DerivationStationaryWavesString({ onExit }: { onExit?: () => void }) {
 return <GenericDerivationLab onExit={onExit} config={CLASS11_DERIVATIONS.stationary_waves_string} />;
}
