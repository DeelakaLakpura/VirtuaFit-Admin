import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HeroNavigation from './components/HeroNavigation';
import Homepage from './pages/Homepage';
import UploadDetails from './pages/UploadDetails';
import ViewDetails from './pages/ViewDetails';
import ProfileDetail from './pages/ProfileDetail';
import Sendnotifications from './pages/Sendnotifications';
import LoginPage from './pages/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle login
  const handleLogin = () => {
   
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <HeroNavigation />
      <Routes>
        {/* Route for the login page */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

        {/* Protected routes */}
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Homepage />} />
            <Route path="/add-product" element={<UploadDetails />} />
            <Route path="/view-product" element={<ViewDetails />} />
            <Route path="/user-profile" element={<ProfileDetail />} />
            <Route path="/user-fmc" element={<Sendnotifications />} />
          </>
        ) : (
          // Redirect to login if not authenticated
          <Route
            path="/*"
            element={<Navigate to="/login" replace />}
          />
        )}
      </Routes>
    </Router>
  );
}

export default App;
