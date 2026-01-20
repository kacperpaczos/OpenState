"""
PDF Text Extractor for Legislative Documents
Converts PDF files to clean text for version tracking and diffing.
"""
import os
import sys
from pathlib import Path
try:
    import pdfplumber
except ImportError:
    print("⚠️  pdfplumber not installed. Installing...")
    os.system(f"{sys.executable} -m pip install pdfplumber")
    import pdfplumber

class PDFTextExtractor:
    """Extracts text from legislative PDF documents."""
    
    def __init__(self, base_dir: str):
        self.base_dir = Path(base_dir)
        self.cache_dir = self.base_dir / "frontend/public/data/bills_text"
        self.cache_dir.mkdir(parents=True, exist_ok=True)
    
    def extract_text(self, pdf_path: str) -> str:
        """
        Extract text from a PDF file.
        
        Args:
            pdf_path: Absolute path to the PDF file
            
        Returns:
            Extracted text as string
        """
        try:
            with pdfplumber.open(pdf_path) as pdf:
                text_parts = []
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)
                
                full_text = "\n\n".join(text_parts)
                return self._clean_text(full_text)
        except Exception as e:
            print(f"❌ Error extracting PDF {pdf_path}: {e}")
            return ""
    
    def _clean_text(self, text: str) -> str:
        """Clean extracted text from common PDF artifacts."""
        # Remove excessive newlines
        text = "\n".join(line for line in text.split("\n") if line.strip())
        
        # Normalize whitespace
        text = " ".join(text.split())
        
        # Re-add paragraph breaks (heuristic: uppercase start)
        lines = []
        current_paragraph = []
        
        for sentence in text.split(". "):
            current_paragraph.append(sentence)
            # Simple heuristic for paragraph break
            if len(current_paragraph) > 3 and sentence.strip().endswith((".", ":", ";")):
                lines.append(". ".join(current_paragraph) + ".")
                current_paragraph = []
        
        if current_paragraph:
            lines.append(". ".join(current_paragraph))
        
        return "\n\n".join(lines)
    
    def extract_and_cache(self, pdf_path: str, bill_id: str, version: str) -> Path:
        """
        Extract text from PDF and cache it.
        
        Args:
            pdf_path: Path to PDF file
            bill_id: Legislative bill ID (e.g., "30")
            version: Version identifier (e.g., "draft_rcl", "sejm_v1", "final_act")
            
        Returns:
            Path to cached text file
        """
        text = self.extract_text(pdf_path)
        
        # Create bill directory
        bill_dir = self.cache_dir / bill_id
        bill_dir.mkdir(parents=True, exist_ok=True)
        
        # Save text
        text_file = bill_dir / f"{version}.txt"
        with open(text_file, 'w', encoding='utf-8') as f:
            f.write(text)
        
        print(f"✅ Extracted {version} for bill {bill_id} -> {text_file}")
        return text_file
    
    def get_cached_text(self, bill_id: str, version: str) -> str:
        """Retrieve cached text for a bill version."""
        text_file = self.cache_dir / bill_id / f"{version}.txt"
        if text_file.exists():
            with open(text_file, 'r', encoding='utf-8') as f:
                return f.read()
        return ""
    
    def has_version(self, bill_id: str, version: str) -> bool:
        """Check if a version has been extracted."""
        text_file = self.cache_dir / bill_id / f"{version}.txt"
        return text_file.exists()


if __name__ == "__main__":
    # Test extraction
    import sys
    if len(sys.argv) < 2:
        print("Usage: python pdf_extractor.py <path_to_pdf>")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    extractor = PDFTextExtractor(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
    
    text = extractor.extract_text(pdf_path)
    print(f"\n📄 Extracted {len(text)} characters")
    print(f"\n--- First 500 chars ---\n{text[:500]}")
