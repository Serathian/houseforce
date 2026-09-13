export interface SentEmail {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

export function createMockStrapi() {
  const sentEmails: SentEmail[] = [];
  const dbUpdates: Array<{ model: string; where: any; data: any }> = [];
  const createdEntities: Array<{ model: string; data: any }> = [];

  const store = {
    projects: new Map<number, any>(),
    updates: new Map<number, any>(),
    updateMessages: new Map<number, any>(),
    clients: new Map<string, any>(),
    admins: new Map<string, any>(),
  };

  const mockStrapi: any = {
    log: {
      info: () => {},
      warn: () => {},
      error: () => {},
      debug: () => {},
    },
    plugin(pluginName: string) {
      if (pluginName === 'email') {
        return {
          service(serviceName: string) {
            if (serviceName === 'email') {
              return {
                async send(payload: SentEmail) {
                  sentEmails.push(payload);
                  return { accepted: payload.to };
                },
              };
            }
          },
        };
      }
      throw new Error(`Plugin ${pluginName} not mocked`);
    },
    entityService: {
      async findOne(uid: string, id: number, options?: any) {
        if (uid === 'api::project.project') {
          return store.projects.get(id) || null;
        }
        if (uid === 'api::update.update') {
          return store.updates.get(id) || null;
        }
        if (uid === 'api::update-message.update-message') {
          return store.updateMessages.get(id) || null;
        }
        return null;
      },
      async findMany(uid: string, options?: any) {
        if (uid === 'plugin::users-permissions.user') {
          const email = options?.filters?.email;
          if (email && store.clients.has(email)) {
            return [store.clients.get(email)];
          }
          return [];
        }
        return [];
      },
      async create(uid: string, params: { data: any; populate?: any }) {
        createdEntities.push({ model: uid, data: params.data });
        const newId = Math.floor(Math.random() * 100000) + 1;
        const record = { id: newId, documentId: `doc-${newId}`, ...params.data };

        if (uid === 'api::update.update') {
          // If project was passed as ID, resolve project relation if available
          if (params.data.project && typeof params.data.project === 'number') {
            record.project = store.projects.get(params.data.project);
          }
          store.updates.set(newId, record);
        } else if (uid === 'api::update-message.update-message') {
          if (params.data.update && typeof params.data.update === 'number') {
            record.update = store.updates.get(params.data.update);
          }
          store.updateMessages.set(newId, record);
        }
        return record;
      },
    },
    db: {
      query(model: string) {
        return {
          async findMany(query?: any) {
            if (model === 'admin::user') {
              const email = query?.where?.email;
              if (email) {
                const admin = store.admins.get(email);
                return admin ? [admin] : [];
              }
              return Array.from(store.admins.values()).filter((a) => (query?.where?.isActive !== undefined ? a.isActive === query.where.isActive : true));
            }
            return [];
          },
          async findOne(query?: any) {
            if (model === 'admin::user') {
              const email = query?.where?.email;
              return store.admins.get(email) || null;
            }
            if (model === 'plugin::users-permissions.user') {
              const id = query?.where?.id;
              const email = query?.where?.email;
              if (id) {
                return Array.from(store.clients.values()).find((c) => c.id === id) || null;
              }
              if (email) {
                return store.clients.get(email) || null;
              }
            }
            return null;
          },
          async update(params: { where: any; data: any }) {
            dbUpdates.push({ model, where: params.where, data: params.data });
            if (model === 'api::update.update') {
              const existing = store.updates.get(params.where.id);
              if (existing) {
                Object.assign(existing, params.data);
                return existing;
              }
            }
            if (model === 'plugin::users-permissions.user') {
              const id = params.where?.id;
              const client = Array.from(store.clients.values()).find((c) => c.id === id);
              if (client) {
                Object.assign(client, params.data);
                return client;
              }
            }
            return null;
          },
        };
      },
    },
    documents(uid: string) {
      return {
        async findOne(params: any) {
          if (uid === 'api::update-message.update-message') {
            return Array.from(store.updateMessages.values()).find((m) => m.documentId === params.documentId) || null;
          }
          return null;
        },
        async update(params: any) {
          const record = Array.from(store.updateMessages.values()).find((m) => m.documentId === params.documentId);
          if (record) {
            Object.assign(record, params.data);
            return record;
          }
          return null;
        },
      };
    },
  };

  return {
    mockStrapi,
    store,
    sentEmails,
    dbUpdates,
    createdEntities,
  };
}
