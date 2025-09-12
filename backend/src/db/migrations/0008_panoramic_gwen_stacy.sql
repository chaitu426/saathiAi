ALTER TABLE "message" RENAME TO "massage";--> statement-breakpoint
ALTER TABLE "massage" DROP CONSTRAINT "message_frame_id_frame_id_fk";
--> statement-breakpoint
ALTER TABLE "massage" DROP CONSTRAINT "message_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "massage" ADD CONSTRAINT "massage_frame_id_frame_id_fk" FOREIGN KEY ("frame_id") REFERENCES "public"."frame"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "massage" ADD CONSTRAINT "massage_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;