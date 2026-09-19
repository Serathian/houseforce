import type { Core } from '@strapi/strapi';

const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedTypes = [
  'image/svg+xml',
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
      jwtManagement: 'refresh',
      sessions: {
        httpOnly: true,
        cookie: {
          secure: env.bool('COOKIE_SECURE', process.env.NODE_ENV === 'production'),
        },
      },
    },
  },
  upload: {
    config: {
      provider: '@strapi/provider-upload-aws-s3',
      providerOptions: {
        s3Options: {
          credentials: {
            accessKeyId: env('DO_SPACE_ACCESS_KEY'),
            secretAccessKey: env('DO_SPACE_SECRET_KEY'),
          },
          endpoint: env('DO_SPACE_ENDPOINT'),
          region: env('DO_SPACE_REGION', 'us-east-1'),
          forcePathStyle: true,
          params: {
            Bucket: env('DO_SPACE_BUCKET'),
          },
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes,
      },
    },
  },
  email: {
    config: {
      provider: '@strapi/provider-email-nodemailer',
      providerOptions: {
        host: 'smtp.postmarkapp.com',
        port: 587,
        auth: {
          user: env('POSTMARK_API_TOKEN'),
          pass: env('POSTMARK_API_TOKEN'),
        },
        // ... any custom nodemailer options
      },
      settings: {
        defaultFrom: env('EMAIL_DEFAULT_FROM', 'updates@replies.houseforce.com'),
        defaultReplyTo: env('EMAIL_DEFAULT_REPLY_TO', 'updates@replies.houseforce.com'),
      },
    },
  },
});

export default config;
