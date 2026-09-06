/**
 * update controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::update.update', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized("You must be logged in to view updates.");

    // Enforce data scoping: Deep filtering through the project relation
    ctx.query.filters = {
      ...(typeof ctx.query.filters === 'object' ? ctx.query.filters : {}),
      project: {
        clients: {
          id: {
            $eq: user.id
          }
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
      project: {
        clients: {
          id: {
            $eq: user.id
          }
        }
      }
    };
    
    return await super.findOne(ctx);
  }
}));
