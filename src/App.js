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
  const [modelUrl, setModelUrl] = useState(null);

  function ViewModel() {
    const { modelPath } = useParams();

    useEffect(() => {
      const fetchModel = async () => {
        try {
        
          if (modelPath.startsWith('https://firebasestorage.googleapis.com')) {
            const response = await fetch(modelPath);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setModelUrl(url);
          } else {
           
            const storage = getStorage();
            const storageRef = ref(storage, modelPath);
            const downloadURL = await getDownloadURL(storageRef);
            const response = await fetch(downloadURL);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setModelUrl(url);
          }
        } catch (error) {
          console.error('Error fetching model:', error);
        }
      };

      if (modelPath) {
        fetchModel();
      }
    }, [modelPath]);

    return (
      modelUrl ? <ModelView modelPath={modelUrl} /> : <div>Loading...</div>
    );
  }

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <HeroNavigation />
      <Routes>
        {/* This route will now capture the model URL from the path */}
        <Route path="/view-model/:modelPath/*" element={<ViewModel />} />
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

export default App;
