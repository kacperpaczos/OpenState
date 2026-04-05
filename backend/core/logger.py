import logging
import json
from datetime import datetime
from pathlib import Path
from core.config import LOGS_DIR

def setup_logger(name: str) -> logging.Logger:
    """Configures and returns a logger with both file and console handlers."""
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)

    # Prevent adding handlers multiple times in long-running processes
    if not logger.handlers:
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )

        # File Handler
        log_file = LOGS_DIR / f"{datetime.now().strftime('%Y-%m-%d')}_etl.log"
        file_handler = logging.FileHandler(log_file, encoding='utf-8')
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

        # Console Handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)

    return logger

class SyncReporter:
    """Handles generating the sync_report.json file for the frontend to consume."""
    
    def __init__(self):
        self.report_path = LOGS_DIR / "sync_report.json"
        self.jobs = {}

    def log_job_start(self, job_name: str):
        self.jobs[job_name] = {
            "status": "RUNNING",
            "start_time": datetime.now().isoformat(),
            "end_time": None,
            "error_message": None
        }
        self._save()

    def log_job_success(self, job_name: str, records_processed: int = 0):
        if job_name in self.jobs:
            self.jobs[job_name]["status"] = "SUCCESS"
            self.jobs[job_name]["end_time"] = datetime.now().isoformat()
            self.jobs[job_name]["records_processed"] = records_processed
            self._save()

    def log_job_failure(self, job_name: str, error_msg: str):
        if job_name in self.jobs:
            self.jobs[job_name]["status"] = "FAILED"
            self.jobs[job_name]["end_time"] = datetime.now().isoformat()
            self.jobs[job_name]["error_message"] = str(error_msg)
            self._save()

    def _save(self):
        report = {
            "last_updated": datetime.now().isoformat(),
            "jobs": self.jobs
        }
        with open(self.report_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
