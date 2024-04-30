import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroNavigation from './components/HeroNavigation';
import Homepage from './pages/Homepage';
import UploadDetails from './pages/UploadDetails';
import ViewDetails from './pages/ViewDetails';
import ProfileDetail from './pages/ProfileDetail';

function App() {
  return (
    <Router>
      <HeroNavigation />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/add-product" element={<UploadDetails />} />
        <Route path="/view-product" element={<ViewDetails />} />
        <Route path="/user-profile" element={<ProfileDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
