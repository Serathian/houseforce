"use client";

import { createContext, useContext, useState } from "react";

interface SupportContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const SupportContext = createContext<SupportContextValue | null>(null);

export function SupportProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SupportContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </SupportContext.Provider>
  );
}

export function useSupportPopup() {
  const ctx = useContext(SupportContext);
  if (!ctx) throw new Error("useSupportPopup must be used inside SupportProvider");
  return ctx;
}
