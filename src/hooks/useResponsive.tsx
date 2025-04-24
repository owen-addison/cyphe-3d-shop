import { useState, useEffect } from 'react';

// Define breakpoints matching Tailwind's default breakpoints
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  const hasTouchCapability =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window ||
      (window.navigator &&
        'maxTouchPoints' in navigator &&
        navigator.maxTouchPoints > 0));

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setWindowSize({ width, height });

      // Call our new improved device detection function
      setDeviceType(determineDeviceType());

      // console.log(
      //   `Device info - Type: ${determineDeviceType()}, Touch: ${hasTouchCapability}, Width: ${width}px`,
      // );
    };

    // Initial call
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [hasTouchCapability]);

  // Improved device type detection function
  const determineDeviceType = (): DeviceType => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const touchPoints = navigator.maxTouchPoints || 0;

    // Check for tablet-specific indicators
    const isTabletByUserAgent = /iPad|Android(?!.*Mobile)|Tablet/i.test(
      navigator.userAgent,
    );
    const isTabletByRatio =
      width / height < 1.8 && width / height > 0.7 && width > 760;
    const isTabletByTouchPoints = touchPoints > 0 && touchPoints < 5; // Many tablets have fewer touch points than phones
    const isLikelyTablet =
      isTabletByUserAgent || (isTabletByRatio && isTabletByTouchPoints);

    // More reliable desktop detection
    const isDesktop =
      !hasTouchCapability || (width > breakpoints.xl && !isTabletByUserAgent);

    if (isDesktop && !isLikelyTablet) {
      return 'desktop';
    } else if (
      width < breakpoints.md ||
      (hasTouchCapability && width / height > 1.6)
    ) {
      return 'mobile'; // Most phones or small tablets in landscape
    } else {
      return 'tablet';
    }
  };

  // Utility functions to check if we're at a specific breakpoint
  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  const isDesktop = deviceType === 'desktop';

  // A true touch device has both touch capability AND is either mobile or tablet size
  const isTouchDevice = hasTouchCapability && (isMobile || isTablet);

  return {
    windowSize,
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
    hasTouchCapability,
    isTouchDevice,
  };
}
