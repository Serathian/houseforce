'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, FolderKanban, MessageSquare, Newspaper, X, Check, Loader2 } from 'lucide-react';
import { UserNotificationPreferences } from '@/types/user-preferences';

interface NotificationPreferencesModalProps {
  token?: string;
  initialPreferences?: UserNotificationPreferences;
  isOpenDefault?: boolean;
}

export default function NotificationPreferencesModal({
  token,
  initialPreferences,
  isOpenDefault = true,
}: NotificationPreferencesModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [notifyProjectUpdates, setNotifyProjectUpdates] = useState(
    initialPreferences?.notifyProjectUpdates ?? true
  );
  const [notifyUpdateMessages, setNotifyUpdateMessages] = useState(
    initialPreferences?.notifyUpdateMessages ?? true
  );
  const [notifyBlogPosts, setNotifyBlogPosts] = useState(
    initialPreferences?.notifyBlogPosts ?? true
  );

  const savePreferences = async (
    updates: {
      notifyProjectUpdates: boolean;
      notifyUpdateMessages: boolean;
      notifyBlogPosts: boolean;
      hasCompletedNotificationOnboarding: boolean;
    }
  ) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Use the Next.js proxy route if available, or direct Strapi if token provided
      const response = await fetch('/api/user-preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          data: updates,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to save preferences');
      }

      setIsOpen(false);
      router.refresh();
    } catch (err: unknown) {
      console.error('[NotificationPreferencesModal] Error saving preferences:', err);
      const message = err instanceof Error ? err.message : 'Failed to save preferences. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = () => {
    savePreferences({
      notifyProjectUpdates,
      notifyUpdateMessages,
      notifyBlogPosts,
      hasCompletedNotificationOnboarding: true,
    });
  };

  const handleSkip = () => {
    savePreferences({
      notifyProjectUpdates,
      notifyUpdateMessages,
      notifyBlogPosts,
      hasCompletedNotificationOnboarding: true,
    });
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-modal-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="h-2 w-full bg-gradient-to-r from-teal-500 via-teal-600 to-blue-900" />

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl ring-8 ring-teal-50/50">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100/70 text-teal-800 mb-1">
                  First Sign-in Setup
                </span>
                <h2
                  id="notification-modal-title"
                  className="text-xl font-bold text-slate-900 tracking-tight"
                >
                  Notification Preferences
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSkip}
              disabled={isSubmitting}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-slate-600 mt-3 font-normal leading-relaxed">
            Welcome to HouseForce! Personalize your notification preferences so you only receive updates that matter to you. You can adjust these anytime in account settings.
          </p>

          {/* Error Banner */}
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Preferences Options */}
          <div className="mt-6 space-y-3.5">
            {/* Option 1: Project Updates */}
            <label
              className={`flex items-start justify-between gap-4 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                notifyProjectUpdates
                  ? 'bg-teal-50/40 border-teal-200/80 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200/70 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                    notifyProjectUpdates
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <FolderKanban className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Project Updates
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Receive email notifications when new milestones, site photos, and progress logs are published.
                  </p>
                </div>
              </div>

              <div className="relative inline-flex items-center shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={notifyProjectUpdates}
                  onChange={(e) => setNotifyProjectUpdates(e.target.checked)}
                  disabled={isSubmitting}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </div>
            </label>

            {/* Option 2: Update Messages */}
            <label
              className={`flex items-start justify-between gap-4 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                notifyUpdateMessages
                  ? 'bg-teal-50/40 border-teal-200/80 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200/70 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                    notifyUpdateMessages
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Update Messages
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Get notified when our construction team replies to your discussions or posts comments.
                  </p>
                </div>
              </div>

              <div className="relative inline-flex items-center shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={notifyUpdateMessages}
                  onChange={(e) => setNotifyUpdateMessages(e.target.checked)}
                  disabled={isSubmitting}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </div>
            </label>

            {/* Option 3: Blog Posts */}
            <label
              className={`flex items-start justify-between gap-4 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                notifyBlogPosts
                  ? 'bg-teal-50/40 border-teal-200/80 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200/70 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                    notifyBlogPosts
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Newspaper className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    New Blog Posts
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Stay informed with architecture guides, renovation tips, and announcements published on our blog.
                  </p>
                </div>
              </div>

              <div className="relative inline-flex items-center shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={notifyBlogPosts}
                  onChange={(e) => setNotifyBlogPosts(e.target.checked)}
                  disabled={isSubmitting}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleSkip}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors text-center order-2 sm:order-1 disabled:opacity-50"
            >
              Skip for now
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-bold shadow-sm hover:shadow transition-all order-1 sm:order-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Preferences...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
