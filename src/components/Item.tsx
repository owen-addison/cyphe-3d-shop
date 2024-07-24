import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import { motion, useAnimation } from 'framer-motion';
import * as THREE from 'three';

interface ItemData {
  id: number;
  name: string;
  imageSrc: string;
  ingredients: string[];
}

interface ItemProps {
  data: ItemData;
  isDetailedView: boolean;
  toggleView: () => void;
}

interface FloatingInfoPointProps {
  ingredient: string;
  isHovered: boolean;
  position: { top: string; left: string };
}

function Cube() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta;
      meshRef.current.rotation.y += delta;
    }
  });

  return (
    <Box ref={meshRef} args={[1, 1, 1]}>
      <meshStandardMaterial color="hotpink" />
    </Box>
  );
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
        transition: { duration: 10, ease: 'easeInOut' },
      });
    };

    animate(); // Run immediately
    const intervalId = setInterval(animate, 10000); // Then every 10 seconds

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
          className={`bubble-container mr-2 transition-all duration-300 ${isHovered ? 'h-4 w-4' : 'h-8 w-8'}`}
        >
          <span className="bubble block h-full w-full rounded-full border border-black"></span>
        </div>
        <div
          className={`ingredient-container max-w-[120px] overflow-hidden whitespace-nowrap transition-all duration-300 ${isHovered ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0'}`}
        >
          {ingredient}
        </div>
      </motion.div>
    </div>
  );
};

const Item: React.FC<ItemProps> = ({ data, toggleView }) => {
  // const [shouldShowDetails, setShouldShowDetails] = useState(false);
  const { id, name, ingredients } = data;
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = (hovering: boolean) => {
    setIsHovered(hovering);
  };

  const addToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    console.log(`Add item to cart, id = ${id}`);
  };

  // Define positions for each float container
  const positions = [
    { top: '10%', left: '10%' },
    { top: '20%', left: '60%' },
    { top: '50%', left: '15%' },
    { top: '60%', left: '70%' },
    // Add more positions as needed
  ];

  // useEffect(() => {
  //   if (isDetailedView) {
  //     setTimeout(() => {
  //       setShouldShowDetails(true);
  //     }, 500);
  //   } else {
  //     setShouldShowDetails(false);
  //   }
  // }, [isDetailedView]);

  return (
    <div className="item flex h-screen flex-col" onClick={toggleView}>
      {/* Top section with 3D view */}
      <div
        className="relative flex w-full flex-grow items-center justify-center"
        style={{ height: '80%' }}
      >
        {/* Multiple float containers for ingredients */}
        {ingredients.map((ingredient, index) => (
          <FloatingInfoPoint
            key={index}
            ingredient={ingredient}
            isHovered={isHovered}
            position={positions[index % positions.length]}
          />
        ))}

        {/* 3D view */}
        <div
          className="canvas-container"
          style={{ width: '400px', height: '400px' }}
          onMouseEnter={() => handleHover(true)}
          onMouseLeave={() => handleHover(false)}
        >
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Cube />
          </Canvas>
        </div>
      </div>

      {/* Bottom section with title and button */}
      <div
        className="flex flex-col items-center justify-center"
        style={{ height: '20%' }}
      >
        <h3 className="mb-4 text-xl font-semibold">{name}</h3>
        <button
          className="rounded bg-moss-800 px-4 py-2 text-white transition-colors hover:bg-moss-900"
          onClick={addToCart}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default Item;
