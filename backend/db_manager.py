import os
import json
import psycopg2
import psycopg2.extras
from pathlib import Path
from datetime import datetime
from typing import Optional, Union, List, Dict

class DbManager:
    def __init__(self):
        self.db_url = os.environ.get("DATABASE_URL")
        self.conn = None
        
        # Load .env.local if available (for local development)
        if not self.db_url:
            try:
                from dotenv import load_dotenv
                load_dotenv(Path(__file__).parent.parent / "frontend" / ".env.local")
                self.db_url = os.environ.get("DATABASE_URL")
            except ImportError:
                pass

    def get_connection(self):
        if not self.db_url:
            return None
        try:
            if self.conn is None or self.conn.closed:
                self.conn = psycopg2.connect(self.db_url)
                self.conn.autocommit = True
            return self.conn
        except Exception as e:
            print(f"[DbManager] Connection error: {e}")
            return None

    def upsert_deputies(self, mps_data: List[Dict], type_name: str = "Poseł"):
        """Upsert a list of deputies into the DB."""
        conn = self.get_connection()
        if not conn: return
        
        rows = []
        for d in mps_data:
            try:
                d_id = int(d["id"])
                rows.append((
                    d_id,
                    d.get("name", ""),
                    d.get("name", "").split(" ")[0] if d.get("name") else None,
                    " ".join(d.get("name", "").split(" ")[1:]) if d.get("name") else None,
                    d.get("party"),
                    d.get("club"),
                    d.get("district"),
                    d.get("photoUrl"),
                    d.get("email"),
                    d.get("active", True),
                    type_name,
                    10 # Default term
                ))
            except (ValueError, KeyError):
                continue

        sql = """
            INSERT INTO deputies
                (id, name, first_name, last_name, party, club,
                 district, photo_url, email, active, type, term)
            VALUES %s
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                party = EXCLUDED.party,
                club = EXCLUDED.club,
                photo_url = EXCLUDED.photo_url,
                active = EXCLUDED.active,
                type = EXCLUDED.type,
                updated_at = now()
        """
        with conn.cursor() as cur:
            psycopg2.extras.execute_values(cur, sql, rows)
            print(f"[DbManager] Upserted {len(rows)} {type_name}s")

    def upsert_bill(self, bill_id: str, summary: Dict, details: Dict = None):
        """Upsert a single bill and its stages."""
        conn = self.get_connection()
        if not conn: return
        
        details = details or {}
        
        bill_row = (
            str(bill_id),
            summary.get("printNo") or bill_id,
            summary.get("title", ""),
            summary.get("description"),
            summary.get("documentType"),
            summary.get("authorType"),
            summary.get("status"),
            summary.get("kanbanStage"),
            bool(summary.get("isEU", False)),
            bool(details.get("passed", False)),
            int(summary.get("term", 10)),
            summary.get("date"),
            details.get("processStartDate"),
            details.get("urgencyStatus", "NORMAL"),
            summary.get("isapLink"),
            summary.get("eliLink"),
            summary.get("rclLink"),
            summary.get("rclProjectId")
        )

        sql_bill = """
            INSERT INTO bills
                (id, print_no, title, description, document_type, author_type,
                 status, kanban_stage, is_eu, passed, term, date, process_start_date,
                 urgency_status, isap_link, eli_link, rcl_link, rcl_project_id)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                kanban_stage = EXCLUDED.kanban_stage,
                status = EXCLUDED.status,
                passed = EXCLUDED.passed,
                updated_at = now()
        """
        
        with conn.cursor() as cur:
            cur.execute(sql_bill, bill_row)
            
            # Stages
            stages = details.get("stages", [])
            if stages:
                cur.execute("DELETE FROM bill_stages WHERE bill_id = %s", (bill_id,))
                stage_rows = []
                for i, s in enumerate(stages):
                    stage_rows.append((
                        bill_id, s.get("stageName", ""), s.get("stageType"), 
                        s.get("organ"), s.get("date"), i, 
                        json.dumps(s.get("children")) if s.get("children") else None
                    ))
                psycopg2.extras.execute_values(
                    cur, 
                    "INSERT INTO bill_stages (bill_id, stage_name, stage_type, organ, date, sort_order, children) VALUES %s",
                    stage_rows
                )
        print(f"[DbManager] Upserted bill {bill_id}")

    def upsert_voting(self, sitting_num: int, v: Dict):
        """Upsert a single voting and its records."""
        conn = self.get_connection()
        if not conn: return
        
        v_num = int(v.get("votingNumber", 0))
        voting_row = (
            sitting_num, v_num, 10, v.get("date"), v.get("title"),
            v.get("description"), v.get("topic"), v.get("kind"),
            v.get("majorityType"), v.get("majorityVotes"), v.get("totalVoted"),
            int(v.get("yes", 0)), int(v.get("no", 0)), int(v.get("abstain", 0)),
            int(v.get("notParticipating", 0)), int(v.get("againstAll", 0))
        )

        sql_v = """
            INSERT INTO votings
                (sitting_number, voting_number, term, date, title, description,
                 topic, kind, majority_type, majority_votes, total_voted,
                 yes, no, abstain, not_participating, against_all)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            ON CONFLICT (sitting_number, voting_number, term) DO UPDATE SET
                yes = EXCLUDED.yes, no = EXCLUDED.no, abstain = EXCLUDED.abstain
            RETURNING id
        """

        with conn.cursor() as cur:
            cur.execute(sql_v, voting_row)
            voting_id = cur.fetchone()[0]
            
            # Votes
            votes = v.get("votes", [])
            if votes:
                record_rows = []
                for vote in votes:
                    dep_id = vote.get("MP")
                    if not dep_id: continue
                    record_rows.append((
                        voting_id, int(dep_id), vote.get("club"), 
                        vote.get("vote", "ABSENT"), sitting_num, v_num, 10
                    ))
                
                # We update vote_records by sitting/voting to keep it clean
                cur.execute("DELETE FROM vote_records WHERE voting_id = %s", (voting_id,))
                psycopg2.extras.execute_values(
                    cur,
                    "INSERT INTO vote_records (voting_id, deputy_id, club_at_vote, vote, sitting_number, voting_number, term) VALUES %s",
                    record_rows
                )
        print(f"[DbManager] Upserted voting {sitting_num}/{v_num}")
