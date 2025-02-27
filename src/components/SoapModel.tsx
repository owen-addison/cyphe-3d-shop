import React, { useRef } from 'react';
// import { Model as SoapBar1 } from './SoapBar1';
import { Model as SoapBar2 } from './SoapBar2';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SoapModel: React.FC<{ mousePosition: { x: number; y: number } }> = ({
  mousePosition,
}) => {
  const modelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (modelRef.current) {
      const rotationSpeed = 0.1;
      const targetRotationY = mousePosition.x * Math.PI * 0.5;
      const targetRotationX = -mousePosition.y * Math.PI * 0.2;

      modelRef.current.rotation.y +=
        (targetRotationY - modelRef.current.rotation.y) * rotationSpeed;
      modelRef.current.rotation.x +=
        (targetRotationX - modelRef.current.rotation.x) * rotationSpeed;
    }
  });

  return (
    <group ref={modelRef}>
      <SoapBar2 scale={40} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  );
};

export default SoapModel;
