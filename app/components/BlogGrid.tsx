import { BlogPost } from "../types/blog";
import BlogCard from "./BlogCard";

interface BlogGridProps {
  posts: BlogPost[];
  variant?: "default" | "compact" | "featured";
  columns?: 1 | 2 | 3 | 4;
  showCategory?: boolean;
  showTags?: boolean;
  showRating?: boolean;
  showDate?: boolean;
  className?: string;
}

export default function BlogGrid({
  posts,
  variant = "default",
  columns = 3,
  showCategory = true,
  showTags = true,
  showRating = true,
  showDate = true,
  className = "",
}: BlogGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No posts found.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
      {posts.map((post) => (
        <BlogCard
          key={post.id}
          post={post}
          variant={variant}
          showCategory={showCategory}
          showTags={showTags}
          showRating={showRating}
          showDate={showDate}
        />
      ))}
    </div>
  );
}
