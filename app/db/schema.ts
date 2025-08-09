import { pgTable, text, integer, timestamp, varchar, primaryKey } from 'drizzle-orm/pg-core';

// Categories table
export const categories = pgTable('categories', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  color: varchar('color', { length: 32 }).notNull(),
  icon: varchar('icon', { length: 128 }),
});

// Tags table
export const tags = pgTable('tags', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: text('name').notNull(),
  count: integer('count').notNull().default(0),
});

// Posts table
export const posts = pgTable('posts', {
  id: varchar('id', { length: 64 }).primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  content: text('content').notNull(),
  category: varchar('category', { length: 64 }).notNull().references(() => categories.id),
  date: timestamp('date', { withTimezone: true }).notNull(),
  rating: integer('rating').notNull(),
  imageUrl: text('image_url'),
  source: text('source'),
  personalThoughts: text('personal_thoughts'),
});

// Join table for many-to-many relationship between posts and tags
export const postTags = pgTable(
  'post_tags',
  {
    postId: varchar('post_id', { length: 64 })
      .notNull()
      .references(() => posts.id),
    tagId: varchar('tag_id', { length: 64 })
      .notNull()
      .references(() => tags.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.postId, t.tagId] }),
  }),
);

