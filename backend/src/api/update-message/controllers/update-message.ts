import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::update-message.update-message', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state?.user;
    if (!user) return ctx.unauthorized("You must be logged in to view update messages.");

    // Securely lookup which update messages belong to projects this user is linked to
    const allowedMessages = await strapi.db.query('api::update-message.update-message').findMany({
      where: { update: { project: { clients: user.id } } },
      select: ['id'],
    });

    if (!allowedMessages || allowedMessages.length === 0) {
      return {
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageSize: 25,
            pageCount: 0,
            total: 0,
          },
        },
      };
    }

    ctx.query.filters = {
      ...(typeof ctx.query.filters === 'object' ? ctx.query.filters : {}),
      id: { $in: allowedMessages.map((m: any) => m.id) },
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async create(ctx) {
    const intendedUpdateId = ctx.request.body?.data?.update;
    const user = ctx.state?.user;

    // Verify user has access to the target project update before creating
    if (user && intendedUpdateId) {
      const allowedUpdate = await strapi.db.query('api::update.update').findOne({
        where: {
          id: intendedUpdateId,
          project: { clients: user.id },
        },
        select: ['id'],
      });

      if (!allowedUpdate) {
        return ctx.forbidden("You do not have access to post on this project update.");
      }
    }

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
