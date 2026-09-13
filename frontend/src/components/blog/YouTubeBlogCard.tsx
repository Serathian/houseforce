import { Play, ArrowUpRight, Eye } from 'lucide-react';
import type { YouTubeVideo } from '@/lib/youtube';

interface YouTubeBlogCardProps {
  video: YouTubeVideo;
}

export default function YouTubeBlogCard({ video }: YouTubeBlogCardProps) {
  return (
    <a
      href={video.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="block group h-full"
      title={`Watch "${video.title}" on YouTube`}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col group-hover:-translate-y-0.5 relative">
        {/* YouTube Red Accent Top Line */}
        <div className="h-1 w-full bg-red-600" />

        {/* Video Thumbnail Area */}
        <div className="h-52 bg-slate-950 w-full overflow-hidden relative">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* YouTube Brand Tag on Top Left */}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-950/85 text-red-400 border border-red-500/30 backdrop-blur-md shadow-sm">
              <svg className="w-3.5 h-2.5 fill-red-500" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>YouTube</span>
            </span>
          </div>

          {/* View Count Tag on Top Right if Available */}
          {video.views && (
            <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 bg-slate-950/85 backdrop-blur-md text-slate-200 border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm">
              <Eye className="w-2.5 h-2.5 text-red-400" />
              <span>{video.views}</span>
            </div>
          )}

          {/* Central Play Button Overlay */}
          <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-red-600/90 group-hover:bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 pl-0.5">
              <Play className="w-5 h-5 fill-white text-white" />
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 flex-grow flex flex-col justify-between">
          <div>
            {/* Tag & Timestamp */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Video Walkthrough
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                {video.relativeTime}
              </span>
            </div>

            {/* Video Title */}
            <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors leading-snug line-clamp-2">
              {video.title}
            </h4>

            {/* Excerpt */}
            <p className="text-slate-600 text-sm font-light line-clamp-2 leading-relaxed mb-4">
              {video.description}
            </p>
          </div>

          {/* Card Footer: Channel & Watch Link */}
          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs font-medium">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
                <Play className="w-2.5 h-2.5 fill-white" />
              </div>
              <span className="text-slate-700 font-semibold truncate max-w-[130px]">
                {video.channelTitle}
              </span>
            </div>

            <span className="text-red-600 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 shrink-0">
              Watch Video <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
