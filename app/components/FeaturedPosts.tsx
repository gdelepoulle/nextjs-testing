import { useState } from 'react';
import { BlogPost } from '../types/blog';
import BlogCard from './BlogCard';

interface FeaturedPostsProps {
  posts: BlogPost[];
  title?: string;
  maxPosts?: number;
  onPostClick?: (post: BlogPost) => void;
  className?: string;
}

export default function FeaturedPosts({
  posts,
  title = 'Featured Posts',
  maxPosts = 6,
  onPostClick,
  className = '',
}: FeaturedPostsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayPosts = posts.slice(0, maxPosts);
  const totalSlides = Math.ceil(displayPosts.length / 3);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getVisiblePosts = () => {
    const startIndex = currentIndex * 3;
    return displayPosts.slice(startIndex, startIndex + 3);
  };

  if (displayPosts.length === 0) {
    return null;
  }

  return (
    <section className={`${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        
        {totalSlides > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Previous slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex
                      ? 'bg-blue-600'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Next slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {getVisiblePosts().map((post) => (
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

      {displayPosts.length < posts.length && (
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {displayPosts.length} of {posts.length} featured posts
          </p>
        </div>
      )}
    </section>
  );
} 