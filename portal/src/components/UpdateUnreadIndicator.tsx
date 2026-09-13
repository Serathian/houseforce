"use client";

import React from "react";
import { useNotifications } from "./NotificationsContext";
import { Sparkles, MessageSquare } from "lucide-react";

interface UpdateUnreadIndicatorProps {
  updateId: number;
  messageIds?: number[];
}

export default function UpdateUnreadIndicator({
  updateId,
  messageIds = [],
}: UpdateUnreadIndicatorProps) {
  const { notifications, markAsRead } = useNotifications();

  const isUpdateUnread = notifications.some(
    (n) => n.id === `update-${updateId}` && !n.read
  );

  const unreadMessageCount = notifications.filter(
    (n) =>
      n.type === "update_message" &&
      messageIds.includes(n.messageId || -1) &&
      !n.read
  ).length;

  if (!isUpdateUnread && unreadMessageCount === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {isUpdateUnread && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            markAsRead(`update-${updateId}`);
          }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-teal-100 text-teal-800 border border-teal-200/80 shadow-xs hover:bg-teal-200 transition-colors cursor-pointer"
          title="Mark this update as read"
        >
          <Sparkles className="w-3 h-3 text-teal-600" />
          <span>New Update</span>
        </button>
      )}

      {unreadMessageCount > 0 && (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-200/80 shadow-xs"
          title={`${unreadMessageCount} new staff reply`}
        >
          <MessageSquare className="w-3 h-3 text-blue-600" />
          <span>
            {unreadMessageCount} new {unreadMessageCount === 1 ? "reply" : "replies"}
          </span>
        </span>
      )}
    </div>
  );
}
