import logging
from typing import Any
from transform.base import BaseTransformer
from core.exceptions import TransformError

logger = logging.getLogger("ETL_TRANSFORM_BILLS")

class BillsTransformer(BaseTransformer):
    """Transforms raw Sejm processes into unified Bills and extracts details."""

    def _determine_kanban_stage(self, item: dict) -> str:
        """Determines the current Kanban stage from raw process stages list."""
        stages = item.get('stages', [])
        if not stages:
            return "Inicjatywa"

        stage_names = [s.get('stageName', '').lower() for s in stages]
        last = stage_names[-1] if stage_names else ""

        # Final states — check last stage first
        if "wejście w życie" in last:
            return "Wejście w życie"
        if "publikacja" in last or "ogłoszono" in last or "podpis" in last:
            return "Publikacja"

        # Walk backwards through all stages
        if any("prezydent" in s for s in stage_names):
            return "Prezydent"

        if any("senat" in s for s in stage_names):
            for s in reversed(stage_names):
                if "senat" in s:
                    if "uchwała" in s or "stanowisko" in s:
                        return "Senat - Głosowanie"
                    if "komisj" in s:
                        return "Senat - Komisje"
            return "Senat - Prace"

        for s in reversed(stage_names):
            if "głosowanie" in s or "iii czytanie" in s:
                return "Sejm - Głosowanie"
            if "ii czytanie" in s:
                return "Sejm - II Czytanie"
            if "sprawozdanie komisji" in s or "prace w komisjach" in s:
                return "Sejm - Komisje"
            if "i czytanie" in s:
                return "Sejm - I Czytanie"
            if "skierowano do" in s and "komisj" in s:
                return "Sejm - Komisje"

        return "Inicjatywa"

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
                kanban_stage = self._determine_kanban_stage(item)

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
                    "kanbanStage": kanban_stage,
                    "isapLink": next((l['href'] for l in links if l.get('rel') == 'isap'), None),
                    "eliLink": next((l['href'] for l in links if l.get('rel') == 'eli'), None),
                    "rclLink": next((l['href'] for l in links if 'legislacja.rcl.gov.pl' in l.get('href', '')), None),
                }

                formatted_bills.append(bill)

                # Setup Details (Stages for timeline)
                stages = [
                    {
                        "stageName": s.get('stageName', 'Nieznany etap'),
                        "date": s.get('date', ''),
                        "decision": s.get('decision', ''),
                    }
                    for s in item.get('stages', [])
                ]

                detail = dict(bill)
                detail["stages"] = stages
                detail["urgency"] = item.get('urgency', 'normalny')

                bill_details[ueid] = detail

            formatted_bills.sort(key=lambda x: x['date'], reverse=True)
            logger.debug(f"Transformed {len(raw_data)} raw processes into {len(formatted_bills)} bills.")

            return formatted_bills, bill_details

        except Exception as e:
            raise TransformError(f"Error transforming Bills data: {e}") from e
