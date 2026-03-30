import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';

export default function SoulSphere({ position, color, icons, scale = 1, isCore = false, opacity = 0.8, onClick }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Generate random particles on a sphere surface for the "particle feel"
  const particleCount = isCore ? 300 : 150;
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.0 + (Math.random() - 0.5) * 0.15; // Slight radius variation
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, [particleCount]);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.lerp(position, 0.1);
      const targetScale = hovered ? scale * 1.2 : scale;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    // Rotate particles and wireframe for a futuristic dynamic feel
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.15;
      particlesRef.current.rotation.z = time * 0.1;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x = time * 0.2;
      wireframeRef.current.rotation.y = time * 0.25;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Invisible Hit Area for Interaction */}
      <mesh 
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[1.6, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Core Energy Glow - Soft inner light */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={(hovered ? 0.3 : 0.15) * opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      
      {/* Outer Soft Aura - Extremely faint boundary */}
      <mesh>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={(hovered ? 0.08 : 0.04) * opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Futuristic Wireframe Shell - Replaces the solid glass */}
      <mesh ref={wireframeRef}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={(hovered ? 0.3 : 0.15) * opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Particle Cloud - Adds the requested particle feel */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={particlesPosition} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color={color} transparent opacity={(hovered ? 1.0 : 0.8) * opacity} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation={true} />
      </points>

      {/* Floating Icons inside - Made more subtle and integrated */}
      {opacity > 0.1 && icons.map((Icon: any, i: number) => {
        const isSingle = icons.length === 1;
        const x = isSingle ? 0 : Math.sin((i / icons.length) * Math.PI * 2) * 0.3;
        const y = isSingle ? 0 : Math.cos((i / icons.length) * Math.PI * 2) * 0.3;
        const z = isSingle ? 0 : (Math.random() - 0.5) * 0.3;
        
        return (
          <Float key={i} speed={3} rotationIntensity={2} floatIntensity={2} position={[x, y, z]}>
            <Html center transform scale={0.4} style={{ pointerEvents: 'none' }}>
              <div className={`text-white/70 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-transform duration-300 ${hovered ? 'scale-125' : ''}`}>
                <Icon size={24} color={color} strokeWidth={1.5} />
              </div>
            </Html>
          </Float>
        );
      })}
    </group>
  );
}
