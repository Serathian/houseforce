/**
 * project controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::project.project', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("You must be logged in to view projects.");
    }

    // Securely lookup which projects this user belongs to via internal DB
    const allowedProjects = await strapi.db.query('api::project.project').findMany({
      where: { clients: user.id },
      select: ['id']
    });
    
    // Inject the allowed IDs into the REST query, completely avoiding relational filter errors
    ctx.query.filters = {
      ...(typeof ctx.query.filters === 'object' ? ctx.query.filters : {}),
      id: { $in: allowedProjects.map(p => p.id) }
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },
  
  async findOne(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized("You must be logged in.");
    
    // Check if user has access to this specific project
    const { id: documentId } = ctx.params;
    
    const hasAccess = await strapi.db.query('api::project.project').findOne({
      where: { documentId: documentId, clients: user.id },
      select: ['id']
    });

    if (!hasAccess) {
      return ctx.notFound("Project not found or you do not have access.");
    }
    
    // If access is granted, let the standard core controller fetch and populate it normally
    return await super.findOne(ctx);
  }
}));
