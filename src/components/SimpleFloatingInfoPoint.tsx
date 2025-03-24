import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { animateCircularMotion } from '../utils/circularMotion';
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

  // Calculate text width based on ingredient length (with padding)
  const estimatedTextWidth = ingredient.length * 12 + 40;

  // On touch devices, we always show the ingredients
  const isVisible = isTouchDevice || isHovered;

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

  // Setup circular animation with dynamic size adaptation
  useEffect(() => {
    // Only start animation if we have valid container dimensions
    if (containerDimensions.width <= 0 || containerDimensions.height <= 0) {
      return;
    }

    // Function to get current point size based on visible state
    // This will be called on each animation frame to get the current size
    const getPointSize = () => {
      // When expanded (showing ingredient text), we need more space
      if (isVisible) {
        return {
          width: estimatedTextWidth,
          height: 20, // Height of the bubble + text
        };
      }
      // When collapsed (just bubble), we use bubble size
      else {
        return {
          width: 10, // Bubble width
          height: 10, // Bubble height
        };
      }
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

    // Clean up on unmount or when dependencies change
    return cleanup;
  }, [
    containerDimensions.width,
    containerDimensions.height,
    controls,
    isVisible,
    estimatedTextWidth,
    initialAngle,
  ]);

  return (
    <div
      ref={containerRef}
      className={`float-container pointer-events-none absolute z-30 ${containerSize}`}
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <motion.div
        className="info-point-container absolute flex items-center"
        animate={controls}
        // No initial prop - we'll set position via animation function
      >
        <div
          className={`bubble-container mr-2 transition-all duration-700 ${isVisible ? 'h-2 w-2' : bubbleSize}`}
        >
          <span className="bubble block h-full w-full rounded-full border border-moss-800"></span>
        </div>
        <div
          className={`ingredient-container max-w-[180px] overflow-hidden whitespace-nowrap rounded-sm bg-[#dbddd6] bg-opacity-80 px-2 py-0.5 font-mohave font-light tracking-widest text-moss-800 transition-all duration-700 ${isVisible ? 'max-w-[180px] opacity-100' : 'max-w-0 opacity-0'}`}
        >
          {ingredient.toLowerCase()}
        </div>
      </motion.div>
    </div>
  );
};

export default SimpleFloatingInfoPoint;
