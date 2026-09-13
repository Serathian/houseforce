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
