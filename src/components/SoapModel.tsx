import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Model as SoapBar2 } from './SoapBar2';
import { useResponsive } from '../hooks/useResponsive';

interface SoapModelProps {
  mousePosition: { x: number; y: number };
  autoRotate: boolean;
  touchRotation: { x: number; y: number };
}

const SoapModel: React.FC<SoapModelProps> = ({
  mousePosition,
  autoRotate,
  touchRotation,
}) => {
  const modelRef = useRef<THREE.Group>(null);
  const { deviceType } = useResponsive();
  const autoRotateSpeed = 0.005;

  // Adjust scale based on device type
  const getModelScale = () => {
    switch (deviceType) {
      case 'mobile':
        return 30;
      case 'tablet':
        return 35;
      default:
        return 40;
    }
  };

  const scale = getModelScale();

  useFrame(() => {
    if (modelRef.current) {
      if (autoRotate) {
        // Auto-rotate
        modelRef.current.rotation.y += autoRotateSpeed;
      } else {
        const rotationSpeed = 0.1;

        // If we have touch rotation data, use it directly
        if (touchRotation.x !== 0 || touchRotation.y !== 0) {
          modelRef.current.rotation.x = touchRotation.x;
          modelRef.current.rotation.y = touchRotation.y;
        } else {
          // Otherwise use mouse position for rotation
          const targetRotationY = mousePosition.x * Math.PI * 0.5;
          const targetRotationX = -mousePosition.y * Math.PI * 0.2;

          modelRef.current.rotation.y +=
            (targetRotationY - modelRef.current.rotation.y) * rotationSpeed;
          modelRef.current.rotation.x +=
            (targetRotationX - modelRef.current.rotation.x) * rotationSpeed;
        }
      }
    }
  });

  return (
    <group ref={modelRef}>
      <SoapBar2 scale={scale} rotation={[Math.PI / 6, -Math.PI / 2, 0]} />
    </group>
  );
};

export default SoapModel;
