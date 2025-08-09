import { posts, postTags, tags } from "@/db/schema";
import { db } from "../../db";
import { eq } from "drizzle-orm";



export async function getArticleById(id: string) {
  const rows = await db
    .select({
      id: posts.id,
      title: posts.title,
      description: posts.description,
      content: posts.content,
      category: posts.category,
      date: posts.date,
      rating: posts.rating,
      imageUrl: posts.imageUrl,
      source: posts.source,
      personalThoughts: posts.personalThoughts,
      tagId: tags.id,
    })
    .from(posts)
    .leftJoin(postTags, eq(postTags.postId, posts.id))
    .leftJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(posts.id, id));

  if (!rows || rows.length === 0) {
    throw new Error(`Article with id ${id} not found`);
  }

  const base = rows[0];
  const tagList = Array.from(
    new Set(rows.map((r) => r.tagId).filter((t): t is string => Boolean(t))),
  );

  return {
    id: base.id,
    title: base.title,
    description: base.description,
    content: base.content,
    category: base.category,
    date: base.date,
    rating: base.rating,
    imageUrl: base.imageUrl ?? undefined,
    source: base.source ?? undefined,
    personalThoughts: base.personalThoughts ?? undefined,
    tags: tagList,
  };
}