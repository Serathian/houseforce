import { Link } from 'next-view-transitions';
import { ArrowRight, PhoneCall, FileText, Landmark, ShieldCheck, Camera } from 'lucide-react';

export interface BlogCategory {
  name: string;
  slug: string;
}

export interface BlogAuthor {
  name: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
  avatar?: { url: string };
}

export interface BlogPostItem {
  id: string | number;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  serviceType?: 'construction' | 'keyholding';
  isAnchor?: boolean;
  isPinned?: boolean;
  author?: BlogAuthor;
  category?: BlogCategory;
  categories?: BlogCategory[];
  coverImage?: { url: string };
}

interface CategoryAnchorCardProps {
  post: BlogPostItem;
  categories: BlogCategory[];
  imageUrl: string | null;
  strapiBase: string;
  categoryName: string;
}

export default function CategoryAnchorCard({ 
  post, 
  categories, 
  imageUrl, 
  categoryName 
}: CategoryAnchorCardProps) {
  const isKeyholding = post.serviceType === 'keyholding';

  return (
    <section aria-label="Category Anchor" className="mb-14">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Top Header: Integrated Service Division Identity & Category with Subtle Division Coloring */}
        <div className={`px-6 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-white border-b ${
          isKeyholding 
            ? 'bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 border-teal-900/40' 
            : 'bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 border-blue-900/40'
        }`}>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs tracking-wider uppercase text-slate-100">
              {categoryName}
            </span>
            {categories.length > 1 && (
              <span className="text-slate-400 text-xs hidden sm:inline">
                • {categories.map(c => c.name).filter(n => n.toLowerCase() !== categoryName.toLowerCase()).join(', ')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-slate-300">
            <span className={`w-2 h-2 rounded-full ${isKeyholding ? 'bg-teal-400' : 'bg-blue-400'}`} />
            <span>{isKeyholding ? 'Keyholding & Property Care' : 'Construction & Reforming'}</span>
          </div>
        </div>

        {/* Editorial Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Column: Clean Real Site Photography */}
          <Link 
            href={`/blog/${post.slug}`} 
            className="lg:col-span-6 relative overflow-hidden bg-slate-900 min-h-[340px] sm:min-h-[420px] block group/img"
          >
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover/img:scale-[1.01] transition-transform duration-700" 
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <span className="text-white font-bold text-lg">HouseForce Project Showcase</span>
                <span className="text-xs mt-1 text-slate-400">
                  {isKeyholding ? 'Keyholding & Property Care' : 'Construction & Reforming'}
                </span>
              </div>
            )}
          </Link>

          {/* Right Column: Authentic Editorial Pitch */}
          <div className="lg:col-span-6 p-7 sm:p-9 lg:p-11 flex flex-col justify-between bg-white">
            <div>
              {/* Anchor Headline */}
              <Link href={`/blog/${post.slug}`} className="block group/title">
                <h2 className={`text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 transition-colors leading-tight tracking-tight ${
                  isKeyholding ? 'group-hover/title:text-teal-900' : 'group-hover/title:text-blue-900'
                }`}>
                  {post.title}
                </h2>
              </Link>

              {/* Grounded Contractor Copy */}
              <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed mb-6">
                {post.content || 'Read about our working standards, local building permissions, and how we handle this service with honest pricing and direct oversight.'}
              </p>

              {/* 4 Distinct Assurance Badges */}
              <div className="bg-slate-50/90 rounded-2xl border border-slate-200/80 p-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`p-1.5 rounded-lg shrink-0 ${isKeyholding ? 'bg-teal-100 text-teal-800' : 'bg-blue-100 text-blue-800'}`}>
                      <FileText className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <strong className="text-slate-900 block font-semibold leading-none mb-0.5">Fixed Itemised Quotes</strong>
                      <span className="text-slate-500 text-[11px] leading-tight">Zero surprise extras</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className={`p-1.5 rounded-lg shrink-0 ${isKeyholding ? 'bg-teal-100 text-teal-800' : 'bg-blue-100 text-blue-800'}`}>
                      <Landmark className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <strong className="text-slate-900 block font-semibold leading-none mb-0.5">
                        {isKeyholding ? 'Alarmed Key Custody' : 'Town Hall Permits'}
                      </strong>
                      <span className="text-slate-500 text-[11px] leading-tight">
                        {isKeyholding ? 'Direct logged custody' : 'Licencia de Obra handled'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className={`p-1.5 rounded-lg shrink-0 ${isKeyholding ? 'bg-teal-100 text-teal-800' : 'bg-blue-100 text-blue-800'}`}>
                      <Camera className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <strong className="text-slate-900 block font-semibold leading-none mb-0.5">Client Portal Logs</strong>
                      <span className="text-slate-500 text-[11px] leading-tight">Photo &amp; milestone notes</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className={`p-1.5 rounded-lg shrink-0 ${isKeyholding ? 'bg-teal-100 text-teal-800' : 'bg-blue-100 text-blue-800'}`}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <strong className="text-slate-900 block font-semibold leading-none mb-0.5">Direct Oversight</strong>
                      <span className="text-slate-500 text-[11px] leading-tight">Signed off on-site</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Clean Dual CTAs */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-medium py-3 px-5 rounded-full text-xs shadow-sm hover:shadow transition-all text-center"
              >
                <PhoneCall className={`w-3.5 h-3.5 ${isKeyholding ? 'text-teal-700' : 'text-blue-900'}`} />
                <span>Book a Quote / Get in Touch</span>
              </Link>

              <Link
                href={`/blog/${post.slug}`}
                className={`inline-flex items-center justify-center gap-2 ${
                  isKeyholding 
                    ? 'bg-teal-900 hover:bg-teal-800' 
                    : 'bg-slate-900 hover:bg-slate-800'
                } text-white font-medium py-3 px-6 rounded-full text-xs shadow-sm hover:shadow transition-all text-center`}
              >
                <span>Read About What We Can Do For You</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
