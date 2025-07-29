'use client';

import { useState, useMemo } from 'react';
import { getAllPosts, getAllCategories, getFeaturedPosts } from './utils/data';
import { BlogPost, Category } from './types/blog';
import HeroSection from './components/HeroSection';
import BlogGrid from './components/BlogGrid';
import CategoryFilter from './components/CategoryFilter';
import SearchBar from './components/SearchBar';
import FeaturedPosts from './components/FeaturedPosts';

export default function BlogPage() {
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  const featuredPosts = getFeaturedPosts(3);

  // State for filters
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Filter posts based on current filters
  const filteredPosts = useMemo(() => {
    let filtered = allPosts;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        selectedTags.some(tag => post.tags.includes(tag))
      );
    }

    return filtered;
  }, [allPosts, selectedCategory, searchQuery, selectedTags]);

  // Get all unique tags from posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    allPosts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [allPosts]);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handlePostClick = (post: BlogPost) => {
    // For now, just log the post. In a real app, this would navigate to a detail page
    console.log('Post clicked:', post);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <HeroSection 
        featuredPosts={featuredPosts}
        onPostClick={handlePostClick}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="max-w-md">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Search posts, tags, or descriptions..."
            />
          </div>

          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            showAll={true}
          />

          {/* Tag Filter */}
          {selectedTags.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Selected tags:
              </span>
              {selectedTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors"
                >
                  {tag} ×
                </button>
              ))}
              <button
                onClick={() => setSelectedTags([])}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedCategory 
                ? `${categories.find(c => c.id === selectedCategory)?.name} Posts`
                : 'All Posts'
              }
            </h2>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredPosts.length} of {allPosts.length} posts
            </span>
          </div>
        </div>

        {/* Posts Grid */}
        <BlogGrid
          posts={filteredPosts}
          variant="default"
          columns={3}
          showCategory={true}
          showTags={true}
          showRating={true}
          showDate={true}
        />

        {/* Popular Tags Section */}
        {allTags.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 20).map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`
                    px-3 py-1 text-sm rounded-full transition-colors
                    ${selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No posts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria.
            </p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
                setSelectedTags([]);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 