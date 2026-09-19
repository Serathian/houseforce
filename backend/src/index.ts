import crypto from 'node:crypto';
import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
  register({ strapi }: { strapi: Core.Strapi }) {
    // Unhide provider so it is included in Content Manager API responses and visible to admins
    const userModel = strapi.getModel('plugin::users-permissions.user') as any;
    if (userModel?.config?.attributes?.provider) {
      userModel.config.attributes.provider.hidden = false;
    }
  },

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
          'api::author.author.find',
          'api::author.author.findOne',
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
          'api::user-preference.user-preference.getPreferences',
          'api::user-preference.user-preference.updatePreferences',
          'api::notification.notification.getNotifications',
          'api::notification.notification.markAsRead',
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

      // Lifecycle hook: All real client accounts in HouseForce use Google OAuth.
      // Only the dedicated dev/test seed user (client@example.com) should keep 'local'.
      strapi.db.lifecycles.subscribe({
        models: ['plugin::users-permissions.user'],
        async beforeCreate(event) {
          if (event.params.data) {
            const isDevSeedUser =
              event.params.data.email === 'client@example.com' ||
              (process.env.SEED_CLIENT_EMAIL && event.params.data.email === process.env.SEED_CLIENT_EMAIL);

            if (!isDevSeedUser) {
              event.params.data.provider = 'google';
            } else {
              event.params.data.provider = 'local';
            }

            // If no password provided (e.g. created in CMS without password field),
            // assign a secure random dummy password so the DB column & Strapi model are satisfied.
            if (!event.params.data.password) {
              event.params.data.password = crypto.randomUUID() + '!Aa1';
            }
          }
        },
      });

      // Auto-heal existing portal users: any non-dev user set to 'local' must be 'google'
      try {
        const devEmail = process.env.SEED_CLIENT_EMAIL || 'client@example.com';
        await strapi.db.connection.raw(`
          UPDATE up_users 
          SET provider = 'google' 
          WHERE email != '${devEmail}' AND provider != 'google';
        `);
      } catch (healErr) {
        // Table might not exist yet on initial initialization
      }

      // Configure CMS Content Manager layout for User:
      // 1. In list view: show id, username, email, confirmed, provider for quick overview
      // 2. In edit view: hide password, provider, confirmed, and role so admins only need to enter username & email
      try {
        const userModel = strapi.getModel('plugin::users-permissions.user') as any;
        if (userModel?.config?.attributes?.provider) {
          userModel.config.attributes.provider.hidden = false;
        }

        const userConfigKey = 'plugin_content_manager_configuration_content_types::plugin::users-permissions.user';
        const userConfigEntry = await strapi.db.query('strapi::core-store').findOne({ where: { key: userConfigKey } });
        if (userConfigEntry && userConfigEntry.value) {
          const config = JSON.parse(userConfigEntry.value);

          // List view: ensure provider and confirmed are visible
          if (!config.layouts.list.includes('provider')) {
            config.layouts.list.push('provider');
          }
          if (!config.layouts.list.includes('confirmed')) {
            config.layouts.list.push('confirmed');
          }

          // Edit view: strip fields that are automatically handled by the system
          const fieldsToHide = ['password', 'provider', 'confirmed', 'role'];

          if (Array.isArray(config.layouts?.edit)) {
            config.layouts.edit = config.layouts.edit
              .map((row: any[]) => row.filter((field: any) => !fieldsToHide.includes(field.name)))
              .filter((row: any[]) => row.length > 0);
          }

          // Metadatas: mark automated fields as invisible in edit view
          for (const field of fieldsToHide) {
            if (config.metadatas?.[field]?.edit) {
              config.metadatas[field].edit.visible = false;
            }
          }

          await strapi.db.query('strapi::core-store').update({
            where: { key: userConfigKey },
            data: { value: JSON.stringify(config) },
          });
        }
      } catch (confErr) {
        console.warn('[Strapi Bootstrap] Failed to update User CMS layout:', confErr);
      }

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

        // 4. Ensure demo projects, updates, and messages exist and are linked to test client
        const demoProjects = [
          {
            title: 'Modern Villa Renovation',
            address: '123 Ocean Drive, Camps Bay',
            projectStatus: 'in-progress',
            updates: [
              {
                title: 'Foundation & Ground Floor Framing Completed',
                content: 'The ground floor concrete foundation has cured completely, and structural steel framing is installed and signed off by the city engineer.',
                date: '2026-09-01',
                messages: [
                  { authorType: 'staff' as const, staffName: 'Houseforce Staff', content: 'City building inspection signed off this morning with no defects.' },
                  { authorType: 'client' as const, content: 'Excited to see this milestone reached! When do the exterior walls begin?' },
                  { authorType: 'staff' as const, staffName: 'Houseforce Staff', content: 'Masonry work begins first thing Monday morning.' },
                ],
              },
              {
                title: 'Roof Trusses & Weatherproofing',
                content: 'Roof trusses are fully erected and waterproof underlay membrane has been laid across all sections ahead of tile installation.',
                date: '2026-09-08',
                messages: [
                  { authorType: 'staff' as const, staffName: 'Houseforce Staff', content: 'All skylight openings are flashed and sealed against weather.' },
                ],
              },
            ],
          },
          {
            title: 'Luxury Penthouse Remodel',
            address: '45 Marina Boulevard, Waterfront',
            projectStatus: 'planning',
            updates: [
              {
                title: 'Architectural Plans & Permitting',
                content: 'Final architectural drawings and interior layouts submitted to the body corporate and municipal council for approval.',
                date: '2026-09-10',
                messages: [
                  { authorType: 'client' as const, content: 'Have the expanded master suite revisions been included in the submission?' },
                  { authorType: 'staff' as const, staffName: 'Houseforce Staff', content: 'Yes, the enlarged master suite and open kitchen layouts are fully included.' },
                ],
              },
            ],
          },
          {
            title: 'Garden Studio & Pool Pavilion',
            address: '18 Sunset Ridge, Constantia',
            projectStatus: 'completed',
            updates: [
              {
                title: 'Final Handover & Compliance Sign-Off',
                content: 'All snag list items have been addressed, electrical compliance certificates issued, and keys handed over to the homeowner.',
                date: '2026-08-28',
                messages: [
                  { authorType: 'staff' as const, staffName: 'Houseforce Staff', content: 'Thank you for working with Houseforce! Compliance certificates have been emailed.' },
                  { authorType: 'client' as const, content: 'The pavilion looks absolutely incredible. Thank you to the whole Houseforce team!' },
                ],
              },
            ],
          },
        ];

        for (const demo of demoProjects) {
          const existing = await strapi.db.query('api::project.project').findOne({
            where: { title: demo.title },
          });

          if (!existing) {
            const newProject = await strapi.entityService.create('api::project.project', {
              data: {
                title: demo.title,
                address: demo.address,
                projectStatus: demo.projectStatus as any,
                publishedAt: new Date(),
                clients: testClient ? ([testClient.id] as any) : undefined,
              },
            });
            console.log(`[Strapi Bootstrap] Seeded project: "${demo.title}" (#${newProject.id})`);

            for (const upd of demo.updates) {
              const createdUpdate = await strapi.entityService.create('api::update.update', {
                data: {
                  title: upd.title,
                  content: upd.content,
                  date: upd.date,
                  project: newProject.id,
                  publishedAt: new Date(),
                  clientNotified: true,
                },
              });

              for (const msg of upd.messages) {
                await strapi.entityService.create('api::update-message.update-message', {
                  data: {
                    content: msg.content,
                    authorType: msg.authorType,
                    staffName: msg.authorType === 'staff' ? msg.staffName : undefined,
                    clientAuthor: msg.authorType === 'client' && testClient ? testClient.id : undefined,
                    update: createdUpdate.id,
                  },
                });
              }
            }
          }
        }

        // Ensure test client is linked across ALL existing project records in the database
        if (testClient) {
          const allProjects = (await strapi.db.query('api::project.project').findMany({
            populate: ['clients'],
          })) as any[];

          for (const project of allProjects) {
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

        // 5. Ensure all messages are linked to both draft and published update versions
        try {
          await strapi.db.connection.raw(`
            INSERT INTO update_messages_update_lnk (update_message_id, update_id, update_message_ord)
            SELECT DISTINCT 
              lnk.update_message_id,
              all_u.id as update_id,
              lnk.update_message_ord
            FROM update_messages_update_lnk lnk
            JOIN updates curr_u ON curr_u.id = lnk.update_id
            JOIN updates all_u ON all_u.document_id = curr_u.document_id
            WHERE NOT EXISTS (
              SELECT 1 FROM update_messages_update_lnk existing
              WHERE existing.update_message_id = lnk.update_message_id
                AND existing.update_id = all_u.id
            );
          `);
        } catch (syncErr) {
          console.warn('[Strapi Bootstrap] Failed to sync message-update links:', syncErr);
        }

        // 6. Configure Strapi CMS Content Manager layouts for Update Messages & Updates
        try {
          const msgConfigKey = 'plugin_content_manager_configuration_content_types::api::update-message.update-message';
          const msgConfigEntry = await strapi.db.query('strapi::core-store').findOne({ where: { key: msgConfigKey } });
          if (msgConfigEntry && msgConfigEntry.value) {
            const config = JSON.parse(msgConfigEntry.value);
            config.settings.mainField = 'content';
            config.settings.defaultSortBy = 'id';
            config.settings.defaultSortOrder = 'DESC';
            if (!config.layouts.list.includes('update')) {
              config.layouts.list = ['id', 'content', 'authorType', 'update', 'staffName'];
            }
            await strapi.db.query('strapi::core-store').update({
              where: { key: msgConfigKey },
              data: { value: JSON.stringify(config) },
            });
          }

          const updConfigKey = 'plugin_content_manager_configuration_content_types::api::update.update';
          const updConfigEntry = await strapi.db.query('strapi::core-store').findOne({ where: { key: updConfigKey } });
          if (updConfigEntry && updConfigEntry.value) {
            const config = JSON.parse(updConfigEntry.value);
            if (config.metadatas?.messages?.edit) {
              config.metadatas.messages.edit.mainField = 'content';
            }
            await strapi.db.query('strapi::core-store').update({
              where: { key: updConfigKey },
              data: { value: JSON.stringify(config) },
            });
          }
        } catch (confErr) {
          console.warn('[Strapi Bootstrap] Failed to update CMS content manager layouts:', confErr);
        }
      }

    } catch (err) {
      console.error('[Strapi Bootstrap] Failed to set public permissions:', err);
    }
  },
};

