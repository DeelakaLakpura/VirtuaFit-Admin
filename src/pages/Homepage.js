import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faClipboardList, faDollarSign, faChartLine, faCog, faCalendar, faMap, faFireBurner, faRupee, faTimesCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import TextLoop from 'react-text-loop';

const LottieAnimationPlaceholder = ({ currentTime, currentDate, currentLocation }) => {
  return (
    <motion.div className="bg-gray-200 h-48 rounded-lg flex flex-col items-center justify-center"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.p className="text-xl mb-2"
        initial={{ opacity: 0, x: -20 }} // Initial animation states for text
        animate={{ opacity: 1, x: 0 }} // Animation when component mounts
        transition={{ duration: 0.5, delay: 0.2 }} // Transition duration with delay
      >
     <FontAwesomeIcon icon={faClock} className="inline mr-2" />
        <TextLoop>
          <span>Current Time: {currentTime}</span>
          <span>Time is precious: {currentTime}</span>
          <span>Don't waste time: {currentTime}</span>
        </TextLoop>
      </motion.p>
      <motion.p className="text-xl mb-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <FontAwesomeIcon icon={faCalendar} className="inline mr-2" /> Current Date: {currentDate}
      </motion.p>
      <motion.p className="text-xl mb-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <FontAwesomeIcon icon={faMap} className="inline mr-2" /> Current Location: {currentLocation}
      </motion.p>
    </motion.div>
  );
};
const YourComponent = () => {
  // Sample data for demonstration
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Sample Data',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  };
}

const Homepage = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [greetingMessage, setGreetingMessage] = useState('');

  useEffect(() => {
    // Fetch current time and date
    const updateTimeAndDate = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDate(now.toLocaleDateString());
    };

    // Update time and date every second
    const timer = setInterval(updateTimeAndDate, 1000);

    // Fetch current location
    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        // Fetch location using latitude and longitude
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
          .then(response => response.json())
          .then(data => setCurrentLocation(data.city ? data.city : 'Unknown'));
      }, error => {
        setCurrentLocation('Unknown');
        console.error('Error getting location:', error);
      });
    };

    const currentHour = new Date().getHours();

    // Define the greeting message based on the time of day
    let message;
    if (currentHour >= 5 && currentHour < 12) {
      message = '🌞 Good morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      message = '🍂 Good afternoon';
    } else {
      message = '😴 Good evening';
    }
    setGreetingMessage(message);

    updateTimeAndDate(); // Initialize time and date
    fetchLocation(); // Fetch initial location

    return () => clearInterval(timer); // Cleanup interval
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {/* You can add sidebar content here */}

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 ml-20 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{greetingMessage}, Admin!</h1>

          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300 ease-in-out transform hover:scale-110">Logout</button>
        </header>

        {/* Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Lottie Animation */}
          <motion.div className="bg-white p-6 rounded-lg shadow-md"
            whileHover={{ scale: 1.1 }}
          >
            <p className="text-xl font-semibold text-gray-800 mb-4">More Details</p>
            <LottieAnimationPlaceholder currentTime={currentTime} currentDate={currentDate} currentLocation={currentLocation} />
          </motion.div>

          {/* Count Card Views */}
          <motion.div className="bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl font-semibold text-gray-800 mb-4">Count Card Views</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1 */}
              <motion.div className="bg-blue-200 p-4 rounded-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <FontAwesomeIcon icon={faUser} className="text-lg text-blue-800" />
                  <p className="text-gray-600">Total Users</p>
                </div>
                <p className="text-gray-600 text-3xl font-bold">1000</p>
              </motion.div>
              {/* Card 2 */}
              <motion.div className="bg-green-200 p-4 rounded-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <FontAwesomeIcon icon={faFireBurner} className="text-lg text-green-800" />
                  <p className="text-gray-600">Total Products</p>
                </div>
                <p className="text-gray-600 text-3xl font-bold">500</p>
              </motion.div>
              {/* Card 3 */}
              <motion.div className="bg-yellow-200 p-4 rounded-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <FontAwesomeIcon icon={faRupee} className="text-lg text-yellow-800" />
                  <p className="text-gray-600">Revenue</p>
                </div>
                <p className="text-gray-600 text-3xl font-bold">Rs. 10,000</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Graphs */}
        <div className="bg-white p-6 mt-8 rounded-lg shadow-md">
          <p className="text-xl font-semibold text-gray-800 mb-4">Graphs</p>
          <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
            <FontAwesomeIcon icon={faChartLine} className="text-5xl text-gray-600" />
          </div>
        </div>

        {/* Additional Widgets */}
        <div className="bg-white p-6 mt-8 rounded-lg shadow-md">
          <p className="text-xl font-semibold text-gray-800 mb-4">Additional Widgets</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Widget 1 */}
            <div className="bg-purple-200 p-4 rounded-lg">
              <FontAwesomeIcon icon={faCog} className="text-lg text-purple-800" />
              <p className="text-gray-600">Widget 1 Content goes here</p>
            </div>
            {/* Widget 2 */}
            <div className="bg-pink-200 p-4 rounded-lg">
              <FontAwesomeIcon icon={faCog} className="text-lg text-pink-800" />
              <p className="text-gray-600">Widget 2 Content goes here</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Homepage;

