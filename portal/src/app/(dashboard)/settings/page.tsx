import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings, User, Mail, Shield, AlertTriangle, Bell } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.strapiToken) redirect("/login");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <header className="flex items-center gap-4">
        <div className="p-3 bg-blue-900 text-white rounded-2xl shadow-sm shrink-0">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-blue-950 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your profile, preferences, and account security.</p>
        </div>
      </header>

      {/* Profile Details Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-teal-600" />
            Profile Information
          </h2>
          <p className="text-sm text-slate-500 mt-1">Your identity linked to HouseForce properties.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Full Name
            </label>
            <p className="text-slate-800 font-semibold">{session?.user?.name || "Customer"}</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Email Address
            </label>
            <p className="text-slate-800 font-semibold flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              {session?.user?.email || "No email available"}
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Account Type
            </label>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 uppercase tracking-wider">
              Customer
            </span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Authentication Provider
            </label>
            <p className="text-slate-800 font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-600" />
              Google OAuth
            </p>
          </div>
        </div>

        {/* TODO: Future Profile Extensions */}
        {/* TODO: Allow customers to edit phone number and emergency contact details synced to Strapi User profile */}
      </div>

      {/* Notifications & Preferences */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            Notification Preferences
          </h2>
          <p className="text-sm text-slate-500 mt-1">Choose how and when you receive construction updates.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <p className="font-semibold text-slate-800">Email notifications for new updates</p>
              <p className="text-xs text-slate-500 mt-0.5">Receive an email whenever a project milestone or log entry is published.</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              disabled
              className="h-5 w-5 rounded border-slate-300 text-teal-600 cursor-not-allowed opacity-75"
            />
          </div>
          {/* TODO: Wire up customer notification preference toggles to Strapi user settings API */}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white border border-red-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-red-100 pb-4">
          <h2 className="text-xl font-bold text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Danger Zone
          </h2>
          <p className="text-sm text-slate-500 mt-1">Actions related to account termination and personal data.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-red-50/50 border border-red-100">
          <div>
            <h3 className="text-sm font-bold text-red-900">Delete Account</h3>
            <p className="text-xs text-red-700/80 mt-1 max-w-md">
              Permanently remove your portal account and unlink your identity from project records. Active contracts remain subject to service agreement terms.
            </p>
          </div>

          {/* TODO: Implement account deletion request workflow or modal dialog to trigger Strapi user deletion/anonymization endpoint */}
          <button
            type="button"
            disabled
            className="px-5 py-2.5 rounded-xl bg-red-600/20 text-red-700 border border-red-200 text-xs font-bold uppercase tracking-wider cursor-not-allowed transition-all"
            title="Account deletion workflow coming soon"
          >
            Delete Account (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}
