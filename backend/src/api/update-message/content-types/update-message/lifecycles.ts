import { sendThreadMessageNotification } from '../../../../services/email-service';

interface Project {
  id: number;
  documentId?: string;
  title: string;
  clients?: Array<{
    id: number;
    email: string;
    firstname?: string;
    lastname?: string;
  }>;
}

interface Update {
  id: number;
  documentId?: string;
  title: string;
  project?: Project;
}

interface UpdateMessagePayload {
  id: number;
  content: string;
  authorType: 'staff' | 'client';
  staffName?: string;
  clientAuthor?: {
    id: number;
    email: string;
    firstname?: string;
    lastname?: string;
  };
  update?: Update;
}

interface AfterCreateEvent {
  result: {
    id: number;
    content: string;
    authorType: 'staff' | 'client';
    staffName?: string;
  };
  params: {
    data: any;
  };
}

export default {
  async afterCreate(event: AfterCreateEvent) {
    const { result, params } = event;
    strapi.log.info('[UpdateMessage Lifecycle] afterCreate triggered for message ID:', result.id, 'authorType:', result.authorType);

    // Extract update ID from params.data (handles flat IDs or Strapi 5 connect syntax)
    let rawUpdate = params?.data?.update;
    let targetUpdateId = typeof rawUpdate === 'object' ? rawUpdate?.connect?.[0]?.id || rawUpdate?.id : rawUpdate;

    try {
      // Fetch the created message with populated relations
      const updateMessage = (await strapi.entityService.findOne(
        'api::update-message.update-message',
        result.id,
        {
          populate: {
            clientAuthor: true,
            update: {
              populate: {
                project: {
                  populate: ['clients'],
                },
              },
            },
          },
        }
      )) as unknown as UpdateMessagePayload;

      // Resolve Update (fallback to targetUpdateId if not populated yet)
      let update = updateMessage?.update;
      if (!update && targetUpdateId) {
        update = (await strapi.entityService.findOne('api::update.update', targetUpdateId, {
          populate: {
            project: {
              populate: ['clients'],
            },
          },
        })) as unknown as Update;
      }

      if (!update) {
        strapi.log.warn(`[UpdateMessage Lifecycle] Message ${result.id} is not linked to any update. Skipping notification.`);
        return;
      }

      const project = update.project;
      if (!project) {
        strapi.log.warn(`[UpdateMessage Lifecycle] Update ${update.id} is not linked to any project. Skipping notification.`);
        return;
      }

      if (result.authorType === 'staff') {
        // Staff replied -> notify Project Clients
        const clientEmails = project.clients?.map((c) => c.email).filter(Boolean) || [];

        if (clientEmails.length > 0) {
          strapi.log.info(`[UpdateMessage Lifecycle] Notifying ${clientEmails.length} client(s) of staff reply on update #${update.id}`);
          await sendThreadMessageNotification({
            message: {
              id: result.id,
              content: result.content,
              authorType: 'staff',
              staffName: result.staffName,
            },
            update,
            project,
            recipientType: 'client',
            recipientEmails: clientEmails,
          });
        } else {
          strapi.log.info(`[UpdateMessage Lifecycle] No clients assigned to project "${project.title}", skipping email.`);
        }
      } else if (result.authorType === 'client') {
        // Client replied (via portal or email) -> notify active Strapi Admin Staff
        const activeAdmins = (await strapi.db.query('admin::user').findMany({
          where: { isActive: true },
        })) as any[];

        const adminEmails = activeAdmins.map((a) => a.email).filter(Boolean);

        if (adminEmails.length > 0) {
          strapi.log.info(`[UpdateMessage Lifecycle] Notifying ${adminEmails.length} admin(s) of client reply on update #${update.id}`);
          await sendThreadMessageNotification({
            message: {
              id: result.id,
              content: result.content,
              authorType: 'client',
              clientAuthor: updateMessage?.clientAuthor,
            },
            update,
            project,
            recipientType: 'staff',
            recipientEmails: adminEmails,
          });
        } else {
          strapi.log.warn('[UpdateMessage Lifecycle] No active admin emails found to notify.');
        }
      }
    } catch (err) {
      strapi.log.error('[UpdateMessage Lifecycle] Error dispatching message notification email:', err);
    }
  },
};
