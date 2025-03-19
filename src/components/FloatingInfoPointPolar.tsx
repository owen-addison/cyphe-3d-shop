import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useResponsive } from '../hooks/useResponsive';

interface FloatingInfoPointProps {
  ingredient: string;
  isHovered: boolean;
  position: { top: string; left: string };
  bubbleSize: string;
}

const FloatingInfoPointPolar: React.FC<FloatingInfoPointProps> = ({
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

  // Using polar coordinates for smooth movement that stays within bounds
  useEffect(() => {
    if (containerDimensions.width === 0 || containerDimensions.height === 0)
      return;

    // Safety margin and other constants
    const safetyMargin = 12; // pixels from edge
    const textWidth = Math.min(160, ingredient.length * 10 + 24); // Estimate text width with max cap
    const bubbleWidth = 12; // Approximate bubble size including margin
    const totalWidth = isVisible ? textWidth + bubbleWidth : bubbleWidth;

    // Calculate maximum safe radius (half the smallest dimension minus element size)
    // This ensures we never get too close to the edge
    const maxRadiusX =
      containerDimensions.width / 2 - totalWidth - safetyMargin;
    const maxRadiusY = containerDimensions.height / 2 - 10 - safetyMargin; // Height is smaller

    // Center of container
    const centerX = containerDimensions.width / 2;
    const centerY = containerDimensions.height / 2;

    // Starting angle for this specific point
    // Derive a relatively unique starting angle from first character code of ingredient
    const startingAngle = (ingredient.charCodeAt(0) % 10) * (Math.PI / 5);

    const animateOnPolarPath = () => {
      // Animation loop using requestAnimationFrame
      let frame = 0;
      let previousTimestamp: number;

      const animate = (timestamp: number) => {
        if (!previousTimestamp) previousTimestamp = timestamp;

        // Only update every few frames for smoother, slower motion
        const elapsed = timestamp - previousTimestamp;
        if (elapsed > 30) {
          // Update roughly every 30ms
          previousTimestamp = timestamp;
          frame++;

          // Calculate current angle with slight random variation
          // Use time-based animation with the ingredient's character code as a seed
          const angleOffset = frame / 300 + Math.sin(frame / 200) * 0.2;
          const angle = startingAngle + angleOffset;

          // Calculate radius with slight variations to make movement more organic
          // Multiple sine waves of different frequencies create a more natural motion
          const radiusMultiplierX = 0.8 + Math.sin(frame / 380) * 0.15;
          const radiusMultiplierY = 0.8 + Math.cos(frame / 420) * 0.15;

          // Final coordinates using polar to cartesian conversion
          const x =
            centerX +
            Math.cos(angle) * maxRadiusX * radiusMultiplierX -
            totalWidth / 2;
          const y =
            centerY + Math.sin(angle) * maxRadiusY * radiusMultiplierY - 10 / 2;

          controls.set({ x, y });
        }

        animationRef.current = requestAnimationFrame(animate);
      };

      const animationRef = { current: requestAnimationFrame(animate) };

      return () => {
        cancelAnimationFrame(animationRef.current);
      };
    };

    const cleanup = animateOnPolarPath();
    return cleanup;
  }, [containerDimensions, controls, ingredient, isVisible]);

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
          className={`ingredient-container max-w-[160px] overflow-hidden whitespace-nowrap rounded-sm bg-[#dbddd6] bg-opacity-80 px-2 py-0.5 font-mohave font-light tracking-widest text-moss-800 transition-all duration-700 ${isVisible ? 'max-w-[160px] opacity-100' : 'max-w-0 opacity-0'}`}
        >
          {ingredient.toLocaleLowerCase()}
        </div>
      </motion.div>
    </div>
  );
};

export default FloatingInfoPointPolar;
