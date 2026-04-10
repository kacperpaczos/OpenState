import requests
import sys
from pathlib import Path

# Add core directory to path for db_manager
sys.path.append(str(Path(__file__).parent))
from db_manager import DbManager

def fetch_and_sync_mps():
    print("=" * 60)
    print("  OpenState - Sejm API Sync (Term 10)")
    print("=" * 60)
    
    url = "https://api.sejm.gov.pl/sejm/term10/MP"
    
    try:
        print(f"📡  Fetching data from {url}...")
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        mps_data = response.json()
        
        print(f"📦  Received {len(mps_data)} MP records.")
        
        # Transform data (to get photoUrl and other derived fields)
        from transform.politicians import MPsTransformer
        transformer = MPsTransformer()
        clean_data = transformer.transform(mps_data)
        
        # Validate quality
        warnings = transformer.validate(clean_data)
        for warn in warnings:
            print(f"  ⚠️  [Quality Check] {warn}")
        
        db = DbManager()
        db.upsert_deputies(clean_data, "Poseł")
        
        print("\n" + "=" * 60)
        print(f"✅  Sync COMPLETED. Database updated with {len(clean_data)} MPs.")
        print("=" * 60)
        
    except Exception as e:
        print(f"❌  Sync FAILED: {e}")
        sys.exit(1)

if __name__ == "__main__":
    fetch_and_sync_mps()
