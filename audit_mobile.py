from playwright.sync_api import sync_playwright

BASE = "https://8080-ixo5trkkfkmguw9ld5n6u-d9760974.sg1.manus.computer"
PAGES = [
    ("index.html", "mobile_home"),
    ("cars.html", "mobile_cars"),
    ("listing.html?id=kia-sportage-2026", "mobile_listing"),
    ("place-ad.html", "mobile_place_ad"),
    ("login.html", "mobile_login"),
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    for path, name in PAGES:
        page = browser.new_page(
            viewport={"width": 390, "height": 844},
            device_scale_factor=2,
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
        )
        page.goto(f"{BASE}/{path}", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(2000)
        page.screenshot(path=f"/home/ubuntu/dubimotors_site/{name}.png", full_page=True)
        print(f"Captured {name}")
        page.close()
    browser.close()
    print("Done")
