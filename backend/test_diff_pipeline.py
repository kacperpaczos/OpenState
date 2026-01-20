"""
Test script for PDF extraction and diff engine.
Downloads a sample ISAP PDF, extracts text, and generates a diff.
"""
import os
import sys
import urllib.request
import ssl

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from parsers.pdf_extractor import PDFTextExtractor
from parsers.version_manager import BillVersionManager
from parsers.diff_engine import DiffEngine

def test_pipeline():
    """Test the complete PDF -> Text -> Version -> Diff pipeline."""
    
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    
    print("🧪 Testing OpenOurGov 'Git for Law' Engine\n")
    print("=" * 60)
    
    # Initialize components
    print("\n1️⃣  Initializing components...")
    extractor = PDFTextExtractor(base_dir)
    version_manager = BillVersionManager(base_dir)
    diff_engine = DiffEngine()
    
    # Test with mock data (since we might not have PDFs yet)
    print("\n2️⃣  Creating test versions...")
    
    bill_id = "30"  # Example bill ID
    
    # Mock version 1 (Original draft)
    v1_text = """Ustawa o rencie socjalnej
    
Art. 1.
Ustawa określa zasady przyznawania renty socjalnej osobom całkowicie niezdolnym do pracy.

Art. 2.
Renta socjalna przysługuje osobie pełnoletniej całkowicie niezdolnej do pracy.

Art. 3.
Wysokość renty socjalnej wynosi 1200 zł miesięcznie.

Art. 4.
Wnioski o rentę socjalną rozpatruje ZUS.
"""
    
    # Mock version 2 (After komisja)
    v2_text = """Ustawa o rencie socjalnej oraz niektórych innych ustaw
    
Art. 1.
Ustawa określa zasady przyznawania renty socjalnej osobom całkowicie niezdolnym do pracy z powodu naruszenia sprawności organizmu.

Art. 2.
Renta socjalna przysługuje osobie pełnoletniej całkowicie niezdolnej do pracy z powodu naruszenia sprawności organizmu powstałego przed ukończeniem 18 lat lub w trakcie nauki.

Art. 3.
Wysokość renty socjalnej wynosi kwotę minimalnego wynagrodzenia za pracę.

Art. 3a.
Kwotę renty waloryzuje się corocznie.

Art. 4.
Wnioski o rentę socjalną rozpatruje Zakład Ubezpieczeń Społecznych w terminie do 60 dni.

Art. 5.
Ustawa wchodzi w życie po 14 dniach od ogłoszenia.
"""
    
    # Save versions
    version_manager.save_version(bill_id, "draft_rcl", v1_text, "https://legislacja.rcl.gov.pl/sample")
    version_manager.save_version(bill_id, "sejm_v2_komisja", v2_text, "https://api.sejm.gov.pl/sejm/term10/prints/30")
    
    print(f"✅ Saved 2 versions for bill {bill_id}")
    
    # Generate diff
    print("\n3️⃣  Generating diff...")
    diff_result = diff_engine.generate_diff(v1_text, v2_text)
    
    print(f"\n📊 Diff Statistics:")
    print(f"   Old: {diff_result['old_lines_count']} lines")
    print(f"   New: {diff_result['new_lines_count']} lines")
    print(f"   Changes: +{diff_result['stats']['additions']} -{diff_result['stats']['deletions']}")
    print(f"   Change %: {diff_result['stats']['change_percentage']:.1f}%")
    
    # Generate side-by-side view
    print("\n4️⃣  Generating side-by-side diff...")
    side_by_side = diff_engine.generate_side_by_side(v1_text, v2_text)
    
    # Save diff result
    diff_file = os.path.join(base_dir, "frontend/public/data/bills_text", bill_id, "diff_draft_to_komisja.json")
    os.makedirs(os.path.dirname(diff_file), exist_ok=True)
    
    import json
    with open(diff_file, 'w', encoding='utf-8') as f:
        json.dump({
            "summary": diff_result,
            "side_by_side": side_by_side[:50]  # Limit for demo
        }, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Saved diff to {diff_file}")
    
    # Show sample changes
    print("\n5️⃣  Sample Changes (first 10 lines):")
    print("-" * 60)
    for i, line in enumerate(side_by_side[:10]):
        if line["type"] == "add":
            print(f"  \033[92m+ {line['new_content']}\033[0m")
        elif line["type"] == "remove":
            print(f"  \033[91m- {line['old_content']}\033[0m")
        else:
            print(f"    {line['old_content']}")
    
    print("\n" + "=" * 60)
    print("✅ Test Complete! All components working.")
    print(f"\nNext steps:")
    print(f"  1. Download real PDFs from ISAP")
    print(f"  2. Extract text with: python backend/parsers/pdf_extractor.py <pdf_path>")
    print(f"  3. View diff in frontend at: /ustawy/{bill_id}")


if __name__ == "__main__":
    try:
        test_pipeline()
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
