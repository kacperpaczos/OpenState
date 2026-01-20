"""
Version Manager for Legislative Documents
Tracks different versions of bills throughout the legislative lifecycle.
"""
import json
import os
from pathlib import Path
from typing import Dict, List, Optional
from datetime import datetime

class BillVersionManager:
    """Manages different versions of legislative bills."""
    
    # Version types
    VERSION_TYPES = {
        "draft_rcl": "Projekt z RCL",
        "sejm_v1": "Sejm - Wersja Pierwsza",
        "sejm_v2_komisja": "Sejm - Po Komisji",
        "sejm_final": "Sejm - Wersja Finalna",
        "senat_v1": "Senat - Wersja Pierwsza",
        "senat_final": "Senat - Wersja Finalna",
        "final_act": "Ustawa Uchwalona (ISAP)"
    }
    
    def __init__(self, base_dir: str):
        self.base_dir = Path(base_dir)
        self.versions_dir = self.base_dir / "frontend/public/data/bills_text"
        self.metadata_file = self.versions_dir / "metadata.json"
        self.versions_dir.mkdir(parents=True, exist_ok=True)
        
        # Load or initialize metadata
        self.metadata = self._load_metadata()
    
    def _load_metadata(self) -> Dict:
        """Load version metadata from JSON."""
        if self.metadata_file.exists():
            with open(self.metadata_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}
    
    def _save_metadata(self):
        """Save version metadata to JSON."""
        with open(self.metadata_file, 'w', encoding='utf-8') as f:
            json.dump(self.metadata, f, indent=2, ensure_ascii=False)
    
    def save_version(self, bill_id: str, version_type: str, text: str, source_url: Optional[str] = None):
        """
        Save a new version of a bill.
        
        Args:
            bill_id: Legislative bill ID
            version_type: Type of version (e.g., "draft_rcl", "sejm_v1")
            text: The bill text content
            source_url: Optional URL where the version was obtained
        """
        # Create bill directory
        bill_dir = self.versions_dir / bill_id
        bill_dir.mkdir(parents=True, exist_ok=True)
        
        # Save text file
        text_file = bill_dir / f"{version_type}.txt"
        with open(text_file, 'w', encoding='utf-8') as f:
            f.write(text)
        
        # Update metadata
        if bill_id not in self.metadata:
            self.metadata[bill_id] = {
                "bill_id": bill_id,
                "versions": {},
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
        
        self.metadata[bill_id]["versions"][version_type] = {
            "timestamp": datetime.now().isoformat(),
            "char_count": len(text),
            "file_path": str(text_file.relative_to(self.base_dir)),
            "source_url": source_url,
            "version_name": self.VERSION_TYPES.get(version_type, version_type)
        }
        
        self.metadata[bill_id]["updated_at"] = datetime.now().isoformat()
        self._save_metadata()
        
        print(f"✅ Saved version '{version_type}' for bill {bill_id}")
    
    def get_version(self, bill_id: str, version_type: str) -> str:
        """Retrieve a specific version of a bill."""
        text_file = self.versions_dir / bill_id / f"{version_type}.txt"
        if text_file.exists():
            with open(text_file, 'r', encoding='utf-8') as f:
                return f.read()
        return ""
    
    def get_versions_list(self, bill_id: str) -> List[str]:
        """Get list of available versions for a bill."""
        if bill_id in self.metadata:
            return list(self.metadata[bill_id]["versions"].keys())
        return []
    
    def get_bill_metadata(self, bill_id: str) -> Optional[Dict]:
        """Get metadata for a specific bill."""
        return self.metadata.get(bill_id)
    
    def has_version(self, bill_id: str, version_type: str) -> bool:
        """Check if a specific version exists."""
        return (bill_id in self.metadata and 
                version_type in self.metadata[bill_id]["versions"])
    
    def get_version_timeline(self, bill_id: str) -> List[Dict]:
        """Get chronological timeline of versions for a bill."""
        if bill_id not in self.metadata:
            return []
        
        versions = self.metadata[bill_id]["versions"]
        timeline = [
            {
                "version_type": v_type,
                "version_name": v_data["version_name"],
                "timestamp": v_data["timestamp"],
                "char_count": v_data["char_count"]
            }
            for v_type, v_data in versions.items()
        ]
        
        # Sort by timestamp
        timeline.sort(key=lambda x: x["timestamp"])
        return timeline


if __name__ == "__main__":
    # Test version management
    manager = BillVersionManager(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
    
    # Example usage
    test_text = "Art. 1. Ustawa określa zasady..."
    manager.save_version("30", "draft_rcl", test_text, "https://legislacja.rcl.gov.pl/projekt/123")
    
    print(f"\nVersions for bill 30: {manager.get_versions_list('30')}")
    print(f"Timeline: {manager.get_version_timeline('30')}")
