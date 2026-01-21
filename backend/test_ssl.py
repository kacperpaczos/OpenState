import urllib.request
import ssl
import sys

URL = 'https://api.sejm.gov.pl/sejm/term10/processes?limit=1'

try:
    print(f"Attempting to fetch {URL} with default SSL context...")
    # Default context verifies certificates
    with urllib.request.urlopen(URL, timeout=10) as response:
        print(f"Success! Status: {response.status}")
        print(response.read().decode()[:100])
except Exception as e:
    print(f"SSL Verification Failed: {e}")
    sys.exit(1)
