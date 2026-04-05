import os
from pathlib import Path

# Project Roots
BACKEND_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BACKEND_DIR.parent
FRONTEND_DIR = ROOT_DIR / "frontend"

# Cache & Logs Paths
CACHE_DIR = BACKEND_DIR / ".cache"
RAW_DATA_DIR = CACHE_DIR / "raw"
LOGS_DIR = CACHE_DIR / "logs"

# Ensure directories exist
RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
LOGS_DIR.mkdir(parents=True, exist_ok=True)

# Frontend Public Data Path (Final Load Destination)
PUBLIC_DATA_DIR = FRONTEND_DIR / "public" / "data"

# Pipeline Config
REQUEST_TIMEOUT = 15 # Seconds
MAX_RETRIES = 3

# Specific URLs
SEJM_API_BASE = "https://api.sejm.gov.pl/sejm/term10"
RCL_API_BASE = "https://legislacja.rcl.gov.pl"
SENAT_BASE_URL = "https://www.senat.gov.pl"
