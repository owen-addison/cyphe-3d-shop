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

      // Determine device type based on both size and touch capability
      let newDeviceType: DeviceType;

      // Most mobile devices are touch-capable and smaller
      if (width < breakpoints.md) {
        newDeviceType = 'mobile';
      }
      // Tablets are typically touch-capable and mid-sized
      else if (width < breakpoints.lg) {
        newDeviceType = 'tablet';
      }
      // Desktop devices are typically larger
      else {
        newDeviceType = 'desktop';
      }

      setDeviceType(newDeviceType);

      console.log(
        `Device info - Type: ${newDeviceType}, Touch: ${hasTouchCapability}, Width: ${width}px`,
      );
    };

    // Initial call
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [hasTouchCapability]);

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
