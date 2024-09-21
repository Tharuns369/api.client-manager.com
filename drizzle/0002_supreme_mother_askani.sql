CREATE TABLE IF NOT EXISTS "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar NOT NULL,
	"status" "status" DEFAULT 'ACTIVE',
	"invoice_amount" numeric(100, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invoices" RENAME COLUMN "service_id" TO "client_service_id";--> statement-breakpoint
DROP INDEX IF EXISTS "service_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "type_idx";--> statement-breakpoint
ALTER TABLE "client_services" ALTER COLUMN "title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "client_services" ADD COLUMN "service_id" integer NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "services_type_idx" ON "services" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "services_status_idx" ON "services" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "client_service_id_idx" ON "invoices" USING btree ("client_service_id");--> statement-breakpoint
ALTER TABLE "client_services" DROP COLUMN IF EXISTS "type";