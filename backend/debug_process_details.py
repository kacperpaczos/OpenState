import json
import urllib.request
import ssl

# Disable SSL verification
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# 1. Fetch list to get a valid UEID for a bill
URL_LIST = 'https://api.sejm.gov.pl/sejm/term10/processes?limit=10'
print(f"Fetching list from {URL_LIST}...")
with urllib.request.urlopen(URL_LIST, context=ctx) as response:
    data = json.loads(response.read().decode())

# Find a 'projekt ustawy'
bill = next((item for item in data if item.get('documentType') == 'projekt ustawy'), None)

if not bill:
    print("No bill found in first 10 items. Trying to fetch more...")
    URL_LIST = 'https://api.sejm.gov.pl/sejm/term10/processes?limit=100'
    with urllib.request.urlopen(URL_LIST, context=ctx) as response:
        data = json.loads(response.read().decode())
    bill = next((item for item in data if item.get('documentType') == 'projekt ustawy'), None)

if bill:
    ueid = bill.get('UEID') or bill.get('number')
    print(f"\nFound Bill: {bill.get('title')}")
    print(f"ID: {ueid}")
    
    # 2. Fetch details for this specific process
    # Note: API endpoint for details might be /processes/{UEID}
    URL_DETAILS = f'https://api.sejm.gov.pl/sejm/term10/processes/{ueid}'
    print(f"Fetching details from {URL_DETAILS}...")
    
    try:
        with urllib.request.urlopen(URL_DETAILS, context=ctx) as response:
            details = json.loads(response.read().decode())
        
        print("\n--- PROCESS DETAILS ---\n")
        print(json.dumps(details, indent=2, ensure_ascii=False))
        
        # Check specifically for stages that might indicate printing/submission
        # Often the 'prints' field in details has info, or the 'stages'.
        
    except Exception as e:
        print(f"Error fetching details: {e}")

else:
    print("Could not find any 'projekt ustawy' to inspect.")
