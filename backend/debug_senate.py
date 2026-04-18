from playwright.sync_api import sync_playwright

def dump_senate():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        print("Navigating...")
        page.goto("https://www.senat.gov.pl/sklad/senatorowie/", wait_until="domcontentloaded")
        page.wait_for_timeout(5000)
        content = page.content()
        with open("senate_dump.html", "w") as f:
            f.write(content)
        print("Dumped to senate_dump.html")
        browser.close()

if __name__ == "__main__":
    dump_senate()
