import json
import urllib.request
import sys
import ssl
import os
from constants import KanbanStages
from storage import Storage

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
        date = item.get('processStartDate') or item.get('documentDate') or item.get('changeDate') or ''
        
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
            "eliLink": next((l['href'] for l in item.get('links', []) if l.get('rel') == 'eli'), None),
            "rclLink": next((l['href'] for l in item.get('links', []) if 'legislacja.rcl.gov.pl' in l.get('href', '')), None)
        })
        
    # Sort by date descending (newest first)
    formatted_bills.sort(key=lambda x: x['date'], reverse=True)
    
    # Save List as JSON
    Storage.save_json("bills.json", formatted_bills)
        
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
            
            Storage.save_json(f"bills/{ueid}.json", details)
                
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
        if not details: return KanbanStages.INICJATYWA
        
        stages = details.get('stages', [])
        if not stages: return KanbanStages.INICJATYWA
        
        # Reverse iterate to find the most advanced stage
        # Logic: We look for the last significant event
        
        # Flatten simple list of stage names for easy checking
        stage_names = [s.get('stageName', '').lower() for s in stages]
        last_stage_name = stage_names[-1] if stage_names else ""
        
        # 1. Final States
        if "wejście w życie" in last_stage_name: return KanbanStages.WEJSCIE_W_ZYCIE
        if "publikacja" in last_stage_name or "ogłoszono" in last_stage_name: return KanbanStages.PUBLIKACJA
        if "podpis" in last_stage_name: return KanbanStages.PUBLIKACJA # Signed
        
        # 2. President
        # Check if any stage is President-related and we aren't in publication yet
        if any("prezydent" in s for s in stage_names):
             return KanbanStages.PREZYDENT

        # 3. Senate
        # Check if we are in Senate phase
        if any("senat" in s for s in stage_names):
            # Check for specific Senate events in reverse order
            for s in reversed(stage_names):
                if "senat" in s:
                    if "uchwała" in s or "stanowisko" in s: return KanbanStages.SENAT_GLOSOWANIE
                    if "komisj" in s: return KanbanStages.SENAT_KOMISJE
            return KanbanStages.SENAT_KOMISJE # Fallback
            
        # 4. Sejm (if not Senate/President/Final)
        # Check Sejm sub-stages
        
        # Look for the last matching Sejm event
        for s in reversed(stage_names):
            if "głosowanie" in s or "iii czytanie" in s: return KanbanStages.SEJM_GLOSOWANIE
            if "ii czytanie" in s: return KanbanStages.SEJM_II_CZYTANIE
            if "sprawozdanie komisji" in s or "prace w komisjach" in s: return KanbanStages.SEJM_KOMISJE
            if "i czytanie" in s: return KanbanStages.SEJM_I_CZYTANIE
            if "skierowano do" in s and "komisj" in s: return KanbanStages.SEJM_KOMISJE

        # Fallback
        return KanbanStages.INICJATYWA

    enriched_bills = []
    for bill in formatted_bills:
        ueid = bill['id']
        detail_path = os.path.join(DETAILS_DIR, f"{ueid}.json")
        kanban_stage = KanbanStages.INICJATYWA # Default
        
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
                    if not bill.get('rclLink'):
                        bill['rclLink'] = next((l['href'] for l in details.get('links', []) if 'legislacja.rcl.gov.pl' in l.get('href', '')), bill.get('rclLink'))
            except:
                pass
                
        # Resolve RCL project ID if we have a link
        if bill.get('rclLink') and not bill.get('rclProjectId'):
            try:
                # Disguise as browser to avoid blocks
                req = urllib.request.Request(
                    bill['rclLink'], 
                    method="HEAD",
                    headers={'User-Agent': 'Mozilla/5.0'}
                )
                with urllib.request.urlopen(req, context=ctx) as res:
                    final_url = res.url
                    if "/projekt/" in final_url:
                        bill['rclProjectId'] = final_url.split("/projekt/")[-1].strip()
            except Exception as e:
                pass
        
        bill['kanbanStage'] = kanban_stage
        enriched_bills.append(bill)

    # Save Enriched Data
    Storage.save_json("bills.json", enriched_bills)
    
    print(f"Updated {OUTPUT_FILE} with Kanban stages.")

except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
