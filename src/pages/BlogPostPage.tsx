import { useParams, Link } from 'react-router-dom';
import { getPostBySlug, BLOG_POSTS } from '../data/blog';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-cyan-400 hover:underline">← Back to Blog</Link>
      </div>
    );
  }

  // Find related posts by category or tags
  const relatedPosts = BLOG_POSTS
    .filter(p => p.id !== post.id && (p.category === post.category || p.tags.some(t => post.tags.includes(t))))
    .slice(0, 3);

  const isPublished = post.publishedAt !== "";

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
      {/* Mobile Nav */}
      <div className="flex flex-wrap gap-3 mb-6 md:hidden text-sm">
        <Link to="/" className="text-cyan-400 hover:underline">← Directory</Link>
        <span className="text-gray-600">|</span>
        <Link to="/blog" className="text-cyan-400 hover:underline">Blog</Link>
        <span className="text-gray-600">|</span>
        <Link to="/leaderboard" className="text-cyan-400 hover:underline">Leaderboard</Link>
      </div>
      
      <article>
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs md:text-sm bg-cyan-900/50 text-cyan-300 px-3 py-1 rounded-full">
              {post.category}
            </span>
            {!isPublished && (
              <span className="text-xs md:text-sm bg-yellow-900/50 text-yellow-300 px-3 py-1 rounded-full">
                Coming {post.scheduledAt}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="text-gray-400 text-sm md:text-base mb-4">
            By {post.author} • {post.publishedAt || `Coming ${post.scheduledAt}`}
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs bg-neutral-800 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-lg max-w-none prose-invert">
          <p className="text-lg text-gray-300 mb-8">{post.excerpt}</p>
          <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">{post.content}</div>
        </div>
      </article>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-4 mt-8 pt-8 border-t border-neutral-800">
        <Link to="/blog" className="text-cyan-400 hover:underline">← Back to Blog</Link>
        <Link to="/" className="text-cyan-400 hover:underline">Directory</Link>
        <Link to="/leaderboard" className="text-cyan-400 hover:underline">Leaderboard</Link>
        <Link to="/compare" className="text-cyan-400 hover:underline">Compare</Link>
      </div>

      {relatedPosts.length > 0 && (
        <section className="mt-12 pt-8 border-t border-neutral-800">
          <h2 className="text-xl md:text-2xl font-semibold mb-6">Related Articles</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedPosts.map(p => (
              <Link 
                key={p.id}
                to={`/blog/${p.slug}`}
                className="block border border-neutral-700 rounded-lg p-4 hover:bg-neutral-800/50 transition-colors"
              >
                <h3 className="font-medium text-sm md:text-base">{p.title}</h3>
                <p className="text-gray-500 text-xs mt-1">{p.category}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
