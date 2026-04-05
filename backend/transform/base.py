import logging
from typing import Any, Protocol
from core.exceptions import TransformError

logger = logging.getLogger("ETL_TRANSFORM")

class BaseTransformer:
    """Abstract base class for all Transformers."""
    
    def transform(self, raw_data: Any) -> Any:
        raise NotImplementedError("Subclasses must implement transform()")
        
    def _validate_list(self, raw_data: Any, expected_min_length: int = 1) -> None:
        if not isinstance(raw_data, list):
            raise TransformError(f"Expected a list of records, got {type(raw_data).__name__}")
        if len(raw_data) < expected_min_length:
            raise TransformError(f"Raw data list contains fewer records ({len(raw_data)}) than minimum required ({expected_min_length})")
