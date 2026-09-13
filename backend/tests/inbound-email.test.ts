import test from 'node:test';
import assert from 'node:assert';
import { createMockStrapi } from './mock-strapi.ts';
import inboundController from '../src/api/webhook/controllers/inbound-email.ts';

function createMockContext(body: any) {
  const ctx: any = {
    request: { body },
    status: 200,
    body: null,
    badRequest(msg: string) {
      ctx.status = 400;
      ctx.body = { error: msg };
      return ctx.body;
    },
    forbidden(msg: string) {
      ctx.status = 403;
      ctx.body = { error: msg };
      return ctx.body;
    },
    notFound(msg: string) {
      ctx.status = 404;
      ctx.body = { error: msg };
      return ctx.body;
    },
    send(data: any) {
      ctx.status = 200;
      ctx.body = data;
      return ctx.body;
    },
    internalServerError(msg: string) {
      ctx.status = 500;
      ctx.body = { error: msg };
      return ctx.body;
    },
  };
  return ctx;
}

test('Inbound Email Webhook Controller', async (t) => {
  const { mockStrapi, store, createdEntities } = createMockStrapi();
  (globalThis as any).strapi = mockStrapi;

  // Pre-populate test database
  store.admins.set('staff@houseforce.com', {
    id: 1,
    email: 'staff@houseforce.com',
    firstname: 'John',
    lastname: 'Builder',
    isActive: true,
  });

  store.clients.set('client@example.com', {
    id: 201,
    email: 'client@example.com',
  });

  store.projects.set(10, {
    id: 10,
    documentId: 'proj-doc-10',
    title: 'Modern Villa',
    clients: [{ id: 201, email: 'client@example.com' }],
  });

  store.updates.set(50, {
    id: 50,
    documentId: 'upd-doc-50',
    title: 'Roofing in Progress',
    project: store.projects.get(10),
  });

  await t.test('validation: rejects missing To email', async () => {
    const ctx = createMockContext({
      From: 'staff@houseforce.com',
      TextBody: 'Hello world',
    });
    await inboundController.receive(ctx);
    assert.strictEqual(ctx.status, 400);
    assert.strictEqual(ctx.body?.error, 'Missing To email address in payload');
  });

  await t.test('validation: rejects empty email body', async () => {
    const ctx = createMockContext({
      From: 'staff@houseforce.com',
      To: 'project-10@replies.houseforce.com',
      TextBody: '   ',
    });
    await inboundController.receive(ctx);
    assert.strictEqual(ctx.status, 400);
    assert.strictEqual(ctx.body?.error, 'Email body is empty');
  });

  await t.test('validation: rejects unrecognized email destination format', async () => {
    const ctx = createMockContext({
      From: 'staff@houseforce.com',
      To: 'random-mailbox@replies.houseforce.com',
      TextBody: 'Some content',
    });
    await inboundController.receive(ctx);
    assert.strictEqual(ctx.status, 400);
    assert.ok(ctx.body?.error?.includes('Invalid To address format'));
  });

  // Scenario A Tests: New Project Update
  await t.test('Scenario A: rejects non-staff attempting to create project update', async () => {
    const ctx = createMockContext({
      From: 'stranger@gmail.com',
      To: 'project-10@replies.houseforce.com',
      Subject: 'New Update',
      TextBody: 'Can I post an update?',
    });
    await inboundController.receive(ctx);
    assert.strictEqual(ctx.status, 403);
    assert.strictEqual(ctx.body?.error, 'Only authorized staff can create project updates via email.');
  });

  await t.test('Scenario A: returns 404 if project does not exist', async () => {
    const ctx = createMockContext({
      From: 'staff@houseforce.com',
      To: 'project-999@replies.houseforce.com',
      Subject: 'New Update',
      TextBody: 'Update for non-existent project',
    });
    await inboundController.receive(ctx);
    assert.strictEqual(ctx.status, 404);
  });

  await t.test('Scenario A: authorized staff creates new project update', async () => {
    createdEntities.length = 0;
    const ctx = createMockContext({
      From: 'John Builder <staff@houseforce.com>',
      To: 'Houseforce Project 10 <project-10@replies.houseforce.com>',
      Subject: 'Fwd: Re: Electrical wiring completed',
      TextBody: 'The second-floor electrical work is fully done.\n\nBest,\nJohn',
      StrippedTextReply: 'The second-floor electrical work is fully done.',
    });
    await inboundController.receive(ctx);

    assert.strictEqual(ctx.status, 200);
    assert.strictEqual(ctx.body?.success, true);
    assert.ok(ctx.body?.data?.updateId);

    // Verify created entity
    const createdUpdate = createdEntities.find((e) => e.model === 'api::update.update');
    assert.ok(createdUpdate, 'Should have created update entity');
    assert.strictEqual(createdUpdate.data.title, 'Electrical wiring completed', 'Should strip Re: and Fwd:');
    assert.strictEqual(createdUpdate.data.content, 'The second-floor electrical work is fully done.', 'Should use StrippedTextReply');
    assert.strictEqual(createdUpdate.data.project, 10);
    assert.ok(createdUpdate.data.publishedAt, 'Should publish immediately');
    assert.strictEqual(createdUpdate.data.clientNotified, false, 'Should be flagged for notification hook');
  });

  // Scenario B Tests: Thread Replies
  await t.test('Scenario B: returns 404 if update thread does not exist', async () => {
    const ctx = createMockContext({
      From: 'client@example.com',
      To: 'update-999@replies.houseforce.com',
      TextBody: 'Reply to non-existent update',
    });
    await inboundController.receive(ctx);
    assert.strictEqual(ctx.status, 404);
  });

  await t.test('Scenario B: client replies to update thread', async () => {
    createdEntities.length = 0;
    const ctx = createMockContext({
      From: 'client@example.com',
      To: 'update-50@replies.houseforce.com',
      Subject: 'Re: Project Update',
      StrippedTextReply: 'Thank you for the update! When will inspection take place?',
      TextBody: 'Thank you for the update! When will inspection take place?\n\n> Old message',
    });
    await inboundController.receive(ctx);

    assert.strictEqual(ctx.status, 200);
    assert.strictEqual(ctx.body?.success, true);

    const createdMsg = createdEntities.find((e) => e.model === 'api::update-message.update-message');
    assert.ok(createdMsg, 'Should have created update-message');
    assert.strictEqual(createdMsg.data.authorType, 'client');
    assert.strictEqual(createdMsg.data.clientAuthor, 201);
    assert.strictEqual(createdMsg.data.update, 50);
    assert.strictEqual(createdMsg.data.content, 'Thank you for the update! When will inspection take place?');
  });

  await t.test('Scenario B: staff replies to update thread via email', async () => {
    createdEntities.length = 0;
    const ctx = createMockContext({
      From: 'staff@houseforce.com',
      To: 'update-50@replies.houseforce.com',
      Subject: 'Re: Project Update',
      StrippedTextReply: 'Inspection is scheduled for this Friday at 11 AM.',
    });
    await inboundController.receive(ctx);

    assert.strictEqual(ctx.status, 200);
    assert.strictEqual(ctx.body?.success, true);

    const createdMsg = createdEntities.find((e) => e.model === 'api::update-message.update-message');
    assert.ok(createdMsg, 'Should have created update-message');
    assert.strictEqual(createdMsg.data.authorType, 'staff');
    assert.strictEqual(createdMsg.data.staffName, 'John Builder');
    assert.strictEqual(createdMsg.data.update, 50);
    assert.strictEqual(createdMsg.data.content, 'Inspection is scheduled for this Friday at 11 AM.');
  });
});
