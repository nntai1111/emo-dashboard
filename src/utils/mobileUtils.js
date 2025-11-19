// Mobile-optimized touch utilities
export const touchUtils = {
  // Enhanced tap targets for mobile
  getTapTargetClass: (size = "default") => {
    const sizes = {
      sm: "min-h-[44px] min-w-[44px]", // iOS minimum
      default: "min-h-[48px] min-w-[48px]", // Material Design
      lg: "min-h-[56px] min-w-[56px]",
    };
    return sizes[size] || sizes.default;
  },

  // Responsive spacing
  getResponsiveSpacing: (mobile, tablet, desktop) =>
    `space-y-${mobile} sm:space-y-${tablet} lg:space-y-${desktop}`,

  // Mobile-first padding
  getMobilePadding: (mobile, desktop) => `p-${mobile} sm:p-${desktop}`,

  // Touch-friendly button classes
  getTouchButtonClass: () =>
    "active:scale-95 transition-transform duration-150 touch-manipulation",

  // Responsive text sizes
  getResponsiveText: (mobile, desktop) => `text-${mobile} sm:text-${desktop}`,

  // Safe area handling for mobile browsers
  getSafeAreaClass: () => "pb-safe-area-inset-bottom",
};

// Mobile breakpoints
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
};

// Common mobile optimizations
export const mobileOptimizations = {
  // Prevent zoom on input focus (iOS)
  inputStyles: "text-base", // 16px minimum to prevent zoom

  // Touch scroll momentum (iOS)
  scrollStyles: "-webkit-overflow-scrolling: touch",

  // Prevent text selection on UI elements
  noSelect: "select-none",

  // Optimized tap targets
  tapTarget: "min-h-[44px] min-w-[44px]",
};
