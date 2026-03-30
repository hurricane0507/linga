import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Line, Html } from '@react-three/drei';

interface StoryNodeProps {
  position: THREE.Vector3;
  color: string;
  type: 'user' | 'ai' | 'shared';
  isActive?: boolean;
}

export default function StoryNode({ position, color, type, isActive }: StoryNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.02;
    }
    if (groupRef.current) {
      // Floating effect
      groupRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 2 + position.x) * 0.2;
    }
  });

  // Calculate connection line points
  // Connect to the center axis (0, y, 0) for shared, or to the strand for user/ai
  const connectionEnd = type === 'shared' 
    ? new THREE.Vector3(0, 0, 0) 
    : new THREE.Vector3(-position.x * 0.8, 0, -position.z * 0.8); // Connect towards center

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      {/* Outer energy shell */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[isActive ? 0.8 : 0.4, 1]} />
        <meshBasicMaterial 
          color={color} 
          wireframe 
          transparent 
          opacity={0.3} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Inner core */}
      <mesh>
        <sphereGeometry args={[isActive ? 0.4 : 0.15, 16, 16]} />
        <meshBasicMaterial 
          color={isActive ? "#ffffff" : color} 
          transparent 
          opacity={0.8} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Connection line */}
      <Line
        points={[[0, 0, 0], [connectionEnd.x, connectionEnd.y, connectionEnd.z]]}
        color={color}
        lineWidth={1}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />

      {/* Label */}
      <Html position={[0.8, 0, 0]} center>
        <div className="flex flex-col items-start pointer-events-none whitespace-nowrap">
          <div className="text-white text-[10px] tracking-widest" style={{ textShadow: '0 0 4px black' }}>
            {`[${type.toUpperCase()}_NODE]`}
          </div>
          {isActive && (
            <div className="text-sky-400 text-[8px] tracking-widest mt-1" style={{ textShadow: '0 0 4px black' }}>
              SUPERPOSITION DETECTED
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
