import json
import urllib.request
import sys
import ssl
import os

# Determine the directory where the script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Output directory for the JSON file
OUTPUT_FILE = os.path.join(SCRIPT_DIR, "../frontend/public/data/mps.json") 

url = 'https://api.sejm.gov.pl/sejm/term10/MP'

try:
    print(f"Fetching data from {url}...")
    
    # Disable SSL verification for simplicity in some envs
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    with urllib.request.urlopen(url, context=ctx) as response:
        data = json.loads(response.read().decode())
    
    print(f"Total records fetched: {len(data)}")
    
    # Filter active MPs
    active_mps = [mp for mp in data if mp.get('active', False)]
    print(f"Active MPs: {len(active_mps)}")
    
    # Map to specific format matching the app's needs
    # App expects: { name: "...", party: "...", district: "...", ... }
    formatted_mps = []
    for mp in active_mps:
        formatted_mps.append({
            "id": mp.get('id'),
            "name": mp.get('firstLastName'),
            "party": mp.get('club') or "Niezrzeszony",
            "district": f"Okręg {mp.get('districtNum', 0)}",
            "photoUrl": f"https://api.sejm.gov.pl/sejm/term10/MP/{mp.get('id')}/photo-mini"
        })
    
    # Sort alphabetically
    formatted_mps.sort(key=lambda x: x['name'])
    
    # Ensure output dir exists if we are traversing
    # os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    
    # Save as JSON directly for easy import in TS
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(formatted_mps, f, indent=4, ensure_ascii=False)
        
    print(f"Successfully wrote {len(formatted_mps)} MPs to {OUTPUT_FILE}")

except Exception as e:
    print(f"Error: {e}")
    print("If the output path is wrong, please adjust OUTPUT_FILE in the script.")
    sys.exit(1)
