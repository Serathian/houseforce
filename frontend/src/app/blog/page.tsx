import { Link } from 'next-view-transitions';

async function getPosts() {
  try {
    const res = await fetch('http://127.0.0.1:1337/api/posts?populate=*', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  } catch (error) {
    console.error(error);
    return { data: [] };
  }
}

export default async function Blog() {
  const { data: posts } = await getPosts();

  return (
    <div className="bg-slate-50 min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-4 text-center tracking-tight">Showcases & Reviews</h1>
        <p className="text-xl text-slate-500 text-center mb-16 max-w-2xl mx-auto font-light">
          Explore our latest construction projects, product reviews, and insights from Torrevieja.
        </p>
        
        {posts.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center max-w-2xl mx-auto">
            <svg className="mx-auto h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Posts Yet</h3>
            <p className="text-slate-500">Check back soon for our latest updates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post: any) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="block group">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 h-full flex flex-col">
                  <div className="h-56 bg-slate-200 w-full object-cover group-hover:opacity-90 transition-opacity flex items-center justify-center text-slate-400 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                    <span className="relative z-10">{post.coverImage ? 'Image' : 'No Cover'}</span>
                  </div>
                  <div className="p-8 flex-grow flex flex-col">
                    {post.category && (
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3 block">
                        {post.category.name}
                      </span>
                    )}
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                      {post.title}
                    </h2>
                    <div className="mt-auto">
                      <p className="text-slate-400 text-sm font-medium">
                        {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
