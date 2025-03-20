import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useResponsive } from '../hooks/useResponsive';

interface FloatingInfoPointProps {
  ingredient: string;
  isHovered: boolean;
  position: { top: string; left: string }; // Preserved from original for positioning
  initialAngle?: number; // Optional initial angle in radians
  bubbleSize: string;
}

/**
 * A component that displays an ingredient info point that floats in a circular pattern
 * using polar coordinates for more consistent and predictable movement,
 * while maintaining the original positioning strategy.
 */
const FloatingInfoPointPolar: React.FC<FloatingInfoPointProps> = ({
  ingredient,
  isHovered,
  position,
  initialAngle = Math.random() * Math.PI * 2, // Random angle if not provided
  bubbleSize,
}) => {
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile, isTablet, isTouchDevice } = useResponsive();
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Measure container dimensions
  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        setContainerDimensions({
          width: containerRef.current?.offsetWidth || 0,
          height: containerRef.current?.offsetHeight || 0,
        });
      };

      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, []);

  // Estimate text width for calculations
  const estimatedTextWidth = ingredient.length * 12 + 40; // 12px per character + padding
  const bubbleDiameter = 10; // Approximate size of bubble point in pixels

  // Determine container size based on device
  const containerSize = isMobile
    ? 'h-32 w-36'
    : isTablet
      ? 'h-36 w-44'
      : 'h-40 w-52';

  // On touch devices, we always show the ingredients
  const isVisible = isTouchDevice || isHovered;

  // Use polar coordinates to animate the info point within the positioned container
  useEffect(() => {
    if (containerDimensions.width === 0 || containerDimensions.height === 0)
      return;

    // Container center
    const centerX = containerDimensions.width / 2;
    const centerY = containerDimensions.height / 2;

    // Safety margin and orbit size calculations
    const safetyMargin = 10;

    // Maximum radius we can use (smaller of width/height, adjusted for content)
    const maxRadius = Math.min(
      containerDimensions.width / 2 -
        (isVisible ? estimatedTextWidth / 2 : bubbleDiameter) -
        safetyMargin,
      containerDimensions.height / 2 - bubbleDiameter - safetyMargin,
    );

    // Use a smaller radius to ensure we stay comfortably within bounds
    const effectiveRadius = Math.max(5, maxRadius * 0.7);

    // Start with the provided or random initial angle
    let currentAngle = initialAngle;

    const animateInCircle = () => {
      // Calculate new position based on polar coordinates
      const x = centerX + Math.cos(currentAngle) * effectiveRadius;
      const y = centerY + Math.sin(currentAngle) * effectiveRadius;

      // Ensure position is within container bounds
      const boundedX = Math.max(
        0,
        Math.min(
          x,
          containerDimensions.width -
            (isVisible ? estimatedTextWidth : bubbleDiameter),
        ),
      );
      const boundedY = Math.max(
        0,
        Math.min(y, containerDimensions.height - bubbleDiameter),
      );

      // Animate to the new position
      controls.start({
        x: boundedX,
        y: boundedY,
        transition: {
          duration: 7, // Slower, gentler movement
          ease: 'easeInOut',
        },
      });

      // Increment angle for next animation
      currentAngle += 0.15; // Adjust speed by changing this increment
      if (currentAngle > Math.PI * 2) {
        currentAngle -= Math.PI * 2; // Normalize angle
      }
    };

    // Start animation and repeat at intervals
    animateInCircle();
    const intervalId = setInterval(animateInCircle, 7000);

    return () => clearInterval(intervalId);
  }, [
    containerDimensions,
    controls,
    initialAngle,
    isVisible,
    estimatedTextWidth,
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
        initial={{
          x: containerDimensions.width / 2,
          y: containerDimensions.height / 2,
        }}
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

export default FloatingInfoPointPolar;
