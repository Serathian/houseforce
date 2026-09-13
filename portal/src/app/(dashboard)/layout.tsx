import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar userName={session?.user?.name} />

      {/* Content area — takes remaining width on desktop, full-width on mobile */}
      <main className="flex-1 bg-slate-50/50 min-w-0">
        <div className="max-w-5xl mx-auto p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 lg:pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}



