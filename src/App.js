import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
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

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <HeroNavigation />
      <Routes>
        <Route path="/view-model/:firebaseModelPath" element={<ModelFetcher />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Homepage />} />
            <Route path="/add-product" element={<UploadDetails />} />
            <Route path="/view-product" element={<ViewDetails />} />
            <Route path="/user-profile" element={<ProfileDetail />} />
            <Route path="/user-fmc" element={<Sendnotifications />} />
          </>
        ) : (
          <Route path="/*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
}

function ModelFetcher() {
  const { firebaseModelPath } = useParams();
  const [modelUrl, setModelUrl] = useState(null);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        // Handle URL decoding
        const decodedPath = decodeURIComponent(firebaseModelPath);
        const storage = getStorage();
        const storageRef = ref(storage, decodedPath);
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

  return modelUrl ? <ModelView modelPath={modelUrl} /> : <div>Loading...</div>;
}

export default App;
