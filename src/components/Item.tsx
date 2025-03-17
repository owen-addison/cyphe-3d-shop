import React, { useEffect, useState } from 'react';
import SoapModel from './SoapModel';
import { Canvas } from '@react-three/fiber';
import FloatingInfoPoint from './FloatingInfoPoint';
import ItemCounter from './ItemCounter';
import { useResponsive } from '../hooks/useResponsive';

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

const Item: React.FC<ItemProps> = ({ data }) => {
  const { id, name, ingredients } = data;
  const { isMobile, isTablet, isTouchDevice } = useResponsive();
  const [isHovered, setIsHovered] = useState(false);
  const [itemCount, setItemCount] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(isTouchDevice);
  const [touchRotation, setTouchRotation] = useState({ x: 0, y: 0 });

  // Determine canvas size based on device type
  const getCanvasSize = () => {
    if (isMobile) {
      return { width: '300px', height: '300px' };
    } else if (isTablet) {
      return { width: '380px', height: '380px' };
    } else {
      return { width: '450px', height: '450px' };
    }
  };

  const canvasSize = getCanvasSize();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse position to normalized coordinates (-1 to 1)
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Touch handlers
  const handleTouch = (event: React.TouchEvent) => {
    if (event.touches.length === 1) {
      // Temporarily disable auto-rotation when user touches
      setAutoRotate(false);

      // Get touch position relative to container
      const touch = event.touches[0];
      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

      setTouchRotation({ x: y * 0.2, y: x * 0.5 });
    }
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      setAutoRotate(true);
    }, 1500); // Delay before returning to auto-rotation
  };

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

  // const addToCart = (
  //   event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  // ) => {
  //   event.stopPropagation();
  //   console.log(`Add ${itemCount} item(s) to cart, id = ${id}, name = ${name}`);
  // };

  return (
    <div className="item flex h-screen flex-col">
      {/* Container for the 3D model and floating info points */}
      <div
        className="relative flex w-full flex-grow items-center justify-center"
        style={{
          // Adjust height based on device for better proportions
          height: isMobile ? '70%' : isTablet ? '75%' : '80%',
        }}
      >
        {/* Show floating info points on all device types */}
        {ingredients.map((ingredient, index) => (
          <FloatingInfoPoint
            key={index}
            ingredient={ingredient}
            // On touch devices, isHovered should be forced to true to show ingredients
            isHovered={isTouchDevice || isHovered}
            position={positions[index] || positions[positions.length - 1]}
            bubbleSize={getBubbleSize(index)}
          />
        ))}

        <div
          className="canvas-container"
          style={{
            width: canvasSize.width,
            height: canvasSize.height,
          }}
          onMouseEnter={() => handleHover(true)}
          onMouseLeave={() => handleHover(false)}
          onTouchStart={handleTouch}
          onTouchMove={handleTouch}
          onTouchEnd={handleTouchEnd}
        >
          <Canvas camera={{ position: [1, 3, 5], fov: 45 }}>
            <ambientLight intensity={1.0} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={0.8}
              // eslint-disable-next-line react/no-unknown-property
              castShadow={false}
            />
            <directionalLight
              position={[-12, 2, 0]}
              intensity={0.5}
              // eslint-disable-next-line react/no-unknown-property
              castShadow={false}
            />
            <pointLight position={[10, 10, 10]} intensity={0.2} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            <pointLight position={[0, 0, 5]} intensity={0.2} />
            <SoapModel
              mousePosition={mousePosition}
              autoRotate={autoRotate}
              touchRotation={touchRotation}
            />
          </Canvas>
        </div>
      </div>

      {/* Product info and cart section */}
      <div
        className="flex flex-col items-center justify-start gap-4 space-y-4"
        style={{
          // Adjust height based on device
          height: isMobile ? '30%' : isTablet ? '25%' : '20%',
          // Adjust padding/margin based on device
          padding: isMobile ? '0.5rem 0' : isTablet ? '1rem 0' : '2rem 0',
        }}
      >
        <h3 className="font-mohave text-2xl font-light tracking-wider text-moss-800">
          {name}
        </h3>
        <div className="flex items-center gap-8">
          <ItemCounter onCountChange={handleCountChange} />
          <div className="flex items-center justify-center">
            <button
              className="snipcart-add-item group cursor-pointer font-mohave text-lg font-light tracking-wider text-moss-800 transition duration-300 group-hover:text-2xl"
              data-item-id={id.toString()}
              data-item-name={name}
              data-item-price="12.00"
              data-item-description={`Handmade soap with ${ingredients.join(', ')}`}
              data-item-quantity={itemCount}
              data-item-has-taxes-included="false"
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
