import os
import sys
from pathlib import Path

# Add the current directory to path so we can import db_manager
sys.path.append(str(Path(__file__).parent))

try:
    from db_manager import DbManager
    print("=" * 60)
    print("  OpenState - Backend Database Verification")
    print("=" * 60)
    
    db = DbManager()
    conn = db.get_connection()
    
    if conn:
        print("  ✅  Connection to PostgreSQL established successfully.")
        
        with conn.cursor() as cur:
            # Check deputies count
            cur.execute("SELECT count(*), type FROM deputies GROUP BY type")
            results = cur.fetchall()
            print("\n🏛️  Deputies in Database:")
            for count, type_name in results:
                print(f"    - {type_name}: {count}")
            
            # Check bills count
            cur.execute("SELECT count(*) FROM bills")
            bill_count = cur.fetchone()[0]
            print(f"\n📜  Bills in Database: {bill_count}")
            
            # Check sittings count
            cur.execute("SELECT count(*) FROM sittings")
            sitting_count = cur.fetchone()[0]
            print(f"📅  Sittings in Database: {sitting_count}")
            
        print("\n" + "=" * 60)
        print("  ✅  Verification COMPLETED. DbManager is ready for use.")
        print("=" * 60)
    else:
        print("  ❌  FAILED to establish database connection. Check DATABASE_URL.")
        sys.exit(1)

except Exception as e:
    print(f"  ❌  Verification CRASHED: {e}")
    sys.exit(1)
