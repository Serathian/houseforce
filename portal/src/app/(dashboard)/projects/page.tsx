import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Link } from 'next-view-transitions';
import { formatDistanceToNow, parseISO } from "date-fns";
import { Hammer, MapPin, ChevronRight } from "lucide-react";

interface Project {
  id: number;
  documentId: string;
  title: string;
  address: string;
  projectStatus: "planning" | "in-progress" | "completed" | "on-hold";
  updatedAt: string;
}

async function getProjectsList(token: string): Promise<Project[]> {
  try {
    const strapiUrl = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL;
    const res = await fetch(`${strapiUrl}/api/projects`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 }
    });
    
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.strapiToken) redirect("/login");

  const projects = await getProjectsList(session.strapiToken);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header className="mb-8 flex items-center gap-4">
        <div className="p-3 bg-blue-900 text-white rounded-2xl shadow-sm shrink-0">
          <Hammer className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-blue-950 tracking-tight">My Projects</h1>
          <p className="text-slate-500 mt-1 font-medium">View and manage all your property developments.</p>
        </div>
      </header>

      {projects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
          <p className="text-slate-500">No projects found. Check back later.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link 
              key={project.id} 
              href={`/projects/${project.documentId}`}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  project.projectStatus === 'in-progress' ? 'bg-amber-100 text-amber-800' :
                  project.projectStatus === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                  project.projectStatus === 'on-hold' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {project.projectStatus.replace('-', ' ')}
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-slate-800 group-hover:text-blue-900 transition-colors mb-2">
                {project.title}
              </h2>
              
              <p className="text-sm text-slate-500 flex items-center mb-6">
                <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                <span className="truncate">{project.address || "No address"}</span>
              </p>
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  Updated {formatDistanceToNow(parseISO(project.updatedAt), { addSuffix: true })}
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
