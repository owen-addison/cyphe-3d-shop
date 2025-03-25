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
  const infoPointRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const ingredientRef = useRef<HTMLDivElement>(null);
  const [elementSizes, setElementSizes] = useState({
    bubbleWidth: 0,
    expandedWidth: 0,
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

  useEffect(() => {
    const measureElements = () => {
      if (bubbleRef.current && ingredientRef.current) {
        // Safely extract the size number from the bubbleSize class
        // First define a local variable with proper typing
        const bubbleSizeValue =
          typeof bubbleSize === 'string'
            ? parseInt(bubbleSize.split(' ')[1]?.replace('w-', '') || '4')
            : 4;

        // Use the properly typed local variable
        const calculatedBubbleSize = bubbleSizeValue * 4;

        // Get ingredient text width
        const ingredientRect = ingredientRef.current.getBoundingClientRect();

        setElementSizes({
          bubbleWidth: calculatedBubbleSize,
          expandedWidth: calculatedBubbleSize + ingredientRect.width + 8,
          height: 24,
        });
      }
    };

    // Only run if refs are available
    if (bubbleRef.current && ingredientRef.current) {
      setTimeout(measureElements, 100);
    }
  }, [bubbleSize]);

  // Setup circular animation once and use refs to track state changes
  useEffect(() => {
    // Only start animation if we have valid container dimensions
    if (containerDimensions.width <= 0 || containerDimensions.height <= 0) {
      return;
    }

    // Function to get current point size based on visible state
    const getPointSize = (): PointSize => {
      const currentIsVisible = isTouchDeviceRef.current || isHoveredRef.current;

      return {
        // Current visual width (what's currently displayed)
        width: currentIsVisible
          ? elementSizes.bubbleWidth
          : elementSizes.bubbleWidth,
        height: elementSizes.height,
        // Maximum width for movement calculations
        maxWidth: elementSizes.expandedWidth,
      };
    };

    // Start the animation with our enhanced circular motion utility
    const cleanup = animateCircularMotion(
      // Update callback - apply new position to motion control WITH ADJUSTMENT
      (position) => {
        // Calculate adjustment based on current state
        const currentPointSize = getPointSize();
        // This is the key change - we center the element horizontally
        // by subtracting half its width
        const adjustedX = position.x - currentPointSize.width / 2;

        controls.set({
          x: adjustedX,
          y: position.y,
        });
      },
      containerDimensions.width,
      containerDimensions.height,
      getPointSize,
      0.3,
      60,
      80,
      12,
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
        border: '1px dashed rgba(0,0,0,0.9)', // Use this for debugging only
      }}
    >
      <motion.div
        ref={infoPointRef}
        className="info-point-container absolute flex items-center"
        animate={controls}
      >
        <div
          ref={bubbleRef}
          className={`bubble-container mr-2 transition-all duration-700 ${isVisible ? 'h-2 w-2' : bubbleSize}`}
        >
          <span className="bubble block h-full w-full rounded-full border border-moss-800"></span>
        </div>
        <div
          ref={ingredientRef}
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
