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

      // Seed test data if requested (e.g. CI/CD or local test runs)
      if (process.env.SEED_TEST_DATA === 'true') {
        const staffEmail = 'staff@houseforce.com';
        const clientEmail = 'client@example.com';

        const existingAdmin = await strapi.db.query('admin::user').findOne({
          where: { email: staffEmail },
        });

        if (!existingAdmin) {
          await strapi.db.query('admin::user').create({
            data: {
              email: staffEmail,
              firstname: 'John',
              lastname: 'Staff',
              isActive: true,
            },
          });
          console.log(`[Strapi Bootstrap] Seeded test admin staff: ${staffEmail}`);
        }

        let testClient = await strapi.db.query('plugin::users-permissions.user').findOne({
          where: { email: clientEmail },
        });

        if (!testClient) {
          testClient = await strapi.plugin('users-permissions').service('user').add({
            email: clientEmail,
            username: clientEmail,
            password: 'password123',
            confirmed: true,
            provider: 'local',
            role: authRole?.id,
          });
          console.log(`[Strapi Bootstrap] Seeded test client user: ${clientEmail}`);
        }

        const existingProjects = await strapi.entityService.findMany('api::project.project');
        if (!existingProjects || existingProjects.length === 0) {
          const newProject = await strapi.entityService.create('api::project.project', {
            data: {
              title: 'Modern Villa Renovation',
              projectStatus: 'in-progress',
              publishedAt: new Date(),
              clients: testClient ? ([testClient.id] as any) : undefined,
            },
          });
          console.log(`[Strapi Bootstrap] Seeded test project: #${newProject.id}`);
        }
      }

    } catch (err) {
      console.error('[Strapi Bootstrap] Failed to set public permissions:', err);
    }
  },
};

