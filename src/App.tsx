/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense, useState } from 'react';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [activeNode, setActiveNode] = useState<any>(null);

  return (
    <ErrorBoundary>
      <div className="w-full h-screen bg-[#020205] text-white overflow-hidden relative font-mono">
        <Canvas 
          camera={{ position: [0, 2, 18], fov: 45 }}
          onPointerMissed={() => setActiveNode(null)}
        >
          <color attach="background" args={['#020205']} />
          <fog attach="fog" args={['#020205', 10, 40]} />
          <ambientLight intensity={0.2} />
          
          <Suspense fallback={null}>
            <Scene onNodeClick={setActiveNode} />
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={50} scale={20} size={2} speed={0.2} opacity={0.1} color="#3b82f6" />
            <Sparkles count={50} scale={20} size={2} speed={0.2} opacity={0.1} color="#ec4899" />
            <Sparkles count={30} scale={10} size={3} speed={0.5} opacity={0.2} color="#a855f7" />
          </Suspense>

          <EffectComposer>
            <Bloom luminanceThreshold={0.05} mipmapBlur intensity={2.5} />
          </EffectComposer>

          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            maxDistance={40} 
            minDistance={5}
            autoRotate={!activeNode}
            autoRotateSpeed={0.3}
          />
        </Canvas>
        
        <UIOverlay activeNode={activeNode} onClose={() => setActiveNode(null)} />
      </div>
    </ErrorBoundary>
  );
}
