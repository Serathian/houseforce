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

  return (
    <article className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        {post.category && (
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2 block">
            {post.category.name}
          </span>
        )}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <p className="text-gray-500">
          Published on {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </header>

      {/* Render rich text content here. For now just dangerouslySetInnerHTML if it's HTML from Strapi, or render raw. */}
      <div className="prose prose-lg mx-auto" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
