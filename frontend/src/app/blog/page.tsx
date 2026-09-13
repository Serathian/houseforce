import { Fragment } from 'react';
import { Link } from 'next-view-transitions';
import { ArrowRight, Pin, Clock } from 'lucide-react';
import { constItems, keyItems } from '@/data/services';
import CategoryAnchorCard from '@/components/blog/CategoryAnchorCard';
import BlogCard from '@/components/blog/BlogCard';
import InstagramBlogCard from '@/components/blog/InstagramBlogCard';
import { getInstagramFeed } from '@/lib/instagram';

interface StrapiAuthor {
  name: string;
  role: string;
  avatarUrl?: string;
  avatar?: { url: string };
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
  serviceType?: 'construction' | 'keyholding';
  isAnchor?: boolean;
  isPinned?: boolean;
  author?: StrapiAuthor;
  category?: StrapiCategory;
  categories?: StrapiCategory[];
  coverImage?: { url: string };
}

async function getPosts() {
  try {
    const strapiFetchUrl = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';
    // Sort by isAnchor:desc, isPinned:desc, then createdAt:desc
    const res = await fetch(
      `${strapiFetchUrl}/api/posts?sort[0]=isAnchor:desc&sort[1]=isPinned:desc&sort[2]=createdAt:desc&populate=*`, 
      { cache: 'no-store' }
    );
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
  searchParams: Promise<{ category?: string; view?: string }>;
}) {
  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams.category?.toLowerCase() || 'all';
  const activeView = resolvedParams.view?.toLowerCase() === 'pinned' ? 'pinned' : 'recent';
  const strapiBase = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

  const [postsRes, categoriesRes, instagramFeed] = await Promise.all([
    getPosts(),
    getCategories(),
    getInstagramFeed(),
  ]);

  const rawPosts: StrapiPost[] = postsRes.data || [];
  const cmsCategoriesRaw = categoriesRes.data || [];

  // Helper to extract all categories assigned to a post
  const getPostCategories = (post: StrapiPost): StrapiCategory[] => {
    const cats: StrapiCategory[] = [];
    if (Array.isArray(post.categories) && post.categories.length > 0) {
      cats.push(...post.categories);
    }
    if (post.category && !cats.some(c => c.name === post.category?.name || c.slug === post.category?.slug)) {
      cats.push(post.category);
    }
    return cats;
  };

  // Sort posts: anchors first, then pinned posts, then chronological (most recent first)
  const posts = [...rawPosts].sort((a, b) => {
    if (Boolean(a.isAnchor) !== Boolean(b.isAnchor)) {
      return a.isAnchor ? -1 : 1;
    }
    if (Boolean(a.isPinned) !== Boolean(b.isPinned)) {
      return a.isPinned ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Dynamically build category facets from CMS categories API & post data
  const dynamicCategoriesMap = new Map<string, { label: string; slug: string }>();

  const addCat = (name: string, rawSlug?: string) => {
    if (!name) return;
    const slug = rawSlug && rawSlug !== 'category' ? rawSlug.toLowerCase() : name.toLowerCase().replace(/\s+/g, '-');
    if (!dynamicCategoriesMap.has(slug)) {
      dynamicCategoriesMap.set(slug, { label: name, slug });
    }
  };

  cmsCategoriesRaw.forEach((cat: StrapiCategory) => {
    if (cat.name) addCat(cat.name, cat.slug);
  });

  posts.forEach((post: StrapiPost) => {
    const postCats = getPostCategories(post);
    postCats.forEach((c) => {
      if (c.name) addCat(c.name, c.slug);
    });
  });

  // If a category was requested via search params, ensure it appears in filter tabs
  if (activeCategory !== 'all' && !dynamicCategoriesMap.has(activeCategory)) {
    const knownItem = [...constItems, ...keyItems].find(item => item.categorySlug === activeCategory);
    const label = knownItem 
      ? knownItem.label 
      : activeCategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    dynamicCategoriesMap.set(activeCategory, { label, slug: activeCategory });
  }

  const categories = [
    { label: 'All Showcases', slug: 'all' },
    ...Array.from(dynamicCategoriesMap.values())
  ];

  // Filter posts by active category
  const filteredPosts = activeCategory === 'all'
    ? posts
    : posts.filter((post: StrapiPost) => {
        const postCats = getPostCategories(post);
        const titleText = post.title?.toLowerCase() || '';

        const matchesCategory = postCats.some((c) => {
          const catName = c.name?.toLowerCase() || '';
          const catSlug = c.slug?.toLowerCase() || '';
          const sanitizedCatSlug = catName.replace(/\s+/g, '-');
          return (
            catName === activeCategory ||
            catSlug === activeCategory ||
            sanitizedCatSlug === activeCategory ||
            catName.includes(activeCategory) ||
            catSlug.includes(activeCategory)
          );
        });

        return matchesCategory || titleText.includes(activeCategory);
      });

  const currentCategoryObj = categories.find(c => c.slug === activeCategory);
  const activeCategoryLabel = currentCategoryObj && currentCategoryObj.slug !== 'all' ? currentCategoryObj.label : undefined;

  // The anchor page is shown as the hero piece at the top of the blog page when a filter is applied
  const anchorPost = activeCategory !== 'all' 
    ? filteredPosts.find((p) => p.isAnchor) || null 
    : null;

  // Candidate posts for the listing (excluding the anchor post if it is displayed in the hero)
  const candidatePosts = anchorPost 
    ? filteredPosts.filter((p) => p.id !== anchorPost.id) 
    : filteredPosts;

  // Split into pinned and chronological regular posts
  const pinnedPosts = candidatePosts.filter((p) => p.isPinned);
  const regularPosts = candidatePosts.filter((p) => !p.isPinned);

  const getImageUrl = (post: StrapiPost) => {
    if (!post?.coverImage?.url) return null;
    return post.coverImage.url.startsWith('http') 
      ? post.coverImage.url 
      : `${strapiBase}${post.coverImage.url}`;
  };

  // Helper to build links preserving the active view
  const getCategoryHref = (catSlug: string) => {
    const base = catSlug === 'all' ? '/blog' : `/blog?category=${catSlug}`;
    if (activeView === 'pinned') {
      return catSlug === 'all' ? '/blog?view=pinned' : `${base}&view=pinned`;
    }
    return base;
  };

  const getViewHref = (viewMode: 'recent' | 'pinned') => {
    if (activeCategory === 'all') {
      return viewMode === 'pinned' ? '/blog?view=pinned' : '/blog';
    }
    return viewMode === 'pinned' 
      ? `/blog?category=${activeCategory}&view=pinned` 
      : `/blog?category=${activeCategory}`;
  };

  const INSTAGRAM_FEED_INTERVAL = Number(process.env.NEXT_PUBLIC_INSTAGRAM_FEED_INTERVAL) || 6;

  return (
    <div className="bg-slate-50 min-h-screen py-20 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Page Header */}
        <div className="mb-10 text-center sm:text-left border-b border-slate-200 pb-10">
          <span className="text-blue-900 text-xs font-bold uppercase tracking-widest block mb-2">
            {activeCategoryLabel ? `${activeCategoryLabel} • Project Logs & Standards` : 'HouseForce Project Logs'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            {activeCategoryLabel ? `${activeCategoryLabel} in Costa Blanca` : 'Completed Projects & Quality Evidence'}
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl font-light leading-relaxed mb-8">
            {activeCategoryLabel 
              ? `Real project walkthroughs, working standards, and site evidence for ${activeCategoryLabel.toLowerCase()} in Torrevieja.`
              : 'Real site photos, reform walkthroughs, and property care notes written directly by Paul, Paige, Skippy, and Jake.'}
          </p>

          {/* Category Filter Pills & View Toggles */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.slug || (activeCategory === 'all' && cat.slug === 'all');
                return (
                  <Link
                    key={cat.slug}
                    href={getCategoryHref(cat.slug)}
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

            {/* View Mode Toggle: Most Recent (default) vs All Pinned */}
            <div className="flex items-center self-start md:self-auto bg-slate-200/80 p-1 rounded-full text-xs font-semibold shrink-0">
              <Link
                href={getViewHref('recent')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                  activeView === 'recent'
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Most Recent</span>
              </Link>
              <Link
                href={getViewHref('pinned')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                  activeView === 'pinned'
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Pin className="w-3.5 h-3.5" />
                <span>All Pinned</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Category Anchor Hero: Only displayed when a category filter is applied */}
        {anchorPost && (
          <CategoryAnchorCard 
            post={anchorPost}
            categories={getPostCategories(anchorPost)}
            imageUrl={getImageUrl(anchorPost)}
            strapiBase={strapiBase}
            categoryName={activeCategoryLabel || 'Service'}
          />
        )}

        {/* Main Content Area */}
        {posts.length === 0 ? (
          <div className="space-y-12">
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Project Logs Posted Yet</h3>
              <p className="text-slate-500 font-light text-sm">Check back soon for our latest project photos and updates from around Torrevieja.</p>
            </div>
            <div className="max-w-md mx-auto">
              <InstagramBlogCard post={instagramFeed[0]} />
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="space-y-12">
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Project Logs in This Category Yet</h3>
              <p className="text-slate-500 font-light text-sm mb-6">
                We haven&apos;t published case studies for this specific service category yet. Check back soon or view all our completed project logs.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors shadow-sm"
              >
                View All Showcases <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="max-w-md mx-auto">
              <InstagramBlogCard post={instagramFeed[0]} />
            </div>
          </div>
        ) : activeView === 'pinned' ? (
          /* "All Pinned" View State */
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Pin className="w-4 h-4 text-blue-900" />
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {activeCategory !== 'all' ? `Pinned ${activeCategoryLabel} Project Logs` : 'All Pinned Project Logs'}
              </h3>
            </div>

            {pinnedPosts.length === 0 ? (
              <div className="space-y-12">
                <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-md mx-auto shadow-sm">
                  <p className="text-slate-500 font-light text-sm mb-4">No pinned project logs currently found in this category.</p>
                  <Link
                    href={getViewHref('recent')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:underline"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Switch back to Most Recent</span>
                  </Link>
                </div>
                <div className="max-w-md mx-auto">
                  <InstagramBlogCard post={instagramFeed[0]} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pinnedPosts.map((post: StrapiPost, index: number) => {
                  const shouldShowInstagramCard =
                    (index + 1) % INSTAGRAM_FEED_INTERVAL === 0 ||
                    (pinnedPosts.length < INSTAGRAM_FEED_INTERVAL && index === pinnedPosts.length - 1);
                  const igIndex = Math.floor(index / INSTAGRAM_FEED_INTERVAL) % instagramFeed.length;
                  const igPost = instagramFeed[igIndex] || instagramFeed[0];

                  return (
                    <Fragment key={post.id}>
                      <BlogCard 
                        post={post}
                        categories={getPostCategories(post)}
                        imageUrl={getImageUrl(post)}
                        strapiBase={strapiBase}
                      />
                      {shouldShowInstagramCard && (
                        <InstagramBlogCard post={igPost} />
                      )}
                    </Fragment>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Default "Most Recent" View: Pinned Posts followed by Chronological Posts */
          <div className="space-y-14">
            
            {/* Pinned Posts: Highlighted after the anchor / top */}
            {pinnedPosts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Pin className="w-4 h-4 text-blue-900" />
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {activeCategory !== 'all' ? `Highlighted ${activeCategoryLabel} Projects` : 'Highlighted Projects'}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pinnedPosts.map((post: StrapiPost) => (
                    <BlogCard 
                      key={post.id}
                      post={post}
                      categories={getPostCategories(post)}
                      imageUrl={getImageUrl(post)}
                      strapiBase={strapiBase}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Standard Posts in Chronological Order */}
            {regularPosts.length > 0 ? (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">
                  {activeCategory !== 'all' ? `More ${activeCategoryLabel} Project Logs` : 'Recent Project Logs & Updates'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post: StrapiPost, index: number) => {
                    const shouldShowInstagramCard =
                      (index + 1) % INSTAGRAM_FEED_INTERVAL === 0 ||
                      (regularPosts.length < INSTAGRAM_FEED_INTERVAL && index === regularPosts.length - 1);
                    const igIndex = Math.floor(index / INSTAGRAM_FEED_INTERVAL) % instagramFeed.length;
                    const igPost = instagramFeed[igIndex] || instagramFeed[0];

                    return (
                      <Fragment key={post.id}>
                        <BlogCard 
                          post={post}
                          categories={getPostCategories(post)}
                          imageUrl={getImageUrl(post)}
                          strapiBase={strapiBase}
                        />
                        {shouldShowInstagramCard && (
                          <InstagramBlogCard post={igPost} />
                        )}
                      </Fragment>
                    );
                  })}
                </div>
              </div>
            ) : pinnedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <InstagramBlogCard post={instagramFeed[0]} />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
