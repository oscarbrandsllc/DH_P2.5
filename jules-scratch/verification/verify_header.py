from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Navigate to the local server
        page.goto("http://localhost:8000/rosters/rosters.html")

        # Wait for the page to load and the username input to be visible
        username_input = page.locator("#usernameInput")
        expect(username_input).to_be_visible()
        username_input.fill("The_Oracle")

        # Trigger league loading by clicking a nav button (simulating user flow)
        nav_rosters = page.locator("#nav-rosters")
        nav_rosters.click()

        # Wait for the league dropdown to be populated
        league_select = page.locator("#leagueSelect")
        # Use wait_for_function to poll the number of options, which is more reliable
        page.wait_for_function("() => document.querySelectorAll('#leagueSelect option').length > 1", timeout=20000)

        # Get all league options except the placeholder
        options = league_select.locator("option").all()
        if len(options) > 1:
            league_select.select_option(index=1)

        # Wait for the roster grid to be populated to ensure the page is fully loaded
        expect(page.locator("#rosterGrid .player-row").first).to_be_visible(timeout=20000)
        page.wait_for_timeout(1000) # Allow for any final rendering

        # --- Mobile Verification ---
        page.set_viewport_size({"width": 375, "height": 812})
        page.wait_for_timeout(500) # Wait for resize
        page.screenshot(path="jules-scratch/verification/verification_mobile.png")

        # --- Desktop Verification ---
        page.set_viewport_size({"width": 1280, "height": 800})
        page.wait_for_timeout(500) # Wait for resize
        page.screenshot(path="jules-scratch/verification/verification_desktop.png")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error_screenshot.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)