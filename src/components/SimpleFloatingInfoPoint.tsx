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

  // Measure element sizes
  useEffect(() => {
    const measureElements = () => {
      if (bubbleRef.current && ingredientRef.current) {
        // Parse the bubble size number from class (e.g., "h-4 w-4" -> 4)
        const bubbleSizeValue =
          typeof bubbleSize === 'string'
            ? parseInt(bubbleSize.split(' ')[1]?.replace('w-', '') || '4')
            : 4;

        // Convert to pixels (approximately)
        const calculatedBubbleSize = bubbleSizeValue * 4; // 1rem ≈ 16px, 0.25rem = 4px

        // Measure ingredient text width
        const ingredientRect = ingredientRef.current.getBoundingClientRect();

        // Calculate total width when expanded (bubble + spacing + text)
        const totalExpandedWidth =
          calculatedBubbleSize + ingredientRect.width + 16;

        setElementSizes({
          bubbleWidth: calculatedBubbleSize,
          expandedWidth: totalExpandedWidth,
          height: 24, // Approximated height
        });
      }
    };

    // Wait for a moment to ensure DOM is ready
    setTimeout(measureElements, 100);
  }, [bubbleSize]);

  // Setup circular animation
  useEffect(() => {
    // Only start animation if we have valid dimensions
    if (
      containerDimensions.width <= 0 ||
      containerDimensions.height <= 0 ||
      elementSizes.expandedWidth <= 0
    ) {
      return;
    }

    // Function to provide current dimensions
    const getPointSize = (): PointSize => {
      const isVisible = isTouchDeviceRef.current || isHoveredRef.current;

      // Add extra safety buffer
      const safeExpandedWidth = elementSizes.expandedWidth + 10;

      return {
        // Current visual width
        width: isVisible
          ? elementSizes.expandedWidth
          : elementSizes.bubbleWidth,
        height: elementSizes.height,
        // Always use maxWidth for consistent boundary calculation
        maxWidth: safeExpandedWidth,
      };
    };

    // Start the animation
    const cleanup = animateCircularMotion(
      // Update callback applies calculated position
      (position) => {
        controls.set({
          x: position.x,
          y: position.y,
        });
      },
      containerDimensions.width,
      containerDimensions.height,
      getPointSize,
      0.15, // Slower speed for smoother movement
      75, // Fixed radius percentage
      0, // Unused parameter - kept for compatibility
      0, // Unused parameter - kept for compatibility
      initialAngle,
    );

    return cleanup;
  }, [
    containerDimensions.width,
    containerDimensions.height,
    elementSizes.expandedWidth,
    elementSizes.bubbleWidth,
    controls,
    initialAngle,
  ]);

  // Determine visibility state for rendering
  const isVisible = isTouchDevice || isHovered;

  return (
    <div
      ref={containerRef}
      className={`float-container pointer-events-none absolute z-30 ${containerSize}`}
      style={{
        top: position.top,
        left: position.left,
        // Subtle border for debugging - can be removed in production
        border: '1px dashed rgba(0,0,0,0.05)',
      }}
    >
      <motion.div
        ref={infoPointRef}
        className="info-point-container absolute flex items-center"
        animate={controls}
      >
        <div
          ref={bubbleRef}
          className={`bubble-container mr-2 transition-all duration-700 ${
            isVisible ? 'h-2 w-2' : bubbleSize
          }`}
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
