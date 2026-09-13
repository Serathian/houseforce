"use client";

import { LifeBuoy } from "lucide-react";
import { useSupportPopup } from "./SupportContext";

export default function SupportTriggerButton() {
  const { open } = useSupportPopup();
  return (
    <button
      onClick={open}
      className="inline-flex items-center gap-2 mt-6 px-5 py-3 bg-white border border-slate-200 rounded-xl shadow-sm text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:shadow-md transition-all duration-200 active:scale-95"
    >
      <LifeBuoy className="w-4 h-4 text-amber-500" />
      Give us a shout
    </button>
  );
}
