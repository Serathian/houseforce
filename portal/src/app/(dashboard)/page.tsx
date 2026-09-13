import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Link } from 'next-view-transitions';
import SupportTriggerButton from "@/components/SupportTriggerButton";


// Types based on the Strapi schema we built
interface ProjectUpdate {
  id: number;
  title: string;
  content: string; // richtext
  date: string;
  createdAt: string;
}

interface Project {
  id: number;
  documentId: string;
  title: string;
  address: string;
  projectStatus: "planning" | "in-progress" | "completed" | "on-hold";
  updates: ProjectUpdate[];
  updatedAt: string;
}

async function getProjects(token: string): Promise<Project[]> {
  const strapiUrl = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL;
  let res: Response;

  try {
    res = await fetch(`${strapiUrl}/api/projects?populate=updates`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 },
    });
  } catch (error) {
    console.error("[Portal] Network error fetching projects:", error);
    return [];
  }

  if (res.status === 401) {
    redirect("/login?error=SessionExpired");
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    console.warn(`[Portal] Failed to fetch projects (${res.status}):`, errorText);
    return [];
  }

  const json = await res.json().catch(() => ({}));
  return json.data || [];
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.strapiToken) {
    redirect("/login");
  }

  const projects = await getProjects(session.strapiToken);

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-blue-950 tracking-tight">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'Customer'}
        </h1>
        <p className="text-slate-500 mt-1">Here is the latest overview of your properties.</p>
      </header>

      {projects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 sm:p-14 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800">No projects yet — but they&apos;re coming!</h3>
          <p className="text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">
            We&apos;re in the process of getting everything set up for you. Your project will appear here shortly once it&apos;s been linked to your account.
          </p>
          <p className="text-slate-400 mt-4 text-sm max-w-sm mx-auto">
            Think something&apos;s not right?{" "}
            <a
              href="mailto:support@houseforce.biz?subject=Portal%20Project%20Access"
              className="text-amber-600 font-semibold hover:underline"
            >
              Reach out to us
            </a>{" "}
            and we&apos;ll sort it out.
          </p>
          <SupportTriggerButton />
        </div>
      ) : (
        projects.map((project) => {
          // Find the most recent update if it exists
          const latestUpdate = project.updates?.length > 0 
            ? project.updates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
            : null;

          return (
            <div key={project.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {project.projectStatus.replace('-', ' ')}
                    </span>
                    <span className="text-slate-400 text-sm font-medium">
                      Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">{project.title}</h2>
                  <p className="text-slate-500 mt-1">{project.address || "No address specified"}</p>
                </div>
                <Link href={`/projects/${project.documentId}`} className="inline-block bg-slate-100 text-slate-700 hover:bg-blue-950 hover:text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shrink-0 text-center">
                  View Updates
                </Link>
              </div>
              
              {/* Latest Update Highlight */}
              {latestUpdate && (
                <div className="bg-slate-50 p-6 sm:p-8">
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 mb-3">Latest Update</h3>
                  <div className="flex gap-4 items-start">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0 animate-pulse"></div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{latestUpdate.title}</h4>
                      {/* Note: Strapi richtext would need to be parsed properly. We're truncating/rendering raw text safely for now */}
                      <p className="text-slate-600 mt-1 leading-relaxed line-clamp-3">
                        {latestUpdate.content || "An update was posted to your project."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
