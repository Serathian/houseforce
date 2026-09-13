import { sendProjectUpdateNotification } from '../../../../services/email-service';

interface PopulatedUpdate {
  id: number;
  documentId?: string;
  title: string;
  content?: string;
  date?: string;
  publishedAt?: string | Date | null;
  clientNotified?: boolean;
  project?: {
    id: number;
    documentId?: string;
    title: string;
    clients?: Array<{
      id: number;
      email: string;
    }>;
  };
}

async function handleUpdateNotification(updateId: number) {
  try {
    const update = (await strapi.entityService.findOne('api::update.update', updateId, {
      populate: {
        project: {
          populate: ['clients'],
        },
      },
    })) as unknown as PopulatedUpdate;

    if (!update) return;

    // Only notify if published and not already notified
    if (!update.publishedAt || update.clientNotified) {
      return;
    }

    const project = update.project;
    if (!project) {
      strapi.log.info(`[Update Lifecycle] Update ${updateId} has no associated project, skipping notification.`);
      return;
    }

    const clientEmails = project.clients?.map((c) => c.email).filter(Boolean) || [];

    // Mark as notified in DB first to prevent race condition / duplicate triggers
    await strapi.db.query('api::update.update').update({
      where: { id: updateId },
      data: { clientNotified: true },
    });

    if (clientEmails.length > 0) {
      strapi.log.info(`[Update Lifecycle] Sending notification for update ${update.id} to ${clientEmails.length} client(s)`);
      await sendProjectUpdateNotification({
        update,
        project,
        clientEmails,
      });
    } else {
      strapi.log.info(`[Update Lifecycle] No clients assigned to project "${project.title}", skipping email.`);
    }
  } catch (error) {
    strapi.log.error('[Update Lifecycle] Error notifying clients for update:', error);
  }
}

export default {
  async afterCreate(event: { result: { id: number; publishedAt?: any; clientNotified?: boolean } }) {
    if (event.result?.publishedAt && !event.result?.clientNotified) {
      await handleUpdateNotification(event.result.id);
    }
  },

  async afterUpdate(event: { result: { id: number; publishedAt?: any; clientNotified?: boolean } }) {
    if (event.result?.publishedAt && !event.result?.clientNotified) {
      await handleUpdateNotification(event.result.id);
    }
  },
};
