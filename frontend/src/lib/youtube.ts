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

async function resolveChannelId(input: string): Promise<string | null> {
  const trimmed = input.trim();
  if (trimmed.startsWith('UC')) {
    return trimmed;
  }

  const handle = trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
  try {
    const res = await fetch(`https://www.youtube.com/${handle}`, {
      next: { revalidate: 86400 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HouseForceBot/1.0)',
      },
    });

    if (!res.ok) return null;
    const html = await res.text();
    const match =
      html.match(/"externalId":"(UC[a-zA-Z0-9_-]+)"/) ||
      html.match(/channel_id=(UC[a-zA-Z0-9_-]+)/);

    return match ? match[1] : null;
  } catch (err) {
    console.warn('[YouTube Feed] Failed to resolve handle to channel ID:', err);
    return null;
  }
}

/**
 * Fetches the latest YouTube videos from the public channel Atom/RSS feed.
 * Configured via YOUTUBE_CHANNEL_ID, YOUTUBE_HANDLE, or YOUTUBE_FEED_URL.
 * Supports both raw channel IDs (e.g. UCFVYXzp-BW5CxFI5GEdCZww) and handles (@HouseForceBiz).
 * If neither is configured, returns an empty array.
 */
export async function getYouTubeFeed(): Promise<YouTubeVideo[]> {
  const feedUrl = process.env.YOUTUBE_FEED_URL;
  const rawInput = process.env.YOUTUBE_CHANNEL_ID || process.env.YOUTUBE_HANDLE;
  const revalidateSeconds = Number(process.env.YOUTUBE_CACHE_REVALIDATE) || 3600; // 1 hour default

  if (!feedUrl && !rawInput) {
    return [];
  }

  let targetUrl = feedUrl;
  if (!targetUrl && rawInput) {
    const channelId = await resolveChannelId(rawInput);
    if (!channelId) {
      console.warn('[YouTube Feed] Could not resolve channel ID for input:', rawInput);
      return [];
    }
    targetUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  }

  if (!targetUrl) return [];

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

