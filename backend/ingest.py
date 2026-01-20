import argparse
import os
import sys

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ingestion.sejm import SejmIngestor
from ingestion.rcl import RCLIngestor
from ingestion.isap import ISAPIngestor

def main():
    parser = argparse.ArgumentParser(description="OpenOurGov Data Ingestion Engine")
    parser.add_argument('--full', action='store_true', help='Run full ingestion pipeline')
    parser.add_argument('--source', type=str, choices=['sejm', 'rcl', 'isap'], help='Run specific source')
    
    args = parser.parse_args()
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.abspath(os.path.join(current_dir, "../"))
    
    print(f"🏛️  OpenOurGov Data Engine | Root: {base_dir}")
    
    run_all = args.full or not args.source
    
    # SEJM
    if run_all or args.source == 'sejm':
        print("\n=== [Source: Sejm API] ===")
        ingestor = SejmIngestor(base_dir)
        ingestor.run()
        
    # RCL
    if run_all or args.source == 'rcl':
        print("\n=== [Source: RCL] ===")
        ingestor = RCLIngestor(base_dir)
        ingestor.run()
        
    # ISAP
    if run_all or args.source == 'isap':
        print("\n=== [Source: ISAP] ===")
        ingestor = ISAPIngestor(base_dir)
        # For now, default to recent 5 acts for speed
        ingestor.run(limit=5)

if __name__ == "__main__":
    main()
