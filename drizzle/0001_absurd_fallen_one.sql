ALTER TABLE "services" RENAME TO "client_services";--> statement-breakpoint
DROP INDEX IF EXISTS "services_status_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "client_services_status_idx" ON "client_services" USING btree ("status");