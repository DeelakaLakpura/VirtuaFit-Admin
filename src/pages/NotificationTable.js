import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import swal from 'sweetalert2';

const NotificationTable = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const notificationsRef = firebase.database().ref('notifications');
    notificationsRef.on('value', (snapshot) => {
      const notificationsData = snapshot.val();
      if (notificationsData) {
        const notificationsArray = Object.entries(notificationsData).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setNotifications(notificationsArray);
      } else {
        setNotifications([]);
      }
    });

    return () => notificationsRef.off('value');
  }, []);

  const handleDelete = (id) => {
    const notificationRef = firebase.database().ref(`notifications/${id}`);
    notificationRef.remove()
      .then(() => {
        swal.fire({
          icon: 'success',
          title: 'Notification Deleted!',
          text: 'The notification has been deleted successfully.'
        });
      })
      .catch((error) => {
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete notification. Please try again later.'
        });
        console.error('Error deleting notification:', error);
      });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Notification Table</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {notifications.map((notification) => (
            <tr key={notification.id}>
              <td className="px-6 py-4 whitespace-nowrap">{notification.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">{notification.message}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {notification.imageUrl && <img src={notification.imageUrl} alt="Notification" className="h-10 w-10 object-cover" />}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotificationTable;
