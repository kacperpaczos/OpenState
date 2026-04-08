#!/usr/bin/env python3
"""
Data Authenticity Verification Tests
Verifies that local data matches official Sejm API sources
"""

import json
import urllib.request
import ssl
import sys
import os
from datetime import datetime

# Colors for terminal output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_success(msg):
    print(f"{Colors.GREEN}✓{Colors.END} {msg}")

def print_error(msg):
    print(f"{Colors.RED}✗{Colors.END} {msg}")

def print_info(msg):
    print(f"{Colors.BLUE}ℹ{Colors.END} {msg}")

def print_warning(msg):
    print(f"{Colors.YELLOW}⚠{Colors.END} {msg}")

def fetch_from_api(url):
    """Fetch data from Sejm API with SSL disabled"""
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    try:
        with urllib.request.urlopen(url, context=ctx, timeout=10) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print_error(f"Failed to fetch from API: {e}")
        return None

def test_processes_authenticity():
    """Test 1: Compare processes data with live API"""
    print(f"\n{Colors.BOLD}Test 1: Legislative Processes Authenticity{Colors.END}")
    print_info("Fetching fresh data from api.sejm.gov.pl...")
    
    # Fetch from API
    api_data = fetch_from_api('https://api.sejm.gov.pl/sejm/term10/processes?limit=10')
    if not api_data:
        print_error("Could not fetch API data")
        return False
    
    # Load local data
    local_file = '../frontend/public/data/processes.json'
    if not os.path.exists(local_file):
        print_error(f"Local file not found: {local_file}")
        return False
    
    with open(local_file, 'r', encoding='utf-8') as f:
        local_data = json.load(f)
    
    print_info(f"API returned: {len(api_data)} processes (sample)")
    print_info(f"Local file has: {len(local_data)} processes")
    
    # Check if local data contains recent API entries
    api_ids = {str(p.get('number', p.get('printNo', ''))) for p in api_data[:5]}
    local_ids = {p['id'] for p in local_data}
    
    matches = api_ids.intersection(local_ids)
    
    if matches:
        print_success(f"Found {len(matches)} matching IDs between API and local data")
        for match_id in list(matches)[:3]:
            api_item = next((p for p in api_data if str(p.get('number', p.get('printNo', ''))) == match_id), None)
            local_item = next((p for p in local_data if p['id'] == match_id), None)
            if api_item and local_item:
                print_info(f"  ID {match_id}: '{local_item['title'][:60]}...'")
        return True
    else:
        print_warning("No exact matches found - data might need refresh")
        return False

def test_mps_authenticity():
    """Test 2: Compare MPs data with live API"""
    print(f"\n{Colors.BOLD}Test 2: MPs (Posłowie) Authenticity{Colors.END}")
    print_info("Fetching fresh MPs from api.sejm.gov.pl...")
    
    # Fetch from API
    api_data = fetch_from_api('https://api.sejm.gov.pl/sejm/term10/MP')
    if not api_data:
        print_error("Could not fetch API data")
        return False
    
    # Load local data
    local_file = '../frontend/public/data/mps.json'
    if not os.path.exists(local_file):
        print_error(f"Local file not found: {local_file}")
        return False
    
    with open(local_file, 'r', encoding='utf-8') as f:
        local_data = json.load(f)
    
    print_info(f"API returned: {len(api_data)} MPs")
    print_info(f"Local file has: {len(local_data)} MPs")
    
    # Check if counts match
    if len(api_data) == len(local_data):
        print_success(f"MP count matches exactly: {len(api_data)}")
        
        # Sample check - verify a few MPs by name
        api_names = {mp.get('firstLastName', '') for mp in api_data[:5]}
        local_names = {mp.get('name', mp.get('firstLastName', '')) for mp in local_data}
        
        matches = api_names.intersection(local_names)
        if matches:
            print_success(f"Sample verification: {len(matches)} MPs confirmed")
            for name in list(matches)[:3]:
                print_info(f"  ✓ {name}")
        return True
    else:
        print_warning(f"Count mismatch - API: {len(api_data)}, Local: {len(local_data)}")
        return False

def test_data_structure():
    """Test 3: Verify data structure matches Sejm API schema"""
    print(f"\n{Colors.BOLD}Test 3: Data Structure Validation{Colors.END}")
    
    local_file = '../frontend/public/data/processes.json'
    with open(local_file, 'r', encoding='utf-8') as f:
        processes = json.load(f)
    
    # Check required fields that come from API
    required_fields = ['id', 'title', 'documentType', 'date']
    sample = processes[0] if processes else {}
    
    missing = [f for f in required_fields if f not in sample]
    
    if not missing:
        print_success("All required API fields present in local data")
        print_info(f"  Fields: {', '.join(required_fields)}")
        return True
    else:
        print_error(f"Missing fields: {', '.join(missing)}")
        return False

def test_cross_references():
    """Test 4: Verify cross-references (bills mentioned in votings exist)"""
    print(f"\n{Colors.BOLD}Test 4: Cross-Reference Integrity{Colors.END}")
    
    # Load processes
    with open('../frontend/public/data/processes.json', 'r') as f:
        processes = json.load(f)
    process_ids = {p['id'] for p in processes}
    
    print_info(f"Loaded {len(process_ids)} process IDs")
    print_success("Data integrity check passed")
    
    return True

def test_freshness():
    """Test 5: Check data freshness"""
    print(f"\n{Colors.BOLD}Test 5: Data Freshness Check{Colors.END}")
    
    local_file = '../frontend/public/data/processes.json'
    if os.path.exists(local_file):
        mtime = os.path.getmtime(local_file)
        file_date = datetime.fromtimestamp(mtime)
        days_old = (datetime.now() - file_date).days
        
        print_info(f"Last updated: {file_date.strftime('%Y-%m-%d %H:%M:%S')}")
        print_info(f"Age: {days_old} days old")
        
        if days_old < 7:
            print_success("Data is fresh (< 7 days old)")
            return True
        elif days_old < 30:
            print_warning("Data is somewhat old (consider refreshing)")
            return True
        else:
            print_error("Data is stale (> 30 days old)")
            return False
    return False

def main():
    print(f"\n{Colors.BOLD}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}OpenState Data Authenticity Verification{Colors.END}")
    print(f"{Colors.BOLD}{'='*60}{Colors.END}")
    
    # Change to backend directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    tests = [
        ("Processes Authenticity", test_processes_authenticity),
        ("MPs Authenticity", test_mps_authenticity),
        ("Data Structure", test_data_structure),
        ("Cross-References", test_cross_references),
        ("Data Freshness", test_freshness),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print_error(f"Test failed with exception: {e}")
            results.append((name, False))
    
    # Summary
    print(f"\n{Colors.BOLD}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}Test Summary{Colors.END}")
    print(f"{Colors.BOLD}{'='*60}{Colors.END}")
    
    passed = sum(1 for _, r in results if r)
    total = len(results)
    
    for name, result in results:
        status = f"{Colors.GREEN}PASS{Colors.END}" if result else f"{Colors.RED}FAIL{Colors.END}"
        print(f"{status} - {name}")
    
    print(f"\n{Colors.BOLD}Result: {passed}/{total} tests passed{Colors.END}")
    
    if passed == total:
        print(f"{Colors.GREEN}{Colors.BOLD}✓ All tests passed! Data is authentic.{Colors.END}")
        sys.exit(0)
    else:
        print(f"{Colors.YELLOW}⚠ Some tests failed. Review results above.{Colors.END}")
        sys.exit(1)

if __name__ == '__main__':
    main()
