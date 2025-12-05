CREATE TABLE "disease_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_name" text NOT NULL,
	"age_group" text NOT NULL,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"location_accuracy" numeric(10, 2),
	"symptoms" jsonb NOT NULL,
	"onset_date" text NOT NULL,
	"severity" text NOT NULL,
	"description" text,
	"water_source" text NOT NULL,
	"reported_by" text,
	"created_at" timestamp DEFAULT now()
);
