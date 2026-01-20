import urllib.request
import urllib.parse
import urllib.error
import ssl
import json
import os
import re
import sys
import time
from bs4 import BeautifulSoup

# Base Configuration
BASE_URL = "https://www.senat.gov.pl"
START_URL = f"{BASE_URL}/prace/posiedzenia/"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "../frontend/public/data/senat/votings")

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
                wait_time = (i + 1) * 5 # Backoff 5, 10, 15...
                print(f"  Rate limited (429). Waiting {wait_time}s...")
                time.sleep(wait_time)
            else:
                print(f"Error fetching {url} (Attempt {i+1}/{retries}): {e}")
                time.sleep(2)
        except Exception as e:
            print(f"Error fetching {url} (Attempt {i+1}/{retries}): {e}")
            time.sleep(2)
    return None

def parse_sittings(html):
    soup = BeautifulSoup(html, 'lxml')
    sittings = []
    
    # Looking for lines like "50. posiedzenie Senatu RP XI kadencji"
    # Structure: <div class="headline"><h3...><a href="...">X. posiedzenie...</a></h3></div>
    
    # We can search for links containing "posiedzenie Senatu RP XI kadencji"
    links = soup.find_all('a', string=re.compile(r'posiedzenie Senatu RP XI kadencji'))
    
    for link in links:
        text = link.get_text(strip=True)
        href = link.get('href')
        
        # Extract number
        match = re.search(r'^(\d+)\.', text)
        if match and href:
            sitting_num = int(match.group(1))
            
            # Extract ID from href: /prace/posiedzenia/tematy,650,1.html -> 650
            # Note: We need the ID for the VOTING page which is usually same ID? 
            # Actually, looking at URLs:
            # Sitting 50: tematy,650,1.html
            # Sitting 49: tematy,649,1.html
            # So the ID in URL is the database ID for the sitting.
            
            id_match = re.search(r',(\d+),', href)
            if id_match:
                sitting_id = id_match.group(1)
                sittings.append({
                    'number': sitting_num,
                    'id': sitting_id,
                    'url': href,
                    'title': text
                })
                
    # Sort by number descending
    sittings.sort(key=lambda x: x['number'], reverse=True)
    return sittings

def get_ajax_url_base(html):
    # Find the AJAX URL in the script
    match = re.search(r"url:\s*'([^']+zpLI[^']+)'", html)
    if match:
        full_url = match.group(1)
        if not full_url.startswith('http'):
            full_url = BASE_URL + full_url
        return full_url
    return None

def parse_votings(html, sitting_id):
    soup = BeautifulSoup(html, 'lxml')
    votings = []
    
    # Find AJAX URL
    ajax_base = get_ajax_url_base(html)
    if not ajax_base:
        # Fallback if not found in this page (maybe standard?)
        # Use known one from analysis
        ajax_base = "https://www.senat.gov.pl/ajax/zpLIv5maiZeP2dVz072W0JqshubKhJO9p86wl4jnzZyrtpzepamC5sqEk7qZ/"
        print("Warning: Could not find AJAX URL in page, using fallback.")

    # Voting items are in <div class="row">...</div> but simpler to find the "imienne" link with rel attribute
    # <a href="#" rel="id_14332" class="jq-szczegoly-glosowania">imienne</a>
    
    details_links = soup.find_all('a', class_='jq-szczegoly-glosowania')
    
    print(f"Found {len(details_links)} votings.")
    
    for link in details_links:
        rel = link.get('rel') # e.g. "id_14332"
        if not rel: 
            continue
            
        if isinstance(rel, list):
            rel = rel[0]
            
        vote_db_id = rel.replace('id_', '')
        
        # Determine Title and Number
        # Parent row context
        # The structure is:
        # <div class="row">
        #   <div class="col-lg-2">NUMBER</div>
        #   <div class="col-lg-5"><div>TITLE</div><p>TOPIC</p></div>
        #   <div class="voting-results">...LINK...</div>
        # </div>
        
        row = link.find_parent('div', class_='row')
        # Wait, the link is deep inside: div.row -> div.voting-results -> div.col -> div.row -> col -> link
        # We need to go up to the main row.
        
        parent_voting_results = link.find_parent('div', class_='voting-results')
        if not parent_voting_results:
             continue
             
        main_row = parent_voting_results.find_parent('div', class_='row')
        
        if not main_row:
            continue
            
        number_div = main_row.find('div', class_='col-lg-2')
        vote_num = number_div.get_text(strip=True) if number_div else "?"
        
        content_div = main_row.find('div', class_='col-lg-5')
        title = ""
        topic = ""
        if content_div:
            title_div = content_div.find('div')
            if title_div:
                title = title_div.get_text(strip=True)
            topic_p = content_div.find('p', class_='podpis')
            if topic_p:
                topic = topic_p.get_text(strip=True)
                
        # Fetch Details
        details = fetch_vote_details(ajax_base, vote_db_id)
        
        votings.append({
            'pertaining_to': title, # Mapping title to pertaining_to for consistency
            'description': topic,
            'votingNumber': vote_num,
            'date': "", # Date is not easily available here, maybe from sitting?
            'yes': details.get('yes', 0),
            'no': details.get('no', 0),
            'abstain': details.get('abstain', 0),
            'notParticipating': details.get('absent', 0),
            'totalVoted': details.get('total', 0),
            'kind': 'Electronic', # Assumption
            'sitting': sitting_id,
            'term': 11 # Hardcoded for now
        })
        time.sleep(1.5) # Increased delay to avoid 429
        
    return votings

def fetch_vote_details(base_url, vote_id):
    # url: base + /?id_posiedzenia=ID
    url = f"{base_url}?id_posiedzenia={vote_id}"
    html = fetch_url(url)
    if not html:
        return {}
        
    soup = BeautifulSoup(html, 'lxml')
    
    # <span class="label">za: </span><span class="value">87</span>
    
    results = {}
    
    def get_value(label_text):
        label = soup.find('span', class_='label', string=re.compile(label_text))
        if label:
            val_span = label.find_next_sibling('span', class_='value')
            if val_span:
                return int(val_span.get_text(strip=True))
        return 0
        
    results['total'] = get_value(r'głosowało')
    results['yes'] = get_value(r'za')
    results['no'] = get_value(r'przeciw')
    results['abstain'] = get_value(r'wstrzymało')
    
    # Absent? Not explicitly labeled generally in main summary?
    # Actually wait, snippet showed:
    # <span class="label">głosowało: </span><span class="value">88</span>
    # ...
    # Senators list has "nieob."
    # We can calculate absent if we know total senators (100) - total voted?
    # Or count them from the list.
    # Counting is safer.
    
    absent_count = 0
    senators = soup.find_all('div', class_='senator')
    for sen in senators:
        status_div = sen.find_all('div')[-1] # Last div is status
        if status_div and 'nieob.' in status_div.get_text(strip=True):
            absent_count += 1
            
    results['absent'] = absent_count
    
    return results

def run_fetch(progress=None, task_id=None):
    if progress and task_id:
        progress.console.print("🚀 Starting Senate Data Fetch...")
    else:
        print("🚀 Starting Senate Data Fetch...")
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    main_html = fetch_url(START_URL)
    if not main_html:
        print("Failed to fetch main page.")
        return
        
    sittings = parse_sittings(main_html)
    
    if progress and task_id:
        progress.update(task_id, total=len(sittings))
    else:
        print(f"Found {len(sittings)} sittings.")
    
    for sitting in sittings:
        output_file = os.path.join(OUTPUT_DIR, f"{sitting['number']}.json")
        if os.path.exists(output_file):
            if progress and task_id:
                progress.advance(task_id)
            # print(f"Skipping Sitting {sitting['number']} (already fetched).")
            continue

        msg = f"Processing Sitting {sitting['number']} (ID: {sitting['id']})..."
        if progress and task_id:
            progress.update(task_id, description=f"Senat: Sitting {sitting['number']}")
        else:
            print(msg)
        
        # Construct Votings URL: /prace/posiedzenia/przebieg,{ID},1,glosowania.html
        votings_url = f"{BASE_URL}/prace/posiedzenia/przebieg,{sitting['id']},1,glosowania.html"
        
        votings_html = fetch_url(votings_url)
        if not votings_html:
            print(f"  Failed to fetch votings for sitting {sitting['number']}")
            continue
            
        # Check if 404 (Senat returns custom 404 page usually, or might redirect)
        if "Błąd 404" in votings_html or "Nie znaleziono" in votings_html:
             print(f"  No votings page found (maybe future sitting?)")
             continue
             
        votings = parse_votings(votings_html, sitting['number'])
        
        if votings:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(votings, f, indent=2, ensure_ascii=False)
            print(f"  Saved {len(votings)} votings to {output_file}")
        else:
            print("  No votings found.")
            
        if progress and task_id:
            progress.advance(task_id)

def main():
    run_fetch()
