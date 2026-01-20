import urllib.request
import urllib.parse
import urllib.error
import ssl
import json
import os
import re
import time
import sys
from bs4 import BeautifulSoup

class RCLIngestor:
    def __init__(self, base_dir):
        self.base_dir = base_dir
        self.base_url = "https://legislacja.rcl.gov.pl"
        self.list_url_template = f"{self.base_url}/lista?typeId=2&pNumber={{page}}"
        self.output_file = os.path.join(self.base_dir, "frontend/public/data/rcl/projects.json")
        
        # SSL Context
        self.ctx = ssl.create_default_context()
        self.ctx.check_hostname = False
        self.ctx.verify_mode = ssl.CERT_NONE

    def fetch_url(self, url, retries=3):
        # formatted_url = url.replace(" ", "%20") # Basic safety
        for i in range(retries):
            try:
                req = urllib.request.Request(
                    url, 
                    headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'}
                )
                with urllib.request.urlopen(req, context=self.ctx, timeout=20) as response:
                    return response.read().decode('utf-8')
            except urllib.error.HTTPError as e:
                if e.code == 429:
                    wait_time = (i + 1) * 5
                    print(f"  ⏳ Rate limited (429). Waiting {wait_time}s...")
                    time.sleep(wait_time)
                elif e.code == 404:
                    print(f"  ❌ 404 Not Found: {url}")
                    return None
                else:
                    print(f"  ⚠️ Error fetching {url} (Attempt {i+1}/{retries}): {e}")
                    time.sleep(2)
            except Exception as e:
                print(f"  ⚠️ Error fetching {url} (Attempt {i+1}/{retries}): {e}")
                time.sleep(2)
        return None

    def parse_list_page(self, html):
        soup = BeautifulSoup(html, 'lxml')
        projects = []
        
        table = soup.find('table', id='table')
        if not table:
            return []
            
        rows = table.find_all('tr')
        for row in rows:
            link = row.find('a', href=re.compile(r'^/projekt/\d+'))
            if link:
                title = link.get_text(strip=True)
                href = link.get('href')
                project_id = href.split('/')[-1]
                
                cols = row.find_all('td')
                applicant = cols[1].get_text(strip=True) if len(cols) > 1 else ""
                number_in_list = cols[2].get_text(strip=True) if len(cols) > 2 else ""
                date_created = cols[3].get_text(strip=True) if len(cols) > 3 else ""
                
                projects.append({
                    'id': project_id,
                    'title': title,
                    'url': self.base_url + href,
                    'applicant': applicant,
                    'number': number_in_list,
                    'date': date_created
                })
        return projects

    def parse_project_details(self, html):
        soup = BeautifulSoup(html, 'lxml')
        details = {}
        
        active_icon = soup.find('div', class_='cbp_tmicon_active')
        if active_icon:
            li = active_icon.find_parent('li')
            if li:
                label_div = li.find('div', class_='cbp_tmlabel_active')
                if not label_div:
                     label_div = li.find('div', class_='cbp_tmlabel')
                
                if label_div:
                    link = label_div.find('a')
                    if link:
                        details['status'] = link.get_text(strip=True)
                    else:
                        details['status'] = label_div.get_text(strip=True).split('\n')[0].strip()
        
        if 'status' in details:
            details['status'] = re.sub(r'^\d+\.\s*', '', details['status'])
            
        return details

    def run(self):
        print("🚀 Starting RCL Data Fetch...")
        os.makedirs(os.path.dirname(self.output_file), exist_ok=True)
        
        all_projects = []
        MAX_PAGES = 3
        
        for page in range(1, MAX_PAGES + 1):
            url = self.list_url_template.format(page=page)
            print(f"📖 Page {page}: Fetching {url}...")
            
            html = self.fetch_url(url)
            if not html:
                continue
                
            page_projects = self.parse_list_page(html)
            print(f"   Found {len(page_projects)} projects.")
            
            for i, proj in enumerate(page_projects):
                # Fetch details (could be parallelized later)
                # print(f"   Fetching details for {proj['id']}...")
                details_html = self.fetch_url(proj['url'])
                if details_html:
                    details = self.parse_project_details(details_html)
                    proj.update(details)
                    
                all_projects.append(proj)
                time.sleep(0.5) # Be nice to the server
                
            time.sleep(1)
            
        # Save
        with open(self.output_file, 'w', encoding='utf-8') as f:
            json.dump(all_projects, f, indent=4, ensure_ascii=False)
            
        print(f"✅ Saved {len(all_projects)} RCL projects to {self.output_file}")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.abspath(os.path.join(current_dir, "../../"))
    ingestor = RCLIngestor(base_dir)
    ingestor.run()
