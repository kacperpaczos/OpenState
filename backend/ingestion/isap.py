import urllib.request
import urllib.error
import ssl
import json
import os
import time
import sys

class ISAPIngestor:
    def __init__(self, base_dir):
        self.base_dir = base_dir
        self.eli_api_url = "https://eli.gov.pl/api/acts/DU"
        self.isap_dl_url = "https://isap.sejm.gov.pl/isap.nsf/download.xsp"
        # Output: public/data/isap
        self.output_dir = os.path.join(self.base_dir, "frontend/public/data/isap")
        
        # SSL Context
        self.ctx = ssl.create_default_context()
        self.ctx.check_hostname = False
        self.ctx.verify_mode = ssl.CERT_NONE

    def fetch_json(self, url):
        try:
            req = urllib.request.Request(
                url, 
                headers={'User-Agent': 'Mozilla/5.0'}
            )
            with urllib.request.urlopen(req, context=self.ctx, timeout=30) as response:
                return json.loads(response.read().decode('utf-8'))
        except Exception as e:
            print(f"  ❌ Error fetching JSON {url}: {e}")
            return None

    def download_file(self, url, dest_path):
        if os.path.exists(dest_path):
            print(f"  ⏭️  File exists: {os.path.basename(dest_path)}")
            return True
            
        try:
            print(f"  ⬇️  Downloading {url}...")
            req = urllib.request.Request(
                url, 
                headers={'User-Agent': 'Mozilla/5.0'}
            )
            with urllib.request.urlopen(req, context=self.ctx, timeout=60) as response:
                with open(dest_path, 'wb') as f:
                    f.write(response.read())
            return True
        except Exception as e:
            print(f"  ⚠️ Download failed: {e}")
            return False

    def run(self, year=2024, limit=10):
        print(f"🚀 Starting ISAP Data Fetch (Year {year})...")
        
        # 1. Fetch List
        list_url = f"{self.eli_api_url}/{year}"
        print(f"📖 Fetching list from {list_url}...")
        
        data = self.fetch_json(list_url)
        if not data or 'items' not in data:
            # The API returns a list directly or inside 'items'?
            # My curl check showed a list of objects? 
            # Wait, `curl ... | head` showed `{"address":...}, {"address":...}`
            # It might be a JSON Array directly.
            pass
            
        acts = data if isinstance(data, list) else data.get('items', [])
        print(f"   Found {len(acts)} acts.")
        
        # Sort by pos descending (newest first)
        acts.sort(key=lambda x: x.get('pos', 0), reverse=True)
        
        # Apply limit
        if limit and limit > 0:
            acts = acts[:limit]
            print(f"   Processing top {limit} newest acts.")
            
        # 2. Process
        pdf_dir = os.path.join(self.output_dir, "pdfs", str(year))
        os.makedirs(pdf_dir, exist_ok=True)
        
        results = []
        
        for act in acts:
            address = act.get('address') # WDU20240000001
            pos = act.get('pos')
            title = act.get('title')
            
            # Construct Filename: D{Year}{Pos padded to 4}.pdf
            # Example: D20240001.pdf
            # But what if pos > 9999?
            # Safe padding: 4 digits.
            filename = f"D{year}{pos:04d}.pdf"
            
            # Construct URL
            # https://isap.sejm.gov.pl/isap.nsf/download.xsp/WDU20240000001/O/D20240001.pdf
            dl_url = f"{self.isap_dl_url}/{address}/O/{filename}"
            
            dest_path = os.path.join(pdf_dir, filename)
            
            success = self.download_file(dl_url, dest_path)
            
            results.append({
                "id": address,
                "pos": pos,
                "title": title,
                "localPath": f"/data/isap/pdfs/{year}/{filename}",
                "downloaded": success
            })
            
            time.sleep(0.5)
            
        # Save Metadata
        meta_path = os.path.join(self.output_dir, f"acts_{year}.json")
        with open(meta_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=4, ensure_ascii=False)
            
        print(f"✅ Finished. Metadata saved to {meta_path}")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.abspath(os.path.join(current_dir, "../../"))
    ingestor = ISAPIngestor(base_dir)
    ingestor.run(limit=5)
