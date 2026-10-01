import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface VehicleThreeCanvasProps {
  interactive?: boolean;
}

export const VehicleThreeCanvas: React.FC<VehicleThreeCanvasProps> = ({ interactive = true }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [cameraMode, setCameraMode] = useState<'STUDIO' | 'AERODYNAMIC' | 'WIREFRAME'>('STUDIO');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene & Dark Atmospheric Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.FogExp2(0x050505, 0.04);

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4.5, 1.8, 5.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // Three-point Studio Lighting
    // 1. Key Light (warm studio spotlight)
    const keyLight = new THREE.SpotLight(0xfff4e6, 45);
    keyLight.position.set(5, 8, 4);
    keyLight.angle = Math.PI / 4;
    keyLight.penumbra = 0.8;
    keyLight.castShadow = true;
    scene.add(keyLight);

    // 2. Fill Light (cool soft ambient)
    const fillLight = new THREE.DirectionalLight(0xa5c4d4, 4);
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    // 3. Rim Light (sharp luxury golden rim highlight)
    const rimLight = new THREE.DirectionalLight(0xd4af37, 12);
    rimLight.position.set(0, 3, -6);
    scene.add(rimLight);

    // Studio Floor Grid & Reflective Ground
    const floorGeometry = new THREE.PlaneGeometry(30, 30);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.25,
      metalness: 0.85,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    scene.add(floor);

    // Subdued circular stage ring
    const ringGeo = new THREE.RingGeometry(2.8, 2.85, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xd4af37, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.001;
    scene.add(ring);

    // 3D Procedural Sculptural Vehicle Concept Body
    const carGroup = new THREE.Group();

    // Main Carbon Monocoque Lower Body
    const bodyGeometry = new THREE.BoxGeometry(3.6, 0.65, 1.7);
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0a0c10,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.95,
    });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.position.y = 0.55;
    bodyMesh.castShadow = true;
    carGroup.add(bodyMesh);

    // Sleek Aerodynamic Cabin / Glass Canopy
    const cabinGeometry = new THREE.BoxGeometry(2.0, 0.55, 1.35);
    const cabinMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x050505,
      metalness: 0.2,
      roughness: 0.05,
      transmission: 0.6,
      transparent: true,
      opacity: 0.85,
    });
    const cabinMesh = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabinMesh.position.set(-0.2, 1.05, 0);
    cabinMesh.castShadow = true;
    carGroup.add(cabinMesh);

    // Aerodynamic Rear Diffuser & Wing
    const wingGeometry = new THREE.BoxGeometry(0.5, 0.05, 1.8);
    const carbonMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.4,
      metalness: 0.7,
    });
    const wingMesh = new THREE.Mesh(wingGeometry, carbonMaterial);
    wingMesh.position.set(-1.6, 1.0, 0);
    carGroup.add(wingMesh);

    // LED Taillight Strip (Bugatti / Porsche horizontal lightbar signature)
    const taillightGeo = new THREE.BoxGeometry(0.04, 0.08, 1.55);
    const taillightMat = new THREE.MeshBasicMaterial({ color: 0xff1020 });
    const taillight = new THREE.Mesh(taillightGeo, taillightMat);
    taillight.position.set(-1.81, 0.75, 0);
    carGroup.add(taillight);

    // LED Headlight Strips
    const headlightGeo = new THREE.BoxGeometry(0.05, 0.08, 0.45);
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xebf8ff });
    const headlightLeft = new THREE.Mesh(headlightGeo, headlightMat);
    headlightLeft.position.set(1.81, 0.65, 0.55);
    const headlightRight = new THREE.Mesh(headlightGeo, headlightMat);
    headlightRight.position.set(1.81, 0.65, -0.55);
    carGroup.add(headlightLeft, headlightRight);

    // 4 Performance Wheels & Gold Calipers
    const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.3, 32);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6, metalness: 0.5 });
    const rimMatInner = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.9 });

    const wheelPositions = [
      [1.1, 0.38, 0.85],
      [1.1, 0.38, -0.85],
      [-1.1, 0.38, 0.85],
      [-1.1, 0.38, -0.85],
    ];

    wheelPositions.forEach(([x, y, z]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.position.set(x, y, z);
      wheel.castShadow = true;
      carGroup.add(wheel);

      // Inner gold rim cap
      const capGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.32, 16);
      capGeo.rotateZ(Math.PI / 2);
      const cap = new THREE.Mesh(capGeo, rimMatInner);
      cap.position.set(x, y, z);
      carGroup.add(cap);
    });

    scene.add(carGroup);

    // Mouse Interaction / Orbit interpolation
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;
    let isMouseDown = false;
    let previousMouseX = 0;

    const onPointerMove = (e: MouseEvent) => {
      if (!interactive) return;
      if (isMouseDown) {
        const deltaX = e.clientX - previousMouseX;
        targetRotationY += deltaX * 0.005;
        previousMouseX = e.clientX;
      } else {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      previousMouseX = e.clientX;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Resize handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Continuous subtle studio idle rotation
      if (!isMouseDown) {
        targetRotationY += delta * 0.15;
      }

      // Smooth damping lerp
      carGroup.rotation.y += (targetRotationY - carGroup.rotation.y) * 0.08;

      // Subtle reactive camera parallax
      camera.position.x += (4.5 + mouseX * 0.6 - camera.position.x) * 0.04;
      camera.position.y += (1.8 + mouseY * 0.4 - camera.position.y) * 0.04;
      camera.lookAt(0, 0.7, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  if (!webGlSupported) {
    return (
      <div className="w-full h-full relative overflow-hidden bg-[#050505]">
        <img
          src="/src/assets/images/hero_luxury_hypercar_1790889964433.jpg"
          alt="Noir Motors Flagship Hypercar"
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/60" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full select-none cursor-grab active:cursor-grabbing">
      <div ref={mountRef} className="w-full h-full" />

      {/* Floating HUD Camera & Stage Indicator */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 text-xs bg-black/50 backdrop-blur-md border border-white/10 px-3.5 py-1.5 text-white/70">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
        <span className="tracking-widest font-mono text-[11px]">THREE.JS 3D SHOWROOM · ROTATE 360°</span>
      </div>
    </div>
  );
};
