from pipeline import PipelineOrchestrator, ETLJob
from core.logger import setup_logger

from extract.sejm_api import SejmApiExtractor
from extract.sejm_votings_api import SejmVotingsExtractor
from extract.rcl_api import RclXmlExtractor

from transform.politicians import MPsTransformer
from transform.bills import BillsTransformer
from transform.votings import VotingsTransformer
from transform.politicians import SenatorsTransformer
from extract.rcl_api import RclTransformer

from extract.senate_scraper import SenateScraper
from load.file_loader import FileLoader
from load.bills_loader import BillsLoader
from load.votings_loader import VotingsLoader
from core.config import PUBLIC_DATA_DIR

import sys

logger = setup_logger("SYNC")

class BasicLoader:
    def __init__(self, filename: str):
        self.filename = filename 
        
    def load(self, data):
        path = PUBLIC_DATA_DIR / self.filename
        FileLoader.save_json(data, path)

def run_sync():
    orchestrator = PipelineOrchestrator()
    
    # 1. MPs Job
    orchestrator.add_job(ETLJob(
        name="Sejm_MPs",
        extractor=SejmApiExtractor("MP"),
        transformer=MPsTransformer(),
        loader=BasicLoader("mps.json")
    ))
    
    # 1B. Senators Job
    orchestrator.add_job(ETLJob(
        name="Senat_Senators",
        extractor=SenateScraper(),  # Scrapes using Playwright
        transformer=SenatorsTransformer(),
        loader=BasicLoader("senators.json")
    ))
    
    # 2. Bills Job
    orchestrator.add_job(ETLJob(
        name="Sejm_Bills",
        extractor=SejmApiExtractor("processes"),
        transformer=BillsTransformer(),
        loader=BillsLoader()
    ))
    
    # 3. Sejm Votings Job
    orchestrator.add_job(ETLJob(
        name="Sejm_Votings",
        extractor=SejmVotingsExtractor(),
        transformer=VotingsTransformer(),
        loader=VotingsLoader(target_person_type="mp")
    ))
    
    # 4. RCL Projects Job (DISABLED due to WAF blocking automated IPs)
    # orchestrator.add_job(ETLJob(
    #     name="RCL_Projects",
    #     extractor=RclXmlExtractor(),
    #     transformer=RclTransformer(),
    #     loader=BasicLoader("rcl/projects.json")
    # ))

    
    # RUN it all!
    try:
        orchestrator.run_all()
        logger.info("Successfully executed Fazy 1 + 2 pipelines.")
    except KeyboardInterrupt:
        logger.warning("Pipeline interrupted by user.")
        sys.exit(1)

if __name__ == "__main__":
    run_sync()
