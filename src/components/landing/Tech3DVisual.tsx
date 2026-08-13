'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Bot, ShieldAlert, Globe, Code2, Database, Cloud, Rocket, GitBranch } from 'lucide-react';

export default function Tech3DVisual() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeHoverNode, setActiveHoverNode] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Central Interactive Constellation Nodes
    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    // Node Positions for 7 domains
    const nodeCount = 60;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);

    const colorPalette = [
      new THREE.Color('#00F0FF'), // Cyan
      new THREE.Color('#8A2BE2'), // Violet
      new THREE.Color('#FF2E93'), // Neon Pink
      new THREE.Color('#00FF9D'), // Emerald
      new THREE.Color('#FF9F1C'), // Amber
    ];

    for (let i = 0; i < nodeCount; i++) {
      const radius = 6 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = randomColor.r;
      colors[i * 3 + 1] = randomColor.g;
      colors[i * 3 + 2] = randomColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Dots Material
    const pMaterial = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, pMaterial);
    nodesGroup.add(particles);

    // Connected Lines Geometry
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });

    const lineGeometry = new THREE.BufferGeometry();
    const linePositions: number[] = [];

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 3.2) {
          linePositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          );
        }
      }
    }

    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    nodesGroup.add(lines);

    // Glowing Inner Sphere Mesh
    const sphereGeo = new THREE.IcosahedronGeometry(4.2, 2);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x8a2be2,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const innerSphere = new THREE.Mesh(sphereGeo, sphereMat);
    nodesGroup.add(innerSphere);

    // 3. Mouse Interaction & Drag Handling
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      mouseX = (x / width - 0.5) * 2;
      mouseY = (y / height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 4. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 5. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Rotation
      targetX = mouseX * 0.5;
      targetY = mouseY * 0.5;

      nodesGroup.rotation.y += 0.003 + (targetX - nodesGroup.rotation.y) * 0.05;
      nodesGroup.rotation.x += 0.002 + (targetY - nodesGroup.rotation.x) * 0.05;
      innerSphere.rotation.z = elapsedTime * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      pMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      renderer.dispose();
    };
  }, []);

  const floatingBadges = [
    { id: 'ai', title: 'AI Agents', icon: Bot, pos: 'top-4 left-4 sm:top-10 sm:left-10', color: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10' },
    { id: 'cloud', title: 'Cloud & AWS', icon: Cloud, pos: 'top-12 right-4 sm:top-14 sm:right-8', color: 'border-sky-500/40 text-sky-300 bg-sky-500/10' },
    { id: 'space', title: 'Voyager 1 & Space', icon: Rocket, pos: 'bottom-20 left-6 sm:bottom-24 sm:left-12', color: 'border-pink-500/40 text-pink-300 bg-pink-500/10' },
    { id: 'code', title: 'DSA & GitHub', icon: GitBranch, pos: 'bottom-8 right-6 sm:bottom-12 sm:right-12', color: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10' },
  ];

  return (
    <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[560px] flex items-center justify-center overflow-hidden">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Interactive Glass Badges Overlay */}
      {floatingBadges.map((badge) => {
        const Icon = badge.icon;
        const isHovered = activeHoverNode === badge.id;
        return (
          <div
            key={badge.id}
            onMouseEnter={() => setActiveHoverNode(badge.id)}
            onMouseLeave={() => setActiveHoverNode(null)}
            className={`absolute ${badge.pos} px-3.5 py-2 rounded-xl border backdrop-blur-xl transition-all duration-300 shadow-xl pointer-events-auto cursor-pointer ${badge.color} ${
              isHovered ? 'scale-110 shadow-cyan-500/30 -translate-y-1' : 'opacity-90'
            }`}
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <Icon className="w-4 h-4" />
              <span className="text-xs font-mono font-bold tracking-wide">{badge.title}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
