import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface FloatingInfoPointProps {
  ingredient: string;
  isHovered: boolean;
  position: { top: string; left: string };
}

const FloatingInfoPoint: React.FC<FloatingInfoPointProps> = ({
  ingredient,
  isHovered,
  position,
}) => {
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  const generateRandomPosition = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      const infoPointWidth =
        container.querySelector('.info-point-container')?.clientWidth || 0;
      const infoPointHeight =
        container.querySelector('.info-point-container')?.clientHeight || 0;

      const maxX = containerWidth - infoPointWidth;
      const maxY = containerHeight - infoPointHeight;

      return {
        x: Math.random() * maxX,
        y: Math.random() * maxY,
      };
    }
    return { x: 0, y: 0 };
  };

  const startFloatingAnimation = () => {
    const animate = () => {
      const newPosition = generateRandomPosition();
      controls.start({
        x: newPosition.x,
        y: newPosition.y,
        transition: { duration: 7, ease: 'easeInOut' },
      });
    };

    animate(); // Run immediately
    const intervalId = setInterval(animate, 7000); // Then every 10 seconds

    return () => clearInterval(intervalId); // Clean up function
  };

  useEffect(() => {
    const cleanup = startFloatingAnimation();
    return cleanup;
  }, []);

  return (
    <div
      ref={containerRef}
      className="float-container absolute h-40 w-52"
      style={{ top: position.top, left: position.left }}
    >
      <motion.div
        className="info-point-container absolute flex h-8 items-center"
        animate={controls}
      >
        <div
          className={`bubble-container mr-2 transition-all duration-700 ${isHovered ? 'h-4 w-4' : 'h-8 w-8'}`}
        >
          <span className="bubble block h-full w-full rounded-full border border-black"></span>
        </div>
        <div
          className={`ingredient-container max-w-[120px] overflow-hidden whitespace-nowrap transition-all duration-700 ${isHovered ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0'}`}
        >
          {ingredient}
        </div>
      </motion.div>
    </div>
  );
};

export default FloatingInfoPoint;
