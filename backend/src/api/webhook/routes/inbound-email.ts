export default {
  routes: [
    {
      method: 'POST',
      path: '/webhooks/inbound-email',
      handler: 'inbound-email.receive',
      config: {
        auth: false,
      },
    },
  ],
};
