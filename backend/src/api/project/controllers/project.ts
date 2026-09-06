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

    // Enforce data scoping: Only return projects where this user is in the clients list
    ctx.query.filters = {
      ...(typeof ctx.query.filters === 'object' ? ctx.query.filters : {}),
      clients: {
        id: {
          $eq: user.id
        }
      }
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },
  
  async findOne(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized("You must be logged in.");

    ctx.query.filters = {
      ...(typeof ctx.query.filters === 'object' ? ctx.query.filters : {}),
      clients: {
        id: {
          $eq: user.id
        }
      }
    };
    
    return await super.findOne(ctx);
  }
}));
