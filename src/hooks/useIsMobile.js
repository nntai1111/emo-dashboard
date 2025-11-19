import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current viewport is mobile
 * Uses window.matchMedia with a breakpoint of 768px (md breakpoint in Tailwind)
 * 
 * @returns {boolean} true if viewport width is less than 768px (mobile), false otherwise
 */
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(() => {
        // Check if we're in browser environment
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(max-width: 767px)').matches;
    });

    useEffect(() => {
        // Check if we're in browser environment
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(max-width: 767px)');

        // Update state on mount
        setIsMobile(mediaQuery.matches);

        // Handler function
        const handleChange = (event) => {
            setIsMobile(event.matches);
        };

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
        // Fallback for older browsers
        else {
            mediaQuery.addListener(handleChange);
            return () => mediaQuery.removeListener(handleChange);
        }
    }, []);

    return isMobile;
};

export default useIsMobile;

