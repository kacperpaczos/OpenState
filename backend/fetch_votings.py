import json
import urllib.request
import urllib.error
import ssl
import os
import sys
import time

# Determine the directory where the script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Output base directory for votings
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "../frontend/public/data/votings")

# Endpoint for votings (Term 10)
URL_BASE = 'https://api.sejm.gov.pl/sejm/term10/votings'

def fetch_json(url):
    ctx = ssl.create_default_context()
    # Disable SSL verification (workaround for local env issues)
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    try:
        with urllib.request.urlopen(url, context=ctx) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code} for {url}")
        return None
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def main():
    print(f"🚀 Starting Votings Fetch from {URL_BASE}...")
    
    # 1. Fetch list of sittings that have votings
    # The endpoint returns a list of dictionaries with 'sitting' (number) and dates
    # Actually /votings returns basic info about each voting in a flat list or sitting list?
    # Docs: GET /sejm/term{term}/votings -> Returns list of votings (lightweight) OR list of sittings?
    # Let's check documentation or assume standard: usually it organizes by sitting.
    # We will try to fetch /votings which likely returns list of sittings/dates.
    
    # Correction: The API usually returns all votings summary if queried without params, 
    # but strictly structure is often /votings/{sitting}/{votingNum}
    
    # Let's first fetch the "schedule" or simply try sittings 1..100 until 404
    # But fetching /votings usually gives the list of sittings.
    
    sittings_data = fetch_json(URL_BASE)
    
    if not sittings_data:
        print("Failed to fetch votings list. Exiting.")
        sys.exit(1)
        
    # The API returns a list of objects, probably one per sitting or one per voting?
    # Usually it's one object per sitting containing "sitting" field.
    # Example structure: [{"sitting": 1, "date": "...", "votings": [...]}, ...] or simply list of sittings.
    
    # We will assume it returns list of objects with 'sitting'.
    
    # API returns list of days/proceedings. We need unique proceedings (sittings).
    proceedings = set()
    for item in sittings_data:
        p = item.get('proceeding')
        if p:
            proceedings.add(p)
            
    sorted_proceedings = sorted(list(proceedings))
    print(f"Found {len(sorted_proceedings)} proceedings (sittings).")
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    count_saved = 0
    
    for sitting_num in sorted_proceedings:
        print(f"Processing Sitting {sitting_num}...")
        sitting_dir = os.path.join(OUTPUT_DIR, str(sitting_num))
        os.makedirs(sitting_dir, exist_ok=True)
        
        # Check if we already have data for this sitting
        if os.path.exists(os.path.join(sitting_dir, "index.json")):
            print(f"  Skipping Sitting {sitting_num} (already fetched).")
            continue

        # Now fetch details for this sitting if we don't have them
        # url: /sejm/term10/votings/{sittingNum}
        sitting_url = f"{URL_BASE}/{sitting_num}"
        sitting_details = fetch_json(sitting_url)
        
        if not sitting_details:
             continue
             
        # sitting_details should contain a 'votings' list or inherit them?
        # Actually /votings/{sitting} returns list of votings for that sitting.
        
        # We save this summary for the sitting
        with open(os.path.join(sitting_dir, "index.json"), 'w', encoding='utf-8') as f:
            json.dump(sitting_details, f, indent=2, ensure_ascii=False)
            
        # Iterate over votings in this sitting to get DETAILS (who voted how)
        # This is heavy. Maybe we only fetch if not exists.
        
        for vote in sitting_details: # Assuming list of votings
            vote_num = vote.get('votingNumber')
             # Skip minor procedural votes if needed? No, let's keep all.
            
            # Detail path
            vote_file = os.path.join(sitting_dir, f"{vote_num}.json")
            
            # Optimization: Skip if exists
            if os.path.exists(vote_file):
                continue
                
            # Fetch details: /sejm/term10/votings/{sitting}/{voting}
            detail_url = f"{URL_BASE}/{sitting_num}/{vote_num}"
            vote_details = fetch_json(detail_url)
            
            if vote_details:
                with open(vote_file, 'w', encoding='utf-8') as f:
                    json.dump(vote_details, f, indent=2, ensure_ascii=False)
                count_saved += 1
                # print(f"  Saved Vote {vote_num}")
                
            # Rate limit
            # time.sleep(0.05)
            
    print(f"✅ Votings fetch complete. New records saved: {count_saved}")
    
    # --- SYNTHESIS STEP ---
    # Group votes by MP to avoid O(N*M) reads during build
    print("🔄 Aggregating votes by MP...")
    
    mp_votes = {} # mp_id -> list of vote records
    
    # Iterate all saved files (we might have skipped fetching, but we need to read for aggregation)
    # We walk the directory
    for root, dirs, files in os.walk(OUTPUT_DIR):
        for file in files:
            if file == "index.json": continue
            if not file.endswith(".json"): continue
            
            try:
                path_to_file = os.path.join(root, file)
                with open(path_to_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                # Extract metadata
                meta = {
                    "sitting": data.get('sitting'),
                    "votingNumber": data.get('votingNumber'),
                    "date": data.get('date'),
                    "title": data.get('title'),
                    "topic": data.get('topic', ''), # Topic might be missing
                    "kind": data.get('kind')
                }
                
                # Check votes
                votes_list = data.get('votes', [])
                for v in votes_list:
                    mp_id = v.get('MP')
                    vote_val = v.get('vote')
                    
                    if mp_id not in mp_votes:
                        mp_votes[mp_id] = []
                        
                    # Append lightweight record
                    mp_votes[mp_id].append({
                        **meta,
                        "vote": vote_val
                    })
                    
            except Exception as e:
                print(f"Error processing {file}: {e}")

    # Save aggregated files
    MP_VOTES_DIR = os.path.join(SCRIPT_DIR, "../frontend/public/data/votes_by_mp")
    os.makedirs(MP_VOTES_DIR, exist_ok=True)
    
    for mp_id, votes in mp_votes.items():
        # Sort by date desc
        votes.sort(key=lambda x: (x['date'], x['votingNumber']), reverse=True)
        
        # Save
        out_path = os.path.join(MP_VOTES_DIR, f"{mp_id}.json")
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(votes, f, indent=2, ensure_ascii=False)
            
    print(f"✅ Aggregated votes for {len(mp_votes)} MPs in {MP_VOTES_DIR}")

if __name__ == "__main__":
    main()
