ALTER TABLE "clients" ALTER COLUMN "total_invoice_amount" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "client_services" ALTER COLUMN "invoice_amount" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "invoice_files" ALTER COLUMN "invoice_amount" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "invoice_amount" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "invoice_amount" SET DEFAULT '0';