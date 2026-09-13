import type { Core } from '@strapi/strapi';

export interface PortalNotification {
  id: string; // e.g. "update-12" or "message-45"
  type: 'project_update' | 'update_message';
  title: string;
  snippet: string;
  projectId: number;
  projectDocumentId: string;
  projectTitle: string;
  updateId: number;
  updateDocumentId?: string;
  updateTitle?: string;
  messageId?: number;
  authorName?: string;
  createdAt: string;
  read: boolean;
}

function makeSnippet(content?: string, maxLength = 140): string {
  if (!content) return '';
  const clean = content
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[#*`_~>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength).trimEnd() + '...';
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getNotifications(ctx: any) {
    const user = ctx.state?.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to view notifications.');
    }

    // 1. Get projects assigned to user
    const projects = (await strapi.db.query('api::project.project').findMany({
      where: { clients: user.id },
      select: ['id', 'documentId', 'title'],
    })) as any[];

    if (!projects || projects.length === 0) {
      return {
        data: {
          notifications: [],
          unreadCount: 0,
          unreadByProject: {},
        },
      };
    }

    // Map projects by id
    const projectMap = new Map<number, { id: number; documentId: string; title: string }>();
    for (const p of projects) {
      projectMap.set(p.id, p);
    }
    const projectIds = projects.map((p) => p.id);

    // 2. Fetch user's readNotificationIds
    const userData = (await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id: user.id },
      select: ['id', 'readNotificationIds'],
    })) as any;

    const readSet = new Set<string>(
      Array.isArray(userData?.readNotificationIds) ? userData.readNotificationIds : []
    );

    // 3. Find all published updates for these projects
    const updates = (await strapi.db.query('api::update.update').findMany({
      where: {
        project: { id: { $in: projectIds } },
        publishedAt: { $notNull: true },
      },
      populate: {
        project: {
          select: ['id', 'documentId', 'title'],
        },
        messages: {
          select: ['id', 'content', 'authorType', 'staffName', 'createdAt'],
        },
      },
      orderBy: { createdAt: 'desc' },
    })) as any[];

    const notifications: PortalNotification[] = [];

    for (const update of updates || []) {
      const proj = update.project || projectMap.get(update.project?.id);
      const projectId = proj?.id || update.project?.id;
      const projectDocumentId = proj?.documentId || '';
      const projectTitle = proj?.title || 'Project';

      // Notification for the update itself
      const updateNotifId = `update-${update.id}`;
      notifications.push({
        id: updateNotifId,
        type: 'project_update',
        title: update.title,
        snippet: makeSnippet(update.content),
        projectId,
        projectDocumentId,
        projectTitle,
        updateId: update.id,
        updateDocumentId: update.documentId,
        createdAt: update.createdAt || update.date || new Date().toISOString(),
        read: readSet.has(updateNotifId),
      });

      // Notifications for staff messages in this update
      if (Array.isArray(update.messages)) {
        for (const msg of update.messages) {
          if (msg.authorType === 'staff') {
            const msgNotifId = `message-${msg.id}`;
            notifications.push({
              id: msgNotifId,
              type: 'update_message',
              title: `New reply from ${msg.staffName || 'Staff'}`,
              snippet: makeSnippet(msg.content),
              projectId,
              projectDocumentId,
              projectTitle,
              updateId: update.id,
              updateDocumentId: update.documentId,
              updateTitle: update.title,
              messageId: msg.id,
              authorName: msg.staffName || 'Staff',
              createdAt: msg.createdAt || new Date().toISOString(),
              read: readSet.has(msgNotifId),
            });
          }
        }
      }
    }

    // Sort newest first
    notifications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Calculate unread count & per-project unread count
    let unreadCount = 0;
    const unreadByProject: Record<string, number> = {};

    for (const notif of notifications) {
      if (!notif.read) {
        unreadCount++;
        if (notif.projectDocumentId) {
          unreadByProject[notif.projectDocumentId] =
            (unreadByProject[notif.projectDocumentId] || 0) + 1;
        }
      }
    }

    return {
      data: {
        notifications,
        unreadCount,
        unreadByProject,
      },
    };
  },

  async markAsRead(ctx: any) {
    const user = ctx.state?.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to update notifications.');
    }

    const body = ctx.request?.body?.data || ctx.request?.body || {};
    const { notificationIds, all, projectDocumentId, projectId, unmarkIds } = body;

    const userData = (await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id: user.id },
      select: ['id', 'readNotificationIds'],
    })) as any;

    const currentRead = new Set<string>(
      Array.isArray(userData?.readNotificationIds) ? userData.readNotificationIds : []
    );

    if (Array.isArray(unmarkIds)) {
      for (const id of unmarkIds) {
        currentRead.delete(id);
      }
    }

    if (all) {
      // Find all user's project updates & messages to mark all as read
      const projects = (await strapi.db.query('api::project.project').findMany({
        where: { clients: user.id },
        select: ['id'],
      })) as any[];

      const projectIds = projects?.map((p) => p.id) || [];
      if (projectIds.length > 0) {
        const updates = (await strapi.db.query('api::update.update').findMany({
          where: {
            project: { id: { $in: projectIds } },
            publishedAt: { $notNull: true },
          },
          populate: {
            messages: { select: ['id', 'authorType'] },
          },
        })) as any[];

        for (const u of updates || []) {
          currentRead.add(`update-${u.id}`);
          if (Array.isArray(u.messages)) {
            for (const m of u.messages) {
              if (m.authorType === 'staff') {
                currentRead.add(`message-${m.id}`);
              }
            }
          }
        }
      }
    } else if (projectDocumentId || projectId) {
      // Mark all notifications for a specific project as read
      const projectWhere: any = { clients: user.id };
      if (projectDocumentId) projectWhere.documentId = projectDocumentId;
      if (projectId) projectWhere.id = projectId;

      const project = (await strapi.db.query('api::project.project').findOne({
        where: projectWhere,
        select: ['id', 'documentId'],
      })) as any;

      if (project) {
        const updates = (await strapi.db.query('api::update.update').findMany({
          where: {
            project: { id: project.id },
            publishedAt: { $notNull: true },
          },
          populate: {
            messages: { select: ['id', 'authorType'] },
          },
        })) as any[];

        for (const u of updates || []) {
          currentRead.add(`update-${u.id}`);
          if (Array.isArray(u.messages)) {
            for (const m of u.messages) {
              if (m.authorType === 'staff') {
                currentRead.add(`message-${m.id}`);
              }
            }
          }
        }
      }
    } else if (Array.isArray(notificationIds)) {
      for (const id of notificationIds) {
        if (typeof id === 'string') {
          currentRead.add(id);
        }
      }
    }

    // Keep read list bounded (e.g. latest 1000 items)
    const updatedArray = Array.from(currentRead).slice(-1000);

    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: user.id },
      data: { readNotificationIds: updatedArray },
    });

    return {
      data: {
        success: true,
        readCount: updatedArray.length,
      },
    };
  },
});
