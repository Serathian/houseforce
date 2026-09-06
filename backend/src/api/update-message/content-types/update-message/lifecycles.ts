interface Project {
  id: number;
  title: string;
  clients?: Array<{
    id: number;
    email: string;
  }>;
}

interface Update {
  id: number;
  title: string;
  project?: Project;
}

interface UpdateMessagePayload {
  id: number;
  update?: Update;
}

interface AfterCreateEvent {
  result: {
    id: number;
  };
  data: {
    content: string;
    authorType: 'staff' | 'client';
  };
}

export default {
  async afterCreate(event: AfterCreateEvent) {
    const { result, data } = event;

    // We only want to notify clients when staff posts a message
    if (data.authorType === 'staff') {
      try {
        // Fetch the associated update and project to get the client emails
        const updateMessage = (await strapi.entityService.findOne(
          'api::update-message.update-message',
          result.id,
          {
            populate: {
              update: {
                populate: {
                  project: {
                    populate: ['clients'],
                  },
                },
              },
            },
          }
        )) as unknown as UpdateMessagePayload;

        const project = updateMessage?.update?.project;
        if (!project || !project.clients || project.clients.length === 0) {
          strapi.log.info('No clients found for this project, skipping email.');
          return;
        }

        const clientEmails = project.clients.map((c) => c.email).filter(Boolean);

        if (clientEmails.length > 0) {
          // Send an email to the clients
          await strapi.plugin('email').service('email').send({
            to: clientEmails,
            subject: `New Message on Project Update: ${updateMessage.update!.title || project.title}`,
            text: `A new message was added to your project update:\n\n${data.content}`,
            html: `<p>A new message was added to your project update:</p><div>${data.content}</div>`,
            replyTo: `update-${updateMessage.update!.id}@replies.houseforce.com`,
          });
          strapi.log.info(`Email notification sent to ${clientEmails.join(', ')}`);
        }
      } catch (err) {
        strapi.log.error('Error sending staff reply email:', err);
      }
    }
  },
};
