DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('ACTIVE', 'INACTIVE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."invoice_status" AS ENUM('PENDING', 'COMPLETED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('RECURRING', 'ONE-TIME');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_type" AS ENUM('ADMIN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_name" varchar NOT NULL,
	"client_phone" varchar,
	"client_email" varchar,
	"company_name" varchar NOT NULL,
	"poc" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"secondary_phone" varchar,
	"status" "status" DEFAULT 'ACTIVE',
	"remarks" text,
	"bussiness_url" text,
	"address" text,
	"state" varchar,
	"city" varchar,
	"gst" boolean DEFAULT false,
	"country" varchar,
	"total_invoice_amount" numeric(100, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clients_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client_services" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"client_id" integer NOT NULL,
	"service_id" integer NOT NULL,
	"status" "status" DEFAULT 'ACTIVE',
	"invoice_amount" numeric(100, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoice_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"invoice_id" integer NOT NULL,
	"file_name" varchar NOT NULL,
	"key" varchar NOT NULL,
	"status" "status" DEFAULT 'ACTIVE',
	"size" integer NOT NULL,
	"invoice_amount" numeric(100, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"service_id" integer NOT NULL,
	"client_id" integer NOT NULL,
	"invoice_status" "invoice_status" DEFAULT 'PENDING',
	"remarks" text,
	"invoice_date" date NOT NULL,
	"payment_date" date,
	"invoice_amount" numeric(100, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_name" varchar NOT NULL,
	"type" "type" NOT NULL,
	"status" "status" DEFAULT 'ACTIVE',
	"invoice_amount" numeric(100, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"password" varchar NOT NULL,
	"user_type" "user_type" DEFAULT 'ADMIN',
	"status" "status" DEFAULT 'ACTIVE',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_password_unique" UNIQUE("password")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "clientname_idx" ON "clients" USING btree ("client_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "client_status_idx" ON "clients" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "title_idx" ON "client_services" USING btree ("title");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "client_id_idx" ON "client_services" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "client_services_status_idx" ON "client_services" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "key_idx" ON "invoice_files" USING btree ("key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invoice_files_client_id_idx" ON "invoice_files" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "client_invoice_id_idx" ON "invoices" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invoice_status_idx" ON "invoices" USING btree ("invoice_status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "services_type_idx" ON "services" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "services_name_idx" ON "services" USING btree ("service_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "services_status_idx" ON "services" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_type_idx" ON "users" USING btree ("user_type");