import { Link } from 'next-view-transitions';
import { ArrowRight, Calendar, Tag } from 'lucide-react';

async function getPosts() {
  try {
    const strapiFetchUrl = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';
    const res = await fetch(`${strapiFetchUrl}/api/posts?populate=*`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  } catch (error) {
    console.error(error);
    return { data: [] };
  }
}

async function getCategories() {
  try {
    const strapiFetchUrl = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';
    const res = await fetch(`${strapiFetchUrl}/api/categories`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  } catch (error) {
    console.error(error);
    return { data: [] };
  }
}

export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams.category?.toLowerCase() || 'all';
  const strapiBase = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

  const [postsRes, categoriesRes] = await Promise.all([
    getPosts(),
    getCategories()
  ]);

  const posts = postsRes.data || [];
  const cmsCategoriesRaw = categoriesRes.data || [];

  // Dynamically build category facets from CMS categories API & post data
  const dynamicCategoriesMap = new Map<string, { label: string; slug: string }>();

  const addCat = (name: string, rawSlug?: string) => {
    if (!name) return;
    const slug = rawSlug && rawSlug !== 'category' ? rawSlug.toLowerCase() : name.toLowerCase().replace(/\s+/g, '-');
    if (!dynamicCategoriesMap.has(slug)) {
      dynamicCategoriesMap.set(slug, { label: name, slug });
    }
  };

  cmsCategoriesRaw.forEach((cat: any) => {
    if (cat.name) addCat(cat.name, cat.slug);
  });

  posts.forEach((post: any) => {
    if (post.category?.name) addCat(post.category.name, post.category.slug);
  });

  const categories = [
    { label: 'All Showcases', slug: 'all' },
    ...Array.from(dynamicCategoriesMap.values())
  ];

  // Filter posts by category if specified
  const filteredPosts = activeCategory === 'all'
    ? posts
    : posts.filter((post: any) => {
        const catName = post.category?.name?.toLowerCase() || '';
        const catSlug = post.category?.slug?.toLowerCase() || '';
        const titleText = post.title?.toLowerCase() || '';
        const sanitizedCatSlug = catName.replace(/\s+/g, '-');
        return (
          catName === activeCategory ||
          catSlug === activeCategory ||
          sanitizedCatSlug === activeCategory ||
          catName.includes(activeCategory) ||
          catSlug.includes(activeCategory) ||
          titleText.includes(activeCategory)
        );
      });

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const remainingPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  const getImageUrl = (post: any) => {
    if (!post?.coverImage?.url) return null;
    return post.coverImage.url.startsWith('http') 
      ? post.coverImage.url 
      : `${strapiBase}${post.coverImage.url}`;
  };

  return (
    <div className="bg-slate-50 min-h-screen py-20 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Humble Page Header */}
        <div className="mb-12 text-center sm:text-left border-b border-slate-200 pb-10">
          <span className="text-blue-900 text-xs font-bold uppercase tracking-widest block mb-2">
            HouseForce Real Project Logs
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Completed Projects &amp; Quality Evidence
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl font-light leading-relaxed mb-8">
            Real site photos, reform walkthroughs, and property care notes written directly by Paul, Paige, Skippy, and Jake.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.slug || (activeCategory === 'all' && cat.slug === 'all');
              return (
                <Link
                  key={cat.slug}
                  href={cat.slug === 'all' ? '/blog' : `/blog?category=${cat.slug}`}
                  className={`text-xs font-bold px-4 py-2 rounded-full border transition-colors ${
                    isActive 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Showcases Posted Yet</h3>
            <p className="text-slate-500 font-light text-sm">Check back soon for our latest project photos and updates from around Torrevieja.</p>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* Featured Post Card */}
            {featuredPost && (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <Link href={`/blog/${featuredPost.slug}`} className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-7 h-64 sm:h-80 lg:h-auto bg-slate-900 relative overflow-hidden">
                    {getImageUrl(featuredPost) ? (
                      <img 
                        src={getImageUrl(featuredPost)!} 
                        alt={featuredPost.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400 font-medium">
                        HouseForce Showcase
                      </div>
                    )}
                  </div>
                  <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        {featuredPost.category && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider border border-blue-100">
                            <Tag className="w-3 h-3 text-blue-700" />
                            {featuredPost.category.name}
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-medium inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(featuredPost.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 group-hover:text-blue-900 transition-colors leading-tight">
                        {featuredPost.title}
                      </h2>
                      <p className="text-slate-600 text-sm sm:text-base line-clamp-3 font-light leading-relaxed mb-6">
                        {featuredPost.content || 'Click to view full project details and photos.'}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 text-blue-900 font-bold text-sm group-hover:translate-x-1 transition-transform">
                      <span>Read Project Showcase</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Remaining Posts Grid */}
            {remainingPosts.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-8 tracking-tight">More Project Showcases</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {remainingPosts.map((post: any) => {
                    const coverUrl = getImageUrl(post);
                    return (
                      <Link href={`/blog/${post.slug}`} key={post.id} className="block group">
                        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col group-hover:-translate-y-1">
                          <div className="h-48 bg-slate-800 w-full overflow-hidden relative">
                            {coverUrl ? (
                              <img 
                                src={coverUrl} 
                                alt={post.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium text-sm">
                                HouseForce Showcase
                              </div>
                            )}
                          </div>
                          <div className="p-6 flex-grow flex flex-col justify-between">
                            <div>
                              {post.category && (
                                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 block">
                                  {post.category.name}
                                </span>
                              )}
                              <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-900 transition-colors leading-snug">
                                {post.title}
                              </h4>
                            </div>
                            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs font-medium">
                              <span>{new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                              <span className="text-blue-900 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                                Read <ArrowRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
