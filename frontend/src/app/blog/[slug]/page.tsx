import { notFound } from 'next/navigation';

async function getPost(slug: string) {
  try {
    const res = await fetch(`http://127.0.0.1:1337/api/posts?filters[slug][$eq]=${slug}&populate=*`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch post');
    }
    const json = await res.json();
    return json.data[0];
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

  return (
    <article className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        {post.category && (
          <span className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2 block">
            {post.category.name}
          </span>
        )}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">{post.title}</h1>
        <p className="text-slate-500 font-medium">
          Published on {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>

      {coverUrl && (
        <div className="mb-12 rounded-3xl overflow-hidden shadow-xl max-h-[500px]">
          <img src={coverUrl} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed whitespace-pre-line bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-sm">
        {post.content || 'No content provided.'}
      </div>
    </article>
  );
}
