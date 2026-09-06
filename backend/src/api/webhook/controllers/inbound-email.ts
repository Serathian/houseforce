import { Core } from '@strapi/strapi';

export default {
  async receive(ctx) {
    try {
      const payload = ctx.request.body;
      strapi.log.info('Received inbound email webhook payload:', payload);

      // We'll need to adapt this depending on whether we use SendGrid, Postmark, etc.
      // E.g. SendGrid sends multipart form data, Postmark sends JSON.
      
      // Let's assume a generic JSON payload for now, e.g. Postmark format
      const fromEmail = payload.From; // e.g. "client@example.com"
      const toEmail = payload.To; // e.g. "update-123@replies.houseforce.com"
      const textBody = payload.TextBody;

      if (!toEmail) {
        return ctx.badRequest('Missing To email');
      }

      // Extract update ID from the To address (update-{id}@...)
      const match = toEmail.match(/update-(\d+)@/);
      if (!match) {
        return ctx.badRequest('Invalid To address format');
      }
      
      const updateId = parseInt(match[1], 10);

      // Find the user who sent it based on the From address
      const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
        filters: { email: fromEmail },
      });

      const clientAuthor = users.length > 0 ? users[0] : null;

      // Create the UpdateMessage
      const newMessage = await strapi.entityService.create('api::update-message.update-message', {
        data: {
          content: textBody,
          authorType: 'client',
          clientAuthor: clientAuthor ? clientAuthor.id : null,
          update: updateId,
          publishedAt: new Date(),
        },
      });

      ctx.send({ success: true, message: 'Message recorded successfully', data: newMessage });
    } catch (error) {
      strapi.log.error('Error processing inbound email:', error);
      ctx.internalServerError('Failed to process email');
    }
  },
};
