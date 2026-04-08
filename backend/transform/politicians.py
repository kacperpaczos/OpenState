import logging
from typing import Any
from transform.base import BaseTransformer
from core.exceptions import TransformError

logger = logging.getLogger("ETL_TRANSFORM_POLITICIANS")

class MPsTransformer(BaseTransformer):
    """Transforms raw Sejm API MP data into unified ParliamentMember structures."""
    
    def transform(self, raw_data: Any) -> Any:
        self._validate_list(raw_data)
        
        try:
            # Keep ALL MPs (active and inactive) — inactive MPs have full voting histories
            formatted_mps = []
            for mp in raw_data:
                is_active = bool(mp.get('active', False))
                formatted_mps.append({
                    "id": str(mp.get('id')),
                    "name": mp.get('firstLastName'),
                    "firstLastName": mp.get('firstLastName', ""),
                    "club": mp.get('club') or "Niezrzeszony",
                    "district": mp.get('districtName') or f"Okręg {mp.get('districtNum', 0)}",
                    "email": mp.get('email', ""),
                    "active": is_active,
                    "photoUrl": f"https://api.sejm.gov.pl/sejm/term10/MP/{mp.get('id')}/photo-mini",
                    "chamber": "Sejm",
                })
            
            # Sort: active first, then alphabetically
            formatted_mps.sort(key=lambda x: (not x['active'], x['name']))
            
            active_count = sum(1 for m in formatted_mps if m['active'])
            logger.debug(f"Transformed {len(raw_data)} raw MPs ({active_count} active, {len(formatted_mps) - active_count} inactive).")
            return formatted_mps
            
        except Exception as e:
            raise TransformError(f"Error transforming MPs data: {e}") from e

class SenatorsTransformer(BaseTransformer):
    """Transforms raw scraped Senat HTML/JSON into unified ParliamentMember structures."""
    
    def transform(self, raw_data: Any) -> Any:
        self._validate_list(raw_data)
        
        try:
            formatted_senators = []
            for s in raw_data:
                # Based on Faza 3 Senate scraper outputs we will normalize here
                # The scraper will just yield dicts, but we ensure field consistency
                formatted_senators.append({
                    "id": s.get('id', str(len(formatted_senators) + 1)),
                    "name": s.get('name'),
                    "party": s.get('party') or "Niezrzeszony",
                    "district": s.get('district') or "Okręg Senat",
                    "photoUrl": s.get('photoUrl'),
                    "detailsUrl": s.get('detailsUrl'),
                    "type": "Senator",
                    "club": s.get('party') or "Niezrzeszony",
                })
            
            formatted_senators.sort(key=lambda x: x['name'])
            return formatted_senators
            
        except Exception as e:
            raise TransformError(f"Error transforming Senators data: {e}") from e
