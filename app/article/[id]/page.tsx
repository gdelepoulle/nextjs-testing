import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostById } from "@/utils/data";
import { formatDate, getRatingColor } from "@/utils/helpers";
import TagList from "@/components/TagList";
import Rating from "@/components/Rating";

import { getArticleById } from "@/services/article/articleRepository";

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }
  const tags = article.tags;


  const dateString = article.date.toISOString();

  const imageUrl = article.imageUrl || "/image-not-found.svg";

  return (
    <div className="min-h-[60vh]">
      {/* Hero section */}
      <section className="relative w-full">
        <div
          className="relative h-[42vh] sm:h-[50vh] lg:h-[56vh] overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-center bg-cover scale-105"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="relative z-10 h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-8">
            <div className="text-white drop-shadow-sm">
              <div className="flex flex-wrap items-center gap-3 text-sm opacity-90 mb-3">
                {article.category && (
                  <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur text-white border border-white/20">
                    {article.category}
                  </span>
                )}
                {dateString && (
                  <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15">
                    {formatDate(dateString)}
                  </span>
                )}
                <Rating rating={article.rating} size="sm" />

              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
                {article.title}
              </h1>
              {article.description && (
                <p className="mt-3 max-w-3xl text-white/85 text-base sm:text-lg">
                  {article.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Meta row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <TagList tags={article.tags} className="-ml-1" />

          <Rating rating={article.rating} size="lg" />
        </div>

        {/* Main body */}
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          {article.content && (
            <p className="text-lg leading-relaxed">{article.content}</p>
          )}

          {article.personalThoughts && (
            <div className="mt-8 p-5 rounded-xl border bg-muted/30 dark:bg-white/5 dark:border-gray-800">
              <h3 className="text-base font-semibold mb-2">Personal thoughts</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {article.personalThoughts}
              </p>
            </div>
          )}

          {article.source && (
            <p className="mt-6">
              <a
                href={article.source}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
              >
                Visit source →
              </a>
            </p>
          )}
        </article>
      </section>
    </div>
  );
}