CREATE TYPE "public"."processed_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'assistant', 'system');--> statement-breakpoint
CREATE TYPE "public"."type" AS ENUM('video', 'webpage', 'pdf', 'image', 'other');--> statement-breakpoint
CREATE TABLE "message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"frame_id" uuid NOT NULL,
	"role" "role" NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_material" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"frame_id" uuid NOT NULL,
	"title" text NOT NULL,
	"type" "type" NOT NULL,
	"url" text NOT NULL,
	"processed_status" "processed_status" DEFAULT 'pending' NOT NULL,
	"embeddings" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_frame_id_frame_id_fk" FOREIGN KEY ("frame_id") REFERENCES "public"."frame"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_material" ADD CONSTRAINT "study_material_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_material" ADD CONSTRAINT "study_material_frame_id_frame_id_fk" FOREIGN KEY ("frame_id") REFERENCES "public"."frame"("id") ON DELETE no action ON UPDATE no action;