import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faBox, faCalendar, faMap, faClock } from '@fortawesome/free-solid-svg-icons';
import TextLoop from 'react-text-loop';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import Swal from 'sweetalert2';

const Homepage = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [greetingMessage, setGreetingMessage] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const updateTimeAndDate = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDate(now.toLocaleDateString());
    };

    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
            .then(response => response.json())
            .then(data => setCurrentLocation(data.city ? data.city : 'Unknown'))
            .catch(error => {
              console.error('Error fetching location:', error);
              setCurrentLocation('Unknown');
            });
        },
        error => {
          console.error('Error getting location:', error);
          setCurrentLocation('Unknown');
        }
      );
    };

    const timer = setInterval(updateTimeAndDate, 1000);

    const currentHour = new Date().getHours();

    let message;
    if (currentHour >= 5 && currentHour < 12) {
      message = '🌞 Good morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      message = '🍂 Good afternoon';
    } else {
      message = '😴 Good evening';
    }
    setGreetingMessage(message);

    updateTimeAndDate();
    fetchLocation();

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const usersRef = firebase.database().ref('Users');
    const messagesRef = firebase.database().ref('notifications');
    const productsRef = firebase.database().ref('products');

    const fetchCounts = () => {
      usersRef.on('value', snapshot => {
        if (snapshot.exists()) {
          setTotalUsers(snapshot.numChildren());
        }
      });

      messagesRef.on('value', snapshot => {
        if (snapshot.exists()) {
          setTotalMessages(snapshot.numChildren());
        }
      });

      productsRef.on('value', snapshot => {
        if (snapshot.exists()) {
          setTotalProducts(snapshot.numChildren());
        }
      });
    };

    fetchCounts();

    return () => {
      usersRef.off();
      messagesRef.off();
      productsRef.off();
    };
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout'
    }).then((result) => {
      if (result.isConfirmed) {
        firebase.auth().signOut().then(() => {
          window.location.reload();
          console.log('User logged out successfully.');
        }).catch((error) => {
          console.error('Error logging out:', error);
        });
      }
    });
  };

  return (
    <div className="flex h-screen">
      <main className="flex-1 bg-gray-100 ml-20 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{greetingMessage}, Admin!</h1>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300 ease-in-out transform hover:scale-110"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Details Section */}
          <div className="bg-white p-6 rounded-lg shadow-md" whileHover={{ scale: 1.1 }}>
            <p className="text-xl font-semibold text-gray-800 mb-4">More Details</p>
            <div className="text-xl mb-2">
              <FontAwesomeIcon icon={faClock} className="inline mr-2" />
              <TextLoop>
                <span>Current Time: {currentTime}</span>
                <span>Time is precious: {currentTime}</span>
                <span>Don't waste time: {currentTime}</span>
              </TextLoop>
            </div>
            <div className="text-xl mb-2">
              <FontAwesomeIcon icon={faCalendar} className="inline mr-2" /> Current Date: {currentDate}
            </div>
            <div className="text-xl mb-2">
              <FontAwesomeIcon icon={faMap} className="inline mr-2" /> Current Location: {currentLocation}
            </div>
          </div>

          {/* Counts Section */}
          <div className="bg-white p-6 rounded-lg shadow-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <p className="text-xl font-semibold text-gray-800 mb-4">Count Users</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-200 p-4 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <FontAwesomeIcon icon={faUser} className="text-lg text-blue-800" />
                  <p className="text-gray-600">Total Users</p>
                </div>
                <p className="text-gray-600 text-3xl font-bold">{totalUsers}</p>
              </div>
              <div className="bg-green-200 p-4 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <FontAwesomeIcon icon={faBell} className="text-lg text-green-800" />
                  <p className="text-gray-600">Total Notifications</p>
                </div>
                <p className="text-gray-600 text-3xl font-bold">{totalMessages}</p>
              </div>
              <div className="bg-yellow-200 p-4 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <FontAwesomeIcon icon={faBox} className="text-lg text-yellow-800" />
                  <p className="text-gray-600">Total Products</p>
                </div>
                <p className="text-gray-600 text-3xl font-bold">{totalProducts}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Homepage;
