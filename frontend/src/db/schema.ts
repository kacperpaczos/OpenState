import {
  pgTable,
  serial,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  varchar,
  date,
  real,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// ─────────────────────────────────────────────────────────────────────────────
// DEPUTIES (Posłowie i Senatorowie)
// ─────────────────────────────────────────────────────────────────────────────
export const deputies = pgTable(
  "deputies",
  {
    id: integer("id").primaryKey(), // Numeric ID from Sejm API (e.g. 74)
    name: varchar("name", { length: 255 }).notNull(),
    firstName: varchar("first_name", { length: 100 }),
    lastNameStr: varchar("last_name", { length: 100 }),
    secondName: varchar("second_name", { length: 100 }),
    party: varchar("party", { length: 100 }),
    club: varchar("club", { length: 100 }),
    district: varchar("district", { length: 100 }),
    photoUrl: text("photo_url"),
    email: varchar("email", { length: 255 }),
    active: boolean("active").default(true),
    type: varchar("type", { length: 20 }).notNull().default("Poseł"), // "Poseł" | "Senator"
    term: integer("term").notNull().default(10),
    // FTS vector (will be updated via trigger or script)
    searchVector: text("search_vector"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("deputies_club_idx").on(table.club),
    index("deputies_active_idx").on(table.active),
    index("deputies_type_idx").on(table.type),
    // GIN index for full-text search (defined as raw SQL in migration)
  ]
);

// ─────────────────────────────────────────────────────────────────────────────
// BILLS (Ustawy / Projekty)
// ─────────────────────────────────────────────────────────────────────────────
export const bills = pgTable(
  "bills",
  {
    id: varchar("id", { length: 20 }).primaryKey(), // e.g. "2198" (print number)
    printNo: varchar("print_no", { length: 20 }),
    title: text("title").notNull(),
    description: text("description"),
    documentType: varchar("document_type", { length: 100 }),
    authorType: varchar("author_type", { length: 100 }),
    status: varchar("status", { length: 100 }),
    kanbanStage: varchar("kanban_stage", { length: 150 }),
    isEU: boolean("is_eu").default(false),
    passed: boolean("passed").default(false),
    term: integer("term").default(10),
    date: date("date"),
    processStartDate: date("process_start_date"),
    urgencyStatus: varchar("urgency_status", { length: 50 }).default("NORMAL"),
    isapLink: text("isap_link"),
    eliLink: text("eli_link"),
    rclLink: text("rcl_link"),
    rclProjectId: varchar("rcl_project_id", { length: 50 }),
    // Raw API metadata stored as JSONB for forward-compatibility
    rawMeta: jsonb("raw_meta"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("bills_kanban_stage_idx").on(table.kanbanStage),
    index("bills_date_idx").on(table.date),
    index("bills_status_idx").on(table.status),
    index("bills_is_eu_idx").on(table.isEU),
    // GIN index for full-text search on title + description (defined in SQL migration)
  ]
);

// ─────────────────────────────────────────────────────────────────────────────
// BILL STAGES (Etapy legislacyjne – Ścieżka Prawa)
// ─────────────────────────────────────────────────────────────────────────────
export const billStages = pgTable(
  "bill_stages",
  {
    id: serial("id").primaryKey(),
    billId: varchar("bill_id", { length: 20 })
      .notNull()
      .references(() => bills.id, { onDelete: "cascade" }),
    stageName: varchar("stage_name", { length: 255 }).notNull(),
    stageType: varchar("stage_type", { length: 100 }),
    organ: varchar("organ", { length: 100 }),
    date: date("date"),
    sortOrder: integer("sort_order").default(0),
    // Children sub-stages stored as JSONB (e.g. committee referrals)
    children: jsonb("children"),
  },
  (table) => [
    index("bill_stages_bill_id_idx").on(table.billId),
    index("bill_stages_date_idx").on(table.date),
  ]
);

// ─────────────────────────────────────────────────────────────────────────────
// SITTINGS (Posiedzenia Sejmu)
// ─────────────────────────────────────────────────────────────────────────────
export const sittings = pgTable(
  "sittings",
  {
    id: serial("id").primaryKey(),
    sittingNumber: integer("sitting_number").notNull(),
    term: integer("term").notNull().default(10),
    date: timestamp("date"),
  },
  (table) => [
    uniqueIndex("sittings_sitting_term_idx").on(
      table.sittingNumber,
      table.term
    ),
  ]
);

// ─────────────────────────────────────────────────────────────────────────────
// VOTINGS (Głosowania – metadane sesji głosowania)
// ─────────────────────────────────────────────────────────────────────────────
export const votings = pgTable(
  "votings",
  {
    id: serial("id").primaryKey(),
    sittingNumber: integer("sitting_number").notNull(),
    votingNumber: integer("voting_number").notNull(),
    term: integer("term").notNull().default(10),
    date: timestamp("date"),
    title: text("title"),
    description: text("description"),
    topic: text("topic"),
    kind: varchar("kind", { length: 50 }), // ELECTRONIC | ON_LIST
    majorityType: varchar("majority_type", { length: 50 }),
    majorityVotes: integer("majority_votes"),
    totalVoted: integer("total_voted"),
    yes: integer("yes").default(0),
    no: integer("no").default(0),
    abstain: integer("abstain").default(0),
    notParticipating: integer("not_participating").default(0),
    againstAll: integer("against_all").default(0),
  },
  (table) => [
    uniqueIndex("votings_sitting_voting_term_idx").on(
      table.sittingNumber,
      table.votingNumber,
      table.term
    ),
    index("votings_date_idx").on(table.date),
    index("votings_sitting_idx").on(table.sittingNumber),
  ]
);

// ─────────────────────────────────────────────────────────────────────────────
// VOTE RECORDS (Indywidualne głosy posłów)
// Kluczowa tabela dla: Rebel Score, Attendance, Porównywarka
// ─────────────────────────────────────────────────────────────────────────────
export const voteRecords = pgTable(
  "vote_records",
  {
    id: serial("id").primaryKey(),
    votingId: integer("voting_id")
      .notNull()
      .references(() => votings.id, { onDelete: "cascade" }),
    deputyId: integer("deputy_id")
      .notNull()
      .references(() => deputies.id, { onDelete: "cascade" }),
    // Snapshot of club at time of vote (club can change!)
    clubAtVote: varchar("club_at_vote", { length: 100 }),
    vote: varchar("vote", { length: 30 }).notNull(), // YES | NO | ABSTAIN | VOTE_VALID | ABSENT
    sittingNumber: integer("sitting_number"),
    votingNumber: integer("voting_number"),
    term: integer("term").default(10),
  },
  (table) => [
    uniqueIndex("vote_records_voting_deputy_idx").on(
      table.votingId,
      table.deputyId
    ),
    index("vote_records_deputy_idx").on(table.deputyId),
    index("vote_records_club_idx").on(table.clubAtVote),
    index("vote_records_vote_idx").on(table.vote),
  ]
);

// ─────────────────────────────────────────────────────────────────────────────
// RELATIONS (Drizzle relational query builder)
// ─────────────────────────────────────────────────────────────────────────────
export const billsRelations = relations(bills, ({ many }) => ({
  stages: many(billStages),
}));

export const billStagesRelations = relations(billStages, ({ one }) => ({
  bill: one(bills, {
    fields: [billStages.billId],
    references: [bills.id],
  }),
}));

export const votingsRelations = relations(votings, ({ one, many }) => ({
  sitting: one(sittings, {
    fields: [votings.sittingNumber],
    references: [sittings.sittingNumber],
  }),
  voteRecords: many(voteRecords),
}));

export const voteRecordsRelations = relations(voteRecords, ({ one }) => ({
  voting: one(votings, {
    fields: [voteRecords.votingId],
    references: [votings.id],
  }),
  deputy: one(deputies, {
    fields: [voteRecords.deputyId],
    references: [deputies.id],
  }),
}));

export const deputiesRelations = relations(deputies, ({ many }) => ({
  voteRecords: many(voteRecords),
}));

// ─────────────────────────────────────────────────────────────────────────────
// TYPE EXPORTS (for use in application code)
// ─────────────────────────────────────────────────────────────────────────────
export type Deputy = typeof deputies.$inferSelect;
export type InsertDeputy = typeof deputies.$inferInsert;

export type Bill = typeof bills.$inferSelect;
export type InsertBill = typeof bills.$inferInsert;

export type BillStage = typeof billStages.$inferSelect;
export type InsertBillStage = typeof billStages.$inferInsert;

export type Sitting = typeof sittings.$inferSelect;
export type InsertSitting = typeof sittings.$inferInsert;

export type Voting = typeof votings.$inferSelect;
export type InsertVoting = typeof votings.$inferInsert;

export type VoteRecord = typeof voteRecords.$inferSelect;
export type InsertVoteRecord = typeof voteRecords.$inferInsert;
