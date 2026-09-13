export interface InstagramPost {
  id: string;
  title?: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  permalink: string;
  timestamp: string;
  tag: string;
  location?: string;
  likedBy?: string;
}

export interface InstagramProfile {
  handle: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  followersCount: string;
  postsCount: number;
  profileUrl: string;
}

export const defaultInstagramProfile: InstagramProfile = {
  handle: 'houseforcespain',
  displayName: 'HouseForce',
  avatarUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=200&auto=format&fit=crop',
  bio: 'British craftsmanship & dedicated property care in Torrevieja. Full villa reforms, luxury kitchens & trusted keyholding. 🔨🔑',
  followersCount: '2.8k',
  postsCount: 194,
  profileUrl: 'https://www.instagram.com/houseforcespain',
};

interface RawInstagramMediaItem {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  like_count?: number;
  comments_count?: number;
}

interface InstagramApiResponse {
  data?: RawInstagramMediaItem[];
  error?: {
    message: string;
    type: string;
    code: number;
  };
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

function parsePostContent(caption: string = ''): { title: string; tag: string; cleanCaption: string } {
  const trimmed = caption.trim();
  if (!trimmed) {
    return {
      title: 'HouseForce Project Update',
      tag: 'Project Showcase',
      cleanCaption: 'Check out our latest reform and property care work in Torrevieja.',
    };
  }

  // Extract first hashtag for tag badge if present
  const hashtagMatch = trimmed.match(/#([a-zA-Z0-9_]+)/);
  const rawTag = hashtagMatch ? hashtagMatch[1] : '';
  const tag = rawTag
    ? rawTag.replace(/([A-Z])/g, ' $1').trim()
    : 'Costa Blanca Reform';

  // Extract first line or sentence as card title
  const firstLine = trimmed.split('\n')[0].trim();
  const firstSentence = firstLine.split(/[.!?](\s|$)/)[0].trim();
  const title =
    firstSentence.length > 5 && firstSentence.length <= 80
      ? firstSentence
      : firstLine.slice(0, 65).trim() + (firstLine.length > 65 ? '...' : '');

  return {
    title,
    tag,
    cleanCaption: trimmed,
  };
}

/**
 * Fetches the live Instagram feed from Instagram Graph API or an external webhook/proxy URL.
 * If no access token or feed URL is configured, returns an empty array (feed is not displayed).
 */
export async function getInstagramFeed(): Promise<InstagramPost[]> {
  const customFeedUrl = process.env.INSTAGRAM_FEED_URL;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const revalidateSeconds = Number(process.env.INSTAGRAM_CACHE_REVALIDATE) || 3600; // 1 hour default

  // If no live feed configuration is present, do not display the feed
  if (!customFeedUrl && !accessToken) {
    return [];
  }

  try {
    const fetchUrl = customFeedUrl || 
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count&access_token=${accessToken}`;

    const res = await fetch(fetchUrl, {
      next: { revalidate: revalidateSeconds },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.warn(`[Instagram Feed] Live fetch failed (${res.status}):`, errorText);
      return [];
    }

    const payload: InstagramApiResponse = await res.json();

    if (payload.error) {
      console.warn('[Instagram Feed] API returned error:', payload.error.message);
      return [];
    }

    if (!payload.data || !Array.isArray(payload.data) || payload.data.length === 0) {
      return [];
    }

    // Transform live Instagram items to InstagramPost interface
    const transformedPosts: InstagramPost[] = payload.data
      .filter((item) => item.media_url || item.thumbnail_url)
      .map((item, index) => {
        const imageUrl = item.media_type === 'VIDEO' 
          ? (item.thumbnail_url || item.media_url || '') 
          : (item.media_url || '');

        const { title, tag, cleanCaption } = parsePostContent(item.caption);

        return {
          id: item.id || `live-ig-${index}`,
          title,
          imageUrl,
          caption: cleanCaption,
          likes: typeof item.like_count === 'number' ? item.like_count : 0,
          comments: typeof item.comments_count === 'number' ? item.comments_count : 0,
          permalink: item.permalink || 'https://www.instagram.com/houseforcespain',
          timestamp: formatRelativeTime(item.timestamp),
          tag,
          location: 'Torrevieja & Costa Blanca',
        };
      });

    return transformedPosts;
  } catch (error) {
    console.error('[Instagram Feed] Network error during live fetch:', error);
    return [];
  }
}

/**
 * Retrieves Instagram profile information.
 */
export async function getInstagramProfile(): Promise<InstagramProfile> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!accessToken) {
    return defaultInstagramProfile;
  }

  try {
    const res = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken}`,
      { next: { revalidate: 86400 } } // 24 hours
    );

    if (res.ok) {
      const data = await res.json();
      if (data.username) {
        return {
          ...defaultInstagramProfile,
          handle: data.username,
          postsCount: data.media_count || defaultInstagramProfile.postsCount,
        };
      }
    }
  } catch {
    // Ignore error and fall back
  }

  return defaultInstagramProfile;
}
