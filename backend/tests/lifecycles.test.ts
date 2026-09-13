import test from 'node:test';
import assert from 'node:assert';
import { createMockStrapi } from './mock-strapi.ts';
import updateLifecycle from '../src/api/update/content-types/update/lifecycles.ts';
import updateMessageLifecycle from '../src/api/update-message/content-types/update-message/lifecycles.ts';

test('Update Lifecycles', async (t) => {
  const { mockStrapi, store, sentEmails, dbUpdates } = createMockStrapi();
  (globalThis as any).strapi = mockStrapi;
  process.env.EMAIL_DOMAIN = 'replies.houseforce.com';

  const project = {
    id: 1,
    documentId: 'proj-1',
    title: 'Modern House',
    clients: [{ id: 10, email: 'client@example.com' }],
  };
  store.projects.set(1, project);

  await t.test('afterCreate: notifies client when update is published and not yet notified', async () => {
    sentEmails.length = 0;
    dbUpdates.length = 0;

    store.updates.set(100, {
      id: 100,
      title: 'Walls Framed',
      content: 'All interior walls are framed.',
      publishedAt: new Date(),
      clientNotified: false,
      project,
    });

    await updateLifecycle.afterCreate({
      result: { id: 100, publishedAt: new Date(), clientNotified: false },
    });

    assert.strictEqual(sentEmails.length, 1, 'Should have sent email');
    assert.deepStrictEqual(sentEmails[0].to, ['client@example.com']);
    assert.strictEqual(sentEmails[0].replyTo, 'update-100@replies.houseforce.com');

    const dbUpdate = dbUpdates.find((u) => u.where?.id === 100);
    assert.ok(dbUpdate, 'Should have marked update as clientNotified in DB');
    assert.strictEqual(dbUpdate.data.clientNotified, true);
  });

  await t.test('afterCreate: does NOT notify if update is a draft', async () => {
    sentEmails.length = 0;
    dbUpdates.length = 0;

    store.updates.set(101, {
      id: 101,
      title: 'Draft Update',
      content: 'Draft content',
      publishedAt: null,
      clientNotified: false,
      project,
    });

    await updateLifecycle.afterCreate({
      result: { id: 101, publishedAt: null, clientNotified: false },
    });

    assert.strictEqual(sentEmails.length, 0, 'Should not email for draft');
  });

  await t.test('afterUpdate: notifies client when draft is subsequently published', async () => {
    sentEmails.length = 0;
    dbUpdates.length = 0;

    store.updates.set(102, {
      id: 102,
      title: 'Drywall Complete',
      content: 'Drywall is finished and primed.',
      publishedAt: new Date(),
      clientNotified: false,
      project,
    });

    await updateLifecycle.afterUpdate({
      result: { id: 102, publishedAt: new Date(), clientNotified: false },
    });

    assert.strictEqual(sentEmails.length, 1);
    assert.strictEqual(sentEmails[0].replyTo, 'update-102@replies.houseforce.com');
  });

  await t.test('afterUpdate: does NOT notify if already notified (subsequent edits)', async () => {
    sentEmails.length = 0;
    dbUpdates.length = 0;

    store.updates.set(103, {
      id: 103,
      title: 'Drywall Complete',
      content: 'Fixing typo',
      publishedAt: new Date(),
      clientNotified: true,
      project,
    });

    await updateLifecycle.afterUpdate({
      result: { id: 103, publishedAt: new Date(), clientNotified: true },
    });

    assert.strictEqual(sentEmails.length, 0, 'Must not duplicate notification on edit');
  });
});

test('UpdateMessage Lifecycles', async (t) => {
  const { mockStrapi, store, sentEmails } = createMockStrapi();
  (globalThis as any).strapi = mockStrapi;
  process.env.EMAIL_DOMAIN = 'replies.houseforce.com';

  const project = {
    id: 1,
    documentId: 'proj-1',
    title: 'Modern House',
    clients: [{ id: 10, email: 'client@example.com' }],
  };

  const update = {
    id: 200,
    documentId: 'upd-200',
    title: 'Flooring Installed',
    project,
  };

  store.projects.set(1, project);
  store.updates.set(200, update);

  store.admins.set('admin@houseforce.com', {
    id: 99,
    email: 'admin@houseforce.com',
    isActive: true,
  });

  await t.test('notifies client when staff posts an update message', async () => {
    sentEmails.length = 0;

    store.updateMessages.set(501, {
      id: 501,
      content: 'The hardwood floor looks fantastic.',
      authorType: 'staff',
      staffName: 'Sam Project Manager',
      update,
    });

    await updateMessageLifecycle.afterCreate({
      result: {
        id: 501,
        content: 'The hardwood floor looks fantastic.',
        authorType: 'staff',
        staffName: 'Sam Project Manager',
      },
      params: {
        data: {
          update: 200,
        },
      },
    });

    assert.strictEqual(sentEmails.length, 1, 'Should email client');
    assert.deepStrictEqual(sentEmails[0].to, ['client@example.com']);
    assert.strictEqual(sentEmails[0].replyTo, 'update-200@replies.houseforce.com');
  });

  await t.test('notifies staff when client posts an update message', async () => {
    sentEmails.length = 0;

    store.updateMessages.set(502, {
      id: 502,
      content: 'Can we schedule a walk-through?',
      authorType: 'client',
      clientAuthor: {
        email: 'client@example.com',
        firstname: 'Jane',
        lastname: 'Doe',
      },
      update,
    });

    await updateMessageLifecycle.afterCreate({
      result: {
        id: 502,
        content: 'Can we schedule a walk-through?',
        authorType: 'client',
      },
      params: {
        data: {
          update: 200,
        },
      },
    });

    assert.strictEqual(sentEmails.length, 1, 'Should email staff');
    assert.deepStrictEqual(sentEmails[0].to, ['admin@houseforce.com']);
    assert.strictEqual(sentEmails[0].replyTo, 'update-200@replies.houseforce.com');
  });
});
