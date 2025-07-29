import { BlogPost, Category, Tag, BlogFilters } from '../types/blog';
import postsData from '../data/posts.json';
import categoriesData from '../data/categories.json';

// Type assertions for imported JSON data
const posts: BlogPost[] = postsData as BlogPost[];
const categories: Category[] = categoriesData as Category[];

/**
 * Get all blog posts
 */
export function getAllPosts(): BlogPost[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get all categories
 */
export function getAllCategories(): Category[] {
  return categories;
}

/**
 * Get posts by category
 */
export function getPostsByCategory(categoryId: string): BlogPost[] {
  return posts.filter(post => post.category === categoryId);
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag: string): BlogPost[] {
  return posts.filter(post => post.tags.includes(tag));
}

/**
 * Get a single post by ID
 */
export function getPostById(id: string): BlogPost | undefined {
  return posts.find(post => post.id === id);
}

/**
 * Get category by ID
 */
export function getCategoryById(id: string): Category | undefined {
  return categories.find(category => category.id === id);
}

/**
 * Get all unique tags with their counts
 */
export function getAllTags(): Tag[] {
  const tagCounts: { [key: string]: number } = {};
  
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  return Object.entries(tagCounts)
    .map(([name, count]) => ({ id: name, name, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Filter posts based on multiple criteria
 */
export function filterPosts(filters: BlogFilters): BlogPost[] {
  let filteredPosts = [...posts];
  
  // Filter by category
  if (filters.category) {
    filteredPosts = filteredPosts.filter(post => post.category === filters.category);
  }
  
  // Filter by tags
  if (filters.tags && filters.tags.length > 0) {
    filteredPosts = filteredPosts.filter(post => 
      filters.tags!.some(tag => post.tags.includes(tag))
    );
  }
  
  // Filter by minimum rating
  if (filters.minRating) {
    filteredPosts = filteredPosts.filter(post => post.rating >= filters.minRating!);
  }
  
  // Search by query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  // Sort posts
  if (filters.sortBy) {
    filteredPosts.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }
  
  return filteredPosts;
}

/**
 * Get featured posts (top rated and recent)
 */
export function getFeaturedPosts(limit: number = 6): BlogPost[] {
  return posts
    .filter(post => post.rating >= 4)
    .sort((a, b) => {
      // Sort by rating first, then by date
      if (a.rating !== b.rating) {
        return b.rating - a.rating;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);
}

/**
 * Get recent posts
 */
export function getRecentPosts(limit: number = 10): BlogPost[] {
  return posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

/**
 * Get posts by rating range
 */
export function getPostsByRating(minRating: number, maxRating: number = 5): BlogPost[] {
  return posts.filter(post => post.rating >= minRating && post.rating <= maxRating);
}

/**
 * Search posts by text
 */
export function searchPosts(query: string): BlogPost[] {
  const searchTerm = query.toLowerCase();
  return posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.description.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

/**
 * Get related posts based on tags and category
 */
export function getRelatedPosts(postId: string, limit: number = 4): BlogPost[] {
  const currentPost = getPostById(postId);
  if (!currentPost) return [];
  
  const relatedPosts = posts
    .filter(post => post.id !== postId)
    .map(post => {
      let score = 0;
      
      // Same category gets high score
      if (post.category === currentPost.category) score += 3;
      
      // Shared tags get points
      const sharedTags = post.tags.filter(tag => currentPost.tags.includes(tag));
      score += sharedTags.length * 2;
      
      return { post, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
  
  return relatedPosts;
} 