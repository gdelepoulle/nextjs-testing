import { Category } from "../types/blog";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  showAll?: boolean;
  className?: string;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  showAll = true,
  className = "",
}: CategoryFilterProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {showAll && (
        <button
          onClick={() => onCategoryChange(null)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
            ${
              selectedCategory === null
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }
          `}
        >
          All
        </button>
      )}

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex items-center gap-2
            ${
              selectedCategory === category.id
                ? `${category.color} text-white`
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }
          `}
        >
          {category.icon && <span>{category.icon}</span>}
          {category.name}
        </button>
      ))}
    </div>
  );
}
