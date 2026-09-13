import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::update-message.update-message', ({ strapi }) => ({
  async create(ctx) {
    const intendedUpdateId = ctx.request.body?.data?.update;
    const user = ctx.state?.user;

    // Attach client author if authenticated user
    if (user) {
      ctx.request.body = ctx.request.body || {};
      ctx.request.body.data = ctx.request.body.data || {};
      ctx.request.body.data.clientAuthor = user.id;
      ctx.request.body.data.authorType = 'client';
    }

    const response = await super.create(ctx);

    try {
      const message = response.data;

      // Force-link relation if stripped by REST permissions
      if (intendedUpdateId && message?.documentId) {
        await strapi.documents('api::update-message.update-message').update({
          documentId: message.documentId,
          data: {
            update: intendedUpdateId,
          },
        });
        strapi.log.info(`[UpdateMessage Controller] Linked message ${message.documentId} to update ${intendedUpdateId}`);
      }
    } catch (err) {
      strapi.log.error('[UpdateMessage Controller] Error force-linking relation:', err);
    }

    return response;
  },
}));
