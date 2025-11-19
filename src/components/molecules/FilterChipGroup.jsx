import { lazy, Suspense } from 'react';
import useIsMobile from '../../hooks/useIsMobile';
import PropTypes from 'prop-types';

const DesktopFilterChipGroup = lazy(() => import('./DesktopFilterChipGroup'));
const MobileFilterChipGroup = lazy(() => import('./MobileFilterChipGroup'));

const FilterChipGroup = (props) => {
    const isMobile = useIsMobile();

    return (
        <Suspense fallback={<div className="h-10" />}>
            {isMobile ? <MobileFilterChipGroup {...props} /> : <DesktopFilterChipGroup {...props} />}
        </Suspense>
    );
};

FilterChipGroup.propTypes = {
    durationFilter: PropTypes.string, // Changed from array to single value (null means "All")
    categoryFilter: PropTypes.string, // Changed from array to single value (null means "All")
    toggleFilter: PropTypes.func.isRequired,
};

export default FilterChipGroup;
