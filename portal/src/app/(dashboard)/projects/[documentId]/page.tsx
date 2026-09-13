import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { format, parseISO } from "date-fns";
import { Link } from 'next-view-transitions';
import { ArrowLeft, MapPin, Calendar, Clock, Image as ImageIcon } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { UpdateThread } from "@/components/UpdateThread";

interface UpdateMessage {
  id: number;
  documentId: string;
  content: string;
  authorType: 'staff' | 'client';
  staffName?: string;
  createdAt: string;
}

interface ProjectUpdate {
  id: number;
  documentId: string;
  title: string;
  content: string;
  date: string;
  createdAt: string;
  messages?: UpdateMessage[];
}

interface Project {
  id: number;
  documentId: string;
  title: string;
  address: string;
  projectStatus: "planning" | "in-progress" | "completed" | "on-hold";
  updates: ProjectUpdate[];
  createdAt: string;
  updatedAt: string;
}

async function getProject(documentId: string, token: string): Promise<Project | null> {
  const strapiUrl = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL;
  let res: Response;

  try {
    // Querying explicitly by documentId to be safe, now populating updates and their messages
    res = await fetch(`${strapiUrl}/api/projects?filters[documentId][$eq]=${documentId}&populate[updates][populate][0]=messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 }
    });
  } catch (error) {
    console.error("[Portal] Network error fetching project:", error);
    return null;
  }

  if (res.status === 401) {
    redirect("/login?error=SessionExpired");
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    console.warn(`[Portal] Failed to fetch project (${res.status}):`, errorText);
    return null;
  }

  const json = await res.json().catch(() => ({}));
  return json.data?.[0] || null;
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ documentId: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.strapiToken) {
    redirect("/login");
  }

  const { documentId } = await params;
  const project = await getProject(documentId, session.strapiToken);

  if (!project) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">Project Not Found</h2>
        <p className="text-slate-500 mt-2">The project you are looking for does not exist or you do not have access.</p>
        <Link href="/" className="inline-block mt-6 px-6 py-3 bg-blue-950 text-white rounded-full font-semibold hover:bg-blue-900 transition-colors">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Sort updates newest first
  const sortedUpdates = [...(project.updates || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header Navigation */}
      <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-900 transition-colors mb-6 group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      {/* Project Header */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{project.title}</h1>
            <div className="flex items-center text-slate-500 mt-3 font-medium">
              <MapPin className="w-4 h-4 mr-2 text-slate-400" />
              {project.address || "No address specified"}
            </div>
          </div>
          <div className="shrink-0">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest ${
              project.projectStatus === 'in-progress' ? 'bg-amber-100 text-amber-800' :
              project.projectStatus === 'completed' ? 'bg-emerald-100 text-emerald-800' :
              project.projectStatus === 'on-hold' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {project.projectStatus.replace('-', ' ')}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Started</p>
            <p className="text-slate-800 font-semibold">{format(parseISO(project.createdAt), 'MMM d, yyyy')}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Last Update</p>
            <p className="text-slate-800 font-semibold">{format(parseISO(project.updatedAt), 'MMM d, yyyy')}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Logs</p>
            <p className="text-slate-800 font-semibold">{project.updates?.length || 0} Entries</p>
          </div>
        </div>
      </div>

      {/* Updates Feed */}
      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-6 flex items-center">
        <Clock className="w-6 h-6 mr-3 text-teal-600" />
        Project Timeline
      </h2>

      {sortedUpdates.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 border-dashed">
          <p className="text-slate-500 font-medium">No updates have been posted for this project yet.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-6 space-y-10 pb-10">
          {sortedUpdates.map((update) => (
            <div key={update.id} className="relative pl-8 sm:pl-12">
              {/* Timeline Node */}
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-teal-500 shadow-sm"></div>
              
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-900 transition-colors">
                    {update.title}
                  </h3>
                  <span className="flex items-center text-sm font-semibold text-slate-400 bg-slate-50 px-3 py-1 rounded-full w-fit">
                    <Calendar className="w-4 h-4 mr-2" />
                    {format(parseISO(update.date || update.createdAt), 'MMMM d, yyyy')}
                  </span>
                </div>
                
                {update.content && (
                  <div className="prose prose-slate prose-sm sm:prose-base prose-a:text-teal-600 prose-headings:text-slate-800 max-w-none">
                    <ReactMarkdown>{update.content}</ReactMarkdown>
                  </div>
                )}

                <UpdateThread 
                  updateId={update.id} 
                  initialMessages={update.messages} 
                  token={session.strapiToken || ""} 
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
