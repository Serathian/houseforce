"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { PortalNotification, NotificationsResponse } from "@/types/notifications";
import { getNotifications, markNotificationsAsRead } from "@/lib/notifications";

interface NotificationsContextValue {
  notifications: PortalNotification[];
  unreadCount: number;
  unreadByProject: Record<string, number>;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  markAsRead: (idOrIds: string | string[]) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  markProjectAsRead: (projectDocumentId: string) => Promise<void>;
  refresh: () => Promise<void>;
  loading: boolean;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({
  children,
  initialData,
  token,
}: {
  children: React.ReactNode;
  initialData?: NotificationsResponse;
  token?: string;
}) {
  const [notifications, setNotifications] = useState<PortalNotification[]>(
    initialData?.notifications || []
  );
  const [unreadCount, setUnreadCount] = useState<number>(
    initialData?.unreadCount ?? 0
  );
  const [unreadByProject, setUnreadByProject] = useState<Record<string, number>>(
    initialData?.unreadByProject || {}
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculateUnreadState = useCallback((list: PortalNotification[]) => {
    let count = 0;
    const byProject: Record<string, number> = {};
    for (const item of list) {
      if (!item.read) {
        count++;
        if (item.projectDocumentId) {
          byProject[item.projectDocumentId] =
            (byProject[item.projectDocumentId] || 0) + 1;
        }
      }
    }
    setUnreadCount(count);
    setUnreadByProject(byProject);
  }, []);

  const refresh = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await getNotifications(token);
      setNotifications(res.notifications || []);
      setUnreadCount(res.unreadCount || 0);
      setUnreadByProject(res.unreadByProject || {});
    } catch (err) {
      console.error("[NotificationsContext] Failed to refresh notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const markAsRead = useCallback(
    async (idOrIds: string | string[]) => {
      const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
      if (ids.length === 0) return;

      const idSet = new Set(ids);
      setNotifications((prev) => {
        const next = prev.map((item) =>
          idSet.has(item.id) ? { ...item, read: true } : item
        );
        calculateUnreadState(next);
        return next;
      });

      if (token) {
        await markNotificationsAsRead(token, { notificationIds: ids });
      }
    },
    [token, calculateUnreadState]
  );

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => {
      const next = prev.map((item) => ({ ...item, read: true }));
      setUnreadCount(0);
      setUnreadByProject({});
      return next;
    });

    if (token) {
      await markNotificationsAsRead(token, { all: true });
    }
  }, [token]);

  const markProjectAsRead = useCallback(
    async (projectDocumentId: string) => {
      if (!projectDocumentId) return;

      setNotifications((prev) => {
        const next = prev.map((item) =>
          item.projectDocumentId === projectDocumentId
            ? { ...item, read: true }
            : item
        );
        calculateUnreadState(next);
        return next;
      });

      if (token) {
        await markNotificationsAsRead(token, { projectDocumentId });
      }
    },
    [token, calculateUnreadState]
  );

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  // Window focus auto-refresh
  useEffect(() => {
    if (!token) return;
    const handleFocus = () => {
      refresh();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [token, refresh]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        unreadByProject,
        isDrawerOpen,
        setIsDrawerOpen,
        openDrawer,
        closeDrawer,
        markAsRead,
        markAllAsRead,
        markProjectAsRead,
        refresh,
        loading,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return ctx;
}
