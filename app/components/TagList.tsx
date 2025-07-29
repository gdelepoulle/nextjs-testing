interface TagListProps {
  tags: string[];
  maxTags?: number;
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
  showCount?: boolean;
  className?: string;
}

export default function TagList({
  tags,
  maxTags,
  onTagClick,
  selectedTags = [],
  showCount = false,
  className = "",
}: TagListProps) {
  const displayTags = maxTags ? tags.slice(0, maxTags) : tags;
  const remainingCount = maxTags ? tags.length - maxTags : 0;

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {displayTags.map((tag) => {
        const isSelected = selectedTags.includes(tag);

        return (
          <button
            key={tag}
            onClick={() => onTagClick?.(tag)}
            className={`
              px-2 py-1 text-xs rounded transition-colors duration-200
              ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }
              ${onTagClick ? "cursor-pointer" : "cursor-default"}
            `}
          >
            {tag}
            {showCount && (
              <span className="ml-1 text-gray-500 dark:text-gray-400">
                ({tags.filter((t) => t === tag).length})
              </span>
            )}
          </button>
        );
      })}

      {remainingCount > 0 && (
        <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
}
