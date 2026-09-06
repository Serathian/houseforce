import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Sidebar userName={session?.user?.name} />

      {/* Full-width content — pt-16 clears the fixed hamburger button */}
      <main className="flex-1 bg-slate-50/50">
        <div className="max-w-5xl mx-auto p-4 pb-20 sm:p-6 sm:pb-20 lg:p-8 lg:pb-20">
          {children}
        </div>
      </main>
    </>
  );
}


