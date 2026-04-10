#!/usr/bin/env python3
"""
OpenState - JSON to PostgreSQL Migration Script
================================================
Reads all existing JSON data from frontend/public/data/ and loads
it into a fresh PostgreSQL database using UPSERT semantics.

Usage:
    pip install psycopg2-binary python-dotenv
    python3 backend/migrate_to_db.py

Environment Variables (from frontend/.env.local or shell):
    DATABASE_URL=postgresql://openstate:openstate_dev@localhost:5432/openstate
"""

import json
import os
import sys
import glob
from pathlib import Path
from datetime import datetime
from typing import Optional, Union, List, Dict

# ── Dependency check ──────────────────────────────────────────────────────────
try:
    import psycopg2
    import psycopg2.extras
except ImportError:
    print("❌  psycopg2 not found. Run: pip install psycopg2-binary")
    sys.exit(1)

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent / "frontend" / ".env.local")
except ImportError:
    pass  # dotenv optional – can use shell env directly

# ── Configuration ─────────────────────────────────────────────────────────────
DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    print("❌  DATABASE_URL not set. Check frontend/.env.local")
    sys.exit(1)

ROOT_DIR = Path(__file__).parent.parent
DATA_DIR = ROOT_DIR / "frontend" / "public" / "data"

# ── Helpers ───────────────────────────────────────────────────────────────────

def load_json(path: Path) -> Union[Dict, List, None]:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(f"  ⚠️  Skipping {path.name}: {e}")
        return None


def parse_date(val: Optional[str]) -> Optional[str]:
    """Normalize date strings to ISO format or return None."""
    if not val:
        return None
    try:
        # Handle datetime strings like "2023-11-13T15:17:22"
        if "T" in val:
            return datetime.fromisoformat(val).isoformat()
        # Plain date "2023-11-13"
        return val
    except (ValueError, AttributeError):
        return None


def batch_execute(cursor, sql: str, rows: list, batch_size: int = 500):
    """psycopg2 executemany in batches for performance."""
    for i in range(0, len(rows), batch_size):
        batch = rows[i : i + batch_size]
        psycopg2.extras.execute_values(cursor, sql, batch, page_size=batch_size)


# ── Migration Steps ───────────────────────────────────────────────────────────

def migrate_deputies(cursor) -> tuple[int, int]:
    """Load mps.json + senators.json → deputies table."""
    print("\n🏛️  Migrating deputies (posłowie + senatorowie)...")
    # Use a dict to deduplicate by ID before sending to DB
    deputy_map = {}

    # MPs
    mps_data = load_json(DATA_DIR / "mps.json") or []
    for mp in mps_data:
        d_id = int(mp["id"])
        deputy_map[d_id] = (
            d_id,
            mp.get("name", ""),
            mp.get("name", "").split(" ")[0] if mp.get("name") else None,
            " ".join(mp.get("name", "").split(" ")[1:]) if mp.get("name") else None,
            None,  # secondName not in mps.json summary
            mp.get("party"),
            mp.get("club"),
            mp.get("district"),
            mp.get("photoUrl"),
            mp.get("email"),
            mp.get("active", True),
            "Poseł",
            10,
        )

    # Senators (from senators.json - different structure, string IDs)
    senators_data = load_json(DATA_DIR / "senators.json") or []
    for sen in senators_data:
        try:
            d_id = int(sen["id"])
        except (ValueError, KeyError):
            continue
        # Senators overwrite or supplement MPs if ID overlaps
        deputy_map[d_id] = (
            d_id,
            sen.get("name", ""),
            sen.get("name", "").split(" ")[0] if sen.get("name") else None,
            " ".join(sen.get("name", "").split(" ")[1:]) if sen.get("name") else None,
            None,
            None,  # senators.json has no party field
            sen.get("club"),
            sen.get("district"),
            sen.get("photoUrl"),
            sen.get("email"),
            True,
            "Senator",
            11,  # Senate term differs
        )

    rows = list(deputy_map.values())

    sql = """
        INSERT INTO deputies
            (id, name, first_name, last_name, second_name, party, club,
             district, photo_url, email, active, type, term)
        VALUES %s
        ON CONFLICT (id) DO UPDATE SET
            name         = EXCLUDED.name,
            party        = EXCLUDED.party,
            club         = EXCLUDED.club,
            district     = EXCLUDED.district,
            photo_url    = EXCLUDED.photo_url,
            email        = EXCLUDED.email,
            active       = EXCLUDED.active,
            updated_at   = now()
    """
    batch_execute(cursor, sql, rows)
    print(f"  ✅  Upserted {len(mps_data)} MPs + {len(senators_data)} Senators = {len(rows)} total")
    return len(mps_data), len(senators_data)


def migrate_bills(cursor) -> int:
    """Load bills.json summary + bills/{id}.json details → bills + bill_stages."""
    print("\n📜  Migrating bills + stages...")

    summary_data = load_json(DATA_DIR / "bills.json") or []
    summary_map = {b["id"]: b for b in summary_data}

    bill_rows = []
    stage_rows = []

    detail_files = list((DATA_DIR / "bills").glob("*.json"))
    print(f"  Found {len(detail_files)} detail files + {len(summary_data)} summaries")

    # Process all bills from summary (even without detail file)
    for bill_id, summary in summary_map.items():
        # Try to load detail file
        detail_path = DATA_DIR / "bills" / f"{bill_id}.json"
        detail = load_json(detail_path) if detail_path.exists() else {}
        if detail is None:
            detail = {}

        bill_rows.append((
            str(bill_id),
            summary.get("printNo") or bill_id,
            summary.get("title", ""),
            summary.get("description"),
            summary.get("documentType"),
            summary.get("authorType"),
            summary.get("status"),
            summary.get("kanbanStage"),
            bool(summary.get("isEU", False)),
            bool(detail.get("passed", False)),
            int(summary.get("term", 10)),
            parse_date(summary.get("date")),
            parse_date(detail.get("processStartDate")),
            detail.get("urgencyStatus", "NORMAL"),
            summary.get("isapLink"),
            summary.get("eliLink"),
            summary.get("rclLink"),
            summary.get("rclProjectId"),
            json.dumps({"changeDate": detail.get("changeDate")} if detail else None),
        ))

        # Extract stages from detail
        for i, stage in enumerate(detail.get("stages", [])):
            stage_rows.append((
                str(bill_id),
                stage.get("stageName", ""),
                stage.get("stageType"),
                stage.get("organ"),
                parse_date(stage.get("date")),
                i,  # sort_order
                json.dumps(stage.get("children")) if stage.get("children") else None,
            ))

    # UPSERT bills
    sql_bills = """
        INSERT INTO bills
            (id, print_no, title, description, document_type, author_type,
             status, kanban_stage, is_eu, passed, term, date, process_start_date,
             urgency_status, isap_link, eli_link, rcl_link, rcl_project_id, raw_meta)
        VALUES %s
        ON CONFLICT (id) DO UPDATE SET
            title            = EXCLUDED.title,
            description      = EXCLUDED.description,
            kanban_stage     = EXCLUDED.kanban_stage,
            status           = EXCLUDED.status,
            passed           = EXCLUDED.passed,
            raw_meta         = EXCLUDED.raw_meta,
            updated_at       = now()
    """
    batch_execute(cursor, sql_bills, bill_rows)

    # Delete old stages and re-insert (simpler than upsert on serial PK)
    bill_ids = [r[0] for r in bill_rows]
    if bill_ids:
        cursor.execute(
            "DELETE FROM bill_stages WHERE bill_id = ANY(%s)",
            (bill_ids,)
        )

    sql_stages = """
        INSERT INTO bill_stages
            (bill_id, stage_name, stage_type, organ, date, sort_order, children)
        VALUES %s
    """
    if stage_rows:
        batch_execute(cursor, sql_stages, stage_rows)

    print(f"  ✅  Upserted {len(bill_rows)} bills, {len(stage_rows)} stages")
    return len(bill_rows)


def migrate_sittings(cursor) -> int:
    """Load votings/sittings.json → sittings table."""
    print("\n📅  Migrating sittings...")
    data = load_json(DATA_DIR / "votings" / "sittings.json") or []
    rows = []
    for s in data:
        rows.append((
            int(s["sitting"]),
            10,
            parse_date(s.get("date")),
        ))

    sql = """
        INSERT INTO sittings (sitting_number, term, date)
        VALUES %s
        ON CONFLICT (sitting_number, term) DO UPDATE SET
            date = EXCLUDED.date
    """
    batch_execute(cursor, sql, rows)
    print(f"  ✅  Upserted {len(rows)} sittings")
    return len(rows)


def migrate_votings_and_records(cursor) -> tuple[int, int]:
    """Load votings/{sitting}/{voting}.json → votings + vote_records."""
    print("\n🗳️  Migrating votings + vote_records (this may take a while)...")

    votings_dir = DATA_DIR / "votings"
    sitting_dirs = sorted(
        [d for d in votings_dir.iterdir() if d.is_dir()],
        key=lambda d: int(d.name)
    )

    total_votings = 0
    total_records = 0

    for sitting_dir in sitting_dirs:
        sitting_num = int(sitting_dir.name)
        voting_files = sorted(
            [f for f in sitting_dir.glob("*.json") if f.stem != "index"],
            key=lambda f: int(f.stem) if f.stem.isdigit() else 0
        )

        voting_rows = []
        for vf in voting_files:
            v = load_json(vf)
            if not v:
                continue
            voting_rows.append((
                sitting_num,
                int(v.get("votingNumber", vf.stem)),
                10,
                parse_date(v.get("date")),
                v.get("title"),
                v.get("description"),
                v.get("topic"),
                v.get("kind"),
                v.get("majorityType"),
                v.get("majorityVotes"),
                v.get("totalVoted"),
                int(v.get("yes", 0)),
                int(v.get("no", 0)),
                int(v.get("abstain", 0)),
                int(v.get("notParticipating", 0)),
                int(v.get("againstAll", 0)),
            ))

        if not voting_rows:
            continue

        sql_v = """
            INSERT INTO votings
                (sitting_number, voting_number, term, date, title, description,
                 topic, kind, majority_type, majority_votes, total_voted,
                 yes, no, abstain, not_participating, against_all)
            VALUES %s
            ON CONFLICT (sitting_number, voting_number, term) DO UPDATE SET
                date  = EXCLUDED.date,
                yes   = EXCLUDED.yes,
                no    = EXCLUDED.no,
                abstain = EXCLUDED.abstain
            RETURNING id, sitting_number, voting_number
        """
        psycopg2.extras.execute_values(cursor, sql_v, voting_rows, page_size=500)
        inserted_votings = cursor.fetchall()
        # Build lookup: (sitting, voting_num) → db_id
        voting_id_map = {(r[1], r[2]): r[0] for r in inserted_votings}
        total_votings += len(voting_rows)

        # Check for missing deputies before inserting records
        voted_deputy_ids = {int(vote.get("MP")) for f in voting_files if (v_data := load_json(f)) for vote in v_data.get("votes", []) if vote.get("MP")}
        if voted_deputy_ids:
            cursor.execute("SELECT id FROM deputies WHERE id = ANY(%s)", (list(voted_deputy_ids),))
            existing_ids = {r[0] for r in cursor.fetchall()}
            missing_ids = voted_deputy_ids - existing_ids
            
            if missing_ids:
                print(f"  ⚠️  Found {len(missing_ids)} missing deputies in votes. Creating placeholders...")
                placeholder_rows = [(mid, f"Poseł nieznany ({mid})", "Nieznany", False, "Inne") for mid in missing_ids]
                psycopg2.extras.execute_values(
                    cursor,
                    "INSERT INTO deputies (id, name, type, active, party) VALUES %s ON CONFLICT DO NOTHING",
                    placeholder_rows
                )

        # Now process vote_records for this sitting
        record_rows = []
        for vf in voting_files:
            v = load_json(vf)
            if not v:
                continue
            v_num = int(v.get("votingNumber", vf.stem))
            db_voting_id = voting_id_map.get((sitting_num, v_num))
            if not db_voting_id:
                continue

            for vote in v.get("votes", []):
                deputy_id = vote.get("MP")
                if not deputy_id:
                    continue
                record_rows.append((
                    db_voting_id,
                    int(deputy_id),
                    vote.get("club"),
                    vote.get("vote", "ABSENT"),
                    sitting_num,
                    v_num,
                    10,
                ))

        if record_rows:
            sql_r = """
                INSERT INTO vote_records
                    (voting_id, deputy_id, club_at_vote, vote,
                     sitting_number, voting_number, term)
                VALUES %s
                ON CONFLICT (voting_id, deputy_id) DO UPDATE SET
                    vote         = EXCLUDED.vote,
                    club_at_vote = EXCLUDED.club_at_vote
            """
            batch_execute(cursor, sql_r, record_rows)
            total_records += len(record_rows)

        print(f"  📦  Sitting {sitting_num}: {len(voting_rows)} votings, {len(record_rows)} records")

    print(f"  ✅  Total: {total_votings} votings, {total_records} vote_records")
    return total_votings, total_records


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("  OpenState – JSON → PostgreSQL Migration")
    print("=" * 60)
    print(f"  Database: {DATABASE_URL.split('@')[-1]}")  # hide credentials
    print(f"  Data dir: {DATA_DIR}")

    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = False

    try:
        with conn.cursor() as cur:
            migrate_deputies(cur)
            migrate_bills(cur)
            migrate_sittings(cur)
            migrate_votings_and_records(cur)

        conn.commit()
        print("\n" + "=" * 60)
        print("  ✅  Migration completed successfully!")
        print("=" * 60)

    except Exception as e:
        conn.rollback()
        print(f"\n❌  Migration FAILED: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
