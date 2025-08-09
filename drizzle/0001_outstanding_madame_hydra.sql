-- Fix incorrect attempt to model tags as an array with a foreign key
-- Ensure posts.tags does not exist and the join table post_tags does

-- Drop the invalid foreign key if it exists
ALTER TABLE "posts" DROP CONSTRAINT IF EXISTS "posts_tags_tags_id_fk";--> statement-breakpoint

-- Drop the invalid array column if it exists
ALTER TABLE "posts" DROP COLUMN IF EXISTS "tags";--> statement-breakpoint

-- Ensure the join table exists
CREATE TABLE IF NOT EXISTS "post_tags" (
    "post_id" varchar(64) NOT NULL,
    "tag_id" varchar(64) NOT NULL
);--> statement-breakpoint

-- Add foreign keys if they don't exist yet
DO $$ BEGIN
    ALTER TABLE "post_tags"
        ADD CONSTRAINT "post_tags_post_id_posts_id_fk"
        FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id")
        ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;--> statement-breakpoint

DO $$ BEGIN
    ALTER TABLE "post_tags"
        ADD CONSTRAINT "post_tags_tag_id_tags_id_fk"
        FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id")
        ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;--> statement-breakpoint

-- Add a composite primary key to prevent duplicates
DO $$ BEGIN
    ALTER TABLE "post_tags"
        ADD CONSTRAINT "post_tags_pk" PRIMARY KEY ("post_id", "tag_id");
EXCEPTION WHEN duplicate_object THEN NULL; END $$;