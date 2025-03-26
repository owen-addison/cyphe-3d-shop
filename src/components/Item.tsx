import React, { useEffect, useState, useMemo } from 'react';
import SoapModel from './SoapModel';
import { Canvas } from '@react-three/fiber';
// import FloatingInfoPoint from './FloatingInfoPoint';
// import FloatingInfoPointPolar from './FloatingInfoPointPolar';
import SimpleFloatingInfoPoint from './SimpleFloatingInfoPoint';
import ItemCounter from './ItemCounter';
import { useResponsive, DeviceType } from '../hooks/useResponsive';
import { distributeAngles } from '../utils/circularMotion';

interface ItemData {
  id: number;
  name: string;
  imageSrc: string;
  ingredients: string[];
}

interface ItemProps {
  data: ItemData;
}

// Define device-specific position maps
const getIngredientPositions = (deviceType: DeviceType) => {
  // Base positions
  const basePositions = {
    1: [{ top: '10%', left: '55%' }],
    2: [
      { top: '10%', left: '25%' },
      { top: '65%', left: '60%' },
    ],
    3: [
      { top: '5%', left: '45%' },
      { top: '35%', left: '20%' },
      { top: '55%', left: '65%' },
    ],
    4: [
      { top: '10%', left: '60%' },
      { top: '15%', left: '15%' },
      { top: '58%', left: '22%' },
      { top: '65%', left: '65%' },
    ],
    5: [
      { top: '8%', left: '45%' },
      { top: '25%', left: '10%' },
      { top: '30%', left: '75%' },
      { top: '60%', left: '18%' },
      { top: '65%', left: '68%' },
    ],
    6: [
      { top: '8%', left: '35%' },
      { top: '12%', left: '65%' },
      { top: '30%', left: '10%' },
      { top: '38%', left: '75%' },
      { top: '62%', left: '20%' },
      { top: '68%', left: '55%' },
    ],
  };

  // Mobile positions - constrained closer to center
  const mobilePositions = {
    1: [{ top: '8%', left: '45%' }],
    2: [
      { top: '8%', left: '15%' },
      { top: '65%', left: '48%' },
    ],
    3: [
      { top: '8%', left: '35%' },
      { top: '58%', left: '5%' },
      { top: '68%', left: '55%' },
    ],
    4: [
      { top: '8%', left: '8%' },
      { top: '12%', left: '55%' },
      { top: '62%', left: '5%' },
      { top: '68%', left: '52%' },
    ],
    5: [
      { top: '5%', left: '10%' },
      { top: '10%', left: '52%' },
      { top: '38%', left: '3%' },
      { top: '60%', left: '55%' },
      { top: '70%', left: '12%' },
    ],
    6: [
      { top: '5%', left: '10%' },
      { top: '8%', left: '52%' },
      { top: '38%', left: '5%' },
      { top: '40%', left: '60%' },
      { top: '70%', left: '8%' },
      { top: '72%', left: '55%' },
    ],
  };

  // Tablet positions - slightly more constrained than desktop
  const tabletPositions = {
    1: [{ top: '10%', left: '55%' }],
    2: [
      { top: '10%', left: '20%' },
      { top: '65%', left: '60%' },
    ],
    3: [
      { top: '10%', left: '45%' },
      { top: '40%', left: '10%' },
      { top: '65%', left: '60%' },
    ],
    4: [
      { top: '10%', left: '60%' },
      { top: '15%', left: '10%' },
      { top: '62%', left: '18%' },
      { top: '70%', left: '60%' },
    ],
    5: [
      { top: '8%', left: '45%' },
      { top: '25%', left: '8%' },
      { top: '35%', left: '68%' },
      { top: '62%', left: '18%' },
      { top: '70%', left: '60%' },
    ],
    6: [
      { top: '8%', left: '30%' },
      { top: '12%', left: '62%' },
      { top: '32%', left: '8%' },
      { top: '40%', left: '68%' },
      { top: '65%', left: '18%' },
      { top: '72%', left: '55%' },
    ],
  };

  // Return the appropriate positions based on device type
  if (deviceType === 'mobile') {
    return mobilePositions;
  } else if (deviceType === 'tablet') {
    return tabletPositions;
  } else {
    return basePositions;
  }
};

const bubbleSizes = ['h-4 w-4', 'h-5 w-5', 'h-6 w-6', 'h-7 w-7', 'h-8 w-8'];

const getBubbleSize = (index: number) => {
  return bubbleSizes[index % bubbleSizes.length];
};

const Item: React.FC<ItemProps> = ({ data }) => {
  const { id, name, ingredients } = data;
  const { isMobile, isTablet, isTouchDevice, deviceType } = useResponsive();
  const [isHovered, setIsHovered] = useState(false);
  const [itemCount, setItemCount] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Use a memoised value for autoRotate based on touch capability
  const autoRotate = useMemo(() => isTouchDevice, [isTouchDevice]);

  // Use our enhanced distributeAngles function for better ingredient point distribution
  const initialAngles = useMemo(
    () => distributeAngles(ingredients.length, 0.3), // 0.3 is randomness factor
    [ingredients.length],
  );

  // Get positions based on device type
  const ingredientPositionsMap = getIngredientPositions(deviceType);
  const positions =
    ingredientPositionsMap[
      ingredients.length as keyof typeof ingredientPositionsMap
    ] || ingredientPositionsMap[6];

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
      // Only update mouse position if we're on desktop and the mouse is in the hover area
      if (!isTouchDevice && isHovered) {
        // Convert mouse position to normalized coordinates (-1 to 1)
        setMousePosition({
          x: (event.clientX / window.innerWidth) * 2 - 1,
          y: -(event.clientY / window.innerHeight) * 2 + 1,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isTouchDevice, isHovered]);

  const handleHover = (hovering: boolean) => {
    setIsHovered(hovering);
  };

  const handleCountChange = (count: number) => {
    setItemCount(count);
  };

  return (
    <div className="item flex h-screen flex-col">
      {/* Container for the 3D model and floating info points */}
      <div
        className="relative flex w-full flex-grow items-center justify-center"
        style={{
          // Adjust height based on device for better proportions
          height: isMobile ? '70%' : isTablet ? '75%' : '80%',
        }}
        onMouseEnter={() => handleHover(true)}
        onMouseLeave={() => handleHover(false)}
      >
        {/* Show floating info points using the original position strategy */}
        {ingredients.map((ingredient, index) => (
          <SimpleFloatingInfoPoint
            key={`${id}-${ingredient}`}
            ingredient={ingredient}
            isHovered={isTouchDevice || isHovered}
            position={positions[index] || positions[positions.length - 1]}
            initialAngle={initialAngles[index]}
            bubbleSize={getBubbleSize(index)}
          />
        ))}

        <div
          className="canvas-container"
          style={{
            width: canvasSize.width,
            height: canvasSize.height,
          }}
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
            <SoapModel mousePosition={mousePosition} autoRotate={autoRotate} />
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
