"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ParticleField({ className = "", count = 120, color = "#4338ca" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const W = container.clientWidth;
    const H = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(1); // intentionally low for a soft look
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 4;

    // Build a particle cloud
    const positions = new Float32Array(count * 3);
    const velocities = [];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      velocities.push({
        x: (Math.random() - 0.5) * 0.004,
        y: (Math.random() - 0.5) * 0.002,
      });
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 0.06,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const posArr = geo.attributes.position.array;
    let frame;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      for (let i = 0; i < count; i++) {
        posArr[i * 3] += velocities[i].x;
        posArr[i * 3 + 1] += velocities[i].y;
        // Wrap edges
        if (posArr[i * 3] > 5) posArr[i * 3] = -5;
        if (posArr[i * 3] < -5) posArr[i * 3] = 5;
        if (posArr[i * 3 + 1] > 2.5) posArr[i * 3 + 1] = -2.5;
        if (posArr[i * 3 + 1] < -2.5) posArr[i * 3 + 1] = 2.5;
      }
      geo.attributes.position.needsUpdate = true;
      points.rotation.z += 0.0003;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [count, color]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}
