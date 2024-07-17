import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';

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

const Item: React.FC<ItemProps> = ({ data, isDetailedView, toggleView }) => {
  const [shouldShowDetails, setShouldShowDetails] = useState(false);
  const { id } = data;

  const addToBasket = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    console.log(`Add item to basket, id = ${id}`);
  };

  useEffect(() => {
    if (isDetailedView) {
      setTimeout(() => {
        setShouldShowDetails(true);
      }, 500);
    } else {
      setShouldShowDetails(false);
    }
  }, [isDetailedView]);

  return (
    <div className="item" onClick={toggleView}>
      {/* 3D Cube container */}
      <div className="item-lhs p-4" style={{ width: '400px', height: '400px' }}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Cube />
        </Canvas>
      </div>
      {/* Description box that resizes and then fades in content */}
      <div
        className={`item-rhs flex flex-col content-center justify-center overflow-hidden transition-all duration-500 ease-in-out ${
          isDetailedView ? 'w-80 gap-4 p-4' : 'w-0 gap-0 p-0'
        } ${shouldShowDetails ? 'opacity-100' : 'opacity-0'}`}
      >
        {shouldShowDetails && (
          <>
            <div className="item-details-container font-sans tracking-widest text-moss-950">
              <h3 className="item-header font-semibold">{data.name}</h3>
              <div className="flex flex-col content-center justify-center">
                <ul className="item-ingredients w-max list-disc self-center text-start">
                  {data.ingredients.map((ingredient: string, index: number) => (
                    <li key={index} className="ingredient">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              className="add-button w-max self-center rounded border border-moss-800 bg-moss-800 px-4 py-2 font-semibold text-slate-100 transition-colors duration-200 ease-in-out hover:border-moss-950 hover:bg-moss-950"
              onClick={addToBasket}
            >
              Add to basket
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Item;
