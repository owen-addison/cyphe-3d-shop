import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { animateOscillatingMotion } from '../utils/simpleMotion';
import { useResponsive } from '../hooks/useResponsive';

interface SimpleFloatingInfoPointProps {
  ingredient: string;
  isHovered: boolean;
  position: { top: string; left: string };
  initialAngle?: number;
  bubbleSize: string;
  deviceType: string;
}

/**
 * A floating info point component that moves with smooth oscillating motion
 * and shows/hides the ingredient text based on hover state
 */
const SimpleFloatingInfoPoint: React.FC<SimpleFloatingInfoPointProps> = ({
  ingredient,
  isHovered,
  position,
  initialAngle,
  bubbleSize,
  deviceType,
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
    totalWidth: 0,
    height: 0,
  });

  const containerSize = isMobile
    ? 'h-32 w-36'
    : isTablet
      ? 'h-36 w-44'
      : 'h-40 w-52';

  const getTailwindSizePixels = (sizeClass: string) => {
    const sizes: { [key: string]: number } = {
      'w-36': 144,
      'w-44': 176,
      'w-52': 208,
      'h-32': 128,
      'h-36': 144,
      'h-40': 160,
    };
    return sizes[sizeClass] || 0;
  };

  useEffect(() => {
    const [heightClass, widthClass] = containerSize.split(' ');

    setContainerDimensions({
      width: getTailwindSizePixels(widthClass),
      height: getTailwindSizePixels(heightClass),
    });
  }, [containerSize]);

  // Measure element sizes
  useEffect(() => {
    const measureElements = () => {
      if (bubbleRef.current) {
        // Parse the bubble size number from class (e.g., "h-4 w-4" -> 4)
        const bubbleSizeValue =
          typeof bubbleSize === 'string'
            ? parseInt(bubbleSize.split(' ')[1]?.replace('w-', '') || '4')
            : 4;

        // Convert to pixels (approximately)
        const calculatedBubbleSize = bubbleSizeValue * 4; // 1rem ≈ 16px, 0.25rem = 4px

        // Use a fixed maximum width for ingredient text
        const maxIngredientWidth = 120; // pixels
        const paddingX = 16; // px (2 * 8px)
        const marginRight = 8; // mr-2 in Tailwind

        setElementSizes({
          totalWidth:
            calculatedBubbleSize +
            maxIngredientWidth +
            marginRight +
            paddingX +
            16,
          height: 60,
        });
      }
    };

    // Wait for a moment to ensure DOM is ready
    setTimeout(measureElements, 100);
  }, [bubbleSize]);

  // Setup oscillating animation
  useEffect(() => {
    // Only start animation if we have valid dimensions
    if (
      containerDimensions.width <= 0 ||
      containerDimensions.height <= 0 ||
      elementSizes.totalWidth <= 0
    ) {
      return;
    }

    // Custom frequencies for more varied motion
    const xFrequency = 0.5 + Math.random() * 0.2; // 0.5-0.7
    const yFrequency = 0.2 + Math.random() * 0.2; // 0.2-0.4

    // Use different amplitude percentages for variety
    const xAmplitude = 100; // 60-80%
    const yAmplitude = 100; // 60-80%

    // Start the oscillating animation
    const cleanup = animateOscillatingMotion(
      // Update callback applies calculated position
      (position) => {
        controls.set({
          x: position.x,
          y: position.y,
        });
      },
      containerDimensions.width,
      containerDimensions.height,
      elementSizes.totalWidth,
      elementSizes.height,
      xFrequency,
      yFrequency,
      xAmplitude,
      yAmplitude,
      deviceType,
    );

    return cleanup;
  }, [
    containerDimensions.width,
    containerDimensions.height,
    elementSizes.totalWidth,
    elementSizes.height,
    controls,
    initialAngle,
    deviceType,
  ]);

  // Determine visibility state for rendering
  const isVisible = isTouchDevice || isHovered;

  return (
    <div
      ref={containerRef}
      className={`float-container pointer-events-none absolute isolate z-30 ${containerSize}`}
      style={{
        top: position.top,
        left: position.left,
        // Debugging border
        border: '1px dashed rgba(153, 27, 27, 1)',
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
          className={`ingredient-container max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap rounded-sm bg-[#dbddd6] bg-opacity-80 px-2 py-0.5 font-mohave font-light tracking-widest text-moss-800 transition-opacity duration-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {ingredient.toLowerCase()}
        </div>
      </motion.div>
    </div>
  );
};

export default SimpleFloatingInfoPoint;
