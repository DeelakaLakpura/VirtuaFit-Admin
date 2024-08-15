import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';

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

  // Component to handle model view and fetching the URL from query parameters
  function ViewModel() {
    const [searchParams] = useSearchParams();
    const modelPath = searchParams.get('url'); // Get the 'url' query parameter

    useEffect(() => {
      const fetchModel = async () => {
        try {
          if (modelPath) {
            const response = await fetch(modelPath);
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

    return modelUrl ? <ModelView modelPath={modelUrl} /> : <div>Loading...</div>;
  }

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <HeroNavigation />
      <Routes>
        {/* This route will now capture the 'url' query parameter from the path */}
        <Route path="/view-model" element={<ViewModel />} />
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
