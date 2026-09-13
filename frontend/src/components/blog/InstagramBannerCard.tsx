import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import {
  houseforceInstagramProfile,
  houseforceInstagramFeed,
  type InstagramPost,
  type InstagramProfile,
} from '@/data/instagram';

interface InstagramBannerCardProps {
  className?: string;
  profile?: InstagramProfile;
  posts?: InstagramPost[];
  itemsCount?: number;
}

export default function InstagramBannerCard({
  className = '',
  profile = houseforceInstagramProfile,
  posts = houseforceInstagramFeed,
  itemsCount = 3,
}: InstagramBannerCardProps) {
  const displayPosts = posts.slice(0, itemsCount);
  const handle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || profile.handle;
  const profileUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || profile.profileUrl;

  return (
    <section
      aria-label="HouseForce Instagram Feed"
      className={`col-span-full my-6 ${className}`}
    >
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300">
        
        {/* Subtle Signature Instagram Gradient Line */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600" />

        <div className="p-6 sm:p-8">
          {/* Seamless Integration Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              {/* Instagram Story Gradient Ring around Avatar */}
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 rounded-full shrink-0 group"
                title={`Visit @${handle} on Instagram`}
              >
                <div className="p-[2px] bg-white rounded-full">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                </div>
              </a>

              <div>
                <div className="flex items-center gap-2">
                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-slate-900 hover:text-slate-700 transition-colors"
                  >
                    @{handle}
                  </a>
                  {/* Verified badge style indicator */}
                  <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-teal-600 text-white text-[9px] font-bold">
                    ✓
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-light mt-0.5">
                  Live on-site stories &amp; reform updates from Torrevieja &amp; Orihuela Costa
                </p>
              </div>
            </div>

            {/* Seamless Instagram Channel Link */}
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/80 px-4 py-2 rounded-full transition-all self-start sm:self-auto"
            >
              {/* Instagram Glyph */}
              <svg
                className="w-3.5 h-3.5 text-rose-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span>View on Instagram</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </a>
          </div>

          {/* Instagram Post Cards (Authentic Instagram Post Styling) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* 1. Post Header: Avatar, Handle, Location & Options */}
                <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-[1.5px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 rounded-full shrink-0">
                      <div className="p-[1px] bg-white rounded-full">
                        <img
                          src={profile.avatarUrl}
                          alt={profile.handle}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="min-w-0 leading-tight">
                      <a
                        href={post.permalink || profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-slate-900 truncate block hover:underline"
                      >
                        {handle}
                      </a>
                      {post.location && (
                        <span className="text-[10px] text-slate-400 truncate block font-light">
                          {post.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <a
                    href={post.permalink || profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-600 p-1"
                    title="Open on Instagram"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </a>
                </div>

                {/* 2. Photo with Service Tag */}
                <div className="relative aspect-square bg-slate-950 overflow-hidden group">
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Subtle Service Tag */}
                  <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-950/70 text-white backdrop-blur-md border border-white/10 shadow-xs">
                      {post.tag}
                    </span>
                  </div>

                  {/* Subtle Instagram Icon on Hover */}
                  <a
                    href={post.permalink || profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <span className="p-3 rounded-full bg-slate-900/80 backdrop-blur-sm shadow-md">
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </span>
                  </a>
                </div>

                {/* 3. Post Actions Bar: Like, Comment, Send, Bookmark */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-slate-700">
                    <div className="flex items-center gap-3.5">
                      <button
                        type="button"
                        aria-label="Like"
                        className="text-slate-700 hover:text-rose-500 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <a
                        href={post.permalink || profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Comment"
                        className="text-slate-700 hover:text-blue-600 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                      <a
                        href={post.permalink || profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share"
                        className="text-slate-700 hover:text-slate-900 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </a>
                    </div>

                    <button
                      type="button"
                      aria-label="Save"
                      className="text-slate-700 hover:text-slate-900 transition-colors"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 4. Likes Count */}
                  <div className="text-xs font-bold text-slate-900">
                    {post.likedBy ? (
                      <span>
                        Liked by <span className="font-extrabold">{post.likedBy}</span> and {post.likes} others
                      </span>
                    ) : (
                      <span>{post.likes} likes</span>
                    )}
                  </div>

                  {/* 5. Caption Preview with Bold Username */}
                  <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                    <span className="font-bold text-slate-900 mr-1.5">{handle}</span>
                    {post.caption}
                  </p>

                  {/* 6. Timestamp & View Link */}
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    <span>{post.timestamp}</span>
                    <a
                      href={post.permalink || profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-blue-900 lowercase font-normal"
                    >
                      view post
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Minimal Bottom Bar */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-light">
            <span>
              Real site progress and property walkthroughs from our team.
            </span>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 hover:underline"
            >
              <span>Follow @{handle}</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
