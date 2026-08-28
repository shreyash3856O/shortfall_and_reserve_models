import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ScrollSubsurfaceTerrain3DProps {
  scrollProgress: number; // 0.0 to 1.0
}

export default function ScrollSubsurfaceTerrain3D({ scrollProgress }: ScrollSubsurfaceTerrain3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTargetRef = useRef(0);
  const [activeStage, setActiveStage] = useState(0);

  // Keep target updated with prop
  useEffect(() => {
    scrollTargetRef.current = scrollProgress;
    if (scrollProgress < 0.25) setActiveStage(0);
    else if (scrollProgress < 0.5) setActiveStage(1);
    else if (scrollProgress < 0.75) setActiveStage(2);
    else setActiveStage(3);
  }, [scrollProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0D0D10');
    scene.fog = new THREE.FogExp2('#0D0D10', 0.035);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 8, 16);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xe2e8f0, 1.4);
    keyLight.position.set(12, 18, 10);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x4f9067, 0.6);
    fillLight.position.set(-15, 6, -10);
    scene.add(fillLight);

    const pointLight = new THREE.PointLight(0xc98040, 1.2, 30);
    pointLight.position.set(0, 4, 0);
    scene.add(pointLight);

    // 3. Geological Terrain Mesh (Fold Synclinorium)
    const terrainWidth = 24;
    const terrainHeight = 18;
    const segX = 64;
    const segY = 48;
    const geometry = new THREE.PlaneGeometry(terrainWidth, terrainHeight, segX, segY);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    const count = pos.count;
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Multi-frequency fold topography
      const fold1 = Math.sin(x * 0.35 + z * 0.25) * 2.2;
      const fold2 = Math.cos(x * 0.7 - z * 0.4) * 0.9;
      const noise = Math.sin(x * 1.8) * Math.cos(z * 1.5) * 0.35;
      const y = fold1 + fold2 + noise;
      pos.setY(i, y);

      // Mn ore grade interpolation
      const normY = (y + 3.0) / 6.0;
      const grade = 18.0 + normY * 30.0;

      // Color mapping: Emerald (>38% Mn), Amber (32-38%), Crimson (<32%)
      let r = 0.85, g = 0.31, b = 0.31; // Low grade (<32% Mn)
      if (grade >= 38.0) {
        r = 0.31; g = 0.56; b = 0.40;   // High grade (>=38% Mn)
      } else if (grade >= 32.0) {
        r = 0.79; g = 0.50; b = 0.25;   // Medium grade (32-38% Mn)
      }
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const terrainMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.65,
      metalness: 0.15,
      side: THREE.DoubleSide,
      flatShading: true,
    });

    const terrainMesh = new THREE.Mesh(geometry, terrainMaterial);
    terrainMesh.position.set(0, -0.5, 0);
    scene.add(terrainMesh);

    // Wireframe Grid Overlay
    const wireGeometry = new THREE.WireframeGeometry(geometry);
    const wireMaterial = new THREE.LineBasicMaterial({ color: 0x3a3a44, transparent: true, opacity: 0.35 });
    const wireMesh = new THREE.LineSegments(wireGeometry, wireMaterial);
    wireMesh.position.set(0, -0.48, 0);
    scene.add(wireMesh);

    // 4. Subsurface Borehole Core Drill Shafts (Cylinders & Glowing Beacons)
    const drillGroup = new THREE.Group();
    const drillPoints = [
      { x: -5, z: -2, depth: 4.5, grade: '44.8%' },
      { x: 3, z: -4, depth: 5.2, grade: '46.1%' },
      { x: 6, z: 2, depth: 3.8, grade: '41.5%' },
      { x: -3, z: 3, depth: 4.0, grade: '39.2%' },
      { x: 0, z: -1, depth: 6.0, grade: '48.0%' },
    ];

    const shaftGeom = new THREE.CylinderGeometry(0.06, 0.06, 1, 16);
    const shaftMat = new THREE.MeshBasicMaterial({ color: 0xc0bdb8, transparent: true, opacity: 0.6 });
    const beaconGeom = new THREE.SphereGeometry(0.18, 16, 16);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0x4f9067,
      emissive: 0x4f9067,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });

    drillPoints.forEach((pt) => {
      const shaft = new THREE.Mesh(shaftGeom, shaftMat);
      shaft.scale.set(1, pt.depth, 1);
      shaft.position.set(pt.x, -pt.depth / 2, pt.z);
      drillGroup.add(shaft);

      const beacon = new THREE.Mesh(beaconGeom, beaconMat);
      beacon.position.set(pt.x, 0.5, pt.z);
      drillGroup.add(beacon);

      // Radar pulse ring
      const ringGeom = new THREE.RingGeometry(0.2, 0.4, 32);
      ringGeom.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x4f9067, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.set(pt.x, 0.52, pt.z);
      drillGroup.add(ring);
    });
    scene.add(drillGroup);

    // 5. Floating Geological Particulate Dust Field
    const particleCount = 200;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 28;
      particlePositions[i + 1] = Math.random() * 8 - 2;
      particlePositions[i + 2] = (Math.random() - 0.5) * 22;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xc0bdb8,
      size: 0.12,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 6. Laser Scan Plane (Traversing Spatial Grid)
    const scanGeom = new THREE.PlaneGeometry(24, 0.15);
    scanGeom.rotateX(-Math.PI / 2);
    const scanMat = new THREE.MeshBasicMaterial({ color: 0x4f9067, transparent: true, opacity: 0.75, side: THREE.DoubleSide });
    const scanLine = new THREE.Mesh(scanGeom, scanMat);
    scanLine.position.set(0, 1.2, 0);
    scene.add(scanLine);

    // 7. Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // 8. Animation & Camera Interpolation Loop
    let currentScroll = 0;
    const startTime = performance.now();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) / 1000;

      // Smooth lerp to scroll target
      currentScroll += (scrollTargetRef.current - currentScroll) * 0.05;

      // Camera Waypoint Interpolation based on Scroll Progress (0.0 to 1.0)
      // Stage 0 (0.0): Hero Isometric High Orbit
      // Stage 1 (0.33): Descend to Subsurface & Boreholes
      // Stage 2 (0.66): Risk Radar & Mine Nodes Focus
      // Stage 3 (1.0): Expansive Panoramic Top-Down
      let targetCamX = 0;
      let targetCamY = 8;
      let targetCamZ = 16;
      let targetLookX = 0;
      let targetLookY = 0;
      let targetLookZ = 0;

      if (currentScroll < 0.33) {
        const t = currentScroll / 0.33;
        targetCamX = THREE.MathUtils.lerp(0, 8, t);
        targetCamY = THREE.MathUtils.lerp(8, 4.5, t);
        targetCamZ = THREE.MathUtils.lerp(16, 11, t);
        targetLookX = THREE.MathUtils.lerp(0, 2, t);
        targetLookY = THREE.MathUtils.lerp(0, -0.5, t);
        targetLookZ = THREE.MathUtils.lerp(0, -1, t);
      } else if (currentScroll < 0.66) {
        const t = (currentScroll - 0.33) / 0.33;
        targetCamX = THREE.MathUtils.lerp(8, -6, t);
        targetCamY = THREE.MathUtils.lerp(4.5, 6.5, t);
        targetCamZ = THREE.MathUtils.lerp(11, 13, t);
        targetLookX = THREE.MathUtils.lerp(2, -1, t);
        targetLookY = THREE.MathUtils.lerp(-0.5, 0.5, t);
        targetLookZ = THREE.MathUtils.lerp(-1, 0, t);
      } else {
        const t = (currentScroll - 0.66) / 0.34;
        targetCamX = THREE.MathUtils.lerp(-6, 0, t);
        targetCamY = THREE.MathUtils.lerp(6.5, 14, t);
        targetCamZ = THREE.MathUtils.lerp(13, 9, t);
        targetLookX = THREE.MathUtils.lerp(-1, 0, t);
        targetLookY = THREE.MathUtils.lerp(0.5, 0, t);
        targetLookZ = THREE.MathUtils.lerp(0, 0, t);
      }

      // Add gentle mouse parallax
      targetCamX += mouseX * 1.2;
      targetCamY -= mouseY * 0.8;

      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;

      camera.lookAt(targetLookX, targetLookY, targetLookZ);

      // Subtle scene rotations & animations
      terrainMesh.rotation.y = Math.sin(elapsedTime * 0.15) * 0.04;
      wireMesh.rotation.y = terrainMesh.rotation.y;
      drillGroup.rotation.y = terrainMesh.rotation.y;

      // Scanline animation
      scanLine.position.z = Math.sin(elapsedTime * 0.8) * 7.5;

      // Particle floating
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Handling
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
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      terrainMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Three.js Canvas */}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
