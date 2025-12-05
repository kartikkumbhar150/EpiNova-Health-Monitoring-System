ALTER TABLE "disease_reports" ALTER COLUMN "phone_no" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "disease_reports" ADD COLUMN "predicted_disease" varchar;--> statement-breakpoint
ALTER TABLE "disease_reports" ADD COLUMN "state" text;--> statement-breakpoint
ALTER TABLE "disease_reports" ADD COLUMN "district" text;--> statement-breakpoint
ALTER TABLE "disease_reports" ADD COLUMN "village" text;