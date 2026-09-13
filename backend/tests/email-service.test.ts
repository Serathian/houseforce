import test from 'node:test';
import assert from 'node:assert';
import { createMockStrapi } from './mock-strapi.ts';
import { sendProjectUpdateNotification, sendThreadMessageNotification } from '../src/services/email-service.ts';

test('Email Service: sendProjectUpdateNotification', async (t) => {
  const { mockStrapi, sentEmails } = createMockStrapi();
  (globalThis as any).strapi = mockStrapi;
  process.env.EMAIL_DOMAIN = 'replies.houseforce.com';
  process.env.PORTAL_URL = 'https://portal.houseforce.com';

  await t.test('dispatches email with correct subject, reply-to, portal link, and attachment notice', async () => {
    sentEmails.length = 0;

    const project = {
      id: 10,
      documentId: 'proj-xyz123',
      title: 'Villa Renovation',
      clients: [{ id: 1, email: 'client@example.com' }],
    };

    const update = {
      id: 42,
      documentId: 'upd-abc456',
      title: 'Foundation Poured',
      content: 'The concrete for the ground floor was poured today.',
      date: '2026-09-13',
      project,
    };

    await sendProjectUpdateNotification({
      update,
      project,
      clientEmails: ['client@example.com'],
    });

    assert.strictEqual(sentEmails.length, 1, 'Should have dispatched 1 email');
    const email = sentEmails[0];

    // Verify recipient and routing
    assert.deepStrictEqual(email.to, ['client@example.com']);
    assert.strictEqual(email.replyTo, 'update-42@replies.houseforce.com');
    assert.strictEqual(email.subject, 'Project Update: Villa Renovation - Foundation Poured');

    // Verify content in text body
    assert.ok(email.text?.includes('Foundation Poured'), 'Text body should include update title');
    assert.ok(email.text?.includes('Villa Renovation'), 'Text body should include project title');
    assert.ok(email.text?.includes('The concrete for the ground floor was poured today.'), 'Text body should include content');
    assert.ok(email.text?.includes('https://portal.houseforce.com/projects/proj-xyz123'), 'Text body must contain direct portal link');
    assert.ok(email.text?.includes('PHOTOS & ATTACHMENTS:'), 'Text body must contain attachment warning header');
    assert.ok(
      email.text?.includes('Project photos, media, and attachments are viewable only via your client portal.'),
      'Text body must inform that images are viewable only via portal'
    );
    assert.ok(email.text?.includes('You can reply directly to this email'), 'Text body must inform how to reply');

    // Verify content in html body
    assert.ok(email.html?.includes('https://portal.houseforce.com/projects/proj-xyz123'), 'HTML body must contain direct portal link');
    assert.ok(email.html?.includes('Photos &amp; Attachments'), 'HTML body must contain attachment notice');
    assert.ok(email.html?.includes('viewable only through your'), 'HTML body must contain portal viewable only disclaimer');
  });

  await t.test('skips email dispatch if clientEmails is empty', async () => {
    sentEmails.length = 0;

    await sendProjectUpdateNotification({
      update: { id: 1, title: 'Test' },
      project: { id: 1, title: 'Test Project' },
      clientEmails: [],
    });

    assert.strictEqual(sentEmails.length, 0, 'No email should be dispatched for empty client list');
  });
});

test('Email Service: sendThreadMessageNotification', async (t) => {
  const { mockStrapi, sentEmails } = createMockStrapi();
  (globalThis as any).strapi = mockStrapi;
  process.env.EMAIL_DOMAIN = 'replies.houseforce.com';
  process.env.PORTAL_URL = 'https://portal.houseforce.com';

  await t.test('notifies client when staff posts a thread message', async () => {
    sentEmails.length = 0;

    const project = {
      id: 10,
      documentId: 'proj-123',
      title: 'Kitchen Remodel',
    };

    const update = {
      id: 55,
      title: 'Countertop Installation',
      project,
    };

    const message = {
      id: 101,
      content: 'We will be on site tomorrow at 9 AM to measure the slabs.',
      authorType: 'staff' as const,
      staffName: 'Dave Contractor',
    };

    await sendThreadMessageNotification({
      message,
      update,
      project,
      recipientType: 'client',
      recipientEmails: ['homeowner@example.com'],
    });

    assert.strictEqual(sentEmails.length, 1);
    const email = sentEmails[0];

    assert.deepStrictEqual(email.to, ['homeowner@example.com']);
    assert.strictEqual(email.replyTo, 'update-55@replies.houseforce.com');
    assert.strictEqual(email.subject, 'New Message: Kitchen Remodel - Countertop Installation');
    assert.ok(email.text?.includes('Dave Contractor added a message'), 'Must state staff sender');
    assert.ok(email.text?.includes('https://portal.houseforce.com/projects/proj-123'), 'Must contain portal link');
    assert.ok(email.text?.includes('Project photos, media, and attachments are viewable only via your client portal'), 'Must state attachment disclaimer');
  });

  await t.test('notifies staff when client posts a thread message', async () => {
    sentEmails.length = 0;

    const project = {
      id: 10,
      title: 'Kitchen Remodel',
    };

    const update = {
      id: 55,
      title: 'Countertop Installation',
      project,
    };

    const message = {
      id: 102,
      content: 'Sounds great! Will someone be home to let you in?',
      authorType: 'client' as const,
      clientAuthor: {
        email: 'alice@example.com',
        firstname: 'Alice',
        lastname: 'Smith',
      },
    };

    await sendThreadMessageNotification({
      message,
      update,
      project,
      recipientType: 'staff',
      recipientEmails: ['admin1@houseforce.com', 'admin2@houseforce.com'],
    });

    assert.strictEqual(sentEmails.length, 1);
    const email = sentEmails[0];

    assert.deepStrictEqual(email.to, ['admin1@houseforce.com', 'admin2@houseforce.com']);
    assert.strictEqual(email.replyTo, 'update-55@replies.houseforce.com');
    assert.strictEqual(email.subject, '[Client Reply] Kitchen Remodel - Countertop Installation');
    assert.ok(email.text?.includes('Alice Smith'), 'Must display client author name');
    assert.ok(email.text?.includes('Reply directly to this email to reply back to the client.'), 'Must inform staff how to reply');
  });
});
