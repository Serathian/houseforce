import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });

      if (publicRole) {
        const actions = [
          'api::post.post.find',
          'api::post.post.findOne',
          'api::category.category.find',
          'api::category.category.findOne',
        ];

        for (const action of actions) {
          const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
            where: {
              action,
              role: publicRole.id,
            },
          });

          if (!existing) {
            await strapi.db.query('plugin::users-permissions.permission').create({
              data: {
                action,
                role: publicRole.id,
              },
            });
            console.log(`[Strapi Bootstrap] Granted public access for action: ${action}`);
          }
        }
      }

      // Auto-grant Authenticated users the ability to read Projects and Updates
      const authRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' },
      });

      if (authRole) {
        const authActions = [
          'api::project.project.find',
          'api::project.project.findOne',
          'api::update.update.find',
          'api::update.update.findOne',
          'api::update-message.update-message.create',
          'api::update-message.update-message.find',
        ];

        for (const action of authActions) {
          const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
            where: { action, role: authRole.id },
          });

          if (!existing) {
            await strapi.db.query('plugin::users-permissions.permission').create({
              data: { action, role: authRole.id },
            });
            console.log(`[Strapi Bootstrap] Granted authenticated access for action: ${action}`);
          }
        }
      }

      // Add Lifecycle hook to default provider to 'google' for new users created in Admin Panel
      strapi.db.lifecycles.subscribe({
        models: ['plugin::users-permissions.user'],
        async beforeCreate(event) {
          if (event.params.data) {
            event.params.data.provider = event.params.data.provider || 'google';
          }
        },
      });

      // Seed test data if requested (e.g. CI/CD or local Docker stack)
      if (process.env.SEED_TEST_DATA === 'true') {
        const staffEmail = process.env.SEED_ADMIN_EMAIL || 'staff@houseforce.com';
        const staffPassword = process.env.SEED_ADMIN_PASSWORD || 'AdminPassword123!';
        const clientEmail = process.env.SEED_CLIENT_EMAIL || 'client@example.com';
        const clientPassword = process.env.SEED_CLIENT_PASSWORD || 'password123';

        // 1. Enable local email authentication provider if disabled
        try {
          const pluginStore = strapi.store({ type: 'plugin', name: 'users-permissions' });
          const grant = (await pluginStore.get({ key: 'grant' })) as any;
          if (grant && grant.email && !grant.email.enabled) {
            grant.email.enabled = true;
            await pluginStore.set({ key: 'grant', value: grant });
            console.log('[Strapi Bootstrap] Enabled local email auth provider');
          }
        } catch (storeErr) {
          console.warn('[Strapi Bootstrap] Failed to enable email provider:', storeErr);
        }

        // 2. Ensure Super Admin user exists
        let adminUser = await strapi.db.query('admin::user').findOne({
          where: { email: staffEmail },
        });

        if (!adminUser) {
          const superAdminRole = await strapi.db.query('admin::role').findOne({
            where: { code: 'strapi-super-admin' },
          });

          const hashedPassword = await (strapi.service('admin::auth') as any).hashPassword(staffPassword);
          adminUser = await strapi.db.query('admin::user').create({
            data: {
              email: staffEmail,
              firstname: 'Houseforce',
              lastname: 'Staff',
              username: 'staff',
              password: hashedPassword,
              isActive: true,
              roles: superAdminRole ? [superAdminRole.id] : [],
            },
          });
          console.log(`[Strapi Bootstrap] Seeded admin staff user: ${staffEmail}`);
        }

        // 3. Ensure Client user exists with local provider password
        let testClient = await strapi.db.query('plugin::users-permissions.user').findOne({
          where: { email: clientEmail },
        });

        if (!testClient) {
          testClient = await strapi.plugin('users-permissions').service('user').add({
            email: clientEmail,
            username: clientEmail,
            password: clientPassword,
            confirmed: true,
            provider: 'local',
            role: authRole?.id,
          });
          console.log(`[Strapi Bootstrap] Seeded client user: ${clientEmail}`);
        }

        // 4. Ensure projects exist and are linked to the test client
        const existingProjects = (await strapi.db.query('api::project.project').findMany({
          populate: ['clients'],
        })) as any[];

        if (!existingProjects || existingProjects.length === 0) {
          const newProject = await strapi.entityService.create('api::project.project', {
            data: {
              title: 'Modern Villa Renovation',
              address: '123 Ocean Drive',
              projectStatus: 'in-progress',
              publishedAt: new Date(),
              clients: testClient ? ([testClient.id] as any) : undefined,
            },
          });
          console.log(`[Strapi Bootstrap] Seeded test project: #${newProject.id}`);
        } else if (testClient) {
          for (const project of existingProjects) {
            const hasClient = project.clients?.some((c: any) => c.id === testClient.id);
            if (!hasClient) {
              const currentClientIds = project.clients?.map((c: any) => c.id) || [];
              await strapi.db.query('api::project.project').update({
                where: { id: project.id },
                data: {
                  clients: [...currentClientIds, testClient.id],
                },
              });
              console.log(`[Strapi Bootstrap] Linked client ${testClient.id} to project #${project.id}`);
            }
          }
        }
      }

    } catch (err) {
      console.error('[Strapi Bootstrap] Failed to set public permissions:', err);
    }
  },
};

