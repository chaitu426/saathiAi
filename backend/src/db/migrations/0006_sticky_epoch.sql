ALTER TABLE "study_material" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."type";--> statement-breakpoint
CREATE TYPE "public"."type" AS ENUM('YTLink', 'webpageLink', 'pdf', 'image');--> statement-breakpoint
ALTER TABLE "study_material" ALTER COLUMN "type" SET DATA TYPE "public"."type" USING "type"::"public"."type";--> statement-breakpoint
ALTER TABLE "study_material" ALTER COLUMN "embeddings" SET DATA TYPE varchar;