import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getPreferences(ctx: any) {
    const user = ctx.state?.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to view preferences.');
    }

    const userData = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id: user.id },
      select: [
        'id',
        'email',
        'username',
        'notifyProjectUpdates',
        'notifyUpdateMessages',
        'notifyBlogPosts',
        'hasCompletedNotificationOnboarding',
      ],
    });

    if (!userData) {
      return ctx.notFound('User not found.');
    }

    return {
      data: {
        notifyProjectUpdates: userData.notifyProjectUpdates ?? true,
        notifyUpdateMessages: userData.notifyUpdateMessages ?? true,
        notifyBlogPosts: userData.notifyBlogPosts ?? true,
        hasCompletedNotificationOnboarding: !!userData.hasCompletedNotificationOnboarding,
      },
    };
  },

  async updatePreferences(ctx: any) {
    const user = ctx.state?.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to update preferences.');
    }

    const body = ctx.request?.body?.data || ctx.request?.body || {};
    const {
      notifyProjectUpdates,
      notifyUpdateMessages,
      notifyBlogPosts,
      hasCompletedNotificationOnboarding,
    } = body;

    const dataToUpdate: Record<string, boolean> = {};

    if (typeof notifyProjectUpdates === 'boolean') {
      dataToUpdate.notifyProjectUpdates = notifyProjectUpdates;
    }
    if (typeof notifyUpdateMessages === 'boolean') {
      dataToUpdate.notifyUpdateMessages = notifyUpdateMessages;
    }
    if (typeof notifyBlogPosts === 'boolean') {
      dataToUpdate.notifyBlogPosts = notifyBlogPosts;
    }
    if (typeof hasCompletedNotificationOnboarding === 'boolean') {
      dataToUpdate.hasCompletedNotificationOnboarding = hasCompletedNotificationOnboarding;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return ctx.badRequest('No valid preference fields provided.');
    }

    const updatedUser = await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: user.id },
      data: dataToUpdate,
    });

    return {
      data: {
        notifyProjectUpdates: updatedUser.notifyProjectUpdates ?? true,
        notifyUpdateMessages: updatedUser.notifyUpdateMessages ?? true,
        notifyBlogPosts: updatedUser.notifyBlogPosts ?? true,
        hasCompletedNotificationOnboarding: !!updatedUser.hasCompletedNotificationOnboarding,
      },
    };
  },
});
