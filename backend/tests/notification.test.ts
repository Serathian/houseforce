import test from 'node:test';
import assert from 'node:assert';
import { createMockStrapi } from './mock-strapi.ts';
import notificationFactory from '../src/api/notification/controllers/notification.ts';

test('Notification Controller', async (t) => {
  const { mockStrapi, store } = createMockStrapi();
  const controller = notificationFactory({ strapi: mockStrapi } as any);

  const testUser = {
    id: 101,
    email: 'client@example.com',
    username: 'client@example.com',
    readNotificationIds: [],
  };
  store.clients.set('client@example.com', testUser);

  const project1 = {
    id: 1,
    documentId: 'proj-doc-1',
    title: 'Camps Bay Villa',
    clients: [{ id: 101, email: 'client@example.com' }],
  };
  const project2 = {
    id: 2,
    documentId: 'proj-doc-2',
    title: 'Waterfront Penthouse',
    clients: [{ id: 999, email: 'other@example.com' }], // Not assigned to 101
  };
  store.projects.set(1, project1);
  store.projects.set(2, project2);

  const update1 = {
    id: 11,
    documentId: 'upd-doc-11',
    title: 'Ground Floor Pour',
    content: 'Concrete slab is poured and curing well.',
    project: { id: 1, documentId: 'proj-doc-1', title: 'Camps Bay Villa' },
    publishedAt: '2026-09-01T10:00:00Z',
    createdAt: '2026-09-01T10:00:00Z',
  };
  const update2 = {
    id: 12,
    documentId: 'upd-doc-12',
    title: 'Roof Framing',
    content: 'Trusses installed.',
    project: { id: 1, documentId: 'proj-doc-1', title: 'Camps Bay Villa' },
    publishedAt: '2026-09-05T10:00:00Z',
    createdAt: '2026-09-05T10:00:00Z',
  };
  const draftUpdate = {
    id: 13,
    documentId: 'upd-doc-13',
    title: 'Secret Draft Update',
    content: 'Draft content.',
    project: { id: 1, documentId: 'proj-doc-1', title: 'Camps Bay Villa' },
    publishedAt: null, // DRAFT
    createdAt: '2026-09-06T10:00:00Z',
  };
  const otherProjectUpdate = {
    id: 14,
    documentId: 'upd-doc-14',
    title: 'Penthouse Tile Work',
    content: 'Marble installed.',
    project: { id: 2, documentId: 'proj-doc-2', title: 'Waterfront Penthouse' },
    publishedAt: '2026-09-07T10:00:00Z',
    createdAt: '2026-09-07T10:00:00Z',
  };

  store.updates.set(11, update1);
  store.updates.set(12, update2);
  store.updates.set(13, draftUpdate);
  store.updates.set(14, otherProjectUpdate);

  // Messages on update 11: 1 from staff, 1 from client
  const msg1 = {
    id: 101,
    content: 'Engineer approved the slab.',
    authorType: 'staff',
    staffName: 'Dave Engineer',
    update: { id: 11 },
    createdAt: '2026-09-02T12:00:00Z',
  };
  const msg2 = {
    id: 102,
    content: 'Looks fantastic, thanks Dave!',
    authorType: 'client',
    update: { id: 11 },
    createdAt: '2026-09-02T13:00:00Z',
  };
  store.updateMessages.set(101, msg1);
  store.updateMessages.set(102, msg2);

  await t.test('getNotifications: rejects unauthenticated request', async () => {
    let unauthorizedCalled = false;
    const ctx: any = {
      state: {},
      unauthorized: (msg: string) => {
        unauthorizedCalled = true;
        return { status: 401, message: msg };
      },
    };

    const res = await controller.getNotifications(ctx);
    assert.strictEqual(unauthorizedCalled, true);
    assert.strictEqual(res.status, 401);
  });

  await t.test('getNotifications: returns scoped notifications, ignores drafts and client replies', async () => {
    const ctx: any = {
      state: { user: { id: 101 } },
    };

    const res = await controller.getNotifications(ctx);
    assert.ok(res.data);
    const { notifications, unreadCount, unreadByProject } = res.data;

    // Should include: update 12, msg 101 (staff reply), update 11.
    // Should NOT include: draftUpdate (13), otherProjectUpdate (14), or msg 102 (client reply).
    assert.strictEqual(notifications.length, 3);
    assert.strictEqual(unreadCount, 3);
    assert.strictEqual(unreadByProject['proj-doc-1'], 3);
    assert.strictEqual(unreadByProject['proj-doc-2'], undefined);

    // Verify ordering is newest first (update 12: Sep 5, msg 101: Sep 2, update 11: Sep 1)
    assert.strictEqual(notifications[0].id, 'update-12');
    assert.strictEqual(notifications[1].id, 'message-101');
    assert.strictEqual(notifications[2].id, 'update-11');
  });

  await t.test('markAsRead: marks single notification as read', async () => {
    const ctx: any = {
      state: { user: { id: 101 } },
      request: {
        body: {
          data: {
            notificationIds: ['update-12'],
          },
        },
      },
    };

    const markRes = await controller.markAsRead(ctx);
    assert.strictEqual(markRes.data.success, true);

    // Re-check getNotifications
    const getCtx: any = { state: { user: { id: 101 } } };
    const getRes = await controller.getNotifications(getCtx);
    assert.strictEqual(getRes.data.unreadCount, 2);
    assert.strictEqual(getRes.data.unreadByProject['proj-doc-1'], 2);

    const update12 = getRes.data.notifications.find((n: any) => n.id === 'update-12');
    assert.strictEqual(update12.read, true);
  });

  await t.test('markAsRead: marks all for a project as read', async () => {
    const ctx: any = {
      state: { user: { id: 101 } },
      request: {
        body: {
          data: {
            projectDocumentId: 'proj-doc-1',
          },
        },
      },
    };

    const markRes = await controller.markAsRead(ctx);
    assert.strictEqual(markRes.data.success, true);

    const getCtx: any = { state: { user: { id: 101 } } };
    const getRes = await controller.getNotifications(getCtx);
    assert.strictEqual(getRes.data.unreadCount, 0);
    assert.strictEqual(getRes.data.unreadByProject['proj-doc-1'], undefined);
  });
});
