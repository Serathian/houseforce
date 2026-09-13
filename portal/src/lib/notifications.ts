import { NotificationsResponse } from "@/types/notifications";

const DEFAULT_NOTIFICATIONS: NotificationsResponse = {
  notifications: [],
  unreadCount: 0,
  unreadByProject: {},
};

export async function getNotifications(token: string): Promise<NotificationsResponse> {
  const strapiUrl =
    process.env.STRAPI_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    "http://localhost:1337";

  try {
    const res = await fetch(`${strapiUrl}/api/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.warn(`[Portal] Failed to fetch notifications (${res.status})`);
      return DEFAULT_NOTIFICATIONS;
    }

    const json = await res.json();
    return json.data || DEFAULT_NOTIFICATIONS;
  } catch (error) {
    console.error("[Portal] Network error fetching notifications:", error);
    return DEFAULT_NOTIFICATIONS;
  }
}

export async function markNotificationsAsRead(
  token: string,
  payload: {
    notificationIds?: string[];
    all?: boolean;
    projectDocumentId?: string;
    projectId?: number;
    unmarkIds?: string[];
  }
): Promise<{ success: boolean; readCount?: number }> {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  try {
    const res = await fetch(`${strapiUrl}/api/notifications/mark-read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: payload,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("[Portal] Failed to mark notifications as read:", errorData);
      return { success: false };
    }

    const json = await res.json();
    return json.data || { success: true };
  } catch (error) {
    console.error("[Portal] Network error marking notifications as read:", error);
    return { success: false };
  }
}
