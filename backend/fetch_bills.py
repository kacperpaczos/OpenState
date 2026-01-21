import json
import urllib.request
import sys
import ssl
import os

# Determine the directory where the script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Output directory for the JSON file
OUTPUT_FILE = os.path.join(SCRIPT_DIR, "../frontend/public/data/bills.json") 

# Endpoint for legislative processes (Term 10)
URL = 'https://api.sejm.gov.pl/sejm/term10/processes'

try:
    # Disable SSL verification
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    all_data = []
    limit = 100
    offset = 0
    
    while True:
        request_url = f"{URL}?limit={limit}&offset={offset}"
        print(f"Fetching legislative data from {request_url}...")
        
        with urllib.request.urlopen(request_url, context=ctx) as response:
            batch = json.loads(response.read().decode())
            
        if not batch:
            break
            
        all_data.extend(batch)
        print(f"Fetched {len(batch)} items. Total so far: {len(all_data)}")
        
        if len(batch) < limit:
            break
            
        offset += limit
    
    data = all_data
    print(f"Total processes fetched: {len(data)}")
    
    # Filter and Map
    # We want things that look like bills (projects). 
    # The API returns all processes, some might be minor.
    # We will map them to a simplified structure for the search engine.
    
    formatted_bills = []
    
    for item in data:
        # Filter for actual bills (projects of acts)
        if item.get('documentType') != 'projekt ustawy':
             continue

        # Extract meaningful title
        title = item.get('title') or item.get('description') or "Bez tytułu"
        ueid = item.get('UEID') or item.get('number')
        
        # Get print number (use process number if print list is missing)
        # Often process number correlates with print number or is the main ID
        print_num = item.get('number', 'N/A')
        if item.get('prints') and len(item['prints']) > 0:
             print_num = item['prints'][0].get('number', print_num)
        
        # Determine status/date
        description = item.get('description', '')
        date = item.get('proceedingsDate', '') # Date of initiation
        
        formatted_bills.append({
            "id": ueid,
            "printNo": print_num,
            "title": title,
            "description": description,
            "date": date,
            "status": "W toku",
            "documentType": item.get('documentType', 'Inny'),
            "authorType": "Rządowy" if "rządowy" in title.lower() else "Poselski" if "poselski" in title.lower() else "Obywatelski" if "obywatelski" in title.lower() else "Senacki" if "senacki" in title.lower() else "Inny",
            "isapLink": next((l['href'] for l in item.get('links', []) if l.get('rel') == 'isap'), None),
            "eliLink": next((l['href'] for l in item.get('links', []) if l.get('rel') == 'eli'), None)
        })
        
    # Sort by date descending (newest first)
    formatted_bills.sort(key=lambda x: x['date'], reverse=True)
    
    # Save List as JSON
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(formatted_bills, f, indent=4, ensure_ascii=False)
        
    print(f"Successfully wrote {len(formatted_bills)} bills to {OUTPUT_FILE}")

    # --- PART 2: FETCH DETAILS FOR EACH BILL ---
    DETAILS_DIR = os.path.join(SCRIPT_DIR, "../frontend/public/data/bills")
    os.makedirs(DETAILS_DIR, exist_ok=True)
    
    print(f"Fetching details for {len(formatted_bills)} bills into {DETAILS_DIR}...")
    
    import time
    
    for i, bill in enumerate(formatted_bills):
        ueid = bill['id']
        detail_path = os.path.join(DETAILS_DIR, f"{ueid}.json")
        
        # Skip if already exists (optional, but good for speed if re-running)
        # For now, always fetch to ensure freshness
        
        details_url = f"https://api.sejm.gov.pl/sejm/term10/processes/{ueid}"
        
        try:
            with urllib.request.urlopen(details_url, context=ctx) as response:
                details = json.loads(response.read().decode())
            
            with open(detail_path, 'w', encoding='utf-8') as f:
                json.dump(details, f, indent=4, ensure_ascii=False)
                
            if i % 10 == 0:
                print(f"Saved {i}/{len(formatted_bills)}: {ueid}")
                
            # Be nice to the API
            # time.sleep(0.05) 
            
        except Exception as e:
            print(f"Failed to fetch details for {ueid}: {e}")

    print("All details fetched.")
    
    # --- PART 3: ENRICH DATA WITH STAGES ---
    print("Enriching bills data with Kanban stages...")
    
    def determine_stage(details):
        if not details: return "Inicjatywa"
        
        stages = details.get('stages', [])
        if not stages: return "Inicjatywa"
        
        # Reverse iterate to find the most advanced stage
        # Logic: We look for the last significant event
        
        # Flatten simple list of stage names for easy checking
        stage_names = [s.get('stageName', '').lower() for s in stages]
        last_stage_name = stage_names[-1] if stage_names else ""
        
        # 1. Final States
        if "wejście w życie" in last_stage_name: return "Wejście w życie"
        if "publikacja" in last_stage_name or "ogłoszono" in last_stage_name: return "Publikacja"
        if "podpis" in last_stage_name: return "Publikacja" # Signed
        
        # 2. President
        # Check if any stage is President-related and we aren't in publication yet
        if any("prezydent" in s for s in stage_names):
             return "Prezydent"

        # 3. Senate
        # Check if we are in Senate phase
        if any("senat" in s for s in stage_names):
            # Check for specific Senate events in reverse order
            for s in reversed(stage_names):
                if "senat" in s:
                    if "uchwała" in s or "stanowisko" in s: return "Senat - Głosowanie"
                    if "komisj" in s: return "Senat - Komisje"
            return "Senat - Prace" # Fallback if just generic 'skierowano do senatu'
            
        # 4. Sejm (if not Senate/President/Final)
        # Check Sejm sub-stages
        
        # Look for the last matching Sejm event
        for s in reversed(stage_names):
            if "głosowanie" in s or "iii czytanie" in s: return "Sejm - Głosowanie"
            if "ii czytanie" in s: return "Sejm - II Czytanie"
            if "sprawozdanie komisji" in s or "prace w komisjach" in s: return "Sejm - Komisje"
            if "i czytanie" in s: return "Sejm - I Czytanie"
            if "skierowano do" in s and "komisj" in s: return "Sejm - Komisje"

        # Fallback
        return "Inicjatywa"

    enriched_bills = []
    for bill in formatted_bills:
        ueid = bill['id']
        detail_path = os.path.join(DETAILS_DIR, f"{ueid}.json")
        kanban_stage = "Inicjatywa" # Default
        
        if os.path.exists(detail_path):
            try:
                with open(detail_path, 'r', encoding='utf-8') as f:
                    details = json.load(f)
                    kanban_stage = determine_stage(details)
                    # Enrichment: Update links if missing (details usually have them too)
                    if not bill.get('isapLink'):
                        bill['isapLink'] = next((l['href'] for l in details.get('links', []) if l.get('rel') == 'isap'), None)
                    if not bill.get('eliLink'):
                        bill['eliLink'] = next((l['href'] for l in details.get('links', []) if l.get('rel') == 'eli'), None)
            except:
                pass
        
        bill['kanbanStage'] = kanban_stage
        enriched_bills.append(bill)

    # Save Enriched Data
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(enriched_bills, f, indent=4, ensure_ascii=False)
    
    print(f"Updated {OUTPUT_FILE} with Kanban stages.")

except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
