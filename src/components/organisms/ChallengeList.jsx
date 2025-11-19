import { lazy, Suspense } from 'react';
import useIsMobile from '../../hooks/useIsMobile';
import PropTypes from 'prop-types';

const DesktopChallengeList = lazy(() => import('./DesktopChallengeList'));
const MobileChallengeList = lazy(() => import('./MobileChallengeList'));

const ChallengeList = (props) => {
    const isMobile = useIsMobile();

    return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded-lg" />}>
            {isMobile ? <MobileChallengeList {...props} /> : <DesktopChallengeList {...props} />}
        </Suspense>
    );
};

ChallengeList.propTypes = {
    challenges: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            category: PropTypes.string.isRequired,
            duration: PropTypes.string.isRequired,
            image: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default ChallengeList;
