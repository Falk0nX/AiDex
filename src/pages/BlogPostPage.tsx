import { useParams, Link } from 'react-router-dom';
import { getPostBySlug, BLOG_POSTS } from '../data/blog';
import SiteShell from '../components/SiteShell';
import SEO from '../components/SEO';

function formatContent(content: string) {
  // Split content into paragraphs
  const lines = content.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return null;
    
    // Bold headers: **text**
    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      return <h3 key={idx} className="text-xl md:text-2xl font-bold text-white mt-8 mb-4">{trimmed.slice(2, -2)}</h3>;
    }
    
    // Italic subheaders: *text*
    if (trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.startsWith('**')) {
      return <h4 key={idx} className="text-lg md:text-xl font-semibold text-cyan-300 mt-6 mb-3">{trimmed.slice(1, -1)}</h4>;
    }
    
    // Lists: - text
    if (trimmed.startsWith('- ')) {
      return <li key={idx} className="text-gray-300 ml-4">{trimmed.slice(2)}</li>;
    }
    
    // Numbered lists: 1. text
    if (/^\d+\.\s/.test(trimmed)) {
      return <li key={idx} className="text-gray-300 ml-4 list-decimal">{trimmed.replace(/^\d+\.\s/, '')}</li>;
    }
    
    // Regular paragraph
    return <p key={idx} className="text-gray-300 mb-4 leading-relaxed">{trimmed}</p>;
  }).filter(Boolean);
}

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
      <SEO 
        title={`${post.title} - AiDex Blog`}
        description={post.excerpt}
        image={post.image}
        url={`https://aidex.online/blog/${post.slug}`}
        type="article"
      />
      <article>
        {/* Hero Image */}
        {post.image && (
          <div className="mb-8">
            <img 
              src={post.image} 
              alt={post.imageAlt || post.title}
              className="w-full h-48 md:h-64 object-cover rounded-lg"
            />
          </div>
        )}
        
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
          {formatContent(post.content)}
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
                {p.image && (
                  <img 
                    src={p.image} 
                    alt={p.title}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                )}
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
