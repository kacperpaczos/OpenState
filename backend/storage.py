import os
from .db_manager import DbManager

# Initialize DB Manager for direct database storage
db_manager = DbManager()

class Storage:
    @staticmethod
    def save_json(filename, data):
        """
        Routing method that sends data directly to PostgreSQL.
        Maintains the signature for backward compatibility with existing scripts.
        """
        print(f"[Storage] Intercepted save for {filename}. Routing to PostgreSQL...")
        
        try:
            Storage._sync_to_db(filename, data)
            print(f"  ✅  Data successfully saved to Database.")
        except Exception as e:
            print(f"  ❌  Database save failed for {filename}: {e}")
            # We don't save to JSON anymore as a fallback by user request

    @staticmethod
    def _sync_to_db(filename, data):
        """Internal helper to route data to the correct DB upsert method."""
        if filename == "mps.json":
            db_manager.upsert_deputies(data, "Poseł")
        elif filename == "senators.json":
            db_manager.upsert_deputies(data, "Senator")
        elif filename == "bills.json":
            # Bulk upsert of summaries
            for bill in data:
                db_manager.upsert_bill(bill["id"], bill)
        elif "bills/" in filename and filename.endswith(".json"):
            # Detailed bill upsert
            bill_id = os.path.basename(filename).replace(".json", "")
            db_manager.upsert_bill(bill_id, {}, data)
        elif "votings/" in filename and filename.endswith(".json") and "/" in filename:
            # Detailed voting upsert (votings/{sitting}/{voting}.json)
            parts = filename.split("/")
            if len(parts) >= 3 and parts[-1] != "index.json":
                try:
                    sitting_num = int(parts[-2])
                    db_manager.upsert_voting(sitting_num, data)
                except ValueError:
                    pass

    @staticmethod
    def load_json(filename):
        """
        Legacy method. Since we are DB-only, loading from local JSON is deprecated.
        Will return None to signal that it should be fetched from DB instead.
        """
        print(f"[Storage] Warning: load_json called for {filename}. This project is now DB-only.")
        return None
