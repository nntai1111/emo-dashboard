import { lazy, Suspense } from 'react';
import useIsMobile from '../../hooks/useIsMobile';
import PropTypes from 'prop-types';

const DesktopFilterSection = lazy(() => import('./DesktopFilterSection'));
const MobileFilterSection = lazy(() => import('./MobileFilterSection'));

const FilterSection = (props) => {
    const isMobile = useIsMobile();

    return (
        <Suspense fallback={null}>
            {isMobile ? <MobileFilterSection {...props} /> : <DesktopFilterSection {...props} />}
        </Suspense>
    );
};

FilterSection.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    durationFilter: PropTypes.string, // Changed from array to single value (null means "All")
    categoryFilter: PropTypes.string, // Changed from array to single value (null means "All")
    toggleFilter: PropTypes.func.isRequired,
};

export default FilterSection;
