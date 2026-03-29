CREATE TABLE "kol_persons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"display_name" text NOT NULL,
	"platform" text NOT NULL,
	"feed_url" text NOT NULL,
	"avatar_url" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "kol_persons_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "kol_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"guid" text NOT NULL,
	"title" text,
	"content" text,
	"source_url" text,
	"platform" text NOT NULL,
	"published_at" timestamp NOT NULL,
	"fetched_at" timestamp DEFAULT now(),
	CONSTRAINT "kol_posts_person_id_guid_unique" UNIQUE("person_id","guid")
);
--> statement-breakpoint
CREATE TABLE "news_articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_name" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"url" text NOT NULL,
	"published_at" timestamp NOT NULL,
	"fetched_date" date NOT NULL,
	"language" text DEFAULT 'zh',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "news_articles_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE "news_digests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"digest_date" date NOT NULL,
	"bullet_points" jsonb NOT NULL,
	"model_used" text NOT NULL,
	"article_count" integer NOT NULL,
	"generated_at" timestamp DEFAULT now(),
	"status" text DEFAULT 'pending',
	CONSTRAINT "news_digests_digest_date_unique" UNIQUE("digest_date")
);
--> statement-breakpoint
ALTER TABLE "kol_posts" ADD CONSTRAINT "kol_posts_person_id_kol_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."kol_persons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "kol_posts_person_published_idx" ON "kol_posts" USING btree ("person_id","published_at");--> statement-breakpoint
CREATE INDEX "kol_posts_published_idx" ON "kol_posts" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "news_articles_fetched_date_idx" ON "news_articles" USING btree ("fetched_date");