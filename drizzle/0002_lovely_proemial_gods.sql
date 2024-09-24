ALTER TABLE "clients" RENAME COLUMN "name" TO "client_name";--> statement-breakpoint
DROP INDEX IF EXISTS "name_idx";--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "client_phone" varchar;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "company_name" varchar NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "clientname_idx" ON "clients" USING btree ("client_name");--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN IF EXISTS "role";