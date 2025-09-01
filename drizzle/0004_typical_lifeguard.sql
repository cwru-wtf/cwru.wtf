ALTER TABLE "submissions" ALTER COLUMN "interests" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "categories" text NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "other_category" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "wtf_idea" text NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "current_project" text NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "youtube_link" text NOT NULL;