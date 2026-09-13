export interface Post {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: string; // rich text or markdown depending on Strapi config
  categories?: Category[];
  category?: Category; // Deprecated single category backward compatibility
  author?: Author;
  serviceType?: 'construction' | 'keyholding';
  isAnchor?: boolean;
  isPinned?: boolean;
  coverImage?: any; // Will refine based on Strapi upload type
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: number;
  documentId?: string;
  name: string;
  role: string;
  bio?: string;
  avatar?: any;
  avatarUrl?: string;
  posts?: Post[];
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  posts?: Post[];
}

export interface UserNotificationPreferences {
  notifyProjectUpdates: boolean;
  notifyUpdateMessages: boolean;
  notifyBlogPosts: boolean;
  hasCompletedNotificationOnboarding: boolean;
}

export interface PortalNotification {
  id: string; // e.g. "update-12" or "message-45"
  type: 'project_update' | 'update_message';
  title: string;
  snippet: string;
  projectId: number;
  projectDocumentId: string;
  projectTitle: string;
  updateId: number;
  updateDocumentId?: string;
  updateTitle?: string;
  messageId?: number;
  authorName?: string;
  createdAt: string;
  read: boolean;
}

export interface NotificationsResponse {
  notifications: PortalNotification[];
  unreadCount: number;
  unreadByProject: Record<string, number>;
}

