// src/components/ModelViewer.js
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// A functional component to load and display the GLB model
const ModelViewer = ({ modelUrl }) => {
  // useGLTF is a hook from @react-three/drei to load GLTF/GLB models
  const { scene } = useGLTF(modelUrl);

  return (
    <Canvas style={{ height: '500px', width: '100%' }}>
      {/* OrbitControls allows you to rotate, zoom, and pan the scene */}
      <OrbitControls />
      {/* Lighting for the scene */}
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      {/* Display the model */}
      <primitive object={scene} />
    </Canvas>
  );
};

export default ModelViewer;
