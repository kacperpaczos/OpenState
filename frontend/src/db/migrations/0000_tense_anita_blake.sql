CREATE TABLE "bill_stages" (
	"id" serial PRIMARY KEY NOT NULL,
	"bill_id" varchar(20) NOT NULL,
	"stage_name" varchar(255) NOT NULL,
	"stage_type" varchar(100),
	"organ" varchar(100),
	"date" date,
	"sort_order" integer DEFAULT 0,
	"children" jsonb
);
--> statement-breakpoint
CREATE TABLE "bills" (
	"id" varchar(20) PRIMARY KEY NOT NULL,
	"print_no" varchar(20),
	"title" text NOT NULL,
	"description" text,
	"document_type" varchar(100),
	"author_type" varchar(100),
	"status" varchar(100),
	"kanban_stage" varchar(150),
	"is_eu" boolean DEFAULT false,
	"passed" boolean DEFAULT false,
	"term" integer DEFAULT 10,
	"date" date,
	"process_start_date" date,
	"urgency_status" varchar(50) DEFAULT 'NORMAL',
	"isap_link" text,
	"eli_link" text,
	"rcl_link" text,
	"rcl_project_id" varchar(50),
	"raw_meta" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "deputies" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"second_name" varchar(100),
	"party" varchar(100),
	"club" varchar(100),
	"district" varchar(100),
	"photo_url" text,
	"email" varchar(255),
	"active" boolean DEFAULT true,
	"type" varchar(20) DEFAULT 'Poseł' NOT NULL,
	"term" integer DEFAULT 10 NOT NULL,
	"search_vector" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sittings" (
	"id" serial PRIMARY KEY NOT NULL,
	"sitting_number" integer NOT NULL,
	"term" integer DEFAULT 10 NOT NULL,
	"date" timestamp
);
--> statement-breakpoint
CREATE TABLE "vote_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"voting_id" integer NOT NULL,
	"deputy_id" integer NOT NULL,
	"club_at_vote" varchar(100),
	"vote" varchar(30) NOT NULL,
	"sitting_number" integer,
	"voting_number" integer,
	"term" integer DEFAULT 10
);
--> statement-breakpoint
CREATE TABLE "votings" (
	"id" serial PRIMARY KEY NOT NULL,
	"sitting_number" integer NOT NULL,
	"voting_number" integer NOT NULL,
	"term" integer DEFAULT 10 NOT NULL,
	"date" timestamp,
	"title" text,
	"description" text,
	"topic" text,
	"kind" varchar(50),
	"majority_type" varchar(50),
	"majority_votes" integer,
	"total_voted" integer,
	"yes" integer DEFAULT 0,
	"no" integer DEFAULT 0,
	"abstain" integer DEFAULT 0,
	"not_participating" integer DEFAULT 0,
	"against_all" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "bill_stages" ADD CONSTRAINT "bill_stages_bill_id_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."bills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote_records" ADD CONSTRAINT "vote_records_voting_id_votings_id_fk" FOREIGN KEY ("voting_id") REFERENCES "public"."votings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote_records" ADD CONSTRAINT "vote_records_deputy_id_deputies_id_fk" FOREIGN KEY ("deputy_id") REFERENCES "public"."deputies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bill_stages_bill_id_idx" ON "bill_stages" USING btree ("bill_id");--> statement-breakpoint
CREATE INDEX "bill_stages_date_idx" ON "bill_stages" USING btree ("date");--> statement-breakpoint
CREATE INDEX "bills_kanban_stage_idx" ON "bills" USING btree ("kanban_stage");--> statement-breakpoint
CREATE INDEX "bills_date_idx" ON "bills" USING btree ("date");--> statement-breakpoint
CREATE INDEX "bills_status_idx" ON "bills" USING btree ("status");--> statement-breakpoint
CREATE INDEX "bills_is_eu_idx" ON "bills" USING btree ("is_eu");--> statement-breakpoint
CREATE INDEX "deputies_club_idx" ON "deputies" USING btree ("club");--> statement-breakpoint
CREATE INDEX "deputies_active_idx" ON "deputies" USING btree ("active");--> statement-breakpoint
CREATE INDEX "deputies_type_idx" ON "deputies" USING btree ("type");--> statement-breakpoint
CREATE UNIQUE INDEX "sittings_sitting_term_idx" ON "sittings" USING btree ("sitting_number","term");--> statement-breakpoint
CREATE UNIQUE INDEX "vote_records_voting_deputy_idx" ON "vote_records" USING btree ("voting_id","deputy_id");--> statement-breakpoint
CREATE INDEX "vote_records_deputy_idx" ON "vote_records" USING btree ("deputy_id");--> statement-breakpoint
CREATE INDEX "vote_records_club_idx" ON "vote_records" USING btree ("club_at_vote");--> statement-breakpoint
CREATE INDEX "vote_records_vote_idx" ON "vote_records" USING btree ("vote");--> statement-breakpoint
CREATE UNIQUE INDEX "votings_sitting_voting_term_idx" ON "votings" USING btree ("sitting_number","voting_number","term");--> statement-breakpoint
CREATE INDEX "votings_date_idx" ON "votings" USING btree ("date");--> statement-breakpoint
CREATE INDEX "votings_sitting_idx" ON "votings" USING btree ("sitting_number");
--> statement-breakpoint
-- GIN indexes for PostgreSQL Full-Text Search (FTS / Spotlight-style search)
CREATE INDEX "bills_fts_idx" ON "bills" USING GIN (
  to_tsvector('simple', coalesce("title", '') || ' ' || coalesce("description", ''))
);
--> statement-breakpoint
CREATE INDEX "deputies_fts_idx" ON "deputies" USING GIN (
  to_tsvector('simple', coalesce("name", '') || ' ' || coalesce("party", '') || ' ' || coalesce("club", ''))
);
--> statement-breakpoint
CREATE INDEX "votings_fts_idx" ON "votings" USING GIN (
  to_tsvector('simple', coalesce("title", '') || ' ' || coalesce("topic", ''))
);