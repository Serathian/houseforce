import type { Context } from 'koa';

interface PostmarkInboundPayload {
  From: string;
  To: string;
  Subject?: string;
  TextBody?: string;
  HtmlBody?: string;
  StrippedTextReply?: string;
}

interface StrapiAdminUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  isActive: boolean;
}

interface StrapiAppUser {
  id: number;
  email: string;
}

function extractEmailAddress(raw: string = ''): string {
  const match = raw.match(/<([^>]+)>/);
  return (match ? match[1] : raw).trim().toLowerCase();
}

export default {
  async receive(ctx: Context) {
    try {
      const payload = ctx.request.body as PostmarkInboundPayload;
      strapi.log.info('[Inbound Email Webhook] Received incoming email webhook');

      if (!payload || !payload.To) {
        return ctx.badRequest('Missing To email address in payload');
      }

      const rawFrom = payload.From || '';
      const fromEmail = extractEmailAddress(rawFrom);
      const toAddress = payload.To;
      const subject = payload.Subject || 'Project Update';

      // Postmark StrippedTextReply removes previous quoted thread and signatures
      const textBody = (payload.StrippedTextReply || payload.TextBody || '').trim();

      if (!textBody) {
        strapi.log.warn(`[Inbound Email Webhook] Empty email body received from ${fromEmail}`);
        return ctx.badRequest('Email body is empty');
      }

      // Check sender role (Staff admin vs Client user)
      const admins = (await strapi.db.query('admin::user').findMany({
        where: { email: fromEmail },
      })) as unknown as StrapiAdminUser[];

      const clients = (await strapi.entityService.findMany('plugin::users-permissions.user', {
        filters: { email: fromEmail },
      })) as unknown as StrapiAppUser[];

      const isStaff = admins && admins.length > 0 && admins[0].isActive;
      const isClient = clients && clients.length > 0;

      strapi.log.info(`[Inbound Email Webhook] Sender: ${fromEmail} (isStaff: ${!!isStaff}, isClient: ${!!isClient})`);

      // Match destination routing
      const projectMatch = toAddress.match(/project-(\d+)@/i);
      const updateMatch = toAddress.match(/update-(\d+)@/i);

      // =========================================================================
      // SCENARIO A: NEW PROJECT UPDATE (project-[id]@replies.houseforce.com)
      // =========================================================================
      if (projectMatch) {
        if (!isStaff) {
          strapi.log.warn(`[Inbound Email Webhook] Unauthorized attempt to create update on project from non-staff email: ${fromEmail}`);
          return ctx.forbidden('Only authorized staff can create project updates via email.');
        }

        const projectId = parseInt(projectMatch[1], 10);

        // Verify project exists
        const project = await strapi.entityService.findOne('api::project.project', projectId, {
          populate: ['clients'],
        });

        if (!project) {
          strapi.log.warn(`[Inbound Email Webhook] Project with ID ${projectId} not found.`);
          return ctx.notFound(`Project #${projectId} does not exist.`);
        }

        // Clean subject line (remove any chained Re:, Fwd:, etc.)
        const cleanSubject = subject.replace(/^((re|fwd|fw):\s*)+/i, '').trim() || 'Project Update';

        // Create the new Update (published immediately)
        // Notice: The lifecycle hook in api::update.update will automatically detect publishedAt
        // and notify all project clients with the standardized template!
        const newUpdate = (await strapi.entityService.create('api::update.update', {
          data: {
            title: cleanSubject,
            content: textBody,
            date: new Date().toISOString().split('T')[0],
            project: projectId,
            publishedAt: new Date(),
            clientNotified: false,
          },
          populate: { project: { populate: ['clients'] } },
        })) as any;

        strapi.log.info(`[Inbound Email Webhook] Successfully created Project Update #${newUpdate.id} for Project #${projectId}`);
        return ctx.send({ success: true, message: 'Project update created', data: { updateId: newUpdate.id } });
      }

      // =========================================================================
      // SCENARIO B: REPLY TO EXISTING THREAD (update-[id]@replies.houseforce.com)
      // =========================================================================
      if (updateMatch) {
        const updateId = parseInt(updateMatch[1], 10);

        // Verify update exists
        const update = await strapi.entityService.findOne('api::update.update', updateId, {
          populate: { project: true },
        });

        if (!update) {
          strapi.log.warn(`[Inbound Email Webhook] Update with ID ${updateId} not found.`);
          return ctx.notFound(`Update #${updateId} does not exist.`);
        }

        let authorType: 'staff' | 'client' = 'client';
        let clientAuthorId: number | undefined = undefined;
        let staffName: string | undefined = undefined;

        if (isStaff) {
          authorType = 'staff';
          staffName = `${admins[0].firstname || ''} ${admins[0].lastname || ''}`.trim() || 'Staff';
        } else if (isClient) {
          authorType = 'client';
          clientAuthorId = clients[0].id;
        } else {
          // If sender is neither staff nor an existing registered client, record as client with email in note
          authorType = 'client';
          strapi.log.info(`[Inbound Email Webhook] Unregistered sender ${fromEmail} replying to update #${updateId}`);
        }

        // Create the UpdateMessage
        // Notice: The lifecycle hook in api::update-message.update-message will automatically
        // notify the opposite party (clients if staff, or active admins if client)!
        const newMessage = (await strapi.entityService.create('api::update-message.update-message', {
          data: {
            content: textBody,
            authorType,
            clientAuthor: clientAuthorId,
            staffName,
            update: updateId,
            publishedAt: new Date(),
          },
        })) as any;

        strapi.log.info(`[Inbound Email Webhook] Successfully recorded message #${newMessage.id} on Update #${updateId}`);
        return ctx.send({ success: true, message: 'Thread reply recorded successfully', data: { messageId: newMessage.id } });
      }

      return ctx.badRequest('Invalid To address format. Expected project-{id}@ or update-{id}@');
    } catch (error) {
      strapi.log.error('[Inbound Email Webhook] Error processing inbound email:', error);
      ctx.internalServerError('Failed to process incoming email');
    }
  },
};
