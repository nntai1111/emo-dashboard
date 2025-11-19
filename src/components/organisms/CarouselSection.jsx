import { lazy, Suspense } from 'react';
import useIsMobile from '../../hooks/useIsMobile';
import PropTypes from 'prop-types';

// Lazy load components for better performance
const DesktopCarouselSection = lazy(() => import('./DesktopCarouselSection'));
const MobileCarouselSection = lazy(() => import('./MobileCarouselSection'));

const CarouselSection = (props) => {
    const isMobile = useIsMobile();

    return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg" />}>
            {isMobile ? <MobileCarouselSection {...props} /> : <DesktopCarouselSection {...props} />}
        </Suspense>
    );
};

CarouselSection.propTypes = {
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
    carouselIndex: PropTypes.number.isRequired,
    setCarouselIndex: PropTypes.func.isRequired,
};

export default CarouselSection;
