export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  date: string;
  rating: number;
  imageUrl?: string;
  source?: string;
  personalThoughts?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon?: string;
}

export interface Tag {
  id: string;
  name: string;
  count: number;
}

export interface BlogFilters {
  category?: string;
  tags?: string[];
  minRating?: number;
  searchQuery?: string;
  sortBy?: "date" | "rating" | "title";
  sortOrder?: "asc" | "desc";
}

export interface FeaturedPost extends BlogPost {
  featured: boolean;
  featuredOrder: number;
}
