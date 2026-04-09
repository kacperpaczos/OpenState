from typing import Any
from extract.base import BaseApiExtractor
from core.config import SEJM_API_BASE

class SejmApiExtractor(BaseApiExtractor):
    """Handles extracting all data from the official Sejm API."""
    
    def __init__(self, endpoint: str):
        # Sejm API has known SSL certificate issues (missing intermediates in some envs)
        # We disable verification for stability as per original architecture.
        super().__init__(source_name="sejm_api", verify_ssl=False)
        self.endpoint = endpoint
        self.url = f"{SEJM_API_BASE}/{endpoint}"

    def extract(self) -> Any:
        data = self.fetch_json(self.url)
        self._save_raw_cache(data, identifier=self.endpoint.replace('/', '_'))
        return data

    def fetch_details(self, mp_id: int) -> Any:
        """Fetches detailed info for a specific MP (includes birthDate, profession, etc.)"""
        detail_url = f"{self.url}/{mp_id}"
        return self.fetch_json(detail_url)
