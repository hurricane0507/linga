import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function HexagonEnvironment({ mergeProgress }: { mergeProgress: number }) {
  const count = 300;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const r = 15 + Math.random() * 5; // Room radius
      temp.push({
        pos: new THREE.Vector3(r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi)),
        scale: 0.5 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2
      });
    }
    return temp;
  }, [count]);

  const baseColor = useMemo(() => new THREE.Color("#1e1b4b"), []); // Dark purple
  const activeColor = useMemo(() => new THREE.Color("#a855f7"), []); // Bright purple
  const colorObj = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.elapsedTime;
    
    // As mergeProgress increases, the room expands slightly and glows brighter
    const expansion = 1 + mergeProgress * 0.2;
    
    particles.forEach((p, i) => {
      dummy.position.copy(p.pos).multiplyScalar(expansion);
      dummy.lookAt(0, 0, 0);
      
      // Pulse scale based on time and merge progress
      const s = p.scale * (1 + Math.sin(time * 2 + p.phase) * 0.2 + mergeProgress * 0.5);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      
      // Update color based on merge progress
      colorObj.lerpColors(baseColor, activeColor, mergeProgress * (0.5 + Math.sin(time + p.phase)*0.5));
      meshRef.current!.setColorAt(i, colorObj);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[0.5, 0.5, 0.05, 6]} />
      <meshBasicMaterial wireframe transparent opacity={0.4} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
}
