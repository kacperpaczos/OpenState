from typing import Any
from pathlib import Path
import logging
from load.file_loader import FileLoader
from core.config import PUBLIC_DATA_DIR
from core.exceptions import LoadError

logger = logging.getLogger("ETL_LOAD_VOTINGS")

class VotingsLoader:
    """Specialized loader for Votings that saves the main sittings AND individual member vote histories."""
    
    def __init__(self, target_person_type: str = "mp"):
        # "mp" logs to `votes_by_mp`, "senator" logs to `votes_by_senator`
        self.target_dir_name = f"votes_by_{target_person_type}"
    
    def load(self, transformed_data: tuple[list[dict], dict[str, list]]) -> None:
        try:
            main_sittings, votes_by_person = transformed_data
            
            # 1. Save main sittings list
            main_path = PUBLIC_DATA_DIR / "votings" / "sittings.json"
            FileLoader.save_json(main_sittings, main_path)
            
            # 2. Save individual member votes
            details_dir = PUBLIC_DATA_DIR / self.target_dir_name
            details_dir.mkdir(parents=True, exist_ok=True)
            
            for person_id, votes in votes_by_person.items():
                detail_path = details_dir / f"{person_id}.json"
                FileLoader.save_json(votes, detail_path)
                
            logger.info(f"Loaded {len(main_sittings)} sittings and generated vote histories for {len(votes_by_person)} members.")
            
        except Exception as e:
            raise LoadError(f"VotingsLoader failed: {e}") from e
