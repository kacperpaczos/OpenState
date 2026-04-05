class ETLError(Exception):
    """Base exception for all ETL pipeline errors."""
    pass

class ExtractError(ETLError):
    """Raised when data extraction fails (e.g., API is down, Captcha blocks scraper)."""
    pass

class TransformError(ETLError):
    """Raised when data transformation fails (e.g., unexpected JSON schema, missing fields)."""
    pass

class LoadError(ETLError):
    """Raised when loading data to file system fails (e.g., permissions, disk full)."""
    pass
