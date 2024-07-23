import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
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
  // const [shouldShowDetails, setShouldShowDetails] = useState(false);
  const { id, name } = data;

  // Placeholder text for ingredients
  const ingredient1 = 'Olive Oil';

  const addToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    console.log(`Add item to cart, id = ${id}`);
  };

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
        {/* Container for the floating div */}
        <div className="float-container absolute inset-1/4 h-40 w-52">
          {/* Container for the bubble and ingredient text */}
          <div className="info-point-container flex h-8 w-full gap-1">
            <div className="bubble-container mr-2 h-8 w-8">
              <span className="bubble block h-full w-full rounded-full border border-black"></span>
            </div>
            <div className="ingredient-container flex-1 whitespace-nowrap">
              {ingredient1}
            </div>
          </div>
        </div>
        {/* 3D view */}
        <div style={{ width: '400px', height: '400px' }}>
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
