import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface DNAStrandProps {
  offset: number;
  color: string;
  height: number;
  radius: number;
  turns: number;
}

function FiberLine({ offset, height, radius, turns, ribbonOffset, ribbonWidth, isEdge, isHalo, color, phaseOffset, segments }: any) {
  const lineRef = useRef<THREE.Line>(null);
  const geomRef = useRef<THREE.BufferGeometry>(null);
  const baseColor = useMemo(() => new THREE.Color(color), [color]);

  const { positions, colors } = useMemo(() => {
    return {
      positions: new Float32Array((segments + 1) * 3),
      colors: new Float32Array((segments + 1) * 3)
    };
  }, [segments]);

  useFrame(({ clock }) => {
    if (!geomRef.current) return;
    const time = clock.elapsedTime;
    const posArray = geomRef.current.attributes.position.array as Float32Array;
    const colArray = geomRef.current.attributes.color.array as Float32Array;

    // Intro Animation: Flat to Spiral over 4 seconds
    const rawProgress = Math.min(time / 4.0, 1.0);
    const progress = rawProgress < 0.5 ? 4 * rawProgress * rawProgress * rawProgress : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;
    
    const currentTurns = turns * progress;
    const K = currentTurns * Math.PI * 2;
    const L = Math.sqrt(Math.pow(radius * K, 2) + Math.pow(height, 2));

    const globalTwist = Math.sin(time * 0.2) * 0.5;

    for (let i = 0; i <= segments; i++) {
      const idx = i * 3;
      const v = i / segments;
      const theta = v * K + offset;

      // Base Helix Position
      const px = radius * Math.cos(theta);
      const py = v * height;
      const pz = radius * Math.sin(theta);

      // Analytical Frenet Frames
      const nx = -Math.cos(theta);
      const ny = 0;
      const nz = -Math.sin(theta);

      const bx = L === 0 ? 0 : -(height * Math.sin(theta)) / L;
      const by = L === 0 ? 0 : -(radius * K) / L;
      const bz = L === 0 ? 1 : (height * Math.cos(theta)) / L;

      // Ribbon twist + dynamic global twist
      const twist = v * Math.PI * 2 * 3 + globalTwist;
      const spreadX = Math.cos(twist) * ribbonOffset * (ribbonWidth / 2);
      const spreadY = Math.sin(twist) * ribbonOffset * (ribbonWidth / 2);

      // Undulating sweeping curves
      const macroWave = Math.sin(i * 0.05 - time * 1.5 + phaseOffset) * (isHalo ? 1.2 : 0.3);
      const microWave = Math.sin(i * 0.15 - time * 3 + phaseOffset * 1.5) * (isHalo ? 0.4 : 0.1);
      const wave = macroWave + microWave;

      posArray[idx] = px + nx * (spreadX + wave) + bx * (spreadY + wave * 0.5);
      posArray[idx+1] = py + ny * (spreadX + wave) + by * (spreadY + wave * 0.5);
      posArray[idx+2] = pz + nz * (spreadX + wave) + bz * (spreadY + wave * 0.5);

      // Ethereal flowing motion
      const pulse = Math.sin(i * 0.08 - time * 3 + phaseOffset);
      const slowPulse = Math.sin(time * 0.5 + phaseOffset * 1.5); 
      
      // Increased intensity for a more obvious, but still futuristic look
      const baseIntensity = isHalo ? 0.03 : (isEdge ? 0.5 : 0.15);
      const pulseIntensity = isHalo ? 0.02 : (isEdge ? 0.3 : 0.2);
      let intensity = Math.max(0, baseIntensity + pulse * pulseIntensity);
      
      // Increased visibility range for more presence
      const visibility = 0.2 + (slowPulse + 1) * 0.4;
      intensity *= visibility;

      // Fade in alpha during intro
      intensity *= progress;

      colArray[idx] = baseColor.r * intensity;
      colArray[idx+1] = baseColor.g * intensity;
      colArray[idx+2] = baseColor.b * intensity;
    }

    geomRef.current.attributes.position.needsUpdate = true;
    geomRef.current.attributes.color.needsUpdate = true;
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" count={segments + 1} array={positions} itemSize={3} usage={THREE.DynamicDrawUsage} />
        <bufferAttribute attach="attributes-color" count={segments + 1} array={colors} itemSize={3} usage={THREE.DynamicDrawUsage} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} linewidth={1} />
    </line>
  );
}

function StrandParticles({ offset, color, height, radius, turns, count = 150 }: any) {
  const geomRef = useRef<THREE.BufferGeometry>(null);
  
  const randoms = useMemo(() => {
    return Array.from({ length: count }, () => ({
      v: Math.random(),
      r: Math.random() * 2.0,
      angle: Math.random() * Math.PI * 2,
      speed: 0.1 + Math.random() * 0.3
    }));
  }, [count]);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame(({ clock }) => {
    if (!geomRef.current) return;
    const time = clock.elapsedTime;
    const rawProgress = Math.min(time / 4.0, 1.0);
    const progress = rawProgress < 0.5 ? 4 * rawProgress * rawProgress * rawProgress : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;

    const currentTurns = turns * progress;
    const K = currentTurns * Math.PI * 2;
    const L = Math.sqrt(Math.pow(radius * K, 2) + Math.pow(height, 2));

    for(let i=0; i<count; i++) {
      let v = randoms[i].v + time * 0.02 * randoms[i].speed;
      v = v % 1.0;

      const theta = v * K + offset;
      const px = radius * Math.cos(theta);
      const py = v * height;
      const pz = radius * Math.sin(theta);

      const nx = -Math.cos(theta);
      const ny = 0;
      const nz = -Math.sin(theta);

      const bx = L === 0 ? 0 : -(height * Math.sin(theta)) / L;
      const by = L === 0 ? 0 : -(radius * K) / L;
      const bz = L === 0 ? 1 : (height * Math.cos(theta)) / L;

      const r = randoms[i].r;
      const angle = randoms[i].angle + time * 0.5;

      positions[i*3] = px + nx * Math.cos(angle) * r + bx * Math.sin(angle) * r;
      positions[i*3+1] = py + ny * Math.cos(angle) * r + by * Math.sin(angle) * r;
      positions[i*3+2] = pz + nz * Math.cos(angle) * r + bz * Math.sin(angle) * r;
    }
    geomRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} usage={THREE.DynamicDrawUsage} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color={color} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation={true} />
    </points>
  );
}

export default function DNAStrand({ offset, color, height, radius, turns }: DNAStrandProps) {
  const groupRef = useRef<THREE.Group>(null);
  const segments = 300;
  const numLines = 25; // Increased number of lines for a more obvious look
  const ribbonWidth = 2.5; // Wider ribbon for a more spread out, blurry feel

  const lines = useMemo(() => {
    const arr = [];
    // Core ribbon lines
    for (let i = 0; i < numLines; i++) {
      const normalizedOffset = (i / (numLines - 1)) * 2 - 1;
      const isEdge = Math.abs(normalizedOffset) > 0.85;
      arr.push({
        ribbonOffset: normalizedOffset,
        isEdge,
        isHalo: false,
        phaseOffset: Math.random() * Math.PI * 2,
      });
    }
    // Halo lines (volumetric blur)
    const numHaloLines = 60; // Increased halo lines for better glow
    for (let i = 0; i < numHaloLines; i++) {
      arr.push({
        ribbonOffset: (Math.random() - 0.5) * 6, // Much wider spread
        isEdge: false,
        isHalo: true,
        phaseOffset: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, [numLines]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5 + offset) * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <StrandParticles offset={offset} color={color} height={height} radius={radius} turns={turns} count={150} />

      {lines.map((line, i) => (
        <FiberLine
          key={i}
          offset={offset}
          height={height}
          radius={radius}
          turns={turns}
          ribbonOffset={line.ribbonOffset}
          ribbonWidth={ribbonWidth}
          isEdge={line.isEdge}
          isHalo={line.isHalo}
          color={color}
          phaseOffset={line.phaseOffset}
          segments={segments}
        />
      ))}
    </group>
  );
}
