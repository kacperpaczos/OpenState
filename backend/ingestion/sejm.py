import json
import urllib.request
import sys
import ssl
import os
import time

class SejmIngestor:
    def __init__(self, base_dir):
        self.base_dir = base_dir
        self.term = 10
        self.api_url = f'https://api.sejm.gov.pl/sejm/term{self.term}/processes'
        # Define output paths
        self.output_file = os.path.join(self.base_dir, "frontend/lib/bills_data.json")
        self.details_dir = os.path.join(self.base_dir, "frontend/public/data/bills")
        
        # SSL Context
        self.ctx = ssl.create_default_context()
        self.ctx.check_hostname = False
        self.ctx.verify_mode = ssl.CERT_NONE

    def fetch_all_processes(self):
        print(f"📡 Fetching legislative processes from {self.api_url}...")
        all_data = []
        limit = 100
        offset = 0
        
        while True:
            request_url = f"{self.api_url}?limit={limit}&offset={offset}"
            try:
                with urllib.request.urlopen(request_url, context=self.ctx) as response:
                    batch = json.loads(response.read().decode())
                
                if not batch:
                    break
                    
                all_data.extend(batch)
                
                if len(batch) < limit:
                    break
                
                offset += limit
            except Exception as e:
                print(f"❌ Error fetching list: {e}")
                break
                
        print(f"✅ Fetched {len(all_data)} raw processes.")
        return all_data

    def transform_bill(self, item):
        if item.get('documentType') != 'projekt ustawy':
            return None

        # Extract meaningful title
        title = item.get('title') or item.get('description') or "Bez tytułu"
        ueid = item.get('UEID') or item.get('number')
        
        # Get print number
        print_num = item.get('number', 'N/A')
        if item.get('prints') and len(item['prints']) > 0:
             print_num = item['prints'][0].get('number', print_num)
        
        description = item.get('description', '')
        date = item.get('proceedingsDate', '')
        
        # Initialize with temporary status
        status = "W toku"
        
        author_type = "Inny"
        lower_title = title.lower()
        if "rządowy" in lower_title: author_type = "Rządowy"
        elif "poselski" in lower_title: author_type = "Poselski"
        elif "obywatelski" in lower_title: author_type = "Obywatelski"
        elif "senacki" in lower_title: author_type = "Senacki"
        elif "komisyjny" in lower_title: author_type = "Komisyjny" # Added Common case

        return {
            "id": ueid,
            "printNo": print_num,
            "title": title,
            "description": description,
            "date": date,
            "status": status,
            "documentType": item.get('documentType', 'Inny'),
            "authorType": author_type,
            "isapLink": next((l['href'] for l in item.get('links', []) if l.get('rel') == 'isap'), None),
            "eliLink": next((l['href'] for l in item.get('links', []) if l.get('rel') == 'eli'), None)
        }

    def determine_stage(self, details):
        if not details: return "Inicjatywa"
        
        stages = details.get('stages', [])
        if not stages: return "Inicjatywa"
        
        # Flatten stage names
        stage_names = [s.get('stageName', '').lower() for s in stages]
        last_stage_name = stage_names[-1] if stage_names else ""
        
        # 1. Final States
        if "wejście w życie" in last_stage_name: return "Wejście w życie"
        if "publikacja" in last_stage_name or "ogłoszono" in last_stage_name: return "Publikacja"
        if "podpis" in last_stage_name: return "Publikacja"
        
        # 2. President
        if any("prezydent" in s for s in stage_names):
             return "Prezydent"

        # 3. Senate
        if any("senat" in s for s in stage_names):
            for s in reversed(stage_names):
                if "senat" in s:
                    if "uchwała" in s or "stanowisko" in s: return "Senat - Głosowanie"
                    if "komisj" in s: return "Senat - Komisje"
            return "Senat - Prace"
            
        # 4. Sejm
        for s in reversed(stage_names):
            if "głosowanie" in s or "iii czytanie" in s: return "Sejm - Głosowanie"
            if "ii czytanie" in s: return "Sejm - II Czytanie"
            if "sprawozdanie komisji" in s or "prace w komisjach" in s: return "Sejm - Komisje"
            if "i czytanie" in s: return "Sejm - I Czytanie"
            if "skierowano do" in s and "komisj" in s: return "Sejm - Komisje"

        return "Inicjatywa"

    def fetch_details_and_enrich(self, bills):
        os.makedirs(self.details_dir, exist_ok=True)
        print(f"📦 Fetching details for {len(bills)} bills into {self.details_dir}...")
        
        enriched_bills = []
        
        for i, bill in enumerate(bills):
            ueid = bill['id']
            detail_path = os.path.join(self.details_dir, f"{ueid}.json")
            details = None
            
            # Fetch or Load
            # Strategy: Always fetch to get latest status updates
            details_url = f"{self.api_url}/{ueid}"
            try:
                with urllib.request.urlopen(details_url, context=self.ctx) as response:
                    details = json.loads(response.read().decode())
                
                # Save details
                with open(detail_path, 'w', encoding='utf-8') as f:
                    json.dump(details, f, indent=4, ensure_ascii=False)
                    
            except Exception as e:
                # If fetch fails, try to load existing
                if os.path.exists(detail_path):
                    with open(detail_path, 'r', encoding='utf-8') as f:
                        details = json.load(f)
                else:
                    print(f"⚠️ Failed to fetch/load details for {ueid}: {e}")
            
            # Enrich
            kanban_stage = "Inicjatywa"
            if details:
                kanban_stage = self.determine_stage(details)
                # Sycn links
                if not bill.get('isapLink'):
                    bill['isapLink'] = next((l['href'] for l in details.get('links', []) if l.get('rel') == 'isap'), None)
                if not bill.get('eliLink'):
                    bill['eliLink'] = next((l['href'] for l in details.get('links', []) if l.get('rel') == 'eli'), None)

            bill['kanbanStage'] = kanban_stage
            enriched_bills.append(bill)
            
            if i % 20 == 0:
                print(f"   Processed {i}/{len(bills)}")

        return enriched_bills

    def run(self):
        raw_data = self.fetch_all_processes()
        
        # Filter and Initial Transform
        bills = []
        for item in raw_data:
            b = self.transform_bill(item)
            if b:
                bills.append(b)
        
        # Sort by date
        bills.sort(key=lambda x: x['date'], reverse=True)
        print(f"🔍 Found {len(bills)} bills (projekty ustaw).")
        
        # Enrich with Stage Data
        final_bills = self.fetch_details_and_enrich(bills)
        
        # Save Main List
        os.makedirs(os.path.dirname(self.output_file), exist_ok=True)
        with open(self.output_file, 'w', encoding='utf-8') as f:
            json.dump(final_bills, f, indent=4, ensure_ascii=False)
            
        print(f"✅ Saved enriched data to {self.output_file}")

if __name__ == "__main__":
    # Allow running this file directly for testing
    # Assuming script is in backend/ingestion/sejm.py, base_dir is ../../
    current_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.abspath(os.path.join(current_dir, "../../"))
    ingestor = SejmIngestor(base_dir)
    ingestor.run()
