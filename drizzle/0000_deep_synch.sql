CREATE TABLE "categories" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"color" varchar(32) NOT NULL,
	"icon" varchar(128)
);
--> statement-breakpoint
CREATE TABLE "post_tags" (
	"post_id" varchar(64) NOT NULL,
	"tag_id" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"content" text NOT NULL,
	"category" varchar(64) NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"rating" integer NOT NULL,
	"image_url" text,
	"source" text,
	"personal_thoughts" text
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_categories_id_fk" FOREIGN KEY ("category") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;