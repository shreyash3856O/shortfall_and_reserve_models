import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function GeologicalTerrainMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const wireframeRef = useRef<THREE.LineSegments>(null!);

  // Generate 3D geological block terrain with Mn grade color mapping
  const { geometry, wireGeometry } = useMemo(() => {
    const width = 16;
    const height = 12;
    const segX = 48;
    const segY = 36;
    const geo = new THREE.PlaneGeometry(width, height, segX, segY);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const count = pos.count;
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      
      // Multi-frequency geological synclinorium fold topography
      const fold1 = Math.sin(x * 0.45 + z * 0.3) * 1.6;
      const fold2 = Math.cos(x * 0.9 - z * 0.5) * 0.7;
      const noise = Math.sin(x * 2.1) * Math.cos(z * 1.8) * 0.25;
      const y = fold1 + fold2 + noise;
      pos.setY(i, y);

      // Latent Mn grade (18% to 48% Mn)
      const normY = (y + 2.5) / 5.0; // 0 to 1
      const grade = 18.0 + normY * 30.0;

      // Color mapping:
      // Red (<32% Mn) -> #A83838 (0.66, 0.22, 0.22)
      // Yellow (32-38% Mn) -> #C4A238 (0.77, 0.63, 0.22)
      // Green (>=38% Mn) -> #3D8C5A (0.24, 0.55, 0.35)
      let r = 0.66, g = 0.22, b = 0.22;
      if (grade >= 38.0) {
        r = 0.24; g = 0.55; b = 0.35;
      } else if (grade >= 32.0) {
        r = 0.77; g = 0.63; b = 0.22;
      }
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    const wire = new THREE.WireframeGeometry(geo);
    return { geometry: geo, wireGeometry: wire };
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.04;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* Solid Terrain Surface */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          roughness={0.75}
          metalness={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Structural Geological Grid Lines */}
      <lineSegments ref={wireframeRef} geometry={wireGeometry}>
        <lineBasicMaterial color="#2E3544" transparent opacity={0.35} />
      </lineSegments>
    </group>
  );
}

export default function ReserveBlockTerrain3D() {
  return (
    <div className="w-full h-full relative bg-[#0B0D10] border border-[#232834]">
      {/* 3D Geological Canvas */}
      <Canvas camera={{ position: [9, 8, 12], fov: 42 }}>
        <color attach="background" args={['#0B0D10']} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[10, 15, 8]} intensity={1.1} color="#E6EDF3" />
        <directionalLight position={[-10, 10, -8]} intensity={0.4} color="#C8A96E" />
        
        <GeologicalTerrainMesh />
        
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={8}
          maxDistance={22}
          autoRotate={false}
        />
      </Canvas>

      {/* On-screen Technical HUD */}
      <div className="absolute top-3 left-3 bg-[#12151B]/90 border border-[#232834] px-3 py-2 text-[11px] font-mono pointer-events-none">
        <div className="text-[#C8A96E] font-semibold">BALAGHAT OREBODY 3D MODEL</div>
        <div className="text-[#8B949E] text-[10px]">Braunite / Gondite Synclinorium Mesh (XGB + Kriging)</div>
      </div>

      <div className="absolute bottom-3 right-3 bg-[#12151B]/90 border border-[#232834] px-3 py-2 text-[10px] font-mono text-[#8B949E] flex gap-4 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-[#3D8C5A] inline-block"></span>
          <span>Green: &gt;=38% Mn</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-[#C4A238] inline-block"></span>
          <span>Yellow: 32-38% Mn</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-[#A83838] inline-block"></span>
          <span>Red: &lt;32% Mn</span>
        </div>
      </div>
    </div>
  );
}
