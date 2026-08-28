import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ReserveBlockTerrain3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0B0D10');

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 480;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(9, 8, 12);
    camera.lookAt(0, -0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xe6edf3, 1.1);
    dirLight1.position.set(10, 15, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xc8a96e, 0.5);
    dirLight2.position.set(-10, 10, -8);
    scene.add(dirLight2);

    // 3. Geological Terrain Mesh with % Mn Grade Vertex Colors
    const terrainWidth = 16;
    const terrainHeight = 12;
    const segX = 48;
    const segY = 36;
    const geometry = new THREE.PlaneGeometry(terrainWidth, terrainHeight, segX, segY);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    const count = pos.count;
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Multi-frequency fold topography (Sausar Supergroup Braunite Synclinorium)
      const fold1 = Math.sin(x * 0.45 + z * 0.3) * 1.6;
      const fold2 = Math.cos(x * 0.9 - z * 0.5) * 0.7;
      const noise = Math.sin(x * 2.1) * Math.cos(z * 1.8) * 0.25;
      const y = fold1 + fold2 + noise;
      pos.setY(i, y);

      // Latent Mn grade (18% to 48% Mn)
      const normY = (y + 2.5) / 5.0;
      const grade = 18.0 + normY * 30.0;

      // Color mapping:
      // Green (>=38% Mn) -> (0.24, 0.55, 0.35)
      // Yellow (32-38% Mn) -> (0.77, 0.63, 0.22)
      // Red (<32% Mn) -> (0.66, 0.22, 0.22)
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

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.75,
      metalness: 0.15,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -0.5, 0);
    scene.add(mesh);

    // Geological Structural Wireframe Lines
    const wireGeometry = new THREE.WireframeGeometry(geometry);
    const wireMaterial = new THREE.LineBasicMaterial({ color: 0x2e3544, transparent: true, opacity: 0.35 });
    const wireMesh = new THREE.LineSegments(wireGeometry, wireMaterial);
    wireMesh.position.set(0, -0.5, 0);
    scene.add(wireMesh);

    // 4. Interactive Mouse Drag Orbit Controls (Vanilla)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationY = 0;
    let rotationX = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      rotationY += deltaX * 0.005;
      rotationX = Math.max(-0.4, Math.min(0.6, rotationX + deltaY * 0.005));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 5. Animation Loop with subtle idle rotation
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isDragging) {
        rotationY += 0.002;
      }

      mesh.rotation.y = rotationY;
      mesh.rotation.x = rotationX;
      wireMesh.rotation.y = rotationY;
      wireMesh.rotation.x = rotationX;

      renderer.render(scene, camera);
    };
    animate();

    // 6. Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
      geometry.dispose();
      material.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full h-full relative bg-[#0B0D10] border border-[#232834] overflow-hidden">
      {/* 3D Canvas Mount Point */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* On-screen Technical HUD */}
      <div className="absolute top-3 left-3 bg-[#12151B]/90 border border-[#232834] px-3 py-2 text-[11px] font-mono pointer-events-none select-none">
        <div className="text-[#C8A96E] font-semibold">BALAGHAT OREBODY 3D MODEL</div>
        <div className="text-[#8B949E] text-[10px]">Braunite / Gondite Synclinorium Mesh (XGB + Kriging)</div>
      </div>

      <div className="absolute bottom-3 right-3 bg-[#12151B]/90 border border-[#232834] px-3 py-2 text-[10px] font-mono text-[#8B949E] flex gap-4 pointer-events-none select-none">
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
