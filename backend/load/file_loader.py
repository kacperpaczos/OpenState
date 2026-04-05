import json
import logging
import tempfile
import shutil
from pathlib import Path
from typing import Union
from core.exceptions import LoadError

logger = logging.getLogger("ETL_LOADER")

class FileLoader:
    """Safe atomic file loader for pushing processed JSON to the frontend."""

    @staticmethod
    def save_json(data: Union[list, dict], destination_path: Path):
        """
        Atomically saves data. First writes to a temporary file,
        then replaces the target file. Prevents corrupt files if script crashes mid-write.
        Also fails early if data is empty (preventing accidental database drops).
        """
        if not data:
            raise LoadError(f"Refusing to save empty data to {destination_path}")

        destination_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Write to a temporary file first
        fd, temp_path = tempfile.mkstemp(suffix=".json", dir=destination_path.parent)
        try:
            with open(fd, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            # Atomic replace
            shutil.move(temp_path, destination_path)
            logger.info(f"💾 Successfully saved {len(data) if isinstance(data, list) else 1} records to {destination_path.name}")
        except Exception as e:
            # Clean up temp file on failure
            if Path(temp_path).exists():
                Path(temp_path).unlink()
            raise LoadError(f"Failed to save JSON to {destination_path}: {str(e)}") from e
