const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNotification = functions.database.ref('/notifications/{notificationId}')
  .onCreate(async (snapshot, context) => {
    const notification = snapshot.val();
    const payload = {
      notification: {
        title: notification.title,
        body: notification.message,
        imageUrl: notification.imageUrl || '', // Optional: include image URL if present
      }
    };

    try {
      // Replace with your FCM topic or device tokens
      const topic = 'all'; // or use device tokens

      await admin.messaging().sendToTopic(topic, payload);
      console.log('Notification sent successfully.');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  });
