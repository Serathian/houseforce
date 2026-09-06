"use client";

import { useState } from "react";
import { MessageSquare, X, Mail, LifeBuoy } from "lucide-react";
import { useSession } from "next-auth/react";

export default function SupportCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  // Hide for authenticated users — they have the nav menu pill instead
  if (status === "loading" || session) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-none">
      {/* Expanded Menu */}
      {isOpen && (
        <div className="pointer-events-auto mb-3 w-80 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-slate-200/90 text-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Portal Support</h4>
              <p className="text-[11px] text-slate-500 font-light">Having login issues?</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close support menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              If you are unable to log in, or don't see your projects listed, your email may not be linked to your properties yet.
            </p>

            <a 
              href="mailto:support@houseforce.biz?subject=Portal%20Access%20Issue"
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 transition-colors group"
            >
              <div className="p-2 bg-blue-900 text-white rounded-lg shrink-0 mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-blue-950">Email Support</span>
                </div>
                <p className="text-[11px] text-slate-600 truncate font-light mt-0.5">support@houseforce.biz</p>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto flex items-center gap-2.5 bg-white hover:bg-slate-50 text-slate-800 px-4 py-3 rounded-full shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 group active:scale-95"
        aria-label="Toggle support menu"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
        </span>
        <LifeBuoy className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
        <span className="text-xs font-bold tracking-wide">Need Help?</span>
      </button>
    </div>
  );
}
