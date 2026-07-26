import { GenericDerivationLab } from '../../../generic/GenericDerivationLab';
import { CLASS11_DERIVATIONS } from '../../../../data/derivations/class11Derivations';

interface Props {
 onExit: () => void;
}

export default function LabP11DerivationDiracMomentum({ onExit }: Props) {
 const config = CLASS11_DERIVATIONS.dirac_momentum;
 return <GenericDerivationLab onExit={onExit} config={config} />;
}

