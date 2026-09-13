import { Link } from 'next-view-transitions';
import { ArrowRight, Calendar, Pin, Tag } from 'lucide-react';

export interface BlogCategory {
  name: string;
  slug: string;
}

export interface BlogAuthor {
  name: string;
  role: string;
  avatarUrl?: string;
  avatar?: { url: string };
}

export interface BlogPostItem {
  id: string | number;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  isPinned?: boolean;
  author?: BlogAuthor;
  category?: BlogCategory;
  categories?: BlogCategory[];
  coverImage?: { url: string };
}

interface HeroBlogCardProps {
  post: BlogPostItem;
  categories: BlogCategory[];
  imageUrl: string | null;
  strapiBase: string;
}

export default function HeroBlogCard({ post, categories, imageUrl, strapiBase }: HeroBlogCardProps) {
  const author = post.author;
  const authorImage = author?.avatar?.url
    ? (author.avatar.url.startsWith('http') ? author.avatar.url : `${strapiBase}${author.avatar.url}`)
    : author?.avatarUrl || null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
      <Link href={`/blog/${post.slug}`} className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-7 h-72 sm:h-96 lg:h-auto bg-slate-900 relative overflow-hidden min-h-[280px]">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400 font-medium">
              HouseForce Showcase
            </div>
          )}
          {post.isPinned && (
            <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide shadow-md uppercase">
              <Pin className="w-3.5 h-3.5 fill-slate-950" />
              <span>Pinned Highlight</span>
            </div>
          )}
        </div>
        <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {categories.map((cat) => (
                <span key={cat.slug || cat.name} className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider border border-blue-100">
                  <Tag className="w-3 h-3 text-blue-700" />
                  {cat.name}
                </span>
              ))}
              <span className="text-xs text-slate-400 font-medium inline-flex items-center gap-1 ml-auto sm:ml-0">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 group-hover:text-blue-900 transition-colors leading-tight">
              {post.title}
            </h2>
            
            <p className="text-slate-600 text-sm sm:text-base line-clamp-3 font-light leading-relaxed mb-6">
              {post.content || 'Click to view full project details, specifications, and before/after photos.'}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {author ? (
              <div className="flex items-center gap-2.5">
                {authorImage && (
                  <img src={authorImage} alt={author.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                )}
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">{author.name}</span>
                  {author.role && <span className="text-slate-500 font-light block">{author.role}</span>}
                </div>
              </div>
            ) : (
              <div></div>
            )}

            <div className="inline-flex items-center gap-2 text-blue-900 font-bold text-sm group-hover:translate-x-1 transition-transform">
              <span>Read Highlight</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
