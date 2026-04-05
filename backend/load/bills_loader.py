from typing import Any
from pathlib import Path
import logging
from load.file_loader import FileLoader
from core.config import PUBLIC_DATA_DIR
from core.exceptions import LoadError

logger = logging.getLogger("ETL_LOAD_BILLS")

class BillsLoader:
    """Specialized loader for Bills that saves the main list AND individual detail files."""
    
    def load(self, transformed_data: tuple[list[dict], dict[str, dict]]) -> None:
        try:
            main_list, details_dict = transformed_data
            
            # 1. Save main bills list
            main_path = PUBLIC_DATA_DIR / "bills.json"
            FileLoader.save_json(main_list, main_path)
            
            # 2. Save individual bill details
            details_dir = PUBLIC_DATA_DIR / "bills"
            details_dir.mkdir(parents=True, exist_ok=True)
            
            for bill_id, detail_data in details_dict.items():
                detail_path = details_dir / f"{bill_id}.json"
                FileLoader.save_json(detail_data, detail_path)
                
            logger.info(f"Loaded {len(main_list)} main bills and {len(details_dict)} detail files successfully.")
            
        except Exception as e:
            raise LoadError(f"BillsLoader failed: {e}") from e
