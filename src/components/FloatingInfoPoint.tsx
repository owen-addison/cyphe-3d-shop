import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useResponsive } from '../hooks/useResponsive';

interface FloatingInfoPointProps {
  ingredient: string;
  isHovered: boolean;
  position: { top: string; left: string };
  bubbleSize: string;
}

const FloatingInfoPoint: React.FC<FloatingInfoPointProps> = ({
  ingredient,
  isHovered,
  position,
  bubbleSize,
}) => {
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile, isTablet, isTouchDevice } = useResponsive();
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Rough estimate of ingredient text width - 12px per character plus padding
  const estimatedTextWidth = ingredient.length * 12 + 20;

  // Determine container size based on device
  const containerSize = isMobile
    ? 'h-32 w-36'
    : isTablet
      ? 'h-36 w-44'
      : 'h-40 w-52';

  // On touch devices, we might want to always show the ingredients or have a different interaction pattern
  const isVisible = isTouchDevice || isHovered;

  // Measure container once it's mounted
  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        setContainerDimensions({
          width: containerRef.current?.offsetWidth || 0,
          height: containerRef.current?.offsetHeight || 0,
        });
      };

      updateDimensions();

      // Re-measure on window resize
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, []);

  // Use a simpler approach for floating animation that guarantees containment
  useEffect(() => {
    if (containerDimensions.width === 0) return; // Skip until we have dimensions

    // Safety margins
    const safetyMargin = 20;
    const bubbleSize = 10; // Approximate bubble size

    // Maximum x position needs to account for the text width when expanded
    const maxX =
      containerDimensions.width -
      estimatedTextWidth -
      bubbleSize -
      safetyMargin;
    // Maximum y position just needs to account for the bubble height
    const maxY = containerDimensions.height - bubbleSize - safetyMargin;

    // If maxX is negative, we need to allow the ingredient to overflow a bit
    // but we'll still try to minimize it
    const effectiveMaxX = Math.max(10, maxX);
    const effectiveMaxY = Math.max(10, maxY);

    const animateToNewPosition = () => {
      const x = Math.min(Math.random() * effectiveMaxX, effectiveMaxX);
      const y = Math.min(Math.random() * effectiveMaxY, effectiveMaxY);

      controls.start({
        x,
        y,
        transition: {
          duration: 7,
          ease: 'easeInOut',
        },
      });
    };

    animateToNewPosition();
    const intervalId = setInterval(animateToNewPosition, 7000);

    return () => clearInterval(intervalId);
  }, [containerDimensions, controls, estimatedTextWidth]);

  return (
    <div
      ref={containerRef}
      className={`float-container pointer-events-none absolute z-30 ${containerSize} border-2 border-solid border-red-500 bg-red-100 bg-opacity-20`}
      style={{ top: position.top, left: position.left }}
    >
      <motion.div
        className="info-point-container absolute flex h-8 items-center"
        animate={controls}
      >
        <div
          className={`bubble-container mr-2 transition-all duration-700 ${isVisible ? 'h-2 w-2' : bubbleSize}`}
        >
          <span className="bubble block h-full w-full rounded-full border border-moss-800"></span>
        </div>
        <div
          className={`ingredient-container max-w-[180px] overflow-hidden whitespace-nowrap rounded-sm bg-[#dbddd6] bg-opacity-80 px-2 py-0.5 font-mohave font-light tracking-widest text-moss-800 transition-all duration-700 ${isVisible ? 'max-w-[180px] opacity-100' : 'max-w-0 opacity-0'}`}
        >
          {ingredient.toLocaleLowerCase()}
        </div>
      </motion.div>
    </div>
  );
};

export default FloatingInfoPoint;
