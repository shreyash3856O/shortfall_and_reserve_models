import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ReserveBlockTerrain3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#111111');

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 480;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(9, 8, 12);
    camera.lookAt(0, -0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xf0ede8, 1.1);
    dirLight1.position.set(10, 15, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xb8b0a8, 0.3);
    dirLight2.position.set(-10, 10, -8);
    scene.add(dirLight2);

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

      const fold1 = Math.sin(x * 0.45 + z * 0.3) * 1.6;
      const fold2 = Math.cos(x * 0.9 - z * 0.5) * 0.7;
      const noise = Math.sin(x * 2.1) * Math.cos(z * 1.8) * 0.25;
      const y = fold1 + fold2 + noise;
      pos.setY(i, y);

      const normY = (y + 2.5) / 5.0;
      const grade = 18.0 + normY * 30.0;

      // Charcoal-toned zone colors: warm stone green / muted amber / muted crimson
      let r = 0.76, g = 0.28, b = 0.28; // Low: muted crimson
      if (grade >= 38.0) {
        r = 0.28; g = 0.52; b = 0.38;   // High: muted sage green
      } else if (grade >= 32.0) {
        r = 0.72; g = 0.48; b = 0.22;   // Med: muted amber
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
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -0.5, 0);
    scene.add(mesh);

    const wireGeometry = new THREE.WireframeGeometry(geometry);
    const wireMaterial = new THREE.LineBasicMaterial({ color: 0x2E2E2E, transparent: true, opacity: 0.4 });
    const wireMesh = new THREE.LineSegments(wireGeometry, wireMaterial);
    wireMesh.position.set(0, -0.5, 0);
    scene.add(wireMesh);

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
    const onMouseUp = () => { isDragging = false; };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isDragging) rotationY += 0.002;
      mesh.rotation.y = rotationY;
      mesh.rotation.x = rotationX;
      wireMesh.rotation.y = rotationY;
      wireMesh.rotation.x = rotationX;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (container.contains(domElement)) container.removeChild(domElement);
      geometry.dispose();
      material.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full h-full relative bg-[#111111] border border-[#2E2E2E] overflow-hidden">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* HUD — top left */}
      <div className="absolute top-4 left-4 bg-[#1A1A1A]/90 backdrop-blur-md border border-[#333333] px-3.5 py-2.5 rounded shadow-lg pointer-events-none select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4F9067] animate-pulse"></span>
          <div className="text-[#EFEFEF] font-semibold text-xs tracking-wide">
            Balaghat Orebody 3D Model
          </div>
        </div>
        <div className="text-[#888888] text-[11px] mt-0.5 font-normal">
          Braunite / Gondite Synclinorium Mesh (XGB + Kriging)
        </div>
      </div>

      {/* Legend — bottom right */}
      <div className="absolute bottom-4 right-4 bg-[#1A1A1A]/90 backdrop-blur-md border border-[#333333] px-3.5 py-2 rounded shadow-lg text-[11px] text-[#BBBBBB] flex items-center gap-4 pointer-events-none select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#4E8360' }}></span>
          <span>High: &ge;38% Mn</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#B87838' }}></span>
          <span>Med: 32-38% Mn</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#C04848' }}></span>
          <span>Low: &lt;32% Mn</span>
        </div>
      </div>
    </div>
  );
}
