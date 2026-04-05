import urllib.request
import urllib.error
import ssl
import json
import logging
from typing import Any
from pathlib import Path
from datetime import datetime

from core.exceptions import ExtractError
from core.config import RAW_DATA_DIR, REQUEST_TIMEOUT

logger = logging.getLogger("ETL_EXTRACT")

class BaseExtractor:
    """Abstract base class for all Extractor modules."""
    
    def __init__(self, source_name: str):
        self.source_name = source_name
        
    def _save_raw_cache(self, data: Any, identifier: str) -> None:
        """Saves a raw snapshot to the data lake (.cache/raw/)."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{self.source_name}_{identifier}_{timestamp}.json"
        filepath = RAW_DATA_DIR / filename
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            logger.debug(f"Saved raw cache to {filepath.name}")
        except Exception as e:
            logger.warning(f"Failed to save raw cache {filename}: {e}")

    def extract(self) -> Any:
        raise NotImplementedError("Subclasses must implement extract()")

class BaseApiExtractor(BaseExtractor):
    """Base class for HTTP API Extractors (urllib based)."""
    
    def __init__(self, source_name: str, verify_ssl: bool = True):
        super().__init__(source_name)
        self.ctx = ssl.create_default_context()
        if not verify_ssl:
            self.ctx.check_hostname = False
            self.ctx.verify_mode = ssl.CERT_NONE

    def fetch_json(self, url: str) -> Any:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (OpenOurGov ETL Pipeline)'})
            with urllib.request.urlopen(req, context=self.ctx, timeout=REQUEST_TIMEOUT) as response:
                if response.status != 200:
                    raise ExtractError(f"HTTP Error {response.status} from {url}")
                
                content = response.read().decode('utf-8')
                data = json.loads(content)
                return data
                
        except urllib.error.URLError as e:
            raise ExtractError(f"Network error fetching {url}: {e.reason}") from e
        except json.JSONDecodeError as e:
            raise ExtractError(f"Invalid JSON received from {url}: {e.msg}") from e
        except Exception as e:
            raise ExtractError(f"Unexpected error fetching {url}: {str(e)}") from e
