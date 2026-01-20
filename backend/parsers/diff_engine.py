"""
Diff Engine for Legislative Documents
Generates structured line-by-line diffs between bill versions.
"""
import difflib
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass
from enum import Enum

class ChangeType(Enum):
    """Types of changes in a diff."""
    ADD = "add"
    REMOVE = "remove"
    UNCHANGED = "unchanged"
    MODIFY = "modify"

@dataclass
class DiffLine:
    """Represents a single line in a diff."""
    type: ChangeType
    line_number: int  # Line number in document
    content: str
    old_line_number: Optional[int] = None  # For removed/modified
    new_line_number: Optional[int] = None  # For added/modified


class DiffEngine:
    """Generates diffs between text versions of bills."""
    
    def __init__(self):
        pass
    
    def generate_diff(self, old_text: str, new_text: str, context_lines: int = 3) -> Dict:
        """
        Generate a structured diff between two text versions.
        
        Args:
            old_text: Original text
            new_text: Modified text
            context_lines: Number of context lines to include
            
        Returns:
            Dict with diff metadata and changes
        """
        old_lines = old_text.split('\n')
        new_lines = new_text.split('\n')
        
        # Generate unified diff
        diff = list(difflib.unified_diff(
            old_lines,
            new_lines,
            lineterm='',
            n=context_lines
        ))
        
        # Parse diff into structured format
        changes = self._parse_unified_diff(diff, old_lines, new_lines)
        
        # Calculate statistics
        stats = self._calculate_stats(changes)
        
        return {
            "old_lines_count": len(old_lines),
            "new_lines_count": len(new_lines),
            "stats": stats,
            "changes": changes,
            "generated_at": self._get_timestamp()
        }
    
    def generate_side_by_side(self, old_text: str, new_text: str) -> List[Dict]:
        """
        Generate side-by-side diff view.
        
        Returns:
            List of dicts with old_line, new_line, and change type
        """
        old_lines = old_text.split('\n')
        new_lines = new_text.split('\n')
        
        # Use SequenceMatcher for more granular control
        matcher = difflib.SequenceMatcher(None, old_lines, new_lines)
        
        result = []
        
        for tag, i1, i2, j1, j2 in matcher.get_opcodes():
            if tag == 'equal':
                for i, (old_idx, new_idx) in enumerate(zip(range(i1, i2), range(j1, j2))):
                    result.append({
                        "type": "unchanged",
                        "old_line_number": old_idx + 1,
                        "new_line_number": new_idx + 1,
                        "old_content": old_lines[old_idx],
                        "new_content": new_lines[new_idx]
                    })
            
            elif tag == 'delete':
                for old_idx in range(i1, i2):
                    result.append({
                        "type": "remove",
                        "old_line_number": old_idx + 1,
                        "new_line_number": None,
                        "old_content": old_lines[old_idx],
                        "new_content": None
                    })
            
            elif tag == 'insert':
                for new_idx in range(j1, j2):
                    result.append({
                        "type": "add",
                        "old_line_number": None,
                        "new_line_number": new_idx + 1,
                        "old_content": None,
                        "new_content": new_lines[new_idx]
                    })
            
            elif tag == 'replace':
                # Mark as modified
                for old_idx in range(i1, i2):
                    result.append({
                        "type": "remove",
                        "old_line_number": old_idx + 1,
                        "new_line_number": None,
                        "old_content": old_lines[old_idx],
                        "new_content": None
                    })
                for new_idx in range(j1, j2):
                    result.append({
                        "type": "add",
                        "old_line_number": None,
                        "new_line_number": new_idx + 1,
                        "old_content": None,
                        "new_content": new_lines[new_idx]
                    })
        
        return result
    
    def _parse_unified_diff(self, diff: List[str], old_lines: List[str], new_lines: List[str]) -> List[Dict]:
        """Parse unified diff format into structured changes."""
        changes = []
        
        for line in diff:
            if line.startswith('---') or line.startswith('+++') or line.startswith('@@'):
                continue
            
            if line.startswith('-'):
                changes.append({
                    "type": "remove",
                    "content": line[1:]
                })
            elif line.startswith('+'):
                changes.append({
                    "type": "add",
                    "content": line[1:]
                })
            elif line.startswith(' '):
                changes.append({
                    "type": "unchanged",
                    "content": line[1:]
                })
        
        return changes
    
    def _calculate_stats(self, changes: List[Dict]) -> Dict:
        """Calculate diff statistics."""
        stats = {
            "additions": 0,
            "deletions": 0,
            "unchanged": 0
        }
        
        for change in changes:
            if change["type"] == "add":
                stats["additions"] += 1
            elif change["type"] == "remove":
                stats["deletions"] += 1
            elif change["type"] == "unchanged":
                stats["unchanged"] += 1
        
        total = sum(stats.values())
        stats["total_changes"] = stats["additions"] + stats["deletions"]
        stats["change_percentage"] = (stats["total_changes"] / total * 100) if total > 0 else 0
        
        return stats
    
    def _get_timestamp(self) -> str:
        """Get current timestamp in ISO format."""
        from datetime import datetime
        return datetime.now().isoformat()
    
    def highlight_changes(self, old_text: str, new_text: str) -> Tuple[str, str]:
        """
        Generate HTML-highlighted versions of old and new text.
        
        Returns:
            Tuple of (highlighted_old, highlighted_new)
        """
        # Use HtmlDiff for HTML output
        differ = difflib.HtmlDiff()
        html = differ.make_file(
            old_text.split('\n'),
            new_text.split('\n'),
            fromdesc='Wersja Oryginalna',
            todesc='Wersja Zmieniona'
        )
        return html


if __name__ == "__main__":
    # Test diff engine
    engine = DiffEngine()
    
    old_text = """Art. 1. Ustawa określa zasady ochrony zwierząt.
Art. 2. Zabrania się znęcania nad zwierzętami.
Art. 3. Karze podlega naruszenie przepisów."""
    
    new_text = """Art. 1. Ustawa określa zasady ochrony zwierząt domowych i dzikich.
Art. 2. Kategorycznie zabrania się znęcania nad zwierzętami.
Art. 3. Karze podlega naruszenie przepisów ustawy.
Art. 4. Ustawa wchodzi w życie po 30 dniach."""
    
    diff = engine.generate_diff(old_text, new_text)
    print(f"\n📊 Diff Stats: {diff['stats']}")
    print(f"\n📝 Changes ({len(diff['changes'])} lines):")
    
    for change in diff['changes'][:10]:  # Show first 10
        symbol = {
            "add": "+ ",
            "remove": "- ",
            "unchanged": "  "
        }.get(change["type"], "? ")
        print(f"{symbol}{change['content'][:80]}")
