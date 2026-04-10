import os
import json
from pathlib import Path

def rebuild_index():
    # Paths relative to workspace root (assuming running from /Users/szymonpaczos/OpenState)
    base_dir = Path("frontend/public/data/votings")
    output_file = base_dir / "sittings.json"
    
    if not base_dir.exists():
        print(f"Directory {base_dir} does not exist.")
        return

    sittings = []
    
    # Iterate through all subdirectories
    for item in base_dir.iterdir():
        if item.is_dir() and item.name.isdigit():
            sitting_num = int(item.name)
            index_file = item / "index.json"
            
            if index_file.exists():
                try:
                    with open(index_file, "r", encoding="utf-8") as f:
                        votings = json.load(f)
                        if votings and len(votings) > 0:
                            # Use the date from the first voting in the sitting
                            date = votings[0].get("date", "")
                            sittings.append({
                                "sitting": sitting_num,
                                "date": date
                            })
                        else:
                            # No votings in index, just add entry without date or with placeholder
                            sittings.append({
                                "sitting": sitting_num,
                                "date": ""
                            })
                except Exception as e:
                    print(f"Error reading {index_file}: {e}")
    
    # Sort sittings by number descending
    sittings.sort(key=lambda x: x["sitting"], reverse=True)
    
    # Save the new index
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(sittings, f, indent=2, ensure_ascii=False)
    
    print(f"Success! Rebuilt index with {len(sittings)} sittings in {output_file}")

if __name__ == "__main__":
    rebuild_index()
