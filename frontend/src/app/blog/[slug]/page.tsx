import { notFound } from 'next/navigation';

async function getPost(slug: string) {
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

  // Determine team author details dynamically
  const authorName = post.authorName || (
    post.category?.name?.toLowerCase().includes('keyholding') || post.title?.toLowerCase().includes('key') ? 'Paige Reddy' :
    post.category?.name?.toLowerCase().includes('permit') || post.title?.toLowerCase().includes('license') ? 'Gabriel "Skippy"' :
    post.category?.name?.toLowerCase().includes('tech') || post.title?.toLowerCase().includes('web') ? 'Jake Reddy' : 'Paul Reddy'
  );

  const authorRole = (
    authorName === 'Paige Reddy' ? 'Keyholding & Property Care Manager' :
    authorName === 'Gabriel "Skippy"' ? 'Operations & Local Liaison' :
    authorName === 'Jake Reddy' ? 'Head of Digital Systems' : 'Founder & Master Contractor'
  );

  const authorImage = (
    authorName === 'Paige Reddy' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop' :
    authorName === 'Gabriel "Skippy"' ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop' :
    authorName === 'Jake Reddy' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop' :
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop'
  );

  return (
    <article className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <header className="mb-10 text-center">
        {post.category && (
          <span className="text-xs font-bold text-blue-900 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
            {post.category.name}
          </span>
        )}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">{post.title}</h1>
        
        {/* Author Metadata Bar */}
        <div className="flex items-center justify-center gap-3">
          <img 
            src={authorImage} 
            alt={authorName} 
            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
          />
          <div className="text-left text-xs">
            <span className="font-bold text-slate-900 block">{authorName}</span>
            <span className="text-slate-500 font-light">{authorRole} • {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
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

      {/* Author Bio Box */}
      <div className="bg-slate-100/70 rounded-3xl p-8 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-6">
        <img 
          src={authorImage} 
          alt={authorName}
          className="w-20 h-20 rounded-2xl object-cover shrink-0 border-2 border-white shadow-md" 
        />
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Written by</span>
          <h4 className="text-xl font-extrabold text-slate-900 mb-1">{authorName}</h4>
          <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">{authorRole}</p>
          <p className="text-slate-600 text-sm font-light leading-relaxed">
            Part of the HouseForce family team in Torrevieja. We document our real site work and property management to give homeowners 100% transparency.
          </p>
        </div>
      </div>
    </article>
  );
}
