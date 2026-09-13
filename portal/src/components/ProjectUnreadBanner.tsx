"use client";

import React from "react";
import { useNotifications } from "./NotificationsContext";
import { Bell, CheckCheck } from "lucide-react";

interface ProjectUnreadBannerProps {
  projectDocumentId: string;
}

export default function ProjectUnreadBanner({ projectDocumentId }: ProjectUnreadBannerProps) {
  const { unreadByProject, markProjectAsRead } = useNotifications();
  const count = unreadByProject[projectDocumentId] || 0;

  if (count === 0) return null;

  return (
    <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Bell className="w-5 h-5 animate-bounce" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-950">
            {count} Unread {count === 1 ? "Notification" : "Notifications"}
          </h3>
          <p className="text-xs text-amber-800/80 mt-0.5">
            You have new project timeline updates or discussion replies that haven&apos;t been marked as read.
          </p>
        </div>
      </div>

      <button
        onClick={() => markProjectAsRead(projectDocumentId)}
        className="self-start sm:self-auto bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-2 shadow-xs shrink-0 cursor-pointer"
      >
        <CheckCheck className="w-4 h-4" />
        Mark Project as Read
      </button>
    </div>
  );
}
