CREATE TABLE IF NOT EXISTS "ApiUsage" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"endpoint" varchar(64) NOT NULL,
	"createdAt" timestamp NOT NULL,
	CONSTRAINT "ApiUsage_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ApiUsage" ADD CONSTRAINT "ApiUsage_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
