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
            
            print("\n" + "-" * 40)
            print("  📊  DATA HEALTH REPORT")
            print("-" * 40)
            
            # 1. Missing Photos
            cur.execute("SELECT count(*), type FROM deputies WHERE (photo_url IS NULL OR photo_url = '') AND active = true GROUP BY type")
            missing_photos = cur.fetchall()
            print("📸  Missing Photos (Active):")
            if not missing_photos:
                print("    ✅  All active members have photos.")
            for count, type_name in missing_photos:
                print(f"    - {type_name}: {count} members missing photos")
            
            # 2. Missing Emails
            cur.execute("SELECT count(*) FROM deputies WHERE (email IS NULL OR email = '') AND active = true")
            missing_emails = cur.fetchone()[0]
            print(f"✉️   Active members missing email: {missing_emails}")
            if missing_emails > 0:
                print("    ⚠️  Consider checking the Sejm API source.")

            # 3. Missing Club Info
            cur.execute("SELECT count(*) FROM deputies WHERE (club IS NULL OR club = '') AND active = true")
            missing_clubs = cur.fetchone()[0]
            print(f"🏢  Active members missing club: {missing_clubs}")
            
        print("\n" + "=" * 60)
        print("  ✅  Verification COMPLETED. DbManager is ready for use.")
        print("=" * 60)
    else:
        print("  ❌  FAILED to establish database connection. Check DATABASE_URL.")
        sys.exit(1)

except Exception as e:
    print(f"  ❌  Verification CRASHED: {e}")
    sys.exit(1)
