import { Link } from 'react-router-dom';
import { getPublishedPosts, getScheduledPosts } from '../data/blog';

export default function BlogPage() {
  const published = getPublishedPosts();
  const scheduled = getScheduledPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">AiDex Blog</h1>
      <p className="text-gray-600 mb-8">Latest news, guides, and comparisons for AI tools</p>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Latest Articles</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {published.map(post => (
            <Link 
              key={post.id} 
              to={`/blog/${post.slug}`}
              className="block border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-sm text-gray-500 mb-2">{post.publishedAt}</div>
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-600">{post.excerpt}</p>
              <div className="mt-4 flex gap-2">
                {post.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Coming Soon</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {scheduled.map(post => (
            <div 
              key={post.id}
              className="block border border-dashed rounded-lg p-6 bg-gray-50"
            >
              <div className="text-sm text-gray-500 mb-2">Coming {post.scheduledAt}</div>
              <h3 className="text-lg font-medium mb-2">{post.title}</h3>
              <p className="text-gray-600 text-sm">{post.excerpt}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
