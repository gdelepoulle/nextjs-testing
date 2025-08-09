"use client";

import { formatRating, getRatingColor } from "../utils/helpers";

interface RatingProps {
  rating: number;
  maxRating?: number;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Rating({
  rating,
  maxRating = 10,
  showText = true,
  size = "md",
  className = "",
}: RatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= rating;
          const isHalfFilled =
            starValue === Math.ceil(rating) && rating % 1 !== 0;

          return (
            <span
              key={index}
              className={`
                cursor-default select-none
              `}
            >
              <svg
                className={`${sizeClasses[size]} ${
                  isFilled
                    ? "text-yellow-400"
                    : isHalfFilled
                      ? "text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                }`}
                fill={isFilled ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isHalfFilled ? (
                  <defs>
                    <linearGradient id={`half-star-${index}`}>
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                ) : null}
                <path
                  fill={isHalfFilled ? `url(#half-star-${index})` : "none"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </span>
          );
        })}
      </div>

      {showText && (
        <span className={`text-sm font-medium ${getRatingColor(rating)}`}>
          {formatRating(rating)}
        </span>
      )}
    </div>
  );
}
