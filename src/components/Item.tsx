import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import * as THREE from 'three';
import FloatingInfoPoint from './FloatingInfoPoint';
import ItemCounter from './ItemCounter';

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

const ingredientPositions = {
  1: [{ top: '30%', left: '50%' }],
  2: [
    { top: '10%', left: '20%' },
    { top: '70%', left: '70%' },
  ],
  3: [
    { top: '20%', left: '20%' },
    { top: '30%', left: '65%' },
    { top: '70%', left: '45%' },
  ],
  4: [
    { top: '10%', left: '20%' },
    { top: '10%', left: '80%' },
    { top: '70%', left: '30%' },
    { top: '80%', left: '70%' },
  ],
  5: [
    { top: '10%', left: '50%' },
    { top: '30%', left: '20%' },
    { top: '30%', left: '80%' },
    { top: '70%', left: '30%' },
    { top: '70%', left: '70%' },
  ],
  6: [
    { top: '10%', left: '30%' },
    { top: '10%', left: '70%' },
    { top: '50%', left: '10%' },
    { top: '50%', left: '90%' },
    { top: '90%', left: '30%' },
    { top: '90%', left: '70%' },
  ],
};

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

const Item: React.FC<ItemProps> = ({ data, toggleView }) => {
  const { id, name, ingredients } = data;
  const [isHovered, setIsHovered] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  // Get the positions based on the number of ingredients
  const positions =
    ingredientPositions[
      ingredients.length as keyof typeof ingredientPositions
    ] || ingredientPositions[6]; // Fallback to 6-ingredient layout if more than 6

  const handleHover = (hovering: boolean) => {
    setIsHovered(hovering);
  };

  const handleCountChange = (count: number) => {
    setItemCount(count);
  };

  const addToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    console.log(`Add ${itemCount} item(s) to cart, id = ${id}`);
  };

  // // Define positions for each float container
  // const positions = [
  //   { top: '10%', left: '10%' },
  //   { top: '50%', left: '15%' },
  //   { top: '30%', left: '80%' },
  //   { top: '20%', left: '70%' },
  //   // Add more positions as needed
  // ];

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
            position={positions[index] || positions[positions.length - 1]} // Fallback to last position if needed
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

      {/* Bottom section with title, counter, and button */}
      <div
        className="flex flex-col items-center justify-center"
        style={{ height: '20%' }}
      >
        <h3 className="mb-4 text-xl font-semibold">{name}</h3>
        <ItemCounter onCountChange={handleCountChange} />
        <button
          className="mt-2 rounded bg-moss-800 px-4 py-2 text-white transition-colors hover:bg-moss-900"
          onClick={addToCart}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default Item;
