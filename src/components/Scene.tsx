import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import {
  Music, Book, Mountain, Code, Coffee, Compass, Anchor, Zap,
  Palette, Flower2, Building2, Camera, Sparkles, Star, Sun, Moon,
  Heart, Infinity as InfinityIcon, Link, Flame, Globe, Flag
} from 'lucide-react';
import DNAStrand from './DNAStrand';
import SoulSphere from './SoulSphere';

export default function Scene({ onNodeClick }: { onNodeClick?: (node: any) => void }) {
  const groupRef = useRef<THREE.Group>(null);

  const height = 20;
  const radius = 2.5;
  const turns = 4;

  const nodes = useMemo(() => {
    const getPos = (t: number, offset: number) => {
      const y = (t / (turns * Math.PI * 2)) * height;
      const x = radius * Math.cos(t + offset);
      const z = radius * Math.sin(t + offset);
      return new THREE.Vector3(x, y, z);
    };

    const maxT = turns * Math.PI * 2;

    // Blue nodes (Male)
    const maleData = [
      { title: "吉他旋律", icon: Music, content: "指尖在琴弦上跳跃，编织出属于自己的节奏与故事。这是理性之外的感性出口。" },
      { title: "深度阅读", icon: Book, content: "在字里行间探索未知的领域，构建起坚实的逻辑框架与广阔的世界观。" },
      { title: "山野徒步", icon: Mountain, content: "用脚步丈量大地，在攀登中磨砺意志，寻找内心的平静与坚韧。" },
      { title: "逻辑构建", icon: Code, content: "代码是另一种语言，用严谨的逻辑将抽象的概念转化为现实的结构。" },
      { title: "晨间咖啡", icon: Coffee, content: "清晨的第一缕香气，唤醒沉睡的思绪，开启充满活力与专注的一天。" },
      { title: "探索未知", icon: Compass, content: "永远保持好奇，不畏惧未知的领域，在探索中不断拓宽自我的边界。" },
      { title: "沉稳锚点", icon: Anchor, content: "在喧嚣与变幻中保持内心的定力，成为风暴中坚实可靠的锚点。" },
      { title: "灵感闪现", icon: Zap, content: "在不经意的瞬间捕捉创意的火花，将平凡的事物转化为独特的见解。" },
    ];

    // Pink nodes (Female)
    const femaleData = [
      { title: "色彩感知", icon: Palette, content: "用细腻的视角捕捉世界的光影与色彩，将内心的情感具象化为斑斓的画卷。" },
      { title: "植物美学", icon: Flower2, content: "在草木的生长中感受生命的律动，用绿意点缀生活，汲取自然的力量。" },
      { title: "城市漫游", icon: Building2, content: "穿梭于钢铁森林，在街巷的喧嚣中寻找独特的风景与人间烟火。" },
      { title: "光影捕捉", icon: Camera, content: "将瞬间定格为永恒，用镜头记录下生活中那些微小而动人的美好。" },
      { title: "奇思妙想", icon: Sparkles, content: "不受现实的束缚，让想象力自由飞翔，在脑海中构建出奇幻的宇宙。" },
      { title: "星空仰望", icon: Star, content: "在浩瀚的星河中感受自身的渺小与宇宙的伟大，保持对神秘的敬畏。" },
      { title: "向阳而生", icon: Sun, content: "如同向日葵般追逐光明，用温暖和积极的态度感染周围的世界。" },
      { title: "静谧独处", icon: Moon, content: "在夜深人静时与自我对话，在孤独中沉淀思绪，获取内心的安宁。" },
    ];

    // Purple nodes (Shared)
    const sharedData = [
      { title: "情感共鸣", icon: Heart, content: "在灵魂深处产生奇妙的频率共振，无需言语便能理解彼此的喜怒哀乐。" },
      { title: "无限可能", icon: InfinityIcon, content: "当两个独立的宇宙相遇，碰撞出的火花将打破原有的边界，创造出无限的未来。" },
      { title: "深度链接", icon: Link, content: "不仅是生活轨迹的交汇，更是价值观与信仰的深度契合与相互支撑。" },
      { title: "思想碰撞", icon: Flame, content: "在交流与探讨中激发新的灵感，让彼此的思想在碰撞中变得更加深邃与广阔。" },
      { title: "世界观融合", icon: Globe, content: "将各自看待世界的视角交织在一起，形成一个更加完整、包容的全新世界观。" },
      { title: "共同记忆", icon: Flag, content: "在时间的流逝中共同经历风雨与彩虹，编织出属于两人的独特记忆图谱。" },
    ];

    const maleNodes = maleData.map((data, i) => {
      const t = (i / (maleData.length - 1)) * maxT * 0.8 + 0.5;
      const basePos = getPos(t, 0);
      const jitter = new THREE.Vector3(
        Math.sin(i * 12.9898) * 1.2,
        Math.cos(i * 78.233) * 1.2,
        Math.sin(i * 45.123) * 1.2
      );
      return { pos: basePos.add(jitter), ...data };
    });

    const femaleNodes = femaleData.map((data, i) => {
      const t = (i / (femaleData.length - 1)) * maxT * 0.8 + 0.5;
      const basePos = getPos(t, Math.PI);
      const jitter = new THREE.Vector3(
        Math.sin(i * 34.9898) * 1.2,
        Math.cos(i * 12.233) * 1.2,
        Math.sin(i * 89.123) * 1.2
      );
      return { pos: basePos.add(jitter), ...data };
    });

    const sharedNodes = sharedData.map((data, i) => {
      const t = (i / (sharedData.length - 1)) * maxT * 0.7 + 1.0;
      const y = (t / maxT) * height;
      const basePos = new THREE.Vector3(0, y, 0);
      const jitter = new THREE.Vector3(
        Math.sin(i * 56.9898) * 0.8,
        Math.cos(i * 34.233) * 0.8,
        Math.sin(i * 67.123) * 0.8
      );
      return { pos: basePos.add(jitter), ...data };
    });

    return { male: maleNodes, female: femaleNodes, shared: sharedNodes };
  }, [height, radius, turns]);

  return (
    <group ref={groupRef} position={[0, -height / 2, 0]}>
      {/* DNA Strands */}
      <DNAStrand offset={0} color="#3b82f6" height={height} radius={radius} turns={turns} />
      <DNAStrand offset={Math.PI} color="#ec4899" height={height} radius={radius} turns={turns} />

      {/* Male Nodes (Blue) */}
      {nodes.male.map((node, i) => (
        <group key={`male-${i}`}>
          <SoulSphere position={node.pos} color="#3b82f6" icons={[node.icon]} scale={0.25} opacity={0.7} onClick={() => onNodeClick?.({ ...node, color: "#3b82f6" })} />
          <Html position={node.pos.clone().add(new THREE.Vector3(0.5, 0.2, 0))} center style={{ pointerEvents: 'none' }}>
            <div className="text-[#3b82f6] text-[10px] font-bold tracking-widest border-b border-[#3b82f6]/30 pb-1 whitespace-nowrap drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] pointer-events-none">
              {node.title}
            </div>
          </Html>
        </group>
      ))}

      {/* Female Nodes (Pink) */}
      {nodes.female.map((node, i) => (
        <group key={`female-${i}`}>
          <SoulSphere position={node.pos} color="#ec4899" icons={[node.icon]} scale={0.25} opacity={0.7} onClick={() => onNodeClick?.({ ...node, color: "#ec4899" })} />
          <Html position={node.pos.clone().add(new THREE.Vector3(-0.5, 0.2, 0))} center style={{ pointerEvents: 'none' }}>
            <div className="text-[#ec4899] text-[10px] font-bold tracking-widest border-l-2 border-[#ec4899]/50 pl-2 whitespace-nowrap drop-shadow-[0_0_8px_rgba(236,72,153,0.8)] pointer-events-none">
              {node.title}
            </div>
          </Html>
        </group>
      ))}

      {/* Shared Nodes (Purple) */}
      {nodes.shared.map((node, i) => (
        <group key={`shared-${i}`}>
          <SoulSphere position={node.pos} color="#a855f7" icons={[node.icon]} scale={0.35} opacity={0.85} isCore={true} onClick={() => onNodeClick?.({ ...node, color: "#a855f7" })} />
          <Html position={node.pos.clone().add(new THREE.Vector3(0.6, 0, 0))} center style={{ pointerEvents: 'none' }}>
            <div className="text-white text-[10px] font-bold tracking-widest border-b border-white/30 pb-1 whitespace-nowrap drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none">
              [ {node.title} ]
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
