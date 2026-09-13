'use client';

import { useState } from 'react';
import { FolderKanban, MessageSquare, Newspaper, Check, Loader2, AlertCircle } from 'lucide-react';
import { UserNotificationPreferences } from '@/types/user-preferences';

interface Props {
  initialPreferences?: UserNotificationPreferences | null;
}

export default function NotificationPreferencesSettingsForm({ initialPreferences }: Props) {
  const [notifyProjectUpdates, setNotifyProjectUpdates] = useState(
    initialPreferences?.notifyProjectUpdates ?? true
  );
  const [notifyUpdateMessages, setNotifyUpdateMessages] = useState(
    initialPreferences?.notifyUpdateMessages ?? true
  );
  const [notifyBlogPosts, setNotifyBlogPosts] = useState(
    initialPreferences?.notifyBlogPosts ?? true
  );

  const [savingField, setSavingField] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const updatePreference = async (field: 'notifyProjectUpdates' | 'notifyUpdateMessages' | 'notifyBlogPosts', value: boolean) => {
    setSavingField(field);
    setStatusMessage(null);

    if (field === 'notifyProjectUpdates') setNotifyProjectUpdates(value);
    if (field === 'notifyUpdateMessages') setNotifyUpdateMessages(value);
    if (field === 'notifyBlogPosts') setNotifyBlogPosts(value);

    try {
      const res = await fetch('/api/user-preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            [field]: value,
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update preference');
      }

      setStatusMessage({ type: 'success', text: 'Preferences updated successfully.' });
      setTimeout(() => {
        setStatusMessage((current) => (current?.type === 'success' ? null : current));
      }, 3000);
    } catch (err: unknown) {
      console.error('[Settings] Error saving preference:', err);
      // Revert local state
      if (field === 'notifyProjectUpdates') setNotifyProjectUpdates(!value);
      if (field === 'notifyUpdateMessages') setNotifyUpdateMessages(!value);
      if (field === 'notifyBlogPosts') setNotifyBlogPosts(!value);
      const message = err instanceof Error ? err.message : 'Failed to update preference. Please try again.';
      setStatusMessage({ type: 'error', text: message });
    } finally {
      setSavingField(null);
    }
  };

  return (
    <div className="space-y-4">
      {statusMessage && (
        <div
          className={`flex items-center gap-2 p-3 rounded-2xl text-xs font-semibold ${
            statusMessage.type === 'success'
              ? 'bg-teal-50 text-teal-800 border border-teal-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <Check className="w-4 h-4 text-teal-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          {statusMessage.text}
        </div>
      )}

      {/* Option 1: Project Updates */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-slate-50/80">
        <div className="flex items-start gap-3.5 pr-4">
          <div className="p-2 bg-slate-200/80 text-slate-700 rounded-xl mt-0.5 shrink-0">
            <FolderKanban className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">Project Milestones & Updates</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Receive email notifications when new project milestones, site logs, or photos are published.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {savingField === 'notifyProjectUpdates' && (
            <Loader2 className="w-4 h-4 text-teal-600 animate-spin" />
          )}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifyProjectUpdates}
              onChange={(e) => updatePreference('notifyProjectUpdates', e.target.checked)}
              disabled={savingField !== null}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>
      </div>

      {/* Option 2: Update Messages */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-slate-50/80">
        <div className="flex items-start gap-3.5 pr-4">
          <div className="p-2 bg-slate-200/80 text-slate-700 rounded-xl mt-0.5 shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">Discussion & Team Messages</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Get notified when HouseForce project team members post replies and discussion comments.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {savingField === 'notifyUpdateMessages' && (
            <Loader2 className="w-4 h-4 text-teal-600 animate-spin" />
          )}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifyUpdateMessages}
              onChange={(e) => updatePreference('notifyUpdateMessages', e.target.checked)}
              disabled={savingField !== null}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>
      </div>

      {/* Option 3: Blog Posts */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-slate-50/80">
        <div className="flex items-start gap-3.5 pr-4">
          <div className="p-2 bg-slate-200/80 text-slate-700 rounded-xl mt-0.5 shrink-0">
            <Newspaper className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">HouseForce Articles & Guides</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Stay informed with new architecture guides, renovation tips, and announcements published on our blog.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {savingField === 'notifyBlogPosts' && (
            <Loader2 className="w-4 h-4 text-teal-600 animate-spin" />
          )}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifyBlogPosts}
              onChange={(e) => updatePreference('notifyBlogPosts', e.target.checked)}
              disabled={savingField !== null}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
