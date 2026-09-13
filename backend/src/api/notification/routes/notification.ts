export default {
  routes: [
    {
      method: 'GET',
      path: '/notifications',
      handler: 'notification.getNotifications',
    },
    {
      method: 'POST',
      path: '/notifications/mark-read',
      handler: 'notification.markAsRead',
    },
  ],
};
