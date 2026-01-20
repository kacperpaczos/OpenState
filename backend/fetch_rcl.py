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
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "../frontend/public/data/rcl/projects.json")

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
    
    # Table rows in .table-responsive table tbody
    # Look for links starting with /projekt/
    # <a href="/projekt/12406250">TITLE</a>
    
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
    details = {}
    
    # Status: Look for .cbp_tmicon_active
    active_icon = soup.find('div', class_='cbp_tmicon_active')
    if active_icon:
        # Parent li
        li = active_icon.find_parent('li')
        if li:
            label_div = li.find('div', class_='cbp_tmlabel_active') # or cbp_tmlabel?
            if not label_div:
                 label_div = li.find('div', class_='cbp_tmlabel')
            
            if label_div:
                # Text inside the link or just text
                link = label_div.find('a')
                if link:
                    details['status'] = link.get_text(strip=True)
                else:
                    details['status'] = label_div.get_text(strip=True).split('\n')[0].strip()
    
    # Clean status (remove number prefix "4. ")
    if 'status' in details:
        details['status'] = re.sub(r'^\d+\.\s*', '', details['status'])
        
    return details

def run_fetch(progress=None, task_id=None):
    if progress and task_id:
        progress.console.print("🚀 Starting RCL Data Fetch...")
    else:
        print("🚀 Starting RCL Data Fetch...")
    
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    
    all_projects = []
    
    MAX_PAGES = 3
    
    for page in range(1, MAX_PAGES + 1):
        if progress and task_id:
            progress.update(task_id, description=f"RCL: Page {page}/{MAX_PAGES}")
            
        url = LIST_URL_TEMPLATE.format(page=page)
        html = fetch_url(url)
        if not html:
            continue
            
        page_projects = parse_list_page(html)
        print(f"Page {page}: Found {len(page_projects)} projects.")
        
        for proj in page_projects:
            # Fetch details
            # print(f"  Fetching details for {proj['id']}...")
            details_html = fetch_url(proj['url'])
            if details_html:
                details = parse_project_details(details_html)
                proj.update(details)
                
            all_projects.append(proj)
            time.sleep(0.5) # Delay
            
        if progress and task_id:
            progress.advance(task_id, advance=33) # Rough advancement
        
        time.sleep(1)
        
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_projects, f, indent=2, ensure_ascii=False)
        
    print(f"Saved {len(all_projects)} projects to {OUTPUT_FILE}")

def main():
    run_fetch()
