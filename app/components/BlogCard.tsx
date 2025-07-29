import { BlogPost } from "../types/blog";
import { formatDate, formatRating, getRatingColor } from "../utils/helpers";

interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "compact" | "featured";
  showCategory?: boolean;
  showTags?: boolean;
  showRating?: boolean;
  showDate?: boolean;
}

export default function BlogCard({
  post,
  variant = "default",
  showCategory = true,
  showTags = true,
  showRating = true,
  showDate = true,
}: BlogCardProps) {
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";

  return (
    <div
      className={`
      bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden
      ${isFeatured ? "border-2 border-blue-500" : ""}
      ${isCompact ? "p-4" : "p-6"}
    `}
    >
      {/* Image */}
      {post.imageUrl && !isCompact && (
        <div className="aspect-video bg-gray-200 dark:bg-gray-700 mb-4">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {!post.imageUrl && !isCompact && (
        <div className="aspect-video bg-gray-200 dark:bg-gray-700 mb-4">
          <img
            src="/image-not-found.svg"
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        {showDate && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(post.date)}
          </span>
        )}
        {showRating && (
          <span
            className={`text-sm font-medium ${getRatingColor(post.rating)}`}
          >
            {formatRating(post.rating)}
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        className={`
        font-semibold text-gray-900 dark:text-white mb-2
        ${isCompact ? "text-base" : "text-lg"}
        ${isFeatured ? "text-xl" : ""}
      `}
      >
        {post.title}
      </h3>

      {/* Description */}
      {!isCompact && (
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {post.description}
        </p>
      )}

      {/* Tags */}
      {showTags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {post.tags.slice(0, isCompact ? 2 : 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {post.tags.length > (isCompact ? 2 : 3) && (
            <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
              +{post.tags.length - (isCompact ? 2 : 3)}
            </span>
          )}
        </div>
      )}

      {/* Category */}
      {showCategory && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {post.category}
          </span>
          {post.source && (
            <a
              href={post.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Source →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
