import { Link } from 'next-view-transitions';
import { ArrowRight, Pin } from 'lucide-react';
import type { BlogPostItem, BlogCategory } from './HeroBlogCard';

interface BlogCardProps {
  post: BlogPostItem;
  categories: BlogCategory[];
  imageUrl: string | null;
  strapiBase: string;
}

export default function BlogCard({ post, categories, imageUrl, strapiBase }: BlogCardProps) {
  const author = post.author;
  const authorImage = author?.avatar?.url
    ? (author.avatar.url.startsWith('http') ? author.avatar.url : `${strapiBase}${author.avatar.url}`)
    : author?.avatarUrl || null;

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col group-hover:-translate-y-1">
        <div className="h-52 bg-slate-800 w-full overflow-hidden relative">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium text-sm">
              HouseForce Showcase
            </div>
          )}
          {post.isPinned && (
            <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 bg-amber-400 text-slate-950 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
              <Pin className="w-3 h-3 fill-slate-950" />
              <span>Pinned</span>
            </div>
          )}
        </div>
        
        <div className="p-6 flex-grow flex flex-col justify-between">
          <div>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {categories.map((c) => (
                  <span key={c.slug || c.name} className="text-[11px] font-bold text-blue-800 bg-blue-50/80 border border-blue-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {c.name}
                  </span>
                ))}
              </div>
            )}
            <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-900 transition-colors leading-snug">
              {post.title}
            </h4>
            <p className="text-slate-600 text-sm font-light line-clamp-2 mb-4 leading-relaxed">
              {post.content || 'Click to view project details and site photos.'}
            </p>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs font-medium">
            {author ? (
              <div className="flex items-center gap-2">
                {authorImage && (
                  <img src={authorImage} alt={author.name} className="w-5 h-5 rounded-full object-cover" />
                )}
                <span className="text-slate-600 font-semibold truncate max-w-[120px]">{author.name}</span>
              </div>
            ) : (
              <span>{new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            )}
            
            <span className="text-blue-900 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
              Read <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
