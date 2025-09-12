ALTER TABLE "settings" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "settings_username_unique";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "settings_email_unique";--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_username_unique" UNIQUE("username");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");