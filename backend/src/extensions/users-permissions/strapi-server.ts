import crypto from 'node:crypto';

export default (plugin: any) => {
  // Override Content Manager User controller
  if (plugin.controllers?.contentmanageruser?.create) {
    const originalContentManagerCreate = plugin.controllers.contentmanageruser.create;

    plugin.controllers.contentmanageruser.create = async (ctx: any) => {
      if (ctx.request.body && !ctx.request.body.password) {
        ctx.request.body.password = crypto.randomUUID() + '!Aa1';
      }
      return originalContentManagerCreate(ctx);
    };
  }

  // Override standard Content API User controller
  if (plugin.controllers?.user?.create) {
    const originalUserCreate = plugin.controllers.user.create;

    plugin.controllers.user.create = async (ctx: any) => {
      if (ctx.request.body && !ctx.request.body.password) {
        ctx.request.body.password = crypto.randomUUID() + '!Aa1';
      }
      return originalUserCreate(ctx);
    };
  }

  return plugin;
};
