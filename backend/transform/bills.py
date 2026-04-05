import logging
from typing import Any
from transform.base import BaseTransformer
from core.exceptions import TransformError

logger = logging.getLogger("ETL_TRANSFORM_BILLS")

class BillsTransformer(BaseTransformer):
    """Transforms raw Sejm processes into unified Bills and extracts details."""
    
    def transform(self, raw_data: Any) -> tuple[list[dict], dict[str, dict]]:
        """
        Returns a tuple:
        1. List of main bills (for bills.json)
        2. Dictionary mapping bill ID -> detailed bill info (for bills/{id}.json)
        """
        self._validate_list(raw_data)
        
        try:
            formatted_bills = []
            bill_details = {}
            
            for item in raw_data:
                # We only want "projekt ustawy"
                if item.get('documentType') != 'projekt ustawy':
                    continue
                    
                title = item.get('title') or item.get('description') or "Bez tytułu"
                ueid = str(item.get('UEID') or item.get('number') or '')
                if not ueid:
                    continue
                
                print_num = str(item.get('number', 'N/A'))
                if item.get('prints') and len(item['prints']) > 0:
                    print_num = str(item['prints'][0].get('number', print_num))
                    
                date = item.get('processStartDate') or item.get('documentDate') or item.get('changeDate') or ''
                
                author_type = "Inny"
                title_lower = title.lower()
                if "rządowy" in title_lower: author_type = "Rządowy"
                elif "poselski" in title_lower: author_type = "Poselski"
                elif "obywatelski" in title_lower: author_type = "Obywatelski"
                elif "senacki" in title_lower: author_type = "Senacki"
                
                links = item.get('links', [])
                
                # Base Bill Object
                bill = {
                    "id": ueid,
                    "printNo": print_num,
                    "title": title,
                    "description": item.get('description', ''),
                    "date": date,
                    "status": "W toku",
                    "documentType": item.get('documentType', 'Inny'),
                    "authorType": author_type,
                    "isEU": item.get('isEU', False),
                    "term": item.get('term', 10),
                    "isapLink": next((l['href'] for l in links if l.get('rel') == 'isap'), None),
                    "eliLink": next((l['href'] for l in links if l.get('rel') == 'eli'), None),
                    "rclLink": next((l['href'] for l in links if 'legislacja.rcl.gov.pl' in l.get('href', '')), None)
                }
                
                formatted_bills.append(bill)
                
                # Setup Details (Stages)
                stages = []
                for stage in item.get('stages', []):
                    stages.append({
                        "stageName": stage.get('stageName', 'Nieznany etap'),
                        "date": stage.get('date', ''),
                        "decision": stage.get('decision', ''),
                    })
                
                detail = dict(bill)
                detail["stages"] = stages
                detail["urgency"] = item.get('urgency', 'normalny')
                # Kanban stage mapping would happen here (simplified for now to match old script)
                detail["kanbanStage"] = "Inicjatywa" 
                
                bill_details[ueid] = detail
                
            formatted_bills.sort(key=lambda x: x['date'], reverse=True)
            logger.debug(f"Transformed {len(raw_data)} raw processes into {len(formatted_bills)} bills.")
            
            return formatted_bills, bill_details
            
        except Exception as e:
            raise TransformError(f"Error transforming Bills data: {e}") from e
