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

# Base Configuration
BASE_URL = "https://legislacja.rcl.gov.pl"
LIST_URL_TEMPLATE = f"{BASE_URL}/lista?typeId=2&pNumber={{page}}"
# Output paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__)) # Ensure we use absolute paths relative to script
OUTPUT_LIST_FILE = os.path.join(SCRIPT_DIR, "../frontend/public/data/rcl/projects.json")
OUTPUT_DETAILS_DIR = os.path.join(SCRIPT_DIR, "../frontend/public/data/rcl/details")

# SSL Context (Unverified)
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def fetch_url(url, retries=3):
    print(f"Fetching: {url}")
    for i in range(retries):
        try:
            req = urllib.request.Request(
                url, 
                headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'}
            )
            with urllib.request.urlopen(req, context=ctx, timeout=20) as response:
                return response.read().decode('utf-8')
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait_time = (i + 1) * 5
                print(f"  Rate limited (429). Waiting {wait_time}s...")
                time.sleep(wait_time)
            elif e.code == 404:
                print(f"  404 Not Found: {url}")
                return None
            else:
                print(f"Error fetching {url} (Attempt {i+1}/{retries}): {e}")
                time.sleep(2)
        except Exception as e:
            print(f"Error fetching {url} (Attempt {i+1}/{retries}): {e}")
            time.sleep(2)
    return None

def parse_list_page(html):
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
            
            # Metadata columns
            cols = row.find_all('td')
            applicant = cols[1].get_text(strip=True) if len(cols) > 1 else ""
            number_in_list = cols[2].get_text(strip=True) if len(cols) > 2 else ""
            date_created = cols[3].get_text(strip=True) if len(cols) > 3 else ""
            
            projects.append({
                'id': project_id,
                'title': title,
                'url': BASE_URL + href,
                'applicant': applicant,
                'number': number_in_list,
                'date': date_created
            })
            
    return projects

def parse_project_details(html):
    soup = BeautifulSoup(html, 'lxml')
    details = {
        'description': '',
        'stages': [],
        'documents': [],
        'status': ''
    }
    
    # 1. Status (cbp_tmicon_active)
    active_icon = soup.find('div', class_='cbp_tmicon_active')
    if active_icon:
        li = active_icon.find_parent('li')
        if li:
            label_div = li.find('div', class_='cbp_tmlabel_active') or li.find('div', class_='cbp_tmlabel')
            if label_div:
                link = label_div.find('a')
                status_raw = link.get_text(strip=True) if link else label_div.get_text(strip=True).split('\n')[0].strip()
                details['status'] = re.sub(r'^\d+\.\s*', '', status_raw)

    # 2. Description/Summary
    # Usually in a panel or first content block. 
    # Structure varies, but often in #wersja_view > div.row
    # Let's try to find a "Opis" or "Tytuł" distinct from header
    # For now, we'll try to get more metadata if available in summary table
    
    # 3. Timeline / Stages
    # Found in <ul class="cbp_tmtimeline">
    timeline = soup.find('ul', class_='cbp_tmtimeline')
    if timeline:
        for li in timeline.find_all('li'):
            stage_name = ""
            date = ""
            
            # Date is in <time class="cbp_tmtime" datetime="...">
            time_el = li.find('time', class_='cbp_tmtime')
            if time_el:
                date = time_el.get_text(strip=True)
                
            # Content in cbp_tmlabel / cbp_tmlabel_active
            label_div = li.find('div', class_='cbp_tmlabel') or li.find('div', class_='cbp_tmlabel_active')
            if label_div:
                header = label_div.find('h2') or label_div.find('a')
                if header:
                    stage_name = header.get_text(strip=True)
                else: 
                     # fallback
                    stage_name = label_div.get_text(strip=True).split('\n')[0]
            
            # Determine if this stage is completed (passed)
            # Active one has cbp_tmicon_active, previous usually cbp_tmicon (but style might vary)
            # We can assume older dates + active are "done/current"
            
            status_class = "pending"
            if li.find('div', class_='cbp_tmicon_active'):
                status_class = "current"
            elif li.find('div', class_='cbp_tmicon') and date: # Has date usually means happened
                status_class = "completed"
                
            details['stages'].append({
                'name': re.sub(r'^\d+\.\s*', '', stage_name),
                'date': date,
                'status': status_class
            })

    # 4. Documents
    # Look for table with documents, usually under catalog view
    # This is complex as it might be nested. 
    # Simplified approach: Look for all links to .pdf/.docx in div.catalog-view
    catalog_view = soup.find('div', class_='catalog-view')
    if catalog_view:
        for link in catalog_view.find_all('a', href=True):
            href = link['href']
            text = link.get_text(strip=True)
            if href.lower().endswith('.pdf') or href.lower().endswith('.docx') or href.lower().endswith('.doc'):
                details['documents'].append({
                    'title': text or os.path.basename(href),
                    'url': BASE_URL + href if href.startswith('/') else href
                })

    return details

def run_fetch():
    print("🚀 Starting RCL Data Fetch...")
    
    os.makedirs(os.path.dirname(OUTPUT_LIST_FILE), exist_ok=True)
    os.makedirs(OUTPUT_DETAILS_DIR, exist_ok=True)
    
    # 1. Read existing bills.json to fetch missing RCL details for registered bills
    bills_path = os.path.join(SCRIPT_DIR, "../frontend/public/data/bills.json")
    target_rcl_ids = set()
    if os.path.exists(bills_path):
        try:
            with open(bills_path, 'r', encoding='utf-8') as f:
                bills = json.load(f)
            for b in bills:
                if b.get('rclProjectId'):
                    target_rcl_ids.add(b['rclProjectId'])
        except Exception as e:
            print("Error reading bills.json:", e)

    print(f"Targeting {len(target_rcl_ids)} specific RCL projects from bills.")
    
    # 2. Fetch fresh lists
    all_projects = []
    MAX_PAGES = 3 # Fetch first 3 pages
    
    for page in range(1, MAX_PAGES + 1):
        url = LIST_URL_TEMPLATE.format(page=page)
        html = fetch_url(url)
        if not html:
            continue
            
        page_projects = parse_list_page(html)
        print(f"Page {page}: Found {len(page_projects)} projects.")
        
        for proj in page_projects:
            # Check if details already exist and it's not in explicit targets (to avoid over-hammering)
            target_rcl_ids.discard(proj['id']) # Remove from explicit targets since we process it now
            
            details_html = fetch_url(proj['url'])
            if details_html:
                details = parse_project_details(details_html)
                if details.get('status'):
                    proj['status'] = details['status']
                
                full_details = {**proj, **details}
                detail_path = os.path.join(OUTPUT_DETAILS_DIR, f"{proj['id']}.json")
                with open(detail_path, 'w', encoding='utf-8') as f:
                    json.dump(full_details, f, indent=2, ensure_ascii=False)
                
            all_projects.append(proj)
            time.sleep(0.2)
            
        time.sleep(1)
        
    # 3. Fetch missing explicit targets
    print(f"Fetching {len(target_rcl_ids)} remaining targeted RCL projects...")
    for missing_id in target_rcl_ids:
        missing_url = f"{BASE_URL}/projekt/{missing_id}"
        details_html = fetch_url(missing_url)
        if details_html:
            details = parse_project_details(details_html)
            # Create a mock project entry based on details
            proj_mock = {
                'id': missing_id,
                'title': f"Projekt {missing_id}", # We might not have the full title immediately if missing from table
                'url': missing_url,
                'status': details.get('status', '')
            }
            full_details = {**proj_mock, **details}
            detail_path = os.path.join(OUTPUT_DETAILS_DIR, f"{missing_id}.json")
            with open(detail_path, 'w', encoding='utf-8') as f:
                json.dump(full_details, f, indent=2, ensure_ascii=False)
            time.sleep(0.2)
        
    # Save List
    with open(OUTPUT_LIST_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_projects, f, indent=2, ensure_ascii=False)
        
    print(f"✅ Saved {len(all_projects)} projects to {OUTPUT_LIST_FILE}")
    print(f"✅ Saved details to {OUTPUT_DETAILS_DIR}")

if __name__ == "__main__":
    run_fetch()

