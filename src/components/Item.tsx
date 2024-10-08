import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box } from '@react-three/drei';
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
}

const ingredientPositions = {
  1: [{ top: '30%', left: '50%' }],
  2: [
    { top: '10%', left: '25%' },
    { top: '50%', left: '60%' },
  ],
  3: [
    { top: '35%', left: '20%' },
    { top: '55%', left: '65%' },
    { top: '3%', left: '45%' },
  ],
  4: [
    { top: '15%', left: '20%' },
    { top: '10%', left: '55%' },
    { top: '55%', left: '27%' },
    { top: '65%', left: '65%' },
  ],
  5: [
    { top: '10%', left: '50%' },
    { top: '30%', left: '20%' },
    { top: '30%', left: '80%' },
    { top: '55%', left: '30%' },
    { top: '60%', left: '70%' },
  ],
  6: [
    { top: '10%', left: '30%' },
    { top: '10%', left: '70%' },
    { top: '25%', left: '10%' },
    { top: '35%', left: '60%' },
    { top: '50%', left: '30%' },
    { top: '60%', left: '70%' },
  ],
};

const bubbleSizes = ['h-4 w-4', 'h-5 w-5', 'h-6 w-6', 'h-7 w-7', 'h-8 w-8'];

const getBubbleSize = (index: number) => {
  return bubbleSizes[index % bubbleSizes.length];
};

function Cube() {
  return (
    <Box args={[1, 1, 1]}>
      <meshStandardMaterial color="hotpink" />
    </Box>
  );
}

const Item: React.FC<ItemProps> = ({ data }) => {
  const { id, name, ingredients } = data;
  const [isHovered, setIsHovered] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  const positions =
    ingredientPositions[
      ingredients.length as keyof typeof ingredientPositions
    ] || ingredientPositions[6];

  const handleHover = (hovering: boolean) => {
    setIsHovered(hovering);
  };

  const handleCountChange = (count: number) => {
    setItemCount(count);
  };

  const addToCart = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    console.log(`Add ${itemCount} item(s) to cart, id = ${id}`);
  };

  return (
    <div className="item flex h-screen flex-col">
      <div
        className="relative flex w-full flex-grow items-center justify-center"
        style={{ height: '80%' }}
      >
        {ingredients.map((ingredient, index) => (
          <FloatingInfoPoint
            key={index}
            ingredient={ingredient}
            isHovered={isHovered}
            position={positions[index] || positions[positions.length - 1]}
            bubbleSize={getBubbleSize(index)}
          />
        ))}

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

      <div
        className="my-8 flex flex-col items-center justify-start gap-4 space-y-4"
        style={{ height: '20%' }}
      >
        <h3 className="font-mohave text-2xl font-light tracking-wider text-moss-800">
          {name}
        </h3>
        <div className="flex items-center gap-8">
          <ItemCounter onCountChange={handleCountChange} />
          <div className="flex items-center justify-center">
            <button
              className="font-mohave group cursor-pointer text-lg font-light tracking-wider text-moss-800 transition duration-300 group-hover:text-2xl"
              onClick={addToCart}
            >
              <span className="flex flex-row items-center">
                <span className="flex h-8 w-6 items-center justify-center text-right transition-all group-hover:text-xl">
                  &gt;
                </span>
                <span className="flex flex-col">
                  <span className="font-light">add to cart</span>
                  <span className="block h-0.5 max-w-0 bg-moss-800 bg-opacity-70 transition-all duration-500 group-hover:max-w-full"></span>
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
