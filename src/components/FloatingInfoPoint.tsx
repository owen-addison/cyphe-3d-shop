import React, { useState, useRef, useEffect } from 'react';
import { createBubble, animateBubble, AnimationConfig } from '../bubblePhysics';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [bubblePosition, setBubblePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      const bubble = createBubble(
        containerWidth / 2,
        containerHeight / 2,
        containerWidth,
        containerHeight,
      );

      const animationConfig: AnimationConfig = {
        brownianStrength: 0.08,
        springConstant: 0.0005,
        boundaryStrength: 20,
        damping: 0.98,
        timeScale: 0.9,
      };

      const animate = () => {
        animateBubble(
          bubble,
          (x, y) => setBubblePosition({ x, y }),
          animationConfig,
        );
        requestAnimationFrame(animate);
      };

      animate();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="float-container absolute h-40 w-52"
      style={{ top: position.top, left: position.left }}
    >
      <div
        className="info-point-container absolute flex h-8 items-center"
        style={{
          transform: `translate(${bubblePosition.x}px, ${bubblePosition.y}px)`,
        }}
      >
        <div
          className={`bubble-container mr-2 transition-all duration-700 ${isHovered ? 'h-2 w-2' : bubbleSize}`}
        >
          <span className="bubble block h-full w-full rounded-full border border-moss-800"></span>
        </div>
        <div
          className={`ingredient-container max-w-[120px] overflow-hidden whitespace-nowrap font-mohave font-light tracking-widest text-moss-800 transition-all duration-700 ${isHovered ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0'}`}
        >
          {ingredient.toLocaleLowerCase()}
        </div>
      </div>
    </div>
  );
};

export default FloatingInfoPoint;
