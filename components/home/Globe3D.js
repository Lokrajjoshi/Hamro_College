"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// lat/lng -> 3D point on unit sphere
function latLngToVec3(lat, lng, r = 1.02) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

// Major Nepali student destinations
const PINS = [
  { lat: 27.7172, lng: 85.324, label: "Kathmandu", color: "#e0334f" },
  { lat: 12.9716, lng: 77.5946, label: "Bangalore", color: "#f59e0b" },
  { lat: 28.6139, lng: 77.2090, label: "Delhi", color: "#f59e0b" },
  { lat: -33.8688, lng: 151.2093, label: "Sydney", color: "#10b981" },
  { lat: 43.6532, lng: -79.3832, label: "Toronto", color: "#10b981" },
  { lat: 51.5074, lng: -0.1278, label: "London", color: "#10b981" },
  { lat: 35.6762, lng: 139.6503, label: "Tokyo", color: "#10b981" },
  { lat: 33.4484, lng: -112.074, label: "Tempe/Phoenix", color: "#10b981" },
];

export default function Globe3D({ className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const W = container.clientWidth;
    const H = container.clientHeight;

    // ── Renderer ──────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── Scene / Camera ────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 2.8);

    // ── Lighting ──────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(5, 3, 5);
    scene.add(sun);

    // ── Globe ─────────────────────────────────────────────────────
    const globeGeo = new THREE.SphereGeometry(1, 64, 64);

    // Procedural land texture using canvas
    const texCanvas = document.createElement("canvas");
    texCanvas.width = 1024;
    texCanvas.height = 512;
    const ctx = texCanvas.getContext("2d");

    // Ocean
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
    oceanGrad.addColorStop(0, "#0b1f4d");
    oceanGrad.addColorStop(1, "#003893");
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Simplified land masses as ellipses (good enough for a decorative globe)
    ctx.fillStyle = "#1a4a2e";
    const landMasses = [
      // Eurasia
      [200, 130, 260, 80], [320, 120, 180, 60], [400, 150, 60, 40],
      // Africa
      [260, 220, 90, 120],
      // Americas
      [90, 140, 70, 90], [100, 250, 50, 80],
      // Australia
      [770, 280, 80, 50],
      // SE Asia
      [720, 200, 60, 40],
    ];
    landMasses.forEach(([cx, cy, rw, rh]) => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, rw, rh, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Add slight texture noise
    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.03})`;
      ctx.fillRect(x, y, 1, 1);
    }

    const globeTexture = new THREE.CanvasTexture(texCanvas);
    const globeMat = new THREE.MeshPhongMaterial({
      map: globeTexture,
      specular: new THREE.Color(0x1a3a6e),
      shininess: 18,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    globe.rotation.x = 0.3;
    scene.add(globe);

    // ── Atmosphere (outer glow) ────────────────────────────────────
    const atmGeo = new THREE.SphereGeometry(1.08, 64, 64);
    const atmMat = new THREE.MeshPhongMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.08,
      side: THREE.FrontSide,
      depthWrite: false,
    });
    scene.add(new THREE.Mesh(atmGeo, atmMat));

    // ── Wireframe grid ────────────────────────────────────────────
    const wireGeo = new THREE.SphereGeometry(1.001, 24, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x5588ff,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    });
    scene.add(new THREE.Mesh(wireGeo, wireMat));

    // ── City pin dots ─────────────────────────────────────────────
    const pinGroup = new THREE.Group();
    globe.add(pinGroup);

    PINS.forEach(({ lat, lng, color }) => {
      const pos = latLngToVec3(lat, lng);

      // Glowing ring
      const ringGeo = new THREE.RingGeometry(0.012, 0.022, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(0, 0, 0);
      pinGroup.add(ring);

      // Core dot
      const dotGeo = new THREE.SphereGeometry(0.008, 8, 8);
      const dotMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color) });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(pos);
      pinGroup.add(dot);
    });

    // ── 3D Flight Arcs from Kathmandu to Study Destinations ────────
    const ktmPos = latLngToVec3(PINS[0].lat, PINS[0].lng);
    const arcGroup = new THREE.Group();
    const arcParticles = [];

    PINS.slice(1).forEach((destPin, idx) => {
      const destPos = latLngToVec3(destPin.lat, destPin.lng);
      
      // Calculate elevated midpoint for 3D curved arc
      const mid = new THREE.Vector3().addVectors(ktmPos, destPos).multiplyScalar(0.5);
      const dist = ktmPos.distanceTo(destPos);
      const altitude = 1.0 + dist * 0.28;
      mid.normalize().multiplyScalar(altitude);

      const curve = new THREE.QuadraticBezierCurve3(ktmPos, mid, destPos);
      const points = curve.getPoints(50);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
      const curveMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(destPin.color),
        transparent: true,
        opacity: 0.45,
        linewidth: 1.5,
      });

      const arcLine = new THREE.Line(curveGeo, curveMat);
      arcGroup.add(arcLine);

      // Moving particle along the arc
      const particleGeo = new THREE.SphereGeometry(0.012, 8, 8);
      const particleMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(destPin.color),
        transparent: true,
        opacity: 0.95,
      });
      const particle = new THREE.Mesh(particleGeo, particleMat);
      arcGroup.add(particle);

      arcParticles.push({
        mesh: particle,
        curve,
        speed: 0.15 + (idx % 3) * 0.05,
        progress: (idx * 0.2) % 1,
      });
    });

    globe.add(arcGroup);

    // ── Stars backdrop ────────────────────────────────────────────
    const starPositions = [];
    for (let i = 0; i < 1200; i++) {
      starPositions.push(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60
      );
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.6 });
    scene.add(new THREE.Points(starGeo, starMat));

    // ── Mouse parallax ────────────────────────────────────────────
    let mouseX = 0, mouseY = 0;
    const handleMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouse);

    // ── Resize ────────────────────────────────────────────────────
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // ── Animation loop ────────────────────────────────────────────
    let frame;
    const clock = new THREE.Clock();
    let lastTime = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const delta = Math.min(t - lastTime, 0.1);
      lastTime = t;

      // Slow auto-rotation
      globe.rotation.y = t * 0.08;

      // Gentle mouse parallax on the whole scene
      scene.rotation.y += (mouseX * 0.12 - scene.rotation.y) * 0.04;
      scene.rotation.x += (-mouseY * 0.06 - scene.rotation.x) * 0.04;

      // Pulse the pin rings
      pinGroup.children.forEach((child, i) => {
        if (i % 2 === 0) {
          const pulse = 0.85 + Math.sin(t * 2 + i) * 0.15;
          child.scale.setScalar(pulse);
        }
      });

      // Animate flight particles along curves
      arcParticles.forEach((ap) => {
        ap.progress = (ap.progress + delta * ap.speed) % 1;
        const pt = ap.curve.getPoint(ap.progress);
        ap.mesh.position.copy(pt);
      });

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ───────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ userSelect: "none", touchAction: "none" }}
      aria-hidden="true"
    />
  );
}
