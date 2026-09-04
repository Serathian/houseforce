"use client";

import { useState } from "react";
import { Link } from "next-view-transitions";
import { MessageSquare, X, Mail, Hammer, Key, ChevronUp } from "lucide-react";

export default function FloatingCTA() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-none">
      {/* Expanded Menu */}
      {isOpen && (
        <div className="pointer-events-auto mb-3 w-80 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-slate-200/90 text-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Contact HouseForce</h4>
              <p className="text-[11px] text-slate-500 font-light">Torrevieja & Orihuela Costa</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close contact menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Paul Direct */}
            <a 
              href="mailto:paul@houseforce.biz"
              className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/70 hover:bg-blue-50 border border-blue-100 transition-colors group"
            >
              <div className="p-2 bg-blue-900 text-white rounded-lg shrink-0 mt-0.5">
                <Hammer className="w-4 h-4" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-blue-950">Paul Reddy</span>
                  <span className="text-[10px] text-blue-800 font-semibold bg-blue-100 px-1.5 py-0.5 rounded">Construction</span>
                </div>
                <p className="text-[11px] text-slate-600 truncate font-light">paul@houseforce.biz</p>
              </div>
            </a>

            {/* Paige Direct */}
            <a 
              href="mailto:paige@houseforce.biz"
              className="flex items-start gap-3 p-3 rounded-xl bg-teal-50/70 hover:bg-teal-50 border border-teal-100 transition-colors group"
            >
              <div className="p-2 bg-teal-800 text-white rounded-lg shrink-0 mt-0.5">
                <Key className="w-4 h-4" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-teal-950">Paige Reddy</span>
                  <span className="text-[10px] text-teal-800 font-semibold bg-teal-100 px-1.5 py-0.5 rounded">Keyholding</span>
                </div>
                <p className="text-[11px] text-slate-600 truncate font-light">paige@houseforce.biz</p>
              </div>
            </a>

            {/* General Contact Button */}
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm transition-colors mt-2"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Online Inquiry Form</span>
            </Link>
          </div>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-full shadow-xl border border-slate-700/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 group active:scale-95"
        aria-label="Toggle floating contact menu"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-400"></span>
        </span>
        <MessageSquare className="w-4 h-4 text-slate-200 group-hover:text-white transition-colors" />
        <span className="text-xs font-bold tracking-wide">Get in Touch</span>
        <ChevronUp className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}
