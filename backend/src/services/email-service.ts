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
  content?: string;
  date?: string;
  project?: Project;
}

interface UpdateMessage {
  id: number;
  content: string;
  authorType: 'staff' | 'client';
  staffName?: string;
  clientAuthor?: {
    email: string;
    firstname?: string;
    lastname?: string;
  };
  update?: Update;
}

export function getEmailDomain(): string {
  return process.env.EMAIL_DOMAIN || 'replies.houseforce.com';
}

export function getPortalUrl(): string {
  return process.env.PORTAL_URL || 'http://localhost:3001';
}

function escapeHtml(str: string = ''): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatTextToHtml(text: string = ''): string {
  return escapeHtml(text).replace(/\n/g, '<br />');
}

/**
 * Sends notification to clients when a new Project Update is created (via CMS or email)
 */
export async function sendProjectUpdateNotification({
  update,
  project,
  clientEmails,
}: {
  update: Update;
  project: Project;
  clientEmails: string[];
}) {
  if (!clientEmails || clientEmails.length === 0) {
    strapi.log.info('[Email Service] No client emails found for update notification, skipping.');
    return;
  }

  const emailDomain = getEmailDomain();
  const portalUrl = getPortalUrl();
  const projectLink = project.documentId
    ? `${portalUrl}/projects/${project.documentId}`
    : `${portalUrl}/projects`;

  const replyTo = `update-${update.id}@${emailDomain}`;
  const subject = `Project Update: ${project.title} - ${update.title}`;

  const textBody = `${update.title}
Date: ${update.date || new Date().toISOString().split('T')[0]}
Project: ${project.title}

${update.content || ''}

----------------------------------------------------------------------
PHOTOS & ATTACHMENTS:
Project photos, media, and attachments are viewable only via your client portal.
View your project on the portal: ${projectLink}

REPLYING:
You can reply directly to this email to communicate with our team, or reply through your client portal.
----------------------------------------------------------------------`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <!-- Header -->
    <tr>
      <td style="background-color: #0f172a; padding: 24px 32px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.025em;">Houseforce</h1>
        <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 13px;">Project Update Notification</p>
      </td>
    </tr>
    <!-- Main Content -->
    <tr>
      <td style="padding: 32px;">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #0d9488; margin-bottom: 8px;">
          ${escapeHtml(project.title)}
        </div>
        <h2 style="margin: 0 0 16px 0; font-size: 22px; color: #0f172a; font-weight: 700;">
          ${escapeHtml(update.title)}
        </h2>
        <div style="font-size: 13px; color: #64748b; margin-bottom: 24px;">
          ${escapeHtml(update.date || new Date().toISOString().split('T')[0])}
        </div>
        <div style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 32px;">
          ${formatTextToHtml(update.content || '')}
        </div>

        <!-- Call to action button -->
        <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
          <tr>
            <td align="center" style="border-radius: 8px; background-color: #0d9488;">
              <a href="${projectLink}" target="_blank" style="font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; display: inline-block;">
                View Project on Client Portal &rarr;
              </a>
            </td>
          </tr>
        </table>

        <!-- Notice Box (Images viewable only via portal) -->
        <div style="background-color: #f1f5f9; border-left: 4px solid #0d9488; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #0f172a;">
            📷 Photos &amp; Attachments
          </p>
          <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #475569;">
            Project images and documents are hosted securely and viewable only through your <a href="${projectLink}" style="color: #0d9488; text-decoration: underline;">Client Portal</a>.
          </p>
        </div>

        <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin: 0;">
          💬 <strong>To reply:</strong> Simply reply directly to this email, or send a message through your Client Portal.
        </p>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #94a3b8;">
          Houseforce Project Updates &bull; Replies to this email will be added to your project update thread.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  strapi.log.info('[Email Service] Dispatching project update email to clients:', {
    to: clientEmails,
    subject,
    replyTo,
  });

  return strapi.plugin('email').service('email').send({
    to: clientEmails,
    subject,
    text: textBody,
    html: htmlBody,
    replyTo,
  });
}

/**
 * Sends notification when a new message is added to an existing update thread
 */
export async function sendThreadMessageNotification({
  message,
  update,
  project,
  recipientType,
  recipientEmails,
}: {
  message: UpdateMessage;
  update: Update;
  project: Project;
  recipientType: 'client' | 'staff';
  recipientEmails: string[];
}) {
  if (!recipientEmails || recipientEmails.length === 0) {
    strapi.log.info('[Email Service] No recipient emails found for thread message, skipping.');
    return;
  }

  const emailDomain = getEmailDomain();
  const portalUrl = getPortalUrl();
  const projectLink = project.documentId
    ? `${portalUrl}/projects/${project.documentId}`
    : `${portalUrl}/projects`;

  const replyTo = `update-${update.id}@${emailDomain}`;

  if (recipientType === 'client') {
    const staffName = message.staffName || 'Houseforce Staff';
    const subject = `New Message: ${project.title} - ${update.title}`;

    const textBody = `${staffName} added a message to your project update (${update.title}):

${message.content}

----------------------------------------------------------------------
PHOTOS & ATTACHMENTS:
Project photos, media, and attachments are viewable only via your client portal:
${projectLink}

REPLYING:
You can reply directly to this email to respond, or message through your client portal.
----------------------------------------------------------------------`;

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <tr>
      <td style="background-color: #0f172a; padding: 20px 32px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 700;">Houseforce</h1>
        <p style="color: #94a3b8; margin: 2px 0 0 0; font-size: 12px;">New Thread Message</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px;">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #0d9488; margin-bottom: 6px;">
          ${escapeHtml(project.title)} &bull; ${escapeHtml(update.title)}
        </div>
        <div style="font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 16px;">
          Message from ${escapeHtml(staffName)}:
        </div>
        <div style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 28px; background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
          ${formatTextToHtml(message.content)}
        </div>

        <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
          <tr>
            <td align="center" style="border-radius: 8px; background-color: #0d9488;">
              <a href="${projectLink}" target="_blank" style="font-size: 13px; font-weight: 600; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; display: inline-block;">
                View Thread on Portal &rarr;
              </a>
            </td>
          </tr>
        </table>

        <div style="background-color: #f1f5f9; border-left: 4px solid #0d9488; padding: 14px; border-radius: 4px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #475569;">
            📷 <strong>Note:</strong> Photos and attachments are viewable only via your <a href="${projectLink}" style="color: #0d9488; text-decoration: underline;">Client Portal</a>.
          </p>
        </div>

        <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin: 0;">
          💬 Reply directly to this email to continue the conversation.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f8fafc; padding: 16px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #94a3b8;">
          Houseforce Project Thread
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

    strapi.log.info('[Email Service] Dispatching thread reply to clients:', {
      to: recipientEmails,
      subject,
      replyTo,
    });

    return strapi.plugin('email').service('email').send({
      to: recipientEmails,
      subject,
      text: textBody,
      html: htmlBody,
      replyTo,
    });
  } else {
    // Recipient is Staff
    const clientName = message.clientAuthor
      ? `${message.clientAuthor.firstname || ''} ${message.clientAuthor.lastname || ''}`.trim() || message.clientAuthor.email
      : 'Client';

    const subject = `[Client Reply] ${project.title} - ${update.title}`;

    const textBody = `Client (${clientName}) replied to update "${update.title}":

${message.content}

----------------------------------------------------------------------
Reply directly to this email to reply back to the client.
----------------------------------------------------------------------`;

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
    <tr>
      <td style="background-color: #1e293b; padding: 20px 32px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 700;">Client Reply Received</h1>
        <p style="color: #94a3b8; margin: 2px 0 0 0; font-size: 12px;">${escapeHtml(project.title)} &bull; Update #${update.id}</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px;">
        <div style="font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 12px;">
          Reply from ${escapeHtml(clientName)}:
        </div>
        <div style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 24px; background-color: #f1f5f9; padding: 16px; border-radius: 8px;">
          ${formatTextToHtml(message.content)}
        </div>
        <p style="font-size: 13px; color: #0d9488; font-weight: 600; margin: 0;">
          &larr; Reply directly to this email to respond to the client.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

    strapi.log.info('[Email Service] Dispatching client reply notification to staff:', {
      to: recipientEmails,
      subject,
      replyTo,
    });

    return strapi.plugin('email').service('email').send({
      to: recipientEmails,
      subject,
      text: textBody,
      html: htmlBody,
      replyTo,
    });
  }
}
