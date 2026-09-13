import test from 'node:test';
import assert from 'node:assert';
import { createMockStrapi } from './mock-strapi.ts';
import userPreferenceFactory from '../src/api/user-preference/controllers/user-preference.ts';

test('User Preference Controller', async (t) => {
  const { mockStrapi, store, dbUpdates } = createMockStrapi();
  const controller = userPreferenceFactory({ strapi: mockStrapi } as any);

  const testUser = {
    id: 42,
    email: 'client@example.com',
    username: 'client@example.com',
    notifyProjectUpdates: true,
    notifyUpdateMessages: true,
    notifyBlogPosts: true,
    hasCompletedNotificationOnboarding: false,
  };
  store.clients.set('client@example.com', testUser);

  await t.test('getPreferences: rejects unauthenticated user', async () => {
    let unauthorizedCalled = false;
    const ctx: any = {
      state: {},
      unauthorized: (msg: string) => {
        unauthorizedCalled = true;
        return { status: 401, message: msg };
      },
    };

    const res = await controller.getPreferences(ctx);
    assert.strictEqual(unauthorizedCalled, true);
    assert.strictEqual(res.status, 401);
  });

  await t.test('getPreferences: returns user notification preferences', async () => {
    const ctx: any = {
      state: { user: { id: 42 } },
    };

    const res = await controller.getPreferences(ctx);
    assert.ok(res.data);
    assert.strictEqual(res.data.notifyProjectUpdates, true);
    assert.strictEqual(res.data.notifyUpdateMessages, true);
    assert.strictEqual(res.data.notifyBlogPosts, true);
    assert.strictEqual(res.data.hasCompletedNotificationOnboarding, false);
  });

  await t.test('updatePreferences: rejects unauthenticated user', async () => {
    let unauthorizedCalled = false;
    const ctx: any = {
      state: {},
      unauthorized: (msg: string) => {
        unauthorizedCalled = true;
        return { status: 401, message: msg };
      },
    };

    const res = await controller.updatePreferences(ctx);
    assert.strictEqual(unauthorizedCalled, true);
    assert.strictEqual(res.status, 401);
  });

  await t.test('updatePreferences: rejects empty / invalid body', async () => {
    let badRequestCalled = false;
    const ctx: any = {
      state: { user: { id: 42 } },
      request: { body: {} },
      badRequest: (msg: string) => {
        badRequestCalled = true;
        return { status: 400, message: msg };
      },
    };

    const res = await controller.updatePreferences(ctx);
    assert.strictEqual(badRequestCalled, true);
    assert.strictEqual(res.status, 400);
  });

  await t.test('updatePreferences: successfully updates flags and onboarding status', async () => {
    dbUpdates.length = 0;
    const ctx: any = {
      state: { user: { id: 42 } },
      request: {
        body: {
          data: {
            notifyProjectUpdates: true,
            notifyUpdateMessages: false,
            notifyBlogPosts: true,
            hasCompletedNotificationOnboarding: true,
          },
        },
      },
    };

    const res = await controller.updatePreferences(ctx);
    assert.ok(res.data);
    assert.strictEqual(res.data.notifyProjectUpdates, true);
    assert.strictEqual(res.data.notifyUpdateMessages, false);
    assert.strictEqual(res.data.notifyBlogPosts, true);
    assert.strictEqual(res.data.hasCompletedNotificationOnboarding, true);

    const userInDb = store.clients.get('client@example.com');
    assert.strictEqual(userInDb.notifyUpdateMessages, false);
    assert.strictEqual(userInDb.hasCompletedNotificationOnboarding, true);
  });
});
