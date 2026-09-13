import { Heart, MessageCircle, Send, Bookmark, MapPin, ArrowUpRight } from 'lucide-react';
import {
  houseforceInstagramProfile,
  type InstagramPost,
  type InstagramProfile,
} from '@/data/instagram';

interface InstagramBlogCardProps {
  post: InstagramPost;
  profile?: InstagramProfile;
}

export default function InstagramBlogCard({
  post,
  profile = houseforceInstagramProfile,
}: InstagramBlogCardProps) {
  const handle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || profile.handle;
  const profileUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || profile.profileUrl;
  const targetUrl = post.permalink || profileUrl;
  const displayTitle = post.title || post.caption.split('.')[0] || `Live from @${handle}`;

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block group h-full"
      title={`View post on Instagram: @${handle}`}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col group-hover:-translate-y-0.5 relative">
        {/* Subtle Signature Instagram Gradient Top Line */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600" />

        {/* Picture Container with Service & Instagram Tags */}
        <div className="h-52 bg-slate-900 w-full overflow-hidden relative">
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Instagram Brand Tag on Top Left of Picture */}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-950/80 text-rose-300 border border-rose-500/30 backdrop-blur-md shadow-sm">
              {/* Instagram Glyph */}
              <svg
                className="w-3 h-3 text-rose-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span>Instagram</span>
            </span>
          </div>

          {/* Location Tag on Top Right of Picture */}
          {post.location && (
            <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 bg-slate-950/80 backdrop-blur-md text-slate-200 border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm">
              <MapPin className="w-2.5 h-2.5 text-amber-400" />
              <span className="truncate max-w-[120px]">{post.location}</span>
            </div>
          )}

          {/* Hover Overlay Icon */}
          <div className="absolute inset-0 bg-slate-950/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="p-2.5 rounded-full bg-slate-950/80 backdrop-blur-sm text-white shadow-md">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 flex-grow flex flex-col justify-between">
          <div>
            {/* Tag Pill & Timestamp */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1.5">
                {post.tag && (
                  <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {post.tag}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                {post.timestamp}
              </span>
            </div>

            {/* Post Title matching BlogCard typography */}
            <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-rose-900 transition-colors leading-snug">
              {displayTitle}
            </h4>

            {/* Caption excerpt */}
            <p className="text-slate-600 text-sm font-light line-clamp-2 leading-relaxed mb-4">
              {post.caption}
            </p>

            {/* Instagram Social Engagement Bar */}
            <div className="flex items-center justify-between text-slate-500 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-3.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>{post.likes}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{post.comments}</span>
                </span>
                <span className="text-slate-400">
                  <Send className="w-3 h-3" />
                </span>
              </div>
              <span className="text-slate-400">
                <Bookmark className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Card Footer: Profile Info + Instagram Link */}
          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs font-medium">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-[1.5px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 rounded-full shrink-0">
                <div className="p-[1px] bg-white rounded-full">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-slate-700 font-semibold truncate max-w-[120px]">
                @{handle}
              </span>
            </div>

            <span className="text-rose-600 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 shrink-0">
              View on Instagram <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
