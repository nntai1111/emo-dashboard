import { lazy, Suspense } from 'react';
import useIsMobile from '../../hooks/useIsMobile';
import PropTypes from 'prop-types';

const DesktopChallengeHubTemplate = lazy(() => import('./DesktopChallengeHubTemplate'));
const MobileChallengeHubTemplate = lazy(() => import('./MobileChallengeHubTemplate'));

const ChallengeHubTemplate = (props) => {
    const isMobile = useIsMobile();

    return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-screen" />}>
            {isMobile ? (
                <MobileChallengeHubTemplate {...props} />
            ) : (
                <DesktopChallengeHubTemplate {...props} />
            )}
        </Suspense>
    );
};

ChallengeHubTemplate.propTypes = {
    filterChips: PropTypes.node.isRequired,
    filterSection: PropTypes.node.isRequired,
    carouselSection: PropTypes.node.isRequired,
    challengeList: PropTypes.node.isRequired,
};

export default ChallengeHubTemplate;
