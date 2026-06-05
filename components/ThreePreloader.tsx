"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

interface ThreePreloaderProps {
  onComplete?: () => void;
}

export default function ThreePreloader({ onComplete }: ThreePreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // --- Three.js Setup ---
    const scene = new THREE.Scene();
    
    // Sleek dark atmosphere
    scene.background = null; 

    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;
    
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5.5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Warm main key light
    const keyLight = new THREE.DirectionalLight(0xd4af37, 4.0);
    keyLight.position.set(5, 5, 4);
    scene.add(keyLight);

    // Cool rim light from behind/left for high-fashion studio look
    const rimLight = new THREE.DirectionalLight(0xffffff, 3.0);
    rimLight.position.set(-5, 3, -2);
    scene.add(rimLight);

    // Dynamic point light that follows the mouse
    const pointLight = new THREE.PointLight(0xffffffff, 4, 15);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // --- Materials ---
    // Beautiful, heavy gold metal material
    const goldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 1.0,
      side: THREE.DoubleSide,
    });

    // Sleek dark metallic parts for contrast
    const darkMetalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a1a,
      metalness: 0.9,
      roughness: 0.2,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      reflectivity: 0.8,
      side: THREE.DoubleSide,
    });

    // --- Composing the 3D Architectural Letters ---
    const cruzGroup = new THREE.Group();
    scene.add(cruzGroup);

    // --- Letter C ---
    const cGroup = new THREE.Group();
    cGroup.position.x = -2.25;
    cruzGroup.add(cGroup);

    const cGeom = new THREE.TorusGeometry(0.55, 0.11, 16, 100, Math.PI * 1.55);
    const cMesh = new THREE.Mesh(cGeom, goldMaterial);
    cMesh.rotation.z = Math.PI * 0.225; // Open to the right
    cGroup.add(cMesh);

    // --- Letter R ---
    const rGroup = new THREE.Group();
    rGroup.position.x = -0.75;
    cruzGroup.add(rGroup);

    // Stem
    const rStemGeom = new THREE.BoxGeometry(0.18, 1.1, 0.18);
    const rStemMesh = new THREE.Mesh(rStemGeom, darkMetalMaterial);
    rStemMesh.position.set(-0.35, 0, 0);
    rGroup.add(rStemMesh);

    // Loop
    const rLoopGeom = new THREE.TorusGeometry(0.28, 0.09, 16, 100, Math.PI);
    const rLoopMesh = new THREE.Mesh(rLoopGeom, goldMaterial);
    rLoopMesh.position.set(-0.07, 0.28, 0);
    rGroup.add(rLoopMesh);

    // Leg
    const rLegGeom = new THREE.BoxGeometry(0.18, 0.65, 0.18);
    const rLegMesh = new THREE.Mesh(rLegGeom, goldMaterial);
    rLegMesh.rotation.z = -Math.PI * 0.18;
    rLegMesh.position.set(0.08, -0.26, 0);
    rGroup.add(rLegMesh);

    // --- Letter U ---
    const uGroup = new THREE.Group();
    uGroup.position.x = 0.75;
    cruzGroup.add(uGroup);

    // Left Stem
    const uLeftGeom = new THREE.BoxGeometry(0.18, 0.55, 0.18);
    const uLeftMesh = new THREE.Mesh(uLeftGeom, goldMaterial);
    uLeftMesh.position.set(-0.35, 0.28, 0);
    uGroup.add(uLeftMesh);

    // Right Stem
    const uRightGeom = new THREE.BoxGeometry(0.18, 0.55, 0.18);
    const uRightMesh = new THREE.Mesh(uRightGeom, darkMetalMaterial);
    uRightMesh.position.set(0.35, 0.28, 0);
    uGroup.add(uRightMesh);

    // Bottom Curve
    const uBottomGeom = new THREE.TorusGeometry(0.35, 0.09, 16, 100, Math.PI);
    const uBottomMesh = new THREE.Mesh(uBottomGeom, goldMaterial);
    uBottomMesh.rotation.z = Math.PI; // point downwards
    uBottomMesh.position.set(0, 0, 0);
    uGroup.add(uBottomMesh);

    // --- Letter Z ---
    const zGroup = new THREE.Group();
    zGroup.position.x = 2.25;
    cruzGroup.add(zGroup);

    // Top Bar
    const zTopGeom = new THREE.BoxGeometry(0.75, 0.14, 0.18);
    const zTopMesh = new THREE.Mesh(zTopGeom, goldMaterial);
    zTopMesh.position.set(0, 0.48, 0);
    zGroup.add(zTopMesh);

    // Bottom Bar
    const zBottomGeom = new THREE.BoxGeometry(0.75, 0.14, 0.18);
    const zBottomMesh = new THREE.Mesh(zBottomGeom, darkMetalMaterial);
    zBottomMesh.position.set(0, -0.48, 0);
    zGroup.add(zBottomMesh);

    // Diagonal
    const zDiagGeom = new THREE.BoxGeometry(0.16, 1.15, 0.18);
    const zDiagMesh = new THREE.Mesh(zDiagGeom, goldMaterial);
    zDiagMesh.rotation.z = -Math.PI * 0.285;
    zDiagMesh.position.set(0, 0, 0);
    zGroup.add(zDiagMesh);

    // --- Mouse Interaction ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Dynamic light tracking
      pointLight.position.x = mouseX * 5;
      pointLight.position.y = mouseY * 5;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // --- Animation Logic ---
    let currentProgress = 0;

    const animate = () => {
      requestAnimationFrame(animate);

      // Smooth progress update
      if (currentProgress < 1) {
        currentProgress += 0.024; // Adjust speed of loader simulation (faster)
        if (currentProgress > 1) currentProgress = 1;
        setProgress(Math.floor(currentProgress * 100));
      }

      // --- Architectural Letter Assembly Animation (based on progress) ---
      
      // C rotation/scale
      cMesh.rotation.y = (1 - currentProgress) * Math.PI * 2;
      cMesh.scale.setScalar(Math.min(currentProgress * 1.2, 1));

      // R assembly
      rStemMesh.position.y = THREE.MathUtils.lerp(2.0, 0, currentProgress);
      rLoopMesh.scale.setScalar(currentProgress);
      rLegMesh.position.y = THREE.MathUtils.lerp(-2.0, -0.26, currentProgress);
      rLegMesh.position.x = THREE.MathUtils.lerp(1.5, 0.08, currentProgress);

      // U assembly
      uLeftMesh.position.y = THREE.MathUtils.lerp(2.0, 0.28, currentProgress);
      uRightMesh.position.y = THREE.MathUtils.lerp(2.0, 0.28, currentProgress);
      uBottomMesh.scale.setScalar(currentProgress);

      // Z assembly
      zTopMesh.position.x = THREE.MathUtils.lerp(-2.0, 0, currentProgress);
      zBottomMesh.position.x = THREE.MathUtils.lerp(2.0, 0, currentProgress);
      zDiagMesh.scale.setScalar(currentProgress);

      // --- Post-Assembly Idle rotation & Mouse reactivity ---
      if (currentProgress >= 1) {
        targetRotationY = mouseX * 0.4;
        targetRotationX = mouseY * 0.4;

        // Slow cinematic rotation
        cruzGroup.rotation.y += 0.004;
        
        // Mouse reactivity
        cruzGroup.rotation.y = THREE.MathUtils.lerp(cruzGroup.rotation.y, targetRotationY, 0.05);
        cruzGroup.rotation.x = THREE.MathUtils.lerp(cruzGroup.rotation.x, targetRotationX, 0.05);
      } else {
        // Slow assembly rotation
        cruzGroup.rotation.y = currentProgress * Math.PI * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h, false);
    };

    window.addEventListener("resize", handleResize);

    // Disable scrolling
    document.body.style.overflow = "hidden";

    // Clean up
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
    };
  }, []);

  // --- Complete & Zoom Out Animation ---
  useEffect(() => {
    if (progress >= 100 && !isFinished) {
      setIsFinished(true);

      // Restore scrolling
      document.body.style.overflow = "";

      // Start GSAP out animation
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        }
      });

      // 1. Fade out the text & HUD components
      tl.to(".preloader-hud", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      });

      // 2. Zoom-in camera transition effect (cinematic fly-through)
      tl.to(canvasRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 1.2,
        ease: "power3.inOut",
      }, "-=0.4");

      // 3. Fade out main container
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.6");
    }
  }, [progress, isFinished, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-neutral-950 z-[99999] flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Cinematic HUD details */}
      <div className="preloader-hud absolute top-8 left-8 right-8 flex justify-between items-center text-[8px] tracking-[0.3em] uppercase font-mono text-white/40">
        <div>CRUZ CLIENT v1.0.4</div>
        <div className="hidden sm:block">MILAN &bull; TOKYO &bull; PARIS</div>
        <div>SECURE LINK SYSTEM</div>
      </div>

      {/* 3D Canvas */}
      <div className="w-full max-w-[800px] aspect-[16/9] md:aspect-[2/1] relative flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Loading Progress Interface */}
      <div className="w-full max-w-sm px-8 flex flex-col items-center space-y-4">


        {/* Minimalist Progress Bar */}
        <div className="preloader-hud w-full h-[1px] bg-white/10 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-[#d4af37] transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Architectural Loading Message */}
        <div className="preloader-hud text-center">
          <div className="text-[9px] tracking-[0.25em] uppercase text-white/50 mb-1">
            {progress < 100 ? "Assembling Core Architecture" : "Archival Entry Authenticated"}
          </div>
          <div className="text-[8px] tracking-[0.3em] uppercase text-[#d4af37]/60 font-mono">
            {progress < 40 && "FETCHING APPARATUS..."}
            {progress >= 40 && progress < 80 && "CONSTRUCTING SILHOUETTES..."}
            {progress >= 80 && progress < 100 && "COMPILING ATMOSPHERE..."}
            {progress >= 100 && "SYSTEMS READY"}
          </div>
        </div>
      </div>

      {/* Bottom Technical Grid line */}
      <div className="preloader-hud absolute bottom-8 left-8 right-8 flex justify-between items-center text-[8px] tracking-[0.3em] uppercase font-mono text-white/40">
        <div>COORDINATES: 45.4642° N, 9.1900° E</div>
        <div>© 2026 CRUZ ARCHIVE</div>
      </div>
    </div>
  );
}
