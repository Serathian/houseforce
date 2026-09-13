export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  permalink: string;
  channelTitle: string;
  views?: string;
  relativeTime: string;
}

function formatRelativeTime(timestampStr?: string): string {
  if (!timestampStr) return 'RECENT';
  try {
    const postDate = new Date(timestampStr);
    const now = new Date();
    const diffMs = now.getTime() - postDate.getTime();
    if (isNaN(diffMs)) return 'RECENT';

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays <= 0) {
      return diffHours <= 1 ? 'JUST NOW' : `${diffHours} HOURS AGO`;
    }
    if (diffDays === 1) return 'YESTERDAY';
    if (diffDays < 7) return `${diffDays} DAYS AGO`;
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks === 1) return '1 WEEK AGO';
    if (diffWeeks < 5) return `${diffWeeks} WEEKS AGO`;
    return postDate.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  } catch {
    return 'RECENT';
  }
}

function decodeXmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'");
}

/**
 * Parses a YouTube public Atom feed XML into an array of YouTubeVideo objects.
 * Uses a lightweight regex extraction without needing external xml parsers.
 */
function parseYouTubeAtomFeed(xml: string): YouTubeVideo[] {
  const videos: YouTubeVideo[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match: RegExpExecArray | null;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entryBlock = match[1];

    // Extract Video ID
    const videoIdMatch = entryBlock.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
    const id = videoIdMatch ? videoIdMatch[1].trim() : '';
    if (!id) continue;

    // Extract Title
    const titleMatch = entryBlock.match(/<title>(.*?)<\/title>/);
    const rawTitle = titleMatch ? titleMatch[1].trim() : 'HouseForce Video';
    const title = decodeXmlEntities(rawTitle);

    // Extract Description
    const descMatch = entryBlock.match(/<media:description>([\s\S]*?)<\/media:description>/);
    const rawDesc = descMatch ? descMatch[1].trim() : '';
    const description = decodeXmlEntities(rawDesc);

    // Extract Published timestamp
    const pubMatch = entryBlock.match(/<published>(.*?)<\/published>/);
    const publishedAt = pubMatch ? pubMatch[1].trim() : '';

    // Extract Channel Name
    const authorMatch = entryBlock.match(/<author>[\s\S]*?<name>(.*?)<\/name>/);
    const channelTitle = authorMatch ? decodeXmlEntities(authorMatch[1].trim()) : 'HouseForce';

    // Extract Views count if present
    const viewsMatch = entryBlock.match(/<media:statistics views="(\d+)"/);
    const rawViews = viewsMatch ? Number(viewsMatch[1]) : undefined;
    const views = rawViews !== undefined
      ? rawViews > 1000 ? `${(rawViews / 1000).toFixed(1)}k views` : `${rawViews} views`
      : undefined;

    // High quality thumbnail fallback
    const thumbnailUrl = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    const permalink = `https://www.youtube.com/watch?v=${id}`;

    videos.push({
      id,
      title,
      description: description || 'Watch our latest villa reform walkthrough and property care video on YouTube.',
      thumbnailUrl,
      publishedAt,
      permalink,
      channelTitle,
      views,
      relativeTime: formatRelativeTime(publishedAt),
    });
  }

  return videos;
}

/**
 * Fetches the latest YouTube videos from the public channel Atom/RSS feed.
 * Configured via YOUTUBE_CHANNEL_ID (or YOUTUBE_FEED_URL).
 * If neither is configured, returns an empty array.
 */
export async function getYouTubeFeed(): Promise<YouTubeVideo[]> {
  const feedUrl = process.env.YOUTUBE_FEED_URL;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  const revalidateSeconds = Number(process.env.YOUTUBE_CACHE_REVALIDATE) || 3600; // 1 hour default

  if (!feedUrl && !channelId) {
    return [];
  }

  const targetUrl = feedUrl || `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

  try {
    const res = await fetch(targetUrl, {
      next: { revalidate: revalidateSeconds },
      headers: {
        'User-Agent': 'HouseForce-Blog-Feed/1.0 (+https://houseforcespain.com)',
      },
    });

    if (!res.ok) {
      console.warn(`[YouTube Feed] Fetch failed (${res.status}) for URL:`, targetUrl);
      return [];
    }

    const xml = await res.text();
    const videos = parseYouTubeAtomFeed(xml);
    return videos;
  } catch (error) {
    console.error('[YouTube Feed] Network error during fetch:', error);
    return [];
  }
}
