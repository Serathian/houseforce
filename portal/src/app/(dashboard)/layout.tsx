import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import { getUserPreferences } from "@/lib/user-preferences";
import NotificationPreferencesModal from "@/components/NotificationPreferencesModal";
import { getNotifications } from "@/lib/notifications";
import { NotificationsResponse } from "@/types/notifications";
import { NotificationsProvider } from "@/components/NotificationsContext";
import NotificationFeedDrawer from "@/components/NotificationFeedDrawer";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  let showNotificationPrompt = false;
  let preferences = null;
  let initialNotifications: NotificationsResponse = { notifications: [], unreadCount: 0, unreadByProject: {} };

  if (session?.strapiToken) {
    const [prefRes, notifRes] = await Promise.all([
      getUserPreferences(session.strapiToken),
      getNotifications(session.strapiToken),
    ]);
    preferences = prefRes;
    initialNotifications = notifRes;
    if (preferences && preferences.hasCompletedNotificationOnboarding === false) {
      showNotificationPrompt = true;
    }
  }

  return (
    <NotificationsProvider initialData={initialNotifications} token={session?.strapiToken}>
      <div className="flex flex-row min-h-screen">
        <Sidebar userName={session?.user?.name} />

        {/* Content area — takes remaining width on desktop, full-width on mobile */}
        <main className="flex-1 bg-slate-50/50 min-w-0">
          <div className="max-w-5xl mx-auto p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 lg:pb-8">
            {children}
          </div>
        </main>

        {showNotificationPrompt && (
          <NotificationPreferencesModal
            token={session?.strapiToken}
            initialPreferences={preferences || undefined}
          />
        )}

        <NotificationFeedDrawer />
      </div>
    </NotificationsProvider>
  );
}




