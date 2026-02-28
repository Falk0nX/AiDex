import { useParams, Link } from 'react-router-dom';
import { getPostBySlug, BLOG_POSTS } from '../data/blog';
import SiteShell from '../components/SiteShell';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <SiteShell title="Post Not Found">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-cyan-400 hover:underline">← Back to Blog</Link>
        </div>
      </SiteShell>
    );
  }

  // Find related posts by category or tags
  const relatedPosts = BLOG_POSTS
    .filter(p => p.id !== post.id && (p.category === post.category || p.tags.some(t => post.tags.includes(t))))
    .slice(0, 3);

  const isPublished = post.publishedAt !== "";

  return (
    <SiteShell title={post.title} subtitle={post.excerpt}>
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
          <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">{post.content}</div>
        </div>
      </article>

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
    </SiteShell>
  );
}
