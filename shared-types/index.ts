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

