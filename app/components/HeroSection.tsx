import { BlogPost } from '../types/blog';
import BlogCard from './BlogCard';

interface HeroSectionProps {
  featuredPosts: BlogPost[];
  onPostClick?: (post: BlogPost) => void;
}

export default function HeroSection({ featuredPosts, onPostClick }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Guillaume's likable stuff
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A curated collection of things I've discovered, enjoyed, and think are worth sharing. 
            From books and movies to tech tools and travel experiences.
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Featured Picks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => onPostClick?.(post)}
                  className={onPostClick ? 'cursor-pointer' : ''}
                >
                  <BlogCard
                    post={post}
                    variant="featured"
                    showCategory={true}
                    showTags={true}
                    showRating={true}
                    showDate={true}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {featuredPosts.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Featured Posts
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              8
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Categories
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              4.8
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avg Rating
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              50+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Posts
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 