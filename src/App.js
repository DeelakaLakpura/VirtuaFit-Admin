import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

import HeroNavigation from './components/HeroNavigation';
import Homepage from './pages/Homepage';
import UploadDetails from './pages/UploadDetails';
import ViewDetails from './pages/ViewDetails';
import ProfileDetail from './pages/ProfileDetail';
import Sendnotifications from './pages/Sendnotifications';
import LoginPage from './pages/Login';
import ModelView from './pages/ModelView';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modelUrl, setModelUrl] = useState(null);

  const firebaseModelPath = "https://firebasestorage.googleapis.com/v0/b/vfit-8e85e.appspot.com/o/models%2Fold_wooden_chair.glb?alt=media&token=3e21fb15-551c-4d2c-9d96-5128b51a942d";

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, firebaseModelPath);
        const downloadURL = await getDownloadURL(storageRef);
        const response = await fetch(downloadURL);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setModelUrl(url);
      } catch (error) {
        console.error('Error fetching model:', error);
      }
    };

    fetchModel();
  }, [firebaseModelPath]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <HeroNavigation />
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Homepage />} />
            <Route path="/add-product" element={<UploadDetails />} />
            <Route path="/view-product" element={<ViewDetails />} />
            <Route path="/user-profile" element={<ProfileDetail />} />
            <Route path="/user-fmc" element={<Sendnotifications />} />
            <Route path="/view-model" element={modelUrl ? <ModelView modelPath={modelUrl} /> : <div>Loading...</div>} />
          </>
        ) : (
          <Route path="/*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;