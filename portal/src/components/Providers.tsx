"use client";

import { SessionProvider } from "next-auth/react";
import { SupportProvider } from "./SupportContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SupportProvider>
        {children}
      </SupportProvider>
    </SessionProvider>
  );
}
