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
SENATORS_URL = f"{BASE_URL}/sklad/senatorowie/"
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "../frontend/public/data/senators.json")

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

def parse_senators(html):
    soup = BeautifulSoup(html, 'lxml')
    senators = []

    # Senators are usually in a list or grid.
    # Structure based on inspection/standard layout:
    # <div class="senator-item"> ... </div> or similar.
    # Let's look for specific elements.
    
    # Assuming standard Senat list:
    # <div class="sklad-senatu-lista">
    #   <div class="element">
    #     <a href="...">
    #       <img ...>
    #       <div class="opis">
    #         <h3>Imie Nazwisko</h3>
    #         <p>Klub ...</p>
    #       </div>
    #     </a>
    #   </div>
    # </div>

    # Finding the main container
    container = soup.find('div', class_='sklad-senatu-lista')
    if not container:
        # Fallback search strategies
        container = soup.find('div', class_='senatorowie-lista') 
        
    if not container:
        print("Could not find senators list container.")
        return []

    elements = container.find_all('div', class_='element')
    
    for el in elements:
        link = el.find('a')
        if not link: continue
        
        href = link.get('href')
        if not href.startswith('http'):
            href = BASE_URL + href
            
        full_name = ""
        party = "Niezrzeszony"
        district = "Okręg Senat" # Placeholder
        photo_url = None
        
        # Parse Name
        title_tag = el.find('h3')
        if title_tag:
            full_name = title_tag.get_text(strip=True)
            
        # Parse Party/Club
        # Often in a p tag under h3
        desc_div = el.find('div', class_='opis')
        if desc_div:
            p_tags = desc_div.find_all('p')
            for p in p_tags:
                txt = p.get_text(strip=True)
                if 'Klub' in txt or 'Koło' in txt:
                    party = txt
                    
        # Parse Image
        img = el.find('img')
        if img:
            src = img.get('src')
            if src and not src.startswith('http'):
                photo_url = BASE_URL + src
            elif src:
                photo_url = src
        
        senators.append({
            'name': full_name,
            'party': party,
            'district': district,
            'photoUrl': photo_url,
            'detailsUrl': href,
            'type': 'Senator'
        })

    return senators

def run_fetch():
    print("🚀 Starting Senators Fetch...")
    
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    
    html = fetch_url(SENATORS_URL)
    if not html:
        print("Failed to fetch senators page.")
        return
        
    senators = parse_senators(html)
    
    if senators:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(senators, f, indent=2, ensure_ascii=False)
        print(f"✅ Saved {len(senators)} senators to {OUTPUT_FILE}")
    else:
        print("❌ No senators found.")

if __name__ == "__main__":
    run_fetch()
