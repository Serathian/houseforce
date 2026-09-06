import { Link } from 'next-view-transitions';
import { LogOut, Home, FileText, Settings, Hammer } from 'lucide-react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="flex flex-col md:flex-row flex-1">
      {/* Portal Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col md:h-screen sticky top-0">
        <div className="h-20 flex items-center px-6 border-b border-slate-100 shrink-0">
          <span className="text-2xl font-extrabold text-blue-900 tracking-tight">
            House<span className="text-teal-600">Force</span><span className="text-amber-500">.</span>
          </span>
        </div>
        
        <div className="px-6 py-4 border-b border-slate-100">
          <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-1">Customer Portal</p>
          <p className="text-sm font-semibold text-slate-700 truncate">{session?.user?.name || "Customer"}</p>
        </div>

        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg bg-blue-950 text-white shadow-sm hover:bg-blue-900 transition-all">
            <Home className="w-5 h-5 text-blue-300" />
            Dashboard
          </Link>
          <Link href="/projects" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg text-slate-600 hover:bg-slate-50 hover:text-blue-900 transition-colors">
            <Hammer className="w-5 h-5 text-slate-400" />
            My Projects
          </Link>
          <Link href="/invoices" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg text-slate-600 hover:bg-slate-50 hover:text-blue-900 transition-colors">
            <FileText className="w-5 h-5 text-slate-400" />
            Invoices
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg text-slate-600 hover:bg-slate-50 hover:text-blue-900 transition-colors">
            <Settings className="w-5 h-5 text-slate-400" />
            Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-100 shrink-0">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-sm font-semibold rounded-lg text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Portal Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
