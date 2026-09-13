export default {
  routes: [
    {
      method: 'GET',
      path: '/user-preferences',
      handler: 'user-preference.getPreferences',
    },
    {
      method: 'PUT',
      path: '/user-preferences',
      handler: 'user-preference.updatePreferences',
    },
  ],
};
