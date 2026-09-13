"use client";

import React from "react";
import { useNotifications } from "./NotificationsContext";
import { Bell } from "lucide-react";

interface ProjectUnreadBadgeProps {
  projectDocumentId: string;
  className?: string;
  showIcon?: boolean;
}

export default function ProjectUnreadBadge({
  projectDocumentId,
  className = "",
  showIcon = false,
}: ProjectUnreadBadgeProps) {
  const { unreadByProject } = useNotifications();
  const unreadCount = unreadByProject[projectDocumentId] || 0;

  if (unreadCount === 0) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200/80 shadow-xs animate-pulse ${className}`}
      title={`${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`}
    >
      {showIcon ? (
        <Bell className="w-3 h-3 text-amber-700" />
      ) : (
        <span className="w-2 h-2 rounded-full bg-amber-500" />
      )}
      <span>
        {unreadCount} new {unreadCount === 1 ? "update" : "updates"}
      </span>
    </span>
  );
}
