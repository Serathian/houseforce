import { UserNotificationPreferences } from "@/types/user-preferences";

export const DEFAULT_NOTIFICATION_PREFERENCES: UserNotificationPreferences = {
  notifyProjectUpdates: true,
  notifyUpdateMessages: true,
  notifyBlogPosts: true,
  hasCompletedNotificationOnboarding: false,
};

export async function getUserPreferences(token: string): Promise<UserNotificationPreferences | null> {
  const strapiUrl =
    process.env.STRAPI_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    "http://localhost:1337";

  try {
    const res = await fetch(`${strapiUrl}/api/user-preferences`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.warn(`[Portal] Failed to fetch user preferences (${res.status})`);
      return null;
    }

    const json = await res.json();
    return json.data || DEFAULT_NOTIFICATION_PREFERENCES;
  } catch (error) {
    console.error("[Portal] Network error fetching user preferences:", error);
    return null;
  }
}

export async function updateUserPreferences(
  token: string,
  preferences: Partial<UserNotificationPreferences>
): Promise<UserNotificationPreferences> {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  const res = await fetch(`${strapiUrl}/api/user-preferences`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: preferences,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || "Failed to update notification preferences");
  }

  const json = await res.json();
  return json.data;
}
