import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import lottie from 'lottie-web';
import '@dotlottie/player-component';

const ModelView = ({ modelPath, lottieAnimationPath }) => {
  const mountRef = useRef(null);
  const modelRef = useRef(null);
  const [showIntro, setShowIntro] = useState(true);
  const animationRef = useRef(null); // Added ref for Lottie animation

  useEffect(() => {
    const currentMountRef = mountRef.current;
    if (!currentMountRef) return;

    // Set up the scene
    const scene = new THREE.Scene();

    // Set up the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(new THREE.Color(0xE4E4E4));
    currentMountRef.appendChild(renderer.domElement);

    // Set up the camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 5);

    // Set up the light
    const light = new THREE.AmbientLight(0xcccccc, 2);
    scene.add(light);

    // Load the GLB model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;

        // Scale and center the model
        model.scale.set(1, 1, 1);

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        modelRef.current = model;
        scene.add(model);

        // Adjust camera position
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const cameraDistance = maxDim / (2 * Math.tan(Math.PI * 0.25 * camera.fov / 180));
        camera.position.z = cameraDistance;
        camera.lookAt(center);
      },
      undefined,
      (error) => {
        console.error("Error loading GLB model:", error);
      }
    );

    // Set up OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.65;
    controls.screenSpacePanning = false;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (modelRef.current && showIntro === false) {
        modelRef.current.rotation.y += 0.001;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Initialize Lottie animation
    if (showIntro && lottieAnimationPath && !animationRef.current) {
      const container = document.getElementById('lottie-container');
      if (container) {
        animationRef.current = lottie.loadAnimation({
          container,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: lottieAnimationPath, // Path to the Lottie JSON file
        });
      }
    }

    // Hide the introduction animation after 2 seconds
    const introTimer = setTimeout(() => {
      setShowIntro(false);
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    }, 2000); // 2 seconds

    // Cleanup function
    return () => {
      clearTimeout(introTimer);
      if (currentMountRef) {
        currentMountRef.removeChild(renderer.domElement);
      }
      renderer.dispose();
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [modelPath, lottieAnimationPath]); // Removed unnecessary dependencies

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }}></div>

      {showIntro && (
        <dotlottie-player
          id="lottie-container"
          src={lottieAnimationPath}
          background="transparent"
          speed="1"
          loop
          autoplay
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        ></dotlottie-player>
      )}
    </div>
  );
};

export default ModelView;
