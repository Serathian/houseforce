import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::update-message.update-message', ({ strapi }) => ({
  async create(ctx) {
    const intendedUpdateId = ctx.request.body?.data?.update;
    const user = ctx.state?.user;

    // Attach client author if authenticated user
    if (user) {
      ctx.request.body = ctx.request.body || {};
      ctx.request.body.data = ctx.request.body.data || {};
      ctx.request.body.data.authorType = 'client';
      delete ctx.request.body.data.clientAuthor;
    }

    const response = await super.create(ctx);

    try {
      const message = response.data;

      // Force-link relations if stripped or restricted by REST permissions
      if (message?.documentId) {
        const updateData: any = {};
        if (intendedUpdateId) {
          updateData.update = intendedUpdateId;
        }
        if (user) {
          updateData.clientAuthor = user.id;
        }

        if (Object.keys(updateData).length > 0) {
          await strapi.documents('api::update-message.update-message').update({
            documentId: message.documentId,
            data: updateData,
          });
          strapi.log.info(`[UpdateMessage Controller] Linked relations for message ${message.documentId}`);
        }
      }
    } catch (err) {
      strapi.log.error('[UpdateMessage Controller] Error force-linking relation:', err);
    }

    return response;
  },
}));
