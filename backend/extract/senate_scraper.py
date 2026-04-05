import logging
from typing import Any
from pathlib import Path
from extract.base import BaseExtractor
from core.exceptions import ExtractError
from core.config import SENAT_BASE_URL
from bs4 import BeautifulSoup

try:
    from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout
except ImportError:
    sync_playwright = None

logger = logging.getLogger("ETL_EXTRACT_SENATE")

class SenateScraper(BaseExtractor):
    """Uses Playwright to bypass Cloudflare and scrape Senate data."""
    
    def __init__(self):
        super().__init__(source_name="senat_html")
        self.base_url = SENAT_BASE_URL
        if not sync_playwright:
            logger.warning("Playwright is not installed. SenateScraper will fail.")

    def _fetch_html_with_playwright(self, url: str, wait_selector: str = None) -> str:
        """Fetches HTML using headless Chromium, waiting for CF challenge to pass."""
        if not sync_playwright:
            raise ExtractError("Playwright library missing in environment.")
            
        logger.info(f"Opening headless browser for: {url}")
        
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                context = browser.new_context(
                    user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                )
                page = context.new_page()
                page.goto(url, wait_until="domcontentloaded")
                
                # Cloudflare often shows "Just a moment..." 
                # We wait until the real content appears.
                if wait_selector:
                    try:
                        logger.debug(f"Waiting for {wait_selector} to bypass Cloudflare...")
                        page.wait_for_selector(wait_selector, timeout=20000)
                    except PlaywrightTimeout:
                        logger.warning(f"Timeout waiting for {wait_selector}. CF might have blocked us or selector is wrong.")
                        
                # Just wait another 2 seconds to be safe
                page.wait_for_timeout(2000)
                
                content = page.content()
                browser.close()
                return content
                
        except Exception as e:
            raise ExtractError(f"Playwright failed to fetch {url}: {e}") from e

    def extract_senators(self) -> list[dict]:
        """Scrapes the main list of Senators."""
        url = f"{self.base_url}/sklad/senatorowie/"
        html = self._fetch_html_with_playwright(url, wait_selector="div.sklad-senatu-lista, div.senatorowie-lista")
        
        soup = BeautifulSoup(html, 'lxml')
        container = soup.find('div', class_='sklad-senatu-lista') or soup.find('div', class_='senatorowie-lista')
        if not container:
            raise ExtractError("Could not find senators container in the DOM. Layout changed or blocked by CF.")
            
        elements = container.find_all('div', class_='element')
        senators = []
        for el in elements:
            link = el.find('a')
            if not link: continue
            
            href = link.get('href', '')
            if not href.startswith('http'): href = self.base_url + href
                
            full_name = el.find('h3').get_text(strip=True) if el.find('h3') else ""
            party = "Niezrzeszony"
            desc_div = el.find('div', class_='opis')
            if desc_div:
                for p in desc_div.find_all('p'):
                    txt = p.get_text(strip=True)
                    if 'Klub' in txt or 'Koło' in txt: party = txt
                        
            img = el.find('img')
            photo_url = img.get('src') if img else None
            if photo_url and not photo_url.startswith('http'): photo_url = self.base_url + photo_url
            
            senators.append({
                'name': full_name,
                'party': party,
                'district': "Okręg Senat", # To be enhanced
                'photoUrl': photo_url,
                'detailsUrl': href
            })
            
        self._save_raw_cache(senators, identifier="senators_list")
        return senators

    def extract(self) -> Any:
        # Default extract can be the Senators, matching the ETL Job expected structure.
        return self.extract_senators()
