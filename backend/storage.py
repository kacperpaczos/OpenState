import json
import os

# Base directory for data storage
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../frontend/public/data")

class Storage:
    @staticmethod
    def save_json(filename, data):
        """
        Save data to a JSON file in the public/data directory.
        Safe for basic usage, handles path joining and encoding.
        """
        filepath = os.path.join(DATA_DIR, filename)
        
        # Ensure directory exists if filename contains subdirs
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        
        print(f"[Storage] Saved {len(data) if isinstance(data, list) else 'data'} to {filename}")

    @staticmethod
    def load_json(filename):
        """Load data from a JSON file."""
        filepath = os.path.join(DATA_DIR, filename)
        if not os.path.exists(filepath):
            return None
            
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
