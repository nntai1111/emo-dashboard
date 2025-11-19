import { lazy, Suspense } from 'react';
import useIsMobile from '../../hooks/useIsMobile';
import PropTypes from 'prop-types';

const DesktopChallengeCard = lazy(() => import('./DesktopChallengeCard'));
const MobileChallengeCard = lazy(() => import('./MobileChallengeCard'));

const ChallengeCard = (props) => {
    const isMobile = useIsMobile();

    return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-24 rounded-lg" />}>
            {isMobile ? <MobileChallengeCard {...props} /> : <DesktopChallengeCard {...props} />}
        </Suspense>
    );
};

ChallengeCard.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
};

export default ChallengeCard;
