import { useParams, Link } from 'react-router-dom';
import { getPostBySlug, BLOG_POSTS } from '../data/blog';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-blue-600 hover:underline">← Back to Blog</Link>
      </div>
    );
  }

  // Find related posts by category or tags
  const relatedPosts = BLOG_POSTS
    .filter(p => p.id !== post.id && (p.category === post.category || p.tags.some(t => post.tags.includes(t))))
    .slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/blog" className="text-blue-600 hover:underline mb-6 block">← Back to Blog</Link>
      
      <article>
        <header className="mb-8">
          <div className="flex gap-2 mb-4">
            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {post.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="text-gray-600 mb-4">
            By {post.author} • {post.publishedAt || `Coming ${post.scheduledAt}`}
          </div>
          <div className="flex gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="text-sm bg-gray-100 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-8">{post.excerpt}</p>
          <div className="whitespace-pre-wrap">{post.content}</div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="mt-16 pt-8 border-t">
          <h2 className="text-2xl font-semibold mb-6">Related Articles</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedPosts.map(p => (
              <Link 
                key={p.id}
                to={`/blog/${p.slug}`}
                className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-sm">{p.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
