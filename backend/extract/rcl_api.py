import logging
import json
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from typing import Any
from datetime import datetime

from extract.base import BaseExtractor
from core.exceptions import ExtractError
from core.config import RCL_API_BASE, REQUEST_TIMEOUT

logger = logging.getLogger("ETL_EXTRACT_RCL")

class RclXmlExtractor(BaseExtractor):
    """Handles extracting and parsing XML from the RCL endpoint."""
    
    def __init__(self):
        super().__init__(source_name="rcl_rss")
        self.url = "https://legislacja.rcl.gov.pl/rss"

    def extract(self) -> Any:
        try:
            logger.debug(f"Fetching RSS from {self.url}")
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'pl,en-US;q=0.7,en;q=0.3'
            }
            req = urllib.request.Request(self.url, headers=headers)
            with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as response:
                if response.status != 200:
                    raise ExtractError(f"HTTP {response.status} from RCL")
                
                xml_content = response.read().decode('utf-8')
                
                # Parse XML to dictionaries immediately so raw_cache is serializable
                root = ET.fromstring(xml_content)
                items = []
                for item in root.findall('.//item'):
                    items.append({
                        "title": item.findtext('title', ''),
                        "link": item.findtext('link', ''),
                        "description": item.findtext('description', ''),
                        "pubDate": item.findtext('pubDate', ''),
                        "guid": item.findtext('guid', ''),
                        "creator": item.findtext('{http://purl.org/dc/elements/1.1/}creator', '')
                    })
                
                self._save_raw_cache(items, identifier="rss")
                return items
                
        except Exception as e:
            raise ExtractError(f"Error extracting RCL data: {str(e)}") from e

class RclTransformer:
    """Transforms raw RCL RSS data into projects."""
    def transform(self, raw_data: Any) -> list[dict]:
        try:
            projects = []
            for item in raw_data:
                # Extract simple ID
                id_val = item.get('guid', '').replace("https://legislacja.rcl.gov.pl/projekt/", "")
                if not id_val:
                    id_val = str(len(projects) + 1)
                
                # Basic formatting
                projects.append({
                    "id": id_val,
                    "title": item.get('title', ''),
                    "url": item.get('link', ''),
                    "applicant": item.get('creator', 'Rząd'),
                    "date": datetime.now().strftime("%Y-%m-%d"), # Approximation as pubDate is complex
                    "number": id_val
                })
            return projects
        except Exception as e:
            raise TransformError(f"Error transforming RCL data: {e}") from e
