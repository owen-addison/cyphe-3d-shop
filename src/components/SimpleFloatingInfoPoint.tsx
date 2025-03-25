import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { animateCircularMotion, PointSize } from '../utils/circularMotion';
import { useResponsive } from '../hooks/useResponsive';

interface SimpleFloatingInfoPointProps {
  ingredient: string;
  isHovered: boolean;
  position: { top: string; left: string };
  initialAngle?: number;
  bubbleSize: string;
}

/**
 * A floating info point component that orbits in a circular pattern
 * and dynamically adapts to size changes when hover state changes
 */
const SimpleFloatingInfoPoint: React.FC<SimpleFloatingInfoPointProps> = ({
  ingredient,
  isHovered,
  position,
  initialAngle,
  bubbleSize,
}) => {
  // Refs and state
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const { isMobile, isTablet, isTouchDevice } = useResponsive();
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Use refs to track hover state without triggering effect reruns
  const isHoveredRef = useRef(isHovered);
  const isTouchDeviceRef = useRef(isTouchDevice);

  // Update refs when props change
  useEffect(() => {
    isHoveredRef.current = isHovered;
    isTouchDeviceRef.current = isTouchDevice;
  }, [isHovered, isTouchDevice]);

  // Calculate text width based on ingredient length (with padding)
  const estimatedTextWidth = ingredient.length * 12 + 40;

  // Determine container size based on device
  const containerSize = isMobile
    ? 'h-32 w-36'
    : isTablet
      ? 'h-36 w-44'
      : 'h-40 w-52';

  // Measure container dimensions
  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        if (containerRef.current) {
          setContainerDimensions({
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
          });
        }
      };

      // Initial measurement
      updateDimensions();

      // Re-measure on resize
      window.addEventListener('resize', updateDimensions);

      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, []);

  // Setup circular animation once and use refs to track state changes
  useEffect(() => {
    // Only start animation if we have valid container dimensions
    if (containerDimensions.width <= 0 || containerDimensions.height <= 0) {
      return;
    }

    // Debugging line for inspecting container dimensions
    // console.log('Container dimensions for', ingredient, containerDimensions);

    // Function to get current point size based on visible state
    // This will use the current value from the refs, not triggering re-renders
    const getPointSize = (): PointSize => {
      // Always use the maximum size for position calculations
      // This ensures movement boundaries are consistent
      const maxWidth = estimatedTextWidth + 20; // Add extra margin for the bubble
      const maxHeight = 24; // Slightly larger than text height

      // Current visible state still affects rendering, not movement boundaries
      const currentIsVisible = isTouchDeviceRef.current || isHoveredRef.current;

      return {
        // Always return the maximum dimensions for movement calculation
        width: maxWidth,
        height: maxHeight,
        // Use the full width as offset to ensure proper horizontal positioning
        offsetX: maxWidth / 2,
        // Add a flag to indicate current visual state (doesn't affect movement calculation)
        isExpanded: currentIsVisible,
      };
    };

    // Start the animation with our enhanced circular motion utility
    const cleanup = animateCircularMotion(
      // Update callback - apply new position to motion control
      (position) => {
        controls.set({
          x: position.x,
          y: position.y,
        });
      },
      containerDimensions.width,
      containerDimensions.height,
      getPointSize,
      0.3, // Speed (radians per second)
      60, // Min radius percentage
      80, // Max radius percentage
      12, // Radius oscillation period
      initialAngle,
    );

    // Clean up on unmount or when container dimensions change
    return cleanup;
  }, [
    containerDimensions.width,
    containerDimensions.height,
    controls,
    estimatedTextWidth,
    initialAngle,
    // No dependency on isHovered or isTouchDevice
  ]);

  // Only calculate visibility for rendering, not for animation
  const isVisible = isTouchDevice || isHovered;

  return (
    <div
      ref={containerRef}
      className={`float-container pointer-events-none absolute z-30 ${containerSize}`}
      style={{
        top: position.top,
        left: position.left,
        // Remove the border used for debugging
        // border: '1px dashed rgba(0,0,0,0.1)' // Use this for debugging only
      }}
    >
      <motion.div
        className="info-point-container absolute flex items-center"
        animate={controls}
      >
        <div
          className={`bubble-container mr-2 transition-all duration-700 ${isVisible ? 'h-2 w-2' : bubbleSize}`}
        >
          <span className="bubble block h-full w-full rounded-full border border-moss-800"></span>
        </div>
        <div
          className={`ingredient-container overflow-hidden whitespace-nowrap rounded-sm bg-[#dbddd6] bg-opacity-80 px-2 py-0.5 font-mohave font-light tracking-widest text-moss-800 transition-all duration-500 ${
            isVisible ? 'max-w-[180px] opacity-100' : 'max-w-0 opacity-0'
          }`}
        >
          {ingredient.toLowerCase()}
        </div>
      </motion.div>
    </div>
  );
};

export default SimpleFloatingInfoPoint;
