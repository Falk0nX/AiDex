import { Link } from 'react-router-dom';
import { getPublishedPosts, getScheduledPosts } from '../data/blog';

export default function BlogPage() {
  const published = getPublishedPosts();
  const scheduled = getScheduledPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">AiDex Blog</h1>
      <p className="text-gray-400 mb-8">Latest news, guides, and comparisons for AI tools</p>
      
      {/* Mobile Nav */}
      <div className="flex flex-wrap gap-2 mb-8 md:hidden">
        <Link to="/" className="text-sm text-cyan-400 hover:underline">← Directory</Link>
        <span className="text-gray-600">|</span>
        <Link to="/leaderboard" className="text-sm text-cyan-400 hover:underline">Leaderboard</Link>
        <span className="text-gray-600">|</span>
        <Link to="/compare" className="text-sm text-cyan-400 hover:underline">Compare</Link>
      </div>
      
      <section className="mb-12">
        <h2 className="text-xl md:text-2xl font-semibold mb-6">Latest Articles</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {published.map(post => (
            <Link 
              key={post.id} 
              to={`/blog/${post.slug}`}
              className="block border border-neutral-700 rounded-lg p-4 md:p-6 hover:bg-neutral-800/50 transition-colors"
            >
              <div className="text-xs md:text-sm text-gray-500 mb-2">{post.publishedAt} · {post.category}</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-400 text-sm md:text-base">{post.excerpt}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs bg-neutral-800 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl md:text-2xl font-semibold mb-6">Coming Soon</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {scheduled.map(post => (
            <div 
              key={post.id}
              className="block border border-dashed border-neutral-700 rounded-lg p-4 md:p-6 bg-neutral-900/30"
            >
              <div className="text-xs md:text-sm text-gray-500 mb-2">Coming {post.scheduledAt} · {post.category}</div>
              <h3 className="text-base md:text-lg font-medium mb-2">{post.title}</h3>
              <p className="text-gray-500 text-sm">{post.excerpt}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
