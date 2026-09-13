"use client";

import React, { useState, useEffect } from "react";
import { useNotifications } from "./NotificationsContext";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Bell,
  X,
  CheckCheck,
  Check,
  Hammer,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

export default function NotificationFeedDrawer() {
  const {
    notifications,
    unreadCount,
    isDrawerOpen,
    closeDrawer,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<"unread" | "all">("unread");
  const router = useRouter();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Lock body scroll when open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "unread") return !item.read;
    return true;
  });

  const handleNotificationClick = (item: (typeof notifications)[0]) => {
    if (!item.read) {
      markAsRead(item.id);
    }
    closeDrawer();
    if (item.projectDocumentId) {
      router.push(`/projects/${item.projectDocumentId}`);
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={closeDrawer}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-over Drawer Panel */}
      <aside
        aria-label="Notification Feed"
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-900 text-white flex items-center justify-center shadow-sm">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-slate-900 text-lg tracking-tight">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="bg-amber-500 text-white text-xs font-extrabold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Activity from your projects & discussions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 hover:bg-teal-50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
            <button
              onClick={closeDrawer}
              aria-label="Close notification panel"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-100 flex items-center gap-2 shrink-0 bg-white">
          <button
            onClick={() => setActiveTab("unread")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "unread"
                ? "bg-blue-950 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>Unread</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "unread"
                  ? "bg-blue-800 text-blue-100"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {unreadCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "all"
                ? "bg-blue-950 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>All</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "all"
                  ? "bg-blue-800 text-blue-100"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {notifications.length}
            </span>
          </button>
        </div>

        {/* Feed List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <CheckCheck className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">
                {activeTab === "unread"
                  ? "All caught up!"
                  : "No notifications yet"}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {activeTab === "unread"
                  ? "You have reviewed all latest updates and messages across your projects."
                  : "When your project team posts new updates or discussion replies, they will appear here."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isUpdate = notif.type === "project_update";
              const timeAgo = notif.createdAt
                ? formatDistanceToNow(parseISO(notif.createdAt), { addSuffix: true })
                : "";

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`relative p-4 rounded-xl border transition-all cursor-pointer group ${
                    notif.read
                      ? "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                      : "bg-blue-50/50 border-blue-200 hover:border-blue-300 hover:bg-blue-50 shadow-xs"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-white ${
                        isUpdate
                          ? "bg-teal-600 shadow-sm"
                          : "bg-blue-700 shadow-sm"
                      }`}
                    >
                      {isUpdate ? (
                        <Hammer className="w-4 h-4" />
                      ) : (
                        <MessageSquare className="w-4 h-4" />
                      )}
                    </div>

                    {/* Notification body */}
                    <div className="flex-1 min-w-0">
                      {/* Project pill & timestamp */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="inline-block text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-md truncate max-w-[190px]">
                          {notif.projectTitle}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 shrink-0">
                          {timeAgo}
                        </span>
                      </div>

                      {/* Title */}
                      <h4
                        className={`text-sm tracking-tight truncate mb-1 ${
                          notif.read
                            ? "font-semibold text-slate-800 group-hover:text-blue-900"
                            : "font-extrabold text-blue-950"
                        }`}
                      >
                        {notif.title}
                      </h4>

                      {/* Snippet */}
                      {notif.snippet && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {notif.snippet}
                        </p>
                      )}
                    </div>

                    {/* Unread indicator / mark-read button */}
                    <div className="shrink-0 flex flex-col items-center justify-between gap-2 self-stretch">
                      {!notif.read ? (
                        <>
                          <span
                            className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100 shrink-0 animate-pulse"
                            title="Unread notification"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notif.id);
                            }}
                            title="Mark as read"
                            className="p-1 rounded-md text-slate-400 hover:text-teal-700 hover:bg-slate-100 transition-colors opacity-70 group-hover:opacity-100"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all mt-1" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50 shrink-0">
            <p className="text-[11px] text-slate-400 font-medium">
              Clicking a notification takes you directly to that project update.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
