import { Link } from 'next-view-transitions';
import { ArrowRight } from 'lucide-react';
import { constItems, keyItems } from '@/data/services';
import HeroBlogCard from '@/components/blog/HeroBlogCard';
import BlogCard from '@/components/blog/BlogCard';

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
  isPinned?: boolean;
  author?: StrapiAuthor;
  category?: StrapiCategory;
  categories?: StrapiCategory[];
  coverImage?: { url: string };
}

async function getPosts() {
  try {
    const strapiFetchUrl = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';
    // Sort by isPinned:desc first, then createdAt:desc
    const res = await fetch(`${strapiFetchUrl}/api/posts?sort[0]=isPinned:desc&sort[1]=createdAt:desc&populate=*`, { cache: 'no-store' });
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

  // Sort raw posts: pinned posts first, then newest first
  const posts = [...rawPosts].sort((a, b) => {
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

  // If a category was requested via search params (e.g. from service page icons),
  // ensure it appears in the filter tabs even if no CMS posts have been published for it yet
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

  // Filter posts by category if specified
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

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const remainingPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  const getImageUrl = (post: StrapiPost) => {
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
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Showcases in This Category Yet</h3>
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
        ) : (
          <div className="space-y-16">
            
            {/* Hero / Highlight Card (Pinned post displayed first) */}
            {featuredPost && (
              <HeroBlogCard 
                post={featuredPost}
                categories={getPostCategories(featuredPost)}
                imageUrl={getImageUrl(featuredPost)}
                strapiBase={strapiBase}
              />
            )}

            {/* Remaining Posts Grid */}
            {remainingPosts.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-8 tracking-tight">More Project Showcases</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {remainingPosts.map((post: StrapiPost) => (
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
          </div>
        )}
      </div>
    </div>
  );
}
