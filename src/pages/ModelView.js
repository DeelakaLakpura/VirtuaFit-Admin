// src/ModelViewer.js

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import lottie from 'lottie-web';
import '@dotlottie/player-component';

const ModelView = ({ modelPath, lottieAnimationPath }) => {
  const mountRef = useRef(null);
  const modelRef = useRef(null); // To hold reference to the model
  const [isRotating, setIsRotating] = useState(true); // Start with rotation enabled
  const [showIntro, setShowIntro] = useState(true); // Show intro initially

  useEffect(() => {
    // Set up the scene
    const scene = new THREE.Scene();

    // Set up the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight); // Set to full window size
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(new THREE.Color(0xE4E4E4)); // Set background color to gray
    mountRef.current.appendChild(renderer.domElement);

    // Set up the camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 5); // Default camera position

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
        model.scale.set(1, 1, 1); // Adjust scale as needed

        // Center the model in the scene
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // Store the model reference
        modelRef.current = model;

        // Update the scene with the model
        scene.add(model);

        // Adjust camera position based on model bounding box
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const cameraDistance = maxDim / (2 * Math.tan(Math.PI * 0.25 * camera.fov / 180));
        camera.position.z = cameraDistance;

        // Adjust the camera to always look at the center of the model
        camera.lookAt(center);
      },
      undefined,
      (error) => {
        console.error("Error loading GLB model", error);
      }
    );

    // Set up OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Enable damping (inertia)
    controls.dampingFactor = 0.65; // Damping factor
    controls.screenSpacePanning = false; // Do not allow panning

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the model automatically if isRotating is true
      if (modelRef.current && isRotating) {
        modelRef.current.rotation.y += 0.001; // Adjust rotation speed (slower)
      }

      controls.update(); // Update controls
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
    let animation;
    if (showIntro && lottieAnimationPath) {
      const container = document.getElementById('lottie-container');
      if (container) {
        animation = lottie.loadAnimation({
          container,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: '../public/animations/introduction.json' // Path to the Lottie JSON file
        });
      }
    }

    // Hide the introduction image after 2 seconds
    const introTimer = setTimeout(() => {
      setShowIntro(false);
      if (animation) {
        animation.destroy(); // Cleanup Lottie animation
      }
    }, 2500);

    // Cleanup function
    return () => {
      clearTimeout(introTimer);
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
      window.removeEventListener('resize', handleResize);
      if (animation) {
        animation.destroy(); // Cleanup Lottie animation on unmount
      }
    };
  }, [modelPath, isRotating, showIntro, lottieAnimationPath]); // Depend on isRotating for re-rendering

  // Toggle rotation
  const handleToggleRotation = () => {
    setIsRotating(prev => !prev);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }}></div>
      
      {showIntro && (
        <div
          id="lottie-container"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            textAlign: 'center',
            zIndex: 1,
            width: '250px', // Adjust as needed
            height: '250px' // Adjust as needed
          }}
        >
    <dotlottie-player src="https://lottie.host/059d5c51-e9f2-416c-ad8f-96436f8130b1/xQLWSYfpo4.json" background="transparent" speed="1" loop autoplay></dotlottie-player>
        </div>
      )}
    </div>
  );
};

export default ModelView;
