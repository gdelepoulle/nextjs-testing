CREATE TABLE IF NOT EXISTS "post_tags" (
	"post_id" varchar(64) NOT NULL,
	"tag_id" varchar(64) NOT NULL,
	CONSTRAINT "post_tags_post_id_tag_id_pk" PRIMARY KEY("post_id","tag_id")
);
ALTER TABLE "posts" DROP CONSTRAINT IF EXISTS "posts_tags_tags_id_fk";
DO $$ BEGIN
    ALTER TABLE "post_tags"
        ADD CONSTRAINT "post_tags_post_id_posts_id_fk"
        FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id")
        ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    ALTER TABLE "post_tags"
        ADD CONSTRAINT "post_tags_tag_id_tags_id_fk"
        FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id")
        ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
ALTER TABLE "posts" DROP COLUMN IF EXISTS "tags";