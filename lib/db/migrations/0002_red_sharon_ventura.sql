CREATE TABLE "earnings_calls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stock_code" text NOT NULL,
	"stock_name" text NOT NULL,
	"call_date" date NOT NULL,
	"call_time" text,
	"location" text,
	"official_url" text,
	"pdf_url" text,
	"status" text DEFAULT 'upcoming' NOT NULL,
	"summary" text,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "earnings_calls_stock_code_call_date_unique" UNIQUE("stock_code","call_date")
);
--> statement-breakpoint
CREATE TABLE "watched_stocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stock_code" text NOT NULL,
	"stock_name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "watched_stocks_stock_code_unique" UNIQUE("stock_code")
);
--> statement-breakpoint
CREATE INDEX "earnings_calls_call_date_idx" ON "earnings_calls" USING btree ("call_date");--> statement-breakpoint
CREATE INDEX "earnings_calls_status_idx" ON "earnings_calls" USING btree ("status");