/**
 * update controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::update.update', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized("You must be logged in to view updates.");

    // Securely lookup which updates belong to projects this user is linked to
    const allowedUpdates = await strapi.db.query('api::update.update').findMany({
      where: { project: { clients: user.id } },
      select: ['id']
    });

    if (!allowedUpdates || allowedUpdates.length === 0) {
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
      id: { $in: allowedUpdates.map(u => u.id) }
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },
  
  async findOne(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized("You must be logged in.");

    const { id: documentId } = ctx.params;
    
    // Check if user has access to this specific update via its parent project
    const hasAccess = await strapi.db.query('api::update.update').findOne({
      where: { documentId: documentId, project: { clients: user.id } },
      select: ['id']
    });

    if (!hasAccess) {
      return ctx.notFound("Update not found or you do not have access.");
    }
    
    return await super.findOne(ctx);
  }
}));
