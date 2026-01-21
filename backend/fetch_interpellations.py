import json
import urllib.request
import urllib.error
import ssl
import os
import sys

# Determine the directory where the script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Output base directory
OUTPUT_FILE_LIST = os.path.join(SCRIPT_DIR, "../frontend/public/data/interpellations_list.json")
OUTPUT_DIR_DETAILS = os.path.join(SCRIPT_DIR, "../frontend/public/data/interpellations")

# Endpoint
URL_BASE = 'https://api.sejm.gov.pl/sejm/term10/interpellations'

def fetch_json(url):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    try:
        with urllib.request.urlopen(url, context=ctx) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def main():
    print(f"Starting Interpellations Fetch from {URL_BASE}...")
    
    # 1. Fetch List (All)
    # This might be large, so we might need paging if API uses it.
    # api.sejm.gov.pl documentation says /interpellations returns list.
    # It supports limit/offset? Usually yes.
    # Let's try basic fetch and see if we get a list.
    
    all_items = []
    
    # Simple strategy: fetch all if possible or page
    # Let's assume paging is safer
    offset = 0
    limit = 100
    while True:
        url = f"{URL_BASE}?offset={offset}&limit={limit}"
        batch = fetch_json(url)
        if not batch:
            break
        all_items.extend(batch)
        if len(batch) < limit:
            break
        offset += limit
        print(f"Fetched {len(all_items)} interpellations...")

    print(f"Total interpellations found: {len(all_items)}")
    
    # Save the main list
    os.makedirs(os.path.dirname(OUTPUT_FILE_LIST), exist_ok=True)
    with open(OUTPUT_FILE_LIST, 'w', encoding='utf-8') as f:
        json.dump(all_items, f, indent=2, ensure_ascii=False)
        
    # 2. Fetch Details (Content) for each
    os.makedirs(OUTPUT_DIR_DETAILS, exist_ok=True)
    
    count_saved = 0
    for item in all_items:
        num = item.get('num')
        if not num: continue
        
        path = os.path.join(OUTPUT_DIR_DETAILS, f"{num}.json")
        if os.path.exists(path):
            continue
            
        detail_url = f"{URL_BASE}/{num}"
        details = fetch_json(detail_url)
        
        if details:
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(details, f, indent=2, ensure_ascii=False)
            count_saved += 1
            if count_saved % 10 == 0:
                print(f"Saved detail {num}")
                
    print(f"✅ Interpellations fetch complete. New details saved: {count_saved}")

if __name__ == "__main__":
    main()
