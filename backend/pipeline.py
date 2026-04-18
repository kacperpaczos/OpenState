from typing import Protocol, Any
import logging
from core.logger import setup_logger, SyncReporter
from core.exceptions import ETLError

logger = setup_logger("PIPELINE")
reporter = SyncReporter()

class Extractor(Protocol):
    def extract(self) -> Any: ...

class Transformer(Protocol):
    def transform(self, raw_data: Any) -> Any: ...

class Loader(Protocol):
    def load(self, transformed_data: Any) -> None: ...

class ETLJob:
    """A generic definition of a single ETL task (e.g., 'MPs', 'Senators', 'Bills')"""
    def __init__(self, name: str, extractor: Extractor, transformer: Transformer, loader: Loader):
        self.name = name
        self.extractor = extractor
        self.transformer = transformer
        self.loader = loader

    def run(self):
        logger.info(f"🚀 Starting Job: {self.name}")
        reporter.log_job_start(self.name)
        try:
            # 1. Extract
            logger.info("  [1/3] Extracting data...")
            raw_data = self.extractor.extract()

            # 2. Transform
            logger.info("  [2/3] Transforming data...")
            clean_data = self.transformer.transform(raw_data)

            # 2.5 Validate
            warnings = self.transformer.validate(clean_data)
            for warn in warnings:
                logger.warning(f"  ⚠️  [Quality Check] {warn}")

            # 3. Load
            logger.info("  [3/3] Loading data...")
            self.loader.load(clean_data)

            # Success
            if isinstance(clean_data, list):
                record_count = len(clean_data)
            elif isinstance(clean_data, tuple) and len(clean_data) > 0 and isinstance(clean_data[0], list):
                record_count = len(clean_data[0]) # BillsTransformer case
            else:
                record_count = 1
            
            logger.info(f"✅ Job '{self.name}' completed. Processed {record_count} records.")
            reporter.log_job_success(self.name, record_count)

        except ETLError as e:
            logger.error(f"❌ Job '{self.name}' failed locally: {str(e)}")
            reporter.log_job_failure(self.name, str(e))
        except Exception as e:
            logger.error(f"❌ Job '{self.name}' crashed with unhandled error: {str(e)}", exc_info=True)
            reporter.log_job_failure(self.name, f"Unhandled exception: {str(e)}")


class PipelineOrchestrator:
    """Manages tracking and running multiple ETL Jobs in sequence."""
    
    def __init__(self):
        self.jobs: list[ETLJob] = []

    def add_job(self, job: ETLJob):
        self.jobs.append(job)

    def run_all(self):
        logger.info("==== STARTING ETL PIPELINE ====")
        for job in self.jobs:
            job.run()
        logger.info("==== ETL PIPELINE FINISHED ====")

if __name__ == "__main__":
    # Example usage for testing structure
    pass
