import crypto from 'node:crypto';

export default (plugin: any) => {
  // Override Content Manager User controller
  if (plugin.controllers?.contentmanageruser?.create) {
    const originalContentManagerCreate = plugin.controllers.contentmanageruser.create;

    plugin.controllers.contentmanageruser.create = async (ctx: any) => {
      const body = ctx.request.body;
      if (body) {
        // 1. Auto-generate dummy password if omitted
        if (!body.password) {
          body.password = crypto.randomUUID() + '!Aa1';
        }

        // 2. Auto-default confirmed to true for invited clients
        if (body.confirmed === undefined) {
          body.confirmed = true;
        }

        // 3. Auto-default role to 'Authenticated' if omitted
        if (!body.role) {
          const authRole = await strapi.db
            .query('plugin::users-permissions.role')
            .findOne({ where: { type: 'authenticated' } });

          if (authRole) {
            body.role = { connect: [{ id: authRole.id }] };
          }
        }
      }
      return originalContentManagerCreate(ctx);
    };
  }

  // Override standard Content API User controller
  if (plugin.controllers?.user?.create) {
    const originalUserCreate = plugin.controllers.user.create;

    plugin.controllers.user.create = async (ctx: any) => {
      const body = ctx.request.body;
      if (body) {
        if (!body.password) {
          body.password = crypto.randomUUID() + '!Aa1';
        }
        if (body.confirmed === undefined) {
          body.confirmed = true;
        }
      }
      return originalUserCreate(ctx);
    };
  }

  // Extend providers service: defer provider from the sign-in method!
  // If an admin pre-created a client by email, automatically link their account
  // to the OAuth provider (e.g. Google) on their first successful sign-in.
  if (plugin.services?.providers) {
    const originalProvidersService = plugin.services.providers;

    plugin.services.providers = ({ strapi }: any) => {
      const service = originalProvidersService({ strapi });
      const originalConnect = service.connect;

      service.connect = async (provider: string, query: any) => {
        const accessToken = query.access_token || query.code || query.oauth_token;
        if (accessToken) {
          try {
            const providers = await strapi
              .store({ type: 'plugin', name: 'users-permissions', key: 'grant' })
              .get();

            const profile = await strapi
              .plugin('users-permissions')
              .service('providers-registry')
              .run({ provider, query, accessToken, providers });

            if (profile?.email) {
              const email = profile.email.toLowerCase();
              const existingUsers = await strapi.db
                .query('plugin::users-permissions.user')
                .findMany({ where: { email } });

              const exactMatch = existingUsers.find((u: any) => u.provider === provider);
              if (!exactMatch && existingUsers.length > 0) {
                // Pre-created user found! Adopt provider and confirm account dynamically:
                const userToLink = existingUsers[0];
                await strapi.db.query('plugin::users-permissions.user').update({
                  where: { id: userToLink.id },
                  data: {
                    provider,
                    confirmed: true,
                  },
                });
              }
            }
          } catch {
            // Fall through to standard connect if profile lookup fails
          }
        }

        return originalConnect(provider, query);
      };

      return service;
    };
  }

  return plugin;
};
