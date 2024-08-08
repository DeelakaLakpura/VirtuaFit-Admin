import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faTrash } from '@fortawesome/free-solid-svg-icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/database';
import swal from 'sweetalert2';

// Initialize Firebase (ensure you have your Firebase config here)
const firebaseConfig = {
  apiKey: "AIzaSyDUvw7F48wXGNNJa_NO58Xru8ucWDjuRzc",
  authDomain: "vfit-8e85e.firebaseapp.com",
  databaseURL: "https://vfit-8e85e-default-rtdb.firebaseio.com",
  projectId: "vfit-8e85e",
  storageBucket: "vfit-8e85e.appspot.com",
  messagingSenderId: "185468595314",
  appId: "1:185468595314:web:50ac7436877a2f716c66eb"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function SendNotifications() {
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const snapshot = await firebase.database().ref('notifications').once('value');
        const notificationsData = [];
        snapshot.forEach((childSnapshot) => {
          const notification = {
            id: childSnapshot.key,
            ...childSnapshot.val()
          };
          notificationsData.push(notification);
        });
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let downloadURL = '';
      if (selectedImage) {
        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child(selectedImage.name);
        await imageRef.put(selectedImage);
        downloadURL = await imageRef.getDownloadURL();
      }

      const accessToken = Math.random().toString(36).substring(7);

      await firebase.database().ref('notifications').push({
        title: notificationTitle,
        message: notificationMessage,
        imageUrl: downloadURL,
        accessToken: accessToken,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      });

      setNotificationTitle('');
      setNotificationMessage('');
      setSelectedImage(null);

      swal.fire({
        icon: 'success',
        title: 'Notification Sent!',
        text: 'Your notification has been sent successfully.'
      });
    } catch (error) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to send notification. Please try again later.'
      });
      console.error('Error sending notification:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await firebase.database().ref('notifications').child(notificationId).remove();
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== notificationId)
      );
      swal.fire({
        icon: 'success',
        title: 'Notification Deleted!',
        text: 'The notification has been successfully deleted.'
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete notification. Please try again later.'
      });
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100">
      {/* Left Section: Send Notifications */}
      <div className="w-full max-w-md mx-4 my-10 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-xl font-semibold mb-4">Send Notifications</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="notificationTitle" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="notificationTitle"
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="notificationMessage" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              id="notificationMessage"
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              rows="4"
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="notificationImage" className="block text-sm font-medium text-gray-700 mb-2">Image (Optional)</label>
            <div className="flex items-center">
              <label
                htmlFor="uploadButton"
                className="cursor-pointer flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-200"
              >
                <FontAwesomeIcon icon={faImage} className="mr-2" />
                Upload Image
              </label>
              <input
                type="file"
                id="uploadButton"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              {selectedImage && <span className="ml-4">{selectedImage.name}</span>}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Send Notification
          </button>
        </form>
      </div>

      {/* Right Section: View Notifications */}
      <div className="flex-grow max-w-3xl mx-4 my-10 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-xl font-semibold mb-4">View Notifications</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Message</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification) => (
                <tr key={notification.id}>
                  <td className="px-4 py-2">{notification.title}</td>
                  <td className="px-4 py-2">{notification.message}</td>
                  <td className="px-4 py-2">
                    {notification.imageUrl && (
                      <img src={notification.imageUrl} alt="Notification" className="h-16" />
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SendNotifications;
