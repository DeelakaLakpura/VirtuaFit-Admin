// src/components/FileUpload.js
import React, { useState, useRef, startTransition } from 'react';
import ModelViewer from './ModelViewer';

const FileUpload = () => {
  const [modelUrl, setModelUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      startTransition(() => {
        setModelUrl(url);
      });
    }
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Upload Model</button>
      <input
        type="file"
        accept=".glb"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {modelUrl && <ModelViewer modelUrl={modelUrl} />}
    </div>
  );
};

export default FileUpload;
