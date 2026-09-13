import { notFound } from 'next/navigation';

interface StrapiAuthor {
  name: string;
  role: string;
  bio?: string;
  avatar?: { url: string };
  avatarUrl?: string;
}

interface StrapiCategory {
  name: string;
  slug: string;
}

interface StrapiPost {
  id: string | number;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  author?: StrapiAuthor;
  category?: StrapiCategory;
  categories?: StrapiCategory[];
  coverImage?: { url: string };
}

async function getPost(slug: string): Promise<StrapiPost | null> {
  try {
    const strapiFetchUrl = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';
    // Use filters[slug][$eq]=... instead of /api/posts/slug
    const res = await fetch(
      `${strapiFetchUrl}/api/posts?filters[slug][$eq]=${slug}&populate=*`, 
      { cache: 'no-store' }
    );
    if (!res.ok) throw new Error('Failed to fetch post');
    const json = await res.json();
    return json.data && json.data.length > 0 ? json.data[0] : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// In Next.js 15, params is a Promise
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const strapiBase = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';
  const coverUrl = post.coverImage?.url 
    ? (post.coverImage.url.startsWith('http') ? post.coverImage.url : `${strapiBase}${post.coverImage.url}`)
    : null;

  const categories: Array<{ name: string; slug: string }> = [];
  if (Array.isArray(post.categories) && post.categories.length > 0) {
    categories.push(...post.categories);
  }
  if (post.category && !categories.some(c => c.name === post.category?.name || c.slug === post.category?.slug)) {
    categories.push(post.category);
  }

  const author = post.author;
  const authorImage = author?.avatar?.url
    ? (author.avatar.url.startsWith('http') ? author.avatar.url : `${strapiBase}${author.avatar.url}`)
    : author?.avatarUrl || null;

  return (
    <article className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <header className="mb-10 text-center">
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {categories.map((c) => (
              <span key={c.slug || c.name} className="text-xs font-bold text-blue-900 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                {c.name}
              </span>
            ))}
          </div>
        )}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">{post.title}</h1>
        
        {/* Date & Author Metadata Bar */}
        <div className="flex items-center justify-center gap-3">
          {author ? (
            <>
              {authorImage && (
                <img 
                  src={authorImage} 
                  alt={author.name} 
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" 
                />
              )}
              <div className="text-left text-xs">
                <span className="font-bold text-slate-900 block">{author.name}</span>
                <span className="text-slate-500 font-light">
                  {author.role ? `${author.role} • ` : ''}
                  {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </>
          ) : (
            <div className="text-xs text-slate-500 font-light">
              {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          )}
        </div>
      </header>

      {coverUrl && (
        <div className="mb-12 rounded-3xl overflow-hidden shadow-lg max-h-[500px] border border-slate-200/80">
          <img src={coverUrl} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed whitespace-pre-line bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm mb-12">
        {post.content || 'No content provided.'}
      </div>

      {/* Author Bio Box - Hidden if no author exists */}
      {author && (
        <div className="bg-slate-100/70 rounded-3xl p-8 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-6">
          {authorImage && (
            <img 
              src={authorImage} 
              alt={author.name}
              className="w-20 h-20 rounded-2xl object-cover shrink-0 border-2 border-white shadow-md" 
            />
          )}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Written by</span>
            <h4 className="text-xl font-extrabold text-slate-900 mb-1">{author.name}</h4>
            {author.role && (
              <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">{author.role}</p>
            )}
            {author.bio && (
              <p className="text-slate-600 text-sm font-light leading-relaxed">
                {author.bio}
              </p>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
